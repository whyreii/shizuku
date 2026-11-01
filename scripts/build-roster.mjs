/**
 * P19 — full roster capture with images resolved at build time.
 *
 * Output:
 *   public/roster-extra.json   tuples: [id, name, series, rank, imageUrl|null]
 *   public/roster-images.json  map: "name|series" -> imageUrl  (hand-ranked 1,000)
 *
 * Rules: every character in every series (no cap), no favourites floor, extras
 * ordered by AniList favourites. Resumable via scripts/.roster-cache-full.json.
 */
import { readFile, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";

const ENDPOINT = "https://graphql.anilist.co";
const SERIES_TARGET = Number(process.env.SERIES_TARGET ?? 600);
const DELAY_MS = 720;

const root = path.resolve(import.meta.dirname, "..");
const outFile = path.join(root, "public", "roster-extra.json");
const imageMapFile = path.join(root, "public", "roster-images.json");
const cacheFile = path.join(root, "scripts", ".roster-cache-full.json");

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function gql(query, variables) {
  for (let attempt = 0; attempt < 5; attempt += 1) {
    const res = await fetch(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ query, variables }),
    });
    if (res.status === 429) {
      console.log("  rate limited, waiting 60s");
      await sleep(60_000);
      continue;
    }
    if (!res.ok) throw new Error(`AniList ${res.status}`);
    const json = await res.json();
    if (json.errors) throw new Error(json.errors.map((e) => e.message).join("; "));
    return json.data;
  }
  throw new Error("AniList failed after retries");
}

const normalise = (value) =>
  value.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();

const similar = (a, b) => {
  const na = normalise(a);
  const nb = normalise(b);
  return na === nb || na.includes(nb) || nb.includes(na);
};

async function loadHandList() {
  const entries = [];
  for (const file of ["roster-1.ts", "roster-2.ts", "roster-3.ts"]) {
    const raw = await readFile(path.join(root, "src", "engine", file), "utf8");
    for (const line of raw.split(/\r?\n/)) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("//") || trimmed.startsWith("*")) continue;
      const parts = trimmed.split("|");
      if (parts.length < 2) continue;
      const name = parts[0].trim();
      if (!name || name.includes("=") || name.length > 60) continue;
      entries.push({ name, series: parts[1].trim() });
    }
  }
  return entries;
}

async function loadCache() {
  if (!existsSync(cacheFile)) return { media: [], characters: {}, done: [] };
  return JSON.parse(await readFile(cacheFile, "utf8"));
}

const saveCache = (cache) => writeFile(cacheFile, JSON.stringify(cache));

async function fetchSeries() {
  const query = `query($page:Int,$perPage:Int){
    Page(page:$page, perPage:$perPage){
      media(sort:POPULARITY_DESC, type:ANIME, isAdult:false){
        id
        title { romaji english }
      }
    }
  }`;
  const media = [];
  for (let page = 1; media.length < SERIES_TARGET; page += 1) {
    const data = await gql(query, { page, perPage: 50 });
    const batch = data.Page.media;
    if (!batch.length) break;
    media.push(...batch);
    await sleep(DELAY_MS);
  }
  return media.slice(0, SERIES_TARGET);
}

async function fetchAllCharacters(mediaId) {
  const query = `query($id:Int,$page:Int){
    Media(id:$id, type:ANIME){
      id
      title { romaji english }
      characters(page:$page, perPage:25, sort:[FAVOURITES_DESC]){
        pageInfo { hasNextPage }
        nodes { id name { full } favourites image { large } }
      }
    }
  }`;
  const nodes = [];
  let page = 1;
  let hasNext = true;
  while (hasNext) {
    const data = await gql(query, { id: mediaId, page });
    const block = data.Media.characters;
    nodes.push(...block.nodes);
    hasNext = block.pageInfo.hasNextPage;
    page += 1;
    if (hasNext) await sleep(DELAY_MS);
  }
  return nodes;
}

async function resolveHandImage(name, series) {
  const query = `query($s:String){Page(perPage:8){characters(search:$s){
    id name{full} image{large}
    media(perPage:6){nodes{title{romaji english}}}
  }}}`;
  try {
    const data = await gql(query, { s: name });
    const hits = data?.Page?.characters ?? [];
    const exact = normalise(name);
    const named = hits.filter((hit) => normalise(hit.name.full) === exact);
    const pool = named.length ? named : hits;
    const bySeries = pool.find((hit) =>
      (hit.media?.nodes ?? []).some((node) =>
        [node.title.romaji, node.title.english ?? ""].some(
          (title) => title && similar(title, series),
        ),
      ),
    );
    if (bySeries) return bySeries.image?.large ?? null;
    // Ambiguous name and no series match: refuse rather than put a stranger's
    // face on the card. Only an unambiguous single candidate is accepted.
    const distinct = new Set(pool.map((hit) => hit.image?.large).filter(Boolean));
    if (distinct.size !== 1) return null;
    return [...distinct][0];
  } catch {
    return null;
  }
}

async function main() {
  const hand = await loadHandList();
  console.log(`hand-ranked entries: ${hand.length}`);

  const cache = await loadCache();

  if (cache.media.length === 0) {
    console.log("fetching series by popularity…");
    cache.media = await fetchSeries();
    await saveCache(cache);
  }
  console.log(`series: ${cache.media.length}`);

  let processed = 0;
  for (const entry of cache.media) {
    if (cache.done.includes(entry.id)) continue;
    const title = entry.title.english || entry.title.romaji;
    try {
      const nodes = await fetchAllCharacters(entry.id);
      cache.characters[entry.id] = {
        series: title,
        nodes: nodes.map((node) => ({
          id: node.id,
          name: node.name.full,
          favourites: node.favourites ?? 0,
          image: node.image?.large ?? null,
          series: title,
        })),
      };
      cache.done.push(entry.id);
      processed += 1;
      if (processed % 10 === 0) {
        await saveCache(cache);
        console.log(`  ${cache.done.length}/${cache.media.length} series`);
      }
    } catch (error) {
      console.log(`  skipped ${title}: ${error.message}`);
    }
    await sleep(DELAY_MS);
  }
  await saveCache(cache);

  console.log("resolving hand-ranked portraits…");
  const imageMap = {};
  const handNames = hand.map((entry) => `${entry.name}|${entry.series}`);
  for (let i = 0; i < hand.length; i += 1) {
    const entry = hand[i];
    const url = await resolveHandImage(entry.name, entry.series);
    if (url) imageMap[handNames[i]] = url;
    if ((i + 1) % 50 === 0) {
      console.log(`  ${i + 1}/${hand.length}`);
      await writeFile(imageMapFile, JSON.stringify(imageMap));
    }
    await sleep(DELAY_MS);
  }
  await writeFile(imageMapFile, JSON.stringify(imageMap));
  console.log(`hand portraits resolved: ${Object.keys(imageMap).length}/${hand.length}`);

  console.log("merging extras…");
  const handSet = new Set(hand.map((entry) => normalise(entry.name)));
  const seen = new Set();
  const extra = [];

  for (const entry of cache.media) {
    const block = cache.characters[entry.id];
    if (!block) continue;
    for (const node of block.nodes) {
      const key = normalise(node.name);
      if (handSet.has(key) || seen.has(key)) continue;
      seen.add(key);
      extra.push(node);
    }
  }

  extra.sort((a, b) => b.favourites - a.favourites);

  const tuples = extra.map((node, index) => [
    `a${node.id}`,
    node.name,
    node.series || "Unknown",
    1000 + index + 1,
    node.image ?? null,
  ]);

  await writeFile(outFile, JSON.stringify(tuples));
  console.log(`wrote ${tuples.length} extras → ${outFile}`);
  console.log(`total pool: ${1000 + tuples.length}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

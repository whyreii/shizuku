/**
 * Fills the ranked portraits P19 missed - they were rate-limit casualties, not
 * missing characters. Resolves only the gaps and merges into the existing map.
 */
import { readFile, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";

const ENDPOINT = "https://graphql.anilist.co";
const DELAY_MS = 900;
const MAP = path.join(process.cwd(), "public", "roster-images.json");
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const norm = (v) => v.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
const tokens = (v) => new Set(norm(v).split(" ").filter((t) => t.length > 1));
const STOP = new Set(["the","a","an","of","in","no","to","wa","ga","san","season","part","series","movie","ova"]);

function seriesScore(a, b) {
  const x = norm(a), y = norm(b);
  if (!x || !y) return 0;
  if (x === y) return 1;
  if (x.includes(y) || y.includes(x)) return 0.9;
  const A = [...tokens(a)].filter((t) => !STOP.has(t));
  const B = [...tokens(b)].filter((t) => !STOP.has(t));
  if (!A.length || !B.length) return 0;
  let shared = 0;
  for (const t of A) if (B.includes(t)) shared += 1;
  return shared / Math.min(A.length, B.length);
}

async function gql(query, variables) {
  for (let attempt = 0; attempt < 6; attempt += 1) {
    const res = await fetch(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ query, variables }),
    });
    if (res.status === 429) { console.log("  rate limited, waiting 60s"); await sleep(60_000); continue; }
    if (!res.ok) throw new Error("AniList " + res.status);
    const json = await res.json();
    if (json.errors) throw new Error(json.errors.map((e) => e.message).join("; "));
    return json.data;
  }
  throw new Error("failed after retries");
}

async function resolve(name, series) {
  const q = `query($s:String){Page(perPage:10){characters(search:$s){
    id name{full} image{large}
    media(perPage:6){nodes{title{romaji english}}}
  }}}`;
  const data = await gql(q, { s: name });
  const hits = data?.Page?.characters ?? [];
  if (!hits.length) return null;
  const exact = norm(name);
  const named = hits.filter((h) => norm(h.name.full) === exact);
  const pool = named.length ? named : hits;
  let best = null;
  let bestScore = 0;
  for (const hit of pool) {
    for (const node of hit.media?.nodes ?? []) {
      for (const title of [node.title?.romaji, node.title?.english]) {
        if (!title) continue;
        const score = seriesScore(title, series);
        if (score > bestScore && hit.image?.large) { best = hit; bestScore = score; }
      }
    }
  }
  if (best && bestScore >= 0.5) return best.image.large;
  const distinct = new Set(pool.map((h) => h.image?.large).filter(Boolean));
  if (distinct.size === 1) return [...distinct][0];
  return null;
}

const roster = [];
for (const f of ["roster-1.ts", "roster-2.ts", "roster-3.ts"]) {
  const text = await readFile(path.join("src", "engine", f), "utf8");
  for (const line of text.split(/\r?\n/)) {
    const t = line.trim();
    if (!t || t.startsWith("//") || t.startsWith("*") || t.startsWith("/*") || t.startsWith("export") || t.startsWith("`")) continue;
    const parts = t.split("|");
    if (parts.length < 2) continue;
    const name = parts[0].trim();
    if (!name) continue;
    roster.push({ name, series: parts[1].trim() || "Unknown" });
  }
}

const map = existsSync(MAP) ? JSON.parse(await readFile(MAP, "utf8")) : {};
const missing = roster.filter((c) => !map[`${c.name}|${c.series}`]);
console.log(`ranked ${roster.length} | mapped ${Object.keys(map).length} | missing ${missing.length}`);

let filled = 0;
for (let i = 0; i < missing.length; i += 1) {
  const { name, series } = missing[i];
  try {
    const url = await resolve(name, series);
    if (url) { map[`${name}|${series}`] = url; filled += 1; }
  } catch (e) {
    console.log("  skipped", name, "-", String(e).slice(0, 50));
  }
  if ((i + 1) % 25 === 0) {
    await writeFile(MAP, JSON.stringify(map));
    console.log(`  ${i + 1}/${missing.length} | recovered ${filled}`);
  }
  await sleep(DELAY_MS);
}
await writeFile(MAP, JSON.stringify(map));
console.log(`done: recovered ${filled}/${missing.length} | map now ${Object.keys(map).length}`);
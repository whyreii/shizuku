/** Second pass: name variants. Strips parentheticals, then falls back to a
 *  prefix match on the highest-favourited candidate. Memes stay unmatched. */
import { readFile, writeFile } from "node:fs/promises";
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
    if (res.status === 429) { await sleep(60_000); continue; }
    if (!res.ok) throw new Error("AniList " + res.status);
    const json = await res.json();
    if (json.errors) throw new Error(json.errors.map((e) => e.message).join("; "));
    return json.data;
  }
  throw new Error("failed after retries");
}

async function resolve(name, series) {
  const base = name.replace(/\s*\([^)]*\)\s*$/, "").trim() || name;
  const q = `query($s:String){Page(perPage:12){characters(search:$s){
    id name{full} favourites image{large}
    media(perPage:6){nodes{title{romaji english}}}
  }}}`;
  const data = await gql(q, { s: base });
  const hits = data?.Page?.characters ?? [];
  if (!hits.length) return null;

  const best = (pool) =>
    pool
      .filter((h) => h.image?.large)
      .sort((a, b) => (b.favourites ?? 0) - (a.favourites ?? 0))[0] ?? null;

  // 1. exact name, series corroborated
  const exact = hits.filter((h) => norm(h.name.full) === norm(base));
  for (const hit of exact) {
    const score = Math.max(0, ...(hit.media?.nodes ?? []).flatMap((n) =>
      [n.title?.romaji, n.title?.english].filter(Boolean).map((t) => seriesScore(t, series))));
    if (score >= 0.5) return hit.image.large;
  }
  // 2. exact name, unambiguous
  const distinct = new Set(exact.map((h) => h.image?.large).filter(Boolean));
  if (distinct.size === 1) return [...distinct][0];
  // 3. exact name, several candidates: most favourited is almost always the one meant
  if (exact.length > 1) {
    const pick = best(exact);
    if (pick && (pick.favourites ?? 0) >= 2000) return pick.image.large;
  }
  // 4. translated spelling: candidate starts with the same lead tokens
  const lead = norm(base).split(" ").slice(0, 2).join(" ");
  if (lead.length >= 4) {
    const prefixed = hits.filter((h) => norm(h.name.full).startsWith(lead));
    const pick = best(prefixed);
    if (pick && (pick.favourites ?? 0) >= 5000) return pick.image.large;
  }
  return null;
}

const roster = [];
for (const f of ["roster-1.ts", "roster-2.ts", "roster-3.ts"]) {
  const text = await readFile(path.join("src/engine", f), "utf8");
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

const map = JSON.parse(await readFile(MAP, "utf8"));
const missing = roster.filter((c) => !map[`${c.name}|${c.series}`]);
console.log("still missing:", missing.length);

let filled = 0;
for (let i = 0; i < missing.length; i += 1) {
  const { name, series } = missing[i];
  try {
    const url = await resolve(name, series);
    if (url) { map[`${name}|${series}`] = url; filled += 1; }
  } catch (e) {
    console.log("  skipped", name, "-", String(e).slice(0, 40));
  }
  if ((i + 1) % 25 === 0) {
    await writeFile(MAP, JSON.stringify(map));
    console.log(`  ${i + 1}/${missing.length} | recovered ${filled}`);
  }
  await sleep(DELAY_MS);
}
await writeFile(MAP, JSON.stringify(map));
console.log(`done: recovered ${filled}/${missing.length} | map now ${Object.keys(map).length}/1000`);
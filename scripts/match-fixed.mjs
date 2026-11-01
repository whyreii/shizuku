import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const norm = (v) => v.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
const sim = (a, b) => { const x = norm(a), y = norm(b); return x === y || x.includes(y) || y.includes(x); };

// Parse the exported template strings exactly: skip the file's own header
// comments, which contain "|" and would otherwise inject fake entries.
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
    roster.push({ rank: roster.length + 1, name, series: parts[1].trim() || "Unknown" });
  }
}
console.log("parsed ranks:", roster.length, "| rank 3 =", roster[2].name, "| rank 401 =", roster[400]?.name);
if (roster.length !== 1000) { console.log("!! count mismatch"); process.exit(1); }

const cache = JSON.parse(await readFile("scripts/.roster-cache-full.json", "utf8"));
const byName = new Map();
for (const block of Object.values(cache.characters)) {
  for (const n of block.nodes) {
    if (!n.image) continue;
    const key = norm(n.name);
    if (!byName.has(key)) byName.set(key, []);
    byName.get(key).push({ image: n.image, series: block.series });
  }
}

/** Only accept a portrait we can justify. Ambiguity -> no image, never a guess. */
function resolve(name, series) {
  const cands = byName.get(norm(name)) ?? [];
  const distinct = [...new Map(cands.map((c) => [c.image, c])).values()];
  if (distinct.length === 1) return distinct[0].image;
  const bySeries = distinct.filter((c) => sim(c.series, series));
  if (bySeries.length === 1) return bySeries[0].image;
  return null;
}

const bands = [[1,10],[11,20],[21,30],[31,40],[41,50],[51,100],[101,200],[201,400],[401,700],[701,1000]];
const picks = [];
for (const [lo, hi] of bands) {
  let found = 0;
  for (let rank = lo; rank <= hi && found < 2; rank += 1) {
    const c = roster[rank - 1];
    const image = resolve(c.name, c.series);
    if (!image) continue;
    picks.push({ rank, name: c.name, series: c.series, image });
    found += 1;
  }
}
picks.sort((a, b) => a.rank - b.rank);
await writeFile("scripts/.preview-matched.json", JSON.stringify(picks, null, 1));
for (const p of picks) console.log(String(p.rank).padStart(4), p.name.padEnd(24), "|", p.series);
console.log("total:", picks.length);
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const norm = (v) => v.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
const sim = (a, b) => { const x = norm(a), y = norm(b); return x === y || x.includes(y) || y.includes(x); };

const hand = [];
for (const f of ["roster-1.ts", "roster-2.ts", "roster-3.ts"]) {
  const raw = await readFile(path.join(root, "src", "engine", f), "utf8");
  for (const line of raw.split(/\r?\n/)) {
    const t = line.trim();
    if (!t || t.startsWith("//") || t.startsWith("*")) continue;
    const parts = t.split("|");
    if (parts.length < 2) continue;
    const name = parts[0].trim();
    if (!name || name.includes("=") || name.length > 60) continue;
    hand.push({ name, series: parts[1].trim() });
  }
}

const cache = JSON.parse(await readFile("scripts/.roster-cache-full.json", "utf8"));
const pool = [];
for (const block of Object.values(cache.characters)) {
  for (const n of block.nodes) if (n.image) pool.push({ name: n.name, series: block.series, image: n.image });
}
const lookup = (entry) => {
  const byName = pool.filter((p) => norm(p.name) === norm(entry.name));
  const pick = byName.find((p) => sim(p.series, entry.series)) ?? byName[0];
  return pick ? pick.image : null;
};

// two per rarity band, so the album shows the whole ladder
const bands = [[1, 10], [11, 20], [21, 30], [31, 40], [41, 50], [51, 100], [101, 200], [201, 400], [401, 700], [701, 1000]];
const out = [];
for (const [lo, hi] of bands) {
  let found = 0;
  for (let rank = lo; rank <= hi && found < 2; rank += 1) {
    const entry = hand[rank - 1];
    if (!entry) continue;
    const image = lookup(entry);
    if (!image) continue;
    out.push({ rank, name: entry.name, series: entry.series, image });
    found += 1;
  }
}
out.sort((a, b) => a.rank - b.rank);
await writeFile("scripts/.preview-matched.json", JSON.stringify(out, null, 1));
for (const o of out) console.log(String(o.rank).padStart(4), o.name, "|", o.series);
console.log("total:", out.length);
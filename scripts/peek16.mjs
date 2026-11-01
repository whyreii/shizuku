import { readFile, writeFile } from "node:fs/promises";
const cache = JSON.parse(await readFile("scripts/.roster-cache-full.json", "utf8"));
const seen = new Set();
const rows = [];
for (const block of Object.values(cache.characters)) {
  for (const n of block.nodes) {
    if (!n.image || seen.has(n.image)) continue;
    if (n.favourites < 800) continue;
    seen.add(n.image);
    rows.push([n.name, block.series, n.image]);
  }
}
// spread across the popularity range so the shelf is not all top-10 giants
rows.sort((a, b) => a[0].localeCompare(b[0]));
const picks = [];
const step = Math.max(1, Math.floor(rows.length / 20));
for (let i = 0; i < rows.length && picks.length < 20; i += step) picks.push(rows[i]);
await writeFile("scripts/.preview-16.json", JSON.stringify(picks, null, 0));
for (const p of picks) console.log(p[0], "|", p[1]);
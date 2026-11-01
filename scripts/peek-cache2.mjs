import { readFile, writeFile } from "node:fs/promises";
const cache = JSON.parse(await readFile("scripts/.roster-cache-full.json", "utf8"));
const seen = new Set();
const picks = [];
for (const block of Object.values(cache.characters)) {
  for (const n of block.nodes) {
    if (!n.image || seen.has(n.image)) continue;
    if (n.favourites < 1500) continue;
    seen.add(n.image);
    picks.push({ name: n.name, series: block.series, img: n.image, fav: n.favourites });
  }
}
picks.sort((a, b) => b.fav - a.fav);
const top = picks.slice(0, 16);
await writeFile("scripts/.preview-picks.json", JSON.stringify(top, null, 1));
console.log("unique:", picks.length);
for (const p of top) console.log(String(p.fav).padStart(6), p.name, "|", p.series);
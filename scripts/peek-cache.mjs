import { readFile } from "node:fs/promises";
const cache = JSON.parse(await readFile("scripts/.roster-cache-full.json", "utf8"));
const picks = [];
for (const [id, block] of Object.entries(cache.characters)) {
  for (const n of block.nodes) {
    if (!n.image) continue;
    if (n.favourites < 3000) continue;
    picks.push({ name: n.name, series: block.series, img: n.image, fav: n.favourites });
  }
}
picks.sort((a, b) => b.fav - a.fav);
console.log("total with images:", picks.length);
console.log(JSON.stringify(picks.slice(0, 14), null, 1));
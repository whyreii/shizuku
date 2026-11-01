import { readFile } from "node:fs/promises";
const cache = JSON.parse(await readFile("scripts/.roster-cache-full.json", "utf8"));
const hits = [];
for (const block of Object.values(cache.characters)) {
  for (const n of block.nodes) {
    if (/sakurajima/i.test(n.name)) hits.push({ name: n.name, series: block.series, img: n.image, fav: n.favourites });
  }
}
console.log("cache hits:", hits.length);
console.log(JSON.stringify(hits.slice(0, 4), null, 1));
const seriesHit = Object.values(cache.characters).filter(b => /seishun|bunny girl/i.test(b.series));
console.log("series in cache:", seriesHit.map(b => b.series + " (" + b.nodes.length + ")"));
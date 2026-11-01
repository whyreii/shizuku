import { readFile } from "node:fs/promises";
const cache = JSON.parse(await readFile("scripts/.roster-cache-full.json", "utf8"));
const out = [];
for (const block of Object.values(cache.characters)) {
  for (const n of block.nodes) {
    if (n.name.toLowerCase() === "rem") out.push({ series: block.series, img: n.image, fav: n.favourites });
  }
}
console.log("characters named exactly 'Rem' in the cache:", out.length);
for (const o of out) console.log("  ", o.series.padEnd(52), String(o.fav).padStart(6), o.img.split("/").pop());
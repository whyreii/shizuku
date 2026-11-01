import { readFile } from "node:fs/promises";
const cache = JSON.parse(await readFile("scripts/.roster-cache-full.json", "utf8"));
const groups = new Map();
for (const block of Object.values(cache.characters)) {
  for (const n of block.nodes) {
    if (!n.image) continue;
    const key = n.name.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
    if (!groups.has(key)) groups.set(key, new Map());
    groups.get(key).set(n.image, block.series);
  }
}
const dupes = [...groups.entries()].filter(([, m]) => m.size > 1);
console.log("names shared by >1 distinct character:", dupes.length);
for (const [name, m] of dupes.slice(0, 12)) {
  console.log(" ", name, "->", [...m.values()].slice(0, 4).join(" | "));
}
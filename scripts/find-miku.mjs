import { readFile } from "node:fs/promises";
const cache = JSON.parse(await readFile("scripts/.roster-cache-full.json", "utf8"));
for (const block of Object.values(cache.characters))
  for (const n of block.nodes)
    if (/^(hatsune miku|miku hatsune)$/i.test(n.name))
      console.log(n.name, "|", block.series, "|", String(n.favourites).padStart(6), "|", n.image?.split("/").pop());
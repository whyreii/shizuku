import { readFile } from "node:fs/promises";
const cache = JSON.parse(await readFile("scripts/.roster-cache-full.json", "utf8"));
const byImage = new Map();
for (const block of Object.values(cache.characters)) {
  for (const n of block.nodes) if (n.image && !byImage.has(n.image)) byImage.set(n.image, { name: n.name, series: block.series });
}
const picks = JSON.parse(await readFile("scripts/.preview-matched.json", "utf8"));
let bad = 0;
for (const p of picks) {
  const owner = byImage.get(p.image);
  const same = owner && owner.name.toLowerCase() === p.name.toLowerCase();
  if (!same) bad += 1;
  console.log((same ? "ok  " : "MISM"), String(p.rank).padStart(4), p.name.padEnd(26), "->", owner ? owner.name + " / " + owner.series : "UNKNOWN");
}
console.log("\nmismatches:", bad, "/", picks.length);
import { readFile } from "node:fs/promises";
const cache = JSON.parse(await readFile("scripts/.roster-cache-full.json", "utf8"));
const owner = new Map();
for (const block of Object.values(cache.characters)) {
  for (const n of block.nodes) if (n.image && !owner.has(n.image)) owner.set(n.image, { name: n.name, series: block.series });
}
const picks = JSON.parse(await readFile("scripts/.preview-matched.json", "utf8"));
picks.push({ rank: 10, name: "Mai Sakurajima", image: "https://s4.anilist.co/file/anilistcdn/character/large/b127222-Jh5hhP7vZ7s1.png" });
picks.sort((a, b) => a.rank - b.rank);
let bad = 0;
for (const p of picks) {
  const o = owner.get(p.image);
  const ok = o && o.name.toLowerCase() === p.name.toLowerCase();
  if (!ok) bad += 1;
  console.log((ok ? "ok  " : "BAD "), String(p.rank).padStart(4), p.name.padEnd(22), "->", o ? o.name + " / " + o.series : "?");
}
console.log("\nwrong images:", bad, "/", picks.length);
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
const norm = (v) => v.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
const tokens = (v) => new Set(norm(v).split(" ").filter(Boolean));
const STOP = new Set(["the","a","an","of","in","no","to","wa","ga","san","season","part","series","movie","ova"]);
function seriesScore(a, b) {
  const x = norm(a), y = norm(b);
  if (!x || !y) return 0;
  if (x === y) return 1;
  if (x.includes(y) || y.includes(x)) return 0.9;
  const A = [...tokens(a)].filter(t => !STOP.has(t) && t.length > 1);
  const B = [...tokens(b)].filter(t => !STOP.has(t) && t.length > 1);
  if (!A.length || !B.length) return 0;
  let shared = 0;
  for (const t of A) if (B.includes(t)) shared += 1;
  return shared / Math.min(A.length, B.length);
}

const roster = [];
for (const f of ["roster-1.ts","roster-2.ts","roster-3.ts"]) {
  const text = await readFile(path.join("src","engine",f), "utf8");
  for (const line of text.split(/\r?\n/)) {
    const t = line.trim();
    if (!t || t.startsWith("//") || t.startsWith("*") || t.startsWith("/*") || t.startsWith("export") || t.startsWith("`")) continue;
    const parts = t.split("|");
    if (parts.length < 2) continue;
    const name = parts[0].trim();
    if (!name) continue;
    roster.push({ rank: roster.length + 1, name, series: parts[1].trim() || "Unknown" });
  }
}
const cache = JSON.parse(await readFile("scripts/.roster-cache-full.json", "utf8"));
const byName = new Map();
for (const block of Object.values(cache.characters))
  for (const n of block.nodes) {
    if (!n.image) continue;
    const k = norm(n.name);
    if (!byName.has(k)) byName.set(k, []);
    byName.get(k).push({ image: n.image, series: block.series });
  }

const acceptable = [];
for (const c of roster) {
  const cands = byName.get(norm(c.name));
  if (!cands) continue;
  const best = cands.map(x => ({ ...x, score: seriesScore(x.series, c.series) })).sort((a,b) => b.score - a.score);
  if (best[0].score >= 0.5) acceptable.push({ ...c, image: best[0].image, score: Math.round(best[0].score * 100) / 100, cacheSeries: best[0].series });
}
console.log("hand-ranked with a confident portrait:", acceptable.length, "/ 1000");
const bands = [[1,10],[11,20],[21,30],[31,40],[41,50],[51,100],[101,200],[201,400],[401,700],[701,1000]];
const picks = [];
for (const [lo, hi] of bands) {
  let found = 0;
  for (const c of acceptable) {
    if (c.rank < lo || c.rank > hi || found >= 2) continue;
    picks.push(c); found += 1;
  }
}
picks.push({ rank: 10, name: "Mai Sakurajima", series: "Seishun Buta Yarou", image: "https://s4.anilist.co/file/anilistcdn/character/large/b127222-Jh5hhP7vZ7s1.png", score: 1 });
picks.sort((a,b) => a.rank - b.rank);
for (const p of picks) console.log(String(p.rank).padStart(4), p.name.padEnd(24), "|", p.series, "  ~", p.cacheSeries, p.score);
await writeFile("scripts/.preview-matched.json", JSON.stringify(picks.map(({rank,name,series,image}) => ({rank,name,series,image})), null, 1));
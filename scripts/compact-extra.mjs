/** Rewrites roster-extra.json into the compact v2 shape: shared image prefix,
 *  deduplicated series table, character tuples. */
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const PREFIX = "https://s4.anilist.co/file/anilistcdn/character/large/";
const file = path.join(process.cwd(), "public", "roster-extra.json");
const raw = JSON.parse(await readFile(file, "utf8"));

if (!Array.isArray(raw)) {
  console.log("already compact, nothing to do");
  process.exit(0);
}

const seriesIndex = new Map();
const series = [];
const characters = [];

for (const entry of raw) {
  const [id, name, seriesName, rank, image] = entry;
  const s = seriesName || "Unknown";
  if (!seriesIndex.has(s)) {
    seriesIndex.set(s, series.length);
    series.push(s);
  }
  const suffix = image && image.startsWith(PREFIX) ? image.slice(PREFIX.length) : image ?? "";
  characters.push([id, name, seriesIndex.get(s), rank, suffix]);
}

const out = { v: 2, prefix: PREFIX, series, characters };
const json = JSON.stringify(out);
await writeFile(file, json);
console.log("series:", series.length, "| characters:", characters.length);
console.log("size:", (json.length / 1024 / 1024).toFixed(2), "MB (was", (JSON.stringify(raw).length / 1024 / 1024).toFixed(2), "MB)");
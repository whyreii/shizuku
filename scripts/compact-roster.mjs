import { readFile, writeFile } from "node:fs/promises";

const file = "public/roster-extra.json";
const raw = JSON.parse(await readFile(file, "utf8"));

if (!Array.isArray(raw)) throw new Error("unexpected roster shape");

// Compact tuples: [id, name, series, rank]
const compact = raw.map((entry) =>
  Array.isArray(entry)
    ? entry
    : [entry.id, entry.name, entry.series, entry.rank],
);

await writeFile(file, JSON.stringify(compact));
const before = JSON.stringify(raw.map((e) => (Array.isArray(e) ? e : [e.id, e.name, e.series, e.rank])));
console.log(`compact roster: ${compact.length} entries`);

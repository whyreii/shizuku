import { readFile } from "node:fs/promises";
import path from "node:path";

// parse EXACTLY like roster.ts parse(), no extra filters
const raw = [];
for (const f of ["roster-1.ts", "roster-2.ts", "roster-3.ts"]) {
  const text = await readFile(path.join("src", "engine", f), "utf8");
  raw.push(...text.split(/\r?\n/));
}
const roster = [];
for (const line of raw) {
  const t = line.trim();
  if (!t) continue;
  const parts = t.split("|");
  if (parts.length < 2) continue;
  const name = parts[0].trim();
  if (!name) continue;
  roster.push({ rank: roster.length + 1, name, series: parts[1].trim() || "Unknown" });
}
console.log("parsed:", roster.length);
for (const r of [3, 401, 402]) {
  console.log("  rank", r, "=", roster[r - 1].name);
}
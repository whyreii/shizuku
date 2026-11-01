import { readFile } from "node:fs/promises";
const picks = JSON.parse(await readFile("scripts/.preview-16.json", "utf8"));
const lines = picks.map((p, i) => `        ["${p[0].replace(/"/g, "'")}", "${p[1].replace(/"/g, "'")}", ${11 + i * 37}, "${["sp","s","s","s","s","a","a","a","a","a","a","b","b","b","c","d","c","b","a","s"][i]}", ${12000 - i * 540}]`);
console.log(lines.join(",\n"));
console.log("---IMGS---");
console.log(picks.map((p) => `        "${p[2]}"`).join(",\n"));
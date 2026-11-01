import io, sys
sys.stdout.reconfigure(encoding="utf-8")

p = "src/engine/text.ts"
src = '''/**
 * Series names arrive from the source list in mixed states - "DARLING in the
 * FRANXX", "JUJUTSU KAISEN", "Re:Zero kara Hajimeru Isekai Seikatsu". CSS can
 * only shout or whisper, so the casing is resolved here instead: rewrite words
 * that are fully uppercase, leave anything already mixed alone, keep real
 * acronyms, and keep small joining words lowercase.
 */
const KEEP_UPPER = new Set([
  "FRANXX", "FGO", "SAO", "GTO", "DNA", "CG", "AI", "TV", "BD", "OVA", "OP", "ED",
  "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "XI", "XII",
]);

const SMALL = new Set([
  "a", "an", "and", "as", "at", "but", "by", "for", "in", "of", "on", "or", "the",
  "to", "wa", "no", "ga", "de", "la", "le", "vs", "x",
]);

const WORD = /[\\p{L}\\p{N}]/u;
const SEPARATOR = /([^\\p{L}\\p{N}]+)/u;

function fixWord(word: string, first: boolean): string {
  if (word !== word.toUpperCase()) return word; // already mixed case: leave it
  const bare = word.replace(/[^A-Za-z]/g, "");
  if (!bare) return word;
  if (KEEP_UPPER.has(bare)) return word;
  const lower = word.toLowerCase();
  if (!first && SMALL.has(bare.toLowerCase())) return lower;
  return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
}

export function seriesTitle(series: string): string {
  let first = true;
  return series
    .split(SEPARATOR)
    .map((part) => {
      if (!part || !WORD.test(part)) return part;
      const out = fixWord(part, first);
      first = false;
      return out;
    })
    .join("");
}
'''
io.open(p, "w", encoding="utf-8", newline="\n").write(src)

# card renders the formatted name, and the CSS transform goes away
c = "src/components/Card3D.tsx"
t = io.open(c, encoding="utf-8").read()
if 'from "../engine/text"' not in t:
    t = t.replace('import { tierClass, tierForRank } from "../engine/tiers";',
                  'import { tierClass, tierForRank } from "../engine/tiers";\nimport { seriesTitle } from "../engine/text";')
t = t.replace("<div className=\"card-series\">{character.series}</div>",
              "<div className=\"card-series\">{seriesTitle(character.series)}</div>")
io.open(c, "w", encoding="utf-8", newline="\n").write(t)

s = io.open("src/styles.css", encoding="utf-8").read()
s = s.replace("""  font-size: 9px;
  letter-spacing: 0.02em;
  text-transform: lowercase;""", """  font-size: 9px;
  letter-spacing: 0.02em;
  text-transform: none;""")
s = s.replace("""
.card-series::first-letter {
  text-transform: uppercase;
}""", "")
io.open("src/styles.css", "w", encoding="utf-8", newline="\n").write(s)
print("seriesTitle added, transform removed")
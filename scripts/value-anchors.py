import io, sys
sys.stdout.reconfigure(encoding="utf-8")
p = "src/engine/roster.ts"
s = io.open(p, encoding="utf-8").read()

old = """/** Derived display value, used for stats and the collection value readout. */
export function rankValue(rank: number): number {
  const t = 1 - (rank - 1) / Math.max(1, ROSTER.length - 1);
  return Math.round(200 + 4800 * Math.pow(t, 2.2));
}"""
new = """/**
 * Card value, defined by anchor points rather than a formula so the curve can be
 * retuned by editing one line. Interpolated on a log scale, so value falls
 * smoothly between anchors and never plateaus. No ceiling, no floor clamp.
 */
const VALUE_ANCHORS: [number, number][] = [
  [1, 1200],
  [10, 1100],
  [60, 832],
  [100, 707],
  [180, 516],
  [500, 260],
  [1000, 144],
  [6258, 27],
  [17366, 1],
];

export function rankValue(rank: number): number {
  const r = Math.max(1, Math.round(rank));
  if (r <= VALUE_ANCHORS[0][0]) return VALUE_ANCHORS[0][1];
  for (let i = 1; i < VALUE_ANCHORS.length; i += 1) {
    const [fromRank, fromValue] = VALUE_ANCHORS[i - 1];
    const [toRank, toValue] = VALUE_ANCHORS[i];
    if (r <= toRank) {
      const t = (r - fromRank) / (toRank - fromRank);
      const value = fromValue * Math.pow(toValue / fromValue, t);
      return Math.max(1, Math.round(value));
    }
  }
  return VALUE_ANCHORS[VALUE_ANCHORS.length - 1][1];
}"""

if s.count(old) != 1:
    print("MISS rankValue"); sys.exit(1)
s = s.replace(old, new)
io.open(p, "w", encoding="utf-8", newline="\n").write(s)
print("anchor curve applied")
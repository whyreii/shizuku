import io

# ---------- types: characters can carry their portrait --------------------
p = "src/engine/types.ts"
s = io.open(p, encoding="utf-8").read()
s = s.replace(
    "  kakera: number;\n  image?: string;\n}",
    "  kakera: number;\n}",
)
s = s.replace(
    "  series: string;\n  heart: boolean;\n}",
    "  series: string;\n  heart: boolean;\n  /** Portrait URL resolved at build time (extras ship one). */\n  image?: string;\n}",
)
io.open(p, "w", encoding="utf-8", newline="\n").write(s)

# ---------- roster: 5-tuple extras ----------------------------------------
r = "src/engine/roster.ts"
t = io.open(r, encoding="utf-8").read()
t = t.replace(
    "type ExtraTuple = [string, string, string, number];",
    "type ExtraTuple = [string, string, string, number, string | null];",
)
t = t.replace(
    """    for (const entry of extra) {
      const [id, name, series, rank] = entry;
      if (!id || !name) continue;
      ROSTER.push({ id, rank, name, series: series || "Unknown", heart: false });
    }""",
    """    for (const entry of extra) {
      const [id, name, series, rank, image] = entry;
      if (!id || !name) continue;
      ROSTER.push({
        id,
        rank,
        name,
        series: series || "Unknown",
        heart: false,
        image: image ?? undefined,
      });
    }""",
)
io.open(r, "w", encoding="utf-8", newline="\n").write(t)

# ---------- tiers: 40% share rule for extras ------------------------------
g = "src/engine/tiers.ts"
u = io.open(g, encoding="utf-8").read()

u = u.replace(
    """/** Characters added by the AniList expansion sit past rank 1000 at low weight,
 *  which dilutes the top of the ladder and makes mainstream picks rarer. */
export const EXTRA_WEIGHT = 5;""",
    """/** Extras take a fixed share of the pool, so growth never makes top cards
 *  unobtainable. 0.4 = 40% of total weight. */
export const EXTRA_SHARE = 0.4;
export const EXTRA_WEIGHT = 5; // used only for band display of older data""",
)

u = u.replace(
    """export function weightForRank(rank: number): number {
  if (rank > 1000) return EXTRA_WEIGHT;
  return BAND_WEIGHTS[bandIndex(rank)];
}""",
    """function baseWeightTotal(): number {
  let total = 0;
  let start = 1;
  for (let i = 0; i < BAND_EDGES.length; i += 1) {
    const end = Math.min(BAND_EDGES[i], ROSTER_SIZE());
    const count = Math.max(0, end - start + 1);
    total += count * BAND_WEIGHTS[i];
    start = end + 1;
  }
  return total;
}

export function extraWeight(): number {
  const extras = Math.max(0, ROSTER_SIZE() - 1000);
  if (extras === 0) return 0;
  const base = baseWeightTotal();
  return (base * (EXTRA_SHARE / (1 - EXTRA_SHARE))) / extras;
}

export function weightForRank(rank: number): number {
  if (rank > 1000) return extraWeight();
  return BAND_WEIGHTS[bandIndex(rank)];
}""",
)

u = u.replace(
    """export function totalWeight(): number {
  if (cachedTotal > 0) return cachedTotal;
  let total = 0;
  let start = 1;
  for (let i = 0; i < BAND_EDGES.length; i += 1) {
    const end = Math.min(BAND_EDGES[i], ROSTER_SIZE());
    const count = Math.max(0, end - start + 1);
    total += count * BAND_WEIGHTS[i];
    start = end + 1;
  }
  const size = ROSTER_SIZE();
  if (size > 1000) total += (size - 1000) * EXTRA_WEIGHT;
  cachedTotal = total;
  return total;
}""",
    """export function totalWeight(): number {
  if (cachedTotal > 0) return cachedTotal;
  cachedTotal = baseWeightTotal() / (1 - EXTRA_SHARE);
  return cachedTotal;
}""",
)

u = u.replace(
    """  const size = ROSTER_SIZE();
  if (size > 1000) {
    const per = EXTRA_WEIGHT / total;""",
    """  const size = ROSTER_SIZE();
  if (size > 1000) {
    const per = extraWeight() / total;""",
)

io.open(g, "w", encoding="utf-8", newline="\n").write(u)
print("runtime prepared: 5-tuple extras, 40% share weighting")

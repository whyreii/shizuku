import io, sys
sys.stdout.reconfigure(encoding="utf-8")
p = "src/engine/roster.ts"
s = io.open(p, encoding="utf-8").read()

old = """    const extra = (await response.json()) as ExtraTuple[];
    if (!Array.isArray(extra) || extra.length === 0) return;
    for (const entry of extra) {
      const [id, name, series, rank, image] = entry;"""
new = """    const payload = (await response.json()) as unknown;
    const extra = readExtras(payload);
    if (extra.length === 0) return;
    for (const entry of extra) {
      const [id, name, series, rank, image] = entry;"""
if s.count(old) != 1:
    print("MISS loader"); sys.exit(1)
s = s.replace(old, new)

# v2 payload: shared image prefix + deduplicated series table
helper = """
/** v2 compact payload; the legacy flat array is still accepted. */
function readExtras(payload: unknown): ExtraTuple[] {
  if (Array.isArray(payload)) return payload as ExtraTuple[];
  const data = payload as {
    v?: number;
    prefix?: string;
    series?: string[];
    characters?: [string, string, number, number, string][];
  };
  if (!data || data.v !== 2 || !data.characters || !data.series) return [];
  const prefix = data.prefix ?? "";
  return data.characters.map(([id, name, seriesIdx, rank, suffix]) => [
    id,
    name,
    data.series![seriesIdx] ?? "Unknown",
    rank,
    suffix ? prefix + suffix : null,
  ]);
}
"""
s = s.replace("export async function loadExtraRoster(): Promise<void> {", helper + "\nexport async function loadExtraRoster(): Promise<void> {")
io.open(p, "w", encoding="utf-8", newline="\n").write(s)
print("loader handles v2")
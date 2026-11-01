import io

# --- roster.ts: tuples, subscription, non-blocking load --------------------
p = "src/engine/roster.ts"
s = io.open(p, encoding="utf-8").read()

s = s.replace(
    """interface ExtraEntry {
  id: string;
  name: string;
  series: string;
  rank: number;
}

let extraLoaded = false;

/**
 * Extras ship as a static file in /public so they stay out of the JS bundle.
 * Called once at boot, before the app mounts.
 */
export async function loadExtraRoster(): Promise<void> {
  if (extraLoaded) return;
  extraLoaded = true;
  try {
    const response = await fetch("/roster-extra.json");
    if (!response.ok) return;
    const extra = (await response.json()) as ExtraEntry[];
    if (!Array.isArray(extra) || extra.length === 0) return;
    for (const entry of extra) {
      if (!entry?.id || !entry.name) continue;
      ROSTER.push({
        id: entry.id,
        rank: entry.rank,
        name: entry.name,
        series: entry.series || "Unknown",
        heart: false,
      });
    }
    reindex();
  } catch {
    /* offline or missing file: the hand-ranked 1,000 still work */
  }
}""",
    """type ExtraTuple = [string, string, string, number];

let extraLoaded = false;
const listeners = new Set<() => void>();

/** Notify React that the roster grew (used after async hydration). */
export function onRosterChange(fn: () => void): () => void {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

export function extrasLoaded(): boolean {
  return extraLoaded;
}

/**
 * Extras ship as a static file in /public (compact tuples), so they stay out of
 * the JS bundle and the first paint does not wait on them.
 */
export async function loadExtraRoster(): Promise<void> {
  if (extraLoaded) return;
  try {
    const response = await fetch("/roster-extra.json");
    if (!response.ok) return;
    const extra = (await response.json()) as ExtraTuple[];
    if (!Array.isArray(extra) || extra.length === 0) return;
    for (const entry of extra) {
      const [id, name, series, rank] = entry;
      if (!id || !name) continue;
      ROSTER.push({ id, rank, name, series: series || "Unknown", heart: false });
    }
    extraLoaded = true;
    reindex();
    for (const fn of listeners) fn();
  } catch {
    /* offline: the hand-ranked 1,000 still work */
  }
}""",
)

io.open(p, "w", encoding="utf-8", newline="\n").write(s)

# --- main.tsx: do not block first paint ------------------------------------
m = "src/main.tsx"
t = io.open(m, encoding="utf-8").read()
t = t.replace(
    "loadExtraRoster().finally(start);",
    "start();\n// Extras hydrate after first paint; the roster notifies subscribers.\nvoid loadExtraRoster();",
)
io.open(m, "w", encoding="utf-8", newline="\n").write(t)

# --- App: re-render when extras land ---------------------------------------
a = "src/App.tsx"
u = io.open(a, encoding="utf-8").read()
u = u.replace(
    'import { characterById } from "./engine/roster";',
    'import { characterById, onRosterChange } from "./engine/roster";',
)
u = u.replace(
    "  const [pendingSave, setPendingSave] = useState<File | null>(null);",
    "  const [pendingSave, setPendingSave] = useState<File | null>(null);\n  const [, bumpRoster] = useState(0);",
)
u = u.replace(
    "  useEffect(() => {\n    document.documentElement.classList.toggle(\"clean-view\"",
    "  useEffect(() => onRosterChange(() => bumpRoster((n) => n + 1)), []);\n\n  useEffect(() => {\n    document.documentElement.classList.toggle(\"clean-view\"",
)

io.open(a, "w", encoding="utf-8", newline="\n").write(u)
print("compact roster + non-blocking boot")

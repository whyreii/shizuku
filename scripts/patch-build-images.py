import io

# ---------------- images.ts: bundled map + enabled flag --------------------
p = "src/engine/images.ts"
s = io.open(p, encoding="utf-8").read()

s = s.replace(
    'const STATS_KEY = "shizuku.coverage.v1";',
    'const STATS_KEY = "shizuku.coverage.v1";\nconst MAP_URL = "/roster-images.json";\n\n/** name|series -> portrait URL, resolved at build time for the hand-ranked list. */\nlet bundled: Record<string, string> = {};\n\nexport async function loadImageMap(): Promise<void> {\n  try {\n    const response = await fetch(MAP_URL);\n    if (!response.ok) return;\n    bundled = (await response.json()) as Record<string, string>;\n  } catch {\n    /* map is optional; the runtime resolver still works */\n  }\n}',
)

s = s.replace(
    """export function resolvePortrait(
  name: string,
  series?: string,
  anilistId?: number,
): Promise<string | null> {
  const key = cacheKey(name, series);
  if (key in cache) {""",
    """export function resolvePortrait(
  name: string,
  series?: string,
  anilistId?: number,
): Promise<string | null> {
  const key = cacheKey(name, series);
  if (bundled[key]) {
    warm(bundled[key]);
    return Promise.resolve(bundled[key]);
  }
  if (key in cache) {""",
)

s = s.replace(
    """export function usePortrait(
  name: string,
  series?: string,
  rosterId?: string,
): string | null {
  const key = cacheKey(name, series);
  const [url, setUrl] = useState<string | null>(() => (key in cache ? cache[key] : null));

  useEffect(() => {
    let alive = true;
    if (key in cache) {
      setUrl(cache[key]);
      return;
    }""",
    """export function usePortrait(
  name: string,
  series?: string,
  rosterId?: string,
  enabled = true,
): string | null {
  const key = cacheKey(name, series);
  const [url, setUrl] = useState<string | null>(() =>
    bundled[key] ?? (key in cache ? cache[key] : null),
  );

  useEffect(() => {
    let alive = true;
    if (!enabled) {
      setUrl(null);
      return;
    }
    if (bundled[key]) {
      setUrl(bundled[key]);
      return;
    }
    if (key in cache) {
      setUrl(cache[key]);
      return;
    }""",
)

io.open(p, "w", encoding="utf-8", newline="\n").write(s)

# ---------------- components: prefer the build-time portrait --------------
files = {
    "src/components/Card3D.tsx": [
        (
            "  const resolved = usePortrait(character.name, character.series, character.id);\n  const portrait = imageOverride ?? resolved;",
            "  const hasBuildImage = Boolean(character.image);\n  const resolved = usePortrait(\n    character.name,\n    character.series,\n    character.id,\n    !hasBuildImage && !imageOverride,\n  );\n  const portrait = imageOverride ?? character.image ?? resolved;",
        )
    ],
    "src/components/Tile.tsx": [
        (
            "  const portrait = usePortrait(char.name, char.series, char.id);",
            "  const portrait = usePortrait(char.name, char.series, char.id, !char.image) ?? char.image ?? null;",
        )
    ],
    "src/components/Panels.tsx": [
        (
            "  const portrait = usePortrait(char.name, char.series, char.id);",
            "  const portrait = usePortrait(char.name, char.series, char.id, !char.image) ?? char.image ?? null;",
        )
    ],
    "src/components/CollectionView.tsx": [
        (
            "  const portrait = usePortrait(char.name, char.series, char.id);",
            "  const portrait = usePortrait(char.name, char.series, char.id, !char.image) ?? char.image ?? null;",
        )
    ],
}

for path, pairs in files.items():
    text = io.open(path, encoding="utf-8").read()
    for old, new in pairs:
        text = text.replace(old, new)
    io.open(path, "w", encoding="utf-8", newline="\n").write(text)

# ---------------- main: load the map at boot ------------------------------
m = "src/main.tsx"
t = io.open(m, encoding="utf-8").read()
t = t.replace(
    'import { loadExtraRoster } from "./engine/roster";',
    'import { loadExtraRoster } from "./engine/roster";\nimport { loadImageMap } from "./engine/images";',
)
t = t.replace(
    "void loadExtraRoster();",
    "void loadExtraRoster();\nvoid loadImageMap();",
)
io.open(m, "w", encoding="utf-8", newline="\n").write(t)
print("build-time portraits wired")

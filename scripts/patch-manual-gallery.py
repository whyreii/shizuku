import io

# --- allow extra images per character --------------------------------------
p = "src/engine/types.ts"
s = io.open(p, encoding="utf-8").read()
s = s.replace(
    "export interface Override {\n  alias?: string;\n  note?: string;\n  accent?: string;\n}",
    "export interface Override {\n  alias?: string;\n  note?: string;\n  accent?: string;\n  /** User-supplied image URLs for this character. */\n  images?: string[];\n}",
)
io.open(p, "w", encoding="utf-8", newline="\n").write(s)

# --- CharacterSheet: add-image input + gallery from overrides --------------
c = "src/components/CharacterSheet.tsx"
t = io.open(c, encoding="utf-8").read()

t = t.replace(
    'import { fetchGallery } from "../engine/images";',
    'import { setOverride } from "../engine/game";',
)

start = t.find("  useEffect(() => {\n    let alive = true;\n    setGallery([]);")
if start != -1:
    end = t.find("  }, [char.id, char.name, char.series]);", start)
    if end != -1:
        t = t[:start] + t[end + len("  }, [char.id, char.name, char.series]);\n\n") :]

t = t.replace(
    "  const [gallery, setGallery] = useToggleState<string[]>([]);\n  const [shown, setShown] = useToggleState<string | null>(null);",
    """  const [shown, setShown] = useToggleState<string | null>(null);
  const [draft, setDraft] = useToggleState("");
  const gallery = state.overrides[char.id]?.images ?? [];
  const addImage = () => {
    const url = draft.trim();
    if (!url) return;
    act((s) =>
      setOverride(s, char.id, { images: [...(s.overrides[char.id]?.images ?? []), url] }),
    );
    setDraft("");
  };""",
)

t = t.replace(
    """        {gallery.length > 0 ? (
          <div className="gallery-strip">""",
    """        <div className="gallery-strip">
          {gallery.map((url) => (
            <button
              key={url}
              type="button"
              className={shown === url ? "gallery-thumb on" : "gallery-thumb"}
              onClick={() => setShown(shown === url ? null : url)}
              title="Show this image"
            >
              <img src={url} alt="" loading="lazy" />
            </button>
          ))}
          <div className="gallery-add">
            <input
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              placeholder="add image url"
              onKeyDown={(event) => {
                if (event.key === "Enter") addImage();
              }}
            />
            <button className="link" onClick={addImage} disabled={!draft.trim()}>
              add
            </button>
          </div>
        </div>

        {false ? (
          <div className="gallery-strip">""",
)

io.open(c, "w", encoding="utf-8", newline="\n").write(t)
print("manual gallery wired")

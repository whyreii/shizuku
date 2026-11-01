import io

# --- Card3D: allow an explicit image --------------------------------------
p = "src/components/Card3D.tsx"
s = io.open(p, encoding="utf-8").read()
s = s.replace(
    "  compact?: boolean;\n}",
    "  compact?: boolean;\n  imageOverride?: string | null;\n}",
)
s = s.replace(
    "  compact = false,\n}: CardProps) {",
    "  compact = false,\n  imageOverride,\n}: CardProps) {",
)
s = s.replace(
    "  const portrait = usePortrait(character.name, character.series, character.id);",
    "  const resolved = usePortrait(character.name, character.series, character.id);\n  const portrait = imageOverride ?? resolved;",
)
io.open(p, "w", encoding="utf-8", newline="\n").write(s)

# --- CharacterSheet: gallery strip ----------------------------------------
c = "src/components/CharacterSheet.tsx"
t = io.open(c, encoding="utf-8").read()

t = t.replace(
    'import { rankValue } from "../engine/roster";',
    'import { rankValue } from "../engine/roster";\nimport { fetchGallery } from "../engine/images";',
)

t = t.replace(
    "  const [clean, setClean] = useToggleState(false);",
    """  const [clean, setClean] = useToggleState(false);
  const [gallery, setGallery] = useToggleState<string[]>([]);
  const [shown, setShown] = useToggleState<string | null>(null);

  useEffect(() => {
    let alive = true;
    setGallery([]);
    setShown(null);
    fetchGallery(char.name, char.series).then((urls) => {
      if (alive) setGallery(urls);
    });
    return () => {
      alive = false;
    };
  }, [char.id, char.name, char.series]);""",
)

t = t.replace(
    "            soulmate={soulmate}\n          />",
    "            soulmate={soulmate}\n            imageOverride={shown}\n          />",
)

t = t.replace(
    "        <dl className=\"sheet-meta\">",
    """        {gallery.length > 0 ? (
          <div className="gallery-strip">
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
          </div>
        ) : null}

        <dl className="sheet-meta">""",
)

t = t.replace(
    'import { useConfirm } from "./useConfirm";',
    'import { useConfirm } from "./useConfirm";\nimport { useEffect } from "react";',
)

io.open(c, "w", encoding="utf-8", newline="\n").write(t)

# --- Guide: coverage line -------------------------------------------------
h = "src/components/HelpFab.tsx"
u = io.open(h, encoding="utf-8").read()
u = u.replace(
    'import { bandTable, tierClass } from "../engine/tiers";',
    'import { bandTable, tierClass } from "../engine/tiers";\nimport { getCoverage } from "../engine/images";',
)
u = u.replace(
    '            <section className="guide-section">\n              <h3>shortcuts</h3>',
    """            <section className="guide-section">
              <h3>portraits</h3>
              <p className="guide-coverage">
                {getCoverage().matched} of {getCoverage().attempted} lookups
                matched · mismatches fall back to the initial card
              </p>
            </section>

            <section className="guide-section">
              <h3>shortcuts</h3>""",
)
io.open(h, "w", encoding="utf-8", newline="\n").write(u)
print("coverage + gallery wired")

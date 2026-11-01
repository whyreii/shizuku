import io

# --- CharacterSheet: eye toggle that hides the card's overlays --------------
p = "src/components/CharacterSheet.tsx"
s = io.open(p, encoding="utf-8").read()

s = s.replace(
    'import { useConfirm } from "./useConfirm";',
    'import { useConfirm } from "./useConfirm";\nimport { useState as useToggleState } from "react";',
)

s = s.replace(
    "  const canSoulmate = owned && keys >= 10;",
    """  const canSoulmate = owned && keys >= 10;
  const [clean, setClean] = useToggleState(false);""",
)

s = s.replace(
    '      <div className="sheet">',
    '''      <div className={clean ? "sheet is-clean" : "sheet"}>
        <button
          className={`eye-toggle ${clean ? "on" : ""}`}
          onClick={() => setClean((v) => !v)}
          aria-pressed={clean}
          aria-label={clean ? "Show card labels" : "Hide card labels"}
          title={clean ? "Show labels" : "Hide labels"}
        >
          <svg viewBox="0 0 24 24" width="15" height="15" aria-hidden="true">
            <path
              d="M3 12s3.6-6 9-6 9 6 9 6-3.6 6-9 6-9-6-9-6z"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
            />
            <circle cx="12" cy="12" r="2.6" fill="currentColor" />
            {clean ? (
              <line x1="4" y1="20" x2="20" y2="4" stroke="currentColor" strokeWidth="1.6" />
            ) : null}
          </svg>
        </button>
''',
)

io.open(p, "w", encoding="utf-8", newline="\n").write(s)

# --- CollectionView: drop the board-level toggle ----------------------------
c = "src/components/CollectionView.tsx"
v = io.open(c, encoding="utf-8").read()

bstart = v.find('              <button\n                className={`eye-toggle')
if bstart != -1:
    bend = v.find("              </button>\n", bstart)
    if bend != -1:
        v = v[:bstart] + v[bend + len("              </button>\n") :]

v = v.replace(
    '<div className={clean ? "collection-wide is-clean" : "collection-wide"}>',
    '<div className="collection-wide">',
)

io.open(c, "w", encoding="utf-8", newline="\n").write(v)
print("eye moved into the character sheet")

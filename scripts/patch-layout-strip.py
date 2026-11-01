import io

# ---------------- App: board state, bottom strip, goal bar ----------------
p = "src/App.tsx"
s = io.open(p, encoding="utf-8").read()

s = s.replace(
    'import { TowerPanel } from "./components/TowerPanel";',
    'import { TowerPanel } from "./components/TowerPanel";\nimport { CollectionView } from "./components/CollectionView";',
)

s = s.replace(
    "  const [pendingSave, setPendingSave] = useState<File | null>(null);",
    "  const [pendingSave, setPendingSave] = useState<File | null>(null);\n  const [boardOpen, setBoardOpen] = useState(false);",
)

# goal progress bar
s = s.replace(
    """            next · {goal.label} ·{" "}
            {Math.floor(state.kakigori) >= goal.cost
              ? "ready"
              : `${formatKakera(goal.cost - Math.floor(state.kakigori))} kakigori away`}
          </button>""",
    """            next · {goal.label} ·{" "}
            {Math.floor(state.kakigori) >= goal.cost
              ? "ready"
              : `${formatKakera(goal.cost - Math.floor(state.kakigori))} kakigori away`}
            <i
              className="goal-bar"
              style={{
                width: `${Math.min(100, (state.kakigori / goal.cost) * 100).toFixed(1)}%`,
              }}
            />
          </button>""",
)

# bottom strip: collection readout + open
s = s.replace(
    "      <HelpFab />",
    """      <footer className="strip">
        <span className="strip-stat">
          collection · {Object.keys(state.owned).length} owned ·{" "}
          {formatKakera(collectionValue(state))} value
        </span>
        <button className="link" onClick={() => setBoardOpen(true)}>
          open
        </button>
      </footer>

      <HelpFab />

      {boardOpen ? (
        <CollectionView
          state={state}
          act={act}
          actUndo={actWithUndo}
          onClose={() => setBoardOpen(false)}
        />
      ) : null}""",
)

s = s.replace(
    'import { characterById, onRosterChange } from "./engine/roster";',
    'import { characterById, onRosterChange } from "./engine/roster";\nimport { collectionValue } from "./engine/game";',
)

io.open(p, "w", encoding="utf-8", newline="\n").write(s)

# ---------------- CollectionPanel: drop its own summary + board ------------
c = "src/components/Panels.tsx"
t = io.open(c, encoding="utf-8").read()

# remove readout row
start = t.find("      <button\n        type='button'\n        className='readout-row readout-link'")
if start != -1:
    end = t.find("      </button>\n", start)
    if end != -1:
        t = t[:start] + t[end + len("      </button>\n") :]

# remove the wide board block (now owned by App)
start = t.find("      {wide ? (")
if start != -1:
    end = t.find("      ) : null}\n", start)
    if end != -1:
        t = t[:start] + t[end + len("      ) : null}\n") :]

t = t.replace("  const [wide, setWide] = useState(false);\n", "")

io.open(c, "w", encoding="utf-8", newline="\n").write(t)
print("layout restructured")

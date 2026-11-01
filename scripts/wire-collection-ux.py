import io

# --- Panels: accept onRoll ------------------------------------------------
p = "src/components/Panels.tsx"
s = io.open(p, encoding="utf-8").read()

s = s.replace(
    """export function CollectionPanel({
  state,
  act,
  actUndo,
}: PanelProps & {
  actUndo?: (fn: (s: GameState, now: number) => GameState, label: string) => GameState | null;
}) {""",
    """export function CollectionPanel({
  state,
  act,
  actUndo,
  onRoll,
}: PanelProps & {
  actUndo?: (fn: (s: GameState, now: number) => GameState, label: string) => GameState | null;
  onRoll?: () => void;
}) {""",
)
io.open(p, "w", encoding="utf-8", newline="\n").write(s)

# --- App: pass it ---------------------------------------------------------
a = "src/App.tsx"
t = io.open(a, encoding="utf-8").read()
t = t.replace(
    "<CollectionPanel state={state} act={act} actUndo={actWithUndo} />",
    "<CollectionPanel\n              state={state}\n              act={act}\n              actUndo={actWithUndo}\n              onRoll={doRoll}\n            />",
)
io.open(a, "w", encoding="utf-8", newline="\n").write(t)

# --- CSS ------------------------------------------------------------------
c = "src/styles.css"
css = io.open(c, encoding="utf-8").read()
css += """

/* collection toolbar + clickable summary */
.collection-bar {
  display: flex;
  align-items: center;
  gap: 16px;
}

.collection-bar input {
  flex: 1;
  min-width: 0;
}

.collection-bar .chips {
  flex: none;
}

.readout-link {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr auto;
  align-items: center;
  gap: 10px;
  width: 100%;
  text-align: left;
  background: none;
  border: 1px solid transparent;
  border-bottom: 1px solid var(--line-soft);
  cursor: pointer;
  padding: 6px 0;
}

.readout-link:hover {
  border-bottom-color: var(--line-hi);
}

.readout-link:hover .readout-arrow {
  color: var(--frost);
}

.readout-arrow {
  font-size: 13px;
  color: var(--line-hi);
}

.empty-state {
  display: grid;
  justify-items: center;
  gap: 10px;
  padding: 26px 0;
}
"""
io.open(c, "w", encoding="utf-8", newline="\n").write(css)
print("wired")

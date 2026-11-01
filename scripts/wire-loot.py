import io

# --- App: loot tab ---------------------------------------------------------
p = "src/App.tsx"
s = io.open(p, encoding="utf-8").read()
s = s.replace(
    'import { TowerPanel } from "./components/TowerPanel";',
    'import { TowerPanel } from "./components/TowerPanel";\nimport { LootPanel } from "./components/LootPanel";',
)
s = s.replace(
    'const TABS = ["Collection", "Wishes", "Badges", "Tower", "Series", "Log"] as const;',
    'const TABS = ["Collection", "Wishes", "Badges", "Tower", "Loot", "Series", "Log"] as const;',
)
s = s.replace(
    '          {tab === "Tower" ? <TowerPanel state={state} act={act} /> : null}',
    '          {tab === "Tower" ? <TowerPanel state={state} act={act} /> : null}\n          {tab === "Loot" ? <LootPanel state={state} act={act} /> : null}',
)
io.open(p, "w", encoding="utf-8", newline="\n").write(s)

# --- styles ---------------------------------------------------------------
c = "src/styles.css"
css = io.open(c, encoding="utf-8").read()
css += """

/* loot */
.loot-actions {
  display: flex;
  gap: 10px;
}

.loot-actions .btn {
  flex: 1;
}

.loot-results {
  display: flex;
  flex-direction: column;
  border-top: 1px solid var(--line);
}

.loot-row {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 2px;
  border-bottom: 1px solid var(--line-soft);
  font-size: 12.5px;
}

.loot-kind {
  font-family: var(--mono);
  font-size: 9px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--muted);
  min-width: 72px;
}

.loot-kind.kakigori {
  color: var(--frost);
}

.loot-kind.rolls {
  color: var(--good);
}

.loot-kind.claim {
  color: var(--signal);
}
"""
io.open(c, "w", encoding="utf-8", newline="\n").write(css)
print("loot tab wired")

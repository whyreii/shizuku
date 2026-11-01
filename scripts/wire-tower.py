import io

p = "src/App.tsx"
s = io.open(p, encoding="utf-8").read()

s = s.replace(
    'import { BadgesPanel } from "./components/BadgesPanel";',
    'import { BadgesPanel } from "./components/BadgesPanel";\nimport { TowerPanel } from "./components/TowerPanel";',
)

s = s.replace(
    'const TABS = ["Collection", "Wishes", "Badges", "Series", "Log"] as const;',
    'const TABS = ["Collection", "Wishes", "Badges", "Tower", "Series", "Log"] as const;',
)

s = s.replace(
    '          {tab === "Badges" ? <BadgesPanel state={state} act={act} /> : null}',
    '          {tab === "Badges" ? <BadgesPanel state={state} act={act} /> : null}\n          {tab === "Tower" ? <TowerPanel state={state} act={act} /> : null}',
)

io.open(p, "w", encoding="utf-8", newline="\n").write(s)

# styles
c = "src/styles.css"
css = io.open(c, encoding="utf-8").read()
css += """

/* tower */
.tower-row {
  display: grid;
  grid-template-columns: 22px minmax(0, 1fr) 34px auto;
  align-items: center;
  gap: 10px;
  padding: 8px 0;
  border-bottom: 1px solid var(--line-soft);
}

.tower-id {
  font-family: var(--mono);
  font-size: 9px;
  color: var(--line-hi);
  text-align: right;
}

.tower-main {
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 1px;
}

.tower-name {
  font-size: 13px;
}

.tower-blurb {
  font-family: var(--mono);
  font-size: 9px;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--muted);
}

.tower-stacks {
  font-family: var(--mono);
  font-size: 10px;
  color: var(--frost);
  text-align: right;
}

.tower-destroy {
  align-self: center;
  margin-top: 6px;
}
"""
io.open(c, "w", encoding="utf-8", newline="\n").write(css)
print("tower panel wired")

import io, sys
sys.stdout.reconfigure(encoding="utf-8")

# HelpFab takes state so the odds table can show live shifts
p = "src/components/HelpFab.tsx"
s = io.open(p, encoding="utf-8").read()
s = s.replace('import { bandTable, tierClass } from "../engine/tiers";',
              'import { bandTable, tierClass } from "../engine/tiers";\nimport { rarityShifts } from "../engine/game";\nimport type { GameState } from "../engine/types";')
s = s.replace("export function HelpFab() {", "export function HelpFab({ state }: { state: GameState }) {")
s = s.replace("{bandTable().map((row) => (", "{bandTable(rarityShifts(state)).map((row) => (")
io.open(p, "w", encoding="utf-8", newline="\n").write(s)

a = "src/App.tsx"
t = io.open(a, encoding="utf-8").read()
t = t.replace("      <HelpFab />", "      <HelpFab state={state} />")
io.open(a, "w", encoding="utf-8", newline="\n").write(t)
print("help guide wired to live shifts")
import io, sys
sys.stdout.reconfigure(encoding="utf-8")
p = "src/components/HelpFab.tsx"
s = io.open(p, encoding="utf-8").read()

# guide lines come from the engine so they can never drift again
s = s.replace('import { rarityShifts } from "../engine/game";',
              'import { rarityShifts, starwishChance, wishChance } from "../engine/game";')
s = s.replace("const SECTIONS: { title: string; lines: string[] }[] = [",
              "function pct(fraction: number): string {\n  return `${Math.round(fraction * 1000) / 10}%`;\n}\n\nfunction sections(state: GameState): { title: string; lines: string[] }[] {\n  return [")
s = s.replace('      "wishes boost spawn odds to 2%",\n      "one starwish at a time, also 2%",',
              '      `wishes boost spawn odds to ${pct(wishChance(state))}`,\n      `one starwish at a time, also ${pct(starwishChance(state))}`,')
s = s.replace("{SECTIONS.map((section) => (", "{sections(state).map((section) => (")

# close the function: the array literal ended with "];" before the component
i = s.index("function sections(state: GameState)")
j = s.index("\n];", i)
s = s[:j] + "\n  ];\n}" + s[j + len("\n];"):]
io.open(p, "w", encoding="utf-8", newline="\n").write(s)
print("helpfab: guide reads live odds")
import io, sys
sys.stdout.reconfigure(encoding="utf-8")

# ---- wish panel: show multipliers, and the daily row shows kakigori + rolls
p = "src/components/Panels.tsx"
s = io.open(p, encoding="utf-8").read()
s = s.replace("  wishChance,\n  starwishChance,", "  wishMultiplier,\n  starwishMultiplier,")
s = s.replace("const pct = (fraction: number) => `${Math.round(fraction * 1000) / 10}%`;\n\n", "")
s = s.replace("<b>{pct(wishChance(state))}</b>", "<b>×{wishMultiplier(state).toFixed(1)}</b>")
s = s.replace("<b>{pct(starwishChance(state))}</b>", "<b>×{starwishMultiplier(state).toFixed(1)}</b>")
s = s.replace("<span>Wish roll</span>", "<span>Wish boost</span>")
s = s.replace("<span>Starwish</span>", "<span>Starwish boost</span>")
io.open(p, "w", encoding="utf-8", newline="\n").write(s)

# ---- daily row: kakigori + rolls
b = "src/components/BadgesPanel.tsx"
t = io.open(b, encoding="utf-8").read()
t = t.replace("  dailyAmount,", "  dailyAmount,\n  DAILY_ROLLS,")
t = t.replace("? `+${formatKakera(dailyAmount(state))}`",
              "? `+${formatKakera(dailyAmount(state))} · +${DAILY_ROLLS} rolls`")
io.open(b, "w", encoding="utf-8", newline="\n").write(t)

# ---- guide: multipliers instead of percentages
h = "src/components/HelpFab.tsx"
u = io.open(h, encoding="utf-8").read()
u = u.replace('import { rarityShifts, starwishChance, wishChance } from "../engine/game";',
              'import { rarityShifts, starwishMultiplier, wishMultiplier } from "../engine/game";')
u = u.replace('      `wishes boost spawn odds to ${pct(wishChance(state))}`,',
              '      `wished cards are ×${wishMultiplier(state).toFixed(1)} more likely, not guaranteed`,')
u = u.replace('      `one starwish at a time, also ${pct(starwishChance(state))}`,',
              '      `one starwish comes first, ×${starwishMultiplier(state).toFixed(1)} weight`,')
u = u.replace("function pct(fraction: number): string {\n  return `${Math.round(fraction * 1000) / 10}%`;\n}\n\n", "")
io.open(h, "w", encoding="utf-8", newline="\n").write(u)
print("ui updated")
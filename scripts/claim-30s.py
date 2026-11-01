import io, sys
sys.stdout.reconfigure(encoding="utf-8")

p = "src/engine/game.ts"
s = io.open(p, encoding="utf-8").read()
if s.count("export const CLAIM_WINDOW_MS = 60_000;") != 1:
    print("MISS window"); sys.exit(1)
s = s.replace("export const CLAIM_WINDOW_MS = 60_000;", "export const CLAIM_WINDOW_MS = 30_000;")
io.open(p, "w", encoding="utf-8", newline="\n").write(s)

# guide reads the constant so it can never drift again
h = "src/components/HelpFab.tsx"
t = io.open(h, encoding="utf-8").read()
t = t.replace('import { rarityShifts, starwishMultiplier, wishMultiplier } from "../engine/game";',
              'import { CLAIM_WINDOW_MS, rarityShifts, starwishMultiplier, wishMultiplier } from "../engine/game";')
old = '      "roll  claim within 60s  divorce for value",'
# the source has an arrow glyph we cannot type reliably; match on the stable part
import re
t2 = re.sub(r'"roll[^"]*claim within 60s[^"]*divorce for value"',
            '`roll -> claim within ${Math.round(CLAIM_WINDOW_MS / 1000)}s -> divorce for value`', t)
if t2 == t:
    print("MISS guide line"); sys.exit(1)
io.open(h, "w", encoding="utf-8", newline="\n").write(t2)
print("claim window 60s -> 30s, guide reads the constant")
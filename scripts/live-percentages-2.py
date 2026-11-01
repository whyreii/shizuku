import io, sys
sys.stdout.reconfigure(encoding="utf-8")

# ---- 3. the wish panel reads the engine, not a literal ----------------
p = "src/components/Panels.tsx"
s = io.open(p, encoding="utf-8").read()
s = s.replace("  wishCap,", "  wishCap,\n  wishChance,\n  starwishChance,", 1)
old = """        <div>
          <span>Wish roll</span>
          <b>10%</b>
        </div>
        <div>
          <span>Starwish</span>
          <b>2%</b>
        </div>"""
new = """        <div>
          <span>Wish roll</span>
          <b>{pct(wishChance(state))}</b>
        </div>
        <div>
          <span>Starwish</span>
          <b>{pct(starwishChance(state))}</b>
        </div>"""
if s.count(old) != 1:
    print("MISS readout"); sys.exit(1)
s = s.replace(old, new)

# helper: 0.005 -> "0.5%", 0.0125 -> "1.3%"
s = s.replace("export function WishlistPanel({ state, act }: PanelProps) {",
              "const pct = (fraction: number) => `${Math.round(fraction * 1000) / 10}%`;\n\nexport function WishlistPanel({ state, act }: PanelProps) {")
io.open(p, "w", encoding="utf-8", newline="\n").write(s)
print("panels.tsx: live wish/starwish percentages")
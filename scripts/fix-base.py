import io, sys
sys.stdout.reconfigure(encoding="utf-8")
p = "src/PreviewV3.tsx"
s = io.open(p, encoding="utf-8").read()
if "const BASE =" not in s:
    s = s.replace(
        "const TIER_VAR: Record<Tier, string> = {",
        "/* One frozen state for the tiles: the study never mutates anything. */\nconst BASE = createInitialState(1_760_000_000_000);\n\nconst TIER_VAR: Record<Tier, string> = {",
    )
io.open(p, "w", encoding="utf-8", newline="\n").write(s)
print("BASE restored")
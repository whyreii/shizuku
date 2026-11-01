import io, sys
sys.stdout.reconfigure(encoding="utf-8")
p = "src/PreviewV3.tsx"
s = io.open(p, encoding="utf-8").read()
s = s.replace(
    "const PICKED: Picked[] = RANKS.map((rank, i) => {",
    "const PICKED: Picked[] = RANKS.map((rank, i): Picked | null => {",
)
s = s.replace(
    "}).filter((entry): entry is Picked => entry !== null);",
    "}).filter((entry): entry is Picked => entry !== null);",
)
io.open(p, "w", encoding="utf-8", newline="\n").write(s)
print("typed the map callback")
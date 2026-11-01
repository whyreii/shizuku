import io, sys
sys.stdout.reconfigure(encoding="utf-8")
p = "src/engine/roster.ts"
s = io.open(p, encoding="utf-8").read()
old = """  [6258, 27],
  [17366, 1],
];"""
new = """  [6258, 27],
  [10000, 15],
  [17366, 10],
];"""
if s.count(old) != 1:
    print("MISS anchors"); sys.exit(1)
s = s.replace(old, new)
io.open(p, "w", encoding="utf-8", newline="\n").write(s)
print("tail lifted: 10k -> 15, 17,366 -> 10")
import io, sys
sys.stdout.reconfigure(encoding="utf-8")
p = "src/engine/game.ts"
s = io.open(p, encoding="utf-8").read()
pairs = [
    ('label: "Second key chance"', 'label: "Second shard chance"'),
    ('label: "Key cap bonus"', 'label: "Shard cap bonus"'),
    ('label: "Key capacity"', 'label: "Shard capacity"'),
    ('label: "Claim bonus"', 'label: "Claim bonus"'),
]
for old, new in pairs:
    if old == new: continue
    if s.count(old) != 1:
        print("skip/miss:", old); continue
    s = s.replace(old, new)
io.open(p, "w", encoding="utf-8", newline="\n").write(s)
print("perk labels fixed")
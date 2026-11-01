import io, sys
sys.stdout.reconfigure(encoding="utf-8")
p = "src/components/Panels.tsx"
s = io.open(p, encoding="utf-8").read()
pairs = [
    ("            keys only\n", "            shards only\n"),
    ("{keys > 0 ? keys + ' shard' : '\\u2014'}",
     "{keys > 0 ? keys + (keys === 1 ? ' shard' : ' shards') : '\\u2014'}"),
]
for old, new in pairs:
    if s.count(old) != 1:
        print("MISS:", old[:40]); sys.exit(1)
    s = s.replace(old, new)
io.open(p, "w", encoding="utf-8", newline="\n").write(s)
print("panels fixed")
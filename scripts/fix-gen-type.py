import io, re
p = "scripts/gen-type.py"
s = io.open(p, encoding="utf-8").read()
# families must use single quotes: these values land inside style="..."
s = s.replace('\'"Bebas Neue", Impact, sans-serif\'', '"\'Bebas Neue\', Impact, sans-serif"')
s = s.replace('\'"Chakra Petch", system-ui, sans-serif\'', '"\'Chakra Petch\', system-ui, sans-serif"')
s = s.replace('\'"Barlow Condensed", system-ui, sans-serif\'', '"\'Barlow Condensed\', system-ui, sans-serif"')
io.open(p, "w", encoding="utf-8", newline="\n").write(s)
print("generator fixed")
import io
p = "src/preview.css"
s = io.open(p, encoding="utf-8").read()
bad = s.count("\ufeff")
s = s.replace("\ufeff", "")
io.open(p, "w", encoding="utf-8", newline="\n").write(s)
print("boms removed:", bad, "| bytes:", len(s))
print(".gf blocks:", s.count(".gf"))
import io
c = "src/preview.css"
s = io.open(c, encoding="utf-8").read()
bad = "  font-size: 21px; color: #4d6舎;\n"
if bad in s:
    s = s.replace(".gf-count i { font-size: 21px; color: #4d6舎; }\n", "")
    io.open(c, "w", encoding="utf-8", newline="\n").write(s)
    print("removed stray invalid colour")
else:
    print("not present")
import io, re
c = "src/preview.css"
s = io.open(c, encoding="utf-8").read()
before = s
s = re.sub(r"\.gf-count i \{ font-size: 21px; color: #[^;]*; \}\n", "", s)
if s != before:
    io.open(c, "w", encoding="utf-8", newline="\n").write(s)
    print("removed:", len(before) - len(s), "chars")
else:
    print("regex missed")
print("remaining .gf-count rules:", s.count(".gf-count"))
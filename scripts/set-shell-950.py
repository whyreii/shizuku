import io

p = "src/styles.css"
s = io.open(p, encoding="utf-8").read()

s = s.replace("    max-width: 1320px;", "    max-width: 950px;")
s = s.replace(
    "    grid-template-columns: minmax(340px, 420px) minmax(0, 1fr);",
    "    grid-template-columns: minmax(300px, 340px) minmax(0, 1fr);",
)

io.open(p, "w", encoding="utf-8", newline="\n").write(s)
print("shell set to 950")

import io

p = "src/styles.css"
s = io.open(p, encoding="utf-8").read()

s = s.replace(
    """  border: 1px solid rgba(255, 255, 255, 0.14);
  background: rgba(4, 7, 12, 0.93);
  backdrop-filter: blur(10px) saturate(0.8);
  box-shadow: 0 10px 26px -16px #000;
  transform: translateZ(34px) rotate(-1.2deg);""",
    """  border: 1px solid rgba(255, 255, 255, 0.16);
  background: rgba(5, 9, 15, 0.82);
  box-shadow: 0 6px 18px -10px #000;
  transform: translateZ(34px) rotate(-1.2deg);""",
)

s = s.replace("  text-overflow: ellipsis;\n  text-shadow: 0 1px 6px rgba(0, 0, 0, 0.7);\n}", "  text-overflow: ellipsis;\n}")
s = s.replace("  text-shadow: 0 1px 5px rgba(0, 0, 0, 0.8);\n  white-space: nowrap;", "  white-space: nowrap;")

io.open(p, "w", encoding="utf-8", newline="\n").write(s)
print("plate reverted")

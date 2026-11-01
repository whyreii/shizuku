import io

p = "src/styles.css"
s = io.open(p, encoding="utf-8").read()

s = s.replace("@media (min-width: 1100px) {", "@media (min-width: 1280px) {")
s = s.replace("    max-width: 1080px;", "    max-width: 1320px;")
s = s.replace(
    "    grid-template-columns: minmax(320px, 380px) minmax(0, 1fr);",
    "    grid-template-columns: minmax(340px, 420px) minmax(0, 1fr);",
)

s += """

/* stage column reads as one centred unit */
.col-stage .hint,
.col-stage .goal {
  text-align: center;
  width: 100%;
}

.col-stage .controls {
  max-width: 300px;
}

.col-stage .stage-hint {
  text-align: center;
}

/* header breathing room */
.bar {
  gap: 24px;
}

.numbers {
  margin-left: auto;
}
"""
io.open(p, "w", encoding="utf-8", newline="\n").write(s)
print("layout cleaned: 1280 breakpoint, centred stage")

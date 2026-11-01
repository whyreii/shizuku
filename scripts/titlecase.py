import io, sys
sys.stdout.reconfigure(encoding="utf-8")

c = "src/preview.css"
s = io.open(c, encoding="utf-8").read()
pairs = [
    # pill label: KAKIGORI -> Kakigori
    ("""  font-size: 8px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--muted);""",
     """  font-size: 8.5px;
  letter-spacing: 0.06em;
  text-transform: capitalize;
  color: var(--muted);"""),
    # roll button
    ("""  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: #06121c;""",
     """  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: capitalize;
  color: #06121c;"""),
    # claim pill
    ("""  color: var(--tier-sp);
  font-size: 10px;
  letter-spacing: 0.14em;
  text-transform: uppercase;""",
     """  color: var(--tier-sp);
  font-size: 10px;
  letter-spacing: 0.05em;
  text-transform: capitalize;"""),
    # ALBUM kicker
    (".gf-kicker { font-size: 10px; letter-spacing: .26em; text-transform: uppercase; color: var(--muted); padding-bottom: 5px; }",
     ".gf-kicker { font-size: 10.5px; letter-spacing: .1em; text-transform: capitalize; color: var(--muted); padding-bottom: 5px; }"),
    # dock
    ("color: var(--muted); font-size: 8.5px; letter-spacing: .14em; text-transform: uppercase;",
     "color: var(--muted); font-size: 10px; letter-spacing: .05em; text-transform: capitalize;"),
]
for old, new in pairs:
    if s.count(old) != 1:
        print("MISS:", old[:48]); sys.exit(1)
    s = s.replace(old, new)
io.open(c, "w", encoding="utf-8", newline="\n").write(s)

# card: the series line stops shouting
p = "src/styles.css"
t = io.open(p, encoding="utf-8").read()
old = """.card-series {
  font-family: var(--mono);
  font-size: 8.5px;
  letter-spacing: 0.08em;
  text-transform: uppercase;"""
new = """.card-series {
  font-family: var(--mono);
  font-size: 9px;
  letter-spacing: 0.02em;
  text-transform: lowercase;"""
if t.count(old) != 1:
    print("MISS card-series"); sys.exit(1)
t = t.replace(old, new)
t = t.replace(""".card-series {
  font-size: 9.5px;
}""", """.card-series {
  font-size: 10px;
}

.card-series::first-letter {
  text-transform: uppercase;
}""")
io.open(p, "w", encoding="utf-8", newline="\n").write(t)
print("labels: first-letter capital only")
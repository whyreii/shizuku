import io, sys
sys.stdout.reconfigure(encoding="utf-8")

# 1. load the two new families
p = "index.html"
s = io.open(p, encoding="utf-8").read()
old = "family=Instrument+Serif:ital@0;1&family=Archivo:wght@400;500;600;700&display=swap"
new = "family=Instrument+Serif:ital@0;1&family=Archivo:wght@400;500;600;700&family=Russo+One&family=Kanit:wght@400;500;600;700&display=swap"
print("font link found:", s.count(old))
if s.count(old) == 1:
    s = s.replace(old, new)
    io.open(p, "w", encoding="utf-8", newline="\n").write(s)

# 2. Combo 1 on the preview frame only - card is untouched
c = "src/preview.css"
t = io.open(c, encoding="utf-8").read()
t += """

/* ---------------------------------------------------------------
   Combo 1: Russo One for display (numbers, labels, dock, buttons),
   Kanit for body. Scoped to .gf, so the app keeps Archivo until you
   approve it, and the card keeps Instrument Serif either way.
   --------------------------------------------------------------- */
.gf {
  --disp: "Russo One", Impact, sans-serif;
  --ui: "Kanit", system-ui, sans-serif;
  font-family: var(--ui);
}

.gf-pill-text small,
.gf-pill-text b,
.gf-kicker,
.gf-count,
.gf-f,
.gf-dock-item,
.gf-roll,
.gf-under,
.gf-album-head {
  font-family: var(--disp);
}

.gf-pill-text b { letter-spacing: 0.02em; font-weight: 400; }
.gf-pill-text small { letter-spacing: 0.2em; }
.gf-count { letter-spacing: 0.02em; font-weight: 400; }
.gf-count i { font-family: var(--disp); letter-spacing: 0.04em; }
.gf-kicker { letter-spacing: 0.24em; }
.gf-roll { letter-spacing: 0.18em; }
.gf-dock-item { letter-spacing: 0.12em; }
.gf-f { letter-spacing: 0.1em; }
"""
io.open(c, "w", encoding="utf-8", newline="\n").write(t)
print("combo 1 applied to the preview frame")
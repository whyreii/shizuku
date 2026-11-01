import io, sys
sys.stdout.reconfigure(encoding="utf-8")
c = "src/preview.css"
s = io.open(c, encoding="utf-8").read()

start = s.index("/* the glow must never sit behind" if "/* the glow must never sit behind" in s else "/* No glow at all.")
s_head = s[:start]
s_tail = s[start:]

extra = """
/* ---------------- pass: header, album, dock ---------------- */

/* 4. pills: horizontal, number is the hero, + is a ghost */
.gf-pill {
  height: 34px;
  padding: 0 8px 0 12px;
  gap: 9px;
}
.gf-pill-label {
  font-family: var(--disp);
  font-size: 10.5px;
  letter-spacing: 0.04em;
  color: var(--muted);
}
.gf-pill-value {
  font-family: var(--disp);
  font-size: 16px;
  font-weight: 400;
  letter-spacing: 0.01em;
  color: var(--paper);
  margin-left: 2px;
}
.gf-plus {
  width: 22px;
  height: 22px;
  border-radius: 999px;
  border: 1px solid rgba(154, 217, 255, 0.4);
  background: rgba(154, 217, 255, 0.08);
  color: var(--frost);
  font-size: 13px;
  line-height: 1;
  display: grid;
  place-items: center;
  padding: 0;
  cursor: pointer;
}
.gf-plus:hover { background: rgba(154, 217, 255, 0.16); }

/* 3. album counter: equal numbers, percentage, a bar you can see */
.gf-album-head {
  align-items: center;
  gap: 12px;
  padding-bottom: 11px;
}
.gf-count {
  display: flex;
  align-items: baseline;
  gap: 5px;
  font-size: 21px;
}
.gf-count b { font-weight: 400; color: var(--paper); }
.gf-count i { font-size: 21px; color: #4d6舎; }
.gf-count i { color: #566b82; }
.gf-count em {
  font-style: normal;
  font-family: var(--ui);
  font-size: 11px;
  color: var(--muted);
  margin-left: 4px;
}
.gf-bar { height: 4px; margin-bottom: 0; }
.gf-bar i {
  min-width: 6px;
  box-shadow: 0 0 8px rgba(154, 217, 255, 0.85);
}

/* 2. rarity distribution: one bar, legend underneath */
.gf-dist { padding: 12px 0 14px; }
.gf-dist-bar {
  display: flex;
  height: 6px;
  border-radius: 999px;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.07);
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.05);
}
.gf-dist-bar span { min-width: 3px; }
.gf-dist-bar span + span { margin-left: 1px; }
.gf-dist-legend {
  display: flex;
  gap: 12px;
  margin-top: 8px;
  font-family: var(--disp);
  font-size: 10px;
  letter-spacing: 0.04em;
  color: var(--muted);
}
.gf-dist-legend span { display: flex; align-items: center; gap: 5px; }
.gf-dist-legend span.zero { opacity: 0.35; }
.gf-dist-legend i {
  width: 6px;
  height: 6px;
  border-radius: 2px;
  display: block;
}
.gf-dist-legend b { color: var(--paper); font-weight: 400; }

/* 1. dock: grouped, bigger labels, clearer active */
.gf-dock { padding: 0 18px; }
.gf-dock-nav {
  display: flex;
  gap: 4px;
  margin: 0 auto;
}
.gf-dock-item {
  position: relative;
  min-width: 78px;
  padding: 8px 14px;
  font-size: 11px;
  letter-spacing: 0.04em;
}
.gf-dock-glyph { width: 18px; height: 18px; }
.gf-dock-item.on {
  color: var(--paper);
  background: rgba(154, 217, 255, 0.09);
  box-shadow: inset 0 0 0 1px rgba(154, 217, 255, 0.2);
}
.gf-dock-item.on .gf-dock-glyph { color: var(--frost); }
.gf-dock-item.on::before {
  content: "";
  position: absolute;
  top: 0;
  left: 24%;
  right: 24%;
  height: 2px;
  border-radius: 0 0 2px 2px;
  background: var(--frost);
  box-shadow: 0 0 10px var(--frost);
}
.gf-dock-note { position: absolute; right: 22px; }
"""
io.open(c, "w", encoding="utf-8", newline="\n").write(s_head + extra + s_tail)
print("css appended")
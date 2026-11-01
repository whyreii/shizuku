import io, sys
sys.stdout.reconfigure(encoding="utf-8")
p = "src/PreviewV3.tsx"
s = io.open(p, encoding="utf-8").read()

old_start = s.index('          <div className="gf-dist">')
old_end = s.index('</div>', s.index('gf-dist-legend')) + len('</div>')
# find the end of the whole block (the closing of .gf-dist)
block_end = s.index("\n          </div>\n", old_start) + len("\n          </div>\n")
old = s[old_start:block_end]

new = """          <div className="gf-dist">
            {TIERS.map((tier) => {
              const n = tierCounts[tier] ?? 0;
              const tallest = Math.max(1, ...TIERS.map((t) => tierCounts[t] ?? 0));
              return (
                <span key={tier} className={`gf-dist-col${n ? "" : " zero"}`}
                  style={{ color: TIER_VAR[tier] } as CSSProperties}>
                  <b>{n}</b>
                  <span className="gf-dist-track">
                    <span
                      className="gf-dist-fill"
                      style={{ height: `${n ? Math.max(12, (n / tallest) * 100) : 0}%` }}
                    />
                  </span>
                  <em>{tier}</em>
                </span>
              );
            })}
          </div>
"""
s = s[:old_start] + new + s[block_end:]
io.open(p, "w", encoding="utf-8", newline="\n").write(s)

c = "src/preview.css"
css = io.open(c, encoding="utf-8").read()
css += """

/* rarity as a histogram, not a chart: the tallest tier reads instantly */
.gf-dist {
  display: flex;
  align-items: flex-end;
  gap: 15px;
  padding: 10px 0 12px;
}
.gf-dist-col {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  width: 38px;
  font-family: var(--disp);
}
.gf-dist-col b {
  font-size: 11px;
  font-weight: 400;
  color: var(--paper);
}
.gf-dist-track {
  display: flex;
  align-items: flex-end;
  width: 100%;
  height: 34px;
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.05);
  overflow: hidden;
}
.gf-dist-fill {
  width: 100%;
  border-radius: 4px 4px 0 0;
  background: currentColor;
  box-shadow: 0 0 12px -4px currentColor;
  display: block;
}
.gf-dist-col em {
  font-style: normal;
  font-size: 9.5px;
  letter-spacing: 0.05em;
  color: currentColor;
}
.gf-dist-col.zero b,
.gf-dist-col.zero em { opacity: 0.35; }
"""
io.open(c, "w", encoding="utf-8", newline="\n").write(css)
print("histogram in")
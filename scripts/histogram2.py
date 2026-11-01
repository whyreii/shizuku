import io, sys
sys.stdout.reconfigure(encoding="utf-8")

p = "src/PreviewV3.tsx"
s = io.open(p, encoding="utf-8").read()
old = """                  <b>{n}</b>
                  <span className="gf-dist-track">
                    <span
                      className="gf-dist-fill"
                      style={{ height: `${n ? Math.max(12, (n / tallest) * 100) : 0}%` }}
                    />
                  </span>
                  <em>{tier}</em>"""
new = """                  <b>{n}</b>
                  <span
                    className="gf-dist-fill"
                    style={{ height: `${n ? 8 + (n / tallest) * 30 : 2}px` }}
                  />
                  <em>{tier}</em>"""
if s.count(old) != 1:
    print("MISS col"); sys.exit(1)
s = s.replace(old, new)
io.open(p, "w", encoding="utf-8", newline="\n").write(s)

c = "src/preview.css"
css = io.open(c, encoding="utf-8").read()
css += """

/* bars grow from a shared baseline instead of floating inside invisible tracks */
.gf-dist { align-items: flex-end; gap: 15px; padding: 12px 0 10px; }
.gf-dist-col {
  justify-content: flex-end;
  gap: 3px;
  padding-bottom: 3px;
}
.gf-dist-track { display: none; }
.gf-dist-fill {
  width: 100%;
  border-radius: 3px 3px 0 0;
  background: currentColor;
  box-shadow: 0 -2px 14px -6px currentColor;
  display: block;
}
.gf-dist-col em {
  border-top: 1px solid rgba(255, 255, 255, 0.09);
  padding-top: 4px;
  width: 100%;
  text-align: center;
}
"""
io.open(c, "w", encoding="utf-8", newline="\n").write(css)
print("histogram rebuilt on a baseline")
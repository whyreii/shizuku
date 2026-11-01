import io, sys
sys.stdout.reconfigure(encoding="utf-8")
p = "src/PreviewV3.tsx"
s = io.open(p, encoding="utf-8").read()

old = """          <div className="gf-album-head">
            <span className="gf-kicker">Album</span>
            <span className="gf-count">
              <b>{PICKED.length}</b>
              <i>/ {size.toLocaleString()}</i>
              <em>{completion.toFixed(1)}%</em>
            </span>
            <span className="gf-bar">
              <i style={{ width: `${Math.max(completion, 0.8)}%` }} />
            </span>"""
new = """          <div
            className="gf-album-head"
            style={{ "--progress": `${Math.max(completion, 0.9)}%` } as CSSProperties}
          >
            <span className="gf-kicker">Album</span>
            <span className="gf-count">
              <b>{PICKED.length}</b>
              <i>/ {size.toLocaleString()}</i>
            </span>
            <span className="gf-pct">{completion.toFixed(1)}%</span>"""
if s.count(old) != 1:
    print("MISS head"); sys.exit(1)
s = s.replace(old, new)
io.open(p, "w", encoding="utf-8", newline="\n").write(s)
print("tsx done")
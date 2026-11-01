import io, sys
sys.stdout.reconfigure(encoding="utf-8")

p = "src/PreviewV3.tsx"
s = io.open(p, encoding="utf-8").read()
old = """          <div
            className="gf-album-head"
            style={{ "--progress": `${Math.max(completion, 0.9)}%` } as CSSProperties}
          >"""
new = """          <div className="gf-album-head">"""
if s.count(old) != 1:
    print("MISS head"); sys.exit(1)
s = s.replace(old, new)
io.open(p, "w", encoding="utf-8", newline="\n").write(s)
print("inline progress var removed")
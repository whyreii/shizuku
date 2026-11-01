import io, sys
sys.stdout.reconfigure(encoding="utf-8")
p = "src/PreviewV3.tsx"
s = io.open(p, encoding="utf-8").read()
old = """            <svg className="gf-roll-glyph" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M21 12a9 9 0 1 1-2.7-6.4" />
              <path d="M21 3.4v5.2h-5.2" />
            </svg>
"""
if s.count(old) != 1:
    print("MISS icon"); sys.exit(1)
s = s.replace(old, "")
io.open(p, "w", encoding="utf-8", newline="\n").write(s)
print("icon removed")
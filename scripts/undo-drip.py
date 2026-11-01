import io, sys
sys.stdout.reconfigure(encoding="utf-8")

p = "src/PreviewV3.tsx"
t = io.open(p, encoding="utf-8").read()
old = """            {isTop3 ? (
              <>
                <div className="gf-water" aria-hidden="true">
                  <span />
                  <span />
                  <span />
                </div>
                <div className="gf-drips" aria-hidden="true">
                  <span />
                  <span />
                  <span />
                </div>
              </>
            ) : null}"""
new = """            {isTop3 ? (
              <div className="gf-water" aria-hidden="true">
                <span />
                <span />
                <span />
              </div>
            ) : null}"""
if t.count(old) != 1:
    print("MISS tsx"); sys.exit(1)
t = t.replace(old, new)
io.open(p, "w", encoding="utf-8", newline="\n").write(t)

c = "src/preview.css"
s = io.open(c, encoding="utf-8").read()
start = s.index("/* The drop is the identity: Shizuku means \"drip\".")
end = s.index("@keyframes gf-drip {")
end2 = s.index("}", s.index("  100% { opacity: 0; }\n}")) + 1
# remove the whole drip block, from its comment through the keyframes close
blk_end = s.index("100% { opacity: 0; }\n}\n", end) + len("100% { opacity: 0; }\n}\n")
s = s[:start] + s[blk_end:]
io.open(c, "w", encoding="utf-8", newline="\n").write(s)
print("drip removed")
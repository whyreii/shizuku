import io, sys
sys.stdout.reconfigure(encoding="utf-8")
p = "src/PreviewV3.tsx"
s = io.open(p, encoding="utf-8").read()

start = s.index('          <div className="gf-dist">')
end = s.index("\n          </div>\n", start) + len("\n          </div>\n")
s = s[:start] + "" + s[end:]

old = """            <span className="gf-bar">
              <i style={{ width: `${Math.max(completion, 0.8)}%` }} />
            </span>
          </div>"""
new = """            <span className="gf-bar">
              <i style={{ width: `${Math.max(completion, 0.8)}%` }} />
            </span>
            <span className="gf-rarity">
              {TIERS.map((tier) => (
                <span key={tier} className={(tierCounts[tier] ?? 0) ? "" : "zero"}>
                  <em style={{ color: TIER_VAR[tier] }}>{tier}</em>
                  <b>{tierCounts[tier] ?? 0}</b>
                </span>
              ))}
            </span>
          </div>"""
if s.count(old) != 1:
    print("MISS head"); sys.exit(1)
s = s.replace(old, new)
io.open(p, "w", encoding="utf-8", newline="\n").write(s)
print("tsx done")
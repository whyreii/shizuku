import io, sys
sys.stdout.reconfigure(encoding="utf-8")
p = "src/PreviewV3.tsx"
s = io.open(p, encoding="utf-8").read()

def rep(old, new, label):
    global s
    if s.count(old) != 1:
        print("MISS", label); sys.exit(1)
    s = s.replace(old, new)

# ---- 4. pills: one line, + demoted to a ghost -------------------------
rep("""          <div className="gf-pill">
            <Icon name="kakigori" size={15} />
            <span className="gf-pill-text">
              <small>kakigori</small>
              <b>{formatKakera(10940)}</b>
            </span>
            <span className="gf-plus">+</span>
          </div>
          <div className="gf-pill rolls">
            <Icon name="rolls" size={15} />
            <span className="gf-pill-text">
              <small>rolls</small>
              <b>893</b>
            </span>
            <span className="gf-plus">+</span>
          </div>""",
"""          <div className="gf-pill">
            <Icon name="kakigori" size={15} />
            <span className="gf-pill-label">Kakigori</span>
            <b className="gf-pill-value">{formatKakera(10940)}</b>
            <button className="gf-plus" aria-label="Get more kakigori">+</button>
          </div>
          <div className="gf-pill rolls">
            <Icon name="rolls" size={15} />
            <span className="gf-pill-label">Rolls</span>
            <b className="gf-pill-value">893</b>
            <button className="gf-plus" aria-label="Get more rolls">+</button>
          </div>""", "pills")

# ---- 3. album counter: same size, percentage, visible bar -------------
rep("""          <div className="gf-album-head">
            <span className="gf-kicker">album</span>
            <span className="gf-count">
              {PICKED.length} <i>/ {size.toLocaleString()}</i>
            </span>
            <span className="gf-bar">
              <i style={{ width: `${(PICKED.length / Math.max(1, size)) * 100}%` }} />
            </span>
          </div>""",
"""          <div className="gf-album-head">
            <span className="gf-kicker">Album</span>
            <span className="gf-count">
              <b>{PICKED.length}</b>
              <i>/ {size.toLocaleString()}</i>
              <em>{completion.toFixed(1)}%</em>
            </span>
            <span className="gf-bar">
              <i style={{ width: `${Math.max(completion, 0.8)}%` }} />
            </span>
          </div>""", "album head")

# ---- 2. rarity: one distribution bar instead of six chips ------------
rep("""          <div className="gf-filters">
            {(["S+", "S", "A", "B", "C", "D"] as Tier[]).map((tier) => (
              <span
                key={tier}
                className={`gf-f ${tierCounts[tier] ? "has" : ""}`}
                style={{ color: TIER_VAR[tier] }}
              >
                <i />
                {tier} {tierCounts[tier] ?? 0}
              </span>
            ))}
          </div>""",
"""          <div className="gf-dist">
            <div className="gf-dist-bar">
              {TIERS.filter((tier) => (tierCounts[tier] ?? 0) > 0).map((tier) => (
                <span
                  key={tier}
                  style={{
                    flexGrow: tierCounts[tier] ?? 0,
                    background: TIER_VAR[tier],
                  }}
                  title={`${tier}: ${tierCounts[tier]}`}
                />
              ))}
            </div>
            <div className="gf-dist-legend">
              {TIERS.map((tier) => (
                <span key={tier} className={(tierCounts[tier] ?? 0) ? "" : "zero"}>
                  <i style={{ background: TIER_VAR[tier] }} />
                  {tier}
                  <b>{tierCounts[tier] ?? 0}</b>
                </span>
              ))}
            </div>
          </div>""", "filters")

io.open(p, "w", encoding="utf-8", newline="\n").write(s)
print("pills, counter and rarity rewritten")
import io, sys
p = "src/App.tsx"
s = io.open(p, encoding="utf-8").read()

novelty = '''          <div className="setting-row">
            <span>Novelty</span>
            <div className="seg">
              {[1, 2, 3, 4].map((n) => (
                <button
                  key={n}
                  className={"seg-btn " + ((state.novelty ?? 4) === n ? "on" : "")}
                  onClick={() => act((s) => ({ ...s, novelty: n }))}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>
          <p className="modal-text">
            How often your own cards are held back. 1 - your collection keeps
            dropping / 4 - mostly new cards.
          </p>

'''

boost = '''          <div className="setting-row">
            <span>Wish boost</span>
            <div className="seg">
              <button
                className="seg-btn"
                onClick={() => {
                  const wait = (state.wishBoostAt ?? 0) + 12 * 3600000 - Date.now();
                  if ((state.wishBoost ?? 0) > 0 && wait > 0) {
                    notify("Can lower again in " + Math.ceil(wait / 3600000) + "h", "warn");
                    return;
                  }
                  act((s) => ({
                    ...s,
                    wishBoost: Math.max(0, (s.wishBoost ?? 0) - 1),
                    wishBoostAt: Date.now(),
                  }));
                }}
              >
                -
              </button>
              <b>{state.wishBoost ?? 0}</b>
              <button
                className="seg-btn"
                onClick={() => {
                  const max = Math.max(0, rollsPerReset({ ...state, wishBoost: 0 }) - 10);
                  if ((state.wishBoost ?? 0) >= max) return;
                  act((s) => ({ ...s, wishBoost: (s.wishBoost ?? 0) + 1 }));
                }}
              >
                +
              </button>
            </div>
          </div>
          <p className="modal-text">
            Rolls per hour traded for spawn chance: +{wishBoostPercent(state.wishBoost ?? 0)}%
            wish, +{starwishBoostPercent(state.wishBoost ?? 0)}% starwish. Rolls/hr now{" "}
            {rollsPerReset(state)}. Lowering has a 12h cooldown.
          </p>

'''

anchor = "          <p className=\"modal-text\" style={{ marginTop: 18 }}>\n            Wiping removes your entire save"
if s.count(anchor) != 1:
    print("MISS anchor"); sys.exit(1)
s = s.replace(anchor, novelty + boost + anchor)
io.open(p, "w", encoding="utf-8", newline="\n").write(s)
print("settings UI inserted")
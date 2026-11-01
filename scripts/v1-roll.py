import io, sys
p = "src/App.tsx"
s = io.open(p, encoding="utf-8").read()

start = s.index('        <div className="controls">')
end = s.index('        </div>\n      </div>\n\n      <p className="hint">') if False else None

old = '''        <div className="controls">
          <button
            className="btn primary"
            onClick={doRoll}
            disabled={state.rolls < 1}
          >
            Roll
            <span className="timer">
              {state.rolls > 0
                ? `${state.rolls} left`
                : formatCountdown(state.nextResetAt - now)}
            </span>
          </button>
          <button
            className={`btn claim ${windowOpen && remaining < 10_000 ? "urgent" : ""}`}
            disabled={!windowOpen || owned || state.current?.claimed || claimWait > 0}
            onClick={doClaim}
          >
            Claim
            {claimWait > 0 ? (
              <span className="timer">{formatCountdown(claimWait)}</span>
            ) : windowOpen ? (
              <span className="timer">{Math.ceil(remaining / 1000)}s</span>
            ) : null}
            {windowOpen ? (
              <i
                className="claim-bar"
                style={{ width: `${(remaining / CLAIM_WINDOW_MS) * 100}%` }}
              />
            ) : null}
          </button>
        </div>'''

new = '''        <button
          className="roll-btn"
          onClick={doRoll}
          disabled={state.rolls < 1}
        >
          <span className="roll-label">Roll</span>
          <span className="roll-count">
            ×{state.rolls > 0 ? state.rolls : formatCountdown(state.nextResetAt - now)}
          </span>
        </button>

        <div className="under-row">
          <span className="under-rate">
            <b>{rollsPerReset(state)}</b> this hour
          </span>
          <button
            className="claim-btn"
            disabled={!windowOpen || owned || state.current?.claimed || claimWait > 0}
            onClick={doClaim}
          >
            Claim
            {claimWait > 0 ? ` · ${formatCountdown(claimWait)}` : windowOpen ? ` · ${Math.ceil(remaining / 1000)}s` : ""}
            {windowOpen ? (
              <i
                className="claim-bar"
                style={{ width: `${(remaining / CLAIM_WINDOW_MS) * 100}%` }}
              />
            ) : null}
          </button>
        </div>'''

if s.count(old) != 1:
    print("MISS controls"); sys.exit(1)
s = s.replace(old, new)
io.open(p, "w", encoding="utf-8", newline="\n").write(s)
print("roll button replaced")
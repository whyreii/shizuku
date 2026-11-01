import io

# --- remove the SaaS-ish empty-state CTA in Collection ---------------------
p = "src/components/Panels.tsx"
s = io.open(p, encoding="utf-8").read()
s = s.replace(
    """  if (owned.length === 0) {
    return (
      <div className="empty-state">
        <p className="empty">No cards yet.</p>
        <button className="mini-link" onClick={onRoll}>
          roll to start
        </button>
      </div>
    );
  }""",
    """  if (owned.length === 0) {
    return <p className="empty">No cards claimed yet.</p>;
  }""",
)
io.open(p, "w", encoding="utf-8", newline="\n").write(s)

# --- ledger styles --------------------------------------------------------
c = "src/styles.css"
css = io.open(c, encoding="utf-8").read()
css += """

/* badges as a ledger, not a pricing table */
.ledger-line {
  margin: 0;
  font-size: 11.5px;
  color: var(--muted);
}

.ledger {
  display: flex;
  flex-direction: column;
  border-top: 1px solid var(--line);
}

.ledger-head,
.ledger-row {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 56px 92px;
  align-items: center;
  gap: 12px;
  padding: 9px 2px;
  border-bottom: 1px solid var(--line-soft);
}

.ledger-head {
  font-size: 9px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--line-hi);
  border-bottom-color: var(--line);
}

.ledger-row {
  width: 100%;
  background: none;
  border-left: 0;
  border-right: 0;
  border-top: 0;
  text-align: left;
  cursor: pointer;
  color: var(--paper);
}

.ledger-row:hover {
  background: rgba(255, 255, 255, 0.02);
}

.ledger-row.is-locked {
  color: var(--muted);
}

.ledger-name {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 13px;
  min-width: 0;
}

.ledger-cost {
  text-align: right;
  font-size: 12px;
  color: var(--muted);
}
"""
io.open(c, "w", encoding="utf-8", newline="\n").write(css)
print("badges ledger + empty state simplified")

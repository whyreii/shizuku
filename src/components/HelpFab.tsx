import { useState } from "react";
import { Modal } from "./Modal";
import { bandTable, tierClass } from "../engine/tiers";
import { rarityShifts, rollableCap, rollableSize } from "../engine/game";
import { sections } from "./helpSections";
import type { GameState } from "../engine/types";
import { getCoverage } from "../engine/images";

const SHORTCUTS: [string, string][] = [
  ["Space", "roll"],
  ["C", "claim"],
  ["/", "search collection"],
  ["Esc", "close dialog"],
];

export function HelpFab({ state }: { state: GameState }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        className="help-fab"
        onClick={() => setOpen(true)}
        aria-label="Guide, odds and shortcuts"
        title="Guide"
      >
        ?
      </button>

      {open ? (
        <Modal
          title="Guide"
          subtitle="how Shizuku works"
          onClose={() => setOpen(false)}
          wide
          footer={
            <button className="link" onClick={() => setOpen(false)}>
              close
            </button>
          }
        >
          <div className="guide">
            {sections(state).map((section) => (
              <section key={section.title} className="guide-section">
                <h3>{section.title}</h3>
                <ul>
                  {section.lines.map((line) => (
                    <li key={line}>{line}</li>
                  ))}
                </ul>
              </section>
            ))}

            <section className="guide-section">
              <h3>rarity ladder</h3>
              <div className="rates">
                <div className="rates-head">
                  <span>band</span>
                  <span>per card</span>
                  <span>band total</span>
                </div>
                {bandTable(rarityShifts(state), rollableCap(state), rollableSize(state)).map((row) => (
                  <div className="rate-row" key={row.label}>
                    <span className={`mini-tier ${tierClass(row.tier)}`}>
                      {row.tier}
                    </span>
                    <span className="rate-band">{row.label}</span>
                    <span className="rate-pct">
                      {(row.perCharacter * 100).toFixed(3)}%
                    </span>
                    <span className="rate-band-total">
                      {(row.bandTotal * 100).toFixed(2)}%
                    </span>
                  </div>
                ))}
              </div>
            </section>

            <section className="guide-section">
              <h3>portraits</h3>
              <p className="guide-coverage">
                {getCoverage().matched} of {getCoverage().attempted} lookups
                matched · mismatches fall back to the initial card
              </p>
            </section>

            <section className="guide-section">
              <h3>shortcuts</h3>
              <div className="shortcuts">
                {SHORTCUTS.map(([key, label]) => (
                  <div key={key}>
                    <kbd>{key}</kbd>
                    <span>{label}</span>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </Modal>
      ) : null}
    </>
  );
}

import { useState } from "react";
import { Modal } from "./Modal";
import {
  BADGE_DEFS,
  badgeLocked,
  badgePrice,
  buyBadge,
  claimDaily,
  DAILY_ROLLS,
  dailyAvailable,
  formatCountdown,
  formatKakera,
} from "../engine/game";
import type { BadgeKey, GameState } from "../engine/types";
import { Icon } from "./Icon";

interface Props {
  state: GameState;
  act: (fn: (s: GameState, now: number) => GameState) => GameState | null;
}

const ORDER: BadgeKey[] = [
  "bronze",
  "silver",
  "gold",
  "sapphire",
  "ruby",
  "emerald",
  "diamond",
];

const GLYPHS: Record<BadgeKey, React.ReactNode> = {
  /* sleet: a drop with a cutting diagonal */
  bronze: (
    <>
      <path d="M12 3.5 16.4 8a6.2 6.2 0 1 1-8.8 0Z" />
      <path d="m6.5 17.5 11-11" />
    </>
  ),
  /* hail: three stones falling */
  silver: (
    <>
      <circle cx="9" cy="8" r="2.1" />
      <circle cx="15.5" cy="11.5" r="2.5" />
      <circle cx="10" cy="16" r="1.8" />
    </>
  ),
  /* glaze: a smooth poured surface */
  gold: (
    <>
      <path d="M4 13.5c2.6-4 5.2-4 7.8 0s5.2 4 8.2 0" />
      <path d="M4 18c2.6-4 5.2-4 7.8 0s5.2 4 8.2 0" opacity=".6" />
      <path d="M12 3.5v5" />
    </>
  ),
  /* frost: a six-arm crystal */
  sapphire: (
    <>
      <path d="M12 3v18" />
      <path d="m4.2 7.5 15.6 9" />
      <path d="m19.8 7.5-15.6 9" />
    </>
  ),
  /* blizzard: driving wind */
  ruby: (
    <>
      <path d="M3.5 8h9.2a2.4 2.4 0 1 0-2.4-2.4" />
      <path d="M3.5 12.5h13a2.2 2.2 0 1 1-2.2 2.2" />
      <path d="M3.5 17h7" opacity=".6" />
    </>
  ),
  /* glacier: a calved block */
  emerald: (
    <>
      <path d="m3.5 19 5.5-11 3.4 6.2L15 8.5l5.5 10.5Z" />
      <path d="M6.5 19h11" opacity=".5" />
    </>
  ),
  /* aurora: three ribbons */
  diamond: (
    <>
      <path d="M3.5 7.5c3-3 6 3 9 0s6-3 8 0" />
      <path d="M3.5 12c3-3 6 3 9 0s6-3 8 0" opacity=".7" />
      <path d="M3.5 16.5c3-3 6 3 9 0s6-3 8 0" opacity=".45" />
    </>
  ),
};

export function BadgesPanel({ state, act }: Props) {
  const [open, setOpen] = useState<BadgeKey | null>(null);
  const [justClaimed, setJustClaimed] = useState<number | null>(null);
  const selected = open ? BADGE_DEFS[open] : null;
  const selectedLevel = open ? state.badges[open] : 0;
  const selectedLock = open ? badgeLocked(state, open) : null;
  const selectedPrice = open ? badgePrice(state, open) : 0;

  const levels = ORDER.reduce((sum, key) => sum + state.badges[key], 0);
  const dailyWait = dailyAvailable(state, Date.now());

  return (
    <div className="stack panel-grid">
      <h2 className="panel-title">Medals</h2>
      <div className="medal-head">
        <b>{levels}</b>
        <i>/ 28</i>
        <span>levels</span>
      </div>

      <div className="medal-wall">
        {ORDER.map((key) => {
          const def = BADGE_DEFS[key];
          const level = state.badges[key];
          const lock = badgeLocked(state, key);
          const price = badgePrice(state, key);
          const maxed = level >= 4;
          const next = !maxed && !lock && state.kakigori >= price;

          return (
            <button
              key={key}
              type="button"
              className={`medal ${key}${level > 0 ? " lit" : ""}${
                next ? " ready" : ""
              }${lock && !maxed ? " locked" : ""}`}
              onClick={() => setOpen(key)}
              title={def.label}
            >
              <span className="medal-shape">
                <span className="medal-hex">
                  <svg
                    className="medal-glyph"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    {GLYPHS[key]}
                  </svg>
                </span>
              </span>
              <span className="medal-notches">
                {[1, 2, 3, 4].map((n) => (
                  <i key={n} className={n <= level ? "on" : ""} />
                ))}
              </span>
              <b className="medal-name">{def.label}</b>
              <span className="medal-price">
                {maxed ? (
                  "maxed"
                ) : lock ? (
                  "locked"
                ) : (
                  <>
                    <Icon name="kakigori" size={12} />
                    {formatKakera(price)}
                  </>
                )}
              </span>
            </button>
          );
        })}
      </div>

      <button
        type="button"
        className="daily-drop"
        disabled={dailyWait > 0}
        onClick={() => {
          const before = state.kakigori;
          const next = act((s, t) => claimDaily(s, t));
          if (next) {
            setJustClaimed(Math.round(next.kakigori - before));
            window.setTimeout(() => setJustClaimed(null), 4000);
          }
        }}
      >
        <span className="daily-glyph" aria-hidden="true" />
        <span className="daily-text">
          <b>daily</b>
          <i>
            {justClaimed !== null
              ? `+${formatKakera(justClaimed)} · +${DAILY_ROLLS} rolls`
              : dailyWait > 0
                ? `in ${formatCountdown(dailyWait)}`
                : "claim"}
          </i>
        </span>
      </button>

      {open && selected ? (
        <Modal
          title={selected.label}
          subtitle={`level ${selectedLevel} of 4 · ${selected.x.toLocaleString()} per level`}
          onClose={() => setOpen(null)}
          footer={
            <>
              <button className="link" onClick={() => setOpen(null)}>
                close
              </button>
              <button
                className="btn primary"
                disabled={
                  selectedLevel >= 4 ||
                  Boolean(selectedLock) ||
                  state.kakigori < selectedPrice
                }
                onClick={() => {
                  act((s) => buyBadge(s, open));
                  setOpen(null);
                }}
              >
                {selectedLevel >= 4
                  ? "Maxed"
                  : `Buy · ${formatKakera(selectedPrice)}`}
              </button>
            </>
          }
        >
          <ol className="perk-list">
            {selected.perks.map((perk, index) => (
              <li key={perk + index} className={index < selectedLevel ? "owned" : ""}>
                <span className="perk-level">{index + 1}</span>
                <span>{perk}</span>
              </li>
            ))}
          </ol>

          {selectedLock ? (
            <p className="modal-text" style={{ marginTop: 12 }}>
              {selectedLock}
            </p>
          ) : null}
        </Modal>
      ) : null}
    </div>
  );
}

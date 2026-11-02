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
import { Icon, type IconName } from "./Icon";

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

/** The approved carved-ice glyphs, one per medal. */
const MEDAL_ICON: Record<BadgeKey, IconName> = {
  bronze: "sleet",
  silver: "hail",
  gold: "glaze",
  sapphire: "frost",
  ruby: "blizzard",
  emerald: "glacier",
  diamond: "aurora",
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
                  <Icon
                    name={MEDAL_ICON[key]}
                    size={56}
                    className="medal-glyph"
                  />
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

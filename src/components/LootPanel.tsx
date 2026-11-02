import { useState } from "react";
import {
  BADGE_DEFS,
  LOOT_COST,
  formatKakera,
  lootGate,
  openLoot,
  type LootReward,
} from "../engine/game";
import { Icon } from "./Icon";
import type { GameState } from "../engine/types";

interface Props {
  state: GameState;
  act: (fn: (s: GameState, now: number) => GameState) => GameState | null;
}

export function LootPanel({ state, act }: Props) {
  const gate = lootGate(state);
  const [results, setResults] = useState<LootReward[]>([]);

  const open = (count: number) => {
    act((s) => {
      const { state: updated, rewards } = openLoot(s, count);
      setResults(rewards);
      return updated;
    });
  };

  if (gate) {
    return (
      <div className="stack panel-grid">
        <h2 className="panel-title">Loot</h2>
        <div className="loot-box is-locked">
          <span className="loot-seal" aria-hidden="true" />
          <Icon name="loot" size={38} />
          <span className="loot-lock">
            <b>Sealed</b>
            <i>raise Frost, Blizzard and Glacier to Lv 1</i>
          </span>
          <ul className="loot-req">
            {(["sapphire", "ruby", "emerald"] as const).map((key) => (
              <li
                key={key}
                className={state.badges[key] >= 1 ? "on" : ""}
              >
                {BADGE_DEFS[key].label}
                <em>Lv 1</em>
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  }

  return (
    <div className="stack panel-grid">
      <h2 className="panel-title">Loot</h2>
      <div className="loot-box">
        <span className="loot-glow" aria-hidden="true" />
        <Icon name="loot" size={38} />
        <span className="loot-price">{formatKakera(LOOT_COST)}</span>
      </div>

      <div className="loot-keys">
        <button
          type="button"
          className="loot-key"
          disabled={state.kakigori < LOOT_COST}
          onClick={() => open(1)}
        >
          open one
        </button>
        <button
          type="button"
          className="loot-key is-bulk"
          disabled={state.kakigori < LOOT_COST * 10}
          onClick={() => open(10)}
        >
          open ten
          <span>{formatKakera(LOOT_COST * 10)}</span>
        </button>
      </div>

      {results.length > 0 ? (
        <div className="loot-pull">
          {results.map((reward, index) => (
            <span key={`${reward.label}-${index}`} className={`loot-chip ${reward.kind}`}>
              <i>{reward.kind}</i>
              {reward.label}
            </span>
          ))}
        </div>
      ) : (
        <p className="loot-empty">nothing pulled yet</p>
      )}
    </div>
  );
}

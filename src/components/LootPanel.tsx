import { useState } from "react";
import {
  BADGE_DEFS,
  LOOT_COST,
  LOOT_KINDS,
  formatKakera,
  lootGate,
  openLoot,
  type LootReward,
} from "../engine/game";
import { LootChest } from "./LootChest";
import type { GameState } from "../engine/types";

interface Props {
  state: GameState;
  act: (fn: (s: GameState, now: number) => GameState) => GameState | null;
}

/** Readable names for the reward categories a loot can pay out. */
const KIND_LABEL: Record<string, string> = {
  kakigori: "kakigori",
  rolls: "rolls",
  claim: "claim reset",
  crystal: "crystals",
  shard: "shards",
};

export function LootPanel({ state, act }: Props) {
  const gate = lootGate(state);
  const reqKeys = ["sapphire", "ruby", "emerald"] as const;
  const met = reqKeys.filter((key) => state.badges[key] >= 1).length;
  const inside = LOOT_KINDS.map((kind) => KIND_LABEL[kind] ?? kind).join(" \u00B7 ");
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
          <LootChest size={132} sealed />
          <span className="loot-lock">
            <b>Sealed</b>
            <i>raise Frost, Blizzard and Glacier to Lv 1</i>
          </span>
          <span className="loot-count">
            {met} / 3 <i>requirements</i>
          </span>
          <ul className="loot-req">
            {reqKeys.map((key) => (
              <li
                key={key}
                className={state.badges[key] >= 1 ? "on" : ""}
              >
                {BADGE_DEFS[key].label}
                <em>Lv 1</em>
              </li>
            ))}
          </ul>
          <p className="loot-contains">contains {inside}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="stack panel-grid">
      <h2 className="panel-title">Loot</h2>
      <div className="loot-box">
        <span className="loot-glow" aria-hidden="true" />
        <LootChest size={132} />
        <span className="loot-price">{formatKakera(LOOT_COST)}</span>
      </div>
      <p className="loot-contains">contains {inside}</p>

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

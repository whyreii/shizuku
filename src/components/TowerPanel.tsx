import { useEffect, useRef, useState } from "react";
import {
  TOWER_FLOORS,
  TOWER_PERKS,
  buildFloor,
  destroyTower,
  formatKakera,
  towerCanBuild,
  towerCost,
  towerPerkCount,
} from "../engine/game";
import { useConfirm } from "./useConfirm";
import type { GameState } from "../engine/types";

interface Props {
  state: GameState;
  act: (fn: (s: GameState, now: number) => GameState) => GameState | null;
}

export function TowerPanel({ state, act }: Props) {
  const { ask, dialog } = useConfirm();
  const cost = towerCost(state);
  const inBasin = state.tower.floors % TOWER_FLOORS;
  const tier = Math.floor(state.tower.floors / TOWER_FLOORS) + 1;
  const fresh = state.tower.floors > 0 && inBasin === 0;
  const filled = fresh ? TOWER_FLOORS : inBasin;
  const affordable = state.kakigori >= cost;
  const gridRef = useRef<HTMLDivElement>(null);
  const [scrolling, setScrolling] = useState(false);

  useEffect(() => {
    const el = gridRef.current;
    if (!el) return;
    const check = () => setScrolling(el.scrollHeight > el.clientHeight + 1);
    check();
    const observer = new ResizeObserver(check);
    observer.observe(el);
    window.addEventListener("resize", check);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", check);
    };
  }, []);

  return (
    <div className="stack panel-grid">
      <h2 className="panel-title">Fountain</h2>
      <div className="basin">
        <div className="basin-shell" aria-hidden="true">
          <div
            className="basin-water"
            style={{ height: `${(filled / TOWER_FLOORS) * 100}%` }}
          >
            <span className="basin-wave" />
          </div>
          <div className="basin-ticks">
            {Array.from({ length: TOWER_FLOORS }).map((_, i) => (
              <i key={i} className={i < filled ? "on" : ""} />
            ))}
          </div>
        </div>
        <div className="basin-body">
          <div className="basin-left">
            <span className="basin-title">
              fountain <b>{filled} / {TOWER_FLOORS}</b>
            </span>
            <span className="basin-sub">
              tier {tier} · basins filled
            </span>
          </div>
          <span className="basin-tag">next basin · {formatKakera(cost)}</span>
        </div>
      </div>

      <div
        ref={gridRef}
        className={scrolling ? "perk-grid is-scrolling" : "perk-grid"}
      >
        {TOWER_PERKS.map((perk) => {
          const stacks = towerPerkCount(state, perk.id);
          const canBuild = towerCanBuild(state, perk.id);
          const blocked = !canBuild;
          const poor = canBuild && !affordable;

          return (
            <button
              key={perk.id}
              type="button"
              className={`perk-tile${stacks > 0 ? " owned" : ""}${
                blocked ? " spent" : ""
              }${poor ? " poor" : ""}${canBuild && !poor ? " can" : ""}`}
              disabled={blocked || poor}
              onClick={() => act((s) => buildFloor(s, perk.id))}
              title={
                blocked
                  ? "Already built in this fountain"
                  : poor
                    ? `Needs ${formatKakera(cost - state.kakigori)} more`
                    : `Build for ${formatKakera(cost)}`
              }
            >
              <span className="perk-num">{perk.id}</span>
              <span className="perk-label">{perk.label}</span>
              <span className="perk-blurb">{perk.blurb}</span>
              <span className="perk-price">
                {blocked ? "built" : formatKakera(cost)}
              </span>
              {stacks > 0 ? (
                <span className="perk-stacks">
                  {Array.from({ length: Math.min(stacks, 5) }).map((_, i) => (
                    <i key={i} />
                  ))}
                  {stacks > 5 ? <em>×{stacks}</em> : null}
                </span>
              ) : null}
            </button>
          );
        })}
      </div>

      {state.tower.spent > 0 ? (
        <button
          className="drain"
          onClick={() =>
            ask({
              title: "Drain the fountain?",
              body: `Refunds ${formatKakera(
                state.tower.spent,
              )} kakigori and resets every basin you built.`,
              confirmLabel: "Drain",
              danger: true,
              onConfirm: () => act((s) => destroyTower(s)),
            })
          }
        >
          drain fountain · refund {formatKakera(state.tower.spent)}
        </button>
      ) : null}

      {dialog}
    </div>
  );
}

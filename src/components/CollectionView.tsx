import { useMemo, useState } from "react";
import { CharacterSheet } from "./CharacterSheet";
import { Modal } from "./Modal";
import { useVirtualRows } from "./useVirtualRows";
import {
  collectionValue,
  divorce,
  formatKakera,
  keysFor,
} from "../engine/game";
import { usePortrait } from "../engine/images";
import { ROSTER, characterById, rankValue } from "../engine/roster";
import { tierClass, tierForRank } from "../engine/tiers";
import type { Character, GameState, SortKey } from "../engine/types";

interface Props {
  state: GameState;
  act: (fn: (s: GameState, now: number) => GameState) => GameState | null;
  actUndo?: (fn: (s: GameState, now: number) => GameState, label: string) => GameState | null;
  onClose: () => void;
}

function Tile({
  state,
  char,
  owned,
  onOpen,
}: {
  state: GameState;
  char: Character;
  owned: boolean;
  onOpen?: () => void;
}) {
  const portrait = usePortrait(char.name, char.series, char.id, !char.image) ?? char.image ?? null;
  const tier = tierForRank(char.rank);
  const alias = state.overrides[char.id]?.alias;

  if (!owned) {
    return (
      <div className="tile tile-empty">
        <span className="tile-missing">empty</span>
        <span className="tile-rank">#{char.rank}</span>
      </div>
    );
  }

  return (
    <button type="button" className={`tile ${tierClass(tier)}`} onClick={onOpen}>
      <div className="tile-art">
        {portrait ? <img src={portrait} alt="" draggable={false} /> : null}
        <span className={`tile-tier ${tierClass(tier)}`}>{tier}</span>
      </div>
      <div className="tile-body">
        <span className="tile-name">{alias ?? char.name}</span>
        <span className="tile-meta">
          #{char.rank} · {formatKakera(rankValue(char.rank))}
        </span>
      </div>
    </button>
  );
}

function WideRow({
  state,
  char,
  onOpen,
}: {
  state: GameState;
  char: Character;
  onOpen: () => void;
}) {
  const portrait = usePortrait(char.name, char.series, char.id, !char.image) ?? char.image ?? null;
  const owned = Boolean(state.owned[char.id]);
  const tier = tierForRank(char.rank);

  return (
    <button
      type="button"
      className={`wide-row ${owned ? "" : "is-missing"}`}
      onClick={() => (owned ? onOpen() : undefined)}
    >
      <span className="wide-card">
        <span className="wide-thumb">
          {portrait ? <img alt="" src={portrait} draggable={false} /> : null}
        </span>
        <span className="wide-name">
          {state.overrides[char.id]?.alias ?? char.name}
        </span>
      </span>
      <span className={`wide-rank ${tierClass(tier)}`}>#{char.rank}</span>
      <span className="wide-series">{char.series}</span>
      <span className="wide-value">{formatKakera(rankValue(char.rank))}</span>
      <span className="wide-keys">{owned ? keysFor(state, char.id) : "—"}</span>
    </button>
  );
}

export function CollectionView({ state, act, actUndo, onClose }: Props) {
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortKey>("value");
  const [view, setView] = useState<"list" | "grid">("grid");
  const [series, setSeries] = useState("all");
  const [selected, setSelected] = useState<string | null>(null);
  const owned = useMemo(
    () =>
      ROSTER.filter((c) => state.owned[c.id]).sort((a, b) => {
        if (sort === "value") return b.rank - a.rank;
        if (sort === "recent")
          return (state.owned[b.id]?.claimedAt ?? 0) - (state.owned[a.id]?.claimedAt ?? 0);
        if (sort === "series")
          return a.series.localeCompare(b.series) || a.rank - b.rank;
        return a.rank - b.rank;
      }),
    [state.owned, sort],
  );

  const ownedSeries = useMemo(
    () => [...new Set(owned.map((c) => c.series))].sort(),
    [owned],
  );

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = owned;
    if (series !== "all") {
      list = ROSTER.filter((c) => c.series === series).sort((a, b) => a.rank - b.rank);
    }
    if (!q) return list;
    return list.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.series.toLowerCase().includes(q) ||
        (state.overrides[c.id]?.alias ?? "").toLowerCase().includes(q),
    );
  }, [owned, series, query, state.overrides]);

  const windowed = useVirtualRows(rows.length, 47, 420);
  const selectedChar = selected ? characterById(selected) : undefined;
  const missing = series === "all" ? 0 : rows.filter((c) => !state.owned[c.id]).length;

  return (
    <Modal
      title="Collection"
      subtitle={`${owned.length} owned · ${ownedSeries.length} series · ${formatKakera(
        collectionValue(state),
      )} value`}
      onClose={onClose}
      wide
      footer={
        <button className="link" onClick={onClose}>
          close
        </button>
      }
    >
      <div className="collection-wide">
        <div className="collection-tools">
          <input
            placeholder="Search name or series..."
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />

          <div className="collection-filters">
            <div className="chips">
              {(["value", "rank", "recent", "series"] as SortKey[]).map((key) => (
                <button
                  key={key}
                  className={`chip-btn ${sort === key ? "on" : ""}`}
                  onClick={() => setSort(key)}
                >
                  {key}
                </button>
              ))}
            </div>

            <div className="view-toggle">
              <button
                className={`chip-btn ${view === "list" ? "on" : ""}`}
                onClick={() => setView("list")}
              >
                list
              </button>
              <button
                className={`chip-btn ${view === "grid" ? "on" : ""}`}
                onClick={() => setView("grid")}
              >
                grid
              </button>
            </div>
          </div>

          <select
            value={series}
            onChange={(event) => setSeries(event.target.value)}
            aria-label="Filter by series"
          >
            <option value="all">All series ({owned.length} owned)</option>
            {ownedSeries.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>

          {series !== "all" ? (
            <p className="collection-note">
              {rows.length - missing} of {rows.length} collected · {missing} empty
            </p>
          ) : null}
        </div>

        {view === "list" ? (
          <div className="wide-table" onScroll={windowed.onScroll}>
            <div className="wide-head">
              <span>card</span>
              <span>rank</span>
              <span>series</span>
              <span>value</span>
              <span>shards</span>
            </div>
            {rows.length === 0 ? (
              <p className="empty">no match</p>
            ) : (
              <>
                <div style={{ height: windowed.padTop }} />
                {rows.slice(windowed.start, windowed.end).map((char) => (
                  <WideRow
                    key={char.id}
                    state={state}
                    char={char}
                    onOpen={() => setSelected(char.id)}
                  />
                ))}
                <div style={{ height: windowed.padBottom }} />
              </>
            )}
          </div>
        ) : (
          <div className="tile-grid tile-shelf">
            {rows.length === 0 ? (
              <p className="empty">no match</p>
            ) : (
              rows.map((char) => (
                <Tile
                  key={char.id}
                  state={state}
                  char={char}
                  owned={Boolean(state.owned[char.id])}
                  onOpen={() => setSelected(char.id)}
                />
              ))
            )}
          </div>
        )}
      </div>

      {selectedChar ? (
        <CharacterSheet
          state={state}
          char={selectedChar}
          act={act}
          onDivorce={() => {
            if (actUndo) {
              actUndo(
                (s) => divorce(s, selectedChar.id),
                `Divorced ${selectedChar.name}`,
              );
            } else {
              act((s) => divorce(s, selectedChar.id));
            }
            setSelected(null);
          }}
          onClose={() => setSelected(null)}
        />
      ) : null}
    </Modal>
  );
}

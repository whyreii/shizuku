import { useEffect, useMemo, useState } from "react";
import { CharacterSheet } from "./CharacterSheet";
import { useConfirm } from "./useConfirm";
import { Icon } from "./Icon";
import { usePortrait } from "../engine/images";
import {
  divorce,
  formatKakera,
  keysFor,
  toggleStarwish,
  toggleWish,
  wishCap,
} from "../engine/game";
import { ROSTER, characterById, rankValue } from "../engine/roster";
import { tierClass, tierForRank } from "../engine/tiers";
import { titleCase } from "./SeriesGrid";
import type { Character, GameState } from "../engine/types";

interface Props {
  state: GameState;
  series: string;
  act: (fn: (s: GameState, now: number) => GameState) => GameState | null;
  actUndo?: (fn: (s: GameState, now: number) => GameState, label: string) => GameState | null;
  onBack: () => void;
}

type Filter = "all" | "owned" | "missing" | "wished";
type Sort = "rank" | "name" | "value";

/** One series, shown as a gallery you can wish and starwish from. */
export function SeriesPage({ state, series, act, actUndo, onBack }: Props) {
  const { ask, dialog } = useConfirm();
  const [selected, setSelected] = useState<string[]>([]);
  const [openChar, setOpenChar] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [sort, setSort] = useState<Sort>("rank");
  const [limit, setLimit] = useState(180);

  useEffect(() => {
    setLimit(180);
  }, [filter, query, sort]);

  const chars = useMemo(
    () => ROSTER.filter((c) => c.series === series).sort((a, b) => a.rank - b.rank),
    [series],
  );

  const owned = chars.filter((c) => state.owned[c.id]);
  const cap = wishCap(state);
  const full = state.wishes.length >= cap;

  const counts = useMemo(
    () => ({
      all: chars.length,
      owned: chars.filter((c) => state.owned[c.id]).length,
      missing: chars.filter((c) => !state.owned[c.id]).length,
      wished: chars.filter((c) => state.wishes.includes(c.id)).length,
    }),
    [chars, state.owned, state.wishes],
  );

  const shown = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = chars.filter((c) => {
      if (filter === "owned" && !state.owned[c.id]) return false;
      if (filter === "missing" && state.owned[c.id]) return false;
      if (filter === "wished" && !state.wishes.includes(c.id)) return false;
      if (!q) return true;
      const alias = state.overrides[c.id]?.alias ?? "";
      return (
        c.name.toLowerCase().includes(q) || alias.toLowerCase().includes(q)
      );
    });
    if (sort === "name") {
      return [...list].sort((a, b) =>
        (state.overrides[a.id]?.alias ?? a.name).localeCompare(
          state.overrides[b.id]?.alias ?? b.name,
        ),
      );
    }
    if (sort === "value") {
      return [...list].sort((a, b) => rankValue(b.rank) - rankValue(a.rank));
    }
    return list;
  }, [chars, filter, query, sort, state.owned, state.wishes, state.overrides]);

  const toggleSelect = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const wishSelected = () => {
    act((s) => {
      let next = s;
      for (const id of selected) {
        if (!next.wishes.includes(id)) next = toggleWish(next, id);
      }
      return next;
    });
    setSelected([]);
  };

  const setStar = (char: Character) => {
    if (state.starwish === char.id) {
      ask({
        title: "Clear starwish?",
        body: `${char.name} will no longer be your starwish.`,
        confirmLabel: "Clear",
        onConfirm: () => act((s) => toggleStarwish(s, char.id)),
      });
      return;
    }
    const current = state.starwish ? characterById(state.starwish) : null;
    if (current && current.id !== char.id) {
      ask({
        title: `Replace ${current.name}?`,
        body: `Only one starwish exists at a time. ${current.name} will be replaced by ${char.name}.`,
        confirmLabel: "Replace",
        onConfirm: () => act((s) => toggleStarwish(s, char.id)),
      });
      return;
    }
    act((s) => toggleStarwish(s, char.id));
  };

  const openOrSelect = (char: Character) => {
    const isOwned = Boolean(state.owned[char.id]);
    if (state.wishes.includes(char.id)) {
      ask({
        title: `Unwish ${char.name}?`,
        body: "Removes it from your wishlist. You can add it again any time.",
        confirmLabel: "Unwish",
        onConfirm: () => {
          act((s) => toggleWish(s, char.id));
          setSelected((prev) => prev.filter((x) => x !== char.id));
        },
      });
      return;
    }
    if (isOwned) {
      setOpenChar(char.id);
      return;
    }
    toggleSelect(char.id);
  };

  const selectedChar = openChar ? characterById(openChar) : undefined;

  return (
    <div className="series-page">
      <div className="series-page-head">
        <div className="series-page-titlerow">
          <div className="series-page-titles">
            <div className="series-titleline">
              <h2 className="series-page-title">{titleCase(series)}</h2>
              <p className="series-page-meta">
                <b>{owned.length}</b> / {chars.length} collected
                <i />
                {counts.missing} missing
                <i />
                {formatKakera(
                  owned.reduce((sum, c) => sum + rankValue(c.rank), 0),
                )}{" "}
                value
              </p>
            </div>
          </div>

          <button
            type="button"
            className="series-back"
            aria-label="back to every series"
            title="back to every series"
            onClick={onBack}
          >
            <Icon name="back" size={15} />
          </button>
        </div>

        <div className="series-tools">
          <input
            className="series-find"
            placeholder="find in this series"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />

          <div className="seg series-seg" role="group" aria-label="filter">
            {(["all", "owned", "missing", "wished"] as Filter[]).map((key) => (
              <button
                key={key}
                type="button"
                className={filter === key ? "seg-btn on" : "seg-btn"}
                aria-pressed={filter === key}
                onClick={() => setFilter(key)}
              >
                {key}
                <i>{counts[key]}</i>
              </button>
            ))}
          </div>

          <label className="series-sort">
            <span>sort</span>
            <select
              value={sort}
              onChange={(event) => setSort(event.target.value as Sort)}
            >
              <option value="rank">rank</option>
              <option value="name">name</option>
              <option value="value">value</option>
            </select>
          </label>
        </div>
      </div>

      <div className="series-scroll">
      {shown.length === 0 ? (
        <p className="empty series-none">nothing here</p>
      ) : (
        <div className="series-gallery">
          {shown.slice(0, limit).map((char) => {
            const isOwned = Boolean(state.owned[char.id]);
            return (
              <SeriesCard
                key={char.id}
                char={char}
                owned={isOwned}
                wished={state.wishes.includes(char.id)}
                starred={state.starwish === char.id}
                picked={selected.includes(char.id)}
                alias={state.overrides[char.id]?.alias}
                keys={keysFor(state, char.id)}
                onOpen={() => openOrSelect(char)}
                onStar={() => setStar(char)}
              />
            );
          })}
        </div>
      )}

      {shown.length > limit ? (
        <button
          type="button"
          className="series-more"
          onClick={() => setLimit((n) => n + 180)}
        >
          show more · {shown.length - limit} left
        </button>
      ) : null}

      </div>
      <div className="series-page-foot">
        <span className="series-page-wishes">
          <b>{selected.length}</b> selected
          <i />
          wishes <b>{state.wishes.length}</b> / {cap}
        </span>

        {selected.length > 0 ? (
          <button
            type="button"
            className="series-clear"
            onClick={() => setSelected([])}
          >
            clear
          </button>
        ) : null}

        <button
          type="button"
          className="btn primary"
          disabled={selected.length === 0 || full}
          onClick={wishSelected}
          title={full ? "wishlist is full" : "add the selected cards to your wishlist"}
        >
          wish selected ({selected.length})
        </button>

        <button type="button" className="series-back-link" onClick={onBack}>
          back to series
        </button>
      </div>

      {dialog}

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
            setOpenChar(null);
          }}
          onClose={() => setOpenChar(null)}
        />
      ) : null}
    </div>
  );
}

function SeriesCard({
  char,
  owned,
  wished,
  starred,
  picked,
  alias,
  keys,
  onOpen,
  onStar,
}: {
  char: Character;
  owned: boolean;
  wished: boolean;
  starred: boolean;
  picked: boolean;
  alias?: string;
  keys: number;
  onOpen: () => void;
  onStar: () => void;
}) {
  const portrait =
    usePortrait(char.name, char.series, char.id, !char.image) ?? char.image ?? null;
  const tier = tierForRank(char.rank);
  const name = alias ?? char.name;

  return (
    <div
      className={`serie-card ${owned ? "is-owned" : "is-missing"}${
        picked ? " is-picked" : ""
      }`}
    >
      <button
        type="button"
        className="serie-hit"
        onClick={onOpen}
        title={
          owned
            ? `${name} · open`
            : wished
              ? `${name} · unwish`
              : `${name} · select to wish`
        }
      >
        <span className="serie-art">
          {portrait ? (
            <img src={portrait} alt="" loading="lazy" draggable={false} />
          ) : (
            <span className="serie-blank" aria-hidden="true">
              {char.name.trim().charAt(0).toUpperCase()}
            </span>
          )}
          {owned ? (
            <span className={`serie-tier ${tierClass(tier)}`}>{tier}</span>
          ) : null}
          {wished ? <span className="card-flag wish-flag soft">WISH</span> : null}
        </span>
        <span className="serie-name">{name}</span>
        <span className="serie-meta">
          #{char.rank}
          {owned ? ` · ${keys} shards` : ""}
        </span>
      </button>

      <button
        type="button"
        className={starred ? "serie-star on" : "serie-star"}
        aria-label={starred ? `clear starwish ${name}` : `starwish ${name}`}
        title={
          starred
            ? "clear starwish"
            : owned
              ? "starwish · farm it for shards"
              : "starwish"
        }
        onClick={onStar}
      >
        <Icon name="star" size={13} />
      </button>
    </div>
  );
}

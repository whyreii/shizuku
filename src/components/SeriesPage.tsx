import { useMemo, useState } from "react";
import { CharacterSheet } from "./CharacterSheet";
import { useConfirm } from "./useConfirm";
import { Icon } from "./Icon";
import { titleCase } from "./SeriesGrid";
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
import type { Character, GameState } from "../engine/types";

interface Props {
  state: GameState;
  series: string;
  act: (fn: (s: GameState, now: number) => GameState) => GameState | null;
  actUndo?: (fn: (s: GameState, now: number) => GameState, label: string) => GameState | null;
  onBack: () => void;
}

/** One series, shown as a gallery you can wish and starwish from. */
export function SeriesPage({ state, series, act, actUndo, onBack }: Props) {
  const { ask, dialog } = useConfirm();
  const [selected, setSelected] = useState<string[]>([]);
  const [openChar, setOpenChar] = useState<string | null>(null);

  const chars = useMemo(
    () => ROSTER.filter((c) => c.series === series).sort((a, b) => a.rank - b.rank),
    [series],
  );

  const owned = chars.filter((c) => state.owned[c.id]);
  const missing = chars.length - owned.length;
  const value = owned.reduce((sum, c) => sum + rankValue(c.rank), 0);
  const cap = wishCap(state);
  const full = state.wishes.length >= cap;

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
        <button type="button" className="series-back" onClick={onBack}>
          series
        </button>
        <div className="series-page-titles">
          <h2 className="series-page-title">{titleCase(series)}</h2>
          <p className="series-page-meta">
            <b>{owned.length}</b> / {chars.length} collected
            <i />
            {missing} missing
            <i />
            {formatKakera(value)} value
          </p>
        </div>
      </div>

      <div className="series-gallery">
        {chars.map((char) => {
          const isOwned = Boolean(state.owned[char.id]);
          const wished = state.wishes.includes(char.id);
          const starred = state.starwish === char.id;
          const picked = selected.includes(char.id);
          return (
            <SeriesCard
              key={char.id}
              char={char}
              owned={isOwned}
              wished={wished}
              starred={starred}
              picked={picked}
              alias={state.overrides[char.id]?.alias}
              keys={keysFor(state, char.id)}
              onOpen={() => openOrSelect(char)}
              onStar={() => setStar(char)}
            />
          );
        })}
      </div>

      <div className="series-page-foot">
        <span className="series-page-wishes">
          wishes <b>{state.wishes.length}</b> / {cap}
        </span>
        <button
          type="button"
          className="btn primary"
          disabled={selected.length === 0 || full}
          onClick={wishSelected}
          title={full ? "wishlist is full" : "add the selected cards to your wishlist"}
        >
          wish selected ({selected.length})
        </button>
        <button type="button" className="series-back" onClick={onBack}>
          back
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
          {wished ? <span className="serie-wished">wish</span> : null}
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
        title={starred ? "clear starwish" : owned ? "starwish · farm it for shards" : "starwish"}
        onClick={onStar}
      >
        <Icon name="star" size={13} />
      </button>
    </div>
  );
}

import { useMemo, useState } from "react";
import { CharacterSheet } from "./CharacterSheet";
import { Modal } from "./Modal";
import { Tile } from "./Tile";
import { useConfirm } from "./useConfirm";
import {
  divorce,
  formatKakera,
  toggleStarwish,
  toggleWish,
  wishCap,
} from "../engine/game";
import { ROSTER, characterById, rankValue } from "../engine/roster";
import type { GameState } from "../engine/types";

interface Props {
  state: GameState;
  series: string;
  act: (fn: (s: GameState, now: number) => GameState) => GameState | null;
  actUndo?: (fn: (s: GameState, now: number) => GameState, label: string) => GameState | null;
  onClose: () => void;
}

/** Series index: every character in a series, with multi-select wishing. */
export function SeriesSheet({ state, series, act, actUndo, onClose }: Props) {
  const { ask, dialog } = useConfirm();
  const [selected, setSelected] = useState<string[]>([]);
  const [openChar, setOpenChar] = useState<string | null>(null);

  const chars = useMemo(
    () => ROSTER.filter((c) => c.series === series).sort((a, b) => a.rank - b.rank),
    [series],
  );

  const owned = chars.filter((c) => state.owned[c.id]);
  const missing = chars.filter((c) => !state.owned[c.id]);
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

  const selectedChar = openChar ? characterById(openChar) : undefined;

  return (
    <Modal
      title={series}
      subtitle={`${owned.length}/${chars.length} collected · ${
        missing.length
      } missing · ${formatKakera(
        owned.reduce((sum, c) => sum + rankValue(c.rank), 0),
      )} value`}
      onClose={onClose}
      wide
      footer={
        <>
          <span className="sheet-counter">
            wishes {state.wishes.length}/{cap}
          </span>
          <button
            className="link"
            disabled={selected.length === 0 || full}
            onClick={wishSelected}
          >
            wish selected ({selected.length})
          </button>
          <button className="link" onClick={onClose}>
            close
          </button>
        </>
      }
    >
      {full ? (
        <p className="collection-note" style={{ marginBottom: 10 }}>
          wishlist full — {cap}/{cap}
        </p>
      ) : (
        <p className="collection-note" style={{ marginBottom: 10 }}>
          tap a missing tile to select · tap a WISHED tile to unwish
        </p>
      )}

      <div className="tile-grid">
        {chars.map((char) => (
          <Tile
            key={char.id}
            state={state}
            char={char}
            owned={Boolean(state.owned[char.id])}
            selected={selected.includes(char.id)}
            wished={state.wishes.includes(char.id)}
            starwish={state.starwish === char.id}
            onOpen={() => setOpenChar(char.id)}
            onStar={() => {
              if (state.starwish === char.id) {
                ask({
                  title: "Clear starwish?",
                  body: `${char.name} will no longer be your starwish.`,
                  confirmLabel: "Clear",
                  onConfirm: () => act((st) => toggleStarwish(st, char.id)),
                });
                return;
              }
              const currentStar = state.starwish
                ? characterById(state.starwish)
                : null;
              if (currentStar && currentStar.id !== char.id) {
                ask({
                  title: `Replace ${currentStar.name}?`,
                  body: `Only one starwish exists at a time. ${currentStar.name} will be replaced by ${char.name}.`,
                  confirmLabel: "Replace",
                  onConfirm: () => act((st) => toggleStarwish(st, char.id)),
                });
                return;
              }
              act((st) => toggleStarwish(st, char.id));
            }}
            onToggle={() => {
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
              } else {
                toggleSelect(char.id);
              }
            }}
          />
        ))}
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
    </Modal>
  );
}

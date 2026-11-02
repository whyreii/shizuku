import { useMemo, useState } from "react";
import {
  applyPreset,
  deletePreset,
  divorce,
  keysFor,
  savePreset,
  toggleStarwish,
  toggleWish,
  wishCap,
  wishMultiplier,
  starwishMultiplier,
} from "../engine/game";
import { ROSTER, characterAtRank, characterById, seriesIndex } from "../engine/roster";
import { tierClass, tierForRank } from "../engine/tiers";
import { PlinthArt } from "./EmptyArt";
import { usePortrait } from "../engine/images";
import { CharacterSheet } from "./CharacterSheet";
import { SeriesSheet } from "./SeriesSheet";
import { Tile } from "./Tile";
import { useConfirm } from "./useConfirm";
import type { Character, GameState, SortKey } from "../engine/types";

interface PanelProps {
  state: GameState;
  act: (fn: (s: GameState, now: number) => GameState) => GameState | null;
}

export function CollectionPanel({
  state,
  act,
  actUndo,
}: PanelProps & {
  actUndo?: (fn: (s: GameState, now: number) => GameState, label: string) => GameState | null;
}) {
  const [query, setQuery] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const [sort, setSort] = useState<SortKey>('value');
  const [onlyKeys, setOnlyKeys] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);
  const owned = useMemo(
    () =>
      ROSTER.filter((c) => state.owned[c.id]).sort((a, b) => {
        if (sort === 'value') return b.rank - a.rank;
        if (sort === 'recent')
          return (state.owned[b.id]?.claimedAt ?? 0) - (state.owned[a.id]?.claimedAt ?? 0);
        if (sort === 'series')
          return a.series.localeCompare(b.series) || a.rank - b.rank;
        return a.rank - b.rank;
      }),
    [state.owned, sort],
  );

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return owned.filter((c) => {
      if (onlyKeys && keysFor(state, c.id) === 0) return false;
      if (!q) return true;
      return (
        c.name.toLowerCase().includes(q) ||
        c.series.toLowerCase().includes(q) ||
        (state.overrides[c.id]?.alias ?? '').toLowerCase().includes(q)
      );
    });
  }, [owned, query, onlyKeys, state.overrides, state]);





  if (owned.length === 0) {
    return <p className="empty">no claims yet</p>;
  }

  return (
    <div className='stack'>

      <div className='album-tools'>
        {searchOpen ? (
          <input
            autoFocus
            placeholder="Search name or series"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onBlur={() => {
              if (!query) setSearchOpen(false);
            }}
          />
        ) : (
          <button
            type='button'
            className='tool-key'
            onClick={() => setSearchOpen(true)}
            aria-label='Search'
          >
            <svg viewBox='0 0 24 24' width='14' height='14' aria-hidden='true'>
              <circle cx='11' cy='11' r='6.4' fill='none' stroke='currentColor' strokeWidth='1.8' />
              <path d='m16 16 4 4' fill='none' stroke='currentColor' strokeWidth='1.8' strokeLinecap='round' />
            </svg>
            search
          </button>
        )}

        <button
          type='button'
          className='tool-key is-sort'
          onClick={() =>
            setSort((k) =>
              k === 'value' ? 'rank' : k === 'rank' ? 'recent' : 'value',
            )
          }
        >
          <span className='tool-key-label'>sort</span>
          <b>{sort}</b>
        </button>

        <button
          type='button'
          className={'tool-key ' + (onlyKeys ? 'on' : '')}
          onClick={() => setOnlyKeys((v) => !v)}
        >
          shards
        </button>
      </div>

      <div className='album-body'>

      <div className='album-head'>
        <span className='album-label'>Album</span>
        <span className='album-count'>{owned.length}</span>
      </div>

      <div className='tile-grid tile-shelf'>
        {rows.length === 0 ? (
          <p className='empty'>no match</p>
        ) : (
          rows.map((c) => (
            <Tile
              key={c.id}
              state={state}
              char={c}
              owned
              wished={state.wishes.includes(c.id)}
              starwish={state.starwish === c.id}
              onOpen={() => setSelected(c.id)}
            />
          ))
        )}
      </div>

      </div>

      {selected && characterById(selected) ? (
        <CharacterSheet
          state={state}
          char={characterById(selected)!}
          act={act}
          onDivorce={() => {
            const char = characterById(selected)!;
            if (actUndo) {
              actUndo((s) => divorce(s, char.id), `Divorced ${char.name}`);
            } else {
              act((s) => divorce(s, char.id));
            }
          }}
          onClose={() => setSelected(null)}
        />
      ) : null}
    </div>
  );
}


function CardFace({ char }: { char: Character }) {
  const portrait = usePortrait(char.name, char.series, char.id, !char.image);
  const src = portrait ?? char.image ?? null;
  return (
    <span
      className={src ? "cardface" : "cardface is-back"}
      style={src ? { backgroundImage: `url("${src}")` } : undefined}
    />
  );
}

export function WishlistPanel({ state, act }: PanelProps) {
  const { ask, dialog } = useConfirm();
  const cap = wishCap(state);
  const star = state.starwish ? characterById(state.starwish) : undefined;
  const others = useMemo(
    () => ROSTER.filter((c) => state.wishes.includes(c.id) && c.id !== state.starwish),
    [state.wishes, state.starwish],
  );
  const starBoost = starwishMultiplier(state);
  const wishBoost = wishMultiplier(state);
  const [naming, setNaming] = useState(false);
  const [draft, setDraft] = useState("");

  // the preset whose lineup matches what is on the plinth right now
  const activePreset = state.presets.find(
    (p) =>
      p.starwish === state.starwish &&
      p.wishes.length === state.wishes.length &&
      p.wishes.every((id) => state.wishes.includes(id)),
  );

  const commitPreset = () => {
    const name = draft.trim();
    if (!name) return;
    const next = act((s) => savePreset(s, name));
    if (next) {
      setNaming(false);
      setDraft("");
    }
  };

  const makeStar = (c: Character) => {
    if (star && star.id !== c.id) {
      ask({
        title: `Replace ${star.name}?`,
        body: `Only one starwish exists at a time. ${star.name} will be replaced by ${c.name}.`,
        confirmLabel: "Replace",
        onConfirm: () => act((s) => toggleStarwish(s, c.id)),
      });
      return;
    }
    act((s) => toggleStarwish(s, c.id));
  };

  return (
    <div className="stack panel-grid">
      <h2 className="panel-title">Wishes</h2>
      <div className={star ? "plinth lit" : "plinth"}>
        <div className="plinth-glow" aria-hidden="true" />
        <div className="plinth-stage">
        <button
          type="button"
          className={star ? "plinth-card" : "plinth-card is-empty"}
          onClick={() => {
            if (!star) return;
            ask({
              title: "Clear starwish?",
              body: `${star.name} will no longer be your starwish.`,
              confirmLabel: "Clear",
              onConfirm: () => act((s) => toggleStarwish(s, star.id)),
            });
          }}
          title={star ? `${star.name} · clear starwish` : "no starwish"}
        >
          {star ? (
            <>
              <CardFace char={star} />
              <span className="plinth-name">{star.name}</span>
              <span className="plinth-series">{star.series}</span>
            </>
          ) : (
            <span className="plinth-empty">no starwish</span>
          )}
        </button>

        <span className="plinth-stand" aria-hidden="true" />

        <div className="plinth-base">
          <span className="plinth-bar">
            <i style={{ width: `${Math.min(100, (starBoost - 1) * 100)}%` }} />
          </span>
          {star && starBoost > 1 ? (
            <span className="plinth-mult">+{Math.round((starBoost - 1) * 100)}%</span>
          ) : null}
        </div>
        </div>
      </div>

      <div className="wish-meta">
        <b>{state.wishes.length}</b>
        <i>/ {cap} wishes</i>
        {wishBoost > 1 ? (
          <span>+{Math.round((wishBoost - 1) * 100)}% on wishes</span>
        ) : null}
      </div>

      <div className="preset-row">
        <span className="preset-label">presets</span>

        {state.presets.map((preset) => (
          <span
            key={preset.id}
            className={preset.id === activePreset?.id ? "preset-chip on" : "preset-chip"}
          >
            <button
              type="button"
              className="preset-apply"
              title={`apply ${preset.name} - ${preset.wishes.length} wishes`}
              onClick={() => act((s) => applyPreset(s, preset.id))}
            >
              {preset.name}
              <i>{preset.wishes.length}</i>
            </button>
            <button
              type="button"
              className="preset-del"
              title={`delete ${preset.name}`}
              aria-label={`delete ${preset.name}`}
              onClick={() => act((s) => deletePreset(s, preset.id))}
            >
              
×
            </button>
          </span>
        ))}

        {naming ? (
          <span className="preset-save">
            <input
              autoFocus
              className="preset-input"
              value={draft}
              maxLength={24}
              placeholder="name"
              onChange={(event) => setDraft(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") commitPreset();
                if (event.key === "Escape") {
                  setNaming(false);
                  setDraft("");
                }
              }}
            />
            <button
              type="button"
              className="preset-confirm"
              onClick={commitPreset}
              disabled={!draft.trim()}
            >
              save
            </button>
          </span>
        ) : (
          <button
            type="button"
            className="preset-add"
            onClick={() => setNaming(true)}
          >
            save current
          </button>
        )}
      </div>

      {others.length === 0 && !star ? (
        <div className="wish-empty">
          <PlinthArt />
          <span>the plinth is empty</span>
          <p>pick one in series — it takes the stand</p>
        </div>
      ) : null}

      <div className="wish-fan">
        {Array.from({ length: cap }).map((_, slot) => {
          const id = state.wishes[slot];
          const c = id ? characterById(id) : undefined;
          if (!c) {
            return (
              <span
                className="wish-slot"
                key={`slot-${slot}`}
                aria-hidden="true"
              />
            );
          }
          const isStar = state.starwish === c.id;
          return (
            <span
              className={isStar ? "wish-item is-star" : "wish-item"}
              key={c.id}
            >
              <button
                type="button"
                className="wish-card"
                onClick={() => {
                  if (!isStar) makeStar(c);
                }}
                title={
                  isStar
                    ? `${c.name} is the starwish`
                    : `Make ${c.name} the starwish`
                }
              >
                <CardFace char={c} />
                <span className="wish-card-name">{c.name}</span>
              </button>
              <button
                type="button"
                className="wish-x"
                aria-label={`Unwish ${c.name}`}
                onClick={() =>
                  ask({
                    title: `Unwish ${c.name}?`,
                    body: "This removes the character from your wishlist. You can add it again any time.",
                    confirmLabel: "Unwish",
                    onConfirm: () => act((s) => toggleWish(s, c.id)),
                  })
                }
              >
                &#215;
              </button>
            </span>
          );
        })}
      </div>

      {dialog}
    </div>
  );
}

export function SeriesPanel({
  state,
  act,
  actUndo,
}: PanelProps & {
  actUndo?: (fn: (s: GameState, now: number) => GameState, label: string) => GameState | null;
}) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState<string | null>(null);
  const rows = useMemo(() => {
    const all = seriesIndex();
    const q = query.trim().toLowerCase();
    return q ? all.filter((r) => r.series.toLowerCase().includes(q)) : all;
  }, [query]);

  const ownedBySeries = useMemo(() => {
    const map = new Map<string, number>();
    for (const c of ROSTER) {
      if (state.owned[c.id]) map.set(c.series, (map.get(c.series) ?? 0) + 1);
    }
    return map;
  }, [state.owned]);

  const charRows = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return ROSTER.filter((c) => c.name.toLowerCase().includes(q)).slice(0, 4);
  }, [query]);

  const covers = useMemo(() => {
    const map = new Map<string, Character>();
    for (const c of ROSTER) {
      const cur = map.get(c.series);
      if (!cur || c.rank < cur.rank) map.set(c.series, c);
    }
    return map;
  }, []);

  return (
    <div className="stack">
      <h2 className="panel-title">Series</h2>
      <input
        placeholder="Search series or character"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      {charRows.length > 0 ? (
        <div className="series-chars">
          <span className="series-sub">characters</span>
          {charRows.map((c) => (
            <button
              type="button"
              className="series-row"
              key={c.id}
              onClick={() => setOpen(c.series)}
            >
              <span className="series-name">{c.name}</span>
              <span className="series-count">{c.series}</span>
            </button>
          ))}
        </div>
      ) : null}

      <div className="series-wall">
        {rows.length === 0 ? (
          <p className="empty">no match</p>
        ) : (
          rows.slice(0, 120).map((row) => {
            const owned = ownedBySeries.get(row.series) ?? 0;
            const pct = Math.round((owned / Math.max(1, row.count)) * 100);
            return (
              <button
                type="button"
                className={`series-card${owned > 0 ? " has" : ""}${
                  query.trim() ? " matched" : ""
                }`}
                key={row.series}
                onClick={() => setOpen(row.series)}
              >
                <SeriesCover char={covers.get(row.series) ?? null} />
                <span className="series-info">
                  <b>{titleCase(row.series)}</b>
                  <span className="series-bar">
                    <i style={{ width: `${pct}%` }} />
                  </span>
                  <em>
                    {owned} / {row.count}
                  </em>
                </span>
              </button>
            );
          })
        )}
      </div>

      {open ? (
        <SeriesSheet
          state={state}
          series={open}
          act={act}
          actUndo={actUndo}
          onClose={() => setOpen(null)}
        />
      ) : null}
    </div>
  );
}

function titleCase(name: string): string {
  if (name !== name.toUpperCase()) return name;
  return name
    .toLowerCase()
    .replace(/\b\p{L}/gu, (c) => c.toUpperCase());
}

function SeriesCover({ char }: { char: Character | null }) {
  const portrait = usePortrait(
    char?.name ?? "",
    char?.series,
    char?.id,
    Boolean(char) && !char?.image,
  );
  const src = portrait ?? char?.image ?? null;
  return (
    <span
      className={src ? "series-cover" : "series-cover is-back"}
      style={src ? { backgroundImage: `url("${src}")` } : undefined}
    />
  );
}

function RippleArt({ char }: { char: Character | null }) {
  const portrait = usePortrait(
    char?.name ?? "",
    char?.series,
    char?.id,
    Boolean(char) && !char?.image,
  );
  const src = portrait ?? char?.image ?? null;

  return (
    <span className="ripple-art">
      {src ? (
        <img src={src} alt="" draggable={false} />
      ) : (
        <i className="ripple-back" />
      )}
    </span>
  );
}

function groupByDay(
  lines: GameState["log"],
): { key: string; label: string; lines: GameState["log"] }[] {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  const out: { key: string; label: string; lines: GameState["log"] }[] = [];
  for (const line of lines) {
    const at = new Date(line.at);
    const key = at.toDateString();
    let entry = out.find((g) => g.key === key);
    if (!entry) {
      const label =
        key === today.toDateString()
          ? "today"
          : key === yesterday.toDateString()
            ? "yesterday"
            : at.toLocaleDateString([], { month: "short", day: "numeric" });
      entry = { key, label, lines: [] };
      out.push(entry);
    }
    entry.lines.push(line);
  }
  return out;
}

const RIPPLE_VERB: Record<string, string> = {
  claim: "claim",
  key: "shard",
  power: "fountain",
  info: "note",
};

export function LogPanel({ state }: PanelProps) {
  const byName = useMemo(() => {
    const map = new Map<string, Character>();
    for (const c of ROSTER) map.set(c.name, c);
    return map;
  }, []);

  return (
    <div className="ripple-panel">
      <h2 className="panel-title">Ripples</h2>
      <div className="stack ripple-stack">
      <div className="shift-line">
        <b>{state.stats.rolls}</b> {state.stats.rolls === 1 ? "roll" : "rolls"}
        <i />
        <b>{state.stats.claims}</b>{" "}
        {state.stats.claims === 1 ? "claim" : "claims"}
        <i />
        <b>{state.stats.keys}</b> {state.stats.keys === 1 ? "shard" : "shards"}
      </div>

      <div className="ripples">
        {state.log.length === 0 ? (
          <p className="empty">nothing yet</p>
        ) : (
          groupByDay(state.log).map((group) => (
            <div className="day-group" key={group.key}>
              <span className="day-sep">{group.label}</span>
              {group.lines.map((line) => {
                const m = /#(\d+)/.exec(line.text);
                const rank = m ? Number(m[1]) : null;
                const named = line.text
                  .replace(/^#\d+\s*/, "")
                  .replace(/^(claimed|divorced)\s+/, "")
                  .replace(/\s*\(.*$/, "")
                  .replace(/^shard\s*\S*\s*/, "")
                  .trim();
                const char =
                  (rank ? characterAtRank(rank) : undefined) ??
                  byName.get(named) ??
                  null;

                return (
                  <div
                    key={line.id}
                    className={`ripple tone-${line.tone} ${
                      rank ? tierClass(tierForRank(rank)) : ""
                    }`}
                  >
                    <RippleArt char={char} />
                    <span className="ripple-body">
                      <b>{rank ? "roll" : (RIPPLE_VERB[line.tone] ?? "note")}</b>
                      <div className="ripple-line">
                        <span>{line.text.replace(/^#\d+\s*/, "")}</span>
                        <time>
                          {new Date(line.at).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </time>
                      </div>
                    </span>
                  </div>
                );
              })}
            </div>
          ))
        )}
      </div>
      </div>
    </div>
  );
}

import { useMemo, useState } from "react";
import { usePortrait } from "../engine/images";
import { ROSTER, seriesIndex } from "../engine/roster";
import type { Character, GameState } from "../engine/types";

interface Props {
  state: GameState;
  onOpen: (series: string) => void;
}

export function titleCase(name: string): string {
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

/** The series index: a wall of covers. Picking one opens its gallery page. */
export function SeriesGrid({ state, onOpen }: Props) {
  const [query, setQuery] = useState("");

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
              onClick={() => onOpen(c.series)}
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
                onClick={() => onOpen(row.series)}
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
    </div>
  );
}

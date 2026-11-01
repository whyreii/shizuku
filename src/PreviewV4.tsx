import { useEffect, useMemo, useState, type CSSProperties } from "react";
import { Card3D } from "./components/Card3D";
import { Icon } from "./components/Icon";
import {
  BADGE_DEFS,
  LOOT_COST,
  TOWER_PERKS,
  formatKakera,
} from "./engine/game";
import { ROSTER, characterAtRank, seriesIndex } from "./engine/roster";
import { usePortrait } from "./engine/images";
import { tierClass, tierForRank } from "./engine/tiers";
import type { Character } from "./engine/types";
import "./preview4.css";

/**
 * Layout study v4 - "it reads like a game, not a dashboard".
 *
 * One DOM, seven frames. The card (Card3D) and the artwork are the real ones;
 * badge names, fountain perks and loot prices come from the engine. Nothing
 * here ships to the app.
 */

const RANKS = [
  2, 3, 4, 10, 11, 14, 21, 22, 31, 33, 41, 43, 53, 54, 103, 105, 202, 203, 401,
  402, 702, 703,
];

const CHARS = RANKS.map((rank) => characterAtRank(rank)).filter(
  (char): char is Character => Boolean(char),
);

const PAGES = [
  { id: "album", label: "Collection" },
  { id: "wishes", label: "Wishes" },
  { id: "badges", label: "Badges" },
  { id: "fountain", label: "Fountain" },
  { id: "loot", label: "Loot" },
  { id: "series", label: "Series" },
  { id: "log", label: "Log" },
] as const;

type PageId = (typeof PAGES)[number]["id"];

const PAGE_META: Record<
  PageId,
  { icon: "album" | "wish" | "badge" | "fountain" | "loot" | "series" | "log"; hint: string }
> = {
  album: { icon: "album", hint: "22 cards" },
  wishes: { icon: "wish", hint: "4 of 6" },
  badges: { icon: "badge", hint: "13 of 28" },
  fountain: { icon: "fountain", hint: "7 of 12" },
  loot: { icon: "loot", hint: "1,000" },
  series: { icon: "series", hint: "834" },
  log: { icon: "log", hint: "40 entries" },
};

const VARIANTS = [
  { id: "a", label: "Art wall", note: "no captions, no chrome" },
  { id: "b", label: "Arcade", note: "physical button, display numbers" },
  { id: "c", label: "Spotlight", note: "the reveal stage" },
  { id: "d", label: "Reel", note: "slot the card in" },
  { id: "e", label: "Binder", note: "two open pages" },
  { id: "f", label: "Duel", note: "card against card" },
  { id: "g", label: "Capsule", note: "turn the crank" },
] as const;

type VariantId = (typeof VARIANTS)[number]["id"];

function usePortraitFor(char: Character): string | null {
  return usePortrait(char.name, char.series, char.id, !char.image) ?? char.image ?? null;
}

function RowArt({ char }: { char: Character }) {
  const portrait = usePortraitFor(char);
  return (
    <span className="arc-art">
      {portrait ? <img src={portrait} alt="" draggable={false} /> : null}
    </span>
  );
}

function ShelfTile({ char }: { char: Character }) {
  const portrait = usePortraitFor(char);
  const tier = tierForRank(char.rank);

  return (
    <button type="button" className={`v4-tile ${tierClass(tier)}`}>
      {portrait ? (
        <img src={portrait} alt="" draggable={false} />
      ) : (
        <span className="v4-tile-initial">
          {char.name.trim().charAt(0).toUpperCase()}
        </span>
      )}
      <span className="v4-tile-rank">#{char.rank}</span>
      <span className="v4-tile-name">{char.name}</span>
    </button>
  );
}

function RecentThumb({ char }: { char: Character }) {
  const portrait = usePortraitFor(char);
  return (
    <i
      style={
        portrait
          ? ({ backgroundImage: `url("${portrait}")` } as CSSProperties)
          : undefined
      }
    />
  );
}

function Peek({ char, cls }: { char: Character; cls: string }) {
  const portrait = usePortraitFor(char);
  return (
    <span
      className={`v4-peek ${cls}`}
      aria-hidden="true"
      style={
        portrait
          ? ({ backgroundImage: `url("${portrait}")` } as CSSProperties)
          : undefined
      }
    />
  );
}

/* ------------------------------------------------------------------
   Arcade pages. Same column, different contents.
   ------------------------------------------------------------------ */

const BADGE_ORDER = Object.keys(BADGE_DEFS) as (keyof typeof BADGE_DEFS)[];
const BADGE_LEVELS = [4, 3, 2, 1, 1, 0, 0];
const PERK_STACKS = [4, 2, 3, 1, 5, 2, 0, 1, 0, 2, 3, 0, 1];

function WishesPage() {
  const star = CHARS[0];
  const rest = CHARS.slice(1, 4);

  return (
    <div className="arc-page">
      <div className="arc-head">
        <h2>Wishes</h2>
        <span className="arc-count">
          4<i>/ 6 slots</i>
        </span>
      </div>

      <div className="arc-list">
        <div className="arc-row is-star">
          <RowArt char={star} />
          <div className="arc-who">
            <b>{star.name}</b>
            <span>{star.series}</span>
          </div>
          <span className="arc-tag">starwish</span>
          <span className="arc-mult">&#215;2.50</span>
        </div>

        {rest.map((char, i) => (
          <div className="arc-row" key={char.id}>
            <RowArt char={char} />
            <div className="arc-who">
              <b>{char.name}</b>
              <span>{char.series}</span>
            </div>
            <span className="arc-mult">&#215;{(2.5 - i * 0.1).toFixed(2)}</span>
          </div>
        ))}
      </div>

      <div className="arc-stats">
        <div>
          <span>wish boost</span>
          <b>+150%</b>
        </div>
        <div>
          <span>starwish</span>
          <b>+169%</b>
        </div>
        <div>
          <span>free slots</span>
          <b>2</b>
        </div>
      </div>
    </div>
  );
}

function BadgesPage() {
  return (
    <div className="arc-page">
      <div className="arc-head">
        <h2>Badges</h2>
        <span className="arc-count">
          13<i>/ 28 levels</i>
        </span>
      </div>

      <div className="arc-list">
        {BADGE_ORDER.map((key, i) => {
          const def = BADGE_DEFS[key];
          const level = BADGE_LEVELS[i];
          const maxed = level >= 4;
          return (
            <div className="arc-badge" key={key}>
              <span className="arc-badge-name">{def.label}</span>
              <span className="arc-levels">
                {[1, 2, 3, 4].map((n) => (
                  <i key={n} className={n <= level ? "on" : ""} />
                ))}
              </span>
              <span className="arc-price">
                {maxed ? "maxed" : formatKakera(def.x * (level + 1))}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function FountainPage() {
  return (
    <div className="arc-page">
      <div className="arc-basin">
        <b>7</b>
        <span>/ 12 basins</span>
        <em>next 35,000</em>
      </div>

      <div className="arc-perks">
        {TOWER_PERKS.map((perk, i) => (
          <div className="arc-perk" key={perk.id}>
            <b>{perk.id}</b>
            <span>{perk.blurb}</span>
            <i className={PERK_STACKS[i] ? "on" : ""}>{PERK_STACKS[i]}</i>
          </div>
        ))}
      </div>
    </div>
  );
}

function LootPage() {
  return (
    <div className="arc-page">
      <div className="arc-loot">
        <div className="arc-box">
          <Icon name="loot" size={34} />
        </div>
        <div className="arc-loot-btns">
          <button type="button" className="arc-btn">
            open 1 <span>{formatKakera(LOOT_COST)}</span>
          </button>
          <button type="button" className="arc-btn is-main">
            open 10 <span>{formatKakera(LOOT_COST * 10)}</span>
          </button>
        </div>
      </div>

      <div className="arc-list">
        {[
          ["crystal", "+180 kakigori"],
          ["shard", "Albedo +1"],
          ["rolls", "+3 rolls"],
        ].map(([kind, label]) => (
          <div className="arc-row" key={label}>
            <span className={`arc-kind ${kind}`}>{kind}</span>
            <span className="arc-who">
              <b>{label}</b>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function SeriesPage() {
  const [query, setQuery] = useState("");
  const index = useMemo(() => seriesIndex(), []);
  const q = query.trim().toLowerCase();

  const matchSeries = useMemo(
    () => (q ? index.filter((row) => row.series.toLowerCase().includes(q)) : index).slice(0, 8),
    [index, q],
  );

  const matchChars = useMemo(
    () => (q ? ROSTER.filter((char) => char.name.toLowerCase().includes(q)).slice(0, 4) : []),
    [q],
  );

  const peak = Math.max(1, ...matchSeries.map((row) => row.count));

  return (
    <div className="arc-page">
      <div className="arc-head">
        <h2>Series</h2>
        <span className="arc-count">
          {index.length}
          <i>tracked</i>
        </span>
      </div>

      <label className="arc-search">
        <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true">
          <circle cx="11" cy="11" r="6.4" fill="none" stroke="currentColor" strokeWidth="1.8" />
          <path d="m16 16 4 4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search series or character"
        />
      </label>

      <div className="arc-list">
        {matchChars.length > 0 ? (
          <span className="arc-sub">characters</span>
        ) : null}

        {matchChars.map((char) => (
          <div className="arc-row" key={char.id}>
            <RowArt char={char} />
            <div className="arc-who">
              <b>{char.name}</b>
              <span>{char.series}</span>
            </div>
            <span className="arc-mult">#{char.rank}</span>
          </div>
        ))}

        <span className="arc-sub">{q ? "series" : "largest series"}</span>

        {matchSeries.length === 0 ? (
          <p className="arc-empty">Nothing matches "{query.trim()}".</p>
        ) : (
          matchSeries.map((row) => (
            <div className="arc-series-row" key={row.series}>
              <span className="arc-series-name">{row.series}</span>
              <span className="arc-bar">
                <i style={{ width: `${Math.round((row.count / peak) * 100)}%` }} />
              </span>
              <span className="arc-series-count">{row.count}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function LogPage() {
  const lines: [string, string, string][] = [
    ["2m", "claimed", "Zero Two"],
    ["9m", "shard +1", "Albedo"],
    ["14m", "crystal", "+180 kakigori"],
    ["21m", "rolled", "Makima"],
    ["38m", "badge", "Hail II"],
    ["52m", "divorced", "Reze"],
  ];

  return (
    <div className="arc-page">
      <div className="arc-head">
        <h2>Log</h2>
        <span className="arc-count">
          40<i>entries</i>
        </span>
      </div>

      <div className="arc-log">
        {lines.map(([t, what, who]) => (
          <div className="arc-log-line" key={t + who}>
            <span className="t">{t}</span>
            <span className="what">{what}</span>
            <b>{who}</b>
          </div>
        ))}
      </div>
    </div>
  );
}

function Page({ page }: { page: PageId }) {
  if (page === "wishes") return <WishesPage />;
  if (page === "badges") return <BadgesPage />;
  if (page === "fountain") return <FountainPage />;
  if (page === "loot") return <LootPage />;
  if (page === "series") return <SeriesPage />;
  if (page === "log") return <LogPage />;
  return null;
}

export default function PreviewV4() {
  const [variant, setVariant] = useState<VariantId>("b");
  const [page, setPage] = useState<PageId>("album");
  const [menuOpen, setMenuOpen] = useState(false);
  const hero = CHARS[0];

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
      if (event.key.toLowerCase() === "m") setMenuOpen((open) => !open);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);
  const heroPortrait = usePortraitFor(hero);

  const pick = (next: VariantId) => {
    setVariant(next);
    setPage("album");
    setMenuOpen(false);
  };

  return (
    <div className={`v4 v-${variant}`}>
      <div
        className="v4-bg"
        aria-hidden="true"
        style={
          heroPortrait
            ? ({ backgroundImage: `url("${heroPortrait}")` } as CSSProperties)
            : undefined
        }
      />

      {variant === "b" ? (
        <nav className="v4-rail" aria-label="Panels">
          {PAGES.map((entry) => {
            const meta = PAGE_META[entry.id];
            return (
              <button
                key={entry.id}
                type="button"
                className={
                  page === entry.id ? "v4-rail-item on" : "v4-rail-item"
                }
                onClick={() => setPage(entry.id)}
              >
                <Icon name={meta.icon} size={20} />
                {entry.label}
              </button>
            );
          })}
        </nav>
      ) : null}

      <header className="v4-top">
        <div className="v4-mark">
          <span className="v4-drop" aria-hidden="true" />
          <h1>Shizuku</h1>
        </div>

        {variant !== "b" ? (
          <nav className="v4-nav" aria-label="Panels">
            {PAGES.map((entry) => (
              <button
                key={entry.id}
                type="button"
                className={entry.id === "album" ? "v4-nav-item on" : "v4-nav-item"}
              >
                {entry.label}
              </button>
            ))}
          </nav>
        ) : null}

        <div className="v4-wallet">
          <span className="v4-wallet-item">
            <Icon name="kakigori" size={15} />
            <b>{formatKakera(10940)}</b>
          </span>
          <span className="v4-wallet-item">
            <Icon name="rolls" size={15} />
            <b>893</b>
          </span>
        </div>
      </header>

      <main className="v4-main">
        <section className="v4-hero">
          <Peek char={CHARS[1]} cls="p1" />
          <Peek char={CHARS[2]} cls="p2" />
          <Peek char={CHARS[3]} cls="p3" />

          <div className="v4-card">
            <Card3D character={hero} revealKey="v4-hero" />
          </div>

          <div className="v4-headline">
            <h2>{hero.name}</h2>
            <span className="v4-headline-series">{hero.series}</span>
          </div>

          <button type="button" className="v4-roll">
            <span className="v4-roll-label">Roll</span>
            <span className="v4-roll-count">&times;893</span>
          </button>

          <div className="v4-rolls" aria-hidden="true">
            <b>10</b>
            <i>/ 10</i>
            <span>this hour</span>
          </div>

          <div className="v4-readout" aria-hidden="true">
            <div>
              <span>next roll</span>
              <b>
                12<em>m</em>
              </b>
            </div>
            <div>
              <span>kakigori / hr</span>
              <b>331</b>
            </div>
            <div>
              <span>claim</span>
              <b>
                48<em>s</em>
              </b>
            </div>
          </div>

          <div className="v4-chips" aria-hidden="true">
            <i />
            <i />
            <i />
            <span>10,940</span>
          </div>

          <div className="v4-reel" aria-hidden="true">
            <span className="v4-reel-lever" />
          </div>

          <div className="v4-opponent" aria-hidden="true">
            <span className="v4-opponent-label">unrevealed</span>
          </div>

          <span className="v4-vs" aria-hidden="true">
            VS
          </span>

          <div className="v4-machine" aria-hidden="true">
            <span className="v4-dome">
              <i />
              <i />
              <i />
              <i />
              <i />
              <i />
            </span>
            <span className="v4-crank" />
            <span className="v4-chute" />
          </div>

          <div className="v4-recent" aria-hidden="true">
            <span>recent pulls</span>
            <div className="v4-recent-row">
              {CHARS.slice(3, 8).map((char) => (
                <RecentThumb key={char.id} char={char} />
              ))}
            </div>
          </div>

          <div className="v4-beam" aria-hidden="true" />
          <div className="v4-floor" aria-hidden="true" />
        </section>

        <section className="v4-album">
          {page === "album" ? (
            <>
              <header className="v4-album-top">
                <h2>Collection</h2>
                <span className="v4-album-count">{CHARS.length}</span>
              </header>

              <div className="v4-shelf">
                {CHARS.map((char) => (
                  <ShelfTile key={char.id} char={char} />
                ))}
              </div>
            </>
          ) : (
            <Page page={page} />
          )}
        </section>
      </main>

      {variant === "b" && menuOpen ? (
        <div
          className="v4-menu"
          role="dialog"
          aria-label="Panels"
          onClick={() => setMenuOpen(false)}
        >
          <div className="v4-menu-grid" onClick={(event) => event.stopPropagation()}>
            {PAGES.map((entry) => {
              const meta = PAGE_META[entry.id];
              return (
                <button
                  key={entry.id}
                  type="button"
                  className={
                    page === entry.id ? "v4-menu-tile on" : "v4-menu-tile"
                  }
                  onClick={() => {
                    setPage(entry.id);
                    setMenuOpen(false);
                  }}
                >
                  <Icon name={meta.icon} size={26} />
                  <b>{entry.label}</b>
                  <span>{meta.hint}</span>
                </button>
              );
            })}
          </div>
        </div>
      ) : null}

      <div className="v4-switch" role="group" aria-label="Layout direction">
        {VARIANTS.map((v) => (
          <button
            key={v.id}
            type="button"
            className={variant === v.id ? "v4-switch-btn on" : "v4-switch-btn"}
            onClick={() => pick(v.id)}
            title={v.note}
          >
            <b>{v.id.toUpperCase()}</b>
            <span>{v.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

import { useState, type CSSProperties, type ReactNode } from "react";
import { Card3D } from "./components/Card3D";
import { Tile } from "./components/Tile";
import { Icon } from "./components/Icon";
import { createInitialState, formatKakera } from "./engine/game";
import { characterAtRank, ROSTER_SIZE } from "./engine/roster";
import { tierForRank } from "./engine/tiers";
import type { Character, Tier } from "./engine/types";
import "./preview.css";

/**
 * Layout study, not a product surface. It mounts the real Card3D and the real
 * Tile, so whatever the cards look like here is exactly what they look like in
 * the app - only the frame around them is new.
 */

interface Picked {
  char: Character;
  portrait: string;
}

/**
 * Real roster characters, each paired with its own portrait. In production this
 * pairing comes from the build-time roster-images map; it is pinned here only so
 * the study is stable while that map is still being generated.
 */
const PICKS: { rank: number; image: string }[] = [
  { rank: 2, image: "https://s4.anilist.co/file/anilistcdn/character/large/b124381-2gAVq76HPfL2.png" },
  { rank: 3, image: "https://s4.anilist.co/file/anilistcdn/character/large/b88575-Ayu8UPDA8NS6.png" },
  { rank: 4, image: "https://s4.anilist.co/file/anilistcdn/character/large/b497-Yg5pNmC8kxzs.png" },
  { rank: 10, image: "https://s4.anilist.co/file/anilistcdn/character/large/b127222-Jh5hhP7vZ7s1.png" },
  { rank: 11, image: "https://s4.anilist.co/file/anilistcdn/character/large/b137080-UHcynYNjb5ZU.png" },
  { rank: 14, image: "https://s4.anilist.co/file/anilistcdn/character/large/b89122-Gj7MBs7F5cMJ.png" },
  { rank: 21, image: "https://s4.anilist.co/file/anilistcdn/character/large/b127518-NRlq1CQ1v1ro.png" },
  { rank: 22, image: "https://s4.anilist.co/file/anilistcdn/character/large/b90169-4wr1Zehnsac8.png" },
  { rank: 31, image: "https://s4.anilist.co/file/anilistcdn/character/large/b148740-ceAibPxLW8rR.png" },
  { rank: 33, image: "https://s4.anilist.co/file/anilistcdn/character/large/b65239-2S3t2vSyUew9.png" },
  { rank: 41, image: "https://s4.anilist.co/file/anilistcdn/character/large/86-cA1zL7fyls8E.jpg" },
  { rank: 43, image: "https://s4.anilist.co/file/anilistcdn/character/large/b121103-UGLxT8utLPnq.png" },
  { rank: 53, image: "https://s4.anilist.co/file/anilistcdn/character/large/b45627-CR68RyZmddGG.png" },
  { rank: 54, image: "https://s4.anilist.co/file/anilistcdn/character/large/b172759-cccVhJ2fQA92.png" },
  { rank: 103, image: "https://s4.anilist.co/file/anilistcdn/character/large/b257562-Ru35NYPfsqhY.png" },
  { rank: 105, image: "https://s4.anilist.co/file/anilistcdn/character/large/b81931-fmouMoprPVbV.png" },
  { rank: 202, image: "https://s4.anilist.co/file/anilistcdn/character/large/b85-mkVBh2yjxjmx.png" },
  { rank: 203, image: "https://s4.anilist.co/file/anilistcdn/character/large/b8439-5TIyWlfClnMs.png" },
  { rank: 401, image: "https://s4.anilist.co/file/anilistcdn/character/large/b8458-dnVRYCwLLHRn.png" },
  { rank: 402, image: "https://s4.anilist.co/file/anilistcdn/character/large/b89019-sH6Zg8rpfPWD.png" },
  { rank: 702, image: "https://s4.anilist.co/file/anilistcdn/character/large/b89201-K0X5HNq88Oub.png" },
  { rank: 703, image: "https://s4.anilist.co/file/anilistcdn/character/large/b6043-DNEJrW4QOLG2.png" }
];

const PICKED: Picked[] = PICKS.map((pick): Picked | null => {
  const char = characterAtRank(pick.rank);
  if (!char) return null;
  return { char: { ...char, image: pick.image }, portrait: pick.image };
}).filter((entry): entry is Picked => entry !== null);

/* One frozen state for the tiles: the study never mutates anything. */
const BASE = createInitialState(1_760_000_000_000);

const TIERS: Tier[] = ["S+", "S", "A", "B", "C", "D"];

const TIER_VAR: Record<Tier, string> = {
  "S+": "var(--tier-sp)",
  S: "var(--tier-s)",
  A: "var(--tier-a)",
  B: "var(--tier-b)",
  C: "var(--tier-c)",
  D: "var(--tier-d)",
};

const ICONS: Record<string, ReactNode> = {
  album: (
    <>
      <rect x="3.5" y="3.5" width="7.5" height="7.5" rx="2" />
      <rect x="13" y="3.5" width="7.5" height="7.5" rx="2" />
      <rect x="3.5" y="13" width="7.5" height="7.5" rx="2" />
      <rect x="13" y="13" width="7.5" height="7.5" rx="2" />
    </>
  ),
  wishes: (
    <path d="M12 3.1l2.8 5.8 6.3.9-4.6 4.4 1.1 6.3L12 17.6l-5.6 2.9 1.1-6.3L2.9 9.8l6.3-.9Z" />
  ),
  badges: (
    <>
      <path d="M12 2.6 20.2 7.3v9.4L12 21.4 3.8 16.7V7.3Z" />
      <circle cx="12" cy="12" r="2.4" opacity=".6" />
    </>
  ),
  fountain: (
    <>
      <path d="M12 3.6v6.4" />
      <path d="M12 6.2c-2.7 0-4.8 1.9-5.4 4.6" />
      <path d="M12 6.2c2.7 0 4.8 1.9 5.4 4.6" />
      <path d="M3.4 12.6h17.2" />
      <path d="M6.2 12.6v6.2h11.6v-6.2" />
    </>
  ),
  loot: (
    <>
      <path d="M3.6 8.4h16.8v11.7H3.6Z" />
      <path d="M2.4 4.1h19.2v4.3H2.4Z" opacity=".55" />
      <path d="M12 4.1v16" opacity=".55" />
    </>
  ),
  series: (
    <>
      <path d="M4.2 4.6h3.3v14.8H4.2z" />
      <path d="M9.4 4.6h3.3v14.8H9.4z" />
      <path d="M14.1 5.7l3.2-.9 3.5 14.1-3.2.9z" />
    </>
  ),
  log: (
    <>
      <path d="M4 7h16" />
      <path d="M4 12h16" />
      <path d="M4 17h10" />
    </>
  ),
};

const DOCK = ["album", "wishes", "badges", "fountain", "loot", "series", "log"] as const;

export default function PreviewV3() {
  const [heroIdx, setHeroIdx] = useState(0);
  const hero = PICKED[heroIdx];
  const typeFace = new URLSearchParams(window.location.search).get("type") ?? "baloo";
  const heroTier = tierForRank(hero.char.rank);
  const isTop3 = hero.char.rank <= 3;
  const size = ROSTER_SIZE();
  const completion = (PICKED.length / Math.max(1, size)) * 100;

  const tierCounts = PICKED.reduce<Record<string, number>>((acc, entry) => {
    const tier = tierForRank(entry.char.rank);
    acc[tier] = (acc[tier] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <div
      className="gf"
      data-type={typeFace}
      style={{ "--hero-art": `url("${hero.portrait}")` } as CSSProperties}
    >
      <div className="gf-backdrop" />
      <div className="gf-scrim" />

      <header className="gf-top">
        <div className="gf-mark">
          <span className="gf-drop" />
          <h1>Shizuku</h1>
        </div>
        <div className="gf-pills">
          <div className="gf-pill">
            <Icon name="kakigori" size={15} />
            <span className="gf-pill-label">Kakigori</span>
            <b className="gf-pill-value">{formatKakera(10940)}</b>
            <button className="gf-plus" aria-label="Get more kakigori">+</button>
          </div>
          <div className="gf-pill rolls">
            <Icon name="rolls" size={15} />
            <span className="gf-pill-label">Rolls</span>
            <b className="gf-pill-value">893</b>
            <button className="gf-plus" aria-label="Get more rolls">+</button>
          </div>
        </div>
        <button className="gf-gear" aria-label="Settings">
          <Icon name="gear" size={15} />
        </button>
      </header>

      <main className="gf-main">
        <section
          className={`gf-stage${isTop3 ? " is-top3" : ""}`}
          style={{ "--hero-tier": TIER_VAR[heroTier] } as CSSProperties}
        >
          <div className="gf-deck">
            <div className="gf-peek p1" />
            <div className="gf-peek p2" />
            <div className="gf-mirror">
              <div className="gf-hero">
                <Card3D character={hero.char} revealKey={`${hero.char.id}-preview`} />
              </div>
              {isTop3 ? (
                <div className="gf-reflection" aria-hidden="true">
                  <img src={hero.portrait} alt="" />
                </div>
              ) : null}
            </div>
            {isTop3 ? (
              <div className="gf-water" aria-hidden="true">
                <span />
                <span />
                <span />
              </div>
            ) : null}
          </div>

          <button className="gf-roll">
            <span className="gf-roll-label">Roll</span>
            <span className="gf-roll-count">×893</span>
          </button>

          <div className="gf-under">
            <span className="gf-hour">
              <b>10/10</b>
              this hour
            </span>
            <button className="gf-claim">Claim · 48s</button>
          </div>
        </section>

        <section className="gf-album">
          <div className="gf-album-head">
            <span className="gf-kicker">Album</span>
            <span className="gf-count">
              <b>{PICKED.length}</b>
              <i>/ {size.toLocaleString()}</i>
            </span>
            <span className="gf-pct">{completion.toFixed(1)}%</span>
            <span className="gf-rarity">
              {TIERS.map((tier) => (
                <span key={tier} className={(tierCounts[tier] ?? 0) ? "" : "zero"}>
                  <em style={{ color: TIER_VAR[tier] }}>{tier}</em>
                  <b>{tierCounts[tier] ?? 0}</b>
                </span>
              ))}
            </span>
          </div>


          <div className="gf-shelf">
            {PICKED.map((entry, i) => (
              <Tile
                key={entry.char.id}
                state={BASE}
                char={entry.char}
                owned
                onOpen={() => setHeroIdx(i)}
              />
            ))}
          </div>
        </section>
      </main>

      <nav className="gf-dock" aria-label="Preview navigation">
        <div className="gf-dock-nav">
          {DOCK.map((label, i) => (
            <span key={label} className={`gf-dock-item ${i === 0 ? "on" : ""}`}>
              <svg viewBox="0 0 24 24" className="gf-dock-glyph" aria-hidden="true">
                {ICONS[label]}
              </svg>
              {label}
            </span>
          ))}
        </div>
        <span className="gf-dock-note">preview v3 · top three: aurora frame (card untouched)</span>
      </nav>
    </div>
  );
}
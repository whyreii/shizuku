import { useEffect, useRef, useState } from "react";
import { characterValueValue, formatKakera } from "../engine/game";
import { usePortrait } from "../engine/images";
import { tierClass, tierForRank } from "../engine/tiers";
import { Icon } from "./Icon";
import type { Character } from "../engine/types";

interface CardProps {
  character: Character;
  alias?: string;
  keys?: number;
  keyCap?: number;
  owned?: boolean;
  wished?: boolean;
  starwish?: boolean;
  soulmate?: boolean;
  revealKey?: string;
  compact?: boolean;
  imageOverride?: string | null;
  /** Double-tap / double-click on the card. Only the stage passes this. */
  onActivate?: () => void;
}

export function Card3D({
  character,
  alias,
  keys = 0,
  keyCap = 10,
  owned = false,
  wished = false,
  starwish = false,
  soulmate = false,
  revealKey,
  compact = false,
  imageOverride,
  onActivate,
}: CardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const raf = useRef(0);
  const target = useRef({ x: 0, y: 0 });
  const current = useRef({ x: 0, y: 0 });
  const hasBuildImage = Boolean(character.image);
  const resolved = usePortrait(
    character.name,
    character.series,
    character.id,
    !hasBuildImage && !imageOverride,
  );
  const portrait = imageOverride ?? character.image ?? resolved;
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(false);
  }, [portrait]);

  useEffect(() => {
    const animate = () => {
      const el = cardRef.current;
      if (el) {
        current.current.x += (target.current.x - current.current.x) * 0.18;
        current.current.y += (target.current.y - current.current.y) * 0.18;
        el.style.setProperty("--ry", `${current.current.x.toFixed(2)}deg`);
        el.style.setProperty("--rx", `${(-current.current.y).toFixed(2)}deg`);
      }
      raf.current = requestAnimationFrame(animate);
    };
    raf.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf.current);
  }, []);

  const onMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width;
    const py = (event.clientY - rect.top) / rect.height;
    target.current = { x: (px - 0.5) * 16, y: (py - 0.5) * 16 };
    const el = cardRef.current;
    if (el) {
      el.style.setProperty("--mx", `${(px * 100).toFixed(1)}%`);
      el.style.setProperty("--my", `${(py * 100).toFixed(1)}%`);
    }
  };

  const onLeave = () => {
    target.current = { x: 0, y: 0 };
    const el = cardRef.current;
    if (el) {
      el.style.setProperty("--mx", "50%");
      el.style.setProperty("--my", "50%");
    }
  };

  const tier = tierForRank(character.rank);
  const initial = character.name.trim().charAt(0).toUpperCase();
  const pips = Math.min(keyCap, 10);
  const name = alias ?? character.name;
  const tierSlug = tier === "S+" ? "sp" : tier.toLowerCase();

  return (
    <div className={`card-scene ${compact ? "compact" : ""}`}>
      <div
        key={revealKey}
        ref={cardRef}
        className={`card3d ${tierClass(tier)} reveal reveal-${tierSlug} ${
          owned ? "is-owned" : ""
        } ${starwish ? "is-starwish" : ""} ${soulmate ? "is-soulmate" : ""}`}
        onPointerMove={onMove}
        onPointerLeave={onLeave}
        onDoubleClick={onActivate}
      >
        <div className="card3d-inner">
          <div className="card3d-art">
            {portrait ? (
              <img
                src={portrait}
                alt={name}
                draggable={false}
                decoding="async"
                fetchPriority="high"
                onLoad={() => setLoaded(true)}
              />
            ) : (
              <div className="art-fallback">
                <span className="art-initial">{initial}</span>
              </div>
            )}
            {portrait && !loaded ? <div className="card-skeleton" /> : null}
          </div>

          <div className="card-top">
            <span className="chip tier-chip">{tier}</span>
            <span className="chip rank-chip">#{character.rank}</span>
          </div>

          <div className="card-bottom">
            <div className="card-name">{name}</div>
            <div className="card-series">{character.series}</div>
            <div className="card-meta">
              <span className="card-value">
                <Icon name="kakigori" size={11} />
                {formatKakera(characterValueValue(character.rank, keys))}
              </span>
              {keys > 0 ? (
                <span className="key-pips" aria-label={`${keys} of ${keyCap} shards`}>
                  {Array.from({ length: pips }).map((_, i) => (
                    <i key={i} className={i < keys ? "pip on" : "pip"} />
                  ))}
                </span>
              ) : null}
            </div>
          </div>

          {owned || starwish || wished ? (
            <div className="card-flags">
              {owned ? <span className="card-flag owned-flag">CLAIMED</span> : null}
              {starwish ? <span className="card-flag wish-flag">★ STARWISH</span> : null}
              {wished && !starwish ? (
                <span className="card-flag wish-flag soft">✦ WISH</span>
              ) : null}
            </div>
          ) : null}

          <div className="layer holo" />
          <div className="layer glare" />

          {tier === "S+" ? (
            <div className="card-sparkles" aria-hidden="true">
              <i />
              <i />
              <i />
              <i />
              <i />
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

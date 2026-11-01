import { usePortrait } from "../engine/images";
import { tierClass, tierForRank } from "../engine/tiers";
import type { Character, GameState } from "../engine/types";

interface Props {
  state: GameState;
  char: Character;
  owned: boolean;
  selected?: boolean;
  wished?: boolean;
  starwish?: boolean;
  onOpen?: () => void;
  onToggle?: () => void;
  onStar?: () => void;
}

/** Grid tile shared by the collection board and the series index. */
export function Tile({
  state,
  char,
  owned,
  selected = false,
  wished = false,
  starwish = false,
  onOpen,
  onToggle,
  onStar,
}: Props) {
  const portrait = usePortrait(char.name, char.series, char.id, !char.image) ?? char.image ?? null;
  const tier = tierForRank(char.rank);
  const alias = state.overrides[char.id]?.alias;
  const initial = char.name.trim().charAt(0).toUpperCase();

  const star = onStar ? (
    <span
      className={`tile-star ${starwish ? "on" : ""}`}
      role="button"
      tabIndex={0}
      title={starwish ? "Remove starwish" : "Make starwish"}
      onClick={(event) => {
        event.stopPropagation();
        onStar();
      }}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.stopPropagation();
          event.preventDefault();
          onStar();
        }
      }}
    >
      ★
    </span>
  ) : null;

  if (!owned) {
    return (
      <button
        type="button"
        className={`tile tile-missing ${selected ? "is-selected" : ""} ${
          wished ? "is-wished" : ""
        } ${starwish ? "is-starwish" : ""}`}
        onClick={onToggle}
        title={`${char.name} · #${char.rank}`}
      >
        <div className="tile-art">
          {portrait ? (
            <img src={portrait} alt="" draggable={false} className="tile-ghost" />
          ) : (
            <span className="tile-initial">{initial}</span>
          )}
          <span className="tile-rank">#{char.rank}</span>
          {wished ? (
            <span className={`tile-stamp ${starwish ? "is-star" : ""}`}>
              {starwish ? "★ STAR" : "WISHED"}
            </span>
          ) : null}
          {star}
          <span className="tile-name">{alias ?? char.name}</span>
        </div>
      </button>
    );
  }

  return (
    <button type="button" className={`tile ${tierClass(tier)}`} onClick={onOpen}>
      <div className={portrait ? "tile-art" : "tile-art is-back"}>
        {portrait ? <img src={portrait} alt="" draggable={false} /> : null}
        <span className="tile-rank">#{char.rank}</span>
        {wished ? (
          <span className={`tile-stamp ${starwish ? "is-star" : ""}`}>
            {starwish ? "★ STAR" : "WISHED"}
          </span>
        ) : null}
        {star}
        <span className="tile-name">{alias ?? char.name}</span>
      </div>
    </button>
  );
}

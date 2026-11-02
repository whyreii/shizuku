import { useEffect, useState } from "react";
import { Card3D } from "./Card3D";
import { ConfirmDialog, Modal } from "./Modal";
import { useConfirm } from "./useConfirm";
import { useState as useToggleState } from "react";
import {
  divorceValue,
  formatKakera,
  keyCap,
  keysFor,
  toggleSoulmate,
  toggleStarwish,
  toggleWish,
} from "../engine/game";
import { rankValue } from "../engine/roster";
import { setOverride } from "../engine/game";
import { usePortrait } from "../engine/images";
import { fetchGallery, isPlaceholderPortrait } from "../engine/images";
import type { Character, GameState } from "../engine/types";

interface Props {
  state: GameState;
  char: Character;
  act: (fn: (s: GameState, now: number) => GameState) => GameState | null;
  onDivorce: () => void;
  onClose: () => void;
}

export function CharacterSheet({ state, char, act, onDivorce, onClose }: Props) {
  const { ask, dialog } = useConfirm();
  const [confirming, setConfirming] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const owned = Boolean(state.owned[char.id]);
  const keys = keysFor(state, char.id);
  const alias = state.overrides[char.id]?.alias;
  const wished = state.wishes.includes(char.id);
  const starwish = state.starwish === char.id;
  const soulmate = state.soulmateId === char.id;
  const claimedAt = state.owned[char.id]?.claimedAt;
  const canSoulmate = owned && keys >= 10;
  const cap = keyCap(state);
  const baseValue = rankValue(char.rank);
  const nowValue = owned ? divorceValue(char.id, keys) : baseValue;
  const bonus = Math.max(0, nowValue - baseValue);
  const primaryLabel = canSoulmate
    ? soulmate
      ? "release soulmate"
      : "make soulmate"
    : !wished
      ? "wish"
      : !starwish
        ? "make starwish"
        : null;
  const runPrimary = () => {
    if (canSoulmate) {
      act((s) => toggleSoulmate(s, char.id));
      return;
    }
    if (!wished) {
      act((s) => toggleWish(s, char.id));
      return;
    }
    if (!starwish) act((s) => toggleStarwish(s, char.id));
  };
  const unwish = () =>
    ask({
      title: `Unwish ${alias ?? char.name}?`,
      body: "Removes it from your wishlist. You can add it again any time.",
      confirmLabel: "Unwish",
      onConfirm: () => act((s) => toggleWish(s, char.id)),
    });
  const [clean, setClean] = useToggleState(false);
  const [shown, setShown] = useToggleState<string | null>(null);
  const [draft, setDraft] = useToggleState("");
  const gallery = state.overrides[char.id]?.images ?? [];
  // Remote extras via Jikan's picture list (JPGs only). In-memory, never saved.
  const [remote, setRemote] = useState<string[] | null>(null);
  const [flipped, setFlipped] = useState(false);
  useEffect(() => {
    let alive = true;
    setRemote(null);
    setShown(null);
    setFlipped(false);
    const timer = window.setTimeout(() => {
      if (alive) setRemote([]);
    }, 8000);
    void fetchGallery(char.name, char.series).then(
      (urls) => {
        if (!alive) return;
        window.clearTimeout(timer);
        setRemote(urls.filter((url) => !isPlaceholderPortrait(url)));
      },
      () => {
        if (!alive) return;
        window.clearTimeout(timer);
        setRemote([]);
      },
    );
    return () => {
      alive = false;
      window.clearTimeout(timer);
    };
  }, [char.id, char.name, char.series]);
  const extras = remote ?? [];
  const thumbs = [...gallery, ...extras];
  // the URL field is for cards the resolver can't illustrate
  const resolved = usePortrait(char.name, char.series, char.id, !char.image);
  const hasArt = Boolean(char.image || shown || resolved || gallery.length > 0);
  const [adding, setAdding] = useState(false);
  const addImage = () => {
    const url = draft.trim();
    if (!url) return;
    act((s) =>
      setOverride(s, char.id, { images: [...(s.overrides[char.id]?.images ?? []), url] }),
    );
    setDraft("");
  };

  if (confirming) {
    return (
      <ConfirmDialog
        title={`Divorce ${alias ?? char.name}?`}
        body={`This releases the card and refunds ${formatKakera(divorceValue(char.id, keys))} kakigori.${
          keys >= 21 ? " 5% of its shards are lost." : ""
        }`}
        confirmLabel="Divorce"
        danger
        onCancel={() => setConfirming(false)}
        onConfirm={() => {
          setConfirming(false);
          setLeaving(true);
          window.setTimeout(() => {
            onDivorce();
            onClose();
          }, 460);
        }}
      />
    );
  }

  return (
    <Modal
      title={alias ?? char.name}
      subtitle={`${char.series}${
        claimedAt
          ? ` · claimed ${new Date(claimedAt).toLocaleDateString()}`
          : ""
      }`}
      onClose={onClose}
      footer={
        <>
          {primaryLabel ? (
            <button className="btn primary" onClick={runPrimary}>
              {primaryLabel}
            </button>
          ) : null}

          {starwish ? (
            <button
              className="link"
              onClick={() => act((s) => toggleStarwish(s, char.id))}
            >
              release starwish
            </button>
          ) : primaryLabel !== "make starwish" ? (
            <button
              className="link"
              onClick={() => act((s) => toggleStarwish(s, char.id))}
            >
              starwish
            </button>
          ) : null}

          {wished ? (
            <button className="link" onClick={unwish}>
              unwish
            </button>
          ) : null}

          {owned ? (
            <button
              className="link danger-text"
              onClick={() => setConfirming(true)}
            >
              divorce · {formatKakera(divorceValue(char.id, keys))}
            </button>
          ) : null}
        </>
      }
    >
      {dialog}

      <div className={clean ? "sheet is-clean" : "sheet"}>
        <button
          className={`eye-toggle ${clean ? "on" : ""}`}
          onClick={() => setClean((v) => !v)}
          aria-pressed={clean}
          aria-label={clean ? "Show card labels" : "Hide card labels"}
          title={clean ? "Show labels" : "Hide labels"}
        >
          <svg viewBox="0 0 24 24" width="15" height="15" aria-hidden="true">
            <path
              d="M3 12s3.6-6 9-6 9 6 9 6-3.6 6-9 6-9-6-9-6z"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
            />
            <circle cx="12" cy="12" r="2.6" fill="currentColor" />
            {clean ? (
              <line x1="4" y1="20" x2="20" y2="4" stroke="currentColor" strokeWidth="1.6" />
            ) : null}
          </svg>
        </button>

        <div className={leaving ? "shatter" : `flip-hold${flipped ? " is-flipped" : ""}`}>
          <div className="flip-inner">
            <div
              className="flip-front"
              role="button"
              tabIndex={leaving ? -1 : 0}
              aria-pressed={flipped}
              aria-label={flipped ? "show card front" : "flip to see more pictures"}
              title={flipped ? "show card front" : "flip to see more pictures"}
              onClick={() => {
                if (!leaving) setFlipped((v) => !v);
              }}
              onKeyDown={(event) => {
                if (leaving) return;
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  setFlipped((v) => !v);
                }
              }}
            >
              <Card3D
                character={char}
                alias={alias}
                keys={keys}
                keyCap={keyCap(state)}
                owned={owned}
                wished={wished}
                starwish={starwish}
                soulmate={soulmate}
                imageOverride={shown}
              />
              <span className="flip-hint" aria-hidden="true">
                more pictures
              </span>
            </div>
            <div className="flip-back" aria-hidden={!flipped}>
              <span className="flip-title">more pictures</span>
              {thumbs.length > 0 ? (
                <div className="flip-grid">
                  {thumbs.map((url) => (
                    <button
                      key={url}
                      type="button"
                      tabIndex={flipped ? 0 : -1}
                      className={shown === url ? "gallery-thumb on" : "gallery-thumb flip-thumb"}
                      onClick={(event) => {
                        event.stopPropagation();
                        setShown(shown === url ? null : url);
                        setFlipped(false);
                      }}
                      title="show this picture on the card"
                    >
                      <img src={url} alt="" loading="lazy" draggable={false} />
                    </button>
                  ))}
                </div>
              ) : remote === null ? (
                <span className="sheet-shards-text">loading more pictures…</span>
              ) : (
                <span className="sheet-shards-text">no extra pictures yet</span>
              )}
              {!hasArt ? (
                adding ? (
                  <div className="gallery-add">
                    <input
                      autoFocus
                      value={draft}
                      onChange={(event) => setDraft(event.target.value)}
                      placeholder="paste an image url"
                      onKeyDown={(event) => {
                        if (event.key === "Enter") addImage();
                        if (event.key === "Escape") setAdding(false);
                      }}
                    />
                    <button
                      className="link"
                      onClick={addImage}
                      disabled={!draft.trim()}
                    >
                      add
                    </button>
                  </div>
                ) : (
                  <button
                    className="link add-art"
                    tabIndex={flipped ? 0 : -1}
                    onClick={(event) => {
                      event.stopPropagation();
                      setAdding(true);
                    }}
                    title="point this card at a different portrait"
                  >
                    add image url
                  </button>
                )
              ) : null}
              <button
                type="button"
                className="link flip-back-btn"
                tabIndex={flipped ? 0 : -1}
                onClick={(event) => {
                  event.stopPropagation();
                  setFlipped(false);
                }}
              >
                flip back
              </button>
            </div>
          </div>
          {leaving ? (
            <div className="shatter-shards" aria-hidden="true">
              <i />
              <i />
              <i />
              <i />
              <i />
            </div>
          ) : null}
        </div>

        {owned ? (
          <div className="sheet-keys">
            <span className="sheet-keys-label">soulmate</span>
            <span className="sheet-pips">
              {Array.from({ length: 10 }).map((_, i) => (
                <i key={i} className={i < Math.min(keys, 10) ? "on" : ""} />
              ))}
            </span>
            <span className="sheet-keys-count">{Math.min(keys, 10)} / 10</span>
          </div>
        ) : null}

        <div className="sheet-value">
          <span className="sheet-value-label">now worth</span>
          <b>{formatKakera(nowValue)}</b>
          {bonus > 0 ? (
            <span className="sheet-value-sub">
              base {formatKakera(baseValue)} · +{formatKakera(bonus)} from
              shards
            </span>
          ) : null}
        </div>

        <div className="sheet-shards">
          <span className="sheet-shard-bar">
            <i style={{ width: `${Math.min(100, (keys / Math.max(1, cap)) * 100)}%` }} />
          </span>
          <span className="sheet-shards-text">
            shard bonus {bonus > 0 ? `+${formatKakera(bonus)}` : "+0"} ·{" "}
            {keys} / {cap}
          </span>
        </div>
      </div>
    </Modal>
  );
}

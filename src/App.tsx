import { useEffect, useMemo, useRef, useState } from "react";
import { Card3D } from "./components/Card3D";
import { CardBackArt } from "./components/EmptyArt";
import {
  CollectionPanel,
  LogPanel,
  SeriesPanel,
  WishlistPanel,
} from "./components/Panels";
import {
  CLAIM_WINDOW_MS,
  CRYSTAL_LIFE_MS,
  claim,
  claimReadyIn,
  claimWindowOpen,
  collectCrystal,
  formatCompact,
  formatCountdown,
  formatKakera,
  kakigoriPerHour,
  keyCap,
  keysFor,
  hydrate,
  poolBypass,
  rarityShifts,
  roll,
  rollableCap,
  rollableSize,
  rollsPerReset,
  starwishBoostPercent,
  wishBoostPercent,
} from "./engine/game";
import { characterById, onRosterChange } from "./engine/roster";
import { rankValue } from "./engine/roster";
import { bandTable, tierClass, tierForRank } from "./engine/tiers";
import { prefetchPortraits, usePortrait } from "./engine/images";
import { Modal } from "./components/Modal";
import { sections } from "./components/helpSections";
import { ConfirmDialog } from "./components/Modal";
import { BadgesPanel } from "./components/BadgesPanel";
import { TowerPanel } from "./components/TowerPanel";
import { LootPanel } from "./components/LootPanel";
import { Icon } from "./components/Icon";
import { CollectionView } from "./components/CollectionView";
import { useGame } from "./engine/store";

const TABS = ["Album", "Wishes", "Medals", "Fountain", "Loot", "Series", "Ripples"] as const;

interface RecentCard {
  id: string;
  name: string;
  series: string;
  image?: string | null;
}

function RecentThumb({ char }: { char: RecentCard }) {
  const portrait =
    usePortrait(char.name, char.series, char.id, !char.image) ?? char.image ?? null;
  return (
    <span
      className={portrait ? "recent-thumb" : "recent-thumb is-back"}
      title={char.name}
      style={portrait ? { backgroundImage: `url("${portrait}")` } : undefined}
    />
  );
}

const DOCK_ICON: Record<(typeof TABS)[number], import("./components/Icon").IconName> = {
  Album: "album",
  Wishes: "wish",
  Medals: "badge",
  Fountain: "fountain",
  Loot: "loot",
  Series: "series",
  Ripples: "log",
};
type Tab = (typeof TABS)[number];

export default function App() {
  const { state, act, actWithUndo, undo, clearUndo, flash, notify, reset, restore } =
    useGame();
  const poolNow = rollableCap();
  const poolSize = rollableSize(state);
  const poolBypassNow = poolBypass(state);
  const bypassParts: string[] = [];
  if (poolBypassNow.wished > 0) {
    bypassParts.push(
      poolBypassNow.wished + (poolBypassNow.wished === 1 ? " wished card" : " wished cards"),
    );
  }
  if (poolBypassNow.owned > 0) {
    bypassParts.push(
      poolBypassNow.owned + (poolBypassNow.owned === 1 ? " owned card" : " owned cards"),
    );
  }
  const bypassText =
    bypassParts.length > 0 ? ", plus " + bypassParts.join(" and ") + " past it." : ".";
  const [tab, setTab] = useState<Tab>("Album");
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [rolling, setRolling] = useState(false);
  const [rollPulse, setRollPulse] = useState(0);
  const [claimPulse, setClaimPulse] = useState(0);
  const [keyCue, setKeyCue] = useState(false);
  const [pendingSave, setPendingSave] = useState<File | null>(null);
  const [wiping, setWiping] = useState(false);
  const [boardOpen, setBoardOpen] = useState(false);
  const [, bumpRoster] = useState(0);

  useEffect(() => onRosterChange(() => bumpRoster((n) => n + 1)), []);
const fileRef = useRef<HTMLInputElement>(null);

  const doRoll = () => {
    if (rolling || state.rolls < 1) return;
    setRolling(true);
    setRollPulse((n) => n + 1);
    // reduced motion: no swap delay, no lock - the card is just there
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const swap = still ? 0 : 140;
    const unlock = still ? 0 : 300;
    // 140ms: the old card is out and the new one mounts (hero spec 2)
    window.setTimeout(() => {
      act((s, t) => {
        const result = roll(s, t);
        if (result.state.current?.keyed) {
          setKeyCue(true);
          window.setTimeout(() => setKeyCue(false), 1600);
        }
        return result.state;
      });
    }, swap);
    // 300ms: ROLL is free again, before any tier has finished revealing
    window.setTimeout(() => setRolling(false), unlock);
  };

  const doClaim = () => {
    if (!current) return;
    const value = rankValue(current.rank);
    const next = act((s, t) => claim(s, t));
    if (next) {
      setClaimPulse((n) => n + 1);
      notify(`claimed · +${formatKakera(value)} value`, "good");
    }
  };


  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {      const target = event.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable)
      ) {
        return;
      }
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      if (event.repeat) return;

      if (event.code === "Space") {
        event.preventDefault();
        if (state.rolls > 0) doRoll();
      } else if (event.key.toLowerCase() === "c") {
        event.preventDefault();
        doClaim();
      } else if (event.key === "/") {
        event.preventDefault();
        const input = document.querySelector<HTMLInputElement>(".panel input");
        input?.focus();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  });

  const prevCrystal = useRef<typeof state.crystal>(null);  useEffect(() => {
    const before = prevCrystal.current;
    if (before && !state.crystal) {
      const age = Date.now() - before.at;
      if (age >= CRYSTAL_LIFE_MS - 400) notify(`missed +${before.value}`, "warn");
    }
    prevCrystal.current = state.crystal;
  }, [state.crystal, notify]);

  useEffect(() => {
    const entries = [...state.wishes, ...Object.keys(state.owned).slice(0, 24)]
      .map((id) => characterById(id))
      .filter((char): char is NonNullable<typeof char> => Boolean(char))
      .map((char) => ({ name: char.name, series: char.series, id: char.id }));
    if (entries.length > 0) prefetchPortraits(entries);
    // only when the wish list or collection changes size
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.wishes.length, Object.keys(state.owned).length]);

  const exportSave = () => {    const blob = new Blob([JSON.stringify(state, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "shizuku-save.json";
    link.click();
    URL.revokeObjectURL(url);
    notify("save exported", "good");
  };

  const importSave = async (file: File) => {
    try {
      const text = await file.text();
      const parsed = JSON.parse(text) as Record<string, unknown>;
      if (!parsed || typeof parsed !== "object") throw new Error("bad file");
      if (typeof parsed.version !== "number") throw new Error("missing version");
      if (typeof parsed.owned !== "object" || parsed.owned === null) {
        throw new Error("missing collection");
      }
      if (typeof parsed.keys !== "object" || parsed.keys === null) {
        throw new Error("missing keys");
      }
      restore(hydrate(parsed));
      notify("save imported", "good");
      setSettingsOpen(false);
    } catch {
      notify("That file isn't a Shizuku save", "warn");
    }
  };

  const now = Date.now();
  const ownedCount = Object.keys(state.owned).length;
  const wishCount = state.wishes.length;
  const current = state.current ? characterById(state.current.charId) : null;
  const windowOpen = claimWindowOpen(state, now);
  const remaining = state.current
    ? Math.max(0, CLAIM_WINDOW_MS - (now - state.current.rolledAt))
    : 0;
  const claimWait = claimReadyIn(state, now);
  const owned = state.current ? Boolean(state.owned[state.current.charId]) : false;
  const top3 = Boolean(current && current.rank <= 3);
  const canClaim = windowOpen && !owned && !state.current?.claimed && claimWait <= 0;
  const recent = useMemo(
    () =>
      Object.values(state.owned)
        .sort((a, b) => b.claimedAt - a.claimedAt)
        .slice(0, 5)
        .map((record) => {
          const char = characterById(record.charId);
          return char
            ? { id: char.id, name: char.name, series: char.series, image: char.image }
            : null;
        })
        .filter((char) => char !== null),
    [state.owned],
  );
  const crystalAlive = state.crystal
    ? Math.max(0, CRYSTAL_LIFE_MS - (now - state.crystal.at))
    : 0;

  const rollHint = !current
    ? "Roll for a card. Anything can appear."
    : owned
      ? "You own this card — re-rolls pay crystals and shards."
      : null;

  return (
    <div
      className={`shell ${
        current ? tierClass(tierForRank(current.rank)) : ""
      }`}
    >

      <nav className="rail" aria-label="Panels">
        {TABS.map((t) => (
          <button
            key={t}
            className={`rail-item ${tab === t ? "on" : ""}`}
            onClick={() => setTab(t)}
            aria-current={tab === t ? "page" : undefined}
          >
            <Icon name={DOCK_ICON[t]} size={20} anim={tab === t} />
            {t}
          </button>
        ))}

      </nav>

      <header className="bar">
        <div className="mark">
          <span className="drop" aria-hidden="true" />
          <h1>Shizuku</h1>
        </div>

        <div className="head-pills">
          <div className="head-pill">
            <Icon name="kakigori" size={15} />
            <div className="head-pill-text">
              <b>{formatCompact(state.kakigori)}</b>
              <small>+{formatKakera(kakigoriPerHour(state))}/hr</small>
            </div>
          </div>
          <div className="head-pill">
            <Icon name="rolls" size={15} />
            <div className="head-pill-text">
              <b>{state.rolls}</b>
              <small>rolls</small>
            </div>
          </div>
        </div>

        <button
          className="settings-key"
          onClick={() => setSettingsOpen(true)}
          aria-label="Settings"
          title="Settings"
        >
          <Icon name="gear" size={16} />
        </button>
      </header>

      <nav className="dock" aria-label="Panels">
        <div className="dock-nav">
          {TABS.map((t) => (
            <button
              key={t}
              className={`dock-item ${tab === t ? "on" : ""}`}
              onClick={() => setTab(t)}
              aria-current={tab === t ? "page" : undefined}
            >
              <Icon name={DOCK_ICON[t]} size={17} />
              {t}
            </button>
          ))}
        </div>
      </nav>

      <main className={tab === "Album" ? "table" : "table table-wide"}>
        {tab === "Album" ? (
        <div className="col-stage">
        {current ? (
          <div className={`hero ${windowOpen ? "live" : ""} ${rolling ? "rolling" : ""} ${top3 ? "is-top3" : ""}`}>
            <div className="hero-card">
              <Card3D
                character={current}
                alias={state.overrides[current.id]?.alias}
                keys={keysFor(state, current.id)}
                keyCap={keyCap(state)}
                owned={owned}
                wished={state.wishes.includes(current.id)}
                starwish={state.starwish === current.id}
                soulmate={state.soulmateId === current.id}
                revealKey={`${current.id}-${state.current?.rolledAt ?? 0}`}
                onActivate={canClaim ? doClaim : undefined}
              />
              {claimPulse > 0 ? (
                <span className="claim-ring" key={claimPulse} aria-hidden="true" />
              ) : null}
            </div>

            {state.crystal && crystalAlive > 0 ? (
              <button
                className={`crystal ${state.crystal.color}`}
                style={{
                  left: `${state.crystal.x}%`,
                  top: `${state.crystal.y}%`,
                  animationDuration: `${crystalAlive}ms`,
                }}
                onClick={() => {
                  act((s, t) => collectCrystal(s, t));
                  notify(`+${state.crystal?.value ?? 0}`, "good");
                }}
                title={`${state.crystal.value} kakigori`}
              >
                <span>{state.crystal.value}</span>
              </button>
            ) : null}

            {keyCue ? (
              <span className="key-cue">
                <Icon name="shard" size={10} />
                SHARD +1
              </span>
            ) : null}

            {top3 ? (
              <div className="hero-water" aria-hidden="true">
                <span />
                <span />
                <span />
              </div>
            ) : null}

          </div>
        ) : (
          <div className="rest">
            <div className="rest-card" aria-hidden="true">
              <CardBackArt />
            </div>
            <p className="rest-note">nothing drawn yet</p>
          </div>
        )}

        {current ? (
          <p className="claim-status" aria-live="polite">
            {canClaim
              ? `double-tap the card to claim · ${Math.ceil(remaining / 1000)}s`
              : owned
                ? "already in your collection"
                : state.current?.claimed
                  ? "claimed"
                  : claimWait > 0
                    ? `claim in ${formatCountdown(claimWait)}`
                    : "claim window closed"}
          </p>
        ) : null}
        <button
          className="roll-key"
          onClick={doRoll}
          disabled={state.rolls < 1}
          aria-describedby={rollHint ? "roll-hint" : undefined}
        >
          {rollPulse > 0 ? (
            <span className="roll-ring" key={rollPulse} aria-hidden="true" />
          ) : null}
          <span className="roll-key-label">Roll</span>
          {rollHint ? (
            <span className="tip" role="tooltip" id="roll-hint">
              {rollHint}
            </span>
          ) : null}
        </button>

        <div className="roll-meter" aria-hidden="true">
          {Array.from({ length: rollsPerReset(state) }).map((_, i) => (
            <i key={i} className={i < state.rolls ? "on" : ""} />
          ))}
        </div>

        <div className="roll-meta">
          <span>
            {state.rolls > rollsPerReset(state)
              ? `${state.rolls} rolls banked`
              : `${state.rolls} of ${rollsPerReset(state)} this hour`}
          </span>
          <span>
            next roll in {formatCountdown(state.nextResetAt - now)}
          </span>
        </div>

        {recent.length > 0 ? (
          <div className="recent">
            <span>recent claims</span>
            <div className="recent-row">
              {recent.map((char) => (
                <RecentThumb key={char.id} char={char} />
              ))}
            </div>
          </div>
        ) : null}

        </div>
        ) : null}

        <div className="col-panel">
        <section className="panel">
          {tab === "Album" ? (
            <CollectionPanel
              state={state}
              act={act}
              actUndo={actWithUndo}
            />
          ) : null}
          {tab === "Wishes" ? <WishlistPanel state={state} act={act} notify={notify} /> : null}
          {tab === "Medals" ? <BadgesPanel state={state} act={act} /> : null}
          {tab === "Fountain" ? <TowerPanel state={state} act={act} /> : null}
          {tab === "Loot" ? <LootPanel state={state} act={act} /> : null}
          {tab === "Series" ? (
            <SeriesPanel state={state} act={act} actUndo={actWithUndo} />
          ) : null}
          {tab === "Ripples" ? <LogPanel state={state} act={act} /> : null}
        </section>
        </div>
      </main>


      {flash ? (
        <div className={`flash ${flash.tone}`} role="status" aria-live="polite">
          {flash.text}
        </div>
      ) : null}

      {undo ? (
        <div className="flash undo" role="status" aria-live="polite">
          <span>{undo.label}</span>
          <button
            className="link"
            onClick={() => {
              restore(undo.state);
              clearUndo();
              notify("Undone", "good");
            }}
          >
            undo
          </button>
        </div>
      ) : null}

      {settingsOpen ? (
        <Modal
          title="Settings"
          subtitle="this browser only"
          onClose={() => setSettingsOpen(false)}
          footer={
            <button className="link" onClick={() => setSettingsOpen(false)}>
              close
            </button>
          }
        >
          <p className="settings-caption">
            {Object.keys(state.owned).length}{" "}
            {Object.keys(state.owned).length === 1 ? "card" : "cards"} ·{" "}
            {formatKakera(state.kakigori)} kakigori · {rollsPerReset(state)}{" "}
            rolls per hour
          </p>

          <div className="save-actions">
            <button className="btn" onClick={exportSave}>
              Export save
            </button>
            <button className="btn" onClick={() => fileRef.current?.click()}>
              Import save
            </button>
            <input
              ref={fileRef}
              type="file"
              accept="application/json"
              hidden
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (file) setPendingSave(file);
                event.target.value = "";
              }}
            />
          </div>


          <p className="modal-text">
            Your pool is the top {poolNow.toLocaleString("en-US")} of the ranked
            roster{bypassText}{" "}
            Mudae's limroul, fixed at 7,000 {"\u2014"} every card in it is
            equally likely.
          </p>
          <div className="rates">
            <div className="rates-head">
              <span>band</span>
              <span>per card</span>
              <span>band total</span>
            </div>
            {bandTable(rarityShifts(state), poolNow, poolSize).map((row) => (
              <div className="rate-row" key={row.label}>
                <span className={"mini-tier " + tierClass(row.tier)}>
                  {row.tier}
                </span>
                <span className="rate-band">{row.label}</span>
                <span className="rate-pct">
                  {(row.perCharacter * 100).toFixed(3)}%
                </span>
                <span className="rate-band-total">
                  {(row.bandTotal * 100).toFixed(2)}%
                </span>
              </div>
            ))}
          </div>
          <div className="setting-row">
            <span>Novelty</span>
            <div className="seg">
              {[1, 2, 3, 4].map((n) => (
                <button
                  key={n}
                  className={"seg-btn " + ((state.novelty ?? 4) === n ? "on" : "")}
                  onClick={() => act((s) => ({ ...s, novelty: n }))}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>
          <p className="modal-text">
            How often your own cards are held back. 1 - your collection keeps
            dropping / 4 - mostly new cards.
          </p>

          <div className="setting-row">
            <span>Wish boost</span>
            <div className="seg">
              <button
                className="seg-btn"
                onClick={() => {
                  const wait = (state.wishBoostAt ?? 0) + 12 * 3600000 - Date.now();
                  if ((state.wishBoost ?? 0) > 0 && wait > 0) {
                    notify("Can lower again in " + Math.ceil(wait / 3600000) + "h", "warn");
                    return;
                  }
                  act((s) => ({
                    ...s,
                    wishBoost: Math.max(0, (s.wishBoost ?? 0) - 1),
                    wishBoostAt: Date.now(),
                  }));
                }}
              >
                -
              </button>
              <b>{state.wishBoost ?? 0}</b>
              <button
                className="seg-btn"
                onClick={() => {
                  const max = Math.max(0, rollsPerReset({ ...state, wishBoost: 0 }) - 10);
                  if ((state.wishBoost ?? 0) >= max) return;
                  act((s) => ({ ...s, wishBoost: (s.wishBoost ?? 0) + 1 }));
                }}
              >
                +
              </button>
            </div>
          </div>
          <p className="modal-text">
            Rolls per hour traded for spawn chance: +{wishBoostPercent(state.wishBoost ?? 0)}%
            wish, +{starwishBoostPercent(state.wishBoost ?? 0)}% starwish. Rolls/hr now{" "}
            {rollsPerReset(state)}. Lowering has a 12h cooldown.
          </p>

          <details className="help-block">
            <summary>the rules</summary>
            {sections(state).map((section) => (
              <div className="help-section" key={section.title}>
                <b>{section.title}</b>
                {section.lines.map((line) => (
                  <p key={line}>{line}</p>
                ))}
              </div>
            ))}
          </details>

          <div className="danger-zone">
            <p className="modal-text">
              Wiping removes your entire save: collection, shards, wishes and
              overrides. There is no undo.
            </p>

            <button
              className="btn danger"
              style={{ width: "100%" }}
              onClick={() => setWiping(true)}
            >
              Wipe save
            </button>
          </div>
        </Modal>
      ) : null}



      {boardOpen ? (
        <CollectionView
          state={state}
          act={act}
          actUndo={actWithUndo}
          onClose={() => setBoardOpen(false)}
        />
      ) : null}

      {wiping ? (
        <ConfirmDialog
          title="Wipe your save?"
          body={`This deletes ${ownedCount} ${
            ownedCount === 1 ? "card" : "cards"
          }, ${formatKakera(state.kakigori)} kakigori, ${wishCount} ${
            wishCount === 1 ? "wish" : "wishes"
          } and every override. There is no undo.`}
          confirmLabel="Wipe"
          danger
          onCancel={() => setWiping(false)}
          onConfirm={() => {
            reset();
            setWiping(false);
            setSettingsOpen(false);
            notify("save wiped", "warn");
          }}
        />
      ) : null}

      {pendingSave ? (
        <ConfirmDialog
          title="Replace your save?"
          body="Importing replaces your collection, shards, wishes and overrides. Export the current save first if you want to keep it."
          confirmLabel="Import"
          onCancel={() => setPendingSave(null)}
          onConfirm={() => {
            void importSave(pendingSave);
            setPendingSave(null);
          }}
        />
      ) : null}
    </div>
  );
}

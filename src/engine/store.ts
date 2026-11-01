import { useCallback, useEffect, useRef, useState } from "react";
import { createInitialState, hydrate, tick } from "./game";
import { GameError } from "./types";
import type { GameState } from "./types";

const STORAGE_KEY = "shizuku.state.v1";
const LEGACY_KEYS = ["kakigori.state.v1", "kakera.state.v1"];

function readRaw(): string | null {
  try {
    const current = localStorage.getItem(STORAGE_KEY);
    if (current) return current;
    for (const legacy of LEGACY_KEYS) {
      const old = localStorage.getItem(legacy);
      if (old) return old;
    }
  } catch {
    /* storage unavailable */
  }
  return null;
}

function load(): GameState | null {
  const raw = readRaw();
  if (!raw) return null;
  try {
    return hydrate(JSON.parse(raw) as Partial<GameState>);
  } catch {
    return null;
  }
}

function save(state: GameState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    /* quota */
  }
}

export interface Flash {
  text: string;
  tone: "warn" | "good";
  at: number;
}

export function useGame() {
  const [state, setState] = useState<GameState>(() =>
    tick(load() ?? createInitialState(Date.now()), Date.now()),
  );
  const [flash, setFlash] = useState<Flash | null>(null);
  const ref = useRef(state);
  ref.current = state;

  useEffect(() => {
    const id = window.setInterval(() => {
      setState((s) => tick(s, Date.now()));
    }, 1000);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    save(state);
  }, [state]);

  const act = useCallback((fn: (state: GameState, now: number) => GameState) => {
    const now = Date.now();
    try {
      const next = fn(tick(ref.current, now), now);
      setState(next);
      return next;
    } catch (error) {
      if (error instanceof GameError) {
        setFlash({ text: error.message, tone: "warn", at: now });
        return null;
      }
      throw error;
    }
  }, []);

  const notify = useCallback((text: string, tone: Flash["tone"] = "good") => {
    setFlash({ text, tone, at: Date.now() });
  }, []);

  useEffect(() => {
    if (!flash) return;
    const id = window.setTimeout(() => setFlash(null), 3200);
    return () => window.clearTimeout(id);
  }, [flash]);

  const reset = useCallback(() => {
    const fresh = createInitialState(Date.now());
    setState(fresh);
    save(fresh);
  }, []);

  const [undo, setUndo] = useState<{ state: GameState; label: string } | null>(null);

  const actWithUndo = useCallback(
    (fn: (state: GameState, now: number) => GameState, label: string) => {
      const before = ref.current;
      const next = act(fn);
      if (next) setUndo({ state: before, label });
      return next;
    },
    [act],
  );

  const clearUndo = useCallback(() => setUndo(null), []);

  useEffect(() => {
    if (!undo) return;
    const id = window.setTimeout(() => setUndo(null), 6000);
    return () => window.clearTimeout(id);
  }, [undo]);

  return {
    state,
    act,
    actWithUndo,
    undo,
    clearUndo,
    flash,
    notify,
    reset,
    restore: setState,
  };
}

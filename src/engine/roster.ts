import { ROSTER_1 } from "./roster-1";
import { ROSTER_2 } from "./roster-2";
import { ROSTER_3 } from "./roster-3";
import type { Character } from "./types";
import { invalidateWeightCache } from "./tiers";
import { isPlaceholderPortrait } from "./images";

const RAW = [ROSTER_1, ROSTER_2, ROSTER_3].join("\n");

function parse(): Character[] {
  const out: Character[] = [];
  for (const raw of RAW.split(/\r?\n/)) {
    const line = raw.trim();
    if (!line) continue;
    const parts = line.split("|");
    if (parts.length < 2) continue;
    const name = parts[0].trim();
    const series = parts[1].trim() || "Unknown";
    const heart = parts[2]?.trim() === "1";
    if (!name) continue;
    const rank = out.length + 1;
    out.push({
      id: `r${String(rank).padStart(3, "0")}`,
      rank,
      name,
      series,
      heart,
    });
  }
  return out;
}

/** The full ranked roster. Hand-ranked 1,000 first, extras appended at boot. */
export const ROSTER: Character[] = parse();

const byId = new Map<string, Character>();
function reindex(): void {
  byId.clear();
  for (const char of ROSTER) byId.set(char.id, char);
  invalidateWeightCache();
}
reindex();

export function ROSTER_SIZE(): number {
  return ROSTER.length;
}

export function characterById(id: string): Character | undefined {
  return byId.get(id);
}

export function characterAtRank(rank: number): Character | undefined {
  return ROSTER[rank - 1];
}

/**
 * Card value, defined by anchor points rather than a formula so the curve can be
 * retuned by editing one line. Interpolated on a log scale, so value falls
 * smoothly between anchors and never plateaus. No ceiling, no floor clamp.
 */
const VALUE_ANCHORS: [number, number][] = [
  [1, 1200],
  [10, 1100],
  [60, 832],
  [100, 707],
  [180, 516],
  [500, 260],
  [1000, 144],
  [6258, 27],
  [10000, 15],
  [17366, 10],
];

export function rankValue(rank: number): number {
  const r = Math.max(1, Math.round(rank));
  if (r <= VALUE_ANCHORS[0][0]) return VALUE_ANCHORS[0][1];
  for (let i = 1; i < VALUE_ANCHORS.length; i += 1) {
    const [fromRank, fromValue] = VALUE_ANCHORS[i - 1];
    const [toRank, toValue] = VALUE_ANCHORS[i];
    if (r <= toRank) {
      const t = (r - fromRank) / (toRank - fromRank);
      const value = fromValue * Math.pow(toValue / fromValue, t);
      return Math.max(1, Math.round(value));
    }
  }
  return VALUE_ANCHORS[VALUE_ANCHORS.length - 1][1];
}

export function seriesIndex(): { series: string; count: number }[] {
  const map = new Map<string, number>();
  for (const c of ROSTER) map.set(c.series, (map.get(c.series) ?? 0) + 1);
  return [...map.entries()]
    .map(([series, count]) => ({ series, count }))
    .sort((a, b) => b.count - a.count || a.series.localeCompare(b.series));
}

type ExtraTuple = [string, string, string, number, string | null];

let extraLoaded = false;
const listeners = new Set<() => void>();

/** Notify React that the roster grew (used after async hydration). */
export function onRosterChange(fn: () => void): () => void {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

export function extrasLoaded(): boolean {
  return extraLoaded;
}

/**
 * Extras ship as a static file in /public (compact tuples), so they stay out of
 * the JS bundle and the first paint does not wait on them.
 */

/** v2 compact payload; the legacy flat array is still accepted. */
function readExtras(payload: unknown): ExtraTuple[] {
  if (Array.isArray(payload)) return payload as ExtraTuple[];
  const data = payload as {
    v?: number;
    prefix?: string;
    series?: string[];
    characters?: [string, string, number, number, string][];
  };
  if (!data || data.v !== 2 || !data.characters || !data.series) return [];
  const prefix = data.prefix ?? "";
  return data.characters.map(([id, name, seriesIdx, rank, suffix]) => [
    id,
    name,
    data.series![seriesIdx] ?? "Unknown",
    rank,
    suffix ? prefix + suffix : null,
  ]);
}

export async function loadExtraRoster(): Promise<void> {
  if (extraLoaded) return;
  try {
    const response = await fetch("/roster-extra.json");
    if (!response.ok) return;
    const payload = (await response.json()) as unknown;
    const extra = readExtras(payload);
    if (extra.length === 0) return;
    for (const entry of extra) {
      const [id, name, series, rank, image] = entry;
      if (!id || !name) continue;
      ROSTER.push({
        id,
        rank,
        name,
        series: series || "Unknown",
        heart: false,
        image:
          image && !isPlaceholderPortrait(image) ? image : undefined,
      });
    }
    extraLoaded = true;
    reindex();
    for (const fn of listeners) fn();
  } catch {
    /* offline: the hand-ranked 1,000 still work */
  }
}

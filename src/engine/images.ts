import { useEffect, useState } from "react";

/**
 * Portraits come from AniList (series-aware, id-exact for extras), with a Jikan
 * fallback. URLs are cached in localStorage; nothing copyrighted is bundled.
 */
const CACHE_KEY = "shizuku.images.v3";
const FAIL_KEY = "shizuku.images.fail.v1";
const MAL_KEY = "shizuku.mal.v1";
const STATS_KEY = "shizuku.coverage.v1";
const MAP_URL = "/roster-images.json";

/** name|series -> portrait URL, resolved at build time for the hand-ranked list. */
let bundled: Record<string, string> = {};

export async function loadImageMap(): Promise<void> {
  try {
    const response = await fetch(MAP_URL);
    if (!response.ok) return;
    const raw = (await response.json()) as Record<string, string>;
    // A bundled entry can itself be AniList's "NO IMAGE" default.
    bundled = Object.fromEntries(
      Object.entries(raw).filter(([, url]) => url && !isPlaceholder(url)),
    );
  } catch {
    /* map is optional; the runtime resolver still works */
  }
}
const ANILIST = "https://graphql.anilist.co";
const JIKAN = "https://api.jikan.moe/v4";
const MIN_INTERVAL_MS = 750;

type ImageCache = Record<string, string | null>;

function readJson<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeJson(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* quota */
  }
}

let cache: ImageCache = readJson<ImageCache>(CACHE_KEY, {});
/** key -> { n: attempts, at: last attempt }, so a dead API is not hammered. */
let failures: Record<string, { n: number; at: number }> = readJson(
  FAIL_KEY,
  {} as Record<string, { n: number; at: number }>,
);
const MAX_ATTEMPTS = 3;
const BACKOFF_MS = 5 * 60_000;
let malIds: Record<string, number> = readJson<Record<string, number>>(MAL_KEY, {});
let stats = readJson<{ attempted: number; matched: number }>(STATS_KEY, {
  attempted: 0,
  matched: 0,
});

function recordStat(matched: boolean): void {
  stats = {
    attempted: stats.attempted + 1,
    matched: stats.matched + (matched ? 1 : 0),
  };
  writeJson(STATS_KEY, stats);
}

export function getCoverage(): { attempted: number; matched: number } {
  // Derive from the cache so already-cached portraits count too.
  const entries = Object.values(cache);
  const matched = entries.filter((url) => Boolean(url)).length;
  return { attempted: entries.length, matched };
}

const inflight = new Map<string, Promise<string | null>>();
let queue: Promise<unknown> = Promise.resolve();
let lastRun = 0;

function normalise(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

function similar(a: string, b: string): boolean {
  const na = normalise(a);
  const nb = normalise(b);
  if (!na || !nb) return false;
  return na === nb || na.includes(nb) || nb.includes(na);
}

async function gql(query: string, variables: Record<string, unknown>) {
  const response = await fetch(ANILIST, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({ query, variables }),
  });
  if (!response.ok) return null;
  const json = (await response.json()) as { data?: unknown };
  return json.data ?? null;
}

async function anilistExact(id: number): Promise<string | null> {
  const data = (await gql(`query($id:Int){Character(id:$id){image{large}}}`, { id })) as
    | { Character?: { image?: { large?: string | null } | null } | null }
    | null;
  return data?.Character?.image?.large ?? null;
}

interface Hit {
  id: number;
  name: string;
  image: string | null;
  series: string[];
}

async function anilistSearch(name: string): Promise<Hit[]> {
  const query = `query($s:String){Page(perPage:10){characters(search:$s){id name{full} image{large} media(perPage:6){nodes{title{romaji english}}}}}}`;
  const data = (await gql(query, { s: name })) as
    | {
        Page?: {
          characters?: {
            id: number;
            name: { full: string };
            image: { large: string | null } | null;
            media?: { nodes: { title: { romaji: string; english: string | null } }[] };
          }[];
        };
      }
    | null;
  return (data?.Page?.characters ?? []).map((hit) => ({
    id: hit.id,
    name: hit.name.full,
    image: hit.image?.large ?? null,
    series: (hit.media?.nodes ?? []).flatMap((n) => [n.title.romaji, n.title.english ?? ""]),
  }));
}

interface JikanCharacter {
  mal_id: number;
  name: string;
  images?: { jpg?: { image_url?: string } };
  anime?: { title?: string }[];
}

async function jikanSearch(name: string): Promise<JikanCharacter[]> {
  try {
    const response = await fetch(
      `${JIKAN}/characters?q=${encodeURIComponent(name)}&limit=8&order_by=favorites&sort=desc`,
    );
    if (!response.ok) return [];
    const json = (await response.json()) as { data?: JikanCharacter[] };
    return json.data ?? [];
  } catch {
    return [];
  }
}

function swapName(name: string): string | null {
  const parts = name.trim().split(/\s+/);
  if (parts.length < 2) return null;
  return [parts[parts.length - 1], ...parts.slice(0, -1)].join(" ");
}

function stripName(name: string): string {
  return name.replace(/[^\p{L}\p{N}\s]/gu, "").replace(/\s+/g, " ").trim();
}

/** AniList sometimes files a character surname-first ("Miku Hatsune"). */
function queryVariants(name: string): string[] {
  const out = [name];
  const swapped = swapName(name);
  if (swapped) out.push(swapped);
  const stripped = stripName(name);
  if (stripped && stripped !== name) {
    out.push(stripped);
    const swappedStripped = swapName(stripped);
    if (swappedStripped) out.push(swappedStripped);
  }
  return out;
}

async function fetchPortrait(
  name: string,
  series?: string,
  anilistId?: number,
): Promise<string | null> {
  if (anilistId) {
    const exact = await anilistExact(anilistId);
    if (exact) return exact;
  }

  const accept = new Set([normalise(name)]);
  const hits = [];
  for (const query of queryVariants(name)) {
    accept.add(normalise(query));
    const found = await anilistSearch(query);
    if (found.length > 0) hits.push(...found);
    if (hits.length >= 4) break;
  }

  if (hits.length > 0) {
    const named = hits.filter((hit) => accept.has(normalise(hit.name)));
    const pool = named.length > 0 ? named : hits;

    if (series) {
      const bySeries = pool.find((hit) =>
        hit.series.some(
          (title) =>
            title &&
            (similar(title, series) ||
              // "Naruto" vs "Naruto: Shippuden" - one title contains the other
              title.toLowerCase().includes(series.toLowerCase()) ||
              series.toLowerCase().includes(title.toLowerCase())),
        ),
      );
      if (bySeries?.image) return bySeries.image;
      // The name matched several different characters and none of them belongs
      // to this series. Guessing would put a stranger's face on the card, so
      // leave it empty and let the initial-letter fallback show instead.
      const distinct = new Set(pool.map((hit) => hit.image));
      if (distinct.size > 1) return null;
    }

    const exact = pool.find(
      (hit) => accept.has(normalise(hit.name)) && hit.image,
    );
    if (exact?.image) return exact.image;
  }

  // Jikan fallback for names AniList cannot resolve.
  const jikan = await jikanSearch(name);
  if (jikan.length > 0) {
    const exactName = normalise(name);
    const pool = jikan.filter((hit) => normalise(hit.name) === exactName);
    const bySeries = series
      ? jikan.find((hit) =>
          (hit.anime ?? []).some((a) => a.title && similar(a.title, series)),
        )
      : undefined;
    if (!bySeries && pool.length > 1) return null;
    const pick = bySeries ?? pool[0];

    if (pick) {
      malIds = { ...malIds, [`${name}|${series ?? ""}`]: pick.mal_id };
      writeJson(MAL_KEY, malIds);
      const url = pick.images?.jpg?.image_url ?? null;
      if (url) return url;
    }
  }

  return null;
}

function schedule<T>(job: () => Promise<T>): Promise<T> {
  const run = queue.then(async () => {
    const wait = Math.max(0, MIN_INTERVAL_MS - (Date.now() - lastRun));
    if (wait > 0) await new Promise((resolve) => setTimeout(resolve, wait));
    lastRun = Date.now();
    try {
      return await job();
    } finally {
      lastRun = Date.now();
    }
  });
  queue = run.catch(() => undefined);
  return run as Promise<T>;
}

/**
 * Some upstream results are a literal placeholder picture ("NO IMAGE").
 * AniList serves `.../character/large/default.jpg` for characters with no art;
 * Jikan has its own question-mark asset. Treat all of them as a miss so the
 * card back renders instead.
 */
function isPlaceholder(url: string): boolean {
  return (
    /\/default\.(jpe?g|png|webp)(\?|#|$)/i.test(url) ||
    /(no[-_]?image|placeholder)[^/]*\.(jpe?g|png|gif|webp)(\?|#|$)/i.test(url) ||
    /questionmark(_\d+)?\.(gif|png|jpe?g)/i.test(url)
  );
}

/** True when an upstream URL is a "no art" asset rather than a portrait. */
export function isPlaceholderPortrait(url: string): boolean {
  return isPlaceholder(url);
}

/* Older caches stored the default asset as if it were art; drop it once. */
function purgePlaceholderCache(): void {
  const kept: ImageCache = {};
  let dropped = 0;
  for (const [key, url] of Object.entries(cache)) {
    if (url && isPlaceholder(url)) {
      dropped += 1;
      continue;
    }
    kept[key] = url;
  }
  if (dropped > 0) {
    cache = kept;
    writeJson(CACHE_KEY, cache);
  }
}

purgePlaceholderCache();

function cacheKey(name: string, series?: string): string {
  return series ? `${name}|${series}` : name;
}

function warm(url: string): void {
  if (typeof Image === "undefined") return;
  const img = new Image();
  img.decoding = "async";
  img.src = url;
}

export function resolvePortrait(
  name: string,
  series?: string,
  anilistId?: number,
): Promise<string | null> {
  const key = cacheKey(name, series);
  const bundledUrl = bundled[key];
  if (bundledUrl && !isPlaceholder(bundledUrl)) {
    warm(bundledUrl);
    return Promise.resolve(bundledUrl);
  }
  const cachedUrl = cache[key];
  if (cachedUrl && !isPlaceholder(cachedUrl)) {
    warm(cachedUrl);
    return Promise.resolve(cachedUrl);
  }

  const failed = failures[key];
  if (failed && failed.n >= MAX_ATTEMPTS && Date.now() - failed.at < BACKOFF_MS) {
    return Promise.resolve(null);
  }

  const existing = inflight.get(key);
  if (existing) return existing;

  const task = schedule(() => fetchPortrait(name, series, anilistId))
    .catch(() => null)
    .then((raw) => {
      inflight.delete(key);
      const url = raw && !isPlaceholder(raw) ? raw : null;
      if (url) {
        // only a real hit is persisted - a miss must stay retryable
        cache = { ...cache, [key]: url };
        writeJson(CACHE_KEY, cache);
        warm(url);
        if (failures[key]) {
          const next = { ...failures };
          delete next[key];
          failures = next;
          writeJson(FAIL_KEY, failures);
        }
        recordStat(true);
      } else {
        failures = {
          ...failures,
          [key]: { n: (failures[key]?.n ?? 0) + 1, at: Date.now() },
        };
        writeJson(FAIL_KEY, failures);
        recordStat(false);
      }
      return url;
    });

  inflight.set(key, task);
  return task;
}

export function anilistIdFromRosterId(id?: string): number | undefined {
  if (!id) return undefined;
  const match = /^a(\d+)$/.exec(id);
  return match ? Number(match[1]) : undefined;
}

export function usePortrait(
  name: string,
  series?: string,
  rosterId?: string,
  enabled = true,
): string | null {
  const key = cacheKey(name, series);
  const [url, setUrl] = useState<string | null>(() =>
    bundled[key] ?? (key in cache ? cache[key] : null),
  );

  useEffect(() => {
    let alive = true;
    if (!enabled) {
      setUrl(null);
      return;
    }
    if (bundled[key]) {
      setUrl(bundled[key]);
      return;
    }
    if (key in cache) {
      setUrl(cache[key]);
      return;
    }
    setUrl(null);
    resolvePortrait(name, series, anilistIdFromRosterId(rosterId)).then((value) => {
      if (alive) setUrl(value);
    });
    return () => {
      alive = false;
    };
  }, [key, name, series, rosterId, enabled]);

  return url;
}

export function prefetchPortraits(
  entries: { name: string; series: string; id?: string }[],
): void {
  for (const entry of entries) {
    if (!(cacheKey(entry.name, entry.series) in cache)) {
      void resolvePortrait(entry.name, entry.series, anilistIdFromRosterId(entry.id));
    }
  }
}

/** Extra images for a character, via Jikan's picture list (MAL id). */
export async function fetchGallery(
  name: string,
  series?: string,
): Promise<string[]> {
  const key = cacheKey(name, series);
  let malId = malIds[key];

  if (!malId) {
    const hits = await jikanSearch(name);
    const exactName = normalise(name);
    const pick =
      hits.find((hit) => normalise(hit.name) === exactName) ?? hits[0];
    if (!pick) return [];
    malId = pick.mal_id;
    malIds = { ...malIds, [key]: malId };
    writeJson(MAL_KEY, malIds);
  }

  try {
    const response = await fetch(`${JIKAN}/characters/${malId}/pictures`);
    if (!response.ok) return [];
    const json = (await response.json()) as {
      data?: { jpg?: { image_url?: string } }[];
    };
    const urls = (json.data ?? [])
      .map((entry) => entry.jpg?.image_url)
      .filter((url): url is string => Boolean(url));
    return urls.slice(1, 9);
  } catch {
    return [];
  }
}

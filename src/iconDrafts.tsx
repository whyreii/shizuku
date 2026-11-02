import type { ReactNode, SVGProps } from "react";

/**
 * Draft set for Phase 2B — "carved ice".
 * 1.5 stroke on a 24 grid, butt terminals, round joins, a 45° chamfer where a
 * shape has a corner, and one filled facet at 30% per glyph.
 * Nothing here is wired into Icon.tsx yet.
 */
export type DraftIconName =
  | "album"
  | "wishes"
  | "medals"
  | "fountain"
  | "loot"
  | "series"
  | "ripples"
  | "kakigori"
  | "rolls"
  | "shard"
  | "crystal"
  | "clock"
  | "gear"
  | "lock"
  | "star"
  | "power"
  | "sleet"
  | "hail"
  | "glaze"
  | "frost"
  | "blizzard"
  | "glacier"
  | "aurora";

const FACET = {
  fill: "currentColor",
  fillOpacity: 0.3,
  stroke: "none",
} as const;

const GLYPHS: Record<DraftIconName, ReactNode> = {
  /* rail --------------------------------------------------------------- */
  /* three cards, fanned */
  album: (
    <>
      <g transform="translate(-1.4 0) rotate(-13 12 12)">
        <path d="M4.8 5.4h7.2l1.8 1.8v12.2H4.8Z" />
      </g>
      <path d="M7 4.6h7.2l1.8 1.8v13H7Z" />
      <g transform="translate(1.4 0) rotate(13 12 12)">
        <path d="M9.2 5.4h7.2l1.8 1.8v12.2H9.2Z" />
        <path d="M9.2 14.4h9v5H9.2Z" {...FACET} />
      </g>
    </>
  ),
  /* falling star with a trail */
  wishes: (
    <>
      <path d="M15.2 2.2 16.73 6.3 21.1 6.48 17.67 9.2 18.84 13.42 15.2 11 11.56 13.42 12.73 9.2 9.3 6.48 13.67 6.3Z" />
      <path d="M11.4 13.4C8.8 15.6 6.6 17.6 4 19.4M10 11.4C8.2 13 6.8 14.4 5.4 16" />
      <path d="M11.56 13.42 15.2 11 12.73 9.2Z" {...FACET} />
    </>
  ),
  /* hex medal, face, ribbon */
  medals: (
    <>
      <path d="M12 3 19 7.1v9.8L12 21l-7-4.1V7.1Z" />
      <path d="M9.5 19.6 8 22.5M14.5 19.6 16 22.5" />
      <circle cx="12" cy="12" r="2.2" />
      <path d="M12 3 19 7.1 12 12Z" {...FACET} />
    </>
  ),
  /* basin with two jets */
  fountain: (
    <>
      <path d="M7.4 11.4h7.6l1.6 1.6v7H8.4Z" />
      <path d="M7.9 15.2h8.1" />
      <path d="M12 3.2c1.3 1.5 2 2.6 2 3.4a2 2 0 0 1-4 0c0-.8.7-1.9 2-3.4Z" />
      <path d="M8 15.4h8l-.6 4.6H8.6Z" {...FACET} />
    </>
  ),
  /* chest with a tilted lid */
  loot: (
    <>
      <path d="M4.6 12.6a7.4 6.2 0 0 1 14.8 0Z" />
      <path d="M4.6 12.6a7.4 6.2 0 0 1 14.8 0Z" {...FACET} />
      <path d="M5 12.6h14v5.2l-1.4 1.4H6.4L5 17.8Z" />
      <path d="M10.6 12.6h2.8v2.8h-2.8Z" />
    </>
  ),
  /* four book spines, one leaning, on a shelf */
  series: (
    <>
      <path d="M4.4 6.6h2.3l.9.9v11H4.4Z" />
      <path d="M8.6 4.6h2.3l.9.9v13H8.6Z" />
      <path d="M8.6 4.6h2.3l.9.9v13H8.6Z" {...FACET} />
      <path d="M12.8 7.6h2.3l.9.9v10H12.8Z" />
      <g transform="rotate(15 17.8 18.5)">
        <path d="M16.6 6h2.4v12.5h-2.4Z" />
      </g>
      <path d="M3.6 18.5h17" />
    </>
  ),
  /* droplet striking full rings */
  ripples: (
    <>
      <path d="M12 2.4c1.5 1.6 2.4 2.9 2.4 3.9a2.4 2.4 0 0 1-4.8 0c0-1 .9-2.3 2.4-3.9Z" />
      <ellipse cx="12" cy="14.6" rx="9" ry="3.4" />
      <ellipse cx="12" cy="14.6" rx="6" ry="2.2" />
      <ellipse cx="12" cy="14.6" rx="3" ry="1.1" {...FACET} />
    </>
  ),
  /* header / currency ---------------------------------------------------- */
  /* droplet with a curved highlight */
  kakigori: (
    <>
      <path d="M12 2.6 17.6 8.6a7.8 7.8 0 1 1-11.2 0Z" />
      <path d="M9.4 13a3.4 3.4 0 0 1 1.5-3.1" />
      <path d="M12 12 17.4 8.8A7.8 7.8 0 0 1 12 21.4Z" {...FACET} />
    </>
  ),
  /* circular refresh */
  rolls: (
    <>
      <path d="M20 12a8 8 0 1 1-2.4-5.7" />
      <path d="M20 4.3v4h-4" />
      <path d="M20 4.3v4h-4Z" {...FACET} />
    </>
  ),
  /* splinter */
  shard: (
    <>
      <path d="M12 2.6 16 9.6 12 21.4 8 9.6Z" />
      <path d="M12 2.6 16 9.6 12 21.4Z" {...FACET} />
    </>
  ),
  /* wide faceted gem */
  crystal: (
    <>
      <path d="M7 3.4h10l3.6 5.2L12 21 3.4 8.6Z" />
      <path d="M3.4 8.6h17.2" />
      <path d="M7 3.4 9.2 8.6 12 21M17 3.4 14.8 8.6 12 21" />
      <path d="M12 8.6h8.6L12 21Z" {...FACET} />
    </>
  ),
  /* closed dial + hands */
  clock: (
    <>
      <circle cx="12" cy="12" r="8.6" />
      <path d="M12 7.4V12l3.2 2.2" />
      <path d="M12 12V3.4A8.6 8.6 0 0 1 20.6 12Z" {...FACET} />
    </>
  ),
  /* cog */
  gear: (
    <>
      <path d="M9.89 2.84 14.11 2.84 13.87 5.88 16.36 7.32 18.87 5.59 20.99 9.25 18.24 10.56 18.24 13.44 20.99 14.75 18.87 18.41 16.36 16.68 13.87 18.12 14.11 21.16 9.89 21.16 10.13 18.12 7.64 16.68 5.13 18.41 3.01 14.75 5.76 13.44 5.76 10.56 3.01 9.25 5.13 5.59 7.64 7.32 10.13 5.88Z" />
      <circle cx="12" cy="12" r="2.9" />
      <circle cx="12" cy="12" r="2.9" {...FACET} />
    </>
  ),
  /* actions -------------------------------------------------------------- */
  lock: (
    <>
      <path d="M6.4 10.6h9.8l1.4 1.4v8H6.4Z" />
      <path d="M8.5 10.6V7.5a3.5 3.5 0 0 1 7 0v3.1" />
      <path d="M12 14.2v2.6" />
      <path d="M6.4 14.6h11.2v5.4H6.4Z" {...FACET} />
    </>
  ),
  star: (
    <>
      <path d="M12 3 14.6 9.1 21.2 9.6 16.2 13.9 17.8 20.4 12 16.8 6.2 20.4 7.8 13.9 2.8 9.6 9.4 9.1Z" />
      <path d="M12 12 12 3 14.6 9.1Z" {...FACET} />
    </>
  ),
  power: (
    <>
      <path d="M13.4 2.8 5.2 13.6H11l-1.4 7.6 9.2-11.6H12.6Z" />
      <path d="M12.6 9.6 13.4 2.8 5.2 13.6H11Z" {...FACET} />
    </>
  ),
  /* medals --------------------------------------------------------------- */
  sleet: (
    <>
      <path d="M9.6 3.2c1.5 1.6 2.5 3 2.5 4.1a2.5 2.5 0 0 1-5 0c0-1.1 1-2.5 2.5-4.1Z" />
      <path d="m14.4 13.6-1.5 2.3M18 12l-1.5 2.3M17.6 17.4l-1.5 2.3" />
      <path d="M9.6 3.2c1.5 1.6 2.5 3 2.5 4.1a2.5 2.5 0 0 1-2.5 2.5Z" {...FACET} />
    </>
  ),
  hail: (
    <>
      <circle cx="8" cy="9" r="2" />
      <circle cx="15.6" cy="12.4" r="2.4" />
      <circle cx="15.6" cy="12.4" r="2.4" {...FACET} />
      <circle cx="9.6" cy="17.4" r="1.8" />
      <path d="M8 4.4v1.8M15.6 7.4v1.8M9.6 13v1.8" />
    </>
  ),
  glaze: (
    <>
      <path d="M4 12.5c2.5-3 5.5-3 8 0s5.5 3 8 0" />
      <path d="M4 17c2.5-3 5.5-3 8 0s5.5 3 8 0" />
      <path d="M12 3.5V8" />
      <path d="M4 12.5c2.5-3 5.5-3 8 0s5.5 3 8 0v2c-2.5 3-5.5 3-8 0s-5.5-3-8 0Z" {...FACET} />
    </>
  ),
  frost: (
    <>
      <path d="M12 3v18" />
      <path d="m4.2 7.5 15.6 9" />
      <path d="m19.8 7.5-15.6 9" />
      <path d="M12 8.6 15 10.3v3.4L12 15.4 9 13.7v-3.4Z" {...FACET} />
    </>
  ),
  blizzard: (
    <>
      <path d="M3.5 8h9a2.4 2.4 0 1 0-2.4-2.4" />
      <path d="M3.5 12.5h13a2.2 2.2 0 1 1-2.2 2.2" />
      <path d="M3.5 17h6.5" />
      <path d="M10.1 8a2.4 2.4 0 0 1 2.4-2.4A2.4 2.4 0 0 1 10.1 8Z" {...FACET} />
    </>
  ),
  glacier: (
    <>
      <path d="M3.5 19 9 7.5l3.4 6.5L15 8.5 20.5 19Z" />
      <path d="M6.5 19h11" />
      <path d="M12.4 14 15 8.5 20.5 19h-8.1Z" {...FACET} />
    </>
  ),
  aurora: (
    <>
      <path d="M3.5 7.5c3-3 6 3 9 0s6-3 8 0" />
      <path d="M3.5 12c3-3 6 3 9 0s6-3 8 0" />
      <path d="M3.5 16.5c3-3 6 3 9 0s6-3 8 0" />
      <path d="M3.5 7.5c3-3 6 3 9 0s6-3 8 0v2c-2 2-5-1.4-8 0s-6 3-9 0Z" {...FACET} />
    </>
  ),
};

export const DRAFT_RAIL: DraftIconName[] = [
  "album",
  "wishes",
  "medals",
  "fountain",
  "loot",
  "series",
  "ripples",
];

export const DRAFT_HEADER: DraftIconName[] = [
  "kakigori",
  "rolls",
  "shard",
  "crystal",
  "clock",
  "gear",
];

export const DRAFT_ACTIONS: DraftIconName[] = ["lock", "star", "power"];

export const DRAFT_MEDALS: DraftIconName[] = [
  "sleet",
  "hail",
  "glaze",
  "frost",
  "blizzard",
  "glacier",
  "aurora",
];

export const DRAFT_ALL: DraftIconName[] = [
  ...DRAFT_RAIL,
  ...DRAFT_HEADER,
  ...DRAFT_ACTIONS,
  ...DRAFT_MEDALS,
];

interface Props extends Omit<SVGProps<SVGSVGElement>, "name"> {
  name: DraftIconName;
  size?: number;
}

/** Draft renderer. The app's Icon.tsx is untouched until sign-off. */
export function DraftIcon({ name, size = 24, ...rest }: Props) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="butt"
      strokeLinejoin="round"
      aria-hidden="true"
      {...rest}
    >
      {GLYPHS[name]}
    </svg>
  );
}

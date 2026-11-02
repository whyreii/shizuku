import type { ReactNode, SVGProps } from "react";

/**
 * Draft set for Phase 2B — "carved ice".
 * 1.5 stroke on a 24 grid, butt terminals, round joins (2px corners),
 * one deliberate cut per glyph. Nothing here is wired into Icon.tsx yet.
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

const GLYPHS: Record<DraftIconName, ReactNode> = {
  /* rail --------------------------------------------------------------- */
  album: (
    <>
      <path d="M6.5 3.5H16L18.5 6v14.5h-12Z" />
      <path d="M6.5 16.5h12" />
    </>
  ),
  wishes: (
    <path d="M12 3.2 14.2 9.8 20.8 12l-6.6 2.2L12 20.8 9.8 14.2 3.2 12l6.6-2.2Z" />
  ),
  medals: (
    <>
      <path d="M12 3 19 7.1v9.8L12 21l-7-4.1V7.1Z" />
      <path d="M9.5 19.6 8 22.5M14.5 19.6 16 22.5" />
      <circle cx="12" cy="12" r="2.2" />
    </>
  ),
  fountain: (
    <>
      <path d="M4 10.5h16l-1.8 9H5.8Z" />
      <path d="M4 14.5h16" />
      <path d="M12 2.8c1.6 1.7 2.6 3.1 2.6 4.1a2.6 2.6 0 0 1-5.2 0c0-1 1-2.4 2.6-4.1Z" />
    </>
  ),
  loot: (
    <>
      <path d="M4 8.5h16V20H4Z" />
      <path d="M3 5h18v3.5H3Z" />
      <path d="M12 5v3.5" />
      <path d="M9.6 13.8h4.8" />
    </>
  ),
  series: (
    <>
      <path d="M4.5 4.5V20M8.5 6.5V20M12.5 4V20M16.5 8V20" />
      <path d="M3 20h15.5" />
    </>
  ),
  ripples: (
    <>
      <path d="M3 8.5a9 4.2 0 0 1 18 0" />
      <path d="M6 12.8a6 3 0 0 1 12 0" />
      <path d="M9 17a3 1.6 0 0 1 6 0" />
    </>
  ),
  /* header / currency ---------------------------------------------------- */
  kakigori: (
    <>
      <path d="M12 2.6 17.6 8.6a7.8 7.8 0 1 1-11.2 0Z" />
      <path d="M8.8 13h6.4" />
    </>
  ),
  rolls: (
    <>
      <path d="M4 8h16v8H4Z" />
      <path d="M8 8v8M16 8v8" />
      <path d="M10.5 10.5h.01M13.5 13.5h.01" />
    </>
  ),
  shard: (
    <>
      <path d="M12 2.6 16 9.6 12 21.4 8 9.6Z" />
      <path d="M12 6.4v11" />
    </>
  ),
  crystal: (
    <>
      <path d="M12 2.8 19.2 7v10L12 21.2 4.8 17V7Z" />
      <path d="M4.8 7 12 11.6 19.2 7" />
      <path d="M12 11.6v9.6" />
    </>
  ),
  clock: (
    <>
      <path d="M12 3.2a8.8 8.8 0 1 0 8.8 8.8" />
      <path d="M12 7.2V12l3.4 2.4" />
    </>
  ),
  gear: (
    <>
      <path d="M9.5 2.6h5l.6 2.4 2.1 1.2 2.4-.6 2.5 4.3-1.8 1.7v2.4l1.8 1.7-2.5 4.3-2.4-.6-2.1 1.2-.6 2.4h-5l-.6-2.4-2.1-1.2-2.4.6-2.5-4.3 1.8-1.7v-2.4L2.9 10l2.5-4.3 2.4.6 2.1-1.2Z" />
      <circle cx="12" cy="12" r="3.2" />
    </>
  ),
  /* actions -------------------------------------------------------------- */
  lock: (
    <>
      <path d="M6.5 10.5h11V20.5h-11Z" />
      <path d="M8.5 10.5V7.5a3.5 3.5 0 0 1 7 0v3" />
      <path d="M12 14.2v2.6" />
    </>
  ),
  star: (
    <path d="M12 3 14.6 9.1 21.2 9.6 16.2 13.9 17.8 20.4 12 16.8 6.2 20.4 7.8 13.9 2.8 9.6 9.4 9.1Z" />
  ),
  power: <path d="M13.4 2.8 5.2 13.6H11l-1.4 7.6 9.2-11.6H12.6Z" />,
  /* medals --------------------------------------------------------------- */
  sleet: (
    <>
      <path d="M9.6 3.2c1.5 1.6 2.5 3 2.5 4.1a2.5 2.5 0 0 1-5 0c0-1.1 1-2.5 2.5-4.1Z" />
      <path d="m14.4 13.6-1.5 2.3M18 12l-1.5 2.3M17.6 17.4l-1.5 2.3" />
    </>
  ),
  hail: (
    <>
      <circle cx="8" cy="9" r="2" />
      <circle cx="15.6" cy="12.4" r="2.4" />
      <circle cx="9.6" cy="17.4" r="1.8" />
      <path d="M8 4.4v1.8M15.6 7.4v1.8M9.6 13v1.8" />
    </>
  ),
  glaze: (
    <>
      <path d="M4 12.5c2.5-3 5.5-3 8 0s5.5 3 8 0" />
      <path d="M4 17c2.5-3 5.5-3 8 0s5.5 3 8 0" />
      <path d="M12 3.5V8" />
    </>
  ),
  frost: (
    <>
      <path d="M12 3v18" />
      <path d="m4.2 7.5 15.6 9" />
      <path d="m19.8 7.5-15.6 9" />
    </>
  ),
  blizzard: (
    <>
      <path d="M3.5 8h9a2.4 2.4 0 1 0-2.4-2.4" />
      <path d="M3.5 12.5h13a2.2 2.2 0 1 1-2.2 2.2" />
      <path d="M3.5 17h6.5" />
    </>
  ),
  glacier: (
    <>
      <path d="M3.5 19 9 7.5l3.4 6.5L15 8.5 20.5 19Z" />
      <path d="M6.5 19h11" />
    </>
  ),
  aurora: (
    <>
      <path d="M3.5 7.5c3-3 6 3 9 0s6-3 8 0" />
      <path d="M3.5 12c3-3 6 3 9 0s6-3 8 0" />
      <path d="M3.5 16.5c3-3 6 3 9 0s6-3 8 0" />
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

/** The syrup drop used on rail variants. */
export function RailDrop({ size = 24, color = "#8cc8ff" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" className="rail-drop">
      <path
        d="M18.4 17.6c1 1.2 1.7 2.1 1.7 2.8a1.7 1.7 0 1 1-3.4 0c0-.7.7-1.6 1.7-2.8Z"
        fill={color}
      />
    </svg>
  );
}

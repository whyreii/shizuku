// glyphs: one 24x24 grid, 1.6 stroke, currentColor
import type { ReactNode, SVGProps } from "react";

/**
 * The app's icon set. One 24x24 grid, 1.6 stroke, currentColor - so an icon
 * inherits whatever colour its row already uses (frost for value, muted for
 * labels). Kept inline: ten glyphs are cheaper than a dependency.
 */
export type IconName =
  | "kakigori"
  | "shard"
  | "crystal"
  | "rolls"
  | "power"
  | "badge"
  | "lock"
  | "wish"
  | "loot"
  | "clock"
  | "gear"
  | "album"
  | "series"
  | "log"
  | "fountain";

const GLYPHS: Record<IconName, ReactNode> = {
  /* kakigori: the drop from the wordmark */
  kakigori: (
    <>
      <path d="M12 2.7 17.7 8.4a8 8 0 1 1-11.4 0Z" />
      <path d="M9.6 13.4a2.6 2.6 0 0 0 2.6 2.6" opacity=".5" />
    </>
  ),
  /* shard: a splinter of ice - angular on purpose, never mistakable for the drop */
  shard: (
    <>
      <path d="M12 2.4 17.4 10.6 12 21.6 6.6 10.6Z" />
      <path d="M12 2.4v19.2" opacity=".5" />
    </>
  ),
  /* crystal: the faceted gem that lands on a card */
  crystal: (
    <>
      <path d="M6.5 3h11L22 9 12 21 2 9Z" />
      <path d="M2 9h20" opacity=".5" />
      <path d="m10 3-2.5 6 4.5 12 4.5-12L14 3" opacity=".5" />
    </>
  ),
  /* rolls: a re-roll, clockwise */
  rolls: (
    <>
      <path d="M21 12a9 9 0 1 1-2.7-6.4" />
      <path d="M21 3.4v5.2h-5.2" />
    </>
  ),
  /* power: derived from shards */
  power: <path d="M13.2 2.6 4.6 13.9h5.6l-1.1 7.5 8.7-11.4h-5.6Z" />,
  /* badge: one tier of the ladder */
  badge: (
    <>
      <path d="M12 2.6 20.2 7.3v9.4L12 21.4 3.8 16.7V7.3Z" />
      <circle cx="12" cy="12" r="2.4" opacity=".6" />
    </>
  ),
  lock: (
    <>
      <rect x="4.4" y="10.4" width="15.2" height="10.2" rx="2.4" />
      <path d="M8 10.4V7.9a4 4 0 0 1 8 0v2.5" />
    </>
  ),
  wish: (
    <path d="M12 3.1l2.8 5.8 6.3.9-4.6 4.4 1.1 6.3L12 17.6l-5.6 2.9 1.1-6.3L2.9 9.8l6.3-.9Z" />
  ),
  loot: (
    <>
      <path d="M3.6 8.4h16.8v11.7H3.6Z" />
      <path d="M2.4 4.1h19.2v4.3H2.4Z" opacity=".55" />
      <path d="M12 4.1v16" opacity=".55" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="8.6" />
      <path d="M12 7.2V12l3.3 2" />
    </>
  ),
  /* album: shelves of cards */
  album: (
    <>
      <rect x="3.5" y="3.5" width="7.5" height="7.5" rx="2" />
      <rect x="13" y="3.5" width="7.5" height="7.5" rx="2" opacity=".55" />
      <rect x="3.5" y="13" width="7.5" height="7.5" rx="2" opacity=".55" />
      <rect x="13" y="13" width="7.5" height="7.5" rx="2" />
    </>
  ),
  /* series: stacked spines */
  series: (
    <>
      <path d="M4.2 4.4h4.6v15.2H4.2Z" />
      <path d="M9.8 4.4h4.6v15.2H9.8Z" opacity=".55" />
      <path d="m16.2 5.3 3.1.8-2.6 13.4-3.1-.8Z" opacity=".55" />
    </>
  ),
  /* log: an entry list */
  log: (
    <>
      <path d="M4 6.4h16" />
      <path d="M4 12h11.4" opacity=".55" />
      <path d="M4 17.6h7.6" opacity=".55" />
    </>
  ),
  /* fountain: the tower's replacement - a jet falling into a basin */
  fountain: (
    <>
      <path d="M12 3.6v6.4" />
      <path d="M12 6.2c-2.7 0-4.8 1.9-5.4 4.6" />
      <path d="M12 6.2c2.7 0 4.8 1.9 5.4 4.6" />
      <path d="M3.4 12.6h17.2" />
      <path d="M6.2 12.6v6.2h11.6v-6.2" />
    </>
  ),
  gear: (
    <>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.9.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.9 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.9l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.9.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.9-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.9V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1Z" />
    </>
  ),
};

interface IconProps extends Omit<SVGProps<SVGSVGElement>, "name"> {
  name: IconName;
  size?: number;
}

export function Icon({ name, size = 13, className, ...rest }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      className={className ? `icon ${className}` : "icon"}
      {...rest}
    >
      {GLYPHS[name]}
    </svg>
  );
}
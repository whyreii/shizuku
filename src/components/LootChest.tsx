/**
 * The loot chest. Hand-cut to the icon grid (24x24, 1.5 stroke, chamfered
 * corners, one 30% facet) but drawn large: this is the hero of the tab, not a
 * row glyph, so it carries a lid seam, straps and a keyhole plate.
 */
export function LootChest({
  size = 96,
  sealed = false,
}: {
  size?: number;
  sealed?: boolean;
}) {
  return (
    <svg
      className="loot-chest"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="butt"
      strokeLinejoin="miter"
      aria-hidden="true"
      data-sealed={sealed ? "true" : "false"}
    >
      {/* lid: the one filled facet */}
      <path
        d="M3.75 9.5V7.25L6.25 4.75h11.5l2.5 2.5V9.5Z"
        fill="currentColor"
        fillOpacity={0.3}
      />
      {/* body */}
      <path d="M3.75 9.5h16.5v9.25l-2.5 2.5H6.25l-2.5-2.5Z" />
      {/* lid seam */}
      <path d="M3.75 9.5h16.5" />
      {/* straps */}
      <path d="M8.5 4.75v16.5M15.5 4.75v16.5" opacity={0.5} />
      {/* keyhole plate */}
      <rect x="10.25" y="12" width="3.5" height="5" />
      <circle cx="12" cy="14" r="0.8" fill="currentColor" stroke="none" />
      <path d="M12 14.8v1.4" />
      {/* seal band across the seam */}
      <path d="M10.25 9.5v-2.5h3.5v2.5" />
    </svg>
  );
}

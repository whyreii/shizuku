// The icon set. One 24x24 grid, 1.5 stroke, butt terminals, a 45-degree chamfer
// where a shape has a corner, and one filled facet at 30% per glyph - so an icon
// inherits whatever colour its row already uses.
//
// Most glyphs come from the owner's icon studio (src/components/iconParts.ts)
// and carry their own animated part groups; the rest are the hand-cut set that
// predates it. Both are styled by src/icons.css: idle motion only when a caller
// asks for it, a one-shot burst on press, and nothing at all under
// prefers-reduced-motion.
import { useEffect, useRef } from "react";
import type { ReactNode, SVGProps } from "react";
import { ICON_PARTS } from "./iconParts";

export type IconName =
  | "album"
  | "wish"
  | "badge"
  | "log"
  | "fountain"
  | "loot"
  | "series"
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

/** Glyphs the animated set does not cover. */
const GLYPHS: Partial<Record<IconName, ReactNode>> = {
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
  /* actions */
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
};

interface IconProps extends Omit<SVGProps<SVGSVGElement>, "name"> {
  name: IconName;
  size?: number;
  /** Loop this icon's idle motion. One icon at a time, so the page stays quiet. */
  anim?: boolean;
}

const BURST_MS = 680;

export function Icon({
  name,
  size = 13,
  className,
  anim = false,
  onPointerDown,
  ...rest
}: IconProps) {
  const ref = useRef<SVGSVGElement | null>(null);
  const timer = useRef<number | null>(null);
  const parts = ICON_PARTS[name];

  // The flourish belongs to the control, not to the 20px glyph: pressing
  // anywhere in the button that owns this icon should set it off.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const host = el.closest("button, a, [role='button']");
    if (!host) return;
    const burst = () => {
      // restart from the top, whatever ran before
      el.classList.remove("is-clicked");
      void el.getBoundingClientRect();
      el.classList.add("is-clicked");
      if (timer.current !== null) window.clearTimeout(timer.current);
      timer.current = window.setTimeout(() => {
        el.classList.remove("is-clicked");
        timer.current = null;
      }, BURST_MS);
    };
    host.addEventListener("pointerdown", burst);
    return () => {
      host.removeEventListener("pointerdown", burst);
      if (timer.current !== null) window.clearTimeout(timer.current);
    };
  }, []);

  return (
    <svg
      ref={ref}
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="butt"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      className={["icon", anim ? "is-anim" : "", className]
        .filter(Boolean)
        .join(" ")}
      onPointerDown={onPointerDown}
      {...rest}
    >
      {parts ? (
        <g dangerouslySetInnerHTML={{ __html: parts }} />
      ) : (
        GLYPHS[name]
      )}
    </svg>
  );
}

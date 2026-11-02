/**
 * Authored empty-state drawings (art direction 5): 1.5 stroke, butt terminals,
 * one 30% facet, ink + frost. No text inside the drawing; the sentence sits
 * below it.
 */

/** Stage, no current roll: the card back — diagonal weave, one cut corner. */
export function CardBackArt() {
  return (
    <svg
      className="rest-art"
      viewBox="0 0 180 252"
      width="180"
      height="252"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <pattern
          id="ea-weave"
          width="14"
          height="14"
          patternUnits="userSpaceOnUse"
          patternTransform="rotate(30)"
        >
          <line
            x1="0"
            y1="0"
            x2="0"
            y2="14"
            stroke="currentColor"
            strokeOpacity="0.14"
            strokeWidth="1.2"
          />
        </pattern>
        <pattern
          id="ea-weave-cross"
          width="14"
          height="14"
          patternUnits="userSpaceOnUse"
          patternTransform="rotate(-30)"
        >
          <line
            x1="0"
            y1="0"
            x2="0"
            y2="14"
            stroke="currentColor"
            strokeOpacity="0.07"
            strokeWidth="1.2"
          />
        </pattern>
        <clipPath id="ea-card">
          <path d="M14 1.5H151L178.5 29V238A13 13 0 0 1 165.5 251H14A13 13 0 0 1 1 238V14A13 13 0 0 1 14 1.5Z" />
        </clipPath>
      </defs>

      <g clipPath="url(#ea-card)">
        <rect width="180" height="252" fill="url(#ea-weave)" />
        <rect width="180" height="252" fill="url(#ea-weave-cross)" />
        <path d="M151 1.5 178.5 29H151Z" fill="currentColor" fillOpacity="0.3" />
      </g>

      <path
        d="M14 1.5H151L178.5 29V238A13 13 0 0 1 165.5 251H14A13 13 0 0 1 1 238V14A13 13 0 0 1 14 1.5Z"
        stroke="currentColor"
        strokeWidth="1.5"
      />
    </svg>
  );
}

/** Wishes, no starwish: an empty plinth — stand plus a crescent shadow. */
export function PlinthArt() {
  return (
    <svg
      className="plinth-art"
      viewBox="0 0 120 160"
      width="120"
      height="160"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <mask id="ea-crescent">
          <ellipse cx="58" cy="140" rx="26" ry="7" fill="#ffffff" />
          <ellipse cx="66" cy="139" rx="26" ry="7" fill="#000000" />
        </mask>
      </defs>

      <rect
        x="24"
        y="130"
        width="72"
        height="20"
        fill="currentColor"
        fillOpacity="0.3"
        mask="url(#ea-crescent)"
      />

      <path d="M30 54h60v8H30Z" stroke="currentColor" strokeWidth="1.5" />
      <path d="M45 62v50M75 62v50" stroke="currentColor" strokeWidth="1.5" />
      <path d="M36 112h48v8H36Z" stroke="currentColor" strokeWidth="1.5" />
      <path d="M70 54h20v8H70Z" fill="currentColor" fillOpacity="0.3" />
    </svg>
  );
}

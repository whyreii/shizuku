// Animated icon bodies, ported verbatim from the owner's icon studio.
// One 24x24 grid, 1.5 stroke, butt terminals, one 30% facet per glyph.
// Rendered as inner SVG markup; the parts are static strings, never user data.
// Classes in here (.ink-stroke, .ink-fill-tone, .album-card-left, ...) are
// styled and animated by src/icons.css.

export const ICON_PARTS: Partial<Record<string, string>> = {
  /* album */
  album: `
    <circle class="ink-stroke burst-ring" style="transform-origin: 12px 12.5px;" cx="12" cy="12.5" r="7" />
    <!-- Left Tilted Card -->
    <g class="album-card-left" style="transform-origin: 9.68px 20.35px;">
    <polygon class="ink-stroke" points="5.5,5.5 12.5,5.5 14,7 14,18.5 12.5,20 5.5,20 4,18.5 4,7" />
    </g>
    <!-- Right Tilted Card -->
    <g class="album-card-right" style="transform-origin: 14.32px 20.35px;">
    <polygon class="ink-stroke" points="11.5,5.5 18.5,5.5 20,7 20,18.5 18.5,20 11.5,20 10,18.5 10,7" />
    </g>
    <!-- Center Featured Card with Two-Tone Inner Fill & Emblem -->
    <g class="album-card-center" style="transform-origin: 12px 20.35px;">
    <polygon class="ink-fill-tone" points="8.5,4 15.5,4 17,5.5 17,18 15.5,19.5 8.5,19.5 7,18 7,5.5" />
    <polygon class="ink-stroke" points="8.5,4 15.5,4 17,5.5 17,18 15.5,19.5 8.5,19.5 7,18 7,5.5" />
    <path class="ink-stroke" d="M 12 8.5 L 14 11.5 L 12 14.5 L 10 11.5 Z" />
    </g>
  `,
  /* wishes */
  wish: `
    <circle class="ink-stroke burst-ring" style="transform-origin: 13.5px 10.5px;" cx="13.5" cy="10.5" r="5.5" />
    <!-- 3 Diagonal Motion Trails (Bottom-Left) -->
    <line class="ink-stroke onink-trail-1" x1="4" y1="16" x2="7.5" y2="12.5" />
    <line class="ink-stroke onink-trail-2" x1="3.5" y1="20.5" x2="9.5" y2="15" />
    <line class="ink-stroke onink-trail-3" x1="8.5" y1="20.5" x2="11" y2="17.5" />
    <!-- Classic 5-Point Star with Right-Half Two-Tone Fill (Exact "On Ink" Screenshot 1) -->
    <g class="onink-star-5pt" style="transform-origin: 13.56px 10.34px;">
    <path class="ink-fill-tone" d="M 13.5 4.5 L 15.5 8 L 19 8.5 L 16.5 11.5 L 17 15.5 L 13.5 13.5 Z" />
    <polygon class="ink-stroke" points="13.5,4.5 15.5,8 19,8.5 16.5,11.5 17,15.5 13.5,13.5 10,15.5 11,11.5 8,8.5 12,8" />
    </g>
  `,
  /* medals */
  badge: `
    <circle class="ink-stroke burst-ring" style="transform-origin: 12px 11px;" cx="12" cy="11" r="6" />
    <!-- Bottom Medal Ribbons -->
    <g class="medals-ribbon" style="transform-origin: 12px 16.7px;">
    <path class="ink-stroke" d="M 9.5 16 L 8 20.5 M 14.5 16 L 16 20.5" />
    </g>
    <!-- Hexagonal Emblem Body -->
    <g class="medals-body" style="transform-origin: 12px 10.7px;">
    <polygon class="ink-fill-tone" points="12,4 18,7.5 18,14 12,17.5" />
    <polygon class="ink-stroke" points="12,4 18,7.5 18,14 12,17.5 6,14 6,7.5" />
    <circle class="ink-stroke medals-core" style="transform-origin: 12px 10.7px;" cx="12" cy="11" r="2" />
    </g>
  `,
  /* fountain */
  fountain: `
    <circle class="ink-stroke burst-ring" style="transform-origin: 12px 13px;" cx="12" cy="13" r="6" />
    <!-- Top Floating Droplet -->
    <g class="fountain-drop" style="transform-origin: 12px 6.3px;">
    <path class="ink-fill-tone" d="M 12 4 C 12 4 14 6.5 14 8 A 2 2 0 1 1 10 8 C 10 6.5 12 4 12 4 Z" />
    <path class="ink-stroke" d="M 12 4 C 12 4 14 6.5 14 8 A 2 2 0 1 1 10 8 C 10 6.5 12 4 12 4 Z" />
    </g>
    <!-- Symmetrical Spout Water Arcs -->
    <path class="ink-stroke fountain-arc-l" d="M 11.5 14 C 10.5 10 7.5 10 7 14" />
    <path class="ink-stroke fountain-arc-r" d="M 12.5 14 C 13.5 10 16.5 10 17 14" />
    <!-- Tiered Trapezoid Basin (Matching Screenshot 1) -->
    <g class="fountain-basin" style="transform-origin: 12px 18.8px;">
    <polygon class="ink-fill-tone" points="12,14 19,14 17.5,20.5 12,20.5" />
    <polygon class="ink-stroke" points="5,14 19,14 17.5,20.5 6.5,20.5" />
    <line class="ink-stroke" x1="5.5" y1="17" x2="18.5" y2="17" />
    </g>
  `,
  /* loot */
  loot: `
    <circle class="ink-stroke burst-ring" style="transform-origin: 12px 12.5px;" cx="12" cy="12.5" r="7.5" />
    <!-- Inner Treasure Sparkle on Click -->
    <g class="loot-sparkle" style="transform-origin: 12px 8.9px;">
    <path class="ink-stroke" d="M 12 2 V 6 M 10 4 H 14" />
    </g>
    <!-- Chest Base -->
    <path class="ink-fill-tone" d="M 12 11 H 20 V 17.5 A 2.5 2.5 0 0 1 17.5 20 H 12 Z" />
    <path class="ink-stroke" d="M 4 11 H 20 V 17.5 A 2.5 2.5 0 0 1 17.5 20 H 6.5 A 2.5 2.5 0 0 1 4 17.5 Z" />
    <!-- Chest Lid + Center Lock Clasp -->
    <g class="loot-lid" style="transform-origin: 12px 10.76px;">
    <path class="ink-stroke" d="M 4 11 V 8.5 A 4.5 4.5 0 0 1 8.5 4 H 15.5 A 4.5 4.5 0 0 1 20 8.5 V 11 Z" />
    <polygon class="ink-fill-tone" points="11,9 13,9 14,10 14,12 13,13 11,13 10,12 10,10" />
    <polygon class="ink-stroke" points="11,9 13,9 14,10 14,12 13,13 11,13 10,12 10,10" />
    </g>
  `,
  /* series */
  series: `
    <circle class="ink-stroke burst-ring" style="transform-origin: 12px 12px;" cx="12" cy="12" r="6.5" />
    <!-- Book 1 -->
    <g class="series-b1">
    <polygon class="ink-stroke" points="4.5,6.5 6.5,6.5 7.5,7 7.5,19 6.5,19.5 4.5,19.5 4,19 4,7" />
    </g>
    <!-- Book 2 (Taller with Two-Tone Fill) -->
    <g class="series-b2">
    <polygon class="ink-fill-tone" points="8,4.5 10.5,4.5 11,5 11,19 10.5,19.5 8,19.5 7.5,19 7.5,5" />
    <polygon class="ink-stroke" points="8,4.5 10.5,4.5 11,5 11,19 10.5,19.5 8,19.5 7.5,19 7.5,5" />
    </g>
    <!-- Book 3 -->
    <g class="series-b3">
    <polygon class="ink-stroke" points="11.5,7 14,7 14.5,7.5 14.5,19 14,19.5 11.5,19.5 11,19 11,7.5" />
    </g>
    <!-- Book 4 (Angled Leaning Tome on Right) -->
    <g class="series-b4" style="transform-origin: 17.45px 19.63px;">
    <path class="ink-fill-tone" d="M 16 6.5 L 19.5 7.5 L 17 19.5 L 14.5 19.5 Z" />
    <path class="ink-stroke" d="M 16 6.5 L 19.5 7.5 L 17 19.5 L 14.5 19.5 Z" />
    </g>
    <line class="ink-stroke" x1="3" y1="19.5" x2="21" y2="19.5" />
  `,
  /* ripples */
  log: `
    <circle class="ink-stroke burst-ring" style="transform-origin: 12px 14px;" cx="12" cy="14" r="6" />
    <!-- Falling Top Droplet -->
    <g class="ripples-drop" style="transform-origin: 12px 7.5px;">
    <path class="ink-fill-tone" d="M 12 4 C 12 4 14.5 6.5 14.5 8 A 2.5 2.5 0 1 1 9.5 8 C 9.5 6.5 12 4 12 4 Z" />
    <path class="ink-stroke" d="M 12 4 C 12 4 14.5 6.5 14.5 8 A 2.5 2.5 0 1 1 9.5 8 C 9.5 6.5 12 4 12 4 Z" />
    </g>
    <!-- Concentric Elliptical Water Ripples -->
    <ellipse class="ink-fill-tone ripples-ring-inner" style="transform-origin: 12px 17.5px;" cx="12" cy="17" rx="4.5" ry="1.5" />
    <ellipse class="ink-stroke ripples-ring-inner" style="transform-origin: 12px 17.5px;" cx="12" cy="17" rx="4.5" ry="1.5" />
    <ellipse class="ink-stroke ripples-ring-outer" style="transform-origin: 12px 17.5px;" cx="12" cy="17" rx="8" ry="3" />
  `,
  /* shizuku_currency */
  kakigori: `
    <circle class="ink-stroke burst-ring" style="transform-origin: 12px 13.5px;" cx="12" cy="13.5" r="6.5" />
    <g class="currency-drop-group" style="transform-origin: 12px 13px;">
    <!-- Diagonal Lower-Right Meniscus Two-Tone Fill (Matches 1,310 HUD Droplet) -->
    <path class="ink-fill-tone currency-meniscus" style="transform-origin: 12px 14px;" d="M 7.5 15.5 L 16.5 10.5 C 17 11.5 17.5 13 17.5 14.5 A 5.5 5.5 0 0 1 6.5 14.5 C 6.5 14.5 7 15 7.5 15.5 Z" />
    <!-- Diagonal Internal Meniscus Cut Line -->
    <line class="ink-stroke" x1="7.5" y1="15.5" x2="16.5" y2="10" stroke-opacity="0.75" />
    <!-- Rising Micro-Bubble Inside Droplet -->
    <circle class="ink-fill-tone currency-bubble" style="transform-origin: 13.2px 15px;" cx="13.5" cy="15.5" r="1" />
    <!-- Crisp Outer Water Droplet Contour -->
    <path class="ink-stroke" d="M 12 4.5 C 12 4.5 17.5 10 17.5 14.5 A 5.5 5.5 0 1 1 6.5 14.5 C 6.5 10 12 4.5 12 4.5 Z" />
    </g>
  `,
  /* shizuku_rolls */
  rolls: `
    <circle class="ink-stroke burst-ring" style="transform-origin: 12px 12.5px;" cx="12" cy="12.5" r="7.5" />
    <g class="rolls-orbit-group" style="transform-origin: 11.88px 12.58px;">
    <!-- Subtle Two-Tone Inner Core Ring -->
    <circle class="ink-fill-tone" cx="12" cy="12.5" r="3.5" />
    <!-- Open Circular Refresh Arc (Matches 0 ROLLS Icon) -->
    <path class="ink-stroke" d="M 19 14 A 7.5 7.5 0 1 1 17 7" />
    <!-- Crisp Top-Right Arrowhead -->
    <polyline class="ink-stroke" points="17.5,3 17.5,7.5 13,7.5" />
    <!-- Glowing Orbiting Spark Dot at Tail -->
    <circle class="rolls-spark-dot" style="transform-origin: 11.88px 12.58px;" cx="19" cy="14" r="1.5" fill="#7ec8e3" />
    </g>
  `,
  /* sleet */
  sleet: `
    <circle class="ink-stroke burst-ring" style="transform-origin: 12px 13px;" cx="12" cy="13" r="6.5" />
    <g class="sleet-drop" style="transform-origin: 12px 13.3px;">
    <!-- Right-half two-tone droplet fill -->
    <path class="ink-fill-tone" d="M 12 5 C 12 5 17 10.5 17 14 A 5 5 0 0 1 12 19.5 Z" />
    <!-- Crisp Droplet Contour -->
    <path class="ink-stroke" d="M 12 5 C 12 5 17 10.5 17 14 A 5 5 0 1 1 7 14 C 7 10.5 12 5 12 5 Z" />
    </g>
    <!-- Diagonal Razor Sleet Slash Intersecting Droplet -->
    <line class="ink-stroke sleet-slash" x1="6" y1="19" x2="18" y2="7.5" />
  `,
  /* hail */
  hail: `
    <circle class="ink-stroke burst-ring" style="transform-origin: 11.5px 11.5px;" cx="11.5" cy="11.5" r="8" />
    <!-- Pellet 1 (Top Left) -->
    <g class="hail-p1" style="transform-origin: 11.76px 11.52px;">
    <circle class="ink-fill-tone" cx="8.5" cy="7.5" r="3" />
    <circle class="ink-stroke" cx="8.5" cy="7.5" r="3" />
    </g>
    <!-- Pellet 2 (Middle Right) -->
    <g class="hail-p2" style="transform-origin: 11.76px 11.52px;">
    <circle class="ink-fill-tone" cx="16" cy="11" r="3" />
    <circle class="ink-stroke" cx="16" cy="11" r="3" />
    </g>
    <!-- Pellet 3 (Bottom Left) -->
    <g class="hail-p3" style="transform-origin: 11.76px 11.52px;">
    <circle class="ink-fill-tone" cx="9.5" cy="16" r="3" />
    <circle class="ink-stroke" cx="9.5" cy="16" r="3" />
    </g>
  `,
  /* glaze */
  glaze: `
    <circle class="ink-stroke burst-ring" style="transform-origin: 12px 11.5px;" cx="12" cy="11.5" r="6.5" />
    <!-- Vertical Freezing Drop Stem -->
    <line class="ink-stroke glaze-stem" x1="12" y1="4" x2="12" y2="10" />
    <!-- Upper Glaze Wave -->
    <path class="ink-stroke glaze-wave-1" style="transform-origin: 12px 14.6px;" d="M 5.5 13 Q 9 10 12 13 T 18.5 13" />
    <!-- Lower Glaze Wave -->
    <path class="ink-stroke glaze-wave-2" style="transform-origin: 12px 14.6px;" d="M 5.5 17 Q 9 14 12 17 T 18.5 17" />
  `,
  /* frost */
  frost: `
    <circle class="ink-stroke burst-ring" style="transform-origin: 12px 12px;" cx="12" cy="12" r="6.5" />
    <!-- 6-Point Crystalline Snowflake -->
    <g class="frost-crystal" style="transform-origin: 12px 12px;">
    <line class="ink-stroke" x1="12" y1="4" x2="12" y2="20" />
    <line class="ink-stroke" x1="5" y1="8" x2="19" y2="16" />
    <line class="ink-stroke" x1="5" y1="16" x2="19" y2="8" />
    <circle class="ink-fill-tone" cx="12" cy="12" r="2" />
    </g>
  `,
  /* blizzard */
  blizzard: `
    <circle class="ink-stroke burst-ring" style="transform-origin: 12px 12.5px;" cx="12" cy="12.5" r="7" />
    <g class="blizzard-group">
    <!-- Upper Curl Gust -->
    <path class="ink-stroke blizzard-gust-1" d="M 4.5 10 H 15 A 2 2 0 1 0 12.5 7.5" />
    <!-- Middle Long Curl Gust -->
    <path class="ink-stroke blizzard-gust-2" d="M 4 14 H 17 A 2.5 2.5 0 1 1 14.5 16" />
    <!-- Lower Drift Line -->
    <line class="ink-stroke blizzard-gust-3" x1="4.5" y1="17.5" x2="11.5" y2="17.5" />
    </g>
  `,
  /* glacier */
  glacier: `
    <circle class="ink-stroke burst-ring" style="transform-origin: 12px 12.5px;" cx="12" cy="12.5" r="6" />
    <g class="glacier-peaks" style="transform-origin: 12px 17.08px;">
    <!-- Two-Tone Ice Facet on Right Peak -->
    <polygon class="ink-fill-tone" points="12,13.5 15,8.5 19,17 12,17" />
    <!-- Twin Sharp Geometric Mountain Peaks -->
    <polygon class="ink-stroke" points="5,17 9.5,8 12.5,13.5 15,8.5 19,17" />
    </g>
  `,
  /* aurora */
  aurora: `
    <circle class="ink-stroke burst-ring" style="transform-origin: 12px 11.5px;" cx="12" cy="11.5" r="7.5" />
    <g class="aurora-group" style="transform-origin: 12px 11.77px;">
    <path class="ink-stroke aurora-w1" d="M 4.5 7.5 Q 8.5 5 12 7.5 T 19.5 7.5" />
    <path class="ink-stroke aurora-w2" d="M 4.5 12 Q 8.5 9.5 12 12 T 19.5 12" />
    <path class="ink-stroke aurora-w3" d="M 4.5 16 Q 8.5 13.5 12 16 T 19.5 16" />
    </g>
  `,
};

/** Part classes actually used, for the guardrail test. */
export const ICON_PART_CLASSES = [
  "album-card-center",
  "album-card-left",
  "album-card-right",
  "aurora-group",
  "aurora-w1",
  "aurora-w2",
  "aurora-w3",
  "blizzard-group",
  "blizzard-gust-1",
  "blizzard-gust-2",
  "blizzard-gust-3",
  "burst-ring",
  "currency-bubble",
  "currency-drop-group",
  "currency-meniscus",
  "fountain-arc-l",
  "fountain-arc-r",
  "fountain-basin",
  "fountain-drop",
  "frost-crystal",
  "glacier-peaks",
  "glaze-stem",
  "glaze-wave-1",
  "glaze-wave-2",
  "hail-p1",
  "hail-p2",
  "hail-p3",
  "ink-fill-tone",
  "ink-stroke",
  "loot-lid",
  "loot-sparkle",
  "medals-body",
  "medals-core",
  "medals-ribbon",
  "onink-star-5pt",
  "onink-trail-1",
  "onink-trail-2",
  "onink-trail-3",
  "ripples-drop",
  "ripples-ring-inner",
  "ripples-ring-outer",
  "rolls-orbit-group",
  "rolls-spark-dot",
  "series-b1",
  "series-b2",
  "series-b3",
  "series-b4",
  "sleet-drop",
  "sleet-slash"
] as const;

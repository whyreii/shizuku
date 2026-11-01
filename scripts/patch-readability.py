import io

p = "src/styles.css"
s = io.open(p, encoding="utf-8").read()

# card grows a little; layout heights follow it
s = s.replace("  width: 268px;\n  aspect-ratio: 63/88;", "  width: 288px;\n  aspect-ratio: 63/88;", 1)
s = s.replace("  width: 268px;\n  aspect-ratio: 63/88;", "  width: 288px;\n  aspect-ratio: 63/88;", 1)
s = s.replace("  min-height: 374px;", "  min-height: 402px;")
s = s.replace("  max-width: 560px;", "  max-width: 640px;")

s += """

/* ------------------------------------------------------------------
   Readability pass — the base scale was tuned too small (8.5-13px),
   which forced browser zoom to read comfortably.
   ------------------------------------------------------------------ */

.card-name {
  font-size: 23px;
}

.card-series {
  font-size: 9.5px;
}

.card-value {
  font-size: 11px;
}

.chip {
  font-size: 9.5px;
  height: 22px;
}

.numbers dt {
  font-size: 10px;
}

.numbers dd {
  font-size: 15px;
}

.btn {
  font-size: 11px;
  padding: 13px 12px;
}

.hint {
  font-size: 13.5px;
}

.tab {
  font-size: 13.5px;
}

.goal {
  font-size: 10.5px;
}

.readout-row span {
  font-size: 9.5px;
}

.readout-row b {
  font-size: 15px;
}

.row-name,
.wide-name,
.tile-name,
.wish-name,
.series-row {
  font-size: 13.5px;
}

.row-series,
.wide-series,
.mini-series,
.tile-meta,
.wish-series {
  font-size: 9px;
}

.row-rank,
.row-value,
.row-keys,
.wide-rank,
.wide-value,
.wide-keys,
.series-count {
  font-size: 11px;
}

.badge-name {
  font-size: 13.5px;
}

.badge-perk {
  font-size: 9.5px;
}

.badge-price {
  font-size: 10.5px;
}

.log {
  font-size: 12.5px;
}

.sheet-meta dt {
  font-size: 9px;
}

.sheet-meta dd {
  font-size: 13px;
}

.link,
.ghost,
.buy,
.chip-btn {
  font-size: 10px;
}
"""

io.open(p, "w", encoding="utf-8", newline="\n").write(s)
print("readability pass applied")

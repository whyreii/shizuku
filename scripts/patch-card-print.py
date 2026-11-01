import io

p = "src/styles.css"
s = io.open(p, encoding="utf-8").read()

old = """.card3d-inner {
  position: absolute;
  inset: 0;
  border-radius: 18px;
  overflow: hidden;
  background: radial-gradient(120% 90% at 50% 8%, #16283d 0%, #0a1220 55%, #060a10 100%);
  border: 1px solid color-mix(in srgb, var(--tier) 55%, transparent);
  box-shadow: 0 22px 48px -24px #000;
  transform-style: preserve-3d;
}

.card3d-inner::before {
  content: "";
  position: absolute;
  inset: 6px;
  border-radius: 13px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  pointer-events: none;
  z-index: 4;
}"""

new = """.card3d-inner {
  position: absolute;
  inset: 0;
  border-radius: 18px;
  overflow: hidden;
  background: radial-gradient(120% 90% at 50% 8%, #16283d 0%, #0a1220 55%, #060a10 100%);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow:
    0 30px 60px -30px #000,
    0 0 70px -30px var(--tier);
  transform-style: preserve-3d;
}

/* printed tier edge, like the colour band on a real card */
.card3d-inner::before {
  content: "";
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 3px;
  background: linear-gradient(
    to bottom,
    var(--tier),
    color-mix(in srgb, var(--tier) 35%, transparent)
  );
  z-index: 4;
  pointer-events: none;
}"""

assert old in s
s = s.replace(old, new)

old_bottom = """.card-bottom {
  position: absolute;
  left: 8px;
  right: 8px;
  bottom: 8px;
  padding: 8px 10px 9px;
  border-radius: 6px;
  border: 1px solid rgba(255, 255, 255, 0.16);
  background: rgba(5, 9, 15, 0.82);
  box-shadow: 0 6px 18px -10px #000;
  transform: translateZ(34px) rotate(-1.2deg);
  transform-origin: center;
}

.card-bottom::after {
  content: "";
  position: absolute;
  inset: 3px;
  border: 1px dashed rgba(255, 255, 255, 0.12);
  border-radius: 3px;
  pointer-events: none;
}"""

new_bottom = """.card-bottom {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 34px 14px 13px;
  background: linear-gradient(
    to top,
    rgba(4, 7, 12, 0.97) 28%,
    rgba(4, 7, 12, 0.82) 58%,
    transparent 100%
  );
  transform: translateZ(34px);
}"""

assert old_bottom in s
s = s.replace(old_bottom, new_bottom)

s = s.replace(
    """.card-name {
  font-size: 23px;""",
    """.card-name {
  font-size: 24px;
  letter-spacing: -0.01em;""",
)

s = s.replace(
    """.card-series {
  font-size: 9.5px;""",
    """.card-series {
  font-size: 9px;
  letter-spacing: 0.22em;""",
)

io.open(p, "w", encoding="utf-8", newline="\n").write(s)
print("card print treatment applied")

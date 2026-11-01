import io, sys
sys.stdout.reconfigure(encoding="utf-8")
p = "src/preview.css"
s = io.open(p, encoding="utf-8").read()

old = """.gf-pill {
  display: flex;
  align-items: center;
  gap: 10px;
  height: 38px;
  padding: 0 6px 0 13px;
  border-radius: 999px;
  border: 1px solid rgba(154, 217, 255, 0.22);
  background: rgba(10, 16, 24, 0.62);
}"""
new = """/* Frosted glass: the backdrop is the blurred card art, so the pills actually
   refract something. The + stays solid - an action should be opaque, only the
   surface is glass. */
.gf-pill {
  position: relative;
  display: flex;
  align-items: center;
  gap: 10px;
  height: 38px;
  padding: 0 6px 0 13px;
  border-radius: 999px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.16);
  background:
    linear-gradient(
      158deg,
      rgba(255, 255, 255, 0.13) 0%,
      rgba(255, 255, 255, 0.035) 44%,
      rgba(255, 255, 255, 0.07) 100%
    );
  backdrop-filter: blur(16px) saturate(1.7);
  -webkit-backdrop-filter: blur(16px) saturate(1.7);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.3),
    inset 0 -10px 16px -12px rgba(255, 255, 255, 0.22),
    0 10px 26px -18px #000;
}

/* specular streak along the top edge */
.gf-pill::before {
  content: "";
  position: absolute;
  inset: 1px;
  border-radius: inherit;
  background: radial-gradient(
    130% 90% at 16% 0%,
    rgba(255, 255, 255, 0.24) 0%,
    rgba(255, 255, 255, 0.05) 42%,
    transparent 62%
  );
  pointer-events: none;
}

.gf-pill > * { position: relative; z-index: 1; }"""
if s.count(old) != 1:
    print("MISS pill"); sys.exit(1)
s = s.replace(old, new)
io.open(p, "w", encoding="utf-8", newline="\n").write(s)
print("glass pills in")
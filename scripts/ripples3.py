import io, sys
sys.stdout.reconfigure(encoding="utf-8")
p = "src/preview.css"
s = io.open(p, encoding="utf-8").read()

s = s.replace("border: 1px solid rgba(154, 217, 255, 0.42);", "border: 1.5px solid rgba(154, 217, 255, 0.85);")
s = s.replace("""@keyframes gf-ripple {
  0% { transform: translateX(-50%) scale(0.28); opacity: 0; }
  12% { opacity: 0.5; }
  70% { opacity: 0.14; }
  100% { transform: translateX(-50%) scale(1.18); opacity: 0; }
}""",
"""@keyframes gf-ripple {
  0% { transform: translateX(-50%) scale(0.28); opacity: 0; }
  10% { opacity: 0.75; }
  55% { opacity: 0.3; }
  100% { transform: translateX(-50%) scale(1.18); opacity: 0; }
}

/* a still waterline under the card, so the water reads even between pulses */
.gf-water::before {
  content: "";
  position: absolute;
  left: 50%;
  bottom: 6px;
  width: 78%;
  height: 30px;
  transform: translateX(-50%);
  border-radius: 50%;
  background: radial-gradient(
    ellipse at center,
    rgba(154, 217, 255, 0.16) 0%,
    rgba(154, 217, 255, 0.06) 45%,
    transparent 72%
  );
  filter: blur(3px);
}""")
io.open(p, "w", encoding="utf-8", newline="\n").write(s)
print("ripples strengthened + waterline added")
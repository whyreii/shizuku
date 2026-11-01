import io, sys
sys.stdout.reconfigure(encoding="utf-8")
p = "src/preview.css"
s = io.open(p, encoding="utf-8").read()
old = """.gf-water {
  position: absolute;
  left: 50%;
  bottom: -6px;
  z-index: 0;
  width: 260px;
  height: 54px;
  transform: translateX(-50%);
  pointer-events: none;
}"""
new = """.gf-water {
  position: absolute;
  left: 50%;
  bottom: -22px;
  z-index: 0;
  /* wider than the card, so the arcs read past its edges instead of hiding
     behind it - the middle is covered, which is what water under a card does */
  width: 372px;
  height: 62px;
  transform: translateX(-50%);
  pointer-events: none;
}"""
if s.count(old) != 1:
    print("MISS box"); sys.exit(1)
s = s.replace(old, new)
s = s.replace("  width: 100%;\n  height: 54px;\n  border-radius: 50%;", "  width: 100%;\n  height: 62px;\n  border-radius: 50%;")
s = s.replace("border: 1px solid rgba(154, 217, 255, 0.55);", "border: 1px solid rgba(154, 217, 255, 0.42);")
s = s.replace("box-shadow: 0 0 10px -3px rgba(154, 217, 255, 0.5);", "box-shadow: 0 2px 12px -4px rgba(154, 217, 255, 0.45);")
io.open(p, "w", encoding="utf-8", newline="\n").write(s)
print("ripples widened past the card")
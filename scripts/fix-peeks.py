import io, sys
sys.stdout.reconfigure(encoding="utf-8")
p = "src/preview.css"
s = io.open(p, encoding="utf-8").read()

start = s.index("/* the rest of the deck peeking out from behind the hero card */")
end = s.index(".gf-aura") if ".gf-aura" in s else s.index("/* The glow must never sit behind the card")
new = """/* The rest of the deck. They have to read as *cards* - a flat black slab
   just looks like a rendering artefact - so they keep the card's shape and
   radius, gain a faint top light, and stay inside the hero's footprint. */
.gf-deck { position: relative; width: 288px; height: 402px; }
.gf-peek {
  position: absolute;
  inset: 10px 14px;
  z-index: 0;
  border-radius: 15px;
  border: 1px solid rgba(154, 217, 255, 0.16);
  background:
    linear-gradient(180deg, rgba(154, 217, 255, 0.1), rgba(154, 217, 255, 0) 34%),
    linear-gradient(180deg, rgba(22, 31, 44, 0.92), rgba(10, 15, 22, 0.92));
  box-shadow: 0 18px 34px -24px #000, inset 0 1px 0 rgba(255, 255, 255, 0.06);
  opacity: 0.9;
}
.gf-peek.p1 { transform: translate(-9px, 8px) rotate(-3.4deg); }
.gf-peek.p2 { transform: translate(9px, 4px) rotate(2.8deg); }

"""
region = s[start:end]
if ".gf-deck { position: relative; width: 288px; height: 402px; }" not in region:
    print("deck block not in expected shape:", region[:80]); sys.exit(1)
s = s[:start] + new + s[end:]
io.open(p, "w", encoding="utf-8", newline="\n").write(s)
print("peeks rebuilt as cards")
import io, sys
sys.stdout.reconfigure(encoding="utf-8")
p = "public/preview-v3.html"
s = io.open(p, encoding="utf-8").read()
def rep(old, new):
    global s
    if s.count(old) != 1:
        print("MISS:", old[:50]); sys.exit(1)
    s = s.replace(old, new)

# 1. room for the deck to breathe
rep("gap: 46px; padding: 4px 26px 0; min-height: 0;",
    "gap: 42px; padding: 4px 34px 0; min-height: 0;")
rep(".peek.p1 { transform: translate(-17px, 12px) rotate(-6.5deg); }",
    ".peek.p1 { transform: translate(-11px, 11px) rotate(-5.5deg); }")
rep(".peek.p2 { transform: translate(17px, 8px) rotate(5.4deg); }",
    ".peek.p2 { transform: translate(11px, 7px) rotate(4.6deg); }")

# 2. aura sits above the deck, below the hero, and actually reads
rep(".aura {\n        position: absolute; left: 50%; top: 46%; z-index: 0;",
    ".aura {\n        position: absolute; left: 50%; top: 46%; z-index: 1;")
rep("width: 520px; height: 520px;", "width: 660px; height: 660px;")
rep("0%,100% { opacity: .5; transform: translate(-50%,-50%) scale(.96); }",
    "0%,100% { opacity: .62; transform: translate(-50%,-50%) scale(.96); }")
rep(".peek {\n        position: absolute; inset: 0;", ".peek {\n        position: absolute; inset: 0; z-index: 0;")
rep("box-shadow: 0 22px 44px -26px #000;\n        z-index: 1;\n      }",
    "box-shadow: 0 22px 44px -26px #000;\n      }")

# 3. the shelf keeps scrolling, so say so with a fade instead of a hard cut
rep("overflow-y: auto; padding-right: 6px;",
    "overflow-y: auto; padding-right: 6px; padding-bottom: 18px;\n        mask-image: linear-gradient(to bottom, #000 90%, transparent);\n        -webkit-mask-image: linear-gradient(to bottom, #000 90%, transparent);")

# 4. the card is not ours to redesign - the real component already draws its chips
rep("""              <span class="tierribbon">S+</span>\n""", "")

# 5. one D, not zero
rep("c 2", "c 2").__str__()
s = s.replace('<span class="dot"></span>d 0', '<span class="dot"></span>d 1')

io.open(p, "w", encoding="utf-8", newline="\n").write(s)
print("v3 patched")
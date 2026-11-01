import io, sys
sys.stdout.reconfigure(encoding="utf-8")
p = "public/preview-v3.html"
s = io.open(p, encoding="utf-8").read()

old_css = """      .deck::before, .deck::after {
        content: ""; position: absolute; inset: 0;
        border-radius: 18px;
        border: 1px solid rgba(154,217,255,.16);
        background: rgba(8,13,20,.85);
      }
      .deck::before { transform: translate(-15px, 11px) rotate(-6.5deg); background: rgba(12,18,27,.95); }
      .deck::after { transform: translate(15px, 7px) rotate(5.2deg); background: rgba(12,18,27,.9); }"""

new_css = """      /* the rest of the deck: two cards peeking out from behind the hero */
      .peek {
        position: absolute; inset: 0;
        border-radius: 18px;
        border: 1px solid rgba(154,217,255,.22);
        background:
          linear-gradient(180deg, rgba(18,26,38,.96), rgba(9,14,21,.96));
        box-shadow: 0 22px 44px -26px #000;
        z-index: 1;
      }
      .peek.p1 { transform: translate(-17px, 12px) rotate(-6.5deg); }
      .peek.p2 { transform: translate(17px, 8px) rotate(5.4deg); }"""

if s.count(old_css) != 1:
    print("MISS css block"); sys.exit(1)
s = s.replace(old_css, new_css)

s = s.replace(
    "      .aura {\n        position: absolute; left: 50%; top: 46%;",
    "      .aura {\n        position: absolute; left: 50%; top: 46%; z-index: 0;",
)
s = s.replace(
    "      .hero {\n        position: absolute; inset: 0; border-radius: 18px; overflow: hidden;",
    "      .hero {\n        position: absolute; inset: 0; border-radius: 18px; overflow: hidden; z-index: 2;",
)

old_html = """          <div class="deck">
            <div class="aura"></div>"""
new_html = """          <div class="deck">
            <div class="peek p1"></div>
            <div class="peek p2"></div>
            <div class="aura"></div>"""
if s.count(old_html) != 1:
    print("MISS html"); sys.exit(1)
s = s.replace(old_html, new_html)

s = s.replace('<i style="width:.4%"></i>', '<i style="width:.8%"></i>')

io.open(p, "w", encoding="utf-8", newline="\n").write(s)
print("deck layering fixed")
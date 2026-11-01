import io

FONTS = "family=Instrument+Serif:ital@0;1&family=Archivo:wght@400;500;600;700&family=Bebas+Neue&family=Chakra+Petch:wght@400;500;600;700&family=Barlow+Condensed:wght@500;600;700&family=Barlow:wght@400;500;600&family=Sora:wght@400;500;600;700&display=swap"

SPECS = [
    ("A · bebas", "Bebas Neue", "'Bebas Neue', Impact, sans-serif", 400, "0.06em", "Archivo, system-ui, sans-serif", "condensed poster caps - the loudest, classic gacha signage"),
    ("B · chakra", "Chakra Petch", "'Chakra Petch', system-ui, sans-serif", 600, "0.14em", "'Chakra Petch', system-ui, sans-serif", "squared, techy, keeps lowercase - closest to game UI type"),
    ("C · barlow", "Barlow Condensed", "'Barlow Condensed', system-ui, sans-serif", 600, "0.16em", "Barlow, system-ui, sans-serif", "condensed but restrained - still reads as a product"),
    ("D · sora", "Sora", "Sora, system-ui, sans-serif", 500, "0.02em", "Sora, system-ui, sans-serif", "geometric, wider - modern gacha, less shouty"),
]

cols = []
for key, label, disp, weight, track, body, note in SPECS:
    cols.append(f"""
      <div class="col">
        <h2>{key}</h2>
        <p class="sub">{note}</p>
        <div class="cap">currency</div>
        <div style="font-family:{disp};font-weight:{weight};font-size:38px;letter-spacing:{track};line-height:1">10,940</div>
        <div style="font-family:{disp};font-weight:{weight};font-size:8.5px;letter-spacing:.22em;text-transform:uppercase;color:#93a6ba;margin-top:3px">kakigori</div>
        <div class="divider"></div>
        <div class="cap">section</div>
        <div style="font-family:{disp};font-weight:{weight};font-size:16px;letter-spacing:{track};text-transform:uppercase">album <span style="color:#40536a">22 / 6,225</span></div>
        <div class="divider"></div>
        <div class="cap">dock</div>
        <div style="font-family:{disp};font-weight:{weight};font-size:10px;letter-spacing:.15em;text-transform:uppercase;display:flex;gap:11px;color:#93a6ba">
          <span style="color:#9ad9ff">album</span><span>wishes</span><span>badges</span><span>fountain</span>
        </div>
        <div class="divider"></div>
        <div class="cap">button</div>
        <div style="font-family:{disp};font-weight:{weight};font-size:12px;letter-spacing:.18em;text-transform:uppercase;color:#06121c;background:linear-gradient(180deg,#d5f0ff,#9ad9ff 46%,#59a8d8);border-radius:12px;padding:11px 0;text-align:center">roll &middot; 893 left</div>
        <div class="divider"></div>
        <div class="cap">body</div>
        <div style="font-family:{body};font-weight:400;font-size:12px;color:#93a6ba;line-height:1.5">Pick one perk per basin. The next basin costs 5,000 more than the last.</div>
        <div class="divider"></div>
        <div class="cap">name - unchanged</div>
        <div style="font-family:'Instrument Serif', Georgia, serif;font-size:27px;line-height:1.05">Zero Two</div>
      </div>""")

html = f"""<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<title>Shizuku - UI type candidates</title>
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?{FONTS}" rel="stylesheet" />
<style>
  * {{ box-sizing: border-box; }}
  body {{ margin:0; padding:24px 26px 28px; color:#eef4fb; font-variant-numeric:tabular-nums;
         background: radial-gradient(900px 500px at 50% -10%, #16202c 0%, #070a0f 62%); }}
  h1 {{ margin:0 0 4px; font:400 21px "Instrument Serif", Georgia, serif; }}
  p.lead {{ margin:0 0 20px; font:400 11.5px Archivo, system-ui, sans-serif; color:#93a6ba; }}
  .grid {{ display:grid; grid-template-columns:repeat(4, 1fr); gap:20px; }}
  .col {{ border:1px solid rgba(255,255,255,.08); border-radius:14px; padding:15px 15px 17px; background:rgba(10,16,24,.5); }}
  .col h2 {{ margin:0 0 3px; font:600 10px/1 Archivo, system-ui, sans-serif; letter-spacing:.24em; text-transform:uppercase; color:#9ad9ff; }}
  .col .sub {{ margin:0 0 15px; font:400 10px Archivo, system-ui, sans-serif; color:#5f748a; line-height:1.4; }}
  .cap {{ font:500 8px Archivo, system-ui, sans-serif; letter-spacing:.2em; text-transform:uppercase; color:#4e6479; margin-bottom:5px; }}
  .divider {{ height:1px; background:rgba(255,255,255,.07); margin:13px 0; }}
</style>
</head>
<body>
  <h1>Shizuku - UI type candidates</h1>
  <p class="lead">Character names stay Instrument Serif. Only the UI face changes. Same numbers, labels, buttons and body copy.</p>
  <div class="grid">{''.join(cols)}</div>
</body>
</html>
"""
io.open("public/type.html", "w", encoding="utf-8", newline="\n").write(html)
print("type.html:", len(html), "bytes,", len(cols), "candidates")
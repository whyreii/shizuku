import io

FONTS = ("family=Instrument+Serif:ital@0;1&family=Archivo:wght@400;500;600;700"
         "&family=Kanit:ital,wght@0,400;0,600;0,700;1,600"
         "&family=Russo+One"
         "&family=Baloo+2:wght@400;600;700;800"
         "&family=Oxanium:wght@400;600;700"
         "&family=Anton"
         "&family=Bakbak+One"
         "&family=Chakra+Petch:wght@400;600;700"
         "&display=swap")

# (label, family, weight, tracking, body-family, note)
SPECS = [
    ("current", "Archivo", "Archivo, system-ui, sans-serif", 600, "0.10em", "Archivo, system-ui, sans-serif",
     "what ships today - editorial, not game"),
    ("kanit", "Kanit", "'Kanit', system-ui, sans-serif", 600, "0.10em", "'Kanit', system-ui, sans-serif",
     "slightly condensed, has true italic - the Thai/JP mobile game workhorse"),
    ("russo", "Russo One", "'Russo One', system-ui, sans-serif", 400, "0.08em", "'Kanit', system-ui, sans-serif",
     "blocky rounded-square, very mobile-game titling"),
    ("baloo", "Baloo 2", "'Baloo 2', system-ui, sans-serif", 700, "0.02em", "'Baloo 2', system-ui, sans-serif",
     "chunky rounded pop - Blue Archive / Uma Musume register"),
    ("oxanium", "Oxanium", "'Oxanium', system-ui, sans-serif", 700, "0.10em", "'Oxanium', system-ui, sans-serif",
     "angular tech, sci-fi game HUD"),
    ("anton", "Anton", "'Anton', Impact, sans-serif", 400, "0.04em", "'Kanit', system-ui, sans-serif",
     "ultra-condensed poster, maximum punch on numbers"),
    ("bakbak", "Bakbak One", "'Bakbak One', system-ui, sans-serif", 400, "0.04em", "'Kanit', system-ui, sans-serif",
     "heavy rounded display, playful but loud"),
]

cols = []
for key, _fam, disp, weight, track, body, note in SPECS:
    cols.append(f"""
      <div class="col">
        <h2>{key}</h2>
        <p class="sub">{note}</p>
        <div class="cap">currency</div>
        <div style="font-family:{disp};font-weight:{weight};font-size:36px;letter-spacing:{track};line-height:1">10,940</div>
        <div style="font-family:{disp};font-weight:{weight};font-size:8.5px;letter-spacing:.2em;text-transform:uppercase;color:#93a6ba;margin-top:4px">kakigori</div>
        <div class="divider"></div>
        <div class="cap">section</div>
        <div style="font-family:{disp};font-weight:{weight};font-size:15px;letter-spacing:{track};text-transform:uppercase">album <span style="color:#40536a">22 / 6,225</span></div>
        <div class="divider"></div>
        <div class="cap">dock</div>
        <div style="font-family:{disp};font-weight:{weight};font-size:10px;letter-spacing:.14em;text-transform:uppercase;display:flex;gap:10px;color:#93a6ba">
          <span style="color:#9ad9ff">album</span><span>wishes</span><span>badges</span><span>fountain</span>
        </div>
        <div class="divider"></div>
        <div class="cap">button</div>
        <div style="font-family:{disp};font-weight:{weight};font-size:12px;letter-spacing:.16em;text-transform:uppercase;color:#06121c;background:linear-gradient(180deg,#d5f0ff,#9ad9ff 46%,#59a8d8);border-radius:12px;padding:10px 0;text-align:center">roll &middot; 893 left</div>
        <div class="divider"></div>
        <div class="cap">body</div>
        <div style="font-family:{body};font-weight:400;font-size:12px;color:#93a6ba;line-height:1.5">Pick one perk per basin. The next basin costs 5,000 more than the last.</div>
        <div class="divider"></div>
        <div class="cap">name - unchanged</div>
        <div style="font-family:'Instrument Serif', Georgia, serif;font-size:26px;line-height:1.05">Zero Two</div>
      </div>""")

html = f"""<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<title>Shizuku - gacha type candidates</title>
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?{FONTS}" rel="stylesheet" />
<style>
  * {{ box-sizing: border-box; }}
  body {{ margin:0; padding:22px 24px 26px; color:#eef4fb; font-variant-numeric:tabular-nums;
         background: radial-gradient(900px 500px at 50% -10%, #16202c 0%, #070a0f 62%); }}
  h1 {{ margin:0 0 4px; font:400 21px 'Instrument Serif', Georgia, serif; }}
  p.lead {{ margin:0 0 18px; font:400 11.5px Archivo, system-ui, sans-serif; color:#93a6ba; }}
  .grid {{ display:grid; grid-template-columns:repeat(4, 1fr); gap:16px; }}
  .col {{ border:1px solid rgba(255,255,255,.08); border-radius:13px; padding:14px 14px 16px; background:rgba(10,16,24,.5); }}
  .col h2 {{ margin:0 0 3px; font:600 10px/1 Archivo, system-ui, sans-serif; letter-spacing:.22em; text-transform:uppercase; color:#9ad9ff; }}
  .col .sub {{ margin:0 0 13px; font:400 9.5px Archivo, system-ui, sans-serif; color:#5f748a; line-height:1.4; }}
  .cap {{ font:500 8px Archivo, system-ui, sans-serif; letter-spacing:.18em; text-transform:uppercase; color:#4e6479; margin-bottom:5px; }}
  .divider {{ height:1px; background:rgba(255,255,255,.07); margin:11px 0; }}
</style>
</head>
<body>
  <h1>Shizuku - gacha type candidates</h1>
  <p class="lead">Round two. Names stay Instrument Serif; only the UI face changes. Body copy included so you can see what a paragraph costs.</p>
  <div class="grid">{''.join(cols)}</div>
</body>
</html>
"""
io.open("public/type2.html", "w", encoding="utf-8", newline="\n").write(html)
print("type2.html:", len(html), "bytes,", len(cols), "candidates")
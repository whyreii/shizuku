import io

FONTS = ("family=Instrument+Serif:ital@0;1&family=Archivo:wght@400;500;600;700"
         "&family=Kanit:wght@400;600;700&family=Russo+One&family=Baloo+2:wght@600;700"
         "&family=Oxanium:wght@600;700&family=Anton&family=Bakbak+One"
         "&family=Rajdhani:wght@600;700&family=Squada+One&family=Bungee"
         "&family=Paytone+One&family=Teko:wght@600;700&family=Bai+Jamjuree:wght@600;700"
         "&family=Righteous&family=Mitr:wght@500;600&display=swap")

SPECS = [
    ("kanit", "'Kanit', system-ui, sans-serif", 600, "'Kanit', system-ui, sans-serif", "condensed clean - workhorse, not loud"),
    ("russo", "'Russo One', system-ui, sans-serif", 400, "'Kanit', system-ui, sans-serif", "blocky rounded-square - mobile game titling"),
    ("rajdhani", "'Rajdhani', system-ui, sans-serif", 700, "'Rajdhani', system-ui, sans-serif", "HUD condensed - mecha / sci-fi gacha"),
    ("squada", "'Squada One', Impact, sans-serif", 400, "'Kanit', system-ui, sans-serif", "heavy compressed slab - poster punch"),
    ("bungee", "'Bungee', system-ui, sans-serif", 400, "'Kanit', system-ui, sans-serif", "chunky streetwear display - bold gacha logo energy"),
    ("paytone", "'Paytone One', system-ui, sans-serif", 400, "'Kanit', system-ui, sans-serif", "soft heavy rounded - friendly mobile game"),
    ("bakbak", "'Bakbak One', system-ui, sans-serif", 400, "'Kanit', system-ui, sans-serif", "heavy rounded display - loud, playful"),
    ("baloo", "'Baloo 2', system-ui, sans-serif", 700, "'Baloo 2', system-ui, sans-serif", "chunky rounded pop - Blue Archive register"),
    ("teko", "'Teko', system-ui, sans-serif", 700, "'Teko', system-ui, sans-serif", "tall digital condensed - scoreboard"),
    ("oxanium", "'Oxanium', system-ui, sans-serif", 700, "'Oxanium', system-ui, sans-serif", "angular tech HUD"),
    ("bai", "'Bai Jamjuree', system-ui, sans-serif", 600, "'Bai Jamjuree', system-ui, sans-serif", "squared grotesque - clean game UI"),
    ("righteous", "'Righteous', system-ui, sans-serif", 400, "'Kanit', system-ui, sans-serif", "retro rounded display - playful"),
    ("mitr", "'Mitr', system-ui, sans-serif", 600, "'Mitr', system-ui, sans-serif", "rounded geometric - soft JP/Thai mobile"),
    ("anton", "'Anton', Impact, sans-serif", 400, "'Kanit', system-ui, sans-serif", "ultra-condensed poster"),
    ("archivo", "Archivo, system-ui, sans-serif", 600, "Archivo, system-ui, sans-serif", "current - editorial, not game"),
]

def col(key, disp, weight, body, note):
    return f"""
      <div class="col">
        <h2>{key}</h2>
        <p class="sub">{note}</p>
        <div style="font-family:{disp};font-weight:{weight};font-size:32px;line-height:1">10,940</div>
        <div style="font-family:{disp};font-weight:{weight};font-size:8px;letter-spacing:.18em;text-transform:uppercase;color:#93a6ba;margin-top:3px">kakigori</div>
        <div class="divider"></div>
        <div style="font-family:{disp};font-weight:{weight};font-size:14px;text-transform:uppercase;letter-spacing:.08em">album <span style="color:#40536a">22 / 6,225</span></div>
        <div class="divider"></div>
        <div style="font-family:{disp};font-weight:{weight};font-size:10px;letter-spacing:.12em;text-transform:uppercase;display:flex;gap:9px;color:#93a6ba">
          <span style="color:#9ad9ff">album</span><span>wishes</span><span>badges</span><span>fountain</span>
        </div>
        <div class="divider"></div>
        <div style="font-family:{disp};font-weight:{weight};font-size:11px;letter-spacing:.14em;text-transform:uppercase;color:#06121c;background:linear-gradient(180deg,#d5f0ff,#9ad9ff 46%,#59a8d8);border-radius:11px;padding:9px 0;text-align:center">roll &middot; 893 left</div>
        <div class="divider"></div>
        <div style="font-family:{body};font-weight:400;font-size:11.5px;color:#93a6ba;line-height:1.45">Pick one perk per basin. The next basin costs 5,000 more than the last.</div>
        <div class="divider"></div>
        <div style="font-family:'Instrument Serif', Georgia, serif;font-size:24px;line-height:1.05">Zero Two</div>
      </div>"""

body = "".join(col(*s) for s in SPECS)
html = f"""<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<title>Shizuku - gacha type candidates 2</title>
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?{FONTS}" rel="stylesheet" />
<style>
  * {{ box-sizing: border-box; }}
  body {{ margin:0; padding:20px 22px 24px; color:#eef4fb; font-variant-numeric:tabular-nums;
         background: radial-gradient(900px 500px at 50% -10%, #16202c 0%, #070a0f 62%); }}
  h1 {{ margin:0 0 4px; font:400 20px 'Instrument Serif', Georgia, serif; }}
  p.lead {{ margin:0 0 16px; font:400 11px Archivo, system-ui, sans-serif; color:#93a6ba; }}
  .grid {{ display:grid; grid-template-columns:repeat(5, 1fr); gap:14px; }}
  .col {{ border:1px solid rgba(255,255,255,.08); border-radius:12px; padding:12px 12px 14px; background:rgba(10,16,24,.5); }}
  .col h2 {{ margin:0 0 3px; font:600 9px/1 Archivo, system-ui, sans-serif; letter-spacing:.2em; text-transform:uppercase; color:#9ad9ff; }}
  .col .sub {{ margin:0 0 11px; font:400 9px Archivo, system-ui, sans-serif; color:#5f748a; line-height:1.35; }}
  .divider {{ height:1px; background:rgba(255,255,255,.07); margin:9px 0; }}
</style>
</head>
<body>
  <h1>Shizuku - gacha type candidates, round two</h1>
  <p class="lead">15 UI faces. Names stay Instrument Serif. Top row is what you just approved; the rest is the long list.</p>
  <div class="grid">{body}</div>
</body>
</html>
"""
io.open("public/type3.html", "w", encoding="utf-8", newline="\n").write(html)
print("type3.html:", len(html), "bytes,", len(SPECS), "faces")
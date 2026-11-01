import io, sys
sys.stdout.reconfigure(encoding="utf-8")
p = "public/preview.html"
s = io.open(p, encoding="utf-8").read()

DROP = '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.7 17.7 8.4a8 8 0 1 1-11.4 0Z"/><path d="M9.6 13.4a2.6 2.6 0 0 0 2.6 2.6" opacity=".5"/></svg>'
ROT  = '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M21 12a9 9 0 1 1-2.7-6.4"/><path d="M21 3.4v5.2h-5.2"/></svg>'

pairs = [
    ("""        <div class="state">
          <div>kakigori <b>3,202</b></div>
          <div>rolls <b>95</b></div>
        </div>""",
     f"""        <div class="state">
          <div>{DROP}<span>kakigori</span> <b>3,202</b></div>
          <div>{ROT}<span>rolls</span> <b>95</b></div>
        </div>"""),

    ("""      .state span { color: var(--muted); }""",
     """      .state > div { display: flex; align-items: center; gap: 7px; }
      .state span { color: var(--muted); }
      .ico {
        width: 12px; height: 12px; flex: none;
        fill: none; stroke: currentColor; stroke-width: 1.6;
        stroke-linecap: round; stroke-linejoin: round;
        color: var(--muted);
      }"""),

    ("""      .card-value { font-size: 11px; color: var(--frost); }""",
     """      .card-value {
        font-size: 11px; color: var(--frost);
        display: flex; align-items: center; gap: 5px;
      }
      .card-value .ico { width: 11px; height: 11px; color: var(--frost); }"""),

    ("""<div class="card-value">\u25c7 4,949</div>""",
     f"""<div class="card-value">{DROP}4,949</div>"""),

    ("""      preview only \u2014 grid shelf by default, no empty table, two numbers in the header, wider card.""",
     """      preview only \u2014 grid shelf by default, no empty table, two numbers in the header, wider card, icons on every number."""),
]

for old, new in pairs:
    if s.count(old) != 1:
        print("MISS:", old[:60]); sys.exit(1)
    s = s.replace(old, new)

io.open(p, "w", encoding="utf-8", newline="\n").write(s)
print("preview updated")
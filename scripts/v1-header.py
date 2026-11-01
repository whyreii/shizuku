import io, sys
p = "src/App.tsx"
s = io.open(p, encoding="utf-8").read()
start = s.index('        <dl className="numbers">')
end = s.index("</dl>", start) + len("</dl>")
new = '''        <div className="head-pills">
          <div className="head-pill">
            <Icon name="kakigori" size={15} />
            <div className="head-pill-text">
              <b>{formatCompact(state.kakigori)}</b>
              <small>+{formatKakera(kakigoriPerHour(state))}/hr</small>
            </div>
          </div>
          <div className="head-pill">
            <Icon name="rolls" size={15} />
            <div className="head-pill-text">
              <b>{state.rolls}</b>
              <small>rolls</small>
            </div>
          </div>
        </div>'''
s = s[:start] + new + s[end:]
io.open(p, "w", encoding="utf-8", newline="\n").write(s)
print("header pills in")
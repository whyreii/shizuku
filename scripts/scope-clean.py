import io

# --- App: remove the global toggle -----------------------------------------
p = "src/App.tsx"
s = io.open(p, encoding="utf-8").read()

start = s.find("  const [cleanView, setCleanView] = useState(")
if start != -1:
    end = s.find("  }, [cleanView]);", start)
    if end != -1:
        s = s[:start] + s[end + len("  }, [cleanView]);\n\n") :]

bstart = s.find('        <button\n          className="eye-toggle"')
if bstart != -1:
    bend = s.find("        </button>\n      </header>", bstart)
    if bend != -1:
        s = s[:bstart] + s[bend + len("        </button>\n") :]

io.open(p, "w", encoding="utf-8", newline="\n").write(s)

# --- CSS: scope clean mode to the collection board --------------------------
c = "src/styles.css"
css = io.open(c, encoding="utf-8").read()

css = css.replace(".clean-view .card-top,", ".is-clean .card-top,")
css = css.replace(
    """.clean-view .card-bottom,
.clean-view .card-flag,
.clean-view .tile-tier,
.clean-view .tile-stamp,
.clean-view .tile-rank,
.clean-view .tile-body {""",
    """.clean-view .card-bottom,
.clean-view .card-flag,
.is-clean .tile-tier,
.is-clean .tile-stamp,
.is-clean .tile-rank,
.is-clean .tile-body {""",
)
css = css.replace(
    """.clean-view .card3d:hover .card-top,
.clean-view .card3d:hover .card-bottom,
.clean-view .card3d:hover .card-flag,
.clean-view .tile:hover .tile-tier,
.clean-view .tile:hover .tile-stamp,
.clean-view .tile:hover .tile-rank,
.clean-view .tile:hover .tile-body {""",
    """.is-clean .tile:hover .tile-tier,
.is-clean .tile:hover .tile-stamp,
.is-clean .tile:hover .tile-rank,
.is-clean .tile:hover .tile-body {""",
)
io.open(c, "w", encoding="utf-8", newline="\n").write(css)
print("clean view scoped to the collection board")

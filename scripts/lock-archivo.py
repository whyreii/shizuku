import io

# --- CSS: Archivo is the only UI face --------------------------------------
p = "src/styles.css"
s = io.open(p, encoding="utf-8").read()

s = s.replace(
    '  --ui: "Manrope", "Segoe UI", system-ui, sans-serif;\n  --sans: var(--ui);',
    '  --ui: "Archivo", "Segoe UI", system-ui, sans-serif;\n  --sans: var(--ui);',
)

start = s.find("/* UI font alternatives — switched from Settings */")
if start != -1:
    s = s[:start]

io.open(p, "w", encoding="utf-8", newline="\n").write(s)

# --- App: drop the switcher ------------------------------------------------
a = "src/App.tsx"
t = io.open(a, encoding="utf-8").read()

start = t.find('  const [uiFont, setUiFont] = useState<"manrope" | "archivo" | "grotesk">(')
if start != -1:
    end = t.find("  }, [uiFont]);", start)
    if end != -1:
        t = t[:start] + t[end + len("  }, [uiFont]);\n\n") :]

start = t.find('          <div className="font-row">')
if start != -1:
    end = t.find("          </div>\n", start)
    if end != -1:
        t = t[:start] + t[end + len("          </div>\n") :]

io.open(a, "w", encoding="utf-8", newline="\n").write(t)
print("Archivo locked in, switcher removed")

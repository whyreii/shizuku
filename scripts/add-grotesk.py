import io

# CSS: third option
p = "src/styles.css"
s = io.open(p, encoding="utf-8").read()
s = s.replace(
    """html.font-manrope {
  --ui: "Manrope", "Segoe UI", system-ui, sans-serif;
}""",
    """html.font-manrope {
  --ui: "Manrope", "Segoe UI", system-ui, sans-serif;
}

html.font-grotesk {
  --ui: "Space Grotesk", "Segoe UI", system-ui, sans-serif;
}""",
)
io.open(p, "w", encoding="utf-8", newline="\n").write(s)

# App: allow the third value
a = "src/App.tsx"
t = io.open(a, encoding="utf-8").read()
t = t.replace(
    'const [uiFont, setUiFont] = useState<"manrope" | "archivo">(() => {\n    try {\n      return localStorage.getItem("shizuku.uiFont") === "archivo" ? "archivo" : "manrope";\n    } catch {\n      return "manrope";\n    }\n  });',
    'const [uiFont, setUiFont] = useState<"manrope" | "archivo" | "grotesk">(() => {\n    try {\n      const stored = localStorage.getItem("shizuku.uiFont");\n      return stored === "archivo" || stored === "grotesk" ? stored : "manrope";\n    } catch {\n      return "manrope";\n    }\n  });',
)
t = t.replace(
    'document.documentElement.classList.toggle("font-archivo", uiFont === "archivo");\n    document.documentElement.classList.toggle("font-manrope", uiFont === "manrope");',
    'document.documentElement.classList.toggle("font-archivo", uiFont === "archivo");\n    document.documentElement.classList.toggle("font-grotesk", uiFont === "grotesk");\n    document.documentElement.classList.toggle("font-manrope", uiFont === "manrope");',
)
t = t.replace(
    """              <button
                className={`chip-btn ${uiFont === "archivo" ? "on" : ""}`}
                onClick={() => setUiFont("archivo")}
              >
                archivo
              </button>""",
    """              <button
                className={`chip-btn ${uiFont === "archivo" ? "on" : ""}`}
                onClick={() => setUiFont("archivo")}
              >
                archivo
              </button>
              <button
                className={`chip-btn ${uiFont === "grotesk" ? "on" : ""}`}
                onClick={() => setUiFont("grotesk")}
              >
                grotesk
              </button>""",
)
io.open(a, "w", encoding="utf-8", newline="\n").write(t)
print("space grotesk added")

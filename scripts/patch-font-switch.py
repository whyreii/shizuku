import io

p = "src/styles.css"
s = io.open(p, encoding="utf-8").read()

# one UI font variable, switchable at runtime
s = s.replace(
    '  --mono: "Manrope", "Segoe UI", system-ui, sans-serif;',
    '  --mono: var(--ui);',
)
s = s.replace(
    '  --sans: "Manrope", "Segoe UI", system-ui, sans-serif;',
    '  --ui: "Manrope", "Segoe UI", system-ui, sans-serif;\n  --sans: var(--ui);',
)

# alternative UI face, toggled by a class on <html>
s += """

/* UI font alternatives — switched from Settings */
html.font-archivo {
  --ui: "Archivo", "Segoe UI", system-ui, sans-serif;
}

html.font-manrope {
  --ui: "Manrope", "Segoe UI", system-ui, sans-serif;
}
"""

io.open(p, "w", encoding="utf-8", newline="\n").write(s)
print("font switch wired")

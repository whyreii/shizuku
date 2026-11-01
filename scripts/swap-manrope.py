import io

p = "src/styles.css"
s = io.open(p, encoding="utf-8").read()

s = s.replace(
    '--mono: "IBM Plex Mono", Consolas, ui-monospace, monospace;',
    '--mono: "Manrope", "Segoe UI", system-ui, sans-serif;',
)
s = s.replace(
    '--sans: "Zen Kaku Gothic New", "Segoe UI", system-ui, sans-serif;',
    '--sans: "Manrope", "Segoe UI", system-ui, sans-serif;',
)

# tabular figures replace the mono's fixed width
s = s.replace(
    "body {\n  margin: 0;",
    "body {\n  margin: 0;\n  font-variant-numeric: tabular-nums;",
)

io.open(p, "w", encoding="utf-8", newline="\n").write(s)
print("mono removed, Manrope everywhere")

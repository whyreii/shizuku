import io, sys
sys.stdout.reconfigure(encoding="utf-8")
p = "src/preview.css"
s = io.open(p, encoding="utf-8").read()
s = s.replace("  height: 92px;\n  overflow: hidden;\n  pointer-events: none;", "  height: 50px;\n  overflow: hidden;\n  pointer-events: none;")
s = s.replace("""    rgba(0, 0, 0, 0.62) 0%,
    rgba(0, 0, 0, 0.22) 46%,
    transparent 82%""",
"""    rgba(0, 0, 0, 0.55) 0%,
    rgba(0, 0, 0, 0.2) 48%,
    transparent 88%""")
s = s.replace("filter: blur(2.5px) saturate(0.85) brightness(0.75);", "filter: blur(2.5px) saturate(0.9) brightness(0.95);")
io.open(p, "w", encoding="utf-8", newline="\n").write(s)
print("reflection trimmed to fit the gap")
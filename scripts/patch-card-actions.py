import io

p = "src/App.tsx"
s = io.open(p, encoding="utf-8").read()

s = s.replace("  toggleWish,\n", "  toggleSoulmate,\n  toggleStarwish,\n  toggleWish,\n")
s = s.replace("owner ?", "owned ?")

io.open(p, "w", encoding="utf-8", newline="\n").write(s)
print("imports + owned fixed")

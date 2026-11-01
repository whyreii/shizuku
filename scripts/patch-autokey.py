import io

p = "src/App.tsx"
s = io.open(p, encoding="utf-8").read()

s = s.replace("  const key = keyStatus(state, now);\n", "")
s = s.replace("  keyStatus,\n", "")
s = s.replace("  addKey,\n", "")

# remove the now-unused handler
start = s.find("  const doKey = () => {")
if start != -1:
    end = s.find("  };", start)
    if end != -1:
        s = s[:start] + s[end + len("  };\n") :]

io.open(p, "w", encoding="utf-8", newline="\n").write(s)
print("cleaned App")

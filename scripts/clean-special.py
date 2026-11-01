import io

p = "src/App.tsx"
s = io.open(p, encoding="utf-8").read()

s = s.replace(
    '  const [special, setSpecial] = useState<"starwish" | "wish" | null>(null);\n',
    "",
)
s = s.replace("        setSpecial(result.special);\n", "")

io.open(p, "w", encoding="utf-8", newline="\n").write(s)
print("special banner state removed")

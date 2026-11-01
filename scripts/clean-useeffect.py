import io

p = "src/components/CharacterSheet.tsx"
s = io.open(p, encoding="utf-8").read()
s = s.replace('import { useEffect } from "react";\n', "")
io.open(p, "w", encoding="utf-8", newline="\n").write(s)
print("useEffect import removed")

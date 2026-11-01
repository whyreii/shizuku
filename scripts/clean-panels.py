import io

p = "src/components/Panels.tsx"
s = io.open(p, encoding="utf-8").read()
s = s.replace("  const [ratesOpen, setRatesOpen] = useState(false);\n", "")
s = s.replace('import { Modal } from "./Modal";\n', "")
s = s.replace(
    'import { bandTable, tierClass, tierForRank } from "../engine/tiers";',
    'import { tierClass, tierForRank } from "../engine/tiers";',
)
io.open(p, "w", encoding="utf-8", newline="\n").write(s)
print("cleaned Panels")

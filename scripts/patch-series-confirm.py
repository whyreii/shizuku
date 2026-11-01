import io

p = "src/components/SeriesSheet.tsx"
s = io.open(p, encoding="utf-8").read()

s = s.replace(
    'import { Tile } from "./Tile";',
    'import { Tile } from "./Tile";\nimport { useConfirm } from "./useConfirm";',
)

s = s.replace(
    "  const [selected, setSelected] = useState<string[]>([]);",
    "  const { ask, dialog } = useConfirm();\n  const [selected, setSelected] = useState<string[]>([]);",
)

s = s.replace(
    """            onStar={() => act((st) => toggleStarwish(st, char.id))}""",
    """            onStar={() => {
              if (state.starwish === char.id) {
                ask({
                  title: "Clear starwish?",
                  body: `${char.name} will no longer be your starwish.`,
                  confirmLabel: "Clear",
                  onConfirm: () => act((st) => toggleStarwish(st, char.id)),
                });
                return;
              }
              const currentStar = state.starwish
                ? characterById(state.starwish)
                : null;
              if (currentStar && currentStar.id !== char.id) {
                ask({
                  title: `Replace ${currentStar.name}?`,
                  body: `Only one starwish exists at a time. ${currentStar.name} will be replaced by ${char.name}.`,
                  confirmLabel: "Replace",
                  onConfirm: () => act((st) => toggleStarwish(st, char.id)),
                });
                return;
              }
              act((st) => toggleStarwish(st, char.id));
            }}""",
)

s = s.replace(
    """            onToggle={() => {
              if (state.wishes.includes(char.id)) {
                act((s) => toggleWish(s, char.id));
                setSelected((prev) => prev.filter((x) => x !== char.id));
              } else {
                toggleSelect(char.id);
              }
            }}""",
    """            onToggle={() => {
              if (state.wishes.includes(char.id)) {
                ask({
                  title: `Unwish ${char.name}?`,
                  body: "Removes it from your wishlist. You can add it again any time.",
                  confirmLabel: "Unwish",
                  onConfirm: () => {
                    act((s) => toggleWish(s, char.id));
                    setSelected((prev) => prev.filter((x) => x !== char.id));
                  },
                });
              } else {
                toggleSelect(char.id);
              }
            }}""",
)

s = s.replace("      {selectedChar ? (", "      {dialog}\n\n      {selectedChar ? (")

io.open(p, "w", encoding="utf-8", newline="\n").write(s)
print("series sheet confirms added")

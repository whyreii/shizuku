import io

p = "src/components/CharacterSheet.tsx"
s = io.open(p, encoding="utf-8").read()

s = s.replace(
    'import { ConfirmDialog, Modal } from "./Modal";',
    'import { ConfirmDialog, Modal } from "./Modal";\nimport { useConfirm } from "./useConfirm";',
)

s = s.replace(
    "  const [confirming, setConfirming] = useState(false);",
    "  const { ask, dialog } = useConfirm();\n  const [confirming, setConfirming] = useState(false);",
)

# wish toggle -> confirm when removing
s = s.replace(
    """          <button
            className="link"
            onClick={() => act((s) => toggleWish(s, char.id))}
          >
            {wished ? "unwish" : "wish"}
          </button>""",
    """          <button
            className="link"
            onClick={() => {
              if (!wished) {
                act((s) => toggleWish(s, char.id));
                return;
              }
              ask({
                title: `Unwish ${alias ?? char.name}?`,
                body: "Removes it from your wishlist. You can add it again any time.",
                confirmLabel: "Unwish",
                onConfirm: () => act((s) => toggleWish(s, char.id)),
              });
            }}
          >
            {wished ? "unwish" : "wish"}
          </button>""",
)

io.open(p, "w", encoding="utf-8", newline="\n").write(s)
print("character sheet confirm wired")

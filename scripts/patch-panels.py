import io

p = "src/components/Panels.tsx"
s = io.open(p, encoding="utf-8").read()

s = s.replace(
    """function CollectionRow({
  state,
  char,
  onDivorce,
  onSoulmate,
}: {
  state: GameState;
  char: Character;
  onDivorce: () => void;
  onSoulmate: () => void;
}) {""",
    """function CollectionRow({
  state,
  char,
  onOpen,
}: {
  state: GameState;
  char: Character;
  onOpen: () => void;
}) {""",
)

s = s.replace(
    """    <div className={soulmate ? 'row row-soulmate' : 'row'}>""",
    """    <button
      type="button"
      className={soulmate ? 'row row-soulmate' : 'row'}
      onClick={onOpen}
    >""",
)

start = s.index("      <div className='row-actions'>")
end = s.index("    </div>\n  );\n}", start)
s = s[:start] + "    </button>\n  );\n}" + s[end + len("    </div>\n  );\n}") :]

s = s.replace(
    """          rows.map((c) => (
            <CollectionRow
              key={c.id}
              state={state}
              char={c}
              onDivorce={() => act((s) => divorce(s, c.id))}
              onSoulmate={() => act((s) => toggleSoulmate(s, c.id))}
            />
          ))""",
    """          rows.map((c) => (
            <CollectionRow
              key={c.id}
              state={state}
              char={c}
              onOpen={() => setSelected(c.id)}
            />
          ))""",
)

s = s.replace(
    "  const [onlyKeys, setOnlyKeys] = useState(false);",
    "  const [onlyKeys, setOnlyKeys] = useState(false);\n  const [selected, setSelected] = useState<string | null>(null);",
)

io.open(p, "w", encoding="utf-8", newline="\n").write(s)
print("patched rows")

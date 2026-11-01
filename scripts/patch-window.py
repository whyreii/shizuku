import io

p = "src/components/Panels.tsx"
s = io.open(p, encoding="utf-8").read()

s = s.replace(
    'import { CharacterSheet } from "./CharacterSheet";',
    'import { CharacterSheet } from "./CharacterSheet";\nimport { useVirtualRows } from "./useVirtualRows";',
)

# collection: window the rows
s = s.replace(
    """      <div className='rows'>
        {rows.length === 0 ? (
          <p className='empty'>Nothing matches.</p>
        ) : (
          rows.map((c) => (
            <CollectionRow
              key={c.id}
              state={state}
              char={c}
              onOpen={() => setSelected(c.id)}
            />
          ))
        )}
      </div>""",
    """      <div className='rows rows-scroll' onScroll={collectionWindow.onScroll}>
        {rows.length === 0 ? (
          <p className='empty'>Nothing matches.</p>
        ) : (
          <>
            <div style={{ height: collectionWindow.padTop }} />
            {rows
              .slice(collectionWindow.start, collectionWindow.end)
              .map((c) => (
                <CollectionRow
                  key={c.id}
                  state={state}
                  char={c}
                  onOpen={() => setSelected(c.id)}
                />
              ))}
            <div style={{ height: collectionWindow.padBottom }} />
          </>
        )}
      </div>""",
)

s = s.replace(
    "  const [selected, setSelected] = useState<string | null>(null);",
    "  const [selected, setSelected] = useState<string | null>(null);\n  const collectionWindow = useVirtualRows(rowsLengthRef(rows.length), 57);",
)

# series: window the list
s = s.replace(
    """      <div className="series-list">
        {rows.map((row) => {""",
    """      <div className="series-list" onScroll={seriesWindow.onScroll}>
        <div style={{ height: seriesWindow.padTop }} />
        {rows.slice(seriesWindow.start, seriesWindow.end).map((row) => {""",
)

s = s.replace(
    """          );
        })}
      </div>
      <p className="hint">
        Roster: {ROSTER.length} characters · {seriesIndex().length} series
      </p>""",
    """          );
        })}
        <div style={{ height: seriesWindow.padBottom }} />
      </div>
      <p className="hint">
        Roster: {ROSTER.length} characters · {seriesIndex().length} series
      </p>""",
)

s = s.replace(
    "  const [query, setQuery] = useState(\"\");\n  const rows = useMemo(() => {",
    "  const [query, setQuery] = useState(\"\");\n  const rows = useMemo(() => {",
)

io.open(p, "w", encoding="utf-8", newline="\n").write(s)
print("panels patched for windowing")

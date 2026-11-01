import io

p = "src/components/CollectionView.tsx"
s = io.open(p, encoding="utf-8").read()

s = s.replace(
    'import { Modal } from "./Modal";',
    'import { Modal } from "./Modal";\nimport { useVirtualRows } from "./useVirtualRows";',
)

s = s.replace(
    "  const selectedChar = selected ? characterById(selected) : undefined;",
    "  const windowed = useVirtualRows(rows.length, 47, 420);\n  const selectedChar = selected ? characterById(selected) : undefined;",
)

s = s.replace(
    '          <div className="wide-table">',
    '          <div className="wide-table" onScroll={windowed.onScroll}>',
)

s = s.replace(
    """            {rows.length === 0 ? (
              <p className="empty">Nothing matches.</p>
            ) : (
              rows.map((char) => (
                <WideRow
                  key={char.id}
                  state={state}
                  char={char}
                  onOpen={() => setSelected(char.id)}
                />
              ))
            )}""",
    """            {rows.length === 0 ? (
              <p className="empty">Nothing matches.</p>
            ) : (
              <>
                <div style={{ height: windowed.padTop }} />
                {rows.slice(windowed.start, windowed.end).map((char) => (
                  <WideRow
                    key={char.id}
                    state={state}
                    char={char}
                    onOpen={() => setSelected(char.id)}
                  />
                ))}
                <div style={{ height: windowed.padBottom }} />
              </>
            )}""",
)

io.open(p, "w", encoding="utf-8", newline="\n").write(s)
print("wide table virtualised")

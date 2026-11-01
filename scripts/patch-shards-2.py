import io, sys
sys.stdout.reconfigure(encoding="utf-8")

def read(p): return io.open(p, encoding="utf-8").read()
def write(p, s): io.open(p, "w", encoding="utf-8", newline="\n").write(s)

fails = []
def sub(path, pairs):
    s = read(path)
    for old, new in pairs:
        n = s.count(old)
        if n == 0:
            fails.append(f"{path}: MISS {old[:60]}")
            continue
        s = s.replace(old, new)
        print(f"  {path}: {n}x ok")
    write(path, s)

sub("src/components/Card3D.tsx", [(
    '<span className="card-value">\u25c7 {formatKakera(characterValueValue(character.rank, keys))}</span>',
'''<span className="card-value">
                <Icon name="kakigori" size={11} />
                {formatKakera(characterValueValue(character.rank, keys))}
              </span>'''),
])

sub("src/components/LootPanel.tsx", [(
'''      <p className="ledger-line">
        lootbox \u00b7 {formatKakera(LOOT_COST)} kakigori \u00b7 you have{" "}
        {formatKakera(state.kakigori)}
      </p>''',
'''      <p className="ledger-line">
        <Icon name="loot" size={12} /> lootbox {"\u00b7"} {formatKakera(LOOT_COST)}{" "}
        kakigori {"\u00b7"} you have {formatKakera(state.kakigori)}
      </p>'''),
])

if fails:
    print("\nFAILURES:")
    for f in fails: print(" ", f)
    sys.exit(1)
print("\nremaining replacements landed")
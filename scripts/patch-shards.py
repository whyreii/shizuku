import io, re, sys

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
        print(f"  {path}: {n}x  {old[:52]}")
    write(path, s)

# ---------------- wording: keys -> shards --------------------------------
sub("src/App.tsx", [
    ('crystals and keys."', 'crystals and shards."'),
    ('collection, keys, wishes and', 'collection, shards, wishes and'),
    ('collection, keys, wishes and overrides', 'collection, shards, wishes and overrides'),
])

sub("src/components/Card3D.tsx", [
    ('of ${keyCap} keys`', 'of ${keyCap} shards`'),
])

sub("src/components/CharacterSheet.tsx", [
    ('5% of its keys are lost.', '5% of its shards are lost.'),
    ('<dt>keys</dt>', '<dt>shards</dt>'),
])

sub("src/components/CollectionView.tsx", [
    ('<span>keys</span>', '<span>shards</span>'),
])

sub("src/components/HelpFab.tsx", [
    ('title: "keys",', 'title: "shards",'),
    ('adds a key - no cooldown', 'adds a shard - no cooldown'),
    ('up to 500 keys per character', 'up to 500 shards per character'),
    ('10 keys makes the card a soulmate', '10 shards makes the card a soulmate'),
])

sub("src/components/Panels.tsx", [
    ("keys + ' key'", "keys + ' shard'"),
    ('<span>Keys</span>', '<span>Shards</span>'),
])

sub("src/engine/game.ts", [
    ('+10% kakigori from keys', '+10% kakigori from shards'),
    ('label: "Key capacity"', 'label: "Shard capacity"'),
    ('+1 key per character', '+1 shard per character'),
    ('+1 key"', '+1 shard"'),
    ('Keys only come from rolling', 'Shards only come from rolling'),
    ('${keyCap(prev)} keys.', '${keyCap(prev)} shards.'),
    ('Key cooldown: ', 'Shard cooldown: '),
    ('Soulmate needs 10 keys', 'Soulmate needs 10 shards'),
    ('`key ', '`shard '),
])

# ---------------- icons: imports ----------------------------------------
s = read("src/App.tsx")
if 'components/Icon' not in s:
    s = s.replace(
        'import { LootPanel } from "./components/LootPanel";',
        'import { LootPanel } from "./components/LootPanel";\nimport { Icon } from "./components/Icon";',
    )
write("src/App.tsx", s)

s = read("src/components/Card3D.tsx")
if '"./Icon"' not in s:
    s = s.replace(
        'import { tierClass, tierForRank } from "../engine/tiers";',
        'import { tierClass, tierForRank } from "../engine/tiers";\nimport { Icon } from "./Icon";',
    )
write("src/components/Card3D.tsx", s)

s = read("src/components/LootPanel.tsx")
if '"./Icon"' not in s:
    s = s.replace(
        'import type { GameState } from "../engine/types";',
        'import type { GameState } from "../engine/types";\nimport { Icon } from "./Icon";',
    )
write("src/components/LootPanel.tsx", s)

# ---------------- icons: header numbers ---------------------------------
sub("src/App.tsx", [(
'''        <dl className="numbers">
          <div className="primary-stat">
            <dt>kakigori/hr</dt>
            <dd>{formatKakera(kakigoriPerHour(state))}</dd>
          </div>
          <div>
            <dt>kakigori</dt>
            <dd>{formatCompact(state.kakigori)}</dd>
          </div>
          <div>
            <dt>rolls</dt>
            <dd>{state.rolls}</dd>
          </div>
        </dl>''',
'''        <dl className="numbers">
          <div className="primary-stat">
            <dt>
              <Icon name="clock" size={10} />
              kakigori/hr
            </dt>
            <dd>{formatKakera(kakigoriPerHour(state))}</dd>
          </div>
          <div>
            <dt>
              <Icon name="kakigori" size={10} />
              kakigori
            </dt>
            <dd>{formatCompact(state.kakigori)}</dd>
          </div>
          <div>
            <dt>
              <Icon name="rolls" size={10} />
              rolls
            </dt>
            <dd>{state.rolls}</dd>
          </div>
        </dl>'''),
])

# ---------------- icons: shard cue --------------------------------------
sub("src/App.tsx", [(
    '{keyCue ? <span className="key-cue">KEY +1</span> : null}',
'''{keyCue ? (
              <span className="key-cue">
                <Icon name="shard" size={10} />
                SHARD +1
              </span>
            ) : null}'''),
])

# ---------------- icons: card value -------------------------------------
sub("src/components/Card3D.tsx", [(
    '<span className="card-value">\u25c7 {formatKakera(characterValueValue(character.rank, keys))}</span>',
'''<span className="card-value">
                <Icon name="kakigori" size={11} />
                {formatKakera(characterValueValue(character.rank, keys))}
              </span>'''),
])

# ---------------- icons: loot panel -------------------------------------
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
print("\nall replacements landed")
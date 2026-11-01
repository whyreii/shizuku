import io, sys
sys.stdout.reconfigure(encoding="utf-8")

def patch(path, pairs):
    s = io.open(path, encoding="utf-8").read()
    for old, new in pairs:
        n = s.count(old)
        if n == 0:
            print("MISS", path, ":", old[:50]); sys.exit(1)
        s = s.replace(old, new)
    io.open(path, "w", encoding="utf-8", newline="\n").write(s)
    print("ok", path, len(pairs), "edits")

# ---- tabs ---------------------------------------------------------------
patch("src/App.tsx", [
    ('"Badges", "Tower", "Loot"', '"Badges", "Fountain", "Loot"'),
    ('{tab === "Tower" ? <TowerPanel', '{tab === "Fountain" ? <TowerPanel'),
])

# ---- panel --------------------------------------------------------------
patch("src/components/TowerPanel.tsx", [
    ("<span>floor</span>", "<span>basin</span>"),
    ("<span>next floor</span>", "<span>next basin</span>"),
    ("<span>tower</span>", "<span>fountain</span>"),
    ('"Tower complete ', '"Fountain complete '),
    ("the next floor starts a new tower with the same perks",
     "the next basin starts a new fountain with the same perks"),
    ("Pick one perk per floor. The next floor costs",
     "Pick one perk per basin. The next basin costs"),
    ("Already built in this tower", "Already built in this fountain"),
    ('title: "Destroy the tower?"', 'title: "Drain the fountain?"'),
    ("resets every floor you built", "resets every basin you built"),
    ('confirmLabel: "Destroy"', 'confirmLabel: "Drain"'),
    ("destroy tower ", "drain fountain "),
])

# ---- guide ---------------------------------------------------------------
patch("src/components/HelpFab.tsx", [
    ('title: "tower"', 'title: "fountain"'),
    ("12 floors per tower, one perk per floor", "12 basins per fountain, one perk per basin"),
    ("the 13th build starts a second tower", "the 13th build starts a second fountain"),
])

# ---- engine: logs and errors --------------------------------------------
patch("src/engine/game.ts", [
    ("`tower floor ${state.tower.floors} built`", "`fountain basin ${state.tower.floors} built`"),
    ('"No tower to destroy."', '"No fountain to drain."'),
    ("`tower destroyed (+${", "`fountain drained (+${"),
    ("built in this tower.", "built in this fountain."),
    (" * Kakera Tower", " * Fountain"),
])

patch("src/engine/types.ts", [
    ("/** Kakera Tower: 12 floors per tower, one perk each, refundable. */",
     "/** Fountain: 12 basins per fountain, one perk each, refundable. */"),
])

# ---- preview dock --------------------------------------------------------
patch("src/PreviewV3.tsx", [
    ('  tower: (\n    <>\n      <path d="M4 20h16" />\n      <path d="M6.5 20v-7h11v7" />\n      <path d="M9 13V8.5h6V13" />\n    </>\n  ),',
     '  fountain: (\n    <>\n      <path d="M12 3.6v6.4" />\n      <path d="M12 6.2c-2.7 0-4.8 1.9-5.4 4.6" />\n      <path d="M12 6.2c2.7 0 4.8 1.9 5.4 4.6" />\n      <path d="M3.4 12.6h17.2" />\n      <path d="M6.2 12.6v6.2h11.6v-6.2" />\n    </>\n  ),'),
    ('const DOCK = ["album", "wishes", "badges", "tower", "loot", "series", "log"] as const;',
     'const DOCK = ["album", "wishes", "badges", "fountain", "loot", "series", "log"] as const;'),
])
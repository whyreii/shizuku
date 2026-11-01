import io

p = "src/components/Panels.tsx"
s = io.open(p, encoding="utf-8").read()

drop = [
    "  DAILY_MS,\n",
    "  UPGRADE_DEFS,\n",
    "  buyUpgrade,\n",
    "  claimDaily,\n",
    "  dailyAmount,\n",
    "  dailyAvailable,\n",
    "  formatCountdown,\n",
    "  kakigoriPerHour,\n",
    "  levelUp,\n",
    "  powerCost,\n",
    "  rollsPerReset,\n",
]
for token in drop:
    s = s.replace(token, "", 1)

s = s.replace(
    "import type {\n  BaseCategory,\n  Character,\n  GameState,\n  SortKey,\n  UpgradeKey,\n} from \"../engine/types\";",
    "import type { Character, GameState, SortKey } from \"../engine/types\";",
)
s = s.replace(
    "import type { Character, GameState, SortKey, UpgradeKey } from \"../engine/types\";",
    "import type { Character, GameState, SortKey } from \"../engine/types\";",
)

io.open(p, "w", encoding="utf-8", newline="\n").write(s)
print("imports cleaned")

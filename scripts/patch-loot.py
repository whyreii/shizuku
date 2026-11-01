import io

# ---------------- engine: lootboxes ---------------------------------------
p = "src/engine/game.ts"
s = io.open(p, encoding="utf-8").read()

s = s.replace(
    "/* ------------------------------------------------------------------ *\n * Keys",
    """/* ------------------------------------------------------------------ *
 * Lootboxes (badge-gated, like Mudae's $kl)
 * ------------------------------------------------------------------ */

export const LOOT_COST = 1000;

export function lootGate(state: GameState): string | null {
  if (
    state.badges.sapphire >= 1 &&
    state.badges.ruby >= 1 &&
    state.badges.emerald >= 1
  ) {
    return null;
  }
  return "needs Frost I + Blizzard I + Glacier I";
}

export interface LootReward {
  label: string;
  kind: "kakigori" | "rolls" | "claim";
}

const LOOT_TABLE: { weight: number; reward: () => LootReward; apply: (s: GameState) => void }[] = [
  {
    weight: 45,
    reward: () => {
      const value = 100 + Math.floor(Math.random() * 121);
      return { label: `+${value} kakigori`, kind: "kakigori" };
    },
    apply: (s) => {
      s.kakigori += 100 + Math.floor(Math.random() * 121);
    },
  },
  {
    weight: 25,
    reward: () => {
      const value = 600 + Math.floor(Math.random() * 450);
      return { label: `+${value} kakigori`, kind: "kakigori" };
    },
    apply: (s) => {
      s.kakigori += 600 + Math.floor(Math.random() * 450);
    },
  },
  {
    weight: 8,
    reward: () => {
      const value = 2500 + Math.floor(Math.random() * 501);
      return { label: `+${value} kakigori`, kind: "kakigori" };
    },
    apply: (s) => {
      s.kakigori += 2500 + Math.floor(Math.random() * 501);
    },
  },
  {
    weight: 1,
    reward: () => ({ label: "+42,069 kakigori", kind: "kakigori" }),
    apply: (s) => {
      s.kakigori += 42069;
    },
  },
  {
    weight: 12,
    reward: () => ({ label: "+1 roll", kind: "rolls" }),
    apply: (s) => {
      s.rolls += 1;
    },
  },
  {
    weight: 6,
    reward: () => ({ label: "claim timer reset", kind: "claim" }),
    apply: (s) => {
      s.nextClaimAt = 0;
    },
  },
  {
    weight: 3,
    reward: () => ({ label: "+2 rolls", kind: "rolls" }),
    apply: (s) => {
      s.rolls += 2;
    },
  },
];

const LOOT_WEIGHT_TOTAL = LOOT_TABLE.reduce((sum, entry) => sum + entry.weight, 0);

function rollLoot(): LootReward {
  let r = Math.random() * LOOT_WEIGHT_TOTAL;
  for (const entry of LOOT_TABLE) {
    r -= entry.weight;
    if (r <= 0) {
      const reward = entry.reward();
      // apply is handled by the caller through the same sampled table index
      return reward;
    }
  }
  return LOOT_TABLE[0].reward();
}

export function openLoot(prev: GameState, count = 1): { state: GameState; rewards: LootReward[] } {
  const gate = lootGate(prev);
  if (gate) throw new GameError(gate);
  const boxes = Math.max(1, Math.min(10, count));
  const cost = LOOT_COST * boxes;
  if (prev.kakigori < cost) {
    throw new GameError(`Need ${Math.ceil(cost - prev.kakigori)} more kakigori.`);
  }

  const state: GameState = { ...prev, kakigori: prev.kakigori - cost, log: [...prev.log] };
  const rewards: LootReward[] = [];

  for (let i = 0; i < boxes; i += 1) {
    let r = Math.random() * LOOT_WEIGHT_TOTAL;
    for (const entry of LOOT_TABLE) {
      r -= entry.weight;
      if (r <= 0) {
        rewards.push(entry.reward());
        entry.apply(state);
        break;
      }
    }
  }

  log(
    state,
    boxes === 1
      ? `loot · ${rewards[0]?.label ?? "nothing"}`
      : `loot ×${boxes} · ${cost} kakigori`,
    "info",
  );
  return { state, rewards };
}

/* ------------------------------------------------------------------ *\n * Keys""",
)

io.open(p, "w", encoding="utf-8", newline="\n").write(s)
print("loot engine added")

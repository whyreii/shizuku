import io, sys
sys.stdout.reconfigure(encoding="utf-8")
p = "src/engine/game.ts"
s = io.open(p, encoding="utf-8").read()

s = s.replace("  Override,\n  UpgradeKey,", "  Override,\n  Tier,\n  UpgradeKey,")

old = """  const state: GameState = {
    ...prev,
    kakigori: prev.kakigori + bonus,
    nextClaimAt: now + claimCooldownMs(prev),"""
new = """  const state: GameState = {
    ...prev,
    kakigori: prev.kakigori + bonus,
    nextClaimAt: now + claimCooldownMs(prev),"""
if s.count(old) != 1:
    print("MISS state block"); sys.exit(1)

# grant shards on claim, right before the claim log line
old2 = """  log(
    state,
    `claimed ${char.name}"""
new2 = """  // Claiming pays shards by tier, so a card that never duplicates still climbs.
  const shardGrant = CLAIM_SHARDS[tierForRank(char.rank)];
  if (shardGrant > 0) {
    const held = prev.keys[cur.charId]?.keys ?? 0;
    const next = Math.min(keyCap(prev), held + shardGrant);
    if (next > held) {
      state.keys = {
        ...prev.keys,
        [cur.charId]: { keys: next, lastKeyAt: now },
      };
      state.stats = { ...state.stats, keys: state.stats.keys + (next - held) };
    }
  }

  log(
    state,
    `claimed ${char.name}"""
if s.count(old2) != 1:
    print("MISS claim log"); sys.exit(1)
s = s.replace(old2, new2)
io.open(p, "w", encoding="utf-8", newline="\n").write(s)
print("claim shards wired")
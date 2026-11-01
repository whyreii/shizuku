import io
p = "src/engine/types.ts"
s = io.open(p, encoding="utf-8").read()
s = s.replace("  /** Rolls per hour spent on wish spawn chance. */\n  wishBoost: number;",
              "  /** Rolls per hour spent on wish spawn chance. */\n  wishBoost: number;\n  /** When the boost was last lowered (12h cooldown). */\n  wishBoostAt: number;")
io.open(p, "w", encoding="utf-8", newline="\n").write(s)

g = "src/engine/game.ts"
t = io.open(g, encoding="utf-8").read()
t = t.replace("    novelty: NOVELTY_MAX,\n    wishBoost: 0,", "    novelty: NOVELTY_MAX,\n    wishBoost: 0,\n    wishBoostAt: 0,")
io.open(g, "w", encoding="utf-8", newline="\n").write(t)
print("state fields added")
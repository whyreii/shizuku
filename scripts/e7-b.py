import io
p = "src/App.tsx"
s = io.open(p, encoding="utf-8").read()
s = s.replace("  nextGoal,\n  roll,\n} from \"./engine/game\";",
              "  nextGoal,\n  roll,\n  rollsPerReset,\n  starwishBoostPercent,\n  wishBoostPercent,\n} from \"./engine/game\";")
io.open(p, "w", encoding="utf-8", newline="\n").write(s)
print("imports added")
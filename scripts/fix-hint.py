import io

# ---------- App: hint respects the claim cooldown ----------
p = "src/App.tsx"
s = io.open(p, encoding="utf-8").read()

s = s.replace(
    """  const hint = !current
    ? "Roll for a card. Anything can appear."
    : owned
      ? "You own this card — re-rolls pay crystals and keys."
      : windowOpen
        ? "Claim it before the window closes."
        : "Window closed.";""",
    """  const hint = !current
    ? "Roll for a card. Anything can appear."
    : owned
      ? "You own this card — re-rolls pay crystals and keys."
      : claimWait > 0
        ? `Next claim in ${formatCountdown(claimWait)} · this window expires first.`
        : windowOpen
          ? "Claim it before the window closes."
          : "Window closed.";""",
)

io.open(p, "w", encoding="utf-8", newline="\n").write(s)
print("hint fixed")

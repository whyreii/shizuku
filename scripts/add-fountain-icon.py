import io, sys
sys.stdout.reconfigure(encoding="utf-8")
p = "src/components/Icon.tsx"
s = io.open(p, encoding="utf-8").read()
s = s.replace('  | "clock"\n  | "gear";', '  | "clock"\n  | "gear"\n  | "fountain";')
s = s.replace("""  gear: (""", """  /* fountain: the tower's replacement - a jet falling into a basin */
  fountain: (
    <>
      <path d="M12 3.6v6.4" />
      <path d="M12 6.2c-2.7 0-4.8 1.9-5.4 4.6" />
      <path d="M12 6.2c2.7 0 4.8 1.9 5.4 4.6" />
      <path d="M3.4 12.6h17.2" />
      <path d="M6.2 12.6v6.2h11.6v-6.2" />
    </>
  ),
  gear: (""")
io.open(p, "w", encoding="utf-8", newline="\n").write(s)
print("fountain glyph added to the icon set")
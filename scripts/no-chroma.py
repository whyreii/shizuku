import io, sys
sys.stdout.reconfigure(encoding="utf-8")
p = "src/preview.css"
s = io.open(p, encoding="utf-8").read()
old = """.gf-stage.is-top3 .gf-hero {
  animation: none;
  filter:
    drop-shadow(1.4px 0 0 rgba(255, 74, 122, 0.55))
    drop-shadow(-1.4px 0 0 rgba(88, 198, 255, 0.6))
    drop-shadow(0 1.2px 0 rgba(150, 255, 214, 0.35));
}"""
new = """/* No filter, no fringe, no halo. Top three is water only. */
.gf-stage.is-top3 .gf-hero {
  animation: none;
  filter: none;
}"""
if s.count(old) != 1:
    print("MISS"); sys.exit(1)
s = s.replace(old, new)
io.open(p, "w", encoding="utf-8", newline="\n").write(s)
print("chromatic edge removed")
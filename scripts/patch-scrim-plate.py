import io

p = "src/styles.css"
s = io.open(p, encoding="utf-8").read()

start = s.index(".card-bottom {")
end = s.index(".card-name {")
old = s[start:end]

new = """.card-bottom {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 28px 14px 12px;
  border: 0;
  border-radius: 0 0 16px 16px;
  /* transparent at the top so the art shows through, solid enough to read */
  background: linear-gradient(
    to top,
    rgba(4, 7, 12, 0.94) 0%,
    rgba(4, 7, 12, 0.86) 38%,
    rgba(4, 7, 12, 0.5) 72%,
    transparent 100%
  );
  transform: translateZ(34px);
}

"""

s = s[:start] + new + s[end:]
io.open(p, "w", encoding="utf-8", newline="\n").write(s)
print("plate is a transparent scrim now")

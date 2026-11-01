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
  padding: 10px 14px 12px;
  border: 0;
  border-top: 1px solid rgba(255, 255, 255, 0.07);
  border-radius: 0 0 16px 16px;
  background: rgba(5, 9, 15, 0.88);
  transform: translateZ(34px);
}

"""

s = s[:start] + new + s[end:]
io.open(p, "w", encoding="utf-8", newline="\n").write(s)
print("card plate flattened")

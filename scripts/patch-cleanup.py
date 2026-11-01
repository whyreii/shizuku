import io

p = "src/components/Panels.tsx"
s = io.open(p, encoding="utf-8").read()
start = s.index("export function UpgradePanel")
end = s.index("export function SeriesPanel")
s = s[:start] + s[end:]
io.open(p, "w", encoding="utf-8", newline="\n").write(s)

c = "src/styles.css"
css = io.open(c, encoding="utf-8").read()
css = css.replace(
    """.badge-dot.bronze { background: #c98b5e; color: #c98b5e; }
.badge-dot.silver { background: #cfd6de; color: #cfd6de; }
.badge-dot.gold { background: #ffd76a; color: #ffd76a; }
.badge-dot.sapphire { background: #6fb5ff; color: #6fb5ff; }
.badge-dot.ruby { background: #ff6b93; color: #ff6b93; }
.badge-dot.emerald { background: #58e0b0; color: #58e0b0; }
.badge-dot.diamond { background: #cfe8ff; color: #cfe8ff; }""",
    """.badge-dot.bronze {
  background: #9fb8cc;
  color: #9fb8cc;
  border-radius: 50% 50% 50% 2px;
}

.badge-dot.silver {
  background: #cfe0ef;
  color: #cfe0ef;
  border-radius: 50% 50% 50% 2px;
}

.badge-dot.gold {
  background: #a8d8ff;
  color: #a8d8ff;
  border-radius: 50% 50% 50% 2px;
}

.badge-dot.sapphire {
  background: #7fd8ff;
  color: #7fd8ff;
  border-radius: 1px;
  clip-path: polygon(50% 0, 93% 25%, 93% 75%, 50% 100%, 7% 75%, 7% 25%);
}

.badge-dot.ruby {
  background: #6f9cff;
  color: #6f9cff;
  border-radius: 1px;
  clip-path: polygon(50% 0, 93% 25%, 93% 75%, 50% 100%, 7% 75%, 7% 25%);
}

.badge-dot.emerald {
  background: #4fd1c5;
  color: #4fd1c5;
  border-radius: 1px;
  clip-path: polygon(50% 0, 93% 25%, 93% 75%, 50% 100%, 7% 75%, 7% 25%);
}

.badge-dot.diamond {
  background: conic-gradient(from 0deg, #cfe8ff, #a8d8ff, #d9c8ff, #cfe8ff);
  color: #cfe8ff;
  border-radius: 50%;
}""",
)
io.open(c, "w", encoding="utf-8", newline="\n").write(css)
print("upgrade panel removed, dots restyled")

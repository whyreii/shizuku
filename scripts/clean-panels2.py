import io

p = "src/components/Panels.tsx"
s = io.open(p, encoding="utf-8").read()
s = s.replace("  collectionValue,\n", "")
s = s.replace('import { CollectionView } from "./CollectionView";\n', "")
io.open(p, "w", encoding="utf-8", newline="\n").write(s)

c = "src/styles.css"
css = io.open(c, encoding="utf-8").read()
css += """

/* bottom strip */
.strip {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding-top: 10px;
  border-top: 1px solid var(--line-soft);
}

.strip-stat {
  font-size: 11.5px;
  color: var(--muted);
}

/* next-goal progress */
.goal {
  position: relative;
  padding-bottom: 8px;
}

.goal-bar {
  position: absolute;
  left: 0;
  bottom: 2px;
  height: 1px;
  background: color-mix(in srgb, var(--frost) 70%, transparent);
  transition: width 0.3s ease;
}
"""
io.open(c, "w", encoding="utf-8", newline="\n").write(css)
print("cleaned")

import io

p = "src/components/CollectionView.tsx"
s = io.open(p, encoding="utf-8").read()

start = s.find("  const [clean, setClean] = useState(")
if start != -1:
    end = s.find("  }, [clean]);", start)
    if end != -1:
        s = s[:start] + s[end + len("  }, [clean]);\n\n") :]

s = s.replace('import { useEffect, useMemo, useState } from "react";', 'import { useMemo, useState } from "react";')

io.open(p, "w", encoding="utf-8", newline="\n").write(s)
print("board toggle state removed")

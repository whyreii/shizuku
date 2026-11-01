import io

p = "src/components/Panels.tsx"
s = io.open(p, encoding="utf-8").read()
if 'import { useConfirm }' not in s:
    s = s.replace(
        'import { useVirtualRows } from "./useVirtualRows";',
        'import { useVirtualRows } from "./useVirtualRows";\nimport { useConfirm } from "./useConfirm";',
    )
io.open(p, "w", encoding="utf-8", newline="\n").write(s)
print("useConfirm imported")

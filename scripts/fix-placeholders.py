import io
import re

fixes = {
    "src/components/Panels.tsx": [
        ('placeholder="Search name or series', 'placeholder="Search name or series..."'),
        ('placeholder="Filter series', 'placeholder="Filter series..."'),
    ],
    "src/components/CollectionView.tsx": [
        ('placeholder="Search name or series', 'placeholder="Search name or series..."'),
    ],
}

for path, pairs in fixes.items():
    text = io.open(path, encoding="utf-8", errors="replace").read()
    for needle, replacement in pairs:
        # replace the whole attribute value on that line
        text = re.sub(
            re.escape(needle) + r'[^"]*"',
            replacement + '"',
            text,
        )
    io.open(path, "w", encoding="utf-8", newline="\n").write(text)
    print("ascii placeholders in", path)

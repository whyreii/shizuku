import io

for path in ["src/components/Panels.tsx", "src/components/CollectionView.tsx"]:
    text = io.open(path, encoding="utf-8").read()
    text = text.replace('series...""', 'series..."')
    text = text.replace('Filter series...""', 'Filter series..."')
    io.open(path, "w", encoding="utf-8", newline="\n").write(text)

for path in ["src/components/Panels.tsx", "src/components/CollectionView.tsx"]:
    for line in io.open(path, encoding="utf-8").read().splitlines():
        if "placeholder=" in line:
            print(path, ascii(line.strip()))

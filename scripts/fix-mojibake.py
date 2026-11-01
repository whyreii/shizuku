import io

for path in ["src/components/Panels.tsx", "src/components/CollectionView.tsx"]:
    raw = io.open(path, "rb").read()
    text = raw.decode("utf-8", errors="replace")
    text = text.replace("\ufffd", "...")
    io.open(path, "w", encoding="utf-8", newline="\n").write(text)
    print("cleaned", path)

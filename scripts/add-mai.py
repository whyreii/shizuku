import io, sys
sys.stdout.reconfigure(encoding="utf-8")
p = "src/PreviewV3.tsx"
s = io.open(p, encoding="utf-8").read()
anchor = '  { rank: 3, image: "https://s4.anilist.co/file/anilistcdn/character/large/n1905-9GfCvLFKNRLR.png" },'
mai = '  { rank: 10, image: "https://s4.anilist.co/file/anilistcdn/character/large/b127222-Jh5hhP7vZ7s1.png" },'
print("anchor found:", s.count(anchor))
if s.count(anchor) != 1:
    sys.exit(1)
if "rank: 10," not in s:
    s = s.replace(anchor, anchor + "\n" + mai)
io.open(p, "w", encoding="utf-8", newline="\n").write(s)
print("added")
import io, re, sys
sys.stdout.reconfigure(encoding="utf-8")
p = "public/preview-v3.html"
s = io.open(p, encoding="utf-8").read()

picks = """        ["Abigail Jones", "Great Pretender", 11, "sp", 12000],
        ["Arataka Reigen", "Mob Psycho 100", 48, "s", 11460],
        ["Cattleya Baudelaire", "Violet Evergarden", 85, "s", 10920],
        ["Douma", "Demon Slayer", 122, "s", 10380],
        ["Fyodor Dostoyevsky", "Bungo Stray Dogs", 159, "s", 9840],
        ["Haruhi Fujioka", "Ouran High School Host Club", 196, "a", 9300],
        ["Illumi Zoldyck", "Hunter x Hunter", 233, "a", 8760],
        ["Junpei Yoshino", "JUJUTSU KAISEN", 270, "a", 8220],
        ["Ki-Ja", "Yona of the Dawn", 307, "a", 7680],
        ["Kurumi Tokisaki", "Date A Live", 344, "a", 7140],
        ["Maka Albarn", "Soul Eater", 381, "a", 6600],
        ["Mina Ashiro", "Kaiju No. 8", 418, "b", 6060],
        ["Narancia Ghirga", "JoJo Golden Wind", 455, "b", 5520],
        ["Pannacotta Fugo", "JoJo Golden Wind", 492, "b", 4980],
        ["Ririka Momobami", "Kakegurui", 529, "c", 4440],
        ["Saku Natsusawa", "Fragrant Flower", 566, "d", 3900],
        ["Shino Asada", "Sword Art Online II", 603, "c", 3360],
        ["Stark", "Frieren", 640, "b", 2820],
        ["Tomoyo Sakagami", "Clannad", 677, "a", 2280],
        ["Waver Velvet", "Fate/Zero", 714, "s", 1740]"""

imgs = """        "https://s4.anilist.co/file/anilistcdn/character/large/b158450-8Tvl7X2VtHj0.png",
        "https://s4.anilist.co/file/anilistcdn/character/large/b89334-OPj1hCzvrt7X.png",
        "https://s4.anilist.co/file/anilistcdn/character/large/b124787-1HuZGawvoejp.jpg",
        "https://s4.anilist.co/file/anilistcdn/character/large/b144591-v2yrXtHorZFS.png",
        "https://s4.anilist.co/file/anilistcdn/character/large/b138067-oHmQo5cOSZMN.png",
        "https://s4.anilist.co/file/anilistcdn/character/large/b18-4mPQwygwffNJ.jpg",
        "https://s4.anilist.co/file/anilistcdn/character/large/b57-pTFguojSOQZW.png",
        "https://s4.anilist.co/file/anilistcdn/character/large/b157214-ROBNoXVEXRNy.jpg",
        "https://s4.anilist.co/file/anilistcdn/character/large/b67747-Epj21EmBa34y.jpg",
        "https://s4.anilist.co/file/anilistcdn/character/large/b70069-DEV7X6o2L7oG.jpg",
        "https://s4.anilist.co/file/anilistcdn/character/large/b8439-5TIyWlfClnMs.png",
        "https://s4.anilist.co/file/anilistcdn/character/large/b180693-i9RZuHTDwXov.png",
        "https://s4.anilist.co/file/anilistcdn/character/large/b11895-qLSpMN3gVLHP.png",
        "https://s4.anilist.co/file/anilistcdn/character/large/b13083-vEmGajGdXqCu.jpg",
        "https://s4.anilist.co/file/anilistcdn/character/large/b122777-pdh3z3WbnvlL.png",
        "https://s4.anilist.co/file/anilistcdn/character/large/b272241-6NHTwQDIUXQk.png",
        "https://s4.anilist.co/file/anilistcdn/character/large/b55147-1fCU8lONEuZQ.png",
        "https://s4.anilist.co/file/anilistcdn/character/large/b184313-CQl6GSt4RSny.jpg",
        "https://s4.anilist.co/file/anilistcdn/character/large/b4603-pq4b7UGmmOyH.png",
        "https://s4.anilist.co/file/anilistcdn/character/large/b16023-gfwOgU1743ff.png\""""

s = re.sub(r"const picks = \[.*?\n      \];", "const picks = [\n" + picks + "\n      ];", s, flags=re.S)
s = re.sub(r"const IMGS = \[.*?\n      \];", "const IMGS = [\n" + imgs + "\n      ];", s, flags=re.S)

# shelf scrolls like an album instead of clipping under the dock
s = s.replace(
    ".shelf { display: grid; grid-template-columns: repeat(6, minmax(0,1fr)); gap: 14px; overflow: hidden; }",
    ".shelf {\n        display: grid; grid-template-columns: repeat(6, minmax(0,1fr));\n        align-content: start; gap: 14px;\n        overflow-y: auto; padding-right: 6px;\n        scrollbar-width: thin; scrollbar-color: rgba(154,217,255,.28) transparent;\n      }",
)

# a deck that actually shows
s = s.replace(
    ".deck::before { transform: translate(-9px, 9px) rotate(-4.2deg); }",
    ".deck::before { transform: translate(-15px, 11px) rotate(-6.5deg); background: rgba(12,18,27,.95); }",
)
s = s.replace(
    ".deck::after { transform: translate(9px, 5px) rotate(3.6deg); opacity: .7; }",
    ".deck::after { transform: translate(15px, 7px) rotate(5.2deg); background: rgba(12,18,27,.9); }",
)
s = s.replace(
    ".hero img { width: 100%; height: 100%; object-fit: cover; object-position: center 12%; }",
    ".hero img { width: 100%; height: 100%; object-fit: cover; object-position: center 16%; }",
)

s = s.replace('<span class="count">23 <i>/ 6,225</i></span>', '<span class="count">20 <i>/ 6,225</i></span>')
s = s.replace('<span class="bar"><i></i></span>', '<span class="bar"><i style="width:.4%"></i></span>')
s = s.replace("s 4", "s 5").replace("a 6", "a 7").replace("b 7", "b 4").replace("c 5", "c 2")

io.open(p, "w", encoding="utf-8", newline="\n").write(s)
print("patched:", s.count("anilistcdn"), "image urls")
import io, sys
sys.stdout.reconfigure(encoding="utf-8")

# 1. load the three survivors
p = "index.html"
s = io.open(p, encoding="utf-8").read()
old = "&family=Russo+One&family=Kanit:wght@400;500;600;700&display=swap"
new = "&family=Russo+One&family=Kanit:wght@400;500;600;700&family=Baloo+2:wght@500;600;700&family=Bakbak+One&display=swap"
if s.count(old) != 1:
    print("MISS font link"); sys.exit(1)
s = s.replace(old, new)
io.open(p, "w", encoding="utf-8", newline="\n").write(s)

# 2. switchable display face on the frame
c = "src/preview.css"
t = io.open(c, encoding="utf-8").read()
old2 = """.gf {
  --disp: "Russo One", Impact, sans-serif;
  --ui: "Kanit", system-ui, sans-serif;
  font-family: var(--ui);
}"""
new2 = """.gf {
  --disp: "Baloo 2", system-ui, sans-serif;
  --ui: "Kanit", system-ui, sans-serif;
  font-family: var(--ui);
}

/* ?type= lets the same frame be judged in each surviving face */
.gf[data-type="kanit"] { --disp: "Kanit", system-ui, sans-serif; }
.gf[data-type="baloo"] { --disp: "Baloo 2", system-ui, sans-serif; }
.gf[data-type="bakbak"] { --disp: "Bakbak One", system-ui, sans-serif; }
.gf[data-type="russo"] { --disp: "Russo One", Impact, sans-serif; }"""
if t.count(old2) != 1:
    print("MISS css"); sys.exit(1)
t = t.replace(old2, new2)
io.open(c, "w", encoding="utf-8", newline="\n").write(t)

# 3. read the param
p2 = "src/PreviewV3.tsx"
tsx = io.open(p2, encoding="utf-8").read()
old3 = """  const hero = PICKED[heroIdx];"""
new3 = """  const hero = PICKED[heroIdx];
  const typeFace = new URLSearchParams(window.location.search).get("type") ?? "baloo";"""
if tsx.count(old3) != 1:
    print("MISS tsx hook"); sys.exit(1)
tsx = tsx.replace(old3, new3)
old4 = """    <div
      className="gf"
      style={{ "--hero-art": `url("${hero.portrait}")` } as CSSProperties}
    >"""
new4 = """    <div
      className="gf"
      data-type={typeFace}
      style={{ "--hero-art": `url("${hero.portrait}")` } as CSSProperties}
    >"""
if tsx.count(old4) != 1:
    print("MISS tsx root"); sys.exit(1)
tsx = tsx.replace(old4, new4)
io.open(p2, "w", encoding="utf-8", newline="\n").write(tsx)
print("type switch wired: kanit | baloo | bakbak | russo")
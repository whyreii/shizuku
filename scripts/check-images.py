import io, json
s = io.open("public/roster-images.json", encoding="utf-8").read()
try:
    m = json.loads(s)
except Exception as e:
    print("not valid JSON yet (mid-write):", str(e)[:60]); raise SystemExit
print("entries:", len(m))
for k in list(m)[:3]:
    print("  sample:", k, "->", m[k].split("/")[-1])
rem = {k: v for k, v in m.items() if k.lower().startswith("rem|")}
print("Rem entries:", {k: v.split('/')[-1] for k, v in rem.items()})
mai = {k: v for k, v in m.items() if k.lower().startswith("mai sakurajima|")}
print("Mai:", {k: v.split('/')[-1] for k, v in mai.items()})
mario = {k: v for k, v in m.items() if k.lower().startswith("mario|")}
print("Mario:", {k: v.split('/')[-1] for k, v in mario.items()})
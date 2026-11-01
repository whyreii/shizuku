import io, json
extra = json.load(io.open("public/roster-extra.json", encoding="utf-8"))
images = json.load(io.open("public/roster-images.json", encoding="utf-8"))
print("extras:", len(extra))
print("tuple length:", len(extra[0]), "->", extra[0][:3], "| image:", extra[0][4][:48] if len(extra[0]) > 4 else "NONE")
with_img = sum(1 for e in extra if len(e) > 4 and e[4])
print("extras with image:", with_img, "/", len(extra))
print("hand portraits:", len(images))
print("dupe names:", len(extra) - len({e[1].lower() for e in extra}))
series = {e[2] for e in extra}
print("distinct series in extras:", len(series))
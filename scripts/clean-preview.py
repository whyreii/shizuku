import io
p = "public/preview-v3.html"
s = io.open(p, encoding="utf-8", errors="replace").read()
bom = s.count("\ufeff")
s = s.replace("\ufeff", "")
io.open(p, "w", encoding="utf-8", newline="\n").write(s)
print("bom chars removed:", bom)
print("bytes:", len(s.encode("utf-8")))
for tag in ["<html", "</html>", "<style>", "</style>", "<div class=\"app\">", "</nav>", "id=\"shelf\""]:
    print(tag, s.count(tag))
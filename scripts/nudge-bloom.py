import io, sys
sys.stdout.reconfigure(encoding="utf-8")
p = "src/preview.css"
s = io.open(p, encoding="utf-8").read()
old = """  filter:
    drop-shadow(0 0 1px rgba(195, 168, 255, 0.55))
    drop-shadow(-5px 0 30px rgba(154, 217, 255, 0.17))
    drop-shadow(5px 0 30px rgba(195, 168, 255, 0.15))
    drop-shadow(0 6px 34px rgba(111, 227, 180, 0.1));"""
new = """  filter:
    drop-shadow(0 0 1px rgba(195, 168, 255, 0.6))
    drop-shadow(-6px 0 30px rgba(154, 217, 255, 0.26))
    drop-shadow(6px 0 30px rgba(195, 168, 255, 0.24))
    drop-shadow(0 8px 34px rgba(111, 227, 180, 0.14));"""
if s.count(old) != 1:
    print("MISS"); sys.exit(1)
s = s.replace(old, new)
io.open(p, "w", encoding="utf-8", newline="\n").write(s)
print("bloom nudged up")
import io, sys
sys.stdout.reconfigure(encoding="utf-8")
p = "src/preview.css"
s = io.open(p, encoding="utf-8").read()
old = """  filter: blur(24px);
  animation: gf-aurora 16s linear infinite;
}"""
new = """  filter: blur(24px);
  /* a conic gradient has no falloff - mask it so the colour stays behind the
     card instead of washing the whole page */
  mask-image: radial-gradient(circle, #000 26%, transparent 58%);
  -webkit-mask-image: radial-gradient(circle, #000 26%, transparent 58%);
  animation: gf-aurora 16s linear infinite;
}"""
if s.count(old) != 1:
    print("MISS"); sys.exit(1)
s = s.replace(old, new)
s = s.replace("rgba(154, 217, 255, 0.5),\n    rgba(195, 168, 255, 0.46),", "rgba(154, 217, 255, 0.42),\n    rgba(195, 168, 255, 0.38),")
s = s.replace("rgba(111, 227, 180, 0.4),\n    rgba(255, 217, 138, 0.36),\n    rgba(154, 217, 255, 0.5)",
              "rgba(111, 227, 180, 0.34),\n    rgba(255, 217, 138, 0.3),\n    rgba(154, 217, 255, 0.42)")
io.open(p, "w", encoding="utf-8", newline="\n").write(s)
print("aurora masked and softened")
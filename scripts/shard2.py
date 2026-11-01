import io, sys
sys.stdout.reconfigure(encoding="utf-8")
p = "src/preview.css"
s = io.open(p, encoding="utf-8").read()

s = s.replace("  top: -46px;\n  transform: translateX(-50%);\n  width: 62px;\n  height: 50px;",
              "  top: -60px;\n  transform: translateX(-50%);\n  width: 70px;\n  height: 57px;")
s = s.replace("background: linear-gradient(158deg, #e6f6ff 0%, #9ad9ff 30%, #5f9cc4 66%, #cfe8fa 100%);",
              "background: linear-gradient(158deg, #f4fbff 0%, #a9dfff 26%, #629fc7 58%, #dff0fb 100%);")
s = s.replace("font-size: 14px;", "font-size: 15px;")
# a facet seam down the face makes it read as cut ice, not a hexagon outline
s = s.replace("""  background: linear-gradient(140deg, rgba(226, 246, 255, 0.16) 0%, rgba(226, 246, 255, 0) 38%);
}""",
"""  background:
    linear-gradient(
      90deg,
      transparent calc(50% - 0.5px),
      rgba(230, 246, 255, 0.26) calc(50% - 0.5px),
      rgba(230, 246, 255, 0.26) calc(50% + 0.5px),
      transparent calc(50% + 0.5px)
    ),
    linear-gradient(140deg, rgba(226, 246, 255, 0.18) 0%, rgba(226, 246, 255, 0) 38%);
}""")
io.open(p, "w", encoding="utf-8", newline="\n").write(s)
print("shard refined")
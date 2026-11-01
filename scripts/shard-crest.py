import io, sys
sys.stdout.reconfigure(encoding="utf-8")
p = "src/preview.css"
s = io.open(p, encoding="utf-8").read()

start = s.index("/* engraved plate, sitting outside the card so nothing is added to it */")
end = s.index("@media (prefers-reduced-motion: reduce) {", start)
new = """/* The crest is a shard, not a pill - the same hexagonal cut as the wordmark
   mark, so the top of the ladder carries the same object as the logo. Dark
   face, hairline of ice, numeral engraved in serif. */
.gf-crest {
  position: absolute;
  left: 50%;
  top: -46px;
  transform: translateX(-50%);
  width: 62px;
  height: 50px;
  display: grid;
  place-items: center;
  clip-path: polygon(50% 0%, 100% 26%, 100% 74%, 50% 100%, 0% 74%, 0% 26%);
  -webkit-clip-path: polygon(50% 0%, 100% 26%, 100% 74%, 50% 100%, 0% 74%, 0% 26%);
  background: linear-gradient(158deg, #e6f6ff 0%, #9ad9ff 30%, #5f9cc4 66%, #cfe8fa 100%);
  filter: drop-shadow(0 6px 16px rgba(154, 217, 255, 0.22));
}

/* the dark face, inset so the rim reads as a 1.5px edge of ice */
.gf-crest::before {
  content: "";
  position: absolute;
  inset: 1.5px;
  clip-path: polygon(50% 0%, 100% 26%, 100% 74%, 50% 100%, 0% 74%, 0% 26%);
  -webkit-clip-path: polygon(50% 0%, 100% 26%, 100% 74%, 50% 100%, 0% 74%, 0% 26%);
  background: linear-gradient(162deg, rgba(16, 25, 37, 0.94) 0%, rgba(7, 12, 19, 0.97) 52%, rgba(14, 22, 33, 0.94) 100%);
}

/* one facet catch across the upper-left plane */
.gf-crest::after {
  content: "";
  position: absolute;
  inset: 1.5px;
  clip-path: polygon(50% 0%, 100% 26%, 100% 74%, 50% 100%, 0% 74%, 0% 26%);
  -webkit-clip-path: polygon(50% 0%, 100% 26%, 100% 74%, 50% 100%, 0% 74%, 0% 26%);
  background: linear-gradient(140deg, rgba(226, 246, 255, 0.16) 0%, rgba(226, 246, 255, 0) 38%);
}

.gf-crest span {
  position: relative;
  z-index: 1;
  font-family: var(--serif);
  font-size: 14px;
  letter-spacing: 0.04em;
  color: #eaf7ff;
  padding-bottom: 1px;
  text-shadow: 0 1px 6px rgba(0, 0, 0, 0.8);
}

"""
s = s[:start] + new + s[end:]
io.open(p, "w", encoding="utf-8", newline="\n").write(s)
print("shard crest in")
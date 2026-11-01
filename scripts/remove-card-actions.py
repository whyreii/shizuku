import io

p = "src/App.tsx"
s = io.open(p, encoding="utf-8").read()

start = s.find("        {current ? (\n          <div className=\"card-actions\">")
if start == -1:
    start = s.find('        {current ? (\n          <div className="card-actions">')
if start != -1:
    end = s.find("        ) : null}\n\n        <div className=\"controls\">", start)
    if end != -1:
        s = s[:start] + s[end + len("        ) : null}\n\n") :]

io.open(p, "w", encoding="utf-8", newline="\n").write(s)
print("card actions removed")

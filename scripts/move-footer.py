import io

p = "src/App.tsx"
s = io.open(p, encoding="utf-8").read()

# 1) replace the footer block with nothing (wish/soulmate live in sheets)
start = s.find('      <footer className="foot">')
if start != -1:
    end = s.find("      </footer>\n", start)
    if end != -1:
        s = s[:start] + s[end + len("      </footer>\n") :]

# 2) settings as a quiet gear in the header, next to the counters
anchor = "        </dl>\n      </header>"
replacement = """        </dl>

        <button
          className="gear"
          onClick={() => setSettingsOpen(true)}
          aria-label="Settings"
          title="Settings"
        >
          <svg viewBox="0 0 24 24" width="15" height="15" aria-hidden="true">
            <circle cx="12" cy="12" r="3" fill="none" stroke="currentColor" strokeWidth="1.6" />
            <path
              d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.9.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.9 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.9l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.9.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.9-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.9V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.4"
            />
          </svg>
        </button>
      </header>"""

# only apply if the gear is not already there
if 'className="gear"' not in s:
    s = s.replace(anchor, replacement, 1)

io.open(p, "w", encoding="utf-8", newline="\n").write(s)

# styles for the gear
c = "src/styles.css"
css = io.open(c, encoding="utf-8").read()
css += """

.gear {
  margin-left: 6px;
  width: 30px;
  height: 30px;
  display: grid;
  place-items: center;
  border-radius: 50%;
  border: 1px solid transparent;
  color: var(--muted);
  background: transparent;
}

.gear:hover {
  color: var(--paper);
  border-color: var(--line-hi);
}
"""
io.open(c, "w", encoding="utf-8", newline="\n").write(css)
print("footer removed, settings moved to header")

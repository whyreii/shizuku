import io

p = "src/components/Panels.tsx"
s = io.open(p, encoding="utf-8").read()

old = """  if (owned.length === 0) {
    return <p className='empty'>No characters yet. Roll, then claim within 60s.</p>;
  }

  return (
    <div className='stack'>
      <div className='readout-row'>
        <div>
          <span>owned</span>
          <b>{owned.length}</b>
        </div>
        <div>
          <span>series</span>
          <b>{new Set(owned.map((c) => c.series)).size}</b>
        </div>
        <div>
          <span>value</span>
          <b>{formatKakera(collectionValue(state))}</b>
        </div>
        <button className="expand" onClick={() => setWide(true)} title="Open collection">
          expand
        </button>
      </div>

      <div className='index-tools'>
        <input
          placeholder="Search name or series..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <div className='chips'>
          {(['value', 'rank', 'recent', 'series'] as SortKey[]).map((key) => (
            <button
              key={key}
              className={'chip-btn ' + (sort === key ? 'on' : '')}
              onClick={() => setSort(key)}
            >
              {key}
            </button>
          ))}
          <button
            className={'chip-btn ' + (onlyKeys ? 'on' : '')}
            onClick={() => setOnlyKeys((v) => !v)}
          >
            keys only
          </button>
        </div>
      </div>"""

new = """  if (owned.length === 0) {
    return (
      <div className="empty-state">
        <p className="empty">No cards yet.</p>
        <button className="mini-link" onClick={onRoll}>
          roll to start
        </button>
      </div>
    );
  }

  return (
    <div className='stack'>
      <button
        type='button'
        className='readout-row readout-link'
        onClick={() => setWide(true)}
        title='Open the collection board'
      >
        <div>
          <span>owned</span>
          <b>{owned.length}</b>
        </div>
        <div>
          <span>series</span>
          <b>{new Set(owned.map((c) => c.series)).size}</b>
        </div>
        <div>
          <span>value</span>
          <b>{formatKakera(collectionValue(state))}</b>
        </div>
        <span className='readout-arrow' aria-hidden='true'>↗</span>
      </button>

      <div className='collection-bar'>
        <input
          placeholder="Search name or series..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <div className='chips'>
          {(['value', 'rank', 'recent', 'series'] as SortKey[]).map((key) => (
            <button
              key={key}
              className={'chip-btn ' + (sort === key ? 'on' : '')}
              onClick={() => setSort(key)}
            >
              {key}
            </button>
          ))}
          <button
            className={'chip-btn ' + (onlyKeys ? 'on' : '')}
            onClick={() => setOnlyKeys((v) => !v)}
          >
            keys only
          </button>
        </div>
      </div>"""

assert old in s
s = s.replace(old, new)

io.open(p, "w", encoding="utf-8", newline="\n").write(s)
print("collection toolbar merged, stat row clickable")

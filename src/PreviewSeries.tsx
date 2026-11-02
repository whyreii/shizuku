import { useMemo, useState } from "react";
import { SeriesPage } from "./components/SeriesPage";
import { ROSTER, seriesIndex } from "./engine/roster";
import { useGame } from "./engine/store";

/**
 * Dev-only study: the series gallery as a full page, with real state.
 * `?preview=series&state=late` shows the sample save; without the fixture it
 * reads whatever save the browser has.
 */
export default function PreviewSeries() {
  const { state, act, actWithUndo } = useGame();
  const list = useMemo(() => seriesIndex(), []);
  // start on the series where the save has the most cards, so both states show
  const [series, setSeries] = useState(() => {
    const counts = new Map<string, number>();
    for (const c of ROSTER) {
      if (state.owned[c.id]) counts.set(c.series, (counts.get(c.series) ?? 0) + 1);
    }
    const best = [...counts.entries()].sort((a, b) => b[1] - a[1])[0];
    return best ? best[0] : (list[0]?.series ?? "");
  });

  return (
    <main className="preview-series">
      <div className="preview-series-bar">
        <span>preview · series page</span>
        <select value={series} onChange={(event) => setSeries(event.target.value)}>
          {list.slice(0, 40).map((row) => (
            <option key={row.series} value={row.series}>
              {row.series} · {row.count}
            </option>
          ))}
        </select>
      </div>

      <SeriesPage
        key={series}
        state={state}
        series={series}
        act={act}
        actUndo={actWithUndo}
        onBack={() => undefined}
      />
    </main>
  );
}

import { useState } from "react";
import { SeriesGrid } from "./components/SeriesGrid";
import { SeriesPage } from "./components/SeriesPage";
import { useGame } from "./engine/store";

/**
 * Dev-only study: the series wall, then its gallery page, with real state.
 * `?preview=series&state=late` shows the sample save; without the fixture it
 * reads whatever save the browser has.
 */
export default function PreviewSeries() {
  const { state, act, actWithUndo } = useGame();
  const [open, setOpen] = useState<string | null>(null);

  return (
    <main className="preview-series">
      <div className="preview-series-bar">
        <span>preview · series</span>
        {open ? <span className="preview-series-crumb">{open}</span> : null}
      </div>

      {open ? (
        <SeriesPage
          key={open}
          state={state}
          series={open}
          act={act}
          actUndo={actWithUndo}
          onBack={() => setOpen(null)}
        />
      ) : (
        <SeriesGrid state={state} onOpen={setOpen} />
      )}
    </main>
  );
}

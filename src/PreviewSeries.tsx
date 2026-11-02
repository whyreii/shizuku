import { SeriesBrowser } from "./components/SeriesBrowser";
import { useGame } from "./engine/store";

/**
 * Dev-only study: the series wall and its gallery page, with real state.
 * `?preview=series&state=late` shows the sample save; without the fixture it
 * reads whatever save the browser has.
 */
export default function PreviewSeries() {
  const { state, act, actWithUndo } = useGame();

  return (
    <main className="preview-series">
      <div className="preview-series-bar">
        <span>preview Â· series</span>
      </div>
      <SeriesBrowser state={state} act={act} actUndo={actWithUndo} />
    </main>
  );
}
import { useRef, useState } from "react";
import { SeriesGrid } from "./SeriesGrid";
import { SeriesPage } from "./SeriesPage";
import type { GameState } from "../engine/types";

interface Props {
  state: GameState;
  act: (fn: (s: GameState, now: number) => GameState) => GameState | null;
  actUndo?: (fn: (s: GameState, now: number) => GameState, label: string) => GameState | null;
}

/**
 * The series wall and its gallery page, with a directional push between them and
 * the wall's scroll position kept across the round trip.
 */
export function SeriesBrowser({ state, act, actUndo }: Props) {
  const [open, setOpen] = useState<string | null>(null);
  const [anim, setAnim] = useState<"in" | "back" | null>(null);
  const scroll = useRef(0);

  return (
    <div
      key={open ?? "grid"}
      className={anim ? `series-view view-${anim}` : "series-view"}
    >
      {open ? (
        <SeriesPage
          state={state}
          series={open}
          act={act}
          actUndo={actUndo}
          onBack={() => {
            setAnim("back");
            setOpen(null);
          }}
        />
      ) : (
        <SeriesGrid
          state={state}
          onOpen={(series) => {
            const wall = document.querySelector<HTMLDivElement>(".series-wall");
            scroll.current = wall ? wall.scrollTop : 0;
            setAnim("in");
            setOpen(series);
          }}
          initialScroll={scroll.current}
        />
      )}
    </div>
  );
}

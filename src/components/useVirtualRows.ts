import { useCallback, useMemo, useState } from "react";

interface Windowed {
  start: number;
  end: number;
  padTop: number;
  padBottom: number;
  onScroll: (event: React.UIEvent<HTMLDivElement>) => void;
}

/**
 * Renders only the rows inside the viewport (plus overscan), so lists with
 * thousands of entries stay cheap. Row height must be fixed.
 */
export function useVirtualRows(
  count: number,
  rowHeight: number,
  viewport = 420,
  overscan = 8,
): Windowed {
  const [scrollTop, setScrollTop] = useState(0);

  const onScroll = useCallback((event: React.UIEvent<HTMLDivElement>) => {
    const next = event.currentTarget.scrollTop;
    requestAnimationFrame(() => setScrollTop(next));
  }, []);

  const { start, end } = useMemo(() => {
    const first = Math.max(0, Math.floor(scrollTop / rowHeight) - overscan);
    const visible = Math.ceil(viewport / rowHeight) + overscan * 2;
    return { start: first, end: Math.min(count, first + visible) };
  }, [scrollTop, rowHeight, viewport, overscan, count]);

  return {
    start,
    end,
    padTop: start * rowHeight,
    padBottom: Math.max(0, (count - end) * rowHeight),
    onScroll,
  };
}

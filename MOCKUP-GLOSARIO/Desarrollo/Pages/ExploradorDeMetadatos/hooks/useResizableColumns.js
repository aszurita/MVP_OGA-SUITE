import { useState, useRef, useEffect } from 'react';

export function useResizableColumns(defaults) {
  const [widths, setWidths] = useState(() => [...defaults]);
  const drag = useRef(null);

  useEffect(() => {
    setWidths([...defaults]);
  }, [defaults.join(',')]); // eslint-disable-line react-hooks/exhaustive-deps

  function startResize(e, i) {
    e.preventDefault();
    e.stopPropagation();
    const th = e.currentTarget.parentElement;
    const startX = e.clientX;
    const startW = th.getBoundingClientRect().width;
    drag.current = { i, startX, startW };

    function onMove(ev) {
      const d = drag.current;
      if (!d) return;
      const newW = Math.max(50, d.startW + (ev.clientX - d.startX));
      setWidths(prev => { const n = [...prev]; n[d.i] = newW; return n; });
    }
    function onUp() {
      drag.current = null;
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
    }
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
  }

  return { widths, startResize };
}

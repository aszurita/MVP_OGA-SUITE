import { useState, useRef, useEffect } from 'react';

export default function SegmentarDropdown({ servidores = [], activeServidor, onSelect }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const label = activeServidor || 'Segmentar Por Servidor';

  return (
    <div className="em-segmentar-wrap" ref={ref}>
      <button className="em-segmentar-btn" onClick={() => setOpen((v) => !v)} type="button">
        <span className="em-dot" />
        <span>{label}</span>
        <i className="simple-icon-arrow-down" style={{ fontSize: '0.7rem' }} />
      </button>
      {open && (
        <div className="em-segmentar-menu">
          <button
            className={!activeServidor ? 'active' : ''}
            onClick={() => { onSelect(null); setOpen(false); }}
          >
            TODOS
          </button>
          {servidores.map((s) => (
            <button
              key={s}
              className={activeServidor === s ? 'active' : ''}
              onClick={() => { onSelect(s); setOpen(false); }}
            >
              {s}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

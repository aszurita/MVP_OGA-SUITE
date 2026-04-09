import { useState, useRef, useEffect } from 'react';

const OPTIONS = [
  { value: 'tabla', label: 'Tabla' },
  { value: 'campo', label: 'Campo' },
];

export default function ViewModeDropdown({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selected = OPTIONS.find((o) => o.value === value) || OPTIONS[0];

  return (
    <div className={`em-view-dropdown ${open ? 'is-open' : ''}`} ref={ref}>
      <button
        className={`em-view-select ${open ? 'is-open' : ''}`}
        type="button"
        onClick={() => setOpen((v) => !v)}
      >
        <span>{selected.label}</span>
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
          <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </button>

      {open && (
        <div className="em-view-menu">
          {OPTIONS.filter((o) => o.value !== value).map((o) => (
            <button
              key={o.value}
              className="em-view-option"
              type="button"
              onClick={() => { onChange(o.value); setOpen(false); }}
            >
              {o.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

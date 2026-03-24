/**
 * FiltrarDropdown.jsx
 * Dropdown "Filtrar Por" — réplica del botón dropdown-btn del ASPX original.
 * Opciones: Dominio, Caso de uso, Todos.
 */
import React, { useState, useRef, useEffect } from 'react';

export default function FiltrarDropdown({ activeFiltro, onFiltrar }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function handleOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, []);

  const opciones = [
    { label: 'Dominio',      value: 'dominio' },
    { label: 'Caso de uso',  value: 'caso de uso' },
    { label: 'Todos',        value: 'todos' },
  ];

  function handleSelect(value) {
    onFiltrar(value);
    setOpen(false);
  }

  const labelActivo = activeFiltro && activeFiltro !== 'todos'
    ? opciones.find((o) => o.value === activeFiltro)?.label || 'Filtrar Por'
    : 'Filtrar Por';

  return (
    <div className="btn-slot" style={{ width: 'auto', position: 'relative' }} ref={ref}>
      <button
        className="btn btn-outline-dark btn-sm dropdown-toggle rounded-pill whitespace-nowrap btn-reveal btn-reveal-dropdown"
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        id="dropdown-btn"
        style={{ borderColor: activeFiltro && activeFiltro !== 'todos' ? '#D2006E' : undefined }}
      >
        {/* Icono filtro */}
        <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
        </svg>
        <span className="label">{labelActivo}</span>
      </button>

      {open && (
        <div className="dropdown-menu show" style={{ display: 'block', position: 'absolute', top: '100%', zIndex: 1000, minWidth: 160 }}>
          {opciones.map((op) => (
            <a
              key={op.value}
              className="dropdown-item"
              href="#"
              onClick={(e) => { e.preventDefault(); handleSelect(op.value); }}
              style={{ fontWeight: activeFiltro === op.value ? 700 : undefined, color: activeFiltro === op.value ? '#D2006E' : undefined }}
            >
              {op.label}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}

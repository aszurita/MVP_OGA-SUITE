/**
 * SegmentarDropdown.jsx
 * Dropdown "Segmentar Por" — réplica del botón segmentar-btn del ASPX original.
 * Incluye: Término, Atributos, Protección Datos Personales (submenú), Golden Record, AR, CDE, Todos.
 */
import React, { useState, useRef, useEffect } from 'react';

const OPCIONES_PRINCIPALES = [
  { label: 'Término',                             value: 'termino' },
  { label: 'Atributos',                           value: 'atributo' },
  { label: 'Protección Datos Personales',         value: '__submenu__', hasSubmenu: true },
  { divider: true },
  { label: 'Golden Record',                       value: 'Golden Record' },
  { label: '(AR) Atributo de Referencia',         value: '(AR) Atributo de Referencia' },
  { label: '(CDE) Elemento clave de datos',       value: '(CDE) Elemento clave de datos' },
  { label: 'Todos',                               value: 'todos' },
];

const SUBMENU_PDP = [
  { label: 'Datos Personales',                         value: 'datos personales' },
  { label: 'Datos Identificativos',                    value: 'pdp_datos_identificativos' },
  { label: 'Datos de características personales',     value: 'pdp_datos_caracteristicas' },
  { label: 'Datos de circunstancias sociales',         value: 'pdp_datos_circunstancias' },
  { label: 'Datos académicos y profesionales',         value: 'pdp_datos_academicos' },
  { label: 'Datos de empleo',                          value: 'pdp_datos_empleo' },
  { label: 'Datos de información comercial',           value: 'pdp_datos_informacion' },
  { label: 'Categorías especiales de datos personales',value: 'pdp_categorias_especiales' },
  { label: 'Datos económicos, financieros y de seguros',value: 'pdp_datos_economicos' },
  { label: 'Datos de carácter digital',               value: 'pdp_datos_caracter' },
];

export default function SegmentarDropdown({ activeSegmento, onSegmentar }) {
  const [open,        setOpen]        = useState(false);
  const [submenuOpen, setSubmenuOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function handleOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
        setSubmenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, []);

  function handleSelect(value) {
    onSegmentar(value);
    setOpen(false);
    setSubmenuOpen(false);
  }

  const labelActivo = activeSegmento === 'todos'
    ? 'Segmentar Por'
    : OPCIONES_PRINCIPALES.find((o) => o.value === activeSegmento)?.label
      || SUBMENU_PDP.find((o) => o.value === activeSegmento)?.label
      || 'Segmentar Por';

  return (
    <div className="btn-group dropdown" ref={ref}>
      <button
        className="btn btn-outline btn-sm dropdown-toggle rounded-pill whitespace-nowrap btn-reveal-colors"
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="true"
        aria-expanded={open}
        id="segmentar-btn"
        style={{ borderColor: activeSegmento !== 'todos' ? '#D2006E' : undefined, color: activeSegmento !== 'todos' ? '#D2006E' : undefined }}
      >
        {labelActivo}
      </button>

      {open && (
        <div className="dropdown-menu show dropdown-menu-right" style={{ width: 260, display: 'block', position: 'absolute', top: '100%', zIndex: 1000 }}>
          {OPCIONES_PRINCIPALES.map((op, i) => {
            if (op.divider) return <div key={i} className="dropdown-divider" />;

            if (op.hasSubmenu) {
              return (
                <div key={i} style={{ position: 'relative' }}>
                  <a
                    className="dropdown-item d-flex align-items-center justify-content-between"
                    href="#"
                    onClick={(e) => { e.preventDefault(); setSubmenuOpen((v) => !v); }}
                  >
                    {op.label}
                    <i className="simple-icon-arrow-down" style={{ fontSize: '0.7rem' }} />
                  </a>
                  {submenuOpen && (
                    <div className="bg-light" style={{ paddingLeft: 8 }}>
                      {SUBMENU_PDP.map((sub) => (
                        <a
                          key={sub.value}
                          className="dropdown-item pl-4 py-1"
                          href="#"
                          style={{ fontSize: '0.85rem' }}
                          onClick={(e) => { e.preventDefault(); handleSelect(sub.value); }}
                        >
                          {sub.label}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              );
            }

            return (
              <a
                key={op.value}
                className="dropdown-item"
                href="#"
                onClick={(e) => { e.preventDefault(); handleSelect(op.value); }}
                style={{ fontWeight: activeSegmento === op.value ? 700 : undefined, color: activeSegmento === op.value ? '#D2006E' : undefined }}
              >
                {op.label}
              </a>
            );
          })}
        </div>
      )}
    </div>
  );
}

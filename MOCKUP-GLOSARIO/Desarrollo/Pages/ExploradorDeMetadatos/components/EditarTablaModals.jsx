/**
 * EditarTablaModals.jsx
 * Modales invocados desde el lápiz de la columna "Tabla" en vista tabla.
 * Exporta: DescripcionTablaModal, DataOwnerStewardModal,
 *          DimensionesCalidadModal, ClasificacionTablaModal
 */
import { useState, useEffect, useRef } from 'react';
import { getOwnerFacets } from '../../../services/metadataService.js';

/* ══════════════════════════════════════════════════════════════════════════
   1. EDITAR DEFINICIÓN DE TABLA
   ══════════════════════════════════════════════════════════════════════════ */
export function DescripcionTablaModal({ isOpen, row, onClose }) {
  const [descripcion, setDescripcion] = useState('');

  useEffect(() => {
    if (!isOpen) return;
    setDescripcion(row?.descripcion || '');
  }, [isOpen, row?.tabla]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!isOpen) return null;

  return (
    <div
      className="do-overlay dc-overlay"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="do-modal dc-modal">
        <div className="do-modal-header">
          <h5 className="do-modal-title">Editar definición de tabla</h5>
          <button className="do-close" type="button" onClick={onClose}>×</button>
        </div>
        <div className="do-modal-body dc-modal-body">
          <div className="form-group">
            <label className="dc-label">
              Definición de la tabla <strong>{row?.tabla}</strong>:
            </label>
            <textarea
              className="form-control dc-textarea"
              rows={4}
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
            />
          </div>
        </div>
        <div className="dc-modal-footer">
          <button type="button" className="dc-guardar-btn" onClick={onClose}>
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   2. EDITAR DATA OWNER / DATA STEWARD
   ══════════════════════════════════════════════════════════════════════════ */
export function DataOwnerStewardModal({ isOpen, row, type, onClose }) {
  const isOwner   = type === 'owner';
  const Label     = isOwner ? 'Data Owner'  : 'Data Steward';
  const fieldKey  = isOwner ? 'nombre_data_owner' : 'nombre_data_steward';
  const currentVal = row?.[fieldKey] || '';

  const [allNames, setAllNames]   = useState([]);
  const [inputText, setInputText] = useState('');
  const [selected, setSelected]   = useState('');
  const [showSug, setShowSug]     = useState(false);
  const [suggestions, setSugs]    = useState([]);
  const wrapRef = useRef(null);

  /* Cargar facetas al abrir */
  useEffect(() => {
    if (!isOpen) return;
    setInputText('');
    setSelected('');
    setShowSug(false);
    getOwnerFacets().then(({ owners, stewards }) => {
      setAllNames(isOwner ? owners : stewards);
    });
  }, [isOpen, type]); // eslint-disable-line react-hooks/exhaustive-deps

  /* Cerrar sugerencias al clic fuera */
  useEffect(() => {
    function handler(e) {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setShowSug(false);
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  /* Filtrar sugerencias */
  useEffect(() => {
    if (!inputText.trim()) { setSugs([]); setShowSug(false); return; }
    const q = inputText.toUpperCase();
    const matches = allNames.filter((n) => n.toUpperCase().includes(q)).slice(0, 8);
    setSugs(matches);
    setShowSug(matches.length > 0);
  }, [inputText, allNames]);

  if (!isOpen) return null;

  return (
    <div
      className="do-overlay do-overlay-sub"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="do-modal do-modal-sm">
        <div className="do-modal-header">
          <h5 className="do-modal-title">Editar {Label.toLowerCase()}</h5>
          <button className="do-close" type="button" onClick={onClose}>×</button>
        </div>
        <div className="do-modal-body">
          <p className="do-edit-current">
            {currentVal
              ? <>{Label} actual: <strong>{currentVal}</strong></>
              : `No existe ${Label} asignado a la tabla`}
          </p>

          <div className="do-edit-row">
            <span className="do-edit-label">Asignar {Label.toLowerCase()}:</span>
            <div className="do-autocomplete-wrap" ref={wrapRef} style={{ flex: 1 }}>
              <input
                type="text"
                className="do-input"
                placeholder={`Buscar ${Label}...`}
                value={inputText}
                autoComplete="off"
                onChange={(e) => { setInputText(e.target.value); setSelected(''); }}
              />
              {showSug && (
                <div className="do-suggestions">
                  {suggestions.map((s) => (
                    <button
                      key={s}
                      type="button"
                      className="do-suggestion-item"
                      onClick={() => { setSelected(s); setInputText(s); setShowSug(false); }}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="do-edit-actions">
            <button
              className="do-action-btn"
              type="button"
              disabled={!selected}
              onClick={onClose}
            >
              Solicitar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   3. DIMENSIONES DE CALIDAD
   ══════════════════════════════════════════════════════════════════════════ */
export function DimensionesCalidadModal({ isOpen, row, onClose }) {
  if (!isOpen) return null;

  return (
    <div
      className="do-overlay dq-overlay"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="do-modal dq-modal">
        <div className="do-modal-header">
          <h5 className="do-modal-title">Indicadores de calidad</h5>
          <button className="do-close" type="button" onClick={onClose}>×</button>
        </div>
        <div className="do-modal-body dq-modal-body">
          <div className="dq-layout">

            {/* Panel izquierdo */}
            <div className="dq-left">
              <button type="button" className="dq-detail-btn">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                  <polyline points="15 3 21 3 21 9" />
                  <line x1="10" y1="14" x2="21" y2="3" />
                </svg>
                Ver detalle de indicadores
              </button>
            </div>

            {/* Panel derecho */}
            <div className="dq-right">
              <div className="dq-context-header">
                <span className="dq-context-label">Seleccione un atributo</span>
                <button type="button" className="dq-guardar-todo-btn">Guardar Todo</button>
              </div>

              <div className="dq-context-meta">
                <div className="dq-meta-row">
                  <span>Plataforma: <strong>{row?.plataforma || '-'}</strong></span>
                  <span>Base: <strong>{row?.base || '-'}</strong></span>
                  <span>Campo: <strong>-</strong></span>
                  <span className="dq-doc-pct">Documentación: <strong>0%</strong></span>
                </div>
                <div className="dq-meta-row">
                  <span>Servidor: <strong>{row?.servidor || '-'}</strong></span>
                  <span>Esquema: <strong>{row?.esquema || '-'}</strong></span>
                  <span>Tabla: <strong>{row?.tabla || '-'}</strong></span>
                </div>
              </div>

              <div className="dq-table-wrap">
                <table className="dq-table">
                  <thead>
                    <tr>
                      <th>No aplica</th>
                      <th>Indicadores</th>
                      <th>id_dimension</th>
                      <th>Valor</th>
                      <th>Reglas</th>
                      <th>Usuario</th>
                      <th>Última modificación</th>
                      <th>Acción</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td colSpan={8} className="dq-table-empty">
                        Sin indicadores registrados
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   4. CLASIFICACIÓN DE TABLAS
   ══════════════════════════════════════════════════════════════════════════ */
const ETIQUETAS = [
  { value: 'Tabla Oficial',     label: 'Tabla Oficial'     },
  { value: 'Tabla de trabajo',  label: 'Tabla de trabajo'  },
  { value: 'Tabla en desuso',   label: 'Tabla en desuso'   },
];

const MEDALLONES = [
  { value: 'Bronce', label: 'Bronce' },
  { value: 'Plata',  label: 'Plata'  },
  { value: 'Oro',    label: 'Oro'    },
];

function ClsfDropdown({ options, value, onChange, placeholder = '' }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function handler(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div ref={ref} className="clsf-dropdown-wrap">
      <button
        type="button"
        className={`clsf-dropdown-trigger${open ? ' is-open' : ''}`}
        onClick={() => setOpen((v) => !v)}
      >
        <span>{value || placeholder}</span>
        <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
          <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </button>
      {open && (
        <div className="clsf-dropdown-menu">
          {options.map((opt) => (
            <button
              key={opt.value}
              type="button"
              className={`clsf-dropdown-item${value === opt.value ? ' is-selected' : ''}`}
              onClick={() => { onChange(opt.value); setOpen(false); }}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export function ClasificacionTablaModal({ isOpen, row, onClose }) {
  const [etiqueta,  setEtiqueta]  = useState('');
  const [medallon,  setMedallon]  = useState('');

  useEffect(() => {
    if (!isOpen) return;
    setEtiqueta(row?.clasificacion || '');
    setMedallon('');
  }, [isOpen, row?.tabla]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!isOpen) return null;

  return (
    <div
      className="do-overlay do-overlay-sub"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="do-modal clsf-modal">
        <div className="do-modal-header">
          <h5 className="do-modal-title">Clasificación de Tablas</h5>
          <button className="do-close" type="button" onClick={onClose}>×</button>
        </div>
        <div className="do-modal-body clsf-modal-body">
          <div className="clsf-card">
            <p className="clsf-etiquetar">
              Etiquetar tabla <strong>{row?.tabla}</strong>
            </p>

            <div className="clsf-field-row">
              <label className="clsf-field-label">Asignar etiqueta:</label>
              <ClsfDropdown
                options={ETIQUETAS}
                value={etiqueta}
                onChange={setEtiqueta}
              />
            </div>

            <div className="clsf-field-row">
              <label className="clsf-field-label">Clasificación medallón:</label>
              <ClsfDropdown
                options={MEDALLONES}
                value={medallon}
                onChange={setMedallon}
              />
            </div>
          </div>

          <div className="clsf-footer">
            <button
              type="button"
              className="clsf-solicitar-btn"
              onClick={onClose}
            >
              Solicitar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

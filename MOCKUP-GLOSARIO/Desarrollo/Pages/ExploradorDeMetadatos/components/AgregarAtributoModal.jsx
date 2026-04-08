/**
 * AgregarAtributoModal.jsx
 * Modal para agregar un nuevo atributo al glosario desde el Explorador de Metadatos.
 * Carga dominios y subdominios (casos de uso) desde los servicios correspondientes.
 * Dominio y Subdominio son multi-select; al cambiar dominio se filtran los subdominios disponibles.
 */
import { useState, useEffect, useRef } from 'react';
import { getDominios } from '../../../services/dominiosService.js';
import { getCasosUso, crearNuevoTermino } from '../../../services/terminosService.js';

/* ─── Opciones estáticas ──────────────────────────────────────────────────── */
const TIPOS_ATRIBUTO = [
  { value: '(CDE) Elemento clave de datos',   label: '(CDE) Elemento clave de datos'   },
  { value: '(AR) Atributo de Referencia',      label: '(AR) Atributo de Referencia'      },
  { value: 'Impacto en procesos',              label: 'Impacto en procesos'              },
  { value: 'Impacto en negocio / reputacional',label: 'Impacto en negocio / reputacional'},
  { value: 'Impacto económico',                label: 'Impacto económico'                },
  { value: 'Impacto regulatorio',              label: 'Impacto regulatorio'              },
];

/* ─── MultiSelectDropdown ─────────────────────────────────────────────────── */
function MultiSelectDropdown({ options, value, onChange, placeholder = 'Seleccione una o más opciones', disabled = false }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function handler(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  function toggle(val) {
    if (value.includes(val)) {
      onChange(value.filter((v) => v !== val));
    } else {
      onChange([...value, val]);
    }
  }

  function removeTag(e, val) {
    e.stopPropagation();
    onChange(value.filter((v) => v !== val));
  }

  return (
    <div ref={ref} className={`aa-multiselect${disabled ? ' is-disabled' : ''}`}>
      <div
        className={`aa-multiselect-trigger${open ? ' is-open' : ''}`}
        onClick={() => { if (!disabled) setOpen((v) => !v); }}
      >
        {value.length === 0 ? (
          <span className="aa-multiselect-placeholder">{placeholder}</span>
        ) : (
          <div className="aa-multiselect-tags">
            {value.map((val) => {
              const opt = options.find((o) => o.value === val);
              return (
                <span key={val} className="aa-tag">
                  × {opt ? opt.label : val}
                  <button type="button" className="aa-tag-remove" onClick={(e) => removeTag(e, val)}>×</button>
                </span>
              );
            })}
          </div>
        )}
        <svg className="aa-caret" width="10" height="10" viewBox="0 0 12 12" fill="none">
          <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </div>

      {open && (
        <div className="aa-multiselect-dropdown">
          {options.length === 0 ? (
            <div className="aa-multiselect-empty">Sin opciones disponibles</div>
          ) : (
            options.map((opt) => (
              <button
                key={opt.value}
                type="button"
                className={`aa-multiselect-option${value.includes(opt.value) ? ' is-selected' : ''}`}
                onClick={() => toggle(opt.value)}
              >
                {opt.label}
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}

/* ─── Modal principal ─────────────────────────────────────────────────────── */
export default function AgregarAtributoModal({ isOpen, onClose, onCreated }) {
  const [tipo, setTipo]               = useState('Atributo');
  const [idAtrib, setIdAtrib]         = useState('');
  const [nombre, setNombre]           = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [dominiosSel, setDominiosSel] = useState([]);
  const [subdomsSel, setSubdomsSel]   = useState([]);
  const [tiposAtrib, setTiposAtrib]   = useState([]);
  const [datoPersonal, setDatoPersonal] = useState('');
  const [goldenRecord, setGoldenRecord] = useState('');
  const [catalogos, setCatalogos]     = useState([]);

  const [allDominios, setAllDominios] = useState([]);
  const [allCasosUso, setAllCasosUso] = useState([]);
  const [guardando, setGuardando]     = useState(false);
  const [error, setError]             = useState('');

  /* Cargar datos y resetear al abrir */
  useEffect(() => {
    if (!isOpen) return;
    setTipo('Atributo');
    setIdAtrib('');
    setNombre('');
    setDescripcion('');
    setDominiosSel([]);
    setSubdomsSel([]);
    setTiposAtrib([]);
    setDatoPersonal('');
    setGoldenRecord('');
    setCatalogos([]);
    setError('');

    Promise.all([getDominios(), getCasosUso()]).then(([doms, casos]) => {
      setAllDominios(doms);
      setAllCasosUso(casos);
    });
  }, [isOpen]);

  /* Al cambiar dominios, limpiar subdominios que ya no aplican */
  useEffect(() => {
    if (dominiosSel.length === 0) return;
    const validDomIds = new Set(dominiosSel);
    setSubdomsSel((prev) =>
      prev.filter((v) => {
        const caso = allCasosUso.find((c) => String(c.id_caso_uso) === v);
        return caso && validDomIds.has(String(caso.id_dominio));
      })
    );
  }, [dominiosSel]); // eslint-disable-line react-hooks/exhaustive-deps

  /* Opciones de dominio */
  const dominioOptions = allDominios.map((d) => ({
    value: String(d.id_dominio),
    label: d.nombre_dominio,
  }));

  /* Opciones de subdominio — se filtra por los dominios seleccionados */
  const subdomOptions = (() => {
    const fuente = dominiosSel.length > 0
      ? allCasosUso.filter((c) => dominiosSel.includes(String(c.id_dominio)))
      : allCasosUso;

    /* Deduplicar por descripción y tomar solo los que tienen nombre */
    const seen = new Set();
    return fuente
      .filter((c) => c.descripcion_caso_uso)
      .filter((c) => {
        const key = c.descripcion_caso_uso.trim();
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      })
      .map((c) => ({
        value: String(c.id_caso_uso),
        label: c.descripcion_caso_uso,
      }));
  })();

  async function handleGuardar() {
    if (!nombre.trim()) { setError('El nombre del atributo es obligatorio.'); return; }

    setGuardando(true);
    setError('');
    try {
      const dominiosNombres = dominiosSel
        .map((v) => allDominios.find((d) => String(d.id_dominio) === v)?.nombre_dominio || v)
        .join('; ');

      const result = await crearNuevoTermino({
        tipo:                  tipo.toUpperCase().replace('Á', 'A').replace('É', 'E'),
        nombre:                nombre.trim(),
        descripcion,
        dominios:              dominiosNombres,
        casos_uso:             subdomsSel.join('; '),
        caracteristicas:       tiposAtrib.join('; '),
        dato_personal:         datoPersonal || null,
        golden_record:         goldenRecord === '1' ? 1 : 0,
        catalogos_asociados:   catalogos.join('; ') || null,
        etiqueta_tecnica:      idAtrib || null,
      }, 0);

      onCreated && onCreated({ id: result?.id ?? idAtrib, nombre: nombre.trim() });
    } catch (err) {
      setError('Error al guardar: ' + err.message);
    } finally {
      setGuardando(false);
    }
  }

  if (!isOpen) return null;

  return (
    <div
      className="do-overlay do-overlay-sub"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="do-modal aa-modal">

        {/* ── Header ── */}
        <div className="do-modal-header">
          <h5 className="do-modal-title">Agregar Atributo</h5>
          <button className="do-close" type="button" onClick={onClose}>×</button>
        </div>

        {/* ── Body ── */}
        <div className="do-modal-body aa-modal-body">
          {error && (
            <div className="alert alert-danger py-1 mb-3" style={{ fontSize: '0.85rem' }}>{error}</div>
          )}

          <div className="aa-form-grid">

            {/* Tipo | ID */}
            <div className="form-group aa-form-item">
              <label className="dc-label">Tipo:</label>
              <select className="form-control" value={tipo} onChange={(e) => setTipo(e.target.value)}>
                <option value="Atributo">Atributo</option>
                <option value="Termino">Término</option>
                <option value="Atributo/Termino">Atributo/Término</option>
              </select>
            </div>

            <div className="form-group aa-form-item">
              <label className="dc-label">ID:</label>
              <input
                type="text"
                className="form-control"
                value={idAtrib}
                onChange={(e) => setIdAtrib(e.target.value)}
              />
            </div>

            {/* Nombre | Descripción */}
            <div className="form-group aa-form-item">
              <label className="dc-label">Nombre Atributo:</label>
              <textarea
                className="form-control dc-textarea"
                rows={3}
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
              />
            </div>

            <div className="form-group aa-form-item">
              <label className="dc-label">Descripción Atributo:</label>
              <textarea
                className="form-control dc-textarea"
                rows={3}
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
              />
            </div>

            {/* Dominio | Subdominio */}
            <div className="form-group aa-form-item">
              <label className="dc-label">Dominio:</label>
              <MultiSelectDropdown
                options={dominioOptions}
                value={dominiosSel}
                onChange={setDominiosSel}
              />
            </div>

            <div className="form-group aa-form-item">
              <label className="dc-label">Subdominio:</label>
              <MultiSelectDropdown
                options={subdomOptions}
                value={subdomsSel}
                onChange={setSubdomsSel}
              />
            </div>

            {/* Subcategoría | Tipo de atributo */}
            <div className="form-group aa-form-item">
              <label className="dc-label">Subcategoría:</label>
              <input type="text" className="form-control aa-readonly" value="EN REVISIÓN" readOnly />
            </div>

            <div className="form-group aa-form-item">
              <label className="dc-label">Tipo de atributo:</label>
              <MultiSelectDropdown
                options={TIPOS_ATRIBUTO}
                value={tiposAtrib}
                onChange={setTiposAtrib}
              />
            </div>

            {/* Dato Personal | Golden Record */}
            <div className="form-group aa-form-item">
              <label className="dc-label">Dato Personal:</label>
              <select className="form-control" value={datoPersonal} onChange={(e) => setDatoPersonal(e.target.value)}>
                <option value="">&nbsp;</option>
                <option value="1">Sí</option>
                <option value="0">No</option>
              </select>
            </div>

            <div className="form-group aa-form-item">
              <label className="dc-label">Golden Record:</label>
              <select className="form-control" value={goldenRecord} onChange={(e) => setGoldenRecord(e.target.value)}>
                <option value="">&nbsp;</option>
                <option value="1">Sí</option>
                <option value="0">No</option>
              </select>
            </div>

            {/* Catálogos Asociados — ocupa ambas columnas */}
            <div className="form-group aa-form-item aa-form-full">
              <label className="dc-label">Catálogos Asociados:</label>
              <MultiSelectDropdown
                options={[]}
                value={catalogos}
                onChange={setCatalogos}
                placeholder="Selecci..."
              />
            </div>

          </div>
        </div>

        {/* ── Footer ── */}
        <div className="dc-modal-footer">
          <button
            type="button"
            className="dc-guardar-btn"
            onClick={handleGuardar}
            disabled={guardando}
          >
            {guardando
              ? <><span className="spinner-border spinner-border-sm mr-1" role="status" />Guardando...</>
              : 'Guardar'}
          </button>
        </div>

      </div>
    </div>
  );
}

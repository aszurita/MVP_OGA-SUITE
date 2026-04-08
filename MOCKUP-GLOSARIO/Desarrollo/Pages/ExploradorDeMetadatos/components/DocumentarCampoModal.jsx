/**
 * DocumentarCampoModal.jsx
 * Modal para documentar/editar un campo en vista-campo del Explorador de Metadatos.
 * Permite asignar una definición y vincular un atributo del glosario.
 * El botón "+" abre AgregarAtributoModal para crear un atributo nuevo.
 */
import { useState, useEffect, useRef } from 'react';
import { getTerminosAll } from '../../../services/terminosService.js';
import AgregarAtributoModal from './AgregarAtributoModal.jsx';

export default function DocumentarCampoModal({ isOpen, campo, onClose }) {
  const [definicion, setDefinicion]         = useState('');
  const [searchAtrib, setSearchAtrib]       = useState('');
  const [showDropdown, setShowDropdown]     = useState(false);
  const [allTerminos, setAllTerminos]       = useState([]);
  const [selectedAtributo, setSelectedAtributo] = useState(null);
  const [agregarOpen, setAgregarOpen]       = useState(false);
  const [loadingTerms, setLoadingTerms]     = useState(false);
  const dropRef = useRef(null);

  /* Cargar definición previa y términos del glosario cuando se abre */
  useEffect(() => {
    if (!isOpen) return;
    setDefinicion(campo?.definicion || '');
    setSearchAtrib(campo?.atributo ? `${campo.atributo}` : '');
    setSelectedAtributo(null);
    setLoadingTerms(true);
    getTerminosAll()
      .then((data) => setAllTerminos(data.todos || []))
      .finally(() => setLoadingTerms(false));
  }, [isOpen, campo?.campo]); // eslint-disable-line react-hooks/exhaustive-deps

  /* Cerrar el dropdown al hacer clic fuera */
  useEffect(() => {
    function handler(e) {
      if (dropRef.current && !dropRef.current.contains(e.target)) setShowDropdown(false);
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const filteredTerminos = allTerminos.filter((t) => {
    if (!searchAtrib.trim()) return true;
    const q = searchAtrib.toLowerCase();
    return (
      (t.nombre || '').toLowerCase().includes(q) ||
      String(t.id || '').includes(searchAtrib)
    );
  });

  function handleSelectAtributo(t) {
    setSelectedAtributo(t);
    setSearchAtrib(`${t.nombre} — [${t.id}]`);
    setShowDropdown(false);
  }

  function handleGuardar() {
    // En un entorno real se llamaría a la API para guardar
    onClose();
  }

  function handleAtribCreated(termino) {
    if (termino) {
      setAllTerminos((prev) => [termino, ...prev]);
      handleSelectAtributo(termino);
    }
    setAgregarOpen(false);
  }

  if (!isOpen) return null;

  return (
    <>
      <div
        className="do-overlay dc-overlay"
        onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      >
        <div className="do-modal dc-modal">

          {/* ── Header ── */}
          <div className="do-modal-header">
            <h5 className="do-modal-title">Documentar campo: {campo?.campo}</h5>
            <button className="do-close" type="button" onClick={onClose}>×</button>
          </div>

          {/* ── Body ── */}
          <div className="do-modal-body dc-modal-body">

            {/* Definición */}
            <div className="form-group">
              <label className="dc-label">Definición de campo (Explicación)</label>
              <textarea
                className="form-control dc-textarea"
                rows={4}
                value={definicion}
                onChange={(e) => setDefinicion(e.target.value)}
              />
            </div>

            {/* Asignar atributo */}
            <div className="form-group">
              <label className="dc-label">Asignar atributo</label>
              <div className="dc-atrib-wrap" ref={dropRef}>
                <input
                  type="text"
                  className="form-control dc-atrib-input"
                  placeholder={loadingTerms ? 'Cargando atributos...' : 'Buscar atributo del glosario...'}
                  value={searchAtrib}
                  autoComplete="off"
                  onChange={(e) => { setSearchAtrib(e.target.value); setShowDropdown(true); }}
                  onFocus={() => setShowDropdown(true)}
                />
                {showDropdown && filteredTerminos.length > 0 && (
                  <div className="dc-atrib-dropdown">
                    {filteredTerminos.map((t) => (
                      <button
                        key={t.id}
                        type="button"
                        className="dc-atrib-item"
                        onClick={() => handleSelectAtributo(t)}
                      >
                        {t.nombre} — [{t.id}]
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Botón + para agregar atributo nuevo */}
            <button
              type="button"
              className="dc-plus-btn"
              title="Agregar nuevo atributo al glosario"
              onClick={() => setAgregarOpen(true)}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" width="14" height="14">
                <path d="M12 5v14M5 12h14" />
              </svg>
            </button>
          </div>

          {/* ── Footer ── */}
          <div className="dc-modal-footer">
            <button
              type="button"
              className="dc-guardar-btn"
              onClick={handleGuardar}
            >
              Guardar
            </button>
          </div>
        </div>
      </div>

      {/* Sub-modal: Agregar Atributo */}
      {agregarOpen && (
        <AgregarAtributoModal
          isOpen={agregarOpen}
          onClose={() => setAgregarOpen(false)}
          onCreated={handleAtribCreated}
        />
      )}
    </>
  );
}

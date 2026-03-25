/**
 * ModalNuevoTermino.jsx
 * Modal "Agregar Término" — réplica fiel del #modalAtributo del Glosario.aspx.
 * Secciones: Identidad, Ubicación (Dominio/Subdominio), Características, Catálogos.
 * Llama a crearNuevoTermino() via terminosService.
 */
import React, { useState } from 'react';
import { crearNuevoTermino } from '../../../services/terminosService.js';

export default function ModalNuevoTermino({ show, onClose, dominiosMapa, dicCasosUso, onCreated }) {
  const [guardando,  setGuardando]  = useState(false);
  const [error,      setError]      = useState('');

  // Campos del formulario — idénticos a los del ASPX
  const [tipo,           setTipo]           = useState('ATRIBUTO');
  const [nombre,         setNombre]         = useState('');
  const [descripcion,    setDescripcion]    = useState('');
  const [dominios,       setDominios]       = useState([]);
  const [casosUso,       setCasosUso]       = useState([]);
  const [caracteristicas,setCaracteristicas]= useState([]);
  const [datoPersonal,   setDatoPersonal]   = useState('');
  const [goldenRecord,   setGoldenRecord]   = useState('');
  const [prioridad,      setPrioridad]      = useState('');

  const allDominios  = Array.from(dominiosMapa.keys());
  const allCasosUso  = Object.entries(dicCasosUso);

  const TIPOS_ATRIBUTO = [
    '(CDE) Elemento clave de datos',
    '(AR) Atributo de Referencia',
    'Impacto en procesos',
    'Impacto en negocio / reputacional',
    'Impacto económico',
    'Impacto regulatorio',
  ];

  function resetForm() {
    setTipo('ATRIBUTO'); setNombre(''); setDescripcion('');
    setDominios([]); setCasosUso([]); setCaracteristicas([]);
    setDatoPersonal(''); setGoldenRecord(''); setPrioridad('');
    setError('');
  }

  async function handleGuardar() {
    if (!nombre.trim()) { setError('El nombre es obligatorio.'); return; }

    setGuardando(true);
    setError('');
    try {
      await crearNuevoTermino({
        tipo,
        nombre:         nombre.trim(),
        descripcion,
        dominios:       dominios.join('; '),
        casos_uso:      casosUso.join('; '),
        caracteristicas:caracteristicas.join('; '),
        dato_personal:  datoPersonal || null,
        golden_record:  goldenRecord === '1' ? 1 : 0,
        prioridad:      prioridad ? Number(prioridad) : null,
      }, 0);

      resetForm();
      onCreated && onCreated();
      onClose();
    } catch (err) {
      setError('Error al guardar: ' + err.message);
    } finally {
      setGuardando(false);
    }
  }

  if (!show) return null;

  return (
    <div
      className="modal fade show"
      style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}
      role="dialog"
      aria-hidden="false"
    >
      <div className="modal-dialog" role="document" style={{ maxWidth: 960 }}>
        <div className="modal-content" style={{ maxHeight: '82vh', display: 'flex', flexDirection: 'column' }}>

          {/* Header */}
          <div className="modal-header pb-3 pt-3">
            <h5 className="modal-title">Agregar Término</h5>
            <button type="button" className="close" onClick={() => { resetForm(); onClose(); }} aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>

          {/* Body */}
          <div className="modal-body" style={{ flex: '1 1 auto', overflowY: 'auto' }}>
            {error && <div className="alert alert-danger py-1" style={{ fontSize: '0.85rem' }}>{error}</div>}

            <form className="attr-form" style={{ padding: '4px 8px' }}>
              <div className="attr-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 12 }}>

                {/* Identidad */}
                <div className="attr-card" style={{ border: '1px solid #e5e7eb', borderRadius: 12, padding: '12px 12px 8px', background: '#fff', boxShadow: '0 6px 18px rgba(0,0,0,.06)' }}>
                  <div className="attr-card__header d-flex align-items-center mb-2" style={{ gap: 8, fontWeight: 700 }}>
                    <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#d1006c', display: 'inline-block' }} />
                    <strong>Identidad</strong>
                  </div>
                  <div className="form-group">
                    <label className="col-form-label" style={{ fontSize: '0.82rem', fontWeight: 600 }}>Tipo</label>
                    <select className="form-control" value={tipo} onChange={(e) => setTipo(e.target.value)}>
                      <option value="ATRIBUTO">Atributo</option>
                      <option value="TERMINO">Término</option>
                      <option value="ATRIBUTO/TERMINO">Atributo/Término</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="col-form-label" style={{ fontSize: '0.82rem', fontWeight: 600 }}>Nombre del término</label>
                    <textarea className="form-control" rows={2} placeholder="Nombre corto y claro" value={nombre} onChange={(e) => setNombre(e.target.value)} />
                  </div>
                  <div className="form-group mb-0">
                    <label className="col-form-label" style={{ fontSize: '0.82rem', fontWeight: 600 }}>Descripción</label>
                    <textarea className="form-control" rows={3} placeholder="Explica el significado funcional" value={descripcion} onChange={(e) => setDescripcion(e.target.value)} />
                  </div>
                </div>

                {/* Ubicación */}
                <div className="attr-card" style={{ border: '1px solid #e5e7eb', borderRadius: 12, padding: '12px 12px 8px', background: '#fff', boxShadow: '0 6px 18px rgba(0,0,0,.06)' }}>
                  <div className="attr-card__header d-flex align-items-center mb-2" style={{ gap: 8, fontWeight: 700 }}>
                    <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#2563eb', display: 'inline-block' }} />
                    <strong>Ubicación</strong>
                  </div>
                  <div className="form-group">
                    <label className="col-form-label" style={{ fontSize: '0.82rem', fontWeight: 600 }}>Dominio</label>
                    <select
                      className="form-control"
                      multiple
                      value={dominios}
                      onChange={(e) => setDominios(Array.from(e.target.selectedOptions, (o) => o.value))}
                      size={Math.min(5, allDominios.length || 3)}
                    >
                      {allDominios.map((d) => <option key={d} value={d}>{d}</option>)}
                    </select>
                  </div>
                  <div className="form-group mb-0">
                    <label className="col-form-label" style={{ fontSize: '0.82rem', fontWeight: 600 }}>Caso de Uso</label>
                    <select
                      className="form-control"
                      multiple
                      value={casosUso}
                      onChange={(e) => setCasosUso(Array.from(e.target.selectedOptions, (o) => o.value))}
                      size={Math.min(5, allCasosUso.length || 3)}
                    >
                      {allCasosUso.map(([id, nombre]) => <option key={id} value={id}>{nombre}</option>)}
                    </select>
                  </div>
                </div>

                {/* Características */}
                <div className="attr-card" style={{ border: '1px solid #e5e7eb', borderRadius: 12, padding: '12px 12px 8px', background: '#fff', boxShadow: '0 6px 18px rgba(0,0,0,.06)' }}>
                  <div className="attr-card__header d-flex align-items-center mb-2" style={{ gap: 8, fontWeight: 700 }}>
                    <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#0f766e', display: 'inline-block' }} />
                    <strong>Características</strong>
                  </div>
                  <div className="form-group">
                    <label className="col-form-label" style={{ fontSize: '0.82rem', fontWeight: 600 }}>Tipo de atributo</label>
                    <select
                      className="form-control"
                      multiple
                      value={caracteristicas}
                      onChange={(e) => setCaracteristicas(Array.from(e.target.selectedOptions, (o) => o.value))}
                      size={4}
                    >
                      {TIPOS_ATRIBUTO.map((t) => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                  <div className="form-row">
                    <div className="form-group col-md-6">
                      <label className="col-form-label" style={{ fontSize: '0.82rem', fontWeight: 600 }}>Dato Personal</label>
                      <select className="form-control" value={datoPersonal} onChange={(e) => setDatoPersonal(e.target.value)}>
                        <option value="">&nbsp;</option>
                        <option value="1">Sí</option>
                        <option value="0">No</option>
                      </select>
                    </div>
                    <div className="form-group col-md-6">
                      <label className="col-form-label" style={{ fontSize: '0.82rem', fontWeight: 600 }}>Golden Record</label>
                      <select className="form-control" value={goldenRecord} onChange={(e) => setGoldenRecord(e.target.value)}>
                        <option value="">&nbsp;</option>
                        <option value="1">Sí</option>
                        <option value="0">No</option>
                      </select>
                    </div>
                  </div>
                  <div className="form-group mb-0">
                    <label className="col-form-label" style={{ fontSize: '0.82rem', fontWeight: 600 }}>Prioridad glosario</label>
                    <input
                      type="number"
                      min={1}
                      className="form-control"
                      placeholder="1, 2, 3..."
                      value={prioridad}
                      onChange={(e) => setPrioridad(e.target.value)}
                    />
                  </div>
                </div>

              </div>
            </form>
          </div>

          {/* Footer */}
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={() => { resetForm(); onClose(); }}>
              Cancelar
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleGuardar}
              disabled={guardando}
            >
              {guardando ? (
                <><span className="spinner-border spinner-border-sm mr-1" />Guardando...</>
              ) : 'Guardar'}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}

/**
 * ModalCasoUso.jsx
 * Modal de 4 pestañas para ver/editar un caso de uso.
 *
 * Props:
 *   caso       — objeto con todos los campos del caso de uso
 *   onClose    — función para cerrar el modal
 *   dominioId  — id del dominio (para contexto)
 */
import { useState, useEffect } from 'react';
import {
  getFuentesByCasoUso,
  getTerminosByCasoUso,
} from '../../../services/dominiosService.js';
import '../../FichaDominio/styles/FichaDominio.css';

const TABS = [
  { key: 1, label: 'Información'   },
  { key: 2, label: 'Responsables'  },
  { key: 3, label: 'Fuentes'       },
  { key: 4, label: 'Términos'      },
];

const ESTADOS = ['INGRESADO', 'EN PROCESO', 'EN CALIDAD', 'CERRADO'];
const TIPOS_INICIATIVA = ['BAU', 'Proyecto'];

function TabStepper({ active, onTabChange }) {
  return (
    <div style={{ display: 'flex', gap: 0, borderBottom: '1px solid #dee2e6', marginBottom: 20 }}>
      {TABS.map((t) => (
        <button
          key={t.key}
          onClick={() => onTabChange(t.key)}
          style={{
            padding: '8px 20px',
            background: 'none',
            border: 'none',
            borderBottom: active === t.key ? '3px solid #D2006E' : '3px solid transparent',
            color: active === t.key ? '#D2006E' : '#495057',
            fontWeight: active === t.key ? 700 : 400,
            fontSize: '0.82rem',
            cursor: 'pointer',
            whiteSpace: 'nowrap',
          }}
        >
          <span style={{
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            width: 20, height: 20, borderRadius: '50%',
            background: active === t.key ? '#D2006E' : '#dee2e6',
            color: active === t.key ? '#fff' : '#495057',
            fontSize: '0.7rem', fontWeight: 700, marginRight: 6,
          }}>
            {t.key}
          </span>
          {t.label}
        </button>
      ))}
    </div>
  );
}

export default function ModalCasoUso({ caso, onClose, dominioId }) {
  const [activeTab,  setActiveTab]  = useState(1);
  const [fuentes,    setFuentes]    = useState([]);
  const [terminos,   setTerminos]   = useState([]);
  const [loadingFuentes,  setLoadingFuentes]  = useState(false);
  const [loadingTerminos, setLoadingTerminos] = useState(false);

  // Estado local de edición (sólo visual en este MVP)
  const [formData, setFormData] = useState({
    descripcion_caso_uso: caso?.descripcion_caso_uso || '',
    estado:               caso?.estado || 'INGRESADO',
    activo:               caso?.activo === 1 || caso?.activo === '1' ? 'si' : 'no',
    tipo_iniciativa:      caso?.tipo_iniciativa || 'BAU',
    detalle:              caso?.detalle || '',
    entregable:           caso?.entregable || '',
  });

  // Búsqueda rápida fuentes (tab 3)
  const [fuenteSearch,  setFuenteSearch]  = useState('');
  const [terminoSearch, setTerminoSearch] = useState('');
  const [terminoAssign, setTerminoAssign] = useState('');

  useEffect(() => {
    if (!caso?.id_caso_uso) return;
    // Cargar fuentes
    setLoadingFuentes(true);
    getFuentesByCasoUso(caso.id_caso_uso)
      .then(setFuentes)
      .catch(() => {})
      .finally(() => setLoadingFuentes(false));

    // Cargar términos
    setLoadingTerminos(true);
    getTerminosByCasoUso(caso.id_caso_uso)
      .then(setTerminos)
      .catch(() => {})
      .finally(() => setLoadingTerminos(false));
  }, [caso?.id_caso_uso]);

  if (!caso) return null;

  function handleChange(field, value) {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }

  // ── RENDER TABS ──────────────────────────────────────────────────────────────

  function renderTab1() {
    return (
      <div>
        <div className="form-group">
          <label style={{ fontSize: '0.8rem', fontWeight: 600 }}>Descripción del caso de uso</label>
          <input
            className="form-control form-control-sm"
            value={formData.descripcion_caso_uso}
            onChange={(e) => handleChange('descripcion_caso_uso', e.target.value)}
          />
        </div>
        <div className="form-row">
          <div className="form-group col-md-4">
            <label style={{ fontSize: '0.8rem', fontWeight: 600 }}>Estado</label>
            <select
              className="form-control form-control-sm"
              value={formData.estado}
              onChange={(e) => handleChange('estado', e.target.value)}
            >
              {ESTADOS.map((e) => <option key={e}>{e}</option>)}
            </select>
          </div>
          <div className="form-group col-md-4">
            <label style={{ fontSize: '0.8rem', fontWeight: 600 }}>Activo</label>
            <select
              className="form-control form-control-sm"
              value={formData.activo}
              onChange={(e) => handleChange('activo', e.target.value)}
            >
              <option value="si">Sí</option>
              <option value="no">No</option>
            </select>
          </div>
          <div className="form-group col-md-4">
            <label style={{ fontSize: '0.8rem', fontWeight: 600 }}>Tipo de iniciativa</label>
            <select
              className="form-control form-control-sm"
              value={formData.tipo_iniciativa}
              onChange={(e) => handleChange('tipo_iniciativa', e.target.value)}
            >
              {TIPOS_INICIATIVA.map((t) => <option key={t}>{t}</option>)}
            </select>
          </div>
        </div>
        <div className="form-group">
          <label style={{ fontSize: '0.8rem', fontWeight: 600 }}>Detalle del Caso de Uso</label>
          <textarea
            className="form-control form-control-sm"
            rows={4}
            value={formData.detalle}
            onChange={(e) => handleChange('detalle', e.target.value)}
          />
        </div>
        <div className="form-group">
          <label style={{ fontSize: '0.8rem', fontWeight: 600 }}>Entregable del Caso de Uso</label>
          <textarea
            className="form-control form-control-sm"
            rows={3}
            value={formData.entregable}
            onChange={(e) => handleChange('entregable', e.target.value)}
          />
        </div>
        <div className="form-row">
          <div className="form-group col-md-6">
            <label style={{ fontSize: '0.8rem', fontWeight: 600 }}>Dominio</label>
            <input className="form-control form-control-sm" value={caso.id_dominio || ''} readOnly />
          </div>
          <div className="form-group col-md-6">
            <label style={{ fontSize: '0.8rem', fontWeight: 600 }}>Subdominio</label>
            <input className="form-control form-control-sm" value={caso.subdominio || ''} readOnly />
          </div>
        </div>
      </div>
    );
  }

  function renderTab2() {
    return (
      <div>
        <div className="form-row">
          <div className="form-group col-md-4">
            <label style={{ fontSize: '0.8rem', fontWeight: 600 }}>Especialista</label>
            <input className="form-control form-control-sm" value={caso.especialista || ''} readOnly />
          </div>
          <div className="form-group col-md-4">
            <label style={{ fontSize: '0.8rem', fontWeight: 600 }}>Sponsor</label>
            <input className="form-control form-control-sm" value={caso.sponsor || ''} readOnly />
          </div>
          <div className="form-group col-md-4">
            <label style={{ fontSize: '0.8rem', fontWeight: 600 }}>Ingeniero Responsable</label>
            <input className="form-control form-control-sm" value={caso.ingeniero_responsable || ''} readOnly />
          </div>
        </div>

        <h6 style={{ marginTop: 16, fontWeight: 700, fontSize: '0.85rem' }}>Estructura de Dominio</h6>
        <div className="d-flex" style={{ gap: 10, marginBottom: 12 }}>
          <input className="form-control form-control-sm" placeholder="Buscar empleado..." style={{ flex: 1 }} />
          <select className="form-control form-control-sm" style={{ width: 200 }}>
            <option>Lider de Dominio</option>
            <option>Custodio de Datos</option>
            <option>Oficial de Seguridad</option>
            <option>Administrador de Dominio</option>
          </select>
          <button className="btn btn-sm" style={{ background: '#D2006E', color: '#fff', borderRadius: 6 }}>
            <i className="simple-icon-plus" />
          </button>
        </div>

        <div style={{ fontSize: '0.8rem', color: '#6c757d', marginTop: 8 }}>
          Responsables agregados (0)
        </div>
        <div className="text-muted" style={{ fontSize: '0.78rem', marginTop: 4 }}>
          No hay responsables adicionales agregados.
        </div>
      </div>
    );
  }

  function renderTab3() {
    const fuentesFiltradas = fuentes.filter((f) => {
      if (!fuenteSearch.trim()) return true;
      const q = fuenteSearch.toLowerCase();
      return (
        (f.servidor    || '').toLowerCase().includes(q) ||
        (f.base_datos  || '').toLowerCase().includes(q) ||
        (f.esquema     || '').toLowerCase().includes(q) ||
        (f.tabla       || '').toLowerCase().includes(q)
      );
    });

    return (
      <div>
        <div className="d-flex" style={{ gap: 10, marginBottom: 16 }}>
          <input
            className="form-control form-control-sm"
            placeholder="Búsqueda rápida (min. 4 caracteres)..."
            value={fuenteSearch}
            onChange={(e) => setFuenteSearch(e.target.value)}
            style={{ flex: 1 }}
          />
          <button className="btn btn-sm" style={{ background: '#D2006E', color: '#fff', borderRadius: 6, fontWeight: 600 }}>
            Agregar
          </button>
        </div>

        <div className="form-row mb-3">
          {['Servidor', 'Base', 'Esquema', 'Tabla'].map((lbl) => (
            <div key={lbl} className="form-group col">
              <label style={{ fontSize: '0.72rem', fontWeight: 600 }}>{lbl}</label>
              <select className="form-control form-control-sm">
                <option value="">Todos</option>
              </select>
            </div>
          ))}
        </div>

        <div style={{ fontWeight: 700, fontSize: '0.82rem', marginBottom: 8 }}>
          Fuentes agregadas ({loadingFuentes ? '...' : fuentesFiltradas.length})
        </div>

        {loadingFuentes ? (
          <div className="text-muted" style={{ fontSize: '0.78rem' }}>Cargando...</div>
        ) : fuentesFiltradas.length === 0 ? (
          <div className="text-muted" style={{ fontSize: '0.78rem' }}>Sin fuentes registradas.</div>
        ) : (
          fuentesFiltradas.map((f, idx) => {
            const path = [f.servidor, f.base_datos, f.esquema, f.tabla].filter(Boolean).join('.');
            return (
              <div key={f.id_fuente || idx} className="d-flex align-items-center justify-content-between" style={{ padding: '6px 0', borderBottom: '1px solid #f0f0f0', fontSize: '0.8rem' }}>
                <span><i className="iconsminds-data-storage mr-2" style={{ color: '#D2006E' }} />{path}</span>
                <button className="btn btn-sm" style={{ color: '#adb5bd', background: 'none', border: 'none' }} title="Eliminar">
                  <i className="simple-icon-trash" />
                </button>
              </div>
            );
          })
        )}
      </div>
    );
  }

  function renderTab4() {
    const terminosFiltrados = terminos.filter((t) => {
      if (!terminoSearch.trim()) return true;
      const q = terminoSearch.toLowerCase();
      return (
        (t.nombre      || '').toLowerCase().includes(q) ||
        (t.descripcion || '').toLowerCase().includes(q)
      );
    });

    return (
      <div>
        {/* Asignar términos existentes */}
        <div style={{ background: '#f8f9fa', borderRadius: 8, padding: 14, marginBottom: 16 }}>
          <h6 style={{ fontWeight: 700, fontSize: '0.85rem', marginBottom: 8 }}>Asignar Términos Existentes</h6>
          <div className="d-flex" style={{ gap: 10 }}>
            <input
              className="form-control form-control-sm"
              placeholder="Buscar término del glosario..."
              value={terminoAssign}
              onChange={(e) => setTerminoAssign(e.target.value)}
              style={{ flex: 1 }}
            />
            <button className="btn btn-sm" style={{ background: '#D2006E', color: '#fff', borderRadius: 6, fontWeight: 600 }}>
              Vincular
            </button>
          </div>
          <small className="text-muted" style={{ fontSize: '0.72rem', marginTop: 6, display: 'block' }}>
            Busca y selecciona uno o más términos del glosario para vincularlos a este caso de uso.
          </small>
        </div>

        {/* Términos asociados */}
        <div className="d-flex align-items-center justify-content-between mb-2">
          <span style={{ fontWeight: 700, fontSize: '0.82rem' }}>
            Términos Asociados ({loadingTerminos ? '...' : terminos.length})
            <button className="btn btn-sm ml-2" style={{ color: '#6c757d', background: 'none', border: 'none', padding: '0 4px' }} title="Refrescar">
              <i className="simple-icon-refresh" />
            </button>
          </span>
          <button className="btn btn-sm" style={{ background: '#D2006E', color: '#fff', borderRadius: 6, fontWeight: 600, fontSize: '0.75rem' }}>
            <i className="simple-icon-plus mr-1" />
            Crear nuevo Término
          </button>
        </div>

        <input
          className="form-control form-control-sm mb-2"
          placeholder="Buscar en términos asociados..."
          value={terminoSearch}
          onChange={(e) => setTerminoSearch(e.target.value)}
          style={{ borderRadius: 20 }}
        />

        {loadingTerminos ? (
          <div className="text-muted" style={{ fontSize: '0.78rem' }}>Cargando...</div>
        ) : terminosFiltrados.length === 0 ? (
          <div className="text-muted" style={{ fontSize: '0.78rem' }}>Sin términos vinculados.</div>
        ) : (
          terminosFiltrados.map((t, idx) => (
            <div key={t.id || idx} style={{ borderBottom: '1px solid #f0f0f0', padding: '10px 0' }}>
              <div className="d-flex align-items-start justify-content-between">
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: '0.82rem', color: '#2d2d2d' }}>{t.nombre}</div>
                  <div style={{ fontSize: '0.75rem', color: '#6c757d', marginTop: 2 }}>{t.descripcion || '—'}</div>
                </div>
                <div className="d-flex" style={{ gap: 4 }}>
                  <button className="btn btn-sm" style={{ color: '#6c757d', background: 'none', border: 'none', padding: '2px 6px' }} title="Editar">
                    <i className="simple-icon-pencil" />
                  </button>
                  <button className="btn btn-sm" style={{ color: '#adb5bd', background: 'none', border: 'none', padding: '2px 6px' }} title="Desvincular">
                    <i className="simple-icon-trash" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    );
  }

  const tabContent = {
    1: renderTab1,
    2: renderTab2,
    3: renderTab3,
    4: renderTab4,
  };

  return (
    <>
      {/* Overlay */}
      <div
        style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 1040 }}
        onClick={onClose}
      />

      {/* Modal */}
      <div
        style={{
          position: 'fixed',
          top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          background: '#fff',
          borderRadius: 10,
          boxShadow: '0 8px 40px rgba(0,0,0,0.22)',
          zIndex: 1050,
          width: '90%',
          maxWidth: 760,
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Header */}
        <div style={{ padding: '16px 20px', borderBottom: '1px solid #dee2e6', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h5 style={{ margin: 0, fontWeight: 700, fontSize: '0.95rem', color: '#2d2d2d' }}>
              {caso.descripcion_caso_uso || 'Caso de Uso'}
            </h5>
            <small style={{ color: '#6c757d', fontSize: '0.75rem' }}>
              ID: {caso.id_caso_uso} — {caso.subdominio || 'Sin subdominio'}
            </small>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', fontSize: '1.2rem', cursor: 'pointer', color: '#6c757d', padding: '0 8px' }}
            aria-label="Cerrar"
          >
            &times;
          </button>
        </div>

        {/* Body */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px' }}>
          <TabStepper active={activeTab} onTabChange={setActiveTab} />
          {(tabContent[activeTab] || tabContent[1])()}
        </div>

        {/* Footer */}
        <div style={{ padding: '12px 20px', borderTop: '1px solid #dee2e6', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button
            className="btn btn-sm"
            style={{ border: '1px solid #D2006E', color: '#D2006E', borderRadius: 6, background: 'transparent', fontWeight: 600 }}
          >
            <i className="iconsminds-newspaper mr-1" />
            Ver reporte
          </button>

          <div className="d-flex" style={{ gap: 8 }}>
            {activeTab > 1 && (
              <button
                className="btn btn-sm btn-outline-secondary"
                style={{ borderRadius: 6 }}
                onClick={() => setActiveTab((t) => t - 1)}
              >
                Anterior
              </button>
            )}
            {activeTab < 4 && (
              <button
                className="btn btn-sm"
                style={{ background: '#D2006E', color: '#fff', borderRadius: 6, fontWeight: 600 }}
                onClick={() => setActiveTab((t) => t + 1)}
              >
                Siguiente
              </button>
            )}
            {activeTab === 4 && (
              <button
                className="btn btn-sm"
                style={{ background: '#2e7d32', color: '#fff', borderRadius: 6, fontWeight: 600 }}
                onClick={onClose}
              >
                Finalizar
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

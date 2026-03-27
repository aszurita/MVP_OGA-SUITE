/**
 * DominioEstructura.jsx
 * Página de Estructura de personas de un dominio.
 * Route: /dominio-estructura/:id
 */
import { useState, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import {
  getDominioById,
  getEstructuraByDominio,
  getArtefactosByDominio,
  getTablasOficiales,
  getCasosUsoByDominio,
  getTerminosByDominio,
} from '../../services/dominiosService.js';
import DominioNavTabs from '../FichaDominio/components/DominioNavTabs.jsx';
import '../FichaDominio/styles/FichaDominio.css';

const ROLES = [
  { rol: 'Lider de Dominio',                        icon: 'iconsminds-crown',     label: 'Líder de Dominio' },
  { rol: 'Custodio de Datos',                        icon: 'iconsminds-shield',    label: 'Custodio de Datos' },
  { rol: 'Oficial de Seguridad de la Informacion',   icon: 'simple-icon-key',      label: 'Oficial de Seguridad de la Información' },
  { rol: 'Administrador de Dominio',                 icon: 'iconsminds-administrator', label: 'Administrador de Dominio' },
];

export default function DominioEstructura() {
  const { id } = useParams();

  const [dominio,     setDominio]     = useState(null);
  const [estructura,  setEstructura]  = useState([]);
  const [stats,       setStats]       = useState({ atributos: 0, terminos: 0, artefactos: 0, estructura: 0, tablas: 0, casosUso: 0 });
  const [loading,     setLoading]     = useState(true);
  const [error,       setError]       = useState(null);

  // UI state
  const [searchEmpleado, setSearchEmpleado] = useState('');
  const [rolSeleccionado, setRolSeleccionado] = useState(ROLES[0].rol);

  useEffect(() => {
    if (!id) return;
    async function fetchAll() {
      setLoading(true);
      setError(null);
      try {
        const dom = await getDominioById(id);
        setDominio(dom);

        const [estructuraData, artefactos, casosUso] = await Promise.all([
          getEstructuraByDominio(id),
          getArtefactosByDominio(id),
          getCasosUsoByDominio(id),
        ]);

        setEstructura(estructuraData);

        let atributos = 0, terminos = 0, tablas = 0;
        if (dom && dom.nombre_dominio) {
          const [attrs, terms, tablasData] = await Promise.all([
            getTerminosByDominio(dom.nombre_dominio, 'atributo'),
            getTerminosByDominio(dom.nombre_dominio, 'termino'),
            getTablasOficiales(dom.nombre_dominio),
          ]);
          atributos = attrs.length;
          terminos  = terms.length;
          tablas    = tablasData.length;
        }

        setStats({
          atributos,
          terminos,
          artefactos: artefactos.length,
          estructura: estructuraData.length,
          tablas,
          casosUso:   casosUso.length,
        });
      } catch (err) {
        console.error('[DominioEstructura]', err);
        setError('Error al cargar la estructura del dominio.');
      } finally {
        setLoading(false);
      }
    }
    fetchAll();
  }, [id]);

  // Agrupa por rol
  const porRol = useMemo(() => {
    const map = {};
    ROLES.forEach((r) => { map[r.rol] = []; });
    estructura.forEach((item) => {
      if (map[item.rol] !== undefined) {
        map[item.rol].push(item);
      }
    });
    return map;
  }, [estructura]);

  // Empleados filtrados para la lista de selección (simulado: solo los ya asignados)
  const empleadosFiltrados = useMemo(() => {
    if (!searchEmpleado.trim()) return estructura;
    const q = searchEmpleado.trim().toLowerCase();
    return estructura.filter((e) =>
      (e.nombre_empleado || '').toLowerCase().includes(q)
    );
  }, [estructura, searchEmpleado]);

  if (loading) {
    return (
      <div className="dominio-page-wrapper">
        <div className="dominio-spinner">
          <div className="spinner-border" style={{ color: '#D2006E' }} role="status">
            <span className="sr-only">Cargando...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dominio-page-wrapper">
        <div className="dominio-error">{error}</div>
      </div>
    );
  }

  return (
    <div className="dominio-page-wrapper">
      <DominioNavTabs dominio={dominio} stats={stats} dominioId={id} />

      <div style={{ padding: '20px 28px' }}>
        {/* Botón asignar integrantes */}
        <div className="d-flex align-items-center mb-3">
          <h5 style={{ margin: 0, marginRight: 16 }}>Estructura de Dominio</h5>
          <button
            className="btn btn-sm"
            style={{ background: '#D2006E', color: '#fff', borderRadius: 6, fontWeight: 600 }}
          >
            <i className="iconsminds-conference mr-1" />
            ASIGNAR INTEGRANTES
          </button>
        </div>

        <div className="estructura-layout" style={{ padding: 0 }}>
          {/* Panel izquierdo: lista de empleados */}
          <div className="estructura-empleados-panel">
            <h6>Empleados</h6>
            <input
              type="text"
              className="form-control form-control-sm mb-2"
              placeholder="Buscar empleado..."
              value={searchEmpleado}
              onChange={(e) => setSearchEmpleado(e.target.value)}
            />
            <div className="estructura-empleados-list">
              {empleadosFiltrados.length === 0 ? (
                <div className="text-muted" style={{ fontSize: '0.78rem' }}>Sin resultados</div>
              ) : (
                empleadosFiltrados.map((emp, i) => (
                  <div key={emp.id_estructura || i} className="estructura-empleado-item">
                    <i className="simple-icon-user mr-1" />
                    {emp.nombre_empleado}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Panel derecho: asignación y roles */}
          <div className="estructura-main">
            {/* Barra de agregar */}
            <div className="estructura-add-bar">
              <select
                className="form-control form-control-sm"
                value={rolSeleccionado}
                onChange={(e) => setRolSeleccionado(e.target.value)}
              >
                {ROLES.map((r) => (
                  <option key={r.rol} value={r.rol}>{r.label}</option>
                ))}
              </select>
              <button
                className="btn btn-sm"
                style={{ background: '#D2006E', color: '#fff', borderRadius: 6, fontWeight: 600, whiteSpace: 'nowrap' }}
              >
                <i className="simple-icon-plus mr-1" />
                Agregar
              </button>
            </div>

            {/* Secciones por rol */}
            {ROLES.map(({ rol, icon, label }) => {
              const miembros = porRol[rol] || [];
              return (
                <div key={rol} className="rol-section">
                  <div className="rol-section-header">
                    <i className={icon} />
                    <span>{label}</span>
                    <span className="badge badge-pill ml-2" style={{ background: '#fce4ec', color: '#D2006E', fontSize: '0.72rem' }}>
                      {miembros.length}
                    </span>
                  </div>
                  {miembros.length === 0 ? (
                    <div className="text-muted" style={{ fontSize: '0.78rem' }}>
                      Sin integrantes asignados
                    </div>
                  ) : (
                    miembros.map((m, idx) => (
                      <div key={m.id_estructura || idx} className="persona-numbered">
                        <span>
                          <span style={{ fontWeight: 600, color: '#D2006E', marginRight: 6 }}>{idx + 1}.</span>
                          {m.nombre_empleado}
                          {m.codigo_empleado && (
                            <small className="text-muted ml-2">({m.codigo_empleado})</small>
                          )}
                        </span>
                        <button
                          className="btn btn-sm"
                          style={{ color: '#adb5bd', padding: '0 6px', background: 'none', border: 'none', fontSize: '0.8rem' }}
                          title="Eliminar"
                          onClick={() => {/* futuro: eliminar de estructura */}}
                        >
                          <i className="simple-icon-close" />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

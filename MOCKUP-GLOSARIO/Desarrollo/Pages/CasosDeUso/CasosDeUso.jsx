/**
 * CasosDeUso.jsx
 * Página de Casos de Uso de un dominio.
 * Route: /casos-de-uso/:id
 */
import { useState, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import {
  getDominioById,
  getCasosUsoByDominio,
  getArtefactosByDominio,
  getEstructuraByDominio,
  getTablasOficiales,
  getTerminosByDominio,
} from '../../services/dominiosService.js';
import DominioNavTabs from '../FichaDominio/components/DominioNavTabs.jsx';
import ModalCasoUso   from './components/ModalCasoUso.jsx';
import '../FichaDominio/styles/FichaDominio.css';

function getStatusClass(estado) {
  const e = (estado || '').toLowerCase().replace(' ', '-');
  if (e === 'ingresado')  return 'ingresado';
  if (e === 'en-proceso' || e === 'en proceso') return 'en-proceso';
  if (e === 'en-calidad' || e === 'en calidad') return 'en-calidad';
  if (e === 'cerrado')    return 'cerrado';
  return 'ingresado';
}

export default function CasosDeUso() {
  const { id } = useParams();

  const [dominio,   setDominio]   = useState(null);
  const [casos,     setCasos]     = useState([]);
  const [stats,     setStats]     = useState({ atributos: 0, terminos: 0, artefactos: 0, estructura: 0, tablas: 0, casosUso: 0 });
  const [loading,   setLoading]   = useState(true);
  const [error,     setError]     = useState(null);

  const [search,          setSearch]          = useState('');
  const [subdominioActivo, setSubdominioActivo] = useState(null);
  const [casoSeleccionado, setCasoSeleccionado] = useState(null);

  useEffect(() => {
    if (!id) return;
    async function fetchAll() {
      setLoading(true);
      setError(null);
      try {
        const dom = await getDominioById(id);
        setDominio(dom);

        const [casosData, artefactos, estructura, casosUsoStats] = await Promise.all([
          getCasosUsoByDominio(id),
          getArtefactosByDominio(id),
          getEstructuraByDominio(id),
          getCasosUsoByDominio(id),
        ]);

        setCasos(casosData);

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
          artefactos:  artefactos.length,
          estructura:  estructura.length,
          tablas,
          casosUso:    casosData.length,
        });
      } catch (err) {
        console.error('[CasosDeUso]', err);
        setError('Error al cargar los casos de uso.');
      } finally {
        setLoading(false);
      }
    }
    fetchAll();
  }, [id]);

  // Agrupa casos por subdominio
  const subdominiosMapa = useMemo(() => {
    const map = new Map();
    casos.forEach((c) => {
      const sub = c.subdominio || 'Sin subdominio';
      if (!map.has(sub)) map.set(sub, []);
      map.get(sub).push(c);
    });
    return map;
  }, [casos]);

  const subdominios = Array.from(subdominiosMapa.keys());

  // Contadores por estado
  const contadores = useMemo(() => ({
    ingresado: casos.filter((c) => (c.estado || '').toUpperCase() === 'INGRESADO').length,
    enProceso: casos.filter((c) => (c.estado || '').toUpperCase() === 'EN PROCESO').length,
    enCalidad: casos.filter((c) => (c.estado || '').toUpperCase() === 'EN CALIDAD').length,
    cerrado:   casos.filter((c) => (c.estado || '').toUpperCase() === 'CERRADO').length,
  }), [casos]);

  // Casos del subdominio activo, filtrados por búsqueda
  const casosSubdominio = useMemo(() => {
    if (!subdominioActivo) return [];
    const lista = subdominiosMapa.get(subdominioActivo) || [];
    if (!search.trim()) return lista;
    const q = search.trim().toLowerCase();
    return lista.filter((c) =>
      (c.descripcion_caso_uso || '').toLowerCase().includes(q)
    );
  }, [subdominioActivo, subdominiosMapa, search]);

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

      <div className="casos-uso-container">
        {/* Barra superior */}
        <div className="casos-uso-topbar">
          <div className="d-flex align-items-center" style={{ gap: 10, flex: 1, flexWrap: 'wrap' }}>
            <input
              type="text"
              className="form-control form-control-sm"
              placeholder="Buscar caso de uso..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); }}
              style={{ maxWidth: 300, borderRadius: 20 }}
            />
            <button
              className="btn btn-sm"
              style={{ background: '#D2006E', color: '#fff', borderRadius: 6, fontWeight: 600 }}
            >
              <i className="simple-icon-plus mr-1" />
              Crear caso de uso
            </button>
          </div>

          {/* Contadores por estado */}
          <div className="casos-uso-counters">
            <span className="status-badge ingresado">
              Ingresados {contadores.ingresado}
            </span>
            <span className="status-badge en-proceso">
              En Proceso {contadores.enProceso}
            </span>
            <span className="status-badge en-calidad">
              En Calidad {contadores.enCalidad}
            </span>
            <span className="status-badge cerrado">
              Cerrados {contadores.cerrado}
            </span>
          </div>
        </div>

        {/* Vista de subdominios */}
        {!subdominioActivo ? (
          <div>
            <h5 style={{ fontWeight: 700, marginBottom: 14 }}>Subdominios</h5>
            {subdominios.length === 0 ? (
              <div className="text-muted" style={{ fontSize: '0.85rem' }}>
                No hay casos de uso registrados para este dominio.
              </div>
            ) : (
              subdominios.map((sub) => {
                const subCasos = subdominiosMapa.get(sub) || [];
                return (
                  <div
                    key={sub}
                    className="caso-uso-subdomain-card"
                    onClick={() => setSubdominioActivo(sub)}
                  >
                    <i className="iconsminds-books" />
                    <div>
                      <div className="sub-name">{sub}</div>
                      <div className="sub-count">{subCasos.length} caso(s)</div>
                    </div>
                    <i className="simple-icon-arrow-right ml-auto" style={{ color: '#adb5bd' }} />
                  </div>
                );
              })
            )}
          </div>
        ) : (
          <div>
            {/* Breadcrumb */}
            <div className="d-flex align-items-center mb-3" style={{ gap: 8 }}>
              <button
                className="btn btn-sm btn-outline-secondary"
                style={{ borderRadius: 6 }}
                onClick={() => setSubdominioActivo(null)}
              >
                <i className="simple-icon-arrow-left mr-1" />
                Subdominios
              </button>
              <span style={{ color: '#6c757d', fontSize: '0.82rem' }}>/</span>
              <span style={{ fontWeight: 700, fontSize: '0.88rem', color: '#2d2d2d' }}>
                {subdominioActivo}
              </span>
              <span className="badge badge-pill ml-1" style={{ background: '#fce4ec', color: '#D2006E', fontSize: '0.72rem' }}>
                {(subdominiosMapa.get(subdominioActivo) || []).length}
              </span>
            </div>

            {/* Lista de casos */}
            {casosSubdominio.length === 0 ? (
              <div className="text-muted" style={{ fontSize: '0.85rem' }}>
                No se encontraron casos de uso.
              </div>
            ) : (
              casosSubdominio.map((c) => (
                <div
                  key={c.id_caso_uso}
                  className="caso-use-card"
                  onClick={() => setCasoSeleccionado(c)}
                >
                  <input
                    type="checkbox"
                    style={{ marginRight: 8, flexShrink: 0 }}
                    onClick={(e) => e.stopPropagation()}
                  />
                  <span className="caso-nombre">{c.descripcion_caso_uso}</span>
                  <span className={`status-badge ${getStatusClass(c.estado)}`} style={{ flexShrink: 0 }}>
                    {c.estado || 'INGRESADO'}
                  </span>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Modal de caso de uso */}
      {casoSeleccionado && (
        <ModalCasoUso
          caso={casoSeleccionado}
          onClose={() => setCasoSeleccionado(null)}
          dominioId={id}
        />
      )}
    </div>
  );
}

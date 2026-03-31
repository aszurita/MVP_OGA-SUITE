/**
 * FichaTablas.jsx
 * Página de Tablas Oficiales de un dominio.
 * Route: /ficha-tablas/:id
 */
import { useState, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import {
  getDominioById,
  getTablasOficiales,
  getArtefactosByDominio,
  getEstructuraByDominio,
  getCasosUsoByDominio,
  getTerminosByDominio,
} from '../../services/dominiosService.js';
import DominioNavTabs from '../FichaDominio/components/DominioNavTabs.jsx';
import '../FichaDominio/styles/FichaDominio.css';

const PAGE_SIZE = 15;

const FILTROS_SIDEBAR = [
  'Todas',
  'Persona Natural',
  'Persona Jurídica',
  'Bronce',
  'Plata',
  'Oro',
  'Proyecto 1906',
  'Fuente Externa',
  'Fuente Interna',
  'Con Profiling',
  'Sin Clasificación',
];

export default function FichaTablas() {
  const { id } = useParams();

  const [dominio,  setDominio]  = useState(null);
  const [tablas,   setTablas]   = useState([]);
  const [stats,    setStats]    = useState({ atributos: 0, terminos: 0, artefactos: 0, estructura: 0, tablas: 0, casosUso: 0 });
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState(null);

  const [filtroSidebar, setFiltroSidebar] = useState('Todas');
  const [search,        setSearch]        = useState('');
  const [page,          setPage]          = useState(1);

  useEffect(() => {
    if (!id) return;
    async function fetchAll() {
      setLoading(true);
      setError(null);
      try {
        const dom = await getDominioById(id);
        setDominio(dom);

        const [artefactos, estructura, casosUso] = await Promise.all([
          getArtefactosByDominio(id),
          getEstructuraByDominio(id),
          getCasosUsoByDominio(id),
        ]);

        let tablasData = [], atributos = 0, terminos = 0;
        if (dom && dom.nombre_dominio) {
          const [tData, attrs, terms] = await Promise.all([
            getTablasOficiales(dom.nombre_dominio),
            getTerminosByDominio(dom.nombre_dominio, 'atributo'),
            getTerminosByDominio(dom.nombre_dominio, 'termino'),
          ]);
          tablasData = tData;
          atributos  = attrs.length;
          terminos   = terms.length;
        }

        setTablas(tablasData);
        setStats({
          atributos,
          terminos,
          artefactos:  artefactos.length,
          estructura:  estructura.length,
          tablas:      tablasData.length,
          casosUso:    casosUso.length,
        });
      } catch (err) {
        console.error('[FichaTablas]', err);
        setError('Error al cargar las tablas del dominio.');
      } finally {
        setLoading(false);
      }
    }
    fetchAll();
  }, [id]);

  const filtradas = useMemo(() => {
    let lista = tablas;

    // Filtro por etiqueta (sidebar)
    if (filtroSidebar && filtroSidebar !== 'Todas') {
      lista = lista.filter((t) =>
        (t.etiqueta || '').toLowerCase().includes(filtroSidebar.toLowerCase())
      );
    }

    // Búsqueda por texto
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      lista = lista.filter((t) =>
        (t.tabla        || '').toLowerCase().includes(q) ||
        (t.campo        || '').toLowerCase().includes(q) ||
        (t.metadato     || '').toLowerCase().includes(q) ||
        (t.base_datos   || '').toLowerCase().includes(q) ||
        (t.esquema      || '').toLowerCase().includes(q)
      );
    }

    return lista;
  }, [tablas, filtroSidebar, search]);

  const totalPages = Math.ceil(filtradas.length / PAGE_SIZE);
  const pageItems  = filtradas.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

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

      <div className="d-flex flex-row" style={{ flex: 1 }}>
        {/* Sidebar de filtros */}
        <div className="tablas-sidebar">
          <div style={{ padding: '10px 16px', fontWeight: 700, fontSize: '0.8rem', color: '#2d2d2d', borderBottom: '1px solid #dee2e6', marginBottom: 4 }}>
            Filtrar por
          </div>
          {FILTROS_SIDEBAR.map((f) => (
            <div
              key={f}
              className={`tablas-sidebar-item ${filtroSidebar === f ? 'active' : ''}`}
              onClick={() => { setFiltroSidebar(f); setPage(1); }}
            >
              {f}
            </div>
          ))}
        </div>

        {/* Contenido principal */}
        <div className="tablas-container">
          {/* Título del dominio */}
          <h5>{dominio?.nombre_dominio || 'Dominio'} — Tablas Oficiales</h5>

          {/* Búsqueda y contador */}
          <div className="dominio-search-bar mb-3">
            <input
              type="text"
              className="form-control form-control-sm"
              placeholder="Buscar por tabla, campo, base..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              style={{ maxWidth: 360, borderRadius: 20 }}
            />
            <span style={{ fontSize: '0.8rem', color: '#6c757d' }}>
              {filtradas.length} resultado(s)
            </span>
          </div>

          {/* Lista de tablas */}
          {pageItems.length === 0 ? (
            <div className="text-muted" style={{ fontSize: '0.85rem' }}>
              No se encontraron tablas para este dominio.
            </div>
          ) : (
            pageItems.map((t, idx) => {
              const path = [t.servidor, t.base_datos, t.esquema, t.tabla]
                .filter(Boolean).join('.');
              const pct  = parseFloat(t.porcentaje_completado) || 0;
              const etiquetas = (t.etiqueta || '').split(',').map((e) => e.trim()).filter(Boolean);

              return (
                <div key={t.id_tabla || idx} className="tabla-row">
                  <div className="tabla-row-actions">
                    <button title="Editar"><i className="simple-icon-pencil" /></button>
                    <button title="Ver"><i className="simple-icon-eye" /></button>
                  </div>

                  <div style={{ flex: 1 }}>
                    <div className="tabla-row-path">{path}</div>
                    {t.metadato && <div className="tabla-row-campo">{t.metadato}{t.campo ? ` / ${t.campo}` : ''}</div>}
                    <div className="d-flex align-items-center mt-1" style={{ gap: 10, flexWrap: 'wrap' }}>
                      {etiquetas.map((e, ei) => (
                        <span key={ei} className="tabla-row-etiqueta">{e}</span>
                      ))}
                    </div>
                  </div>

                  <div className="tabla-row-pct" style={{ minWidth: 100 }}>
                    <div style={{ fontSize: '0.7rem', color: '#6c757d', marginBottom: 2 }}>{pct.toFixed(0)}%</div>
                    <div className="progress">
                      <div
                        className="progress-bar"
                        style={{ width: `${pct}%`, background: '#D2006E' }}
                      />
                    </div>
                  </div>
                </div>
              );
            })
          )}

          {/* Paginación */}
          {totalPages > 1 && (
            <div className="dominio-pagination mt-3">
              <button disabled={page === 1} onClick={() => setPage((p) => p - 1)}>
                &laquo;
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  className={page === p ? 'active' : ''}
                  onClick={() => setPage(p)}
                >
                  {p}
                </button>
              ))}
              <button disabled={page === totalPages} onClick={() => setPage((p) => p + 1)}>
                &raquo;
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

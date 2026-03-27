/**
 * DominioArtefactos.jsx
 * Página de Artefactos de un dominio.
 * Route: /dominio-artefactos/:id
 */
import { useState, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import {
  getDominioById,
  getArtefactosByDominio,
  getEstructuraByDominio,
  getTablasOficiales,
  getCasosUsoByDominio,
  getTerminosByDominio,
} from '../../services/dominiosService.js';
import DominioNavTabs from '../FichaDominio/components/DominioNavTabs.jsx';
import ArtefactoCard  from './components/ArtefactoCard.jsx';
import '../FichaDominio/styles/FichaDominio.css';

const PAGE_SIZE = 8;

export default function DominioArtefactos() {
  const { id } = useParams();

  const [dominio,    setDominio]    = useState(null);
  const [artefactos, setArtefactos] = useState([]);
  const [stats,      setStats]      = useState({ atributos: 0, terminos: 0, artefactos: 0, estructura: 0, tablas: 0, casosUso: 0 });
  const [loading,    setLoading]    = useState(true);
  const [error,      setError]      = useState(null);

  const [search, setSearch] = useState('');
  const [page,   setPage]   = useState(1);

  useEffect(() => {
    if (!id) return;
    async function fetchAll() {
      setLoading(true);
      setError(null);
      try {
        const dom = await getDominioById(id);
        setDominio(dom);

        const [artefactosData, estructura, casosUso] = await Promise.all([
          getArtefactosByDominio(id),
          getEstructuraByDominio(id),
          getCasosUsoByDominio(id),
        ]);

        setArtefactos(artefactosData);

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
          artefactos: artefactosData.length,
          estructura: estructura.length,
          tablas,
          casosUso:   casosUso.length,
        });
      } catch (err) {
        console.error('[DominioArtefactos]', err);
        setError('Error al cargar los artefactos del dominio.');
      } finally {
        setLoading(false);
      }
    }
    fetchAll();
  }, [id]);

  const filtrados = useMemo(() => {
    if (!search.trim()) return artefactos;
    const q = search.trim().toLowerCase();
    return artefactos.filter(
      (a) =>
        (a.nombre          || '').toLowerCase().includes(q) ||
        (a.tipo_artefacto  || '').toLowerCase().includes(q) ||
        (a.descripcion     || '').toLowerCase().includes(q)
    );
  }, [artefactos, search]);

  const totalPages = Math.ceil(filtrados.length / PAGE_SIZE);
  const pageItems  = filtrados.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

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

      <div className="dominio-section-body" style={{ padding: '20px 28px' }}>
        {/* Barra superior */}
        <div className="d-flex align-items-center justify-content-between mb-3 flex-wrap" style={{ gap: 12 }}>
          <h5 style={{ margin: 0 }}>Artefactos</h5>
          <div className="d-flex" style={{ gap: 10 }}>
            <button
              className="btn btn-sm"
              style={{ background: '#D2006E', color: '#fff', borderRadius: 6, fontWeight: 600 }}
            >
              <i className="iconsminds-data-storage mr-1" />
              Visualizar inventario
            </button>
          </div>
        </div>

        {/* Búsqueda */}
        <div className="dominio-search-bar mb-3">
          <input
            type="text"
            className="form-control form-control-sm"
            placeholder="Buscar artefacto..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            style={{ maxWidth: 320, borderRadius: 20 }}
          />
          <span style={{ fontSize: '0.8rem', color: '#6c757d' }}>
            {filtrados.length} artefacto(s)
          </span>
        </div>

        {/* Grilla */}
        {pageItems.length === 0 ? (
          <div className="text-muted" style={{ fontSize: '0.85rem' }}>
            No se encontraron artefactos para este dominio.
          </div>
        ) : (
          <div className="artefactos-grid">
            {pageItems.map((a) => (
              <ArtefactoCard key={a.id_artefacto} artefacto={a} />
            ))}
          </div>
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
  );
}

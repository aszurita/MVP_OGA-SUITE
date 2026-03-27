/**
 * DominioTerminosAtributos.jsx
 * Página de Términos y Atributos de un dominio.
 * Route: /dominio-terminos/:id/:tipo  (tipo = 'atributo' | 'terminos')
 *
 * Reutiliza GlosarioCard y GlosarioListItem del módulo Glosario.
 */
import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  getDominioById,
  getTerminosByDominio,
  getArtefactosByDominio,
  getEstructuraByDominio,
  getTablasOficiales,
  getCasosUsoByDominio,
} from '../../services/dominiosService.js';
import DominioNavTabs from '../FichaDominio/components/DominioNavTabs.jsx';
import GlosarioCard   from '../Glosario/components/GlosarioCard.jsx';
import { Toast }      from '../Glosario/components/GlosarioCard.jsx';
import '../FichaDominio/styles/FichaDominio.css';

const PAGE_SIZE = 12;

const FILTRO_OPTS = [
  { value: '',         label: 'Todos'     },
  { value: 'termino',  label: 'Términos'  },
  { value: 'atributo', label: 'Atributos' },
];

export default function DominioTerminosAtributos() {
  const { id, tipo }  = useParams();
  const navigate      = useNavigate();

  const [dominio,   setDominio]   = useState(null);
  const [terminos,  setTerminos]  = useState([]);
  const [stats,     setStats]     = useState({ atributos: 0, terminos: 0, artefactos: 0, estructura: 0, tablas: 0, casosUso: 0 });
  const [loading,   setLoading]   = useState(true);
  const [error,     setError]     = useState(null);

  const [filtroTipo,   setFiltroTipo]   = useState(tipo || '');
  const [search,       setSearch]       = useState('');
  const [page,         setPage]         = useState(1);

  useEffect(() => {
    if (!id) return;
    async function fetchAll() {
      setLoading(true);
      setError(null);
      try {
        const dom = await getDominioById(id);
        setDominio(dom);

        if (dom && dom.nombre_dominio) {
          const [todos, artefactos, estructura, casosUso, tablas] = await Promise.all([
            getTerminosByDominio(dom.nombre_dominio),
            getArtefactosByDominio(id),
            getEstructuraByDominio(id),
            getCasosUsoByDominio(id),
            getTablasOficiales(dom.nombre_dominio),
          ]);

          setTerminos(todos);
          const attrs = todos.filter((t) => (t.tipo || '').toUpperCase().includes('ATRIBUTO'));
          const terms = todos.filter((t) => (t.tipo || '').toUpperCase() === 'TERMINO');
          setStats({
            atributos:  attrs.length,
            terminos:   terms.length,
            artefactos: artefactos.length,
            estructura: estructura.length,
            tablas:     tablas.length,
            casosUso:   casosUso.length,
          });
        }
      } catch (err) {
        console.error('[DominioTerminosAtributos]', err);
        setError('Error al cargar los términos del dominio.');
      } finally {
        setLoading(false);
      }
    }
    fetchAll();
  }, [id]);

  // Filtrado
  const terminosFiltrados = useMemo(() => {
    let lista = terminos;

    if (filtroTipo) {
      if (filtroTipo === 'atributo') {
        lista = lista.filter((t) => (t.tipo || '').toUpperCase().includes('ATRIBUTO'));
      } else if (filtroTipo === 'termino') {
        lista = lista.filter((t) => (t.tipo || '').toUpperCase() === 'TERMINO');
      }
    }

    if (search.trim()) {
      const q = search.trim().toLowerCase();
      lista = lista.filter(
        (t) =>
          (t.nombre       || '').toLowerCase().includes(q) ||
          (t.descripcion  || '').toLowerCase().includes(q)
      );
    }

    return lista;
  }, [terminos, filtroTipo, search]);

  const totalPages  = Math.ceil(terminosFiltrados.length / PAGE_SIZE);
  const pageItems   = terminosFiltrados.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  function handleFiltroChange(val) {
    setFiltroTipo(val);
    setPage(1);
    // Actualizar URL con el tipo seleccionado
    const tipoUrl = val || 'todos';
    navigate(`/dominio-terminos/${id}/${tipoUrl}`, { replace: true });
  }

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
      <Toast />
      <DominioNavTabs dominio={dominio} stats={stats} dominioId={id} />

      <div className="dominio-section-body" style={{ padding: '20px 28px' }}>
        <h5>Términos y Atributos</h5>

        {/* Controles de filtro */}
        <div className="dominio-search-bar mb-3">
          <div className="d-flex align-items-center mr-3">
            <label className="mb-0 mr-2" style={{ fontSize: '0.82rem', fontWeight: 600, whiteSpace: 'nowrap' }}>
              Filtrar Por:
            </label>
            <select
              className="form-control form-control-sm"
              style={{ width: 'auto' }}
              value={filtroTipo}
              onChange={(e) => handleFiltroChange(e.target.value)}
            >
              {FILTRO_OPTS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>

          <input
            type="text"
            className="form-control form-control-sm"
            placeholder="Buscar término o atributo..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            style={{ maxWidth: 320, borderRadius: 20 }}
          />

          <span style={{ fontSize: '0.8rem', color: '#6c757d', marginLeft: 8 }}>
            {terminosFiltrados.length} resultado(s)
          </span>
        </div>

        {/* Grid de tarjetas (2 columnas) */}
        {pageItems.length === 0 ? (
          <div className="text-muted" style={{ fontSize: '0.85rem' }}>
            No se encontraron términos o atributos para este dominio.
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
            {pageItems.map((termino) => (
              <GlosarioCard
                key={termino.id}
                termino={termino}
                dominiosMapa={{}}
                dicCasosUso={{}}
                mapaTermCU={{}}
                onUpdate={() => {}}
                onDelete={() => {}}
              />
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

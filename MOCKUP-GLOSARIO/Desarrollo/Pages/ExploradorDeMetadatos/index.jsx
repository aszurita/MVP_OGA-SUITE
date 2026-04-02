import { useState, useEffect, useCallback, useRef } from 'react';

import { getFilters, getTableView, getFieldView } from '../../services/metadataService.js';

import SearchBar from './components/SearchBar.jsx';
import MetadataTable from './components/MetadataTable.jsx';
import SegmentarDropdown from './components/SegmentarDropdown.jsx';
import Pagination from './components/Pagination.jsx';

import './styles/ExploradorDeMetadatos.css';

const PAGE_SIZE = 20;

function useDebounce(value, delay = 400) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

export default function ExploradorDeMetadatos() {
  // ── Filtros de usuario ───────────────────────────────
  const [viewMode, setViewMode] = useState('tabla'); // 'tabla' | 'campo'
  const [searchInput, setSearchInput] = useState('');
  const [activeServidor, setActiveServidor] = useState(null);
  const [acceptAll, setAcceptAll] = useState(false);
  const debouncedSearch = useDebounce(searchInput);

  // ── Paginación ───────────────────────────────────────
  const [page, setPage] = useState(1);

  // ── Datos ────────────────────────────────────────────
  const [filters, setFilters] = useState({ servidores: [] });
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [apiOk, setApiOk] = useState(true);

  // ── Cargar filtros al montar ─────────────────────────
  useEffect(() => {
    getFilters()
      .then((f) => { setFilters(f); setApiOk(true); })
      .catch(() => setApiOk(false));
  }, []);

  // ── Cargar datos ─────────────────────────────────────
  const fetchData = useCallback(() => {
    setLoading(true);
    setError(null);

    const params = {
      servidor: activeServidor || undefined,
      q: debouncedSearch || undefined,
      page,
      page_size: PAGE_SIZE,
    };

    const fetcher = viewMode === 'tabla' ? getTableView : getFieldView;

    fetcher(params)
      .then((res) => {
        setItems(res.items || []);
        setTotal(res.total || 0);
        setTotalPages(res.pages || 1);
        setApiOk(true);
      })
      .catch((err) => {
        setError(err.message);
        setApiOk(false);
      })
      .finally(() => setLoading(false));
  }, [viewMode, activeServidor, debouncedSearch, page]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // ── Resetear página al cambiar filtros ───────────────
  useEffect(() => {
    setPage(1);
  }, [viewMode, activeServidor, debouncedSearch]);

  function handleClear() {
    setSearchInput('');
    setActiveServidor(null);
    setPage(1);
  }

  function handleViewChange(e) {
    setViewMode(e.target.value);
    setPage(1);
  }

  function handlePageChange(p) {
    setPage(p);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  return (
    <div id="explorador-metadatos" className="flex-grow-1 px-3 transition-content">

      {/* ── Título ── */}
      <div className="row">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <h1>Explorador de Metadatos</h1>
          </div>

          {/* ── Toolbar principal ── */}
          <div className="em-toolbar">
            {/* Izquierda: vista + buscador */}
            <div className="em-toolbar-left">
              {/* Selector de vista */}
              <div className="em-view-select">
                <select value={viewMode} onChange={handleViewChange}>
                  <option value="tabla">Tabla</option>
                  <option value="campo">Campo</option>
                </select>
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none" style={{ pointerEvents: 'none' }}>
                  <path d="M2 3.5L5 6.5L8 3.5" stroke="#555" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </div>

              {/* Buscador */}
              <SearchBar
                value={searchInput}
                onChange={(v) => setSearchInput(v)}
                onClear={() => setSearchInput('')}
              />

              {/* Limpiar todo */}
              {(searchInput || activeServidor) && (
                <button
                  className="btn-reveal"
                  type="button"
                  title="Limpiar filtros"
                  onClick={handleClear}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m16 22-1-4" /><path d="M19 14a1 1 0 0 0 1-1v-1a2 2 0 0 0-2-2h-3a1 1 0 0 1-1-1V4a2 2 0 0 0-4 0v5a1 1 0 0 1-1 1H6a2 2 0 0 0-2 2v1a1 1 0 0 0 1 1" /><path d="M19 14H5l-1.973 6.767A1 1 0 0 0 4 22h16a1 1 0 0 0 .973-1.233z" /><path d="m8 22 1-4" />
                  </svg>
                  <span className="label">Limpiar Filtros</span>
                </button>
              )}
            </div>

            {/* Derecha: Segmentar */}
            <div className="em-toolbar-right">
              <SegmentarDropdown
                servidores={filters.servidores || []}
                activeServidor={activeServidor}
                onSelect={(s) => { setActiveServidor(s); setPage(1); }}
              />
            </div>
          </div>

          {/* ── Sub-toolbar ── */}
          <div className="em-subtoolbar">
            <div className="em-accept-all">
              <label>
                <input
                  type="checkbox"
                  checked={acceptAll}
                  onChange={(e) => setAcceptAll(e.target.checked)}
                />
                Aceptar todas las recomendaciones
              </label>
            </div>

            <div className="em-actions">
              <button className="em-icon-btn" title="Ordenar" type="button">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="15" y2="12"/><line x1="3" y1="18" x2="9" y2="18"/>
                </svg>
              </button>
              <button className="em-icon-btn" title="Filtrar" type="button">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
                </svg>
              </button>
              <button className="em-icon-btn" title="Exportar" type="button">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
                </svg>
              </button>
              <button className="em-icon-btn" title="Actualizar" type="button" onClick={fetchData}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
                </svg>
              </button>
            </div>
          </div>

          <div className="em-separator" />
        </div>
      </div>

      {/* ── Error de conexión ── */}
      {!apiOk && !loading && (
        <div className="em-alert-error mb-3">
          <strong>No se pudo conectar con la API.</strong> Verifica que el servidor esté corriendo en{' '}
          <code>http://localhost:8000</code>.
          {error && <> — <em>{error}</em></>}
        </div>
      )}

      {/* ── Tabla ── */}
      <MetadataTable items={items} viewMode={viewMode} loading={loading} />

      {/* ── Footer: resultados + paginación ── */}
      {!loading && apiOk && (
        <div className="em-footer mt-3">
          <div className="em-count">
            <strong>{total}</strong> {total === 1 ? 'resultado' : 'resultados'}
            {activeServidor && <> en <strong>{activeServidor}</strong></>}
          </div>
          <Pagination currentPage={page} totalPages={totalPages} onChange={handlePageChange} />
        </div>
      )}
    </div>
  );
}

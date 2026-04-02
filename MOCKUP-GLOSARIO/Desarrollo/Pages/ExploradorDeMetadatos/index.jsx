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
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}

function ViewModeDropdown({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        setOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const options = [
    { value: 'tabla', label: 'Tabla' },
    { value: 'campo', label: 'Campo' },
    { value: 'atributo', label: 'Atributo' },
  ];

  const selected = options.find((option) => option.value === value) || options[0];

  return (
    <div className={`em-view-dropdown ${open ? 'is-open' : ''}`} ref={ref}>
      <button className={`em-view-select ${open ? 'is-open' : ''}`} type="button" onClick={() => setOpen((current) => !current)}>
        <span>{selected.label}</span>
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
          <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </button>

      {open && (
        <div className="em-view-menu">
          {options
            .filter((option) => option.value !== value)
            .map((option) => (
              <button
                key={option.value}
                className="em-view-option"
                type="button"
                onClick={() => {
                  onChange(option.value);
                  setOpen(false);
                }}
              >
                {option.label}
              </button>
            ))}
        </div>
      )}
    </div>
  );
}

function HeaderUtilityIcons() {
  return (
    <div className="em-header-tools" aria-hidden="true">
      <button className="em-header-icon-btn em-tooltip-trigger" type="button" data-tooltip="Ver Data Owners" title="Usuarios">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M16 21v-1.2a4.8 4.8 0 0 0-4.8-4.8H8.8A4.8 4.8 0 0 0 4 19.8V21" />
          <circle cx="10" cy="7" r="3.3" />
          <path d="M20 21v-1a4 4 0 0 0-3.2-3.92" />
          <path d="M15.8 4.2a3.1 3.1 0 0 1 0 5.6" />
        </svg>
      </button>

      <button className="em-header-icon-btn em-tooltip-trigger" type="button" data-tooltip="Agrupar estructura" title="Jerarquia">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <rect x="9" y="3" width="6" height="6" rx="1.2" />
          <rect x="3" y="15" width="6" height="6" rx="1.2" />
          <rect x="15" y="15" width="6" height="6" rx="1.2" />
          <path d="M12 9v3" />
          <path d="M6 15v-3h12v3" />
        </svg>
      </button>
    </div>
  );
}

function ActionIcon({ type }) {
  const icons = {
    upload: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M7 17.5A4.5 4.5 0 0 1 7.8 8.6 5.5 5.5 0 0 1 18 10.5h.5a3.5 3.5 0 1 1 0 7H14" />
        <path d="M12 14V7" />
        <path d="m8.8 10.2 3.2-3.2 3.2 3.2" />
      </svg>
    ),
    download: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M7 17.5A4.5 4.5 0 0 1 7.8 8.6 5.5 5.5 0 0 1 18 10.5h.5a3.5 3.5 0 1 1 0 7H14" />
        <path d="M12 10v7" />
        <path d="m8.8 13.8 3.2 3.2 3.2-3.2" />
      </svg>
    ),
    idea: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 18h6" />
        <path d="M10 21h4" />
        <path d="M8.4 14.8A6.5 6.5 0 1 1 16 14.6c-.9.8-1.5 1.6-1.8 2.4h-4.4c-.2-.8-.7-1.5-1.4-2.2Z" />
        <path d="M18.5 4.5 20 3" />
        <path d="M5.5 4.5 4 3" />
        <path d="M12 2V1" />
      </svg>
    ),
    clear: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 7h10" />
        <path d="M4 12h16" />
        <path d="M4 17h7" />
      </svg>
    ),
    refresh: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 5v6h-6" />
        <path d="M20 11a8 8 0 1 0 2.1 5.4" />
      </svg>
    ),
  };

  return icons[type] || null;
}

function GroupTableToggle({ checked, onToggle }) {
  return (
    <div className="em-group-toggle em-tooltip-trigger" data-tooltip="Agrupar Nivel Tabla">
      <button
        className={`em-switch-ghost ${checked ? 'is-right' : 'is-left'}`}
        type="button"
        title="Agrupar Nivel Tabla"
        aria-pressed={checked}
        onClick={onToggle}
      >
        <span className="em-switch-thumb" />
      </button>
    </div>
  );
}

export default function ExploradorDeMetadatos() {
  const [viewMode, setViewMode] = useState('tabla');
  const [viewSelector, setViewSelector] = useState('tabla');
  const [lastNonTableSelector, setLastNonTableSelector] = useState('campo');
  const [searchInput, setSearchInput] = useState('');
  const [activeServidor, setActiveServidor] = useState(null);
  const [acceptAll, setAcceptAll] = useState(false);
  const debouncedSearch = useDebounce(searchInput);

  const [page, setPage] = useState(1);

  const [filters, setFilters] = useState({ servidores: [] });
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [apiOk, setApiOk] = useState(true);

  useEffect(() => {
    getFilters()
      .then((result) => {
        setFilters(result);
        setApiOk(true);
      })
      .catch(() => setApiOk(false));
  }, []);

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
      .then((result) => {
        setItems(result.items || []);
        setTotal(result.total || 0);
        setTotalPages(result.pages || 1);
        setApiOk(true);
      })
      .catch((err) => {
        setError(err.message);
        setApiOk(false);
      })
      .finally(() => setLoading(false));
  }, [activeServidor, debouncedSearch, page, viewMode]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    setPage(1);
  }, [viewMode, activeServidor, debouncedSearch]);

  function handleClear() {
    setSearchInput('');
    setActiveServidor(null);
    setPage(1);
  }

  function handleViewChange(nextValue) {
    if (nextValue !== 'tabla') {
      setLastNonTableSelector(nextValue);
    }
    setViewSelector(nextValue);
    setViewMode(nextValue === 'tabla' ? 'tabla' : 'campo');
    setPage(1);
  }

  function handleGroupToggle() {
    if (viewSelector === 'tabla') {
      handleViewChange(lastNonTableSelector || 'campo');
      return;
    }

    handleViewChange('tabla');
  }

  function handlePageChange(nextPage) {
    setPage(nextPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  return (
    <div id="explorador-metadatos" className="flex-grow-1 px-3 transition-content">
      <div className="em-page-shell">
        <div className="em-title-row">
          <h1>Explorador de Metadatos</h1>
        </div>

        <div className="em-toolbar">
          <div className="em-toolbar-left">
            <ViewModeDropdown value={viewSelector} onChange={handleViewChange} />

            <SearchBar
              value={searchInput}
              onChange={(value) => setSearchInput(value)}
              onClear={() => setSearchInput('')}
            />
          </div>

          <div className="em-toolbar-right">
            <GroupTableToggle checked={viewSelector === 'tabla'} onToggle={handleGroupToggle} />
            <HeaderUtilityIcons />
            <SegmentarDropdown
              servidores={filters.servidores || []}
              activeServidor={activeServidor}
              onSelect={(servidor) => {
                setActiveServidor(servidor);
                setPage(1);
              }}
            />
          </div>
        </div>

        <div className="em-separator" />

        <div className="em-subtoolbar">
          <div className="em-accept-all">
            <label>
              <span>Aceptar todas las recomendaciones</span>
              <input
                type="checkbox"
                checked={acceptAll}
                onChange={(event) => setAcceptAll(event.target.checked)}
              />
            </label>
          </div>
          <div className="em-actions">
            {(searchInput || activeServidor) && (
              <button className="em-action-icon em-tooltip-trigger" data-tooltip="Limpiar filtros" title="Limpiar filtros" type="button" onClick={handleClear}>
                <ActionIcon type="clear" />
              </button>
            )}
            <button className="em-action-icon em-tooltip-trigger" data-tooltip="Importar archivo Excel" title="Subir" type="button">
              <ActionIcon type="upload" />
            </button>
            <button className="em-action-icon em-tooltip-trigger" data-tooltip="Descargar datos como Excel" title="Descargar" type="button">
              <ActionIcon type="download" />
            </button>
            <button className="em-action-icon em-tooltip-trigger" data-tooltip="Recomendacion automatica de definiciones" title="Sugerencias" type="button">
              <ActionIcon type="idea" />
            </button>
            <button className="em-action-icon em-tooltip-trigger" data-tooltip="Actualizar resultados" title="Actualizar" type="button" onClick={fetchData}>
              <ActionIcon type="refresh" />
            </button>
          </div>
        </div>
      </div>

      {!apiOk && !loading && (
        <div className="em-alert-error mb-3">
          <strong>No se pudo conectar con la API.</strong> Verifica que el servidor este corriendo en{' '}
          <code>http://localhost:8000</code>.
          {error && <> - <em>{error}</em></>}
        </div>
      )}

      <MetadataTable items={items} viewMode={viewMode} loading={loading} />

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

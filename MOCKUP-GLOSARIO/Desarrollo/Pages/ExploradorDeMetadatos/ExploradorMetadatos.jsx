import { useState, useEffect, useCallback, useRef } from 'react';

import { getFilters, getTableView, getFieldView } from '../../services/metadataService.js';
import DataOwnersModal from './components/DataOwnersModal.jsx';
import DocumentarCampoModal from './components/DocumentarCampoModal.jsx';
import {
  DescripcionTablaModal,
  DataOwnerStewardModal,
  DimensionesCalidadModal,
  ClasificacionTablaModal,
} from './components/EditarTablaModals.jsx';
import HierarchyPanel from './components/HierarchyPanel.jsx';

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

function HeaderUtilityIcons({ onVerBase, onVerOwners, onVerJerarquia, jerarquiaOpen }) {
  return (
    <div className="em-header-tools" aria-hidden="true">
      <button className="em-header-icon-btn em-tooltip-trigger" type="button" data-tooltip="Ver todas las tablas de la base" title="Ver base" onClick={onVerBase}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      </button>

      <button className="em-header-icon-btn em-tooltip-trigger" type="button" data-tooltip="Ver Data Owners" title="Usuarios" onClick={onVerOwners}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M16 21v-1.2a4.8 4.8 0 0 0-4.8-4.8H8.8A4.8 4.8 0 0 0 4 19.8V21" />
          <circle cx="10" cy="7" r="3.3" />
          <path d="M20 21v-1a4 4 0 0 0-3.2-3.92" />
          <path d="M15.8 4.2a3.1 3.1 0 0 1 0 5.6" />
        </svg>
      </button>

      <button
        className={`em-header-icon-btn em-tooltip-trigger${jerarquiaOpen ? ' is-active' : ''}`}
        type="button"
        data-tooltip="Ver jerarquía de servidores/bases/tablas"
        title="Jerarquia"
        onClick={onVerJerarquia}
      >
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

/** Chip que muestra la tabla activa con botón para limpiar */
function ActiveTablaChip({ tabla, servidor, base, esquema, onClear }) {
  return (
    <div className="em-active-tabla-chip">
      <span className="em-active-tabla-path">
        {servidor} / {base} / {esquema}
      </span>
      <span className="em-active-tabla-name">{tabla}</span>
      <button
        className="em-active-tabla-clear"
        type="button"
        title="Ver todos los campos"
        onClick={onClear}
      >
        <svg viewBox="0 0 16 16" width="14" height="14" fill="none">
          <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      </button>
    </div>
  );
}

export default function ExploradorDeMetadatos() {
  const [viewMode, setViewMode] = useState('tabla');
  const [searchInput, setSearchInput] = useState('');
  const [activeServidor, setActiveServidor] = useState(null);
  const [activeBase, setActiveBase] = useState(null);
  const [activeEsquema, setActiveEsquema] = useState(null);
  // Tabla seleccionada al hacer clic en una fila de vista-tabla (filtro exacto)
  const [activeTabla, setActiveTabla] = useState(null); // { tabla, servidor, base, esquema }
  // Búsqueda parcial de tabla (LIKE) — usada al hacer toggle tabla→campo para ver campos de todas las tablas visibles
  const [tablaQ, setTablaQ] = useState(null);
  const [acceptAll, setAcceptAll] = useState(false);
  const [ownersModalOpen, setOwnersModalOpen] = useState(false);
  const [hierarchyOpen, setHierarchyOpen] = useState(false);
  const [editingField, setEditingField] = useState(null);
  const [tablaAction, setTablaAction] = useState(null); // { action, row }
  const debouncedSearch = useDebounce(searchInput);

  const [page, setPage] = useState(1);

  const [filters, setFilters] = useState({ servidores: [], plataformas: [], clasificaciones: [] });
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

    let params;

    if (viewMode === 'tabla') {
      // Vista tabla: filtro por servidor/base/esquema (jerarquía o segmentar) + búsqueda libre
      params = {
        servidor: activeServidor || undefined,
        base: activeBase || undefined,
        esquema: activeEsquema || undefined,
        q: debouncedSearch || undefined,
        page,
        page_size: PAGE_SIZE,
      };
    } else {
      // Vista campo:
      // 1) Clic en fila → activeTabla (filtro exacto servidor+base+esquema+tabla)
      // 2) Toggle desde tabla con búsqueda → tablaQ (LIKE en nombre de tabla)
      // 3) Sin filtro → todos los campos
      if (activeTabla) {
        params = {
          servidor: activeTabla.servidor || undefined,
          base: activeTabla.base || undefined,
          esquema: activeTabla.esquema || undefined,
          tabla: activeTabla.tabla || undefined,
          q: debouncedSearch || undefined,
          page,
          page_size: PAGE_SIZE,
        };
      } else {
        params = {
          servidor: activeServidor || undefined,
          tabla_q: tablaQ || undefined,
          q: debouncedSearch || undefined,
          page,
          page_size: PAGE_SIZE,
        };
      }
    }

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
  }, [activeServidor, activeBase, activeEsquema, activeTabla, debouncedSearch, page, viewMode]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    setPage(1);
  }, [viewMode, activeServidor, activeBase, activeEsquema, activeTabla, tablaQ, debouncedSearch]);

  function handleClear() {
    setSearchInput('');
    setActiveServidor(null);
    setActiveBase(null);
    setActiveEsquema(null);
    setActiveTabla(null);
    setTablaQ(null);
    setPage(1);
  }

  /** Clic en una fila de tabla → modo campo con filtro exacto de esa tabla */
  function handleTableRowClick(row) {
    setSearchInput('');  // limpiar búsqueda: contexto cambia a "ver campos de esta tabla"
    setTablaQ(null);
    setActiveTabla({
      tabla: row.tabla,
      servidor: row.servidor,
      base: row.base,
      esquema: row.esquema,
    });
    setViewMode('campo');
    setPage(1);
  }

  /** Limpiar tabla activa → volver a ver todos los campos (o los de tablaQ si aplica) */
  function handleClearTabla() {
    setActiveTabla(null);
    setPage(1);
  }

  function handleViewChange(nextValue) {
    if (nextValue === 'tabla') {
      // Volver a tabla: restaurar búsqueda desde tablaQ si existía, limpiar filtros de campo
      if (tablaQ) setSearchInput(tablaQ);
      setActiveTabla(null);
      setTablaQ(null);
    }
    setViewMode(nextValue);
    setPage(1);
  }

  function handleGroupToggle() {
    if (viewMode === 'tabla') {
      // Tabla → Campo: capturar el search actual como filtro LIKE de tabla
      const currentSearch = searchInput.trim();
      setTablaQ(currentSearch || null);
      setSearchInput('');   // el search ahora puede usarse para buscar dentro de los campos
      setActiveTabla(null);
      setViewMode('campo');
      setPage(1);
    } else {
      handleViewChange('tabla');
    }
  }

  function handlePageChange(nextPage) {
    setPage(nextPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  return (
    <div id="explorador-metadatos" className="flex-grow-1 pl-3 transition-content">
      <div className="em-page-shell">
        <div className="">
          <h1>Explorador de Metadatos</h1>
        </div>

        <div className="em-toolbar">
          <div className="em-toolbar-left">
            <ViewModeDropdown value={viewMode} onChange={handleViewChange} />

            <SearchBar
              value={searchInput}
              onChange={(value) => setSearchInput(value)}
              onClear={() => setSearchInput('')}
            />

            <button
              className="em-clear-btn em-tooltip-trigger"
              type="button"
              title="Borrar filtros"
              data-tooltip="Borrar filtros"
              onClick={handleClear}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
                <polyline points="3 6 5 6 21 6" />
                <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                <path d="M10 11v6" />
                <path d="M14 11v6" />
                <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
              </svg>
            </button>
          </div>

          <div className="em-toolbar-right">
            <GroupTableToggle checked={viewMode === 'tabla'} onToggle={handleGroupToggle} />
            <HeaderUtilityIcons
              onVerBase={() => { setActiveServidor(null); setActiveBase(null); setActiveEsquema(null); setActiveTabla(null); setTablaQ(null); setSearchInput(''); setViewMode('tabla'); setPage(1); }}
              onVerOwners={() => setOwnersModalOpen(true)}
              onVerJerarquia={() => setHierarchyOpen((v) => !v)}
              jerarquiaOpen={hierarchyOpen}
            />
            <SegmentarDropdown
              servidores={filters.servidores || []}
              activeServidor={activeServidor}
              onSelect={(servidor) => {
                setActiveServidor(servidor);
                setActiveBase(null);
                setActiveEsquema(null);
                setActiveTabla(null);
                setPage(1);
              }}
            />
          </div>
        </div>

        <div className="em-separator" />

        <div className="em-subtoolbar mt-4 mb-3">
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
            <button className="em-action-icon em-tooltip-trigger" data-tooltip="Descargar datos como Excel" title="Descargar" type="button">
              <ActionIcon type="download" />
            </button>
            <button className="em-action-icon em-tooltip-trigger" data-tooltip="Importar archivo Excel" title="Subir" type="button">
              <ActionIcon type="upload" />
            </button>
            <button className="em-action-icon em-tooltip-trigger" data-tooltip="Recomendacion automatica de definiciones" title="Sugerencias" type="button">
              <ActionIcon type="idea" />
            </button>
          </div>
        </div>

        {/* Chip de tabla activa — clic en fila (filtro exacto) */}
        {viewMode === 'campo' && activeTabla && (
          <ActiveTablaChip
            tabla={activeTabla.tabla}
            servidor={activeTabla.servidor}
            base={activeTabla.base}
            esquema={activeTabla.esquema}
            onClear={handleClearTabla}
          />
        )}

        {/* Chip de búsqueda por tabla (LIKE) — toggle desde vista tabla con búsqueda activa */}
        {viewMode === 'campo' && !activeTabla && tablaQ && (
          <div className="em-active-tabla-chip">
            <span className="em-active-tabla-path">Tablas que contienen</span>
            <span className="em-active-tabla-name">{tablaQ}</span>
            <button
              className="em-active-tabla-clear"
              type="button"
              title="Ver todos los campos"
              onClick={() => { setTablaQ(null); setPage(1); }}
            >
              <svg viewBox="0 0 16 16" width="14" height="14" fill="none">
                <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        )}
      </div>

      {!apiOk && !loading && (
        <div className="em-alert-error mb-3">
          <strong>No se pudo conectar con la API.</strong> Verifica que el servidor esté corriendo en{' '}
          <code>http://localhost:8000</code>.
          {error && <> — <em>{error}</em></>}
        </div>
      )}

      <DataOwnersModal isOpen={ownersModalOpen} onClose={() => setOwnersModalOpen(false)} />

      <DocumentarCampoModal
        isOpen={editingField !== null}
        campo={editingField}
        onClose={() => setEditingField(null)}
      />

      <DescripcionTablaModal
        isOpen={tablaAction?.action === 'descripcion'}
        row={tablaAction?.row}
        onClose={() => setTablaAction(null)}
      />
      <DataOwnerStewardModal
        isOpen={tablaAction?.action === 'owner' || tablaAction?.action === 'steward'}
        row={tablaAction?.row}
        type={tablaAction?.action === 'owner' ? 'owner' : 'steward'}
        onClose={() => setTablaAction(null)}
      />
      <DimensionesCalidadModal
        isOpen={tablaAction?.action === 'dimensiones'}
        row={tablaAction?.row}
        onClose={() => setTablaAction(null)}
      />
      <ClasificacionTablaModal
        isOpen={tablaAction?.action === 'clasificacion'}
        row={tablaAction?.row}
        onClose={() => setTablaAction(null)}
      />

      <div className={`em-content-row${hierarchyOpen ? ' has-tree' : ''}`}>
        {hierarchyOpen && (
          <HierarchyPanel
            q={debouncedSearch}
            activeServidor={activeServidor}
            activeBase={activeBase}
            activeEsquema={activeEsquema}
            onSelectServidor={(servidor) => {
              const same = activeServidor === servidor && !activeBase;
              setActiveServidor(same ? null : servidor);
              setActiveBase(null);
              setActiveEsquema(null);
              setActiveTabla(null);
              setPage(1);
            }}
            onSelectBase={({ servidor, base }) => {
              const same = activeServidor === servidor && activeBase === base && !activeEsquema;
              setActiveServidor(servidor);
              setActiveBase(same ? null : base);
              setActiveEsquema(null);
              setActiveTabla(null);
              setPage(1);
            }}
            onSelectEsquema={({ servidor, base, esquema }) => {
              const same = activeServidor === servidor && activeBase === base && activeEsquema === esquema;
              setActiveServidor(servidor);
              setActiveBase(base);
              setActiveEsquema(same ? null : esquema);
              setActiveTabla(null);
              setPage(1);
            }}
            onSelectTabla={(row) => handleTableRowClick(row)}
            onClose={() => setHierarchyOpen(false)}
          />
        )}

        <div className="em-content-area">
          <MetadataTable
            items={items}
            viewMode={viewMode}
            loading={loading}
            onTableRowClick={handleTableRowClick}
            onEditField={setEditingField}
            onTablaAction={(action, row) => setTablaAction({ action, row })}
          />

          {!loading && apiOk && (
            <div className="em-footer mt-3">
              <div className="em-count">
                <strong>{total.toLocaleString()}</strong> {total === 1 ? 'resultado' : 'resultados'}
                {activeTabla && <> de <strong>{activeTabla.tabla}</strong></>}
                {!activeTabla && tablaQ && <> en tablas con <strong>{tablaQ}</strong></>}
                {!activeTabla && !tablaQ && activeServidor && <> en <strong>{activeServidor}</strong></>}
              </div>
              <Pagination currentPage={page} totalPages={totalPages} onChange={handlePageChange} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

import { useState, useEffect, useCallback } from 'react';

import { getFilters, getTableView, getFieldView } from '../../services/metadataService.js';
import { useDebounce } from './hooks/useDebounce.js';

import DataOwnersModal        from './components/DataOwnersModal.jsx';
import DocumentarCampoModal   from './components/DocumentarCampoModal.jsx';
import DescripcionTablaModal  from './components/DescripcionTablaModal.jsx';
import DataOwnerStewardModal  from './components/DataOwnerStewardModal.jsx';
import DimensionesCalidadModal from './components/DimensionesCalidadModal.jsx';
import ClasificacionTablaModal from './components/ClasificacionTablaModal.jsx';
import HierarchyPanel         from './components/HierarchyPanel.jsx';
import SearchBar              from './components/SearchBar.jsx';
import MetadataTable          from './components/MetadataTable.jsx';
import SegmentarDropdown      from './components/SegmentarDropdown.jsx';
import Pagination             from './components/Pagination.jsx';
import ViewModeDropdown       from './components/ViewModeDropdown.jsx';
import HeaderUtilityIcons     from './components/HeaderUtilityIcons.jsx';
import ActionIcon             from './components/ActionIcon.jsx';
import GroupTableToggle       from './components/GroupTableToggle.jsx';
import ActiveTablaChip        from './components/ActiveTablaChip.jsx';

import './styles/ExploradorDeMetadatos.css';

const PAGE_SIZE = 20;

export default function ExploradorDeMetadatos() {
  const [viewMode,       setViewMode]       = useState('tabla');
  const [searchInput,    setSearchInput]    = useState('');
  const [activeServidor, setActiveServidor] = useState(null);
  const [activeBase,     setActiveBase]     = useState(null);
  const [activeEsquema,  setActiveEsquema]  = useState(null);
  const [activeTabla,    setActiveTabla]    = useState(null);
  const [tablaQ,         setTablaQ]         = useState(null);
  const [acceptAll,      setAcceptAll]      = useState(false);
  const [ownersModalOpen, setOwnersModalOpen] = useState(false);
  const [hierarchyOpen,  setHierarchyOpen]  = useState(false);
  const [editingField,   setEditingField]   = useState(null);
  const [tablaAction,    setTablaAction]    = useState(null);

  const debouncedSearch = useDebounce(searchInput);

  const [page,       setPage]       = useState(1);
  const [filters,    setFilters]    = useState({ servidores: [], plataformas: [], clasificaciones: [] });
  const [items,      setItems]      = useState([]);
  const [total,      setTotal]      = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading,    setLoading]    = useState(false);
  const [error,      setError]      = useState(null);
  const [apiOk,      setApiOk]      = useState(true);

  useEffect(() => {
    getFilters()
      .then((result) => { setFilters(result); setApiOk(true); })
      .catch(() => setApiOk(false));
  }, []);

  const fetchData = useCallback(() => {
    setLoading(true);
    setError(null);

    let params;

    if (viewMode === 'tabla') {
      params = {
        servidor: activeServidor || undefined,
        base:     activeBase     || undefined,
        esquema:  activeEsquema  || undefined,
        q:        debouncedSearch || undefined,
        page,
        page_size: PAGE_SIZE,
      };
    } else if (activeTabla) {
      params = {
        servidor: activeTabla.servidor || undefined,
        base:     activeTabla.base     || undefined,
        esquema:  activeTabla.esquema  || undefined,
        tabla:    activeTabla.tabla    || undefined,
        q:        debouncedSearch      || undefined,
        page,
        page_size: PAGE_SIZE,
      };
    } else {
      params = {
        servidor: activeServidor || undefined,
        tabla_q:  tablaQ        || undefined,
        q:        debouncedSearch || undefined,
        page,
        page_size: PAGE_SIZE,
      };
    }

    const fetcher = viewMode === 'tabla' ? getTableView : getFieldView;

    fetcher(params)
      .then((result) => {
        setItems(result.items || []);
        setTotal(result.total || 0);
        setTotalPages(result.pages || 1);
        setApiOk(true);
      })
      .catch((err) => { setError(err.message); setApiOk(false); })
      .finally(() => setLoading(false));
  }, [activeServidor, activeBase, activeEsquema, activeTabla, debouncedSearch, page, viewMode, tablaQ]);

  useEffect(() => { fetchData(); }, [fetchData]);

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

  function handleTableRowClick(row) {
    setSearchInput('');
    setTablaQ(null);
    setActiveTabla({ tabla: row.tabla, servidor: row.servidor, base: row.base, esquema: row.esquema });
    setViewMode('campo');
    setPage(1);
  }

  function handleClearTabla() {
    setActiveTabla(null);
    setPage(1);
  }

  function handleViewChange(nextValue) {
    if (nextValue === 'tabla') {
      if (tablaQ) setSearchInput(tablaQ);
      setActiveTabla(null);
      setTablaQ(null);
    }
    setViewMode(nextValue);
    setPage(1);
  }

  function handleGroupToggle() {
    if (viewMode === 'tabla') {
      const currentSearch = searchInput.trim();
      setTablaQ(currentSearch || null);
      setSearchInput('');
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
              onVerBase={() => {
                setActiveServidor(null); setActiveBase(null); setActiveEsquema(null);
                setActiveTabla(null); setTablaQ(null); setSearchInput('');
                setViewMode('tabla'); setPage(1);
              }}
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
                onChange={(e) => setAcceptAll(e.target.checked)}
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

        {viewMode === 'campo' && activeTabla && (
          <ActiveTablaChip
            tabla={activeTabla.tabla}
            servidor={activeTabla.servidor}
            base={activeTabla.base}
            esquema={activeTabla.esquema}
            onClear={handleClearTabla}
          />
        )}

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
              setActiveBase(null); setActiveEsquema(null); setActiveTabla(null); setPage(1);
            }}
            onSelectBase={({ servidor, base }) => {
              const same = activeServidor === servidor && activeBase === base && !activeEsquema;
              setActiveServidor(servidor);
              setActiveBase(same ? null : base);
              setActiveEsquema(null); setActiveTabla(null); setPage(1);
            }}
            onSelectEsquema={({ servidor, base, esquema }) => {
              const same = activeServidor === servidor && activeBase === base && activeEsquema === esquema;
              setActiveServidor(servidor);
              setActiveBase(base);
              setActiveEsquema(same ? null : esquema);
              setActiveTabla(null); setPage(1);
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

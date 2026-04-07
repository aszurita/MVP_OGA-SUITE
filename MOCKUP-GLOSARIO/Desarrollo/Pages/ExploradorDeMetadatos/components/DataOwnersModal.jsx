import { useState, useEffect, useRef, useCallback } from 'react';
import ReactDOM from 'react-dom';
import { getTableView, getOwnerFacets } from '../../../services/metadataService.js';

/* ── Hook redimensionado de columnas ── */
function useResizableColumns(defaults) {
  const [widths, setWidths] = useState(() => [...defaults]);
  const drag = useRef(null);

  function startResize(e, i) {
    e.preventDefault();
    e.stopPropagation();
    const th = e.currentTarget.parentElement;
    const startX = e.clientX;
    const startW = th.getBoundingClientRect().width;
    drag.current = { i, startX, startW };

    function onMove(ev) {
      const d = drag.current;
      if (!d) return;
      const newW = Math.max(50, d.startW + (ev.clientX - d.startX));
      setWidths(prev => { const n = [...prev]; n[d.i] = newW; return n; });
    }
    function onUp() {
      drag.current = null;
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
    }
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
  }

  return { widths, startResize };
}

const PAGE_SIZES = [10, 25, 50, 100];

/* ── Ícono ordenación ── */
function SortIcon({ col, sortCol, sortDir }) {
  const active = sortCol === col;
  return (
    <span className="do-sort-icon">
      <svg width="8" height="12" viewBox="0 0 8 12" fill="none">
        <path d="M4 0L7 4H1L4 0Z" fill={active && sortDir === 'asc' ? '#fff' : 'rgba(255,255,255,0.45)'} />
        <path d="M4 12L1 8H7L4 12Z" fill={active && sortDir === 'desc' ? '#fff' : 'rgba(255,255,255,0.45)'} />
      </svg>
    </span>
  );
}

const COLS = [
  { key: 'nombre_data_owner',   label: 'Data Owner',   defaultW: 160 },
  { key: 'nombre_data_steward', label: 'Data Steward', defaultW: 160 },
  { key: 'plataforma',          label: 'Plataforma',   defaultW: 110 },
  { key: 'servidor',            label: 'Servidor',     defaultW: 120 },
  { key: 'base',                label: 'Base',         defaultW: 120 },
  { key: 'esquema',             label: 'Esquema',      defaultW: 100 },
  { key: 'tabla',               label: 'Tabla',        defaultW: 180 },
];

/* ════════════════════════════════════════════════════
   MODAL EDITAR DATA OWNER / STEWARD
   ════════════════════════════════════════════════════ */
function EditModal({ row, type, owners, stewards, onClose }) {
  const label      = type === 'owner' ? 'Data Owner' : 'Data Steward';
  const fieldKey   = type === 'owner' ? 'nombre_data_owner' : 'nombre_data_steward';
  const currentVal = row[fieldKey] || '';
  const list       = type === 'owner' ? owners : stewards;

  const [selected,  setSelected]  = useState('');
  const [inputText, setInputText] = useState('');
  const [showSug,   setShowSug]   = useState(false);
  const [suggestions, setSugs]    = useState([]);
  const wrapRef = useRef(null);

  useEffect(() => {
    function handler(e) {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setShowSug(false);
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => {
    if (!inputText.trim()) { setSugs([]); setShowSug(false); return; }
    const q = inputText.toUpperCase();
    const matches = list.filter((n) => n.toUpperCase().includes(q)).slice(0, 8);
    setSugs(matches);
    setShowSug(matches.length > 0);
  }, [inputText, list]);

  function pickSuggestion(name) {
    setSelected(name);
    setInputText(name);
    setShowSug(false);
  }

  return (
    <div className="do-overlay do-overlay-sub" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="do-modal do-modal-sm">
        <div className="do-modal-header">
          <h5 className="do-modal-title">Editar {label.toLowerCase()}</h5>
          <button className="do-close" type="button" onClick={onClose}>×</button>
        </div>
        <div className="do-modal-body">
          {/* Chip de tabla */}
          <span className="do-table-chip">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="13" height="13">
              <rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/>
            </svg>
            {[row.servidor, row.base, row.esquema, row.tabla].filter(Boolean).join(' › ')}
          </span>

          <p className="do-edit-current">
            {currentVal
              ? <>{label} actual: <strong>{currentVal}</strong></>
              : `No existe ${label} asignado a la tabla`}
          </p>

          <div className="do-edit-row">
            <span className="do-edit-label">Asignar {label.toLowerCase()}:</span>
            <div className="do-autocomplete-wrap" ref={wrapRef} style={{ flex: 1 }}>
              <input
                type="text"
                className="do-input"
                placeholder={`Buscar ${label}...`}
                value={inputText}
                autoComplete="off"
                onChange={(e) => { setInputText(e.target.value); setSelected(''); }}
              />
              {showSug && (
                <div className="do-suggestions">
                  {suggestions.map((s) => (
                    <button key={s} type="button" className="do-suggestion-item" onClick={() => pickSuggestion(s)}>
                      {s}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="do-edit-actions">
            <button
              className="do-action-btn"
              type="button"
              disabled={!selected}
              onClick={() => { alert(`Solicitud enviada: ${selected}`); onClose(); }}
            >
              Solicitar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════
   MODAL ELIMINAR DATA OWNER / STEWARD
   ════════════════════════════════════════════════════ */
function DeleteModal({ row, type, onClose }) {
  const label    = type === 'owner' ? 'Data Owner' : 'Data Steward';
  const fieldKey = type === 'owner' ? 'nombre_data_owner' : 'nombre_data_steward';
  const val      = row[fieldKey] || '';

  return (
    <div className="do-overlay do-overlay-sub" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="do-modal do-modal-sm">
        <div className="do-modal-header">
          <h5 className="do-modal-title">Eliminar {label}</h5>
          <button className="do-close" type="button" onClick={onClose}>×</button>
        </div>
        <div className="do-modal-body">
          {/* Chip de tabla */}
          <span className="do-table-chip">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="13" height="13">
              <rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/>
            </svg>
            {[row.servidor, row.base, row.esquema, row.tabla].filter(Boolean).join(' › ')}
          </span>

          <p className="do-delete-confirm">
            ¿Desea desasignar a <strong>{val}</strong> de la tabla <strong>{row.tabla}</strong>?
          </p>
          <div className="do-edit-actions">
            <button
              className="do-action-btn"
              type="button"
              onClick={() => { alert('Eliminado correctamente'); onClose(); }}
            >
              Guardar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════
   MENÚ CONTEXTUAL (lápiz de cada fila) — portal
   ════════════════════════════════════════════════════ */
function RowContextMenu({ x, y, onEdit, onDelete, onClose }) {
  const [hovered, setHovered] = useState(null); // 'edit' | 'delete'
  const menuRef = useRef(null);

  useEffect(() => {
    function handler(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) onClose();
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [onClose]);

  return ReactDOM.createPortal(
    <div className="do-ctx-menu" ref={menuRef} style={{ position: 'fixed', left: x, top: y }}>
      {/* Editar */}
      <div
        className={`do-ctx-item do-ctx-has-sub${hovered === 'edit' ? ' is-hovered' : ''}`}
        onMouseEnter={() => setHovered('edit')}
        onMouseLeave={() => setHovered(null)}
      >
        <span>Editar »</span>
        {hovered === 'edit' && (
          <div className="do-ctx-submenu">
            <button type="button" onClick={() => onEdit('owner')}>Data Owner</button>
            <button type="button" onClick={() => onEdit('steward')}>Data Steward</button>
          </div>
        )}
      </div>

      {/* Eliminar */}
      <div
        className={`do-ctx-item do-ctx-has-sub${hovered === 'delete' ? ' is-hovered' : ''}`}
        onMouseEnter={() => setHovered('delete')}
        onMouseLeave={() => setHovered(null)}
      >
        <span>Eliminar »</span>
        {hovered === 'delete' && (
          <div className="do-ctx-submenu">
            <button type="button" onClick={() => onDelete('owner')}>Data Owner</button>
            <button type="button" onClick={() => onDelete('steward')}>Data Steward</button>
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}

/* ════════════════════════════════════════════════════
   MODAL PRINCIPAL
   ════════════════════════════════════════════════════ */
export default function DataOwnersModal({ isOpen, onClose }) {
  const { widths: colWidths, startResize } = useResizableColumns(COLS.map(c => c.defaultW));

  const [ownerType, setOwnerType]     = useState('owner');
  const [dropOpen, setDropOpen]       = useState(false);
  const [inputVal, setInputVal]       = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSug, setShowSug]         = useState(false);
  const [owners, setOwners]           = useState([]);
  const [stewards, setStewards]       = useState([]);
  const [facetsLoaded, setFacetsLoaded] = useState(false);

  const [items, setItems]           = useState([]);
  const [total, setTotal]           = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage]             = useState(1);
  const [pageSize, setPageSize]     = useState(10);
  const [loading, setLoading]       = useState(false);
  const [activeOwnerQ, setActiveOwnerQ] = useState('');
  const [alertMsg, setAlertMsg]     = useState('');

  const [sortCol, setSortCol] = useState(null);
  const [sortDir, setSortDir] = useState('asc');

  // Menú contextual
  const [ctxMenu,  setCtxMenu]  = useState(null); // { row }
  // Modales de editar/eliminar
  const [editModal,   setEditModal]   = useState(null); // { row, type }
  const [deleteModal, setDeleteModal] = useState(null); // { row, type }

  const dropRef  = useRef(null);

  useEffect(() => {
    function handler(e) {
      if (dropRef.current && !dropRef.current.contains(e.target)) setDropOpen(false);
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => {
    if (facetsLoaded) return;
    getOwnerFacets().then(({ owners: o, stewards: s }) => {
      setOwners(o);
      setStewards(s);
      setFacetsLoaded(true);
    });
  }, [facetsLoaded]);

  const fetchData = useCallback((ownerQ, type, pg, size) => {
    setLoading(true);
    getTableView({
      owner_q:    ownerQ || undefined,
      owner_type: ownerQ ? type : undefined,
      page:       pg,
      page_size:  size,
    }).then((res) => {
      setItems(res.items);
      setTotal(res.total);
      setTotalPages(res.pages);
    }).catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    setPage(1);
    setActiveOwnerQ('');
    setInputVal('');
    setAlertMsg('');
    fetchData('', ownerType, 1, pageSize);
  }, [isOpen]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!inputVal.trim()) { setSuggestions([]); setShowSug(false); return; }
    const list = ownerType === 'steward' ? stewards : owners;
    const q = inputVal.toUpperCase();
    const matches = list.filter((n) => n.toUpperCase().includes(q)).slice(0, 10);
    setSuggestions(matches);
    setShowSug(matches.length > 0);
  }, [inputVal, ownerType, owners, stewards]);

  function handleSearch() {
    setActiveOwnerQ(inputVal.trim());
    setPage(1);
    fetchData(inputVal.trim(), ownerType, 1, pageSize);
    setShowSug(false);
  }

  function handleTodos() {
    setInputVal('');
    setActiveOwnerQ('');
    setAlertMsg('');
    setPage(1);
    fetchData('', ownerType, 1, pageSize);
    setShowSug(false);
  }

  function handleSuggestionClick(name) {
    setInputVal(name);
    setShowSug(false);
    setActiveOwnerQ(name);
    setPage(1);
    fetchData(name, ownerType, 1, pageSize);
  }

  function handleTypeChange(type) {
    setOwnerType(type);
    setDropOpen(false);
    setInputVal('');
    setActiveOwnerQ('');
    setPage(1);
    fetchData('', type, 1, pageSize);
  }

  function handlePageSizeChange(newSize) {
    setPageSize(newSize);
    setPage(1);
    fetchData(activeOwnerQ, ownerType, 1, newSize);
  }

  function handlePageChange(pg) {
    setPage(pg);
    fetchData(activeOwnerQ, ownerType, pg, pageSize);
  }

  function handleSort(key) {
    const nextDir = sortCol === key && sortDir === 'asc' ? 'desc' : 'asc';
    setSortCol(key);
    setSortDir(nextDir);
  }

  /* ── Pencil: abrir menú contextual ── */
  function handlePencilClick(e, row) {
    e.stopPropagation();
    if (ctxMenu?.row === row) { setCtxMenu(null); return; }
    const rect = e.currentTarget.getBoundingClientRect();
    setCtxMenu({ row, x: rect.left, y: rect.bottom + 4 });
  }

  /* ── Editar ── */
  function handleEdit(type) {
    setEditModal({ row: ctxMenu.row, type });
    setCtxMenu(null);
  }

  /* ── Eliminar ── */
  function handleDelete(type) {
    const fieldKey = type === 'owner' ? 'nombre_data_owner' : 'nombre_data_steward';
    const val = ctxMenu.row[fieldKey] || '';
    if (!val.trim()) {
      setAlertMsg('¡Alerta! El campo que desea eliminar se encuentra vacío.');
      setCtxMenu(null);
      return;
    }
    setDeleteModal({ row: ctxMenu.row, type });
    setCtxMenu(null);
  }

  const totalColW = colWidths.reduce((s, w) => s + (w || 0), 0);

  const sorted = [...items].sort((a, b) => {
    if (!sortCol) return 0;
    const l = (a[sortCol] || '').toString().toLowerCase();
    const r = (b[sortCol] || '').toString().toLowerCase();
    if (l < r) return sortDir === 'asc' ? -1 : 1;
    if (l > r) return sortDir === 'asc' ? 1 : -1;
    return 0;
  });

  function buildPages() {
    const pages = [];
    const delta = 2;
    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= page - delta && i <= page + delta)) {
        pages.push(i);
      } else if (pages[pages.length - 1] !== '...') {
        pages.push('...');
      }
    }
    return pages;
  }

  if (!isOpen) return null;

  const from = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const to   = Math.min(page * pageSize, total);

  return (
    <>
      <div className="do-overlay" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
        <div className="do-modal">
          {/* Header */}
          <div className="do-modal-header">
            <h5 className="do-modal-title">Data Owner / Data Steward</h5>
            <button className="do-close" type="button" onClick={onClose}>×</button>
          </div>

          {/* Body */}
          <div className="do-modal-body">

            {/* Alerta */}
            {alertMsg && (
              <div className="do-alert">
                <strong>Alerta!</strong> {alertMsg.replace('¡Alerta! ', '')}
                <button type="button" className="do-alert-close" onClick={() => setAlertMsg('')}>×</button>
              </div>
            )}

            {/* Fila de búsqueda */}
            <div className="do-search-row">
              <div className="do-type-dropdown" ref={dropRef}>
                <button
                  className={`do-type-btn${dropOpen ? ' is-open' : ''}`}
                  type="button"
                  onClick={() => setDropOpen((v) => !v)}
                >
                  {ownerType === 'owner' ? 'Data Owner' : 'Data Steward'}
                  <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                    <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </button>
                {dropOpen && (
                  <div className="do-type-menu">
                    <button type="button" onClick={() => handleTypeChange('owner')}>Data Owner</button>
                    <button type="button" onClick={() => handleTypeChange('steward')}>Data Steward</button>
                  </div>
                )}
              </div>

              <div className="do-autocomplete-wrap">
                <input
                  type="text"
                  className="do-input"
                  placeholder={`Buscar por ${ownerType === 'owner' ? 'Data Owner' : 'Data Steward'}...`}
                  value={inputVal}
                  onChange={(e) => setInputVal(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  autoComplete="off"
                />
                {showSug && (
                  <div className="do-suggestions">
                    {suggestions.map((s) => (
                      <button key={s} type="button" className="do-suggestion-item" onClick={() => handleSuggestionClick(s)}>
                        {s}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <button className="do-icon-btn" type="button" title="Buscar" onClick={handleSearch}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
                  <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
                </svg>
              </button>

              <div style={{ flex: 1 }} />

              <div className="do-todos-wrap">
                <button className="do-icon-btn do-todos-btn" type="button" onClick={handleTodos}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="28" height="28">
                    <path d="M16 21v-1.2a4.8 4.8 0 0 0-4.8-4.8H8.8A4.8 4.8 0 0 0 4 19.8V21" />
                    <circle cx="10" cy="7" r="3.3" />
                    <path d="M20 21v-1a4 4 0 0 0-3.2-3.92" />
                    <path d="M15.8 4.2a3.1 3.1 0 0 1 0 5.6" />
                  </svg>
                </button>
                <span className="do-todos-tooltip">Todos</span>
              </div>
            </div>

            {/* Botón descarga */}
            <div className="do-dl-row">
              <button className="do-dl-btn" type="button" title="Descargar Excel">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
                  <path d="M12 4v12" /><path d="m7 12 5 5 5-5" /><path d="M4 20h16" />
                </svg>
              </button>
            </div>

            <div className="do-separator" />

            {/* Tabla */}
            <div className="do-table-wrap">
              {loading ? (
                <div className="do-spinner">
                  <div className="spinner-border" style={{ width: '1.4rem', height: '1.4rem', color: '#D6006D' }} role="status" />
                  <span>Cargando...</span>
                </div>
              ) : (
                <table className="do-table" style={{ tableLayout: 'fixed', width: totalColW || '100%' }}>
                  <thead>
                    <tr>
                      {COLS.map((col, i) => (
                        <th
                          key={col.key}
                          onClick={() => handleSort(col.key)}
                          className="sortable"
                          style={{ width: colWidths[i], minWidth: colWidths[i] }}
                        >
                          {col.label}
                          <SortIcon col={col.key} sortCol={sortCol} sortDir={sortDir} />
                          <span
                            className="col-resize-handle"
                            onMouseDown={(e) => startResize(e, i)}
                            onClick={(e) => e.stopPropagation()}
                          />
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {sorted.length === 0 ? (
                      <tr><td colSpan={COLS.length} className="do-empty">No hay datos disponibles en la tabla</td></tr>
                    ) : sorted.map((row, i) => (
                      <tr key={`${row.llave_tabla || i}`}>
                        <td>
                          <span className="do-pencil-wrap">
                            {/* Lápiz con menú contextual */}
                            <span className="do-pencil-btn-wrap">
                              <button
                                type="button"
                                className="do-pencil-btn"
                                onClick={(e) => handlePencilClick(e, row)}
                              >
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="13" height="13">
                                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4Z" />
                                </svg>
                              </button>
                              {ctxMenu?.row === row && (
                                <RowContextMenu
                                  x={ctxMenu.x}
                                  y={ctxMenu.y}
                                  onEdit={handleEdit}
                                  onDelete={handleDelete}
                                  onClose={() => setCtxMenu(null)}
                                />
                              )}
                            </span>
                            {row.nombre_data_owner || ''}
                          </span>
                        </td>
                        <td>{row.nombre_data_steward || ''}</td>
                        <td>{row.plataforma || ''}</td>
                        <td>{row.servidor || ''}</td>
                        <td>{row.base || ''}</td>
                        <td>{row.esquema || ''}</td>
                        <td>{row.tabla || ''}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            {/* Footer paginación */}
            <div className="do-footer">
              <span className="do-info">Mostrando {from} a {to} de {total.toLocaleString()} registros</span>
              <div className="do-pagination">
                <button type="button" onClick={() => handlePageChange(page - 1)} disabled={page <= 1}>{'<'}</button>
                {buildPages().map((pg, idx) =>
                  pg === '...'
                    ? <span key={`sep-${idx}`} className="do-page-sep">…</span>
                    : <button key={pg} type="button" className={page === pg ? 'active' : ''} onClick={() => handlePageChange(pg)}>{pg}</button>
                )}
                <button type="button" onClick={() => handlePageChange(page + 1)} disabled={page >= totalPages}>{'>'}</button>
              </div>
              <label className="do-pagesize">
                Mostrar
                <select value={pageSize} onChange={(e) => handlePageSizeChange(Number(e.target.value))}>
                  {PAGE_SIZES.map((n) => <option key={n} value={n}>{n}</option>)}
                </select>
                registros
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Editar */}
      {editModal && (
        <EditModal
          row={editModal.row}
          type={editModal.type}
          owners={owners}
          stewards={stewards}
          onClose={() => setEditModal(null)}
        />
      )}

      {/* Modal Eliminar */}
      {deleteModal && (
        <DeleteModal
          row={deleteModal.row}
          type={deleteModal.type}
          onClose={() => setDeleteModal(null)}
        />
      )}
    </>
  );
}

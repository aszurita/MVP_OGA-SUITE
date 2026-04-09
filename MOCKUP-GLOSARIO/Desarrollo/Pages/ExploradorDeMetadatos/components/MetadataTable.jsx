import { useState, useRef, useEffect } from 'react';
import ReactDOM from 'react-dom';

/* ── Hook redimensionado de columnas ── */
function useResizableColumns(defaults) {
  const [widths, setWidths] = useState(() => [...defaults]);
  const drag = useRef(null);

  // Resetear cuando cambia el número/set de columnas (ej. tabla ↔ campo)
  useEffect(() => {
    setWidths([...defaults]);
  }, [defaults.join(',')]); // eslint-disable-line react-hooks/exhaustive-deps

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

function SortIcon({ col, sortCol, sortDir }) {
  const isActive = sortCol === col;
  return (
    <span className="sort-icon" style={{ lineHeight: 1 }}>
      <svg width="8" height="12" viewBox="0 0 8 12" fill="none">
        <path d="M4 0L7 4H1L4 0Z" fill={isActive && sortDir === 'asc' ? '#fff' : 'rgba(255,255,255,0.45)'} />
        <path d="M4 12L1 8H7L4 12Z" fill={isActive && sortDir === 'desc' ? '#fff' : 'rgba(255,255,255,0.45)'} />
      </svg>
    </span>
  );
}

function ClasificacionBadge({ value }) {
  if (!value || !value.trim()) return null;
  return <span className="em-badge em-badge-clasificacion">{value}</span>;
}

function AvanceCell({ value = '0' }) {
  const progress = Number.parseInt(value, 10) || 0;
  return <span>{progress}%</span>;
}

/* ── Menú contextual del lápiz de Tabla ── */
function TablaContextMenu({ x, y, onAction, onClose }) {
  const [profilingHover, setProfilingHover] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    function handler(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) onClose();
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [onClose]);

  const plainItems = [
    { action: 'descripcion', label: 'Descripción tabla'      },
    { action: 'owner',       label: 'Data Owner'             },
    { action: 'steward',     label: 'Data Steward'           },
    { action: 'dimensiones', label: 'Dimensiones de Calidad' },
    { action: 'clasificacion', label: 'Clasificación'        },
  ];

  return ReactDOM.createPortal(
    /* onClick + onMouseDown detienen la burbuja por el árbol React
       (los portales burbujean por el árbol React aunque estén en document.body) */
    <div
      className="do-ctx-menu"
      ref={menuRef}
      style={{ position: 'fixed', left: x, top: y, zIndex: 9999 }}
      onClick={(e) => e.stopPropagation()}
      onMouseDown={(e) => e.stopPropagation()}
    >
      {plainItems.map((item) => (
        <div
          key={item.action}
          role="button"
          tabIndex={0}
          className="do-ctx-item"
          onClick={() => { onAction(item.action); onClose(); }}
          onKeyDown={(e) => e.key === 'Enter' && (onAction(item.action), onClose())}
        >
          {item.label}
        </div>
      ))}

      {/* Profiling con submenú */}
      <div
        className={`do-ctx-item do-ctx-has-sub${profilingHover ? ' is-hovered' : ''}`}
        onMouseEnter={() => setProfilingHover(true)}
        onMouseLeave={() => setProfilingHover(false)}
      >
        <span>Profiling</span>
        {profilingHover && (
          <div className="do-ctx-submenu">
            <button type="button" onClick={() => { onAction('generar-profiling'); onClose(); }}>
              Generar Profiling
            </button>
            <button type="button" onClick={() => { onAction('ver-profiling'); onClose(); }}>
              Ver Profiling
            </button>
          </div>
        )}
      </div>

      <div
        role="button"
        tabIndex={0}
        className="do-ctx-item"
        onClick={() => { onAction('linaje'); onClose(); }}
        onKeyDown={(e) => e.key === 'Enter' && (onAction('linaje'), onClose())}
      >
        Ver linaje
      </div>
    </div>,
    document.body
  );
}

function TablaCell({ tabla, dataOwner, dataSteward, row, onPencilClick }) {
  const hasHover = dataOwner || dataSteward;
  const [tooltipPos, setTooltipPos] = useState(null);
  const wrapRef   = useRef(null);
  const pencilRef = useRef(null);

  function handleMouseEnter() {
    if (!wrapRef.current) return;
    const r = wrapRef.current.getBoundingClientRect();
    setTooltipPos({ x: r.left, y: r.bottom + 6 });
  }
  function handleMouseLeave() { setTooltipPos(null); }

  function handlePencilClick(e) {
    e.stopPropagation();
    e.preventDefault();
    onPencilClick && onPencilClick(row, pencilRef.current.getBoundingClientRect());
  }

  return (
    <td className="em-cell-emphasis">
      <span className="em-field-pencil-wrap">
        <button
          ref={pencilRef}
          type="button"
          className="do-pencil-btn em-field-pencil-btn"
          title={`Opciones de tabla ${tabla}`}
          onClick={handlePencilClick}
          onMouseDown={(e) => e.stopPropagation()}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="13" height="13">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4Z" />
          </svg>
        </button>
        <span
          ref={wrapRef}
          onMouseEnter={hasHover ? handleMouseEnter : undefined}
          onMouseLeave={hasHover ? handleMouseLeave : undefined}
          style={{ cursor: hasHover ? 'default' : undefined }}
        >
          {tabla || '-'}
        </span>
      </span>

      {tooltipPos && hasHover && ReactDOM.createPortal(
        <div className="em-tabla-tooltip-portal" style={{ left: tooltipPos.x, top: tooltipPos.y }}>
          {dataOwner && (
            <span className="em-tooltip-row">
              <span className="em-tooltip-label">Data Owner</span>
              <span className="em-tooltip-value">{dataOwner}</span>
            </span>
          )}
          {dataSteward && (
            <span className="em-tooltip-row">
              <span className="em-tooltip-label">Data Steward</span>
              <span className="em-tooltip-value">{dataSteward}</span>
            </span>
          )}
        </div>,
        document.body
      )}
    </td>
  );
}

// ── Columnas vista nivel tabla ────────────────────────────────────────────────
const TABLE_COLS = [
  { key: 'plataforma',    label: 'Plataforma',    defaultW: 120 },
  { key: 'servidor',      label: 'Servidor',      defaultW: 140 },
  { key: 'base',          label: 'Base',          defaultW: 130 },
  { key: 'esquema',       label: 'Esquema',       defaultW: 130 },
  { key: 'tabla',         label: 'Tabla',         defaultW: 180 },
  { key: 'descripcion',   label: 'Descripción',   defaultW: 140 },
  { key: 'clasificacion', label: 'Clasificación', defaultW: 140 },
  { key: 'avance',        label: 'Avance',        defaultW: 120 },
];

// ── Columnas vista nivel campo ────────────────────────────────────────────────
const FIELD_COLS = [
  { key: 'campo',        label: 'Campo',        defaultW: 130 },
  { key: 'codigo',       label: 'Código',       defaultW: 100 },
  { key: 'atributo',     label: 'Atributo',     defaultW: 100 },
  { key: 'definicion',   label: 'Definición',   defaultW: 200 },
  { key: 'plataforma',   label: 'Plataforma',   defaultW: 110 },
  { key: 'servidor',     label: 'Servidor',     defaultW: 110 },
  { key: 'base',         label: 'Base',         defaultW: 110 },
  { key: 'esquema',      label: 'Esquema',      defaultW: 100 },
  { key: 'tabla',        label: 'Tabla',        defaultW: 160 },
  { key: 'tipo',         label: 'Tipo',         defaultW: 90  },
  { key: 'largo',        label: 'Largo',        defaultW: 70  },
  { key: 'permite_null', label: 'Permite Null', defaultW: 100 },
];

function TableViewBody({ items, onRowClick, onPencilClick }) {
  return (
    <tbody>
      {items.map((row, index) => (
        <tr
          key={`${row.llave_tabla || row.tabla || 'tabla'}-${index}`}
          className="em-row-clickable"
          onClick={() => onRowClick && onRowClick(row)}
          title={`Ver campos de ${row.tabla}`}
        >
          <td>{row.plataforma || '-'}</td>
          <td>{row.servidor || '-'}</td>
          <td>{row.base || '-'}</td>
          <td>{row.esquema || '-'}</td>
          <TablaCell
            tabla={row.tabla}
            dataOwner={row.nombre_data_owner}
            dataSteward={row.nombre_data_steward}
            row={row}
            onPencilClick={onPencilClick}
          />
          <td title={row.descripcion}>{row.descripcion || '-'}</td>
          <td><ClasificacionBadge value={row.clasificacion} /></td>
          <td><AvanceCell value={row.avance} /></td>
        </tr>
      ))}
    </tbody>
  );
}

function FieldViewBody({ items, onEditField }) {
  return (
    <tbody>
      {items.map((row, index) => (
        <tr key={row.id || `${row.llave_unica || row.campo || 'campo'}-${index}`}>
          <td className="em-cell-emphasis">
            <span className="em-field-pencil-wrap">
              <button
                type="button"
                className="do-pencil-btn em-field-pencil-btn"
                title={`Documentar campo ${row.campo}`}
                onClick={(e) => { e.stopPropagation(); onEditField && onEditField(row); }}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="13" height="13">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4Z" />
                </svg>
              </button>
              {row.campo || '-'}
            </span>
          </td>
          <td>{row.codigo || ''}</td>
          <td title={row.atributo}>{row.atributo || ''}</td>
          <td title={row.definicion}>{row.definicion || ''}</td>
          <td>{row.plataforma || '-'}</td>
          <td>{row.servidor || '-'}</td>
          <td>{row.base || '-'}</td>
          <td>{row.esquema || '-'}</td>
          <td>{row.tabla || '-'}</td>
          <td>{row.tipo || '-'}</td>
          <td>{row.largo || '-'}</td>
          <td>{row.permite_null || '-'}</td>
        </tr>
      ))}
    </tbody>
  );
}

// Altura estimada del menú (7 ítems × ~34px + 8px padding)
const MENU_H = 260;

export default function MetadataTable({ items = [], viewMode = 'tabla', loading = false, onTableRowClick, onEditField, onTablaAction }) {
  const [sortCol,   setSortCol]   = useState(null);
  const [sortDir,   setSortDir]   = useState('asc');
  // Un solo menú activo a la vez — estado centralizado
  const [tablaMenu, setTablaMenu] = useState(null); // { row, x, y }

  function handlePencilClick(row, triggerRect) {
    // Si ya estaba abierto para esta fila, lo cierra (toggle)
    if (tablaMenu?.row === row) { setTablaMenu(null); return; }
    const spaceBelow = window.innerHeight - triggerRect.bottom;
    const y = spaceBelow >= MENU_H
      ? triggerRect.bottom + 4                   // cabe abajo
      : triggerRect.top - MENU_H - 4;            // abre hacia arriba
    setTablaMenu({ row, x: triggerRect.left, y });
  }

  const cols = viewMode === 'tabla' ? TABLE_COLS : FIELD_COLS;
  const defaultWidths = cols.map(c => c.defaultW);
  const { widths: colWidths, startResize } = useResizableColumns(defaultWidths);

  function handleSort(key) {
    if (sortCol === key) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    } else {
      setSortCol(key);
      setSortDir('asc');
    }
  }

  const sorted = [...items].sort((a, b) => {
    if (!sortCol) return 0;
    const l = (a[sortCol] || '').toString().toLowerCase();
    const r = (b[sortCol] || '').toString().toLowerCase();
    if (l < r) return sortDir === 'asc' ? -1 : 1;
    if (l > r) return sortDir === 'asc' ? 1 : -1;
    return 0;
  });

  if (loading) {
    return (
      <div className="em-spinner">
        <div className="spinner-border" role="status" style={{ width: '1.5rem', height: '1.5rem', color: '#D6006D' }} />
        <span>Cargando datos...</span>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="em-empty">
        <i className="iconsminds-magnifi-glass" />
        <p style={{ fontWeight: 600, marginBottom: 4 }}>No se encontraron registros</p>
        <p style={{ fontSize: '0.82rem' }}>Ajusta los filtros o el termino de busqueda.</p>
      </div>
    );
  }

  const totalW = colWidths.reduce((s, w) => s + (w || 0), 0);

  return (
    <div
      className={`em-table-wrap ${viewMode === 'campo' ? 'em-table-wrap-campo' : 'em-table-wrap-tabla'}`}
      style={{ overflowX: 'auto', maxWidth: '100%' }}
    >
      <table
        className={`em-table ${viewMode === 'campo' ? 'em-table-campo' : 'em-table-tabla'}`}
        style={{ tableLayout: 'fixed', width: totalW, minWidth: totalW }}
      >
        <colgroup>
          {colWidths.map((w, i) => <col key={i} style={{ width: w }} />)}
        </colgroup>
        <thead>
          <tr>
            {cols.map((col, i) => (
              <th
                key={col.key}
                className={`sortable${sortCol === col.key ? ` sort-${sortDir}` : ''}`}
                onClick={() => handleSort(col.key)}
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
        {viewMode === 'tabla'
          ? <TableViewBody items={sorted} onRowClick={onTableRowClick} onPencilClick={handlePencilClick} />
          : <FieldViewBody items={sorted} onEditField={onEditField} />
        }
      </table>

      {/* Menú único — se monta una sola vez para toda la tabla */}
      {tablaMenu && (
        <TablaContextMenu
          x={tablaMenu.x}
          y={tablaMenu.y}
          onAction={(action) => { onTablaAction && onTablaAction(action, tablaMenu.row); setTablaMenu(null); }}
          onClose={() => setTablaMenu(null)}
        />
      )}
    </div>
  );
}

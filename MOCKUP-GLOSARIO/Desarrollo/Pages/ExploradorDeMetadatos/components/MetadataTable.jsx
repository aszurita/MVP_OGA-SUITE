import { useState, useRef, useEffect } from 'react';

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

function TablaCell({ tabla, dataOwner, dataSteward }) {
  const hasHover = dataOwner || dataSteward;
  return (
    <td className="em-cell-emphasis em-cell-tabla-hover">
      <span className="em-tabla-hover-wrap">
        {tabla || '-'}
        {hasHover && (
          <span className="em-tabla-tooltip">
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
          </span>
        )}
      </span>
    </td>
  );
}

// ── Columnas vista nivel tabla ────────────────────────────────────────────────
const TABLE_COLS = [
  { key: 'plataforma',    label: 'Plataforma',    defaultW: 130 },
  { key: 'servidor',      label: 'Servidor',      defaultW: 130 },
  { key: 'base',          label: 'Base',          defaultW: 180 },
  { key: 'esquema',       label: 'Esquema',       defaultW: 100 },
  { key: 'tabla',         label: 'Tabla',         defaultW: 200 },
  { key: 'descripcion',   label: 'Descripción',   defaultW: 300 },
  { key: 'clasificacion', label: 'Clasificación', defaultW: 110 },
  { key: 'avance',        label: 'Avance',        defaultW: 110 },
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

function TableViewBody({ items, onRowClick }) {
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
          <TablaCell tabla={row.tabla} dataOwner={row.nombre_data_owner} dataSteward={row.nombre_data_steward} />
          <td title={row.descripcion}>{row.descripcion || '-'}</td>
          <td><ClasificacionBadge value={row.clasificacion} /></td>
          <td><AvanceCell value={row.avance} /></td>
        </tr>
      ))}
    </tbody>
  );
}

function FieldViewBody({ items }) {
  return (
    <tbody>
      {items.map((row, index) => (
        <tr key={row.id || `${row.llave_unica || row.campo || 'campo'}-${index}`}>
          <td className="em-cell-emphasis">{row.campo || '-'}</td>
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

export default function MetadataTable({ items = [], viewMode = 'tabla', loading = false, onTableRowClick }) {
  const [sortCol, setSortCol] = useState(null);
  const [sortDir, setSortDir] = useState('asc');

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
          ? <TableViewBody items={sorted} onRowClick={onTableRowClick} />
          : <FieldViewBody items={sorted} />
        }
      </table>
    </div>
  );
}

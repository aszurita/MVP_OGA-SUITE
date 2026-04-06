import { useState } from 'react';

function SortIcon({ col, sortCol, sortDir }) {
  const isActive = sortCol === col;

  return (
    <span className="sort-icon" style={{ lineHeight: 1 }}>
      <svg width="8" height="12" viewBox="0 0 8 12" fill="none">
        <path d="M4 0L7 4H1L4 0Z" fill={isActive && sortDir === 'asc' ? '#D6006D' : '#CFCFD6'} />
        <path d="M4 12L1 8H7L4 12Z" fill={isActive && sortDir === 'desc' ? '#D6006D' : '#CFCFD6'} />
      </svg>
    </span>
  );
}

/** Badge de clasificación — valores reales de la BD: OFICIAL, TRABAJO, DESUSO, TEMPORAL */
function ClasificacionBadge({ value }) {
  const map = {
    OFICIAL:    'em-badge-oficial',
    TRABAJO:    'em-badge-trabajo',
    DESUSO:     'em-badge-desuso',
    TEMPORAL:   'em-badge-temporal',
  };

  const key = (value || '').toUpperCase();
  const className = map[key] || 'em-badge-temporal';
  return <span className={`em-badge ${className}`}>{value || '-'}</span>;
}

function AvanceCell({ value = '0' }) {
  const progress = Number.parseInt(value, 10) || 0;
  const label = value && value !== '0' ? `${value}%` : `${progress}%`;

  return (
    <div className="em-avance">
      <div className="em-avance-bar">
        <div className="em-avance-bar-fill" style={{ width: `${progress}%` }} />
      </div>
      <span>{label}</span>
    </div>
  );
}

/**
 * Tooltip de hover para la celda Tabla en vista nivel-tabla.
 * Muestra Data Owner y Data Steward al pasar el cursor.
 */
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
  { key: 'plataforma',   label: 'Plataforma' },
  { key: 'servidor',     label: 'Servidor' },
  { key: 'base',         label: 'Base' },
  { key: 'esquema',      label: 'Esquema' },
  { key: 'tabla',        label: 'Tabla' },
  { key: 'descripcion',  label: 'Descripción' },
  { key: 'clasificacion',label: 'Clasificación' },
  { key: 'avance',       label: 'Avance' },
];

// ── Columnas vista nivel campo ────────────────────────────────────────────────
const FIELD_COLS = [
  { key: 'campo',        label: 'Campo' },
  { key: 'codigo',       label: 'Código' },
  { key: 'atributo',     label: 'Atributo' },
  { key: 'definicion',   label: 'Definición' },
  { key: 'plataforma',   label: 'Plataforma' },
  { key: 'servidor',     label: 'Servidor' },
  { key: 'base',         label: 'Base' },
  { key: 'esquema',      label: 'Esquema' },
  { key: 'tabla',        label: 'Tabla' },
  { key: 'tipo',         label: 'Tipo' },
  { key: 'largo',        label: 'Largo' },
  { key: 'permite_null', label: 'Permite Null' },
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
          <TablaCell
            tabla={row.tabla}
            dataOwner={row.nombre_data_owner}
            dataSteward={row.nombre_data_steward}
          />
          <td className="em-cell-detail" title={row.descripcion}>{row.descripcion || '-'}</td>
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
          <td className="em-cell-detail" title={row.atributo}>{row.atributo || ''}</td>
          <td className="em-cell-detail" title={row.definicion}>{row.definicion || ''}</td>
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

  function handleSort(key) {
    if (sortCol === key) {
      setSortDir((current) => (current === 'asc' ? 'desc' : 'asc'));
      return;
    }

    setSortCol(key);
    setSortDir('asc');
  }

  const cols = viewMode === 'tabla' ? TABLE_COLS : FIELD_COLS;
  const sorted = [...items].sort((a, b) => {
    if (!sortCol) return 0;

    const left = (a[sortCol] || '').toString().toLowerCase();
    const right = (b[sortCol] || '').toString().toLowerCase();

    if (left < right) return sortDir === 'asc' ? -1 : 1;
    if (left > right) return sortDir === 'asc' ? 1 : -1;
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

  return (
    <div className={`em-table-wrap ${viewMode === 'campo' ? 'em-table-wrap-campo' : 'em-table-wrap-tabla'}`}>
      <table className={`em-table ${viewMode === 'campo' ? 'em-table-campo' : 'em-table-tabla'}`}>
        <thead>
          <tr>
            {cols.map((col) => (
              <th
                key={col.key}
                className={`sortable${sortCol === col.key ? ` sort-${sortDir}` : ''}`}
                onClick={() => handleSort(col.key)}
              >
                {col.label}
                <SortIcon col={col.key} sortCol={sortCol} sortDir={sortDir} />
              </th>
            ))}
          </tr>
        </thead>
        {viewMode === 'tabla' ? <TableViewBody items={sorted} onRowClick={onTableRowClick} /> : <FieldViewBody items={sorted} />}
      </table>
    </div>
  );
}

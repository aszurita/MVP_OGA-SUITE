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

function ClasificacionBadge({ value }) {
  const map = {
    Temporal: 'em-badge-temporal',
    Publica: 'em-badge-publica',
    'Pública': 'em-badge-publica',
    Confidencial: 'em-badge-confidencial',
    Interna: 'em-badge-interna',
  };

  const className = map[value] || 'em-badge-temporal';
  return <span className={`em-badge ${className}`}>{value || 'Temporal'}</span>;
}

function AvanceCell({ value = '0%' }) {
  const progress = Number.parseInt(value, 10) || 0;

  return (
    <div className="em-avance">
      <div className="em-avance-bar">
        <div className="em-avance-bar-fill" style={{ width: `${progress}%` }} />
      </div>
      <span>{value}</span>
    </div>
  );
}

const TABLE_COLS = [
  { key: 'plataforma', label: 'Plataforma' },
  { key: 'servidor', label: 'Servidor' },
  { key: 'base', label: 'Base' },
  { key: 'esquema', label: 'Esquema' },
  { key: 'tabla', label: 'Tabla' },
  { key: 'descripcion', label: 'Descripcion' },
  { key: 'clasificacion', label: 'Clasificacion' },
  { key: 'avance', label: 'Avance' },
];

const FIELD_COLS = [
  { key: 'campo', label: 'Campo' },
  { key: 'codigo', label: 'Codigo' },
  { key: 'atributo', label: 'Atributo' },
  { key: 'definicion', label: 'Definicion' },
  { key: 'plataforma', label: 'Plataforma' },
  { key: 'servidor', label: 'Servidor' },
  { key: 'base', label: 'Base' },
  { key: 'esquema', label: 'Esquema' },
  { key: 'tabla', label: 'Tabla' },
];

function TableViewBody({ items }) {
  return (
    <tbody>
      {items.map((row, index) => (
        <tr key={`${row.tabla || 'tabla'}-${index}`}>
          <td>{row.plataforma || '-'}</td>
          <td>{row.servidor || '-'}</td>
          <td>{row.base || '-'}</td>
          <td>{row.esquema || '-'}</td>
          <td className="em-cell-emphasis">{row.tabla || '-'}</td>
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
        <tr key={row.id || `${row.campo || 'campo'}-${index}`}>
          <td className="em-cell-emphasis">{row.campo || '-'}</td>
          <td>{row.codigo || '-'}</td>
          <td className="em-cell-detail" title={row.atributo}>{row.atributo || '-'}</td>
          <td className="em-cell-detail" title={row.definicion}>{row.definicion || '-'}</td>
          <td>{row.plataforma || '-'}</td>
          <td>{row.servidor || '-'}</td>
          <td>{row.base || '-'}</td>
          <td>{row.esquema || '-'}</td>
          <td>{row.tabla || '-'}</td>
        </tr>
      ))}
    </tbody>
  );
}

export default function MetadataTable({ items = [], viewMode = 'tabla', loading = false }) {
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
        {viewMode === 'tabla' ? <TableViewBody items={sorted} /> : <FieldViewBody items={sorted} />}
      </table>
    </div>
  );
}

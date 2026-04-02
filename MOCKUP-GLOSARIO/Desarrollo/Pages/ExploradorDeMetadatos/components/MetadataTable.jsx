import { useState } from 'react';

/* ── Ícono de ordenamiento ──────────────────────────── */
function SortIcon({ col, sortCol, sortDir }) {
  const isActive = sortCol === col;
  return (
    <span className="sort-icon" style={{ lineHeight: 1 }}>
      <svg width="8" height="12" viewBox="0 0 8 12" fill="none">
        <path d="M4 0L7 4H1L4 0Z" fill={isActive && sortDir === 'asc' ? '#D2006E' : '#bbb'} />
        <path d="M4 12L1 8H7L4 12Z" fill={isActive && sortDir === 'desc' ? '#D2006E' : '#bbb'} />
      </svg>
    </span>
  );
}

/* ── Fila de tabla (vista Tabla) ─────────────────────── */
function ClasificacionBadge({ value }) {
  const map = {
    Temporal: 'em-badge-temporal',
    Pública: 'em-badge-publica',
    Publica: 'em-badge-publica',
    Confidencial: 'em-badge-confidencial',
    Interna: 'em-badge-interna',
  };
  const cls = map[value] || 'em-badge-temporal';
  return <span className={`em-badge ${cls}`}>{value || 'Temporal'}</span>;
}

function AvanceCell({ value = '0%' }) {
  const num = parseInt(value) || 0;
  return (
    <div className="em-avance">
      <div className="em-avance-bar">
        <div className="em-avance-bar-fill" style={{ width: `${num}%` }} />
      </div>
      <span>{value}</span>
    </div>
  );
}

/* ── Tabla vista "Tabla" ─────────────────────────────── */
const TABLE_COLS = [
  { key: 'plataforma', label: 'Plataforma' },
  { key: 'servidor', label: 'Servidor' },
  { key: 'base', label: 'Base' },
  { key: 'esquema', label: 'Esquema' },
  { key: 'tabla', label: 'Tabla' },
  { key: 'descripcion', label: 'Descripción' },
  { key: 'clasificacion', label: 'Clasificación' },
  { key: 'avance', label: 'Avance' },
];

function TableViewBody({ items }) {
  return (
    <tbody>
      {items.map((row, i) => (
        <tr key={i}>
          <td>{row.plataforma || '—'}</td>
          <td>{row.servidor || '—'}</td>
          <td>{row.base || '—'}</td>
          <td>{row.esquema || '—'}</td>
          <td style={{ fontWeight: 600 }}>{row.tabla || '—'}</td>
          <td className="em-cell-detail" title={row.descripcion}>{row.descripcion || '—'}</td>
          <td><ClasificacionBadge value={row.clasificacion} /></td>
          <td><AvanceCell value={row.avance} /></td>
        </tr>
      ))}
    </tbody>
  );
}

/* ── Tabla vista "Campo" ─────────────────────────────── */
const FIELD_COLS = [
  { key: 'campo', label: 'Campo' },
  { key: 'codigo', label: 'Código' },
  { key: 'atributo', label: 'Atributo' },
  { key: 'definicion', label: 'Definición' },
  { key: 'plataforma', label: 'Plataforma' },
  { key: 'servidor', label: 'Servidor' },
  { key: 'base', label: 'Base' },
  { key: 'esquema', label: 'Esquema' },
  { key: 'tabla', label: 'Tabla' },
];

function FieldViewBody({ items }) {
  return (
    <tbody>
      {items.map((row) => (
        <tr key={row.id}>
          <td style={{ fontWeight: 600 }}>{row.campo || '—'}</td>
          <td>{row.codigo || '—'}</td>
          <td className="em-cell-detail" title={row.atributo}>{row.atributo || '—'}</td>
          <td className="em-cell-detail" title={row.definicion}>{row.definicion || '—'}</td>
          <td>{row.plataforma || '—'}</td>
          <td>{row.servidor || '—'}</td>
          <td>{row.base || '—'}</td>
          <td>{row.esquema || '—'}</td>
          <td>{row.tabla || '—'}</td>
        </tr>
      ))}
    </tbody>
  );
}

/* ── Componente principal ────────────────────────────── */
export default function MetadataTable({ items = [], viewMode = 'tabla', loading = false }) {
  const [sortCol, setSortCol] = useState(null);
  const [sortDir, setSortDir] = useState('asc');

  function handleSort(key) {
    if (sortCol === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortCol(key);
      setSortDir('asc');
    }
  }

  const cols = viewMode === 'tabla' ? TABLE_COLS : FIELD_COLS;

  const sorted = [...items].sort((a, b) => {
    if (!sortCol) return 0;
    const av = (a[sortCol] || '').toString().toLowerCase();
    const bv = (b[sortCol] || '').toString().toLowerCase();
    if (av < bv) return sortDir === 'asc' ? -1 : 1;
    if (av > bv) return sortDir === 'asc' ? 1 : -1;
    return 0;
  });

  if (loading) {
    return (
      <div className="em-spinner">
        <div className="spinner-border text-primary" role="status" style={{ width: '1.5rem', height: '1.5rem' }} />
        <span>Cargando datos...</span>
      </div>
    );
  }

  if (!loading && items.length === 0) {
    return (
      <div className="em-empty">
        <i className="iconsminds-magnifi-glass" />
        <p style={{ fontWeight: 600, marginBottom: 4 }}>No se encontraron registros</p>
        <p style={{ fontSize: '0.82rem' }}>Ajusta los filtros o el término de búsqueda.</p>
      </div>
    );
  }

  return (
    <div className="em-table-wrap">
      <table className="em-table">
        <thead>
          <tr>
            {cols.map((c) => (
              <th
                key={c.key}
                className={`sortable${sortCol === c.key ? ` sort-${sortDir}` : ''}`}
                onClick={() => handleSort(c.key)}
              >
                {c.label}
                <SortIcon col={c.key} sortCol={sortCol} sortDir={sortDir} />
              </th>
            ))}
          </tr>
        </thead>
        {viewMode === 'tabla'
          ? <TableViewBody items={sorted} />
          : <FieldViewBody items={sorted} />
        }
      </table>
    </div>
  );
}

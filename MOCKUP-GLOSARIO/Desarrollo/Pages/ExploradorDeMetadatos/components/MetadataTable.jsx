import { useState } from 'react';
import { useResizableColumns } from '../hooks/useResizableColumns.js';
import { TABLE_COLS, FIELD_COLS } from '../constants/metadataColumns.js';
import SortIcon from './SortIcon.jsx';
import TableViewBody from './TableViewBody.jsx';
import FieldViewBody from './FieldViewBody.jsx';
import TablaContextMenu from './TablaContextMenu.jsx';

const MENU_H = 260;

export default function MetadataTable({ items = [], viewMode = 'tabla', loading = false, onTableRowClick, onEditField, onTablaAction }) {
  const [sortCol, setSortCol] = useState(null);
  const [sortDir, setSortDir] = useState('asc');
  const [tablaMenu, setTablaMenu] = useState(null);

  function handlePencilClick(row, triggerRect) {
    if (tablaMenu?.row === row) { setTablaMenu(null); return; }
    const spaceBelow = window.innerHeight - triggerRect.bottom;
    const y = spaceBelow >= MENU_H
      ? triggerRect.bottom + 4
      : triggerRect.top - MENU_H - 4;
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

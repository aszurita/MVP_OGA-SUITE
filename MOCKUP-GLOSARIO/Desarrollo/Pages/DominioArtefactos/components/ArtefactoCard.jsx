/**
 * ArtefactoCard.jsx
 * Tarjeta de un artefacto de dominio.
 *
 * Props:
 *   artefacto — { id_artefacto, nombre, tipo_artefacto, descripcion }
 */

const ICON_MAP = {
  report:    'iconsminds-newspaper',
  table:     'iconsminds-data-storage',
  dashboard: 'iconsminds-monitor-analytics',
};

function getIcon(tipo) {
  if (!tipo) return 'iconsminds-file';
  const t = tipo.toLowerCase();
  if (t.includes('report')    || t.includes('reporte'))    return ICON_MAP.report;
  if (t.includes('table')     || t.includes('tabla'))      return ICON_MAP.table;
  if (t.includes('dashboard') || t.includes('tablero'))    return ICON_MAP.dashboard;
  return 'iconsminds-file';
}

function isNI(tipo) {
  if (!tipo) return false;
  return tipo.startsWith('NI') || tipo.includes('(NI)');
}

export default function ArtefactoCard({ artefacto }) {
  const { nombre, tipo_artefacto, descripcion } = artefacto || {};
  const iconClass = getIcon(tipo_artefacto);
  const niFlag    = isNI(tipo_artefacto);

  return (
    <div className="artefacto-card" title={descripcion || nombre}>
      <i className={iconClass} />
      <div className="artefacto-nombre">{nombre || 'Sin nombre'}</div>
      <div className="artefacto-tipo">{tipo_artefacto || '—'}</div>
      {niFlag && <span className="badge-ni">(NI)</span>}
    </div>
  );
}

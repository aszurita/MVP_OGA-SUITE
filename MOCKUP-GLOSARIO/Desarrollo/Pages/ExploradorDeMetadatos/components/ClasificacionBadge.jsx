export default function ClasificacionBadge({ value }) {
  if (!value || !value.trim()) return null;
  return <span className="em-badge em-badge-clasificacion">{value}</span>;
}

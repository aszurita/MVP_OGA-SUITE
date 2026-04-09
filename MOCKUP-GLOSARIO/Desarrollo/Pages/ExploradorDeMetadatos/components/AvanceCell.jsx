export default function AvanceCell({ value = '0' }) {
  const progress = Number.parseInt(value, 10) || 0;
  return <span>{progress}%</span>;
}

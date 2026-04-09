export default function SortIcon({ col, sortCol, sortDir }) {
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

const ICONS = {
  upload: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M7 17.5A4.5 4.5 0 0 1 7.8 8.6 5.5 5.5 0 0 1 18 10.5h.5a3.5 3.5 0 1 1 0 7H14" />
      <path d="M12 14V7" />
      <path d="m8.8 10.2 3.2-3.2 3.2 3.2" />
    </svg>
  ),
  download: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M7 17.5A4.5 4.5 0 0 1 7.8 8.6 5.5 5.5 0 0 1 18 10.5h.5a3.5 3.5 0 1 1 0 7H14" />
      <path d="M12 10v7" />
      <path d="m8.8 13.8 3.2 3.2 3.2-3.2" />
    </svg>
  ),
  idea: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 18h6" />
      <path d="M10 21h4" />
      <path d="M8.4 14.8A6.5 6.5 0 1 1 16 14.6c-.9.8-1.5 1.6-1.8 2.4h-4.4c-.2-.8-.7-1.5-1.4-2.2Z" />
      <path d="M18.5 4.5 20 3" />
      <path d="M5.5 4.5 4 3" />
      <path d="M12 2V1" />
    </svg>
  ),
  clear: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 7h10" />
      <path d="M4 12h16" />
      <path d="M4 17h7" />
    </svg>
  ),
  refresh: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 5v6h-6" />
      <path d="M20 11a8 8 0 1 0 2.1 5.4" />
    </svg>
  ),
};

export default function ActionIcon({ type }) {
  return ICONS[type] || null;
}

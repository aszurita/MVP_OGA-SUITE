export default function HeaderUtilityIcons({ onVerBase, onVerOwners, onVerJerarquia, jerarquiaOpen }) {
  return (
    <div className="em-header-tools" aria-hidden="true">
      <button className="em-header-icon-btn em-tooltip-trigger" type="button" data-tooltip="Ver todas las tablas de la base" title="Ver base" onClick={onVerBase}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      </button>

      <button className="em-header-icon-btn em-tooltip-trigger" type="button" data-tooltip="Ver Data Owners" title="Usuarios" onClick={onVerOwners}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M16 21v-1.2a4.8 4.8 0 0 0-4.8-4.8H8.8A4.8 4.8 0 0 0 4 19.8V21" />
          <circle cx="10" cy="7" r="3.3" />
          <path d="M20 21v-1a4 4 0 0 0-3.2-3.92" />
          <path d="M15.8 4.2a3.1 3.1 0 0 1 0 5.6" />
        </svg>
      </button>

      <button
        className={`em-header-icon-btn em-tooltip-trigger${jerarquiaOpen ? ' is-active' : ''}`}
        type="button"
        data-tooltip="Ver jerarquía de servidores/bases/tablas"
        title="Jerarquia"
        onClick={onVerJerarquia}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <rect x="9" y="3" width="6" height="6" rx="1.2" />
          <rect x="3" y="15" width="6" height="6" rx="1.2" />
          <rect x="15" y="15" width="6" height="6" rx="1.2" />
          <path d="M12 9v3" />
          <path d="M6 15v-3h12v3" />
        </svg>
      </button>
    </div>
  );
}

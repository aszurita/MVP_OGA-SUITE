export default function ActiveTablaChip({ tabla, servidor, base, esquema, onClear }) {
  return (
    <div className="em-active-tabla-chip">
      <span className="em-active-tabla-path">
        {servidor} / {base} / {esquema}
      </span>
      <span className="em-active-tabla-name">{tabla}</span>
      <button
        className="em-active-tabla-clear"
        type="button"
        title="Ver todos los campos"
        onClick={onClear}
      >
        <svg viewBox="0 0 16 16" width="14" height="14" fill="none">
          <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      </button>
    </div>
  );
}

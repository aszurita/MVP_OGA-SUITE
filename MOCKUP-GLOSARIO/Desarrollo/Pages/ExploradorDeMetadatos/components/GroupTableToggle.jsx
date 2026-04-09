export default function GroupTableToggle({ checked, onToggle }) {
  return (
    <div className="em-group-toggle em-tooltip-trigger" data-tooltip="Agrupar Nivel Tabla">
      <button
        className={`em-switch-ghost ${checked ? 'is-right' : 'is-left'}`}
        type="button"
        title="Agrupar Nivel Tabla"
        aria-pressed={checked}
        onClick={onToggle}
      >
        <span className="em-switch-thumb" />
      </button>
    </div>
  );
}

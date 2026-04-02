export default function FileManagerButton({ onClick, variant = 'default' }) {
  if (variant === 'menu-item') {
    return (
      <button type="button" className="icon-menu-item quicklinks pp-file-manager-menu-item" onClick={onClick}>
        <i className="iconsminds-box-with-folders"></i>
        <span>Administrador de Archivos</span>
      </button>
    );
  }

  return (
    <button type="button" className="pp-file-manager-btn" onClick={onClick}>
      Administrar docs
    </button>
  );
}

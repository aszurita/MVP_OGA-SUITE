import './ElementNavbar.css';

/**
 * ElementNavbar
 * Props: icon (ReactNode), label (string), active (bool), onClick
 */
export default function ElementNavbar({ icon, label, active = false, onClick }) {
  return (
    <button
      className={`element-navbar${active ? ' element-navbar--active' : ''}`}
      onClick={onClick}
      title={label}
    >
      <span className="element-navbar__icon">{icon}</span>
      <span className="element-navbar__label">{label}</span>
    </button>
  );
}

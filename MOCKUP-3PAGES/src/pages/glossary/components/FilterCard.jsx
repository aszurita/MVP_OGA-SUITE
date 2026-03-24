import '../styles/FilterCard.css';

/**
 * FilterCard – muestra un dominio con su cantidad de términos
 * Props: nombre (string), cantidad (number), active (bool), onClick (fn)
 */
export default function FilterCard({ nombre, cantidad, active = false, onClick }) {
  return (
    <button
      className={`filter-card${active ? ' filter-card--active' : ''}`}
      onClick={onClick}
    >
      <span className="filter-card__nombre">{nombre}</span>
      <span className={`filter-card__count${active ? ' filter-card__count--active' : ''}`}>
        {cantidad}
      </span>
    </button>
  );
}

import { Layers } from 'lucide-react';
import '../styles/UseCase.css';

export default function UseCase({ titulo, cantidad, active = false, onClick }) {
  return (
    <button className={`use-case${active ? ' use-case--active' : ''}`} onClick={onClick}>
      <div className="use-case__top">
        <Layers size={16} className="use-case__icon" />
        <span className="use-case__titulo">{titulo}</span>
      </div>
      <span className="use-case__cantidad">
        {cantidad} {cantidad === 1 ? 'caso' : 'casos'}
      </span>
    </button>
  );
}

import { recentTerms } from '../../../data/glossaryData';
import '../styles/RecentTerms.css';

export default function RecentTerms({ onSelect }) {
  return (
    <aside className="recent-terms">
      <div className="recent-terms__header">
        <span>Términos Recientes</span>
      </div>
      <ul className="recent-terms__list">
        {recentTerms.map((t, i) => (
          <li key={i} className="recent-terms__item" onClick={() => onSelect && onSelect(t)}>
            <span className="recent-terms__nombre">{t.nombre}</span>
            <div className="recent-terms__item-bottom">
              <span className="recent-terms__badge">{t.badge}</span>
              <span className="recent-terms__fecha">{t.fecha}</span>
            </div>
          </li>
        ))}
      </ul>
    </aside>
  );
}

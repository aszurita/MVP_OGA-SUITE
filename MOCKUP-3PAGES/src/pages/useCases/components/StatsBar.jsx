import { LogIn, RefreshCw, ShieldCheck, CheckCircle } from 'lucide-react';
import '../styles/StatsBar.css';

export default function StatsBar({ ingresados, enProceso, enCalidad, cerrados }) {
  return (
    <div className="stats-bar">
      <div className="stats-bar__item stats-bar__item--ingresado">
        <div className="stats-bar__row">
          <LogIn size={14} className="stats-bar__icon" />
          <span className="stats-bar__num">{ingresados}</span>
        </div>
        <span className="stats-bar__label">Ingresados</span>
      </div>
      <div className="stats-bar__item stats-bar__item--proceso">
        <div className="stats-bar__row">
          <RefreshCw size={14} className="stats-bar__icon" />
          <span className="stats-bar__num">{enProceso}</span>
        </div>
        <span className="stats-bar__label">En Proceso</span>
      </div>
      <div className="stats-bar__item stats-bar__item--calidad">
        <div className="stats-bar__row">
          <ShieldCheck size={14} className="stats-bar__icon" />
          <span className="stats-bar__num">{enCalidad}</span>
        </div>
        <span className="stats-bar__label">En Calidad</span>
      </div>
      <div className="stats-bar__item stats-bar__item--cerrado">
        <div className="stats-bar__row">
          <CheckCircle size={14} className="stats-bar__icon" />
          <span className="stats-bar__num">{cerrados}</span>
        </div>
        <span className="stats-bar__label">Cerrados</span>
      </div>
    </div>
  );
}

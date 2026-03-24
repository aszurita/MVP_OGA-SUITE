import { Folder } from 'lucide-react';
import '../styles/InfoMiniCard.css';

const ESTADO_CONFIG = {
  'EN PROCESO': { bg: '#fff3e0', text: '#e65100', border: '#ffe0b2', cardBorder: '#f0b8d8' },
  'INGRESADO':  { bg: '#f5f5f5', text: '#666',    border: '#ddd',    cardBorder: '#e0e0e0' },
  'EN CALIDAD': { bg: '#e3f2fd', text: '#1565c0', border: '#bbdefb', cardBorder: '#90caf9' },
  'CERRADO':    { bg: '#e8f5e9', text: '#2e7d32', border: '#c8e6c9', cardBorder: '#a5d6a7' },
};

export default function InfoMiniCard({ titulo, estado, onClick }) {
  const cfg = ESTADO_CONFIG[estado] || ESTADO_CONFIG['INGRESADO'];

  return (
    <div
      className="info-mini-card"
      style={{ borderColor: cfg.cardBorder }}
      onClick={onClick}
    >
      <Folder size={15} className="info-mini-card__folder" />
      <div className="info-mini-card__body">
        <p className="info-mini-card__titulo">{titulo}</p>
        <span
          className="info-mini-card__estado"
          style={{ background: cfg.bg, color: cfg.text, border: `1px solid ${cfg.border}` }}
        >
          {estado}
        </span>
      </div>
    </div>
  );
}

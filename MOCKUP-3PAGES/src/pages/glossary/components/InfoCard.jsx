import { Copy, Share2, MoreVertical, Calendar, FolderOpen } from 'lucide-react';
import { parseTextWithLinks } from '../../../utils/colorUtils';
import { glossaryTerms } from '../../../data/glossaryData';
import '../styles/InfoCard.css';

export default function InfoCard({
  nombre,
  descripcion = '',
  fechaUltimaAct,
  registroClientes = [],
  texto = '',
  palabrasHipervinculo = [],
  badge,
  badgeColor = '#D2006E',
  extraBadges = [],
  onHyperlink,
}) {
  const segments = parseTextWithLinks(texto, palabrasHipervinculo);

  const getConcepto = (word) => {
    const term = glossaryTerms.find(
      (t) => t.nombre.toLowerCase() === word.toLowerCase()
    );
    return term ? term.texto.replace(/\{|\}/g, '') : null;
  };

  return (
    <article className="info-card">
      {/* Header */}
      <div className="info-card__header">
        <h3 className="info-card__nombre" data-tooltip={descripcion || undefined}>
          {nombre}
        </h3>
        <div className="info-card__actions">
          <button className="info-card__action-btn" title="Copiar"><Copy size={13} /></button>
          <button className="info-card__action-btn" title="Compartir"><Share2 size={13} /></button>
          <button className="info-card__action-btn" title="Más opciones"><MoreVertical size={13} /></button>
        </div>
      </div>

      {/* Badges */}
      {(badge || extraBadges.length > 0) && (
        <div className="info-card__badges">
          {badge && (
            <span className="info-card__badge" style={{ background: badgeColor, color: '#fff' }}>
              {badge}
            </span>
          )}
          {extraBadges.map((b, i) => (
            <span key={i} className="info-card__badge info-card__badge--extra">{b}</span>
          ))}
        </div>
      )}

      {/* Meta */}
      <div className="info-card__meta">
        <span className="info-card__meta-item">
          <Calendar size={11} />
          Últ. act. {fechaUltimaAct}
        </span>
      </div>

      {/* Registro de clientes */}
      {registroClientes.length > 0 && (
        <div className="info-card__registros">
          <FolderOpen size={11} className="info-card__folder" />
          <span className="info-card__registro-text">
            {registroClientes.join(' | ')}
          </span>
        </div>
      )}

      {/* Texto con hipervínculos */}
      <p className="info-card__texto">
        {segments.map((seg, i) =>
          seg.isLink ? (
            <button
              key={i}
              className="info-card__link"
              data-tooltip={getConcepto(seg.text) ?? 'Este es un texto cualquiera que aparece al hacer hover sobre esta palabra vinculada.'}
              onClick={() => onHyperlink && onHyperlink(seg.text)}
            >
              {seg.text}
            </button>
          ) : (
            <span key={i}>{seg.text}</span>
          )
        )}
      </p>
    </article>
  );
}

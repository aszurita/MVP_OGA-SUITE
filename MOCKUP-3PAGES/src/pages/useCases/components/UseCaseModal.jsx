import { X } from 'lucide-react';
import { modalDetalle } from '../../../data/useCasesData';
import '../styles/UseCaseModal.css';

const TABS = ['1. Información', '2. Responsables', '3. Fuentes', '4. Términos'];

/**
 * UseCaseModal – modal de detalle de caso de uso
 * Props: caso ({ titulo, estado }), onClose (fn)
 */
export default function UseCaseModal({ caso, onClose }) {
  if (!caso) return null;
  const d = modalDetalle;

  return (
    <div className="uc-modal-overlay" onClick={onClose}>
      <div className="uc-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="uc-modal__header">
          <h2 className="uc-modal__title">
            Detalles del Caso de Uso – {caso.titulo}
          </h2>
          <button className="uc-modal__close" onClick={onClose}>
            <X size={16} />
          </button>
        </div>

        {/* Tabs */}
        <div className="uc-modal__tabs">
          {TABS.map((tab, i) => (
            <button
              key={tab}
              className={`uc-modal__tab${i === 0 ? ' uc-modal__tab--active' : ''}`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="uc-modal__content">
          <div className="uc-modal__row">
            <div className="uc-modal__field">
              <label className="uc-modal__label">Descripción</label>
              <div className="uc-modal__input">{d.titulo}</div>
            </div>
            <div className="uc-modal__field">
              <label className="uc-modal__label">Estado</label>
              <div className="uc-modal__select">
                {caso.estado || d.estado}
                <span className="uc-modal__chevron">▾</span>
              </div>
            </div>
            <div className="uc-modal__field">
              <label className="uc-modal__label">Activo</label>
              <div className="uc-modal__select">
                {d.activo}
                <span className="uc-modal__chevron">▾</span>
              </div>
            </div>
            <div className="uc-modal__field">
              <label className="uc-modal__label">Tipo de iniciativa</label>
              <div className="uc-modal__select">
                {d.tipoIniciativa}
                <span className="uc-modal__chevron">▾</span>
              </div>
            </div>
          </div>

          <div className="uc-modal__row">
            <div className="uc-modal__field uc-modal__field--wide">
              <label className="uc-modal__label">Detalle del Caso de Uso</label>
              <div className="uc-modal__textarea">{d.detalle}</div>
            </div>
            <div className="uc-modal__field uc-modal__field--wide">
              <label className="uc-modal__label">Entregable del Caso de Uso</label>
              <div className="uc-modal__textarea">{d.entregable}</div>
            </div>
          </div>

          <div className="uc-modal__row">
            <div className="uc-modal__field uc-modal__field--wide">
              <label className="uc-modal__label">Dominio</label>
              <div className="uc-modal__select">
                {d.dominio}
                <span className="uc-modal__chevron">▾</span>
              </div>
            </div>
            <div className="uc-modal__field uc-modal__field--wide">
              <label className="uc-modal__label">Subdominio</label>
              <div className="uc-modal__select">
                {d.subdominio}
                <span className="uc-modal__chevron">▾</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="uc-modal__footer">
          <button className="uc-modal__btn-primary">Siguiente</button>
        </div>
      </div>
    </div>
  );
}

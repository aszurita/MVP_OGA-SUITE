import { useState, useEffect } from 'react';
import ClsfDropdown from './ClsfDropdown.jsx';

const ETIQUETAS = [
  { value: 'Tabla Oficial',    label: 'Tabla Oficial'    },
  { value: 'Tabla de trabajo', label: 'Tabla de trabajo' },
  { value: 'Tabla en desuso',  label: 'Tabla en desuso'  },
];

const MEDALLONES = [
  { value: 'Bronce', label: 'Bronce' },
  { value: 'Plata',  label: 'Plata'  },
  { value: 'Oro',    label: 'Oro'    },
];

export default function ClasificacionTablaModal({ isOpen, row, onClose }) {
  const [etiqueta, setEtiqueta] = useState('');
  const [medallon, setMedallon] = useState('');

  useEffect(() => {
    if (!isOpen) return;
    setEtiqueta(row?.clasificacion || '');
    setMedallon('');
  }, [isOpen, row?.tabla]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!isOpen) return null;

  return (
    <div
      className="do-overlay do-overlay-sub"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="do-modal clsf-modal">
        <div className="do-modal-header">
          <h5 className="do-modal-title">Clasificación de Tablas</h5>
          <button className="do-close" type="button" onClick={onClose}>×</button>
        </div>
        <div className="do-modal-body clsf-modal-body">
          <div className="clsf-card">
            <p className="clsf-etiquetar">
              Etiquetar tabla <strong>{row?.tabla}</strong>
            </p>

            <div className="clsf-field-row">
              <label className="clsf-field-label">Asignar etiqueta:</label>
              <ClsfDropdown options={ETIQUETAS} value={etiqueta} onChange={setEtiqueta} />
            </div>

            <div className="clsf-field-row">
              <label className="clsf-field-label">Clasificación medallón:</label>
              <ClsfDropdown options={MEDALLONES} value={medallon} onChange={setMedallon} />
            </div>
          </div>

          <div className="clsf-footer">
            <button type="button" className="clsf-solicitar-btn" onClick={onClose}>
              Solicitar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

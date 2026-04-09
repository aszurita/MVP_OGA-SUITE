import { useState, useEffect } from 'react';

export default function DescripcionTablaModal({ isOpen, row, onClose }) {
  const [descripcion, setDescripcion] = useState('');

  useEffect(() => {
    if (!isOpen) return;
    setDescripcion(row?.descripcion || '');
  }, [isOpen, row?.tabla]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!isOpen) return null;

  return (
    <div
      className="do-overlay dc-overlay"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="do-modal dc-modal">
        <div className="do-modal-header">
          <h5 className="do-modal-title">Editar definición de tabla</h5>
          <button className="do-close" type="button" onClick={onClose}>×</button>
        </div>
        <div className="do-modal-body dc-modal-body">
          <div className="form-group">
            <label className="dc-label">
              Definición de la tabla <strong>{row?.tabla}</strong>:
            </label>
            <textarea
              className="form-control dc-textarea"
              rows={4}
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
            />
          </div>
        </div>
        <div className="dc-modal-footer">
          <button type="button" className="dc-guardar-btn" onClick={onClose}>
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
}

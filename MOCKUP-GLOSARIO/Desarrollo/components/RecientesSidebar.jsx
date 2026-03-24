/**
 * RecientesSidebar.jsx
 * Panel lateral derecho — Términos visitados recientemente (localStorage).
 * Replica la sección #sidebar-recientes del Glosario.aspx original.
 */
import React from 'react';

export default function RecientesSidebar({ recientes, onSelect, onClose }) {
  return (
    <div id="sidebar-recientes" className="sidebar-recientes shadow-sm open" style={{ minWidth: 220, maxWidth: 300 }}>
      {/* Header */}
      <div className="sidebar-header p-3 border-bottom d-flex justify-content-between align-items-center">
        <h5 className="mb-0 font-weight-bold">Términos recientes</h5>
        {onClose && (
          <button
            className="btn btn-empty text-muted p-0 d-md-none"
            onClick={onClose}
            aria-label="Cerrar recientes"
          >
            <i className="simple-icon-close" style={{ fontSize: '1.2rem' }} />
          </button>
        )}
      </div>

      {/* Lista */}
      <div id="lista-recientes-container" className="sidebar-content p-2">
        {recientes.length === 0 ? (
          <p className="text-muted p-2" style={{ fontSize: '0.82rem' }}>
            Aún no hay términos recientes.
          </p>
        ) : (
          recientes.map((item) => (
            <div
              key={item.id}
              className="reciente-item"
              onClick={() => onSelect && onSelect(item.nombre)}
              style={{ cursor: 'pointer' }}
            >
              <p className="reciente-titulo mb-1">{item.nombre}</p>
              <div className="reciente-meta">
                <span className="reciente-tipo">{item.tipo || 'TÉRMINO'}</span>
                <span style={{ fontSize: '0.72rem', color: '#9e9e9e' }}>{item.fecha}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

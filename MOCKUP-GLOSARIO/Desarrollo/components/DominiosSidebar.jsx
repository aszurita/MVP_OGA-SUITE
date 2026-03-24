/**
 * DominiosSidebar.jsx
 * Panel lateral izquierdo — Listado de dominios con conteo de términos.
 * Replica la sección #sidebar-dominios del Glosario.aspx original.
 */
import React from 'react';

export default function DominiosSidebar({ dominiosMap, activeDominio, onSelect, onClose }) {
  // dominiosMap: Map<nombre, cantidad> proveniente de glosario.dominios
  const lista = Array.from(dominiosMap.entries())
    .filter(([nombre]) => nombre && nombre.trim() !== '')
    .sort((a, b) => b[1] - a[1]); // ordenar de mayor a menor cantidad

  return (
    <div id="sidebar-dominios" className="sidebar-dominios shadow-sm open">
      {/* Header */}
      <div className="sidebar-header d-flex justify-content-between align-items-center p-3 border-bottom">
        <h5 className="mb-0 font-weight-bold">Dominios</h5>
        {onClose && (
          <button
            className="btn btn-empty text-semi-muted p-0 d-md-none"
            onClick={onClose}
            aria-label="Cerrar dominios"
          >
            <i className="simple-icon-close" style={{ fontSize: '1.2rem' }} />
          </button>
        )}
      </div>

      {/* Lista */}
      <div id="lista-dominios-container" className="sidebar-content p-2">
        <ul className="list-group list-group-flush">
          {lista.map(([nombre, cantidad]) => (
            <li
              key={nombre}
              className={`list-group-item d-flex justify-content-between align-items-center dominio-item p-2${activeDominio === nombre ? ' dominio-item--active' : ''}`}
              title={nombre}
              onClick={() => onSelect(nombre)}
              style={{ cursor: 'pointer' }}
            >
              <span className="dominio-text mr-2" style={{ fontWeight: activeDominio === nombre ? 700 : 500, color: activeDominio === nombre ? '#d1007e' : '#4a4a4a' }}>
                {nombre}
              </span>
              <span
                className="badge badge-pill dominio-badge"
                style={{ background: activeDominio === nombre ? '#d1007e' : '#160F41', color: '#fff' }}
              >
                {cantidad}
              </span>
            </li>
          ))}
          {lista.length === 0 && (
            <li className="list-group-item text-muted" style={{ fontSize: '0.85rem' }}>
              Sin dominios disponibles
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}

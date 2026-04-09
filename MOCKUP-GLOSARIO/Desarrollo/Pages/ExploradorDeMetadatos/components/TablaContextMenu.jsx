import { useState, useRef, useEffect } from 'react';
import ReactDOM from 'react-dom';

const PLAIN_ITEMS = [
  { action: 'descripcion', label: 'Descripción tabla' },
  { action: 'owner',       label: 'Data Owner' },
  { action: 'steward',     label: 'Data Steward' },
  { action: 'dimensiones', label: 'Dimensiones de Calidad' },
  { action: 'clasificacion', label: 'Clasificación' },
];

export default function TablaContextMenu({ x, y, onAction, onClose }) {
  const [profilingHover, setProfilingHover] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    function handler(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) onClose();
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [onClose]);

  return ReactDOM.createPortal(
    <div
      className="do-ctx-menu"
      ref={menuRef}
      style={{ position: 'fixed', left: x, top: y, zIndex: 9999 }}
      onClick={(e) => e.stopPropagation()}
      onMouseDown={(e) => e.stopPropagation()}
    >
      {PLAIN_ITEMS.map((item) => (
        <div
          key={item.action}
          role="button"
          tabIndex={0}
          className="do-ctx-item"
          onClick={() => { onAction(item.action); onClose(); }}
          onKeyDown={(e) => e.key === 'Enter' && (onAction(item.action), onClose())}
        >
          {item.label}
        </div>
      ))}

      <div
        className={`do-ctx-item do-ctx-has-sub${profilingHover ? ' is-hovered' : ''}`}
        onMouseEnter={() => setProfilingHover(true)}
        onMouseLeave={() => setProfilingHover(false)}
      >
        <span>Profiling</span>
        {profilingHover && (
          <div className="do-ctx-submenu">
            <button type="button" onClick={() => { onAction('generar-profiling'); onClose(); }}>
              Generar Profiling
            </button>
            <button type="button" onClick={() => { onAction('ver-profiling'); onClose(); }}>
              Ver Profiling
            </button>
          </div>
        )}
      </div>

      <div
        role="button"
        tabIndex={0}
        className="do-ctx-item"
        onClick={() => { onAction('linaje'); onClose(); }}
        onKeyDown={(e) => e.key === 'Enter' && (onAction('linaje'), onClose())}
      >
        Ver linaje
      </div>
    </div>,
    document.body
  );
}

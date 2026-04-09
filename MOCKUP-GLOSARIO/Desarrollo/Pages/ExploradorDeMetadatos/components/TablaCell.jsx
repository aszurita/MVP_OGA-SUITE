import { useState, useRef } from 'react';
import ReactDOM from 'react-dom';
import { SlPencil } from 'react-icons/sl';

export default function TablaCell({ tabla, dataOwner, dataSteward, row, onPencilClick }) {
  const hasHover = dataOwner || dataSteward;
  const [tooltipPos, setTooltipPos] = useState(null);
  const wrapRef   = useRef(null);
  const pencilRef = useRef(null);

  function handleMouseEnter() {
    if (!wrapRef.current) return;
    const r = wrapRef.current.getBoundingClientRect();
    setTooltipPos({ x: r.left, y: r.bottom + 6 });
  }
  function handleMouseLeave() { setTooltipPos(null); }

  function handlePencilClick(e) {
    e.stopPropagation();
    e.preventDefault();
    onPencilClick && onPencilClick(row, pencilRef.current.getBoundingClientRect());
  }

  return (
    <td className="em-cell-emphasis">
      <span className="em-field-pencil-wrap">
        <button
          ref={pencilRef}
          type="button"
          className="do-pencil-btn em-field-pencil-btn"
          title={`Opciones de tabla ${tabla}`}
          onClick={handlePencilClick}
          onMouseDown={(e) => e.stopPropagation()}
        >
          <SlPencil size={14} />
        </button>
        <span
          ref={wrapRef}
          onMouseEnter={hasHover ? handleMouseEnter : undefined}
          onMouseLeave={hasHover ? handleMouseLeave : undefined}
          style={{ cursor: hasHover ? 'default' : undefined }}
        >
          {tabla || '-'}
        </span>
      </span>

      {tooltipPos && hasHover && ReactDOM.createPortal(
        <div className="em-tabla-tooltip-portal" style={{ left: tooltipPos.x, top: tooltipPos.y }}>
          {dataOwner && (
            <span className="em-tooltip-row">
              <span className="em-tooltip-label">Data Owner</span>
              <span className="em-tooltip-value">{dataOwner}</span>
            </span>
          )}
          {dataSteward && (
            <span className="em-tooltip-row">
              <span className="em-tooltip-label">Data Steward</span>
              <span className="em-tooltip-value">{dataSteward}</span>
            </span>
          )}
        </div>,
        document.body
      )}
    </td>
  );
}

export default function DimensionesCalidadModal({ isOpen, row, onClose }) {
  if (!isOpen) return null;

  return (
    <div
      className="do-overlay dq-overlay"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="do-modal dq-modal">
        <div className="do-modal-header">
          <h5 className="do-modal-title">Indicadores de calidad</h5>
          <button className="do-close" type="button" onClick={onClose}>×</button>
        </div>
        <div className="do-modal-body dq-modal-body">
          <div className="dq-layout">

            <div className="dq-left">
              <button type="button" className="dq-detail-btn">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                  <polyline points="15 3 21 3 21 9" />
                  <line x1="10" y1="14" x2="21" y2="3" />
                </svg>
                Ver detalle de indicadores
              </button>
            </div>

            <div className="dq-right">
              <div className="dq-context-header">
                <span className="dq-context-label">Seleccione un atributo</span>
                <button type="button" className="dq-guardar-todo-btn">Guardar Todo</button>
              </div>

              <div className="dq-context-meta">
                <div className="dq-meta-row">
                  <span>Plataforma: <strong>{row?.plataforma || '-'}</strong></span>
                  <span>Base: <strong>{row?.base || '-'}</strong></span>
                  <span>Campo: <strong>-</strong></span>
                  <span className="dq-doc-pct">Documentación: <strong>0%</strong></span>
                </div>
                <div className="dq-meta-row">
                  <span>Servidor: <strong>{row?.servidor || '-'}</strong></span>
                  <span>Esquema: <strong>{row?.esquema || '-'}</strong></span>
                  <span>Tabla: <strong>{row?.tabla || '-'}</strong></span>
                </div>
              </div>

              <div className="dq-table-wrap">
                <table className="dq-table">
                  <thead>
                    <tr>
                      <th>No aplica</th>
                      <th>Indicadores</th>
                      <th>id_dimension</th>
                      <th>Valor</th>
                      <th>Reglas</th>
                      <th>Usuario</th>
                      <th>Última modificación</th>
                      <th>Acción</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td colSpan={8} className="dq-table-empty">
                        Sin indicadores registrados
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

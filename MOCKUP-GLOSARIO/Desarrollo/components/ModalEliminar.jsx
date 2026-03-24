/**
 * ModalEliminar.jsx
 * Modal de confirmación para eliminar (desactivar) un término.
 * Replica el comportamiento de GlosarioEdit.openDeleteModal() y GlosarioEdit.deleteItem().
 */
import React, { useState } from 'react';
import { desactivarTermino } from '../services/terminosService.js';

export default function ModalEliminar({ show, id, nombre, onClose, onDeleted }) {
  const [eliminando, setEliminando] = useState(false);
  const [error,      setError]      = useState('');

  async function handleEliminar() {
    if (!id) return;
    setEliminando(true);
    setError('');
    try {
      await desactivarTermino(id, 'Eliminado desde UI', 0);
      onDeleted && onDeleted(id);
      onClose();
    } catch (err) {
      setError('No se pudo desactivar el registro: ' + err.message);
    } finally {
      setEliminando(false);
    }
  }

  if (!show) return null;

  return (
    <div
      className="modal fade show"
      style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}
      role="dialog"
    >
      <div className="modal-dialog" role="document" style={{ maxWidth: 480 }}>
        <div className="modal-content">
          <div className="modal-header pb-3 pt-3">
            <h5 className="modal-title">Confirmar eliminación</h5>
            <button type="button" className="close" onClick={onClose} disabled={eliminando}>
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div className="modal-body">
            {error && <div className="alert alert-danger py-1" style={{ fontSize: '0.85rem' }}>{error}</div>}
            <p>
              ¿Estás seguro de que deseas <strong>desactivar</strong> el registro{' '}
              <span style={{ color: '#D2006E', fontWeight: 700 }}>"{nombre}"</span>?
            </p>
            <p className="text-muted" style={{ fontSize: '0.82rem' }}>
              Esta acción es reversible — el registro quedará inactivo pero no se borrará de la base de datos.
            </p>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose} disabled={eliminando}>
              Cancelar
            </button>
            <button
              type="button"
              className="btn btn-danger"
              onClick={handleEliminar}
              disabled={eliminando}
            >
              {eliminando ? (
                <><span className="spinner-border spinner-border-sm mr-1" />Eliminando...</>
              ) : 'Eliminar'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

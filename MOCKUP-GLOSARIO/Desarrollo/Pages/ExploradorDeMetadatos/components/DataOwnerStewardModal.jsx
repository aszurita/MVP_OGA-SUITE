import { useState, useEffect, useRef } from 'react';
import { getOwnerFacets } from '../../../services/metadataService.js';

export default function DataOwnerStewardModal({ isOpen, row, type, onClose }) {
  const isOwner   = type === 'owner';
  const Label     = isOwner ? 'Data Owner'  : 'Data Steward';
  const fieldKey  = isOwner ? 'nombre_data_owner' : 'nombre_data_steward';
  const currentVal = row?.[fieldKey] || '';

  const [allNames, setAllNames]   = useState([]);
  const [inputText, setInputText] = useState('');
  const [selected, setSelected]   = useState('');
  const [showSug, setShowSug]     = useState(false);
  const [suggestions, setSugs]    = useState([]);
  const wrapRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;
    setInputText('');
    setSelected('');
    setShowSug(false);
    getOwnerFacets().then(({ owners, stewards }) => {
      setAllNames(isOwner ? owners : stewards);
    });
  }, [isOpen, type]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    function handler(e) {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setShowSug(false);
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => {
    if (!inputText.trim()) { setSugs([]); setShowSug(false); return; }
    const q = inputText.toUpperCase();
    const matches = allNames.filter((n) => n.toUpperCase().includes(q)).slice(0, 8);
    setSugs(matches);
    setShowSug(matches.length > 0);
  }, [inputText, allNames]);

  if (!isOpen) return null;

  return (
    <div
      className="do-overlay do-overlay-sub"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="do-modal do-modal-sm">
        <div className="do-modal-header">
          <h5 className="do-modal-title">Editar {Label.toLowerCase()}</h5>
          <button className="do-close" type="button" onClick={onClose}>×</button>
        </div>
        <div className="do-modal-body">
          <p className="do-edit-current">
            {currentVal
              ? <>{Label} actual: <strong>{currentVal}</strong></>
              : `No existe ${Label} asignado a la tabla`}
          </p>

          <div className="do-edit-row">
            <span className="do-edit-label">Asignar {Label.toLowerCase()}:</span>
            <div className="do-autocomplete-wrap" ref={wrapRef} style={{ flex: 1 }}>
              <input
                type="text"
                className="do-input"
                placeholder={`Buscar ${Label}...`}
                value={inputText}
                autoComplete="off"
                onChange={(e) => { setInputText(e.target.value); setSelected(''); }}
              />
              {showSug && (
                <div className="do-suggestions">
                  {suggestions.map((s) => (
                    <button
                      key={s}
                      type="button"
                      className="do-suggestion-item"
                      onClick={() => { setSelected(s); setInputText(s); setShowSug(false); }}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="do-edit-actions">
            <button
              className="do-action-btn"
              type="button"
              disabled={!selected}
              onClick={onClose}
            >
              Solicitar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

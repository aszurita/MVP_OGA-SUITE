import { useState, useEffect, useRef } from 'react';
import { getTableView } from '../../../services/metadataService.js';

let _nombresTablas = null;

async function getNombresTablas() {
  if (_nombresTablas) return _nombresTablas;
  const result = await getTableView({ page: 1, page_size: 99999 });
  _nombresTablas = [...new Set((result.items || []).map((r) => r.tabla).filter(Boolean))].sort();
  return _nombresTablas;
}

export default function SearchBar({ value, onChange, onClear }) {
  const [suggestions, setSuggestions] = useState([]);
  const [showSug, setShowSug]         = useState(false);
  const [allTablas, setAllTablas]     = useState([]);
  const wrapRef = useRef(null);

  useEffect(() => {
    getNombresTablas().then(setAllTablas).catch(() => {});
  }, []);

  useEffect(() => {
    function handler(e) {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setShowSug(false);
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => {
    const q = value.trim().toUpperCase();
    if (!q || allTablas.length === 0) { setSuggestions([]); setShowSug(false); return; }

    const starts   = allTablas.filter((t) => t.toUpperCase().startsWith(q));
    const contains = allTablas.filter((t) => !t.toUpperCase().startsWith(q) && t.toUpperCase().includes(q));
    const merged   = [...starts, ...contains].slice(0, 20);

    setSuggestions(merged);
    setShowSug(merged.length > 0);
  }, [value, allTablas]);

  function handleSelect(tabla) {
    onChange(tabla);
    setShowSug(false);
  }

  return (
    <div className="em-search-wrap" ref={wrapRef}>
      <input
        type="text"
        placeholder="Buscar..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => { if (suggestions.length > 0) setShowSug(true); }}
        autoComplete="off"
      />
      {value && (
        <button type="button" className="em-search-clear" onClick={onClear} title="Limpiar búsqueda">
          <svg viewBox="0 0 16 16" width="12" height="12" fill="none">
            <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>
      )}
      {showSug && (
        <div className="em-search-suggestions">
          {suggestions.map((t) => (
            <button key={t} type="button" className="em-search-suggestion-item" onClick={() => handleSelect(t)}>
              {t}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

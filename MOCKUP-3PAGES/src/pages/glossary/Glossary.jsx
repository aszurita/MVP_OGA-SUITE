import { useState } from 'react';
import { Search, LayoutGrid, List, RotateCcw, ChevronDown, Plus, BrushCleaning, Menu } from 'lucide-react';
import FilterCard from './components/FilterCard';
import InfoCard from './components/InfoCard';
import RecentTerms from './components/RecentTerms';
import { glossaryTerms, domainFilters } from '../../data/glossaryData';
import './styles/Glossary.css';

export default function Glossary() {
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [showDomains, setShowDomains] = useState(false);
  const [activeDomain, setActiveDomain] = useState(null);
  const [showRecent, setShowRecent] = useState(false);

  const filtered = glossaryTerms.filter((t) => {
    const q = searchQuery.toLowerCase();
    return (
      t.nombre.toLowerCase().includes(q) ||
      t.texto.toLowerCase().includes(q)
    );
  });

  return (
    <div className="glossary">

      {/* Fila 1: título + buscador */}
      <div className="glossary__toolbar">
        <text className="glossary__title">Glosario Empresarial de Datos</text>
        <div className="glossary__search">
          <input
            className="glossary__search-input"
            placeholder="Buscar..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Search size={14} className="glossary__search-icon" />
        </div>
      </div>

      {/* Fila 2: subtoolbar */}
      <div className="glossary__subtoolbar">
        {/* Izquierda */}
        <div className="glossary__subtoolbar-left">
          <div className="glossary__view-btns">
            <button
              className={`glossary__view-btn${viewMode === 'grid' ? ' glossary__view-btn--active' : ''}`}
              onClick={() => setViewMode('grid')}
            >
              <LayoutGrid size={15} />
            </button>
            <button
              className={`glossary__view-btn${viewMode === 'list' ? ' glossary__view-btn--active' : ''}`}
              onClick={() => setViewMode('list')}
            >
              <List size={15} />
            </button>
          </div>

          <button
            className={`glossary__toolbar-btn${showDomains ? ' glossary__toolbar-btn--active' : ''}`}
            onClick={() => setShowDomains((v) => !v)}
          >
            Dominios
          </button>

          <button className="glossary__toolbar-btn">
            Filtrar Por <ChevronDown size={13} />
          </button>

          <span className="glossary__count">
            <strong>{filtered.length}</strong> resultados
          </span>

          <button className="glossary__icon-btn" title="Limpiar">
            <BrushCleaning size={15} />
          </button>
        </div>

        {/* Derecha */}
        <div className="glossary__subtoolbar-right">
          <button className="glossary__icon-btn">
            <Plus size={15} />
          </button>
          <button className="glossary__toolbar-btn">
            Segmentar Por <ChevronDown size={13} />
          </button>
          <button
            className={`glossary__toolbar-btn${showRecent ? ' glossary__toolbar-btn--active' : ''}`}
            onClick={() => setShowRecent((v) => !v)}
          >
            <Menu size={13} />
            Recientes
          </button>
        </div>
      </div>

      {/* Main body */}
      <div className="glossary__body">
        {showDomains && (
          <aside className="glossary__domains">
            <p className="glossary__domains-label">Dominios</p>
            {domainFilters.map((d) => (
              <FilterCard
                key={d.nombre}
                nombre={d.nombre}
                cantidad={d.cantidad}
                active={activeDomain === d.nombre}
                onClick={() => setActiveDomain((prev) => (prev === d.nombre ? null : d.nombre))}
              />
            ))}
          </aside>
        )}

        <div className={`glossary__cards${viewMode === 'list' ? ' glossary__cards--list' : ''}`}>
          {filtered.map((term) => (
            <InfoCard key={term.id} {...term} />
          ))}
          {filtered.length === 0 && (
            <div className="glossary__empty">
              No se encontraron términos para "<strong>{searchQuery}</strong>"
            </div>
          )}
        </div>

        {showRecent && (
          <RecentTerms onSelect={(t) => setSearchQuery(t.nombre)} />
        )}
      </div>
    </div>
  );
}

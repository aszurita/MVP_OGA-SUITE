/**
 * LibroDominios.jsx
 * Página principal del Libro de Dominios.
 * Route: /libro-dominios
 */
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getDominios } from '../../services/dominiosService.js';
import DominioCarta from './components/DominioCarta.jsx';
import './styles/LibroDominios.css';

const TABS = ['Todos', 'Maestros', 'Transaccionales', 'Derivados', 'Mis Dominios'];
const TIPOS = ['Maestros', 'Transaccionales', 'Derivados'];

export default function LibroDominios() {
  const navigate = useNavigate();
  const [dominios, setDominios] = useState([]);
  const [activeTab, setActiveTab] = useState('Todos');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchDominios() {
      setLoading(true);
      setError(null);
      try {
        const data = await getDominios();
        setDominios(data);
      } catch (err) {
        console.error(err);
        setError('Error al cargar los dominios. Intente nuevamente.');
      } finally {
        setLoading(false);
      }
    }
    fetchDominios();
  }, []);

  function handleDominioClick(id_dominio) {
    navigate(`/ficha-dominio/${id_dominio}`);
  }

  // Filtra dominios por tipo — acepta "Maestros", "Dominio Maestro", "Maestro", etc.
  function dominiosByTipo(tipo) {
    const key = tipo.replace(/^Dominio\s*/i, '').replace(/s$/i, '').toLowerCase();
    return dominios.filter((d) => {
      const t = (d.tipo_dominio || '').replace(/^Dominio\s*/i, '').replace(/s$/i, '').toLowerCase();
      return t === key || t.startsWith(key);
    });
  }

  // Determina qué secciones renderizar según el tab activo
  function getSecciones() {
    if (activeTab === 'Mis Dominios') {
      return TIPOS.map((tipo) => ({ tipo, items: [] }));
    }
    if (activeTab === 'Todos') {
      return TIPOS.map((tipo) => ({ tipo, items: dominiosByTipo(tipo) }));
    }
    return [{ tipo: activeTab, items: dominiosByTipo(activeTab) }];
  }

  const secciones = getSecciones();

  return (
    <div className="libro-dominios-container">
      {/* Cabecera: título + tabs inline + botones (igual que el ASPX) */}
      <div className="libro-dominios-header">
        <div className="libro-dominios-title-tabs">
          <h4>
            <i className="iconsminds-books mr-2" style={{ color: '#D2006E' }} />
            Libro de Dominios
          </h4>
          <nav className="libro-dominios-breadcrumb">
            {TABS.map((tab, i) => (
              <span key={tab} style={{ display: 'flex', alignItems: 'center' }}>
                {i > 0 && <span className="sep">&nbsp;|&nbsp;</span>}
                <button
                  className={`tab-link${activeTab === tab ? ' active' : ''}`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab}
                </button>
              </span>
            ))}
          </nav>
        </div>
        <div className="header-actions">
          <button className="btn-priorizar">
            <i className="simple-icon-list mr-1" />
            Priorización
          </button>
          <button className="btn-agregar-dominio">
            <i className="simple-icon-plus mr-1" />
            Agregar nuevo dominio
          </button>
        </div>
      </div>

      {/* Tarjeta blanca contenedora — equivale a .card del ASPX */}
      <div className="libro-dominios-card">
        {/* Estado de carga */}
        {loading && (
          <div className="libro-dominios-spinner">
            <div className="spinner-border" style={{ color: '#D2006E' }} role="status">
              <span className="sr-only">Cargando...</span>
            </div>
          </div>
        )}

        {/* Estado de error */}
        {!loading && error && (
          <div className="alert alert-danger">{error}</div>
        )}

        {/* Secciones de dominios */}
        {!loading && !error && secciones.map(({ tipo, items }) => (
          <div key={tipo} className="dominio-section">
            <h5>{tipo}</h5>
            <div className="dominio-cards-grid">
              {items.length === 0 ? (
                <span className="empty-section">
                  {activeTab === 'Mis Dominios'
                    ? 'No tienes dominios asignados.'
                    : `No hay dominios de tipo ${tipo}.`}
                </span>
              ) : (
                items.map((d) => (
                  <DominioCarta
                    key={d.id_dominio}
                    dominio={d}
                    onClick={handleDominioClick}
                  />
                ))
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

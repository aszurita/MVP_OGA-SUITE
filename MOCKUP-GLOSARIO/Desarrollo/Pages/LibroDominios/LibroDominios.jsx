/**
 * LibroDominios.jsx
 * Página principal del Libro de Dominios.
 * Route: /libro-dominios
 *
 * Estructura idéntica al ASPX original:
 *   row > col-12 > h1 (inline-block por Dore) + nav breadcrumb + float-right buttons
 *   row > col-12 > card > card-body > secciones de dominios
 */
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getDominios } from '../../services/dominiosService.js';
import DominioCarta from './components/DominioCarta.jsx';
import ModalNuevoDominio from './components/ModalNuevoDominio.jsx';
import './styles/LibroDominios.css';

const TABS = ['Todos', 'Maestros', 'Transaccionales', 'Derivados', 'Mis Dominios'];
const TIPOS = ['Maestros', 'Transaccionales', 'Derivados'];
const TIPO_BASEDATOS = {
  'Maestros': 'Maestro',
  'Transaccionales': 'Transaccional',
  'Derivados': 'Derivado'
};

export default function LibroDominios() {
  const navigate = useNavigate();
  const [dominios, setDominios] = useState([]);
  const [activeTab, setActiveTab] = useState('Todos');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    async function fetchDominios() {
      setLoading(true);
      setError(null);
      try {
        setDominios(await getDominios());
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

  function dominiosByTipo(tipo) {
    let tipo_base = TIPO_BASEDATOS[tipo];
    const key = tipo_base.replace(/^Dominio\s*/i, '').replace(/s$/i, '').toLowerCase();
    return dominios.filter((d) => {
      const t = (d.tipo_dominio || '').replace(/^Dominio\s*/i, '').replace(/s$/i, '').toLowerCase();
      return t === key || t.startsWith(key);
    });
  }

  function getSecciones() {
    if (activeTab === 'Mis Dominios') return TIPOS.map((tipo) => ({ tipo, items: [] }));
    if (activeTab === 'Todos') return TIPOS.map((tipo) => ({ tipo, items: dominiosByTipo(tipo) }));
    return [{ tipo: activeTab, items: dominiosByTipo(activeTab) }];
  }

  const secciones = getSecciones();

  return (
    <div className='flex-grow-1 pl-3 transition-content'>
      {/* ── Fila de cabecera — idéntica al col-12 del ASPX ─── */}
      <div className="row">
        <div className="col-12">

          {/* Botones float-right (van primero para que el float funcione) */}
          <div className="float-right mb-1 d-flex" style={{ gap: '8px' }}>
            <button type="button" className="btn btn-outline-dark">
              Priorizacion
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => setModalOpen(true)}
            >
              Agregar nuevo dominio
            </button>
          </div>

          {/* Título — display:inline-block definido en style.css del tema */}
          <h1>Libro de Dominios</h1>

          {/* Breadcrumb de filtros — d-lg-inline-block para estar al lado del h1 */}
          <nav
            className="breadcrumb-container d-none d-sm-block d-lg-inline-block"
            aria-label="breadcrumb"
          >
            <ol className="breadcrumb pt-0 libro-filter">
              {TABS.map((tab) => (
                <li
                  key={tab}
                  className={`breadcrumb-item${activeTab === tab ? ' filtro-actual' : ''}`}
                >
                  <a style={{ cursor: 'pointer' }} onClick={() => setActiveTab(tab)}>
                    {tab}
                  </a>
                </li>
              ))}
            </ol>
          </nav>

        </div>
      </div>

      {/* ── Fila de contenido — card con secciones de dominios ── */}
      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-body">

              {loading && (
                <div className="libro-dominios-spinner">
                  <div className="spinner-border" style={{ color: '#D2006E' }} role="status">
                    <span className="sr-only">Cargando...</span>
                  </div>
                </div>
              )}

              {!loading && error && (
                <div className="alert alert-danger">{error}</div>
              )}

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
        </div>
      </div>

      <ModalNuevoDominio
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSaved={() => {
          setModalOpen(false);
          getDominios().then(setDominios).catch(console.error);
        }}
      />
    </div>
  );
}

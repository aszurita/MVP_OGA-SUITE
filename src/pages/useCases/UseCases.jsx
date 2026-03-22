import { useState } from 'react';
import { Search, Plus, Filter, Trash2, MessageSquare } from 'lucide-react';
import UseCase from './components/UseCase';
import InfoMiniCard from './components/InfoMiniCard';
import UseCaseModal from './components/UseCaseModal';
import StatsBar from './components/StatsBar';
import CommentsModal from './components/CommentsModal';
import { subdominios, estadisticas, casosDeUso } from '../../data/useCasesData';
import './styles/UseCases.css';
import '../home/styles/Home.css';

const BREADCRUMB = ['Ficha de Dominio', 'Estructura', 'Artefactos', 'Términos y Atributos', 'Casos de Uso', 'Subdominios', 'Metadatos y Linaje'];

/**
 * UseCases – Página de Casos de Uso por Subdominio
 */
export default function UseCases() {
  const [selectedDomain, setSelectedDomain] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [openModal, setOpenModal] = useState(null);
  const [commentsOpen, setCommentsOpen] = useState(false);

  const currentCases = selectedDomain ? (casosDeUso[selectedDomain] || []) : [];

  const stats = selectedDomain
    ? {
        ingresados: currentCases.filter((c) => c.estado === 'INGRESADO').length,
        enProceso:  currentCases.filter((c) => c.estado === 'EN PROCESO').length,
        enCalidad:  currentCases.filter((c) => c.estado === 'EN CALIDAD').length,
        cerrados:   currentCases.filter((c) => c.estado === 'CERRADO').length,
      }
    : estadisticas;

  const filteredSubdominios = subdominios.filter((s) =>
    s.nombre.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="usecases-all">
      <div className="usecases">
        {/* Breadcrumb */}
        <div className="usecases__breadcrumb">
          {BREADCRUMB.map((item, i) => (
            <span key={item} className="usecases__breadcrumb-item">
              <span
                className={item === 'Subdominios' ? 'usecases__breadcrumb-active' : ''}
                onClick={() => item === 'Subdominios' && setSelectedDomain(null)}
              >
                {item}
              </span>
              {i < BREADCRUMB.length - 1 && <span className="usecases__breadcrumb-sep"> | </span>}
            </span>
          ))}
        </div>

        {/* Toolbar */}
        <div className="usecases__toolbar">
          <div className="usecases__search">
            <Search size={13} className="usecases__search-icon" />
            <input
              className="usecases__search-input"
              placeholder={selectedDomain ? `Buscar en ${selectedDomain}...` : 'Buscar subdominio para filtrar...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {!selectedDomain && (
            <span className="usecases__total-badge">{filteredSubdominios.length} resultados</span>
          )}

          <div className="usecases__toolbar-actions">
            <button className="usecases__action-btn"><Plus size={14} /></button>
            <button className="usecases__action-btn"><Filter size={14} /></button>
            <button className="usecases__action-btn usecases__action-btn--danger"><Trash2 size={14} /></button>
          </div>

          <div className="usecases__stats-wrap">
            <StatsBar {...stats} />
          </div>
        </div>

        {/* Grid de subdominios OR casos del dominio seleccionado */}
        {!selectedDomain ? (
          <div className="usecases__grid">
            {filteredSubdominios.map((sd) => (
              <UseCase
                key={sd.id}
                titulo={sd.nombre}
                cantidad={sd.casos}
                icon={sd.icon}
                onClick={() => setSelectedDomain(sd.nombre)}
              />
            ))}
          </div>
        ) : (
          <div className="usecases__detail">
            <div className="usecases__detail-header">
              <button className="usecases__back" onClick={() => setSelectedDomain(null)}>
                ← Subdominios
              </button>
              <h2 className="usecases__detail-title">
                {selectedDomain}
                <span className="usecases__detail-count"> {currentCases.length} casos</span>
              </h2>
            </div>

            {currentCases.length > 0 ? (
              <div className="usecases__cases-row">
                {currentCases.map((c) => (
                  <InfoMiniCard
                    key={c.id}
                    titulo={c.titulo}
                    estado={c.estado}
                    onClick={() => setOpenModal(c)}
                  />
                ))}
              </div>
            ) : (
              <div className="usecases__empty">
                No hay casos registrados para este subdominio.
              </div>
            )}
          </div>
        )}

        {/* Modal de caso de uso + botón de comentarios */}
        {openModal && (
          <>
            <UseCaseModal caso={openModal} onClose={() => setOpenModal(null)} />
            <button className="usecases__comments-fab" onClick={() => setCommentsOpen(true)}>
              <MessageSquare size={20} />
            </button>
          </>
        )}

        {/* Modal de comentarios */}
        {commentsOpen && (
          <CommentsModal onClose={() => setCommentsOpen(false)} />
        )}

      </div>
      <div className="home__banner-footer">Banco Guayaquil 2023</div>
    </div>
  );
}

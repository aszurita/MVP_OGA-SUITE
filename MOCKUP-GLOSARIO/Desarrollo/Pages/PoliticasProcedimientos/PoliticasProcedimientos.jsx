import { useState } from 'react';
import Sidebar from './Components/Sidebar';
import PdfViewer from './Components/PdfViewer';
import PoliticasView from './Components/PoliticasView';
import LevelView from './Components/LevelView';
import index from './politicas-index.json';
import './styles/PoliticasProcedimientos.css';

const SIMPLE_PDFS = {
  politicas: '/docs/PoliticasProcedimientos/Politica de Gobierno de Informacion y Analitica 072023.pdf#zoom=80',
  manifiesto: '/docs/PoliticasProcedimientos/001_manifesto_uso_de_datos.pdf',
  procesos: '/docs/PoliticasProcedimientos/APO 7.1.1 Gestionar mapa de dominios.pdf',
  'procesos-apoyo': '/docs/PoliticasProcedimientos/APO 7.1.2 - Administrar calidad y estrategia de datos de la organizacion.pdf',
};

const INDICE_DEFAULT_PDFS = {
  indice: index.indice,
  'gob-modelos': '/docs/PoliticasDataHub/Politicas De Gobierno De Modelos/Word.pdf',
  'nivel-2': '/docs/PoliticasDataHub/Estandares Y Lineamientos/Nivel 2.pdf',
  'nivel-3': '/docs/PoliticasDataHub/Procedimientos Operativos/Nivel 3.pdf',
  'nivel-4': '/docs/PoliticasDataHub/Anexos/Anexos.pdf',
};

const INDICE_CONTEXT = new Set(['indice', 'nivel-2', 'nivel-3', 'nivel-4', 'gob-modelos']);

const NAV = [
  { id: 'politicas', label: 'Gobierno de Datos' },
  { id: 'manifiesto', label: 'Manifiesto' },
  { id: 'procesos', label: 'Procesos' },
  { id: 'procesos-apoyo', label: 'Procesos de Apoyo' },
  { id: 'indice', label: 'Gobierno de Modelos' },
];

export default function PoliticasProcedimientos() {
  const [activeTab, setActiveTab] = useState('politicas');
  const [activeDoc, setActiveDoc] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  function navIsActive(id) {
    if (id === 'indice') return INDICE_CONTEXT.has(activeTab);
    return activeTab === id;
  }

  function handleNavigate(tab) {
    setActiveTab(tab);
    setActiveDoc(null);

    if (INDICE_CONTEXT.has(tab)) {
      setSidebarOpen(true);
    }
  }

  function handleCloseSidebar() {
    setSidebarOpen(false);

    if (!activeDoc && INDICE_CONTEXT.has(activeTab) && activeTab !== 'indice') {
      setActiveTab('indice');
    }
  }

  function renderContent() {
    if (SIMPLE_PDFS[activeTab]) {
      return <PdfViewer src={SIMPLE_PDFS[activeTab]} />;
    }

    if (activeTab === 'gob-modelos') {
      if (sidebarOpen) {
        return <PdfViewer src={activeDoc?.pdf ?? INDICE_DEFAULT_PDFS[activeTab]} />;
      }

      const section = index.sections.find((s) => s.id === 'politicas');
      return <PoliticasView section={section} />;
    }

    if (activeTab === 'indice') {
      return <PdfViewer src={index.indice} />;
    }

    const section = index.sections.find((s) => s.id === activeTab);
    if (!section) return null;

    if (sidebarOpen) {
      const src = activeDoc?.pdf ?? INDICE_DEFAULT_PDFS[activeTab];
      return <PdfViewer src={src} />;
    }

    return <LevelView section={section} activeDoc={activeDoc} onOpen={setActiveDoc} />;
  }

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-12">
          <div className="pp-header">
            <h1>Politicas y Procedimientos</h1>
            <nav aria-label="secciones">
              <ul className="pp-nav">
                {NAV.map((item) => (
                  <li key={item.id}>
                    <button
                      type="button"
                      className={`pp-nav-btn${navIsActive(item.id) ? ' active' : ''}`}
                      onClick={() => handleNavigate(item.id)}
                    >
                      {item.label}
                    </button>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="pp-header-right">
              <button
                type="button"
                className={`pp-btn-hamburger${sidebarOpen ? ' open' : ''}`}
                aria-label={sidebarOpen ? 'Cerrar Indice' : 'Abrir Indice'}
                onClick={() => (sidebarOpen ? handleCloseSidebar() : setSidebarOpen(true))}
              >
                <span /><span /><span />
              </button>
            </div>
          </div>

          <hr className="pp-separator" />

          <div className="card">
            <div className="card-body">
              <div className="pp-body">
                <div className="pp-main">{renderContent()}</div>

                {sidebarOpen && (
                  <Sidebar
                    sections={index.sections}
                    activeTab={activeTab}
                    activeDoc={activeDoc}
                    onNavigate={handleNavigate}
                    onOpenDoc={setActiveDoc}
                    onClose={handleCloseSidebar}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

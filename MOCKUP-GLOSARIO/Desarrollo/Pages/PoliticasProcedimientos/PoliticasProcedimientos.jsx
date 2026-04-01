import { useState } from 'react';
import index from './politicas-index.json';
import './styles/PoliticasProcedimientos.css';

function Sidebar({ activeTab, activeDoc, onNavigate, onOpenDoc, onClose }) {
  const sidebarLevels = [
    { tab: 'gob-modelos', sectionId: 'politicas', levelLabel: 'Nivel 1', label: 'Polí­ticas' },
    { tab: 'nivel-2', sectionId: 'nivel-2', levelLabel: 'Nivel 2', label: 'Estándares y lineamientos' },
    { tab: 'nivel-3', sectionId: 'nivel-3', levelLabel: 'Nivel 3', label: 'Procedimientos operativos' },
    { tab: 'nivel-4', sectionId: 'nivel-4', levelLabel: 'Nivel 4', label: 'Anexos' },
  ];

  return (
    <aside className="pp-sidebar">
      <div className="pp-sidebar-header">
        <p className="pp-sidebar-title">Indice de documentos</p>
        <button className="pp-sidebar-close" type="button" aria-label="Cerrar" onClick={onClose}>
          x
        </button>
      </div>

      <div className="pp-sidebar-body">
        {sidebarLevels.map(({ tab, sectionId, levelLabel, label }) => {
          const isActive = activeTab === tab;
          const section = index.sections.find((item) => item.id === sectionId);

          return (
            <div key={tab} className="pp-sidebar-level">
              <p className="pp-sidebar-level-label">{levelLabel}</p>
              <button
                type="button"
                className={`pp-sidebar-level-btn${isActive ? ' active' : ''}`}
                onClick={() => onNavigate(tab)}
              >
                <span className="pp-menu-icon" aria-hidden="true">
                  <span /><span /><span />
                </span>
                {label}
              </button>

              {isActive && section && (
                <div className="pp-sidebar-docs">
                  {section.docs.map((doc) => {
                    if (doc.subcards || doc.links) {
                      return <Anexo4Card key={doc.id} doc={doc} />;
                    }

                    return (
                      <div key={doc.id} className={`pp-sidebar-doc-card${doc.missing ? ' missing' : ''}`}>
                        <p className="pp-sidebar-doc-title">{doc.title}</p>
                        <p className="pp-sidebar-doc-desc">{doc.desc}</p>

                        {!doc.missing && (
                          <div className="pp-sidebar-doc-actions">
                            {doc.word && (
                              <button
                                type="button"
                                className={`pp-sidebar-doc-chip${activeDoc?.pdf === doc.word ? ' active' : ''}`}
                                title={`Ver documento: ${doc.title}`}
                                onClick={() => onOpenDoc({ pdf: doc.word, title: doc.title })}
                              >
                                W
                              </button>
                            )}
                            {doc.slides && (
                              <button
                                type="button"
                                className={`pp-sidebar-doc-chip alt${activeDoc?.pdf === doc.slides ? ' active' : ''}`}
                                title={`Ver presentación: ${doc.title}`}
                                onClick={() => onOpenDoc({ pdf: doc.slides, title: doc.title })}
                              >
                                P
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </aside>
  );
}

function PdfViewer({ src }) {
  return (
    <div className="pp-pdf-wrap">
      <iframe key={src} src={src} title="Visor de documento" loading="lazy">
        <p className="pp-pdf-error">
          Tu navegador no puede mostrar el PDF.{' '}
          <a href={src} target="_blank" rel="noopener noreferrer">Abrir aquí</a>
        </p>
      </iframe>
    </div>
  );
}

function DocChip({ letter, label, onClick }) {
  const isWord = letter === 'W';

  return (
    <button
      type="button"
      className={`pp-chip ${isWord ? 'pp-chip-word' : 'pp-chip-slides'}`}
      title={label}
      onClick={onClick}
    >
      <span className="pp-chip-letter">{letter}</span>
      <span>{label}</span>
    </button>
  );
}

function Anexo4Card({ doc }) {
  return (
    <div className="pp-doc-card pp-doc-card-anexo">
      <div className="pp-doc-title">{doc.title}</div>
      <div className="pp-doc-sub">{doc.desc}</div>

      {doc.links?.length ? (
        <div className="pp-link-list">
          {doc.links.map((lnk, i) => (
            <div key={i} className="pp-link-item">
              <span className="pp-link-label">{lnk.label}</span>
              <a className="pp-link" href={lnk.href} target="_blank" rel="noopener noreferrer">
                {lnk.linkLabel ?? 'Abrir enlace'}
              </a>
            </div>
          ))}
        </div>
      ) : null}

      {doc.subcards?.length ? (
        <div className="pp-subcards">
          {doc.subcards.map((sc, i) => (
            <div key={i} className="pp-subcard">
              <div className="pp-subcard-title">{sc.title}</div>
              <div className="pp-subcard-note">{sc.note}</div>
              {sc.href ? (
                <a className="pp-link" href={sc.href} target="_blank" rel="noopener noreferrer">
                  {sc.linkLabel ?? 'Abrir enlace'}
                </a>
              ) : (
                <span className="pp-tag">{sc.tag}</span>
              )}
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}

function DocCard({ doc, onOpen }) {
  if (doc.subcards || doc.links) return <Anexo4Card doc={doc} />;

  return (
    <div className={`pp-doc-card${doc.missing ? ' missing' : ''}`}>
      <p className="pp-doc-card-title">{doc.title}</p>
      <p className="pp-doc-card-desc">{doc.desc}</p>

      {!doc.missing && (
        <div className="pp-doc-card-actions">
          {doc.word && (
            <DocChip
              letter="W"
              label="Ver documento"
              onClick={() => onOpen({ pdf: doc.word, title: doc.title })}
            />
          )}
          {doc.slides && (
            <DocChip
              letter="P"
              label="Ver presentación"
              onClick={() => onOpen({ pdf: doc.slides, title: doc.title })}
            />
          )}
        </div>
      )}
    </div>
  );
}

function PoliticasView({ section }) {
  const [mode, setMode] = useState('word');
  const doc = section.docs[0];
  const src = mode === 'word' ? doc.word : doc.slides;

  return (
    <>
      <div className="pp-doc-card-actions left" style={{ marginBottom: 12 }}>
        <DocChip letter="W" label="Ver documento" onClick={() => setMode('word')} />
        <DocChip letter="P" label="Ver presentación" onClick={() => setMode('slides')} />
      </div>
      <PdfViewer src={src} />
    </>
  );
}

function LevelView({ section, activeDoc, onOpen, onBack }) {
  if (activeDoc) {
    return (
      <>
        <button className="pp-back-btn" type="button" onClick={onBack}>
          Volver al Indice
        </button>
        <PdfViewer src={activeDoc.pdf} />
      </>
    );
  }

  return (
    <>
      <div className="pp-section-header">
        <span className="pp-section-chip">
          <span className="pp-section-chip-icon" aria-hidden="true">
            <span /><span /><span />
          </span>
          {section.sectionLabel}
        </span>
      </div>

      <div className="pp-cards-grid">
        {section.docs.map((doc) => (
          <DocCard key={doc.id} doc={doc} onOpen={onOpen} />
        ))}
      </div>
    </>
  );
}

const SIMPLE_PDFS = {
  politicas: '/docs/PoliticasProcedimientos/Politica de Gobierno de Informacion y Analitica 072023.pdf#zoom=80',
  manifiesto: '/docs/PoliticasProcedimientos/MANIFIESTO DE USO DE DATOS BANCO GUAYAQUIL.pdf',
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

export default function PoliticasProcedimientos() {
  const [activeTab, setActiveTab] = useState('politicas');
  const [activeDoc, setActiveDoc] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const NAV = [
    { id: 'politicas', label: 'Polí­ticas' },
    { id: 'manifiesto', label: 'Manifiesto' },
    { id: 'procesos', label: 'Procesos' },
    { id: 'procesos-apoyo', label: 'Procesos de Apoyo' },
    { id: 'gob-modelos', label: 'Gobierno de Modelos' },
    { id: 'indice', label: 'Índice' },
  ];

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

      return activeDoc ? (
        <>
          <button className="pp-back-btn" type="button" onClick={() => setActiveDoc(null)}>
            Volver al Índice
          </button>
          <PdfViewer src={src} />
        </>
      ) : (
        <PdfViewer src={src} />
      );
    }

    return (
      <LevelView
        section={section}
        activeDoc={activeDoc}
        onOpen={setActiveDoc}
        onBack={() => setActiveDoc(null)}
      />
    );
  }

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-12">
          <div className="pp-header">
            <h1>Polí­ticas y Procedimientos</h1>
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
                aria-label={sidebarOpen ? 'Cerrar Í­ndice' : 'Abrir Í­ndice'}
                onClick={() => setSidebarOpen((value) => !value)}
              >
                <span /><span /><span />
              </button>
            </div>
          </div>

          <hr className="pp-separator" />

          <div className="card">
            <div className="card-body">
              <div className="pp-body">
                <div className="pp-main">
                  {renderContent()}
                </div>

                {sidebarOpen && (
                  <Sidebar
                    activeTab={activeTab}
                    activeDoc={activeDoc}
                    onNavigate={handleNavigate}
                    onOpenDoc={setActiveDoc}
                    onClose={() => setSidebarOpen(false)}
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

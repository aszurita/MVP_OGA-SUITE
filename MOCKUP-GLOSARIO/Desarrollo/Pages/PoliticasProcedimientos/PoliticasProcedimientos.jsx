import { useState } from 'react';
import index from './politicas-index.json';
import './styles/PoliticasProcedimientos.css';

/* ── Sidebar ──────────────────────────────────────────────── */
function Sidebar({ activeTab, onNavigate, onClose }) {
  const sidebarLevels = [
    { tab: 'gob-modelos', levelLabel: 'Nivel 1', label: 'Políticas' },
    { tab: 'nivel-2',     levelLabel: 'Nivel 2', label: 'Estándares y lineamientos' },
    { tab: 'nivel-3',     levelLabel: 'Nivel 3', label: 'Procedimientos operativos' },
    { tab: 'nivel-4',     levelLabel: 'Nivel 4', label: 'Anexos' },
  ];
  return (
    <aside className="pp-sidebar">
      <div className="pp-sidebar-header">
        <p className="pp-sidebar-title">Índice de documentos</p>
        <button className="pp-sidebar-close" type="button" aria-label="Cerrar" onClick={onClose}>
          ×
        </button>
      </div>
      <div className="pp-sidebar-body">
        {sidebarLevels.map(({ tab, levelLabel, label }) => (
          <div key={tab} className="pp-sidebar-level">
            <p className="pp-sidebar-level-label">{levelLabel}</p>
            <button
              type="button"
              className={`pp-sidebar-level-btn${activeTab === tab ? ' active' : ''}`}
              onClick={() => onNavigate(tab)}
            >
              <span className="pp-menu-icon" aria-hidden="true">
                <span /><span /><span />
              </span>
              {label}
            </button>
          </div>
        ))}
      </div>
    </aside>
  );
}

/* ── PDF viewer ───────────────────────────────────────────── */
function PdfViewer({ src }) {
  return (
    <div className="pp-pdf-wrap">
      <iframe
        key={src}
        src={src}
        title="Visor de documento"
        loading="lazy"
      >
        <p className="pp-pdf-error">
          Tu navegador no puede mostrar el PDF.{' '}
          <a href={src} target="_blank" rel="noopener noreferrer">Abrir aquí</a>
        </p>
      </iframe>
    </div>
  );
}

/* ── W / P chip button ────────────────────────────────────── */
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

/* ── Anexo 4 card (links + subcards) ─────────────────────── */
function Anexo4Card({ doc }) {
  return (
    <div className="pp-doc-card">
      <p className="pp-doc-card-title">{doc.title}</p>
      <p className="pp-doc-card-desc">{doc.desc}</p>
      {doc.links?.map((lnk, i) => (
        <div key={i} className="pp-links-row">
          <span className="pp-links-row-label">{lnk.label}</span>
          <a className="pp-link" href={lnk.href} target="_blank" rel="noopener noreferrer">
            Abrir carpeta
          </a>
        </div>
      ))}
      {doc.subcards && (
        <div className="pp-subcards">
          {doc.subcards.map((sc, i) => (
            <div key={i} className="pp-subcard">
              <span className="pp-subcard-title">{sc.title}</span>
              <span className="pp-subcard-note">{sc.note}</span>
              {sc.href ? (
                <a className="pp-link" href={sc.href} target="_blank" rel="noopener noreferrer">
                  {sc.linkLabel}
                </a>
              ) : (
                <span className="pp-tag">{sc.tag}</span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ── Regular document card ────────────────────────────────── */
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

/* ── Políticas view (single doc with W/P toggle) ─────────── */
function PoliticasView({ section }) {
  const [mode, setMode] = useState('word');
  const doc = section.docs[0];
  const src = mode === 'word' ? doc.word : doc.slides;
  return (
    <>
      <div className="pp-doc-card-actions left" style={{ marginBottom: 12 }}>
        <DocChip letter="W" label="Ver documento"    onClick={() => setMode('word')} />
        <DocChip letter="P" label="Ver presentación" onClick={() => setMode('slides')} />
      </div>
      <PdfViewer src={src} />
    </>
  );
}

/* ── Level view (cards grid) ──────────────────────────────── */
function LevelView({ section, activeDoc, onOpen, onBack }) {
  if (activeDoc) {
    return (
      <>
        <button className="pp-back-btn" type="button" onClick={onBack}>
          Volver al índice
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

/* PDFs de las pestañas simples (originales) */
const SIMPLE_PDFS = {
  'politicas':      '/docs/PoliticasProcedimientos/Politica de Gobierno de Informacion y Analitica 072023.pdf#zoom=80',
  'manifiesto':     '/docs/PoliticasProcedimientos/MANIFIESTO DE USO DE DATOS BANCO GUAYAQUIL.pdf',
  'procesos':       '/docs/PoliticasProcedimientos/APO 7.1.1 Gestionar mapa de dominios.pdf',
  'procesos-apoyo': '/docs/PoliticasProcedimientos/APO 7.1.2 - Administrar calidad y estrategia de datos de la organizacion.pdf',
};

/* Pestañas que pertenecen al contexto "Índice" */
const INDICE_CONTEXT = new Set(['indice', 'nivel-2', 'nivel-3', 'nivel-4']);

/* ══ Main component ═══════════════════════════════════════ */
export default function PoliticasProcedimientos() {
  const [activeTab, setActiveTab]     = useState('politicas');
  const [activeDoc, setActiveDoc]     = useState(null); // { pdf, title }
  const [sidebarOpen, setSidebarOpen] = useState(false);

  /* Solo 6 ítems visibles en el nav.
     Nivel 2/3/4 se navegan desde el sidebar. */
  const NAV = [
    { id: 'politicas',      label: 'Políticas' },
    { id: 'manifiesto',     label: 'Manifiesto' },
    { id: 'procesos',       label: 'Procesos' },
    { id: 'procesos-apoyo', label: 'Procesos de Apoyo' },
    { id: 'gob-modelos',    label: 'Gobierno de Modelos' },
    { id: 'indice',         label: 'Índice' },
  ];

  /* "Índice" se resalta cuando se está en cualquier nivel */
  function navIsActive(id) {
    if (id === 'indice') return INDICE_CONTEXT.has(activeTab);
    return activeTab === id;
  }

  function handleNavigate(tab) {
    setActiveTab(tab);
    setActiveDoc(null);
    if (INDICE_CONTEXT.has(tab)) setSidebarOpen(true);
  }

  function renderContent() {
    // Pestañas simples
    if (SIMPLE_PDFS[activeTab]) {
      return <PdfViewer src={SIMPLE_PDFS[activeTab]} />;
    }

    // Gobierno de Modelos → Nivel 1 con W/P
    if (activeTab === 'gob-modelos') {
      const section = index.sections.find((s) => s.id === 'politicas');
      return <PoliticasView section={section} />;
    }

    // Índice general
    if (activeTab === 'indice') {
      return <PdfViewer src={index.indice} />;
    }

    // Niveles 2 / 3 / 4
    const section = index.sections.find((s) => s.id === activeTab);
    if (!section) return null;
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

          {/* ── Header ── */}
          <div className="pp-header">
            <h1>Políticas y Procedimientos</h1>
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
                aria-label={sidebarOpen ? 'Cerrar índice' : 'Abrir índice'}
                onClick={() => setSidebarOpen((v) => !v)}
              >
                <span /><span /><span />
              </button>
            </div>
          </div>

          <hr className="pp-separator" />

          {/* ── Body ── */}
          <div className="card">
            <div className="card-body">
              <div className="pp-body">
                <div className="pp-main">
                  {renderContent()}
                </div>
                {sidebarOpen && (
                  <Sidebar
                    activeTab={activeTab}
                    onNavigate={handleNavigate}
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

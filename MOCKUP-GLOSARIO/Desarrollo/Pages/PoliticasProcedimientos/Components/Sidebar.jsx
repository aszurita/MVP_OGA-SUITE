import Anexo4Card from './Anexo4Card';

const SIDEBAR_LEVELS = [
  { tab: 'gob-modelos', sectionId: 'politicas', levelLabel: 'Nivel 1', label: 'Politicas' },
  { tab: 'nivel-2', sectionId: 'nivel-2', levelLabel: 'Nivel 2', label: 'Estandares y lineamientos' },
  { tab: 'nivel-3', sectionId: 'nivel-3', levelLabel: 'Nivel 3', label: 'Procedimientos operativos' },
  { tab: 'nivel-4', sectionId: 'nivel-4', levelLabel: 'Nivel 4', label: 'Anexos' },
];

export default function Sidebar({ sections, activeTab, activeDoc, onNavigate, onOpenDoc, onClose }) {
  return (
    <aside className="pp-sidebar">
      <div className="pp-sidebar-header">
        <p className="pp-sidebar-title">Indice de documentos</p>
        <button className="pp-sidebar-close" type="button" aria-label="Cerrar" onClick={onClose}>
          x
        </button>
      </div>

      <div className="pp-sidebar-body">
        {SIDEBAR_LEVELS.map(({ tab, sectionId, levelLabel, label }) => {
          const isActive = activeTab === tab;
          const section = sections.find((item) => item.id === sectionId);

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
                                title={`Ver presentacion: ${doc.title}`}
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

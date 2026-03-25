/**
 * PoliticasProcedimientos.jsx
 * Página de Políticas y Procedimientos — conversión React del ASPX original.
 *
 * Fuentes de PDF:
 *   - Políticas      → /docs/PoliticasProcedimientos/Politica de Gobierno...pdf  (archivo local)
 *   - Manifiesto     → /docs/PoliticasProcedimientos/MANIFIESTO DE USO...pdf     (archivo local)
 *   - Procesos       → http://vamos.bancoguayaquil.com/...  (SharePoint interno)
 *   - Procesos Apoyo → http://vamos.bancoguayaquil.com/...  (SharePoint interno)
 *
 * NOTA: Los PDFs locales deben estar en la carpeta `public/docs/PoliticasProcedimientos/`
 * para que Vite los sirva correctamente. Mueve o copia `Desarrollo/docs/` a `Desarrollo/public/docs/`.
 */
import { useState } from 'react';

const TABS = [
  {
    id: 'politicas',
    label: 'Políticas',
    pdf: '/docs/PoliticasProcedimientos/Politica de Gobierno de Informacion y Analitica 072023.pdf#zoom=80',
  },
  {
    id: 'manifiesto',
    label: 'Manifiesto',
    pdf: '/docs/PoliticasProcedimientos/MANIFIESTO DE USO DE DATOS BANCO GUAYAQUIL.pdf',
  },
  {
    id: 'procesos',
    label: 'Procesos',
    pdf: '/docs/PoliticasProcedimientos/APO 7.1.1 Gestionar mapa de dominios.pdf',
  },
  {
    id: 'procesos-apoyo',
    label: 'Procesos de Apoyo',
    pdf: '/docs/PoliticasProcedimientos/APO 7.1.2 - Administrar calidad y estrategia de datos de la organizacion.pdf',
  },
];

export default function PoliticasProcedimientos() {
  const [activeTab, setActiveTab] = useState('politicas');

  const tabActivo = TABS.find((t) => t.id === activeTab);

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-12">

          {/* Título + breadcrumb en la misma línea (igual que el ASPX original) */}
          <div className="d-flex align-items-end flex-wrap mb-1" style={{ gap: '16px' }}>
            <h1 className="mb-0">Políticas y Procedimientos</h1>
            <nav className="breadcrumb-container" aria-label="breadcrumb">
              <ol className="breadcrumb pl-0 mb-0">
                {TABS.map((tab) => (
                  <li key={tab.id} className="breadcrumb-item">
                    <a
                      onClick={() => setActiveTab(tab.id)}
                      style={{
                        cursor: 'pointer',
                        color: activeTab === tab.id ? '#D2006E' : undefined,
                        fontWeight: activeTab === tab.id ? 600 : undefined,
                        textDecoration: activeTab === tab.id ? 'underline' : 'none',
                      }}
                    >
                      {tab.label}
                    </a>
                  </li>
                ))}
              </ol>
            </nav>
          </div>
          <div className="separator" style={{ marginBottom: 32 }} />

          {/* Visor PDF — card con padding blanco igual que el ASPX original */}
          <div className="card">
            <div className="card-body">
              <object
                key={tabActivo.id}
                data={tabActivo.pdf}
                type="application/pdf"
                width="100%"
                height="800px"
                style={{ display: 'block' }}
              >
                <p className="p-3 text-muted">
                  Tu navegador no puede mostrar el PDF directamente.{' '}
                  <a href={tabActivo.pdf} target="_blank" rel="noopener noreferrer">
                    Abre el PDF aquí
                  </a>
                </p>
              </object>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

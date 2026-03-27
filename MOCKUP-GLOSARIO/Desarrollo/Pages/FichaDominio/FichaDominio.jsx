/**
 * FichaDominio.jsx
 * Página de detalle de un dominio: ficha con info, avances y stats.
 * Route: /ficha-dominio/:id
 */
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  getDominioById,
  getAvancesDominio,
  getArtefactosByDominio,
  getEstructuraByDominio,
  getTablasOficiales,
  getCasosUsoByDominio,
  getTerminosByDominio,
} from '../../services/dominiosService.js';
import DominioNavTabs from './components/DominioNavTabs.jsx';
import AvanceDominio from './components/AvanceDominio.jsx';
import './styles/FichaDominio.css';

export default function FichaDominio() {
  const { id } = useParams();

  const [dominio, setDominio]   = useState(null);
  const [avances, setAvances]   = useState([]);
  const [stats, setStats]       = useState({
    atributos: 0,
    terminos: 0,
    artefactos: 0,
    estructura: 0,
    tablas: 0,
    casosUso: 0,
  });
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);

  useEffect(() => {
    if (!id) return;

    async function fetchAll() {
      setLoading(true);
      setError(null);
      try {
        const dom = await getDominioById(id);
        setDominio(dom);

        const [avancesData, artefactos, estructura, casosUso] = await Promise.all([
          getAvancesDominio(id),
          getArtefactosByDominio(id),
          getEstructuraByDominio(id),
          getCasosUsoByDominio(id),
        ]);

        setAvances(avancesData);

        // Términos y atributos por nombre de dominio
        let terminos  = [];
        let atributos = [];
        if (dom && dom.nombre_dominio) {
          const [terminosData, atributosData, tablasData] = await Promise.all([
            getTerminosByDominio(dom.nombre_dominio, 'termino'),
            getTerminosByDominio(dom.nombre_dominio, 'atributo'),
            getTablasOficiales(dom.nombre_dominio),
          ]);
          terminos  = terminosData;
          atributos = atributosData;
          setStats({
            atributos: atributosData.length,
            terminos:  terminosData.length,
            artefactos: artefactos.length,
            estructura: estructura.length,
            tablas:    tablasData.length,
            casosUso:  casosUso.length,
          });
        } else {
          setStats({
            atributos: 0,
            terminos:  0,
            artefactos: artefactos.length,
            estructura: estructura.length,
            tablas:    0,
            casosUso:  casosUso.length,
          });
        }
      } catch (err) {
        console.error('[FichaDominio] fetchAll:', err);
        setError('Error al cargar la ficha del dominio. Intente nuevamente.');
      } finally {
        setLoading(false);
      }
    }

    fetchAll();
  }, [id]);

  if (loading) {
    return (
      <div className="dominio-page-wrapper">
        <div className="dominio-spinner">
          <div className="spinner-border" style={{ color: '#D2006E' }} role="status">
            <span className="sr-only">Cargando...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dominio-page-wrapper">
        <div className="dominio-error">{error}</div>
      </div>
    );
  }

  return (
    <div className="dominio-page-wrapper">
      {/* Cabecera con tabs de navegación */}
      <DominioNavTabs dominio={dominio} stats={stats} dominioId={id} />

      {/* Cuerpo: dos columnas */}
      <div className="ficha-dominio-body">
        {/* Panel izquierdo: checklist de avances */}
        <AvanceDominio avances={avances} />

        {/* Panel derecho: información del dominio */}
        <div className="dominio-info-panel">
          <h6>
            <i className="iconsminds-information mr-2" style={{ color: '#D2006E' }} />
            Información del Dominio
          </h6>

          <div className="info-row">
            <div className="info-field">
              <div className="info-label">Familia</div>
              <div className="info-value">{dominio?.familia || '—'}</div>
            </div>
            <div className="info-field">
              <div className="info-label">Operación</div>
              <div className="info-value">{dominio?.operacion || '—'}</div>
            </div>
            <div className="info-field">
              <div className="info-label">Tipo</div>
              <div className="info-value">{dominio?.tipo_dominio || '—'}</div>
            </div>
          </div>

          <div className="info-row">
            <div className="info-field">
              <div className="info-label">Dominio Maestro</div>
              <div className="info-value">
                {dominio?.tipo_dominio === 'Maestros' ? (
                  <span className="badge badge-pill" style={{ background: '#D2006E', color: '#fff' }}>
                    Sí
                  </span>
                ) : '—'}
              </div>
            </div>
            <div className="info-field">
              <div className="info-label">Codificación</div>
              <div className="info-value">{dominio?.codificacion || '—'}</div>
            </div>
          </div>

          <div className="info-row">
            <div className="info-field" style={{ flex: '1 1 100%' }}>
              <div className="info-label">Concepto</div>
              <div className="info-value" style={{ whiteSpace: 'pre-wrap', lineHeight: 1.5 }}>
                {dominio?.concepto || '—'}
              </div>
            </div>
          </div>

          <div className="info-row">
            <div className="info-field" style={{ flex: '1 1 100%' }}>
              <div className="info-label">Subdominios</div>
              <div className="info-value">
                {dominio?.subdominios
                  ? dominio.subdominios.split(';').map((s, i) => (
                      <span
                        key={i}
                        className="badge badge-pill mr-1 mb-1"
                        style={{ background: '#fce4ec', color: '#D2006E', border: '1px solid #D2006E' }}
                      >
                        {s.trim()}
                      </span>
                    ))
                  : '—'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

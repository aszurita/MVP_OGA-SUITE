/**
 * DominioNavTabs.jsx
 * Cabecera compartida por TODAS las sub-páginas de un dominio.
 * Muestra: círculo de progreso, nombre/estado del dominio,
 * barra de estadísticas y tabs de navegación.
 *
 * Props:
 *   dominio    — objeto con datos del dominio
 *   stats      — { atributos, terminos, artefactos, estructura, tablas, casosUso }
 *   dominioId  — id del dominio (para construir rutas)
 */
import { useNavigate, useLocation } from 'react-router-dom';
import '../styles/FichaDominio.css';

const CIRCUMFERENCE = 2 * Math.PI * 34; // radio = 34

function ProgressCircle({ porcentaje = 0 }) {
  const pct = Math.min(100, Math.max(0, parseFloat(porcentaje) || 0));
  const offset = CIRCUMFERENCE - (pct / 100) * CIRCUMFERENCE;

  return (
    <div className="dominio-progress-circle">
      <svg viewBox="0 0 80 80">
        <circle className="circle-bg" cx="40" cy="40" r="34" />
        <circle
          className="circle-fill"
          cx="40"
          cy="40"
          r="34"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={offset}
        />
      </svg>
      <span className="pct-label">{pct.toFixed(0)}%</span>
    </div>
  );
}

const TABS = [
  { label: 'Ficha de Dominio',       path: (id) => `/ficha-dominio/${id}`,        matchKey: 'ficha-dominio'        },
  { label: 'Estructura',             path: (id) => `/dominio-estructura/${id}`,   matchKey: 'dominio-estructura'   },
  { label: 'Artefactos',             path: (id) => `/dominio-artefactos/${id}`,   matchKey: 'dominio-artefactos'   },
  { label: 'Términos y Atributos',   path: (id) => `/dominio-terminos/${id}/atributo`, matchKey: 'dominio-terminos' },
  { label: 'Tablas Oficiales',       path: (id) => `/ficha-tablas/${id}`,         matchKey: 'ficha-tablas'         },
  { label: 'Casos de Uso',           path: (id) => `/casos-de-uso/${id}`,         matchKey: 'casos-de-uso'         },
];

const STAT_DEFS = [
  { key: 'atributos',  label: 'Atributos',       icon: 'iconsminds-tag',              tabKey: 'dominio-terminos'   },
  { key: 'terminos',   label: 'Términos',         icon: 'iconsminds-books',            tabKey: 'dominio-terminos'   },
  { key: 'artefactos', label: 'Artefactos',       icon: 'iconsminds-newspaper',        tabKey: 'dominio-artefactos' },
  { key: 'estructura', label: 'Estructura',       icon: 'iconsminds-conference',       tabKey: 'dominio-estructura' },
  { key: 'tablas',     label: 'Tablas Oficiales', icon: 'iconsminds-data-storage',     tabKey: 'ficha-tablas'       },
  { key: 'casosUso',   label: 'Casos de Uso',     icon: 'iconsminds-monitor-analytics',tabKey: 'casos-de-uso'       },
];

export default function DominioNavTabs({ dominio, stats = {}, dominioId }) {
  const navigate = useNavigate();
  const location = useLocation();

  const currentPath = location.pathname;

  function isTabActive(matchKey) {
    return currentPath.includes(matchKey);
  }

  function goTo(tab) {
    navigate(tab.path(dominioId));
  }

  function goToStat(tabKey) {
    const tab = TABS.find((t) => t.matchKey === tabKey);
    if (tab) navigate(tab.path(dominioId));
  }

  const porcentaje = dominio ? (dominio.porcentaje_avance || 0) : 0;
  const nombre     = dominio ? (dominio.nombre_dominio || 'Cargando...') : 'Cargando...';
  const ola        = dominio ? (dominio.ola || '') : '';
  const estado     = dominio ? (dominio.estado || '') : '';
  const activo     = dominio ? (dominio.sn_activo === 1 || dominio.sn_activo === '1') : false;

  return (
    <div className="dominio-header-bar">
      {/* Fila superior: progreso + info + stats */}
      <div className="dominio-header-top">
        <ProgressCircle porcentaje={porcentaje} />

        <div className="dominio-header-info">
          <h4>{nombre}</h4>
          <div>
            {ola && <span className="chip-ola">Ola {ola}</span>}
            <span className={`chip-estado ${activo ? 'activo' : 'inactivo'}`}>
              {estado || (activo ? 'Activo' : 'Inactivo')}
            </span>
          </div>
        </div>

        <div className="dominio-stats-bar ml-auto">
          {STAT_DEFS.map((def) => {
            const active = isTabActive(def.tabKey);
            return (
              <div
                key={def.key}
                className={`stat-item ${active ? 'active' : ''}`}
                onClick={() => goToStat(def.tabKey)}
                title={def.label}
              >
                <i className={def.icon} />
                <span className="stat-num">{stats[def.key] ?? 0}</span>
                <span className="stat-label">{def.label}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Tabs de navegación */}
      <div className="dominio-nav-tabs">
        {TABS.map((tab) => (
          <button
            key={tab.label}
            className={`dominio-nav-tab ${isTabActive(tab.matchKey) ? 'active' : ''}`}
            onClick={() => goTo(tab)}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
}

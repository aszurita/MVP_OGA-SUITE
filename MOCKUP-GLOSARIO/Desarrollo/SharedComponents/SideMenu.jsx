import { useLocation, Link } from 'react-router-dom';

const NAV_ITEMS = [
  {
    path: '/politicas-procedimientos',
    icon: 'iconsminds-letter-open',
    label: 'Políticas y Procedimientos',
  },
  {
    path: null,
    icon: null,
    imgSrc: 'img/datahub_logo_azul.png',
    imgAlt: 'Logo DataHub',
    label: 'Data Hub',
    disabled: true,
  },
  {
    path: '/libro-dominios',
    icon: 'iconsminds-library',
    label: 'Libro de Dominios',
  },
  {
    path: '/glosario',
    icon: 'iconsminds-open-book',
    label: 'Glosario Empresarial de Datos',
  },
  {
    path: null,
    icon: 'iconsminds-diploma-2',
    label: 'Mesa de Ayuda de Datos',
    disabled: true,
  },
  {
    path: null,
    icon: 'iconsminds-line-chart-1',
    label: 'Indicadores de Gestión',
    disabled: true,
  },
  {
    path: null,
    icon: 'iconsminds-idea',
    label: 'Estrategia del Dato',
    disabled: true,
  },
];

export default function SideMenu() {
  const { pathname } = useLocation();
  const activePath = pathname === '/' || pathname === '' ? '/glosario' : pathname;

  return (
    <div className="menu">
      <div className="main-menu">
        <div className="scroll">
          <ul className="list-unstyled" id="suite-navbar">
            {NAV_ITEMS.map((item) => {
              const isActive = item.path && (item.path === activePath || activePath.startsWith(item.path + '/'));

              if (item.disabled) {
                return (
                  <li key={item.label}>
                    <a href="#" style={{ opacity: 0.5, cursor: 'default' }} onClick={e => e.preventDefault()}>
                      {item.imgSrc ? (
                        <div style={{ height: '42px', width: '42px', marginBottom: '2px' }}>
                          <img src={item.imgSrc} alt={item.imgAlt} height="42" width="42" style={{ maxWidth: '100%' }} />
                        </div>
                      ) : (
                        <i className={item.icon}></i>
                      )}
                      <span>{item.label}</span>
                    </a>
                  </li>
                );
              }

              return (
                <li key={item.path} className={isActive ? 'active' : ''}>
                  <Link to={item.path}>
                    <i className={item.icon}></i>
                    <span>{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
      <div className="sub-menu">
        <div className="scroll">
          <div id="sub-menu-suite"></div>
        </div>
      </div>
    </div>
  );
}

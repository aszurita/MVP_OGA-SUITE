import { useEffect } from 'react';
import FileManagerLauncher from '../Pages/AdministradorArchivos/components/FileManagerLauncher';

export default function Navbar() {
  useEffect(() => {
    const logoNavbar = document.getElementById('logo-navbar');
    if (!logoNavbar) return;
    const usarNavidad = window.usarLogoNavidad === true;
    const logoDefault = logoNavbar.getAttribute('data-logo-default') || logoNavbar.src;
    const logoNavidad = logoNavbar.getAttribute('data-logo-navidad') || logoDefault;
    logoNavbar.src = usarNavidad ? logoNavidad : logoDefault;
    if (usarNavidad) {
      logoNavbar.classList.remove('logo--invert');
      logoNavbar.classList.add('logo--navidad-large');
    } else {
      logoNavbar.classList.add('logo--invert');
      logoNavbar.classList.remove('logo--navidad-large');
    }
  }, []);

  return (
    <nav className="navbar fixed-top">
      <div className="d-flex align-items-center navbar-left">
        <a href="#" className="menu-button d-none d-md-block">
          <svg className="main" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 9 17">
            <rect x="0.48" y="0.5" width="7" height="1" />
            <rect x="0.48" y="7.5" width="7" height="1" />
            <rect x="0.48" y="15.5" width="7" height="1" />
          </svg>
          <svg className="sub" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 17">
            <rect x="1.56" y="0.5" width="16" height="1" />
            <rect x="1.56" y="7.5" width="16" height="1" />
            <rect x="1.56" y="15.5" width="16" height="1" />
          </svg>
        </a>
        <a href="#" className="menu-button-mobile d-xs-block d-sm-block d-md-none">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 26 17">
            <rect x="0.5" y="0.5" width="25" height="1" />
            <rect x="0.5" y="7.5" width="25" height="1" />
            <rect x="0.5" y="15.5" width="25" height="1" />
          </svg>
        </a>
      </div>

      <a className="navbar-logo" href="OGASuite.aspx">
        <img
          id="logo-navbar"
          className="logo logo--invert d-none d-xs-block"
          src="logos/OGA_color.png"
          data-logo-default="logos/OGA_color.png"
          data-logo-navidad="logos/oga_navidad.png"
          alt="OGA Logo"
        />
        <img className="logo-mobile d-block d-xs-none" src="logos/OGA_icon.png" alt="OGA" />
        <div id="contenedor-nieve"></div>
      </a>

      <div className="navbar-right">
        <div className="header-icons d-inline-block align-middle">
          {/* Nombre de usuario */}
          <div className="icon-container position-relative d-none d-sm-inline-flex">
            <p className="header-icon" id="navbar-user-name">Primero Angelo</p>
          </div>

          {/* Favoritos */}
          <div className="position-relative d-none d-sm-inline-block">
            <button
              className="header-icon btn btn-empty"
              type="button"
              id="favoritosButton"
              data-toggle="dropdown"
              aria-haspopup="true"
              aria-expanded="false"
            >
              <i className="simple-icon-star" data-toggle="tooltip" data-placement="bottom" title="Favoritos"></i>
            </button>
            <div
              className="dropdown-menu dropdown-menu-right mt-3 px-2 position-absolute"
              id="favoritosMenuDropwdown"
              style={{ height: '460px', width: '380px', padding: '1rem' }}
              onClick={e => e.stopPropagation()}
            >
              <h5>Guardar en Favoritos</h5>
              <label htmlFor="bookmark-name" className="m-0">Nombre del marcador:</label>
              <input
                id="bookmark-name"
                type="text"
                defaultValue="Glosario Empresarial de Datos"
                className="form-control rounded-lg py-1"
                style={{ width: '100%', marginBottom: '5px', height: 'auto' }}
              />
              <label htmlFor="bookmark-url" className="m-0">URL del marcador:</label>
              <input
                id="bookmark-url"
                type="text"
                className="form-control rounded-lg py-1"
                style={{ width: '100%', marginBottom: '5px', height: 'auto' }}
              />
              <div className="d-flex align-items-center justify-content-between">
                <h6 className="w-50 m-0">Mis Favoritos</h6>
                <button className="btn-primary rounded-lg" style={{ padding: '.25rem .75rem', border: 'none', cursor: 'pointer' }}>
                  Guardar
                </button>
              </div>
              <div className="d-flex flex-column pr-1 pt-1 mt-1" style={{ height: '280px' }}>
                <div id="favoriteListWrapper" className="p-1 overflow-auto" style={{ height: '90%' }}></div>
              </div>
            </div>
          </div>

          {/* Estadísticas */}
          <div className="position-relative d-none d-sm-inline-block">
            <button
              className="header-icon btn btn-empty"
              type="button"
              id="estadisticasButton"
              data-toggle="dropdown"
              aria-haspopup="true"
              aria-expanded="false"
            >
              <i className="simple-icon-chart" data-toggle="tooltip" data-placement="bottom" title="Estadísticas"></i>
            </button>
            <div
              className="dropdown-menu dropdown-menu-right mt-3 px-2 position-absolute"
              id="estadisticasMenuDropwdown"
              style={{ width: '350px', padding: '1rem' }}
              onClick={e => e.stopPropagation()}
            >
              <h5>Estadísticas</h5>
              <p className="text-muted" style={{ fontSize: '0.85rem' }}>
                Disponible en el entorno SharePoint.
              </p>
            </div>
          </div>

          {/* Acerca de OGA */}
          <div className="position-relative d-none d-sm-inline-block">
            <a href="SobreOGA.aspx" className="header-icon" data-toggle="tooltip" data-placement="bottom" title="Acerca de OGA">
              <i className="simple-icon-question"></i>
            </a>
          </div>

          {/* Nuestras Apps */}
          <div className="position-relative d-none d-sm-inline-block">
            <button
              className="header-icon btn btn-empty"
              type="button"
              id="iconMenuButton"
              data-toggle="dropdown"
              aria-haspopup="true"
              aria-expanded="false"
            >
              <i className="simple-icon-grid" data-toggle="tooltip" data-placement="bottom" title="Nuestras Apps"></i>
            </button>
            <div className="dropdown-menu dropdown-menu-right mt-3 position-absolute no-scrollbar" id="iconMenuDropdown">
              <div className="menu-grid-container">
                <a href="#" className="icon-menu-item quicklinks"><img src="img/datahub.png" alt="Data Hub" /><span>Data Hub</span></a>
                <a href="#" className="icon-menu-item quicklinks"><img src="img/OGA_icon.png" alt="Buen Dato" /><span>Buen Dato</span></a>
                <a href="#" className="icon-menu-item quicklinks"><i className="iconsminds-key"></i><span>Formulario</span></a>
                <a href="#" className="icon-menu-item quicklinks"><i className="iconsminds-file-edit"></i><span>Entidades Pendientes</span></a>
                <a href="#" className="icon-menu-item quicklinks"><i className="iconsminds-box-with-folders"></i><span>Administración de Atributos</span></a>
                <a href="#" className="icon-menu-item quicklinks"><i className="iconsminds-user"></i><span>People Analytics</span></a>
                <a href="#" className="icon-menu-item quicklinks"><i className="iconsminds-notepad"></i><span>Formulario Registro</span></a>
                <a href="#" className="icon-menu-item quicklinks"><i className="simple-icon-equalizer"></i><span>Validador de Modelos</span></a>
                <a href="#" className="icon-menu-item quicklinks"><i className="iconsminds-duplicate-layer"></i><span>AINGINE</span></a>
                <a href="#" className="icon-menu-item quicklinks"><i className="simple-icon-share-alt"></i><span>LINAJE</span></a>
                <a href="#" className="icon-menu-item quicklinks"><i className="simple-icon-briefcase"></i><span>Casos de Uso</span></a>
                <a href="#" className="icon-menu-item quicklinks"><i className="simple-icon-chart"></i><span>Graficador</span></a>
                <FileManagerLauncher variant="menu-item" />
              </div>
            </div>
          </div>

          {/* Log Off */}
          <div className="position-relative d-none d-sm-inline-block">
            <a href="#" className="header-icon" data-toggle="tooltip" data-placement="bottom" title="Log Off">
              <i className="simple-icon-power"></i>
            </a>
          </div>

        </div>
      </div>
    </nav>
  );
}

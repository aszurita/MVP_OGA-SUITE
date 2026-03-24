<!DOCTYPE html>
<%@ Register Tagprefix="SharePoint" Namespace="Microsoft.SharePoint.WebControls"
  Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
  <html lang="en" xmlns:mso="urn:schemas-microsoft-com:office:office"
    xmlns:msdt="uuid:C2F41010-65B3-11d1-A29F-00AA00C14882">


  <head>

    <meta charset="UTF-8">
    <title>Linaje de Datos</title>
    <link rel="icon" type="image/png" href="img/OGA_icon.png">
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">

    <!-- Estilos originales de HTMLENBLANCO -->
    <link rel="stylesheet" href="font/iconsmind-s/css/iconsminds.css" />
    <link rel="stylesheet" href="font/simple-line-icons/css/simple-line-icons.css" />
    <link rel="stylesheet" href="css/vendor/bootstrap.min.css" />
    <link rel="stylesheet" href="css/vendor/bootstrap.rtl.only.min.css" />
    <link rel="stylesheet" href="css/vendor/component-custom-switch.min.css" />
    <link rel="stylesheet" href="css/vendor/perfect-scrollbar.css" />
    <link rel="stylesheet" href="css/vendor/dataTables.bootstrap4.min.css" />
    <link rel="stylesheet" href="css/vendor/buttons.bootstrap4.min.css" />
    <link rel="stylesheet" href="css/vendor/dataTables.colResize.css" />
    <link rel="stylesheet" href="shared/modalGeneral.css" />

    <!-- Select2 para Linaje -->
    <link href="https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/css/select2.min.css" rel="stylesheet" />

    <!-- Estilos de Linaje -->
    <link rel="stylesheet" href="js/Linaje/styles.css">
    <script>
      var n = new Date().getTime();
      document.write('<link href="css/style.css?v=' + n + '" rel="stylesheet" />');
    </script>
    <script>
      (function () {
        var hoy = new Date();
        var inicioNavidad = new Date(hoy.getFullYear(), 11, 1); // diciembre = 11 (0-based)
        window.usarLogoNavidad = hoy >= inicioNavidad;
      })();
    </script>

    <style>
      .input-group-container {
        display: flex;
        gap: 1rem;
        flex-wrap: nowrap;
        overflow-x: auto;
        justify-content: center;
        padding: 1rem 0;
      }

      .input-group {
        display: flex;
        flex-direction: column;
        flex: 1 1 auto;
        min-width: 150px;
        max-width: 250px;
      }

      .input-group input#correo {
        min-width: 200px;
        max-width: 300px;
      }

      .input-group label {
        margin-bottom: 0.5rem;
        font-weight: bold;
      }

      .input-group input,
      .input-group select {
        padding: 10px;
        border: 1px solid #ccc;
        border-radius: 4px;
        box-sizing: border-box;
        width: 100%;
      }

      .tabla-duplicidad thead {
        background: rgb(210, 0, 110);
        color: #fff;
      }

      .tabla-duplicidad .cabecera-cedula td {
        background: #f8d0e3;
        font-weight: bold;
        color: #333;
      }

      .tabla-duplicidad .cabecera-cedula td:not(:first-child) {
        background: #fbe2ef;
      }

      .tabla-duplicidad .row-completa td {
        background: #fff;
        color: #333;
      }

      /* Ajustes para que Linaje se vea bien dentro del container */
      /* Asegura que el contenedor del grafo no flote sobre la barra lateral */
      #cy {
        z-index: 1;
        position: relative;
      }

      /* La barra lateral debe estar explícitamente "más arriba" que el grafo */
      .sidebar {
        z-index: 2;
      }

      .page-footer {
        z-index: 3;
      }

      .menu {
        z-index: 4;
      }

      .tooltip {
        pointer-events: none !important;
      }

      .bs-tooltip-bottom {
        margin-top: 3.5rem !important;
      }

      .btn-reveal,
      .tooltip-icon,
      [data-toggle="tooltip"] {
        user-select: none !important;
        cursor: pointer !important;
      }

      /* Ajustes para nombre de flujo */
      .main-container--solo {
        display: block;
        padding: 0;
      }

      .content-wrapper--solo {
        flex: none;
        width: 100%;
        max-width: none;
        background: transparent;
        padding: 0;
      }

      .studio-card {
        background: #ffffff;
        border-radius: 20px;
        box-shadow: 0 25px 60px rgba(15, 23, 42, 0.08);
        padding: 0;
      }

      .studio-toolbar-minimal {
        display: flex;
        align-items: center;
        gap: 16px;
        padding: 2px;
        border-bottom: 2px solid rgba(0, 0, 0, 0.06);
        margin-bottom: 6px;
        margin-top: 9px;
      }

      .studio-toolbar-minimal h2 {
        margin: 0;
        font-weight: 700;
        color: #111827;
      }

      .flujo-titulo {
        display: flex;
        align-items: center;
        gap: 8px;
        font-weight: 700;
        color: #111827;
      }

      .flujo-titulo .titulo-prefix {
        text-transform: uppercase;
        font-size: 0.85rem;
        letter-spacing: 0.05em;
        color: #6b7280;
        margin-left: 12px;
      }

      .flujo-titulo .titulo-input {
        border: none;
        border-bottom: 1px solid #d1d5db;
        font-weight: 700;
        font-size: 1rem;
        color: #111827;
        padding: 2px 4px;
        min-width: 180px;
        background: transparent;
        transition: border-color 0.2s ease;
      }

      .flujo-titulo .titulo-input:focus {
        outline: none;
        border-color: #d10074;
      }

      .flujo-titulo .titulo-input::placeholder {
        color: #9ca3af;
      }

      .flujo-titulo .titulo-actions {
        position: relative;
        display: flex;
        align-items: center;
        gap: 12px;
      }

      .titulo-copy-btn {
        border: none;
        background: #f3f4f6;
        border-radius: 8px;
        padding: 6px 12px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        color: #6b7280;
        transition: background 0.2s ease, color 0.2s ease;
        font-weight: 600;
        gap: 6px;
      }

      .titulo-copy-btn:hover,
      .titulo-copy-btn:focus-visible {
        background: #d10074;
        color: #fff;
        outline: none;
      }

      .titulo-copy-btn.copied {
        background: rgb(224, 77, 154);
        color: #fff;
      }

      .copied-toast {
        position: fixed;
        bottom: 30px;
        left: 50%;
        padding: 8px 20px;
        border-radius: 999px;
        background: rgb(224, 77, 154);
        color: #fff;
        font-size: 0.9rem;
        font-weight: 600;
        opacity: 0;
        transform: translate(-50%, 8px);
        transition: opacity 0.2s ease, transform 0.2s ease;
        pointer-events: none;
        z-index: 1050;
        box-shadow: 0 10px 25px rgba(224, 77, 154, 0.35);
      }

      .copied-toast.active {
        opacity: 1;
        transform: translate(-50%, 0);
      }

      .sr-only {
        position: absolute;
        width: 1px;
        height: 1px;
        padding: 0;
        margin: -1px;
        overflow: hidden;
        clip: rect(0, 0, 0, 0);
        border: 0;
      }

      .studio-toolbar-minimal .studio-actions {
        margin-left: auto;
        display: flex;
        gap: 10px;
        align-items: center;
      }


      .studio-toolbar-minimal .studio-title {
        display: flex;
        gap: 10px;
        align-items: center;
      }


      .studio-toolbar-minimal .studio-actions .btn-slot {
        display: inline-flex;
        justify-content: flex-end;
        width: auto;
        min-width: 0;
      }

      .studio-toolbar-minimal .studio-title .btn-slot {
        display: inline-flex;
        justify-content: flex-end;
        width: auto;
        min-width: 0;
      }

      .studio-card .studio-container {
        border-radius: 16px;
        overflow: hidden;
        background: #f8f9fc;
        min-height: 70vh;
      }

      .btn-toggle-code {
        padding: 4px 10px;
        border-radius: 6px;
        font-size: 12px;
      }

      .studio-container.editor-hidden .editor-pane,
      .studio-container.editor-hidden #resizer {
        display: none;
      }

      .studio-container.editor-hidden .preview-pane {
        border-radius: 8px;
      }

      .icon {
        width: 16px;
        height: 16px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        stroke: currentColor;
        fill: none;
      }

      .icon use {
        stroke: currentColor;
      }

      .studio-status .icon {
        margin-right: 6px;
      }

      .studio-actions .icon {
        margin-right: 6px;
      }

      .canvas-btn .icon,
      .ctx-btn .icon {
        width: 16px;
        height: 16px;
      }

      .control-btn .icon {
        width: 18px;
        height: 18px;
      }

      .code-alert {
        display: none;
        align-items: center;
        gap: 10px;
        padding: 10px 14px;
        border-radius: 10px;
        background: #fff5f5;
        color: #c62828;
        border: 1px solid rgba(198, 40, 40, 0.4);
        font-size: 13px;
        font-weight: 600;
        margin-bottom: 15px;
      }

      .code-alert.active {
        display: flex;
      }

      .code-alert svg {
        width: 18px;
        height: 18px;
      }

      .mermaid-canvas svg {
        border: 2px solid rgba(224, 77, 154, 0.35);
        box-shadow: 3px rgba(224, 77, 154, 0.2);
      }

      .sidebar-header {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 12px 14px;
      }

      .sidebar-divider {
        height: 3px;
        background: rgba(0, 0, 0, 0.08);
        margin: 0 2px 20px;
      }
    </style>

    <link rel="stylesheet" href="css/main.css" />

    <!--[if gte mso 9]><![endif]-->
  </head>

  <body id="app-container" class="menu-default show-spinner">
    <nav class="navbar fixed-top">
      <div class="d-flex align-items-center navbar-left">
        <a href="#" class="menu-button d-none d-md-block">
          <svg class="main" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 9 17">
            <rect x="0.48" y="0.5" width="7" height="1" />
            <rect x="0.48" y="7.5" width="7" height="1" />
            <rect x="0.48" y="15.5" width="7" height="1" />
          </svg>
          <svg class="sub" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 17">
            <rect x="1.56" y="0.5" width="16" height="1" />
            <rect x="1.56" y="7.5" width="16" height="1" />
            <rect x="1.56" y="15.5" width="16" height="1" />
          </svg>
        </a>

        <a href="#" class="menu-button-mobile d-xs-block d-sm-block d-md-none">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 26 17">
            <rect x="0.5" y="0.5" width="25" height="1" />
            <rect x="0.5" y="7.5" width="25" height="1" />
            <rect x="0.5" y="15.5" width="25" height="1" />
          </svg>
        </a>
      </div>

      <a class="navbar-logo" href="OGASuite.aspx">
        <img id="logo-navbar" class="logo logo--invert d-none d-xs-block" src="logos/oga_color.png"
          data-logo-default="logos/oga_color.png" data-logo-navidad="logos/oga_navidad.png">
        <img class="logo-mobile d-block d-xs-none" src="logos/OGA_icon.png">
        <div id="contenedor-nieve"></div>
      </a>
      <script>
        (function () {
          var usarLogoNavidad = window.usarLogoNavidad === true;
          var logoNavbar = document.getElementById('logo-navbar');
          if (!logoNavbar) return;
          var logoDefault = logoNavbar.getAttribute('data-logo-default') || logoNavbar.src;
          var logoNavidad = logoNavbar.getAttribute('data-logo-navidad') || logoDefault;
          logoNavbar.src = usarLogoNavidad ? logoNavidad : logoDefault;
          if (usarLogoNavidad) {
            logoNavbar.classList.remove('logo--invert');
            logoNavbar.classList.add('logo--navidad-large');
          } else {
            logoNavbar.classList.add('logo--invert');
            logoNavbar.classList.remove('logo--navidad-large');
          }
        })();
      </script>

      <div class="navbar-right">
        <div class="header-icons d-inline-block align-middle">
          <div class="position-relative d-none d-sm-inline-block">
            <button class="header-icon btn btn-empty" type="button" id="iconMenuButton" data-toggle="dropdown"
              aria-haspopup="true" aria-expanded="false">
              <i class="simple-icon-grid"></i>
            </button>
            <div class="dropdown-menu dropdown-menu-right mt-3 position-absolute" id="iconMenuDropdown">
              <a href="http://vamos.bancoguayaquil.com/sitios/informaciongerencial/Paginas/ANALYTICS/Marlon%20Z/PAGINAS/COMUNIDAD_ANALITICA/index.aspx"
                class="icon-menu-item quicklinks">
                <img src="img/datahub.png" alt="Logo DataHub">
                <span>Data Hub</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </nav>

    <div class="menu">
      <div class="main-menu">
        <div class="scroll">
          <ul class="list-unstyled" id="suite-navbar">
            <li>
              <a href="SobreOGA.aspx">
                <i class="simple-icon-question"></i>
                <span>Acerca de Nosotros</span>
              </a>
            </li>
            <li>
              <a href="PoliticasProcedimientos.aspx">
                <i class="iconsminds-letter-open"></i>
                <span>Políticas y Procedimientos</span>
              </a>
            </li>
            <li>
              <a href="LibroDominios.aspx">
                <i class="iconsminds-library"></i>
                <span>Libro de Dominios</span>
              </a>
            </li>
            <li>
              <a href="Glosario.aspx">
                <i class="iconsminds-diploma-2"></i>
                <span>Glosario de Términos</span>
              </a>
            </li>
            <li>
              <a href="IndicadoresGestion.aspx">
                <i class="iconsminds-line-chart-1"></i>
                <span>Indicadores de Gestión</span>
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div class="sub-menu">
        <div class="scroll">
          <div id="sub-menu-suite"></div>
          <div class="ps__rail-x" style="left: 0px; bottom: 0px;">
            <div class="ps__thumb-x" tabindex="0" style="left: 0px; width: 0px;"></div>
          </div>
          <div class="ps__rail-y" style="top: 0px; right: 0px;">
            <div class="ps__thumb-y" tabindex="0" style="top: 0px; height: 0px;"></div>
          </div>
        </div>
      </div>
    </div>

    <main class="override-main-margins">
      <div class="container-fluid">
        <!-- CONTENIDO DE LINAJE INTEGRADO AQUÍ -->
        <div class="container linaje-scope">
          <div class="linaje-wrapper">

            <div class="studio-toolbar studio-toolbar-minimal">

              <!-- IZQUIERDA -->
              <div class="studio-title">
                <span class="btn-slot">
                  <button id="togglePanelBtn" class="btn-reveal" title="Mostrar/Ocultar panel JSON"
                    aria-label="Mostrar/Ocultar panel JSON" aria-pressed="false">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                      stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M8 4c-2 0-3 1-3 3v2c0 1-1 2-2 2 1 0 2 1 2 2v2c0 2 1 3 3 3"></path>
                      <path d="M16 4c2 0 3 1 3 3v2c0 1 1 2 2 2-1 0-2 1-2 2v2c0 2-1 3-3 3"></path>
                    </svg>
                    <span class="label">Panel JSON</span>
                  </button>
                </span>
                <!-- Título -->
                <div class="flujo-titulo">
                  <label for="tituloFlujoActual" class="sr-only">Nombre del flujo</label>
                  <span class="titulo-prefix">Dise&ntilde;o:</span>
                  <div class="titulo-actions">
                    <input id="tituloFlujoActual" class="titulo-input" type="text" value="Nuevo Flujo" />
                    <span id="copyToast" class="copied-toast">Diagrama actualizado</span>
                    <input id="sqlFileInput" type="file" accept=".sql" style="display:none" />
                  </div>
                </div>
                <span class="btn-slot">
                  <button id="uploadSpBtn" class="btn-reveal" title="Generar desde SP" aria-label="Generar desde SP">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                      stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M12 5v14" />
                      <path d="M5 12h14" />
                      <path d="M16 7h1a4 4 0 0 1 4 4v4a4 4 0 0 1-4 4h-1" />
                      <path d="M8 7H7a4 4 0 0 0-4 4v4a4 4 0 0 0 4 4h1" />
                    </svg>
                    <span class="label">Subir SP</span>
                  </button>
                </span>
              </div>
              <div class="studio-actions">
                <div class="header-actions">
                  <!-- DERECHA -->
                  <span class="btn-slot">
                    <button id="btnUndoLinaje" class="btn-reveal" title="Deshacer (Ctrl+Z)"
                      aria-label="Deshacer acción">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M3 7v6h6"></path>
                        <path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13"></path>
                      </svg>
                      <span class="label">Deshacer</span>
                    </button>
                  </span>

                  <span class="btn-slot">
                    <button id="eraseLinaje" class="btn-reveal" title="Limpiar canvas" aria-label="Limpia el canvas"
                      aria-pressed="false">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                        class="lucide lucide-brush-cleaning-icon lucide-brush-cleaning">
                        <path d="m16 22-1-4" />
                        <path
                          d="M19 14a1 1 0 0 0 1-1v-1a2 2 0 0 0-2-2h-3a1 1 0 0 1-1-1V4a2 2 0 0 0-4 0v5a1 1 0 0 1-1 1H6a2 2 0 0 0-2 2v1a1 1 0 0 0 1 1" />
                        <path d="M19 14H5l-1.973 6.767A1 1 0 0 0 4 22h16a1 1 0 0 0 .973-1.233z" />
                        <path d="m8 22 1-4" />
                      </svg>
                      <span class="label">Limpiar</span>
                    </button>
                  </span>
                  <!--
                  <span class="btn-slot">
                    <button id="correoBtn" class="btn-reveal" title="Prueba de Correo" aria-label="Prueba de Correo"
                      aria-pressed="false">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                        stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                        <polyline points="22,6 12,13 2,6"></polyline>
                      </svg>
                      <span class="label">Correo</span>
                    </button>
                  </span>
                  -->
                  <span class="btn-slot">
                    <button id="btnShareLinaje" class="btn-reveal btn-action" title="Compartir diagrama"
                      aria-label="Compartir diagrama">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                        stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <circle cx="18" cy="5" r="3" />
                        <circle cx="6" cy="12" r="3" />
                        <circle cx="18" cy="19" r="3" />
                        <path d="M8.4 12.9L15 17.4" />
                        <path d="M15 6.6L8.4 11.1" />
                      </svg>
                      <span class="label">Compartir</span>
                    </button>
                  </span>
                  <span class="btn-slot">
                    <button id="btnLoadLineage" class="btn-reveal" title="Cargar diagrama" aria-label="Cargar diagrama">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                        stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
                      </svg>
                      <span class="label">Cargar</span>
                    </button>
                  </span>

                  <span class="btn-slot">
                    <button id="guardarLinajeBtn" type="button" class="btn-reveal" title="Guardar Linaje"
                      aria-label="Guardar Linaje">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                        stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M6 3h11l4 4v13a1 1 0 0 1-1 1H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z" />
                        <path d="M6 3v6h9V3" />
                        <rect x="8" y="13" width="8" height="7" rx="1" />
                        <path d="M10 16h4" />
                      </svg>
                      <span class="label">Guardar Linaje</span>
                    </button>
                  </span>

                  <span class="btn-slot">
                    <button id="reajustarBtn" class="btn-reveal" title="Reajustar" aria-label="Reajustar">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                        stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M3 9V3h6M21 9V3h-6M21 15v6h-6M3 15v6h6" />
                      </svg>
                      <span class="label">Reajustar</span>
                    </button>
                  </span>
                </div>
              </div>

            </div>
            <div class="container">



              <!-- Sidebar -->
              <aside class="sidebar">

                <div class="sidebar-header">
                  <div class="btn-slot">
                    <button id="submitBtn" class="btn-reveal" title="Agregar Nodo" aria-label="Agregar Nodo">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                        stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <line x1="12" y1="5" x2="12" y2="19"></line>
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                      </svg>
                      <span class="label">Agregar Nodo</span>
                    </button>
                  </div>
                </div>
                <div class="sidebar-divider"></div>


                <div class="form-group">
                  <label for="typeInput2">Tipo de Nodo
                  </label>
                  <select id="typeInput2" class="form-select">
                    <option value=""></option>
                  </select>
                </div>

                <div id="database-selectors" style="display: none;">
                  <div class="form-group">
                    <label for="srvInput">Servidor</label>
                    <select id="srvInput" class="form-select">
                      <option value="" disabled selected>Selecciona un servidor</option>
                    </select>
                  </div>

                  <div class="form-group">
                    <label for="dbInput">Base de Datos</label>
                    <select id="dbInput" class="form-select" disabled>
                      <option value="" disabled selected>Selecciona una base</option>
                    </select>
                  </div>

                  <div class="form-group">
                    <label for="schemaInput">Esquema</label>
                    <select id="schemaInput" class="form-select" disabled>
                      <option value="" disabled selected>Selecciona un esquema</option>
                    </select>
                  </div>

                  <div class="form-group">
                    <label for="tableInput">Tabla</label>
                    <select id="tableInput" class="form-select" disabled>
                      <option value="" disabled selected>Selecciona una tabla</option>
                    </select>
                  </div>

                  <div class="form-group">
                    <label for="fieldsInput">Campos:</label>
                    <select id="fieldsInput" class="form-select" multiple name="fieldsInput[]"></select>
                  </div>
                </div>

                <div id="nameSection">
                  <div class="form-group">
                    <label for="nombreInput">Nombre</label>
                    <input type="text" id="nombreInput" class="form-input" placeholder="Ingresa el nombre del nodo">
                  </div>
                </div>

                <div class="form-group">
                  <label for="descripcionInput">Descripción</label>
                  <input type="text" id="descripcionInput" class="form-input"
                    placeholder="Describe la función del nodo">
                </div>

                <div class="form-group">
                  <label for="observacionInput">Observación</label>
                  <input type="text" id="observacionInput" class="form-input" placeholder="Observaciones del nodo">
                </div>




              </aside>

              <!-- Main Graph Area -->



              <main class="main-graph">
                <div id="cy"></div>
                <div id="informacionNodo" class="node-info"></div>
              </main>

              <!-- Right Panel (inicialmente oculto) -->
              <aside class="right-panel">
                <div class="json-panel-header">
                  <h2>JSON</h2>
                  <div class="json-header-actions">
                    <button id="guardarBtn" class="btn-reveal" title="Descargar JSON" aria-label="Descargar JSON">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                        stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                        <circle cx="12" cy="12" r="9" />
                        <path d="M12 8v8" />
                        <path d="M15 13l-3 3-3-3" />
                      </svg>
                      <span class="label">Descargar</span>
                    </button>
                    <button id="cargarBtn" class="btn-reveal" title="Subir JSON" aria-label="Subir JSON">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                        stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                        <circle cx="12" cy="12" r="9" />
                        <path d="M12 16V8" />
                        <path d="M9 11l3-3 3 3" />
                      </svg>
                      <span class="label">Subir</span>
                    </button>
                  </div>
                </div>
                <div id="visualizacion" class="json-output"></div>
              </aside>
            </div>

            <!-- Modal para guardar linaje -->
            <div id="linajeSaveModal" class="custom-modal-overlay hidden">
              <div class="custom-modal custom-modal--wide">
                <h3>Guardar Linaje</h3>
                <label class="sr-only" for="linajeSaveModalName">Nombre del linaje</label>
                <input type="text" class="form-input" id="linajeSaveModalName" placeholder="Nombre del linaje"
                  autocomplete="off">
                <div class="modal-actions">
                  <button type="button" class="btn-save" id="linajeSaveModalSaveBtn">Guardar</button>
                </div>
              </div>
            </div>

            <div id="linajeOverwriteModal" class="custom-modal-overlay hidden">
              <div class="custom-modal custom-modal--wide">
                <h3>Linaje existente</h3>
                <p class="modal-description">
                  Ya existe un linaje llamado <strong id="linajeOverwriteModalName"></strong>.
                  ¿Deseas sobrescribir el registro anterior?
                </p>
                <div class="modal-actions">
                  <button type="button" class="btn-cancel" id="linajeOverwriteCancelBtn">No</button>
                  <button type="button" class="btn-save" id="linajeOverwriteConfirmBtn">Sí, sobrescribir</button>
                </div>
              </div>
            </div>

            <div id="linajeExitConfirmModal" class="custom-modal-overlay hidden" aria-hidden="true">
              <div class="custom-modal custom-modal--compact">
                <h3>Salir del canvas</h3>
                <p class="modal-description">
                  &iquest;Est&aacute;s seguro que deseas salir del canvas?<br><br>
                  Esta acci&oacute;n cerrar&aacute; el diagrama actual, los cambios sin guardar se perder&aacute;n.
                </p>
                <div class="modal-actions">
                  <button type="button" class="btn-cancel" id="linajeExitConfirmCancelBtn">Cancelar</button>
                  <button type="button" class="btn-save" id="linajeExitConfirmAcceptBtn">Aceptar</button>
                </div>
              </div>
            </div>


            <!-- Hidden file input -->
            <input type="file" id="fileInput" class="hidden-input" accept=".json,.txt">
            <input type="file" id="spFileInput" class="hidden-input" accept=".sql,.txt">
          </div>
          <!-- FIN CONTENIDO DE LINAJE -->
        </div>
      </div>
    </main>

    <footer class="page-footer">
      <div class="footer-content">
        <div class="container-fluid">
          <div class="row">
            <div class="col-12 col-sm-6">
              <p class="mb-0 text-muted">Banco Guayaquil 2023</p>
            </div>
          </div>
        </div>
      </div>
    </footer>

    <div class="modal fade" id="detalleModal" tabindex="-1" role="dialog" aria-labelledby="detalleModalLabel"
      aria-hidden="true">
      <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content">
          <div class="modal-header p-3">
            <h5 class="modal-title" id="detalleModalLabel">Detalle de Catalogo</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <div id="loadLineageModal" class="custom-modal-overlay hidden">
      <div class="custom-modal custom-modal--wide custom-modal--xwide">
        <h3>Cargar Linaje</h3>
        <div class="modal-search">
          <div class="autocomplete-field">
            <input id="loadLineageSearchInput" type="text" placeholder="Buscar por nombre de linaje" autocomplete="off">
            <div class="load-results">
              <div id="loadLineageResultsStatus" class="load-results-status">Escribe para buscar</div>
              <div id="loadLineageResultsList" class="load-results-list"></div>
            </div>
          </div>
        </div>

        <div class="load-recent">
          <div class="load-recent-table">
            <table class="table table-sm table-hover">
              <thead>
                <tr>
                  <th>Nombre Linaje</th>
                  <th>Usuario</th>
                  <th>Fecha</th>
                </tr>
              </thead>
              <tbody id="loadLineageRecentBody"></tbody>
            </table>
          </div>
        </div>

        <div class="modal-actions">
          <button id="loadLineageSubmit" class="btn-reveal btn-action" title="Guardar diagrama" type="button">
            <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
              stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="17 8 12 3 7 8"></polyline>
              <line x1="12" y1="3" x2="12" y2="15"></line>
            </svg>
            <span class="label">Cargar</span>
          </button>
        </div>
      </div>
    </div>

    <!-- ============ SCRIPTS SINCRONIZADOS ============ -->

    <!-- jQuery (debe ir primero) -->
    <script src="js/vendor/jquery-3.3.1.min.js"></script>

    <!-- Bootstrap y dependencias de HTMLENBLANCO -->
    <script src="js/vendor/bootstrap.bundle.min.js"></script>
    <script src="js/vendor/perfect-scrollbar.min.js"></script>
    <script src="js/vendor/mousetrap.min.js"></script>
    <script src="js/dore.script.js"></script>
    <script src="js/scripts.single.theme.js"></script>

    <!-- D3 y GSAP -->
    <script src="https://d3js.org/d3.v5.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/2.1.1/TweenMax.min.js"></script>

    <!-- SPServices y DataTables -->
    <script src="js/jquery.SPServices.v2014-02.min.js"></script>
    <script src="js/Linaje/modules/cytoscape-manager.js"></script>
    <script src="js/vendor/datatables.min.js"></script>
    <script src="js/vendor/buttons.dataTables.min.js"></script>
    <script src="js/vendor/jszip.min.js"></script>
    <script src="js/vendor/buttons.html5.min.js"></script>
    <script src="js/vendor/dataTables.Resize.js"></script>
    <script src="js/helper_user.js"></script>
    <script src="shared/modalGeneral.js"></script>

    <!-- Select2 para Linaje -->
    <script src="https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/js/select2.min.js"></script>

    <!-- Cytoscape para Linaje -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/cytoscape/3.26.0/cytoscape.min.js"></script>

    <!-- Módulos de Linaje -->
    <script src="js/Linaje/config/config.js"></script>
    <script src="js/Linaje/modules/data-mock.js"></script>
    <script src="js/AINGINE.js"></script>
    <script src="js/Linaje/modules/api.js"></script>
    <script src="js/Linaje/modules/sp-parser.js"></script>
    <script src="js/Linaje/modules/select-cascade.js"></script>
    <script src="js/Linaje/modules/ui-controller.js"></script>
    <script src="js/Linaje/modules/linaje-share.js"></script>

    <script src="js/Linaje/utils/helpers.js"></script>
    <script src="js/Linaje/modules/linaje-save-modal.js"></script>
    <script src="js/Linaje/modules/lineage-modal.js"></script>

    <!-- Suite scripts con cache busting -->
    <script>
      var n = new Date().getTime();
      document.write('<script src="js/suite.js?v=' + n + '"> <' + '/' + 'script>');
    </script>

    <!-- Script de inicialización de Linaje -->
    <script>
      // Configuración Global de Tooltips
      if ($.fn.tooltip && $.fn.tooltip.Constructor) {
        $.fn.tooltip.Constructor.Default.container = 'body';
        $.fn.tooltip.Constructor.Default.boundary = 'window';
      }

      // Variables globales
      let cytoscapeManager;
      let selectCascadeManager;
      let uiController;

      document.addEventListener('DOMContentLoaded', async () => {
        try {
          cytoscapeManager = new CytoscapeManager();
          window.cytoscapeManager = cytoscapeManager;

          selectCascadeManager = new SelectCascadeManager();
          uiController = new UIController();
          uiController.initialize(cytoscapeManager, selectCascadeManager);

          // ======================================
          // INIT LINaje SHARE ✅
          // ======================================
          linajeShare.init({
            api: window.apiManager,   // 👈 TU ApiManager
            controller: {
              loadDiagram: (data) => {
                uiController.cytoscapeManager.loadGraph(data);
              }
            },
            showGenerationToast: (message, isError = false) => {
              uiController.notify(message, isError ? 'error' : 'success');
            }
          });

        } catch (error) {
          LinajeHelpers.handleError(error, 'inicialización del sistema');
        }
      });



      // Contexto global para acceso desde otros módulos
      window.linajeContext = {
        getSelected() { return selectCascadeManager?.getSelected(); },
        getCytoscapeManager() { return cytoscapeManager; },
        getSelectCascadeManager() { return selectCascadeManager; },
        getUIController() { return uiController; },
        isDevelopment() { return ConfigUtils.isDevelopment(); }
      };

      window.reinitSelect2All = function () {
        uiController?.reinitSelect2All();
      };
    </script>


    <script>
      document.addEventListener('DOMContentLoaded', function () {

        // 1. Validar que tengamos las librerías necesarias
        if (typeof apiManager === 'undefined' || typeof LineageLoadModal === 'undefined') {
          console.error("Faltan librerías (api.js o lineage-modal.js).");
          return;
        }

        // 2. Configurar el "Puente"
        const linajeEditorContext = {
          // INTERCEPTOR: El modal intentará escribir en 'editor.value'
          editor: {
            set value(contenidoJson) {
              console.log("Recibiendo JSON desde el modal...");

              // A) Parsear el texto a Objeto (si viene como string)
              // A) Parse defensivo (soporta JSON desde descarga y desde BD)
              let datosGrafico = contenidoJson;

              try {
                if (typeof datosGrafico === 'string') {
                  datosGrafico = JSON.parse(datosGrafico);
                }
                // Segundo parse por si viene doble serializado desde SQL
                if (typeof datosGrafico === 'string') {
                  datosGrafico = JSON.parse(datosGrafico);
                }
              } catch (e) {
                alert("El contenido guardado no es un JSON válido.");
                return;
              }


              // B) Llamar a la función nativa de tu CytoscapeManager
              // Usamos la instancia global 'cytoscapeManager' que definiste arriba
              if (window.cytoscapeManager) {
                window.cytoscapeManager.loadGraph(datosGrafico);
                console.log("Grafo renderizado con loadGraph()");
              } else {
                console.error("No se encontró la instancia window.cytoscapeManager");
              }
            },
            // El getter es solo para que no falle si el modal intenta leer
            get value() { return ""; }
          },

          // Conexión a la API y configuración extra
          api: apiManager,
          titleInput: document.getElementById('input_titulo_linaje'), // Si tienes input de título

          showGenerationToast: (msg, isError = false) => {
            if (uiController && typeof uiController.notify === 'function') {
              uiController.notify(msg, isError ? 'error' : 'success');
            } else {
              if (isError) alert(msg);
              else console.log(msg);
            }
          },
          saveState: function () { }, // Opcional
          render: function () { },    // loadGraph ya hace render, no necesitamos más
          updateShareUrl: function () { }
        };

        // 3. Inicializar el Modal
        window.LineageLoadModal.init(linajeEditorContext);
        console.log("Sistema de carga integrado con CytoscapeManager.");
      });
    </script>

    <script>
      document.addEventListener('DOMContentLoaded', function () {

        const flujoInput = document.getElementById('tituloFlujoActual');
        const modalInput = document.getElementById('linajeSaveModalName');
        const modalEl = document.getElementById('linajeSaveModal');

        if (!flujoInput || !modalInput || !modalEl) return;

        let isModalOpen = false;
        modalEl.addEventListener('linajeSaveModal:open', () => {
          isModalOpen = true;
          modalInput.value = flujoInput.value || '';
        });

        modalEl.addEventListener('linajeSaveModal:close', () => {
          isModalOpen = false;
        });

        flujoInput.addEventListener('input', function () {
          if (isModalOpen) {
            modalInput.value = flujoInput.value;
          }
        });

        //Si el usuario escribe directamente en el modal, reflejarlo en el flujo principal
        modalInput.addEventListener('input', function () {
          flujoInput.value = modalInput.value;
        });
        registrar_visita("LINAJE");

      });
    </script>
    <!--
    <script>
      // Botón "Correo" -> abre modal de correo (ModalGeneral)
      document.addEventListener('DOMContentLoaded', function () {
        const correoBtn = document.getElementById('correoBtn');
        if (!correoBtn || !window.ModalGeneral) return;

        correoBtn.addEventListener('click', function () {
          const titulo = document.getElementById('tituloFlujoActual')?.value || 'Linaje';
          const userEmail = (window.UserHelper && UserHelper.getCurrentEmail && UserHelper.getCurrentEmail())
            || (window._spPageContextInfo && _spPageContextInfo.userEmail)
            || (typeof window.obtenerUsuario === 'function' && (window.obtenerUsuario()?.current_email || ''))
            || window.current_email
            || '';

          const initial = {
            subject: `Linaje: ${titulo}`,
            cc: userEmail,
            bodyHtml: `<p>Hola,</p><p>Te comparto el diagrama de linaje <strong>${titulo}</strong>.</p>`,
          };

          window.ModalGeneral.openCorreoModal({
            initialValues: initial,
            defaultCc: userEmail,
          }).then((controller) => {
            controller?.hydrate({ cc: userEmail });
          });
        });
      });
    </script>
    -->

  </body>

  </html>
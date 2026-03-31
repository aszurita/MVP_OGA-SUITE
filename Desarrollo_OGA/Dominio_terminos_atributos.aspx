<!DOCTYPE html>
<%@ Register Tagprefix="SharePoint" Namespace="Microsoft.SharePoint.WebControls"
    Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
    <html lang="en" xmlns:mso="urn:schemas-microsoft-com:office:office"
        xmlns:msdt="uuid:C2F41010-65B3-11d1-A29F-00AA00C14882">

    <%@ Register Tagprefix="SharePoint" Namespace="Microsoft.SharePoint.WebControls"
        Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>

        <head>
            <meta charset="UTF-8">
            <title>Dominio - Términos y Atributos</title>
            <link rel="icon" type="image/png" href="img/OGA_icon.png">
            <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">

            <link rel="stylesheet" href="font/iconsmind-s/css/iconsminds.css" />
            <link rel="stylesheet" href="font/simple-line-icons/css/simple-line-icons.css" />

            <link rel="stylesheet" href="css/vendor/bootstrap.min.css" />
            <link rel="stylesheet" href="css/vendor/bootstrap.rtl.only.min.css" />
            <link rel="stylesheet" href="css/vendor/perfect-scrollbar.css" />
            <link rel="stylesheet" href="css/vendor/component-custom-switch.min.css" />
            <link rel="stylesheet" href="css/vendor/select2.min.css" />
            <link rel="stylesheet" href="css/vendor/select2-bootstrap.min.css" />
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
            <link rel="stylesheet" href="css/main.css" />
            <link rel="stylesheet" href="css/pagination.css" />

            <style>
                /* 1. Forzar un alto mínimo al contenedor principal de las pastillas */
                .select2-container--bootstrap .select2-selection--multiple {
                    min-height: 20px !important;
                    height: auto !important;
                }

                /* 2. Forzar un alto mínimo al input interno que muestra el Placeholder */
                .select2-container--bootstrap .select2-selection--multiple .select2-search--inline .select2-search__field {
                    min-height: 20px !important;
                    line-height: normal !important;
                }

                /* Apunta directamente al <input> interno que genera Select2 */
                .attr-form .select2-container--bootstrap .select2-search--inline .select2-search__field,
                .glosario-item-edit .select2-container--bootstrap .select2-search--inline .select2-search__field {
                    min-width: 250px !important;
                    height: 20px !important;
                    line-height: normal !important;
                }

                /* Modifica la caja principal del tooltip */
                .tooltip-inner {
                    max-width: 350px;
                    font-size: 12px;
                    background-color: #e9ecef;
                    border: 1px solid #160F41;
                    text-align: left;
                }

                .glosario-crosslink {
                    background-color: #e9ecef;
                    cursor: pointer;
                    font-size: 0.85rem;
                    padding: 0.1em 0.2em;
                    border: 1px dashed #2563eb;
                    color: #2563eb;
                }


                .glosario-grid {
                    display: grid;
                    grid-template-columns: 1fr;
                    gap: 20px;
                    align-items: start;
                }

                /* Tablets y Pantallas Grandes (2 columnas) */
                @media (min-width: 768px) {
                    .glosario-grid {
                        grid-template-columns: repeat(2, 1fr);
                    }
                }

                #glosario-body.glosario-edit-mode .glosario-item-actions,
                #resultados.glosario-edit-mode .glosario-item-actions {
                    display: flex;
                }

                .glosario-item-actions .btn {
                    width: 32px;
                    height: 32px;
                    padding: 0;
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                }

                .glosario-edicion-toggle {
                    background: transparent;
                    border: none;
                    font-size: 18px;
                    cursor: pointer;
                }

                .glosario-edicion-toggle.glosario-edit-active i {
                    color: #d10070;
                }

                .glosario-item {
                    position: relative;
                }

                .glosario-item-actions {
                    position: absolute;
                    top: 1.5rem;
                    justify-content: flex-end;
                    right: 0;
                    display: none;
                    align-items: center;
                    gap: 0.4rem;
                    width: auto;
                    margin-bottom: 0.75rem;
                }

                .glosario-editar-btn,
                #glosario-edicion-toggle {
                    border: none;
                    background-color: transparent;
                    padding: 0;
                    cursor: pointer;
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    margin-top: 2px;
                    box-shadow: none;
                    color: #8f8f8f;
                }

                .glosario-editar-btn:hover,
                #glosario-edicion-toggle:hover {
                    background-color: transparent !important;
                    box-shadow: none;
                }

                .glosario-editar-btn:hover .glosario-icon,
                #glosario-edicion-toggle:hover .glosario-icon {
                    color: #d1007e;
                }

                .glosario-editar-btn .simple-icon-pencil,
                #glosario-edicion-toggle .simple-icon-pencil {
                    font-size: 19px;
                    color: inherit;
                    line-height: 1;
                    padding-top: 3px;
                    padding-right: 4px;
                }

                .glosario-editar-btn.glosario-editar-activo .simple-icon-pencil {
                    color: #d10070;
                }

                /* Icono de nuevo atributo ligeramente más grande */
                .glosario-icon-btn .iconsminds-add.glosario-icon {
                    font-size: 20px;
                }

                #glosario-body.glosario-edit-mode .glosario-item-actions,
                #resultados.glosario-edit-mode .glosario-item-actions {
                    display: flex;
                }

                .glosario-item-actions .btn {
                    min-width: 36px;
                    height: 36px;
                    padding: 0;
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                }

                .glosario-item-actions .glosario-btn-guardar:hover {
                    background-color: #ccffcc;
                    color: #fff;
                }

                .glosario-item-actions .glosario-btn-cancelar:hover {
                    background-color: #ffcccc;
                    color: #fff;
                }

                .glosario-item-edit {
                    display: none;
                    padding: 1rem;
                    border: 1px solid #e5e7eb;
                    border-radius: 0.5rem;
                    background: #fafafa;
                    margin-bottom: 0.75rem;
                    margin-top: 3rem;
                    gap: 0.6rem;
                }

                #glosario-body.glosario-edit-mode .glosario-item-editing .glosario-item-edit,
                #resultados.glosario-edit-mode .glosario-item-editing .glosario-item-edit {
                    display: flex;
                    flex-direction: column;
                }

                .glosario-item-edit label {
                    font-size: 0.75rem;
                    font-weight: 600;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                    margin-bottom: 0.2rem;
                }

                .glosario-item-edit input,
                .glosario-item-edit textarea {
                    border: 1px solid #d0d2d6;
                    border-radius: 0.4rem;
                    padding: 0.5rem 0.6rem;
                    font-size: 0.9rem;
                    width: 100%;
                    background: #fff;
                }

                .glosario-item-edit textarea {
                    resize: vertical;
                    min-height: 70px;
                }

                .glosario-item-edit .edit-row {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                    gap: 0.8rem;
                }

                #glosario-layout-container {
                    display: flex;
                    flex-direction: column;
                    width: 100%;
                    align-items: flex-start;
                }

                @media (min-width: 768px) {
                    #glosario-layout-container {
                        flex-direction: row;
                    }
                }
            </style>

            <style>
                .btn-outline {
                    border: 1px solid #D2006E;
                }

                .btn-outline:hover {
                    border: 1px solid #D2006E;
                }

                .btn-outline:focus-visible {
                    border: 1px solid #343a40;
                }

                .btn-reveal-colors {
                    color: #D2006E;
                    background: transparent;
                }

                .btn-reveal-colors:hover,
                .btn-reveal-colors:focus-visible {
                    color: #fff;
                    background: #D2006E;
                    box-shadow: 0 6px 16px rgba(210, 0, 110, .25)
                }

                .btn-reveal.btn-reveal-dropdown {
                    flex-direction: row;
                    justify-content: flex-start;
                    max-width: 36px;
                    height: 34px;
                    padding: 4px 10px;
                    border-radius: 999px;
                    gap: 0;
                }

                /* 🌟 Expansión: Al pasar el ratón O cuando el menú está abierto (.show) */
                .btn-reveal.btn-reveal-dropdown:hover,
                .btn-group.show>.btn-reveal.btn-reveal-dropdown {
                    max-width: 220px;
                    /* Ancho máximo revelado */
                    gap: 8px;
                    /* Separación entre ícono y texto */
                    padding: 4px 15px;
                }

                /* 🌟 Control del Caret (Flechita del dropdown de Bootstrap) */
                .btn-reveal.btn-reveal-dropdown::after {
                    opacity: 0;
                    /* Oculto cuando está colapsado */
                    transition: opacity 0.2s ease;
                    margin-left: auto;
                    /* Empuja la flechita al extremo derecho */
                }

                /* Muestra el Caret solo cuando se expande */
                .btn-reveal.btn-reveal-dropdown:hover::after,
                .btn-group.show>.btn-reveal.btn-reveal-dropdown::after {
                    opacity: 1;
                }

                .btn-slot {
                    display: inline-flex;
                    justify-content: center;
                    align-items: center
                }

                /* Botón reveal (reposo: solo ícono, sin borde/fondo) */
                .btn-reveal {
                    --accent: #D2006E;
                    display: inline-flex;
                    align-items: center;
                    height: 38px;
                    padding: 10px;
                    border: 0;
                    background: transparent;
                    color: var(--accent);
                    border-radius: 999px;
                    max-width: 42px;
                    overflow: hidden;
                    white-space: nowrap;
                    gap: 0;
                    transition: max-width .25s ease, background-color .2s ease, color .2s ease, box-shadow .2s ease, padding .25s ease, gap .25s ease
                }

                .btn-reveal svg {
                    width: 18px;
                    height: 18px;
                    stroke: currentColor;
                    fill: none;
                    flex: 0 0 auto
                }

                .btn-reveal .label {
                    font-weight: 600;
                    opacity: 0;
                    max-width: 0;
                    overflow: hidden;
                    transition: opacity .18s ease, max-width .25s ease
                }

                /* Expandido (hover/focus) */
                .btn-reveal:hover,
                .btn-reveal:focus-visible {
                    max-width: 180px;
                    padding: 8px 12px;
                    gap: 10px;
                    justify-content: flex-start;
                    background: var(--accent);
                    color: #fff;
                    box-shadow: 0 6px 16px rgba(210, 0, 110, .25)
                }

                .btn-reveal:focus-visible {
                    outline: 3px solid rgba(210, 0, 110, .28);
                    outline-offset: 2px
                }

                .btn-reveal:hover .label,
                .btn-reveal:focus-visible .label {
                    opacity: 1;
                    max-width: 160px
                }
            </style>


            <!--[if gte mso 9]><SharePoint:CTFieldRefs runat=server Prefix="mso:" FieldList="FileLeafRef"><xml>
<mso:CustomDocumentProperties>
<mso:_CopySource msdt:dt="string">http://vamos.bancoguayaquil.com/sitios/informaciongerencial/OGAsuite_Produccion/Produccion/Dominio_terminos_atributos.aspx</mso:_CopySource>
<mso:Order msdt:dt="string">221800.000000000</mso:Order>
<mso:TemplateUrl msdt:dt="string"></mso:TemplateUrl>
<mso:xd_ProgID msdt:dt="string"></mso:xd_ProgID>
<mso:_SourceUrl msdt:dt="string"></mso:_SourceUrl>
<mso:_SharedFileIndex msdt:dt="string"></mso:_SharedFileIndex>
</mso:CustomDocumentProperties>
</xml></SharePoint:CTFieldRefs><![endif]-->
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

                    <div class="search" data-search-path="Pages.Search.html?q=">
                        <input placeholder="Buscar...">
                        <span class="search-icon">
                            <i class="simple-icon-magnifier"></i>
                        </span>
                    </div>
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
                            <button class="header-icon btn btn-empty" type="button" id="iconMenuButton"
                                data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                <i class="simple-icon-grid"></i>
                            </button>
                            <div class="dropdown-menu dropdown-menu-right mt-3  position-absolute"
                                id="iconMenuDropdown">
                                <a href="http://vamos.bancoguayaquil.com/sitios/informaciongerencial/Paginas/ANALYTICS/Marlon%20Z/PAGINAS/COMUNIDAD_ANALITICA/index.aspx"
                                    class="icon-menu-item quicklinks">
                                    <img src="img/datahub.png" alt="Logo DataHub">
                                    <span>Data Hub</span>
                                </a>

                                <a href="#" class="icon-menu-item">
                                    <i class="iconsminds-male-female d-block"></i>
                                    <span>Users</span>
                                </a>

                                <a href="#" class="icon-menu-item">
                                    <i class="iconsminds-puzzle d-block"></i>
                                    <span>Components</span>
                                </a>

                                <a href="#" class="icon-menu-item">
                                    <i class="iconsminds-bar-chart-4 d-block"></i>
                                    <span>Profits</span>
                                </a>

                                <a href="#" class="icon-menu-item">
                                    <i class="iconsminds-file d-block"></i>
                                    <span>Surveys</span>
                                </a>

                                <a href="#" class="icon-menu-item">
                                    <i class="iconsminds-suitcase d-block"></i>
                                    <span>Tasks</span>
                                </a>

                            </div>
                        </div>

                        <div class="position-relative d-inline-block">
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
                                    <span>Polí­ticas y Procedimientos</span>
                                </a>
                            </li>
                            <li>
                                <a href="LibroDominios.aspx">
                                    <i class="iconsminds-library"></i>
                                    <span>Libro de Dominios</span>
                                </a>
                            </li>
                            <li class="active">
                                <a href="#">
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
                        <div id="sub-menu-suite">

                        </div>
                        <div class="ps__rail-x" style="left: 0px; bottom: 0px;">
                            <div class="ps__thumb-x" tabindex="0" style="left: 0px; width: 0px;"></div>
                        </div>
                        <div class="ps__rail-y" style="top: 0px; right: 0px;">
                            <div class="ps__thumb-y" tabindex="0" style="top: 0px; height: 0px;"></div>
                        </div>
                    </div>
                </div>
            </div>
            <main>
                <div class="container-fluid">
                    <div class="row">
                        <div class="col-12">
                            <div class="mb-2">
                                <h1 id="nombre-dominio" class="pb-1">Nombre Dominio</h1>
                                <nav class="breadcrumb-container d-none d-sm-block d-lg-inline-block"
                                    aria-label="breadcrumb">
                                    <ol class="breadcrumb pt-0" id="secciones-dominio">
                                        <li class="breadcrumb-item">
                                            <a id="a-dominio" href="FichaDominio.aspx">Ficha de Dominio</a>
                                        </li>
                                        <li class="breadcrumb-item">
                                            <a id="a-estructura" href="Dominio_estructura.aspx">Estructura</a>
                                        </li>
                                        <li class="breadcrumb-item">
                                            <a id="a-artefactos" href="">Artefactos</a>
                                        </li>
                                        <li class="breadcrumb-item filtro-actual">
                                            <a id="a-terminos" href="#">Términos y Atributos</a>
                                        </li>
                                        <li class="breadcrumb-item">
                                            <a id="a-actas" href="">Acta de Reunión</a>
                                        </li>
                                        <li class="breadcrumb-item">
                                            <a id="a-metadatos" href="">Metadatos y Linaje</a>
                                        </li>
                                    </ol>
                                </nav>
                                <h3 class="pb-2">Términos y Atributos</h3>
                            </div>
                            <div class="mb-2">
                                <div class="collapse d-md-block" id="displayOptions">
                                    <div class="d-flex flex-column flex-xl-row justify-content-between align-items-xl-center w-100 gap-3"
                                        style="gap: 15px;">

                                        <div class="d-flex flex-wrap align-items-center gap-2"
                                            style="gap: 10px; flex-grow: 1;">

                                            <div class="search-sm position-relative"
                                                style="flex-grow: 1; min-width: 250px; max-width: 400px;">
                                                <input class="form-control form-control-sm rounded-pill pr-4"
                                                    placeholder="Buscar..." id="glosario-search" autocomplete="off"
                                                    style="width: 100%;">
                                                <i class="iconsminds-magnifi-glass position-absolute text-semi-muted"
                                                    id="glosario-buscar"
                                                    style="right: 12px; top: 50%; transform: translateY(-50%); cursor: pointer;"></i>
                                            </div>

                                            <div class="btn-group">
                                                <button
                                                    class="btn btn-outline-dark btn-sm dropdown-toggle rounded-pill whitespace-nowrap btn-reveal btn-reveal-dropdown"
                                                    type="button" data-toggle="dropdown" aria-haspopup="true"
                                                    aria-expanded="false" id="dropdown-btn">
                                                    <svg viewBox="0 0 24 24" width="24" height="24"
                                                        stroke="currentColor" stroke-width="2" fill="none"
                                                        stroke-linecap="round" stroke-linejoin="round"
                                                        class="css-i6dzq1">
                                                        <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3">
                                                        </polygon>
                                                    </svg>
                                                    <span class="label">Filtrar Por</span>
                                                </button>
                                                <div class="dropdown-menu">
                                                    <a class="dropdown-item" href="#"
                                                        onclick="nuevoCriterio('categoria'); return false;">Categoría</a>
                                                    <a class="dropdown-item" href="#"
                                                        onclick="nuevoCriterio('caso de uso'); return false;">Caso de
                                                        uso</a>
                                                    <a class="dropdown-item" href="#"
                                                        onclick="nuevoCriterio('todos'); return false;">Todos</a>
                                                </div>
                                            </div>

                                            <div class="text-semi-muted ml-md-1">
                                                <span id="glosario-count" class="badge badge-primary px-3 py-2"
                                                    style="font-size: 0.8rem; border-radius: 12px;">0 resultados</span>
                                            </div>

                                        </div>
                                        <div class="d-flex flex-wrap align-items-center justify-content-sm-end gap-2 mt-3 mt-xl-0"
                                            style="gap: 10px;" id="glosario-actions-bar">

                                            <div id="glosario-add-container" class="btn-slot" style="width: auto;">
                                                <button class="btn-reveal" type="button" id="glosario-add-atributo"
                                                    onclick="addAtributo()">
                                                    <i class="iconsminds-add"
                                                        style="font-size: 1.2rem; -webkit-text-stroke: 1px currentColor;"></i>
                                                    <span class="label" style="font-weight: 500;">Nuevo Atributo</span>
                                                </button>
                                            </div>

                                            <div class="btn-slot" style="width: auto;">
                                                <input type="file" id="glosario-importar-file" accept=".csv"
                                                    style="display:none;">
                                                <button class="btn-reveal" type="button" id="glosario-importar"
                                                    data-toggle="tooltip" data-placement="bottom"
                                                    title="Subir CSV para actualizar">
                                                    <i class="simple-icon-cloud-upload"
                                                        style="font-size: 1.2rem; -webkit-text-stroke: 1px currentColor;"></i>
                                                    <span class="label" style="font-weight: 500;">Importar</span>
                                                </button>
                                            </div>

                                            <div class="btn-slot" style="width: auto;">
                                                <button class="btn-reveal" type="button" id="glosario-exportar"
                                                    data-toggle="tooltip" data-placement="bottom"
                                                    title="Descargar todo">
                                                    <i class="simple-icon-cloud-download"
                                                        style="font-size: 1.2rem; -webkit-text-stroke: 1px currentColor;"></i>
                                                    <span class="label" style="font-weight: 500;">Exportar</span>
                                                </button>
                                            </div>

                                            <div class="m-0 pl-2">
                                                <button
                                                    class="btn btn-outline-dark btn-sm dropdown-toggle rounded-pill whitespace-nowrap"
                                                    type="button" data-toggle="dropdown" aria-haspopup="true"
                                                    aria-expanded="false" id="segmentar-btn">
                                                    Segmentar Por
                                                </button>
                                                <div class="dropdown-menu dropdown-menu-right" style="width:250px;">
                                                    <a class="dropdown-item" onclick="segmentar('termino')">Término</a>
                                                    <a class="dropdown-item"
                                                        onclick="segmentar('atributo')">Atributo</a>
                                                    <a class="dropdown-item"
                                                        onclick="segmentar('datos personales')">Datos Personales</a>
                                                    <a class="dropdown-item" onclick="segmentar('todos')">Todos</a>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="separator mb-5"></div>
                        </div>
                    </div>

                    <div class="col" id="glosario-body">
                        <div id="resultados">
                        </div>
                        <nav class="mt-4 mb-4">
                            <div class="pagination justify-content-center"></div>
                        </nav>
                    </div>

                </div>
            </main>

            <!-- Modal eliminar registro -->
            <div class="modal fade" id="glosario-delete-modal" tabindex="-1" role="dialog" aria-hidden="true">
                <div class="modal-dialog modal-sm" role="document">
                    <div class="modal-content">
                        <div class="modal-header pb-2 pt-3">
                            <h5 class="modal-title">Confirmar</h5>
                            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div class="modal-body pt-2 pb-0">
                            ¿Desea eliminar este registro del glosario?
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary btn-sm"
                                data-dismiss="modal">Cancelar</button>
                            <button type="button" class="btn btn-danger btn-sm"
                                id="glosario-delete-confirm">Eliminar</button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Overlay de carga para importación -->
            <div id="glosario-import-overlay">
                <div class="loader"></div>
                <div style="margin-top: 12px; font-weight: 600; color: #1b1f2a;">Procesando archivo...</div>
            </div>

            <style>
                .link_subrrayado {
                    cursor: pointer;
                }

                .link_subrrayado:hover {
                    text-decoration: underline;
                    color: #D2006E !important;
                }

                .glosario-count-wrapper {
                    display: inline-flex;
                    align-items: center;
                    vertical-align: middle;
                }

                .glosario-count-wrapper .badge {
                    line-height: 1.1;
                }
            </style>
            <style>
                .glosario-item-actions {
                    display: none;
                    justify-content: flex-end;
                    align-items: center;
                    gap: 0.4rem;
                    margin-bottom: -2.25rem;
                }

                .glosario-editar-btn .simple-icon-pencil {
                    font-size: 16px;
                    color: #1b1f2a;
                    line-height: 1;
                }


                .glosario-item-edit {
                    display: none;
                    padding: 1rem;
                    border: 1px solid #e5e7eb;
                    border-radius: 0.5rem;
                    background: #fafafa;
                    margin-bottom: 0.75rem;
                    margin-top: 1.75rem;
                    gap: 0.6rem;
                }

                .glosario-exportar-btn .glosario-exportar-icon {
                    font-size: 18px;
                    transition: transform 0.15s ease, color 0.15s ease;
                    color: #8f8f8f;
                }

                .glosario-exportar-btn:hover .glosario-exportar-icon {
                    color: #d1007e;
                    transform: scale(1.1);
                }

                .glosario-importar-btn .glosario-importar-icon {
                    font-size: 18px;
                    transition: transform 0.15s ease, color 0.15s ease;
                    color: #8f8f8f;
                }

                .glosario-importar-btn:hover .glosario-importar-icon {
                    color: #d1007e;
                    transform: scale(1.1);
                }

                .glosario-icon-btn {
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    width: 38px;
                    height: 38px;
                    border: none;
                    background: transparent;
                    padding: 0;
                    margin: 0;
                    color: #8f8f8f;
                }

                .glosario-icon {
                    font-size: 18px;
                    line-height: 1;
                    color: #8f8f8f;
                }

                /* Icono de nuevo atributo ligeramente más grande */
                .glosario-actions .iconsminds-add.glosario-icon {
                    font-size: 20px;
                }

                .glosario-icon-btn:hover {
                    background: #f3f4f6;
                    border-radius: 6px;
                }

                .glosario-icon-btn:hover .glosario-icon {
                    color: #d1007e;
                }

                .glosario-editar-btn:hover .simple-icon-pencil {
                    color: #d1007e !important;
                }

                .glosario-actions {
                    gap: 1px;
                    margin-bottom: 4px;
                }

                .glosario-actions-item {
                    margin: 0 !important;
                }

                @keyframes glosario-spin {
                    from {
                        transform: rotate(0deg);
                    }

                    to {
                        transform: rotate(360deg);
                    }
                }

                #glosario-import-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(255, 255, 255, 0.82);
                    display: none;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    z-index: 9999;
                }

                #glosario-import-overlay .loader {
                    width: 48px;
                    height: 48px;
                    border: 4px solid #1b7cbd;
                    border-top-color: transparent;
                    border-radius: 50%;
                    animation: glosario-spin 0.9s linear infinite;
                }

                #glosario-import-overlay.is-active {
                    display: flex;
                }
            </style>

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
            <div class="modal fade modal-noscroll" id="modalAtributo" role="dialog" aria-hidden="true">
                <div class="modal-dialog" role="document">
                    <div class="modal-content">
                        <div class="modal-header pb-3 pt-3">
                            <h5 class="modal-title" id="exampleModalContentLabel">Agregar Término / Atributo</h5>
                            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div class="modal-body">
                            <form class="attr-form">
                                <input type="hidden" id="idatributo">
                                <div class="attr-grid">
                                    <div class="attr-card">
                                        <div class="attr-card__header">
                                            <span class="dot dot--pink"></span>
                                            <strong>Identidad</strong>
                                        </div>
                                        <div class="form-group">
                                            <label for="tipo" class="col-form-label">Tipo</label>
                                            <select class="form-control" id="tipo">
                                                <option value="ATRIBUTO">Atributo</option>
                                                <option value="TERMINO">Término</option>
                                                <option value="ATRIBUTO/TERMINO">Atributo/Término</option>
                                            </select>
                                        </div>
                                        <div class="form-group">
                                            <label for="NOMBREA" class="col-form-label" id="label-nombre">Nombre del
                                                término</label>
                                            <textarea class="form-control" id="NOMBREA" rows="2"
                                                placeholder="Nombre corto y claro"></textarea>
                                        </div>
                                        <div class="form-group mb-0">
                                            <label for="Descripcion" class="col-form-label"
                                                id="label-descripcion">Descripción</label>
                                            <textarea class="form-control" id="Descripcion" rows="3"
                                                placeholder="Explica el significado funcional"></textarea>
                                        </div>
                                    </div>

                                    <div class="attr-card">
                                        <div class="attr-card__header">
                                            <span class="dot dot--blue"></span>
                                            <strong>Ubicación</strong>
                                        </div>
                                        <div class="form-group">
                                            <label for="nombred" class="col-form-label">Dominio</label>
                                            <select data-width="100%"
                                                class="form-control select2-multiple select2-hidden-accessible"
                                                multiple="multiple" aria-hidden="true" id="nombred">
                                                <option label="&nbsp;">&nbsp;</option>
                                            </select>
                                        </div>
                                        <div class="form-group">
                                            <label for="nombresub" class="col-form-label">Subdominio</label>
                                            <select data-width="100%"
                                                class="form-control select2-multiple select2-hidden-accessible"
                                                multiple="multiple" aria-hidden="true" id="nombresub">
                                                <option label="&nbsp;">&nbsp;</option>
                                            </select>
                                        </div>
                                        <div class="form-group mb-0">
                                            <label for="nombresubcategoria1" class="col-form-label">Subcategoría</label>
                                            <input disabled placeholder="EN REVISIÓN" type="text" class="form-control"
                                                id="nombresubcategoria1">
                                        </div>
                                    </div>

                                    <div class="attr-card">
                                        <div class="attr-card__header">
                                            <span class="dot dot--green"></span>
                                            <strong>Características</strong>
                                        </div>
                                        <div class="form-group">
                                            <label for="nombrecaract" class="col-form-label">Tipo de atributo</label>
                                            <select data-width="100%"
                                                class="form-control select2-multiple select2-hidden-accessible"
                                                multiple="multiple" aria-hidden="true" id="nombrecaract">
                                                <option label="&nbsp;">&nbsp;</option>
                                            </select>
                                        </div>
                                        <div class="form-row">
                                            <div class="form-group col-md-6">
                                                <label for="datopersonal" class="col-form-label">Dato Personal</label>
                                                <select data-width="100%" class="form-control" aria-hidden="true"
                                                    id="datopersonal">
                                                    <option label="&nbsp;">&nbsp;</option>
                                                    <option value="1">Si</option>
                                                    <option value="0">No</option>
                                                </select>
                                            </div>
                                            <div class="form-group col-md-6">
                                                <label for="goldenrecord" class="col-form-label">Golden Record</label>
                                                <select data-width="100%" class="form-control" aria-hidden="true"
                                                    id="goldenrecord">
                                                    <option label="&nbsp;">&nbsp;</option>
                                                    <option value="1">Si</option>
                                                    <option value="0">No</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div class="form-group mb-0">
                                            <label for="prioridad_glosario" class="col-form-label">Prioridad
                                                glosario</label>
                                            <input type="number" min="1" class="form-control" id="prioridad_glosario"
                                                placeholder="1, 2, 3...">
                                        </div>
                                    </div>

                                    <div class="attr-card">
                                        <div class="attr-card__header">
                                            <span class="dot dot--orange"></span>
                                            <strong>Catálogos</strong>
                                        </div>
                                        <div class="form-group mb-0">
                                            <label for="catalogos" class="col-form-label">Catálogos Asociados</label>
                                            <select data-width="100%"
                                                class="form-control select2-multiple select2-hidden-accessible"
                                                multiple="multiple" aria-hidden="true" id="catalogos">
                                                <option label="&nbsp;">&nbsp;</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                        <div class="modal-footer">
                            <button type="button" id="btnagregaratributo" class="btn btn-primary">Guardar</button>
                        </div>
                    </div>
                </div>
            </div>
            <style>
                /* VARIABLES DEL MODAL */
                :root {
                    --modal-width: 900px;
                    --modal-height: 82vh;
                }

                .modal-noscroll .modal-dialog {
                    max-width: var(--modal-width);
                }

                .modal-noscroll .modal-content {
                    height: var(--modal-height);
                    display: flex;
                    flex-direction: column;
                }

                .modal-noscroll .modal-header,
                .modal-noscroll .modal-footer {
                    flex: 0 0 auto;
                }

                .modal-noscroll .modal-body {
                    flex: 1 1 auto;
                    overflow-y: auto;
                    -webkit-overflow-scrolling: touch;
                    overscroll-behavior: contain;
                }

                /* DISEÑO DE TARJETAS (GRID) */
                .attr-form {
                    padding: 4px 8px;
                }

                .attr-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
                    gap: 12px;
                }

                .attr-card {
                    border: 1px solid #e5e7eb;
                    border-radius: 12px;
                    padding: 12px 12px 8px;
                    background: #fff;
                    box-shadow: 0 6px 18px rgba(0, 0, 0, 0.06);
                }

                .attr-card__header {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    margin-bottom: 10px;
                    font-weight: 700;
                }

                .dot {
                    width: 10px;
                    height: 10px;
                    border-radius: 50%;
                    display: inline-block;
                }

                .dot--pink {
                    background: #d1006c;
                }

                .dot--blue {
                    background: #2563eb;
                }

                .dot--green {
                    background: #0f766e;
                }

                .dot--orange {
                    background: #f59e0b;
                }

                #modalAtributo .modal-dialog {
                    max-width: 960px;
                }

                #modalAtributo .modal-content {
                    max-height: 78vh;
                    display: flex;
                    flex-direction: column;
                }

                #modalAtributo .modal-body {
                    flex: 1 1 auto;
                    overflow-y: auto;
                }

                /* ESTILOS PARA LOS CAMPOS SELECT2 MÚLTIPLES (Pastillas / Pills) */
                .attr-form .select2-container .select2-selection--multiple {
                    height: auto !important;
                    min-height: 38px !important;
                    padding-bottom: 4px;
                }

                .attr-form .select2-container .select2-selection--multiple .select2-selection__rendered {
                    white-space: normal !important;
                    display: inline-block !important;
                    width: 100%;
                }

                .attr-form .select2-container--bootstrap .select2-selection--multiple .select2-selection__choice {
                    margin-top: 6px;
                    margin-bottom: 2px;
                }
            </style>

            <script src="js/vendor/jquery-3.3.1.min.js"></script>
            <script src="js/vendor/bootstrap.bundle.min.js"></script>
            <script src="js/vendor/perfect-scrollbar.min.js"></script>
            <script src="js/dore.script.js"></script>
            <script src="js/scripts.single.theme.js"></script>
            <script src="js/vendor/select2.full.js"></script>
            <script src="js/pagination.min.js"></script>
            <script src="js/jquery.SPServices.v2014-02.min.js"></script>
            <script src="js/Glosario/glosario.js"></script>
            <script src="js/Glosario/glosarioEdit.js"></script>
            <script src="js/Glosario/api.js"></script>
            <script src="js/ServiciosSharepoint/DiccionarioService.js"></script>
            <script src="js/ServiciosSharepoint/HelpersSharepoint.js"></script>
            <script src="js/CasodeUso/apiService.js"></script>
            <script src="js/ServiciosApi/ApiHelper.js"></script>
            <script src="js/ServiciosApi/TerminosService.js"></script>
            <script src="js/ServiciosApi/DominiosService.js"></script>

            <script>
                var n = new Date().getTime();
                document.write('<script src="js/suite.js?v=' + n + '"> <' + '/' + 'script>');
            </script>

            <script>
                $(document).ready(function () {
                    $('body').tooltip('dispose');

                    $('body').tooltip({
                        selector: '[data-toggle="tooltip"]',
                        container: 'body',
                        trigger: 'hover'
                    });

                    $(document).on('click', '[data-toggle="tooltip"]', function () {
                        $(this).tooltip('hide');
                    });

                    $(document).on("click", ".glosario-crosslink", function (e) {
                        e.preventDefault();
                        const terminoToSearch = $(this).attr("data-termino");
                        console.log("Cross-link clickeado. Buscando:", terminoToSearch);

                        const inputBusqueda = document.getElementById('glosario-search');
                        if (inputBusqueda) {
                            inputBusqueda.value = terminoToSearch;
                        }
                        let filtrado = searchList(terminoToSearch, 'nombre', window.aux || window.glosario.todos, true);
                        GlosarioApp.printSearchResults(filtrado, { skipUrlFilter: true });
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                    });
                });
            </script>

            <script>
                $(document).ready(function () {
                    GlosarioApp.initDominio();
                    if (typeof setupGlosarioInlineEdition === "function") {
                        GlosarioEdit.setup()
                    }
                    if (typeof setupGlosarioExport === "function") {
                        setupGlosarioExport();
                    }
                    if (typeof setupGlosarioImport === "function") {
                        setupGlosarioImport();
                    }
                    // Confirmación de eliminación
                    const btnConfirm = document.getElementById("glosario-delete-confirm");
                    if (btnConfirm) {
                        btnConfirm.addEventListener("click", function () {
                            const modal = $("#glosario-delete-modal");
                            const recordId = modal.data("record-id");
                            const card = modal.data("card-el");
                            modal.modal("hide");
                            GlosarioEdit.deleteItem(recordId, card);
                        });
                    }
                    // Visibilidad y permisos de acciones solo para OGA
                    if (typeof isOGA === "function" && !isOGA()) {
                        const bar = document.getElementById("glosario-actions-bar");
                        if (bar) {
                            const items = bar.querySelectorAll(".glosario-actions-item");
                            items.forEach((el, idx) => {
                                if (idx < 4) el.style.display = "none"; // oculta nuevo/editar/importar/exportar
                            });
                        }
                        document.getElementById("glosario-edicion-toggle")?.setAttribute("disabled", "disabled");
                        document.getElementById("glosario-importar")?.setAttribute("disabled", "disabled");
                        document.getElementById("glosario-exportar")?.setAttribute("disabled", "disabled");
                        document.getElementById("nuevoatributo")?.setAttribute("disabled", "disabled");
                    }
                });
            </script>
            <script>
                // Refuerza el control del overlay de carga desde el ASPX
                window.toggleGlosarioImportLoading = function (show) {
                    const overlay = document.getElementById("glosario-import-overlay");
                    if (!overlay) return;
                    if (show) {
                        overlay.classList.add("is-active");
                    } else {
                        overlay.classList.remove("is-active");
                    }
                };
            </script>
        </body>

    </html>
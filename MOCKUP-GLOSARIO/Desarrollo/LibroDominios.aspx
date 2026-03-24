<!DOCTYPE html>
<%@ Register Tagprefix="SharePoint" Namespace="Microsoft.SharePoint.WebControls"
    Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
    <html lang="en" xmlns:mso="urn:schemas-microsoft-com:office:office"
        xmlns:msdt="uuid:C2F41010-65B3-11d1-A29F-00AA00C14882">
    <%@ Register Tagprefix="SharePoint" Namespace="Microsoft.SharePoint.WebControls"
        Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>

        <head>
            <meta charset="UTF-8">
            <title>Libro de Dominios</title>
            <link rel="icon" type="image/png" href="img/OGA_icon.png">
            <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">

            <link rel="stylesheet" href="font/iconsmind-s/css/iconsminds.css" />
            <link rel="stylesheet" href="font/simple-line-icons/css/simple-line-icons.css" />

            <link rel="stylesheet" href="css/vendor/bootstrap.min.css" />
            <link rel="stylesheet" href="css/vendor/bootstrap.rtl.only.min.css" />
            <link rel="stylesheet" href="css/vendor/component-custom-switch.min.css" />
            <link rel="stylesheet" href="css/vendor/perfect-scrollbar.css" />
            <script>
                var n = new Date().getTime();
                document.write('<link href="css/style.css?v=' + n + '" rel="stylesheet" />');
            </script>

            <link rel="stylesheet" href="css/main.css" />
            <style>
                .domain-modal {
                    border: 0;
                    border-radius: 1.1rem;
                    box-shadow: 0 16px 40px rgba(16, 24, 40, 0.18);
                    min-height: 78vh;
                    height: 82vh;
                    display: flex;
                    flex-direction: column;
                    max-width: 100%;
                }

                .modal-dialog.modal-nuevo-dominio {
                    max-width: 960px;
                    width: 95%;
                }

                .domain-modal__header,
                .domain-modal__footer {
                    border: 0;
                    padding: 0.75rem;
                }

                .domain-modal__body {
                    flex: 1;
                    min-height: 0;
                    overflow: auto;
                    padding: 0.75rem;
                }

                .domain-modal__footer {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    gap: 14px;
                    margin-top: 8px;
                    position: sticky;
                    bottom: 0;
                    background: #fff;
                    box-shadow: 0 -4px 12px rgba(15, 23, 42, 0.06);
                    z-index: 2;
                }

                .domain-modal__actions {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    flex-wrap: wrap;
                }

                .domain-form-section {
                    background: #fafbfc;
                    border: 1px solid #eef0f3;
                    border-radius: 12px;
                    padding: 18px 18px 14px;
                    margin-bottom: 14px;
                }

                .domain-form-section__title {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    font-weight: 700;
                    color: #0f172a;
                    margin-bottom: 12px;
                }

                .domain-form-section__helper {
                    color: #6c757d;
                    margin-top: -4px;
                    margin-bottom: 12px;
                }

                .domain-structure-grid {
                    display: grid;
                    grid-template-columns: 300px 1fr;
                    grid-template-areas:
                        "lider admins"
                        "custodio admins"
                        "seguridad admins";
                    gap: 12px;
                    align-items: start;
                }

                @media (max-width: 992px) {
                    .domain-structure-grid {
                        grid-template-columns: 1fr;
                        grid-template-areas:
                            "lider"
                            "custodio"
                            "seguridad"
                            "admins";
                    }
                }

                .structure-card {
                    border: 1px solid #e8ecf2;
                    border-radius: 12px;
                    padding: 10px;
                    background: #fff;
                    box-shadow: 0 6px 14px rgba(15, 23, 42, 0.05);
                }

                .structure-card h6 {
                    font-weight: 700;
                    font-size: 0.9rem;
                    margin-bottom: 8px;
                    color: #0f172a;
                }

                .structure-card__header {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    gap: 8px;
                }

                .structure-card__icon {
                    color: #d2006e;
                    font-size: 1.1rem;
                }

                .structure-card--lider {
                    grid-area: lider;
                }

                .structure-card--custodio {
                    grid-area: custodio;
                }

                .structure-card--seguridad {
                    grid-area: seguridad;
                }

                .structure-card--admins {
                    grid-area: admins;
                }

                .structure-list {
                    list-style: none;
                    padding-left: 0;
                    margin: 0;
                }

                .structure-list li {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    padding: 2px 0;
                    border-bottom: 1px solid #f1f2f6;
                    font-size: 0.82rem;
                }

                .structure-list li:last-child {
                    border-bottom: 0;
                }

                .structure-pill {
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    min-width: 22px;
                    height: 22px;
                    border-radius: 50%;
                    background: #f4f5f7;
                    color: #0f172a;
                    font-weight: 700;
                    font-size: 0.78rem;
                }

                .structure-meta {
                    flex: 1;
                    min-width: 0;
                }

                .structure-meta strong {
                    display: block;
                    font-size: 0.7rem;
                    line-height: 1.1;
                }

                .structure-meta small {
                    display: block;
                    color: #6c757d;
                    line-height: 1.05;
                    font-size: 0.78rem;
                }

                .structure-list--bullets li {
                    align-items: flex-start;
                    gap: 6px;
                }

                .structure-list--bullets .structure-pill {
                    display: none;
                }

                .structure-list--bullets .structure-meta strong {
                    font-size: 0.95rem;
                    font-weight: 600;
                }

                .structure-remove {
                    border: 0;
                    background: none;
                    color: #d2006e;
                    font-size: 0.85rem;
                    padding: 2px;
                    cursor: pointer;
                }

                .typeahead-menu {
                    position: absolute;
                    z-index: 10;
                    top: 100%;
                    left: 0;
                    right: 0;
                    background: #fff;
                    border: 1px solid #ced4da;
                    border-radius: 0.35rem;
                    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08);
                    max-height: 220px;
                    overflow-y: auto;
                }

                .typeahead-menu .item {
                    padding: 0.4rem 0.6rem;
                    cursor: pointer;
                }

                .typeahead-menu .item:hover,
                .typeahead-menu .item.active {
                    background: #f3f6ff;
                }

                /* Modal de confirmación pequeño */
                .confirm-remove-modal.modal-dialog {
                    max-width: 420px;
                    width: 92%;
                }

                .confirm-remove-modal .modal-content {
                    border-radius: 1.1rem;
                    border: 1px solid #e5e7eb;
                    box-shadow: 0 14px 40px rgba(15, 23, 42, 0.18);
                }

                .confirm-remove-modal .modal-header,
                .confirm-remove-modal .modal-footer {
                    padding: 0.75rem 1rem;
                    border-color: #f1f5f9;
                }

                .confirm-remove-modal .modal-body {
                    padding: 0.75rem 1rem;
                }

                .confirm-remove-icon {
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                    background: #fef2f2;
                    color: #b91c1c;
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    margin-right: 8px;
                    font-weight: 700;
                }

                .domain-stepper {
                    padding: 6px 22px 6px;
                }

                #domainWizardSteps {
                    gap: 8px;
                }

                #domainWizardSteps .nav-link {
                    border: 1px solid #e2e8f0;
                    border-radius: 12px;
                    padding: 10px 14px;
                    color: #475569;
                    font-weight: 600;
                    background: #fff;
                    transition: all 0.15s ease;
                }

                #domainWizardSteps .nav-link.active {
                    background: #d2006e;
                    color: #fff;
                    border-color: #d2006e;
                    box-shadow: 0 10px 26px rgba(210, 0, 110, 0.25);
                }

                #domainWizardSteps .nav-link.done {
                    background: #ecfdf3;
                    border-color: #22c55e;
                    color: #166534;
                }

                .domain-step {
                    display: none;
                    min-height: 520px;
                }

                .domain-step.is-active {
                    display: block;
                }

                .domain-pagination__label {
                    font-weight: 600;
                    color: #475569;
                }

                .domain-modal__eyebrow {
                    text-transform: uppercase;
                    letter-spacing: 0.2em;
                    font-size: 0.68rem;
                    color: #94a3b8;
                    display: block;
                    margin-bottom: 4px;
                }

                /* Padding consistente para el modal sin importar estilos globales */
                #modalNuevoDominio .modal-header,
                #modalNuevoDominio .modal-body,
                #modalNuevoDominio .modal-footer {
                    padding: 0.75rem !important;
                }
            </style>

            <!--[if gte mso 9]><SharePoint:CTFieldRefs runat=server Prefix="mso:" FieldList="FileLeafRef"><xml>
<mso:CustomDocumentProperties>
<mso:_CopySource msdt:dt="string">http://vamos.bancoguayaquil.com/sitios/informaciongerencial/OGAsuite_Produccion/Produccion/LibroDominios.aspx</mso:_CopySource>
<mso:Order msdt:dt="string">222100.000000000</mso:Order>
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

                    <!-- <div class="search" data-search-path="Pages.Search.html?q=">
                <input placeholder="Search...">
                <span class="search-icon">
                    <i class="simple-icon-magnifier"></i>
                </span>
            </div> -->
                </div>

                <a class="navbar-logo" href="OGASuite.aspx">
                    <img id="logo-navbar" class="logo logo--invert d-none d-xs-block" src="logos/oga_color.png"
                        data-logo-default="logos/oga_color.png" data-logo-navidad="logos/oga_navidad.png">
                    <img class="logo-mobile d-block d-xs-none" src="logos/OGA_icon.png">
                    <div id="contenedor-nieve"></div>
                </a>

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
                            <!-- <button class="header-icon btn btn-empty" type="button" id="notificationButton"
                        data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        <i class="simple-icon-bell"></i>
                        <span class="count">3</span>
                    </button> -->
                            <!-- <div class="dropdown-menu dropdown-menu-right mt-3 position-absolute" id="notificationDropdown">
                        <div class="scroll">
                            <div class="d-flex flex-row mb-3 pb-3 border-bottom">
                                <a href="#">
                                    <img src="img/profiles/l-2.jpg" alt="Notification Image"
                                        class="img-thumbnail list-thumbnail xsmall border-0 rounded-circle" />
                                </a>
                                <div class="pl-3">
                                    <a href="#">
                                        <p class="font-weight-medium mb-1">Joisse Kaycee just sent a new comment!</p>
                                        <p class="text-muted mb-0 text-small">09.04.2018 - 12:45</p>
                                    </a>
                                </div>
                            </div>
                            <div class="d-flex flex-row mb-3 pb-3 border-bottom">
                                <a href="#">
                                    <img src="img/notifications/1.jpg" alt="Notification Image"
                                        class="img-thumbnail list-thumbnail xsmall border-0 rounded-circle" />
                                </a>
                                <div class="pl-3">
                                    <a href="#">
                                        <p class="font-weight-medium mb-1">1 item is out of stock!</p>
                                        <p class="text-muted mb-0 text-small">09.04.2018 - 12:45</p>
                                    </a>
                                </div>
                            </div>
                            <div class="d-flex flex-row mb-3 pb-3 border-bottom">
                                <a href="#">
                                    <img src="img/notifications/2.jpg" alt="Notification Image"
                                        class="img-thumbnail list-thumbnail xsmall border-0 rounded-circle" />
                                </a>
                                <div class="pl-3">
                                    <a href="#">
                                        <p class="font-weight-medium mb-1">New order received! It is total $147,20.</p>
                                        <p class="text-muted mb-0 text-small">09.04.2018 - 12:45</p>
                                    </a>
                                </div>
                            </div>
                            <div class="d-flex flex-row mb-3 pb-3 ">
                                <a href="#">
                                    <img src="img/notifications/3.jpg" alt="Notification Image"
                                        class="img-thumbnail list-thumbnail xsmall border-0 rounded-circle" />
                                </a>
                                <div class="pl-3">
                                    <a href="#">
                                        <p class="font-weight-medium mb-1">3 items just added to wish list by a user!
                                        </p>
                                        <p class="text-muted mb-0 text-small">09.04.2018 - 12:45</p>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div> -->
                        </div>
                    </div>

                    <!-- <div class="user d-inline-block">
                <button class="btn btn-empty p-0" type="button" data-toggle="dropdown" aria-haspopup="true"
                    aria-expanded="false">
                    <span class="name">Sarah Kortney</span>
                    <span>
                        <img alt="Profile Picture" src="img/profiles/l-1.jpg" />
                    </span>
                </button>

                <div class="dropdown-menu dropdown-menu-right mt-3">
                    <a class="dropdown-item" href="#">Account</a>
                    <a class="dropdown-item" href="#">Features</a>
                    <a class="dropdown-item" href="#">History</a>
                    <a class="dropdown-item" href="#">Support</a>
                    <a class="dropdown-item" href="#">Sign out</a>
                </div>
            </div> -->
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
                            <li class="active">
                                <a href="#">
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
                            <h1>Libro de Dominios</h1>
                            <nav class="breadcrumb-container d-none d-sm-block d-lg-inline-block"
                                aria-label="breadcrumb">
                                <ol class="breadcrumb pt-0 libro-filter">
                                    <li class="breadcrumb-item filtro-actual" aria-current="page">
                                        <a onclick="filtrarDominios('todos')">Todos</a>
                                    </li>
                                    <li class="breadcrumb-item">
                                        <a onclick="filtrarDominios('Maestros')">Maestros</a>
                                    </li>
                                    <li class="breadcrumb-item">
                                        <a onclick="filtrarDominios('Transaccionales')">Transaccionales</a>
                                    </li>
                                    <li class="breadcrumb-item">
                                        <a onclick="filtrarDominios('Derivados')">Derivados</a>
                                    </li>
                                    <li class="breadcrumb-item">
                                        <a onclick="filtrarDominios('usuario')">Mis Dominios</a>
                                    </li>
                                </ol>
                            </nav>
                            <div class="float-right mb-1 d-flex">
                                <button type="button" id="buttonchart"
                                    class="btn btn-outline-dark mr-2">Priorizacion</button>
                                <button type="button" id="btnAgregarDominio" class="btn btn-primary">Agregar nuevo
                                    dominio</button>
                            </div>

                        </div>
                    </div>
                    <div class="row">
                        <div class="col-12">
                            <div class="card">

                                <div id="chartdiv"
                                    style="width:95%;display: none;justify-content: center;margin-top: 40px;">
                                    <canvas id="myChart" style="height: 120px"></canvas>
                                </div>
                                <div class="card-body">


                                    <div class="Maestros">

                                        <h5>Maestros</h5>
                                        <div id="waffle" class="Wafflechart Dominio-Maestro">

                                        </div>
                                    </div>
                                    <div class="Transaccionales">
                                        <h5>Transaccionales</h5>
                                        <div class="Wafflechart Dominio-Transaccional"></div>
                                    </div>
                                    <div class="Derivados">
                                        <h5>Derivados</h5>
                                        <div class="Wafflechart Dominio-Derivado"></div>
                                    </div>


                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <!--Popup-->
            <div id="prompt-mensaje" class="modal fade show" tabindex="-1" role="dialog" aria-hidden="true">
                <div class="modal-dialog" role="document">
                    <div class="modal-content" style="width: 600px;">
                        <div class="modal-header">
                            <h5 class="modal-title" id="exampleModalPopoversLabel">Dominios</h5>
                            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">í—</span>
                            </button>
                        </div>
                        <div class="modal-body" id="mensaje_body">



                        </div>
                        <div class="modal-footer">

                            <button id="btnDominios" type="button" class="btn btn-primary"
                                data-dismiss="modal">Cerrar</button>
                        </div>
                    </div>
                </div>
            </div>



            <!-- Modal nuevo dominio -->
            <div class="modal fade" id="modalNuevoDominio" tabindex="-1" role="dialog" aria-hidden="true">
                <div class="modal-dialog modal-lg modal-dialog-centered modal-nuevo-dominio" role="document">
                    <div class="modal-content domain-modal">
                        <form id="formNuevoDominio" novalidate>
                            <div class="modal-header domain-modal__header">
                                <div>
                                    <h5 class="modal-title">
                                        <i class="iconsminds-library mr-2"></i> Registrar un nuevo dominio
                                    </h5>
                                </div>
                                <button type="button" class="close" data-dismiss="modal" aria-label="Cerrar">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div class="domain-stepper">
                                <ul id="domainWizardSteps" class="nav nav-pills justify-content-between">
                                    <li class="nav-item"><a class="nav-link active" data-goto="1">1. Identificacion</a>
                                    </li>
                                    <li class="nav-item"><a class="nav-link" data-goto="2">2. Estructura</a></li>
                                    <li class="nav-item"><a class="nav-link" data-goto="3">3. Descripcion</a></li>
                                    <li class="nav-item"><a class="nav-link" data-goto="4">4. Avance</a></li>
                                </ul>
                            </div>
                            <div class="modal-body domain-modal__body">
                                <div class="domain-form-section domain-step is-active" data-step="1">
                                    <span class="domain-form-section__title">Identificacion</span>
                                    <div class="form-row">
                                        <div class="form-group col-md-6">
                                            <label for="nuevoDominioCodigo">Codigo</label>
                                            <input type="text" class="form-control" id="nuevoDominioCodigo"
                                                maxlength="50" required placeholder="Ej. DOM-001">
                                            <small class="form-text text-muted">Debe ser unico y sin espacios.</small>
                                        </div>
                                        <div class="form-group col-md-6">
                                            <label for="nuevoDominioNombre">Nombre del dominio</label>
                                            <input type="text" class="form-control" id="nuevoDominioNombre"
                                                maxlength="255" required placeholder="Nombre visible en la suite">
                                        </div>
                                    </div>
                                    <div class="form-row">
                                        <div class="form-group col-md-6">
                                            <label for="nuevoDominioTipo">Tipo de dominio</label>
                                            <select class="form-control custom-select" id="nuevoDominioTipo" required>
                                                <option value="">Seleccione</option>
                                                <option value="Dominio Maestro">Dominio Maestro</option>
                                                <option value="Dominio Transaccional">Dominio Transaccional</option>
                                                <option value="Dominio Derivado">Dominio Derivado</option>
                                            </select>
                                        </div>
                                        <div class="form-group col-md-6">
                                            <label for="nuevoDominioFamilia">Familia</label>
                                            <input type="text" class="form-control" id="nuevoDominioFamilia"
                                                maxlength="255" placeholder="Segmento o unidad de negocio">
                                        </div>
                                    </div>
                                    <div class="border-top pt-3 mt-2">
                                        <span class="domain-form-section__title">Metricas y estado</span>
                                        <div class="form-row align-items-end">
                                            <div class="form-group col-md-4">
                                                <label for="nuevoDominioCom">COM</label>
                                                <div class="input-group">
                                                    <div class="input-group-prepend">
                                                        <span class="input-group-text"><i
                                                                class="iconsminds-dashboard"></i></span>
                                                    </div>
                                                    <input type="number" class="form-control" id="nuevoDominioCom"
                                                        min="0" step="0.1" placeholder="0">
                                                </div>
                                            </div>
                                            <div class="form-group col-md-4">
                                                <label for="nuevoDominioImpact">IMPACT</label>
                                                <div class="input-group">
                                                    <div class="input-group-prepend">
                                                        <span class="input-group-text"><i
                                                                class="iconsminds-line-chart-1"></i></span>
                                                    </div>
                                                    <input type="number" class="form-control" id="nuevoDominioImpact"
                                                        min="0" step="0.1" placeholder="0">
                                                </div>
                                            </div>
                                            <div class="form-group col-md-4">
                                                <label for="nuevoDominioLider">Lider sugerido</label>
                                                <input type="text" class="form-control" id="nuevoDominioLider"
                                                    maxlength="255" placeholder="Nombre o rol">
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div class="domain-form-section domain-step" data-step="2">
                                    <span class="domain-form-section__title">Estructura inicial</span>
                                    <div class="form-row align-items-end mb-2">
                                        <div class="form-group col-12 col-md-7 position-relative mb-2 mb-md-0">
                                            <input type="text" class="form-control" id="estructuraAsignarEmpleado"
                                                placeholder="Escribe para filtrar colaborador">
                                            <input type="hidden" id="estructuraAsignarCodigo">
                                            <div id="sug_estructuraAsignarEmpleado" class="typeahead-menu d-none"></div>
                                            <small class="text-muted d-block mt-1">Escribe para buscar por nombre,
                                                usuario o c&oacute;digo.</small>
                                        </div>
                                        <div class="form-group col-12 col-md-3 mb-2 mb-md-0"
                                            style="padding-bottom: 19px;">
                                            <select class="form-control" id="estructuraAsignarRol">
                                                <option value="">Selecciona un rol</option>
                                                <option value="Lider de Dominio">Lider de Dominio</option>
                                                <option value="Custodio de Datos">Custodio de Datos</option>
                                                <option value="Oficial de Seguridad de la Informacion">Oficial de
                                                    Seguridad de la Informacion</option>
                                                <option value="Administradores de Dominio">Administrador de Dominio
                                                </option>
                                            </select>
                                        </div>
                                        <div class="form-group col-12 col-md-2 d-flex align-items-end">
                                            <button type="button" class="btn btn-primary btn-block w-100"
                                                id="btnAgregarIntegrante">Agregar</button>
                                        </div>
                                    </div>
                                    <div class="domain-structure-grid">
                                        <div class="structure-card structure-card--lider">
                                            <div class="structure-card__header">
                                                <h6>Lider de Dominio</h6>
                                                <i class="simple-icon-user structure-card__icon"></i>
                                            </div>
                                            <ul class="structure-list" id="estructuraListaLider"></ul>
                                            <small class="text-muted d-block mt-1" id="estructuraEmptyLider">Sin
                                                asignar</small>
                                        </div>
                                        <div class="structure-card structure-card--custodio">
                                            <div class="structure-card__header">
                                                <h6>Custodio de Datos</h6>
                                                <i class="simple-icon-layers structure-card__icon"></i>
                                            </div>
                                            <ul class="structure-list" id="estructuraListaCustodio"></ul>
                                            <small class="text-muted d-block mt-1" id="estructuraEmptyCustodio">Sin
                                                asignar</small>
                                        </div>
                                        <div class="structure-card structure-card--admins">
                                            <div class="structure-card__header">
                                                <h6>Administradores de Dominio</h6>
                                                <i class="simple-icon-menu structure-card__icon"></i>
                                            </div>
                                            <ul class="structure-list structure-list--bullets"
                                                id="estructuraListaAdmins"></ul>
                                            <small class="text-muted d-block mt-1" id="estructuraEmptyAdmins">Sin
                                                asignar</small>
                                        </div>
                                        <div class="structure-card structure-card--seguridad">
                                            <div class="structure-card__header">
                                                <h6>Oficial de Seguridad de la Informacion</h6>
                                                <i class="simple-icon-shield structure-card__icon"></i>
                                            </div>
                                            <ul class="structure-list" id="estructuraListaSeguridad"></ul>
                                            <small class="text-muted d-block mt-1" id="estructuraEmptySeguridad">Sin
                                                asignar</small>
                                        </div>
                                    </div>
                                </div>

                                <div class="domain-form-section domain-step" data-step="3">
                                    <span class="domain-form-section__title">Descripcion</span>
                                    <div class="form-group">
                                        <label for="nuevoDominioConceptos">Conceptos clave</label>
                                        <textarea class="form-control" id="nuevoDominioConceptos" rows="2"
                                            placeholder="Palabras clave o componentes principales"></textarea>
                                    </div>
                                    <div class="form-group">
                                        <label for="nuevoDominioDescripcion">Descripcion</label>
                                        <textarea class="form-control" id="nuevoDominioDescripcion" rows="3"
                                            placeholder="Explica el alcance y los objetivos del dominio"></textarea>
                                    </div>
                                    <div class="form-group mb-0">
                                        <label for="nuevoDominioAtributos">Atributos basicos</label>
                                        <textarea class="form-control" id="nuevoDominioAtributos" rows="2"
                                            placeholder="Separados por coma o salto de linea"></textarea>
                                    </div>
                                </div>

                                <div class="domain-form-section domain-step" data-step="4">
                                    <span class="domain-form-section__title">Avance inicial</span>
                                    <p class="domain-form-section__helper">Registra el estado inicial para que aparezca
                                        en los reportes.</p>
                                    <div class="form-row">
                                        <div class="form-group col-md-4">
                                            <label for="avanceFecha">Fecha de carga</label>
                                            <input type="date" class="form-control" id="avanceFecha">
                                        </div>
                                        <div class="form-group col-md-4">
                                            <label for="avanceOleada">Oleada</label>
                                            <input type="text" class="form-control" id="avanceOleada"
                                                placeholder="Ej. 2024-Q1">
                                        </div>
                                        <div class="form-group col-md-4">
                                            <label for="avancePasoEstado">Estado</label>
                                            <select class="form-control" id="avancePasoEstado">
                                                <option value="">Seleccione</option>
                                                <option value="NO INICIADO">No iniciado</option>
                                                <option value="EN PROCESO">En proceso</option>
                                                <option value="FINALIZADO">Finalizado</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div class="form-row">
                                        <div class="form-group col-md-8">
                                            <label for="avancePasoDescripcion">Paso / Hito</label>
                                            <input type="text" class="form-control" id="avancePasoDescripcion"
                                                placeholder="Ej. Inicio de levantamiento de informacion">
                                        </div>
                                        <div class="form-group col-md-4">
                                            <label for="avancePasoPorcentaje">Porcentaje</label>
                                            <div class="input-group">
                                                <input type="number" class="form-control" id="avancePasoPorcentaje"
                                                    min="0" max="100" step="1" placeholder="0">
                                                <div class="input-group-append">
                                                    <span class="input-group-text">%</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <small class="text-muted">Si lo dejas vacio, el dominio se creara sin avance
                                        inicial.</small>
                                </div>
                            </div>
                            <div class="modal-footer domain-modal__footer">
                                <div class="domain-modal__feedback">
                                    <i class="simple-icon-info mr-1"></i>
                                    <small>La informacion se registrara en T_MAPA_DOMINIOS, Z_ESTRUCTURA_DOMINIO y
                                        Z_AVANCES_DOMINIO.</small>
                                </div>
                                <div class="domain-modal__actions">
                                    <span class="domain-pagination__label" id="domainStepLabel">Paso 1 de 4</span>
                                    <button type="button" class="btn btn-outline-secondary"
                                        data-dismiss="modal">Cancelar</button>
                                    <button type="button" class="btn btn-outline-primary"
                                        id="btnPrevStepDominio">Anterior</button>
                                    <button type="button" class="btn btn-primary"
                                        id="btnNextStepDominio">Siguiente</button>
                                    <button type="submit" class="btn btn-primary d-none"
                                        id="btnGuardarNuevoDominio">Guardar dominio</button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>


            <!-- Modal confirmación eliminar integrante -->
            <div class="modal fade" id="modalEliminarIntegrante" tabindex="-1" role="dialog" aria-hidden="true">
                <div class="modal-dialog modal-sm modal-dialog-centered confirm-remove-modal" role="document">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h6 class="modal-title">Eliminar integrante</h6>
                            <button type="button" class="close" data-dismiss="modal" aria-label="Cerrar">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div class="modal-body">
                            <div class="d-flex align-items-center mb-2">
                                <span class="confirm-remove-icon">!</span>
                                <div>
                                    <p class="mb-1">¿Seguro que deseas eliminar este integrante?</p>
                                    <p class="mb-0 font-weight-bold" id="textoIntegranteEliminar"></p>
                                </div>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-outline-secondary"
                                data-dismiss="modal">Cancelar</button>
                            <button type="button" class="btn btn-danger"
                                id="btnConfirmarEliminarIntegrante">Eliminar</button>
                        </div>
                    </div>
                </div>
            </div>


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

            <script src="js/vendor/jquery-3.3.1.min.js"></script>
            <script src="js/vendor/bootstrap.bundle.min.js"></script>
            <script src="js/vendor/perfect-scrollbar.min.js"></script>
            <script src="js/vendor/mousetrap.min.js"></script>
            <script src="js/dore.script.js"></script>
            <script src="js/scripts.single.theme.js"></script>

            <script src="js/jquery.SPServices.v2014-02.min.js"></script>
            <script src="js/CasodeUso/empleadoUtils.js"></script>
            <script src="js/ServiciosApi/ApiHelper.js"></script>
            <script src="js/ServiciosApi/DominiosService.js"></script>



            <script src="https://cdn.jsdelivr.net/npm/chart.js@4.3.0/dist/chart.umd.min.js"></script>
            <script
                src="https://cdnjs.cloudflare.com/ajax/libs/chartjs-plugin-annotation/3.0.1/chartjs-plugin-annotation.min.js"></script>
            <script src="https://d3js.org/d3.v5.min.js"></script>
            <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/2.1.1/TweenMax.min.js"></script>
            <script>
                var n = new Date().getTime();
                document.write('<script src="js/suite.js?v=' + n + '"> <' + '/' + 'script>');
            </script>
            <script>
                var DomainWizard = (function () {
                    var current = 1;
                    var total = 4;
                    var sections = [];
                    var navLinks = [];
                    var prevBtn;
                    var nextBtn;
                    var saveBtn;
                    var stepLabel;

                    function cacheElements() {
                        sections = Array.prototype.slice.call(document.querySelectorAll('.domain-step'));
                        navLinks = Array.prototype.slice.call(document.querySelectorAll('#domainWizardSteps .nav-link'));
                        prevBtn = document.getElementById('btnPrevStepDominio');
                        nextBtn = document.getElementById('btnNextStepDominio');
                        saveBtn = document.getElementById('btnGuardarNuevoDominio');
                        stepLabel = document.getElementById('domainStepLabel');
                        total = sections.length || total;
                    }

                    function updateButtons() {
                        var isFirst = current === 1;
                        var isLast = current === total;
                        if (prevBtn) {
                            prevBtn.classList.toggle('d-none', isFirst);
                        }
                        if (nextBtn) {
                            nextBtn.classList.toggle('d-none', isLast);
                        }
                        if (saveBtn) {
                            saveBtn.classList.toggle('d-none', !isLast);
                        }
                    }

                    function updateLabel() {
                        if (stepLabel) {
                            stepLabel.textContent = 'Paso ' + current + ' de ' + total;
                        }
                    }

                    function validateStep(step) {
                        if (step !== 1) return true;
                        var requiredIds = ['nuevoDominioCodigo', 'nuevoDominioNombre', 'nuevoDominioTipo'];
                        for (var i = 0; i < requiredIds.length; i++) {
                            var input = document.getElementById(requiredIds[i]);
                            if (!input || !input.value.trim()) {
                                if (typeof notificarNuevoDominio === 'function') {
                                    notificarNuevoDominio('warning', 'Completa los campos obligatorios antes de continuar.');
                                } else {
                                    alert('Completa los campos obligatorios antes de continuar.');
                                }
                                input && input.focus();
                                return false;
                            }
                        }
                        return true;
                    }

                    function goTo(step) {
                        if (!sections.length) return;
                        current = Math.min(Math.max(step, 1), total);
                        sections.forEach(function (section, index) {
                            var sectionStep = parseInt(section.getAttribute('data-step'), 10) || (index + 1);
                            var isActive = sectionStep === current;
                            section.classList.toggle('is-active', isActive);
                            section.classList.toggle('domain-step--done', sectionStep < current);
                            section.classList.toggle('d-none', !isActive);
                        });
                        navLinks.forEach(function (link) {
                            var target = parseInt(link.getAttribute('data-goto'), 10);
                            link.classList.toggle('active', target === current);
                            link.classList.toggle('done', target < current);
                        });
                        updateButtons();
                        updateLabel();
                    }

                    function bindEvents() {
                        if (prevBtn) {
                            prevBtn.addEventListener('click', function () {
                                goTo(current - 1);
                            });
                        }
                        if (nextBtn) {
                            nextBtn.addEventListener('click', function () {
                                if (validateStep(current)) {
                                    goTo(current + 1);
                                }
                            });
                        }
                        navLinks.forEach(function (link) {
                            link.addEventListener('click', function () {
                                var target = parseInt(link.getAttribute('data-goto'), 10);
                                if (!isNaN(target)) {
                                    if (target > current && !validateStep(current)) return;
                                    goTo(target);
                                }
                            });
                        });
                    }

                    function init() {
                        cacheElements();
                        bindEvents();
                        goTo(1);
                    }

                    return {
                        init: init,
                        goTo: goTo
                    };
                })();

                function mostrarBotonAgregarDominio() {
                    var boton = document.getElementById('btnAgregarDominio');
                    if (!boton) {
                        return;
                    }
                    // Siempre mostramos el botón para facilitar la creación de dominios
                    boton.style.display = 'inline-block';
                }

                function notificarNuevoDominio(tipo, mensaje) {
                    if (typeof window.showNotification === 'function') {
                        window.showNotification("top", "center", tipo, mensaje);
                    } else {
                        alert(mensaje);
                    }
                }

                function limpiarFormularioNuevoDominio() {
                    var formulario = document.getElementById('formNuevoDominio');
                    if (formulario) {
                        formulario.reset();
                    }
                    limpiarEstructuraTemporal();
                    var fechaInput = document.getElementById('avanceFecha');
                    if (fechaInput) {
                        var hoy = new Date().toISOString().split('T')[0];
                        fechaInput.value = hoy;
                    }
                }

                function abrirModalNuevoDominio() {
                    limpiarFormularioNuevoDominio();
                    if (DomainWizard && typeof DomainWizard.goTo === 'function') {
                        DomainWizard.goTo(1);
                    }
                    $('#modalNuevoDominio').modal('show');
                }

                function normalizarLista(valor) {
                    if (!valor) return [];
                    return valor
                        .split(/\r?\n|,/)
                        .map(function (item) { return item.trim(); })
                        .filter(function (item) { return item.length > 0; });
                }

                var estructuraTemporal = [];

                function limpiarEstructuraTemporal() {
                    estructuraTemporal = [];
                    renderEstructuraTemporal();
                }

                function renderEstructuraTemporal() {
                    var contenedores = {
                        'Lider de Dominio': document.getElementById('estructuraListaLider'),
                        'Custodio de Datos': document.getElementById('estructuraListaCustodio'),
                        'Administradores de Dominio': document.getElementById('estructuraListaAdmins'),
                        'Oficial de Seguridad de la Informacion': document.getElementById('estructuraListaSeguridad')
                    };
                    var vacios = {
                        'Lider de Dominio': document.getElementById('estructuraEmptyLider'),
                        'Custodio de Datos': document.getElementById('estructuraEmptyCustodio'),
                        'Administradores de Dominio': document.getElementById('estructuraEmptyAdmins'),
                        'Oficial de Seguridad de la Informacion': document.getElementById('estructuraEmptySeguridad')
                    };

                    Object.keys(contenedores).forEach(function (rol) {
                        var lista = contenedores[rol];
                        if (lista) lista.innerHTML = '';
                    });

                    var contadorPorRol = {};
                    estructuraTemporal.forEach(function (integrante, idx) {
                        var lista = contenedores[integrante.rol];
                        if (!lista) return;
                        contadorPorRol[integrante.rol] = (contadorPorRol[integrante.rol] || 0) + 1;
                        var numero = contadorPorRol[integrante.rol];
                        var li = document.createElement('li');
                        li.innerHTML = '<span class="structure-pill">' + numero + '</span>' +
                            '<div class="structure-meta"><strong>' + integrante.nombre + '</strong></div>' +
                            '<button type="button" class="structure-remove" data-index="' + idx + '" title="Eliminar">&#10005;</button>';
                        lista.appendChild(li);
                    });

                    Object.keys(vacios).forEach(function (rol) {
                        var tiene = estructuraTemporal.some(function (item) { return item.rol === rol; });
                        if (vacios[rol]) {
                            vacios[rol].style.display = tiene ? 'none' : 'block';
                        }
                    });
                }

                async function agregarIntegranteEstructura() {
                    var inputEmpleado = document.getElementById('estructuraAsignarEmpleado');
                    var rolSelect = document.getElementById('estructuraAsignarRol');
                    var codigoInput = document.getElementById('estructuraAsignarCodigo');
                    if (!inputEmpleado || !rolSelect) return;

                    var textoEmpleado = (inputEmpleado.value || '').trim();
                    var rol = (rolSelect.value || '').trim();
                    var usuario = '';
                    var codigo = (codigoInput && codigoInput.value) ? codigoInput.value.trim() : '';

                    if (textoEmpleado && typeof EmpleadoUtils !== 'undefined' && typeof EmpleadoUtils.loadEmpleadosOnce === 'function') {
                        try {
                            var emps = await EmpleadoUtils.loadEmpleadosOnce();
                            var match = emps.find(function (e) {
                                return (String(e.codigo || '') === codigo) ||
                                    (e.nombreCompleto || '').toLowerCase() === textoEmpleado.toLowerCase();
                            });
                            if (match) {
                                textoEmpleado = match.nombreCompleto || textoEmpleado;
                                usuario = match.usuario || '';
                            }
                        } catch (err) {
                            console.warn('No se pudo resolver el colaborador seleccionado', err);
                        }
                    }

                    if (!textoEmpleado || !rol) {
                        if (typeof notificarNuevoDominio === 'function') {
                            notificarNuevoDominio('warning', 'Completa colaborador y rol antes de agregar.');
                        } else {
                            alert('Completa colaborador y rol antes de agregar.');
                        }
                        return;
                    }

                    estructuraTemporal.push({
                        nombre: textoEmpleado,
                        cargo: '',
                        area: '',
                        usuario: '',
                        codigo: '',
                        rol: rol,
                        suplente: '0'
                    });

                    inputEmpleado.value = '';
                    if (codigoInput) codigoInput.value = '';
                    rolSelect.value = '';
                    renderEstructuraTemporal();
                }

                function removerIntegranteEstructura(index) {
                    if (isNaN(index)) return;
                    estructuraTemporal.splice(index, 1);
                    renderEstructuraTemporal();
                }

                var integrantePendienteEliminar = null;

                function initEmpleadoTypeaheadEstructura() {
                    if (typeof EmpleadoUtils === 'undefined' || typeof EmpleadoUtils.attachEmpleadoTypeahead !== 'function') {
                        console.warn('EmpleadoUtils no esta disponible para el typeahead de estructura');
                        return;
                    }
                    EmpleadoUtils.attachEmpleadoTypeahead('estructuraAsignarEmpleado', 'sug_estructuraAsignarEmpleado', 'estructuraAsignarCodigo');
                }

                function recolectarEstructuraInicial() {
                    return estructuraTemporal.slice();
                }

                function recolectarAvanceInicial(obtener) {
                    var fecha = obtener('avanceFecha');
                    var oleada = obtener('avanceOleada');
                    var estado = obtener('avancePasoEstado');
                    var descripcionPaso = obtener('avancePasoDescripcion');
                    var porcentaje = obtener('avancePasoPorcentaje');

                    if (!fecha && !oleada && !estado && !descripcionPaso && !porcentaje) {
                        return null;
                    }

                    return {
                        fecha: fecha,
                        oleada: oleada,
                        estado: estado || 'NO INICIADO',
                        descripcionPaso: descripcionPaso || 'Inicio del dominio',
                        porcentaje: porcentaje || '0'
                    };
                }

                function recolectarDatosNuevoDominio() {
                    var obtener = function (id) {
                        var elemento = document.getElementById(id);
                        return elemento ? elemento.value.trim() : '';
                    };

                    return {
                        codigo: obtener('nuevoDominioCodigo'),
                        nombre: obtener('nuevoDominioNombre'),
                        idDominio: obtener('nuevoDominioCodigo'),
                        tipo: obtener('nuevoDominioTipo'),
                        familia: obtener('nuevoDominioFamilia'),
                        com: obtener('nuevoDominioCom') || '0',
                        impact: obtener('nuevoDominioImpact') || '0',
                        conceptos: obtener('nuevoDominioConceptos'),
                        descripcion: obtener('nuevoDominioDescripcion'),
                        lider: obtener('nuevoDominioLider'),
                        atributos: obtener('nuevoDominioAtributos'),
                        participantesEstructura: recolectarEstructuraInicial(obtener),
                        avanceInicial: recolectarAvanceInicial(obtener)
                    };
                }

                function guardarEstructuraInicial(idDominio, descripcion, participantes) {
                    if (!Array.isArray(participantes) || !participantes.length) {
                        return;
                    }
                    participantes.forEach(function (participante) {
                        $().SPServices({
                            operation: "UpdateListItems",
                            async: false,
                            batchCmd: "New",
                            listName: "Z_ESTRUCTURA_DOMINIO",
                            valuepairs: [
                                ["id_dominio", idDominio],
                                ["descripcion_dominio", descripcion],
                                ["nombre_integrante", participante.nombre],
                                ["nombre_arreglado", participante.nombre],
                                ["cargo", participante.cargo],
                                ["area", participante.area],
                                ["txt_desc_roles_gobierno", participante.rol],
                                ["usuario", participante.usuario],
                                ["es_suplente", participante.suplente || "0"],
                                ["agencia", ""],
                                ["region", ""],
                                ["id_subdominio", ""],
                                ["txt_desc_subdominio", ""],
                                ["id_participante", ""],
                                ["id_roles_gobierno", ""],
                                ["id_principal", ""],
                                ["nombre_principal", ""]
                            ],
                            completefunc: function (xData, Status) {
                                if (Status !== "success") {
                                    console.warn("No se pudo crear el participante", participante, xData);
                                }
                            }
                        });
                    });
                }

                function guardarAvanceInicial(idDominio, descripcion, avance) {
                    if (!avance) {
                        return;
                    }
                    var fechaCarga = avance.fecha ? new Date(avance.fecha) : new Date();
                    var porcentajeDecimal = parseFloat(avance.porcentaje || "0");
                    if (isNaN(porcentajeDecimal)) {
                        porcentajeDecimal = 0;
                    }
                    porcentajeDecimal = porcentajeDecimal / 100;

                    $().SPServices({
                        operation: "UpdateListItems",
                        async: false,
                        batchCmd: "New",
                        listName: "Z_AVANCES_DOMINIO",
                        valuepairs: [
                            ["fecha_carga", fechaCarga.toISOString()],
                            ["oleada", avance.oleada],
                            ["id_dominio", idDominio],
                            ["descripcion_dominio", descripcion],
                            ["id_paso", "1"],
                            ["txt_desc_paso", avance.descripcionPaso],
                            ["estado_paso", avance.estado],
                            ["porcentaje_avance_orig", porcentajeDecimal.toString()]
                        ],
                        completefunc: function (xData, Status) {
                            if (Status !== "success") {
                                console.warn("No se pudo registrar el avance inicial", xData);
                            }
                        }
                    });
                }

                async function guardarNuevoDominio() {
                    var datos = recolectarDatosNuevoDominio();

                    if (!datos.codigo || !datos.nombre || !datos.tipo) {
                        notificarNuevoDominio('warning', 'Los campos Codigo, Nombre y Tipo son obligatorios.');
                        return;
                    }

                    var botonGuardar = $('#btnGuardarNuevoDominio');
                    botonGuardar.prop('disabled', true).text('Guardando...');

                    try {
                        // 1. Armar el payload para el servicio SQL
                        const payload = {
                            codigo_Dominio: datos.codigo,
                            id_dominio: datos.idDominio, // ⚠️ Si en SQL Server esta columna es IDENTITY (autoincremental), debes quitar esta línea
                            descripcion_dominio: datos.nombre,
                            Conceptos_Clave: datos.conceptos,
                            descripcion: datos.descripcion,
                            COM: datos.com,
                            IMPACT: datos.impact,
                            Tipo: datos.tipo,            // Mapeado a la nueva columna 'Tipo' en lugar de 'tipo_dominio'
                            Familia_de_Dominios: datos.familia,
                            lider_sugerido: datos.lider,
                            atributos_basicos: datos.atributos,
                            sn_activo: 1
                        };

                        // 2. Llamada directa a SQL Server mediante el servicio
                        await window.DominiosService.create(payload);

                        // 3. Ejecutar las funciones auxiliares
                        try {
                            if (typeof guardarEstructuraInicial === 'function') {
                                guardarEstructuraInicial(datos.idDominio, datos.nombre, datos.participantesEstructura);
                            }
                            if (typeof guardarAvanceInicial === 'function') {
                                guardarAvanceInicial(datos.idDominio, datos.nombre, datos.avanceInicial);
                            }
                        } catch (error) {
                            console.warn('Error al registrar estructura o avance inicial', error);
                        }

                        // 4. Éxito: Notificar y refrescar UI
                        notificarNuevoDominio('success', 'Dominio creado correctamente.');
                        $('#modalNuevoDominio').modal('hide');

                        if (typeof limpiarFormularioNuevoDominio === 'function') {
                            limpiarFormularioNuevoDominio();
                        }

                        if (typeof window.libroDominios === 'function') {
                            window.libroDominios();
                        } else {
                            window.location.reload();
                        }

                    } catch (error) {
                        console.error("Error al crear el dominio en SQL:", error);
                        notificarNuevoDominio('danger', 'No se pudo crear el dominio. Intentalo nuevamente.');
                    } finally {
                        botonGuardar.prop('disabled', false).text('Guardar dominio');
                    }
                }

                window.onload = libroDominios();
                $(document).ready(function () {
                    mostrarBotonAgregarDominio();
                    DomainWizard.init();
                    renderEstructuraTemporal();
                    initEmpleadoTypeaheadEstructura();

                    var botonChart = document.querySelector('#buttonchart');
                    if (botonChart) {
                        botonChart.addEventListener('click', () => cargar_barras());
                    }

                    var botonAgregarIntegrante = document.getElementById('btnAgregarIntegrante');
                    if (botonAgregarIntegrante) {
                        botonAgregarIntegrante.addEventListener('click', agregarIntegranteEstructura);
                    }
                    document.querySelectorAll('.structure-list').forEach(function (lista) {
                        lista.addEventListener('click', function (e) {
                            if (e.target && e.target.classList.contains('structure-remove')) {
                                var idx = parseInt(e.target.getAttribute('data-index'), 10);
                                if (isNaN(idx)) return;
                                integrantePendienteEliminar = idx;
                                var integrante = estructuraTemporal[idx];
                                var texto = integrante && integrante.nombre ? integrante.nombre : '';
                                var lbl = document.getElementById('textoIntegranteEliminar');
                                if (lbl) lbl.textContent = texto;
                                $('#modalEliminarIntegrante').modal('show');
                            }
                        });
                    });

                    var btnConfirmarEliminarIntegrante = document.getElementById('btnConfirmarEliminarIntegrante');
                    if (btnConfirmarEliminarIntegrante) {
                        btnConfirmarEliminarIntegrante.addEventListener('click', function () {
                            if (!isNaN(integrantePendienteEliminar)) {
                                removerIntegranteEstructura(integrantePendienteEliminar);
                            }
                            integrantePendienteEliminar = null;
                            $('#modalEliminarIntegrante').modal('hide');
                        });
                    }

                    var botonAgregar = document.getElementById('btnAgregarDominio');
                    if (botonAgregar) {
                        botonAgregar.addEventListener('click', abrirModalNuevoDominio);
                    }

                    $('#modalNuevoDominio').on('hidden.bs.modal', limpiarFormularioNuevoDominio);

                    $('#formNuevoDominio').on('submit', function (event) {
                        event.preventDefault();
                        guardarNuevoDominio();
                    });
                });
                //$(window).ready(libroDominios());
            </script>
        </body>

    </html>
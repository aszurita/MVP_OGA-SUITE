
<!DOCTYPE html>
<%@ Register Tagprefix="SharePoint" Namespace="Microsoft.SharePoint.WebControls" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<html lang="en" xmlns:mso="urn:schemas-microsoft-com:office:office" xmlns:msdt="uuid:C2F41010-65B3-11d1-A29F-00AA00C14882">

<%@ Register Tagprefix="SharePoint" Namespace="Microsoft.SharePoint.WebControls" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<head>
    <meta charset="UTF-8">
    <title>Estructura de Dominio</title>
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
        document.write('<link href="css/style.css?v='+n+'" rel="stylesheet" />');
    </script>
    <script>
        (function () {
            var hoy = new Date();
            var inicioNavidad = new Date(hoy.getFullYear(), 11, 1);
            window.usarLogoNavidad = hoy >= inicioNavidad;
        })();
    </script>
    <link rel="stylesheet" href="css/main.css" />

    <style>
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

        .structure-card--lider { grid-area: lider; }
        .structure-card--custodio { grid-area: custodio; }
        .structure-card--seguridad { grid-area: seguridad; }
        .structure-card--admins { grid-area: admins; }

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

        .estructura-asignar-row .form-group {
            margin-bottom: 0;
        }

        .estructura-asignar-row .form-control,
        .estructura-asignar-row .estructura-asignar-btn {
            height: 46px;
        }

        .estructura-asignar-row .estructura-asignar-btn {
            display: flex;
            align-items: center;
            justify-content: center;
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
            box-shadow: 0 6px 20px rgba(0,0,0,0.08);
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
    </style>

<!--[if gte mso 9]><SharePoint:CTFieldRefs runat=server Prefix="mso:" FieldList="FileLeafRef"><xml>
<mso:CustomDocumentProperties>
<mso:_CopySource msdt:dt="string">http://vamos.bancoguayaquil.com/sitios/informaciongerencial/OGAsuite_Produccion/Produccion/Dominio_estructura.aspx</mso:_CopySource>
<mso:Order msdt:dt="string">150000.000000000</mso:Order>
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
                <input placeholder="Search...">
                <span class="search-icon">
                    <i class="simple-icon-magnifier"></i>
                </span>
            </div>
        </div>


        <a class="navbar-logo" href="OGASuite.aspx">
            <img id="logo-navbar" class="logo logo--invert d-none d-xs-block" src="logos/oga_color.png" data-logo-default="logos/oga_color.png" data-logo-navidad="logos/oga_navidad.png">
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
                    <div class="dropdown-menu dropdown-menu-right mt-3  position-absolute" id="iconMenuDropdown">
                        <a href="http://vamos.bancoguayaquil.com/sitios/informaciongerencial/Paginas/ANALYTICS/Marlon%20Z/PAGINAS/COMUNIDAD_ANALITICA/index.aspx" class="icon-menu-item quicklinks">
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
                                <span>Pol�ticas y Procedimientos</span>
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
                            <span>Glosario de T�rminos</span>
                        </a>
                    </li>
                    <li>
                        <a href="IndicadoresGestion.aspx">
                            <i class="iconsminds-line-chart-1"></i> 
                            <span>Indicadores de Gesti�n</span>
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
            <div class="row pb-2">
                <div class="col-12">
                    <h1 id="nombre-dominio">Nombre de Dominio</h1>
                    <nav class="breadcrumb-container d-none d-sm-block d-lg-inline-block" aria-label="breadcrumb">
                        <ol class="breadcrumb pt-0" id="secciones-dominio">
                            <li class="breadcrumb-item">
                                <a id="a-dominio" href="FichaDominio.aspx">Ficha de Dominio</a>
                            </li>
                            <li class="breadcrumb-item filtro-actual">
                                <a id="a-estructura" href="Dominio_estructura.aspx">Estructura</a>
                            </li>
                            <li class="breadcrumb-item">
                                <a id="a-artefactos" href="">Artefactos</a>
                            </li>
                            <li class="breadcrumb-item">
                                <a id="a-terminos" href="Dominio_terminos_atributos.aspx">Terminos y Atributos</a>
                            </li>
                            <li class="breadcrumb-item">
                                <a id="a-actas" href="">Acta de Reuni�n</a>
                            </li>
                            <li class="breadcrumb-item">
                                <a id ="a-metadatos" href="">Metadatos y Linaje</a>
                            </li>
                        </ol>
                    </nav>
                    <h3>Estructura de Dominio</h3>
                </div>
            </div>

            <div class="row mt-2">
                <div class="col-12">
                    <div class="card">
                        <div class="card-body">
                            <div class="domain-form-section mb-0">
                                <span class="domain-form-section__title">
                                    <i class="simple-icon-people mr-1"></i> Asignar integrantes
                                </span>
                                <div class="form-row align-items-center mb-2 estructura-asignar-row">
                                    <div class="form-group col-12 col-md-7 position-relative">
                                        <label class="mb-1" for="estructuraAsignarEmpleado">Empleado</label>
                                        <input type="text" class="form-control" id="estructuraAsignarEmpleado" placeholder="Escribe para filtrar colaborador">
                                        <input type="hidden" id="estructuraAsignarCodigo">
                                        <div id="sug_estructuraAsignarEmpleado" class="typeahead-menu d-none"></div>
                                        <small class="text-muted d-block mt-1">Escribe para buscar por nombre, usuario o codigo.</small>
                                    </div>
                                    <div class="form-group col-12 col-md-3">
                                        <label class="mb-1" for="estructuraAsignarRol">Rol</label>
                                        <select class="form-control" id="estructuraAsignarRol">
                                            <option value="">Selecciona un rol</option>
                                            <option value="Lider de Dominio">Lider de Dominio</option>
                                            <option value="Custodio de Datos">Custodio de Datos</option>
                                            <option value="Oficial de Seguridad de la Informacion">Oficial de Seguridad de la Informacion</option>
                                            <option value="Administradores de Dominio">Administrador de Dominio</option>
                                        </select>
                                    </div>
                                    <div class="form-group col-12 col-md-2 d-flex align-items-center">
                                        <button type="button" class="btn btn-primary btn-block w-100 estructura-asignar-btn" id="btnAgregarIntegrante">Agregar</button>
                                    </div>
                                </div>
                                <div class="domain-structure-grid">
                                    <div class="structure-card structure-card--lider">
                                        <div class="structure-card__header">
                                            <h6>Lider de Dominio</h6>
                                            <i class="simple-icon-user structure-card__icon"></i>
                                        </div>
                                        <ul class="structure-list" id="estructuraListaLider"></ul>
                                        <small class="text-muted d-block mt-1" id="estructuraEmptyLider">Sin asignar</small>
                                    </div>
                                    <div class="structure-card structure-card--custodio">
                                        <div class="structure-card__header">
                                            <h6>Custodio de Datos</h6>
                                            <i class="simple-icon-layers structure-card__icon"></i>
                                        </div>
                                        <ul class="structure-list" id="estructuraListaCustodio"></ul>
                                        <small class="text-muted d-block mt-1" id="estructuraEmptyCustodio">Sin asignar</small>
                                    </div>
                                    <div class="structure-card structure-card--admins">
                                        <div class="structure-card__header">
                                            <h6>Administradores de Dominio</h6>
                                            <i class="simple-icon-menu structure-card__icon"></i>
                                        </div>
                                        <ul class="structure-list structure-list--bullets" id="estructuraListaAdmins"></ul>
                                        <small class="text-muted d-block mt-1" id="estructuraEmptyAdmins">Sin asignar</small>
                                    </div>
                                    <div class="structure-card structure-card--seguridad">
                                        <div class="structure-card__header">
                                            <h6>Oficial de Seguridad de la Informacion</h6>
                                            <i class="simple-icon-shield structure-card__icon"></i>
                                        </div>
                                        <ul class="structure-list" id="estructuraListaSeguridad"></ul>
                                        <small class="text-muted d-block mt-1" id="estructuraEmptySeguridad">Sin asignar</small>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </main>

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
                            <p class="mb-1">Seguro que deseas eliminar este integrante?</p>
                            <p class="mb-0 font-weight-bold" id="textoIntegranteEliminar"></p>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-outline-secondary" data-dismiss="modal">Cancelar</button>
                    <button type="button" class="btn btn-danger" id="btnConfirmarEliminarIntegrante">Eliminar</button>
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
    <script src="https://d3js.org/d3.v5.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/2.1.1/TweenMax.min.js"></script>
    <script src="js/jquery.SPServices.v2014-02.min.js"></script>
    <script src="js/CasodeUso/empleadoUtils.js"></script>
    <script>
        var n = new Date().getTime();
        document.write('<script src="js/suite.js?v='+n+'"> <'+'/'+'script>');
    </script>
    <script>
        var estructuraTemporal = [];
        var integrantePendienteEliminar = null;
        var datosDominio = { id: "", nombre: "" };

        function notificarEstructura(tipo, mensaje) {
            if (typeof window.showNotification === "function") {
                window.showNotification("top", "center", tipo, mensaje);
            } else {
                alert(mensaje);
            }
        }

        function limpiarEstructuraTemporal() {
            estructuraTemporal = [];
            renderEstructuraTemporal();
        }

        function renderEstructuraTemporal() {
            var contenedores = {
                "Lider de Dominio": document.getElementById("estructuraListaLider"),
                "Custodio de Datos": document.getElementById("estructuraListaCustodio"),
                "Administradores de Dominio": document.getElementById("estructuraListaAdmins"),
                "Oficial de Seguridad de la Informacion": document.getElementById("estructuraListaSeguridad")
            };
            var vacios = {
                "Lider de Dominio": document.getElementById("estructuraEmptyLider"),
                "Custodio de Datos": document.getElementById("estructuraEmptyCustodio"),
                "Administradores de Dominio": document.getElementById("estructuraEmptyAdmins"),
                "Oficial de Seguridad de la Informacion": document.getElementById("estructuraEmptySeguridad")
            };

            Object.keys(contenedores).forEach(function (rol) {
                var lista = contenedores[rol];
                if (lista) lista.innerHTML = "";
            });

            var contadorPorRol = {};
            estructuraTemporal.forEach(function (integrante, idx) {
                var lista = contenedores[integrante.rol];
                if (!lista) return;
                contadorPorRol[integrante.rol] = (contadorPorRol[integrante.rol] || 0) + 1;
                var numero = contadorPorRol[integrante.rol];
                var li = document.createElement("li");
                li.innerHTML =
                    '<span class="structure-pill">' + numero + "</span>" +
                    '<div class="structure-meta"><strong>' + (integrante.nombre || "") + "</strong></div>" +
                    '<button type="button" class="structure-remove" data-index="' + idx + '" title="Eliminar">&#10005;</button>';
                lista.appendChild(li);
            });

            Object.keys(vacios).forEach(function (rol) {
                var tiene = estructuraTemporal.some(function (item) { return item.rol === rol; });
                if (vacios[rol]) {
                    vacios[rol].style.display = tiene ? "none" : "block";
                }
            });
        }

        function mapearIntegranteBase(item, rolLabel) {
            var nombre = item && (item.nombre_arreglado || item.nombre_integrante || item.nombre1 || item.nombre) || "";
            if (typeof mayusc_each_word === "function") {
                nombre = mayusc_each_word(nombre);
            }
            var spId = "";
            if (item) {
                spId = item.sp_id || item.ID || item.Id || item.id || item.ows_ID || item["ows_ID"] || item.id_registro || item.id_estructura || "";
                if (typeof spId === "string" && spId.indexOf(";#") > -1) {
                    spId = spId.split(";#").pop();
                }
            }
            return {
                nombre: nombre,
                cargo: item && (item.cargo || "") || "",
                area: item && (item.area || item.centroCosto || "") || "",
                usuario: item && (item.usuario || "") || "",
                codigo: item && (item.id_participante || item.id_principal || "") || "",
                rol: rolLabel,
                suplente: item && (item.es_suplente || "0") || "0",
                spId: spId
            };
        }

        function cargarEstructuraInicial(dominio) {
            limpiarEstructuraTemporal();
            if (!dominio) return;
            (dominio.lider || []).forEach(function (item) {
                estructuraTemporal.push(mapearIntegranteBase(item, "Lider de Dominio"));
            });
            (dominio.custodios || []).forEach(function (item) {
                estructuraTemporal.push(mapearIntegranteBase(item, "Custodio de Datos"));
            });
            (dominio.seguridad || []).forEach(function (item) {
                estructuraTemporal.push(mapearIntegranteBase(item, "Oficial de Seguridad de la Informacion"));
            });
            (dominio.administradores || []).forEach(function (item) {
                estructuraTemporal.push(mapearIntegranteBase(item, "Administradores de Dominio"));
            });
            renderEstructuraTemporal();
        }

        function guardarIntegranteDominio(participante) {
            return new Promise(function (resolve, reject) {
                if (!datosDominio.id) {
                    reject(new Error("No se especific� el dominio."));
                    return;
                }
                $().SPServices({
                    operation: "UpdateListItems",
                    async: true,
                    batchCmd: "New",
                    listName: "Z_ESTRUCTURA_DOMINIO",
                    valuepairs: [
                        ["id_dominio", datosDominio.id],
                        ["descripcion_dominio", datosDominio.nombre || ""],
                        ["nombre_integrante", participante.nombre],
                        ["nombre_arreglado", participante.nombre],
                        ["cargo", participante.cargo || ""],
                        ["area", participante.area || ""],
                        ["txt_desc_roles_gobierno", participante.rol],
                        ["usuario", participante.usuario || ""],
                        ["es_suplente", participante.suplente || "0"],
                        ["agencia", participante.agencia || ""],
                        ["region", participante.region || ""],
                        ["id_subdominio", ""],
                        ["txt_desc_subdominio", ""],
                        ["id_participante", participante.codigo || ""],
                        ["id_roles_gobierno", ""],
                        ["id_principal", participante.codigo || ""],
                        ["nombre_principal", participante.nombre]
                    ],
                    completefunc: function (xData, Status) {
                        if (Status === "success") {
                            var nuevoId = $(xData.responseXML).find("z\\:row").attr("ows_ID") || "";
                            resolve(nuevoId);
                        } else {
                            reject(new Error("SPServices devolvi� estado " + Status));
                        }
                    }
                });
            });
        }

        function eliminarIntegranteDominio(idRegistro) {
            return new Promise(function (resolve, reject) {
                $().SPServices({
                    operation: "UpdateListItems",
                    async: true,
                    batchCmd: "Delete",
                    listName: "Z_ESTRUCTURA_DOMINIO",
                    valuepairs: [["ID", idRegistro]],
                    completefunc: function (xData, Status) {
                        if (Status === "success") {
                            resolve();
                        } else {
                            reject(new Error("No se pudo eliminar el registro"));
                        }
                    }
                });
            });
        }

        async function agregarIntegranteEstructura() {
            var inputEmpleado = document.getElementById("estructuraAsignarEmpleado");
            var rolSelect = document.getElementById("estructuraAsignarRol");
            var codigoInput = document.getElementById("estructuraAsignarCodigo");
            if (!inputEmpleado || !rolSelect) return;

            var textoEmpleado = (inputEmpleado.value || "").trim();
            var rol = (rolSelect.value || "").trim();
            var usuario = "";
            var codigo = (codigoInput && codigoInput.value) ? codigoInput.value.trim() : "";
            var cargo = "";
            var area = "";
            var agencia = "";
            var region = "";

            if (textoEmpleado && typeof EmpleadoUtils !== "undefined" && typeof EmpleadoUtils.loadEmpleadosOnce === "function") {
                try {
                    var emps = await EmpleadoUtils.loadEmpleadosOnce();
                    var match = emps.find(function (e) {
                        return (String(e.codigo || "") === codigo) ||
                            (e.nombreCompleto || "").toLowerCase() === textoEmpleado.toLowerCase();
                    });
                    if (match) {
                        textoEmpleado = match.nombreCompleto || textoEmpleado;
                        usuario = match.usuario || "";
                        codigo = match.codigo || codigo;
                        cargo = match.cargo || "";
                        area = match.area || match.centroCosto || "";
                        agencia = match.agencia || "";
                        region = match.region || "";
                    }
                } catch (err) {
                    console.warn("No se pudo resolver el colaborador seleccionado", err);
                }
            }

            if (!textoEmpleado || !rol) {
                notificarEstructura("warning", "Completa colaborador y rol antes de agregar.");
                return;
            }

            var nuevo = {
                nombre: textoEmpleado,
                cargo: cargo,
                area: area,
                usuario: usuario,
                codigo: codigo,
                rol: rol,
                suplente: "0",
                agencia: agencia,
                region: region
            };

            try {
                var spId = await guardarIntegranteDominio(nuevo);
                nuevo.spId = spId || "";
                estructuraTemporal.push(nuevo);
                inputEmpleado.value = "";
                if (codigoInput) codigoInput.value = "";
                rolSelect.value = "";
                renderEstructuraTemporal();
                notificarEstructura("success", "Integrante agregado correctamente.");
            } catch (error) {
                console.error("No se pudo agregar el integrante", error);
                notificarEstructura("danger", "No se pudo agregar el integrante. Intentalo nuevamente.");
            }
        }

        function removerIntegranteEstructura(index) {
            if (isNaN(index)) return;
            var participante = estructuraTemporal[index];
            var spId = participante && participante.spId;
            var eliminarLocal = function () {
                estructuraTemporal.splice(index, 1);
                renderEstructuraTemporal();
                integrantePendienteEliminar = null;
                $("#modalEliminarIntegrante").modal("hide");
                notificarEstructura("success", "Integrante eliminado.");
            };
            if (!spId) {
                eliminarLocal();
                return;
            }
            eliminarIntegranteDominio(spId).then(eliminarLocal).catch(function (err) {
                console.error("No se pudo eliminar el integrante", err);
                notificarEstructura("danger", "No se pudo eliminar el integrante.");
            });
        }

        function initEmpleadoTypeaheadEstructura() {
            if (typeof EmpleadoUtils === "undefined" || typeof EmpleadoUtils.attachEmpleadoTypeahead !== "function") {
                console.warn("EmpleadoUtils no esta disponible para el typeahead de estructura");
                return;
            }
            EmpleadoUtils.attachEmpleadoTypeahead("estructuraAsignarEmpleado", "sug_estructuraAsignarEmpleado", "estructuraAsignarCodigo");
        }

        $(document).ready(function () {
            var idDominio = getParams("id_dominio");
            if (!idDominio || typeof getEstructura !== "function") {
                notificarEstructura("warning", "No se ha especificado el dominio a consultar.");
                return;
            }
            datosDominio.id = idDominio;
            var dominio = getEstructura(idDominio) || {};
            datosDominio.nombre = dominio.dominio || "";

            fillBreadcrumbs(idDominio, datosDominio.nombre || "");
            $("#nombre-dominio").text(datosDominio.nombre || "Nombre de Dominio");

            cargarEstructuraInicial(dominio);
            initEmpleadoTypeaheadEstructura();

            var botonAgregarIntegrante = document.getElementById("btnAgregarIntegrante");
            if (botonAgregarIntegrante) {
                botonAgregarIntegrante.addEventListener("click", agregarIntegranteEstructura);
            }

            document.querySelectorAll(".structure-list").forEach(function (lista) {
                lista.addEventListener("click", function (e) {
                    if (e.target && e.target.classList.contains("structure-remove")) {
                        var idx = parseInt(e.target.getAttribute("data-index"), 10);
                        if (isNaN(idx)) return;
                        integrantePendienteEliminar = idx;
                        var integrante = estructuraTemporal[idx];
                        var texto = integrante && integrante.nombre ? integrante.nombre : "";
                        var lbl = document.getElementById("textoIntegranteEliminar");
                        if (lbl) lbl.textContent = texto;
                        $("#modalEliminarIntegrante").modal("show");
                    }
                });
            });

            var btnConfirmarEliminarIntegrante = document.getElementById("btnConfirmarEliminarIntegrante");
            if (btnConfirmarEliminarIntegrante) {
                btnConfirmarEliminarIntegrante.addEventListener("click", function () {
                    if (!isNaN(integrantePendienteEliminar)) {
                        removerIntegranteEstructura(integrantePendienteEliminar);
                    }
                });
            }
        });
    </script>
</body>

</html>

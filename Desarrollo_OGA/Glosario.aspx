<!DOCTYPE html>
<%@ Register Tagprefix="SharePoint" Namespace="Microsoft.SharePoint.WebControls"
    Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
    <html lang="en" xmlns:mso="urn:schemas-microsoft-com:office:office"
        xmlns:msdt="uuid:C2F41010-65B3-11d1-A29F-00AA00C14882">

    <%@ Register Tagprefix="SharePoint" Namespace="Microsoft.SharePoint.WebControls"
        Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>

        <head>
            <meta charset="UTF-8">
            <title>Glosario Empresarial de Datos</title>
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
            <link href="https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/css/select2.min.css" rel="stylesheet" />
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

                .glosario-item-edit .select2-container .select2-selection--multiple,
                .attr-form .select2-container .select2-selection--multiple {
                    height: auto !important;
                    min-height: 38px !important;
                    padding-bottom: 4px;
                }

                /* Permite que el contenedor de las pastillas haga saltos de línea correctamente */
                .glosario-item-edit .select2-container .select2-selection--multiple .select2-selection__rendered,
                .attr-form .select2-container .select2-selection--multiple .select2-selection__rendered {
                    white-space: normal !important;
                    display: inline-block !important;
                    width: 100%;
                }

                /* Ajuste fino para la separación de las pastillas (pills) */
                .glosario-item-edit .select2-container--bootstrap .select2-selection--multiple .select2-selection__choice,
                .attr-form .select2-container--bootstrap .select2-selection--multiple .select2-selection__choice {
                    margin-top: 6px;
                    margin-bottom: 2px;
                }

                .badge.badge-pill.atributo {
                    margin: 0px 10px 0px 0px;
                    font-size: 11px;
                    background: #fff !important;
                    color: #D2006E;
                    border: 1px solid #D2006E;
                    padding: .3em .75em 0.3em .75em;
                }

                .badge.badge-pill.atributo.caracteristica {
                    margin: 0px 10px 0px 0px;
                    font-size: 11px;
                    color: #fff !important;
                    background: #D2006E !important;
                    border: 1px solid #D2006E;
                    padding: .3em .75em 0.3em .75em;
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

                /* Contenedor Grid para el Glosario */
                .glosario-grid {
                    display: grid;
                    grid-template-columns: 1fr;
                    /* 1 columna por defecto (Móviles) */
                    gap: 20px;
                    /* Espaciado uniforme entre tarjetas */
                    align-items: start;
                    /* La altura de la tarjeta se adapta solo a su contenido */
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

                /* Contenedor del menú lateral */
                .sidebar-dominios {
                    width: 100%;
                    /* Ocupa todo el ancho en móviles */
                    background-color: #ffffff;
                    border: 1px solid #f3f3f3;
                    border-radius: 8px;
                    height: 100%;
                    max-height: 80vh;
                    overflow-y: auto;

                    /* 1. Oculto por defecto, sin salirse del borde ni sobreponerse */
                    display: none;
                }

                /* 2. Estado cuando está abierto */
                .sidebar-dominios.open {
                    display: block;
                    animation: aparecer 0.3s ease-in-out;
                    margin-bottom: 20px;
                    /* Separación inferior en móviles */
                }

                /* Ajustes específicos para pantallas grandes (PC) */
                @media (min-width: 768px) {
                    .sidebar-dominios {
                        width: 280px;
                        /* Ancho fijo en PC */
                        flex-shrink: 0;
                        /* Evita que se encoja si el contenido a la derecha es muy grande */
                        max-height: calc(100vh - 150px);
                        /* Ajusta a la altura de la pantalla */
                    }

                    .sidebar-dominios.open {
                        margin-bottom: 0;
                        margin-right: 20px;
                        /* Separación con el glosario a la derecha */
                    }
                }

                /* Estilos internos de la lista */
                .dominio-item {
                    border: none;
                    border-radius: 6px;
                    margin-bottom: 2px;
                    transition: background-color 0.2s;
                    cursor: pointer;
                }

                .dominio-item:hover {
                    background-color: #f8f9fa;
                    color: #d1007e;
                }

                .dominio-text {
                    font-size: 0.85rem;
                    font-weight: 500;
                    color: #4a4a4a;
                    white-space: normal;
                    /* Permite que el texto baje a la siguiente línea si es muy largo */
                    word-break: break-word;
                }

                .dominio-badge {
                    background-color: #160F41;
                    color: #fff;
                    font-weight: 600;
                    font-size: 0.75rem;
                    min-width: 30px;
                    text-align: center;
                }

                #glosarioView .btn {
                    border: none;
                }

                .sidebar-recientes {
                    width: 100%;
                    background-color: #ffffff;
                    border: 1px solid #e3e3e3;
                    border-radius: 8px;
                    height: 100%;
                    max-height: 80vh;
                    overflow-y: auto;
                    display: none;
                }

                .sidebar-recientes.open {
                    display: block;
                    animation: aparecer 0.3s ease-in-out;
                    margin-bottom: 20px;
                }

                @media (min-width: 768px) {
                    .sidebar-recientes {
                        width: auto;
                        flex-shrink: 0;
                        max-height: calc(100vh - 150px);
                    }

                    .sidebar-recientes.open {
                        margin-bottom: 0;
                        margin-left: 0px;
                    }
                }

                /* Estilo interno de las tarjetitas recientes */
                .reciente-item {
                    border: 1px solid #eee;
                    border-radius: 6px;
                    margin-bottom: 8px;
                    padding: 10px;
                    transition: box-shadow 0.2s;
                    background-color: #fafafa;
                }

                .reciente-item:hover {
                    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
                    background-color: #fff;
                }

                .reciente-titulo {
                    font-size: 0.85rem;
                    font-weight: 600;
                    color: #d1007e;
                    margin-bottom: 5px;
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    /* Trunca a 2 líneas si es muy largo */
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                }

                .reciente-meta {
                    font-size: 0.75rem;
                    color: #6c757d;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }

                .reciente-tipo {
                    font-size: 0.7rem;
                    font-weight: bold;
                    padding: 2px 6px;
                    border-radius: 4px;
                    background-color: #e9ecef;
                    color: #495057;
                }

                .card .card-body {
                    padding: 1rem;
                }

                /* Animación de aparición suave */
                @keyframes aparecer {
                    from {
                        opacity: 0;
                        transform: translateY(-10px);
                        /* Pequeño efecto de bajada */
                    }

                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                #app-container.sub-hidden main,
                #app-container.menu-sub-hidden main,
                #app-container.menu-hidden main {
                    margin-left: 150px;
                }

                #app-container.main-hidden main,
                #app-container.menu-hidden main {
                    margin-left: 40px;
                }

                #app-container.menu-main-hidden main {
                    margin-left: 270px;
                }

                #app-container.menu-main-hidden.menu-hidden main {
                    margin-left: 40px;
                }

                @media (max-width: 1439px) {

                    #app-container.sub-hidden main,
                    #app-container.menu-sub-hidden main,
                    #app-container.menu-hidden main {
                        margin-left: 130px;
                    }

                    #app-container.main-hidden main,
                    #app-container.menu-hidden main {
                        margin-left: 20px;
                    }

                    #app-container.menu-main-hidden main {
                        margin-left: 250px;
                    }

                    #app-container.menu-main-hidden.menu-hidden main {
                        margin-left: 20px;
                    }
                }

                @media (max-width: 1199px) {

                    #app-container.sub-hidden main,
                    #app-container.menu-sub-hidden main,
                    #app-container.menu-hidden main {
                        margin-left: 120px;
                    }

                    #app-container.main-hidden main,
                    #app-container.menu-hidden main {
                        margin-left: 20px;
                    }

                    #app-container.menu-main-hidden main {
                        margin-left: 250px;
                    }

                    #app-container.menu-main-hidden.menu-hidden main {
                        margin-left: 20px;
                    }
                }

                #filtro_dominios {
                    margin-right: 10px;
                }
            </style>
            <!--[if gte mso 9]><SharePoint:CTFieldRefs runat=server Prefix="mso:" FieldList="FileLeafRef"><xml>
<mso:CustomDocumentProperties>
<mso:_CopySource msdt:dt="string">http://vamos.bancoguayaquil.com/sitios/informaciongerencial/OGAsuite_Produccion/Produccion/Glosario.aspx</mso:_CopySource>
<mso:Order msdt:dt="string">216400.000000000</mso:Order>
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
                <input placeholder="Buscar...">
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
                                    <span>Glosario Empresarial de Datos</span>
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

                    <div class="d-flex position-relative w-100" id="glosario-layout-container">
                        <div id="glosario_terminos" class="flex-grow-1 px-3 transition-content">
                            <div class="row">
                                <div class="col-12">
                                    <div class="d-flex justify-content-between align-items-center mb-2">
                                        <div>
                                            <h1 class="mb-0">Glosario Empresarial de Datos</h1>
                                        </div>

                                        <div class="search-sm position-relative"
                                            style="flex-grow: 1; min-width: 300px; max-width: 500px;">
                                            <input class="form-control form-control-sm rounded-pill pr-4"
                                                placeholder="Buscar..." id="glosario-search" autocomplete="off"
                                                style="width: 100%;">
                                            <i class="iconsminds-magnifi-glass position-absolute text-semi-muted"
                                                id="glosario-buscar"></i>
                                        </div>
                                    </div>
                                    <div class="mb-2">
                                        <div class="collapse d-md-block">
                                            <div class="d-flex flex-column flex-xl-row justify-content-between align-items-xl-center w-100 gap-3"
                                                style="gap: 15px;">

                                                <div class="d-flex flex-wrap align-items-center gap-2"
                                                    style="gap: 10px; flex-grow: 1;">

                                                    <div class="d-flex align-items-center gap-2" id="glosarioView">
                                                        <button class="btn btn-empty p-1 text-primary" type="button"
                                                            id="glosario-card-view" data-toggle="tooltip"
                                                            data-placement="bottom" title="Vista de tarjeta"
                                                            style="box-shadow: none;">
                                                            <i class="simple-icon-grid" style="font-size: 1.4rem;"></i>
                                                        </button>

                                                        <button class="btn btn-empty p-1 text-semi-muted" type="button"
                                                            id="glosario-list-view" data-toggle="tooltip"
                                                            data-placement="bottom" title="Vista de lista"
                                                            style="box-shadow: none;">
                                                            <i class="simple-icon-list" style="font-size: 1.4rem;"></i>
                                                        </button>
                                                    </div>

                                                    <button id="btn-toggle-dominios"
                                                        class="btn btn-outline-primary btn-sm rounded-pill whitespace-nowrap ml-2">
                                                        <i class="simple-icon-list mr-1"></i> Dominios
                                                    </button>

                                                    <div class="d-flex align-items-center gap-1" style="gap: 5px;">

                                                        <div class="text-semi-muted ml-md-1">
                                                            <span id="glosario-count"
                                                                class="badge badge-primary px-3 py-2"
                                                                style="font-size: 0.8rem; border-radius: 12px;">0
                                                                resultados</span>
                                                        </div>

                                                        <div class="btn-slot" style="width: auto;">
                                                            <div>
                                                                <button
                                                                    class="btn btn-outline-dark btn-sm dropdown-toggle rounded-pill whitespace-nowrap btn-reveal btn-reveal-dropdown"
                                                                    data-toggle="dropdown" aria-haspopup="true"
                                                                    aria-expanded="false" id="dropdown-btn">
                                                                    <svg viewBox="0 0 24 24" width="24" height="24"
                                                                        stroke="currentColor" stroke-width="2"
                                                                        fill="none" stroke-linecap="round"
                                                                        stroke-linejoin="round" class="css-i6dzq1">
                                                                        <polygon
                                                                            points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3">
                                                                        </polygon>
                                                                    </svg>
                                                                    <span class="label">Filtrar Por</span>
                                                                </button>
                                                                <div class="dropdown-menu">
                                                                    <a class="dropdown-item" href="#"
                                                                        onclick="nuevoCriterio('dominio'); return false;">Dominio</a>
                                                                    <a class="dropdown-item" href="#"
                                                                        onclick="nuevoCriterio('caso de uso'); return false;">Caso
                                                                        de uso</a>
                                                                    <a class="dropdown-item" href="#"
                                                                        onclick="nuevoCriterio('todos'); return false;">Todos</a>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div>
                                                            <button class="btn-reveal" title="Limpiar filtros"
                                                                aria-label="Limpiar filtros" onclick="limpiarFiltros()"
                                                                style="display: flex; align-items: center; justify-content: center;">
                                                                <svg xmlns="http://www.w3.org/2000/svg" width="20"
                                                                    height="20" viewBox="0 0 24 24" fill="none"
                                                                    stroke="currentColor" stroke-width="2"
                                                                    stroke-linecap="round" stroke-linejoin="round"
                                                                    class="lucide lucide-brush-cleaning-icon lucide-brush-cleaning">
                                                                    <path d="m16 22-1-4"></path>
                                                                    <path
                                                                        d="M19 14a1 1 0 0 0 1-1v-1a2 2 0 0 0-2-2h-3a1 1 0 0 1-1-1V4a2 2 0 0 0-4 0v5a1 1 0 0 1-1 1H6a2 2 0 0 0-2 2v1a1 1 0 0 0 1 1">
                                                                    </path>
                                                                    <path
                                                                        d="M19 14H5l-1.973 6.767A1 1 0 0 0 4 22h16a1 1 0 0 0 .973-1.233z">
                                                                    </path>
                                                                    <path d="m8 22 1-4"></path>
                                                                </svg>
                                                                <span class="label">Limpiar Filtros</span>
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div class="d-flex flex-wrap align-items-center justify-content-sm-end gap-2 mt-3 mt-xl-0"
                                                    style="gap: 10px;">

                                                    <div id="glosario-add-container" class="btn-slot"
                                                        style="width: auto;">
                                                        <button class="btn-reveal" type="button"
                                                            id="glosario-add-atributo" onclick="addAtributo()">
                                                            <i class="iconsminds-add"
                                                                style="font-size: 1.2rem; -webkit-text-stroke: 1px currentColor;"></i>
                                                            <span class="label" style="font-weight: 500;">Nuevo
                                                                Atributo</span>
                                                        </button>
                                                    </div>

                                                    <div class="btn-group dropdown">
                                                        <button
                                                            class="btn btn-outline btn-sm dropdown-toggle rounded-pill whitespace-nowrap btn-reveal-colors"
                                                            type="button" data-toggle="dropdown" aria-haspopup="true"
                                                            aria-expanded="false" id="segmentar-btn">
                                                            Segmentar Por
                                                        </button>
                                                        <div class="dropdown-menu dropdown-menu-right"
                                                            style="width:260px;">
                                                            <a class="dropdown-item" href="#"
                                                                onclick="segmentar('termino'); return false;">Término</a>
                                                            <a class="dropdown-item" href="#"
                                                                onclick="segmentar('atributo'); return false;">Atributos</a>

                                                            <a class="dropdown-item d-flex align-items-center justify-content-between"
                                                                data-toggle="collapse"
                                                                href="#submenuProteccionDatosPersonales" role="button"
                                                                aria-expanded="false"
                                                                id="ProteccionDatosPersonales-btn">
                                                                Protección Datos Personales <i
                                                                    class="simple-icon-arrow-down"
                                                                    style="font-size: 0.7rem;"></i>
                                                            </a>
                                                            <div class="collapse bg-light"
                                                                id="submenuProteccionDatosPersonales">
                                                                <a class="dropdown-item pl-4 py-1 text-muted" href="#"
                                                                    onclick="segmentar('datos personales'); return false;"
                                                                    style="font-size: 0.85rem;">Datos Personales</a>
                                                                <a class="dropdown-item pl-4 py-1 text-muted" href="#"
                                                                    onclick="segmentar('pdp_datos_identificativos'); return false;"
                                                                    style="font-size: 0.85rem;">Datos
                                                                    Identificativos</a>
                                                                <a class="dropdown-item pl-4 py-1 text-muted" href="#"
                                                                    onclick="segmentar('pdp_datos_caracteristicas'); return false;"
                                                                    style="font-size: 0.85rem;">Datos de caracteristicas
                                                                    personales</a>
                                                                <a class="dropdown-item pl-4 py-1 text-muted" href="#"
                                                                    onclick="segmentar('pdp_datos_circunstancias'); return false;"
                                                                    style="font-size: 0.85rem;">Datos de circunstancias
                                                                    sociales</a>
                                                                <a class="dropdown-item pl-4 py-1 text-muted" href="#"
                                                                    onclick="segmentar('pdp_datos_academicos'); return false;"
                                                                    style="font-size: 0.85rem;">Datos académicos y
                                                                    profesionales</a>
                                                                <a class="dropdown-item pl-4 py-1 text-muted" href="#"
                                                                    onclick="segmentar('pdp_datos_empleo'); return false;"
                                                                    style="font-size: 0.85rem;">Datos de empleo</a>
                                                                <a class="dropdown-item pl-4 py-1 text-muted" href="#"
                                                                    onclick="segmentar('pdp_datos_informacion'); return false;"
                                                                    style="font-size: 0.85rem;">Datos de información
                                                                    comercial</a>
                                                                <a class="dropdown-item pl-4 py-1 text-muted" href="#"
                                                                    onclick="segmentar('pdp_categorias_especiales'); return false;"
                                                                    style="font-size: 0.85rem;">Categorías especiales de
                                                                    datos personales</a>
                                                                <a class="dropdown-item pl-4 py-1 text-muted" href="#"
                                                                    onclick="segmentar('pdp_datos_economicos'); return false;"
                                                                    style="font-size: 0.85rem;">Datos económicos,
                                                                    financieros y de seguros</a>
                                                                <a class="dropdown-item pl-4 py-1 text-muted" href="#"
                                                                    onclick="segmentar('pdp_datos_caracter'); return false;"
                                                                    style="font-size: 0.85rem;">Datos de carácter
                                                                    digital</a>
                                                            </div>

                                                            <div class="dropdown-divider"></div>
                                                            <a class="dropdown-item" href="#"
                                                                onclick="segmentar('Golden Record'); return false;">Golden
                                                                Record</a>
                                                            <a class="dropdown-item" href="#"
                                                                onclick="segmentar('(AR) Atributo de Referencia'); return false;">(AR)
                                                                Atributo de Referencia</a>
                                                            <a class="dropdown-item" href="#"
                                                                onclick="segmentar('(CDE) Elemento clave de datos'); return false;">(CDE)
                                                                Elemento clave de datos</a>
                                                            <a class="dropdown-item" href="#"
                                                                onclick="segmentar('todos'); return false;">Todos</a>
                                                        </div>
                                                    </div>

                                                    <button id="btn-toggle-recientes"
                                                        class="btn btn-outline-primary btn-sm rounded-pill whitespace-nowrap ml-2">
                                                        <i class="simple-icon-list mr-1"></i> Recientes
                                                    </button>


                                                </div>

                                            </div>
                                        </div>
                                    </div>
                                    <div class="separator mb-5"></div>
                                </div>
                            </div>
                            <div class="row">
                                <div id="sidebar-dominios" class="sidebar-dominios shadow-sm col-3">
                                    <div
                                        class="sidebar-header d-flex justify-content-between align-items-center p-3 border-bottom">
                                        <h5 class="mb-0 font-weight-bold">Dominios</h5>
                                        <button id="btn-close-dominios"
                                            class="btn btn-empty text-semi-muted p-0 d-md-none">
                                            <i class="simple-icon-close" style="font-size: 1.2rem;"></i>
                                        </button>
                                    </div>
                                    <div id="lista-dominios-container" class="sidebar-content p-2">
                                    </div>
                                </div>

                                <div class="col" id="glosario-body">
                                    <div id="resultados">
                                    </div>
                                    <nav class="mt-4 mb-4">
                                        <div class="pagination justify-content-center"></div>
                                    </nav>
                                </div>

                                <div class="col-3" id="wrapper-recientes">
                                    <div id="sidebar-recientes" class="sidebar-recientes shadow-sm">
                                        <div
                                            class="sidebar-header p-3 border-bottom d-flex justify-content-between align-items-center">
                                            <h5 class="mb-0 font-weight-bold">Términos recientes</h5>
                                            <button id="btn-close-recientes"
                                                class="btn btn-empty text-muted p-0 d-md-none">
                                                <i class="simple-icon-close" style="font-size: 1.2rem;"></i>
                                            </button>
                                        </div>
                                        <div id="lista-recientes-container" class="sidebar-content p-2">
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
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
            <div class="modal fade modal-noscroll" id="modalAtributo" role="dialog" aria-hidden="true">
                <div class="modal-dialog" role="document">
                    <div class="modal-content">
                        <div class="modal-header pb-3 pt-3">
                            <h5 class="modal-title" id="exampleModalContentLabel">Agregar Término</h5>
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
                                                t&eacute;rmino</label>
                                            <textarea class="form-control" id="NOMBREA" rows="2"
                                                placeholder="Nombre corto y claro"></textarea>
                                        </div>
                                        <div class="form-group mb-0">
                                            <label for="Descripcion" class="col-form-label"
                                                id="label-descripcion">Descripcin</label>
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
                                            <label for="nombresubcategoria1"
                                                class="col-form-label">Subcategor&iacute;a</label>
                                            <input disabled placeholder="EN REVISI&Oacute;N" type="text"
                                                class="form-control" id="nombresubcategoria1">
                                        </div>
                                    </div>

                                    <div class="attr-card">
                                        <div class="attr-card__header">
                                            <span class="dot dot--green"></span>
                                            <strong>Caracter&iacute;sticas</strong>
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
                                            <strong>Cat&aacute;logos</strong>
                                        </div>
                                        <div class="form-group mb-0">
                                            <label for="catalogos" class="col-form-label">Cat&aacute;logos
                                                Asociados</label>
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
                :root {
                    --modal-width: 900px;
                    --modal-height: 82vh;
                    --accent: #d1006c;
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

                /* Alineación del buscador de glosario */
                #glosario-layout-container .search-sm {
                    position: relative;
                }

                #glosario-layout-container #glosario-search {
                    padding-right: 2rem;
                }

                #glosario-layout-container #glosario-buscar {
                    right: 12px;
                    top: 50%;
                    transform: translateY(-50%);
                    background: transparent;
                    border-radius: 50%;
                    height: 100%;
                    display: flex;
                    align-items: center;
                    cursor: pointer;
                }

                #glosario-layout-container .autocomplete-items {
                    top: calc(100% + 4px);
                    left: 0;
                    right: 0;
                    z-index: 1000;
                }
            </style>

            <script src="js/vendor/jquery-3.3.1.min.js"></script>
            <script src="js/vendor/bootstrap.bundle.min.js"></script>
            <script
                src="https://cdnjs.cloudflare.com/ajax/libs/bootstrap-notify/0.2.0/js/bootstrap-notify.min.js"></script>
            <script src="js/vendor/perfect-scrollbar.min.js"></script>
            <script src="js/dore.script.js"></script>
            <script src="js/scripts.single.theme.js"></script>
            <script src="js/vendor/select2.full.js"></script>
            <script src="js/pagination.min.js"></script>
            <script src="js/jquery.SPServices.v2014-02.min.js"></script>
            <script src="js/AINGINE.js"></script>
            <script src="js/Glosario/api.js"></script>
            <script src="js/Glosario/glosario.js"></script>
            <script src="js/Glosario/glosarioEdit.js"></script>
            <script src="js/CasodeUso/apiService.js"></script>
            <script src="js/CasodeUso/sharepointUtils.js"></script>
            <script src="js/ServiciosApi/ApiHelper.js"></script>
            <script src="js/ServiciosApi/TerminosService.js"></script>
            <script>
                var n = new Date().getTime();
                document.write('<script src="js/suite.js?v=' + n + '"> <' + '/' + 'script>');
            </script>
            <script>
                // Evita que los tooltips no desaparescan
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
                            inputBusqueda.value = terminoToSearch; // Pone la palabra en el input visualmente
                        }
                        let filtrado = searchList(terminoToSearch, 'nombre', window.aux || window.glosario.todos, true);
                        GlosarioApp.printSearchResults(filtrado, { skipUrlFilter: true });
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                    });
                });


                GlosarioApp.init();
                if (typeof setupGlosarioInlineEdition === "function") {
                    GlosarioEdit.setup();
                }
                // Restringir acciones de nuevo y editar solo a OGA
                if (typeof isOGA === "function" && !isOGA()) {
                    $("#glosario-add-container").hide();
                    $("#glosario-edit-container").hide();
                    $("#glosario-add-atributo").attr("disabled", "disabled");
                    $("#nuevoatributo").hide();
                    $("#glosario-actions").hide();
                }

                function limpiarFiltros() {
                    const searchInput = document.getElementById('glosario-search');
                    if (searchInput) searchInput.value = '';

                    const dropdownBtn = document.getElementById('dropdown-btn');
                    if (dropdownBtn) {
                        const spanLabel = dropdownBtn.querySelector('.label');

                        if (spanLabel) {
                            spanLabel.textContent = 'Filtrar Por';
                        } else {
                            dropdownBtn.innerHTML = `
                <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" class="css-i6dzq1">
                    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
                </svg>
                <span class="label">Filtrar Por</span>`;
                        }

                        dropdownBtn.classList.remove('filtro-activo'); // Si usas alguna clase para marcarlo
                    }
                    window.dominio = ''
                    window.currentTerminosSearch = ''

                    if (window.glosario && window.glosario.todos) {
                        GlosarioApp.printSearchResults(window.glosario.todos, { skipUrlFilter: true });
                    }
                    console.log("Filtros limpiados");
                }
            </script>
        </body>

    </html>
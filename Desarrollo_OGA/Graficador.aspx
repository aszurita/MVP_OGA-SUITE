<!DOCTYPE html>
<%@ Register Tagprefix="SharePoint" Namespace="Microsoft.SharePoint.WebControls"
    Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
    <html lang="es" xmlns:mso="urn:schemas-microsoft-com:office:office"
        xmlns:msdt="uuid:C2F41010-65B3-11d1-A29F-00AA00C14882">

    <%@ Register Tagprefix="SharePoint" Namespace="Microsoft.SharePoint.WebControls"
        Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>

        <head>
            <meta charset="UTF-8">
            <title>Graficador - OGA Suite</title>
            <link rel="icon" type="image/png" href="img/OGA_icon.png">
            <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">

            <link rel="stylesheet" href="font/iconsmind-s/css/iconsminds.css" />
            <link rel="stylesheet" href="font/simple-line-icons/css/simple-line-icons.css" />

            <link rel="stylesheet" href="css/vendor/bootstrap.min.css" />
            <link rel="stylesheet" href="css/vendor/bootstrap.rtl.only.min.css" />
            <link rel="stylesheet" href="css/vendor/component-custom-switch.min.css" />
            <link rel="stylesheet" href="css/vendor/perfect-scrollbar.css" />
            <link rel="stylesheet" href="css/main.css" />
            <link rel="stylesheet" href="js/Graficador/graficador.css" />
            <style>
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
                    padding: 0;
                    border-bottom: 1px solid rgba(0, 0, 0, 0.06);
                    margin-bottom: 15px;
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

                .studio-toolbar-minimal .studio-actions .btn-slot {
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
            </style>

            <script>
                var n = new Date().getTime();
                document.write('<link href="css/style.css?v=' + n + '" rel="stylesheet" />');
            </script>

            <style>
                /* Sobreescribe el estilo que viene de style para los popups y tooltips. */
                .popover,
                .tooltip {
                    top: 0px !important;
                }

                @media (max-width: 1439px) {

                    .popover,
                    .tooltip {
                        top: 0px!important;
                    }
                }

                @media (max-width: 1199px) {

                    .popover,
                    .tooltip {
                        top: 0px !important;
                    }
                }

                @media (max-width: 767px) {

                    .popover,
                    .tooltip {
                        top: 0px !important;
                    }
                }
            </style>
            <script>
                (function () {
                    var hoy = new Date();
                    var inicioNavidad = new Date(hoy.getFullYear(), 11, 1);
                    window.usarLogoNavidad = hoy >= inicioNavidad;
                })();
            </script>
        </head>

        <body id="app-container" class="menu-default show-spinner">
            <svg xmlns="http://www.w3.org/2000/svg" style="display:none">
                <symbol id="icon-create" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" fill="none"
                    stroke-linecap="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                    <polyline points="14 2 14 8 20 8"></polyline>
                    <line x1="12" y1="18" x2="12" y2="12"></line>
                    <line x1="9" y1="15" x2="15" y2="15"></line>
                </symbol>
                <symbol id="icon-upload" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" fill="none"
                    stroke-linecap="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                    <polyline points="17 8 12 3 7 8"></polyline>
                    <line x1="12" y1="3" x2="12" y2="15"></line>
                </symbol>
                <symbol id="icon-cancel" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" fill="none"
                    stroke-linecap="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                </symbol>
                <symbol id="icon-check" viewBox="0 0 24 24">
                    <polyline points="5 13 10 18 19 7" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                        stroke-linejoin="round" fill="none"></polyline>
                </symbol>
                <symbol id="icon-camera" viewBox="0 0 24 24">
                    <rect x="3" y="7" width="18" height="12" rx="2" ry="2" stroke="currentColor" stroke-width="2"
                        fill="none"></rect>
                    <circle cx="12" cy="13" r="4" stroke="currentColor" stroke-width="2" fill="none"></circle>
                    <rect x="8.5" y="4" width="7" height="3" stroke="currentColor" stroke-width="2" fill="none"></rect>
                </symbol>
                <symbol id="icon-rotate" viewBox="0 0 24 24">
                    <path d="M20 8a8 8 0 0 0-14-4" stroke="currentColor" stroke-width="2" fill="none"
                        stroke-linecap="round"></path>
                    <polyline points="20 4 20 8 16 8" stroke="currentColor" stroke-width="2" fill="none"
                        stroke-linecap="round" stroke-linejoin="round"></polyline>
                    <path d="M4 16a8 8 0 0 0 14 4" stroke="currentColor" stroke-width="2" fill="none"
                        stroke-linecap="round"></path>
                    <polyline points="4 20 4 16 8 16" stroke="currentColor" stroke-width="2" fill="none"
                        stroke-linecap="round" stroke-linejoin="round"></polyline>
                </symbol>
                <symbol id="icon-square" viewBox="0 0 24 24">
                    <rect x="6.5" y="6.5" width="11" height="11" rx="2" ry="2" stroke="currentColor" stroke-width="2"
                        fill="none"></rect>
                </symbol>
                <symbol id="icon-diamond" viewBox="0 0 24 24">
                    <polygon points="12 4 20 12 12 20 4 12" stroke="currentColor" stroke-width="2" fill="none"
                        stroke-linejoin="round"></polygon>
                </symbol>
                <symbol id="icon-circle" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="7.5" stroke="currentColor" stroke-width="2" fill="none"></circle>
                </symbol>
                <symbol id="icon-database" viewBox="0 0 24 24">
                    <ellipse cx="12" cy="6.5" rx="7" ry="3" stroke="currentColor" stroke-width="2" fill="none">
                    </ellipse>
                    <path d="M5 6.5v8c0 1.7 3.1 3 7 3s7-1.3 7-3v-8" stroke="currentColor" stroke-width="2" fill="none">
                    </path>
                    <path d="M5 10.5c0 1.7 3.1 3 7 3s7-1.3 7-3" stroke="currentColor" stroke-width="2" fill="none">
                    </path>
                </symbol>
                <symbol id="icon-hand" viewBox="0 0 24 24">
                    <path d="M8 13V7a1 1 0 0 1 2 0v4" stroke="currentColor" stroke-width="2" fill="none"
                        stroke-linecap="round"></path>
                    <path d="M12 12V6a1 1 0 0 1 2 0v6" stroke="currentColor" stroke-width="2" fill="none"
                        stroke-linecap="round"></path>
                    <path d="M16 13V8a1 1 0 0 1 2 0v8a4 4 0 0 1-4 4H9a3 3 0 0 1-3-3v-3" stroke="currentColor"
                        stroke-width="2" fill="none" stroke-linecap="round"></path>
                </symbol>
                <symbol id="icon-share" viewBox="0 0 24 24">
                    <circle cx="18" cy="5" r="3" stroke="currentColor" stroke-width="2" fill="none"></circle>
                    <circle cx="6" cy="12" r="3" stroke="currentColor" stroke-width="2" fill="none"></circle>
                    <circle cx="18" cy="19" r="3" stroke="currentColor" stroke-width="2" fill="none"></circle>
                    <path d="M8.4 12.9L15 17.4" stroke="currentColor" stroke-width="2" fill="none"
                        stroke-linecap="round"></path>
                    <path d="M15 6.6L8.4 11.1" stroke="currentColor" stroke-width="2" fill="none"
                        stroke-linecap="round"></path>
                </symbol>
                <symbol id="icon-note" viewBox="0 0 24 24">
                    <path d="M6 4h9l4 4v12a1 1 0 0 1-1 1H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z" stroke="currentColor"
                        stroke-width="2" fill="none"></path>
                    <polyline points="15 4 15 9 20 9" stroke="currentColor" stroke-width="2" fill="none"
                        stroke-linecap="round" stroke-linejoin="round"></polyline>
                </symbol>
                <symbol id="icon-plus" viewBox="0 0 24 24">
                    <line x1="12" y1="6" x2="12" y2="18" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                    </line>
                    <line x1="6" y1="12" x2="18" y2="12" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                    </line>
                </symbol>
                <symbol id="icon-minus" viewBox="0 0 24 24">
                    <line x1="6" y1="12" x2="18" y2="12" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                    </line>
                </symbol>
                <symbol id="icon-fit" viewBox="0 0 24 24">
                    <polyline points="9 5 5 5 5 9" stroke="currentColor" stroke-width="2" fill="none"
                        stroke-linecap="round"></polyline>
                    <polyline points="15 5 19 5 19 9" stroke="currentColor" stroke-width="2" fill="none"
                        stroke-linecap="round"></polyline>
                    <polyline points="5 15 5 19 9 19" stroke="currentColor" stroke-width="2" fill="none"
                        stroke-linecap="round"></polyline>
                    <polyline points="15 19 19 19 19 15" stroke="currentColor" stroke-width="2" fill="none"
                        stroke-linecap="round"></polyline>
                </symbol>
                <symbol id="icon-arrow" viewBox="0 0 24 24">
                    <line x1="5" y1="12" x2="19" y2="12" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                    </line>
                    <polyline points="14 7 19 12 14 17" stroke="currentColor" stroke-width="2" fill="none"
                        stroke-linecap="round" stroke-linejoin="round"></polyline>
                </symbol>
                <symbol id="icon-pen" viewBox="0 0 24 24">
                    <path d="M7 17l-1 4 4-1 9-9-3-3-9 9z" stroke="currentColor" stroke-width="2" fill="none"
                        stroke-linejoin="round"></path>
                    <path d="M14 6l3 3" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round">
                    </path>
                </symbol>
                <symbol id="icon-palette" viewBox="0 0 24 24">
                    <path
                        d="M12 4a8 8 0 0 0 0 16h2.5a1.5 1.5 0 0 0 0-3H13a1 1 0 0 1-1-1c0-1.7 1.3-2 2.8-2H16a4 4 0 0 0 0-8h-1"
                        stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round"></path>
                    <circle cx="8" cy="10" r="1" fill="currentColor"></circle>
                    <circle cx="9.5" cy="6.5" r="1" fill="currentColor"></circle>
                    <circle cx="14.5" cy="6.5" r="1" fill="currentColor"></circle>
                </symbol>
                <symbol id="icon-bold" viewBox="0 0 24 24">
                    <path d="M8 5h6a3 3 0 0 1 0 6H8z" stroke="currentColor" stroke-width="2" fill="none"></path>
                    <path d="M8 11h7a3 3 0 0 1 0 6H8z" stroke="currentColor" stroke-width="2" fill="none"></path>
                </symbol>
                <symbol id="icon-code" viewBox="0 0 24 24">
                    <polyline points="8 5 3 12 8 19" stroke="currentColor" stroke-width="2" fill="none"
                        stroke-linecap="round" stroke-linejoin="round"></polyline>
                    <polyline points="16 5 21 12 16 19" stroke="currentColor" stroke-width="2" fill="none"
                        stroke-linecap="round" stroke-linejoin="round"></polyline>
                    <line x1="12" y1="4" x2="12" y2="20" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                    </line>
                </symbol>
                <symbol id="icon-copy" viewBox="0 0 24 24">
                    <rect x="9" y="9" width="11" height="13" rx="2" ry="2" stroke="currentColor" stroke-width="2"
                        fill="none"></rect>
                    <path d="M5 15V5a2 2 0 0 1 2-2h10" stroke="currentColor" stroke-width="2" fill="none"></path>
                </symbol>
                <symbol id="icon-font" viewBox="0 0 24 24">
                    <line x1="6" y1="6" x2="18" y2="6" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                    </line>
                    <line x1="12" y1="6" x2="12" y2="18" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                    </line>
                </symbol>
                <symbol id="icon-thickness" viewBox="0 0 24 24">
                    <line x1="5" y1="12" x2="19" y2="12" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                    </line>
                    <polyline points="11 7 5 12 11 17" stroke="currentColor" stroke-width="2" fill="none"
                        stroke-linecap="round" stroke-linejoin="round"></polyline>
                    <polyline points="13 7 19 12 13 17" stroke="currentColor" stroke-width="2" fill="none"
                        stroke-linecap="round" stroke-linejoin="round"></polyline>
                </symbol>
                <symbol id="icon-warning" viewBox="0 0 24 24">
                    <path d="M12 4l9 16H3z" stroke="currentColor" stroke-width="2" fill="none" stroke-linejoin="round">
                    </path>
                    <line x1="12" y1="10" x2="12" y2="14" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                    </line>
                    <circle cx="12" cy="17" r="1" fill="currentColor"></circle>
                </symbol>
                <symbol id="icon-trash" viewBox="0 0 24 24">
                    <polyline points="5 7 19 7" stroke="currentColor" stroke-width="2" fill="none"
                        stroke-linecap="round"></polyline>
                    <path d="M10 4h4l1 3H9l1-3z" stroke="currentColor" stroke-width="2" fill="none"></path>
                    <rect x="7" y="7" width="10" height="13" rx="2" ry="2" stroke="currentColor" stroke-width="2"
                        fill="none"></rect>
                    <line x1="10" y1="11" x2="10" y2="17" stroke="currentColor" stroke-width="2"></line>
                    <line x1="14" y1="11" x2="14" y2="17" stroke="currentColor" stroke-width="2"></line>
                </symbol>
                <symbol id="icon-folder" viewBox="0 0 24 24">
                    <path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"
                        stroke="currentColor" stroke-width="2" fill="none"></path>
                </symbol>
                <symbol id="icon-save" viewBox="0 0 24 24">
                    <path d="M5 4h11l3 3v13a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1z" stroke="currentColor"
                        stroke-width="2" fill="none"></path>
                    <rect x="7" y="4" width="8" height="5" stroke="currentColor" stroke-width="2" fill="none"></rect>
                    <rect x="7" y="13" width="10" height="7" stroke="currentColor" stroke-width="2" fill="none"></rect>
                    <line x1="10" y1="16.5" x2="14" y2="16.5" stroke="currentColor" stroke-width="2"
                        stroke-linecap="round"></line>
                </symbol>
            </svg>
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
                            <button class="header-icon btn btn-empty" type="button" id="iconMenuButton"
                                data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
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
                                    <span>Pol&iacute;ticas y Procedimientos</span>
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
                                    <span>Glosario de T&eacute;rminos</span>
                                </a>
                            </li>
                            <li>
                                <a href="IndicadoresGestion.aspx">
                                    <i class="iconsminds-line-chart-1"></i>
                                    <span>Indicadores de Gesti&oacute;n</span>
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

            <main>
                <div class="container-fluid">
                    <div class="oga-proto-root">
                        <div class="main-container main-container--solo">
                            <section class="content-wrapper content-wrapper--solo">
                                <div class="studio-card">
                                    <section id="vistaStudio" class="studio-only">
                                        <div class="studio-toolbar studio-toolbar-minimal">
                                            <div class="studio-title">
                                                <button id="btnToggleCode" class="btn-reveal btn-json-toggle"
                                                    title="Mostrar panel de código" aria-pressed="false">
                                                    <svg class="icon">
                                                        <use href="#icon-code"></use>
                                                    </svg>
                                                    <span class="label">Panel Código</span>
                                                </button>
                                                <div class="flujo-titulo">
                                                    <label for="tituloFlujoActual" class="sr-only">Nombre del
                                                        flujo</label>
                                                    <span class="titulo-prefix">Dise&ntilde;o:</span>
                                                    <div class="titulo-actions">
                                                        <input id="tituloFlujoActual" class="titulo-input" type="text"
                                                            value="Nuevo Flujo" />
                                                        <span id="copyToast" class="copied-toast">Diagrama
                                                            actualizado</span>
                                                        <input id="sqlfileinput" type="file" accept=".sql"
                                                            style="display:none" />
                                                    </div>
                                                </div>
                                                <button id="btnToggleCodePrompt" class="btn-reveal btn-json-toggle"
                                                    title="Generar diagrama desde SQL" aria-pressed="false">
                                                    <svg class="icon">
                                                        <use href="#icon-database"></use>
                                                    </svg>
                                                    <span class="label">Generar diagrama</span>
                                                </button>
                                            </div>
                                            <div class="studio-actions">
                                                <!--
                                        <div class="btn-slot">
                                            <button id="btnDownloadPNG" class="btn-reveal btn-action" title="Exportar flujo como PDF">
                                                <svg class="icon"><use href="#icon-camera"></use></svg>
                                                <span class="label">Exportar PDF</span>
                                            </button>
                                        </div>
                                        -->
                                                <div class="btn-slot">
                                                    <button id="btnShareLink" class="btn-reveal btn-action"
                                                        title="Compartir diagrama">
                                                        <svg class="icon">
                                                            <use href="#icon-share"></use>
                                                        </svg>
                                                        <span class="label">Compartir</span>
                                                    </button>
                                                </div>
                                                <div class="btn-slot">
                                                    <button id="btnLoadDiagram" class="btn-reveal btn-action"
                                                        title="Cargar diagrama">
                                                        <svg class="icon">
                                                            <use href="#icon-folder"></use>
                                                        </svg>
                                                        <span class="label">Cargar</span>
                                                    </button>
                                                </div>
                                                <div class="btn-slot">
                                                    <button id="btnSaveDiagram" class="btn-reveal btn-action"
                                                        title="Guardar diagrama">
                                                        <svg class="icon">
                                                            <use href="#icon-save"></use>
                                                        </svg>
                                                        <span class="label">Guardar</span>
                                                    </button>
                                                </div>
                                                <div class="btn-slot">
                                                    <button id="btnActualizarGrafico" class="btn-reveal btn-render"
                                                        title="Renderizar diagrama">
                                                        <svg class="icon">
                                                            <use href="#icon-rotate"></use>
                                                        </svg>
                                                        <span class="label">Render</span>
                                                    </button>
                                                </div>
                                                <div id="editorStatus" class="studio-status status-ok"
                                                    style="display:none;"></div>
                                            </div>
                                        </div>
                                        <div id="codeErrorBanner" class="code-alert" role="alert">
                                            <svg class="icon">
                                                <use href="#icon-warning"></use>
                                            </svg>
                                            <span>El código Mermaid tiene errores. Revísalo en el editor.</span>
                                        </div>
                                        <div class="studio-container editor-hidden">
                                            <div class="editor-pane" id="editorPane">
                                                <div class="pane-header">CÓDIGO</div>
                                                <textarea id="codigoMermaid" spellcheck="false"
                                                    placeholder="Tu código aquí...">graph TD
    A[Inicio] --> B(Proceso intermedio)
    B --> C([Final])</textarea>
                                            </div>
                                            <div class="gutter" id="resizer"></div>
                                            <div class="preview-pane" id="previewPane">
                                                <div class="pane-header-with-tools">
                                                    <span class="pane-title">DISEÑO VISUAL</span>
                                                    <div class="pane-header-left">
                                                        <div class="canvas-tools-inline">
                                                            <div class="tool-section">
                                                                <button class="canvas-btn"
                                                                    onclick="mermaidEditor.insertar('node')"
                                                                    title="Proceso"><svg class="icon">
                                                                        <use href="#icon-square"></use>
                                                                    </svg></button>
                                                                <button class="canvas-btn"
                                                                    onclick="mermaidEditor.insertar('decision')"
                                                                    title="Decisión"><svg class="icon">
                                                                        <use href="#icon-diamond"></use>
                                                                    </svg></button>
                                                                <button class="canvas-btn"
                                                                    onclick="mermaidEditor.insertar('circle')"
                                                                    title="Inicio/Fin"><svg class="icon">
                                                                        <use href="#icon-circle"></use>
                                                                    </svg></button>
                                                                <button class="canvas-btn"
                                                                    onclick="mermaidEditor.insertar('db')"
                                                                    title="Datos"><svg class="icon">
                                                                        <use href="#icon-database"></use>
                                                                    </svg></button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div class="pane-header-right">
                                                        <div class="canvas-controls-right">
                                                            <button id="btnTogglePan" class="control-btn"
                                                                title="Activar Mano (Arrastrar)">
                                                                <svg class="icon">
                                                                    <use href="#icon-hand"></use>
                                                                </svg>
                                                            </button>
                                                            <button id="btnAddNote" class="control-btn"
                                                                title="Agregar Nota">
                                                                <svg class="icon">
                                                                    <use href="#icon-note"></use>
                                                                </svg>
                                                            </button>
                                                            <div class="control-divider"></div>
                                                            <button id="btnZoomIn" class="control-btn"><svg
                                                                    class="icon">
                                                                    <use href="#icon-plus"></use>
                                                                </svg></button>
                                                            <button id="btnZoomOut" class="control-btn"><svg
                                                                    class="icon">
                                                                    <use href="#icon-minus"></use>
                                                                </svg></button>
                                                            <button id="btnZoomFit" class="control-btn"><svg
                                                                    class="icon">
                                                                    <use href="#icon-fit"></use>
                                                                </svg></button>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div id="contextMenu" class="context-menu">
                                                    <button class="ctx-btn" title="Conectar"
                                                        onclick="mermaidEditor.menuConnect()"><svg class="icon">
                                                            <use href="#icon-arrow"></use>
                                                        </svg></button>
                                                    <button class="ctx-btn" title="Editar"
                                                        onclick="mermaidEditor.openTextModal()"><svg class="icon">
                                                            <use href="#icon-pen"></use>
                                                        </svg></button>
                                                    <button class="ctx-btn" title="Estilo"
                                                        onclick="mermaidEditor.openColorModal()"><svg class="icon">
                                                            <use href="#icon-palette"></use>
                                                        </svg></button>
                                                    <button class="ctx-btn" title="Borde Negrita"
                                                        onclick="mermaidEditor.applyNodeBold()"><svg class="icon">
                                                            <use href="#icon-bold"></use>
                                                        </svg></button>
                                                    <button class="ctx-btn delete" title="Eliminar"
                                                        onclick="mermaidEditor.menuDelete()"><svg class="icon">
                                                            <use href="#icon-trash"></use>
                                                        </svg></button>
                                                </div>
                                                <div class="mermaid-canvas" id="mermaidOutput" style="cursor: default;">
                                                </div>
                                                <div id="loadingOverlay" class="loading-overlay">
                                                    <div class="spinner"></div>
                                                    <div class="loading-text">Procesando diagrama...</div>
                                                </div>
                                            </div>
                                        </div>
                                    </section>
                                </div>
                            </section>
                        </div>

                        <div id="textModal" class="custom-modal-overlay hidden">
                            <div class="custom-modal">
                                <h3>Editar Texto</h3>
                                <input type="text" id="nodeTextInput" placeholder="Nombre..." autocomplete="off">
                                <div class="modal-actions">
                                    <button class="btn-cancel" onclick="mermaidEditor.closeModals()">Cancelar</button>
                                    <button class="btn-save" onclick="mermaidEditor.applyTextEdit()">Guardar</button>
                                </div>
                            </div>
                        </div>

                        <div id="colorModal" class="custom-modal-overlay hidden">
                            <div class="custom-modal">
                                <h3>Estilo</h3>
                                <div class="color-grid">
                                    <div class="color-option" style="background:#ffffff; border:1px solid #ddd;"
                                        onclick="mermaidEditor.applyColor('#ffffff', '#333')"></div>
                                    <div class="color-option" style="background:#ff7675;"
                                        onclick="mermaidEditor.applyColor('#ff7675', '#fff')"></div>
                                    <div class="color-option" style="background:#fab1a0;"
                                        onclick="mermaidEditor.applyColor('#fab1a0', '#333')"></div>
                                    <div class="color-option" style="background:#fdcb6e;"
                                        onclick="mermaidEditor.applyColor('#fdcb6e', '#333')"></div>
                                    <div class="color-option" style="background:#ffeaa7;"
                                        onclick="mermaidEditor.applyColor('#ffeaa7', '#333')"></div>
                                    <div class="color-option" style="background:#55efc4;"
                                        onclick="mermaidEditor.applyColor('#55efc4', '#333')"></div>
                                    <div class="color-option" style="background:#00b894;"
                                        onclick="mermaidEditor.applyColor('#00b894', '#fff')"></div>
                                    <div class="color-option" style="background:#74b9ff;"
                                        onclick="mermaidEditor.applyColor('#74b9ff', '#fff')"></div>
                                    <div class="color-option" style="background:#0984e3;"
                                        onclick="mermaidEditor.applyColor('#0984e3', '#fff')"></div>
                                    <div class="color-option" style="background:#a29bfe;"
                                        onclick="mermaidEditor.applyColor('#a29bfe', '#fff')"></div>
                                    <div class="color-option" style="background:#6c5ce7;"
                                        onclick="mermaidEditor.applyColor('#6c5ce7', '#fff')"></div>
                                    <div class="color-option" style="background:#d10074;"
                                        onclick="mermaidEditor.applyColor('#d10074', '#fff')"></div>
                                </div>
                                <div class="modal-actions"><button class="btn-cancel"
                                        onclick="mermaidEditor.closeModals()">Cerrar</button></div>
                            </div>
                        </div>

                        <div id="sqlGenerationModal" class="custom-modal-overlay hidden">
                            <div class="custom-modal custom-modal--wide">
                                <h3>Generar desde SQL</h3>
                                <textarea id="sqlInputTextarea" class="sql-textarea"
                                    placeholder="Pega tu código SQL aquí o carga un archivo..." spellcheck="false"
                                    autocomplete="off"></textarea>
                                <div class="container-spacebetween">
                                    <div class="btn-slot">
                                        <input type="file" id="sqlFileModalInput" accept=".sql,.txt"
                                            style="display: none;" />
                                        <button id="btnTriggerFile" class="btn-reveal btn-action"
                                            title="Cargar diagrama">
                                            <svg class="icon">
                                                <use href="#icon-folder"></use>
                                            </svg>
                                            <span class="label">Cargar archivo</span>
                                        </button>
                                    </div>
                                    <div class="modal-actions">
                                        <div class="btn-slot">
                                            <button id="sqlModalCancel" class="btn-reveal btn-action"
                                                title="Cargar diagrama">
                                                <svg class="icon">
                                                    <use href="#icon-cancel"></use>
                                                </svg>
                                                <span class="label">Cancelar</span>
                                            </button>
                                        </div>
                                        <div class="btn-slot">
                                            <button id="sqlModalSubmit" class="btn-reveal btn-action"
                                                title="Guardar diagrama">
                                                <svg class="icon">
                                                    <use href="#icon-create"></use>
                                                </svg>
                                                <span class="label">Generar</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div id="saveDiagramModal" class="custom-modal-overlay hidden">
                            <div class="custom-modal custom-modal--wide">
                                <h3>Guardar diagrama</h3>
                                <input id="saveNameInput" type="text" placeholder="Nombre del SP" autocomplete="off">
                                <div class="modal-actions">
                                    <button id="saveDiagramCancel" class="btn-cancel" type="button">Cancelar</button>
                                    <button id="saveDiagramSubmit" class="btn-save" type="button">Guardar</button>
                                </div>
                            </div>
                        </div>

                        <div id="diagramOverwriteModal" class="custom-modal-overlay hidden">
                            <div class="custom-modal custom-modal--wide">
                                <h3>Diagrama existente</h3>
                                <p class="modal-description">
                                    Ya existe un Diagrama llamado <strong id="diagramOverwriteModalName"></strong>.
                                    ¿Deseas sobrescribir el registro anterior?
                                </p>
                                <div class="modal-actions">
                                    <button type="button" class="btn-cancel" id="diagramOverwriteCancelBtn">No</button>
                                    <button type="button" class="btn-save" id="diagramOverwriteConfirmBtn">Sí,
                                        sobrescribir</button>
                                </div>
                            </div>
                        </div>

                        <div id="loadDiagramModal" class="custom-modal-overlay hidden">
                            <div class="custom-modal custom-modal--wide custom-modal--xwide">
                                <h3>Cargar diagrama</h3>
                                <div class="modal-search">
                                    <div class="autocomplete-field">
                                        <input id="loadSearchInput" type="text" placeholder="Buscar por nombre de SP"
                                            autocomplete="off">
                                        <div class="load-results">
                                            <div id="loadResultsStatus" class="load-results-status">Escribe para buscar
                                            </div>
                                            <div id="loadResultsList" class="load-results-list"></div>
                                        </div>
                                    </div>
                                </div>
                                <div class="load-recent">
                                    <div class="load-recent-table">
                                        <table class="table table-sm table-hover">
                                            <thead>
                                                <tr>
                                                    <th>Nombre SP</th>
                                                    <th>Usuario</th>
                                                    <th>Fecha</th>
                                                </tr>
                                            </thead>
                                            <tbody id="loadRecentBody"></tbody>
                                        </table>
                                    </div>
                                </div>
                                <div class="modal-actions">
                                    <div class="btn-slot">
                                        <button id="loadDiagramSubmit" class="btn-reveal btn-action"
                                            title="Guardar diagrama">
                                            <svg class="icon">
                                                <use href="#icon-upload"></use>
                                            </svg>
                                            <span class="label">Cargar</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div id="noteModal" class="custom-modal-overlay hidden">
                            <div class="custom-modal">
                                <h3>Agregar Nota</h3>
                                <textarea id="noteTextInput" placeholder="Escribe tu nota aquí..." rows="4"
                                    style="width:100%; padding:10px; border:1px solid #ddd; border-radius:6px; font-size:14px; resize:vertical; margin-bottom:20px;"></textarea>
                                <div class="modal-actions">
                                    <button class="btn-cancel" onclick="mermaidEditor.closeModals()">Cancelar</button>
                                    <button class="btn-save" onclick="mermaidEditor.applyNote()">Agregar</button>
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

            <script src="js/vendor/jquery-3.3.1.min.js"></script>
            <script src="js/vendor/bootstrap.bundle.min.js"></script>
            <script src="js/vendor/perfect-scrollbar.min.js"></script>
            <script src="js/vendor/mousetrap.min.js"></script>
            <script src="js/dore.script.js"></script>
            <script src="js/scripts.single.theme.js"></script>
            <script src="https://d3js.org/d3.v5.min.js"></script>
            <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/2.1.1/TweenMax.min.js"></script>
            <script src="js/jquery.SPServices.v2014-02.min.js"></script>
            <script>
                var n = new Date().getTime();
                document.write('<script src="js/suite.js?v=' + n + '"> <' + '/' + 'script>');
            </script>
            <script src="js/helper_user.js"></script>
            <script src="js/AINGINE.js"></script>
            <script src="js/Graficador/graficador-api.js"></script>
            <script type="module">
                import mermaid from 'https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.esm.min.mjs';
                window.mermaid = mermaid;
                mermaid.initialize({
                    startOnLoad: false,
                    theme: 'base',
                    securityLevel: 'loose',
                    suppressErrorRendering: true,
                    flowchart: { htmlLabels: true, curve: 'basis' },
                    themeVariables: { primaryColor: '#ffffff', lineColor: '#d10074', mainBkg: '#fff', nodeBorder: '#333' }
                });
            </script>
            <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"
                crossorigin="anonymous"></script>
            <script src="https://cdn.jsdelivr.net/npm/svg2pdf.js/dist/svg2pdf.min.js" crossorigin="anonymous"></script>
            <script src="js/Graficador/mermaid-save.js"></script>
            <script src="js/Graficador/mermaid-load.js"></script>
            <script src="js/Graficador/mermaid-editor.js"></script>
            <script src="js/Graficador/mermaid-generate.js"></script>
            <script></script>
            <script>
                // Registrar visita al cargar la página
                if (typeof registrar_visita === 'function') {
                    registrar_visita('GRAFICADOR');
                } else if (window.UserHelper && typeof window.UserHelper.registrar_visita === 'function') {
                    window.UserHelper.registrar_visita('GRAFICADOR');
                }
            </script>
        </body>

    </html>
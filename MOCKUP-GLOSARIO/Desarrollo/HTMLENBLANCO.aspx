<!DOCTYPE html>
<%@ Register Tagprefix="SharePoint" Namespace="Microsoft.SharePoint.WebControls"
    Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
    <html lang="en" xmlns:mso="urn:schemas-microsoft-com:office:office"
        xmlns:msdt="uuid:C2F41010-65B3-11d1-A29F-00AA00C14882">

    <%@ Register Tagprefix="SharePoint" Namespace="Microsoft.SharePoint.WebControls"
        Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>

        <head>
            <meta charset="UTF-8">
            <title>Casos de Duplicidad</title>
            <link rel="icon" type="image/png" href="img/OGA_icon.png">
            <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">

            <link rel="stylesheet" href="font/iconsmind-s/css/iconsminds.css" />
            <link rel="stylesheet" href="font/simple-line-icons/css/simple-line-icons.css" />

            <link rel="stylesheet" href="css/vendor/bootstrap.min.css" />
            <link rel="stylesheet" href="css/vendor/bootstrap.rtl.only.min.css" />
            <link rel="stylesheet" href="css/vendor/component-custom-switch.min.css" />
            <link rel="stylesheet" href="css/vendor/perfect-scrollbar.css" />
            <link rel="stylesheet" href="css/vendor/dataTables.bootstrap4.min.css" />
            <link rel="stylesheet" href="css/vendor/buttons.bootstrap4.min.css" />
            <link rel="stylesheet" href="css/vendor/dataTables.colResize.css" />
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
                    background: #f8d0e3; /* magenta claro */
                    font-weight: bold;
                    color: #333;
                }
                .tabla-duplicidad .cabecera-cedula td:not(:first-child) {
                    background: #fbe2ef; /* Magenta aún más claro para celdas vací­as */
                }
                .tabla-duplicidad .row-completa td {
                    background: #fff;
                    color: #333;
                }
            </style>



            <link rel="stylesheet" href="css/main.css" />

            <!--[if gte mso 9]><SharePoint:CTFieldRefs runat=server Prefix="mso:" FieldList="FileLeafRef"><xml>
<mso:CustomDocumentProperties>
<mso:_CopySource msdt:dt="string">http://vamos.bancoguayaquil.com/sitios/informaciongerencial/OGAsuite_Produccion/Produccion/Catalogo_Referencias.aspx</mso:_CopySource>
<mso:Order msdt:dt="string">233600.000000000</mso:Order>
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
                            <button class="header-icon btn btn-empty " type="button" id="iconMenuButton"
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
                                    <span>Polí­ticas y Procedimientos</span>
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
                            <h5 class="modal-title" id="detalleModalLabel">Detalle de Catalogo </h5>
                            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <script src="js/vendor/jquery-3.3.1.min.js"></script>
            <script src="js/vendor/bootstrap.bundle.min.js"></script>
            <script src="js/vendor/perfect-scrollbar.min.js"></script>
            <script src="js/vendor/mousetrap.min.js"></script>
            <script src="js/dore.script.js"></script>
            <script src="js/scripts.single.theme.js"></script>
            <script src="https://d3js.org/d3.v5.min.js"></script>
            <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/2.1.1/TweenMax.min.js"></script>
            <script src="js/jquery.SPServices.v2014-02.min.js"></script>
            <script src="js/vendor/datatables.min.js"></script>
            <script src="js/vendor/buttons.dataTables.min.js"></script>
            <script src="js/vendor/jszip.min.js"></script>
            <script src="js/vendor/buttons.html5.min.js"></script>
            <script src="js/vendor/dataTables.Resize.js"></script>
            <script>
                var n = new Date().getTime();
                document.write('<script src="js/suite.js?v=' + n + '"> <' + '/' + 'script>');
            </script>
           
        </body>

    </html>


<!DOCTYPE html>
<%@ Register Tagprefix="SharePoint" Namespace="Microsoft.SharePoint.WebControls" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<html lang="en" xmlns:mso="urn:schemas-microsoft-com:office:office" xmlns:msdt="uuid:C2F41010-65B3-11d1-A29F-00AA00C14882">

<%@ Register Tagprefix="SharePoint" Namespace="Microsoft.SharePoint.WebControls" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<head>
    <meta charset="UTF-8">
    <title>Ficha Tablas Oficiales</title>
    <link rel="icon" type="image/png" href="img/OGA_icon.png">
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">

    <link rel="stylesheet" href="font/iconsmind-s/css/iconsminds.css" />
    <link rel="stylesheet" href="font/simple-line-icons/css/simple-line-icons.css" />

    <link rel="stylesheet" href="css/vendor/bootstrap.min.css" />
    <link rel="stylesheet" href="css/vendor/bootstrap.rtl.only.min.css" />
    <link rel="stylesheet" href="css/vendor/component-custom-switch.min.css" />
    <link rel="stylesheet" href="css/vendor/perfect-scrollbar.css" />
    <link rel="stylesheet" href="css/vendor/dataTables.colResize.css" />
    <link rel="stylesheet" href="css/vendor/select2.min.css" />
    <link rel="stylesheet" href="css/vendor/select2-bootstrap.min.css" />
    <script>
        var n = new Date().getTime();
        document.write('<link href="css/style.css?v='+n+'" rel="stylesheet" />');
    </script>
    <link rel="stylesheet" href="css/main.css" />

<!--[if gte mso 9]><SharePoint:CTFieldRefs runat=server Prefix="mso:" FieldList="FileLeafRef"><xml>
<mso:CustomDocumentProperties>
<mso:_CopySource msdt:dt="string">http://vamos.bancoguayaquil.com/sitios/informaciongerencial/OGAsuite_Produccion/Produccion/Ficha_Atributo.aspx</mso:_CopySource>
<mso:Order msdt:dt="string">224000.000000000</mso:Order>
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
            <img class="logo d-none d-xs-block" src="logos/oga_color.png">
            <img class="logo-mobile d-block d-xs-none" src="logos/OGA_icon.png">
        </a>

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
                <div class="col-12 row" style="padding:18px">
                    <i class="simple-icon-arrow-left-circle m-1 regresar" onclick="history.back()"></i><h2 class="ml-3 mb-2" style="" id="Dominioname">Tablas Oficiales</h2>
     <!--                <nav class="breadcrumb-container d-none d-sm-block d-lg-inline-block" aria-label="breadcrumb">
                        <ol class="breadcrumb pt-0" id="secciones-dominio">
                            <li class="breadcrumb-item">
                                <a href="">Estructura</a>
                            </li>
                            <li class="breadcrumb-item filtro-actual">
                                <a href="">Atributos</a>
                            </li>
                            <li class="breadcrumb-item">
                                <a href="">Artefactos</a>
                            </li>
                            <li class="breadcrumb-item">
                                <a href="">Términos</a>
                            </li>
                            <li class="breadcrumb-item">
                                <a href="">Acta de Reunión</a>
                            </li>
                            <li class="breadcrumb-item">
                                <a href="">Documentación</a>
                            </li>
                        </ol>
                    </nav> -->
                </div>
            </div>
            <div class="row pl-3">
                <div class="col-12" >
                    <div class="card">
                        <div class="card-body">
                            <div class="d-flex align-items-center" style="padding-bottom:10px">
                                <h3 id="nombre-dominio" class="d-inline-block font-weight mb-0 pl-1"  > de Dominio</h3>
                                <div id="caracteristicas-badges" class="pb-1">
                                </div>
                            </div>
                            <table id="tablaOficial" class="table" style="border-collapse: separate;">
                                <thead>
                                    <tr>
                                        <th>Plataforma</th>
                                        <th>Servidor</th>
                                        <th>Base</th>
                                        <th>Esquema</th>
                                        <th>Tabla</th>
                                    </tr>
                                </thead>
                                <tbody>
                                </tbody>
                            </table>
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

    <div class="modal fade" id="detalleModal2"  role="dialog" aria-labelledby="detalleModalLabel" aria-hidden="true">    
        <div class="modal-dialog modal-lg" role="document">
          <div class="modal-content">
            <div class="modal-header p-3">
                <h3 class="modal-title" id="detalleModalLabel2"> </h3>
              <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body">
                <div class="alert alert-danger alert-dismissible" id="alertado" style="display: none;justify-content: center;width: 100%;align-items: center;">
                    <strong>Alerta!</strong> No se puede editar si data owner se encuentra vacío!
                </div>
                <div class="card mb-4">
                    <div class="card-body">
                        <h4 class="mb-4" id="mensajeowner">No existe Data Owner asignado a la tabla</h4>
                        <div class="row pt-3 pb-4"style="align-items:center;justify-content:space-around;padding-bottom:20px"> 
                            <h7 class="col-3">Asignar data owner:</h7>
                            <select class='form-control select2-single' data-width="70%" aria-hidden="true" id="dataownerselect">
                                <option label="&nbsp;">&nbsp;</option>
                                
                                
                            </select>
                        </div>
                        

                        <div class="row mt-2" style="display:flex; align-items:center;justify-content: flex-end">
                        
                            
                                
                            
                            
                            
                                <button id="btnowner" type="button" class="btn btn-secondary p-3 float-right" >Guardar</button>
                        </div>
                        
                    </div>
            </div>
      </div>
        </div>
        </div>
    </div>



    <div class="modal fade" id="detalleModal4"  role="dialog" aria-labelledby="detalleModalLabel" aria-hidden="true">    
        <div class="modal-dialog modal-lg" role="document">
          <div class="modal-content">
            <div class="modal-header p-3">
                <h3 class="modal-title" id="detalleModalLabel4"> </h3>
              <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body">
                <div class="alert alert-danger alert-dismissible" id="alertads" style="display: none;justify-content: center;width: 100%;align-items: center;">
                    <strong>Alerta!</strong> No se puede editar si data steward se encuentra vacío!

                </div>
                <div class="card mb-4">
                    <div class="card-body">
                        <h4 class="mb-4" id="mensajesteward">No existe Data Steward asignado a la tabla</h4>
                        <div class="row pt-3 pb-4"style="align-items:center;justify-content:space-around;padding-bottom:20px"> 
                            <h7 class="col-3">Asignar data steward:</h7>
                            <select class='form-control select2-single' data-width="70%" aria-hidden="true" id="dataselect">
                                <option label="&nbsp;">&nbsp;</option>
                                
                                
                            </select>
                        </div>
                        

                        <div class="row mt-2" style="display:flex; align-items:center;justify-content: flex-end">
                        
                            
                                
                            
                            
                           

                                <button id="btnsteward" type="button" class="btn btn-secondary p-3 float-right" >Guardar</button>
                        </div>
                        
                    </div>
            </div>
      </div>
        </div>
        </div>
    </div>


    <div id="detalleModal7"  class="modal fade " tabindex="-1" role="dialog"
                                aria-hidden="true">
                                <div class="modal-dialog" role="document">
                                    <div class="modal-content">
                                        <div class="modal-header p-3">
                                            <h5 class="modal-title" id="detalleDeleteDominio">Dominios </h5>
                                            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                                <span aria-hidden="true">&times;</span>
                                              </button>
                                          </div>
                                        <div class="modal-body ">
                                            <h6 id="modalquestion" class="pt-2 pb-3"></h6>
                                            <div class="row ml-1 pt-2 pb-2" >
                                                <label class=" custom-control custom-checkbox mb-1  ">
                                                    <input type="checkbox" id="checkdominio" class="custom-control-input">
                                                    <span class="custom-control-label">&nbsp;</span>
                                                </label>
                                                    <h6 id="alldominios" class="col-11 pl-1"  style="font-size:15.5px"></h6>
                                            </div>
                                        
                                            
                                            <button type="button" id="btnDeleteDominio" data-dismiss="modal" class="btn btn-primary float-right mt-4 mb-1">Guardar</button>
                                        
                                    </div>
                                </div>
                            </div>
        </div>


    <script src="js/vendor/jquery-3.3.1.min.js"></script>
    <script src="js/vendor/bootstrap.bundle.min.js"></script>
    <script src="js/vendor/perfect-scrollbar.min.js"></script>
    <script src="js/vendor/mousetrap.min.js"></script>
    <script src="js/vendor/Chart.bundle.min.js"></script>
    <script src="js/vendor/chartjs-plugin-datalabels.js"></script>
    
    <script src="js/dore.script.js"></script>


    <script src="js/scripts.single.theme.js"></script>
    <script src="js/jquery.SPServices.v2014-02.min.js"></script>
    <script src="js/vendor/datatables.min.js" ></script>
    <script src="js/vendor/buttons.dataTables.min.js"></script>
    <script src="js/vendor/jszip.min.js"></script>
    <script src="js/vendor/buttons.html5.min.js"></script>
    <script src="js/vendor/dataTables.Resize.js"></script>
    <script src="js/vendor/select2.full.js"></script>
   
    <script>
        var n = new Date().getTime();
        document.write('<script src="js/suite_test.js?v='+n+'"> <'+'/'+'script>');
    </script>
    <script>
        $(document).ready(fichaTablas());
    </script>
</body>

</html>
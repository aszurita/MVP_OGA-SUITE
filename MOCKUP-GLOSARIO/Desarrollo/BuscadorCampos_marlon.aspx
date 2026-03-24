<!DOCTYPE html>
<%@ Register Tagprefix="SharePoint" Namespace="Microsoft.SharePoint.WebControls" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<html lang="en" xmlns:mso="urn:schemas-microsoft-com:office:office" xmlns:msdt="uuid:C2F41010-65B3-11d1-A29F-00AA00C14882">

<%@ Register Tagprefix="SharePoint" Namespace="Microsoft.SharePoint.WebControls" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<head>
    <meta charset="UTF-8">
    <title>Explorador de Metadatos</title>
    <link rel="icon" type="image/png" href="img/OGA_icon.png">
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">

    <link rel="stylesheet" href="font/iconsmind-s/css/iconsminds.css" />
    <link rel="stylesheet" href="font/simple-line-icons/css/simple-line-icons.css" />

    <link rel="stylesheet" href="css/vendor/bootstrap.min.css" />
    <link rel="stylesheet" href="css/vendor/bootstrap.rtl.only.min.css" />
    <link rel="stylesheet" href="css/vendor/select2.min.css" />
    <link rel="stylesheet" href="css/vendor/select2-bootstrap.min.css" />
    <link rel="stylesheet" href="css/vendor/component-custom-switch.min.css" />
    <link rel="stylesheet" href="css/vendor/perfect-scrollbar.css" />

    <link rel="stylesheet" href="css/vendor/dataTables.bootstrap4.min.css" />
    <link rel="stylesheet" href="css/vendor/buttons.bootstrap4.min.css" />
    <link rel="stylesheet" href="css/vendor/dataTables.colResize.css" />

    <script>
        var n = new Date().getTime();
        document.write('<link href="css/style.css?v='+n+'" rel="stylesheet" />');
    </script>
    <link rel="stylesheet" href="css/main.css" />
    <link rel="stylesheet" href="css/pagination.css" />
    <style>
        .loader-dots {
            background-color: "#D2006";
            color: #fff;
            font-weight: bold;
            border-radius: 3px;
            border: 1px;
            display: block;
            text-align: center;
            }
        .loader-dots:after {
            content: '....';
            width: 0;
            position: absolute;
            overflow: hidden;
            animation: loader-dots-animation 2s infinite;
            }
        @keyframes loader-dots-animation {
            0% {
                width: 0em;
            }
            50% {
                width: 1.2em;
            }
            100% {
                width: 0em;
                }
            }
        .datos-cargados {
            background-color: #00b30c;
            color: #fff;
            font-weight: bold;
            border-radius: 3px;
            border: 1px;
            display: block;
            text-align: center;
            }
            .dropdown-menu li {
                position: relative;
                }
                .dropdown-menu .dropdown-submenu {
                display: none;
                position: absolute;
                left: 100%;
                top: -7px;
                }
                .dropdown-menu .dropdown-submenu-left {
                right: 100%;
                left: auto;
                }
                .dropdown-menu > li:hover > .dropdown-submenu {
                display: block;
                }
                .dataTables_wrapper   {
                          font-size: 11.7px;
                }

            .link_subrrayado {
            cursor: pointer;
            }

            .link_subrrayado:hover {
            text-decoration: underline;
            }
        </style>

<!--[if gte mso 9]><SharePoint:CTFieldRefs runat=server Prefix="mso:" FieldList="FileLeafRef"><xml>
<mso:CustomDocumentProperties>
<mso:_CopySource msdt:dt="string">http://vamos.bancoguayaquil.com/sitios/informaciongerencial/OGAsuite_Produccion/Produccion/BuscadorCampos.aspx</mso:_CopySource>
<mso:Order msdt:dt="string">233500.000000000</mso:Order>
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
                                <span>Políticas y Procedimientos</span>
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
                    <div class="">
                        <h1>Explorador de Metadatos</h1>
                        <div class="loader-dots col-2 mb-1" id="status_carga" style="background-color:white;color:#D2006E">Cargando datos, espere</div>
                    </div>
                    <div class="mb-2">
                        <div class="collapse d-md-block" id="displayOptions">
                            <div class="d-block d-md-inline-block" id = "Barrabusqueda" style="width: 100%;">
                                <button class="btn btn-outline-dark btn-xs dropdown-toggle float-md-left"  style="height:30px;"type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" id="dropdown-buscador" >Campo</button>
                                <div class="dropdown-menu" >
                                    <a class="dropdown-item" id="opcionfiltro" >Tabla</a>
                                    <a class="dropdown-item" id="opcionfiltro2" >Atributo</a>
                                </div>
                                <div class="search-sm float-md-left mr-1 mb-1 align-top" style="width:20.6%; display:flex;margin-left:10px">
                                    <input placeholder="Buscar..."  id="campos-search" style="width: 100%;height:30px;" autocomplete="off">
                                    <i class="simple-icon-trash" id="campos-buscar" onclick="borrarFiltrosBuscadorCampos()"> </i>
                                    <div id="preloader_1" style="height:30px;">
                                        <span></span>
                                        <span></span>
                                        <span></span>
                                        <span></span>
                                        <span></span>
                                    </div>
                                </div>
                                
                            
                           
                        </div>
                            
                        </div>
                    </div>
                    <div class="separator mb-3"></div>
                </div>
            </div>

            <div class="row">
                <div class="col-3" id="columna-arbol" style="display: none;">
                    <div class="card">
                        <div class="card-body">
                            <div class="arbol" id="arbol_campos">
                                <ul class="list-unstyled" id="menuTypes" style="display: block;">
                                    <li class="ml-0">
                                        <a href="#" data-toggle="collapse" data-target="#collapseMenuLevel" aria-expanded="true"
                                            aria-controls="collapseMenuLevel" class="rotate-arrow-icon collapsed">
                                            <i class="simple-icon-arrow-down"></i> <span class="d-inline-block">Menu Levels</span>
                                        </a>
                                        <div id="collapseMenuLevel" class="collapse" data-parent="#menuTypes">
                                            <ul class="list-unstyled inner-level-menu">
                                                <li>
                                                    <a href="#">
                                                        <i class="simple-icon-layers"></i> <span class="d-inline-block">Sub
                                                            Level</span>
                                                    </a>
                                                </li>
                                                <li>
                                                    <a href="#" data-toggle="collapse" data-target="#collapseMenuLevel2"
                                                        aria-expanded="true" aria-controls="collapseMenuLevel2"
                                                        class="rotate-arrow-icon collapsed">
                                                        <i class="simple-icon-arrow-down"></i> <span class="d-inline-block">Another
                                                            Level</span>
                                                    </a>
                                                    <div id="collapseMenuLevel2" class="collapse">
                                                        <ul class="list-unstyled inner-level-menu">
                                                            <li>
                                                                <a href="#">
                                                                    <i class="simple-icon-layers"></i> <span class="d-inline-block">Sub
                                                                        Level</span>
                                                                </a>
                                                            </li>
                                                        </ul>
                                                    </div>
                                                </li>
                                            </ul>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-12" id="columna-datatable">
                
                    <table id="campos" class="table">
                        <div class="col-6" id="ownertitle" style="display: none;">
                            
                            <h6 id="ownertext" class="card-title" style="visibility: hidden;" ></h6>
                        </div>
                        
                        <thead>
                            <tr>
                                <th data-column="0" >Campo</th>
                                <th data-column="1">Código</th>
                                <th data-column="2">Atributo</th>
                                <th data-column="3">Definición</th>
                                <th data-column="4">Plataforma</th>
                                <th data-column="5">Servidor</th>
                                <th data-column="6">Base</th>
                                <th data-column="7">Esquema</th>
                                <th data-column="8">Tabla</th>
                                <th data-column="9">Tipo</th>
                                <th data-column="10">Largo</th>
                                <th data-column="11">Permite NULL</th>
                                <th data-column="12">Descripción</th>
                                <th data-column="13">Clasificación</th>
                                <th data-column="14">Avance (%)</th>
                            </tr>
                        </thead>
                        <tbody>
                        </tbody>
                    </table>
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





    <div class="modal fade" id="detalleModal1" tabindex="-1" role="dialog" aria-labelledby="detalleModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-lg" role="document">
            <div class="modal-content">
                <div class="modal-header p-3">
                    <h3 class="modal-title" id="detalleModalLabel1"> </h3>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="alert alert-danger alert-dismissible" id="alertadetalle" style="display: none;justify-content: center;width: 100%;align-items: center;">
                        <strong>Alerta!</strong> No se puede editar si la definición se encuentra vacía!
                    </div>
                    <div class="alert alert-danger alert-dismissible" id="alertano" style="display: none;justify-content: center;width: 100%;align-items: center;">
                        <strong>Alerta!</strong>
                        Ya existe un atributo asignado a este campo!
                    </div>
                    <div class="card mb-4">
                        <div class="card-body">
                            <h4 class="mb-4"  id="definicionCampo">Editar texto:</h4>
                            <div class="" >
                                <div class="input-group" style="width:100%;height:80px">   
                                    <textarea id="detalleCampo" class="form-control" aria-label="With textarea"></textarea>
                                </div>
                                <div class="mt-3" style="display: flex;justify-content: flex-end;">
                                    <button id="btndetalle" type="button"  class="btn btn-secondary p-3 " >Guardar</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    
    
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




        <div class="modal fade" id="detalleModal3"  role="dialog" aria-labelledby="detalleModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-lg" role="document">
              <div class="modal-content">
                <div class="modal-header p-3">
                    <h3 class="modal-title" id="detalleModalLabel3"> </h3>
                  <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>
                <div class="modal-body">
                    <div class="card mb-4">
                        <div class="card-body">
                            <div class="alert alert-danger alert-dismissible" id="alertaatributo" style="display: none;justify-content: center;width: 100%;align-items: center;">
                                <strong>Alerta!</strong> No se puede editar si el atributo se encuentra vacío!
                            </div>
                            <h4 class="mb-4">Seleccione un atributo</h4>
                            <div class="row pb-3 pt-3" style="display:flex; align-items:center;justify-content:center">
                            
                                
                                
                                    <select class="form-control select2-single" data-width="80%" id="atributoselect">
                                        <option label="&nbsp;">&nbsp;</option>

                                        
                                    </select>
                            
                </div>
                <div class="row mt-3" style="display:flex; align-items:center;justify-content: flex-end">

                

                <button type="button"id="btnatributo" class="btn btn-secondary p-3 float-right" >Guardar</button>

            </div>
              </div>
            </div>
          </div>
            </div>
            </div>
        </div>


        <div class="modal fade" id="buscadorowners"  role="dialog" aria-labelledby="detalleModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-lg" role="document">
              <div class="modal-content" id="modalcontentdo">
                <div class="modal-header p-3">
                  <h5 class="modal-title" id="detalleModalLabel">Data Owner / Data Steward </h5>
                  <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>
                
                <div class="modal-body">
                    <div class="alert alert-danger alert-dismissible" id="alerta" style="display: none;justify-content: center;width: 100%;align-items: center;">
                        <strong>Alerta!</strong> El campo que desea eliminar se encuentra vacío.
                    </div>
                    <div class="row" style="justify-content: space-between; align-items:center;padding-bottom:20px;padding-top:5px;padding-left:35px">
                        <div class="row">
                            <button class="btn btn-outline-dark btn-xs dropdown-toggle btnreporte float-md-left mr-2"  style="border-color:#c0c0c0 ;" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" id="dropdown-reporte">Data Owner</button>
                                <div class="dropdown-menu" style="padding: 2px;cursor:pointer">
                                    <a class="dropdown-item" id="opcionreporte" >Data Steward</a>

                                </div>
                        <select class='form-control select2-single' data-width="230px" aria-hidden="true" id="dataownerselect2">
                            <option label="&nbsp;">&nbsp;</option>
                            

                        </select>
                        <i class="iconsminds-magnifi-glass float-right" data-toggle="tooltip" data-placement="bottom" data-original-title="Buscar" id="buscadorDO" style="font-size: 18px;"></i>

                    </div>
                    <i class="simple-icon-people float-right" data-toggle="tooltip" data-placement="bottom" data-original-title="Todos" id="todosowner" style="font-size: 21px;color:gray;margin-right:25px"></i>


                    </div>
                    <div class="separator mb-3"></div>
                 
                    <table id="bOwner" class="table" style="font-size: 11.7px;">
                        <thead>
                            <tr>
                                <th>Data Owner</th>
                                <th>Data Steward</th>
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


          <div id="modalDelete" data-backdrop="false" class="modal fade show" tabindex="-1" role="dialog"
                                aria-hidden="true">
                                <div class="modal-dialog" role="document">
                                    <div class="modal-content">
                                        <div class="modal-header p-3">
                                            <h5 class="modal-title" id="detalleDelete"> </h5>
                                            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                                <span aria-hidden="true">&times;</span>
                                              </button>
                                          </div>
                                        <div class="modal-body">
                                            <h6 id="modalquestion"></h6>
                                            
                                        <div class="modal-footer">
                                            
                                            <button type="button" id="btnDelete" data-dismiss="modal" class="btn btn-primary">Guardar</button>
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


        <div class="modal fade" id="detalleModal5"  role="dialog" aria-labelledby="detalleModalLabel" aria-hidden="true">    
            <div class="modal-dialog modal-lg" role="document">
              <div class="modal-content">
                <div class="modal-header p-3">
                    <h3 class="modal-title" id="detalleModalLabel5"> </h3>
                  <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>
                <div class="modal-body">
                    <div class="alert alert-danger alert-dismissible" id="alertadominio" style="display: none;justify-content: center;width: 100%;align-items: center;">
                        <strong>Alerta!</strong> No se puede editar si no se ha seleccionado un dominio!

                    </div>
                    <div class="card mb-4">
                        <div class="card-body">
                            <h6 class="mb-4" id="etiquetatabla">Etiquetar tabla</h6>
                            <div class="row pt-3 pb-4"style="align-items:center;justify-content:space-around;padding-bottom:20px"> 
                                <h7 class="col-3" >Asignar etiqueta:</h7>
                                <select class="form-control select2-single " style="width: 60%;" id="clasificacionselect">
                                    <option label="&nbsp;">&nbsp;</option>
                                    <option value="OFICIAL">Tabla Oficial</option>
                                    <option value="TRABAJO">Tabla de Trabajo</option>
                                    <option value="DESUSO">En desuso</option>
                                </select>
                            
                            </div>
                            <div id="divClasificacion" style="display: none;" class="mt-3">
                                <h6 class="mb-4" id="mensajedominio">No existen dominios asignados a esta tabla</h6>
                                <div class="row pb-4"style="align-items:center;justify-content:space-around;padding-bottom:20px"> 
                                    <h7 class="col-3">Asignar dominio(s):</h7>
                                    <select class="form-control select2-multiple" multiple="multiple" data-width="60%"  id="dominioselect">
                                        <option label="&nbsp;">&nbsp;</option>
                                    </select>
                                
                                </div>
                            </div>
                           
                            
    
                            <div class="row mt-2" style="display:flex; align-items:center;justify-content: flex-end">
                            
                                    <button id="btndominio" data-dismiss="modal" type="button" class="btn btn-secondary p-3 float-right" >Guardar</button>
                            </div>
                            
                        </div>
                </div>
          </div>
            </div>
            </div>
        </div>

    <div class="modal fade" id="detalleModal8" tabindex="-1" role="dialog" aria-labelledby="detalleModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-lg" role="document">
            <div class="modal-content">
                <div class="modal-header p-3">
                    <h3 class="modal-title" id="detalleModalLabel8"> </h3>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="alert alert-danger alert-dismissible" id="alertadetalletabla" style="display: none;justify-content: center;width: 100%;align-items: center;">
                        <strong>Alerta!</strong> No se puede editar si la definición se encuentra vacía!
                    </div>
                    <div class="card mb-4">
                        <div class="card-body">
                            <h4 class="mb-4"  id="definicionTabla">Editar texto:</h4>
                            <div class="" >
                                <div class="input-group" style="width:100%;height:80px">   
                                    <textarea id="detalleTabla" class="form-control" aria-label="With textarea"></textarea>
                                </div>
                                <div class="mt-3" style="display: flex;justify-content: flex-end;">
                                    <button id="btndetalleTabla" type="button"  class="btn btn-secondary p-3 " >Guardar</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    

    <script src="js/vendor/jquery-3.3.1.min.js"></script>
    <script src="js/vendor/bootstrap.bundle.min.js"></script>

    <script src="js/vendor/perfect-scrollbar.min.js"></script>

    <script src="js/vendor/select2.full.js"></script>
    <script src="js/vendor/datatables.min.js"></script>
    <script src="js/vendor/buttons.dataTables.min.js"></script>
    <script src="js/vendor/jszip.min.js"></script>
    <script src="js/vendor/buttons.html5.min.js"></script>
    <script src="js/vendor/dataTables.Resize.js"></script>
    <script src="js/vendor/mousetrap.min.js"></script>

    <script src="js/dore-plugins/select.from.library.js"></script>
    <script src="js/dore.script.js"></script>
    <script src="js/scripts.single.theme.js"></script>
    <script src="js/pagination.min.js"></script>
    <script src="js/jquery.SPServices.v2014-02.min.js"></script>
    


    <script>
        var n = new Date().getTime();
        document.write('<script src="js/suite_marlon.js?v='+n+'"> <'+'/'+'script>');
    </script>
    <script>
        $(document).ready(buscadorCampos());
        
    </script>



</body>

</html>
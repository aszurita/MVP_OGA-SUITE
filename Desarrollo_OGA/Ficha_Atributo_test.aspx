<!DOCTYPE html>
<%@ Register Tagprefix="SharePoint" Namespace="Microsoft.SharePoint.WebControls" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<html lang="en" xmlns:mso="urn:schemas-microsoft-com:office:office" xmlns:msdt="uuid:C2F41010-65B3-11d1-A29F-00AA00C14882">

<%@ Register Tagprefix="SharePoint" Namespace="Microsoft.SharePoint.WebControls" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<head>
    <meta charset="UTF-8">
    <title>Ficha Atributo</title>
    <link rel="icon" type="image/png" href="img/OGA_icon.png">
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">

    <link rel="stylesheet" href="font/iconsmind-s/css/iconsminds.css" />
    <link rel="stylesheet" href="font/simple-line-icons/css/simple-line-icons.css" />

    <link rel="stylesheet" href="css/vendor/bootstrap.min.css" />
    <link rel="stylesheet" href="css/vendor/bootstrap.rtl.only.min.css" />
    <link rel="stylesheet" href="css/vendor/component-custom-switch.min.css" />
    <link rel="stylesheet" href="css/vendor/perfect-scrollbar.css" />
    <link rel="stylesheet" href="css/vendor/dataTables.colResize.css" />
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
                <div class="col-12" style="padding:18px">
                    <i class="simple-icon-arrow-left-circle m-1 regresar" onclick="history.back()"></i><h1 style="padding-left:5px">Ficha de Atributo</h1>
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
                                <i class="simple-icon-arrow-down simple-icon-arrow-up" onclick="toggleAll()" style="cursor:pointer;color:#D2006E" id="icono-expandir"></i>
                                <h3 id="nombre-atributo" class="d-inline-block font-weight mb-0 pl-1" style="color:#D2006E">Nombre de Atributo</h3>
                                <div id="caracteristicas-badges" class="pb-1">
                                </div>
                            </div>
                            <div id="accordion">
                                <div class="border">
                                    <div id="paint1">
                                        <i class="simple-icon-arrow-down pt-3 pr-2 simple-icon-arrow-up" onclick="toggleArrow(this)" style="cursor:pointer;float: right;" data-toggle="collapse" data-target="#detalle" aria-expanded="false" aria-controls="detalle"></i>
                                        <button style="display:flex;width: 90%;justify-content:flex-start" onclick="expandir(this)" class="btn btn-link collapsed" data-toggle="collapse" data-target="#detalle" aria-expanded="false" aria-controls="detalle">
                                            <p class="mb-0" style="font-size:15px">Detalle</p>
                                        </button>
                                    </div>
                                   
                                    
                                    <div id="detalle" class="collapse">
                                        <div class="p-4">
                                            <p><span class="font-weight-bold">Dominio: </span><span id="dominio">Dominio</span></p>
                                            <p><span class="font-weight-bold">Sub Dominio: </span><span id="subdominio">Dominio</span></p>
                                            <p><span class="font-weight-bold">Sub Categoría: </span><span id="subcategoria">Sub Categoría</span></p>
                                            <p><span class="font-weight-bold">Descripción: </span><span id="observacion">Descripción.</span></p>
                                            <p><span class="font-weight-bold">Tipo de Atributo:</span></p>
                                            <div id="caracteristicas"></div>
                                        </div>
                                    </div>
                                </div>
                                <div class="border">
                                    <div id="paint2">
                                        <i class="simple-icon-arrow-down pt-3 pr-2 simple-icon-arrow-up" onclick="toggleArrow(this)" style="cursor:pointer;float: right;" data-toggle="collapse" data-target="#informaciontecnica" aria-expanded="false" aria-controls="informaciontecnica"></i>
                                        <button style="display:flex;width: 90%;justify-content:flex-start" onclick="expandir(this)" class="btn btn-link collapsed" data-toggle="collapse" data-target="#informaciontecnica" aria-expanded="false" aria-controls="informaciontecnica">
                                            <p class="mb-0" style="font-size:15px">Metadatos y Linaje</p>
                                        </button>
                                    </div>
                                   
                                    <div id="informaciontecnica" class="collapse">
                                        <div class="p-4" >
                                            <table id="tabla" class="table" style="border-collapse: separate;">
                                                <thead>
                                                    <tr>
                                                        <th>Servidor</th>
                                                        <th>Esquema</th>
                                                        <th>Base</th>
                                                        <th>Tabla</th>
                                                        <th>Campo</th>
                                                        <th>Tipo de Dato</th>
                                                        <th>Largo</th>
                                                        <th>Permite Null</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                </tbody>
                                            </table>
                                            
                                                <div id="mostrarerror" class="card  mb-3  mr-2">
                                                
                                                    <div class="card-body">
                                                        <div class="d-flex flex-row pb-2">
                                                            
                                                            <div class=" d-flex flex-grow-1 min-width-zero">
                                                                <div
                                                                    class="m-2 pl-0 align-self-center d-flex flex-column flex-lg-row justify-content-between min-width-zero">
                                                                    <div class="min-width-zero">
                                                                        <p class="mb-0 truncate list-item-heading">Sección No Disponible</p>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                    
                                                        <div class="chat-text-left">
                                                            <p class="mb-0 text-semi-muted">
                                                                Continúa explorando las demás opciones!
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            
                                        </div>

                                      
                                    </div>
                                </div>
                                <div class="border">
                                    <div id="paint3">
                                        <i class="simple-icon-arrow-down pt-3 pr-2 simple-icon-arrow-up" onclick="toggleArrow(this)" style="cursor:pointer;float: right;" data-toggle="collapse" data-target="#origen" aria-expanded="false" aria-controls="origen"></i>
                                        <button style="display:flex;width: 90%;justify-content:flex-start" onclick="expandir(this)" class="btn btn-link collapsed" data-toggle="collapse" data-target="#origen" aria-expanded="false" aria-controls="origen">
                                            <p class="mb-0" style="font-size:15px">Origen Datos de Referencia</p>
                                        </button>
                                    </div>
                                   
                                    <div id="origen" class="collapse">
                                        <div class="p-4">
                                            <table id="catalogoficha" class="table"style="border-collapse: separate;" >
                                                <thead>
                                                    <tr>
                                                        <th>Código</th>
                                                        <th>Nombre</th>
                                                        <th>Descripción</th>
                                                        <th>Plataforma</th>
                                                        <th>Servidor</th>
                                                        <th>Ubicación</th>
                                                        <th>Observación</th>
                                                        <th>Responsable</th>
                                                        <th>Validado</th>                                                   </tr>
                                                </thead>
                                                <tbody>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                                <div class="border">
                                    <div id="paint4">
                                        <i class="simple-icon-arrow-down pt-3 pr-2 simple-icon-arrow-up" onclick="toggleArrow(this)" style="cursor:pointer;float: right;" data-toggle="collapse" data-target="#indicadores" aria-expanded="false" aria-controls="indicadores"></i>
                                        <button style="display:flex;width: 90%;justify-content:flex-start" onclick="expandir(this)" class="btn btn-link collapsed" data-toggle="collapse" data-target="#indicadores" aria-expanded="false" aria-controls="indicadores">
                                            <p class="mb-0" style="font-size:15px">Indicadores de Calidad</p>
                                        </button>
                                    </div>

                                    
                                    <div id="indicadores" class="collapse row"style="align-items: center;justify-content: center;padding:0px" >
                                        

                                        <div class="chart-container" style="display:flex;justify-content: center;width: 20%;">
                                            <canvas id="categoryChart1"></canvas>
                                        </div>
                                        
                                        <div style="display:flex;width:65%;flex-direction:row;flex-wrap:wrap;justify-content: center; ">
                                            <div class="chart-container" style="">
                                                <canvas id="categoryChart2"></canvas>
                                            </div>
                                            <div class="chart-container" style="">
                                                <canvas id="categoryChart3"></canvas>
                                            </div>
                                            <div class="chart-container" style="">
                                                <canvas id="categoryChart4"></canvas>
                                            </div>
                                            <div class="chart-container" style="">
                                                <canvas id="categoryChart5"></canvas>
                                            </div>
                                            <div class="chart-container" style="">
                                                <canvas id="categoryChart6"></canvas>
                                            </div>
                                            <div class="chart-container" style="">
                                                <canvas id="categoryChart7"></canvas>
                                            </div>
                                            <div class="chart-container" style="">
                                                <canvas id="categoryChart8"></canvas>
                                            </div>
                                            <div class="chart-container" style="">
                                                <canvas id="categoryChart9"></canvas>
                                            </div>
                                            <div class="chart-container" style="">
                                                <canvas id="categoryChart10"></canvas>
                                            </div>

                                        </div>
                                       
                                    </div>

                                            

                                        
                                    </div>
                                    <!-- tabla desplegable -->
                                    <div class="p-4" id="tablaf" style="display: none;">
                                        <table id="tablac" class="table">
                                            <thead>
                                                <tr style=>
                                                    <th>Data Element</th>
                                                    <th>Rows Passed</th>
                                                    <th>Rows Failed</th>
                                                    <th>Result</th>
                                                
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

    <div class="modal fade" id="detalleModal" tabindex="-1" role="dialog" aria-labelledby="detalleModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-lg" role="document">
          <div class="modal-content">
            <div class="modal-header p-3">
              <h5 class="modal-title" id="detalleModalLabel">Detalle de Catalogo </h5>
              <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body">
                <p id="descModal"></p>
                <table id="detalletabla" class="table" style="min-width: 700px">
                    <thead>
                        <tr>
                            <th>Código</th>
                            <th>Descripción</th>
                            <th>Codigo Superior</th>
                        </tr>
                    </thead>
                    <tbody>
                    </tbody>
                </table>
                <button type="button" class="btn btn-secondary p-3 float-right" data-dismiss="modal">Cerrar</button>
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
   
    <script>
        var n = new Date().getTime();
        document.write('<script src="js/suite_test.js?v='+n+'"> <'+'/'+'script>');
    </script>
    <script>
        $(document).ready(fichaAtributo());
    </script>
</body>

</html>
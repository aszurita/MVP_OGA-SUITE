<!DOCTYPE html>
<%@ Register Tagprefix="SharePoint" Namespace="Microsoft.SharePoint.WebControls" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<html lang="en" xmlns:mso="urn:schemas-microsoft-com:office:office" xmlns:msdt="uuid:C2F41010-65B3-11d1-A29F-00AA00C14882">

<%@ Register Tagprefix="SharePoint" Namespace="Microsoft.SharePoint.WebControls" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<head>
    <meta charset="UTF-8">
    <title>Administración de Atributos</title>
    <link rel="icon" type="image/png" href="img/OGA_icon.png"><script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
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
    <link rel="stylesheet" href="css/vendor/select2.min.css" />
    <link rel="stylesheet" href="css/vendor/select2-bootstrap.min.css" />
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css">
    <script src="https://cdnjs.cloudflare.com/ajax/libs/bootstrap-notify/0.2.0/js/bootstrap-notify.min.js"></script>
    <link href="https://cdnjs.cloudflare.com/ajax/libs/select2/4.0.13/css/select2.min.css" rel="stylesheet" />
    <script>
        var n = new Date().getTime();
        document.write('<link href="css/style.css?v='+n+'" rel="stylesheet" />');
    </script>
    <script>
        (function () {
            var hoy = new Date();
            var inicioNavidad = new Date(hoy.getFullYear(), 11, 1); // diciembre = 11 (0-based)
            window.usarLogoNavidad = hoy >= inicioNavidad;
        })();
    </script>
    <link rel="stylesheet" href="css/main.css" />
    <style>
        .top-aportes {
            position: absolute !important;
            z-index: 1025;
            top: 0;
            right: 5%;
            transform: translate(-50%, -190px); /* Cambiar para ocultar hacia arriba */
            transition: transform .4s ease-out;
            height: 200px;
        }
        .top-aportes .top-aportes-button {
            position: absolute !important;
            top: 100%; /* Se posiciona justo debajo del contenedor */
            left: 50%;
            background: #fff;
            padding: 7px 13px;
            border-radius: .2rem;
            color: #3a3a3a;
            box-shadow: -2px 0px 10px rgba(0, 0, 0, 0.2); /* Sombra del modal */
            font-size: 20px;
            transform: translateX(-50%);
        }

        .animacion-parpadeo {
            box-shadow: 0 0 5px rgba(255, 0, 0, 0.6), 0 0 10px rgba(255, 0, 0, 0.3);
            animation: parpadeo 1.5s infinite;
        }

        .top-aportes.shown {
            transform: translate(-50%, 0); /* Se despliega hacia abajo */
            transition: transform .4s ease-out;
        }

        .card-datatable{
            position: relative !important;
            overflow: hidden;
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
            width: 100%;
            margin: 0 auto;
        }

        .link_subrrayado {
            cursor: pointer;
        }

        .link_subrrayado:hover {
            text-decoration: underline;
            color: #D2006E !important;
        }

        .btnGuardarRegistro{
        background: none;
        border: none;
        padding: 0;
        cursor: pointer;
        outline: none; 
        font-size: 16px;
        margin-right: 20px;
        transform: translateX(5px);
        }

        .dataTables_length {
            position: absolute;
            bottom: 0;
            right: 0;
        }

        .dataTables_info {
            position: absolute;
            bottom: 0;
            left: 0;
        }
        .dataTables_filter {
            position: absolute;
            top: 0;
            left: 0;
        }
        
        div.dataTables_wrapper div.dataTables_filter input {
        margin-left: 0;
        border: 0.5px solid #696767;
        padding: 6px;
        border-radius: 13px;
        width : 300px;
        height :40px;
        position: relative;
        top: 0;
        left: 0;
        }

        .some-container {
            position: absolute;
            top: 11px;
            right: 27px;
            display: flex;
            align-items: center;
        }
        
        .buttons-excel {
            
        margin-top: -10px;
        color: #808080;
        background-color: white;
        border: none;
        border-radius: 0;
        float: right;
        height: 50px;
        TRANSFORM: translateX(300px);
        }


        svg.bi.bi-filetype-xls.icon-excel-btn.diseño-excel {
        transform: translateY(5px);
        }

        .btn-excel:hover {
        color: inherit; 
        background-color: inherit; 
        border: inherit; 
        }


        .dataTables_paginate .paginate_button {
            height: 38px;
        }
        

        .dataTables_wrapper .dataTables_paginate .paginate_button.next, 
        .dataTables_wrapper .dataTables_paginate .paginate_button.previous{
            height: 38px;
        }
        
        .btn-group.float-md-right.mr-1.mb-1 {
        margin-bottom: 40px;
        }
        .disabled-button {
        opacity: 0.5; /* Reduce la opacidad para que parezca desvanecido */
        pointer-events: none; /* Evita que el botón sea tocable */
        }

        .icon-container {
        height: auto; /* Por defecto, la altura se ajusta automáticamente */
        display: flex; /* Distribuye los í­conos en una fila */
        flex-wrap: wrap; /* Permite que los í­conos se envuelvan si no hay suficiente espacio */
        padding-left: 10px;
        }

        
        .icon-container-alerta {
            height: auto;
            display: flex;
            flex-wrap: wrap;
            padding-left: 10px;
        }

        table.dataTable td {
        word-wrap: break-word;
        white-space: normal;
        overflow: hidden;
        }

        .form-check-input {
        transform: scale(1.5); 
        margin-right: 20px;
        }

        .form-check-label {
        margin-left: 10px; 
        display: inline-block;
        }

        .btn-excel:hover {
        color: inherit; 
        background-color: inherit; 
        border: inherit; 
        }

        i.simple-icon-check.style\= {
        margin-left: -8px;
        }

        icon-excel-btn{
        margin-left: 10px;
        }

        .small-font {
        font-size: 10px;
        line-height: 1.9;
        font-family: Arial, sans-serif;
        margin-left : 20px;
        }

        .form-input-descripcion{
            height: calc(2em + 0.3rem);
        }

        .select2-container--bootstrap .select2-selection--single {
            height: calc(2em + 0.3rem);
        }

        .select2-container .select2-selection--single .select2-selection__rendered {
            transform: translateY(-4px);
        }

        span.input-group-text.btninfo {
        height: 30px;
        transform: translateY(2.5px);
        padding: 8px;
        color: white;
        background: rgb(210, 0, 110);
        border-color : white;
        }

        table.table.dataTable.no-footer {
        width: 100%;
        }

        .dataTables_scrollBody{
            width: 100% !important;
            overflow-x: auto !important; 
        }

        .dataTables_scrollHeadInner{
            width: 100% !important;
            min-width: 100%; 
        }
        
        /* Modificar las celdas del cuerpo de la tabla con el ID */
        #tbl_entidades_pendientes tbody td {
            padding: 2px 0; /* Ajustar el padding para mayor control */
            vertical-align: middle;
        }

        /* Modificar las celdas del encabezado de la tabla con el ID */
        /* #tbl_entidades_pendientes thead th {
            height: 60px; 
            line-height: 60px;
        } */
    </style>
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

            <div class="search-sm float-md-left mr-1 mb-1 align-top" style="width:20.6%; display:flex;margin-left:10px">
                <input placeholder="Buscar..." style="width: 100%;height:30px;">
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

                
            </div>
        </div>
    </nav>

    <div class="menu">
        <div class="main-menu">
            <div class="scroll">
                <ul class="list-unstyled" id="suite-navbar">
                </ul>
            </div>
        </div>
        <div class="sub-menu">
            <div class="scroll">
                <div id="sub-menu-suite">

                </div>
            </div>
        </div>
    </div>

    <main>
        <div class="container-fluid">
            <div class="row pb-2">
                <div class="col-12">
                    <h1>Clasificación de Atributos - Datos Personales</h1>
                </div>
            </div>
            <div class="row">
                <div class="col-12">
                    <div class="card card-datatable">
                        <div class="card-body" >
                                    <!-- <div id="segmentador-container" class="some-container">
                                        
                                        <div class="btn-group float-md-right mr-1 mb-1">                      
                                            <button class="btn btn-segmentar btn-xs dropdown-toggle" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" id="segmentar-tabla-btn"> Segmentar Por Estado
                                            </button>
                                            <div class="dropdown-menu" x-placement="bottom-start" style="position: absolute; will-change: transform; margin-right: 75px; top: 0px; left: 0px; transform: translate3d(0px, 26px, 0px);">
                                            </div> 
                                        </div>
                                    </div> -->
                            <table id="tbl_atributos_pendientes" class="table" >
                                 <thead>
                                        <tr>
                                            <th></th>
                                            <th></th>
                                            <th>Atributo</th>
                                            <th>Descripción de atributo</th>
                                            <th>Clasificación datos personales</th>
                                        </tr>
                                </thead>
                                <tbody>
                                </tbody>
                            </table>
                        </!<div>
                    </!<div>    
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

    <div class="modal fade" id="modalAtributo"  role="dialog"
                                aria-hidden="true">
                                <div class="modal-dialog" role="document">
                                    <div class="modal-content">
                                        <div class="modal-header pb-3 pt-3">
                                            <h5 class="modal-title" id="exampleModalContentLabel">Agregar Atributo</h5>
                                            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                                <span aria-hidden="true">&times;</span>
                                            </button>
                                        </div>
                                        <div class="modal-body">
                                            <form>
                                                <div class="form-row">
                                                    <div class="form-group col-md-6">
                                                        <label for="tipo"
                                                        class="col-form-label">Tipo:</label>
                                                    <select type="text" class="form-control" id="tipo">
                                                        <option value="ATRIBUTO">Atributo</option>
                                                    </select>
                                                    </div>
                                                    <div class="form-group col-md-6">
                                                        <label for="idatributo"
                                                            class="col-form-label">ID:</label>
                                                        <input type="text" class="form-control" id="idatributo">
                                                    </div>
                                                </div>

                                                <div class="form-row">
                                                    <div class="form-group col-md-6">
                                                        <label for="nombrea"
                                                        class="col-form-label">Nombre Atributo:</label>
                                                        <textarea class="form-control" id="NOMBREA"></textarea>
                                                    </div>
                                                    <div class="form-group col-md-6">
                                                        <label for="Descripcion" class="col-form-label">Descripción Atributo:</label>
                                                        <textarea class="form-control" id="Descripcion"></textarea>
                                                    </div>
                                                    
                                                </div>

                                                
                                                <div class="form-row">
                                                    <div class="form-group col-md-6">
                                                        <label for="nombred"
                                                        
                                                            class="col-form-label">Dominio:</label>
                                                        <select data-width="100%"  class="form-control select2-multiple select2-hidden-accessible" multiple="multiple"  aria-hidden="true" type="text"  id="nombred">
                                                            <option label="&nbsp;">&nbsp;</option>
                                                        </select>
                                                    </div>
                                                    <div class="form-group col-md-6">
                                                        <label for="nombresub"
                                                        
                                                            class="col-form-label">Subdominio:</label>
                                                        <select data-width="100%"  type="text"   class="form-control select2-multiple select2-hidden-accessible"  multiple="multiple" aria-hidden="true" type="text"id="nombresub">
                                                            <option label="&nbsp;">&nbsp;</option>
                                                        </select>
                                                    </div>
                                                </div>

                                                <div class="form-row">
                                                    <div class="form-group col-md-6">
                                                        <label for="nombred"
                                                        
                                                            class="col-form-label">Subcategorí­a:</label>
                                                       
                                                            <input disabled placeholder="EN REVISIÓN" type= "text" class="form-control" id="nombresubcategoria1" >
                                                       
                                                            
                                                    </div>
                                                    <div class="form-group col-md-6">
                                                        <label for="nombresub"
                                                        
                                                            class="col-form-label">Tipo de atributo:</label>
                                                        <select data-width="100%"  type="text"   class="form-control select2-multiple select2-hidden-accessible"  multiple="multiple" aria-hidden="true" type="text"id="nombrecaract">
                                                            
                                                            <option label="&nbsp;">&nbsp;</option>
                                                            
                                                            
                                                        </select>
                                                    </div>
                                                </div>


                                                <div class="form-row">
                                                    <div class="form-group col-md-6">
                                                        <label for="nombred"
                                                        
                                                            class="col-form-label">Dato Personal:</label>
                                                        <select  data-width="100%"  class="form-control "  aria-hidden="true" type="text"  id="datopersonal">
                                                            <option label="&nbsp;">&nbsp;</option>
                                                            <option value="1">Si</option>
                                                            <option value="0">No</option>
                                                        </select>
                                                    </div>
                                                    <div class="form-group col-md-6">
                                                        <label for="nombresub"
                                                        
                                                            class="col-form-label">Golden Record:</label>
                                                        <select data-width="100%"  type="text"   class="form-control "   aria-hidden="true" type="text"id="goldenrecord">
                                                            <option label="&nbsp;">&nbsp;</option>
                                                            <option value="1">Si</option>
                                                            <option value="0">No</option>
                                                        </select>
                                                    </div>
                                                </div>


                                   
                                                    
                                                    <div class="form-group ">
                                                        <label for="catalogos"
                                                        class="col-form-label">Catálogos Asociados:</label>
                                                        <select data-width="100%"  class="form-control select2-multiple select2-hidden-accessible" multiple="multiple"  aria-hidden="true" type="text"  id="catalogos">
                                                            <option label="&nbsp;">&nbsp;</option>
                                                        </select>
                                                    </div>
                                                  
                                                   
                                             
                                               
                                            </form>
                                        </div>
                                        <div class="modal-footer">
                                
                                            <button  type="button" id="btnagregaratributo" class="btn btn-primary ">Guardar</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
    <script src="js/vendor/jquery-3.3.1.min.js"></script>
    <script src="js/vendor/select2.full.js"></script>
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
    <script src="js/vendor/bootstrap-notify.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/select2/4.0.13/js/select2.min.js"></script>
    <script src="js/custom-js/xlsx.full.min.js"></script>
    <script src="js/dore-plugins/select.from.library.js"></script>

    <script>
        var n = new Date().getTime();
        document.write('<script src="js/suite.js?v='+n+'"> <'+'/'+'script>');
    </script>
    <script>
        $(document).ready(function() {
            AdministracionAtributos();
        });
    </script>

</body>
</html>


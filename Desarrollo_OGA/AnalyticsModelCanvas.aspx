<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Analytics Model Canvas</title>
    <link rel="icon" type="image/png" href="img/OGA_icon.png" data-icon-default="img/OGA_icon.png" data-icon-navidad="img/OGA_icon_navidad.png">
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

    <link rel="stylesheet" href="https://code.jquery.com/ui/1.12.1/themes/base/jquery-ui.css">

    <script>
        /*var urlParams = new URLSearchParams(window.location.search);
        var amcCode = urlParams.get('amc');
        //si existe el codigo abriras el modal $("#modalFichaAnalyticsModelCanvasReplica").modal("show");

        console.log("no hay codigo de amc", amcCode);
        if(amcCode == null || amcCode == undefined || amcCode == "") {
            FichaAnalyticsModelCanvasReplica()
        }
        console.log("codigo de amc", amcCode);*/


        var n = new Date().getTime();
        document.write('<link href="css/style.css?v='+n+'" rel="stylesheet" />');
    </script>
    <link rel="stylesheet" href="css/main.css" />
    <script>
        (function () {
            var hoy = new Date();
            var inicioNavidad = new Date(hoy.getFullYear(), 11, 1);
            window.usarLogoNavidad = hoy >= inicioNavidad;
        })();
    </script>
    <link rel="stylesheet" href="css/pagination.css" />

    <style>
        #select-reassign + span {
            min-width: 300px !important;
            height: 100% !important;
        }
        #select-permissions + span {
            min-width: 300px !important;
            height: 100% !important;
        }
        .select2-results__options{
            height: 100% !important;
        }

        #modalFichaAnalyticsModelCanvas .select2-results__options{
            font-size: .75rem;
        }
        #modalFichaAnalyticsModelCanvasReplica .select2-results__options{
            font-size: .75rem;
        }

        /* Personalización solo para esta página: botón de seguimiento pegado a la derecha */
        .seguimiento-card.seguimiento-card--amc {
            right: 0;
            top: 50%;
            position: fixed;
            transform: translate(100%,-50%);
            transition: transform .3s ease, box-shadow .3s ease;
            pointer-events: auto;
            z-index: 1100;
        }
        .seguimiento-card--amc .card {
            pointer-events: auto;
            box-shadow: 0 0 18px rgba(0,0,0,0.12);
        }
        .seguimiento-card.seguimiento-card--amc.shown {
            transform: translate(0,-50%);
        }
        .seguimiento-card--amc .seguimiento-card-button {
            position: absolute;
            left: -48px;
            top: 50%;
            transform: translateY(-50%);
            width: 48px;
            height: 48px;
            padding: 0;
            border-radius: 8px;
            background: #fff;
            box-shadow: 0 6px 18px rgba(0,0,0,0.15);
            display: inline-flex;
            align-items: center;
            justify-content: center;
            z-index: 1110;
        }

    </style>
    <style>
      .btn-group-actions {
        gap: 0.5rem;
      }

      .btn-group-actions .btnActions {
        min-width: 140px;
        border-radius: 50px;
        padding: 0.55rem 1.4rem;
        margin: 0 !important;
      }
    </style>

</head>
<body id="app-container" class="menu-default show-spinner" style="padding: 0 !important;">
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
            <img class="logo-mobile d-block d-xs-none" src="logos/OGA_icon.png" data-logo-default="logos/OGA_icon.png" data-logo-navidad="logos/OGA_icon_navidad.png">
        </a>
        <script>
            (function () {
                var usarLogoNavidad = window.usarLogoNavidad === true;
                var logoNavbar = document.getElementById('logo-navbar');
                if (logoNavbar) {
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
                }
                var favicon = document.querySelector('link[rel="icon"]');
                if (favicon) {
                    var iconDefault = favicon.getAttribute('data-icon-default') || favicon.getAttribute('href');
                    var iconNavidad = favicon.getAttribute('data-icon-navidad') || iconDefault;
                    favicon.setAttribute('href', usarLogoNavidad ? iconNavidad : iconDefault);
                }
                var logoMobile = document.querySelector('.logo-mobile');
                if (logoMobile) {
                    var mobileDefault = logoMobile.getAttribute('data-logo-default') || logoMobile.getAttribute('src');
                    var mobileNavidad = logoMobile.getAttribute('data-logo-navidad') || mobileDefault;
                    logoMobile.setAttribute('src', usarLogoNavidad ? mobileNavidad : mobileDefault);
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
    <main style="margin-top: 96px;">
       <div class="d-flex flex-column">
            <div class="flex-grow-1 d-flex align-items-center justify-content-center">
                <div class="w-100">
                    <div class="w-100 h-100" id="amc-wrapper">
                        <div class="w-100 d-flex flex-column justify-content-center">
                            <h4 class="h2 w-100 font-weight-bold text-center">Analytics Model Canvas</h4>
                            
                            <div class="d-flex w-100 align-items-center flex-wrap" style="gap: .75rem;">
                                <div class="d-flex align-items-center" style="gap: 5px; width: 28%;">
                                    <span class="font-weight-bold h6" style="font-size: .75rem;">Proyecto:</span>
                                    <input id="amc-name" value="" class="amc-input form-control mb-2" placeholder="Ingrese un nuevo nombre o nombre de proyecto a buscar" style="font-size: .75rem;"/>
                                    <span onclick='clearAMC()' id='btn-clear-amc' style="visibility: hidden; cursor:pointer;"><i class='simple-icon-trash text-primary'></i></span>
                                </div>
                                <div class="d-flex align-items-center" style="gap: 5px; width: 28%;">
                                    <span class="font-weight-bold h6" style="font-size: .75rem;">Área solicitante:</span>
                                    <select id="amc-area-solicitante" value=""  class="amc-input form-control mb-2" placeholder="Area solicitante" style="font-size: .75rem;  flex: 1;">
                                        <option label="&nbsp;">&nbsp;</option>
                                    </select>
                                </div>
                                <div class="d-flex align-items-center" style="gap: 5px; width: 19%;">
                                    <span class="font-weight-bold h6" style="font-size: .75rem;">Sponsor:</span>
                                    <select id="amc-sponsor" value=""  class="amc-input form-control mb-2" placeholder="Nombre sponsor" style="font-size: .75rem; flex: 1;">
                                        <option label="&nbsp;">&nbsp;</option>
                                    </select>
                                </div>
                                <div class="d-flex align-items-center" style="gap:5px; width: 15%;">
                                    <span class="font-weight-bold h6" style="font-size: .75rem;">Formato:</span>
                                    <select id="amc-formato" value=""  class="amc-input form-control mb-2" placeholder="Formato" style="font-size: .75rem; max-height: fit-content!important;">
                                    </select>
                                </div>
                                <!-- <a href="http://vamos.bancoguayaquil.com/sitios/informaciongerencial/OGA_Suite/Produccion/FichaAnalyticsModelCanvas.aspx" target="_blank" class="btn btn-primary mb-1" style="cursor: pointer; width: 4%;" id="btn-ficha-amc"> -->
                                <a class="btn btn-primary mb-1" style="cursor: pointer; width: 4%;" id="btn-ficha-amc">
                                    <i class="simple-icon-magnifier" style="color: white;"></i>
                                </a>
                            </div>

                        </div>
                        <div class="d-flex container-amc">
                            <div class="d-flex w-100 amc-section " style="height: 65%;">
                                <div class="amc-subsection d-flex flex-column">
                                    <div class="amc-cell" id="amc-decisiones">DECISIONES</div>
                                    <div class="amc-cell" id="amc-predicciones">PREDICCIONES</div>
                                </div>
                                <div class="amc-subsection d-flex flex-column">
                                    <div class="amc-cell" id="amc-tareas-ml">TAREAS</div>
                                    <div class="amc-cell" id="amc-evaluacion-desarrollo">EVALUACIÓN EN DESARROLLO</div>
                                </div>
                                <div class="amc-cell h-100" id="amc-propuesta-valor">PROPUESTA DE VALOR</div>
                                <div class="amc-subsection d-flex flex-column">
                                    <div class="amc-cell" id="amc-fuentes-datos" >FUENTES DE DATOS</div>
                                    <div class="amc-cell" id="amc-caracteristicas-reentrenamiento">CARACTERÍSTICAS PARA EL MODELO</div>
                                </div>
                                <div class="amc-subsection d-flex flex-column">
                                    <div class="amc-cell" id="amc-recoleccion-informacion">RECOLECCIÓN DE INFORMACIÓN</div>
                                    <div class="amc-cell" id="amc-tiempos-responsables">TIEMPOS Y RESPONSABLES</div>
                                </div>
                            </div>
                            <div class="d-flex w-100 amc-section" style="height: 35%;" id="amc-section-2">
                                <div class="amc-cell w-50" id="amc-monitoreo-creacion">MONITOREO DE CREACIÓN DE VALOR</div>
                                <div class="amc-cell w-50" id="amc-evaluacion">EVALUACIÓN EN LÍNEA</div>
                                
                            </div>
                        </div>
                    </div>
                        <div class="d-flex flex-column w-100 align-items-end mt-1">
                            <div>
                                <span class="font-weight-bold h6" style="font-size: .75rem;">Usuario:</span>
                                <span id="amc-user" class="h6" style="font-size: .75rem;">-</span>
                            <span class="font-weight-bold h6" style="font-size: .75rem;">Última modificación:</span>
                            <span id="amc-update-date" class="h6" style="font-size: .75rem;">-</span>
                        </div>
                        <div class="d-flex flex-wrap btn-group-actions" style="gap: 0.5rem;">
                            <button type="submit" class="btnActions px-4 btn btn-primary mt-2" style="width: fit-content;" id="btnGuardarAMC">Guardar cambios</button>
                            <button type="button" class="btnActions px-4 btn btn-outline-danger mt-2" style="width: fit-content;" id="btnEliminarAMC">Eliminar AMC</button>
                            <button type="submit" class="btnActions px-4 btn btn-outline-primary m-2" style="width: fit-content;" id="btnBorrarAMC">Descartar cambios</button>
                            <button type="submit" class="btnActions px-4 btn btn-primary mt-2" style="width: fit-content;" id="btnExportarAMC">Exportar</button>
                        </div>
                    </div>
                    <!-- <button type="submit" class="px-4 float-right btn btn-primary float-right m-2" style="width: fit-content;" id="btnDescargarBMC">Descargar</button> -->

                </div>
                
                <!-- Section for Editing
                <div id="editor" class="w-25" style="display: none;">
                    <h5>Edit Section: <span id="section-edit" style="font-weight: 400 !important;"></span> </h5>
                    <textarea id="cellEditor" rows="5" class="form-control" placeholder="Punto1||Punto2||Punto3||"></textarea>
                    <button class="btn btn-primary mt-2" onclick="saveCell()">Editar</button>
                    <button class="btn btn-outlined-primary mt-2" onclick="saveCell()">Cancelar</button>
                </div> -->
            </div>

       </div>
       
       <div class="seguimiento-card seguimiento-card--amc default-transition" style="opacity: 1;">
        <div class="card h-100 ">
            <div class="card-body ">
               <div class="d-flex flex-column justify-content-center align-items-center">
                <div class="seguimiento-card-content">
                    <div class="flex-grow-1 px-2" id="seguimiento-comentarios" style="overflow: auto; max-height:300px;"></div>
                    <div class="seguimiento-input-wrapper d-flex align-items-center" style="gap:6px;position:relative;" >
                        <!-- <input type="text" placeholder="Escriba su observación" id="seguimiento-input" class="form-control"> -->
                        <textarea placeholder="Escriba su observación" id="seguimiento-input" class="form-control"></textarea>
                        <ul id="suggestions"></ul>
                        <i class="simple-icon-paper-plane bg-primary h-100" id="btn-enviar-observacion"></i>
                    </div>
                    <div class="d-flex justify-content-between">
                        <div class="d-flex align-items-center">
                            <span class="" style="color: #6c757d;" id="seguimiento-conteo">0 Entradas</span>
                            <div type="file" id="btn-adjuntar-documento" class="d-flex align-items-center justify-content-center" style="cursor: pointer;">
                                <i class="simple-icon-paper-clip ml-2 text-primary" style="cursor: pointer;"></i>
                                <span id="name-adjuntar-documento"></span>
                                <input id="input-adjuntar-documento" style="display: none;" type="file" accept=".xlsx,.xls,.pptx,.ppt,.txt,.csv,.pdf,.docx"/>
                            </div>
                        </div>
                        <div class="d-flex align-items-center" style="gap: .25rem;"><i class="iconsminds-close" style="visibility: hidden; cursor:pointer;" id="seguimiento-cancelar-respuesta"></i><span id="seguimiento-comentario-respuesta" style="font-size: 10px;"></span></div>
                    </div>
                </div>
               </div>
            </div>
        </div>
        <a href="#" class="seguimiento-card-button text-primary" data-toggle="tooltip" data-placement="top" title="Seguimiento"> <i class="iconsminds-speach-bubble-dialog"></i> </a>
    </div>

    </main>

     <!-- Modal editar -->
     <!-- <div class="modal fade" id="editarModal" tabindex="-1" role="dialog" aria-labelledby="" > -->
    <div class="modal fade" id="modalEditarCelda" tabindex="-1" role="dialog" aria-labelledby="" >
        <div class="modal-dialog modal-dialog-centered" role="document" style="width: 60vw; max-width: 100%;">
            <div class="modal-content border-0 shadow-lg" style="border-radius: 8px;">
                <div class="modal-header border-0 d-flex flex-column" style="padding: 1rem 1.5rem;">
                    <!-- <h5  class="modal-title font-weight-bold" id="editModalLabel">Editar celda: <span id="section-edit" style="font-weight: 400 !important;"></span></h5> -->
                    <div class="w-100 d-flex align-items-center">
                        <h5  class="modal-title font-weight-bold">Editar celda: <span id="modalEditarCeldaNombre" style="font-weight: 400 !important;"></span></h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close" style="outline: none;">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>

                    <div>
                        <p id="modalEditarCeldaDescripcion" style="white-space:pre-line;"></p>
                    </div>
                </div>
                <div class="modal-body" style="padding:0 1.5rem; font-size: clamp(1rem, 1.5vw, 1.2rem);">
                    <textarea id="modalInputCelda" rows="5" class="form-control" placeholder="Ingrese los textos separados por un salto de línea."></textarea>
                </div>
                
                <div class="modal-footer border-0" style="padding: 1rem 1.5rem;">
                    <!-- <button type="button" class="btn btn-outline-primary" id="btnCancelarEditar" >Cancelar</button> -->
                    <button type="button" class="btn btn-outline-primary" id="btnCancelarEditarCelda" >Cancelar</button>
                    <!-- <button type="button" class="btn btn-primary" id="btnGuardarEditar">Guardar</button> -->
                    <button type="button" class="btn btn-primary" id="btnGuardarEditarCelda">Guardar</button>
                </div>
            </div>
        </div>
    </div>

    <!-- Modal editar -->
    <!-- <div class="modal fade" id="editarElementModal" tabindex="-1" role="dialog" aria-labelledby="" aria-hidden="true"> -->
    <div class="modal fade" id="modalEditarElementoCelda" tabindex="-1" role="dialog" aria-labelledby="" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered" role="document">
            <div class="modal-content border-0 shadow-lg" style="border-radius: 8px;">
                <div class="modal-header border-0" style="padding: 1rem 1.5rem;">
                    <!-- <h5  class="modal-title font-weight-bold" id="editElementModalLabel">Editar elemento de: <span id="section-edit-element" style="font-weight: 400 !important;"></span></h5> -->
                    <h5  class="modal-title font-weight-bold">Editar elemento de: <span id="modalEditarElementoCeldaNombre" style="font-weight: 400 !important;"></span></h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close" style="outline: none;">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body" style="padding: 1.5rem; font-size: clamp(1rem, 1.5vw, 1.2rem);">
                    <!-- <textarea id="cellElementEditor" rows="5" class="form-control" placeholder="Punto1"></textarea> -->
                    <textarea id="modalInputElementoCelda" rows="5" class="form-control" placeholder="Punto1"></textarea>
                </div>
                
                <div class="modal-footer border-0" style="padding: 1rem 1.5rem;">
                    <!-- <button type="button" class="btn btn-outline-primary" id="btnCancelarEditarElemento" >Cancelar</button> -->
                    <button type="button" class="btn btn-outline-primary" id="btnCancelarEditarElemento" >Cancelar</button>
                    <!-- <button type="button" class="btn btn-primary" id="btnGuardarEditarElemento">Guardar</button> -->
                    <button type="button" class="btn btn-primary" id="btnGuardarEditarElemento">Guardar</button>
                </div>
            </div>
        </div>
    </div>

     <!-- Modal de Confirmación -->
     <!-- <div class="modal fade" id="confirmModal" tabindex="-1" role="dialog" aria-labelledby="confirmModalLabel" aria-hidden="true"> -->
    <div class="modal fade" id="modalConfirmar" tabindex="-1" role="dialog" aria-labelledby="confirmModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered" role="document">
            <div class="modal-content border-0 shadow-lg" style="border-radius: 8px;">
                <div class="modal-header border-0" style="padding: 1rem 1.5rem;">
                    <!-- <h5 class="modal-title font-weight-bold" id="confirmModalLabel">¿Descartar cambios del Analytics Model Canvas?</h5> -->
                    <h5 class="modal-title font-weight-bold" id="modalConfirmarLabel">¿Descartar cambios del Analytics Model Canvas?</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close" style="outline: none;">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body" style="padding: 1.5rem; font-size: clamp(1rem, 1.5vw, 1.2rem);">
                    Perderás todos los cambios realizados en este Analytics Model Canvas.
                </div>
                
                <div class="modal-footer border-0" style="padding: 1rem 1.5rem;">
                    <!-- <button type="button" class="btn btn-outline-primary" id="btnKeepEditing">Continuar editando</button> -->
                    <button type="button" id="btnContinuarEditando" class="btn btn-outline-primary" >Continuar editando</button>
                    <!-- <button type="button" id="btnDiscardChanges" class="btn btn-primary">Descartar cambios</button> -->
                    <button type="button" id="btnDescartarCambios" class="btn btn-primary">Descartar cambios</button>
                </div>
            </div>
        </div>
    </div>
    
    <div class="modal fade" id="modalEliminarAMC" tabindex="-1" role="dialog" aria-labelledby="modalEliminarAMCLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered" role="document">
            <div class="modal-content border-0 shadow-lg" style="border-radius: 8px;">
                <div class="modal-header border-0" style="padding: 1rem 1.5rem;">
                    <h5 class="modal-title font-weight-bold" id="modalEliminarAMCLabel">¿Eliminar el Analytics Model Canvas?</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close" style="outline: none;">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body" style="padding: 1.5rem; font-size: clamp(1rem, 1.5vw, 1.2rem);">
                    <p class="mb-0">Se eliminará el Analytics Model Canvas <strong id="modalEliminarAMCName"></strong>. Esta acción no se puede deshacer.</p>
                </div>
                <div class="modal-footer border-0" style="padding: 1rem 1.5rem;">
                    <button type="button" class="btn btn-outline-secondary" data-dismiss="modal" id="btnCancelarEliminarAMC">Cancelar</button>
                    <button type="button" class="btn btn-danger" id="btnConfirmarEliminarAMC">Eliminar</button>
                </div>
            </div>
        </div>
    </div>

    <!-- Modal ficha Analytics Model Canvas -->
    <div class="modal fade" id="modalFichaAnalyticsModelCanvas" tabindex="-1" role="dialog" aria-labelledby="" style="font-size: clamp(1rem, 1.5vw, 1.2rem);">
        <div class="modal-dialog modal-dialog-centered" role="document" style="width: 80vw; max-width: 100%;">
            <div class="modal-content border-0 shadow-lg" style="border-radius: 8px;">
                <div class="modal-header border-0" style="padding: 1rem 1.5rem;">
                    <h5 id="modal-title" class="modal-title font-weight-bold">Ficha Analytics Model Canvas</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close" style="outline: none;">
                        <span>&times;</span>
                    </button>
                </div>
                <div class="modal-body" style="padding: 1.5rem; font-size: clamp(1rem, 1.5vw, 1.2rem);">
                    <div id="section-amc-table" class="row">
                        <div class="col-12" >
                            <div class="card">
                                <div class="card-body">
                                    <div id="segmentador-container" class="some-container">
                                        
                                    </div>
                                    <div style="padding-bottom:10px;display: flex; flex-direction: column;">
                                        <div class="search-sm float-md-left mr-1 mb-1 align-top d-flex align-items-center justify-content-between" style="width:100%; display:flex;margin-left:10px">
                                            <input placeholder="Buscar..."  id="amc-table-search" style="width: 20%;height:30px;" autocomplete="off">
                                            <div class="d-flex top-right-button-container" style="width: max-content; gap: 5px;">
                                                <div class="">
                                                    <button class="btn btn-outline-primary btn-lg dropdown-toggle" type="button"
                                                        data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                                        Exportar
                                                    </button>
                                                    <div class="dropdown-menu">
                                                        <a class="dropdown-item" id="dataTablesCopy" href="#">Copy</a>
                                                        <a class="dropdown-item" id="dataTablesExcel" href="#">Excel</a>
                                                        <a class="dropdown-item" id="dataTablesCsv" href="#">Csv</a>
                                                       
                                                    </div>
                                                </div>
                                            </div>
                                          
                                        </div>
                                    </div>
                                    <table id="amc-table" class="table" style="font-size: clamp(.5rem, .75rem, 1.5rem); min-width: 1600px;">
                                        <thead>
                                            <tr>
                                                <th>Nombre de AMC</th>
                                                <th>Tipo de AMC</th>
                                                <th>Fecha de generación</th>
                                                <th>Usuario creador</th>
                                                <th>Área de usuario creador</th>
                                                <th>Sponsor</th>
                                                <th>Área de sponsor</th>
                                                <th>Comentarios</th>
                                                <th>Estado</th>
                                                <th>Documentos Adjuntos</th>
                                                <th></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div id="section-permissions" class="card" style="display:none; padding: 2rem;">
                        <div class="d-flex"  >
                            <i id="btn-permissions-back" class="iconsminds-left mr-2" style="cursor: pointer; position: absolute;"></i>
                            <h6  class="modal-title font-weight-bold w-100 text-center">Usuarios con permisos</span></h6>
                        </div>
                        <div id="select-permissions-wrapper" class="d-flex justify-content-center">
                            <select id="select-permissions" class="form-control" ></select>
                            <div id="btn-permissions-add" class="ml-2 card d-flex flex-column align-items-center justify-content-center bg-primary" style="height: 38px; aspect-ratio: 1/1; cursor: pointer;">
                                <i class="simple-icon-plus" style="font-size: 1rem;"></i>
                            </div>

                        </div>
                        <div id="permissions-user-list" class="d-flex flex-grow-1 mx-auto mt-4 justify-content-center" style="gap: 2rem; max-width: 700px; flex-wrap: wrap;">
                            <div id="btn-permissions-add" class="card d-flex flex-column align-items-center justify-content-center" style="height: 150px; width: 150px; cursor: pointer;">
                                <i class="simple-icon-plus" style="font-size: 2.5rem;"></i>
                            </div>
                        </div>
                        <div class="w-100 d-flex" style="justify-content: flex-end; gap: .5rem;">
                            <button type="button" id="btn-cancel-permissions" class="btn btn-outline-primary">Cancelar</button>
                            <button type="button" id="btn-save-permissions" class="btn btn-primary" >Guardar</button>
                        </div>
                    </div>
                    <div id="section-reassign" class="card" style="display:none; padding: 2rem;">
                        <div class="d-flex"  >
                            <i id="btn-reassign-back" class="iconsminds-left mr-2" style="cursor: pointer;position: absolute;"></i>
                            <h6  class="modal-title font-weight-bold w-100 text-center">Reasignar Usuario</span></h6>
                        </div>
                        <div class="d-flex flex-column flex-grow-1 mx-auto mt-4 justify-content-center" style="gap: 2rem; max-width: 700px; flex-wrap: wrap;">
                           
                            <div class="d-flex align-items-center" style="font-size: .75rem;">
                                <label class="mr-4 font-weight-bold">Actual:</label>
                                <div class="card d-flex flex-row" style=" gap: 1rem; padding: 1rem;">
                                    <img src="img/Data Science_38.svg" alt="Usuario Actual" style="width: 50px; height: 50px;">
                                    <div class="d-flex flex-column w-100">
                                        <span id="reassign-current-username" class="font-weight-bold"></span>
                                        <span id="reassign-current-name"></span>
                                    </div>
                                </div>
                            </div>
                            <div class="d-flex align-items-center" style="font-size: .75rem;">
                                <label for="" class="mr-4 font-weight-bold">Nuevo:</label>
                                <select id="select-reassign" class="form-control" style="min-width: 300px;"></select>
                            </div>


                           
                        </div>

                        <div class="w-100 d-flex" style="justify-content: flex-end; gap: .5rem;">
                            <button type="button" id="btn-cancel-reassign" class="btn btn-outline-primary">Cancelar</button>
                            <button type="button" id="btn-save-reassign" class="btn btn-primary" >Reasignar</button>
                        </div>
                    </div>

                    <div id="section-documentos-adjuntos" class="" style="display: none; padding: 2rem;">
                        
                        <div class="col-12" >
                            <div class="card">
                                <div class="card-body">
                                    <div id="segmentador-container" class="some-container">
                                        <!-- Aquí se agregará el segmentador -->
                                    </div>
                                    <div style="padding-bottom:10px;display: flex; flex-direction: column;">
                                        <div class="d-flex justify-content-center w-100 align-items-center" style="position: relative;" >
                                            <i id="btn-reassign-back" class="iconsminds-left float-left" style="cursor: pointer;"></i>
                                            <h6  class="modal-title font-weight-bold w-100 text-center">Reasignar Usuario</span></h6>
                                        </div>
                                        <div class="search-sm float-md-left mr-1 mb-1 align-top d-flex align-items-center justify-content-between" style="width:100%; display:flex;margin-left:10px">
                                            <input placeholder="Buscar..."  id="documents-table-search" style="width: 20%;height:30px;" autocomplete="off">
                                            <div class="top-right-button-container" style="width: max-content;">
                                                <!-- <div class="">
                                                    <button class="btn btn-outline-primary btn-lg dropdown-toggle" type="button"
                                                        data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                                        Exportar
                                                    </button>
                                                    <div class="dropdown-menu">
                                                        <a class="dropdown-item" id="dataTablesCopy" href="#">Copy</a>
                                                        <a class="dropdown-item" id="dataTablesExcel" href="#">Excel</a>
                                                        <a class="dropdown-item" id="dataTablesCsv" href="#">Csv</a>
                                                    </div>
                                                </div> -->
                                            </div>
                                            <!-- <i class="simple-icon-trash btn-primary" style="padding: .5rem 1rem; margin-left: 3px; cursor: pointer; border-radius: 20px;" id="btn_tablas_oficiales-trash-icon" onclick="borrarBusquedaFichaTablas()"> </i>  -->
                                        </div>
                                    </div>
                                    <table id="documents-table" class="table" style="font-size: clamp(.5rem, .75rem, 1.5rem);">
                                        <thead>
                                            <tr>
                                                <th style="display:none;">AMC ID</th>
                                                <th>Nombre</th>
                                                <th>Analytics Model Canvas</th>
                                                <th>Usuario</th>
                                                <th>Fecha de subida</th>
                                                <th>Descargar</th>
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
                
                <div class="modal-footer border-0" style="padding: 1rem 1.5rem;">
                   <!--  -->
                </div>
            </div>
        </div>
    </div>
    

    <!-- Modal ficha documentos adjuntos -->
    <!-- <div class="modal fade" id="modalDocumentosAdjuntos" tabindex="-1" role="dialog" aria-labelledby="" style="font-size: clamp(1rem, 1.5vw, 1.2rem);">
        <div class="modal-dialog modal-dialog-centered" role="document" style="width: 80vw; max-width: 100%;">
            <div class="modal-content border-0 shadow-lg" style="border-radius: 8px;">
                <div class="modal-header border-0" style="padding: 1rem 1.5rem;">
                    <h5  class="modal-title font-weight-bold">Documentos Adjuntos</span></h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close" style="outline: none;">
                        <span>&times;</span>
                    </button>
                </div>
                <div class="modal-body" style="padding: 1.5rem; font-size: clamp(1rem, 1.5vw, 1.2rem);">
                    <div class="row">
                        <div class="col-12" >
                            <div class="card">
                                <div class="card-body">
                                    <div id="segmentador-container" class="some-container">
                                    </div>
                                    <div style="padding-bottom:10px;display: flex; flex-direction: column;">
                                        <div class="search-sm float-md-left mr-1 mb-1 align-top d-flex align-items-center justify-content-between" style="width:100%; display:flex;margin-left:10px">
                                            <input placeholder="Buscar..."  id="documents-table-search" style="width: 20%;height:30px;" autocomplete="off">
                                            <div class="top-right-button-container" style="width: max-content;">
                                              
                                            </div>
                                        </div>
                                    </div>
                                    <table id="documents-table" class="table" style="font-size: clamp(.5rem, .75rem, 1.5rem);">
                                        <thead>
                                            <tr>
                                                <th style="display:none;">AMC ID</th>
                                                <th>Nombre</th>
                                                <th>Analytics Model Canvas</th>
                                                <th>Usuario</th>
                                                <th>Fecha de subida</th>
                                                <th>Descargar</th>
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
                
                <div class="modal-footer border-0" style="padding: 1rem 1.5rem;">
                </div>
            </div>
        </div>
    </div> -->

    <!-- Modal Ficha Analytics Model Canvas REPLICA -->
<div class="modal" id="modalFichaAnalyticsModelCanvasReplica" tabindex="-1" role="dialog" aria-labelledby="modalLabelReplica" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered" role="document" style="width: 80vw; max-width: 100%;">
        <div class="modal-content border-0 shadow-lg" style="border-radius: 8px;">
            <div class="modal-header border-0" style="padding: 1rem 1.5rem;">
                <h5 id="modal-title" class="modal-title font-weight-bold">Ficha Analytics Model Canvas Replica</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close" style="outline: none;">
                    <span>&times;</span>
                </button>
            </div>
            <div class="modal-body" style="padding: 1.5rem; font-size: clamp(1rem, 1.5vw, 1.2rem);">
                <div id="section-amc-table-replica" class="row">
                    <div class="col-12" >
                        <div class="card">
                            <div class="card-body">
                                <div id="segmentador-container" class="some-container">
                                    
                                </div>
                                <div style="padding-bottom:10px;display: flex; flex-direction: column;">
                                    <div class="search-sm float-md-left mr-1 mb-1 align-top d-flex align-items-center justify-content-between" style="width:100%; display:flex;margin-left:10px">
                                        <input placeholder="Buscar..."  id="amc-table-search-replica" style="width: 20%;height:30px;" autocomplete="off">
                                        <div class="d-flex top-right-button-container" style="width: max-content; gap: 5px;">
                                            <div class="">
                                                <button class="btn btn-outline-primary btn-lg dropdown-toggle" type="button"
                                                    data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                                    Exportar
                                                </button>
                                                <div class="dropdown-menu">
                                                    <a class="dropdown-item" id="dataTablesCopy" href="#">Copy</a>
                                                    <a class="dropdown-item" id="dataTablesExcel" href="#">Excel</a>
                                                    <a class="dropdown-item" id="dataTablesCsv" href="#">Csv</a>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <table id="amc-table-replica" class="table table-bordered" style="font-size: clamp(.5rem, .75rem, 1.5rem); min-width: 1600px;">
                                    <thead>
                                        <tr>
                                            <th>Nombre de AMC</th>
                                            <th>Tipo de AMC</th>
                                            <th>Fecha de generación</th>
                                            <th>Usuario creador</th>
                                            <th>Área de usuario creador</th>
                                            <th>Sponsor</th>
                                            <th>Área de sponsor</th>
                                            <th>Comentarios</th>
                                            <th>Estado</th>
                                            <th>Documentos Adjuntos</th>
                                            <th></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
                <div id="section-permissions" class="card" style="display:none; padding: 2rem;">
                    <div class="d-flex"  >
                        <i id="btn-permissions-back" class="iconsminds-left mr-2" style="cursor: pointer; position: absolute;"></i>
                        <h6  class="modal-title font-weight-bold w-100 text-center">Usuarios con permisos</span></h6>
                    </div>
                    <div id="select-permissions-wrapper" class="d-flex justify-content-center">
                        <select id="select-permissions" class="form-control" ></select>
                        <div id="btn-permissions-add-replica" class="ml-2 card d-flex flex-column align-items-center justify-content-center bg-primary" style="height: 38px; aspect-ratio: 1/1; cursor: pointer;">
                            <i class="simple-icon-plus" style="font-size: 1rem;"></i>
                        </div>

                    </div>
                    <div id="permissions-user-list" class="d-flex flex-grow-1 mx-auto mt-4 justify-content-center" style="gap: 2rem; max-width: 700px; flex-wrap: wrap;">
                        <div id="btn-permissions-add-replica" class="card d-flex flex-column align-items-center justify-content-center" style="height: 150px; width: 150px; cursor: pointer;">
                            <i class="simple-icon-plus" style="font-size: 2.5rem;"></i>
                        </div>
                    </div>
                    <div class="w-100 d-flex" style="justify-content: flex-end; gap: .5rem;">
                        <button type="button" id="btn-cancel-permissions" class="btn btn-outline-primary">Cancelar</button>
                        <button type="button" id="btn-save-permissions" class="btn btn-primary" >Guardar</button>
                    </div>
                </div>
                <div id="section-reassign" class="card" style="display:none; padding: 2rem;">
                    <div class="d-flex"  >
                        <i id="btn-reassign-back-replica" class="iconsminds-left mr-2" style="cursor: pointer;position: absolute;"></i>
                        <h6  class="modal-title font-weight-bold w-100 text-center">Reasignar Usuario</span></h6>
                    </div>
                    <div class="d-flex flex-column flex-grow-1 mx-auto mt-4 justify-content-center" style="gap: 2rem; max-width: 700px; flex-wrap: wrap;">
                       
                        <div class="d-flex align-items-center" style="font-size: .75rem;">
                            <label class="mr-4 font-weight-bold">Actual:</label>
                            <div class="card d-flex flex-row" style=" gap: 1rem; padding: 1rem;">
                                <img src="img/Data Science_38.svg" alt="Usuario Actual" style="width: 50px; height: 50px;">
                                <div class="d-flex flex-column w-100">
                                    <span id="reassign-current-username" class="font-weight-bold"></span>
                                    <span id="reassign-current-name"></span>
                                </div>
                            </div>
                        </div>
                        <div class="d-flex align-items-center" style="font-size: .75rem;">
                            <label for="" class="mr-4 font-weight-bold">Nuevo:</label>
                            <select id="select-reassign" class="form-control" style="min-width: 300px;"></select>
                        </div>


                       
                    </div>

                    <div class="w-100 d-flex" style="justify-content: flex-end; gap: .5rem;">
                        <button type="button" id="btn-cancel-reassign" class="btn btn-outline-primary">Cancelar</button>
                        <button type="button" id="btn-save-reassign" class="btn btn-primary" >Reasignar</button>
                    </div>
                </div>

                <div id="section-documentos-adjuntos" class="" style="display: none; padding: 2rem;">
                    
                    <div class="col-12" >
                        <div class="card">
                            <div class="card-body">
                                <div id="segmentador-container" class="some-container">
                                    <!-- Aquí se agregará el segmentador -->
                                </div>
                                <div style="padding-bottom:10px;display: flex; flex-direction: column;">
                                    <div class="d-flex justify-content-center w-100 align-items-center" style="position: relative;" >
                                        <i id="btn-reassign-back-replica" class="iconsminds-left float-left" style="cursor: pointer;"></i>
                                        <h6  class="modal-title font-weight-bold w-100 text-center">Reasignar Usuario</span></h6>
                                    </div>
                                    <div class="search-sm float-md-left mr-1 mb-1 align-top d-flex align-items-center justify-content-between" style="width:100%; display:flex;margin-left:10px">
                                        <input placeholder="Buscar..."  id="documents-table-search" style="width: 20%;height:30px;" autocomplete="off">
                                        <div class="top-right-button-container" style="width: max-content;">
                                        </div>
                                        <!-- <i class="simple-icon-trash btn-primary" style="padding: .5rem 1rem; margin-left: 3px; cursor: pointer; border-radius: 20px;" id="btn_tablas_oficiales-trash-icon" onclick="borrarBusquedaFichaTablas()"> </i>  -->
                                    </div>
                                </div>
                                <table id="documents-table" class="table" style="font-size: clamp(.5rem, .75rem, 1.5rem);">
                                    <thead>
                                        <tr>
                                            <th style="display:none;">AMC ID</th>
                                            <th>Nombre</th>
                                            <th>Analytics Model Canvas</th>
                                            <th>Usuario</th>
                                            <th>Fecha de subida</th>
                                            <th>Descargar</th>
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
            
            <div class="modal-footer border-0" style="padding: 1rem 1.5rem;">
               <!--  -->
            </div>
        </div>
    </div>
</div>
                             
      
    <!-- <script src="script.js"></script> -->
    <!-- <script src="https://code.jquery.com/jquery-3.3.1.slim.min.js" integrity="sha384-q8i/X+965DzO0rT7abK41JStQIAqVgRVzpbzo5smXKp4YfRvH+8abtTE1Pi6jizo" crossorigin="anonymous"></script> -->
    <!-- <script src="https://cdn.jsdelivr.net/npm/popper.js@1.14.7/dist/umd/popper.min.js" integrity="sha384-UO2eT0CpHqdSJQ6hJty5KVphtPhzWj9WO1clHTMGa3JDZwrnQq4sF86dIHNDz0W1" crossorigin="anonymous"></script> -->
    <!-- <script src="https://cdn.jsdelivr.net/npm/bootstrap@4.3.1/dist/js/bootstrap.min.js" integrity="sha384-JjSmVgyd0p3pXB1rRibZUAYoIIy6OrQ6VrjIEaFf/nJGzIxFDsf4x0xIM+B07jRM" crossorigin="anonymous"></script> -->
    
    <script src="js/vendor/jquery-3.3.1.min.js"></script>
    <script src="js/vendor/select2.full.js"></script>
    <script src="js/vendor/bootstrap.bundle.min.js"></script>
    <script src="js/vendor/perfect-scrollbar.min.js"></script>
    <script src="js/vendor/mousetrap.min.js"></script>
    <script src="js/dore.script.js"></script>
    <script src="js/scripts.single.theme.js"></script>
    <script src="https://d3js.org/d3.v5.min.js"></script>
    <script src="js/jquery.SPServices.v2014-02.min.js"></script>
    <script src="js/vendor/datatables.min.js"></script>
    <script src="js/vendor/buttons.dataTables.min.js"></script>
    <script src="js/vendor/jszip.min.js"></script>
    <script src="js/vendor/buttons.html5.min.js"></script>
    <script src="js/vendor/dataTables.Resize.js"></script>
    <script src="js/vendor/bootstrap-notify.min.js"></script>
    <script src="js/custom-js/xlsx.full.min.js"></script>
    <script src="js/custom-js/html2pdf.bundle.min.js"></script>
    <script src="js/dore-plugins/select.from.library.js"></script>
    <script src="https://code.jquery.com/ui/1.12.1/jquery-ui.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>

    <!-- <script src="js/utils/notification.js"></script> -->
    <script src="js/AMC/amc_api.js"></script>
    <script src="js/AMC/listenerAMC.js"></script>
    <script>
        var n = new Date().getTime();
        document.write('<script src="js/suite.js?v='+n+'"> <'+'/'+'script>');
    </script>
    <script>
        $(document).ready(function () {
            AnalyticsModelCanvas();
            AnalyticsModelCanvasReplica();
        });
    </script>    
    

    <script>
        $(function () {
            // Inicializa el tooltip con html: true para permitir el uso de <br> y otras etiquetas HTML
            $('[data-toggle="tooltip"]').tooltip({
                html: true  // Permite usar HTML dentro del tooltip
            });
        });
    </script>
</body>
</html>

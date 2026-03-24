<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Analytics Model Canvas</title>
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

    <link rel="stylesheet" href="css/vendor/select2.min.css" />
    <link rel="stylesheet" href="css/vendor/select2-bootstrap.min.css" />
    <link rel="stylesheet" href="https://code.jquery.com/ui/1.12.1/themes/base/jquery-ui.css">

    <script>
        var n = new Date().getTime();
        document.write('<link href="css/style.css?v='+n+'" rel="stylesheet" />');
    </script>
    <link rel="stylesheet" href="css/main.css" />
    <link rel="stylesheet" href="css/pagination.css" />


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
            <img class="logo d-none d-xs-block" src="logos/oga_color.png">
            <img class="logo-mobile d-block d-xs-none" src="logos/OGA_icon.png">
        </a>

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
    <main >
       <div class="d-flex flex-column">
            <div class="flex-grow-1 d-flex align-items-center justify-content-center">
                <div class="w-100">
                    <div class="w-100 h-100" id="amc-wrapper">
                        <div class="w-100 d-flex flex-column justify-content-center">
                            <h4 class="h2 w-100 font-weight-bold text-center">Analytics Model Canvas</h4>
                            
                            <div class="d-flex w-100 align-items-center flex-wrap" style="gap: .75rem;">
                                <div class="d-flex align-items-center" style="gap: 5px; width: 32%;">
                                    <span class="font-weight-bold h6" style="font-size: .75rem;">Proyecto:</span>
                                    <input id="amc-name" value="" class="amc-input form-control mb-2" placeholder="Ingrese un nombre para el amc" style="font-size: .75rem;"/>
                                    <span onclick='clearAMC()' id='btn-clear-amc' style="visibility: hidden; cursor:pointer;"><i class='iconsminds-close'></i></span>
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
                                    <div class="amc-cell" id="amc-caracteristicas-reentrenamiento">CARACTERÍSTICAS PARA REENTRENAMIENTO DEL MODELO</div>
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
                        </div>
                        <div>
                            <button type="submit" class="btnActions px-4 float-right btn btn-primary float-right mt-2" style="width: fit-content;" id="btnGuardarAMC">Guardar cambios</button>
                            <button type="submit" class="btnActions px-4 float-right btn btn-outline-primary float-right m-2" style="width: fit-content;" id="btnBorrarAMC">Descartar cambios</button>
                            <button type="submit" class="btnActions px-4 float-right btn btn-primary float-right mt-2" style="width: fit-content;" id="btnExportarAMC">Exportar</button>
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
       
       <div class="seguimiento-card default-transition" style="opacity: 1;">
        <div class="card h-100 ">
            <div class="card-body ">
               <div class="d-flex flex-column justify-content-center align-items-center">
                <div class="seguimiento-card-content">
                    <div class="flex-grow-1 px-2" id="seguimiento-comentarios"></div>
                    <div class="seguimiento-input-wrapper d-flex" style="gap:6px;" >
                        <input type="text" placeholder="Escriba su observación" id="seguimiento-input" class="form-control">
                        <i class="simple-icon-paper-plane bg-primary" id="btn-enviar-observacion"></i>
                    </div>
                    <span class="" style="color: #6c757d;" id="seguimiento-conteo">0 Entradas</span>
                </div>
               </div>
            </div>
        </div>
        <a href="#" class="seguimiento-card-button text-primary" data-toggle="tooltip" data-placement="top" title="Resumen"> <i class="iconsminds-speach-bubble-dialog"></i> </a>
    </div>

    </main>

     <!-- Modal editar -->
     <!-- <div class="modal fade" id="editarModal" tabindex="-1" role="dialog" aria-labelledby="" aria-hidden="true"> -->
        <div class="modal fade" id="modalEditarCelda" tabindex="-1" role="dialog" aria-labelledby="" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered" role="document">
            <div class="modal-content border-0 shadow-lg" style="border-radius: 8px;">
                <div class="modal-header border-0" style="padding: 1rem 1.5rem;">
                    <!-- <h5  class="modal-title font-weight-bold" id="editModalLabel">Editar celda: <span id="section-edit" style="font-weight: 400 !important;"></span></h5> -->
                    <h5  class="modal-title font-weight-bold">Editar celda: <span id="modalEditarCeldaNombre" style="font-weight: 400 !important;"></span></h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close" style="outline: none;">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body" style="padding: 1.5rem; font-size: clamp(1rem, 1.5vw, 1.2rem);">
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
    <script>
        var n = new Date().getTime();
        document.write('<script src="js/suiteTest.js?v='+n+'"> <'+'/'+'script>');
    </script>
    <script>
        $(document).ready(AnalyticsModelCanvas());
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

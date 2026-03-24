<head>
    <meta charset="UTF-8">
    <title>Ficha Analytics Model Canvas</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
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
        var n = new Date().getTime();
        document.write('<link href="css/style.css?v='+n+'" rel="stylesheet" />');
    </script>
    <link rel="stylesheet" href="css/main.css" />
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

    </style>

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
                                            <th>Descripción de AMC</th>
                                            <th>Tipo de AMC</th>
                                            <th>Fecha de generación</th>
                                            <th>Usuario que lo generó</th>
                                            <th>Área de usuario que lo generó</th>
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
</div>
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
    <script src="js/AMC/listenerAMC.js"></script>
    <script>
        var n = new Date().getTime();
        document.write('<script src="js/suite.js?v='+n+'"> <'+'/'+'script>');
    </script>
    <script>
        $(document).ready(function () {
            AnalyticsModelCanvas();
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
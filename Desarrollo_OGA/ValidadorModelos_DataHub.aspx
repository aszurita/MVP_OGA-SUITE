     <head>
            <meta charset="UTF-8">
            <title>Validador Modelos Modal </title>
            <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">

            <link rel="stylesheet" href="font/iconsmind-s/css/iconsminds.css" />
            <link rel="stylesheet" href="font/simple-line-icons/css/simple-line-icons.css" />
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">

            <link rel="stylesheet" href="css/vendor/bootstrap.min.css" />
            <link rel="stylesheet" href="css/vendor/bootstrap.rtl.only.min.css" />
            <link rel="stylesheet" href="css/vendor/component-custom-switch.min.css" />
            <link rel="stylesheet" href="css/vendor/perfect-scrollbar.css" />
            <link rel="stylesheet" href="css/vendor/dataTables.colResize.css" />
            <link rel="stylesheet" href="css/vendor/dataTables.bootstrap4.min.css" />
            <script>
                var n = new Date().getTime();
                document.write('<link href="css/style.css?v=' + n + '" rel="stylesheet" />');
            </script>
            <script>
                window.__initFromURLDone = false;
            </script>

            <link rel="stylesheet" href="css/main.css" />
            <link rel="stylesheet" href="https://code.jquery.com/ui/1.12.1/themes/base/jquery-ui.css">
            
        </head>
            <script src="js/vendor/jquery-3.3.1.min.js"></script>
            <script src="js/vendor/bootstrap.bundle.min.js"></script>
            <script src="js/vendor/perfect-scrollbar.min.js"></script>
            <script src="js/vendor/mousetrap.min.js"></script>
            <script src="js/vendor/Chart.bundle.min.js"></script>
            <script src="js/vendor/chartjs-plugin-datalabels.js"></script>

            <script src="js/dore.script.js"></script>
            <script src="https://code.jquery.com/ui/1.12.1/jquery-ui.min.js"></script>

            <script src="https://cdn.ckeditor.com/ckeditor5/39.0.1/classic/ckeditor.js"></script>
            <script>
                let globalObsEditor = null;
                document.addEventListener("DOMContentLoaded", () => {
                    const txt = document.getElementById("txtObservaciones");
                    if (!txt) return;

                    ClassicEditor
                        .create(txt)
                        .then(editor => {
                            globalObsEditor = editor;
                            txt._ckEditorInstance = editor;
                        })
                        .catch(console.error);
                });
            </script>
            <script src="js/scripts.single.theme.js"></script>
            <script src="js/jquery.SPServices.v2014-02.min.js"></script>
            <script src="js/vendor/datatables.min.js"></script>
            <script src="js/vendor/buttons.dataTables.min.js"></script>
            <script src="js/vendor/jszip.min.js"></script>
            <script src="js/vendor/buttons.html5.min.js"></script>
            <script src="js/vendor/dataTables.Resize.js"></script>
            <script src="js/vendor/bootstrap-notify.min.js"></script>

            <!--utils-->
            <script src="js/Validador_Modelos/utils/resetDataMapGlobal.js"></script>
            <script src="js/Validador_Modelos/actualizacion_DataMap/actualizarScoreFinal.js"></script>
            <script src="js/Validador_Modelos/utils/initNuevaValidacionListener.js"></script>
            <script src="js/Validador_Modelos/utils/inyectarAplicaDesdeDetalle.js"></script>


            <!-- cards -->
            <script src="js/Validador_Modelos/cards/crearCardHtml.js"></script>
            <script src="js/Validador_Modelos/cards/crearParametrosHtml.js"></script>
            <script src="js/Validador_Modelos/cards/crearPreguntasHtml.js"></script>

            <!-- cargas -->
            <script src="js/Validador_Modelos/cargas/cargarDatosEnMapa.js"></script>
            <script src="js/Validador_Modelos/cargas/cargarModelosDesdeSharePoint.js"></script>
            <script src="js/Validador_Modelos/cargas/cargarModeloSeleccionado.js"></script>
            <script src="js/Validador_Modelos/cargas/cargarPlantillaCompleta.js"></script>
            <script src="js/Validador_Modelos/cargas/cargarSeccionesUnicas.js"></script>
            <script src="js/Validador_Modelos/cargas/cargarSubseccionesYParametros.js"></script>
            <script src="js/Validador_Modelos/cargas/cargarValoresPrevios.js"></script>
            <script src="js/Validador_Modelos/cargas/mostrarInformacionModelo.js"></script>
            <script src="js/Validador_Modelos/cargas/obtenerDataMapGlobal.js"></script>
            <script src="js/Validador_Modelos/cargas/buscarValidacionYDetallePorModelo.js"></script>
            <script src="js/Validador_Modelos/cargas/guardarValidacionEnTxt.js"></script>
            <script src="js/Validador_Modelos/cargas/obtenerSeccionActual.js"></script>
            <script src="js/Validador_Modelos/cargas/getUsuarioPorCodigo.js"></script>

            <!-- recalcular score-->
            <script src="js/Validador_Modelos/recalcular_scores/recalcularTodo.js"></script>
            <script src="js/Validador_Modelos/recalcular_scores/recalcularScoreSubseccion.js"></script>
            <script src="js/Validador_Modelos/recalcular_scores/recalcularScoreSeccion.js"></script>

            <!--actualizaciones datamapglobal-->
            <script src="js/Validador_Modelos/actualizacion_DataMap/actualizarDataMapDesdeDetalleScore.js"></script>
            <script src="js/Validador_Modelos/actualizacion_DataMap/actualizarDataMap.js"></script>
            <script src="js/Validador_Modelos/actualizacion_DataMap/actualizarDataMapFromSlider.js"></script>
            <script src="js/Validador_Modelos/actualizacion_DataMap/actualizarDataMapFromSwitch.js"></script>

            <script src="js/Validador_Modelos/actualizacion_DataMap/actualizarScoreSeccionEnDOM.js"></script>

            <!--actualizar listas-->
            <script src="js/Validador_Modelos/actualizar_Listas/generarCabeceraScore.js"></script>
            <script src="js/Validador_Modelos/actualizar_Listas/generarDetalleScore.js"></script>
            <script src="js/Validador_Modelos/actualizar_Listas/insertarCabeceraScore.js"></script>
            <script src="js/Validador_Modelos/actualizar_Listas/insertarDetalleScore.js"></script>
            <script src="js/Validador_Modelos/actualizar_Listas/updateObservacionesCabecera.js"></script>
            <script src="js/Validador_Modelos/actualizar_Listas/updateDetalleScore.js"></script>

            <!--utils2-->
            <script src="js/Validador_Modelos/utils/renderizarContenido.js"></script>
            <script src="js/Validador_Modelos/utils/actualizarTextoBotonGuardar.js"></script>
            <script src="js/Validador_Modelos/utils/sincronizarDetalleScore.js"></script>
            <script src="js/Validador_Modelos/utils/obtenerIdValidacionMayor.js"></script>
            <script src="js/Validador_Modelos/utils/descartarCambiosListener.js"></script>
            <script src="js/Validador_Modelos/utils/verificarCambiosEnPreguntas.js"></script>
            <script src="js/Validador_Modelos/utils/manejarGuardarValidacion.js"></script>
            <script src="js/Validador_Modelos/utils/bloquearValidacion.js"></script>
            <script src="js/Validador_Modelos/utils/switchGlobalSubseccion.js"></script>
            <script src="js/Validador_Modelos/utils/buscarUltimaValidacion.js"></script>
            <script src="js/Validador_Modelos/utils/construirPlantillaImpresion.js"></script>


            <!--panel de validacion-->
            <script src="Validador_Data/js/asegurarEstilosTablaValidaciones.js"></script>
            <script src="Validador_Data/js/crearModalValidaciones.js"></script>
            <script src="Validador_Data/js/initValidacionesPopupListener.js"></script>
            <script src="Validador_Data/js/mostrarModalValidaciones.js"></script>
            <script src="Validador_Data/js/obtenerDatosValidaciones.js"></script>
            <script src="Validador_Data/js/pintarTablaValidaciones.js"></script>
   
            <script>
                window.dataMapGlobal = window.dataMapGlobal || {};
                window.cabeceraObservaciones = window.cabeceraObservaciones || {};
                window.cabeceraglobal = window.cabeceraglobal || {};
                window.modeloInfoCompleta = window.modeloInfoCompleta || {};

            </script>

            <script src="js/Validador_Modelos/utils/uiBotones.js"></script>
        </body>

    </html>
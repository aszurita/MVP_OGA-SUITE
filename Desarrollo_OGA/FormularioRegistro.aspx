<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Registro</title>
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
    <!-- <link rel="stylesheet" href="https://code.jquery.com/ui/1.12.1/themes/base/jquery-ui.css"> -->

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
    <link rel="stylesheet" href="css/pagination.css" />

    <!-- <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.3.1/dist/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous"> -->
    <style>
        .has-float-label {
            position: relative;
        }

        .has-float-label input {
            /* padding-top: 1.5rem;Espacio extra para evitar superposición */
            padding-left: 0.75rem;
            font-size: .75rem;
            border: 1px solid #ced4da;
            /* border: none; */
            border-radius: 4px;
        }

        .has-float-label span {
            position: absolute;
            top: -0.6rem; /* Flota fuera del borde */
            left: 0.5rem; /* Ajuste horizontal */
            background-color: transparent; /* Color de fondo que "corta" el borde */
            padding: 0 0.25rem; /* Espaciado para el texto */
            font-size: 0.75rem; /* Tamaño más pequeño */
            color: #6c757d; /* Color gris claro */
            pointer-events: none; /* Evita interacciones no deseadas */
        }

        .has-float-label input:focus {
            outline: none;
            border-color: #007bff;
            box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
        }

        .select-code{
            max-height: 300px;
            width: 300px;
            overflow: auto;
        }

        /* Contenedor del select con label flotante */
        .select2-container-wrapper {
            position: relative;
            display: inline-block;
            width: 30%; /* Ajuste de ancho al 25% */
        }

        /* Label flotante fijo sobre el borde del select */
        .floating-label {
            position: absolute;
            top: -0.6rem; /* Coloca el label justo sobre el borde */
            left: 0.5rem; /* Ajuste horizontal */
            background-color: #fff; /* Simula el recorte del borde */
            padding: 0 0.3rem; /* Espaciado lateral para cortar bien */
            font-size: 0.75rem;
            color: #6c757d; /* Color del texto del label */
            pointer-events: none; /* Evita interacción */
            z-index: 10; /* Para que quede por encima */
        }

        /* Ajustar el contenedor de Select2 */
        .select2-container {
            width: 100% !important;
        }

        /* Ajustar la caja de selección de Select2 */
        .select2-selection--single {
            height: 38px !important; /* Ajustar altura */
            border: 1px solid #ced4da !important; /* Borde del select */
            border-radius: 4px !important;
            padding-left: 0.75rem !important;
            display: flex !important;
            align-items: center !important;
            background-color: white !important; /* Asegurar fondo blanco */
        }

        /* Ajustar el texto seleccionado en Select2 */
        .select2-selection__rendered {
            font-size: 1rem !important;
            color: #495057 !important;
            line-height: normal !important;
        }

        /* Evitar que Select2 sobrescriba el padding */
        .select2-container--bootstrap .select2-selection {
            padding-top: 0 !important;
            padding-bottom: 0 !important;
        }

        /* Mejorar el enfoque cuando Select2 está activo */
        .select2-container--bootstrap .select2-selection:focus {
            border-color: #007bff !important;
            box-shadow: 0 0 3px rgba(0, 123, 255, 0.5) !important;
        }

        .ui-autocomplete {
            background: #fff; /* Fondo blanco */
            border: 1px solid #ced4da; /* Borde similar a los inputs */
            border-radius: 8px; /* Borde redondeado */
            list-style: none; /* Quita viñetas */
            padding: 5px 0; /* Espaciado */
            max-height: 200px; /* Limita altura */
            overflow-y: auto; /* Scroll cuando hay muchas opciones */
            position: absolute !important; /* Asegura que la posición no se vea afectada */
            z-index: 1050; /* Asegura que quede por encima de otros elementos */
            width: 125px !important; /* Que ocupe todo el ancho del input */
        }

        .ui-menu-item {
            padding: 8px 12px;
            cursor: pointer;
            color: #212529; /* Color de texto */
        }

        .ui-menu-item:hover {
            background: #007bff; /* Color de hover */
            color: #fff;
        }

        /* Corrige el mensaje "1 result found" */
        .ui-helper-hidden-accessible {
            display: none;
        }

        .ui-autocomplete.ui-front {
            position: absolute !important;
            z-index: 1050;
        }

        #select2-select-rol-datos-results , #select2-select-rol-funcion-results {
            height: 100% !important;
        }
        .select-register-form{
            height: 44px !important;
        }

        #ficha-skills{
            -webkit-column-count: 5;
            column-count: 4;  
            margin: 0;
            padding: 0 1rem;
            font-size: .75rem;  
        }

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
    <main style="margin-left:0 !important; margin-right: 0!important; margin-top: 27vh;">
        <div class="container">
            <div class="row h-100">
                <div class="col-12 col-md-10 mx-auto my-auto">
                    <div class="card auth-card">
                        <!-- <div class="position-relative image-side ">
                            <p class=" text-white h2">MAGIC IS IN THE DETAILS</p>
                            <p class="white mb-0">
                                Please use this form to register.
                                <br>If you are a member, please
                                <a href="#" class="white">login</a>.
                            </p>
                        </div> -->
                        <div class="mx-auto py-4">
                            <!-- Logo -->
                            <!-- <div href="Dashboard.Default.html" class="w-100 d-flex justify-content-center">
                                <img src="logos/oga_color.png" alt="" height="80">
                            </div> -->
                            
                            <div class="d-flex flex-column mx-auto" style="width: 80%;">
                                <div class="d-flex justify-content-between align-items-center">
                                    <h5 class="my-4 font-weight-bold">Registro DataCitizen</h5>
                                    <button class="btn btn-primary " id="btn-table-users"  style="display: none;"><i class="simple-icon-user"></i></button>
                                </div>
                                <label class="select2-container-wrapper mb-4">
                                    <span class="floating-label" id="label-user-code">Código</span>
                                    <!-- <select class="form-control select-register-form" id="select-user-code"></select> -->
                                    <input type="text" class="form-control" disabled id="select-user-code" style="width: 125px !important;">
                                </label>
                                
                                
                                <div id="user-info" class="d-flex flex-wrap justify-content-between w-100">
                                    <div class="d-flex w-100 justify-content-between">
                                        <label class="form-group has-float-label mb-4" style="width:30%">
                                            <input class="form-control" type="text" placeholder="" id="username-input" disabled/>
                                            <span>Usuario</span>
                                        </label>

                                        <label class="form-group has-float-label mb-4" style="width:30%">
                                            <input class="form-control" id="name-input" disabled/>
                                            <span>Nombre completo</span>
                                        </label>
                                        
                                        <label class="form-group has-float-label mb-4" style="width:30%">
                                            <input class="form-control" type="text" placeholder="" id="email-input" disabled/>
                                            <span>Correo</span>
                                        </label>
                                    </div>
                                    <!-- Sección ubicación -->
                                    <div class="d-flex w-100 justify-content-between">
                                        <label class="form-group has-float-label mb-4" style="width:30%">
                                            <input class="form-control" type="text" placeholder="" id="agency-input" disabled/>
                                            <span>Agencia</span>
                                        </label>
                                        <label class="form-group has-float-label mb-4" style="width:30%">
                                            <input class="form-control" type="text" placeholder="" id="area-input" disabled/>
                                            <span>Área</span>
                                        </label>
                                        <label class="form-group has-float-label mb-4" style="width:30%">
                                            <input class="form-control" type="text" placeholder="" id="banca-input" disabled/>
                                            <span>Banca</span>
                                        </label>
                                    </div>
                                    <!-- Sección cargo y rol -->
                                    <div class="d-flex w-100 justify-content-between">
                                        <label class="form-group has-float-label mb-4" style="width:30%">
                                            <input class="form-control" type="text" placeholder="" id="position-input" disabled/>
                                            <span>Cargo</span>
                                        </label>
                                        <label class="select2-container-wrapper">
                                            <span class="floating-label">Rol Función</span>
                                            <select class="form-control select-register-form" id="select-rol-funcion">
                                                
                                            </select>
                                        </label>
                                        <label class="select2-container-wrapper">
                                            <span class="floating-label">Rol Datos</span>
                                            <select class="form-control select-register-form" id="select-rol-datos">
                                            </select>
                                        </label>
                                        
                                    </div>
                                    
                                </div>
                                <div class="d-flex align-items-center w-100" style="gap: 1rem;">
                                    <h5 for="" class="font-weight-bold m-0">Mis Habilidades</h5>
                                    <h5 class="m-0" style="font-weight: 500 !important; font-size: .875rem;" id="skills-count">(0)</h5> 
                                    <i class="simple-icon-plus text-primary" id="btn-add-skill" style="cursor: pointer; font-size: 1rem;"></i>
                                </div>
                                
                                <div class="d-flex justify-content-end align-items-center mt-4" style="gap: .5rem;">
                                    <!-- <button class="btn btn-outline-primary btn-lg btn-shadow" id="btn-reject" style="display: none;">RECHAZAR</button> -->
                                    <!-- <button class="btn btn-primary btn-lg btn-shadow" id="btn-aprove" style="display: none;">APROBAR</button> -->
                                    <button class="btn btn-primary btn-lg btn-shadow" id="btn-register">REGISTRAR</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </main>

     <!-- Modal editar -->
     <!-- <div class="modal fade" id="editarModal" tabindex="-1" role="dialog" aria-labelledby="" > -->
    <div class="modal fade" id="modalSkills" tabindex="-1" role="dialog" aria-labelledby="" >
        <div class="modal-dialog modal-dialog-centered" role="document" style="width: 60vw; max-width: 100%;">
            <div class="modal-content border-0 shadow-lg" style="border-radius: 8px;">
                <div class="modal-header border-0 d-flex flex-column" style="padding: 1rem 1.5rem;">
                    <!-- <h5  class="modal-title font-weight-bold" id="editModalLabel">Editar celda: <span id="section-edit" style="font-weight: 400 !important;"></span></h5> -->
                    <div class="w-100 d-flex align-items-center">
                        <h5  class="modal-title font-weight-bold">Habilidades</h5>
                        <button id="btn-close-skills" type="button" class="close" data-dismiss="modal" aria-label="Close" style="outline: none;">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>

                </div>
                <div class="modal-body" style="padding:0 1.5rem; font-size: clamp(1rem, 1.5vw, 1.2rem);">
                    <div class="d-flex flex-column">
                        <div class="skill-actions-wrapper">
                            <label class="form-group has-float-label mb-4" style="width:10%">
                                <input class="form-control" type="text" id="search-skill">
                                <span style="background-color: white !important;">Buscar</span>
                            </label>
                            <label for="" class="d-flex align-items-center" style="gap: 1rem;">
                                <span style="font-size: .875rem;">Seleccionar Todos</span>
                                <input type="checkbox" id="select-all-skills"/>
                            </label>
                        </div>
                        <div id="skills-list" class="d-flex flex-wrap" style="max-height: 400px; overflow:auto;">
                        </div>
                    </div>
                </div>
                
                <div class="modal-footer border-0" style="padding: 1rem 1.5rem;">
                    <!-- <button type="button" class="btn btn-outline-primary" id="btnCancelarEditar" >Cancelar</button> -->
                    <button type="button" class="btn btn-outline-primary" id="btn-cancel-skills" >Cancelar</button>
                    <!-- <button type="button" class="btn btn-primary" id="btnGuardarEditar">Guardar</button> -->
                    <button type="button" class="btn btn-primary" id="btn-save-skills">Guardar</button>
                </div>
            </div>
        </div>
    </div>
    
    <!-- Modal Usuarios Model Canvas -->
    <div class="modal fade" id="modal-table-users" tabindex="-1" role="dialog" aria-labelledby="" style="font-size: clamp(1rem, 1.5vw, 1.2rem);">
        <div class="modal-dialog modal-dialog-centered" role="document" style="width: 80vw; max-width: 100%;">
            <div class="modal-content border-0 shadow-lg" style="border-radius: 8px; margin-top: 10%;">
                <div class="modal-header border-0" style="padding: 1rem 1.5rem;">
                    <h5 id="modal-title" class="modal-title font-weight-bold">Usuarios</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close" style="outline: none;" id="btn-close-modal-users">
                        <span>&times;</span>
                    </button>
                </div>
                <div class="modal-body" style="padding: 1.5rem; padding-top: 0; font-size: clamp(1rem, 1.5vw, 1.2rem);">
                    <div id="section-table-users" class="row">
                        <div class="col-12" >
                            <div class="card">
                                <div class="card-body" style="padding: 1rem;">
                                    <div id="segmentador-container" class="some-container">
                                        
                                    </div>
                                    <div style="padding-bottom:10px;display: flex; flex-direction: column;">
                                        <div class="search-sm float-md-left mr-1 mb-1 align-top d-flex align-items-center justify-content-between" style="width:100%; display:flex;margin-left:10px">
                                            <input placeholder="Buscar..."  id="table-users-search" style="width: 20%;height:30px;" autocomplete="off">
                                            <div class="d-flex top-right-button-container" style="width: max-content; gap: 5px;">
                                                <div class="">
                                                    <button class="btn btn-outline-primary btn-lg dropdown-toggle" type="button"
                                                        data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                                        Exportar
                                                    </button>
                                                    <div class="dropdown-menu">
                                                        <a class="dropdown-item" id="dataTablesCopy" href="#">Copiar</a>
                                                        <a class="dropdown-item" id="dataTablesExcel" href="#">Excel</a>
                                                        <a class="dropdown-item" id="dataTablesCsv" href="#">Csv</a>
                                                       
                                                    </div>
                                                </div>
                                            </div>
                                          
                                        </div>
                                    </div>
                                    <table id="table-users" class="table" style="font-size: clamp(.5rem, .75rem, 1.5rem); min-width: 1600px;">
                                        <thead>
                                            <tr>
                                                <th>Estado</th>
                                                <th>Area</th>
                                                <th>Cargo</th>
                                                <th>Agencia</th>
                                                <th>Usuario</th>
                                                <th>Código</th>
                                                <th>Nombre</th>
                                                <th>Correo</th>
                                                <th>Fecha Ingreso</th>
                                                <th>Banca</th>
                                                <th>Rol Función</th>
                                                <th>Habilidades</th>
                                                <th>Rol Datos</th>
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

    <!-- Modal ficha usuario -->
        <div class="modal fade" id="modal-ficha-usuario" tabindex="-1" role="dialog" aria-labelledby="" >
            <div class="modal-dialog modal-dialog-centered" role="document" style="width: 50vw; max-width: 100%;">
                <div class="modal-content border-0 shadow-lg" style="border-radius: 8px; max-height: 90dvh;">
                    <div class="modal-header border-0 d-flex flex-column" style="padding: 1rem 1.5rem;">
                        <!-- <h5  class="modal-title font-weight-bold" id="editModalLabel">Editar celda: <span id="section-edit" style="font-weight: 400 !important;"></span></h5> -->
                        <div class="w-100 d-flex align-items-center">
                            <h5  class="modal-title font-weight-bold">Ficha de colaborador</h5>
                            <button id="btn-close-ficha-usuario" type="button" class="close" data-dismiss="modal" aria-label="Close" style="outline: none;">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
    
                    </div>
                    <div class="modal-body" style="padding:0 1.5rem; font-size: clamp(1rem, 1.5vw, 1.2rem);">
                        <div class="d-flex flex-column" style="gap:2rem;">
                            <div class="d-flex justify-content-between flex-wrap" style="gap: 1rem;">
                                <h6 class="w-100 font-weight-bold m-0 mt-2">Información del colaborador</h6>
                                <div class="d-flex flex-column rounded-lg" style="font-size: .75rem;">
                                    <span class="font-weight-bold">Código</span>
                                    <span id="ficha-user-code"></span>
                                </div>
                                
                                <div class="d-flex flex-column rounded-lg" style="font-size: .75rem;">
                                    <span class="font-weight-bold">Usuario</span>
                                    <span id="ficha-username"></span>
                                </div>
                                
                                <div class="d-flex flex-column rounded-lg" style="font-size: .75rem;">
                                    <span class="font-weight-bold">Nombre completo</span>
                                    <span id="ficha-name"></span>
                                </div>
                                
                                <div class="d-flex flex-column rounded-lg" style="font-size: .75rem;">
                                    <span class="font-weight-bold">Correo</span>
                                    <span id="ficha-email"></span>
                                </div>
                            </div>
                            <div class="d-flex justify-content-between flex-wrap" style="gap: 1rem;">
                                <h6 class="w-100 font-weight-bold m-0 mt-2">Datos demográficos del colaborador</h6>
                                <div class="d-flex flex-column w-25 rounded-lg" style="font-size: .75rem; width: 30% !important;">
                                    <span class="font-weight-bold">Agencia</span>
                                    <span id="ficha-agency"></span>
                                </div>
                                <div class="d-flex flex-column w-25 rounded-lg" style="font-size: .75rem; width: 30% !important;">
                                    <span class="font-weight-bold">Área</span>
                                    <span id="ficha-area"></span>
                                </div>
                                <div class="d-flex flex-column rounded-lg" style="font-size: .75rem; width: 30% !important;">
                                    <span class="font-weight-bold">Banca</span>
                                    <span id="ficha-banca"></span>
                                </div>
                            </div>
                            <div class="d-flex justify-content-between flex-wrap" style="gap: 1rem;">
                                <h6 class="w-100 font-weight-bold m-0 mt-2">Rol del colaborador</h6>
                                <div class="d-flex flex-column rounded-lg" style="font-size: .75rem; width: 30% !important;">
                                    <span class="font-weight-bold">Cargo</span>
                                    <span id="ficha-position"></span> 
                                </div>
                                <div class="d-flex flex-column rounded-lg" style="font-size: .75rem; width: 30% !important;">
                                    <span class="font-weight-bold">Rol Funcion</span>
                                    <span id="ficha-rol-funcion"></span>
                                </div>
                                <div class="d-flex flex-column rounded-lg" style="font-size: .75rem; width: 30% !important;">
                                    <span class="font-weight-bold">Rol Datos</span>
                                    <span id="ficha-rol-datos"></span>
                                </div>
                            </div>
                            <div class="d-flex justify-content-between flex-wrap" style="gap: 1rem;">
                                <h6 class="w-100 font-weight-bold m-0 mt-2">Habilidades</h6>
                                <ul id="ficha-skills" class="w-100" style="font-size: .75rem;">
                                    
                                </ul>
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
    <script src="js/dore-plugins/select.from.library.js"></script>
    <script src="https://code.jquery.com/ui/1.12.1/jquery-ui.min.js"></script>
    <!-- <script src="js/utils/notification.js"></script> -->
    <script>
        var n = new Date().getTime();
        document.write('<script src="js/suite.js?v='+n+'"> <'+'/'+'script>');
    </script>
    <script src="js/FormularioRegistro/setSkills.js"></script>
    <script src="js/FormularioRegistro/getSkillSuggestions.js"></script>
    <script src="js/FormularioRegistro/setDataTableUsers.js"></script>
    <script src="js/FormularioRegistro/getLongLocUsers.js"></script>
    <script src="js/FormularioRegistro/updateDataCitizen.js"></script>
    <script src="js/FormularioRegistro/setUserSkills.js"></script>
    <script src="js/FormularioRegistro/skillcard.js"></script>
    <script src="js/FormularioRegistro/listenerFormularioRegistro.js"></script>
    <script src="js/FormularioRegistro/FormularioRegistro.js"></script>
</body>
</html>


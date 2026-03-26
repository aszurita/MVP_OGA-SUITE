/* ----------------------------------

Author: Daniel Velásquez
Description: Archivo javascript con múltiples funciones para el funcionamiento de la página "OGA Suite"
Version: 0.1

Librerías implementadas:

-Datatables.js
https://datatables.net/manual/index

-jQuery dataTables ColResize
https://github.com/dhobi/datatables.colResize

-SPServices
https://sympmarc.github.io/SPServices/core.html

-pagination.js
https://pagination.js.org/

-SheetJS
https://sheetjs.com/

-JQuery 
-------------------------------------

*/

const DEBUG = false;
const BASE_URL = `http://vamos.bancoguayaquil.com/sitios/informaciongerencial/OGA_Suite/${DEBUG ? "Desarrollo":"Produccion"}/`
const BASE_URL_DATAHUB = `http://vamos.bancoguayaquil.com/sitios/informaciongerencial/DATAHUB/${DEBUG ? "Desarrollo" : "Produccion"}/`
const BASE_URL_DEBUG = `http://vamos.bancoguayaquil.com/sitios/informaciongerencial/OGA_Suite/Desarrollo/`
window.addEventListener("beforeunload", function (e) {
  var confirmationMessage = "Esta seguro?";
  //localStorage.clear()
  this.localStorage.removeItem("citizen")
});

function obtenerUsuario() {
  // Función 1
  let current_user = $().SPServices.SPGetCurrentUser({
    fieldNames: ["FirstName","LastName","UserName","EMail"],
    debug: false
  });
  window.nombreCompleto = current_user.FirstName +" "+ current_user.LastName;
  window.nombre_usuario = window.nombreCompleto.split(" ")[0];
  //window.nombre_usuario = current_user.FirstName;
  window.current_user = current_user.UserName;
  window.current_email = current_user.EMail;
  // Verifica si la Función 1 no pudo obtener el usuario
  if (!current_user || !window.nombre_usuario) {
      // Función 2
      $().SPServices({
          operation: "GetUserInfo",
          async: false,
          userLoginName: $().SPServices.SPGetCurrentUser(),
          completefunc: function (xData, Status) {
              // Esto convierte el XML obtenido en un objeto jQuery para facilitar su manipulación
              // Busca todos los elementos <User> dentro del XML
              $(xData.responseXML).find("User").each(function () {
                  // Obtiene el valor del atributo "Name" del elemento actual.
                  window.nombreCompleto = $(this).attr("Name");
                  let firstSpaceIndex = window.nombreCompleto.indexOf(" ");
                  let primerNombre = firstSpaceIndex !== -1 ? window.nombreCompleto.substring(0, firstSpaceIndex) : window.nombreCompleto;
                  window.nombre_usuario = primerNombre;
                  // Me permite extraer solo el nombre de usuario puesto que el xml me da la siguiente extructura : i:0#.w|bggrupo\klamilla
                  var loginName = $(this).attr("LoginName");
                  var parts = loginName.split("\\"); // Divide la cadena por el carácter '\'
                  window.current_user = parts[1]; // Toma la última parte de la división, que es el nombre de usuario
                  window.current_email = $(this).attr("Email");
              });
          }
      });
  }

  // Retorno de las variables current_user
  return {
    current_user: window.current_user,
    nombre_usuario: window.nombre_usuario,
    current_email : window.current_email,
    nombreCompleto : window.nombreCompleto
};
}

//Funcion para cargar y editar Navbar
function navbar(){
//   Accesos Restringido:
// Mesa de Ayuda - Explorador de Metadatos
// Mesa de Ayuda - Orígenes de Datos
// Mesa de Ayuda - Fuente de Aprovisionamiento
// Indicadores de Gestión
// Estrategia de Datos
  let restringidos = [
    "BuscadorCampos.aspx",
    "Origenes_datos.aspx",
    "FuentesAprovisionamiento.aspx",
    "IndicadoresGestion.aspx",
    "EstrategiadelDato.aspx",
    "Diagrama_DI.aspx",
  ]
  let split = window.location.pathname.split("/")
  let currentPage = split[split.length-1]
  if(!tieneAcceso() && !window.location.pathname.includes("SinAcceso.aspx") && restringidos.includes(currentPage) ){
      return window.location.replace(`${BASE_URL}SinAcceso.aspx`)
  }
  let html ='<li>\
              <a href="PoliticasProcedimientos.aspx">\
                <i class="iconsminds-letter-open"></i>\
                <span>Políticas y Procedimientos</span>\
              </a>\
            </li>\
            <li>\
              <a href="http://vamos.bancoguayaquil.com/sitios/informaciongerencial/DATAHUB/Produccion/index.aspx" target="_blank" class="icon-menu-item quicklinks" onmouseover="cambiarLogoDatahub(`img/datahub_logo.png`)" onmouseout="cambiarLogoDatahub(`img/datahub_logo_azul.png`)">\
                <div style="height:42px; width:42px; margin-bottom:2px;"> <img src="img/datahub_logo_azul.png" alt="Logo DataHub" id="logo-datahub-navbar" height=42 width=42 style="max-width:100% !important;"> </div>\
                <span>Data Hub</span>\
              </a>\
            </li>\
            <li>\
              <a href="LibroDominios.aspx">\
                <i class="iconsminds-library"></i> \
                <span>Libro de Dominios</span>\
              </a>\
            </li>\
            <li>\
              <a href="#glosario">\
                <i class="iconsminds-diploma-2"></i>\
                <span>Mesa de Ayuda de Datos</span>\
              </a>\
            </li>\
            <li>\
              <a href="IndicadoresGestion.aspx">\
                <i class="iconsminds-line-chart-1"></i> \
                <span>Indicadores de Gestión</span>\
              </a>\
            </li>\
            <li>\
              <a href='+`${tieneAcceso()?"#estrategia": "SinAcceso.aspx"}` +'>\
                <i class="iconsminds-idea"></i> \
                <span>Estrategia del Dato</span>\
              </a>\
            </li>\
            ';
            
            //submenu que se expande al hacer click en el navbar según las secciones correspondientes

  

  let submenu_html = '<ul class="list-unstyled" data-link="estrategia">\
                        <li>\
                          <a href="EstrategiadelDato.aspx">\
                          <i class="simple-icon-organization"></i> <span class="d-inline-block">Mapa Estratégico</span>\
                          </a>\
                        </li>\
                        <li>\
                          <a href="Diagrama_DI.aspx">\
                          <i class="iconsminds-monitor-analytics"></i> <span class="d-inline-block">Diagrama Data Index</span>\
                          </a>\
                        </li>\
                        <li>\
                        <a href="https://app.powerbi.com/reportEmbed?reportId=65827035-0efa-4a65-8274-d0bdb013aa37&autoAuth=true&ctid=78181095-efa1-4806-9626-ca6be188d1d0" target="_blank" >\
                          <i class="iconsminds-monitor-analytics"></i> <span class="d-inline-block">Data Index</span>\
                          </a>\
                        </li>\
                        <li>\
                          <a href="https://app.powerbi.com/reportEmbed?reportId=23d36fd2-e227-441a-a884-5782d2aef4d2&autoAuth=true&ctid=78181095-efa1-4806-9626-ca6be188d1d0" target="_blank">\
                            <i class="iconsminds-monitor-analytics"></i> <span class="d-inline-block">Maturity Level</span>\
                          </a>\
                        </li>\
                        <li>\
                          <a href="https://app.powerbi.com/links/L_mU-K9Pnf?ctid=78181095-efa1-4806-9626-ca6be188d1d0&pbi_source=linkShare" target="_blank">\
                            <i class="iconsminds-monitor-analytics"></i> <span class="d-inline-block">Uso de plataforma</span>\
                          </a>\
                        </li>\
                      </ul>\
                      <ul class="list-unstyled" data-link="glosario">\
                      <li style="margin-left:10px">\
                        <a href="Origenes_datos.aspx">\
                            <i class="iconsminds-big-data"></i>\
                            <span>Orígenes de datos</span>\
                        </a>\
                      </li>\
                        <li style="margin-left:10px">\
                          <a href="Glosario.aspx">\
                          <i class="iconsminds-open-book"></i> <span class="d-inline-block">Glosario Empresarial de Datos</span>\
                          </a>\
                        </li>\
                        <li style="margin-left:10px">\
                          <a href="Catalogo_Referencias.aspx">\
                          <i class="iconsminds-server-2"></i> <span class="d-inline-block">Catalogo de Referencias</span>\
                          </a>\
                        </li>\
                        <li style="margin-left:10px">\
                          <a href="FuentesAprovisionamiento.aspx">\
                          <i class="iconsminds-data-download"></i> <span class="d-inline-block">Fuentes Aprovisionamiento</span>\
                          </a>\
                        </li>\
                        ';

  
  if(localStorage.getItem("citizen")==null || localStorage.getItem("dataaccess")==null){
      let pertenece=revisar_usuario()
      localStorage.setItem('citizen', pertenece);
      let pertenece_seguridad = revisar_usuario(areas_revisar = ['SEGURIDAD DE LA INFORMACIÓN', 'GOBIERNO DE INFORMACION Y ANALITICA'])
      localStorage.setItem('dataaccess', pertenece_seguridad);
  }   
  let pertenece=localStorage.getItem("citizen")
  if(pertenece==="false"){
    submenu_html+='</ul>'
  }else{
    submenu_html+='<li style="margin-left:10px">\
    <a href="BuscadorCampos.aspx">\
    <i class="iconsminds-magnifi-glass"></i> <span class="d-inline-block">Explorador de Metadatos</span>\
    </a>\
  </li>\
</ul>'
  }
  //HTML a insertar en la barra de navegación horizontal, incluye las apps, botón de logoff y el nombre del usuario
  //La parte de dataaccess solo lo habilito para seguridad de la información
  let pertenece_seguridad=localStorage.getItem("dataaccess")
  if (pertenece_seguridad === "true"){
  var bloque_seguridad = '   <p   class="icon-menu-item quicklinks " onclick="mostrarAccesos()" >\
                          <i class="simple-icon-user-following" style="font-size:50px;color:#D2006E"></i>\
                          <span>Accesos</span>\
                        </p>'
                      
  var bloque_seguridad_autorizaciones = `\
                        <a href="${BASE_URL}Autorizacion.aspx" class="icon-menu-item quicklinks">\
                            <i class="simple-icon-note" style="font-size:50px;color:#D2006E"></i>\
                            <span>Autorización</span>\
                        </a>`
  }else {
    var bloque_seguridad = ''
    var bloque_seguridad_autorizaciones = ''
  }

  let opcionFavoritos = `
    <div class="position-relative d-none d-sm-inline-block" >\
      <button class="header-icon btn btn-empty" type="button" id="favoritosButton" data-toggle="dropdown"\
      aria-haspopup="true" aria-expanded="false">\
        <i class="simple-icon-star" data-toggle="tooltip" data-placement="bottom" title="Favoritos" id="iconoFavoritos"></i>\
      </button>\
      <div class="dropdown-menu dropdown-menu-right mt-3 px-2 position-absolute" id="favoritosMenuDropwdown" style="height: 460px; width:380px; padding:1rem !important;" onclick="event.stopPropagation()">
        <h5>Guardar en Favoritos</h5>
        
        <!-- Input para el nombre del marcador -->
        <label for="bookmark-name" class="m-0">Nombre del marcador:</label>
        <input id="bookmark-name" placeholder="" value="${document.title}" type="text" style="width:100%; margin-bottom: 5px; height:auto;" class="form-control rounded-lg py-1"/>
        
        <!-- Input para la URL (no editable, solo muestra la actual) -->
        <label for="bookmark-url" class="m-0">URL del marcador:</label>
        <input id="bookmark-url" value=${window.location.href} type="text" style="width:100%; margin-bottom: 5px;height:auto;" class="form-control rounded-lg py-1"/>
        
        <div class="d-flex align-items-center justify-content-between">
          <h6 class="w-50 m-0"> Mis Favoritos </h6>
          <!-- Botón para añadir a favoritos -->
          <button id="btnAddFavorite" class="btn-primary rounded-lg" style="padding: .25rem .75rem; border: none; cursor: pointer;" onclick=addFavorite()>Guardar</button>
        </div>
        <div class="d-flex flex-column pr-1 pt-1 mt-1" style="height:280px;" >
          <div id="favoriteListWrapper" class="
          p-1 overflow-auto" style="height:90%;">
            
          </div>
        </div>
      </div>\
  </div>
  `
  let userCode = getEmployeeCodeByUser()
  let mesActualTexto = new Date(new Date().setMonth(new Date().getMonth()))
    .toISOString()
    .slice(0, 7);
  let [aporte,aporteDesglosado] = Object.values(getAportes({usuario:userCode, mes:mesActualTexto}))
  let tablasOwnerDesglosado = getTablasOwnerDesglosado(userCode);
  if(!aporteDesglosado) aporteDesglosado = {}
  if(!tablasOwnerDesglosado) tablasOwnerDesglosado = {}
  let opcionEstadisticas = `
    <div class="position-relative d-none d-sm-inline-block" >\
      <button class="header-icon btn btn-empty" type="button" id="estadisticasButton" data-toggle="dropdown"\
      aria-haspopup="true" aria-expanded="false" >\
        <i class="simple-icon-chart" data-toggle="tooltip" data-placement="bottom" title="Estadísticas"></i>\
      </button>\
      <div class="dropdown-menu dropdown-menu-right mt-3 px-2 position-absolute" id="estadisticasMenuDropwdown" style="width:350px; padding:1rem !important;" onclick="event.stopPropagation()">
        <h5>Estadísticas</h5>
        <div>
          <div class="estadisticas">
            <div class="py-2 d-flex align-items-center" data-toggle="tooltip" title="Aporte de documentación de entidades pendientes del mes actual." ><span class="estadisticas__numero-titulo bg-primary">1</span><span class="estadisticas__titulo">Entidades pendientes</span></div>
            <div class="d-flex justify-content-center align-items-center" style="padding-right:1.5rem !important;">
              <div class="w-50"><p class="estadisticas__valor">${ aporte?.toFixed(2) || "--"}</p><p class="text-secondary text-center">${aporte?"puntos":""}</p></div>
              <div class="estadisticas__card-layout">
                <div class="estadisticas__card-wrapper">
                  <p class="estadisticas__card-texto" data-toggle="tooltip" title="Data Owner">DO</p>
                  <p>${aporteDesglosado["Cambio Data Owner"]?.toFixed(2) || 0}</p>
                </div>
                <div class="estadisticas__card-wrapper">
                  <p class="estadisticas__card-texto" data-toggle="tooltip" title="Data Steward">DS</p>
                  <p>${aporteDesglosado["Cambio Datasteward"]?.toFixed(2) || 0}</p>
                </div>
                <div class="estadisticas__card-wrapper" data-toggle="tooltip" title="Descripción">
                  <p class="estadisticas__card-texto">DESC</p>
                  <p>${aporteDesglosado["Descripcion"]?.toFixed(2) || 0}</p>
                </div>
                <div class="estadisticas__card-wrapper" data-toggle="tooltip" title="Tipo">
                  <p class="estadisticas__card-texto">TIPO</p>
                  <p>${aporteDesglosado["Actualización de clasificación"]?.toFixed(2) || 0}</p>
                </div>
              </div>
            </div>
          </div>
          <div class="estadisticas">
            <div class="py-2 d-flex align-items-center" data-toggle="tooltip" title="Cantidad de tablas donde se encuentra como Data Owner y sus etiquetas."><span class="estadisticas__numero-titulo bg-primary">2</span><span class="estadisticas__titulo">Clasificación Tiering</span></div>
             <div class="d-flex justify-content-center align-items-center" style="padding-right:1.5rem !important;">
              <div class="w-50"><p class="estadisticas__valor">${ tablasOwnerDesglosado["total"] || "--"}</p><p class="text-secondary text-center">${tablasOwnerDesglosado["total"]?"entidades":""}</p></div>
              <div class="estadisticas__card-layout">
                <div class="estadisticas__card-wrapper">
                  <p class="estadisticas__card-texto"  data-toggle="tooltip" title="Oro">ORO</p>
                  <p>${tablasOwnerDesglosado["ORO"] || 0}</p>
                </div>
                <div class="estadisticas__card-wrapper">
                  <p class="estadisticas__card-texto" data-toggle="tooltip" title="Plata">PLATA</p>
                  <p>${tablasOwnerDesglosado["PLATA"] || 0}</p>
                </div>
                <div class="estadisticas__card-wrapper">
                  <p class="estadisticas__card-texto" data-toggle="tooltip" title="Bronce">BR</p>
                  <p>${tablasOwnerDesglosado["BRONCE"] || 0}</p>
                </div>
                <div class="estadisticas__card-wrapper">
                  <p class="estadisticas__card-texto" data-toggle="tooltip" title="Sin clasificación">SC</p>
                  <p>${tablasOwnerDesglosado["SC"]||0}</p>
                </div>
              </div>
            </div>
          </div>
          <div class="estadisticas">
            <div class="py-2 d-flex align-items-center" data-toggle="tooltip" title="Cantidad de tablas oficiales donde es Data Owner con y sin documentación."><span class="estadisticas__numero-titulo bg-primary">3</span><span class="estadisticas__titulo">Documentación de tablas</span></div>
            <div class="d-flex justify-content-between w-100">
              
              <div class="d-flex justify-content-center align-items-center w-100 flex-column">
                <div class="chart-container" style="width:100%; height: 135px;">
                  <canvas id="chartDocumentacionOficiales"><canvas>
                </div>
              </div>  
            </div>

          </div>
        </div>
        
      </div>\
    </div>
  `
          
  let nav_horizontal = `<div class="icon-container position-relative d-none d-sm-inline-flex">\
                    <p class="header-icon">Primero ${nombre_usuario}</p>\
                  </div>\
                  ${opcionFavoritos}${opcionEstadisticas}<div class="position-relative d-none d-sm-inline-block">\
                    <a href="SobreOGA.aspx" class="header-icon" data-toggle="tooltip" data-placement="bottom" title="Acerca de OGA">\
                      <i class="simple-icon-question"></i>\
                    </a>\
                  </div>\
                  <div class="position-relative d-none d-sm-inline-block">\
                    <button class="header-icon btn btn-empty" type="button" id="iconMenuButton" data-toggle="dropdown"\
                    aria-haspopup="true" aria-expanded="false">\
                      <i class="simple-icon-grid" data-toggle="tooltip" data-placement="bottom" title="Nuestras Apps"></i>\
                    </button>\
                    <div class="dropdown-menu dropdown-menu-right mt-3  position-absolute" id="iconMenuDropdown" style="height:auto; padding-bottom:0px;">\
                      <a href="http://vamos.bancoguayaquil.com/sitios/informaciongerencial/DATAHUB/Produccion/index.aspx" target="_blank" class="icon-menu-item quicklinks">\
                        <img src="img/datahub.png" alt="Logo DataHub">\
                        <span>Data Hub</span>\
                      </a>\
                      <a href="https://teams.microsoft.com/l/app/f6405520-7907-4464-8f6e-9889e2fb7d8f?templateInstanceId=2a7c31f4-1932-47e7-8b40-63b22c11f965&environment=02ff268d-2f9a-ea52-a119-be7980914103" target="_blank" class="icon-menu-item quicklinks">\
                        <img src="img/OGA_icon.png" alt="Logo Buen Dato">\
                        <span>Buen Dato</span>\
                      </a>\
                      <a href="http://vamos.bancoguayaquil.com/sitios/informaciongerencial" target="_blank" class="icon-menu-item quicklinks">\
                        <img src="img/Banco-G-Logo-transparent.png" alt="Banco Guayaquil Logo">\
                        <span>Infórmate</span>\
                      </a>\
                      ${bloque_seguridad}\
                      ${bloque_seguridad_autorizaciones}\
                      <a href="${BASE_URL}Nomenclaturas_campañas.aspx" class="icon-menu-item quicklinks">\
                      <i class="iconsminds-key" style="font-size:50px;color:#D2006E"></i>\
                      <span style ="padding:1px;">Formulario</span>\
                      </a>\
                      <a href="${BASE_URL}Entidades_Pendientes.aspx" class="icon-menu-item quicklinks">\
                      <i class="iconsminds-file-edit" style="font-size:50px;color:#D2006E"></i>\
                      <span style ="padding:1px;">Entidades Pendientes</span>\
                      </a>\
                      <a href="${BASE_URL}AdministracionAtributos.aspx" class="icon-menu-item quicklinks">\
                      <i class="iconsminds-box-with-folders" style="font-size:50px;color:#D2006E"></i>\
                      <span style ="padding:1px;">Administración de Atributos</span>\
                      </a>\
                    </div>\
                  </div>\
                  <div class="position-relative d-none d-sm-inline-block">\
                    <a href="http://vamos.bancoguayaquil.com/" class="header-icon" data-toggle="tooltip" data-placement="bottom" title="" data-original-title="Log Off">\
                      <i class="simple-icon-power"></i>\
                    </a>\
                  </div>`;
    

  //Sección para cargar scripts y links para el Modal de Accesos                
  let scripts_Accesos=["js/vendor/select2.full.js","js/vendor/datatables.min.js"] // scripts que necesito cargar
   let scripts=document.getElementsByTagName("script")//verifico si ya no están cargados


      scripts_Accesos.forEach(element => {
        let encontrado=false
        $.each(scripts,function(index,item){

        if((item.src).includes(element)){
            encontrado=true
        }
      });
      //si no están cargados, lo hago
      if(encontrado==false){
        let script=document.createElement('script')
        script.src = element
        document.body.appendChild(script)
      }
    });
   
  // links para cargar en el modal de accesos 
let links_accesos=["css/vendor/select2.min.css","css/vendor/select2-bootstrap.min.css","css/vendor/dataTables.colResize.css"]
let links=document.getElementsByTagName("link") // links generales


links_accesos.forEach(element => {
  let encontrado=false
  $.each(links,function(index,item){

  if((item.href).includes(element)){
      encontrado=true
  }
});
//los cargo si no los encuentra 
if(encontrado==false){
  var link = document.createElement('link');
  link.rel = "stylesheet";
  link.href = element;
  document.head.appendChild(link);
}
});
      if(document.querySelector("#app-container > nav > div.d-flex.align-items-center.navbar-left > div")!==null){
        document.querySelector("#app-container > nav > div.d-flex.align-items-center.navbar-left > div").remove()

      }

  //html accesos
  let divElement=document.createElement("div")
  divElement.innerHTML='<div class="modal fade" id="modalAccesos"  role="dialog" aria-labelledby="detalleModalLabel" aria-hidden="true">\
  <div class="modal-dialog modal-lg" role="document">\
    <div class="modal-content">\
      <div class="modal-header p-3">\
          <h3 class="modal-title" id=""> Accesos </h3>\
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">\
          <span aria-hidden="true">&times;</span>\
        </button>\
      </div>\
      <div class="modal-body">\
          <div class="card mb-4">\
              <div class="card-body">\
                  <form>\
                      <div class="form-row">\
                          <div class="form-group col-md-4">\
                              <label for="servidorSl"\
                              class="col-form-label">Servidor:</label>\
                          <select style="height:34px" type="text" class="form-control" id="servidorSl">\
                              <option label="&nbsp;">&nbsp;</option>\
                          </select>\
                          </div>\
                          <div class="form-group col-md-4">\
                              <label for="baseSl"\
                                  class="col-form-label">Base:</label>\
                                  <select data-width="100%"  class="form-control select2-multiple select2-hidden-accessible" multiple="multiple"  aria-hidden="true" type="text"  id="baseSl">\
                                  <option label="&nbsp;">&nbsp;</option>\
                              </select>\
                          </div>\
                          <div class="form-group col-md-4">\
                              <label for="esquemaSl"\
                                  class="col-form-label">Esquema:</label>\
                              <select  style="height:34px" type="text" class="form-control" id="esquemaSl">\
                                      <option label="&nbsp;">&nbsp;</option>\
                                  </select>\
                          </div>\
                      </div>\
                      <div class="form-row mt-1">\
                          <div class="form-group col-md-5">\
                              <label for="areaSl"\
                                  class="col-form-label">Área:</label>\
                                  <select style="height:34px" type="text" class="form-control" id="areaSl">\
                                      <option label="&nbsp;">&nbsp;</option>\
                                  </select>\
                          </div>\
                          <div class="form-group col-md-5">\
                              <label for="centroSl"\
                                  class="col-form-label">Centros de Costo:</label>\
                              <select data-width="100%"  type="text"   class="form-control select2-multiple select2-hidden-accessible"  multiple="multiple" aria-hidden="true" type="text"id="centroSl">\
                                  <option label="&nbsp;">&nbsp;</option>\
                              </select>\
                          </div>\
                          <div class="form-group col-md-2 mt-4 pl-3"><button type="button" id="btnAcceso" class="btn btn-secondary">Guardar</button></div>\
                      </div>\
                  </form>\
                  <table id="accesos" class="table mt-4" >\
                  <thead>\
                      <tr>\
                          <th>Plataforma</th>\
                          <th>Servidor</th>\
                          <th>Base</th>\
                          <th>Esquema</th>\
                          <th>Área</th>\
                          <th>Centro de Costo</th>\
                      </tr>\
                  </thead>\
                  <tbody>\
                  </tbody>\
              </table>\
              </div>\
      </div>\
</div>\
  </div>\
  </div>\
</div>'
  document.body.append(divElement)
 document.getElementById("suite-navbar").innerHTML = html;
  document.getElementById("sub-menu-suite").innerHTML = submenu_html;
  document.querySelector("#app-container > nav > div.navbar-right > div").innerHTML = nav_horizontal;
  //document.querySelector("#app-container > nav > div.d-flex.align-items-center.navbar-left > div").remove()
  $('[data-toggle="tooltip"]').tooltip();
  //Configuración dinámica para indicador de la página en la que el usuario se encuentra
  let current_url = window.location.href;
  let sitio = current_url.split("/");
  sitio = sitio[sitio.length-1];
  let nav_ele = $('#suite-navbar li a[href="'+ sitio +'"]');
  if(nav_ele[0]){
    nav_ele[0].parentNode.classList.add("active");
  }else{
    nav_ele = $('#sub-menu-suite li a[href="'+ sitio +'"]');
    if(!nav_ele[0]) return
    nav_ele[0].parentNode.classList.add("active");
    let main_nav = nav_ele[0].parentNode.parentNode.getAttributeNode("data-link");
    let main_nav_ele = $('#suite-navbar li a[href="#'+ main_nav.value +'"]');
    main_nav_ele[0].parentNode.classList.add("active");
  }

}

function cambiarLogoDatahub(src){
  let img =  document.getElementById("logo-datahub-navbar") 
  img.src= src;
}

function documentIncludesScript(src) {
  // Buscar si ya existe un script con ese src en el documento
  return document.querySelector(`script[src="${src}"]`) ? true : false;
}


$( document ).ready(function() {
  navbar();
  Promise.all([
    loadScript('js/vendor/Chart.bundle.min.js'),
    // loadScript('js/vendor/chartjs-plugin-datalabels.js'),
    // loadScript('https://code.jquery.com/ui/1.12.1/jquery-ui.min.js')
  ]).then(function(){
    setChartDocumentacionOficiales();
    setFavoriteList();
  })
});

// Función para cargar scripts dinámicamente
function loadScript(url, callback) {
  if(documentIncludesScript(url)) return;
  return new Promise(function(resolve, reject) {
    var script = document.createElement('script');
    script.src = url;
    script.onload = resolve;
    script.onerror = reject;
    document.body.appendChild(script);
  });
}

function setChartDocumentacionOficiales(){
  let percentagesDrawn = 0;
  let tablasOficialesDesglosado = getTablasOwnerDesglosado(getEmployeeCodeByUser());
  let tablasDocumentadas = tablasOficialesDesglosado.documentadas;
  let tablasSinDocumentar = tablasOficialesDesglosado.sinDocumentar
  let chartTooltip = {
    borderWidth: 0.5,
    bodySpacing: 10,
    xPadding: 15,
    yPadding: 15,
    cornerRadius: 0.15,
    displayColors: false,
    backgroundColor: 'rgba(0, 0, 0, 1)', // Cambia a tu color deseado con opacidad 1
    titleFontColor: 'rgba(255, 255, 255, 1)', // Color del título con opacidad 1
    bodyFontColor: 'rgba(255, 255, 255, 1)', // Color del texto del cuerpo con opacidad 1
  };

  // Define el texto que quieres mostrar en el centro
  let centerText = tablasOficialesDesglosado.totalOficiales.toString();

  // Registra el plugin personalizado
  const centerTextPlugin = {
    afterDatasetsUpdate: function (chart) { },
    beforeDraw: function (chart) {
      var width = chart.chartArea.right;
      var height = chart.chartArea.bottom;
      var ctx = chart.chart.ctx;
      ctx.restore();

      var activeLabel = chart.data.labels[0];
      var activeValue = chart.data.datasets[0].data[0];
      var dataset = chart.data.datasets[0];
      var meta = dataset._meta[Object.keys(dataset._meta)[0]];
      var total = meta.total;

      var activePercentage = parseFloat(
        ((activeValue / total) * 100).toFixed(1)
      );
      activePercentage = chart.legend.legendItems[0].hidden
        ? 0
        : activePercentage;

      if (chart.pointAvailable) {
        activeLabel = chart.data.labels[chart.pointIndex];
        activeValue =
          chart.data.datasets[chart.pointDataIndex].data[chart.pointIndex];

        dataset = chart.data.datasets[chart.pointDataIndex];
        meta = dataset._meta[Object.keys(dataset._meta)[0]];
        total = meta.total;
        activePercentage = parseFloat(
          ((activeValue / total) * 100).toFixed(1)
        );
        activePercentage = chart.legend.legendItems[chart.pointIndex].hidden
          ? 0
          : activePercentage;
      }

      ctx.font = "1rem" + " Nunito, sans-serif";
      ctx.fillStyle = "#373737";
      ctx.textBaseline = "middle";

      var text = tablasOficialesDesglosado.totalOficiales || "0",
        textX = Math.round((width - ctx.measureText(text).width) / 2),
        textY = height / 2 - 5;
      ctx.fillText(text, textX, textY);

      ctx.font = "0.75rem" + " Nunito, sans-serif";
      ctx.textBaseline = "middle";

      var text2 = "Tablas",
        textX = Math.round((width - ctx.measureText(text2).width) / 2),
        textY = height / 2 + 15;
      ctx.fillText(text2, textX, textY);

      ctx.save();
    },
  };


  let doughnut = document.getElementById("chartDocumentacionOficiales")
  const documentacionCart = new Chart(doughnut, {
    plugins:[centerTextPlugin],
    type: "doughnut",
    data: {
        labels: ["Documentas", "Sin Documentar"],
        datasets: [{
            label: "",
            borderColor: ["#D2006E", "#160F41"],
            backgroundColor: ["#D2006E", "#160F41"],
            borderWidth: 2,
            // data: [valor > 100 ? 0 : valor, valor > 100? 100 : 100 - valor]
            data: [tablasDocumentadas,tablasSinDocumentar]
        }]
    },
    options: {
        elements: {
        },
        plugins: {
            datalabels: {
                display: false
            }
        },
        responsive: true,
        maintainAspectRatio: false,
        cutoutPercentage: 80,
        title: {
            display: false,
            text: "Documentación de tablas",
            fontStyle: "Nunito, sans-serif",
            minFontSize: 28,
            maxFontSize: 28
        },
        layout: {
            padding: {
                bottom: 20
            }
        },
        legend: {
            display: true,
            position: "bottom",
        }
    }
  });
}

function accesos(){

  let script2=document.createElement('script')
script2.src = 'js/vendor/dataTables.Resize.js'
document.body.appendChild(script2)


  let accesos_pg=getInfoAccesos()
  let fuentesApro=getInfoFuentesAprovisionamiento()
  let areas=getAreasyCentros()
  loadOptionsAccesos("areaSl",areas[0])
  window.fuentes_aprovisionamiento=fuentesApro[0]
  
  window.accesosp=accesos_pg
  
 
  listenerSelect(areas[2]);
  //solo cargar valores de servidor y area
  loadOptionsAccesos("servidorSl",fuentesApro[1]);
  listenerBtnAccesos()
}

function listenerBtnAccesos(){
  document.getElementById("btnAcceso").addEventListener("click",function(e){
    e.preventDefault()
    e.stopImmediatePropagation()
    
      let servidort=$("#servidorSl").val()
      let baset=$("#baseSl").val()//multiple
      let esquemat=$("#esquemaSl").val()
      let areat=$("#areaSl").val()
      let centrot=$("#centroSl").val()//mulitple
 
      if((servidort!==" ") && (esquemat!==" ")  ){
        if((baset.length>0)&& (centrot.length>0) && (areat!==" ")){
          let diccionario_escritura={}
          let indices=[]
          //buscar y eliminar de window.accesosp solo la primera vez
          $.each(window.accesosp,function(index,item){
            baset.forEach(element => {
              if(item["servidor"]==servidort && item["base"]==element && item["esquema"]==esquemat){     
                indices.push(index)
                diccionario_escritura[servidort+"_"+element+"_"+esquemat]=["actualizar",servidort,element,esquemat]
            }
              
            
            }); 
          });
          //verificar cuales se deben escribir
          baset.forEach(baseEscribir => {
            if(diccionario_escritura[servidort+"_"+baseEscribir+"_"+esquemat]===undefined){
              diccionario_escritura[servidort+"_"+baseEscribir+"_"+esquemat]=["escribir",servidort,baseEscribir,esquemat]
            }
          });
          indices.sort(function (a, b) {
            return b - a;
          });
          indices.forEach(element => {
            window.accesosp.splice(element,1)
          });
          //añadir todas 
          baset.forEach(element1 => {
            centrot.forEach(element2 => {
              let plataformat=" "
                  $.each(window.fuentes_aprovisionamiento,function(index2,item2){
                    if(item2["servidor"]==servidort && item2["base"]==element1 && item2["esquema"]==esquemat){
                      if(plataformat==" "){
                        plataformat=item2["plataforma"]
                        diccionario_escritura[servidort+"_"+element1+"_"+esquemat].push(plataformat)
                        }   
                    }
                  });
              let elemento={
                servidor:servidort,
                base:element1,
                esquema:esquemat,
                plataforma:plataformat,
                area:areat,
                centro:element2
              } 
              window.accesosp.push(elemento)   
            });
          });


      redrawDataTable("accesos",window.accesosp)
      //escribir los cambios en doc si ya existe el esquema/base/servidor - actualizar el centro y area
      //recorrer diccionario
      Object.entries(diccionario_escritura).forEach(([key, value]) => {
        let cambio=[]
        centrot.forEach(element => {
          cambio.push(areat+"||"+element)
        });
        let cambiofinal=cambio.join("|||")
        
        if(value[0]=="escribir"){
          escribirAccesos(value[4],value[1],value[2],value[3],cambiofinal)
        }else if(value[0]=="actualizar"){
          actualizarAccesos(value[4],value[1],value[2],value[3],cambiofinal)
        }
      });

        
        }
        
      }

  });
}
function loadOptionsAccesos(id,data){

  data.sort()
  let option;
  let x= document.getElementById(id)
    data.forEach(element => {
      option = document.createElement("option");
                      option.text = element;
                      option.value= element;
                      x.add(option);
    });
}

function removeOptions(selectElement,id) {
  var i, L = selectElement.options.length - 1;
  for(i = L; i >= 0; i--) {
    if(selectElement.options[i].innerHTML!="&nbsp;"){
    //  selectElement.remove(i);
    $("#"+id+" option[value='"+selectElement.options[i].innerHTML+"']").remove();
    }
  }
}



function listenerSelect(dicAreas){

  $('#areaSl').on('select2:select', function (e) {
    let centros=[]
    //delete anteriores
   removeOptions(document.getElementById('centroSl'),"centroSl");
   //let optionsAnt= document.getElementById("baseSl")
   //let opt=optionsAnt.options
  // $.each(opt,function(index,item){
  
  //})
    var data = e.params.data;  
    let etiqueta=data.id
 
    
    $.each(dicAreas,function(index,item){
        if(item["area"]==etiqueta){
          if(item["centro"]!=" " && !centros.includes(item["centro"])){
            centros.push(item["centro"])
          }
        }
    });
    loadOptionsAccesos("centroSl",centros)
  
  });

//en caso de que seleccione un servidor, muestra base
$('#servidorSl').on('select2:select', function (e) {
  let bases=[]
  //delete anteriores
 removeOptions(document.getElementById('baseSl'),"baseSl");
 //let optionsAnt= document.getElementById("baseSl")
 //let opt=optionsAnt.options
// $.each(opt,function(index,item){

//})
  var data = e.params.data;  
  let etiqueta=data.id

  
  $.each(window.fuentes_aprovisionamiento,function(index,item){
      if(item["servidor"]==etiqueta){
        if(item["base"]!=" " && !bases.includes(item["base"])){
          bases.push(item["base"])
        }
      }
  });
 
  loadOptionsAccesos("baseSl",bases)

});


//si selecciona base, muestro esquema
$('#baseSl').on('select2:select', function (e) {
  let esquemas=[]
  var data = e.params.data;  
  let etiqueta=data.id

  removeOptions(document.getElementById('esquemaSl'),"esquemaSl");

  $.each(window.fuentes_aprovisionamiento,function(index,item){
      if(item["base"]==etiqueta && item["servidor"]==$("#servidorSl").val()){
        if(item["esquema"]!=" " && !esquemas.includes(item["esquema"])){
          esquemas.push(item["esquema"])
        }
      }
  });
  loadOptionsAccesos("esquemaSl",esquemas)

});

}
function mostrarAccesos(){
  accesos()
  setdataTableAccesos(window.accesosp);
  $('#esquemaSl').select2({
    theme: "bootstrap",  
    placeholder: "",
    maximumSelectionSize: 6,
    containerCssClass: ":all:",
});
$('#servidorSl').select2({
  theme: "bootstrap",  
  placeholder: "",
  maximumSelectionSize: 6,
  containerCssClass: ":all:",
});
$('#areaSl').select2({
  theme: "bootstrap",  
  placeholder: "",
  maximumSelectionSize: 6,
  containerCssClass: ":all:",
});
$(".select2-multiple").select2({
  theme: "bootstrap",
 // dir: direction,
  //allowClear:true,
  //placeholder: "Seleccionar",
  maximumSelectionSize: 6,
  containerCssClass: ":all:",
 // dropdownParent: $('#modalAccesos')
});
$("#modalAccesos").modal("show");
$('#modalAccesos').on('hidden.bs.modal', function(){
  $('#servidorSl').val(null).trigger('change');
  $('#baseSl').val(null).trigger('change');
  $('#esquemaSl').val(null).trigger('change');
  $('#areaSl').val(null).trigger('change');
  $('#centroSl').val(null).trigger('change');
 })

}
//funcion para obtener dominios con CAMLQuery al momento de ejecutar llamado.
//como parametros el usuario ingresa valor a buscar y de ser necesario especifica el tipo de dato de la columna
function searchDominios(columna,valor, tipo="Text"){
  let dominio;
  $().SPServices({
    operation: "GetListItems",
    async: false,
    listName: "Z_DOMINIOS",
    CAMLQuery: "<Query><Where><Eq><FieldRef Name='"+ columna +"'/><Value Type='"+ tipo +"'>"+ valor +"</Value></Eq></Where></Query>",
    CAMLViewFields: "<ViewFields>\
                          <FieldRef Name='codigo_Dominio' />\
                          <FieldRef Name='descripcion_dominio' />\
                          <FieldRef Name='Conceptos_Clave' />\
                          <FieldRef Name='descripcion' />\
                          <FieldRef Name='COM' />\
                          <FieldRef Name='IMPACT' />\
                          <FieldRef Name='tipo_dominio' />\
                          <FieldRef Name='Familia_de_Dominios' />\
                          <FieldRef Name='lider_sugerido' />\
                          <FieldRef Name='atributos_basicos' />\
                          <FieldRef Name='id_tipo_dominio' />\
                          <FieldRef Name='id_tipo_familia' />\
                          <FieldRef Name='id_dominio' />\
                          <FieldRef Name='sn_activo' />\
                          <FieldRef Name='porcentaje_avance_dominio' />\
                          <FieldRef Name='cant_atributos' />\
                          <FieldRef Name='cant_terminos' />\
                          <FieldRef Name='cant_modelos' />\
                          <FieldRef Name='cant_estructura' />\
                          <FieldRef Name='subdominios' />\
                    </ViewFields>",
    completefunc: function (xData, Status) {
        $(xData.responseXML).find("z\\:row").each(function () {
                dominio = $(this);
        });
    }
  });
  return dominio
}

//Obtener todos los Dominios y por separado los derivados, transaccionales y maestros
function getDominiosAll(){
  let dominios = [];
  let maestros = [];
  let derivados = [];
  let transaccionales = [];
  $().SPServices({
    operation: "GetListItems",
    async: false,
    listName: "Z_DOMINIOS",
    CAMLViewFields: "<ViewFields>\
                        <FieldRef Name='codigo_Dominio' />\
                        <FieldRef Name='descripcion_dominio' />\
                        <FieldRef Name='Conceptos_Clave' />\
                        <FieldRef Name='descripcion' />\
                        <FieldRef Name='COM' />\
                        <FieldRef Name='IMPACT' />\
                        <FieldRef Name='tipo_dominio' />\
                        <FieldRef Name='Familia_de_Dominios' />\
                        <FieldRef Name='lider_sugerido' />\
                        <FieldRef Name='atributos_basicos' />\
                        <FieldRef Name='id_tipo_dominio' />\
                        <FieldRef Name='id_tipo_familia' />\
                        <FieldRef Name='id_dominio' />\
                        <FieldRef Name='sn_activo' />\
                        <FieldRef Name='porcentaje_avance_dominio' />\
                        <FieldRef Name='cant_atributos' />\
                        <FieldRef Name='cant_terminos' />\
                        <FieldRef Name='cant_modelos' />\
                        <FieldRef Name='cant_estructura' />\
                        <FieldRef Name='subdominios' />\
                    </ViewFields>",
    completefunc: function (xData, Status) {
        $(xData.responseXML).find("z\\:row").each(function () {
            if($(this).attr("ows_tipo_dominio")=="Dominio Maestro") maestros.push($(this));
            if($(this).attr("ows_tipo_dominio")=="Dominio Derivado") derivados.push($(this));
            if($(this).attr("ows_tipo_dominio")=="Dominio Transaccional") transaccionales.push($(this));
            dominios.push($(this));
        });
    }
  });
  return {dominios, maestros, derivados, transaccionales}
}

//Función para obtener número de catálogos 

function getNumCatalogos(){
  let numero=0
  $().SPServices({
    operation: "GetListItems",
    async: false,
    listName: "Z_CATALOGO_REFERENCIA",
    CAMLViewFields: "<ViewFields>\
                        <FieldRef Name='Vista' />\
                        <FieldRef Name='Codigo' />\
                        <FieldRef Name='Descripcion' />\
                        <FieldRef Name='TipoCatalogo' />\
                        <FieldRef Name='Detalle' />\
                        <FieldRef Name='Plataforma' />\
                        <FieldRef Name='Servidor' />\
                        <FieldRef Name='Base' />\
                    </ViewFields>",
    completefunc: function (xData, Status) {
        $(xData.responseXML).find("z\\:row").each(function () {
          numero+=1;
        });
    }
  });
  
  return numero
}


//Funcion para obtener los dominios de un usuario, se ingresa como parametro un arreglo de dominios.
//El CAMLQuery implementa window.current_user para identificar el usuario actual y así filtrar la lista Z_ESTRUCTURA_DOMINIO
function getDominiosUsuario(dominios){
  let mis_dominios = [];
  let maestros = [];
  let derivados = [];
  let transaccionales = [];
  $().SPServices({
    operation: "GetListItems",
    async: false,
    listName: "Z_ESTRUCTURA_DOMINIO",
    CAMLQuery: "<Query><Where><Eq><FieldRef Name='usuario'/><Value Type='text'>"+ window.current_user +"</Value></Eq></Where></Query>",
    CAMLViewFields: "<ViewFields>\
                        <FieldRef Name='id_dominio' />\
                        <FieldRef Name='descripcion_dominio' />\
                        <FieldRef Name='id_subdominio' />\
                        <FieldRef Name='txt_desc_subdominio' />\
                        <FieldRef Name='id_participante' />\
                        <FieldRef Name='nombre_integrante' />\
                        <FieldRef Name='nombre_arreglado' />\
                        <FieldRef Name='cargo' />\
                        <FieldRef Name='area' />\
                        <FieldRef Name='id_roles_gobierno' />\
                        <FieldRef Name='txt_desc_roles_gobierno' />\
                        <FieldRef Name='agencia' />\
                        <FieldRef Name='region' />\
                        <FieldRef Name='es_suplente' />\
                        <FieldRef Name='id_principal' />\
                        <FieldRef Name='nombre_principal' />\
                        <FieldRef Name='usuario' />\
                    </ViewFields>",
    completefunc: function (xData, Status) {
        $(xData.responseXML).find("z\\:row").each(function () {
            mis_dominios.push($(this).attr("ows_descripcion_dominio"));
        });
    }
  });
  mis_dominios = [... new Set(mis_dominios)];
  let dominios_usuario = [];
  for (let n = 0; n < mis_dominios.length; n++) {
    $.each(dominios,function(index,item){
      if(item.attr("ows_descripcion_dominio") == mis_dominios[n]){
        dominios_usuario.push(item);
        if(item.attr("ows_tipo_dominio")=="Dominio Maestro") maestros.push(item);
        if(item.attr("ows_tipo_dominio")=="Dominio Derivado") derivados.push(item);
        if(item.attr("ows_tipo_dominio")=="Dominio Transaccional") transaccionales.push(item);
        return false;
      }
    });
  }
  return {dominios_usuario, maestros, transaccionales, derivados}
}

//Obtener todos los avances y sus IDs
function getAvancesAll(){
  let avances = [];
  let id = [];
  $().SPServices({
    operation: "GetListItems",
    async: false,
    listName: "Z_AVANCES_DOMINIO",
    CAMLViewFields: "<ViewFields>\
                        <FieldRef Name='fecha_carga' />\
                        <FieldRef Name='oleada' />\
                        <FieldRef Name='id_dominio' />\
                        <FieldRef Name='descripcion_dominio' />\
                        <FieldRef Name='id_paso' />\
                        <FieldRef Name='txt_desc_paso' />\
                        <FieldRef Name='estado_paso' />\
                        <FieldRef Name='porcentaje_avance_orig' />\
                    </ViewFields>",
    completefunc: function (xData, Status) {
        $(xData.responseXML).find("z\\:row").each(function () {
          id.push($(this).attr("ows_id_dominio"));
          avances.push($(this));
        });
    }
  });
  let ids = [...new Set(id)]
  return {avances, ids}
}

function getSegmentos(){
  let catalogoSegmentador = getCatalogoSegmentador()
  let subsegmentos = {}
  let data = {}
  Object.values(catalogoSegmentador).forEach(values=>{
    // Validar si existe o no subsegmento al ver si values tiene más de 1 elemento
    if(values.length>1){
      if(!subsegmentos[values[0].segmento]) subsegmentos[values[0].segmento] = {}
      values.forEach(obj=> {
        data[obj.value] = []
        // Crear claves de subsegmento para acceder al leerlos
        subsegmentos[obj.segmento][obj.subsegmento] = {label:obj.label,value:obj.value}
      })
    }else data[values[0].value] = []
  })

  return {data, subsegmentos}
}

//Obtener todo el Glosario y por separado los que son atributos y términos
function getTerminosAll(){
  let {data, subsegmentos} = getSegmentos()

  $().SPServices({
    operation: "GetListItems",
    async: false,
    listName: "Z_DICCIONARIO_DATOS",
    CAMLViewFields: "<ViewFields>\
                        <FieldRef Name='tipo_metad' />\
                        <FieldRef Name='id_metad' />\
                        <FieldRef Name='nombre_metad' />\
                        <FieldRef Name='descripcion_metad' />\
                        <FieldRef Name='descripcion_dominio' />\
                        <FieldRef Name='fec_ultima_actualizacion' />\
                        <FieldRef Name='caracteristicas' />\
                        <FieldRef Name='dato_personal' />\
                        <FieldRef Name='golden_record' />\
                    </ViewFields>",
    completefunc: function (xData, Status) {
        $(xData.responseXML).find("z\\:row").each(function () {
          data.todos.push($(this));
        });
    }
  });
  let rgx = "(?<!\&)\\d+(?=;)"
  let regex = new RegExp(rgx,"g");
  $.each(data.todos,function(index,item){
    if(item.attr("ows_nombre_metad").includes("&#")){ //reemplazo de HTML entities para evitar problemas al filtrar
      let entity = item.attr("ows_nombre_metad").match(regex);
      item[0].attributes.ows_nombre_metad.nodeValue = item.attr("ows_nombre_metad").replace("&#"+entity+";",String.fromCharCode(entity));
     }
    if($(this).attr("ows_tipo_metad")=="TERMINO"){
      data.terminos.push($(this));
    }else if($(this).attr("ows_tipo_metad")=="ATRIBUTO"){
      data.atributos.push($(this));
    }
    let datoPersonal = parseInt($(this).attr("ows_dato_personal"))
    if(datoPersonal){
      data[subsegmentos[3][datoPersonal].value].push($(this))
    }
    if($(this).attr("ows_golden_record") == "1"){
      data.golden.push($(this));
    }
    let caracteristicas = $(this).attr("ows_caracteristicas")?.toLowerCase()
    if(caracteristicas && (caracteristicas.includes("cde") || caracteristicas.includes("Elemento clave de datos"))){
      data.elemento_clave.push($(this));
    }
    if(caracteristicas &&(caracteristicas.includes("ar") || caracteristicas.includes("Atributo de Referencia"))){
      data.atributo_referencia.push($(this));
    }

  });
  return data
}

//Obtener todo el diccionario de datos de un dominio específico a partir del nombre de un dominio
function getTerminos(desc_dominio){
  let {data, subsegmentos} = getSegmentos()
  $().SPServices({
    operation: "GetListItems",
    async: false,
    listName: "Z_DICCIONARIO_DATOS",
    CAMLViewFields: "<ViewFields>\
                        <FieldRef Name='tipo_metad' />\
                        <FieldRef Name='id_metad' />\
                        <FieldRef Name='nombre_metad' />\
                        <FieldRef Name='descripcion_metad' />\
                        <FieldRef Name='descripcion_dominio' />\
                        <FieldRef Name='fec_ultima_actualizacion' />\
                        <FieldRef Name='caracteristicas' />\
                        <FieldRef Name='dato_personal' />\
                        <FieldRef Name='golden_record' />\
                    </ViewFields>",
    completefunc: function (xData, Status) {
        $(xData.responseXML).find("z\\:row").each(function () {
          let lista =$(this).attr("ows_descripcion_dominio").split("; ")
          lista.forEach(element => {
            if(element == desc_dominio)data.todos.push($(this));
          });
          
        });
    }
  });
  let rgx = "(?<!\&)\\d+(?=;)"
  let regex = new RegExp(rgx,"g");
  $.each(data.todos,function(index,item){
    if(item.attr("ows_nombre_metad").includes("&#")){ //reemplazo de HTML entities para evitar problemas al filtrar
      let entity = item.attr("ows_nombre_metad").match(regex);
      item[0].attributes.ows_nombre_metad.nodeValue = item.attr("ows_nombre_metad").replace("&#"+entity+";",String.fromCharCode(entity));
     }
    if($(this).attr("ows_tipo_metad")=="TERMINO"){
      data.terminos.push($(this));
    }else if($(this).attr("ows_tipo_metad")=="ATRIBUTO"){
      data.atributos.push($(this));
    }
    let datoPersonal = parseInt($(this).attr("ows_dato_personal"))
    if(datoPersonal){
      data[subsegmentos[3][datoPersonal].value].push($(this))
    }
    if($(this).attr("ows_golden_record") == "1"){
      data.golden.push($(this));
    }
    let caracteristicas = $(this).attr("ows_caracteristicas")?.toLowerCase()
    if(caracteristicas && (caracteristicas.includes("cde") || caracteristicas.includes("Elemento clave de datos"))){
      data.elemento_clave.push($(this));
    }
    if(caracteristicas &&(caracteristicas.includes("ar") || caracteristicas.includes("Atributo de Referencia"))){
      data.atributo_referencia.push($(this));
    }
  });
  return data
}

//Obtener Atributos de un Dominio específico a partir del nombre del dominio
function getAtributosFrom(desc_dominio){
  let atributos = [];
  $().SPServices({
    operation: "GetListItems",
    async: false,
    listName: "Z_DICCIONARIO_DATOS",
    CAMLViewFields: "<ViewFields>\
                        <FieldRef Name='tipo_metad' />\
                        <FieldRef Name='id_metad' />\
                        <FieldRef Name='nombre_metad' />\
                        <FieldRef Name='descripcion_metad' />\
                        <FieldRef Name='descripcion_dominio' />\
                        <FieldRef Name='fec_ultima_actualizacion' />\
                        <FieldRef Name='caracteristicas' />\
                        <FieldRef Name='txt_desc_subdominio' />\
                        <FieldRef Name='txt_desc_subcategoria' />\
                        <FieldRef Name='dato_personal' />\
                        <FieldRef Name='golden_record' />\
                    </ViewFields>",
    completefunc: function (xData, Status) {
        $(xData.responseXML).find("z\\:row").each(function () {
          let lista=$(this).attr("ows_descripcion_dominio").split("; ")
          lista.forEach(element => {
            if(element == desc_dominio && $(this).attr("ows_tipo_metad") =="ATRIBUTO")atributos.push($(this));

          });
        });
    }
  });
  let rgx = "(?<!\&)\\d+(?=;)"
  let regex = new RegExp(rgx,"g");
  $.each(atributos,function(index,item){
    if(item.attr("ows_nombre_metad").includes("&#")){ //reemplazo de HTML entities para evitar problemas al filtrar
      let entity = item.attr("ows_nombre_metad").match(regex);
      item[0].attributes.ows_nombre_metad.nodeValue = item.attr("ows_nombre_metad").replace("&#"+entity+";",String.fromCharCode(entity));
     }
  });

  return atributos
}

//Obtener termino en específico a partir de su ID
function getAtributo(id_termino){
  let resultado;
  $().SPServices({
    operation: "GetListItems",
    async: false,
    listName: "Z_DICCIONARIO_DATOS",
    CAMLViewFields: "<ViewFields>\
                        <FieldRef Name='tipo_metad' />\
                        <FieldRef Name='id_metad' />\
                        <FieldRef Name='nombre_metad' />\
                        <FieldRef Name='descripcion_metad' />\
                        <FieldRef Name='descripcion_dominio' />\
                        <FieldRef Name='fec_ultima_actualizacion' />\
                        <FieldRef Name='caracteristicas' />\
                        <FieldRef Name='txt_desc_subdominio' />\
                        <FieldRef Name='txt_desc_subcategoria' />\
                        <FieldRef Name='dato_personal' />\
                        <FieldRef Name='golden_record' />\
                        <FieldRef Name='catalogos_asociados' />\
                    </ViewFields>",
    completefunc: function (xData, Status) {
        $(xData.responseXML).find("z\\:row").each(function () {
          if($(this).attr("ows_id_metad") == id_termino && $(this).attr("ows_tipo_metad") == "ATRIBUTO" ){
            resultado = $(this);
          }
        });
    }
  });
  let rgx = "(?<!\&)\\d+(?=;)"
  let regex = new RegExp(rgx,"g");
  if(resultado.attr("ows_nombre_metad").includes("&#")){ //reemplazo de HTML entities para evitar problemas al filtrar
    let entity = resultado.attr("ows_nombre_metad").match(regex);
    resultado[0].attributes.ows_nombre_metad.nodeValue = resultado.attr("ows_nombre_metad").replace("&#"+entity+";",String.fromCharCode(entity));
  }
  return resultado
}

//Obtener avances y sus IDs
function getAvancesDominio(filtro=undefined){
  let pasos = [];
  let avance = undefined;
  $().SPServices({
    operation: "GetListItems",
    async: false,
    listName: "Z_AVANCES_DOMINIO",
    CAMLViewFields: "<ViewFields>\
                        <FieldRef Name='fecha_carga' />\
                        <FieldRef Name='oleada' />\
                        <FieldRef Name='id_dominio' />\
                        <FieldRef Name='descripcion_dominio' />\
                        <FieldRef Name='id_paso' />\
                        <FieldRef Name='txt_desc_paso' />\
                        <FieldRef Name='estado_paso' />\
                        <FieldRef Name='porcentaje_avance_orig' />\
                    </ViewFields>",
    completefunc: function (xData, Status) {
        $(xData.responseXML).find("z\\:row").each(function () {
          if($(this).attr("ows_id_dominio") == filtro){
            if(!avance){
              avance = {
                fecha_carga: $(this).attr("ows_fecha_carga"),
                oleada: $(this).attr("ows_oleada"),
                id_dominio: $(this).attr("ows_id_dominio"),
                descripcion_dominio: $(this).attr("ows_descripcion_dominio"),
                pasos: []
              }
            }
            let paso = {
              id_paso: $(this).attr("ows_id_paso"),
              desc_paso: $(this).attr("ows_txt_desc_paso"),
              estado_paso: $(this).attr("ows_estado_paso"),
              porcentaje_avance: $(this).attr("ows_porcentaje_avance_orig")
            }
            pasos.push(paso);
          }
        });
    }
  });
  if(avance){
    avance.pasos = pasos;
    return {avance}
  }else{
    return false
  }
}

//Obtener Estructura de un dominio
function getEstructura(id_dominio){
  let estructura = undefined;
  let lider = [];
  let custodios = [];
  let administradores = [];
  let seguridad = [];
  $().SPServices({
    operation: "GetListItems",
    async: false,
    listName: "Z_ESTRUCTURA_DOMINIO",
    CAMLQuery: "<Query><Where><Eq><FieldRef Name='id_dominio'/><Value Type='text'>"+ id_dominio +"</Value></Eq></Where></Query>",
    CAMLViewFields: "<ViewFields>\
                        <FieldRef Name='id_dominio' />\
                        <FieldRef Name='descripcion_dominio' />\
                        <FieldRef Name='id_subdominio' />\
                        <FieldRef Name='txt_desc_subdominio' />\
                        <FieldRef Name='id_participante' />\
                        <FieldRef Name='nombre_integrante' />\
                        <FieldRef Name='nombre_arreglado' />\
                        <FieldRef Name='cargo' />\
                        <FieldRef Name='area' />\
                        <FieldRef Name='id_roles_gobierno' />\
                        <FieldRef Name='txt_desc_roles_gobierno' />\
                        <FieldRef Name='agencia' />\
                        <FieldRef Name='region' />\
                        <FieldRef Name='es_suplente' />\
                        <FieldRef Name='id_principal' />\
                        <FieldRef Name='nombre_principal' />\
                    </ViewFields>",
    completefunc: function (xData, Status) {
        $(xData.responseXML).find("z\\:row").each(function () {
          if(!estructura){
            estructura = {
              id_dominio: $(this).attr("ows_id_dominio"),
              dominio: $(this).attr("ows_descripcion_dominio"),
              id_subdominio: $(this).attr("ows_id_subdominio"),
              subdominio: $(this).attr("ows_txt_desc_subdominio"),
              lider: [],
              custodios: [],
              administradores: [],
              seguridad: []
            }
          }
          let participante = {
            id_participante: $(this).attr("ows_id_participante"),
            nombre1: $(this).attr("ows_nombre_integrante"),
            nombre_arreglado: $(this).attr("ows_nombre_arreglado"),
            cargo: $(this).attr("ows_cargo"),
            area: $(this).attr("ows_area"),
            id_rol: $(this).attr("ows_id_roles_gobierno"),
            rol: $(this).attr("ows_txt_desc_roles_gobierno"),
            agencia: $(this).attr("ows_agencia"),
            region: $(this).attr("ows_region"),
            suplente: $(this).attr("ows_es_suplente"),
            id_principal: $(this).attr("ows_id_principal"),
            nombre_principal: $(this).attr("ows_nombre_principal")
          }
          switch ($(this).attr("ows_txt_desc_roles_gobierno")) {
            case "Administradores de Dominio":
              administradores.push(participante);
              break;
            case "Custodio de Datos":
              custodios.push(participante);
              break;
            case "Líder de Dominio":
              lider.push(participante);
              break;
            case "Oficial de Seguridad de la Información":
              seguridad.push(participante);
              break;
            default:
              break;
          }
        });
    }
  });
  estructura.lider = lider;
  estructura.custodios = custodios;
  estructura.administradores = administradores;
  estructura.seguridad = seguridad;
  return estructura
}

//Obtener avances y sus IDs a partir del ID de dominio
function getArtefactosFromDominio(id_dominio){
  let artefactos = [];
 
  $().SPServices({
    operation: "GetListItems",
    async: false,
    listName: "INV_MODEL_ART",
    CAMLViewFields: "<ViewFields>\
                            <FieldRef Name='codigo' />\
                            <FieldRef Name='modelo_analitica' />\
                            <FieldRef Name='txt_desc_uso_modelo' />\
                            <FieldRef Name= 'txt_desc_tipo_artefacto' />\
                            <FieldRef Name= 'id_dominio' />\
                            <FieldRef Name= 'descripcion_dominio' />\
                        </ViewFields>",
    completefunc: function (xData, Status) {
        $(xData.responseXML).find("z\\:row").each(function () {
         
          let ids_dominios = $(this).attr("ows_id_dominio").split("; ");
          for (let n = 0; n < ids_dominios.length; n++) {
            if(ids_dominios[n] == id_dominio){
              artefactos.push($(this));
            } 
          }
        });
    }
});
  return artefactos
}

//Búsqueda de un catálogo de referencia a partir de su código con CAMLQuery
function searchCatalogo(vista,codigo){
  let resultado = [];
  $().SPServices({
    operation: "GetListItems",
    async: false,
    listName: "Z_CATALOGO_REFERENCIA",
    CAMLQuery: '<Query><Where>\
    <And>\
    <Eq><FieldRef Name="Vista"/><Value Type="Text">'+vista+'</Value></Eq>\
    <Eq><FieldRef Name="Codigo"/><Value Type="Text">'+codigo+'</Value></Eq>\
    </And>\
    </Where></Query>',
    CAMLViewFields: "<ViewFields>\
                            <FieldRef Name='Vista' />\
                            <FieldRef Name='Codigo' />\
                            <FieldRef Name='Descripcion' />\
                            <FieldRef Name='TipoCatalogo' />\
                            <FieldRef Name='Detalle' />\
                            <FieldRef Name='Plataforma' />\
                            <FieldRef Name='Servidor' />\
                            <FieldRef Name='Base' />\
                            <FieldRef Name='Esquema' />\
                            <FieldRef Name='Tabla' />\
                            <FieldRef Name='Responsable' />\
                            <FieldRef Name='Validado' />\
                            <FieldRef Name='Observacion' />\
                            <FieldRef Name='Script' />\
                        </ViewFields>",
    completefunc: function (xData, Status) {
        $(xData.responseXML).find("z\\:row").each(function () {
          let reg_ubicacion = [];
          if($(this).attr("ows_Base"))reg_ubicacion.push($(this).attr("ows_Base"));
          if($(this).attr("ows_Esquema"))reg_ubicacion.push($(this).attr("ows_Esquema"));
          if($(this).attr("ows_Tabla"))reg_ubicacion.push($(this).attr("ows_Tabla"));
          reg_ubicacion = reg_ubicacion.join(".");
          let servidor = $(this).attr("ows_Servidor")?.split(",")[0] || "";
          let esquema = $(this).attr("ows_Esquema") || "";
          let base = $(this).attr("ows_Base") || "";
          let tabla = $(this).attr("ows_Tabla") || "";
          let llaveTablatxt = `${servidor}_${esquema}_${base}_${tabla}`
          let registro = {
            vista: $(this).attr("ows_Vista") ? $(this).attr("ows_Vista") : " ",
            codigo: $(this).attr("ows_Codigo") ? $(this).attr("ows_Codigo") : " ",
            descripcion: $(this).attr("ows_Descripcion") ? $(this).attr("ows_Descripcion") : " ",
            tipo: $(this).attr("ows_TipoCatalogo") ? $(this).attr("ows_TipoCatalogo") : " ",
            detalle: $(this).attr("ows_Detalle") ? $(this).attr("ows_Detalle") : " ",
            plataforma: $(this).attr("ows_Plataforma") ? $(this).attr("ows_Plataforma") : " ",
            servidor: $(this).attr("ows_Servidor") ? $(this).attr("ows_Servidor") : " ",
            ubicacion: reg_ubicacion,
            responsable: $(this).attr("ows_Responsable") ? $(this).attr("ows_Responsable") : " ",
            validado: $(this).attr("ows_Validado") ? $(this).attr("ows_Validado") : " ",
            observacion: $(this).attr("ows_Observacion") ? $(this).attr("ows_Observacion") : " ",
            script: $(this).attr("ows_Script") ? $(this).attr("ows_Script") : " ",
            llave_tabla : llaveTablatxt,
          }
          resultado = registro;
        });
    }
});

  return resultado
}

//Se obtienen todos los catalogos
function getCatalogo(){
  let catalogo = [];
  $().SPServices({
    operation: "GetListItems",
    async: false,
    listName: "Z_CATALOGO_REFERENCIA",
    CAMLViewFields: "<ViewFields>\
                            <FieldRef Name='Vista' />\
                            <FieldRef Name='Codigo' />\
                            <FieldRef Name='Descripcion' />\
                            <FieldRef Name='TipoCatalogo' />\
                            <FieldRef Name='Detalle' />\
                            <FieldRef Name='Plataforma' />\
                            <FieldRef Name='Servidor' />\
                            <FieldRef Name='Base' />\
                            <FieldRef Name='Esquema' />\
                            <FieldRef Name='Tabla' />\
                            <FieldRef Name='Responsable' />\
                            <FieldRef Name='Validado' />\
                            <FieldRef Name='Observacion' />\
                            <FieldRef Name='Script' />\
                        </ViewFields>",
    completefunc: function (xData, Status) {
        $(xData.responseXML).find("z\\:row").each(function () {
          let reg_ubicacion = [];
          if($(this).attr("ows_Base"))reg_ubicacion.push($(this).attr("ows_Base"));
          if($(this).attr("ows_Esquema"))reg_ubicacion.push($(this).attr("ows_Esquema"));
          if($(this).attr("ows_Tabla"))reg_ubicacion.push($(this).attr("ows_Tabla"));
          reg_ubicacion = reg_ubicacion.join(".");
          let registro = {
            vista: $(this).attr("ows_Vista") ? $(this).attr("ows_Vista") : " ",
            codigo: $(this).attr("ows_Codigo") ? $(this).attr("ows_Codigo") : " ",
            descripcion: $(this).attr("ows_Descripcion") ? $(this).attr("ows_Descripcion") : " ",
            tipo: $(this).attr("ows_TipoCatalogo") ? $(this).attr("ows_TipoCatalogo") : " ",
            detalle: $(this).attr("ows_Detalle") ? $(this).attr("ows_Detalle") : " ",
            plataforma: $(this).attr("ows_Plataforma") ? $(this).attr("ows_Plataforma") : " ",
            servidor: $(this).attr("ows_Servidor") ? $(this).attr("ows_Servidor") : " ",
            base: $(this).attr("ows_Base") ? $(this).attr("ows_Base") : " ",
            esquema: $(this).attr("ows_Esquema") ? $(this).attr("ows_Esquema") : " ",
            tabla: $(this).attr("ows_Tabla") ? $(this).attr("ows_Tabla") : " ",
            ubicacion: reg_ubicacion,
            observacion: $(this).attr("ows_Observacion") ? $(this).attr("ows_Observacion") : " ",
            responsable: $(this).attr("ows_Responsable") ? $(this).attr("ows_Responsable") : " ",
            validado: $(this).attr("ows_Validado") ? $(this).attr("ows_Validado") : " ",
            script: $(this).attr("ows_Script") ? $(this).attr("ows_Script") : " "
          }
          catalogo.push(registro);
        });
    }
});
  return catalogo
}

  //Funcion para obtencion de detalle de catalogo a partir de su Codigo con CAMLQuery
  
  function getDetalleCatalogoLarga(nombreLista,codigo){
    let detalle = [];
    $().SPServices({
        operation: "GetListItems",
        async: false,
        listName: nombreLista,
        CAMLQuery: "<Query><Where><Eq><FieldRef Name='codigoSuperior'/><Value Type='text'>"+ codigo +"</Value></Eq></Where></Query>",
        CAMLViewFields: "<ViewFields>\
                            <FieldRef Name = 'Codigo' />\
                            <FieldRef Name = 'Descripcion' />\
                            <FieldRef Name = 'codigoSuperior' />\
                        </ViewFields>",
        completefunc: function (xData, Status) {
            $(xData.responseXML).find("z\\:row").each(function () {
              let registro = {
                codigoDetalle: $(this).attr("ows_Codigo") ? $(this).attr("ows_Codigo") : " ",
                descripcionDetalle: $(this).attr("ows_Descripcion") ? $(this).attr("ows_Descripcion") : " ",
                codigosuperior: $(this).attr("ows_codigoSuperior") ? $(this).attr("ows_codigoSuperior") : " ",
              };
              detalle.push(registro);
            });
        }
    })
    return detalle;
  }


  function getDetalleCatalogo(codigo) {
    let resultados = [];
    for (let x = 1; x <= 3; x++) {
      let lista="Z_CATALOGO_DETALLE_"+String(x);
      let detalle = getDetalleCatalogoLarga(lista, codigo);
      resultados = resultados.concat(detalle)
    }
    return resultados;
  }

//Obtener todas las FUENTES DE APROVISIONAMIENTO presentes en el directorio de fuentes
function getFuentes(){
  let archivos = [];
  $().SPServices({
  operation: "GetListItems",
  async: false,
  listName: "Páginas",
  CAMLQueryOptions: "<QueryOptions><Folder>/sitios/informaciongerencial/Paginas/ANALYTICS/Marlon Z/PAGINAS/COMUNIDAD_ANALITICA/assets/fuentes</Folder></QueryOptions>",
  completefunc: function (xData, Status) {
      $(xData.responseXML).find("z\\:row").each(function() {
      archivos.push($(this));
          });
      }
  });

  return archivos
};
async function leerDataset(txt) {
  try {
      const res = await fetch(`datasets-txt/${txt?.toUpperCase()}.txt`);
      const text = await res.text();

      const lines = text.split('\n').filter(line => line.trim() !== '');
      const headers = lines[0].split('||').map(header => header.trim());
      // Preparamos una función para sanitizar los valores
      const sanitize = (value) => {
          return value
              ? value.toLocaleUpperCase().trim().replaceAll('(', '\\(').replaceAll(')', '\\)').replaceAll('<BR>', '').replaceAll('\\', '')
              : '';
      };

      const lista = lines.slice(1).map(line => {
          const values = line.split('||').map(value => value.trim());
          const obj = headers.reduce((acc, header, index) => {
              acc[header] = values[index] ?? "";
              return acc;
          }, {});

          // Generar llaves solo una vez
          obj.servidor = sanitize(obj.servidor);
          obj.esquema = sanitize(obj.esquema) || 'DBO';
          obj.base = sanitize(obj.base);
          obj.tabla = sanitize(obj.tabla);
          obj.campo = sanitize(obj.campo);
          obj.codigo = obj.codigo === "0" ? "": obj.codigo;
          obj.llave_tabla = `${obj.servidor}_${obj.esquema}_${obj.base}_${obj.tabla}`.toUpperCase();
          obj.llave_unica = `${obj.servidor}_${obj.esquema}_${obj.base}_${obj.tabla}_${obj.campo}`.toUpperCase();
          obj.porcentaje_avance = 0
          
          // Asignar informacion relacionada a atributo o detalle
          if (obj.detalle.startsWith("***") && !isNaN(parseInt(obj.detalle.slice(3)))) {
            obj.codigo = obj.detalle;
            obj.detalle = "";
          }


          return obj;
      });
      return lista; // Retorna la lista resultante
  } catch (error) {
      console.error(error);
      return null; // Retorna null en caso de error
  }
}


//funcion para obtener Informacion Tecnica por Atributos
//su parametro atributos es un arreglo de atributos
async function searchIT(atributos){
  
  //Primero obtendré los datos de la lista corta
  let info_tecnica_corta = getInfoTecnicaCorta();
  window.info_tecnicacorta=info_tecnica_corta

  //Luego obtendré los datos de la Z_INF_TECNICA_FICHAS
  // let info_tecnica_fichas = [];
  let info_tecnica_fichas = await leerDataset('z_inf_tecnica_fichas');

  //Declaro la lista donde guardaré los items mas actualizados
  let resultado_info_tecnica = [];
  // Creo un objeto para rastrear los campos ya procesados
  const camposProcesados = {};
  //Primero recorro todos los items de la Z_INF_TECNICA, que es la mas actualizada
  info_tecnica_corta.forEach(elemento => {
    if (camposProcesados[elemento.llave_unica]===undefined) {
      resultado_info_tecnica.push(elemento);
      camposProcesados[elemento.llave_unica] = true;
    }
  })
  //Luego le agrego los items del Z_INF_TECNICA_FICHAS
  info_tecnica_fichas.forEach(elemento => {
    if (camposProcesados[elemento.llave_unica]===undefined) {
      resultado_info_tecnica.push(elemento);
      camposProcesados[elemento.llave_unica] = true;
    }
  })
  //Finalmente solo dejo los datos requeridos
  let resultados = []
  for(let n = 0; n < resultado_info_tecnica.length; n++){
    let codigo_texto = resultado_info_tecnica[n].codigo ? resultado_info_tecnica[n].codigo: "NADA"
    if (atributos.includes(codigo_texto)){
      resultados.push(resultado_info_tecnica[n])
    }
  }
  return resultados
}

//Funcion para obtener el GUID de una Vista a partir del NOMBRE de la lista. Nombre es distinto a GUID
function getViewGUIDs(listNombre){
    let GUIDs = [];
    $().SPServices({
            operation: "GetViewCollection",
            async: false,
            listName: listNombre,
            completefunc: function (xData, Status) {
                $(xData.responseXML).find("View").each(function () {
                    GUIDs.push($(this).attr("Name"));
                });
            }
    })
    GUIDs.shift();
    return GUIDs;
  }


//Funcion para obtener los datos de la información técnica larga
function getInfoTecnicaLarga(vista, nombreLista){
  return new Promise(function (resolve, reject) {
      let lista = [];
    $().SPServices({
      operation: "GetListItems",
      async: true,
      listName: nombreLista,
      viewName: vista,
      CAMLViewFields: " <ViewFields>\
                          <FieldRef Name='codigo' />\
                          <FieldRef Name='descripcion' />\
                          <FieldRef Name='detalle' />\
                          <FieldRef Name='plataforma' />\
                          <FieldRef Name='servidor' />\
                          <FieldRef Name='base' />\
                          <FieldRef Name='esquema' />\
                          <FieldRef Name='tabla' />\
                          <FieldRef Name='campo' />\
                          <FieldRef Name='tipo_dato' />\
                          <FieldRef Name='largo' />\
                          <FieldRef Name='permite_null' />\
                          <FieldRef Name='golden_record' />\
                          <FieldRef Name='usuario_modificacion_detalle' />\
                          <FieldRef Name='fecha_modificacion_detalle' />\
                          <FieldRef Name='usuario_modificacion_atributo' />\
                          <FieldRef Name='fecha_modificacion_atributo' />\
                          <FieldRef Name='ordinal_position' />\
                        </ViewFields>",
      completefunc: function (xData, Status) {
        
        $(xData.responseXML).SPFilterNode("z:row").each(function() {
          
          let servidor_txt = $(this).attr("ows_servidor") ? $(this).attr("ows_servidor").toUpperCase().trim().replaceAll('(', '\(').replaceAll(')', '\)').replaceAll('<BR>','').replaceAll('\\','') : " ";
          let esquema_txt = $(this).attr("ows_esquema") ? $(this).attr("ows_esquema").toUpperCase().trim().replaceAll('(', '\(').replaceAll(')', '\)').replaceAll('<BR>','').replaceAll('\\','') : "DBO";
          let base_txt = $(this).attr("ows_base") ? $(this).attr("ows_base").toUpperCase().trim().replaceAll('(', '\(').replaceAll(')', '\)').replaceAll('<BR>','').replaceAll('\\','') : " ";
          let tabla_txt = $(this).attr("ows_tabla") ? $(this).attr("ows_tabla").toUpperCase().trim().replaceAll('(', '\(').replaceAll(')', '\)').replaceAll('<BR>','').replaceAll('\\','') : " ";
          let campo_txt = $(this).attr("ows_campo") ? $(this).attr("ows_campo").toUpperCase().trim().replaceAll('(', '\(').replaceAll(')', '\)').replaceAll('<BR>','').replaceAll('\\','') : " ";
          let codigo_txt = $(this).attr("ows_codigo") ? $(this).attr("ows_codigo") : " ";
          let llaveTablatxt = servidor_txt+ "_" +esquema_txt+ "_" +base_txt+ "_" +tabla_txt;
              lista.push({
                      servidor: servidor_txt, 
                      base: base_txt, 
                      esquema: esquema_txt,
                      tabla: tabla_txt, 
                      campo: campo_txt, 
                      tipo_dato: $(this).attr("ows_tipo_dato") ? $(this).attr("ows_tipo_dato") : " ", 
                      largo: $(this).attr("ows_largo") ? $(this).attr("ows_largo") : " ", 
                      permite_null: $(this).attr("ows_permite_null") ? $(this).attr("ows_permite_null") : " ", 
                      ows_ID: $(this).attr("ows_ID") ? $(this).attr("ows_ID") : " ",
                      codigo: codigo_txt, 
                      descripcion: $(this).attr("ows_descripcion") ? $(this).attr("ows_descripcion") : " ", 
                      detalle: $(this).attr("ows_detalle") ? $(this).attr("ows_detalle") : " ",
                      plataforma: $(this).attr("ows_plataforma") ? $(this).attr("ows_plataforma") : " ",
                      golden_record: $(this).attr("ows_golden_record") ? $(this).attr("ows_golden_record") : " ",
                      usuario_modificacion_detalle: $(this).attr("ows_usuario_modificacion_detalle") ? $(this).attr("ows_usuario_modificacion_detalle") : " ",
                      fecha_modificacion_detalle: $(this).attr("ows_fecha_modificacion_detalle") ? $(this).attr("ows_fecha_modificacion_detalle") : " ",
                      usuario_modificacion_atributo: $(this).attr("ows_usuario_modificacion_atributo") ? $(this).attr("ows_usuario_modificacion_atributo") : " ",
                      fecha_modificacion_atributo: $(this).attr("ows_fecha_modificacion_atributo") ? $(this).attr("ows_fecha_modificacion_atributo") : " ",
                      porcentaje_avance: 0,
                      llave_tabla:llaveTablatxt, //llave para obtener data owner/steward y dominio del archivo Z_tablas_oficiales
                      llave_unica:   servidor_txt + "_" + esquema_txt + "_" + base_txt + "_" + tabla_txt + "_" + campo_txt,
                      ordinal_position: $(this).attr("ows_ordinal_position") ? $(this).attr("ows_ordinal_position") : "",
                    });
                      
                    resolve(lista);
            })
      }
    });
  });
}


// set datatable detalle
//función para configurar el datatable de Catalogo de Referencias
function setdataTableAccesos(accesos){
  if(!$("#accesos").hasClass("dataTable")){
    $('#accesos').DataTable({
      data: accesos,
      "rowCallback": function( row, data ) { //callback function para identificar si el dato es personalizado y ejecutar código
        
        const centro = (row.children)[5]
          
          $(centro).attr("data-toggle","tooltip");
          $(centro).attr("data-placement","bottom");
         
           $(centro).tooltip({
               html: true,
               boundary: 'window',
               title: data.centro,
               template: `
  
                   <div class="custom-tooltip tooltip tooltip2">
                     <div class="arrow"></div>    
                     <div class="tooltip-inner inner"></div>
                   </div>
               `
             });
        const area = (row.children)[4]
          
          $(area).attr("data-toggle","tooltip");
          $(area).attr("data-placement","bottom");
         
           $(area).tooltip({
               html: true,
               boundary: 'window',
               title: data.area,
               template: `
  
                   <div class="custom-tooltip tooltip tooltip2">
                     <div class="arrow"></div>    
                     <div class="tooltip-inner inner"></div>
                   </div>
               `
             });
        /*
        let listacolumns= [1,2,4,5,6]
        let nombres=[data.descripcion,data.detalle,data.servidor,data.ubicacion,data.observacion]
        for (let x =0;x<listacolumns.length;x++){
          const detalle = (row.children)[listacolumns[x]]
          
          $(detalle).attr("data-toggle","tooltip");
          $(detalle).attr("data-placement","bottom");
         
           $(detalle).tooltip({
               html: true,
               boundary: 'window',
               title: String(nombres[x]),
               template: `
  
                   <div class="custom-tooltip tooltip tooltip2">
                     <div class="arrow"></div>    
                     <div class="tooltip-inner inner"></div>
                   </div>
               `
             });
        }
        //copy to clipboard
        let script = data.script.replaceAll("'","@")
  
        $('td:eq(6)', row).html(  "<icon html='true'  data-toggle='popover' data-trigger='click' data-placement='left' data-content='<b>Código Copiado!</b>' onclick='copyToClipboard(\""+script+"\",\""+data.servidor+"\")' class='iconsminds-file-copy' style='cursor:pointer'  ></icon>"+' ' +data.observacion );
         */
      }, 
      "drawCallback": function( settings ) {
        //hidePopovers()
    },
      paging: true,
      colResize: {
        isEnabled: true,
        hasBoundCheck: false
      },
      
      lengthChange: true,
      info: true,
      scrollX: true,
     // scrollCollapse: true,
      scrollY: '250px',
      searching:false,
      
      dom: 'fBtlip',
      autoWidth: true,
      columnDefs: [
        
       { targets: 5, width: "300px" },
      /*  { targets: 4, width: "100px" },
        { targets: 3, width: "100px" },
        { targets: 2, width: "100px" },
        { targets: 1, width: "100px" },
        { targets: 0, width: "100px" },
        { targets: '_all', width: "100px" }*/
      ],
      buttons: [
        {
          extend: 'excel',
          text: 'Exportar a Excel',
          customize: function ( xlsx ) {
            customizeExcel(xlsx,'Accesos',"")
          }
      }
      ],
      columns: [
          { data: 'plataforma' },
          { data: 'servidor' },
          { data: 'base' },
          { data: 'esquema' },
          { data: 'area' },
          { data: 'centro' },
         
      ],
      language:{
        "decimal":        "",
        "emptyTable":     "No hay datos disponibles en la tabla",
        "info":           "_TOTAL_ resultados", //"Mostrando _START_ a _END_ de _TOTAL_ registros",
        "infoEmpty":      "Mostrando 0 a 0 de 0 registros",
        "infoFiltered":   "", //"(filtrando de _MAX_ registros totales)"
        "infoPostFix":    "",
        "thousands":      ",",
        "lengthMenu":     "Mostrar _MENU_ registros",
        "loadingRecords": "Cargando...",
        "processing":     "",
        "search":         "",
        "zeroRecords":    "No se encontraron registros",
        "paginate": {
            "first":      "Primero",
            "last":       "Último",
            "next":       ">",
            "previous":   "<"
        },
        "aria": {
            "sortAscending":  ": activate to sort column ascending",
            "sortDescending": ": activate to sort column descending"
        }
    },
    "pageLength":25
  });
  }else{
    redrawDataTable("accesos",accesos)
  }
  

/*$('#catalogo').on( 'draw.dt', function () {
  document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0;
} );
$("#catalogo").css("height","25px");
//$("#catalogo").addClass("overflow-auto");
document.querySelector("#catalogo_wrapper > div.dt-buttons.btn-group > button").innerHTML = "Descargar como Excel <i class='iconsminds-download'></i>";
$('[data-toggle="tooltip"]').tooltip();*/
}

function getInfoFuentesAprovisionamiento(){
  let lista=[]
  let servidores=[]
  let bases=[]
  let esquemas=[]
  $().SPServices({
    operation: "GetListItems",
    async: false,
    listName: "Z_FUENTES_APROVISIONAMIENTO",
    CAMLViewFields: "<ViewFields><FieldRef Name='txt_fuente_aprovisionamiento' /><FieldRef Name='txt_servidor' /><FieldRef Name='txt_host' /><FieldRef Name='txt_fuente_esquema' /></ViewFields>",
    completefunc: function (xData, Status) {
      
      $(xData.responseXML).SPFilterNode("z:row").each(function() {
        
     //   if($(this).attr("ows_campo")){
          let servidor_txt = $(this).attr("ows_txt_servidor") ? $(this).attr("ows_txt_servidor").toUpperCase().trim().replaceAll('(', '\(').replaceAll(')', '\)').replaceAll('<BR>','').replaceAll('\\','') : " ";
          let esquema_txt = $(this).attr("ows_txt_fuente_esquema") ? $(this).attr("ows_txt_fuente_esquema").toUpperCase().trim().replaceAll('(', '\(').replaceAll(')', '\)').replaceAll('<BR>','').replaceAll('\\','') : "DBO";
          let base_txt = $(this).attr("ows_txt_host") ? $(this).attr("ows_txt_host").toUpperCase().trim().replaceAll('(', '\(').replaceAll(')', '\)').replaceAll('<BR>','').replaceAll('\\','') : " ";
          let plataforma_txt=$(this).attr("ows_txt_fuente_aprovisionamiento") ? $(this).attr("ows_txt_fuente_aprovisionamiento") : " "
                lista.push({
                  servidor: servidor_txt, 
                  base: base_txt, 
                  esquema: esquema_txt,
                  plataforma: plataforma_txt,
                })
                if(!servidores.includes(servidor_txt)){
                  servidores.push(servidor_txt)
                }
                if(!bases.includes(base_txt)){
                    bases.push(base_txt)
                }
                if(!esquemas.includes(esquema_txt)){
                  esquemas.push(esquema_txt)
                }
              
      })
    }
    
  });
  
  return [lista,servidores,bases,esquemas]
}

function getAreasyCentros(){
  let centros=[]
  let areas=[]
  let lista=[]
  $().SPServices({
    operation: "GetListItems",
    async: false,
    listName: "LONG_LOC_MODEL_ART",
    CAMLViewFields: "<ViewFields><FieldRef Name='valor1' /><FieldRef Name='valor10' /></ViewFields>",
    completefunc: function (xData, Status) {
      
      $(xData.responseXML).SPFilterNode("z:row").each(function() {
        
     //   if($(this).attr("ows_campo")){
          let area_txt = $(this).attr("ows_valor10") ? $(this).attr("ows_valor10").toUpperCase().trim().replaceAll('(', '\(').replaceAll(')', '\)').replaceAll('<BR>','').replaceAll('\\','') : " ";
          let centro_txt= $(this).attr("ows_valor1") ? $(this).attr("ows_valor1").toUpperCase().trim().replaceAll('(', '\(').replaceAll(')', '\)').replaceAll('<BR>','').replaceAll('\\','') : " ";
              
                if(!centros.includes(centro_txt)){
                  centros.push(centro_txt)
                }
                if(!areas.includes(area_txt)){
                    areas.push(area_txt)
                }
                lista.push({
                  area:area_txt,
                  centro:centro_txt
                })
              
              
      })
    }
    
  });
  
  return [areas,centros,lista]
}

function getInfoAccesos(){
  let lista=[]
  $().SPServices({
    operation: "GetListItems",
    async: false,
    listName: "Z_ACC_PAG",
    CAMLViewFields: "<ViewFields><FieldRef Name='txt_fuente_aprovisionamiento' /><FieldRef Name='txt_servidor' /><FieldRef Name='txt_host' /><FieldRef Name='txt_fuente_esquema' /><FieldRef Name='acceso' /></ViewFields>",
    completefunc: function (xData, Status) {
      
      $(xData.responseXML).SPFilterNode("z:row").each(function() {
        
     //   if($(this).attr("ows_campo")){
          let servidor_txt = $(this).attr("ows_txt_servidor") ? $(this).attr("ows_txt_servidor").toUpperCase().trim().replaceAll('(', '\(').replaceAll(')', '\)').replaceAll('<BR>','').replaceAll('\\','') : " ";
          let esquema_txt = $(this).attr("ows_txt_fuente_esquema") ? $(this).attr("ows_txt_fuente_esquema").toUpperCase().trim().replaceAll('(', '\(').replaceAll(')', '\)').replaceAll('<BR>','').replaceAll('\\','') : "DBO";
          let base_txt = $(this).attr("ows_txt_host") ? $(this).attr("ows_txt_host").toUpperCase().trim().replaceAll('(', '\(').replaceAll(')', '\)').replaceAll('<BR>','').replaceAll('\\','') : " ";
          let acceso_txt=$(this).attr("ows_acceso") ? $(this).attr("ows_acceso") : " "
          if(acceso_txt!=" "){
            let areas=acceso_txt.split("|||")
            areas.forEach(element => {
              if(element!=""){
               let minilist=(element.split("||"))
                let areat=minilist[0]
                let centrot=minilist[1]
                lista.push({
                  servidor: servidor_txt, 
                  base: base_txt, 
                  esquema: esquema_txt,
                  plataforma: $(this).attr("ows_txt_fuente_aprovisionamiento") ? $(this).attr("ows_txt_fuente_aprovisionamiento") : " ",
                 // acceso: $(this).attr("ows_acceso") ? $(this).attr("ows_acceso") : " ",
                  area:areat,
                  centro:centrot
  
                })
              }

              
            });
          }
          
        //}
       
      })
    }
    
  });
  
  return lista
}

function getInfoTablasOficiales(){
  let lista={}
  $().SPServices({
    operation: "GetListItems",
    async: false,
    listName: "Z_TABLAS_OFICIALES",
    CAMLViewFields:   "<ViewFields>\
                        <FieldRef Name='txt_desc_tabla' />\
                        <FieldRef Name='descripcion_tabla' />\
                        <FieldRef Name='descripcion_dominio' />\
                        <FieldRef Name='txt_fuente_aprovisionamiento' />\
                        <FieldRef Name='txt_servidor' />\
                        <FieldRef Name='txt_host' />\
                        <FieldRef Name='txt_fuente_esquema' />\
                        <FieldRef Name='data_owner' />\
                        <FieldRef Name='nombre_data_owner' />\
                        <FieldRef Name='data_steward' />\
                        <FieldRef Name='nombre_data_steward' />\
                        <FieldRef Name='clasificacion' />\
                        <FieldRef Name='avance' />\
                        <FieldRef Name='etiquetas' />\
                      </ViewFields>",
    completefunc: function (xData, Status) {
      
      $(xData.responseXML).SPFilterNode("z:row").each(function() {
        
     //   if($(this).attr("ows_campo")){
          let servidor_txt = $(this).attr("ows_txt_servidor") ? $(this).attr("ows_txt_servidor").toUpperCase().trim().replaceAll('(', '\(').replaceAll(')', '\)').replaceAll('<BR>','').replaceAll('\\','') : " ";
          let esquema_txt = $(this).attr("ows_txt_fuente_esquema") ? $(this).attr("ows_txt_fuente_esquema").toUpperCase().trim().replaceAll('(', '\(').replaceAll(')', '\)').replaceAll('<BR>','').replaceAll('\\','') : "DBO";
          let base_txt = $(this).attr("ows_txt_host") ? $(this).attr("ows_txt_host").toUpperCase().trim().replaceAll('(', '\(').replaceAll(')', '\)').replaceAll('<BR>','').replaceAll('\\','') : " ";
          let tabla_txt = $(this).attr("ows_txt_desc_tabla") ? $(this).attr("ows_txt_desc_tabla").toUpperCase().trim().replaceAll('(', '\(').replaceAll(')', '\)').replaceAll('<BR>','').replaceAll('\\','') : " ";
          let llaveTablatxt = servidor_txt+ "_" +esquema_txt+ "_" +base_txt+ "_" +tabla_txt;
          lista[llaveTablatxt]={
            servidor: servidor_txt, 
            base: base_txt, 
            esquema: esquema_txt,
            tabla: tabla_txt, 
            plataforma: $(this).attr("ows_txt_fuente_aprovisionamiento") ? $(this).attr("ows_txt_fuente_aprovisionamiento") : " ",
            descripcion_dominio: $(this).attr("ows_descripcion_dominio") ? $(this).attr("ows_descripcion_dominio") : " ",
            descripcion_tabla: $(this).attr("ows_descripcion_tabla") ? $(this).attr("ows_descripcion_tabla") : " ",
            data_owner: $(this).attr("ows_data_owner") ? $(this).attr("ows_data_owner") : " ",
            nombre_data_owner: $(this).attr("ows_nombre_data_owner") ? $(this).attr("ows_nombre_data_owner") : " ",
            data_steward: $(this).attr("ows_data_steward") ? $(this).attr("ows_data_steward") : " ",
            nombre_data_steward: $(this).attr("ows_nombre_data_steward") ? $(this).attr("ows_nombre_data_steward") : " ",
            clasificacion: $(this).attr("ows_clasificacion") ? $(this).attr("ows_clasificacion") : " ",
            avance: $(this).attr("ows_avance") ? $(this).attr("ows_avance") : " ",
            etiquetas: $(this).attr("ows_etiquetas") ? $(this).attr("ows_etiquetas") : " ",
          }
        //}
       
      })
    }
    
  });
  
  return lista
}

function getInfoTecnicaCorta(nombreLista = "Z_INF_TECNICA"){
  
  let lista = []
  $().SPServices({
    operation: "GetListItems",
    async: false,
    listName: nombreLista,
    CAMLQuery:"<Query>\
        <Where>\
            <IsNotNull><FieldRef Name='campo' /></IsNotNull>\
        </Where>\
    </Query>",
    CAMLViewFields: " <ViewFields>\
                        <FieldRef Name='codigo' />\
                        <FieldRef Name='descripcion' />\
                        <FieldRef Name='detalle' />\
                        <FieldRef Name='plataforma' />\
                        <FieldRef Name='servidor' />\
                        <FieldRef Name='base' />\
                        <FieldRef Name='esquema' />\
                        <FieldRef Name='tabla' />\
                        <FieldRef Name='campo' />\
                        <FieldRef Name='tipo_dato' />\
                        <FieldRef Name='largo' />\
                        <FieldRef Name='permite_null' />\
                        <FieldRef Name='golden_record' />\
                        <FieldRef Name='usuario_modificacion_detalle' />\
                        <FieldRef Name='fecha_modificacion_detalle' />\
                        <FieldRef Name='usuario_modificacion_atributo' />\
                        <FieldRef Name='fecha_modificacion_atributo' />\
                        <FieldRef Name='ordinal_position' />\
                      </ViewFields>",
    completefunc: function (xData, Status) {
      
      $(xData.responseXML).SPFilterNode("z:row").each(function() {
        
     //   if($(this).attr("ows_campo")){
          let servidor_txt = $(this).attr("ows_servidor") ? $(this).attr("ows_servidor").toUpperCase().trim().replaceAll('(', '\(').replaceAll(')', '\)').replaceAll('<BR>','').replaceAll('\\','') : " ";
          let esquema_txt = $(this).attr("ows_esquema") ? $(this).attr("ows_esquema").toUpperCase().trim().replaceAll('(', '\(').replaceAll(')', '\)').replaceAll('<BR>','').replaceAll('\\','') : "DBO";
          let base_txt = $(this).attr("ows_base") ? $(this).attr("ows_base").toUpperCase().trim().replaceAll('(', '\(').replaceAll(')', '\)').replaceAll('<BR>','').replaceAll('\\','') : " ";
          let tabla_txt = $(this).attr("ows_tabla") ? $(this).attr("ows_tabla").toUpperCase().trim().replaceAll('(', '\(').replaceAll(')', '\)').replaceAll('<BR>','').replaceAll('\\','') : " ";
          let campo_txt = $(this).attr("ows_campo") ? $(this).attr("ows_campo").toUpperCase().trim().replaceAll('(', '\(').replaceAll(')', '\)').replaceAll('<BR>','').replaceAll('\\','') : " ";
          let codigo_txt = $(this).attr("ows_codigo") ? $(this).attr("ows_codigo") : " ";
          let llaveTablatxt = servidor_txt+ "_" +esquema_txt+ "_" +base_txt+ "_" +tabla_txt;
          lista.push({
            servidor: servidor_txt, 
            base: base_txt, 
            esquema: esquema_txt,
            tabla: tabla_txt, 
            campo: campo_txt, 
            tipo_dato: $(this).attr("ows_tipo_dato") ? $(this).attr("ows_tipo_dato") : " ", 
            largo: $(this).attr("ows_largo") ? $(this).attr("ows_largo") : " ",
            permite_null: $(this).attr("ows_permite_null") ? $(this).attr("ows_permite_null") : " ", 
            ows_ID: $(this).attr("ows_ID") ? $(this).attr("ows_ID") : " ",
            codigo: codigo_txt,
            descripcion: $(this).attr("ows_descripcion") ? $(this).attr("ows_descripcion") : " ", 
            detalle: $(this).attr("ows_detalle") ? $(this).attr("ows_detalle") : " ",
            plataforma: $(this).attr("ows_plataforma") ? $(this).attr("ows_plataforma") : " ",
            golden_record: $(this).attr("ows_golden_record") ? $(this).attr("ows_golden_record") : " ",
            usuario_modificacion_detalle: $(this).attr("ows_usuario_modificacion_detalle") ? $(this).attr("ows_usuario_modificacion_detalle") : " ",
            fecha_modificacion_detalle: $(this).attr("ows_fecha_modificacion_detalle") ? $(this).attr("ows_fecha_modificacion_detalle") : " ",
            usuario_modificacion_atributo: $(this).attr("ows_usuario_modificacion_atributo") ? $(this).attr("ows_usuario_modificacion_atributo") : " ",
            fecha_modificacion_atributo: $(this).attr("ows_fecha_modificacion_atributo") ? $(this).attr("ows_fecha_modificacion_atributo") : " ",
            porcentaje_avance: 0,
            llave_tabla:llaveTablatxt,
            llave_unica:   servidor_txt + "_" + esquema_txt + "_" + base_txt + "_" + tabla_txt + "_" + campo_txt,
            ordinal_position: $(this).attr("ows_ordinal_position") ? $(this).attr("ows_ordinal_position") : ""
          });
        //}
       
      })
    }
    
  });

  return lista
}


//Funcion para obtener los datos de los servidores
function getInfoServidores(nombreLista = "Z_SERVIDORES"){
  //Antes de obtener la info de los servidores debo saber quien está accediendo y 
  //a que servidores tiene acceso
  var usuario = obtenerUsuario();

  var current_user = usuario.current_user;


  //Reviso si está en la lista de data citizens y data users y cual es su area y centro de costo
  var area = ''
  var centro_costo = ''
  $().SPServices({
    operation: "GetListItems",
    async: false,
    listName: "LONG_LOC_MODEL_ART",
    CAMLViewFields: "<ViewFields>\
                        <FieldRef Name = 'valor1' />\
                        <FieldRef Name = 'valor8' />\
                        <FieldRef Name = 'valor10'/>\
                    </ViewFields>",
    completefunc: function (xData, Status) {
      $(xData.responseXML).find("z\\:row").each(function () {
        //Primero reviso si el usuario tiene valor de correo
        if($(this).attr("ows_valor8")){
          //Luego reviso si es el mismo que está en la página
          user=$(this).attr("ows_valor8").split(/([^@]+)/)[1].toLowerCase();
          if(user == current_user) {
            //Luego obtengo su centro de costo y su área
            area = $(this).attr("ows_valor10") ? $(this).attr("ows_valor10") : " "
            centro_costo = $(this).attr("ows_valor1") ? $(this).attr("ows_valor1") : " "
          }
        }
      });
    }
  });
  
  //Ahora reviso a qué información pueden acceder con estas características
  const lista_servidores = []
  const array_esquema_completo = []
  $().SPServices({
    operation: "GetListItems",
    async: false,
    listName: "Z_ACC_PAG",
    CAMLViewFields:"<ViewFields>\
                      <FieldRef Name = 'txt_servidor' />\
                      <FieldRef Name = 'txt_host' />\
                      <FieldRef Name = 'txt_fuente_esquema' />\
                      <FieldRef Name = 'acceso' />\
                    </ViewFields>",
    completefunc: function (xData, Status) {
      $(xData.responseXML).find("z\\:row").each(function () {
        let texto_area_cc_usuario = area+'||'+ centro_costo
        let texto_area_cc_lista = $(this).attr("ows_acceso")
        if (texto_area_cc_lista.includes(texto_area_cc_usuario)) {
          lista_servidores.push($(this).attr("ows_txt_servidor"))
          array_esquema_completo.push({
            servidor: $(this).attr("ows_txt_servidor"),
            base: $(this).attr("ows_txt_host"),
            esquema: $(this).attr("ows_txt_fuente_esquema")
          })
        }
      });
    }
  });

   let resultados = [];
   $().SPServices({
     operation: "GetListItems",
     async: false,
     listName: nombreLista,
     CAMLViewFields: "<ViewFields>\
                           <FieldRef Name='txt_servidor' />\
                           <FieldRef Name='BASES_DE_DATOS' />\
                           <FieldRef Name='ESQUEMAS' />\
                           <FieldRef Name='TABLAS' />\
                           <FieldRef Name='CAMPOS' />\
                           <FieldRef Name='servidor_activo' />\
                     </ViewFields>",
     completefunc: function (xData, Status) {
         $(xData.responseXML).find("z\\:row").each(function () {
                 let info = {
                   servidor: $(this).attr("ows_txt_servidor") ? $(this).attr("ows_txt_servidor") : " ",
                   bases_de_datos: $(this).attr("ows_BASES_DE_DATOS") ? $(this).attr("ows_BASES_DE_DATOS") : " ",
                   esquemas: $(this).attr("ows_ESQUEMAS") ? $(this).attr("ows_ESQUEMAS") : " ",
                   tablas: $(this).attr("ows_TABLAS") ? $(this).attr("ows_TABLAS") : " ",
                   campos: $(this).attr("ows_CAMPOS") ? $(this).attr("ows_CAMPOS") : " ",
                   servidor_activo: $(this).attr("ows_servidor_activo") ? $(this).attr("ows_servidor_activo") : " "
                 }
                 //if (lista_servidores.includes(info.servidor)){
                if (true) {
                   resultados.push(info);
                 }
         });
     }
   });
   return [resultados, array_esquema_completo]
 }

//Funcion para obtener los datos de los tipos de campaña
function getInfoClasifiCampañas(nombreLista = "Z_CAMPAÑAS_CLASIFICACION"){
  //Primero extraigo la información del seguimiento de campañas para obtener metadatos de las campañs de cada
  //tipo de clasificación
  let estados_campañas = getCampanaSeguimiento();
  let resultados = [];
  $().SPServices({
    operation: "GetListItems",
    async: false,
    listName: nombreLista,
    CAMLViewFields: "<ViewFields>\
                          <FieldRef Name='descrip_clasificacion' />\
                          <FieldRef Name='descripcion' />\
                          <FieldRef Name='subtipo' />\
                          <FieldRef Name='iniciativas' />\
                          <FieldRef Name='activo' />\
                          <FieldRef Name='fecha_corte' />\
                    </ViewFields>",
    CAMLQuery: "<Query><Where><Eq><FieldRef Name='activo' /><Value Type = 'Text'>1</Value></Eq></Where></Query>",
    completefunc: function (xData, Status) {
      $(xData.responseXML).find("z\\:row").each(function () {
        let list_iniciativas = $(this).attr("ows_iniciativas") ? $(this).attr("ows_iniciativas") : " ";
        let num_activos = 0;
        let num_terminados = 0;
        let iniciativasArray = list_iniciativas.split("|");
        //Recorro todas las iniciativas del segmento y sumo cuantos activos y cuantos terminados hay
        for(var i = 0; i<iniciativasArray.length; i++){
          let descrip_iniciativa = iniciativasArray[i];
          if(!(descrip_iniciativa in estados_campañas)){
            estados_campañas[descrip_iniciativa] = {};
            estados_campañas[descrip_iniciativa]['A'] = 0;
            estados_campañas[descrip_iniciativa]['T'] = 0;
          }
          num_activos += estados_campañas[descrip_iniciativa]['A'];
          num_terminados += estados_campañas[descrip_iniciativa]['T'];
        }
        let info = {
          descrip_clasificacion: $(this).attr("ows_descrip_clasificacion") ? $(this).attr("ows_descrip_clasificacion") : " ",
          descripcion: $(this).attr("ows_descripcion") ? $(this).attr("ows_descripcion") : " ",
          subtipo: $(this).attr("ows_subtipo") ? $(this).attr("ows_subtipo") : " ",
          iniciativas: list_iniciativas,
          activo: $(this).attr("ows_activo") ? $(this).attr("ows_activo") : " ",
          fecha_corte: $(this).attr("ows_fecha_corte") ? $(this).attr("ows_fecha_corte") : " ",
          num_activos: num_activos,
          num_terminados: num_terminados,
          num_total: num_activos + num_terminados
        }
        resultados.push(info);
      });
    }
  });
  return resultados
}

function getLong_Loc(){
  var registros=[];
  $().SPServices({
      operation: "GetListItems",
      async: false,
      listName: "LONG_LOC_MODEL_ART",
      CAMLViewFields: "<ViewFields>\
                          <FieldRef Name = 'valor8' />\
                      </ViewFields>",
      completefunc: function (xData, Status) {
          $(xData.responseXML).find("z\\:row").each(function () {
                  registros.push($(this));
          });
      }
  });
  return registros
}


//Funcion para verificar acceso a data users y data citizen
function tieneAcceso(usuarioEspecifico = null){
  let usuario = usuarioEspecifico ?? obtenerUsuario().current_user;
  if(usuario === "aborbor") return true;
  let correo = `${usuario}@bancoguayaquil.com`
  let correoMayusculas = correo.toUpperCase()
  let tieneAcceso = false;
  $().SPServices({
    operation: "GetListItems",
    async: false,
    listName: "LONG_LOC_MODEL_ART",
    CAMLQuery: '<Query><Where><Or><Eq><FieldRef Name="valor8" /><Value Type="Text">' + correo + '</Value></Eq><Eq><FieldRef Name="valor8" /><Value Type="Text">' + correoMayusculas + '</Value></Eq></Or></Where></Query>',
    CAMLViewFields: "<ViewFields>\
                        <FieldRef Name = 'valor1' />\
                        <FieldRef Name = 'valor8' />\
                    </ViewFields>",
    completefunc: function (xData, Status) {
        $(xData.responseXML).find("z\\:row").each(function () {
          //Primero reviso si el usuario está en la lista
          if($(this).attr("ows_valor8")){
            tieneAcceso = true;
          }
          
        });
    }
  })
  return tieneAcceso;
}


//Funcion para validar que el usuario actual es Data Citizen
function revisar_usuario(areas_revisar = ['GOBIERNO DE INFORMACION Y ANALITICA']){
  //Obtengo el usuario
  //var usuario = window.current_user;
  var usuario = obtenerUsuario();
  var current_user = usuario.current_user;
  //window.current_user = usuario;
  //Reviso si está en la lista de data citizens y data users
  let revisar = false;
  $().SPServices({
    operation: "GetListItems",
    async: false,
    listName: "LONG_LOC_MODEL_ART",
    CAMLViewFields: "<ViewFields>\
                        <FieldRef Name = 'valor1' />\
                        <FieldRef Name = 'valor8' />\
                    </ViewFields>",
    completefunc: function (xData, Status) {
        $(xData.responseXML).find("z\\:row").each(function () {
          //Primero reviso si el usuario está en la lista
          if($(this).attr("ows_valor8")){
            user=$(this).attr("ows_valor8").split(/([^@]+)/)[1].toLowerCase();
            //Si el usuario hace match (o soy yo), procedo a revisar su centro de costo
            if(user == current_user ||current_user =="aborbor"  ){
              //Reviso su centro de costo
              let oficina=$(this).attr("ows_valor1") ? $(this).attr("ows_valor1") : " "
              //Si es de OGA lo marco como true
              if(oficina!==" " && (areas_revisar.includes(oficina)|| current_user =="aborbor")){
                    revisar = true;
                    return
                
              }else{
                //Pero si no es de OGA, no le doy false, pero tampoco le doy los permisos de OGA
                revisar="No pertenece a las áreas"
                return 
              }

                
            }
        }
        });
    }
  });
  return revisar
}
//Funcion para obtencion de datos de visitante 
function datos_visitante(current_user){
  let datos = undefined;
  $().SPServices({
      operation: "GetListItems",
      async: false,
      listName: "LONG_LOC_MODEL_ART",
      CAMLViewFields: "<ViewFields>\
                          <FieldRef Name = 'valor1' />\
                          <FieldRef Name = 'valor2' />\
                          <FieldRef Name = 'valor3' />\
                          <FieldRef Name = 'valor4' />\
                          <FieldRef Name = 'valor5' />\
                          <FieldRef Name = 'valor6' />\
                          <FieldRef Name = 'valor7' />\
                          <FieldRef Name = 'valor8' />\
                          <FieldRef Name = 'valor9' />\
                          <FieldRef Name = 'valor10' />\
                      </ViewFields>",
      completefunc: function (xData, Status) {
          $(xData.responseXML).find("z\\:row").each(function () {
              if (current_user.toLowerCase() == ($(this).attr("ows_valor8") ? $(this).attr("ows_valor8").toLowerCase().split("@")[0] : "usuario_no_existente")) {
                  datos = $(this);
                  return false;
              }
          });
      }
  })
  return datos;
  }

  

  //Funcion de carga para OGASuite.aspx index indice
function index(){
  registrar_visita("INDICE");
  setSuggestedApps()
  let glide = new Glide('.glide', {
    type: 'carousel',
    autoplay: 5000,
    animationDuration: 1000
  });
  const [lista,servidores,bases,esquemas] = getInfoFuentesAprovisionamiento();
  const diccionario = getTerminosAll();
  $("#n-dominios").text(getAvancesAll().ids.length);
  $("#n-origenes").text(bases.length);
  $("#n-atributos").text(diccionario.atributos.length);
  $("#n-terminos").text(diccionario.terminos.length);
  $("#n-catalogos").text(String(getNumCatalogos()));
  glide.mount();

}

function setSuggestedApps(){

 const suggestedApps= getOGAApps({usuario:window.current_user})

  let slideTemplate = ` 
                        <div class="landing-txt glass" style="width: -webkit-fill-available;">\
                          <div class=" justify-content-center" style="display:flex; margin-right: 5%; margin-left:5%; height:100%; align-items:center;">\
                            <div class="container" max-width:1000px;">\
                              <div class="row d-flex justify-content-start mt-3">\
                                  ${appsSectionTemplate({title:"Nuestras Apps", apps: suggestedApps})}
                              </div>\
                            </div>\
                          </div>\
                        </div>\
                                `
  $("#glide__slide-suggestedApps").html(slideTemplate)
}

function appsSectionTemplate({title, apps}){
  return `
    <div class="d-flex flex-column w-100 align-items-center">\
      <h1>${title}</h1>\
      <div class="suggested-apps-container">\
        ${apps?.map(e=>{
          let elemento = `<a href="${e.url}" class="icon-menu-item suggested-visited-app" style="max-width:150px; text-wrap:wrap;" target="_blank">`
          if(!e.icon) elemento+=`<img src="${e.imgUrl}" height="50" width="50" alt="Logo ${e.nombre?.trim().replaceAll(" ","")}">` 
          else elemento+= `<i class="${e.icon}" style="font-size:35px;color:#D2006E"></i>`
          elemento += `<h6 style ="padding:1px; margin-bottom:0px; text-wrap:wrap; text-align:center;" class="font-weight-bold mt-1">${e.nombre}</h6></a>`
          return elemento
        }
        ).join("")}
      </div>\                                    
    </div>\
  `
}

//Funcion obtener apps de OGASuite para slide 3
function getOGAApps(){
  const NUMERO_APPS = 3;

  let suggestedApps=[]
  $().SPServices({
    operation: "GetListItems",
    async: false,
    listName: "Z_OGA_APPS",
    CAMLQuery: `<Query><Where><Eq><FieldRef Name="codigo"/><Value Type="text">999</Value></Eq></Where></Query>`,
    CAMLViewFields: "<ViewFields>\
                        <FieldRef Name='codigo' />\
                        <FieldRef Name='nombre_pagina' />\
                        <FieldRef Name='nombre_subpagina' />\
                        <FieldRef Name='descripcion' />\
                        <FieldRef Name='recurso' />\
                        <FieldRef Name='url' />\
                    </ViewFields>",
    completefunc: function (xData, Status) {
      $(xData.responseXML).find("z\\:row").each(function () {

        let nombre= $(this).attr("ows_nombre_pagina");
        let url = $(this).attr("ows_url");
        let descripcion= $(this).attr("ows_descripcion");
        let nombreSubpagina = $(this).attr("ows_nombre_subpagina")
        let app = {
          nombre,
          nombreSubpagina,
          url,
          descripcion,
          imgUrl:null,
          icon: null,
        }

        let [tipoRecurso, recurso] = $(this).attr("ows_recurso") ? $(this).attr("ows_recurso").split("|") : ["img/Banco-G-Logo-transparent.png"] 
        if(tipoRecurso.toLowerCase() === "img") app.imgUrl = recurso
        else if (tipoRecurso.toLowerCase() === "icon") app.icon = recurso
        let codigo = $(this).attr("ows_codigo")
        if(parseInt(codigo) === 999) suggestedApps.push(app)
      });
    }
  });
  

  return suggestedApps

}

function getVisibleFieldsFromView({ lista = "" }) {
  let apiUrl = `http://vamos.bancoguayaquil.com/sitios/informaciongerencial//_api/web/lists/getbytitle('${lista}')/views`;

  return fetch(apiUrl, {
    method: 'GET',
    headers: {
      'Accept': 'application/json;odata=verbose'
    }
  })
  .then(response => response.json())
  .then(data => {
    // Obtener las vistas disponibles
    let views = data.d.results;
    
    // Suponiendo que se usa la vista predeterminada, podemos obtener las columnas visibles de la vista.
    let defaultView = views.find(view => view.Title === 'All Items'); // O reemplaza 'All Items' por el nombre de tu vista predeterminada
    if (!defaultView) {
      return []; // Si no se encuentra la vista predeterminada
    }

    // Obtener las columnas visibles en la vista (esto depende de la configuración de la vista en SharePoint)
    let columnsVisible = defaultView.ViewFields.results;
    return columnsVisible; // Esto será un array de los nombres de los campos visibles
  })
  .catch(error => {
    console.error('Error fetching views:', error);
    return [];
  });
}

function fetchData(url) {
  return new Promise((resolve, reject) => {
    let allItems = [];
    function makeRequest(url) {
      $.ajax({
        url: url,
        type: "GET",
        headers: {
          "Accept": "application/json;odata=verbose"
        },
        success: function (data) {
          allItems = allItems.concat(data.d.results);

          // Si hay más datos, seguir obteniendo los lotes siguientes
          if (data.d.__next) {
            makeRequest(data.d.__next); // Recursivamente obtiene el siguiente lote
          } else {
            resolve(allItems); // Cuando se hayan recuperado todos los elementos
          }
        },
        error: function (error) {
          reject("Error al consultar los datos: " + JSON.stringify(error));
        }
      });
    }

    makeRequest(url);
  });
}

function getAllListItems({ lista = "", campos = [] }) {
  return getVisibleFieldsFromView({ lista })
    .then(visibleFields => {
      // Si no se especifican campos y se quiere obtener todos, usamos las columnas visibles
      if (campos.toLowerCase() === "todos" || campos.length === 0) {
        campos = visibleFields;
      }

      let apiUrl = `http://vamos.bancoguayaquil.com/sitios/informaciongerencial//_api/web/lists/getbytitle('${lista}')/items?$select=${campos.join(",")}&$top=5000`;

      return fetchData(apiUrl); // Llamada a la función que gestiona la paginación
    })
    .catch(error => {
      console.error('Error fetching list items:', error);
    });
}



//Funcion de carga para SobreOGA.aspx
function sobreOGA(){
  toggleOGA("general")
  subrayar(document.getElementById("gob"))
  registrar_visita("ACERCA DE OGA");
}

function pausarvideo(){
  document.getElementById("g").pause()
  document.getElementById("o").pause()
  document.getElementById("d").pause()

  


  }

  function playvideo(id){
    pausarvideo();
    document.getElementById(id).play();

  }
//Funcion de carga para IndicadoresGestion.aspx
function IndicadoresGestion(){
  registrar_visita("INDICADORES DE GESTION");
}
function subrayar(elemento){
  $(elemento).css("text-decoration","underline")
  $(elemento).css("color","#D2006E")
}

function subrayarOGA(element){
  let elementos=["gob","ogas","data"]

  elementos.forEach(el => {
    let editar=document.getElementById(el)
    $(editar).css("text-decoration","none")
    $(editar).css("color","gray")
  });
  subrayar(element)
}




//Carga de Dominios con animación
//Se utiliza la librería TweenMax, su función TweetMax.staggerTo()
//Se utiliza la librería D3js
function cargarDominios(dominios, avances){
  let tipo = dominios[0].attr("ows_tipo_dominio");
  let tipoClass = tipo.replace(" ","-");
  let dominios_ordenados = dominios.sort((a,b) =>{
    const fA = a.attr("ows_id_dominio");
    const fB = b.attr("ows_id_dominio");;
    let comparison = 0;
    if (fA > fB) {
        comparison = 1;
    } else if (fA < fB) {
        comparison = -1;
    }
    return comparison;
  });
    const colores = {
        "Dominio Derivado": "#9FDCEE",
        "Dominio Maestro": "#D2006E",
        "Dominio Transaccional": "#160F41"
    }
    const data = [{
        "boxes":(dominios.length)
      }
      ];
    
      const colors = [colores[tipo]];
      scaleColor = d3.scaleOrdinal()
      .domain(data.map(d => d.year))
      .range(colors);
    
      uncount = (data, accessor) =>
      data.reduce((arr, item) => {
        const count = accessor(item)
        for (let i = 0; i < count; i++) {
          arr.push({
            ...item
          })
        }
        return arr
      }, []);
    
      const boxes = uncount(data, d => d.boxes);
    
      const nest = d3
      .nest()
      .key(d => d.venue)
      .entries(boxes);
    
      const graph = d3.select(".Wafflechart."+tipoClass);
      const group = graph
      .selectAll(".container")
      .data(nest)
      .join("div")
      .attr("class", "waffle_container "+tipoClass);
    
      group
      .selectAll(".box")
      .data(d => d.values)
      .join("div")
      .attr("class", "box "+tipoClass)
      .style("background-color", d => scaleColor(d.year));
    
      //intitiate paused animation
      let anim = new TimelineLite({paused: true});
        anim.staggerTo((".box."+tipoClass), 0.5, {
          scale: 1,
          ease: "none",
          stagger: {
            amount: -1,
            grid: "auto",
            from: "center",
            axis: null,
        }
      });
      //Agregar nombres, estilos específicos si cuentan con avance y tooltips a los boxes de los dominios impresos
      $.each(dominios_ordenados, function (index, item) {
        let caja = document.querySelector(".waffle_container."+ tipoClass +">:nth-child("+ (index+1) +")");
        caja.innerHTML=item.attr("ows_descripcion_dominio");
        caja.setAttribute("onclick", "redirigirFichaDominio('" + item.attr("ows_id_dominio")+ "')");
        if(avances.ids.includes(item.attr("ows_id_dominio"))){
          caja.classList.add("activo");
          let porcentaje = parseFloat(item.attr("ows_porcentaje_avance_dominio")) * 100;
          caja.setAttribute("data-toggle","tooltip");
          caja.setAttribute("data-placement","left");
          caja.setAttribute("data-original-title","Porcentaje de avance: "+porcentaje.toFixed(2)+"%");
        } 
      });
      anim.play(0);
      if(tipo == "Dominio Maestro"){
        window.maestro = anim;
      }else if(tipo == "Dominio Derivado"){
        window.deriv = anim;
      }else{
        window.transac = anim;
      }
}

//Función para redirigir a la ficha de Dominio según el código ingresado
function redirigirFichaDominio(codigo){
  window.location = "FichaDominio.aspx?id_dominio="+codigo;
}

//Funcion para visualizar en LibroDominos.aspx la sección "Mis Dominios"
//en esta sección se presentarán los Dominios en los que el usuario actual
//es parte de la estructura.
function cargarDominiosUsuario(dominio_usuario,avances){
  $(".waffle_container.Dominio-Maestro").remove();
  $(".waffle_container.Dominio-Derivado").remove();
  $(".waffle_container.Dominio-Transaccional").remove();
  if(dominio_usuario.maestros.length > 0 ){
    cargarDominios(dominio_usuario.maestros,avances);
  }
  if(dominio_usuario.transaccionales.length > 0 ){
    cargarDominios(dominio_usuario.transaccionales,avances);
  }
  if(dominio_usuario.derivados.length > 0 ){
    cargarDominios(dominio_usuario.derivados,avances);
  }
  window.filtroUsuario = true;
}

//Filtro Visual de Dominios
function filtrarDominios(tipo){
  registrar_visita("LIBRO DE DOMINIOS", capitalizarPrimeraLetra(tipo));

  if(!window.filtro_actual)window.filtro_actual = document.querySelector("ol.breadcrumb.pt-0>:nth-child(1)");
  let elemento;
  $("#buttonchart").css("display","none")
  $("#chartdiv").css("display","none")
  $("#waffle").css("display","block")
  $(".Maestros").css("display","block")
    $(".Derivados").css("display","block")
    $(".Transaccionales").css("display","block")
  switch (tipo) {
    case "Maestros":
      if(window.filtro_actual == document.querySelector("ol.breadcrumb.pt-0>:nth-child(2)")) return
      document.querySelector("ol.breadcrumb.pt-0>:nth-child(2)").classList.add("filtro-actual");
      window.filtro_actual.classList.remove("filtro-actual");
      window.filtro_actual = document.querySelector("ol.breadcrumb.pt-0>:nth-child(2)");
      elemento = 1;
      break;
    case "Transaccionales":
      if(window.filtro_actual == document.querySelector("ol.breadcrumb.pt-0>:nth-child(3)")) return
      document.querySelector("ol.breadcrumb.pt-0>:nth-child(3)").classList.add("filtro-actual");
      window.filtro_actual.classList.remove("filtro-actual");
      window.filtro_actual = document.querySelector("ol.breadcrumb.pt-0>:nth-child(3)");
      elemento = 2;
      break;
    case "Derivados":
      if(window.filtro_actual == document.querySelector("ol.breadcrumb.pt-0>:nth-child(4)")) return
      document.querySelector("ol.breadcrumb.pt-0>:nth-child(4)").classList.add("filtro-actual");
      window.filtro_actual.classList.remove("filtro-actual");
      window.filtro_actual = document.querySelector("ol.breadcrumb.pt-0>:nth-child(4)");
      elemento = 3;
      break;
    case "usuario":
      if(window.filtro_actual == document.querySelector("ol.breadcrumb.pt-0>:nth-child(5)")) return
      document.querySelector("ol.breadcrumb.pt-0>:nth-child(5)").classList.add("filtro-actual");
      window.filtro_actual.classList.remove("filtro-actual");
      window.filtro_actual = document.querySelector("ol.breadcrumb.pt-0>:nth-child(5)");
      elemento = "todos";
     
     
      break;
    default:
      if(window.filtro_actual == document.querySelector("ol.breadcrumb.pt-0>:nth-child(1)")) {
        $("#buttonchart").css("display","block")
        document.querySelector("#buttonchart").innerHTML="Priorización"
        return
      }
      document.querySelector("ol.breadcrumb.pt-0>:nth-child(1)").classList.add("filtro-actual");
      window.filtro_actual.classList.remove("filtro-actual");
      window.filtro_actual = document.querySelector("ol.breadcrumb.pt-0>:nth-child(1)");
      elemento = "todos";
      $("#buttonchart").css("display","block")
      document.querySelector("#buttonchart").innerHTML="Priorización"
      break;
  }
  for (let num = 1; num < 4; num++) {
    let aux = document.querySelector(".card-body>:nth-child("+ num +")")
    if(num === elemento){
      aux.style.height = "unset";
      aux.style.visibility = "visible";
    }else if (elemento === "todos"){
      aux.style.height = "unset";
      aux.style.visibility = "visible";
    }else{
      aux.style.height = "0px";
      aux.style.visibility = "hidden";
    }
  }

  if(window.filtroUsuario && tipo !="usuario"){
    $(".waffle_container.Dominio-Maestro").remove();
    $(".waffle_container.Dominio-Derivado").remove();
    $(".waffle_container.Dominio-Transaccional").remove();
    cargarDominios(window.dominios.maestros,window.avances);
    cargarDominios(window.dominios.transaccionales,window.avances);
    cargarDominios(window.dominios.derivados,window.avances);
    $('[data-toggle="tooltip"]').tooltip();
    window.filtroUsuario = false;
  }

  if(tipo == "Maestros"){
    window.maestro.restart()
  }else if(tipo == "Transaccionales"){
    window.transac.restart()
  }else if(tipo == "Derivados"){
    window.deriv.restart()
  }else if(tipo == "usuario"){
    cargarDominiosUsuario(window.dominio_usuario,window.avances);
    window.maestro.restart()
    window.transac.restart()
    window.deriv.restart()
  }else{
    $("#buttonchart").css("display","block")
    
    window.maestro.restart()
    window.transac.restart()
    window.deriv.restart()
  }
 // $("#buttonchart").css("display","block")
}

//Funcion de carga para LibroDominios.aspx
function libroDominios(){
  const dominios = getDominiosAll();
  const avances = getAvancesAll();
  const dominios_usuario = getDominiosUsuario(dominios.dominios);
  window.dominios = dominios;
  window.dominio_usuario = dominios_usuario;
  window.avances = avances;
  window.filtroUsuario = false;
  cargarDominios(dominios.maestros,avances);
  cargarDominios(dominios.transaccionales,avances);
  cargarDominios(dominios.derivados,avances);
  $('[data-toggle="tooltip"]').tooltip()
  registrar_visita("LIBRO DE DOMINIOS", "Todos");
  let datos=cargardatos()
  window.inv_casos=datos[0]
  window.estados=datos[1]
}

//Funcion para ordenar el glosario de datos por orden alfabetico segun nombre y dominio
function sortGlosario(glosario) {
  glosario.sort((a, b) => {
    //Se Obtiene el valor del atributo usando jQuery y se lo guarda en Nombre_Metad_A
    const Nombre_Metad_A = $(a).attr("ows_nombre_metad").toLowerCase();
    //Se Obtiene el valor del atributo usando jQuery y se lo guarda en Nombre_Metad_B
    const Nombre_Metad_B = $(b).attr("ows_nombre_metad").toLowerCase();
    //Se Utiliza localeCompare() para comparar Nombre_Metad_A y Nombre_Metad_B y que localizacion este en español
    // y la sensibilidad a los acentos.
    // devuelve negativo si A viene antes que B y devuelve postivo si A viene despues de B
    return Nombre_Metad_A.localeCompare(Nombre_Metad_B, 'es', { sensitivity: 'accent' });
    });
    
  return glosario;
}

//Funcion de carga de Glosario.aspx o Diccionario de Datos
function glosario(){
  const glosario = getTerminosAll();
  window.glosario = glosario;
  window.aux = sortGlosario(glosario.todos);
  
  printSearchResults(glosario.todos);
  
  autocompletado(document.getElementById("glosario-search"),"ows_nombre_metad", glosario.todos);
  registrar_visita("GLOSARIO EMPRESARIAL DE DATOS");
  estandarizarSegmentacion()
}

//Funcion para paginacion en Glosario.aspx
//se utiliza la libreria pagination.js
function printSearchResults(resultados){
  let parametroBusqueda = getParams("buscar")
  if(parametroBusqueda){
    resultados = resultados.filter(e=>calcularSimilitud(e.attr("ows_nombre_metad"), parametroBusqueda) > 80)
  }
  $('.pagination').pagination({
      dataSource: resultados,
      pageSize: 10,
      className: 'paginationjs-theme-bg',
      showSizeChanger: true,
      afterRender: function(){
        document.body.scrollTop = 0;
        document.documentElement.scrollTop = 0;
 
      },
      callback: function (data, pagination) {
          // template method of yourself
        
          let html = template(data, 10);
    
          $("#resultados").html(html);
      }
        
    
  });
}

function printCampañas(resultados){
 
  $('.pagination').pagination({
    dataSource: resultados,
    pageSize: 14,
    className: 'paginationjs-theme-bg',
    afterRender: function(){
      document.body.scrollTop = 0;
      document.documentElement.scrollTop = 0;
    },
    callback: function (data, pagination) {
        // template method of yourself
        let html = template_campaña(data);
       
        $("#artefactos").html(html);
    }
});
}

//Funcion para paginacion en Dominio_artefactos
function printArtefactos(resultados){
 
  $('.pagination').pagination({
      dataSource: resultados,
      pageSize: 14,
      className: 'paginationjs-theme-bg',
      afterRender: function(){
        document.body.scrollTop = 0; 
        document.documentElement.scrollTop = 0;
      },
      callback: function (data, pagination) {
          // template method of yourself
 
          let html = template_artefactos(data);
          $("#artefactos").html(html);
      }
  });
}

//Funcion para convertir la primera letra de cada palabra en mayusc
//hola mundo -> Hola Mundo
function mayusc_each_word(texto){
  const words = texto.toLowerCase().split(" ");
  let aux =[];
  for (let i = 0; i < words.length; i++) {
      if(words[i]!=""){
       words[i] = words[i][0].toUpperCase() + words[i].substr(1);   
       aux.push(words[i]);
      }
  };
  return aux.join(" ");
};

//Plantilla para imprimir los términos del glosario
function template(datos, pagina){
  
  let html ='';
  let separador = '<div class="separator"></div>';
  let contador = 1;
  const iconos = {
    "Impacto en procesos": '<i class="iconsminds-gears"></i>',
    "Impacto en negocio / reputacional": '<i class="simple-icon-eye"></i>',
    "Impacto económico": '<i class="iconsminds-dollar"></i>',
    "Impacto regulatorio": '<i class="iconsminds-police-station"></i>'
  }

  $.each(datos, function (index, item) {
    let atributos =undefined;
    let atr_html = '';

    if(item.attr("ows_caracteristicas")){ //De existir caracteristicas se procesan los badges impresos junto al nombre
      atributos = item.attr("ows_caracteristicas").split("; ");
      let CDE = atributos.indexOf("(CDE) Elemento clave de datos");
      let AR = atributos.indexOf("(AR) Atributo de Referencia");
      if(AR>=0 && CDE >=0){
        let temp = atributos.toSpliced(CDE,1);
        temp.unshift("(CDE) Elemento clave de datos");
        atributos = temp;
      }
      for (let n = 0; n < atributos.length; n++) {
        

        if(atributos[n].includes("CDE")){
          if(atributos[n].includes("(")){
            atributos[n] = atributos[n].split(" ")[0].replace("(","").replace(")","");
            atr_html += '<span class="badge badge-pill badge-secondary atributo caracteristica"  title="Critical Data Element">'+ atributos[n] +'</span>'
            
          } else{
            atr_html += '<span class=" badge badge-pill badge-secondary atributo" title="'+ atributos[n] +'"  title="Critical Data Element">'+ iconos[atributos[n]] +'</span>'
          }

        }else{
          if(atributos[n].includes("(")){
            atributos[n] = atributos[n].split(" ")[0].replace("(","").replace(")","");
            atr_html += '<span class="badge badge-pill badge-secondary atributo caracteristica" title="Atributo de Referencia">'+ atributos[n] +'</span>'
            
          } else{
            atr_html += '<span class="badge badge-pill badge-secondary atributo" title="'+ atributos[n] +'" >'+ iconos[atributos[n]] +'</span>'
          }

        }
        
        
      }
    }
    let datoPersonal = parseInt(item.attr("ows_dato_personal"))
    if(datoPersonal > 0 ){ //identificar si el termino/atributo es un dato personal
      let {data, subsegmentos} = getSegmentos();
      let complementoTooltip = ` - ${subsegmentos[3][datoPersonal].label}`
      let tooltip = `Dato personal${datoPersonal > 1? complementoTooltip :""} `
      atr_html += `<span class="badge badge-pill badge-secondary atributo" title="${tooltip}"><i class="iconsminds-business-man"></i></span>`
    }
    if(item.attr("ows_golden_record")== "1"){ //identificar si el termino/atributo es golden record
      atr_html += '<span class="badge badge-pill badge-secondary atributo" title="Golden Record"><i class="simple-icon-diamond"></i></span>'
    }
    if(item.attr("ows_tipo_metad") == "ATRIBUTO"){ //en caso de ser atributo darle el enlace a la ficha de atributo
      var titulo = '<a href="Ficha_Atributo.aspx?atributo='+ item.attr("ows_id_metad")+ '+' +item.attr("ows_tipo_metad") +'" class="list-item-heading color-theme-1 link_subrrayado">'+ item.attr("ows_nombre_metad").replaceAll('<br>','') +'</a>';
    }else{
      var titulo = '<p class="list-item-heading color-theme-1 mb-0">'+ item.attr("ows_nombre_metad").replaceAll('<br>','') +'</p>';
    }
    html += '<div class="mb-3">\
    <div class="resultado-head">\
        '+ titulo +'\
        <div class="atributos">\
          '+ atr_html +'\
        </div>\
    </div>\
    <p class="mb-1">'+ mayusc_each_word(item.attr("ows_tipo_metad")) +'</p>\
    <p class="mb-1" style="font-weight: bold;">'+ item.attr("ows_descripcion_dominio").replaceAll(";"," |") +'</p>\
    <p class="mb-2 text" style="text-align:justify;">'+ item.attr("ows_descripcion_metad") +'</p>\
    '+ (contador == pagina || index+1 == datos.length ? ' ' : separador) +'\
  </div>';
    contador == pagina ? contador = 0 : contador++;
  });
  return html
}
function template_campaña(data){
  let campana_html=''
  $.each(data,function(index,value){
    campana_html+='<div class="card m-2 artefacto">\
    <div onclick= "mostrardrawioCampana(\''+value.codigoIniciativa+'\');" class="position-absolute card-top-buttons p-1">\
      <button class="btn btn-outline-magenta icon-button">\
        <i class="simple-icon-organization"></i>\
      </button>\
    </div>\
    <div class="position-relative">\
        <span\
        style="font-size:13px;width:48%" class="pr-4 pt-1 pb-1 badge badge-pill badge-theme-1 position-absolute badge-top-left">'+'A - '+value.A+'</span>\
        <span\
        style="font-size:13px;background:gray;color:white;width:35%" class="pr-4 pt-1 pb-1 badge badge-pill  position-absolute badge-top-left-2">T - '+value.T+'</span>\
        </div>\
    <div class="card-body text-center mt-3" onclick="mostrarDetalleCampana(\''+value.codigoIniciativa+'\')" style="width:170px">\
        <a href="#">\
        <div class="mb-2">\
            <i class="simple-icon-layers" style="font-size: 25px;"></i>\
        </div>\
        <div>\
          <p class="mb-3 listing-heading ellipsis">'+capitalizarPrimeraLetra(value.nombre.toLowerCase())+'</p>\
        </div>\
        </a>\
    </div>\
</div>'
  });
return campana_html
}
//Funcion de plantilla para imprimir artefactos
function template_artefactos(datos){
 
  let artefactos_html = '';
  const iconos = {
    "ANÁLISIS": "iconsminds-statistic",
    "CUBO": "iconsminds-dice",
    "DASHBOARD": "iconsminds-optimization",
    "MODELO": "simple-icon-layers",
    "PROCESO DE APOYO": "iconsminds-link-2",
    "REPORTE": "iconsminds-statistic"
  }
  $.each(datos,function(index,item){
    artefactos_html += '<div class="card m-2 artefacto">\
                          <div class="card-body text-center">\
                            <a href="http://vamos.bancoguayaquil.com/sitios/informaciongerencial/Paginas/ANALYTICS/Marlon%20Z/PAGINAS/COMUNIDAD_ANALITICA/descripcion_modelo_autom.aspx?codigo='+ item.attr("ows_codigo") +'" target="_blank">\
                              <div class="mb-2">\
                                <i class="'+ iconos[item.attr("ows_txt_desc_tipo_artefacto")] +'" title="'+ mayusc_each_word(item.attr("ows_txt_desc_tipo_artefacto")) +'" style="font-size: 25px;"></i>\
                              </div>\
                              <div>\
                                <p class="card-text mb-0 font-weight-bold">'+ mayusc_each_word(item.attr("ows_modelo_analitica")) +'</p>\
                              </div>\
                            </a>\
                          </div>\
                        </div>';
  });
  return artefactos_html
}

//Funcion de plantilla para imprimir las fuentes
function template_fuentes(fuentes){
  let html = '';
  $.each(fuentes,function(index,item){
    if(item.attr("ows_LinkFilename").split("FUENTE DE APROVISIONAMIENTO ")[1]){
      nombre_archivo = item.attr("ows_LinkFilename").split("FUENTE DE APROVISIONAMIENTO ")[1].split(".pdf")[0]
      html += '<div class="card m-2 artefacto">\
                            <div class="card-body text-center">\
                              <a href="http://vamos.bancoguayaquil.com/sitios/informaciongerencial/Paginas/ANALYTICS/Marlon%20Z/PAGINAS/COMUNIDAD_ANALITICA/assets/fuentes/'+ item.attr("ows_LinkFilename") +'" target="_blank">\
                                <div class="mb-2">\
                                  <i class="iconsminds-big-data" title="'+ mayusc_each_word(nombre_archivo) +'" style="font-size: 25px;"></i>\
                                </div>\
                                <div>\
                                  <p class="card-text mb-0 font-weight-bold">'+ mayusc_each_word(nombre_archivo) +'</p>\
                                </div>\
                              </a>\
                            </div>\
                          </div>';
    }
  });
  return html;
}

//Funcion de plantilla para imprimir los servidores
function template_servidores(servidores){
    let html = '';
    $.each(servidores,function(index,item){
        var servidor_activo = (item['servidor_activo'] == "1") ? "" : "servidor_inactivo"
        var linea_link = (item['servidor_activo'] == "1") ? '<a href = "BuscadorCampos.aspx?servidor='+item['servidor']+'">' : '<a>'
        html += '<div class="col-md-3 mb-4">\
                    <div class="card contador servidor '+servidor_activo+'">\
                    '+linea_link+'\
                        <div class="card-body p-2">\
                          <div class="row justify-content-center d-flex flex-row align-items-center mb-1">\
                            <div class="glyph pr-0">\
                              <i class="iconsminds-big-data" style="font-size: 45px;"></i>\
                            </div>\
                            <h4 class="m-0 pl-2">'+item['servidor']+'</h4>\
                          </div>\
                          <div class="row justify-content-center d-flex flex-row align-items-center">\
                            <div class="post-icon mr-1 d-inline-block" style="width: 50px;">\
                              <a href="BuscadorCampos.aspx?servidor='+item['servidor']+'" title="Bases de datos">\
                                <i class="simple-icon-grid mr-1"></i>\
                              </a>\
                              <a href="BuscadorCampos.aspx?servidor='+item['servidor']+'" title="Bases de datos"> <span>'+item['bases_de_datos']+'</span> </a>\
                            </div>\
                            <div class="post-icon mr-1 d-inline-block" style="width: 75px;">\
                              <a href="BuscadorCampos.aspx?servidor='+item['servidor']+'" title="Tablas">\
                                <i class="simple-icon-layers mr-1"></i>\
                              </a>\
                              <a href="BuscadorCampos.aspx?servidor='+item['servidor']+'" title="Tablas">\
                                <span>'+item['tablas']+'</span>\
                              </a>\
                            </div>\
                            <div class="post-icon mr-1 d-inline-block" style="width: 100px;">\
                              <a href="BuscadorCampos.aspx?servidor='+item['servidor']+'" title="Campos">\
                                <i class="simple-icon-list mr-1"></i>\
                              </a>\
                              <a href="BuscadorCampos.aspx?servidor='+item['servidor']+'" title = "Campos">\
                                <span>'+item['campos']+'</span>\
                              </a>\
                            </div>\
                          </div>\
                        </div>\
                      </a>\
                    </div>\
                  </div>';
      });
    return html;
  }

//Funcion de plantilla para imprimir los tipos de campañas
function template_tipos_campañas(tipos_campañas, id_dominio, dominio, icono){
  let html = '';
  $.each(tipos_campañas,function(index,item){
      //Le agrego el icono de informacion solo cuando sean las secciones primeras
      var icono_info = (icono == "iconsminds-folder") ? '<i class="simple-icon-info" data-toggle="tooltip" data-placement="bottom" title="'+item['descripcion']+'"></i>' : ''
      var linea_link = '"'+item['pagina']+'?id_dominio='+id_dominio+'&dominio='+dominio+'&'+item['parametro_busqueda']+'"'
      html += '<div class="col-md-3 mb-4 d-flex justify-content-center">\
                  <div class="card contador servidor">\
                    <div class="card-body p-2">\
                      <a href = '+linea_link+'>\
                        <div class="row justify-content-start d-flex flex-row align-items-center pl-3">\
                        '+icono_info+'\
                        </div>\
                        <div class="row justify-content-center d-flex flex-row align-items-center mt-2">\
                          <div class="glyph pr-0">\
                            <i class="'+icono+'" style="font-size: 45px;"></i>\
                          </div>\
                          <h4 class="m-0 pl-2">'+item['descrip_clasificacion']+'</h4>\
                        </div>\
                        <div class="row justify-content-center d-flex flex-row align-items-center">\
                          <div class="post-icon mr-1 d-inline-block" style="width: 65px;">\
                            <i class="iconsminds-next mr-1" title="Campañas activas"></i>\
                            <span>'+item['num_activos']+'</span>\
                          </div>\
                          <div class="post-icon mr-1 d-inline-block" style="width: 65px;">\
                            <i class="iconsminds-yes mr-1" title="Campañas terminadas"></i>\
                            <span>'+item['num_terminados']+'</span>\
                          </div>\
                          <div class="post-icon mr-1 d-inline-block" style="width: 65px;">\
                            <i class="iconsminds-download-1 mr-1" title="Campañas totales"></i>\
                            <span>'+item['num_total']+'</span>\
                          </div>\
                        </div>\
                      </a>\
                    </div>\
                  </div>\
                </div>';
    });
  return html;
}


  function quitarAcentos(cadena){
    const acentos = {'á':'a','é':'e','í':'i','ó':'o','ú':'u','Á':'A','É':'E','Í':'I','Ó':'O','Ú':'U'};
    return cadena.split('').map( letra => acentos[letra] || letra).join('').toString();	
}

//Funcion de Búsqueda de terminos/atributos en una lista o arreglo con regex.test() - se incluyen parentesis
//El parametro isList define si es una lista o arreglo
//window.segmento, window.dominio son variables globales que se actualizan por el usuario al momento de implementar
//un nuevo segmento por dato personal, golden record, termino o atributo.
//O cuando filtra por dominio y se mantiene un segmento activado
function searchList(search_value,column,list, isList = true){
  if(search_value.includes("(")) search_value = search_value.replaceAll("(","\\("); //parsing de parentesis ya que se filtra con regex
  if(search_value.includes(")")) search_value = search_value.replaceAll(")","\\)");
  search_value= quitarAcentos(search_value)
 
  let regex = new RegExp(search_value,"i");
  if(isList){
   
    
    var results = list.filter(item => regex.test(quitarAcentos(item.attr(column))));
   
    
    if(window.segmento && window.dominio){

      let aux = [];
      if(window.segmento == "datos personales"){
        $.each(results, function(index, item){
          if(item.attr("ows_dato_personal")== "1" ){
            //(item.attr("ows_descripcion_dominio") == window.dominio)
            let lista =item.attr("ows_descripcion_dominio").split("; ")
            lista.forEach(element => {
             
              if(element==window.dominio  ){
                aux.push(item)
              };      
            });
          }
        });
      }else if(window.segmento == "golden"){
        $.each(results, function(index, item){
          if(item.attr("ows_golden_record")== "1"){
            let lista =item.attr("ows_descripcion_dominio").split("; ")
            lista.forEach(element => {
             
              if(element==window.dominio  ){
                
                aux.push(item)
              };      
            });
          }
        });
      }else{
        $.each(results, function(index, item){
          if(item.attr("ows_tipo_metad") == window.segmento ){
            let lista =item.attr("ows_descripcion_dominio").split("; ")
            lista.forEach(element => {
              if(element==window.dominio  ){
                
                aux.push(item)
              };      
            });
          }
        });
      }
      results = aux;
    }else if(window.segmento){
     
      let aux = [];
      if(window.segmento == "datos personales"){
        $.each(results, function(index, item){
          if(item.attr("ows_dato_personal") == "1"){
            aux.push(item);
          } 
        });
      }else if(window.segmento == "golden"){
        $.each(results, function(index, item){
          if(item.attr("ows_golden_record")== "1"){
            aux.push(item);
          }
        });
      }else{
        $.each(results, function(index, item){
          if(item.attr("ows_tipo_metad") == window.segmento){
            aux.push(item);
          }
        });
      }
      results = aux;
    }else if(window.dominio){
      
      let aux = [];
      $.each(results, function(index, item){
        let lista =item.attr("ows_descripcion_dominio").split("; ")
        lista.forEach(element => {
          if(element==window.dominio  ){
            
            aux.push(item)
          };      
        });
      });
      results = aux;
    }
  }else{
    let nueva_lista=[]
    list.forEach(element => {
      if(element.includes(";")){
        element.split("; ").forEach(el=>{
          if(!nueva_lista.includes(el)){
            nueva_lista.push(el)
          }
        })
      }else{
        if(!nueva_lista.includes(element)){
          nueva_lista.push(element)
        }
      }
    });
    nueva_lista.sort()

    var results = nueva_lista.filter(item => regex.test(item));
  }
  return results
}

//Funcion para autocompletado en el input de Glosario.aspx
function autocompletado(inp, columna, arr, isList=true) {
  var currentFocus;
  inp.addEventListener("input", function(e) {
      var a, b, i, val = this.value;
      closeAllLists();
      if (!val) { return false;}
      currentFocus = -1;
      a = document.createElement("DIV"); //Div que contendrá los resultados según el input del usuario
      a.setAttribute("id", this.id + "autocomplete-list");
      a.setAttribute("class", "autocomplete-items");
      this.parentNode.appendChild(a);
      
      let resultados = searchList(val.toLowerCase(), columna, arr,isList); //se filtra la lista y obtienen los resultados
      $.each(resultados, function(index, item){
          b = document.createElement("DIV");
          isList ? b.innerHTML = item.attr(columna).split("<br>").join("") : b.innerHTML = item.split("<br>").join("");
          isList ? b.innerHTML += "<input type='hidden' value='" + item.attr(columna).split("<br>").join("") + "'>" : b.innerHTML += "<input type='hidden' value='" + item.split("<br>").join("") + "'>";
          b.addEventListener("click", function(e) { //código a ejecutar cuando se haga click en opción del dropdown
            inp.value = this.getElementsByTagName("input")[0].value;
            /*agregado*/
            let filtro = inp.value
            if(columna=="ows_nombre_metad")printSearchResults(searchList(filtro, columna, arr));
            if(columna=="ows_descripcion_dominio"){ //en caso de estar seleccionando un dominio para filtrar
             
              window.dominio = filtro;              //se actualiza el dominio por el que se filtra, se actualiza el autocompletado del input a solo presentar dominios                                                    
              let filtrado = searchList(filtro,"ows_descripcion_dominio",window.aux);
              printSearchResults(filtrado);
              document.getElementById("glosario-search").outerHTML = document.getElementById("glosario-search").outerHTML;
              document.getElementById("glosario-buscar").outerHTML = document.getElementById("glosario-buscar").outerHTML;
              autocompletado(document.getElementById("glosario-search"),"ows_nombre_metad",filtrado);
              if(!isList)document.getElementById("dropdown-btn").innerText = filtro;
              document.getElementById("dropdown-btn").classList.add("filtro-activo");
            
              }
                /*fin added*/
             closeAllLists();
          });
          a.appendChild(b);
      });
      if(resultados.length > 6){ //limitar tamaño del div según el número de resultados
        document.querySelector("#"+this.id + "autocomplete-list").style.overflowY = "scroll";
        document.querySelector("#"+this.id + "autocomplete-list").style.height = "260px";
        document.querySelector(".autocomplete-items :first-child").style.borderTopRightRadius = "unset"
        document.querySelector(".autocomplete-items :last-child").style.borderBottomRightRadius = "unset"
      }else{
        document.querySelector("#"+this.id + "autocomplete-list").style.overflowY = "unset";
        document.querySelector("#"+this.id + "autocomplete-list").style.height = "unset";
      }
  });
  inp.addEventListener("keydown", function(e) {
      var x = document.getElementById(this.id + "autocomplete-list");
      if (x) x = x.getElementsByTagName("div");
      if (e.keyCode == 40) {
        currentFocus++;
        addActive(x);
      } else if (e.keyCode == 38) { //up
        currentFocus--;
        addActive(x);
      } else if (e.keyCode == 13) {
        e.preventDefault();
        if (currentFocus > -1) { //en caso de haber navegado con flechas a una opción dentro del div y presionar ENTER
          if (x){                //la función considerará el arreglo de elementos X con el índice currentFocus
                                 //ejecutará el onclick del elemento y según los parametros se realizará el filtrado
            x[currentFocus].click()
            let filtro = x[currentFocus].querySelector("input").value;
            if(columna=="ows_nombre_metad")printSearchResults(searchList(filtro, columna, arr));
            if(columna=="ows_descripcion_dominio"){ //en caso de estar seleccionando un dominio para filtrar
             
              window.dominio = filtro;              //se actualiza el dominio por el que se filtra, se actualiza el autocompletado del input a solo presentar dominios                                                    
              let filtrado = searchList(filtro,"ows_descripcion_dominio",window.aux);
              printSearchResults(filtrado);
              document.getElementById("glosario-search").outerHTML = document.getElementById("glosario-search").outerHTML;
              document.getElementById("glosario-buscar").outerHTML = document.getElementById("glosario-buscar").outerHTML;
              autocompletado(document.getElementById("glosario-search"),"ows_nombre_metad",filtrado);
              if(!isList)document.getElementById("dropdown-btn").innerText = filtro;
              document.getElementById("dropdown-btn").classList.add("filtro-activo");
            }
          }
        }
        if(this.value != ''){
          if(columna=="ows_nombre_metad"){
            printSearchResults(searchList(this.value, columna, arr))
            closeAllLists();
          };
          if(columna=="ows_descripcion_dominio"){
            let matched = false;
            let input = this.value;
            if(arr.includes(input)){ 
              window.dominio = input; 
              matched = true;
            }
            if(!matched) return false;
            let filtrado = searchList(window.dominio,"ows_descripcion_dominio",window.aux);
            printSearchResults(filtrado);
            document.getElementById("glosario-search").outerHTML = document.getElementById("glosario-search").outerHTML;
            document.getElementById("glosario-buscar").outerHTML = document.getElementById("glosario-buscar").outerHTML;
            autocompletado(document.getElementById("glosario-search"),"ows_nombre_metad",filtrado);
            if(!isList)document.getElementById("dropdown-btn").innerText = this.value;
            document.getElementById("dropdown-btn").classList.add("filtro-activo");
            closeAllLists();
          }
        }else{
          if(columna=="ows_nombre_metad")printSearchResults(searchList("", columna, arr));
        }
      }
  });
  function addActive(x) {
    if (!x) return false;
    removeActive(x);
    if (currentFocus >= x.length) currentFocus = 0;
    if (currentFocus < 0) currentFocus = (x.length - 1);
    x[currentFocus].classList.add("autocomplete-active");
    document.querySelector("#glosario-searchautocomplete-list > div:nth-child("+ (currentFocus+1) +")").scrollIntoView({ block: "nearest", inline: "nearest" });
  }
  function removeActive(x) {
    for (var i = 0; i < x.length; i++) {
      x[i].classList.remove("autocomplete-active");
    }
  }
  function closeAllLists(elmnt) {
    var x = document.getElementsByClassName("autocomplete-items");
    for (var i = 0; i < x.length; i++) {
      if (elmnt != x[i] && elmnt != inp) {
        x[i].parentNode.removeChild(x[i]);
      }
    }
  }
  document.addEventListener("click", function (e) {
      closeAllLists(e.target);
  });
  
  document.getElementById("glosario-buscar").addEventListener("click", function (e) { //evento click para el icono de la lupa en el input
    if(columna == "ows_nombre_metad")printSearchResults(searchList(document.getElementById("glosario-search").value, columna, arr));
    if(columna == "ows_descripcion_dominio"){
      let input = document.getElementById("glosario-search").value
      if(arr.includes(input)){ 
        window.dominio = input; 
        matched = true;
      }
      if(!matched) return false;
      let filtrado = searchList(window.dominio,"ows_descripcion_dominio",window.aux);
      printSearchResults(filtrado);
      document.getElementById("glosario-buscar").outerHTML = document.getElementById("glosario-buscar").outerHTML;
      autocompletado(document.getElementById("glosario-search"),"ows_nombre_metad",filtrado);
      if(!isList)document.getElementById("dropdown-btn").innerText = document.getElementById("glosario-search").value;
      document.getElementById("dropdown-btn").classList.add("filtro-activo");
    }
  });
}

//Funcion para implementar un nuevo criterio o segmento al filtrado del glosario / diccionario de datos
function nuevoCriterio(criterio){
  document.getElementById("dropdown-btn").innerText = mayusc_each_word(criterio);
  if(criterio == "dominio"){
    window.dominio = undefined;
    document.getElementById("glosario-search").outerHTML = document.getElementById("glosario-search").outerHTML;
    autocompletado(document.getElementById("glosario-search"),"ows_descripcion_dominio",uniqueColumn(window.aux,"ows_descripcion_dominio"),false);
  }else if(criterio == "todos"){
    window.dominio = undefined;
    printSearchResults((searchList(".","ows_nombre_metad",window.aux)));
    document.getElementById("glosario-search").outerHTML = document.getElementById("glosario-search").outerHTML;
    autocompletado(document.getElementById("glosario-search"),"ows_nombre_metad",window.aux);
    document.getElementById("dropdown-btn").classList.remove("filtro-activo");
  }
}
function reducirColumnasNivelTabla(){
  let item=$('#campos').DataTable();
  if (window.nivelTabla){
    item.column( 0 ).visible( false ); //Oculta campo
    item.column( 1 ).visible( false ); //Oculta código
    item.column( 2 ).visible( false ); //Oculta atributo
    item.column( 3 ).visible( false ); //Oculta definición atributo
    item.column( 9 ).visible( false ); //Oculta tipo de dato
    item.column( 10 ).visible( false ); //Oculta largo de dato
    item.column( 11 ).visible( false ); //Oculta permite null
  }else{
    item.column( 0 ).visible( true ); //Muestra campo
    item.column( 1 ).visible( true ); //Muestra código
    item.column( 2 ).visible( true ); //Muestra atributo
    item.column( 3 ).visible( true ); //Muestra definición atributo
    item.column( 9 ).visible( true ); //Muestra tipo de dato
    item.column( 10 ).visible( true ); //Muestra largo de dato
    item.column( 11 ).visible( true ); //Muestra permite null
  }
}

function listenerSwitch(){
  
  document.getElementById("switchS3").addEventListener("click",function(e){
    if ($(this).is(':checked')){ //Si le hice click en vista tablas entonces
      window.vistaTablaSinonimo = true
      window.nivelTabla=true //Marcamos que está activada la vista tablas
      if(window.colapsado){ //En caso esté colapsado abro y cierro 
        //abrirCerrar($('#campos').DataTable()); //abro todas cols
        addDataCollapse() //abro todas cols
        reducirColumnasNivelTabla(); //Dejo solo las variables de las tablas
        window.colapsado=true;
      }else{
        reducirColumnasNivelTabla(); //En caso no esté colapsado, solo muestro variables de tablas   
      }
      //Muestro la columna de clasificación y la de descripción tabla
      $('#campos').DataTable().column( 12 ).visible( true );
      $('#campos').DataTable().column( 13 ).visible( true );
      $('#campos').DataTable().column( 14 ).visible( true );
      //Vuelvo a escribir la tabla para que solo tenga info de tabla
      if(window.campos.length!=0){
        redrawDataTableBuscadorCampos("campos", arrayCamposDistinct(window.campos))
      }
    }else{ //Si le hice clic en vista campos entonces
      window.vistaTablaSinonimo = false
      window.nivelTabla=false
      if(window.colapsado){
        reducirColumnasNivelTabla(); //Muestro las variables de los campos
        abrirCerrar($('#campos').DataTable());
      }else{
        reducirColumnasNivelTabla();
      }
      //Ocultamos las columnas de clasificación y la de descripción tabla
      $('#campos').DataTable().column( 12 ).visible( false );
      $('#campos').DataTable().column( 13 ).visible( false );
      $('#campos').DataTable().column( 14 ).visible( false );
      //Vuelvo a escribir la tabla para que tenga info a nivel de campos
      if(window.camposdistinct!==undefined && window.camposdistinct.length!=0){
        redrawDataTableBuscadorCampos("campos",window.campos)
      }
    }
  })
}

function cambiarBusqueda(){
  //Listener para cambiar Switch
  var target = document.querySelector('#dropdown-buscador');
  var observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      if(mutation.type=="childList"){
        //En caso este colapsado, lo expando para tener todos los datos
        if(window.colapsado){$("#btncampos").click();}
      }
    });    
  });   
  
  var config = { attributes: true, childList: true, characterData: true };
  observer.observe(target, config);

  document.getElementById("opcionfiltro").addEventListener("click", function(e) {
    let textoactual = document.getElementById("dropdown-buscador").innerText.toLocaleUpperCase().replace(" ", "");
    let textocambiar = document.getElementById("opcionfiltro").innerText.toLocaleUpperCase().replace(" ", "");

    document.getElementById("dropdown-buscador").innerText = capitalizarPrimeraLetra(textocambiar.toLowerCase());
    document.getElementById("opcionfiltro").innerText = capitalizarPrimeraLetra(textoactual.toLowerCase());
    if(document.getElementById("dropdown-buscador").innerText === "Tabla" && !$("#switchS3").is(':checked')){
      $("#switchS3").click()
    }else if((document.getElementById("dropdown-buscador").innerText === "Campo" && $("#switchS3").is(':checked'))||document.getElementById("dropdown-buscador").innerText === "Atributo" && $("#switchS3").is(':checked')){
      $("#switchS3").click()
    }
    
  });

  document.getElementById("opcionfiltro2").addEventListener("click", function(e) {
    let textoactual = document.getElementById("dropdown-buscador").innerText.toLocaleUpperCase().replace(" ", "");
    let textocambiar = document.getElementById("opcionfiltro2").innerText.toLocaleUpperCase().replace(" ", "");

    document.getElementById("dropdown-buscador").innerText = capitalizarPrimeraLetra(textocambiar.toLowerCase());
    document.getElementById("opcionfiltro2").innerText = capitalizarPrimeraLetra(textoactual.toLowerCase());
    if(document.getElementById("dropdown-buscador").innerText === "Tabla" && !$("#switchS3").is(':checked')){
      $("#switchS3").click()
    }else if((document.getElementById("dropdown-buscador").innerText === "Campo" && $("#switchS3").is(':checked'))||document.getElementById("dropdown-buscador").innerText === "Atributo" && $("#switchS3").is(':checked')){
      $("#switchS3").click()
    }
  });

}  

// Funcion de respaldo para limpiar los datos despues de hacer clic en el combo de #dropdown-buscador (No se esta usando)
function limpiarFiltros() {
  if ((window.campo != "" || window.tablab != undefined || window.atributob != undefined) || window.colapsado == true) {
    //Se establece el estilo de fondo, color y borde del elemento con el ID dropdown-buscador.
    //Cuando campo esta lleno o tablab esta definida o atributo este definido o el arbol este colapsado  se ejecuta la opcion de abajo.
  
    document.querySelector("#dropdown-buscador").style.background = "#D2006E";
    document.querySelector("#dropdown-buscador").style.color = "white";
    document.querySelector("#dropdown-buscador").style.border = "#D2006E";

    // Se ejecuta esta funcion que tiene dentro una accion que se realizara luego del tiempo establecido
    setTimeout(function() {
    //limpia el campo de busqueda
      document.getElementById("campos-search").value = '';
    //Reinicia variables globales
      window.campo = '';
      window.tablab = undefined;
      window.atributob = undefined;

      //Reinicia la tabla
      segmentarTablaCampos(tabla_config = 'campos', servidor = 'TODOS', base = '', esquema = '', tabla = '', recoger_filtro = true);
      //oculta el icono del tacho de basura de la pantalla
      if ($("#campos-buscar").is(":visible")) { $("#campos-buscar").toggle(); }
      //Limpia estilos del elemento dropdown-buscador
      //Elimina estilo de fondo, color y borde establecido en el ID dropdown-buscador.
      document.querySelector("#dropdown-buscador").style.background = "";
      document.querySelector("#dropdown-buscador").style.color = "";
      document.querySelector("#dropdown-buscador").style.border = "";
      //Se ejecuta despues de un retraso de 120 milisegundos
    }, 120);
  }
}

function estandarizarSegmentacion(){
  let segmentador = document.getElementById("segmentar-btn")
  if(!segmentador) return;
  let stringOpcionesSegmentador = ""
  let segmentos = getCatalogoSegmentador()
  let cleanedKeys = []
  let opcionesSegmentador = []
  Object.entries(segmentos).forEach(([key,value]) => {
    let cleanedKey = key.replaceAll(" ", "")
    if(value.length > 1){
      value = value.sort((a,b) => parseInt(a.subsegmento)-parseInt(b.subsegmento))
      stringOpcionesSegmentador += `
        <a class="dropdown-item d-flex align-items-center" data-toggle="collapse" role="button" aria-expanded="false" aria-controls="submenu${cleanedKey}" id="${cleanedKey}-btn" style="gap:2px;">${key} <i class="simple-icon-arrow-right rotate-icon ml-2" style="margin-bottom:.15rem;"></i></a>\
        <div class="collapse ml-3" id="submenu${cleanedKey}">`
      // value=[value[value.length - 1]]
    }

    value.forEach(e=>{
      stringOpcionesSegmentador+=`<a class="dropdown-item text-wrap" id="${e.value}">${e.label}</a>`
      opcionesSegmentador.push(e)
    })
      
    if(value.length > 1){
      stringOpcionesSegmentador += `</div>`
    }
    cleanedKeys.push(cleanedKey)
  })
  segmentador.nextSibling.nextSibling.innerHTML = stringOpcionesSegmentador


  cleanedKeys.forEach(key=>{
    let btnSubmenu = document.getElementById(`${key}-btn`)
    if(btnSubmenu){
      btnSubmenu.addEventListener('click', function(event) {
        event.stopImmediatePropagation(); // Evita que el dropdown principal se cierre
        $(`#submenu${key}`).collapse("toggle")
        $(btnSubmenu).find('.rotate-icon').toggleClass('rotate');
      });
    }
  })

  opcionesSegmentador.forEach(elemento=>{
    let opcionSegmentador = document.getElementById(elemento.value)
    if(opcionSegmentador){
      opcionSegmentador.addEventListener("click", function(e){
        segmentar(elemento)
      })
    }
  })
}

function segmentar(segmento){
  document.getElementById("segmentar-btn").innerText = segmento.label;
  let dominio = document.getElementById("dropdown-btn").innerText;
  if(dominio != "Filtrar Por " && dominio != "Todos" && dominio !="Dominio"){
    window.dominio = dominio;
  }

  window.glosario.todos = segmento.value === "todos" ? window.aux : sortGlosario(window.glosario[segmento.value] ?? window.glosario["datos_personales"])
  window.segmento = segmento.value === "todos" ? null : segmento.value

  if(window.segmento) document.getElementById("segmentar-btn").classList.add("filtro-activo");
  else document.getElementById("segmentar-btn").classList.remove("filtro-activo");
  

  if(window.dominio) window.glosario.todos = searchList(window.dominio,"ows_descripcion_dominio",window.glosario.todos);

  autocompletado(document.getElementById("glosario-search"),"ows_nombre_metad",window.glosario.todos);
  printSearchResults(window.glosario.todos); //Se actualiza el autocompletado y se imprime los resultados según lo segmentado

}

//Funcion útil para obtener un arreglo sin repetir de items de una lista
function uniqueColumn(arr, columna){
  let aux = [];
  $.each(arr, function(index,item){
    aux.push(item.attr(columna));
  });
  aux = [...new Set(aux)];
  return aux;
}

//Funcion para agregar propiedades al objeto de un dominio actual que se esté presentando
function buildFichaObject(objeto, dominio_actual){
  Object.defineProperties(objeto,{
    porcentaje_avance_dominio:{
      value: dominio_actual.attr("ows_porcentaje_avance_dominio"),
    },
    cant_atributos:{
      value: dominio_actual.attr("ows_cant_atributos"),
    },
    cant_terminos:{
      value: dominio_actual.attr("ows_cant_terminos"),
    },
    cant_modelos:{
      value: dominio_actual.attr("ows_cant_modelos"),
    },
    cant_estructura:{
      value: dominio_actual.attr("ows_cant_estructura"),
    },
    familia:{
      value: dominio_actual.attr("ows_Familia_de_Dominios"),
    },
    tipo:{
      value: dominio_actual.attr("ows_tipo_dominio"),
    },
    codigo_Dominio:{
      value: dominio_actual.attr("ows_codigo_Dominio"),
    },
    Conceptos_Clave:{
      value: dominio_actual.attr("ows_Conceptos_Clave"),
    },
    subdominios:{
      value: dominio_actual.attr("ows_subdominios"),
    }
  });
  return objeto
}

//Funcion de carga para EstrategiadelDato.aspx
function estrategiaDato(){
  registrar_visita("ESTRATEGIA DEL DATO");
}

//Funcion de carga para FichaDominio.aspx
function fichaDominio(){
  //Obtengo los parámetros del dominio
  var id_dominio_actual = getParams("id_dominio");
  var dominio_actual = searchDominios("id_dominio",id_dominio_actual,"text");
  var avance_actual = getAvancesDominio(id_dominio_actual);
  //En caso de que cuente con avances, construyo el bloque de porcentajes de avance
  if(avance_actual){
    //Asignar propiedades al objeto "dominio"
    var avance = buildFichaObject(avance_actual.avance,dominio_actual);
    //Construir la ficha de dominio a partir de esos atributos
    fillFichaDominio(avance,id_dominio_actual);
  }else{ //en caso de no contar con avances no construyo ese bloque pro si incluyo la demas informacion
    var avance = {
      porcentaje_avance_dominio: dominio_actual.attr("ows_porcentaje_avance_dominio"),
      descripcion_dominio: dominio_actual.attr("ows_descripcion_dominio"),
      oleada: undefined,
      cant_atributos: dominio_actual.attr("ows_cant_atributos"),
      cant_terminos: dominio_actual.attr("ows_cant_terminos"),
      cant_modelos: dominio_actual.attr("ows_cant_modelos"),
      cant_estructura: dominio_actual.attr("ows_cant_estructura"),
      familia: dominio_actual.attr("ows_Familia_de_Dominios"),
      tipo: dominio_actual.attr("ows_tipo_dominio"),
      codigo_Dominio: dominio_actual.attr("ows_codigo_Dominio"),
      Conceptos_Clave: dominio_actual.attr("ows_Conceptos_Clave"),
      subdominios: dominio_actual.attr("ows_subdominios"),
    }
    fillFichaDominio(avance,id_dominio_actual,false);
  }
  registrar_visita("FICHA DE DOMINIO",dominio_actual.attr("ows_descripcion_dominio"));
}

//Funcion para editar el anillo de progreso de avance en la ficha de Dominio
function setPorcentaje(n){
  n = n *100;
  const progreso = 301 - ( n* 301 / 100); //formula para según el valor decimal ingresado (n<1) el anillo de progreso
  $("#porcentaje-ola-actual").css("stroke-dashoffset",progreso)
  document.querySelector(".progressbar-text").innerHTML = Math.floor(n) + "%"
}

//Funcion para obtener los parametros del URL actual
//Se ingresa como parametro el nombre de param a buscar
function getParams(param){
  let queryString = window.location.search;
  let urlParams = new URLSearchParams(queryString);
  let url_param = urlParams.get(param);
  return url_param
}

//Funcion llamada por fichaDominio para la carga de datos en la página
function fillFichaDominio(ficha,id,avance=true){
  //Asigno los links a los botones
  $("#a-estructura").attr("href","Dominio_estructura.aspx?id_dominio="+id);
  $("#estructura").attr("href","Dominio_estructura.aspx?id_dominio="+id);
  $("#a-artefactos").attr("href","Dominio_artefactos.aspx?id_dominio="+id);
  $("#artefactos").attr("href","Dominio_artefactos.aspx?id_dominio="+id);
  $("#a-terminos").attr("href","Dominio_terminos_atributos.aspx?dominio="+ficha.descripcion_dominio);
  $("#terminos").attr("href","Dominio_terminos_atributos.aspx?dominio="+ficha.descripcion_dominio+"&tipo=terminos");
  $("#atributos").attr("href","Dominio_terminos_atributos.aspx?dominio="+ficha.descripcion_dominio+"&tipo=atributo");
  $("#tablas").attr("href","Ficha_Tablas.aspx?dominio=\""+ficha.descripcion_dominio+"\"");
  //En caso el dominio sea el de campañas, pongo el link de ficha de inventarios en el inventario
  if(ficha.descripcion_dominio=="Administración de Campañas"){
    //Agrego el bloque de inventario
    html_inventario = ' <div class="card mt-3 ml-3 mr-3 mb-5 w-25 contador">\
                <div class="card-body text-center p-2">\
                  <a id="inventario" href="#">\
                    <i class="simple-icon-wrench" style="font-size: 25px;"></i>\
                    <p class="card-text mb-0">Inventario</p>\
                    <p class="lead text-center mb-0" id="n-inventario">0</p>\
                  </a>\
                </div>\
              </div>';
    $("#barra-superior").append(html_inventario);
    //Y le pongo link del inventario
    $("#inventario").attr("href","Tipos_campanias.aspx?id_dominio="+id+"&dominio=\""+ficha.descripcion_dominio+"\"");
    let cant_inventarios = Object.values(getCampanaSeguimiento()).map(obj => obj).reduce((total, obj) => total + (obj["A"] + obj["T"] || 0), 0);
    $("#n-inventario").text(cant_inventarios);
  }
  $(document.getElementById("a-actas").parentNode).remove();
  $("#a-metadatos").attr("href","Dominio_metadatos_linaje.aspx?id_dominio="+id);
      //tablas oficiales
      let count=0
    let tablas_oficiales= getInfoTablasOficiales()
    for (const [key, value] of Object.entries(tablas_oficiales)) {
            if(value["descripcion_dominio"]!=" "){
              if(value["descripcion_dominio"].includes("; ")){

                let lista= value["descripcion_dominio"].split("; ")
                lista.forEach(element => {
                  if(element.toUpperCase() == ficha.descripcion_dominio.toUpperCase()){
                    count+=1
                  }
                });
              }else{
                if(value["descripcion_dominio"].toUpperCase()==ficha.descripcion_dominio.toUpperCase()){
                  count+=1
                }
            
              }
            }
    } 
  $("#n-tablas").text(count);
  
  if(avance){
  
    setPorcentaje(parseFloat(ficha.porcentaje_avance_dominio));
    $("#nombre-dominio").text(ficha.descripcion_dominio);
    $("#oleada").text("Ola "+ficha.oleada);
    $("#n-atributos").text(ficha.cant_atributos);
    $("#n-terminos").text(ficha.cant_terminos);
    $("#n-artefactos").text(ficha.cant_modelos);
    $("#n-estructura").text(ficha.cant_estructura);
    
    $("#familia")[0].innerHTML = ficha.familia.replaceAll("<br>","");
    $("#tipo").text(ficha.tipo);
    $("#codificacion").text(ficha.codigo_Dominio);
    $("#concepto")[0].innerHTML = ficha.Conceptos_Clave;
    $("#subdominios").text(mayusc_each_word(ficha.subdominios).replaceAll(";",", "));
    $.each(ficha.pasos, function(index, item){
      if(item.estado_paso == "No aplica") return true;
      let color = '';
      let porcentaje_paso = parseFloat(item.porcentaje_avance)*100;
      if(porcentaje_paso < 40) color = 'background-color:#DA1E28;';
      if(porcentaje_paso >= 40 && porcentaje_paso < 80) color = 'background-color:#FFB400;';
      if(porcentaje_paso >= 80 ) color = 'background-color:#137B02;';
      let estados = {
        "Completado": "Completado",
        "En proceso": "En Proceso: " + porcentaje_paso + "%",
        "No iniciado": "No Iniciado",
        "No aplica" : "No aplica"
      }
      let html_pasos = '<div class="mb-3">\
                          <p class="mb-0">\
                            <span class="font-weight-bold">'+ item.desc_paso +'</span>\
                          </p>\
                          <p class="mb-2">\
                          <span class="">'+ estados[item.estado_paso] +'</span>\
                          <div class="progress">\
                            <div class="progress-bar" role="progressbar" aria-valuenow="'+ porcentaje_paso +'"\
                                 aria-valuemin="0" aria-valuemax="100" style="width: '+ porcentaje_paso +'%;'+ color +'"></div>\
                          </div>\
                        </div>';
      $("#avances").append(html_pasos);
  });
  }else{
    setPorcentaje(0);
    $("#nombre-dominio").text(ficha.descripcion_dominio);
    $("#oleada").text("Sin Avances");
    $("#activa-proceso").toggle()
    $("#n-atributos").text(ficha.cant_atributos);
    $("#n-terminos").text(ficha.cant_terminos);
    $("#n-artefactos").text(ficha.cant_modelos);
    $("#n-estructura").text(ficha.cant_estructura);
    $("#familia")[0].innerHTML = ficha.familia.replaceAll("<br>","");
    $("#tipo").text(ficha.tipo);
    $("#codificacion").text(ficha.codigo_Dominio);
    $("#concepto")[0].innerHTML = ficha.Conceptos_Clave;
    if(!ficha.subdominios) ficha.subdominios = "No contiene subdominios";
    $("#subdominios").text(mayusc_each_word(ficha.subdominios).replaceAll(";",", "));
  }
}

//función para hacer toggle mediante bootstrap a las opciones colapsables de FichaAtributo.aspx
function toggleAll(){
  if($(".collapse.show").length == 0){
    $(".collapse").collapse('toggle');
    $(".simple-icon-arrow-down.pt-3.pr-2").toggleClass('simple-icon-arrow-up');  
    // se abre el acordeón, entonces pinto todos los divs
    document.querySelector("#paint1").style.background="#cccccc"
    document.querySelector("#paint2").style.background="#cccccc"
    document.querySelector("#paint3").style.background="#cccccc"
    document.querySelector("#paint4").style.background="#cccccc"



  }else{
    $(".collapse.show").collapse('toggle');
    $(".simple-icon-arrow-down.pt-3.pr-2.simple-icon-arrow-up").toggleClass('simple-icon-arrow-up');  
    document.querySelector("#paint1").style.background="white"
    document.querySelector("#paint2").style.background="white"
    document.querySelector("#paint3").style.background="white"
    document.querySelector("#paint4").style.background="white"
    
  }
  $("#icono-expandir").toggleClass('simple-icon-arrow-up');
}

//Función para toggle de las flechas del colapsable en FichaAtributo.aspx
function toggleArrow(elemento){
  $(elemento).toggleClass('simple-icon-arrow-up');
  let contenido = elemento.parentNode.nextElementSibling;
 
  if(!contenido.className.includes("show") && $(".collapse.show").length == 0){
    $("#icono-expandir").toggleClass('simple-icon-arrow-up');
  }else if(contenido.className.includes("show") && $(".collapse.show").length == 1){
    $("#icono-expandir").toggleClass('simple-icon-arrow-up');
  }

  //paint
  if(!contenido.className.includes("show")){
    elemento.parentNode.style.background="#cccccc"
  }else{
    elemento.parentNode.style.background="white"
  }

}


//Función para expandir un colapsable de FichaAtributo.aspx
function expandir(elemento){
  let flecha = elemento.parentNode.firstElementChild;

 
  $(flecha).toggleClass('simple-icon-arrow-up');
  let nextSibling = elemento.parentNode.nextElementSibling;

  let contenedor = elemento.parentNode
  if(!nextSibling.className.includes("show") && $(".collapse.show").length == 0){
    
    
    $("#icono-expandir").toggleClass('simple-icon-arrow-up');
  }else if(nextSibling.className.includes("show") && $(".collapse.show").length == 1){
    $("#icono-expandir").toggleClass('simple-icon-arrow-up');
   
  }

  //pintar divs
  if(!nextSibling.className.includes("show")){
    contenedor.style.background="#cccccc"
  }else{
    contenedor.style.background="white"
  }

}

//función para ajustar las columnas de un datatable
//Librería datatables.js
function ajustarTabla(){
    $($.fn.dataTable.tables(true)).DataTable().columns.adjust();
}

// Cuando se hace clic en una página nueva de la paginación, mandar la página a la parte superior de nuevo
function botones_hacia_arriba() {
  let cards = document.querySelectorAll(".paginationjs .paginationjs-pages li a");
  for (var i = 0; i < cards.length; i++) {
      var card = cards[i];
      card.onclick = function () {
          document.body.scrollTop = 0;
          document.documentElement.scrollTop = 0;
      };
  }
};

//función para escribir los enlaces de los breadcrumbs de las subpáginas de un Dominio
function fillBreadcrumbs(id_dominio,nombre_dominio){
  $("#a-dominio").attr("href","FichaDominio.aspx?id_dominio="+id_dominio);
  $("#a-estructura").attr("href","Dominio_estructura.aspx?id_dominio="+id_dominio);
  $("#a-artefactos").attr("href","Dominio_artefactos.aspx?id_dominio="+id_dominio);
  $("#a-terminos").attr("href","Dominio_terminos_atributos.aspx?dominio="+nombre_dominio);
  $(document.getElementById("a-actas").parentNode).remove();
  $("#a-metadatos").attr("href","Dominio_metadatos_linaje.aspx?id_dominio="+id_dominio);
}

//funcion para limpiar modal de añadir atributo



//función para añadir un nuevo atributo
function addAtributo(){
  //Obtengo los nombres de todos los dominios
  let dominios=getAllDescripcionDominio()
  //Escribo el drop-down de los dominios
  addDominiosFichaAtributo(dominios);
  //Customizo las opciones del dropdown
  $(".select2-multiple").select2({
    theme: "bootstrap",
    maximumSelectionSize: 6,
    containerCssClass: ":all:"
  });
  let retorno=cargaAtributos() //Obtengo el mayor ID de atributo y de término
  document.getElementById("idatributo").value=retorno[0]+1 //El nuevo id será mayor que el id máximo encontrado
  loadOptions(retorno[1],retorno[2]) //Cargo las opciones para el desplegable de todas las características
  loadCatalogos() //Cargo la lista de todos los catálogos existentes
  $("#modalAtributo").modal("show"); //Muestro la ventana con el formulario
}

// funcion para cargar asignar automaticamente ids a atributos nuevos/ cargar caracterisitcas
function cargaAtributos(){
  let elemento=-1
  let caracteristicas=[]
  $().SPServices({
    operation: "GetListItems",
    async: false,
    listName: "Z_DICCIONARIO_DATOS",
    CAMLViewFields: "<ViewFields>\
                        <FieldRef Name='tipo_metad' />\
                        <FieldRef Name='id_metad' />\
                        <FieldRef Name='caracteristicas' />\
                        <FieldRef Name='txt_desc_subcategoria' />\
                        <FieldRef Name='dato_personal' />\
                        <FieldRef Name='golden_record' />\
                    </ViewFields>",
    completefunc: function (xData, Status) {
      $(xData.responseXML).find("z\\:row").each(function () {
        let id=parseInt($(this).attr("ows_id_metad")); //Obtengo el id
        let tipo = $(this).attr("ows_tipo_metad"); //Obtengo el tipo de metadato que es, atributo o término
        if (tipo == "ATRIBUTO"){ //Solo en caso sea atributo hago todo el proceso
          if(id>elemento){ //Estoy buscando el ID mayor entre todos los atributos
            elemento=id
          }
          let c= $(this).attr("ows_caracteristicas") //También estoy buscando todas las características existentes
          if(c !== undefined && c.replace(" ","")!= ""){
            if(c.includes("; ")){
              c.split("; ").forEach(element => {
                if(!caracteristicas.includes(element)){
                  caracteristicas.push(element)
                }
              });
            }else{
              if(!caracteristicas.includes(c)){
                caracteristicas.push(c)
              }
            }
          }
        }
      });
    }
  });
  return [elemento,caracteristicas]
}

//Cargar caracts y subcategorias a select
function loadOptions(caracterisitcas,subcategorias){
let option;
let x= document.getElementById("nombrecaract")
caracterisitcas.forEach(element => {
  option = document.createElement("option");
                  option.text = element;
                  option.value= element;
                  x.add(option);
});

}




//Carga de terminos de un dominio
function glosarioDominio(){
  //Cargo el listener de el dropdown de los subdominios
  listenerDominios();
  //Cargo el listener de agregar atributo
  listenerbtnAddAtributo();
  let nombre_dominio = getParams("dominio");
  let tipo=getParams("tipo")



  let dominio = searchDominios("descripcion_dominio",nombre_dominio);
  fillBreadcrumbs(dominio.attr("ows_id_dominio"),nombre_dominio);
  $("#nombre-dominio").text(nombre_dominio);
  const glosario = getTerminos(nombre_dominio);

  window.glosario = glosario;
  window.aux = sortGlosario(glosario.todos);
  printSearchResults(glosario.todos);
  autocompletado(document.getElementById("glosario-search"),"ows_nombre_metad", glosario.todos);
  
  registrar_visita("DICCIONARIO DE DOMINIO", nombre_dominio);

    //verify if user is OGA
    if(localStorage.getItem("citizen")==null){
      let pertenece=revisar_usuario()
      localStorage.setItem('citizen', pertenece);
  }   
  let pertenece=localStorage.getItem("citizen")

    if(pertenece==="false"){
      document.getElementById("nuevoatributo").style.display="none"
    }
  estandarizarSegmentacion()
  if(tipo=="terminos"){
    segmentar({label:"Términos", value:"terminos"});
  }
  if(tipo=="atributo"){
    segmentar({label:"Atributos", value:"atributos"});
  }
}


function cleanModalAtributo(){
  $('#modalAtributo').on('hidden.bs.modal', function(){
    $('#tipo').val(null).trigger('change');
    document.getElementById("idatributo").value=""
    document.getElementById("NOMBREA").value=""
    document.getElementById("Descripcion").value=""

    $('#nombred').val(null).trigger('change');
    $('#nombresub').val(null).trigger('change');
    $('#nombrecaract').val(null).trigger('change');
    $('#datopersonal').val(null).trigger('change');
    $('#goldenrecord').val(null).trigger('change');
    $('#catalogos').val(null).trigger('change');

   })
}
function listenerbtnAddAtributo(){
  document.querySelector("#btnagregaratributo").addEventListener("click",function(e){
    e.preventDefault() // Evitamos el evento default del botón del formulario
    e.stopPropagation() // Evitamos la propagación a otros elementos

    //Obtenemos todos los datos del formulario
    let tipo_metad= document.getElementById("tipo").value
    let id_metad= $("#idatributo").val()
    let nombre_metad=$("#NOMBREA").val()
    let descripcion_metad=$("#Descripcion").val()
    let dominio=$("#nombred").val() //list
    let subdominio=$("#nombresub").val()//list
    let caract= $("#nombrecaract").val() //list 
    let datopersona=$("#datopersonal").val()
    let goldenrecord=$("#goldenrecord").val()
    let catalogos=$("#catalogos").val() //list

    // Procesamos las listas y los datos
    if(tipo_metad==null){tipo_metad=""}
    if(dominio.length>0){dominio=dominio.join("; ")}
    if(subdominio.length>0){subdominio=subdominio.join("; ")}
    if(caract.length>0){caract=caract.join("; ")}
    if(catalogos.length>0){catalogos=catalogos.join("; ")}
    if(datopersona==null){datopersona=""}
    if(goldenrecord==null){goldenrecord=""}
    if(nombre_metad!="" && descripcion_metad!="" && dominio.length!=0 ){
      //Esperamos dos segundos y cerramos el popup
      setTimeout(() => {
        $("#modalAtributo").modal("hide");
      }, 2000);
      //Extraigo la fecha de hoy
      var today = new Date();
      var dd = String(today.getDate()).padStart(2, '0');
      var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
      var yyyy = today.getFullYear();
      today =  yyyy+"-"+mm+"-"+dd;
      //Escribo el atributo en la lista de atributos
      $().SPServices({
        operation: "UpdateListItems",
        async: false,
        batchCmd: "New",
        listName: "Z_DICCIONARIO_DATOS",
        valuepairs:  [
          ["tipo_metad", tipo_metad],
          ["id_metad", id_metad],
          ["nombre_metad", nombre_metad],
          ["descripcion_metad", descripcion_metad],
          ["descripcion_dominio", dominio],
          ["fec_ultima_actualizacion", today],
          ["caracteristicas", caract],
          ["txt_desc_subdominio", subdominio],
          ["txt_desc_subcategoria", "EN REVISIÓN"],
          ["dato_personal", datopersona],
          ["golden_record", goldenrecord],
          ["catalogos_asociados", catalogos]
        ],
        completefunc: function(xData, Status) {}
      });
      
      //Limpio el modal
      cleanModalAtributo();
    }
  })
}



function loadCatalogos(){
  let x=document.getElementById("catalogos")
  $().SPServices({
    operation: "GetListItems",
    async: false,
    listName: "Z_CATALOGO_REFERENCIA",
    CAMLViewFields: "<ViewFields>\
                            <FieldRef Name='Vista' />\
                            <FieldRef Name='Codigo' />\
                            <FieldRef Name='Descripcion' />\
                        </ViewFields>",
    completefunc: function (xData, Status) {
        $(xData.responseXML).find("z\\:row").each(function () {
          
            let vista= $(this).attr("ows_Vista") 
            let codigo=$(this).attr("ows_Codigo")
            option = document.createElement("option");
            option.text = $(this).attr("ows_Descripcion") 
            option.value= vista+"||"+codigo;
            x.add(option);
        });
    }
});
}

function getSubdominiofromDominio(nombre){
  let subdominios=[] //Creo la lista donde almacenaré todos los subdominios encontrados
  $().SPServices({
    operation: "GetListItems", //Extraigo la información de la lista de dominios
    async: false,
    listName: "Z_DOMINIOS",
    CAMLQuery: '<Query><Where><Eq><FieldRef Name="descripcion_dominio"/><Value Type="text">'+ nombre +'</Value></Eq></Where></Query>',
    CAMLViewFields: "<ViewFields>\
                          <FieldRef Name='subdominios' />\
                    </ViewFields>",
    completefunc: function (xData, Status) {
      $(xData.responseXML).find("z\\:row").each(function () {
        subdominio = $(this).attr("ows_subdominios"); //Extraigo el dato de subdominios, que es una lista separada por ;
        if(subdominio!==undefined && subdominio!=""){
          if(subdominio.includes("; ")){
            (subdominio.split("; ")).forEach(element => {
              subdominios.push(element);
            });
          }else{
            subdominios.push(subdominio);
          }
        }
      });
    }
  });
  return subdominios.filter(onlyUnique) //Solo dejo los subdominios unicos
}

//funcion para cargar subdominios a partir de dominios
function listenerDominios(){
  $('#nombred').on('select2:select', function (e) {
    //A partir de los datos del elemento html obtengo el nombre del dominio
    var data = e.params.data;
    let dominio=data.id;
    //Luego extraigo todos los subdominios relacionados a dicho dominio
    let listaSubdominios=getSubdominiofromDominio(dominio);
    //En caso existan subdominios para escribir en el dropdown, los escribo
    if(listaSubdominios.length!=0){
      let option;
      let x= document.getElementById("nombresub");
      listaSubdominios.forEach(element => {
        option = document.createElement("option");
        option.text = element;
        option.value= element;
        x.add(option);
      });
    }
  });
  
  $('#nombred').on('select2:unselect', function (e) {
    var data = e.params.data;
    let dominio=data.id
    let listaSubdominios=getSubdominiofromDominio(dominio)
    if(listaSubdominios.length!=0){
      listaSubdominios.forEach(element => {
        $("#nombresub option[value='"+element+"']").remove();
      });
    }
  });
}

//Funcion para cargar las caracteristicas en una ficha de atributo
function cargarCaracteristicasAtributo(atributo){
  var atr_html = '';
  var caract = [];
  var caract_detalle = [];
  if(atributo.attr("ows_caracteristicas")){
    caract = atributo.attr("ows_caracteristicas").split("; ");
    let CDE = caract.indexOf("(CDE) Elemento clave de datos");
    let AR = caract.indexOf("(AR) Atributo de Referencia");
    if(AR>=0 && CDE >=0){
      let temp = caract.toSpliced(caract.indexOf('(CDE) Elemento clave de datos'),1);
      temp.unshift('(CDE) Elemento clave de datos'); //En caso de ser tipo CDE este deberá ubicarse primero en la lista
      caract = temp;                                 //de caracteristicas
    }
    let iconos = {
      "Impacto en procesos": '<i class="iconsminds-gears"></i>',
      "Impacto en negocio / reputacional": '<i class="simple-icon-eye"></i>',
      "Impacto económico": '<i class="iconsminds-dollar"></i>',
      "Impacto regulatorio": '<i class="iconsminds-police-station"></i>'
    }
    for (let n = 0; n < caract.length; n++) {
      if(caract[n].includes("(")){
        
        let cara = caract[n].split(" ")[0].replace("(","").replace(")","");
        let badge;
        if(cara.includes("CDE")){
         badge = '<span class="badge badge-pill badge-secondary atributo caracteristica" title="Critical Data Element">'+ cara +'</span>';

        }else{
          badge = '<span class="badge badge-pill badge-secondary atributo caracteristica" title="Atributo de Referencia">'+ cara +'</span>';

        }
        atr_html += badge
        caract_detalle.push('<p>'+ badge +" "+ caract[n] + '</p>');
      } else{
        let badge = '<span class="badge badge-pill badge-secondary atributo" title="'+ caract[n] +'">'+ iconos[caract[n]] +'</span>';
        atr_html += badge;
        caract_detalle.push('<p>'+ badge +" "+ caract[n] + '</p>');
      }
    }
  }
  if(atributo.attr("ows_dato_personal")== "1"){
    caract.push("Dato Personal");
    let badge = '<span class="badge badge-pill badge-secondary atributo" title="Dato Personal"><i class="iconsminds-business-man"></i></span>';
    atr_html += badge;
    caract_detalle.push('<p>'+ badge + " Dato Personal" + '</p>');
  }
  if(atributo.attr("ows_golden_record")== "1"){
    caract.push("Golden Record");
    let badge = '<span class="badge badge-pill badge-secondary atributo" title="Golden Record"><i class="simple-icon-diamond"></i></span>';
    atr_html += badge;
    caract_detalle.push('<p>'+ badge + " Golden Record" + '</p>');
    
  }
  /*if(atributo.attr("ows_txt_desc_subcategoria")=="EN REVISIÓN"){
    caract.push("Subcategoría");
    let badge='<span style="border-color:green" class="badge badge-pill badge-secondary atributo" title="En revisión"><i style="color:green" class="glyph-icon simple-icon-check"></i></span>'
    atr_html += badge;
    caract_detalle.push('<p>'+ badge + " En revisión " + '</p>');
  }*/

  $("#caracteristicas-badges").html(atr_html);
  let caract_html = '';
  $.each(caract_detalle, function(index,item){
    caract_html += item;
  });
  $("#caracteristicas").html(caract_html);
}

function cleanModalTablas(){
      $('#dataownerselect').select2({
        theme: "bootstrap",  
        placeholder: "",
        maximumSelectionSize: 6,
        containerCssClass: ":all:",
        dropdownParent: $('#detalleModal2')
    });

    $('#dataselect').select2({
    theme: "bootstrap",  
    placeholder: "",
    maximumSelectionSize: 6,
    containerCssClass: ":all:",
    dropdownParent: $('#detalleModal4')
    });

   // Esconder modal 
   $('#detalleModal2').on('hidden.bs.modal', function(){
    $('#dataownerselect').val(null).trigger('change');
   })

   $('#detalleModal4').on('hidden.bs.modal', function(){
    $('#dataselect').val(null).trigger('change');
   })
   $('#detalleModal7').on('hidden.bs.modal', function(){
    $("#checkdominio").prop("checked", false)
  })


}

function getCatalogoSegmentador(){
  let etiquetas = {};
  $().SPServices({
    operation: "GetListItems",
    async: false,
    listName: "Z_CATALOGO_OGASUITE",
    CAMLQuery:`<Query><Where><Eq><FieldRef Name="trans_id" /><Value Type="Text">9</Value></Eq></Where></Query>`,
    CAMLViewFields: "<ViewFields>\
                        <FieldRef Name='trans_id' />\
                        <FieldRef Name='txt_etiqueta' />\
                        <FieldRef Name='valor1' />\
                        <FieldRef Name='valor2' />\
                        <FieldRef Name='valor3' />\
                        <FieldRef Name='valor4' />\
                        <FieldRef Name='valor5' />\
                    </ViewFields>",
    completefunc: function (xData, Status) {
      $(xData.responseXML).SPFilterNode("z:row").each(function() {
        let idCatalogo = $(this).attr("ows_trans_id")
        let segmento = $(this).attr("ows_valor1") 
        let subsegmento = $(this).attr("ows_valor2") 
        let nombreSegmento = $(this).attr("ows_valor3")
        let nombreSubsegmento = $(this).attr("ows_valor4")
        let value = $(this).attr("ows_valor5")

        if(!etiquetas[nombreSegmento]) etiquetas[nombreSegmento] = []
        etiquetas[nombreSegmento].push({"label": nombreSubsegmento || nombreSegmento , value, segmento, subsegmento, segmento, subsegmento})
      });
    }
  });
  return etiquetas;
}

//getCatalogoOGASUITE
function getCatalogoOGASUITE(id_catalogo) {
  let etiquetas = {};
  $().SPServices({
    operation: "GetListItems",
    async: false,
    listName: "Z_CATALOGO_OGASUITE",
    CAMLViewFields: "<ViewFields>\
                        <FieldRef Name='trans_id' />\
                        <FieldRef Name='txt_etiqueta' />\
                        <FieldRef Name='valor1' />\
                        <FieldRef Name='valor2' />\
                    </ViewFields>",
    completefunc: function (xData, Status) {
      $(xData.responseXML).SPFilterNode("z:row").each(function() {
        if ($(this).attr("ows_trans_id") === id_catalogo) {
          etiquetas[$(this).attr("ows_valor1")] = $(this).attr("ows_valor2");
        }
      });
    }
  });
  return etiquetas;
}

function styleCatalogo(tabla_editar, elemento, valor2, etiqueta) {
  let opciones = '';
  //
  $.each(valor2, function(index, item) {
      opciones += '<a class="dropdown-item" onclick="segmentarTabla(\'' + tabla_editar + '\',\'' + item + '\')">' + item + '</a>';
  });
  // Obtiene el contenedor del botón segmentador
  let segmentadorContainer = $(elemento);
  // Agrega las opciones al menú desplegable
  segmentadorContainer.find('.dropdown-menu').html(opciones);
  // Cambia el texto del botón segmentador al iniciar la pagina
  segmentadorContainer.find('.btn-segmentar').text('Segmentar Por ' + etiqueta);
}

function Lista_Etiquetas() {
  let etiquetas = getCatalogoOGASUITE("1");
  // Obtener valores únicos de etiquetas
  //Extrae los valores del objeto "etiquetas" y los coloca en un arreglo
    let valor2 = Object.values(etiquetas);
    styleCatalogo("#tablaOficial", "#segmentador-container", valor2, "Etiqueta");
   //Modal Etiquetas
   // Iterar sobre el catálogo de etiquetas
        // valor1 : Cada iteración se asigna una clave del objeto a la variable
        // valor2 : Se le asigna el valor correspondiente a la clave actual en el objeto , que seria el nombre
    for (let id_etiqueta in etiquetas) {
    let nombre_etiqueta = etiquetas[id_etiqueta];
        // Agregar la etiqueta al campo de selección #etiquetasCampo
        $("#etiquetasCampo").append("<option value='" + id_etiqueta + "'>" + nombre_etiqueta + "</option>");
    }
  }

  // Este evento sucedera cuando el modal se muestre por pantalla
  function ModalEtiquetas(){
    $('#detalleModal9').on('shown.bs.modal', function (e) {
        $("#etiquetasCampo").select2({
            placeholder: "Selecciona etiquetas",
            tags: true // Permite la creación de nuevas etiquetas
        });
    });
  }

function getTablasOwnerDesglosado(usuario = null){
  if(!usuario) return null
  let desglose = {}
  let listaTablas = []
  let desgloseOficiales = {}
  $().SPServices({
    operation: "GetListItems",
    async: false,
    listName: "Z_TABLAS_OFICIALES",
    CAMLQuery: `<Query><Where><Eq><FieldRef Name="data_owner" /><Value Type="Text">${usuario}</Value></Eq></Where></Query>`,
    CAMLViewFields: "<ViewFields>\
                        <FieldRef Name='txt_desc_tabla' />\
                        <FieldRef Name='descripcion_tabla' />\
                        <FieldRef Name='txt_fuente_aprovisionamiento' />\
                        <FieldRef Name='txt_servidor' />\
                        <FieldRef Name='txt_host' />\
                        <FieldRef Name='txt_fuente_esquema' />\
                        <FieldRef Name='data_owner' />\
                        <FieldRef Name='nombre_data_owner' />\
                        <FieldRef Name='data_steward' />\
                        <FieldRef Name='nombre_data_steward' />\
                        <FieldRef Name='clasificacion' />\
                        <FieldRef Name='avance' />\
                        <FieldRef Name='etiquetas' />\
                    </ViewFields>",
    completefunc: function (xData, Status) {
        $(xData.responseXML).SPFilterNode("z:row").each(function() {
            listaTablas.push({
                txt_desc_tabla: $(this).attr("ows_txt_desc_tabla"),
                txt_fuente_aprovisionamiento: $(this).attr("ows_txt_fuente_aprovisionamiento"),
                txt_servidor: $(this).attr("ows_txt_servidor"),
                txt_fuente_esquema: $(this).attr("ows_txt_fuente_esquema"),
                txt_host: $(this).attr("ows_txt_host"),
                txt_documentacion: $(this).attr("ows_avance"),
                etiquetas: $(this).attr("ows_etiquetas") || " ",
                clasificacion: $(this).attr("ows_clasificacion") || " ",
                descripcion: $(this).attr("ows_descripcion_tabla") || " ",
            });
        });
    }
  });
  let catalogoEtiquetas = getCatalogoOGASUITE("1")
  desglose["total"] = listaTablas.length
  listaTablas.forEach(e=>{
    if(e.clasificacion === "OFICIAL"){
      desglose["totalOficiales"] = (desglose["totalOficiales"] || 0) + 1 
      if(e.descripcion.trim()) desglose["documentadas"] = (desglose["documentadas"] || 0) + 1
      else desglose["sinDocumentar"] = (desglose["sinDocumentar"] || 0) + 1
    }

    let etiquetas = e.etiquetas.split("|")
    etiquetas?.forEach(numeroEtiqueta => {
      let nombreEtiqueta = catalogoEtiquetas[numeroEtiqueta]
      if(nombreEtiqueta) desglose[nombreEtiqueta.toLocaleUpperCase()] = (desglose[nombreEtiqueta.toLocaleUpperCase()] || 0) + 1
      else desglose["SC"] = (desglose["SC"] || 0) + 1
    })
  })
  return desglose
}



//function tablasOficiales ficha
function fichaTablas(){
    window.diccionarioDT=getDataOwners()[0]
    let identificador = getParams("dominio").replaceAll("\"",""); //se obtiene mediante parametros de URL el identificador del atributo a presentar
    let Cod_Etiqueta = getCatalogoOGASUITE("1");
    document.getElementById("nombre-dominio").innerHTML="<strong>Dominio: </strong>"+identificador
    let data=[]
        //tablas oficiales
        //Asinga la funcion getInfoTablasOficiales() a la variabletablas_oficiales 
    let tablas_oficiales= getInfoTablasOficiales()
        //le asigna una variable global a tablas_oficiales
    window.tablas_oficiales=tablas_oficiales
       //devuelve un array de arrays , donde cada array interno contiene dos elementos:
       // la clave y el valor correspondientes a una propiedad del objeto.
    for (const [key, value] of Object.entries(tablas_oficiales)) {
      if (value["etiquetas"]!=" "){
        let etiqueta = value["etiquetas"].split("|")
        value["etiquetas_numero"] = value["etiquetas"]

        let textofinal=""
        etiqueta.forEach(elemento =>{
        textofinal += Cod_Etiqueta[elemento]+"|"
        });
        value["etiquetas"] = textofinal;
      }
      // comprueba si el valor asociado a la clave "descripcion_dominio" 
      // en el objeto value no es una cadena vacía. 
      if(value["descripcion_dominio"]!=" "){
        //comprueba si el valor asociado a la clave descripcion_dominio incluye ;
        if(value["descripcion_dominio"].includes("; ")){
          // Se le asigna a lista el valor asociado a la clave descripcion_dominio dividido por ";"
          let lista= value["descripcion_dominio"].split("; ")
          //Se recorre lista y busca en el array lista , element sean iguales a identificador , si existe 
          //esa coincidencia guarda ese valor.
          lista.forEach(element => {
          if(element==identificador){
          //se agrega un nuevo elemento a data
          data.push(value)
          }
          });
        }else{
        //caso contrario si el valor que tiene descripcion_dominio es igual a identificador 
        //agrega ese elemento a data
          if(value["descripcion_dominio"]==identificador){
                      data.push(value)
          }
        }
      }
    }

    setDataTableFichaTablas(data,identificador)
    cleanModalTablas()
        
    ordenarDataOwners()
    ordenarDataOwners3()
    listenerFichaTablas(data,identificador)
    Lista_Etiquetas()
    ModalEtiquetas()
}

function borrarBusquedaFichaTablas(){
  $("#btn_tablas_oficiales-search").val("")
  $("#tablaOficial").DataTable().search('').draw()
  $("#btn_tablas_oficiales-trash-icon").toggle()
}
function listenerFichaTablas(dataactual,identificador){
  var data;
  $('#tablaOficial tbody').on('click', 'tr', function () {
    var table = $('#tablaOficial').DataTable();
    data = table.row( this ).data();
    } );
    

  //OWNER BTNSOLICITUD
  document.querySelector('#btnownerSolicitud').addEventListener('click', function(e){
    
    datos_usuario = getUserAndDate();
    let array_datos_usuario = datos_usuario[0];
    let nombre_usuario_modificacion = array_datos_usuario [0];
    let localISOTimeOwner = datos_usuario[1];
    // Obtener el código del nuevo propietario de los datos
    let codigoowner = $("#dataownerselect").val();
    let comp=parseInt(codigoowner)
    //Determinar el valor a enviar como data_owner
    let dataOwnerActual = data.data_owner !== " " ? data.data_owner : "SIN DATAOWNER";


    // Si el código del nuevo propietario es válido
    if (!isNaN(comp) && (codigoowner !== data.data_owner)) {

      if(dataOwnerActual == "SIN DATAOWNER"){
        registrar_visita("TABLAS OFICIALES", "Solicitud de asignacion de nuevo dataowner");
      }else{
        registrar_visita("TABLAS OFICIALES", "Solicitud de actualizacion de dataowner en tabla "+ data.tabla + "; anterior: " + dataOwnerActual + "; nuevo: " + codigoowner);
      }

        // Crear la solicitud de autorización
        escribirTablaAutorizacion(
          dataOwnerActual,    // ORIGINAL
          codigoowner,       // SOLICITADO
          nombre_usuario_modificacion, // AUTOR_SOLICITUD
          localISOTimeOwner,       // FECHA_SOLICITUD
          "1",                // TIPO_CAMBIO
          data.servidor,      // DATO3
          data.base,          // DATO2
          data.esquema,       // DATO1
          data.tabla,         // DATO4
          data.plataforma,    // DATA6
          "NONE",              //DATA7
          window.nombreCompleto.toUpperCase(),//DATA8
        );
        // Cerrar el modal
        $("#detalleModal2").modal("hide");
        showNotification("top", "center", "success", "Su solicitud ha sido enviada con éxito.");
    } else {
        // Mostrar mensaje de alerta si el código no es válido
        document.getElementById("alertado").style.display = "block";
        setTimeout(() => {
            document.getElementById("alertado").style.display = "none";
        }, 4000);
    }
});

//STEWARD BTNSOLICITUD
document.querySelector('#btnstewardSolicitud').addEventListener('click', function(e){
  
  datos_usuario = getUserAndDate();
  let array_datos_usuario = datos_usuario[0];
  let nombre_usuario_modificacion = array_datos_usuario [0];
  let localISOTimeSteward = datos_usuario[1];

  // Obtener el código del nuevo propietario de los datos
  let codigosteward= document.getElementById("dataselect").value

  let comp=parseInt(codigosteward)

   //Determinar el valor a enviar como data_steward
  let dataStewardActual = data.data_steward !== " " ? data.data_steward : "SIN DATASTEWARD";


  // Si el código del nuevo propietario es válido
  if (!isNaN(comp) && (codigosteward !== data.data_steward)) {

    if(dataStewardActual == "SIN DATASTEWARD"){
      registrar_visita("TABLAS OFICIALES", "Solicitud de asignacion de nuevo datasteward");
    }else{
      registrar_visita("TABLAS OFICIALES", "Solicitud de actualizacion de datasteward en tabla "+ data.tabla + "; anterior: " + dataStewardActual + "; nuevo: " + codigosteward);
    }

      // Crea la solicitud de autorización

    escribirTablaAutorizacion(
        dataStewardActual,    // ORIGINAL
        codigosteward,       // SOLICITADO
        nombre_usuario_modificacion, // AUTOR_SOLICITUD
        localISOTimeSteward, // FECHA_SOLICITUD
        "2",                // TIPO_CAMBIO
        data.servidor,      // DATO3
        data.base,          // DATO2
        data.esquema,       // DATO1
        data.tabla,         // DATO4
        data.plataforma,    // DATA6
        "NONE" ,            // DATA7
        window.nombreCompleto.toUpperCase() // DATA8        
    );



      // Cerrar el modal
      $("#detalleModal4").modal("hide");

      showNotification("top", "center", "success", "Su solicitud ha sido enviada con éxito.");

  } else {
      // Mostrar mensaje de alerta si el código no es válido
      document.getElementById("alertado_steward").style.display = "block";
      setTimeout(() => {
          document.getElementById("alertado_steward").style.display = "none";
      }, 4000);
  }
});

document.querySelector('#btnDeleteDominio').addEventListener('click', function(e){
  //verificar si checkbox está marcado
  let marcado=$('#checkdominio').is (":checked")
  let llavetabla=data.servidor+ "_" +data.esquema+ "_" +data.base+ "_" +data.tabla
  if(!marcado){
    if(data.descripcion_dominio.includes(";")){
      //solo actualizo con el resto de dominios
      let dominio_case1= (data.descripcion_dominio).split("; ")
      let final=[]
      dominio_case1.forEach(element => {
        if(!(element.toLowerCase() == identificador.toLowerCase())){
            final.push(element)
        }
      });
      let dominiofinal;
      if(final.length>1){
        dominiofinal=final.join("; ")
      }else{
        dominiofinal=final.join("")
      }
      window.tablas_oficiales[llavetabla]["descripcion_dominio"]=dominiofinal
       //escribirlo
       actualizarDominio("descripcion_dominio",data.tabla,data.servidor,data.base,data.esquema,dominiofinal)
      
    }else{
      if(data.data_owner==" " && data.data_steward==" "){
        //eliminarlo
       delete window.tablas_oficiales.llavetabla
        eliminarDominio("",data.tabla,data.servidor,data.base,data.esquema,"")
      }
    }
  }else{
    if(data.data_owner==" " && data.data_steward==" "){
      //eliminarlo
      delete window.tablas_oficiales.llavetabla
        eliminarDominio("",data.tabla,data.servidor,data.base,data.esquema,"")
    }else{
      //actualizo con vacio
      window.tablas_oficiales[llavetabla]["descripcion_dominio"]=" "
       //escribirlo
       actualizarDominio("descripcion_dominio",data.tabla,data.servidor,data.base,data.esquema," ")
    }
  }
        //en cualquier caso debe de eliminarse de data actual
        let encontrado=false
        let x=0
        $.each(dataactual,function(index,element){
          if((element["servidor"]==(data.servidor)) && (element["base"]==(data.base)) && (element["esquema"]==(data.esquema)) && (element["tabla"]==data.tabla)  ){
            encontrado=true     
          }
          if(!encontrado){
            x+=1
          }
         });
         dataactual.splice(x,1)
        redrawDataTable("tablaOficial",dataactual)
});
//ETIQUETAS
  document.querySelector('#btnEtiquetas').addEventListener('click', function(e){
        let Cod_Etiqueta = getCatalogoOGASUITE("1");
        //campos con las tablas que deben cambiarse
          let tablacambiar= data.tabla
          let codigoetiquetas = $("#etiquetasCampo").val().join("|");
          //---texto de la etiqueta
          let listadoEtiquetas = codigoetiquetas.split("|")
          let listadotextofinal=[]
          listadoEtiquetas.forEach(elemento =>{
            listadotextofinal.push(Cod_Etiqueta[elemento])
          })
          let textofinal = listadotextofinal.join("|")
 
      let llavetabla=data.servidor+ "_" +data.esquema+ "_" +data.base+ "_" +data.tabla
      //Si codigo de etiquetas al remplazar los espacios por una cadeba vacia es diferente de una cadena vacia 
      
      if(codigoetiquetas.replaceAll(" ","")!="" ){
        if(window.tablas_oficiales[llavetabla] !==undefined){
          if(window.tablas_oficiales[llavetabla]["etiquetas"].replaceAll(" ", "") !== ""){
            registrar_visita("TABLAS OFICIALES", "Actualiza etiqueta en tabla "+ data.tabla + "; anterior: " + data.etiquetas_numero + "; nuevo: " +codigoetiquetas);
          }else{
            registrar_visita("TABLAS OFICIALES", "Nueva etiqueta en tabla " + data.tabla+ "; nuevo : " +codigoetiquetas);
          }
        }
        //Si llave_tabla está en tablasoficiales solo actualizo-sino escribo todo
        if(window.tablas_oficiales[llavetabla]!==undefined){
          actualizarTablasOficiales("etiquetas",data.tabla,data.servidor,data.base,data.esquema,codigoetiquetas)
          //
        }else{
          escribirTablasOficiales("etiquetas",data.tabla,data.plataforma,data.servidor,data.base,data.esquema,codigoetiquetas)
        }
        //cambio en pantalla
        if(window.tablas_oficiales[llavetabla]!==undefined){
          
          $.each(window.tablas_oficiales,function(index,element){
            if((element["servidor"]==(data.servidor)) && (element["base"]==(data.base)) && (element["esquema"]==(data.esquema)) && (element["tabla"]==tablacambiar)  ){
              element["etiquetas"]=textofinal
              element["etiquetas_numero"]=codigoetiquetas
            }
          });
          
          $.each(dataactual,function(index,element){
            if((element["servidor"]==(data.servidor)) && (element["base"]==(data.base)) && (element["esquema"]==(data.esquema)) && (element["tabla"]==tablacambiar)  ){
              element["etiquetas"]=textofinal
              element["etiquetas_numero"]=codigoetiquetas
            }
          });
        }else{
          window.tablas_oficiales[llavetabla]={
            tabla:data.tabla,
            servidor:data.servidor,
            plataforma:data.plataforma,
            base:data.base,
            esquema:data.esquema,
            descripcion_dominio:" ",
            descripcion_tabla : " ",
            data_owner: " ",
            data_steward: " ",
            nombre_data_owner:" ",
            nombre_data_steward: " ",
            etiquetas: textofinal,
            etiquetas_numero :codigoetiquetas,
            avance :"0",
            clasificacion:" "
          }

          
          dataactual.push({
            tabla:data.tabla,
            servidor:data.servidor,
            plataforma:data.plataforma,
            base:data.base,
            esquema:data.esquema,
            descripcion_dominio:" ",
            descripcion_tabla : " ",
            data_owner: " ",
            data_steward: " ",
            nombre_data_owner:" ",
            nombre_data_steward: " ",
            etiquetas: textofinal,
            etiquetas_numero :codigoetiquetas,
            avance :"0",
            clasificacion:" "
          })
        }
        redrawDataTable("tablaOficial",dataactual)

        $("#detalleModal9").modal("hide");
        }else{
          // crear el div para el mensaje de advertencia en caso de no elegir una opcion
          //cambiarKevin
          document.getElementById("alertado_etiqueta").style.display="block"
          setTimeout(() => {
            document.getElementById("alertado_etiqueta").style.display="none"
          }, 2000);
        }
        });

}


function buscarExploradorMetadatos(
  criterio="Tabla",
  valor=""  
){
  if(criterio && valor){
    let baseUrl = window.location.href
    baseUrl = baseUrl.substring(0, baseUrl.lastIndexOf('/'));
    // Agrega los parámetros de búsqueda
    var searchParams = new URLSearchParams();
    searchParams.append('criterio', capitalizarPrimeraLetra(criterio));
    searchParams.append('valor', valor.toUpperCase());
    let finalUrl = `${baseUrl}/BuscadorCampos.aspx?${searchParams.toString()}`;
    window.open(finalUrl, "_blank")
  }
}


function setDataTableFichaTablas(catalogo,identificador){

  $('#tablaOficial').DataTable({
    data: catalogo,
    "rowCallback": function( row, data,displayNum,displayIndex ) {
      //let dataOwner=window.tablas_oficiales[data.llave_tabla] ? window.tablas_oficiales[data.llave_tabla]["data_owner"] : " "
      //let dataSteward=window.tablas_oficiales[data.llave_tabla] ? window.tablas_oficiales[data.llave_tabla]["data_steward"] : " "   
      let valorBusqueda = `${data.servidor}_${data.esquema}_${data.base}_${data.tabla}`
      $('td:eq(1)',row).html('\
     <icon class="simple-icon-pencil" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" ></icon>\
      <span onclick="buscarExploradorMetadatos(\'Tabla\',\''+valorBusqueda+'\')" class="link_subrrayado">'+" [ "+data.base+" ] ."+" [ "+data.esquema+" ] ."+" [ "+data.tabla+" ] " +'</span >\
      <div class="dropdown-menu dropdown-menu-right mt-3 ">\
        <a  onclick="mostrarOpcionesCampo(2,\''+data.data_owner+'\',\''+'\')" class="dropdown-item do" href="#"></a>\
        <a id="ds" onclick="mostrarOpcionesCampo(4,\''+data.data_steward+'\',\''+'\')" class="ds dropdown-item" href="#"></a>\
        <a id="per" onclick="mostrarOpcionesCampo(6,\''+data.data_steward+'\',\''+'\')" class="per dropdown-item" href="#"></a>\
        <a id="eliminarDom" onclick="mostrarOpcionesCampo(7,\''+identificador+'\',\''+data.descripcion_dominio+'\',\''+data.tabla+'\')" class="eliminarDom dropdown-item" href="#"></a>\
        <a id="etiqueta" onclick="mostrarOpcionesCampo(9, \''+'\',\''+'\',\''+'\',\''+'\',\''+'\',\''+'\',\''+'\',\''+'\',\''+'\',\'' + data.etiquetas_numero + '\')" class="etiqueta dropdown-item" href="#">Etiqueta</a>\
      </div>')
  


      //pop up con nombre de data owner y data steward
            let condicionOwner= data.data_owner !==" "
            let condicionSteward= data.data_steward !==" "        
            let mensaje=''
            let dt=''
            let ds=''
            if(condicionOwner && condicionSteward){
    
                dt= (data.nombre_data_owner).toLowerCase().split(" ")
                let nombre = capitalizarPrimeraLetra(dt[0])+" "+capitalizarPrimeraLetra(dt[2])
    
                ds=(data.nombre_data_steward).toLocaleLowerCase().split(" ")
                let nombre2= capitalizarPrimeraLetra(ds[0])+" "+capitalizarPrimeraLetra(ds[2])
               mensaje= "Data Owner: "+String(nombre) +'<br>'+"Data Steward: "+String(nombre2)
              
            }else if(condicionOwner){
              dt= (data.nombre_data_owner).toLowerCase().split(" ")
              let nombre = capitalizarPrimeraLetra(dt[0])+" "+capitalizarPrimeraLetra(dt[2])
              mensaje= "Data Owner: "+String(nombre)
            }else if(condicionSteward){
              ds= (data.nombre_data_steward).toLocaleLowerCase().split(" ")
              let nombre=capitalizarPrimeraLetra(ds[0])+" "+capitalizarPrimeraLetra(ds[2])
              mensaje= "Data Steward: "+String(nombre)
            }
           
            let tablarow= (row.children)[4]
            
          
                $(tablarow).attr("data-toggle","tooltip");
                $(tablarow).attr("data-placement","bottom");
            $(tablarow).tooltip({
              html: true,
             // width: '50px',
              boundary: 'window',
              title: mensaje,
              template: `
    
                  <div class="custom-tooltip tooltip tooltip2">
                    <div class="arrow"></div>    
                    <div class="tooltip-inner inner"></div>
                  </div>
              `
            });


    },
    initComplete: function(){
      let tabla = $("#tablaOficial").DataTable()
      $("#btn_tablas_oficiales-search").on("keyup", function(){
        tabla.search(this.value).draw();
      })
    },
    "drawCallback": function( settings ) {
      //hidePopovers() if($("#campos").hasClass("dataTable")){
        changeoptionsnames();
      
  },
    paging: true,
    colResize: {
      isEnabled: true,
      hasBoundCheck: false
    },
    
  


  
    autoWidth:true,
    info: true,
    ordering: true,
    scrollX: true,
    scrollCollapse: true,
    // calcula el 80 % del alto de la ventana restandole -250px de la altura calculada
    scrollY: 'calc(50vh)',


   // scroller:true,
  searching:true,
  dom: 'Btlip',
    //dom: "Bfrt<'row d-flex justify-content-center align-items-center'<'col-md-3 mt-3'l><' col-md-5'p><'col-md-3 'i>>",
    colResize: {
      isEnabled: true,
      hasBoundCheck: true
    },
  
    buttons: [
      {
        extend: 'excel',
        text: 'Exportar a Excel',
        customize: function ( xlsx ) {
          customizeExcel(xlsx,'Tablas Oficiales del Dominio '+identificador,"")
        }
      }
    ],
    columns: [
      { data: 'plataforma' },
      {
        //utilizando la función render para combinar los valores de las columnas
        //"servidor", "base" y "esquema"
        data: null,
        render: function (data, type, row) {
            return ' [ '+ data.base+ ' ] .'+' [ '+ data.esquema + ' ] .' +' [ '+ data.tabla + ' ] ';
        }
      },
      {
        data: 'avance',
        render: function(data, type, row) {
          //convierte el valor de data en un número float
          var numericData = parseFloat(data);
          //verifica si no es numero y diferente de data
          if (isNaN(numericData) || !data) return '0%';
          // dato se le añade %
          return numericData + '%';
        }
      },
    {
      data: 'etiquetas',
      render: function (data, type, row) {
        if (typeof data === 'string' && data.trim() !== ""){ // Verifica si hay etiquetas - trim() elimina los espacios en blanco
          let etiquetas = data.split('|'); // Dividir las etiquetas por el delimitante "|"
          let htmlEtiquetas = '<div class="badge-container">';// Variable para almacenar el HTML de las etiquetas estilizadas
          etiquetas.forEach(function(etiqueta) {
            htmlEtiquetas += '<span style="font-size: 12px;" class="badge badge-pill badge-secondary atributo">' + etiqueta.trim() + '</span>&nbsp;'; // Crear HTML para cada etiqueta
          });
          htmlEtiquetas += '</div>';
          return htmlEtiquetas; 
        } else {
          return ''; // Si no hay etiquetas, devolver una cadena vacía
        }
      }
    },
    ],
    columnDefs: [
      { targets: 3, width: "120px" },
      { targets: 2, width: "10px" },
      { targets: 1, width: "200px" },
      { targets: 0, width: "10px" },
    ],
    language:{
      "decimal":        "",
      "emptyTable":     "No hay datos disponibles en la tabla",
      "info":           "_TOTAL_ resultados", //"Mostrando _START_ a _END_ de _TOTAL_ registros",
      "infoEmpty":      "Mostrando 0 a 0 de 0 registros",
      "infoFiltered":   "", //"(filtrando de _MAX_ registros totales)"
      "infoPostFix":    "",
      "thousands":      ",",
      "lengthMenu":     "Mostrar _MENU_ registros",
      "loadingRecords": "Cargando...",
      "processing":     "",
      "search":         "",
      "zeroRecords":    "No se encontraron registros",
      "paginate": {
          "first":      "Primero",
          "last":       "Último",
          "next":       ">",
          "previous":   "<"
      },
      "aria": {
          "sortAscending":  ": activate to sort column ascending",
          "sortDescending": ": activate to sort column descending"
      }
  },
  "pageLength":25
});
$(".dataTables_empty").css("text-align","center")
/*
$('#tabla').on( 'draw.dt', function () {
  document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0;
} );
$("#tabla").css("height","25px");*/

}
//Funcion de carga para FichaAtributo.aspx
async function fichaAtributo(){
  let identificador = getParams("atributo"); //se obtiene mediante parametros de URL el identificador del atributo a presentar
  identificador = identificador.split(" ");
  const atributo = getAtributo(identificador[0]);
  $("#nombre-atributo").text(atributo.attr("ows_nombre_metad"));
  $("#dominio").text(atributo.attr("ows_descripcion_dominio"));
  $("#subdominio").text(mayusc_each_word(atributo.attr("ows_txt_desc_subdominio")));
  $("#subcategoria").text(mayusc_each_word(atributo.attr("ows_txt_desc_subcategoria")));
  $("#observacion").text(atributo.attr("ows_descripcion_metad"));
  cargarCaracteristicasAtributo(atributo);
  let catalogo=atributo.attr("ows_catalogos_asociados")
  let catalogos=[]
  if(catalogo!==undefined){
    //buscar en z catalogo referencia por cod 
    if(catalogo.includes(";")){
      let cat = catalogo.split("; ")
      cat.forEach(element => {
        
        catalogos.push({vista:element.split("||")[0],codigo:element.split("||")[1]})
        
      });
    }else{
      catalogos.push({vista:catalogo.split("||")[0],codigo:catalogo.split("||")[1]})
    }
    //buscar cada catalogo del array catalogos
    let busqueda=[]
    catalogos.forEach(element => {   
      busqueda.push(searchCatalogo(element.vista,element.codigo))
    });

    setDataTableCatalogoFicha(busqueda);
  }

  if(localStorage.getItem("citizen")==null){
    let pertenece=revisar_usuario()
    localStorage.setItem('citizen', pertenece);
  }   

  let pertenece=localStorage.getItem("citizen")
  if(pertenece==="false"){
    document.getElementById("tabla").style.display="none"
  }else{
    document.getElementById("mostrarerror").style.display="none"
    const info_tecnica_corta = await searchIT([identificador[0]])
  
    // Uniré el array de lista con la lista corta update
    const resultado_info_tecnica = [];
    // Creo un objeto para rastrear los campos ya procesados
    const camposProcesados = {};
    // Iterar sobre la lista larga y agrego elementos únicos al resultado
    info_tecnica_corta.forEach(elemento => {
      if (camposProcesados[elemento.llave_unica]===undefined && elemento.codigo === identificador[0]) {
        resultado_info_tecnica.push(elemento);
        camposProcesados[elemento.llave_unica] = true;
      }
    });

    if (pertenece==="No pertenece a las áreas"){
      setDataTableAtributo(resultado_info_tecnica,true);

    }else{
      setDataTableAtributo(resultado_info_tecnica,false);

    }
    $(".resumen-metadatos-linaje-button").on("click", (function(t) {
      t.preventDefault();
      $(".resumen-metadatos-linaje").toggleClass("shown")
      $(".resumen-metadatos-linaje-button").toggleClass("text-primary")
      $(this).tooltip('hide');
    }))
    
    window.entidadesMetadatosLinaje = resultado_info_tecnica
    //Lógica para llenar modal_indicadores de 2 secciones
    await fillModalCalidad()
    deleteFiltroCalidad()

    if(!window.porcentajeResumen){
      let ctx = document.getElementById("resumen-chart").getContext('2d');      
      
      new Chart(ctx, {
          type: "doughnut",
          data: {
              labels: ["Avance", "Faltante"],
              datasets: [{
                  label: "",
                  borderColor: ["#D2006E", "#160F41"],
                  backgroundColor: ["#D2006E", "#160F41"],
                  borderWidth: 2,
                  // data: [valor > 100 ? 0 : valor, valor > 100? 100 : 100 - valor]
                  data: [window.promedioAtributo,100-window.promedioAtributo]
              }]
          },
          options: {
              elements: {
                  center: {
                      text: window.promedioAtributo === 0? "N/D" : `${window.promedioAtributo}%`,
                      color: "#373737",
                      fontStyle: "Nunito, sans-serif",
                      sidePadding: 15,
                      maxFontSize: 15,
                      minFontSize: 15,
                  }
              },
              plugins: {
                  datalabels: {
                      display: false
                  }
              },
              responsive: true,
              maintainAspectRatio: false,
              cutoutPercentage: 80,
              title: {
                  display: true,
                  text: "Porcentaje de Calidad",
                  fontStyle: "Nunito, sans-serif",
                  minFontSize: 28,
                  maxFontSize: 28
              },
              layout: {
                  padding: {
                      bottom: 20
                  }
              },
              legend: {
                  display: false
              }
          }
      });
      document.getElementById("numeroEntidadesPromedio").innerHTML =  `${window.entiadesEvaluadas} ${window.entiadesEvaluadas === 1 ? "entidad evaluada":"entidades evaluadas"} `
      loadCardResumen()
    }

  }

  registrar_visita("FICHA DE ATRIBUTO",atributo.attr("ows_nombre_metad"));
}

function calcularEstadisticas(lista) {
  const basesUnicas = new Set();           // Almacenar los orígenes únicos
  const tablasPorBase = {};                 // Almacenar las tablas únicas por origen
  let totalCampos = 0;                     // Contador total de atributos

  lista.forEach((item) => {
    // 1. Contar orígenes únicos
    basesUnicas.add(item.base);
    
    // 2. Contar tablas únicas por origen
    if (!tablasPorBase[item.base]) {
      tablasPorBase[item.base] = new Set();
    }
    tablasPorBase[item.base].add(item.tabla);
    
    // 3. Contar total de atributos
    totalCampos++;
  });

  // Número total de tablas sumando todas las tablas únicas por origen
  const totalTablas = Object.values(tablasPorBase).reduce((sum, set) => sum + set.size, 0);

  return {
    bases: basesUnicas.size, // Número de orígenes únicos
    tablas: totalTablas,           // Número total de tablas únicas
    campos: totalCampos      // Número total de atributos
  };
}



function loadCardResumen(){
  

  let contadores = calcularEstadisticas(window.entidadesMetadatosLinaje)

  window.porcentajeResumen = {
    tablas: contadores.tablas,
    bases: contadores.bases,
    campos : contadores.campos,
    artefactos : artefactos.size,
  }
  $("#resumen-contador-bases").text(window.porcentajeResumen.bases)
  $("#resumen-contador-tablas").text(window.porcentajeResumen.tablas)
  $("#resumen-contador-campos").text(window.porcentajeResumen.campos)
  $("#resumen-contador-artefactos").text("--")
}

function tablaCalidadVacia(){
  let canExit = true;  // Para verificar si puede salir globalmente

  // Iterar sobre cada fila del DataTable
  $("#indicadores_calidad tbody tr").each(function() {
      let hasText = false;
      let row = $(this);  // Fila actual
  
      // Verificar si los inputs en la fila tienen texto
      row.find(".valor_calidad_atributo").each(function() {
        if ($(this).val().length>1) {
          hasText = true;
        }
      });

      row.find(".valor_calidad_reglas").each(function() {
        if ($(this).val()) {
          hasText = true;
        }
      });
  
      // Verificar si el botón de la fila está deshabilitado
      let isButtonDisabled = row.find(".btnGuardarIndicadores").prop("disabled");
      // Si tiene texto y el botón no está deshabilitado, no se puede salir
      if (hasText && !isButtonDisabled) {
          canExit = false;  // No permitir salida
          return false;  // Salir del loop de filas, no tiene sentido seguir buscando
      }
  });
  return canExit;
}

async function fillModalCalidad(){
  $("#nueva-entidad").click(function(){
    if(!tablaCalidadVacia()){
      $("#confirmModal").modal('show'); // Muestra el modal
    }else{
      deleteFiltroCalidad()
    }
  });

  // Si se presiona "Sí" en el modal
  $("#confirmYes").click(function(){
    // Ejecuta la función de eliminación cuando se confirma
    deleteFiltroCalidad();
    $("#confirmModal").modal('hide'); // Oculta el modal después de confirmar
  });
  window.calidadTablasOficiales = getAutocompletadoTablas();
 
  window.entidadesMetadatosLinaje.sort((a,b) => a.tabla.localeCompare(b.tabla) )
  window.entidadesMetadatosLinaje.sort((a,b) => a.esquema.localeCompare(b.esquema) )
  window.entidadesMetadatosLinaje.sort((a,b) => a.base.localeCompare(b.base) )
  const encontrados = new Set();
  const resultado = window.entidadesMetadatosLinaje.filter(obj => {
    if (!encontrados.has(obj.llave_tabla)) {
      encontrados.add(obj.llave_tabla);
      return true;
    }
    return false;
  });

  let sortedSource = resultado.map(item =>( {label:item.tabla.toLocaleUpperCase() , value: item}))
  // let sortedSource = window.entidadesMetadatosLinaje.map(item =>( {label:item.tabla.toLocaleUpperCase() , value: item}))
  $("#entidad-search").autocomplete({
    source: sortedSource,
    select: function(event, ui){
      // Evitar que se establezca el valor por defecto del input (que sería el `value`)
      event.preventDefault();
      let entidad = ui.item.value
      
      let itemLlave = `[${entidad.servidor || entidad.txt_servidor}].[${entidad.base || entidad.txt_host}].[${entidad.esquema || entidad.txt_fuente_esquema}].[${entidad.tabla || entidad.txt_desc_tabla}]`
      let selectedItem = $(".lista-entidades-calidad__item")[window.listaEntidadesCalidad.indexOf(itemLlave)]

      if(!selectedItem){    
        fillInfoEntidadIndicadores(ui.item.value)
        filtrarTablaCalidad();
      }else{
        selectedItem.click()
      }
    }
  }).autocomplete("widget").addClass("select-entidades")
  //Llena la lista de entidades que cuentan con documentacion de indicadores de calidad seccion izquierda modal
  fillListaEntidades()
}

//Funcion para mostrar los indicadores de calida de la entidad seleccionada
function filtrarTablaCalidad(){
  $("#entidad-buscar").css("display","inherit");
  $("#entidad-actual").text(window.entidad_actual || "Seleccione una Entidad");
  let tablas = getCalidad_atributo(window.identificador_atributo)
  let filtrado = []
  let servidor = window.objeto_entidad_actual.servidor || window.objeto_entidad_actual.txt_servidor
  let base= window.objeto_entidad_actual.base || window.objeto_entidad_actual.txt_host
  let esquema= window.objeto_entidad_actual.esquema || window.objeto_entidad_actual.txt_fuente_esquema
  let tabla= window.objeto_entidad_actual.tabla || window.objeto_entidad_actual.txt_desc_tabla
  Object.entries(tablas).forEach(([key, value]) => {
    if(
      key.includes(window.entidad_actual) && (
      value.servidor === servidor  &&
      value.base === base &&
      value.esquema === esquema && 
      value.tabla === tabla
    ))filtrado.push(value)
  })
  let data_tabla=[];
  $.each(window.tabla_indicador_calidad, function(value, text) {
    data_tabla.push({ value: value, text: text });
  });
  
  // Integrar los porcentajes en los datos de la tabla
  for (let i = 0; i < data_tabla.length; i++) {
    let value = data_tabla[i].value;
    for (let key in filtrado) {
      if (filtrado[key].id_dimension == value &&
        filtrado[key].id_atributos == window.identificador_atributo) {
        data_tabla[i].porcentaje = filtrado[key].valor;
        data_tabla[i].descripcion_reglas = filtrado[key].descripcion_reglas;
        data_tabla[i].usuario_ult_actualizacion = filtrado[key].usuario_ult_actualizacion;
        data_tabla[i].fecha_ult_actualizacion = filtrado[key].fecha_ult_actualizacion;
        break;
      }
    }
  }
  redrawDataTable("indicadores_calidad",data_tabla);
  $('.btnGuardarIndicadores').prop('disabled', true);

}

//Funcion para llenar la informacion de la entidad seleccionada
function fillInfoEntidadIndicadores(entidad){
  let entidadSearch = $("#entidad-search")
  entidadSearch.css("background-color", '#e9ecef')
  entidadSearch.prop('disabled', true)
  let itemLlave =  `[${entidad.servidor}].[${entidad.base}].[${entidad.esquema}].[${entidad.tabla}]`
  let selectedItem = window.calidadTablasOficiales.find(item => `[${item.txt_servidor}].[${item.txt_host}].[${item.txt_fuente_esquema}].[${item.txt_desc_tabla}]` === itemLlave) || 
  window.entidadesMetadatosLinaje.find(item => `[${item.servidor}].[${item.base}].[${item.esquema}].[${item.tabla}]` === itemLlave);

  if (selectedItem) {
    window.entidad_actual = selectedItem.txt_desc_tabla || selectedItem.tabla || ""
    window.objeto_entidad_actual = selectedItem
    $("#entidad-search").val(selectedItem.txt_desc_tabla || selectedItem.tabla || "")
    $("#entidad-actual").text(selectedItem.txt_desc_tabla || selectedItem.tabla || "Entidad no encontrada" )
    $("#servidor").val(selectedItem.txt_servidor || selectedItem.servidor || "" );
    $("#Aprovisionamiento").val(selectedItem.txt_fuente_aprovisionamiento || selectedItem.plataforma || "" );
    $("#base").val(selectedItem.txt_host || selectedItem.base || "" );
    $("#Esquema").val(selectedItem.txt_fuente_esquema || selectedItem.esquema || "");
    $("#documentacion").val(`${selectedItem.txt_documentacion || selectedItem.porcentaje_avance || ""}% `)
  }
}

//Funcion para llenar la lista de entidades con indicadores de calidad evaluadas
function fillListaEntidades(){
  let entidadesCalidad = getEntidad_Atributo(window.identificador_atributo || "")
  window.listaEntidadesCalidad = []
  let listaEntidadesDocumentadas = document.getElementById("lista-entidades-calidad")
  listaEntidadesDocumentadas.innerHTML = ''
  entidadesCalidad.forEach(item => {
    let entidad = document.createElement("a");
    entidad.innerHTML = item.tabla.replaceAll('<br>','');
    entidad.className = "mb-2";
    entidad.style.fontSize = "clamp(0.65rem, .6vw + 0.2rem, 1.125rem)"
    entidad.setAttribute("href","#catalogo");
    entidad.classList.add("lista-entidades-calidad__item")
    entidad.addEventListener("click", function(e) {
      $('a.font-weight-bold.color-theme-1').toggleClass('font-weight-bold color-theme-1');
      this.className+= " font-weight-bold color-theme-1";
      fillInfoEntidadIndicadores(item)
      filtrarTablaCalidad();
    });
    window.listaEntidadesCalidad.push(`[${item.servidor}].[${item.base}].[${item.esquema}].[${item.tabla}]`)
    listaEntidadesDocumentadas.appendChild(entidad);
  })
}


function chartfaltante(){
  let parametros=["Completitud","Unicidad","Validez","Lógica","Precisión","Integridad","Oportunidad","Cobertura","Integralidad"]
  let data = [100,80,95,90.5,85,85,96,90.87,88.55]
  Chart.pluginService.register({
    beforeDraw: function(chart) {
      if (chart.config.options.elements.center) {
        // Get ctx from string
        var ctx = chart.chart.ctx;

        // Get options from the center object in options
        var centerConfig = chart.config.options.elements.center;
        var fontStyle = centerConfig.fontStyle || 'Arial';
        var txt = centerConfig.text;
        var color = centerConfig.color || '#000';
        var maxFontSize = centerConfig.maxFontSize || 75;
        var sidePadding = centerConfig.sidePadding || 20;
        var sidePaddingCalculated = (sidePadding / 100) * (chart.innerRadius * 2)
        // Start with a base font of 30px
        ctx.font = "30px " + fontStyle;

        // Get the width of the string and also the width of the element minus 10 to give it 5px side padding
        var stringWidth = ctx.measureText(txt).width;
        var elementWidth = (chart.innerRadius * 2) - sidePaddingCalculated;

        // Find out how much the font can grow in width.
        var widthRatio = elementWidth / stringWidth;
        var newFontSize = Math.floor(30 * widthRatio);
        var elementHeight = (chart.innerRadius * 2);

        // Pick a new font size so it will not be larger than the height of label.
        var fontSizeToUse = Math.min(newFontSize, elementHeight, maxFontSize);
        var minFontSize = centerConfig.minFontSize;
        var lineHeight = centerConfig.lineHeight || 25;
        var wrapText = false;

        if (minFontSize === undefined) {
          minFontSize = 20;
        }

        if (minFontSize && fontSizeToUse < minFontSize) {
          fontSizeToUse = minFontSize;
          wrapText = true;
        }

        // Set font settings to draw it correctly.
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        var centerX = ((chart.chartArea.left + chart.chartArea.right) / 2);
        var centerY = ((chart.chartArea.top + chart.chartArea.bottom) / 2);
        ctx.font = fontSizeToUse + "px " + fontStyle;
        ctx.fillStyle = color;

        if (!wrapText) {
          ctx.fillText(txt, centerX, centerY);
          return;
        }

        var words = txt.split(' ');
        var line = '';
        var lines = [];

        // Break words up into multiple lines if necessary
        for (var n = 0; n < words.length; n++) {
          var testLine = line + words[n] + ' ';
          var metrics = ctx.measureText(testLine);
          var testWidth = metrics.width;
          if (testWidth > elementWidth && n > 0) {
            lines.push(line);
            line = words[n] + ' ';
          } else {
            line = testLine;
          }
        }

        // Move the center up depending on line height and number of lines
        centerY -= (lines.length / 2) * lineHeight;

        for (var n = 0; n < lines.length; n++) {
          ctx.fillText(lines[n], centerX, centerY);
          centerY += lineHeight;
        }
        //Draw text in center
        ctx.fillText(line, centerX, centerY);
      }
    }
  });
  let y=0
  for(let x =2;x<(parametros.length+2);x++){
            let nombre="categoryChart"+x
              var categoryChart = document.getElementById(nombre);
          var myDoughnutChart = new Chart(categoryChart, {
        //    plugins: [centerTextPlugin],
            type: "doughnut",
            data: {
              labels: ["Avance", "Faltante"],
              datasets: [
                {
                  label: "",
                  borderColor: ["#D2006E", "#160F41"],
                  backgroundColor: [
                    "#D2006E",
                    "#160F41"
                  ],
                  borderWidth: 2,
                  data: [data[y], 100-data[y]]
                }
              ]
            },
            draw: function () { },
            options: {
              elements: {
                center: {
                  text: data[y]+"%",
                  color: "#373737",
                  fontStyle: " Nunito, sans-serif", // Default is Arial
                  sidePadding: 15, // Default is 20 (as a percentage)
                  maxFontSize: 15, // Default is 20 (in px), set to false and text will not wrap.
                  minFontSize: 15,
                  
                  
                }
              },
              plugins: {
                datalabels: {
                  display: false
                }
              },
              responsive: true,
              maintainAspectRatio: false,
              cutoutPercentage: 80,
              title: {
                display: true,
           
                
                text: parametros[y],
                fontStyle: " Nunito, sans-serif", // Default is Arial
                minFontSize:28,
                maxFontSize:28
              },
              layout: {
                padding: {
                  bottom: 20
                }
              },
              legend: {
                display:false,
                
              },
              onClick: (e)=>{
                clickDonut(e,myDoughnutChart);
                }
             // tooltips: chartTooltip
            }
          });
          y+=1
  
          /*var chartTooltip = {
            backgroundColor: foregroundColor,
            titleFontColor: primaryColor,
            borderColor: separatorColor,
            borderWidth: 0.5,
            bodyFontColor: primaryColor,
            bodySpacing: 10,
            //xPadding: 15,
           // yPadding: 15,
            cornerRadius: 0.15,
            displayColors: false
          };*/
  }
  return   Math.round((data.reduce(add, 0))/data.length)
}

function add(accumulator, a) {
  return accumulator + a;
}

function chartdonut(prom){
  Chart.pluginService.register({
    beforeDraw: function(chart) {
      if (chart.config.options.elements.center) {
        // Get ctx from string
        var ctx = chart.chart.ctx;

        // Get options from the center object in options
        var centerConfig = chart.config.options.elements.center;
        var fontStyle = centerConfig.fontStyle || 'Arial';
        var txt = centerConfig.text;
        var color = centerConfig.color || '#000';
        var maxFontSize = centerConfig.maxFontSize || 75;
        var sidePadding = centerConfig.sidePadding || 20;
        var sidePaddingCalculated = (sidePadding / 100) * (chart.innerRadius * 2)
        // Start with a base font of 30px
        ctx.font = "30px " + fontStyle;

        // Get the width of the string and also the width of the element minus 10 to give it 5px side padding
        var stringWidth = ctx.measureText(txt).width;
        var elementWidth = (chart.innerRadius * 2) - sidePaddingCalculated;

        // Find out how much the font can grow in width.
        var widthRatio = elementWidth / stringWidth;
        var newFontSize = Math.floor(30 * widthRatio);
        var elementHeight = (chart.innerRadius * 2);

        // Pick a new font size so it will not be larger than the height of label.
        var fontSizeToUse = Math.min(newFontSize, elementHeight, maxFontSize);
        var minFontSize = centerConfig.minFontSize;
        var lineHeight = centerConfig.lineHeight || 25;
        var wrapText = false;

        if (minFontSize === undefined) {
          minFontSize = 20;
        }

        if (minFontSize && fontSizeToUse < minFontSize) {
          fontSizeToUse = minFontSize;
          wrapText = true;
        }

        // Set font settings to draw it correctly.
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        var centerX = ((chart.chartArea.left + chart.chartArea.right) / 2);
        var centerY = ((chart.chartArea.top + chart.chartArea.bottom) / 2);
        ctx.font = fontSizeToUse + "px " + fontStyle;
        ctx.fillStyle = color;

        if (!wrapText) {
          ctx.fillText(txt, centerX, centerY);
          return;
        }

        var words = txt.split(' ');
        var line = '';
        var lines = [];

        // Break words up into multiple lines if necessary
        for (var n = 0; n < words.length; n++) {
          var testLine = line + words[n] + ' ';
          var metrics = ctx.measureText(testLine);
          var testWidth = metrics.width;
          if (testWidth > elementWidth && n > 0) {
            lines.push(line);
            line = words[n] + ' ';
          } else {
            line = testLine;
          }
        }

        // Move the center up depending on line height and number of lines
        centerY -= (lines.length / 2) * lineHeight;

        for (var n = 0; n < lines.length; n++) {
          ctx.fillText(lines[n], centerX, centerY);
          centerY += lineHeight;
        }
        //Draw text in center
        ctx.fillText(line, centerX, centerY);
      }
    }
  });


            var categoryChart = document.getElementById("categoryChart1");
        var myDoughnutChart = new Chart(categoryChart, {
      //    plugins: [centerTextPlugin],
          type: "doughnut",
          data: {
            labels: ["Avance", "Faltante"],
            datasets: [
              {
                label: "",
                borderColor: ["#D2006E", "#160F41"],
                backgroundColor: [
                  "#D2006E",
                  "#160F41"
                ],
                borderWidth: 2,
                data: [prom, 100-prom]
              }
            ]
          },
          draw: function () { },
          options: {
            elements: {
              center: {
                text: prom+"%",
                color: 'black', // Default is #000000
                fontStyle: 'Nunito', // Default is Arial
                sidePadding: 20, // Default is 20 (as a percentage)
                maxFontSize: 15, // Default is 20 (in px), set to false and text will not wrap.
                minFontSize:15,
                lineHeight: 25 // Default is 25 (in px), used for when text wraps
              }
            },
            plugins: {
              datalabels: {
                display: false
              }
            },
            responsive: true,
            maintainAspectRatio: false,
            cutoutPercentage: 80,
            title: {
              display: false
            },
            layout: {
              padding: {
                bottom: 20
              }
            },
            legend: {
              display:false,
              
            },
            
           // tooltips: chartTooltip
          }
        });

        /*var chartTooltip = {
          backgroundColor: foregroundColor,
          titleFontColor: primaryColor,
          borderColor: separatorColor,
          borderWidth: 0.5,
          bodyFontColor: primaryColor,
          bodySpacing: 10,
          //xPadding: 15,
         // yPadding: 15,
          cornerRadius: 0.15,
          displayColors: false
        };*/
  
}

function clickDonut(e,chart){

  let idChart=e["srcElement"].id
  mostrartabla()
 
}
//datatable para el catalogo de ficha atributo
function setDataTableCatalogoFicha(catalogo){
  
  $('#catalogoficha').DataTable({
    data: catalogo,
   
    "rowCallback": function( row, data ) { //callback function para identificar si el dato es personalizado y ejecutar código
      if ( data.tipo == "P" ) {
        $(row).addClass("personalizada");
        
        $(row).attr("onclick","setDetalle('"+data.vista+"','"+ data.codigo +"')");
        for (const celda of row.children) {
          $(celda).attr("data-toggle","tooltip");
          $(celda).attr("data-placement","bottom");
          $(celda).attr("title","Click para ver detalle");
          $(celda).tooltip({
            html: true,
            title: 'Click para Ver más',
            template: `
                <div class="custom-tooltip tooltip">
                  <div class="arrow"></div>    
                  <div class="tooltip-inner"></div>
                </div>
            `
          });
        }
      }
      let listacolumns= [1,2,4,5,6]
      let nombres=[data.descripcion,data.detalle,data.servidor,data.ubicacion,data.observacion]
      for (let x =0;x<listacolumns.length;x++){
        const detalle = (row.children)[listacolumns[x]]
        
        $(detalle).attr("data-toggle","tooltip");
        $(detalle).attr("data-placement","bottom");
       
         $(detalle).tooltip({
             html: true,
             boundary: 'window',
             title: String(nombres[x]),
             template: `

                 <div class="custom-tooltip tooltip tooltip2">
                   <div class="arrow"></div>    
                   <div class="tooltip-inner inner"></div>
                 </div>
             `
           });
      }
       //copy
      let script = data.script.replaceAll("'","@")

      $('td:eq(6)', row).html(  "<icon html='true'  data-toggle='popover' data-trigger='click' data-placement='left' data-content='<b>Código Copiado!</b>' onclick='copyToClipboard(\""+script+"\",\""+data.servidor+"\")' class='iconsminds-file-copy' style='cursor:pointer'  ></icon>"+' ' +data.observacion );
       
     



    },
   /* columnDefs: [
      
      { targets: 8, width: "70px" },
      { targets: 7, width: "70px" },
      { targets: 5, width: "70px" },
      { targets: 2, width: "100px" },
      //{ targets: '_all', width: "10px" }
    ],*/
    "drawCallback": function( settings ) {
      hidePopovers()
  },
    paging: false,
    colResize: {
      isEnabled: true,
      hasBoundCheck: false
    },
    lengthChange: false,

   
    info:false,
    //dom: 'fBtlip',
    autoWidth: false,
    searching:false,
    columns: [
        { data: 'codigo' },
        { data: 'descripcion' },
        { data: 'detalle' },
        { data: 'plataforma' },
        { data: 'servidor' },
        { data: 'ubicacion', render: function (data, type, row) {
          return  data ? `<p class="link_subrrayado" onclick="buscarExploradorMetadatos('Tabla','${row.llave_tabla}' )">${data}</p>` : ""
        } },
        { data: 'observacion' },
        { data: 'responsable' },
        { data: 'validado' },
       
    ],
    language:{
      "decimal":        "",
      "emptyTable":     "No hay datos disponibles en la tabla",
      "info":           "_TOTAL_ resultados", //"Mostrando _START_ a _END_ de _TOTAL_ registros",
      "infoEmpty":      "Mostrando 0 a 0 de 0 registros",
      "infoFiltered":   "", //"(filtrando de _MAX_ registros totales)"
      "infoPostFix":    "",
      "thousands":      ",",
      "lengthMenu":     "Mostrar _MENU_ registros",
      "loadingRecords": "Cargando...",
      "processing":     "",
      "search":         "",
      "zeroRecords":    "No se encontraron registros",
      "paginate": {
          "first":      "Primero",
          "last":       "Último",
          "next":       ">",
          "previous":   "<"
      },
      "aria": {
          "sortAscending":  ": activate to sort column ascending",
          "sortDescending": ": activate to sort column descending"
      }
  },
 
});
//$("#tabla_wrapper").css("height","356px");
$("#catalogoficha_wrapper").addClass("overflow-auto");
$("#catalogoficha_wrapper").css("height","350px");
/*
$('#catalogo').on( 'draw.dt', function () {
  document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0;
} );
$("#catalogo").css("height","356px");
//$("#catalogo").addClass("overflow-auto");
document.querySelector("#catalogo_wrapper > div.dt-buttons.btn-group > button").innerHTML = "Descargar como Excel <i class='iconsminds-download'></i>";
*/
$('[data-toggle="tooltip"]').tooltip();
}


function mostrartabla(){

    let tabla = document.getElementById("tablaf").style.display
    if(tabla=="none"){
      document.getElementById("tablaf").style.display="block"
      
    }else{
      document.getElementById("tablaf").style.display="none"
    }

}

//Funcion para configurar datatable de la información técnica de un atributo
//Se usa libreria datatables.js - datatables explained
function setDataTableAtributo(informacion_tecnica,anonimizar){
  informacion_tecnica = informacion_tecnica.sort((a,b) =>{
    const fA = a.tabla;
    const fB = b.tabla;
    let comparison = 0;
    if (fA > fB) {
        comparison = 1;
    } else if (fA < fB) {
        comparison = -1;
    }
    return comparison;
  });
  informacion_tecnica = informacion_tecnica.sort((a,b) =>{
    const fA = a.campo;
    const fB = b.campo;
    let comparison = 0;
    if (fA > fB) {
        comparison = 1;
    } else if (fA < fB) {
        comparison = -1;
    }
    return comparison;
  });
  $('#tabla').DataTable({
    data: informacion_tecnica,
    paging: false,
    
    "rowCallback": function( row, data ) { //callback function para por fila ejecutar código
      if ( data.golden_record == "1" ) { //en caso de que la data de la fila corresponda a un golden record se le agrega la clase
        $(row).addClass("golden-record");
      }
    },
    lengthChange: false,
    info: false,
    dom: isOGA() ? 'Bt' : 't',
    autoWidth: false,
    "aaSorting": [],
    buttons: [
      {
        extend: 'excel',
        text: "Descargar como Excel <i class='iconsminds-download'></i>",
    }
    ],
   /*scrollX:true,*/
    scrollCollapse:true,
    colResize: {
      isEnabled: true,
      hasBoundCheck: false
    },
    scrollX: true,
    scrollCollapse: true,
    scrollY: '325px',
    columns: [ //en datatables si se envía un arreglo de objetos las columnas se definen de esta manera
        { data: 'servidor' }, 
        { data: 'esquema' },
        { data: 'base'},
        { data: 'tabla',
          "render": function(data, type, row){
            return data ? `<p class="link_subrrayado" onclick="buscarExploradorMetadatos('Tabla','${row.llave_tabla}' )">${data}</p>` : ""
          }
        },
        { data: 'campo' ,
        "render": function (value) {
          if(anonimizar){
            let mitad=Math.round(value.length/2)
            let palabra=value.substr(0,mitad)+("X".repeat((value.length)-mitad));
             return palabra
          }return value
        },},
        { data: 'tipo_dato'},
        { data: 'largo'},
        { data: 'permite_null' },
        { data:'golden_record', visible: false, 'targets': 8,'render': function(data, type, row){
          return parseFloat(data) || 0.0
        }}
        
    ],
    order:[
      [8, 'desc']
    ],
    language:{ //configuraciones de los mensajes presentados considerar "_START_", "_END_", etc. como las variables que se imprimen
      "decimal":        "",
      "emptyTable":     "No hay datos disponibles en este atributo",
      "info":           "Mostrando _TOTAL_ registros", //"Mostrando _START_ a _END_ de _TOTAL_ registros",
      "infoEmpty":      "Mostrando 0 a 0 de 0 registros",
      "infoFiltered":   "", //"(filtrando de _MAX_ registros totales)"
      "infoPostFix":    "",
      "thousands":      ",",
      "lengthMenu":     "Mostrar _MENU_ registros",
      "loadingRecords": "Cargando...",
      "processing":     "",
      "search":         "",
      "zeroRecords":    "No se encontraron registros",
      "paginate": {
          "first":      "Primero",
          "last":       "Último",
          "next":       ">",
          "previous":   "<"
      },
      "aria": {
          "sortAscending":  ": activate to sort column ascending",
          "sortDescending": ": activate to sort column descending"
      }
  }
});
if(isOGA){ //SOLO si es el usuario es miembro de OGA se le presenta la opción de descargar la tabla en excel
  //document.querySelector("#tabla_wrapper > div.dt-buttons.btn-group > button").innerHTML = "Descargar como Excel <i class='iconsminds-download'></i>";


}
}

//Función de la impresión de la estructura de un dominio
//Se considera suplentes
function fillEstructura(arreglo,id_div){
  let suplentes = [];
  $.each(arreglo, function(index,item){
    if(item.suplente == "0"){
      $("#"+id_div).append("<p class='mb-2' id='"+ item.id_principal +"'>"+ mayusc_each_word(item.nombre_arreglado)+"</p>");
    }else if(item.suplente == "1"){
      suplentes.push(item);
    }
  });
  $.each(suplentes, function(index,item){
    document.getElementById(item.id_principal).innerHTML += " <span class='font-weight-bold'>(R)</span> " + mayusc_each_word(item.nombre_arreglado);
  });

}

//Funcion de carga para Dominio_estructura.aspx
function estructura(){
  let dominio = getEstructura(getParams("id_dominio"));
  fillBreadcrumbs(getParams("id_dominio"), dominio.dominio);
  $("#nombre-dominio").text(dominio.dominio);
  fillEstructura(dominio.lider,"lider-dominio");
  fillEstructura(dominio.custodios,"custodio");
  fillEstructura(dominio.seguridad,"oficial-seg");
  fillEstructura(dominio.administradores,"administradores");
  registrar_visita("ESTRUCTURA DE DOMINIO",dominio.dominio);
}
function mostrarDetalleCampana(codigo_iniciativa){
  let data=getDetalleCampana(codigo_iniciativa)
 
  setdatatablecampana(data)
  $("#descInventario").text(data[0].iniciativa)
  $("#modalInventario").modal("show")
}

//Función para revisar si la ruta a un documento existe o no
function verificar_ruta_existe(ruta){
  //Creo un objeto XMLHttpRequest
  var xhr = new XMLHttpRequest();
  //Configuro la solicitud
  xhr.open('HEAD', ruta, false);
  //Envio la solicitud
  xhr.send();
  //Devuelvo la respuesta
  if(xhr.status == 404){
    return 0
  } else {
    return 1
  }
}

//Funcion para mostrar el Drawio de las campañas
function mostrardrawioCampana(codigo_iniciativa){
  //Borro el contenido del modal
  $("#doc_modaldrawio").remove();
  //Actualizo el contenido al documento de la iniciativa
  let ruta = 'docs/campanias/'+codigo_iniciativa+'.aspx'
  $("#contanier_modaldrawio").html('<object id="doc_modaldrawio" width="100%" height="100%" data="'+ruta+'"></object>');
  //Si existe el archivo, muestro el modal
  if(verificar_ruta_existe(ruta) == 1){
    $("#modaldrawio").modal("show");
  }
}

function setdatatablecampana(dataC){
  if(!$("#inventariotabla").hasClass("dataTable")){
    let detalleTable = $('#inventariotabla').DataTable({
      data: dataC,
      columnDefs: [
        { targets: "_all", width: "150px" },
       
      ],
      colResize: {
        isEnabled: true,
        hasBoundCheck: false
      },
      columns: [
        { data: 'codigo_iniciativa' },
        { data: 'iniciativa' },
        { data: 'descripcion_negocio' },
        { data: 'PrefijoCampania' },
        { data: 'DiasVidaCampania' },
        { data: 'Estado' },
        { data: 'ValorPremio' },
        { data: 'MotivoNCPremio' },
        { data: 'Meta' },
        { data: 'PeriodoActual' },
        { data: 'FechaIni' },
        { data: 'FechaFin' },
        { data: 'DescripcionLog' },
        { data: 'EsAccionTactica' },
        { data: 'TieneRegistro' },
        { data: 'EsquemaSeguimiento' },
        { data: 'TablaSeguimiento' },
        { data: 'ReciclajeRegistro' },
        { data: 'ReciclajeFacturacion' },
        { data: 'TipoPremio' },
        { data: 'ConsumosPorComercios' },
        { data: 'RubroId' },
        { data: 'TipoProducto' },
        { data: 'SumatoriaConsumos' },
        { data: 'EsPasivos' },
        { data: 'Sponsor' },
        { data: 'EsquemaAudiencia' },
        { data: 'TablaAudiencia' },
        { data: 'TipoCampania' },
      ],
      "rowCallback": function( row, data,displayNum,displayIndex ) {
           // tooltip para el detalle de campos
     if(data.iniciativa != " "){
            let index_children=1
           
            const detalle = (row.children)[index_children]
            $(detalle).attr("data-toggle","tooltip");
            $(detalle).attr("data-placement","bottom");
             $(detalle).tooltip({
                 html: true,
                 boundary: 'window',
                 title: String(data.iniciativa),
                 template: `
                     <div class="custom-tooltip tooltip tooltip2">
                       <div class="arrow"></div>    
                       <div class="tooltip-inner inner"></div>
                     </div>
                 `
               });
          }
          if(data.descripcion_negocio != " "){
            let index_children=2
           
            const detalle = (row.children)[index_children]
            $(detalle).attr("data-toggle","tooltip");
            $(detalle).attr("data-placement","bottom");
             $(detalle).tooltip({
                 html: true,
                 boundary: 'window',
                 title: String(data.descripcion_negocio),
                 template: `
                     <div class="custom-tooltip tooltip tooltip2">
                       <div class="arrow"></div>    
                       <div class="tooltip-inner inner"></div>
                     </div>
                 `
               });
          }
          if(data.TablaSeguimiento != " "){
            let index_children=16
           
            const detalle = (row.children)[index_children]
            $(detalle).attr("data-toggle","tooltip");
            $(detalle).attr("data-placement","bottom");
             $(detalle).tooltip({
                 html: true,
                 boundary: 'window',
                 title: String(data.TablaSeguimiento),
                 template: `
                     <div class="custom-tooltip tooltip tooltip2">
                       <div class="arrow"></div>    
                       <div class="tooltip-inner inner"></div>
                     </div>
                 `
               });
          }
          
      },
      paging: true,
      lengthChange: true,
      info: true,
      scrollX: true,
      dom: 'fBtlip',
     // dom: "Bfrt<'row d-flex justify-content-center align-items-center'<'col-md-3 'i><' col-md-5'p><'col-md-3 mt-3'l>>",
    searching:true,
      buttons: [
        {
          extend: 'excel',
          text: 'Exportar a Excel',
          customize: function ( xlsx ) {
            customizeExcel(xlsx,"Inventario","")
          }
      }
      ],
      language:{
        "decimal":        "",
        "emptyTable":     "No hay datos disponibles en la tabla",
        "info":           "_TOTAL_ resultados", //"Mostrando _START_ a _END_ de _TOTAL_ registros",
        "infoEmpty":      "Mostrando 0 a 0 de 0 registros",
        "infoFiltered":   "", //"(filtrando de _MAX_ registros totales)"
        "infoPostFix":    "",
        "thousands":      ",",
        "lengthMenu":     "Mostrar _MENU_ registros",
        "loadingRecords": "Cargando...",
        "processing":     "",
        "search":         "",
        "zeroRecords":    "No se encontraron registros",
        "paginate": {
            "first":      "Primero",
            "last":       "Último",
            "next":       ">",
            "previous":   "<"
        },
        "aria": {
            "sortAscending":  ": activate to sort column ascending",
            "sortDescending": ": activate to sort column descending"
        }
    }
    });
    detalleTable.draw();
  }else{//en caso de ya estar inicializada la tabla se actualizan las filas con la data necesitada
 
    redrawDataTable("inventariotabla",dataC);
  }
}
//funcion para obtener detalles de la campaña a través del código
function getDetalleCampana(codigoIniciativa){
  
  let lista=[]
  $().SPServices({
    operation: "GetListItems",
    async: false,
    listName: "Z_campañas_seguimiento",
    CAMLQuery: "<Query><Where><Eq><FieldRef Name='CodigoIniciativa'/><Value Type='Text'>"+codigoIniciativa+"</Value></Eq></Where></Query>",
    CAMLViewFields: "<ViewFields>\
              <FieldRef Name='CampaniaId' />\
              <FieldRef Name='CodigoIniciativa' />\
              <FieldRef Name='Iniciativa' />\
              <FieldRef Name='DescripcionNegocio' />\
              <FieldRef Name='PrefijoCampania' />\
              <FieldRef Name='DiasVidaCampania' />\
              <FieldRef Name= 'Estado' />\
              <FieldRef Name='ValorPremio' />\
              <FieldRef Name='MotivoNCPremio' />\
              <FieldRef Name='Meta' />\
              <FieldRef Name='PeriodoActual' />\
              <FieldRef Name= 'FechaIni' />\
              <FieldRef Name= 'FechaFin' />\
              <FieldRef Name='DescripcionLog' />\
              <FieldRef Name='EsAccionTactica' />\
              <FieldRef Name='TieneRegistro' />\
              <FieldRef Name='EsquemaSeguimiento' />\
              <FieldRef Name='TablaSeguimiento' />\
              <FieldRef Name='ReciclajeRegistro' />\
              <FieldRef Name='ReciclajeFacturacion' />\
              <FieldRef Name='TipoPremio' />\
              <FieldRef Name='ConsumosPorComercios' />\
              <FieldRef Name='RubroId' />\
              <FieldRef Name='TipoProducto' />\
              <FieldRef Name='SumatoriaConsumos' />\
              <FieldRef Name='EsPasivos' />\
              <FieldRef Name='Sponsor' />\
              <FieldRef Name='EsquemaAudiencia' />\
              <FieldRef Name='TablaAudiencia' />\
              <FieldRef Name='TipoCampania' />\
          </ViewFields>",
    completefunc: function (xData, Status) {
        $(xData.responseXML).find("z\\:row").each(function () {
               
                lista.push({
                  codigo_iniciativa:$(this).attr("ows_CodigoIniciativa"),
                  iniciativa:$(this).attr("ows_Iniciativa"),
                  descripcion_negocio:$(this).attr("ows_DescripcionNegocio"),
                  PrefijoCampania:$(this).attr("ows_PrefijoCampania"),
                  DiasVidaCampania:$(this).attr("ows_DiasVidaCampania"),
                  Estado:$(this).attr("ows_Estado"),
                  ValorPremio:$(this).attr("ows_ValorPremio"),
                  MotivoNCPremio:$(this).attr("ows_MotivoNCPremio"),
                  Meta:$(this).attr("ows_Meta"),
                  PeriodoActual:$(this).attr("ows_PeriodoActual"),
                  FechaIni:$(this).attr("ows_FechaIni"),
                  FechaFin:$(this).attr("ows_FechaFin"),
                  DescripcionLog:$(this).attr("ows_DescripcionLog").replace("NULL"," "),
                  EsAccionTactica:$(this).attr("ows_EsAccionTactica").replace("NULL"," ").replace("0","No").replace("1","Si"),
                  TieneRegistro:$(this).attr("ows_TieneRegistro").replace("0","No").replace("1","Si"),
                  EsquemaSeguimiento:$(this).attr("ows_EsquemaSeguimiento").replace("NULL"," "),
                  TablaSeguimiento:$(this).attr("ows_TablaSeguimiento").replace("NULL"," "),
                  ReciclajeRegistro:$(this).attr("ows_ReciclajeRegistro").replace("NULL"," ").replace("0","No").replace("1","Si"),
                  ReciclajeFacturacion:$(this).attr("ows_ReciclajeFacturacion").replace("NULL"," ").replace("0","No").replace("1","Si"),
                  TipoPremio:$(this).attr("ows_TipoPremio"),
                  ConsumosPorComercios:$(this).attr("ows_ConsumosPorComercios").replace("NULL"," ").replace("0","No").replace("1","Si"),
                  RubroId:$(this).attr("ows_RubroId").replace("NULL"," "),
                  TipoProducto:$(this).attr("ows_TipoProducto"),
                  SumatoriaConsumos:$(this).attr("ows_SumatoriaConsumos").replace("NULL"," ").replace("0","No").replace("1","Si"),
                  EsPasivos:$(this).attr("ows_EsPasivos").replace("0","No").replace("1","Si"),
                  Sponsor:$(this).attr("ows_Sponsor").replace("NULL"," "),
                  EsquemaAudiencia:$(this).attr("ows_EsquemaAudiencia").replace("NULL"," "),
                  TablaAudiencia:$(this).attr("ows_TablaAudiencia").replace("NULL"," "),
                  TipoCampania:$(this).attr("ows_TipoCampania").replace("NULL"," "),
                })
        });
    }
  });
  return lista
}

function getCampanaSeguimiento(lista_codigos_iniciativas = []){
  var tzoffset = (new Date()).getTimezoneOffset() * 60000; //offset in milliseconds
  var localISOTime = (new Date(Date.now() - tzoffset)).toISOString().slice(0, -1).slice(0,10);
  
  if(lista_codigos_iniciativas.length == 0){
    incluir_todos = true
  } else { incluir_todos = false }

  let campana = {};
 
  $().SPServices({
    operation: "GetListItems",
    async: false,
    listName: "Z_campañas_seguimiento",
    CAMLViewFields: "<ViewFields>\
                            <FieldRef Name='CodigoIniciativa' />\
                            <FieldRef Name='Iniciativa' />\
                            <FieldRef Name='DescripcionNegocio' />\
                            <FieldRef Name= 'Estado' />\
                            <FieldRef Name= 'FechaIni' />\
                            <FieldRef Name= 'FechaFin' />\
                        </ViewFields>",
    completefunc: function (xData, Status) {
      $(xData.responseXML).find("z\\:row").each(function () {
        let codigo= $(this).attr("ows_CodigoIniciativa")
        let fechainicio=$(this).attr("ows_FechaIni")
        let fechafinal=$(this).attr("ows_FechaFin")
        let fechafin=$(this).attr("ows_FechaFin")
        let estado=$(this).attr("ows_Estado")
        
        if(lista_codigos_iniciativas.includes(codigo) || incluir_todos){
          if(campana[codigo]===undefined){
              if(estado=="T"){
                campana[codigo]={nombre:$(this).attr("ows_Iniciativa"),
                codigoIniciativa:codigo,
                estado:$(this).attr("ows_Estado"),
                A:0,
                T: 1,
                valor:1,
                fecha_inicio:[fechainicio],
                fecha_final:[fechafinal]}
              }else{
                //estado activo
                if(fechafin<localISOTime){
                  campana[codigo]={nombre:$(this).attr("ows_Iniciativa"),
                    estado:$(this).attr("ows_Estado"),
                    codigoIniciativa:codigo,
                    A:0,
                    T: 1,
                    valor:1,
                  fecha_inicio:[fechainicio],
                fecha_final:[fechafinal]}
                }else{
                  campana[codigo]={nombre:$(this).attr("ows_Iniciativa"),
                    estado:$(this).attr("ows_Estado"),
                    codigoIniciativa:codigo,
                    A:1,
                    T: 0,
                    valor:1,
                    fecha_inicio:[fechainicio],
                  fecha_final:[fechafinal]}
                }
              }
              
          }else{
            campana[codigo]["valor"]+=1
            if(estado=="T"){
              campana[codigo]["T"]+=1

            }else{
              if(fechafin<localISOTime){
                campana[codigo]["T"]+=1
              }else{
                campana[codigo]["A"]+=1
              }
            }
            campana[codigo]["fecha_inicio"].push(fechainicio)
            campana[codigo]["fecha_final"].push(fechafin)
          }
        }
        });
    }
});

  return campana
}


function listener_filtro(){
  document.getElementById("activos").addEventListener("click",function(e){
    let textoactual=document.getElementById("dropdown-inventario").innerText.replace(" ","")
    let textocambiar=document.getElementById("activos").innerText.replace(" ","")
    document.getElementById("dropdown-inventario").innerText=textocambiar
    document.getElementById("activos").innerText=textoactual
    //consultar el window.inventario actual
  
    if(textocambiar!="Todos"){
      let results=[]
      let consulta=textocambiar[0]//letra T o A
    
      $.each(window.inventario, function(index, item){
        if(consulta=="A"){
          if(item.A>0){
            results.push(item)
          }
        }else{
          if(item.T>0){
            results.push(item)
          }
        }
      });
      window.filtro_inventario=results
      printCampañas(results)
    }else{
      printCampañas(window.inventario)
    }
    // filtrar de acuerdo 
  });
  document.getElementById("terminados").addEventListener("click",function(e){
    let textoactual=document.getElementById("dropdown-inventario").innerText.replace(" ","")
    let textocambiar=document.getElementById("terminados").innerText.replace(" ","")
    document.getElementById("dropdown-inventario").innerText=textocambiar
    document.getElementById("terminados").innerText=textoactual
   
  if(textocambiar!="Todos"){
  //consultar el window.inventario actual
  let results=[]
  let consulta=textocambiar[0]//letra T o A
  $.each(window.inventario, function(index, item){
    if(consulta=="A"){
      if(item.A>0){
        results.push(item)
      }
    }else{
      if(item.T>0){
        results.push(item)
      }
    }
    
  });
  window.filtro_inventario=results
  printCampañas(results)
}else{
  printCampañas(window.inventario)
}

   
  });

}
//Funcion de carga para Inventario.aspx
function inventario_campañas(){
  $('[data-toggle="tooltip"]').tooltip();
  //Obtengo los parámetros del link
  const id_dominio = getParams("id_dominio");
  const dominio = searchDominios("id_dominio",id_dominio);
  const tipo_campania = getParams("tipo_camp");
  const subtipo_campania = getParams("subtipo_camp");
  //Pongo los links en las subpáginas
  fillBreadcrumbs(dominio.attr("ows_id_dominio"),dominio.attr("ows_descripcion_dominio"));
  //Pongo el nombre de dominio en la ficha
  $("#nombre-dominio").text(dominio.attr("ows_descripcion_dominio"));
  $("#subtitulo").html('<i class="simple-icon-arrow-left-circle m-1 regresar" onclick="history.back()"></i> Clasificación de Campañas > '+tipo_campania+" > " + subtipo_campania);
  //Obtengo cuáles son las campañas que revisaremos
  let iniciativas_tipo_campaña = getInfoClasifiCampañas().filter(item => (item.descrip_clasificacion == tipo_campania) && (item.subtipo == subtipo_campania));
  let desc_iniciativas_tipo_campaña = ""
  for(var i_iniciativa = 0; i_iniciativa < iniciativas_tipo_campaña.length; i_iniciativa ++){
    desc_iniciativas_tipo_campaña = desc_iniciativas_tipo_campaña + "|" + iniciativas_tipo_campaña[i_iniciativa]['iniciativas'];
  }
  iniciativas_tipo_campaña = desc_iniciativas_tipo_campaña.slice(1).split("|");
  //Obtengo el inventario de campañas
  const inventario=getCampanaSeguimiento(iniciativas_tipo_campaña)
  //Cargo el componente de selección de fechas
  $('#datepicker').datepicker({
    uiLibrary: 'bootstrap'
  });
  //Pongo todos los elementos del inventario de campañas en una lista global "window.inventario"
  let lista=[]
  Object.entries(inventario).forEach(([key, value]) => {
    lista.push(value)
  });
  window.inventario=lista
  //Presento el inventario de campañas
  printCampañas(lista);
  autocompleteCampana(document.getElementById("inventario-search"),lista);
  listener_filtro()
  listener_calendario()
  //registrar_visita("ARTEFACTOS DE DOMINIO",dominio.attr("ows_descripcion_dominio"));
}

function listener_calendario(){
  document.getElementById("filtrarfecha").addEventListener("click",function(e){
    let fechaini1=document.getElementById("startdate").value.replaceAll("/","-").split("-")
    let fechaini= fechaini1[2]+"-"+fechaini1[0]+"-"+fechaini1[1]
    let fechafin1=document.getElementById("enddate").value.replaceAll("/","-").split("-")
    let fechafin= fechafin1[2]+"-"+fechafin1[0]+"-"+fechafin1[1]
  
   if(fechaini1[0]!='' && fechafin1[0]!=''){
    let results=[]
    let escrito = false
      $.each(window.inventario, function(index, item){
        if((item.fecha_inicio.length!==0) && (item.fecha_final.length!==0)){
         for(let x=0;x<item.fecha_inicio.length;x++){
          let inicio=item.fecha_inicio[x]
          let final=item.fecha_final[x]
          if(inicio>=fechaini && final<=fechafin && escrito == false){
            results.push(item)
            escrito = true
          }
         }
          
        }
      
      });
    printCampañas(results)
   }
    
  });

  document.getElementById("eliminarFecha").addEventListener("click",function(e){
    document.getElementById("startdate").value=''
    document.getElementById("enddate").value=''
    printCampañas(window.inventario)
  });
}

//Funcion de carga para Dominio_artefactos.aspx
function artefactos(){
  const id_dominio = getParams("id_dominio");
  const dominio = searchDominios("id_dominio",id_dominio);
  fillBreadcrumbs(dominio.attr("ows_id_dominio"),dominio.attr("ows_descripcion_dominio"));
  $("#nombre-dominio").text(dominio.attr("ows_descripcion_dominio"));
  const artefactos = getArtefactosFromDominio(dominio.attr("ows_id_dominio"));
  printArtefactos(artefactos);
  autocompleteArtefactos(document.getElementById("artefacto-search"),artefactos);
  registrar_visita("ARTEFACTOS DE DOMINIO",dominio.attr("ows_descripcion_dominio"));
}

//Funcion para la busqueda de un artefacto mediante regex
function buscarArtefacto(search_value, list){
  if(search_value.includes("(")) search_value = search_value.replaceAll("(","\\(");
  if(search_value.includes(")")) search_value = search_value.replaceAll(")","\\)");
  let regex = new RegExp(search_value,"i");
  var results = list.filter(item => regex.test(item.attr("ows_modelo_analitica")));
  return results;
}

function buscarCampana(search_value, list){
  
  if(search_value.includes("(")) search_value = search_value.replaceAll("(","\\(");
  if(search_value.includes(")")) search_value = search_value.replaceAll(")","\\)");
  let regex = new RegExp(search_value,"i");
  var results = list.filter(item => regex.test(item.nombre));

  return results;
}

//funcion para la busqueda de un campo mediante regex
//parametro unique indica si se debe devolver campos sin repetir (necesario para el autocompletado)
function buscarCampo(search_value, list, servidor , base , esquema , tabla, unique = true, search_value_exact = false, tabla_exac = false ){
  if(search_value===undefined){
    search_value=""
  }
  
  search_value = quitarAcentos( search_value.trim().toUpperCase().replaceAll('(', '\(').replaceAll(')', '\)'))
  var results


  //FILTRO DROPDOWN - en caso de que seleccione tabla (falta autocomplete)
  let texto = document.getElementById("dropdown-buscador").innerText.replace(" ","")
  if(texto == "Tabla"){

    
  //Filtro dependiendo si necesita tabla exacta o 
  if (search_value_exact == true && tabla_exac == false){
    results = list.filter(item => item.tabla == search_value && item.servidor.includes(servidor)
    && item.base.includes(base) && item.esquema.includes(esquema)
    && item.tabla.includes(tabla));

  } else if (search_value_exact == false && tabla_exac == true) {
    results = list.filter(item => item.tabla.includes(search_value) && item.servidor == servidor
    && item.base == base && item.esquema == esquema
    && item.tabla == tabla);

  } else if (search_value_exact == true && tabla_exac == true){
    results = list.filter(item => item.tabla == search_value && item.servidor == servidor
    && item.base == base && item.esquema == esquema
    && item.tabla == tabla);

  } else if (search_value_exact == false && tabla_exac == false){

    //solved staging base
    if(base==""){
      results = list.filter(item => item.tabla.includes(search_value) && item.servidor.includes(servidor)
      && item.base.includes(base) && item.esquema.includes(esquema)
      && item.tabla.includes(tabla));
    }else{
      results = list.filter(item => item.tabla.includes(search_value) && item.servidor.includes(servidor)
      && (item.base===base) && item.esquema.includes(esquema)
      && item.tabla.includes(tabla));
    }
  }
    //visitar tabla
    if(results.length>0 && search_value_exact==true){
      registrar_visita("Consulta de Tablas",search_value);
    }
    
    //Ordeno las tablas por orden alfabético
    results.sort((a, b) => {
      const tablaA = a.tabla.toUpperCase().trim();
      const tablaB = b.tabla.toUpperCase().trim();
      if (tablaA < tablaB) {return -1;}
      if (tablaA > tablaB) {return 1;}
      return 0;});
    //Ordeno los esquemas por orden alfabético
    results.sort((a, b) => {
      const tablaA = a.esquema.toUpperCase().trim();
      const tablaB = b.esquema.toUpperCase().trim();
      if (tablaA < tablaB) {return -1;}
      if (tablaA > tablaB) {return 1;}
      return 0;});
    //Ordeno las bases por orden alfabético
    results.sort((a, b) => {
      const tablaA = a.base.toUpperCase().trim();
      const tablaB = b.base.toUpperCase().trim();
      if (tablaA < tablaB) {return -1;}
      if (tablaA > tablaB) {return 1;}
      return 0;});
  
    if(unique){
      results = [...new Map(results.map(item =>
      [item["tabla"], item])).values()];
      //Ordeno los campos por orden alfabético
      results.sort((a, b) => {
        const tablaA = a.tabla.toUpperCase().trim();
        const tablaB = b.tabla.toUpperCase().trim();
        if (tablaA < tablaB) {return -1;}
        if (tablaA > tablaB) {return 1;}
        return 0;
      });
    }

    window.prueba = results

    
  }else if(texto=="Atributo"){
    
    //Filtro dependiendo si necesita tabla exacta o 
    
  if (search_value_exact == true && tabla_exac == false){
    results = list.filter(item => quitarAcentos(item.descripcion.toUpperCase()) == search_value && item.servidor.includes(servidor)
    && item.base.includes(base) && item.esquema.includes(esquema)
    && item.tabla.includes(tabla));

  } else if (search_value_exact == false && tabla_exac == true) {
    results = list.filter(item => quitarAcentos((item.descripcion.toUpperCase())).includes(search_value) && item.servidor == servidor
    && item.base == base && item.esquema == esquema
    && item.tabla == tabla);
    
  } else if (search_value_exact == true && tabla_exac == true){
    results = list.filter(item => quitarAcentos(item.descripcion.toUpperCase() )== search_value && item.servidor == servidor
    && item.base == base && item.esquema == esquema
    && item.tabla == tabla);

  } else if (search_value_exact == false && tabla_exac == false){


    results = list.filter(item => quitarAcentos((item.descripcion.toUpperCase())).includes(search_value) && item.servidor.includes(servidor)
    && item.base.includes(base) && item.esquema.includes(esquema)
    && item.tabla.includes(tabla) );
  
 
  }


    //Ordeno las tablas por orden alfabético
    results.sort((a, b) => {
      const tablaA = a.tabla.toUpperCase().trim();
      const tablaB = b.tabla.toUpperCase().trim();
      if (tablaA < tablaB) {return -1;}
      if (tablaA > tablaB) {return 1;}
      return 0;});
    //Ordeno los esquemas por orden alfabético
    results.sort((a, b) => {
      const tablaA = a.esquema.toUpperCase().trim();
      const tablaB = b.esquema.toUpperCase().trim();
      if (tablaA < tablaB) {return -1;}
      if (tablaA > tablaB) {return 1;}
      return 0;});
    //Ordeno las bases por orden alfabético
    results.sort((a, b) => {
      const tablaA = a.base.toUpperCase().trim();
      const tablaB = b.base.toUpperCase().trim();
      if (tablaA < tablaB) {return -1;}
      if (tablaA > tablaB) {return 1;}
      return 0;});
    window.prueba = results
  
    if(unique){
      results = [...new Map(results.map(item =>
      [item["descripcion"], item])).values()];
      //Ordeno los campos por orden alfabético
      results.sort((a, b) => {
        const tablaA = a.descripcion.toUpperCase().trim();
        const tablaB = b.descripcion.toUpperCase().trim();
        if (tablaA < tablaB) {return -1;}
        if (tablaA > tablaB) {return 1;}
        return 0;
      });
    }





  }else{
        
  //Filtro dependiendo si necesita tabla exacta o 
  if (search_value_exact == true && tabla_exac == false){
    results = list.filter(item => item.campo == search_value && item.servidor.includes(servidor)
    && item.base.includes(base) && item.esquema.includes(esquema)
    && item.tabla.includes(tabla));
  } else if (search_value_exact == false && tabla_exac == true) {
    results = list.filter(item => item.campo.includes(search_value) && item.servidor == servidor
    && item.base == base && item.esquema == esquema
    && item.tabla == tabla);
  } else if (search_value_exact == true && tabla_exac == true){
    results = list.filter(item => item.campo == search_value && item.servidor == servidor
    && item.base == base && item.esquema == esquema
    && item.tabla == tabla);
  } else if (search_value_exact == false && tabla_exac == false){
    results = list.filter(item => item.campo.includes(search_value) && item.servidor.includes(servidor)
    && item.base.includes(base) && item.esquema.includes(esquema)
    && item.tabla.includes(tabla));
   
  }

  //Ordeno las tablas por orden alfabético
  results.sort((a, b) => {
    const tablaA = a.tabla.toUpperCase().trim();
    const tablaB = b.tabla.toUpperCase().trim();
    if (tablaA < tablaB) {return -1;}
    if (tablaA > tablaB) {return 1;}
    return 0;});
  //Ordeno los esquemas por orden alfabético
  results.sort((a, b) => {
    const tablaA = a.esquema.toUpperCase().trim();
    const tablaB = b.esquema.toUpperCase().trim();
    if (tablaA < tablaB) {return -1;}
    if (tablaA > tablaB) {return 1;}
    return 0;});
  //Ordeno las bases por orden alfabético
  results.sort((a, b) => {
    const tablaA = a.base.toUpperCase().trim();
    const tablaB = b.base.toUpperCase().trim();
    if (tablaA < tablaB) {return -1;}
    if (tablaA > tablaB) {return 1;}
    return 0;});
  window.prueba = results

  if(unique){
    results = [...new Map(results.map(item =>
    [item["campo"], item])).values()];
    //Ordeno los campos por orden alfabético
    results.sort((a, b) => {
      const tablaA = a.campo.toUpperCase().trim();
      const tablaB = b.campo.toUpperCase().trim();
      if (tablaA < tablaB) {return -1;}
      if (tablaA > tablaB) {return 1;}
      return 0;
    });
  }
  }











  return results;
}


//Función que lee todas las tablas de info_tecnica join tablas oficiales y actualiza sus porcentajes de avances
function actualizarAvances(){
  //Agrupo las tablas para calcular sus porcentajes de avances
  let agrupados = arrayCamposDistinct(window.info_tecnica);
  //Filtro por las tablas de info técnica que se encuentren en tablas oficiales
  let llavesTablasOficiales = getAutocompletadoTablas().map(tabla => `${tabla.txt_servidor}_${tabla.txt_fuente_esquema}_${tabla.txt_host}_${tabla.txt_desc_tabla}`)
  agrupados = agrupados.filter(registro => llavesTablasOficiales.includes(registro.llave_tabla) )
  //Actualizo cada uno de los registros de las tablas oficiales que hay
  agrupados.forEach(registro => actualizarDominio("avance", registro.tabla, registro.servidor, registro.base, registro.esquema, registro.porcentaje_avance))
}


//funcion para la busqued de un campo mediante regex
function buscarFuente(search_value, list){
  if(search_value.includes("(")) search_value = search_value.replaceAll("(","\\(");
  if(search_value.includes(")")) search_value = search_value.replaceAll(")","\\)");
  let regex = new RegExp(search_value,"i"); 
  var results = list.filter(item => regex.test(item.attr("ows_LinkFilename").split("FUENTE DE APROVISIONAMIENTO ")[1].split(".pdf")[0]));
  return results;
}

function autocompleteCampana(inp,arr){
  //funcion para el autocompletado de la búsqueda de artefactos

  var currentFocus;
  inp.addEventListener("input", function(e) {
      var a, b, i, val = this.value;
      closeAllLists();
      if (!val) { return false;}
      currentFocus = -1;
      a = document.createElement("DIV");
      a.setAttribute("id", this.id + "autocomplete-list");
      a.setAttribute("class", "autocomplete-items");
      this.parentNode.appendChild(a);
  
      let resultados = buscarCampana(val,arr);
      $.each(resultados, function(index, item){
          b = document.createElement("DIV");
        //  b.innerHTML = item.attr("ows_modelo_analitica").replaceAll('<br>','');
        //  b.innerHTML += "<input type='hidden' value='" + item.attr("ows_modelo_analitica") + "'>";
        b.innerHTML =item.nombre.replaceAll('<br>','');
          b.innerHTML += "<input type='hidden' value='" + item.nombre + "'>";
          b.addEventListener("click", function(e) {
            inp.value = this.getElementsByTagName("input")[0].value;
            closeAllLists();
          });
          a.appendChild(b);
      });
      if(resultados.length > 6){
        document.querySelector("#"+this.id + "autocomplete-list").style.overflowY = "scroll";
        document.querySelector("#"+this.id + "autocomplete-list").style.height = "260px";
        document.querySelector(".autocomplete-items :first-child").style.borderTopRightRadius = "unset"
        document.querySelector(".autocomplete-items :last-child").style.borderBottomRightRadius = "unset"
      }else{
        document.querySelector("#"+this.id + "autocomplete-list").style.overflowY = "unset";
        document.querySelector("#"+this.id + "autocomplete-list").style.height = "unset";
      }
  });
  inp.addEventListener("keydown", function(e) {
      var x = document.getElementById(this.id + "autocomplete-list");
      if (x) x = x.getElementsByTagName("div");
      if (e.keyCode == 40) {
        currentFocus++;
        addActive(x);
      } else if (e.keyCode == 38) { //up
        currentFocus--;
        addActive(x);
      } else if (e.keyCode == 13) {
        e.preventDefault();
        if (currentFocus > -1) {
          if (x){
            x[currentFocus].click()
            let resultado_c=buscarCampana(inp.value,arr)
            window.inventario=resultado_c
            printCampañas(resultado_c);
            let textoactual=document.getElementById("dropdown-inventario").innerText.replace(" ","")
            if(textoactual=="Activos" || textoactual=="Terminados"){
              document.getElementById("dropdown-inventario").innerText="Todos"
              document.getElementById("activos").innerText="Activos"
              document.getElementById("terminados").innerText="Terminados"
            }
            return false;
          }
        }
        let resultado_c=buscarCampana(inp.value,arr)
            window.inventario=resultado_c
            printCampañas(resultado_c);
        let textoactual=document.getElementById("dropdown-inventario").innerText.replace(" ","")
        if(textoactual=="Activos" || textoactual=="Terminados"){
          document.getElementById("dropdown-inventario").innerText="Todos"
          document.getElementById("activos").innerText="Activos"
          document.getElementById("terminados").innerText="Terminados"
        }

      }
  });
  function addActive(x) {
    if (!x) return false;
    removeActive(x);
    if (currentFocus >= x.length) currentFocus = 0;
    if (currentFocus < 0) currentFocus = (x.length - 1);
    x[currentFocus].classList.add("autocomplete-active");
    document.querySelector("#artefacto-searchautocomplete-list > div:nth-child("+ (currentFocus+1) +")").scrollIntoView({ block: "nearest", inline: "nearest" });
  }
  function removeActive(x) {
    for (var i = 0; i < x.length; i++) {
      x[i].classList.remove("autocomplete-active");
    }
  }
  function closeAllLists(elmnt) {
    var x = document.getElementsByClassName("autocomplete-items");
    for (var i = 0; i < x.length; i++) {
      if (elmnt != x[i] && elmnt != inp) {
        x[i].parentNode.removeChild(x[i]);
      }
    }
  }
  document.addEventListener("click", function (e) {
      closeAllLists(e.target);
  });
  document.getElementById("artefacto-buscar").addEventListener("click", function (e) {
      let input = document.getElementById("inventario-search").value
      let resultado_c=buscarCampana(inp.value,arr)
            window.inventario=resultado_c
            printCampañas(resultado_c);
      let textoactual=document.getElementById("dropdown-inventario").innerText.replace(" ","")
      if(textoactual=="Activos" || textoactual=="Terminados"){
        document.getElementById("dropdown-inventario").innerText="Todos"
        document.getElementById("activos").innerText="Activos"
        document.getElementById("terminados").innerText="Terminados"
      }
      
  });
}


//funcion para el autocompletado de la búsqueda de artefactos
function autocompleteArtefactos(inp, arr) {
  var currentFocus;
  inp.addEventListener("input", function(e) {
      var a, b, i, val = this.value;
      closeAllLists();
      if (!val) { return false;}
      currentFocus = -1;
      a = document.createElement("DIV");
      a.setAttribute("id", this.id + "autocomplete-list");
      a.setAttribute("class", "autocomplete-items");
      this.parentNode.appendChild(a);
      let resultados = buscarArtefacto(val,arr);
      $.each(resultados, function(index, item){
          b = document.createElement("DIV");
          b.innerHTML = item.attr("ows_modelo_analitica").replaceAll('<br>','');
          b.innerHTML += "<input type='hidden' value='" + item.attr("ows_modelo_analitica") + "'>";
          b.addEventListener("click", function(e) {
            inp.value = this.getElementsByTagName("input")[0].value;
            closeAllLists();
          });
          a.appendChild(b);
      });
      if(resultados.length > 6){
        document.querySelector("#"+this.id + "autocomplete-list").style.overflowY = "scroll";
        document.querySelector("#"+this.id + "autocomplete-list").style.height = "260px";
        document.querySelector(".autocomplete-items :first-child").style.borderTopRightRadius = "unset"
        document.querySelector(".autocomplete-items :last-child").style.borderBottomRightRadius = "unset"
      }else{
        document.querySelector("#"+this.id + "autocomplete-list").style.overflowY = "unset";
        document.querySelector("#"+this.id + "autocomplete-list").style.height = "unset";
      }
  });
  inp.addEventListener("keydown", function(e) {
      var x = document.getElementById(this.id + "autocomplete-list");
      if (x) x = x.getElementsByTagName("div");
      if (e.keyCode == 40) {
        currentFocus++;
        addActive(x);
      } else if (e.keyCode == 38) { //up
        currentFocus--;
        addActive(x);
      } else if (e.keyCode == 13) {
        e.preventDefault();
        if (currentFocus > -1) {
          if (x){
            x[currentFocus].click()
            printArtefactos(buscarArtefacto(inp.value,arr));
            return false;
          }
        }
        printArtefactos(buscarArtefacto(inp.value,arr));
      }
  });
  function addActive(x) {
    if (!x) return false;
    removeActive(x);
    if (currentFocus >= x.length) currentFocus = 0;
    if (currentFocus < 0) currentFocus = (x.length - 1);
    x[currentFocus].classList.add("autocomplete-active");
    document.querySelector("#artefacto-searchautocomplete-list > div:nth-child("+ (currentFocus+1) +")").scrollIntoView({ block: "nearest", inline: "nearest" });
  }
  function removeActive(x) {
    for (var i = 0; i < x.length; i++) {
      x[i].classList.remove("autocomplete-active");
    }
  }
  function closeAllLists(elmnt) {
    var x = document.getElementsByClassName("autocomplete-items");
    for (var i = 0; i < x.length; i++) {
      if (elmnt != x[i] && elmnt != inp) {
        x[i].parentNode.removeChild(x[i]);
      }
    }
  }
  document.addEventListener("click", function (e) {
      closeAllLists(e.target);
  });
  document.getElementById("artefacto-buscar").addEventListener("click", function (e) {
      let input = document.getElementById("artefacto-search").value
      printArtefactos(buscarArtefacto(input,arr));
  });
}

//Busqueda para el autocompletado de la búsqueda de Fuentes de Aprovisionamiento
function autocompleteFuentes(inp, arr) {
  var currentFocus;
  inp.addEventListener("input", function(e) {
      var a, b, i, val = this.value;
      closeAllLists();
      if (!val) { return false;}
      currentFocus = -1;
      a = document.createElement("DIV");
      a.setAttribute("id", this.id + "autocomplete-list");
      a.setAttribute("class", "autocomplete-items");
      this.parentNode.appendChild(a);
      let resultados = buscarFuente(val,arr);
      $.each(resultados, function(index, item){
          b = document.createElement("DIV");
          let nombre_archivo = item.attr("ows_LinkFilename").split("FUENTE DE APROVISIONAMIENTO ")[1].split(".pdf")[0];
          b.innerHTML = nombre_archivo;
          b.innerHTML += "<input type='hidden' value='" + nombre_archivo + "'>";
          b.addEventListener("click", function(e) {
            inp.value = this.getElementsByTagName("input")[0].value;
            closeAllLists();
          });
          a.appendChild(b);
      });
      if(resultados.length > 6){
        document.querySelector("#"+this.id + "autocomplete-list").style.overflowY = "scroll";
        document.querySelector("#"+this.id + "autocomplete-list").style.height = "260px";
        document.querySelector(".autocomplete-items :first-child").style.borderTopRightRadius = "unset"
        document.querySelector(".autocomplete-items :last-child").style.borderBottomRightRadius = "unset"
      }else{
        document.querySelector("#"+this.id + "autocomplete-list").style.overflowY = "unset";
        document.querySelector("#"+this.id + "autocomplete-list").style.height = "unset";
      }
  });
  inp.addEventListener("keydown", function(e) {
      var x = document.getElementById(this.id + "autocomplete-list");
      if (x) x = x.getElementsByTagName("div");
      if (e.keyCode == 40) {
        currentFocus++;
        addActive(x);
      } else if (e.keyCode == 38) { //up
        currentFocus--;
        addActive(x);
      } else if (e.keyCode == 13) {
        e.preventDefault();
        if (currentFocus > -1) {
          if (x){
            x[currentFocus].click()
            printFuentes(buscarFuente(inp.value,arr));
            return false;
          }
        }
        printFuentes(buscarFuente(inp.value,arr));
      }
  });
  function addActive(x) {
    if (!x) return false;
    removeActive(x);
    if (currentFocus >= x.length) currentFocus = 0;
    if (currentFocus < 0) currentFocus = (x.length - 1);
    x[currentFocus].classList.add("autocomplete-active");
    document.querySelector("#fuentes-searchautocomplete-list > div:nth-child("+ (currentFocus+1) +")").scrollIntoView({ block: "nearest", inline: "nearest" });
  }
  function removeActive(x) {
    for (var i = 0; i < x.length; i++) {
      x[i].classList.remove("autocomplete-active");
    }
  }
  function closeAllLists(elmnt) {
    var x = document.getElementsByClassName("autocomplete-items");
    for (var i = 0; i < x.length; i++) {
      if (elmnt != x[i] && elmnt != inp) {
        x[i].parentNode.removeChild(x[i]);
      }
    }
  }
  document.addEventListener("click", function (e) {
      closeAllLists(e.target);
  });
  document.getElementById("fuentes-lupa").addEventListener("click", function (e) {
      let input = document.getElementById("fuentes-search").value
      printFuentes(buscarFuente(inp.value,arr));
  });
}

//funcion para segmentar datatable de catalogo de referencias
function segmentarTabla(tabla, valor){
  
  if(valor == "Todas"){
    $(tabla).DataTable().columns(3).search("").draw();
    document.getElementById("segmentar-tabla-btn").classList.remove("activo");
  }else{
    $(tabla).DataTable().columns(3).search(valor).draw();
    if(!document.getElementById("segmentar-tabla-btn").classList.contains("activo")){
      document.getElementById("segmentar-tabla-btn").classList.add("activo");
    }
  }
  $("#segmentar-tabla-btn").text(valor);
  $('[data-toggle="tooltip"]').tooltip();
}


function cambiarColor(elem) {
  let elementos =document.getElementsByClassName('changeable')
  for(let x=0;x<elementos.length;x++){
    elementos[x].setAttribute("style", "color:rgb(58, 58, 58)")
  }
  let id= $(elem).data('target');
  let expanded= ($(elem)).attr('aria-expanded')
  let spn= $(elem).children('span')
  
  let actual= getComputedStyle(spn[0]).getPropertyValue("color")
  if(expanded=="false"){
    spn[0].setAttribute("style", "color:#D2006E")
  }else{
    spn[0].setAttribute("style", "color:rgb(58, 58, 58)")
  }

  //cosas que faltan: cuando cierro una ventana principal se deberia desmarcar todos los nodos hijos
  //agregar al main css: .changeable {color: rgb(58, 58, 58) }




  /*
  let color = document.getElementsByClassName("changeable")
  
  
  
  for (var i = 0; i < color.length; i++) {
    let c =getComputedStyle(color[i]).getPropertyValue("color");
    if(c == "rgb(58, 58, 58)" || c== "rgb(210, 0, 110)" ){
        color[i].style.color= '#D2006E';
    }else{
      color[i].style.color="black"
    }
    
  }*/
//color.addEventListener("click", cambiarColor);
//color.css("color", "red");
/*
let c =getComputedStyle(color).getPropertyValue("color");
  if(c=="rgb(58, 58, 58)"){
    $("#color").css("color", "red");
  }
*/
    
  
}

function revisar_y_pintar() {
  let elementos =document.getElementsByClassName('changeable')
  for(let x=0;x<elementos.length;x++){
    elementos[x].setAttribute("style", "color:rgb(58, 58, 58)")
  }
  let servidor= window.servidor.replace(/[^a-zA-Z0-9]/g, '')
  let base= window.base.replace(/[^a-zA-Z0-9]/g, '')
  let esquema= window.esquema.replace(/[^a-zA-Z0-9]/g, '')

  

  if(window.esquema != ""){
    if(document.getElementById("#"+servidor)){
      $("#"+servidor)[0].setAttribute("style", "color:#D2006E")
      $("#"+servidor+base)[0].setAttribute("style", "color:#D2006E")
      $("#"+servidor+base+esquema)[0].setAttribute("style", "color:#D2006E")
    }
   
  }else if (window.base != ""){
   
    if(document.getElementById("#"+servidor)){
      $("#"+servidor)[0].setAttribute("style", "color:#D2006E")
      $("#"+servidor+base)[0].setAttribute("style", "color:#D2006E")
    }
 
  }else if(window.servidor != ""){
  
    if(document.getElementById("#"+servidor)){
      $("#"+servidor)[0].setAttribute("style", "color:#D2006E");
    }
          
  }







 
  /*
  $("#"+window.servidor)
  $("#"+window.servidor+window.base)
  $("#"+window.servidor+window.base)
  $("#"+window.servidor+window.base+window.esquema)*/
}

function calldetalle(){
    if($("#campos").hasClass("dataTable")){
      cargardetalle(); 
    }
}

function escribirDT(llave_tabla){
  if(window.tablas_oficiales[llave_tabla]!==undefined){
    let data_owner=window.tablas_oficiales[llave_tabla]["data_owner"]
    let data_steward=window.tablas_oficiales[llave_tabla]["data_steward"]
    if(data_owner != " " && data_steward!=" "){
      let nombre =String((window.diccionarioDT)[data_owner]).toLocaleLowerCase().split(" ")
      let steward=String((window.diccionarioDT)[data_steward]).toLocaleLowerCase().split(" ")
      let convertido = ''
      nombre.forEach(element => {
          convertido+= capitalizarPrimeraLetra(element)+" "
      });
  
      let convertido2 = ''
      steward.forEach(element => {
          convertido2+= capitalizarPrimeraLetra(element)+" "
      });
      
      document.querySelector("#ownertext").innerHTML = "Data Owner: "+ convertido+"<br>Data Steward: "+convertido2;
        
      $("#ownertitle").css("display","block")
      $("#ownertext").css("visibility","visible")
      
    }else if(data_owner != " "){
      let nombre =String((window.diccionarioDT)[data_owner]).toLocaleLowerCase().split(" ")
     
      let convertido = ''
      nombre.forEach(element => {
          convertido+= capitalizarPrimeraLetra(element)+" "
      });
  
     
      
      document.querySelector("#ownertext").innerHTML = "Data Owner: "+ convertido
        
      $("#ownertitle").css("display","block")
      $("#ownertext").css("visibility","visible")
    }else if(data_steward != " "){
      
      let steward=String((window.diccionarioDT)[data_steward]).toLocaleLowerCase().split(" ")
     
  
      let convertido2 = ''
      steward.forEach(element => {
          convertido2+= capitalizarPrimeraLetra(element)+" "
      });
      
      document.querySelector("#ownertext").innerHTML ="Data Steward: "+convertido2;
        
      $("#ownertitle").css("display","block")
      $("#ownertext").css("visibility","visible")
    }
  }
}


function arrayCamposDistinct(resultados){
  const camposUnicos={}
  const resultado_info_tecnica_distinct = [];
  if(resultados.length!==0){
    resultados.forEach(elemento => {   
      let llave=elemento.plataforma+"_"+elemento.servidor+"_"+elemento.base+"_"+elemento.esquema+"_"+elemento.tabla 
      if (camposUnicos[llave]===undefined) {
        let dict_avance = {'campos_totales': 0, 'campos_avanzados': 0, 'porcentaje_avance': 0}
        let elemento_final = { ...elemento, ...dict_avance}
        let index_info_tecnica = resultado_info_tecnica_distinct.length
        resultado_info_tecnica_distinct.push(elemento_final);
        camposUnicos[llave] = index_info_tecnica;
        if((elemento.descripcion.replaceAll(" ", "") != "" || elemento.detalle.replaceAll(" ", "") != "") && !elemento.detalle.startsWith("***")){
          resultado_info_tecnica_distinct[camposUnicos[llave]].campos_totales += 1;
          resultado_info_tecnica_distinct[camposUnicos[llave]].campos_avanzados += 1;
          resultado_info_tecnica_distinct[camposUnicos[llave]].porcentaje_avance = (((resultado_info_tecnica_distinct[camposUnicos[llave]].campos_avanzados)/(resultado_info_tecnica_distinct[camposUnicos[llave]].campos_totales)) * 100).toFixed(0);
        } else {
          resultado_info_tecnica_distinct[camposUnicos[llave]].campos_totales += 1;
          resultado_info_tecnica_distinct[camposUnicos[llave]].porcentaje_avance = (((resultado_info_tecnica_distinct[camposUnicos[llave]].campos_avanzados)/(resultado_info_tecnica_distinct[camposUnicos[llave]].campos_totales)) * 100).toFixed(0);
        }
      }
      else {
        //En caso ya haya insertado el dato, reviso si tiene atributo o detalle el campo para
        //actualizar las metricas
        if((elemento.descripcion.replaceAll(" ", "") != "" || elemento.detalle.replaceAll(" ", "") != "") && !elemento.detalle.startsWith("***")){
          resultado_info_tecnica_distinct[camposUnicos[llave]].campos_totales += 1;
          resultado_info_tecnica_distinct[camposUnicos[llave]].campos_avanzados += 1;
          resultado_info_tecnica_distinct[camposUnicos[llave]].porcentaje_avance = (((resultado_info_tecnica_distinct[camposUnicos[llave]].campos_avanzados)/(resultado_info_tecnica_distinct[camposUnicos[llave]].campos_totales)) * 100).toFixed(0);
        } else {
          resultado_info_tecnica_distinct[camposUnicos[llave]].campos_totales += 1;
          resultado_info_tecnica_distinct[camposUnicos[llave]].porcentaje_avance = (((resultado_info_tecnica_distinct[camposUnicos[llave]].campos_avanzados)/(resultado_info_tecnica_distinct[camposUnicos[llave]].campos_totales)) * 100).toFixed(0);
        }
      }
    });
  }
  window.campos=resultados
  window.camposdistinct=resultado_info_tecnica_distinct
  return resultado_info_tecnica_distinct
}

//funcion para segmentar datatable de buscador de campos
function segmentarTablaCampos(tabla_config = 'campos', servidor = window.servidor, base = window.base, esquema = window.esquema, tabla = window.tabla, recoger_filtro = true, clase = '',segmentar=false){
  //La lista de datos es la info tecnica
  let list=window.info_tecnica
  //Reviso si "ischecked", o sea, si estamos en vista tablas
  let ischecked=$("#switchS3").is(':checked')
  //En caso tenga filtros hasta nivel esquema y estemos en vista tabla, muestro ojo de "Ver todas las tablas, caso contrario, no"
  if (base.replaceAll(" ", "")!= "" && esquema.replaceAll(" ", "")== "" && ischecked === true){$("#ver_tablas").css("display","block")}else{$("#ver_tablas").css("display","none")}
  $("#ownertitle").css("display","none")
  $("#ownertext").css("visibility","hidden")
  
  //cuando segmente el filtro se cambia a campos
  //En caso la flecha esté abierta, no ejecuto nada
  if (clase == 'rotate-arrow-icon'){
    return false
  }
  $("#segmentar-tabla-btn").text(servidor);
  if (servidor == 'TODOS') {
    servidor = '';
    document.getElementById("segmentar-tabla-btn").classList.remove("activo");
  }
  else {
    if(!document.getElementById("segmentar-tabla-btn").classList.contains("activo")){
      document.getElementById("segmentar-tabla-btn").classList.add("activo");
    }
  }
  window.servidor = servidor;
  window.base = base;
  window.esquema = esquema;
  window.tabla = tabla;
  $('[data-toggle="tooltip"]').tooltip();
  //Creo la variable donde guardaré el dataset respuesta
  let resultados;
  let texto = document.getElementById("dropdown-buscador").innerText.replace(" ","");
  //Si no ha escrito nada no busco porque sería muy pesado, pero en caso no haya escrito y haya seleccionado una tabla o esquema, si escribo
  if (
      ((window.campo.replaceAll(' ','') != '') || (window.tablab !== undefined) || (window.atributob!== undefined)) || 
      (((window.campo.replaceAll(' ','') == '') || (window.tablab !== undefined) || (window.atributob !== undefined)) && ((window.tabla.replaceAll(' ','') != '') || (tabla_config == 'base')))) {
        //Si tengo una tabla seleccionada nunca recojo el arbol, además ejecuto los resultados con tabla exacta
        if (tabla.replaceAll(' ', '') !=  ''){ 
          recoger_filtro = false
          if(texto=="Tabla"){
            resultados = buscarCampo(search_value = window.tablab, list , servidor, base = window.base, esquema = window.esquema, tabla = window.tabla, unique = false, search_value_exact= false, tabla_exac = true);
          }else if(texto="Atributo"){
            resultados = buscarCampo(search_value = window.atributob, list , servidor, base = window.base, esquema = window.esquema, tabla = window.tabla, unique = false, search_value_exact= false, tabla_exac = true);
          }else{
            resultados = buscarCampo(search_value = window.campo, list, servidor, base = window.base, esquema = window.esquema, tabla = window.tabla, unique = false, search_value_exact= false, tabla_exac = true);
          }
          //registro visita tabla
          registrar_visita("Consulta de Tablas",tabla);
          if(resultados.length>0){
            escribirDT(resultados[0]["llave_tabla"])
          }
        } else {
          if(texto=="Campo"){
            resultados = buscarCampo(search_value = window.campo, list , servidor, base = window.base, esquema = window.esquema, tabla = window.tabla, unique = false);
          }else if(texto=="Atributo"){
            resultados = buscarCampo(search_value = window.atributob, list , servidor, base = window.base, esquema = window.esquema, tabla = window.tabla, unique = false);
          }else{
            resultados = buscarCampo(search_value = window.tablab, list , servidor, base = window.base, esquema = window.esquema, tabla = window.tabla, unique = false);
          }
        }
        
        //setear database con distinct cuando se segmenta la tabla
        let resultado_info_tecnica_distinct=arrayCamposDistinct(resultados)
        if(ischecked){
          setDataTableBuscadorCampos(resultado_info_tecnica_distinct);
        }else{
          setDataTableBuscadorCampos(resultados);
        }
        
        //Muestro el tacho
        if (!$("#campos-buscar").is(":visible")) {$("#campos-buscar").toggle();
      }
      //Si solo hice cambio de filtro en el servidor, escribo en el arbol
    } else if (((window.campo.replaceAll(' ','') == '') || (window.tablab===undefined)  || (window.atributob===undefined)) && (window.base.replaceAll(' ','') == '')) {
    //No cargo resultados
    setDataTableBuscadorCampos([]);
    //reinicio la data
    window.campos=[]
    window.camposdistinct=[]
    //Defino resultados solo con el servidor para que se cargue el arbol
    if(texto=="Campo"){
      resultados = buscarCampo(search_value = window.campo, list , servidor, base, esquema, tabla, unique = false);

    }else if(texto=="Atributo"){
      resultados = buscarCampo(search_value = window.atributob, list , servidor, base, esquema, tabla, unique = false);

    }else{
      resultados = buscarCampo(search_value = window.tablab, list , servidor, base, esquema, tabla, unique = false);

    }

    //Actualizo el arbol
    if(servidor==""){
      document.getElementById("arbol_campos").innerHTML = cargar_arbol(resultados);
    }
    if(segmentar===true){
      document.getElementById("arbol_campos").innerHTML = cargar_arbol(resultados);

    }

    //En caso de que el servidor no sea vacío, pongo el tacho de borrar filtro
    if (window.servidor.replaceAll(' ', '') != '') {
      //Muestro el tacho
      if (!$("#campos-buscar").is(":visible")) {$("#campos-buscar").toggle();}
    }

  } 
  //agregado
  if(segmentar===true){
    document.getElementById("arbol_campos").innerHTML = cargar_arbol(resultados);

  }
  if($("#campos").hasClass("dataTable")){
    revisar_y_pintar();
 
  }
  //fin
}


//funcion para estilizar y agregar el segmentador en el datatable Catalogo de Referencias
function styleCatalogo(tabla_editar, elemento, plataformas, etiqueta){
  let opciones = '';
  $.each(plataformas, function(index,item){
    opciones += '<a class="dropdown-item" onclick="segmentarTabla(\''+tabla_editar+'\',\''+item+'\')">'+ item +'</a>';
  });
  let segmentador = '<div class="btn-group float-md-right mr-1 mb-1">\
                      <button class="btn btn-segmentar btn-xs dropdown-toggle" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" id="segmentar-tabla-btn">\
                        Segmentar Por '+etiqueta+'\
                      </button>\
                      <div class="dropdown-menu"  x-placement="bottom-start" style="position: absolute; will-change: transform; top: 0px; left: 0px; transform: translate3d(0px, 26px, 0px);margin-right:75px">\
                        '+ opciones +'\
                        <a class="dropdown-item" onclick="segmentarTabla(\''+tabla_editar+'\',\'Todas\')">Todas</a>\
                      </div>\
                     </div>'
  $(elemento).append(segmentador);
  $(elemento + " label input").attr("placeholder","Buscar...") 
}
/*
function mostrarlapices(){
  let lapices =document.getElementsByClassName("icontable")
  for(let x=0;x<lapices.length;x++){
    lapices[x].style.display="inline"
  }
}*/


function mostrarBuscadorOwners(){
  //mostrarmodal
  if(!$("#bOwner").hasClass("dataTable")){
    
    let detalleTable = $('#bOwner').DataTable({
      data: null,
      colResize: {
        isEnabled: true,
        hasBoundCheck: false
      },
      columnDefs: [
        { targets: [0,1,4,6], width: "10%" },
        { targets: [2,3,5], width: "5%" },
        {  targets: 0,
          render: function (data, type, row, meta) {
            if(data!==undefined && data!=null ){
              return '<icon class="simple-icon-pencil " type="" id="dropdownMenuButton"\
                data-toggle="dropdown" aria-expanded="false">\
                '+
              '</icon>'+data+
              '<ul class="dropdown-menu" aria-labelledby="dropdownMenuButton">\
                <li>\
                  <a class="dropdown-item editarDO"  href="#">\
                  </a>\
                  <ul class="dropdown-menu dropdown-submenu">\
                    <li>\
                      <a class="dropdown-item do" onclick="mostrarOpcionesDO(1,\''+row.tabla+'\',\''+row.data_owner+'\',\''+row.servidor+'\',\''+row.base+'\',\''+row.esquema+'\''+')" href="#"></a>\
                    </li>\
                    <li>\
                      <a class="dropdown-item ds" onclick="mostrarOpcionesDO(4,\''+row.tabla+'\',\''+row.data_steward+'\',\''+row.servidor+'\',\''+row.base+'\',\''+row.esquema+'\''+')" href="#"></a>\
                    </li>\
                  </ul>\
                  \
                  <li>\
                  <a class="dropdown-item eliminarDO" href="#">\
                  </a>\
                  <ul class="dropdown-menu dropdown-submenu">\
                    <li>\
                      <a class="dropdown-item edo" onclick="mostrarOpcionesDO(2,\''+row.tabla+'\',\''+row.data_owner+'\',\''+row.servidor+'\',\''+row.base+'\',\''+row.esquema+'\''+')" href="#"></a>\
                    </li>\
                    <li>\
                      <a class="dropdown-item eds" onclick="mostrarOpcionesDO(3,\''+row.tabla+'\',\''+row.data_steward+'\',\''+row.servidor+'\',\''+row.base+'\',\''+row.esquema+'\''+')" href="#"></a>\
                    </li>\
                  </ul>\
                </li>\
                </li>\
              </ul>\
           '
      
            
            }
             }
       }
  
      ],

      columns: [
        { data: 'nombre_data_owner' },
        { data: 'nombre_data_steward' },
        { data: 'plataforma' },
        { data: 'servidor' },
        { data: 'base' },
        { data: 'esquema' },
        { data: 'tabla' },
      ],
      paging: true,
      lengthChange: true,
      info: true,
      scrollX: true,
      //dom: 'fBtlip',
      dom: "Bfrt<'row d-flex justify-content-center align-items-center'<'col-md-3 'i><' col-md-5'p><'col-md-3 mt-3'l>>",
      searching: false,
      buttons: [
        {
          extend: 'excel',
          text: '<i class='+"iconsminds-download"+'></i>',
      }
      ],
      language:{
        "decimal":        "",
        "emptyTable":     "No hay datos disponibles en la tabla",
        "info":           "_TOTAL_ resultados", //"Mostrando _START_ a _END_ de _TOTAL_ registros",
        "infoEmpty":      "Mostrando 0 a 0 de 0 registros",
        "infoFiltered":   "", //"(filtrando de _MAX_ registros totales)"
        "infoPostFix":    "",
        "thousands":      ",",
        "lengthMenu":     "Mostrar _MENU_ registros",
        "loadingRecords": "Cargando...",
        "processing":     "",
        "search":         "",
        "zeroRecords":    "No se encontraron registros",
        "paginate": {
            "first":      "Primero",
            "last":       "Último",
            "next":       ">",
            "previous":   "<"
        },
        "aria": {
            "sortAscending":  ": activate to sort column ascending",
            "sortDescending": ": activate to sort column descending"
        }
    } ,"drawCallback": function( settings ) {
      if($("#bOwner").hasClass("dataTable")){
        changeoptionsnames2();
        changeoptionsnames();
        changeoptionsnames3();
      }
  },
    });
    //detalleTable.draw();
    
  }
 // $("#bOwner").css("height","250px");
  $("#buscadorowners").modal("show")
  
}


function buscarDO(){
  document.querySelector("#buscadorDO").addEventListener("click",function(){

    if($("#dataownerselect2").val()!=null){
      let categoria =document.getElementById("dropdown-reporte").innerText.toLocaleLowerCase().replace(" ","")
      let codigo=$("#dataownerselect2").val().replace(" ","")
      let nombre=$("#dataownerselect2").select2('data')[0]['text']
      let data = []
      let conjunto=window.tablas_oficiales
      let valor=''
      if(categoria=="dataowner"){
        valor="data_owner"
        for (const [key, value] of Object.entries(conjunto)) {
         
          if(value[valor].replace(" ","")!=="" && value[valor]==codigo){ 
            data.push(value)
         }       
        }     
      }else{
        valor="data_steward"
        for (const [key, value] of Object.entries(conjunto)) {
        
          if(value[valor].replace(" ","")!=="" && value[valor]==codigo){ 
            data.push(value)
          }   
        }   
      }
      window.camposDO=data
      redrawDataTable("bOwner",data)
    }
  })
}


function buscadortodos(nombresDO){
  document.querySelector("#todosowner").addEventListener("click",function(){
    $('#dataownerselect2').val(null).trigger('change');
    let data = []
    let conjunto=window.tablas_oficiales
    let categoria =document.getElementById("dropdown-reporte").innerText.toLocaleLowerCase().replace(" ","")
    if(categoria=="dataowner"){
      for (const [key, value] of Object.entries(conjunto)) {
       
        if(value["data_owner"].replace(" ","")!==""){
          data.push(value)
        }     
      }
    }else{
      for (const [key, value] of Object.entries(conjunto)) {
      
        if(value["data_steward"].replace(" ","")!==""){
          data.push(value)
        } 
      }
    }
  
    window.camposDO=data
    redrawDataTable("bOwner",data)
  })
}


//función para inicializar estilos y metodos en el reporte de data owners
function initReporte(){

  
  /*prueba para reportes de data owners
  if($("#bOwner").hasClass("dataTable")){
    let elementos = document.getElementsByClassName("iconmostrar")
    for(let x=0;x<elementos.length;x++){
      elementos[x].addEventListener("mouseover",function(e){
      })
    }
   
  }*/
  //reporte data owners
  document.querySelector("#dropdown-reporte").addEventListener("mouseenter",function(e){
    document.querySelector("#dropdown-reporte").style.background="#D2006E"
    document.querySelector("#dropdown-reporte").style.color="white"


  })
  document.querySelector("#dropdown-reporte").addEventListener("mouseout",function(e){
    document.querySelector("#dropdown-reporte").style.backgroundColor="white"
    document.querySelector("#dropdown-reporte").style.color="gray"
  })
//selecciono otra opcion owner-stewar
  document.querySelector("#opcionreporte").addEventListener("click",function(e){
    let textoactual= document.getElementById("dropdown-reporte").innerText.toLocaleLowerCase().replace(" ","")
    if(textoactual=="dataowner"){
      document.getElementById("dropdown-reporte").innerText="Data Steward"
      document.querySelector("#opcionreporte").innerText="Data Owner"
    }else{
      document.getElementById("dropdown-reporte").innerText="Data Owner"
      document.querySelector("#opcionreporte").innerText="Data Steward"
    }
    //limpio tabla y select 
    let DataTable = $("#bOwner").DataTable();
    DataTable.clear().draw();  
    $('#dataownerselect2').val(null).trigger('change');


  })


}


//funcion para estilizar y agregar el segmentador en el datatable Catalogo de Referencias
function styleCampos(tabla_editar, elemento, servidores, etiqueta){
  let opciones = '';
  $.each([...servidores], function(index,item){
    opciones += '<a class="dropdown-item" onclick="segmentarTablaCampos(tabla_config=\''+tabla_editar+'\',servidor=\''+item+'\', base = \'\', esquema = \'\', tabla = \'\',false,\'\',segmentar=true)">'+ item +'</a>';
  });
  let segmentador = '<div class="btn-group float-md-right mr-1 mb-1">\
  <div\
  class="custom-switch pr-2 custom-switch-primary-inverse custom-switch-small" data-toggle="tooltip" data-placement="bottom" data-original-title="Agrupar Nivel Tabla">\
  <input class="custom-switch-input" id="switchS3" type="checkbox"\
      >\
  <label class="custom-switch-btn" for="switchS3"></label>\
</div>\
  <i id="ver_tablas" class="simple-icon-eye pr-2" onclick="segmentarTablaCampos(tabla_config = \'base\')" style="cursor:pointer;font-size: 23px;" data-placement="bottom" data-toggle="tooltip" data-placement="bottom" data-original-title="Ver todas las tablas de la base"></i>\
  <i class="simple-icon-people pr-2 " onclick="mostrarBuscadorOwners()" style="cursor:pointer;font-size: 20px;" data-toggle="tooltip" data-placement="bottom" data-original-title="Ver Data Owners"></i>\
  <i id="btncampos" class="simple-icon-organization pr-3 float-right" onclick="mostrarJerarquia()" style="font-size: 20px;cursor: pointer;"></i>\
  <div> <button class="btn btn-segmentar btn-xs dropdown-toggle" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" id="segmentar-tabla-btn" data-display="static">\
                        Segmentar Por '+etiqueta+'\
                      </button>\
                      <div class="dropdown-menu" x-placement="bottom-start" style="position: absolute; will-change: transform; top: 100%; left: 0px; transform: translate3d(114px, 0px, 0px)!important;">\
                        '+ opciones +'\
                        <a class="dropdown-item" onclick="segmentarTablaCampos(tabla_config=\''+tabla_editar+'\',servidor=\'TODOS\', base = \'\', esquema = \'\', tabla = \'\')">TODOS</a>\
                      </div></div>\
                     </div>'
  $(elemento).append(segmentador);
  $(elemento + " label input").attr("placeholder","Buscar...") 
  $('[data-toggle="tooltip"]').tooltip()
}


// Mostrar opciones reporte data owners
function mostrarOpcionesDO(id,tabla,dataowner,servidor,base,esquema){
  let cod;
  if(dataowner!=""){
    cod=parseInt(dataowner)
  }
  let nombredata= (window.diccionarioDT)[cod]
  if(id==1 || id==4){
    $('#buscadorowners').modal('hide');
    setTimeout(() => {
      
      let actual=document.getElementById("dropdown-buscador").innerText
      //segmentar filtros 
      document.getElementById("dropdown-buscador").innerText="Tabla"
      
      let opcion = document.getElementById("opcionfiltro").innerText
      let opcion2 = document.getElementById("opcionfiltro2").innerText

      if(opcion=="Tabla"){
        document.getElementById("opcionfiltro").innerText=actual
      }else if (opcion2=="Tabla"){
        document.getElementById("opcionfiltro2").innerText=actual
      }
     
      
      document.getElementById("campos-search").value=tabla
      //redrawDataTableBuscadorCampos("campos",resultados)
      $("#switchS3").prop("checked", true)
      window.tablab=""
      segmentarTablaCampos(tabla_config = 'campos', servidor, base , esquema , tabla,recoger_filtro=true,'',segmentar=true);
      if(id==4){
        mostrarOpcionesCampo(4,dataowner)

      }else{
        mostrarOpcionesCampo(2,dataowner)
       
      }
    }, 200);

    
  }else{
    if(!dataowner.replace(" ","")==""){
       //eliminar data owner de esa tabla
    let borrar=""
    let nombretabla=""
    if(id=="2"){
      document.getElementById("detalleDelete").innerHTML="Eliminar Data Owner"
      borrar="data_owner"
      nombretabla="nombre_data_owner"
    }else if(id=="3"){
      document.getElementById("detalleDelete").innerHTML="Eliminar Data Steward"
      borrar="data_steward"
      nombretabla="nombre_data_steward"
    }
    
    document.getElementById("modalquestion").innerHTML="¿ Desea desasignar a "+mayusc_each_word(nombredata)+" de la tabla "+mayusc_each_word(tabla)+" ?";
    $("#modalDelete").modal("show")
    //background-color: rgba(0, 0, 0, 0.4);
    document.getElementById("modalDelete").style.backgroundColor="rgba(0, 0, 0, 0.4)"
  
    let llave=''
    document.querySelector("#btnDelete").onclick = function(){

        let actualizar=true
      
      //ELIMINAR DE WINDOW.TABLAS_OFICIALES
      for (const [key, value] of Object.entries(window.tablas_oficiales)) {
         
        if(((value["tabla"]==tabla) && (value[borrar]==dataowner) && (value["servidor"]==servidor) && (value["base"]==base) && (value["esquema"]==esquema))){ 
          llave=value["llave_tabla"]
          //verificar si debo actualizarlo o eliminarlo en window.tablas_oficiales
              if(borrar=="data_owner"){
             
                if(((value["data_steward"]).replace(" ","")=="") && ((value["descripcion_dominio"])==" ")){
                  
                  actualizar=false
                }
              }else{
                if(((value["data_owner"].replace(" ",""))=="") && ((value["descripcion_dominio"])==" ")){
                  actualizar=false
                }
              }
          //DELETE
          value[nombretabla]=" "
          value[borrar]=" "
          
       }       
      } 
      
      if($("#dataownerselect2").val()!==null){
        document.getElementById('buscadorDO').click();
      }else{
        document.getElementById('todosowner').click();
      }
  
       // redrawDataTable("bOwner",window.camposDO)
        
        //cambios window.campos reescribo la tabla

        if($("#switchS3").is(':checked')){
          redrawDataTableBuscadorCampos("campos",window.camposdistinct)
        }else{
          redrawDataTableBuscadorCampos("campos",window.campos)
        }
        
      


        if(actualizar){
          $().SPServices.SPUpdateMultipleListItems({
            async: true,
            listName: "Z_TABLAS_OFICIALES",
            batchCmd: "Update",
            CAMLQuery: '<Query><Where>\
              <And>\
              <Eq><FieldRef Name="txt_desc_tabla"/><Value Type="Text">'+tabla+'</Value></Eq>\
                <And>\
                <Eq><FieldRef Name="txt_servidor"/><Value Type="Text">'+servidor+'</Value></Eq>\
                  <And>\
                    <Eq><FieldRef Name="txt_host"/><Value Type="Text">'+base+'</Value></Eq>\
                    <Eq><FieldRef Name="txt_fuente_esquema"/><Value Type="Text">'+esquema+'</Value></Eq>\
                  </And>\
                </And>\
              </And>\
            </Where></Query>',
            valuepairs: [
              [borrar, " "],
              [nombretabla, " "]
          ],
            completefunc: function (xData, Status) {
              
            } //completefunc
          });
        }else{
          $().SPServices.SPUpdateMultipleListItems({
            async: true,
            listName: "Z_TABLAS_OFICIALES",
            batchCmd: "Delete",
            CAMLQuery: '<Query><Where>\
            <And>\
            <Eq><FieldRef Name="txt_desc_tabla"/><Value Type="Text">'+tabla+'</Value></Eq>\
            <And>\
            <Eq><FieldRef Name="txt_servidor"/><Value Type="Text">'+servidor+'</Value></Eq>\
            <And>\
            <Eq><FieldRef Name="txt_host"/><Value Type="Text">'+base+'</Value></Eq>\
            <Eq><FieldRef Name="txt_fuente_esquema"/><Value Type="Text">'+esquema+'</Value></Eq>\
            </And>\
            </And>\
            </And>\
            </Where></Query>',
            completefunc: function (xData, Status) {
            } //completefunc
          });
        }
    
    }
    }else{
      //howNotification("top", "center", "primary");
      document.getElementById("alerta").style.display="block"
      setTimeout(() => {
        document.getElementById("alerta").style.display="none"
      }, 5000);
    }
   
  }
}

//function que eliminar data owner de la tabla

function showNotification(placementFrom, placementAlign, type) {
  $.notify(
    {
      title: "Alerta",
      message: "El campo se encuentra vacío!",
      target: "_blank"
    },
    {
      element: "body",
      position: null,
      type: type,
      allow_dismiss: true,
      newest_on_top: false,
      showProgressbar: false,
      placement: {
        from: placementFrom,
        align: placementAlign
      },
      offset: 20,
      spacing: 10,
      z_index: 1031,
      delay: 4000,
      timer: 2000,
      url_target: "_blank",
      mouse_over: null,
      animate: {
        enter: "animated fadeInDown",
        exit: "animated fadeOutUp"
      },
      onShow: null,
      onShown: null,
      onClose: null,
      onClosed: null,
      icon_type: "class",
      template:
        '<div data-notify="container" class="col-11 col-sm-3 alert  alert-{0} " role="alert">' +
        '<button type="button" class="close" data-notify="dismiss">×</button>' +
        '<span data-notify="icon"></span> ' +
        '<span data-notify="title">{1}</span> ' +
        '<span data-notify="message">{2}</span>' +
        '<div class="progress" data-notify="progressbar">' +
        '<div class="progress-bar progress-bar-{0}" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width: 0%;"></div>' +
        "</div>" +
        '<a href="{3}" target="{4}" data-notify="url"></a>' +
        "</div>"
    }
  );
}


//mostrar opciones campo
function mostrarOpcionesCampo(id,dataowner,codigo,tabla,servidor,esquema,base,llave,campo, definicion,etiqueta){
  if(definicion && definicion.startsWith("***") || codigo && codigo.startsWith("***")){
    if(definicion) definicion = definicion.slice(3)
    if(codigo) codigo = codigo.slice(3)
    let elemento = window.campos.find(e=>e.llave_unica === llave)
    elemento && ((elemento.detalle.startsWith("***")  || elemento.codigo.startsWith("***")  ) && id === 10 ) && showNotification("top", "center", "info", "Se ha realizado el autocompletado con la información recomendada", 2000);
  } 
   
  if(id==1){ //En caso el id sea 1 mostramos las opciones de editar definicion del campo
    $("#detalleModalLabel1").text("Editar definición");
    $("#definicionCampo").text("Definición del campo "+campo+":");
    $("#detalleCampo").val(definicion);
  }else if(id==2){ //En caso el id sea 2, mostramos opcion de editar data owner de la tabla
    $("#detalleModalLabel2").text("Editar data owner");
    document.querySelector("#mensajeowner").innerHTML="No existe Data Owner asignado a la tabla"
    if(dataowner!== undefined && dataowner !== " "){
      let nombre=(window.diccionarioDT)[dataowner].toLowerCase().split(" ")
      let nuevo=''
      nombre.forEach(element => {
        nuevo+=capitalizarPrimeraLetra(element)+" "
      });
      document.querySelector("#mensajeowner").innerHTML="Data Owner actual: "+nuevo
    }
  }else if(id==3){ //En caso el id sea 3, muestro la opción de cambiar atributo del campo
    //si existe algún código asignado, cambio el nuevo valor y muestro en modal
    if(codigo!=" "){
      $('#atributoselect').val(codigo).trigger('change')
    }
    $("#detalleModalLabel3").text("Editar atributo");
  }else if (id==4){ //En caso el id sea 4, mostramos opcion de editar data steward de la tabla
    $("#detalleModalLabel4").text("Editar data steward");
    // var dataowner se refiere a data steward
    document.querySelector("#mensajesteward").innerHTML="No existe Data Steward asignado a la tabla"
    if(dataowner!== undefined && dataowner != " "){
      let nombre=(window.diccionarioDT)[dataowner].toLowerCase().split(" ")
      let nuevo=''
      nombre.forEach(element => {
        nuevo+=capitalizarPrimeraLetra(element)+" "
      });
      document.querySelector("#mensajesteward").innerHTML="Data Steward actual: "+nuevo
    }
  }else if(id==5){ //En caso el id sea 5, mostramos opcion de editar la clasificación de la tabla

    let tabla_autorizacion = getAutorizaciones();
    window.tabla_autorizacion=tabla_autorizacion;

    $("#detalleModalLabel5").text("Clasificación de Tablas");
    document.querySelector("#etiquetatabla").innerHTML="Etiquetar tabla <strong>"+tabla+"</strong>";
    document.querySelector("#mensajedominio").innerHTML="No existen dominios asignados a esta tabla";
    if(window.tablas_oficiales[llave]!==undefined){
      let dominiosoriginales=window.tablas_oficiales[llave]["descripcion_dominio"]
      if(dominiosoriginales != " " && dominiosoriginales!=""){
        if(dominiosoriginales.includes(";")){
          let lista= dominiosoriginales.split("; ")
          $('#dominioselect').val(lista).trigger('change')
          document.querySelector("#mensajedominio").innerHTML=""
        }else{
          document.querySelector("#mensajedominio").innerHTML=""
          $('#dominioselect').val(dominiosoriginales).trigger('change')
        }
      }
    }

    let select = $('#clasificacionselect');

    select.on('select2:select', function(e) {
      var data = e.params.data;
      let etiqueta=data.id
      if(etiqueta=="OFICIAL"){
        document.querySelector("#divClasificacion").style.display="block"
      }else{
        document.querySelector("#divClasificacion").style.display="none"
      }
    });
  }else if(id==7){ //El id 7 sirve para eliminar dominio desde la ficha de tablas
    //eliminar dominio desde Ficha tablas
    let identificador=dataowner
    let dominios=codigo
    let tablaoriginal=tabla
    document.querySelector("#modalquestion").innerHTML='¿Desea eliminar el dominio <strong>'+identificador.toUpperCase()+"</strong> de la tabla <strong>"+tablaoriginal+"</strong> ?"
    if(dominios!==" " && dominios.includes("; ")){
      document.querySelector("#alldominios").innerHTML="Eliminar todos los dominios relacionados a la tabla (" +dominios.replaceAll("; ",", ") + ")"
    }else if(dominios!==" " && !(dominios.includes("; ")) ){
      document.querySelector("#alldominios").innerHTML="Eliminar todos los dominios relacionados a la tabla (" +dominios + ")"
    }
    //nombre del dominio-nombre de la tabla-nombre de todos los dominios
  } else if(id==8){
    //Muestro el modal con la caja de texto para que ingrese la descripción de la tabla
    $("#detalleModalLabel8").text("Editar definición de tabla");
    $("#definicionTabla").text("Definición de la tabla "+tabla+":");
    $("#detalleTabla").val(definicion.trim() + "");
  }
    //Modal etiquetas - mostrarOpcionesCampo()
  else if(id==9){
    // Muestro el modal con la caja de texto para ingresar las etiquetas
    $("#detalleModalLabel9").text("Administración de Etiquetas");
    $("#etiquetasTitulo").text("Seleccione una o más etiquetas que describan la tabla:");
    $("#etiquetasCampo").val(etiqueta.split("|")).trigger('change');
    // Muestro el modal
    $("#detalleModal9").modal("show");
  }else if(id === 10){
    $("#modalDocumentacionCampoLabel").text("Documentar campo");
    // Autocompletado de inputs
    $('#atributoselect').val(codigo.trim()).trigger('change')
    $("#detalleCampo").val(definicion);

    $("#modalDocumentacionCampo").modal("show");

  }
  
  if(id !== 10){
    //Muestro el modal
    let detallemodal= "#detalleModal"+String(id)
    $(detallemodal).modal("show"); //mostrar ventana modal
  }
    

}





//Funcion para el detalle presentado en una ventana modal de bootstrap
function setDetalle(vista,codigo){
  var catalogo = searchCatalogo(vista,codigo);

    if(!$("#detalletabla").hasClass("dataTable")){
        var detalle = getDetalleCatalogo(codigo);

        let detalleTable = $('#detalletabla').DataTable({
          data: detalle,
          columnDefs: [
            { targets: 2, width: "10px" },
            { targets: 1, width: "100px" },
            { targets: 0, width: "10px" }
    
          ],
          columns: [
            { data: 'codigoDetalle' },
            { data: 'descripcionDetalle' },
            { data: 'codigosuperior' },
          ],
          "rowCallback": function( row, data,displayNum,displayIndex ) {
             // tooltip para el detalle de campos
             if(data.descripcionDetalle != " "){
              let index_children=1
             
              const detalle = (row.children)[index_children]
              $(detalle).attr("data-toggle","tooltip");
              $(detalle).attr("data-placement","bottom");
               $(detalle).tooltip({
                   html: true,
                   boundary: 'window',
                   title: String(data.descripcionDetalle),
                   template: `
                       <div class="custom-tooltip tooltip tooltip2">
                         <div class="arrow"></div>    
                         <div class="tooltip-inner inner"></div>
                       </div>
                   `
                 });
            }
            
        },
        paging: true,
        lengthChange: true,
        info: true,
        scrollX: true,
        dom: 'fBtlip',
        //dom: "Bfrt<'row d-flex justify-content-center align-items-center'<'col-md-3 'i><' col-md-5'p><'col-md-3 mt-3'l>>",
  searching:true,
        buttons: [
          {
            extend: 'excel',
            text: 'Exportar a Excel',
            customize: function ( xlsx ) {
              customizeExcel(xlsx,"Detalle de Catalogo de " + mayusc_each_word(catalogo.descripcion),catalogo.detalle)
            }
        }
        ],
        language:{
          "decimal":        "",
          "emptyTable":     "No hay datos disponibles en la tabla",
          "info":           "_TOTAL_ resultados", //"Mostrando _START_ a _END_ de _TOTAL_ registros",
          "infoEmpty":      "Mostrando 0 a 0 de 0 registros",
          "infoFiltered":   "", //"(filtrando de _MAX_ registros totales)"
          "infoPostFix":    "",
          "thousands":      ",",
          "lengthMenu":     "Mostrar _MENU_ registros",
          "loadingRecords": "Cargando...",
          "processing":     "",
          "search":         "",
          "zeroRecords":    "No se encontraron registros",
          "paginate": {
              "first":      "Primero",
              "last":       "Último",
              "next":       ">",
              "previous":   "<"
          },
          "aria": {
              "sortAscending":  ": activate to sort column ascending",
              "sortDescending": ": activate to sort column descending"
          }
        }
      });
        detalleTable.draw();
    }else{//en caso de ya estar inicializada la tabla se actualizan las filas con la data necesitada
      var detalle = getDetalleCatalogo(codigo);
      redrawDataTable("detalletabla",detalle);
    }
        $("#detalleModalLabel").text("Detalle de Catalogo de " + mayusc_each_word(catalogo.descripcion));
        $("#descModal").text(catalogo.detalle);
        $("#detalleModal").modal("show"); //mostrar ventana modal
        //document.querySelector("#detalle_wrapper > div.dt-buttons.btn-group > button").innerHTML = "Descargar como Excel <i class='iconsminds-download'></i>";
      }

//función para configurar el datatable de Catalogo de Referencias
function setDataTableCatalogo(catalogo){

  $('#catalogo').DataTable({
    data: catalogo,
    "rowCallback": function( row, data ) { //callback function para identificar si el dato es personalizado y ejecutar código
      if ( data.tipo == "P" ) {
        $(row).addClass("personalizada");
        
        $(row).attr("onclick","setDetalle('"+data.vista+"','"+ data.codigo +"')");
        for (const celda of row.children) {
          $(celda).attr("data-toggle","tooltip");
          $(celda).attr("data-placement","bottom");
          $(celda).attr("title","Click para ver detalle");
          $(celda).tooltip({
            html: true,
            title: 'Click para Ver más',
            template: `
                <div class="custom-tooltip tooltip">
                  <div class="arrow"></div>    
                  <div class="tooltip-inner"></div>
                </div>
            `
          });
        }
      }
      let listacolumns= [1,2,4,5,6]
      let nombres=[data.descripcion,data.detalle,data.servidor,data.ubicacion,data.observacion]
      for (let x =0;x<listacolumns.length;x++){
        const detalle = (row.children)[listacolumns[x]]
        
        $(detalle).attr("data-toggle","tooltip");
        $(detalle).attr("data-placement","bottom");
       
         $(detalle).tooltip({
             html: true,
             boundary: 'window',
             title: String(nombres[x]),
             template: `

                 <div class="custom-tooltip tooltip tooltip2">
                   <div class="arrow"></div>    
                   <div class="tooltip-inner inner"></div>
                 </div>
             `
           });
      }
      //copy to clipboard
      let script = data.script.replaceAll("'","@")

      $('td:eq(6)', row).html(  "<icon html='true'  data-toggle='popover' data-trigger='click' data-placement='left' data-content='<b>Código Copiado!</b>' onclick='copyToClipboard(\""+script+"\",\""+data.servidor+"\")' class='iconsminds-file-copy' style='cursor:pointer'  ></icon>"+' ' +data.observacion );
       
    }, 
    "drawCallback": function( settings ) {
      hidePopovers()
  },
    paging: true,
    colResize: {
      isEnabled: true,
      hasBoundCheck: false
    },
    
    lengthChange: true,
    info: true,
    scrollX: true,
   // scrollCollapse: true,
    scrollY: '250px',
    
    dom: 'fBtlip',
    autoWidth: true,
    columnDefs: [
      
      { targets: 7, width: "50px" },
      { targets: 6, width: "250px" },
      { targets: 2, width: "140px" },
      { targets: 0, width: "40px" },
      { targets: '_all', width: "100px" }
    ],
    buttons: [
      {
        extend: 'excel',
        text: 'Exportar a Excel',
        customize: function ( xlsx ) {
          customizeExcel(xlsx,'Catálogo de Referencias',"")
        }
    }
    ],
    columns: [
        { data: 'codigo' },
        { data: 'descripcion' },
        { data: 'detalle' },
        { data: 'plataforma' },
        { data: 'servidor' },
        { data: 'ubicacion' },
        { data: 'observacion' },
        { data: 'responsable' },
        { data: 'validado' },
       
    ],
    language:{
      "decimal":        "",
      "emptyTable":     "No hay datos disponibles en la tabla",
      "info":           "_TOTAL_ resultados", //"Mostrando _START_ a _END_ de _TOTAL_ registros",
      "infoEmpty":      "Mostrando 0 a 0 de 0 registros",
      "infoFiltered":   "", //"(filtrando de _MAX_ registros totales)"
      "infoPostFix":    "",
      "thousands":      ",",
      "lengthMenu":     "Mostrar _MENU_ registros",
      "loadingRecords": "Cargando...",
      "processing":     "",
      "search":         "",
      "zeroRecords":    "No se encontraron registros",
      "paginate": {
          "first":      "Primero",
          "last":       "Último",
          "next":       ">",
          "previous":   "<"
      },
      "aria": {
          "sortAscending":  ": activate to sort column ascending",
          "sortDescending": ": activate to sort column descending"
      }
  },
  "pageLength":25
});
$('#catalogo').on( 'draw.dt', function () {
  document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0;
} );
$("#catalogo").css("height","25px");
//$("#catalogo").addClass("overflow-auto");
document.querySelector("#catalogo_wrapper > div.dt-buttons.btn-group > button").innerHTML = "Descargar como Excel <i class='iconsminds-download'></i>";
$('[data-toggle="tooltip"]').tooltip();
}


// For todays date;
Date.prototype.today = function () { 
  return ((this.getDate() < 10)?"0":"") + this.getDate() +"/"+(((this.getMonth()+1) < 10)?"0":"") + (this.getMonth()+1) +"/"+ this.getFullYear();
}

function getCurrentDate(){

var newDate = new Date();
var datetime =  newDate.today() 
return datetime

}

function newCustomizeExcel(datatable, columnasExportar, grouped = false){
  let data = datatable.rows().data().toArray();
  

  const workbook = XLSX.utils.book_new();
  if(grouped){
    let hoja = {
      name : 'Hoja',
      data : []
    }
    hoja.data.push(["Banco de Guayaquil"])
    hoja.data.push(["Oficina de Gobierno de la Información"])
    hoja.data.push(["Explorador de Metadatos"])
    hoja.data.push(["Generado: "+getCurrentDate()])
    hoja.data.push([])

    const nombreColumnas = Object.values(columnasExportar);
    hoja.data.push(nombreColumnas)
    const keys = Object.keys(columnasExportar)
    data.forEach(elemento=>{
      let fila = keys.map(column => elemento[column])
      hoja.data.push(fila)
    })
    const nuevaHoja = XLSX.utils.aoa_to_sheet(hoja.data)
    for(let i = 0; i<4; i++){
      applyBoldToRow(nuevaHoja, i)
    }

    XLSX.utils.book_append_sheet(workbook,nuevaHoja, hoja.name)

  }else{
    let agrupados = data.reduce((acumulador, elemento) => {
      if(!acumulador[elemento.llave_tabla]){
        acumulador[elemento.llave_tabla] = [];
      }
      acumulador[elemento.llave_tabla].push(elemento);
      return acumulador
    },{})
    let contadorNombres = {}
    Object.entries(agrupados).forEach(([key, value]) => {
      let tabla = window.tablas_oficiales[key] ?? agrupados[key][0]
      let nombre = tabla?.tabla.slice(0,28)

      contadorNombres[nombre] = (contadorNombres[nombre] ?? 0) + 1;
      let nombreFinal =  contadorNombres[nombre] === 1? nombre : `${nombre}-${contadorNombres[nombre]-1}`
      let hoja = {
        name: nombreFinal,
        data:[]
      };
      let catalogoEtiquetas = getCatalogoOGASUITE("1") 
      let etiquetas = tabla?.etiquetas?.trim()?.split("|").map(numeroEtiqueta=> catalogoEtiquetas[numeroEtiqueta])?.join(",")
      let descripcion = tabla?.descripcion_tabla?.trim()?.replace(/&#\d+;/g, '')
      hoja.data.push(["Banco de Guayaquil"])
      hoja.data.push(["Oficina de Gobierno de la Información"])
      hoja.data.push(["Nombre Entidad:", tabla?.tabla, '' , '', "DataOwner:", tabla?.nombre_data_owner?.trim() || "SIN DATAOWNER"])
      hoja.data.push(["Etiquetas:", etiquetas || "SIN ETIQUETAS", '', '', "DataSteward:", tabla?.nombre_data_steward?.trim() || "SIN DATASTEWARD"])
      hoja.data.push(["Descripción:", descripcion || "SIN DESCRIPCION DE TABLA"])
      hoja.data.push(["Dominios asociados:", tabla?.descripcion_dominio ?? "SIN DOMINIOS"])
      hoja.data.push([])

      // Agregar nombres de columnas
      const nombreColumnas = Object.values(columnasExportar);
      hoja.data.push(nombreColumnas)
      const keys = Object.keys(columnasExportar)
      value.forEach(elemento=>{
        let fila = keys.map(column => elemento[column])
        hoja.data.push(fila)
      })
      const nuevaHoja = XLSX.utils.aoa_to_sheet(hoja.data)
      for(let i = 0; i<4; i++){
        applyBoldToRow(nuevaHoja, i)
      }

      XLSX.utils.book_append_sheet(workbook,nuevaHoja, hoja.name)
    })
  }
  XLSX.writeFile(workbook, 'Explorador de Metadatos.xlsx')
}





function applyBoldToRow(sheet, rowIndex) {
  const range = XLSX.utils.decode_range(sheet['!ref']);
  for (let col = range.s.c; col <= range.e.c; col++) {
      const cell = sheet[XLSX.utils.encode_cell({ r: rowIndex, c: col })];
      if (cell) {
          cell.s = {font: { bold: true } }; // Negrita
      }

  }
}

function customizeExcel(xlsx,titulo,descripcion){
  var sheet = xlsx.xl.worksheets['sheet1.xml'];
          $('c[r=A1] t', sheet).text( 'Banco de Guayaquil' );
          $('row:first c', sheet).attr( 's', '2' ); // first row is bold    
          var numrows = 4;
          if(descripcion!=""){
              numrows=5
        }
         
          var clR = $('row', sheet);
          
          //update Row
          $.each(clR.slice(1),function (index,element) {
           
              var attr = $(this).attr('r');
           
              var ind = parseInt(attr);
              ind = ind + numrows;
              $(this).attr("r",ind); 
          });
          $('row c ', sheet).slice(1).each(function () {
            var attr = $(this).attr('r');
            var pre = attr.substring(0, 1);
            var ind = parseInt(attr.substring(1, attr.length));
            ind = ind + numrows;
            $(this).attr("r", pre + ind);
        });
       
          function Addrow(index,data) {
              msg='<row r="'+index+'">'
              for(i=0;i<data.length;i++){
                  var key=data[i].key;
                  var value=data[i].value;
                  msg += '<c t="inlineStr" r="' + key + index + '">';
                  msg += '<is>';
                  msg +=  '<t >'+value+'</t>';
                  msg+=  '</is>';
                  msg+='</c>';
              }
              //msg += '</row>';
              return msg;
          }

        var r1 = Addrow(2, [{ key: 'A', value: 'Oficina de Gobierno de la Información' }]);
        var r2 = Addrow(3, [{ key: 'A', value: titulo }]);
        var r3 = Addrow(4, [ { key: 'A', value: "Generado: "+getCurrentDate() }]);

        if(descripcion!=""){
          var r4 = Addrow(5, [ { key: 'A', value: "Descripción: "+descripcion}]);
        }
       
        
        let todos= String(sheet.childNodes[0].childNodes[1].innerHTML).split("</row>")

       
        todos.splice(1,0,r1)
        todos.splice(2,0,r2)
        todos.splice(3,0,r3)
        if(descripcion!=""){
          todos.splice(4,0,r4)
        }
       
        let stringfinal=todos.join("</row>")
        sheet.childNodes[0].childNodes[1].innerHTML =stringfinal
     $('row:eq(1) c', sheet).attr( 's', '2' ); 
    }


function copyToClipboard(script,servidor){
  // Get the text inside the <p> tag
  script=script.replaceAll("@","'")
  let textogeneral= "/* Recuerda estar logoneado en "+servidor+" para ejecutar el comando */\n"+script+"\n/* Generado por OGA Suite */"
  //let textoMostrar='/* Recuerda estar logoneado en GYEINTENEGDB01 para ejecutar el comando */ \nselect top 10 * from '+base+'.'+esquema+'.'+tabla+'\n/* Generado por OGA Suite */'
  // Create a temporary textarea element to copy the text
  var tempTextArea = document.createElement('textarea');
  tempTextArea.value = textogeneral;
  document.body.appendChild(tempTextArea);
  
  // Select the text inside the textarea element
  tempTextArea.select();
  
  // Copy the text to the clipboard
  document.execCommand('copy');
  
  // Remove the temporary textarea element
  document.body.removeChild(tempTextArea);
  
}
//Funcion de carga para Catalogo_Referencias.aspx
function catalogoReferencias(){
  const catalogo = getCatalogo();
  let plataformas = [];
  $.each(catalogo, function(index,item){
    plataformas.push(item.plataforma);
  });
  plataformas = [... new Set(plataformas)];
  
  setDataTableCatalogo(catalogo);
 hidePopovers();
 
  styleCatalogo(tabla_editar = "#catalogo", elemento = "#catalogo_filter", plataformas = plataformas, etiqueta = 'Plataforma');
  registrar_visita("CATALOGO DE REFERENCIAS");
  $('#detalleModal').on('shown.bs.modal', function () {
    $($.fn.dataTable.tables(true)).DataTable().columns.adjust();
 });
}

function hidePopovers(){
  $('[data-toggle="popover"]').popover({
    html : true
 });
 
  $('[data-toggle="popover"]').popover().click(function () {
   
    setTimeout(function () {
        $('[data-toggle="popover"]').popover('hide');
    }, 2000);
});
}

//funcion de carga para DataIndex.aspx
function dataIndex(){
  registrar_visita("DATA INDEX");
  

}

function reloadframes(){

 
          var allFrames = document.getElementsByTagName("iframe");
        for (var i = 0; i < allFrames.length; i++)
        {
            var f = allFrames[i];
            f.src = f.src;
        }

  
}

//Funcion de carga para Diagrama_DI.aspx
function diagramaDI(){
  registrar_visita("DIAGRAMA DATA INDEX");
}

//Funcion de carga paraFuentesAprovisionamiento.aspx
function fuentes(){
  const fuentes = getFuentes();
  printFuentes(fuentes);
  autocompleteFuentes(document.getElementById("fuentes-search"),fuentes);
  registrar_visita("FUENTES DE APROVISIONAMIENTO");
}

//Funcion de carga para Origenes_datos.aspx
function servidores(){
    const [info_servidores, _] = getInfoServidores();
    printServidores(info_servidores);
    registrar_visita("ORIGENES DE DATOS");
}

//Funcion de carga para Tipos_campanias.aspx
function campañas(){
  //Obtengo los parámetros del link
  const id_dominio = getParams("id_dominio");
  const dominio = searchDominios("id_dominio",id_dominio);
  const tipo_campania = getParams("tipo_camp");
  //Creo una variable para el icono que tendrá
  let icono = ''
  //Pongo los links en las subpáginas
  fillBreadcrumbs(dominio.attr("ows_id_dominio"),dominio.attr("ows_descripcion_dominio"));
  //Pongo el nombre de dominio en la ficha
  let nombre_dominio = dominio.attr("ows_descripcion_dominio");
  if(tipo_campania){
    $("#subtitulo").html('<i class="simple-icon-arrow-left-circle m-1 regresar" onclick="history.back()"></i> Clasificación de Campañas > '+tipo_campania);
  }
  $("#nombre-dominio").text(nombre_dominio);
  //Obtengo el inventario de campañas
  const info_campañas = getInfoClasifiCampañas();
  //En caso tenga parametro de tipo de campaña, muestro a nivel de subtipo
  if (tipo_campania){
    //El icono será de archivos
    icono = 'iconsminds-files'
    //Agrupo las campañas a nivel de subtipo
    var grouped_info_campañas = Object.values(info_campañas.reduce((acc, current) => {
      if(current.descrip_clasificacion == tipo_campania){
        const key = current.subtipo;
        const existing = acc[key];
        if (existing) {
          existing.num_activos += current.num_activos;
          existing.num_terminados += current.num_terminados;
          existing.num_total += current.num_total;
        } else {
          acc[key] = {
            ...current,
            descrip_clasificacion: current.subtipo,
            parametro_busqueda: "tipo_camp="+current.descrip_clasificacion +"&subtipo_camp=" + current.subtipo,
            pagina: "Ficha_Inventario.aspx"
          }
        }
      }
      return acc;
    }, {}));
  } else {
    //El icono será de carpetas
    icono = 'iconsminds-folder'
    //Lo agrupo a nivel de clasificacion (y no subtipo)
    var grouped_info_campañas = Object.values(info_campañas.reduce((acc, current) => {
      const key = current.descrip_clasificacion;
      const existing = acc[key];
      if (existing) {
        existing.iniciativas += `|${current.iniciativas}`;
        existing.subtipo += `|${current.subtipo}`;
        existing.num_activos += current.num_activos;
        existing.num_terminados += current.num_terminados;
        existing.num_total += current.num_total;
        existing.activo = existing.activo === '1' || current.activo === '1' ? '1' : '0';
      } else {
        acc[key] = {
          ...current,
          subtipo: current.subtipo,
          iniciativas: current.iniciativas,
          activo: current.activo === '1' ? '1' : '0',
          parametro_busqueda: "tipo_camp="+current.descrip_clasificacion,
          pagina: "Tipos_campanias.aspx"
        };
      }
      return acc;
    }, {}));
  }
  //LLeno la página con la info del inventario de campañas
  printClasifiCampañas(grouped_info_campañas,id_dominio,nombre_dominio, icono);
  //Analizo si muestro modal por default
  const muestro_modal = getParams("modal");
  if (muestro_modal == '1') {
    let btn_form_nomenclaturas = document.getElementById("btn_formulario_Nomenclaturas_Campañas");
    btn_form_nomenclaturas.click();
  }
  //Registro la visita en el log
  registrar_visita("CLASIFICACIÓN DE CAMPAÑAS");
}

  
//Funcion para paginacion en Navegador_servidores
function printServidores(resultados){
    $('.pagination').pagination({
        dataSource: resultados,
        pageSize: 12,
        className: 'paginationjs-theme-bg',
        afterRender: function(){
          document.body.scrollTop = 0;
          document.documentElement.scrollTop = 0;
        },
        callback: function (data, pagination) {
            // template method of yourself
            let html = template_servidores(data);
            $("#servidores").html(html);
        }
    });
  }
  
//Funcion para paginacion en Tipos_campanias
function printClasifiCampañas(resultados, id_dominio, dominio, icono){
  $('.pagination').pagination({
      dataSource: resultados,
      pageSize: 8,
      className: 'paginationjs-theme-bg',
      afterRender: function(){
        document.body.scrollTop = 0;
        document.documentElement.scrollTop = 0;
      },
      callback: function (data, pagination) {
          // template method of yourself
          let html = template_tipos_campañas(data, id_dominio, dominio, icono);
          $("#tipos_campañas").html(html);
      }
  });
}


//Funcion para paginacion en Dominio_artefactos
function printFuentes(resultados){
  $('.pagination').pagination({
      dataSource: resultados,
      pageSize: 14,
      className: 'paginationjs-theme-bg',
      afterRender: function(){
        document.body.scrollTop = 0;
        document.documentElement.scrollTop = 0;
      },
      callback: function (data, pagination) {
          // template method of yourself
          let html = template_fuentes(data);
          $("#fuentes").html(html);
      }
  });
}

//Funcion de carga para Dominio_metadatos_linaje.aspx
async function metadatosLinaje(){
  const dominio = searchDominios("id_dominio",getParams("id_dominio"));
  fillBreadcrumbs(dominio.attr("ows_id_dominio"),dominio.attr("ows_descripcion_dominio"));
  $("#nombre-dominio").text(dominio.attr("ows_descripcion_dominio"));
  let atributos = getAtributosFrom(dominio.attr("ows_descripcion_dominio"));
  window.atributos = atributos;
  autocompleteMetadatosLinaje(document.getElementById("atributo-search"),atributos);
  let a = document.getElementById("lista-atributos");
  a.innerHTML = '';
  let atributos_ids = [];
  $.each(atributos, function(index,item){ //llenado inicial de lista de atributos
    atributos_ids.push(item.attr("ows_id_metad"));
    b = document.createElement("a");
    b.innerHTML = item.attr("ows_nombre_metad").replaceAll('<br>','');
    b.className = "mb-2";
    b.setAttribute("href","#catalogo");
    b.addEventListener("click", function(e) {
      $('a.font-weight-bold.color-theme-1').toggleClass('font-weight-bold color-theme-1');
        document.getElementById("atributo-search").value = this.innerHTML;
        window.atributo_actual = this.innerHTML;
        this.className+= " font-weight-bold color-theme-1";
        filtrarTabla();
      });
    a.appendChild(b);
  });
  const informacion_tecnica = await searchIT(atributos_ids);
  window.it = informacion_tecnica;
  setDataTableMetadatosLinaje(informacion_tecnica);
  $("#catalogo_wrapper").css("height","356px");
  $("#catalogo_wrapper").addClass("overflow-auto");
  registrar_visita("METADATOS Y LINAJE DE DOMINIO",dominio.attr("ows_descripcion_dominio"));
}

//Buscar atributos mediante regex
function buscarAtributo(search_value, list){
  if(search_value.includes("(")) search_value = search_value.replaceAll("(","\\(");
  if(search_value.includes(")")) search_value = search_value.replaceAll(")","\\)");
  let regex = new RegExp(search_value,"i");
  var results = list.filter(item => regex.test(item.attr("ows_nombre_metad")));
  return results;
}

//Obtener estadisticas de los servidores
function descriptivo_servidores(data_inf_tecnica_larga){

}

//Funcion para el llenado de la lista de atributos de Dominios_metadatos_linaje
function fillListaAtributos(){
  var a = document.getElementById("lista-atributos");
  a.innerHTML = '';
  $.each(window.atributos,function(index,item){
    b = document.createElement("a");
    b.innerHTML = item.attr("ows_nombre_metad").replaceAll('<br>','');
    b.className = window.atributo_actual == b.innerHTML ? "mb-2 font-weight-bold color-theme-1" : "mb-2";
    b.setAttribute("href","#catalogo");
    b.addEventListener("click", function(e) {
      $('a.font-weight-bold.color-theme-1').toggleClass('font-weight-bold color-theme-1');
        inp.value = this.innerHTML;
        window.atributo_actual = this.innerHTML;
        this.className+= " font-weight-bold color-theme-1";
        filtrarTabla();
        fillListaAtributos(arr);
      });
      a.appendChild(b);
  });
}

//Funcion para autocompletado en el input de FuentesAprovisionamiento.aspx
function autocompleteMetadatosLinaje(inp, arr) {
  inp.addEventListener("input", function(e) {
      var a, b, i, val = this.value;
      a = document.getElementById("lista-atributos");
      a.innerHTML = '';
      let busqueda = val ? buscarAtributo(val,arr) : arr;
      $.each(busqueda, function(index,item){
        b = document.createElement("a");
        b.innerHTML = item.attr("ows_nombre_metad").replaceAll('<br>','');
        b.className = window.atributo_actual == b.innerHTML ? "mb-2 font-weight-bold color-theme-1" : "mb-2";
        b.setAttribute("href","#catalogo");
        b.addEventListener("click", function(e) { //codigo a ejecutar cuando se haga click en una opción
          $('a.font-weight-bold.color-theme-1').toggleClass('font-weight-bold color-theme-1');
            inp.value = this.innerHTML;
            window.atributo_actual = this.innerHTML;
            this.className+= " font-weight-bold color-theme-1";
            filtrarTabla();
            fillListaAtributos();
          });
          a.appendChild(b);
      });
  });
}

//Funcion para filtrar el datatable de Dominio metadatos linaje
//Se reescribe el texto del atributo a buscar y atributo actual.
function filtrarTabla(){
  $("#atributo-buscar").css("display","inherit");
  $("#atributo-actual").text(window.atributo_actual);
  let filtrado = [];
  $.each(window.it,function(index,item){
    if(item.descripcion == window.atributo_actual){
      filtrado.push(item);
    }
  });
  redrawDataTable("catalogo",filtrado);
}

//Función para eliminar el filtro implementado en la tabla de Dominio metadatos
function deleteFiltro(){
  redrawDataTable("catalogo",window.it);
  $("#atributo-buscar").toggle();
  $("#atributo-actual").text("Seleccione un Atributo");
  document.getElementById("atributo-search").value = "";
  window.atributo_actual = "";
  let b;
  let a = document.getElementById("lista-atributos");
  a.innerHTML = '';
  $.each(window.atributos, function(index,item){
    b = document.createElement("a");
    b.innerHTML = item.attr("ows_nombre_metad").replaceAll('<br>','');
    b.className = window.atributo_actual == b.innerHTML ? "mb-2 font-weight-bold color-theme-1" : "mb-2";
    b.setAttribute("href","#catalogo");
    b.addEventListener("click", function(e) {
      $('a.font-weight-bold.color-theme-1').removeClass('font-weight-bold color-theme-1');
        document.getElementById("atributo-search").value = this.innerHTML;
        window.atributo_actual = this.innerHTML;
        this.className+= " font-weight-bold color-theme-1";
        filtrarTabla();
        fillListaAtributos();
      });
      a.appendChild(b);
  });
}


function deleteFiltroCalidad(){
  $("#entidad-buscar").toggle();
  $("#entidad-actual").text("Seleccione una Entidad");
  document.getElementById("entidad-search").value = "";
  window.entidad_actual = "";
  window.objeto_entidad_actual = null;
  $("#entidad-search").val("")
  $("#servidor").val("" );
  $("#Aprovisionamiento").val( "" );
  $("#base").val("" );
  $("#Esquema").val("");
  $("#documentacion").val(` `)
  let data_tabla=[];
  $.each(window.tabla_indicador_calidad, function(value, text) {
    data_tabla.push({ value: value, text: text });
  });
  redrawDataTable("indicadores_calidad", data_tabla)
  $('.btnGuardarIndicadores').prop('disabled', true);
  let entidadSearch = $("#entidad-search")
  entidadSearch.css("background-color", 'transparent')
  entidadSearch.prop('disabled', false)
  $('a.font-weight-bold.color-theme-1').toggleClass('font-weight-bold color-theme-1');
}

//Funcion para reescribir un datatable
//el parámetro datos es un arreglo de objetos que llevan los mismos campos que la tabla inicializada
function redrawDataTable(id,datos){
  let DataTable = $("#"+id).DataTable();
  DataTable.clear().draw(); 
  DataTable.rows.add(datos).draw();
}


function listenerScroll(){
  if($("#campos").hasClass("dataTable")){


    /*$('#campos tbody').parent().on('scroll', function(evt) {
      let transparencia = $(this).scrollY / $(this).innerHeight * 2
      transparencia = transparencia < 1 ? transparencia : 1;
    }, false);
  }*/
  $("#campos .dataTables_scrollBody").on('scroll', function(evt) {

    let transparencia = window.scrollY / window.innerHeight * 2
    transparencia = transparencia < 1 ? transparencia : 1;
    banner.style.opacity = 1 - transparencia  
  }, false);
 
}
}

//Funcion para reescribir un datatable del buscador de campos
//el parámetro datos es un arreglo de objetos que llevan los mismos campos que la tabla inicializada
function redrawDataTableBuscadorCampos(id,datos, colapsado = $("#columna-arbol").is(":visible")){
  /*let colapsado=$("#columna-arbol").is(":visible")
  if(colapsado){
    colapsado=true
  }else{
    colapsado=false
  }*/
  
  let DataTable = $("#"+id).DataTable();
  // Obtener el contenedor de la tabla (generalmente la <div> o <table> con overflow: auto)
  let tableContainer = $("#" + id).closest('.dataTables_wrapper').find('.dataTables_scrollBody');
  
  // Guardar la posición del scroll
  let scrollPos = tableContainer.scrollTop();
  DataTable.clear().draw(false);//false para no perder la paginacion ()

  if (colapsado == false && window.nivelTabla==false){  
    DataTable.rows.add(datos).draw(false);
  }else if (colapsado == true && window.nivelTabla==false){
    abrirCerrar(DataTable)
    DataTable.rows.add(datos).draw(false);
    abrirCerrar(DataTable)
  }else if(colapsado == true && window.nivelTabla==true){
    window.nivelTabla=false
    reducirColumnasNivelTabla()
    abrirCerrar(DataTable)
    DataTable.rows.add(datos).draw(false);
    abrirCerrar(DataTable)
    window.nivelTabla=true
    reducirColumnasNivelTabla()
    
  }else {// aplica para if(colapsado == false && nivelTabla==true)  y cuando ambos estan colapsados
    window.nivelTabla=false
    reducirColumnasNivelTabla()
    DataTable.rows.add(datos).draw(false);
    window.nivelTabla=true
    reducirColumnasNivelTabla()
   
  }

  // Restaurar la posición del scroll
  tableContainer.scrollTop(scrollPos);
}

//Funcion para revisar si el usuario actual es parte de OGA
function isOGA(){
  let oga = false;
  var email= obtenerUsuario();
  var current_email = email.current_email;
  window.current_email = current_email;
  $().SPServices({
    operation: "GetListItems",
    async: false,
    listName: "LONG_LOC_MODEL_ART",
    CAMLQuery: "<Query><Where><Eq><FieldRef Name='valor1'/><Value Type='Text'>GOBIERNO DE INFORMACIÓN Y ANALÍTICA</Value></Eq></Where></Query>",
    CAMLViewFields: "<ViewFields>\
                          <FieldRef Name='valor8' />\
                    </ViewFields>",
    completefunc: function (xData, Status) {
        $(xData.responseXML).find("z\\:row").each(function () {
                if($(this).attr("ows_valor8")){
                  if($(this).attr("ows_valor8").toLowerCase() == current_email || current_email == "klamilla@bancoguayaquil.com" ){
                    oga = true;
                    return false;
                  }
                }
        });
    }
  });
  return oga;
}

//Funcion para configurar el datatable de Dominio metadatos
function setDataTableMetadatosLinaje(informacion_tecnica){
  $('#catalogo').DataTable({
    data: informacion_tecnica,
    paging: false,
    lengthChange: false,
    info: false,
    dom: isOGA() ? 'Bt' : 't',
    autoWidth: false,
    scrollY: 'calc(50vh)',
    scrollCollapse:true,
    buttons: [
      {
        extend: 'excel',
        text: 'Exportar a Excel',
    }
    ],
    columnDefs: [
      { targets: 8, width: "80px" },
      { targets: 7, width: "40px" },
      { targets: 6, width: "40px" },
      { targets: 3, width: "55px" },
      { targets: 2, width: "56px" },
      { targets: 1, width: "56px" },
      { targets: 0, width: "80px" },
      { targets: '_all', width: "85px" }
    ],
    colResize: { //Librería colresize permite el cambio del ancho de las columnas por el usuario
      isEnabled: true,
      hasBoundCheck: false
    },
    columns: [
        { data: 'plataforma' },
        { data: 'servidor' },
        { data: 'base'},
        { data: 'esquema' },
        { data: 'tabla' },
        { data: 'campo' },
        { data: 'tipo_dato' },
        { data: 'largo' },
        { data: 'permite_null' },
    ],
    language:{
      "decimal":        "",
      "emptyTable":     "No hay datos disponibles en la tabla",
      "info":           "Mostrando _TOTAL_ registros", //"Mostrando _START_ a _END_ de _TOTAL_ registros",
      "infoEmpty":      "Mostrando 0 a 0 de 0 registros",
      "infoFiltered":   "", //"(filtrando de _MAX_ registros totales)"
      "infoPostFix":    "",
      "thousands":      ",",
      "lengthMenu":     "Mostrar _MENU_ registros",
      "loadingRecords": "Cargando...",
      "processing":     "",
      "search":         "",
      "zeroRecords":    "No se encontraron registros",
      "paginate": {
          "first":      "Primero",
          "last":       "Último",
          "next":       ">",
          "previous":   "<"
      },
      "aria": {
          "sortAscending":  ": activate to sort column ascending",
          "sortDescending": ": activate to sort column descending"
      }
  }
});
if(isOGA){
  document.querySelector("#catalogo_wrapper > div.dt-buttons.btn-group > button").innerHTML = "Descargar como Excel <i class='iconsminds-download'></i>";
}
}

//Log de visita de página 
function registrar_visita(nombre_pagina, sub_pagina = " ") {
  let usuario;
  if(window.current_user == undefined){
      usuario = obtenerUsuario();
      var current_user = usuario.current_user;
      window.current_user = current_user;
  }else{
      current_user = window.current_user;
  }

  if(current_user == 'aborbor' )return;
  let datos_usuario = datos_visitante(current_user);

  if (!datos_usuario) {
      var array_datos_usuario = [" ", " ", " "]
  } else {
      var array_datos_usuario = [datos_usuario.attr("ows_valor4"), datos_usuario.attr("ows_valor1"), datos_usuario.attr("ows_valor10")];
  }

  var tzoffset = (new Date()).getTimezoneOffset() * 60000; //offset in milliseconds
  var localISOTime = (new Date(Date.now() - tzoffset)).toISOString().slice(0, -1);

  $().SPServices({
      operation: "UpdateListItems",
      async: false,
      batchCmd: "New",
      listName: "Z_LOG_VISITAS_OGA_SUITE",
      valuepairs: [
                  ["usuario", current_user],
                  ["codigo_empleado", array_datos_usuario[0]],
                  ["desc_pagina", nombre_pagina],
                  ["sub_pagina", sub_pagina],
                  ["centro_costo", array_datos_usuario[1]],
                  ["departamento", array_datos_usuario[2]],
                  ["fecha", localISOTime],
              ],
      completefunc: function(xData, Status) {
      }
  });

}

//funcion para limpiar modales
function limpiarModal(){
  //ajustar tablas del reporte de Data Owners
  $('#buscadorowners').on('shown.bs.modal', function () {
    $($.fn.dataTable.tables(true)).DataTable().columns.adjust();
 });
 // Esconder modal 
  $('#buscadorowners').on('hidden.bs.modal', function(){
    let DataTable = $("#bOwner").DataTable();
    DataTable.clear().draw();  
    $('#dataownerselect2').val(null).trigger('change');
   })

 // Esconder modal 
   $('#detalleModal3').on('hidden.bs.modal', function(){
    $('#atributoselect').val(null).trigger('change');
   })

 // Esconder modal 
   $('#detalleModal2').on('hidden.bs.modal', function(){
    $('#dataownerselect').val(null).trigger('change');
   })

   $('#detalleModal4').on('hidden.bs.modal', function(){
    $('#dataselect').val(null).trigger('change');
   })

   $('#detalleModal5').on('hidden.bs.modal', function(){
    $('#dominioselect').val(null).trigger('change');
    document.getElementById("divClasificacion").style.display="none"
   })
   $('#detalleModal5').on('hidden.bs.modal', function(){
    $('#clasificacionselect').val(null).trigger('change');
   })

 // Esconder modal 
   $('#detalleModal1').on('hidden.bs.modal', function(){
    document.getElementById("detalleCampo").value=""
   })
}

//Funcion de carga para BuscadorCampos.aspx
function buscadorCampos(){
  //Oculto el tacho
  $("#campos-buscar").toggle();
  //En caso haya hecho un filtro por servidor
  window.servidor = getParams("servidor") ? getParams("servidor"): "";
  window.base = getParams("base") ? getParams("base"): "";
  window.esquema = getParams("esquema") ? getParams("esquema"): "";
  window.tabla = getParams("tabla") ? getParams("tabla"): "";
  window.campo = "";
  window.colapsado = false;
  window.nivelTabla=false;
  window.vistaTablaSinonimo = false;
  window.notificacionRecomendaciones = 0;
  //Creo la tabla vacía
  setDataTableBuscadorCampos([]);
  //cerrar columna de etiquetar tabla y de definicion tabla, solo se muestran cuando estamos en vista tabla
  $('#campos').DataTable().column( 12 ).visible( false );
  $('#campos').DataTable().column( 13 ).visible( false );
  $('#campos').DataTable().column( 14 ).visible( false );
  //Creo la variable para los datos de la info tecnica
  window.campos=[];

  calldetalle();

  //Obtengo a que esquemas puede acceder
  let [_, esquemas_acceso] = getInfoServidores()
  window.prueba_tecnica_larga = []
  
  const loadingElement = document.getElementById('loading');

  // Muestra el spinner de carga
  loadingElement.style.display = 'block';


  leerDataset("Z_INF_TECNICA_LARGA").then(info_tecnica=>{
   
    //carga de lista de tablas oficiales - contienen el campo de categoria
    let tablasoficialesInfo=getInfoTablasOficiales()
    window.tablas_oficiales=tablasoficialesInfo
    let info_tecnica_corta = getInfoTecnicaCorta();
    window.info_tecnicacorta=info_tecnica_corta //necesario para comparación
    // Uniré el array de lista larga con la lista corta
    let resultado_info_tecnica = [];
    // Creo un objeto para rastrear los campos ya procesados
    const camposProcesados = {};
    // Itero sobre la lista corta y agrego elementos únicos al resultado
    info_tecnica_corta.forEach(elemento => {
      // Vemos si el esquema esta en sus accesos
      // let lista_accesos = esquemas_acceso
      // .filter(item => 
      //   ((item.servidor ? item.servidor.toUpperCase().trim().replaceAll('(', '\(').replaceAll(')', '\)').replaceAll('<BR>','').replaceAll('\\','') : " ") === elemento.servidor) && 
      //   ((item.base ? item.base.toUpperCase().trim().replaceAll('(', '\(').replaceAll(')', '\)').replaceAll('<BR>','').replaceAll('\\','') : " ") === elemento.base) && 
      //   ((item.esquema ? item.esquema.toUpperCase().trim().replaceAll('(', '\(').replaceAll(')', '\)').replaceAll('<BR>','').replaceAll('\\','') : "DBO") === elemento.esquema))
      // .map(item => elemento.base);

      //if(lista_accesos.length > 0){
      if (true){
        if (camposProcesados[elemento.llave_unica]===undefined) {
          if(tablasoficialesInfo[elemento["llave_tabla"]]!==undefined){
            elemento["clasificacion"]=tablasoficialesInfo[elemento["llave_tabla"]]["clasificacion"]
            elemento["descripcion_tabla"]=tablasoficialesInfo[elemento["llave_tabla"]]["descripcion_tabla"]
          }else{
            elemento["clasificacion"]=" "
            elemento["descripcion_tabla"]=" "
          }
          resultado_info_tecnica.push(elemento);
          camposProcesados[elemento.llave_unica] = true;
        }
      }

    });
    // Iterar sobre la lista larga y agrego elementos únicos al resultado
    info_tecnica.forEach(elemento => {
      // Vemos si el esquema esta en sus accesos
      // let lista_accesos = esquemas_acceso
      // .filter(item => 
      //   ((item.servidor ? item.servidor.toUpperCase().trim().replaceAll('(', '\(').replaceAll(')', '\)').replaceAll('<BR>','').replaceAll('\\','') : " ") === elemento.servidor) && 
      //   ((item.base ? item.base.toUpperCase().trim().replaceAll('(', '\(').replaceAll(')', '\)').replaceAll('<BR>','').replaceAll('\\','') : " ") === elemento.base) && 
      //   ((item.esquema ? item.esquema.toUpperCase().trim().replaceAll('(', '\(').replaceAll(')', '\)').replaceAll('<BR>','').replaceAll('\\','') : "DBO") === elemento.esquema))
      // .map(item => elemento.base);
      
      //if(lista_accesos.length > 0){
      if (true){
        if (camposProcesados[elemento.llave_unica]===undefined) {
          if(tablasoficialesInfo[elemento["llave_tabla"]]!==undefined){
            elemento["clasificacion"]=tablasoficialesInfo[elemento["llave_tabla"]]["clasificacion"]
            elemento["descripcion_tabla"]=tablasoficialesInfo[elemento["llave_tabla"]]["descripcion_tabla"]
          }else{
            elemento["clasificacion"]=" "
            elemento["descripcion_tabla"]=" "
          }
          resultado_info_tecnica.push(elemento);
          camposProcesados[elemento.llave_unica] = true;
        }
      }
    });
    window.info_tecnica = resultado_info_tecnica
    //Cambio el mensaje del mensaje a "Datos cargados"
    document.getElementById("status_carga").className = 'datos-cargados col-2'; 
    document.getElementById("status_carga").innerHTML = 'Datos cargados.';
    // Obtengo listado de servidores para el filtro
    let servidores_unicos = new Set();
    let myArray = resultado_info_tecnica.filter(t => {
      const servidorSinEspacios = t.servidor.replaceAll(' ', '');
      if (servidores_unicos.has(t.servidor) || servidorSinEspacios === '') {
        return false;
      }
      servidores_unicos.add(t.servidor);
      return true;
    });
    styleCampos(tabla_editar = "campos",elemento = "#Barrabusqueda", servidores = servidores_unicos, etiqueta = 'Servidor');
    //Auto completado de busqueda
    autocompleteCampos(inp = document.getElementById("campos-search"), arr = resultado_info_tecnica)
    //Escribo el arbol jerarquico
    document.getElementById("arbol_campos").innerHTML = cargar_arbol(buscarCampo(search_value = window.campo, list = myArray, servidor = window.servidor, base = window.base, esquema = window.esquema, tabla = window.tabla, unique = false));
    //Creo el listener para ocultar columnas cuando abra el arbol jerarquico
    listener_reducir_columnas();
    listenerSwitch();
    //cargar datos
    window.diccionarioDT=getDataOwners()[0]
    // muestra un reporte con todos los data owners
    buscadortodos(window.diccionarioDT);
    limpiarModal();
    //listener para dropdown del buscador
    cambiarBusqueda();
    //movi
    //En caso de que haya filtro, lo ejecuto 
    if(window.servidor != ''){
      segmentarTablaCampos(tabla_config = "campos", servidor = window.servidor, base = window.base, esquema = window.esquema, tabla = window.tabla, campo = window.campo)
       //Que aparezca el tacho de filtros
       $("#campos-buscar").toggle();
      }//end
      
      let dominios=getAllDescripcionDominio()
      //inicializador de select2
      initAtrArbol(dominios);
      initReporte();
      //buscar data owner en reportes
      buscarDO();
      //Guardo una sola ves las entidades en el modal 
      SelectEntidades();
      //Luego de un tiempo, oculto el mensaje de datos cargados
      setTimeout(() => {
        const tag_carga = document.getElementById('status_carga');
        tag_carga.style.display = 'none';
        
      }, 100);
      // Mostrar en datatable el dato que se haya buscado en el url
      let criterioBusqueda = getParams("criterio")
      let valorBusqueda = getParams("valor")
      if(criterioBusqueda && valorBusqueda){
        let inputBusqueda = document.getElementById("campos-search")
        // Cambiar opciones de criterio de búsqueda al cargar con búsqueda en url
        let dropdownBuscador = document.getElementById("dropdown-buscador")
        let opcionFiltro = document.getElementById("opcionfiltro")
        let opcionFiltro2 = document.getElementById("opcionfiltro2")
        let textoActual = dropdownBuscador.innerText.toLowerCase().replace(" ", "");
        if(criterioBusqueda.toLowerCase() === opcionFiltro.innerText.toLowerCase().replace(" ", "")){
          opcionFiltro.innerText = capitalizarPrimeraLetra(textoActual);
        }
        if(criterioBusqueda.toLowerCase() === opcionFiltro2.innerText.toLowerCase().replace(" ", "")){
          opcionFiltro2.innerText = capitalizarPrimeraLetra(textoActual);
        }
        document.getElementById("dropdown-buscador").innerText = criterioBusqueda
        //Limpiar valor de busqueda
        valorBusqueda = quitarAcentos( valorBusqueda.trim().toUpperCase().replaceAll('(', '\(').replaceAll(')', '\)'))
        //En caso de buscar un atributo cambiar el getter a descripción
        let getter = criterioBusqueda
        if(criterioBusqueda.toLowerCase() === "atributo") getter = "descripcion"
        else if(criterioBusqueda.toLowerCase() === "tabla") getter = "llave_tabla"
        //Filtrar los resultados según el criterio y valor de búsqueda
        window.campos = resultado_info_tecnica.filter(e=>
          e[getter.toLowerCase()].toUpperCase()===valorBusqueda.toUpperCase()
        )
        inputBusqueda.value = window.campos[0]?.tabla || valorBusqueda
        setDataTableBuscadorCampos(window.campos);
        //Evento que simula aplastar enter y realizar la búsqueda
        if (!$("#campos-buscar").is(":visible")) {$("#campos-buscar").toggle();}

      }
      // Ocultar spinner de tabla
      loadingElement.style.display = 'none';
    })
    
    .catch(function (error) {
      //Si hay un error en la carga asincrónica, lo muestro
      console.error("Se produjo un error al obtener los datos:", error);
      loadingElement.style.display = 'none';
    });

  listenerModalConfirmacion()
    //Registramos la visita
  registrar_visita("EXPLORADOR DE METADATOS", "Primera carga");
}

function listenerModalConfirmacion(){

  $("#btnConfirmYes").click(function(){
    $("#modalDocumentacionCampo").modal("show");
    $("#confirmModal").modal('hide'); // Oculta el modal después de confirmar
    $("#confirmModal").addClass('confirmado'); // Oculta el modal después de confirmar
    
  });
  
  $("#btnConfirmNo").off("click").on("click",function(){
    const llaveElemento = $("#confirmModal").data("llave-elemento")
    document.querySelector("#btnDocumentacionCampo").dispatchEvent(new CustomEvent('clickGuardarRecomendacion', { detail: llaveElemento }))
    $("#confirmModal").modal('hide'); // Oculta el modal después de confirmar
    $("#confirmModal").addClass('confirmado'); // Oculta el modal después de confirmar
  });

  // Escucha el evento `hidden.bs.modal` para manejar el cierre del modal
  $("#confirmModal").off("hidden.bs.modal").on("hidden.bs.modal", function() {
    if(!$(this).hasClass("confirmado")){
      // Realiza la acción deseada cuando el modal se cierra sin seleccionar "Sí" o "No"
      // Aquí puedes agregar alguna lógica adicional o hacer algún cambio de estado si es necesario
      $("#confirmModal").removeData("llave-elemento")
    }
    $(this).removeClass("confirmado")

  });

}

function guardarInfoRelacionada(columna,llaveElemento){

  let elemento = window.campos.find(e=>e.llave_unica === llaveElemento)
  if(!elemento) return;
  $("#confirmModal").data("llave-elemento", llaveElemento)

  // Limpia todos los tooltips cuando se oculta el modal
  $('[data-toggle="tooltip"]').tooltip('dispose');

  let inputDetalle = $("#detalleCampo")
  let atributoSelect = $("#atributoselect")

  let codigoAtributo = elemento.codigo
  if(codigoAtributo.startsWith("***")) codigoAtributo = codigoAtributo.trim().slice(3) 
  let definicionCampo = elemento.detalle
  if(definicionCampo.startsWith("***")) definicionCampo = definicionCampo.trim().slice(3) 

  atributoSelect.val(codigoAtributo).trigger('change')
  inputDetalle.val(definicionCampo)
  
  let btn = document.getElementById(`btnDocumentacionCampo`)
  if(columna === "detalle") btn.dispatchEvent(new CustomEvent('clickGuardarRecomendacion', { detail: llaveElemento }))
  else if(columna === "atributo"){
    $("#confirmModal").modal('show')
  }
  

}

function SelectEntidades(){
  let tabla_autorizacion = getAutorizaciones();
  window.tabla_autorizacion=tabla_autorizacion;
  let entidades = getCatalogoOGASUITE("4");
  let select = $('#clasificacionselect');
  
  $.each(entidades, function(value, text) {
    select.append(new Option(text, value));
  });
}


function capitalizarPrimeraLetra(str) {
  return str.charAt(0).toUpperCase() + str.slice(1).toLocaleLowerCase();
}
//Funcion para configurar datatable de BuscadorCampos.aspx
function setDataTableBuscadorCampos(campo){
  let dicc = getAtributosSelect()[0]
  let primerIndice=null
  let segundoIndice=null
  //En caso no exista la tabla en la página, creo el data table
  //con los datos que me han enviado
  if(!$("#campos").hasClass("dataTable")){
    $('#campos').DataTable({
      processing: true,
      data: campo, //La data del datatable será la proporcionada en "campo"
      paging: true, //Tendrá padding
      lengthChange: true, //Ajuste de texto
      //Para cada fila, ejecutaremos los siguientes comandos
      "createdRow": function( row, data,displayNum,displayIndex ) {
        //En caso de que la data de la fila corresponda a un golden record se le agrega la clase
        if ( data.golden_record == "1" ) {
          $(row).addClass("golden-record");
        }
        //Extraigo los datos que necesitaré
        let servidor=data.servidor
        let base=data.base
        let esquema= data.esquema
        if (window.colapsado == false){ //Si la tabla no está colapsada, entonces 
          let codigo = data.codigo;
          let tabla = data.tabla;
          if(displayNum==0){
            primerIndice=$(row)[0]._DT_RowIndex
          }
          if(displayNum==1){
            segundoIndice=$(row)[0]._DT_RowIndex
          }
          //Identifico el data owner, el data steward y la definición de la tabla
          let dataOwner=window.tablas_oficiales[data.llave_tabla] ? window.tablas_oficiales[data.llave_tabla]["data_owner"] : " "
          let dataSteward=window.tablas_oficiales[data.llave_tabla] ? window.tablas_oficiales[data.llave_tabla]["data_steward"] : " "
          let definTabla=window.tablas_oficiales[data.llave_tabla] ? window.tablas_oficiales[data.llave_tabla]["descripcion_tabla"] : " "
          if(!($("#switchS3").is(':checked'))){ //Si está desactivada la vista de tablas, simplemente pongo un link de la tabla y las cosas de los campos
            //Si hay un codigo de atributo, entonces agrego "replica" y "borrar"
            let codigoLimpio = codigo.startsWith("***") ? codigo.slice(3) : codigo 
            let infoAtributo =dicc[codigoLimpio] || [];
            let [atributo, descripcionAtributo] = infoAtributo
            if(codigo!=" " ){
              if(!codigo.startsWith("***")){
                $('td:eq(1)', row).html( '<div style="cursor:pointer;justify-content:space-evenly" class="row" onmouseout="quitarIcon(this,true)" onmouseover="mostrarIcon(this,true)"><icon data-toggle="tooltip" data-placemente="left" title="Replicar" onclick="pegarAtributo(\''+data.llave_unica+'\','+'\''+data.plataforma+'\',\''+data.servidor+'\',\''+data.base+'\',\''+data.esquema+'\',\''+data.tabla+'\',\''+data.campo+'\',\''+data.tipo_dato+'\',\''+data.largo+'\',\''+data.permite_null+'\',\''+data.golden_record+'\',\''+data.data_owner+'\',\''+data.data_steward+'\','+displayNum+','+primerIndice+','+segundoIndice+')"  style="visibility:hidden"class="iconsminds-file-clipboard-file---text"></icon>'+codigo+"<icon style=\"visibility:hidden\" class=\"iconsminds-close\" onclick='deleteAtributo(\""+codigo+"\",\""+data.llave_unica+"\","+displayNum+","+primerIndice+","+segundoIndice+",\""+servidor+"\",\""+base+"\",\""+esquema+"\",\""+tabla+"\",\""+data.campo+"\",\""+data.ordinal_position+"\")' data-toggle=\"tooltip\" data-placemente=\"right\" title=\"Eliminar\" ></icon></div >" );

                
                
              }else{
                let infoRelacionada = codigo.trim().slice(3,)
                $('td:eq(1)', row).html(`<div class="row align-items-center" onmouseout="iniciarParpadeo(this)" onmouseover="detenerParpadeo(this)" style="margin:auto; gap:4px;flex-wrap:nowrap; color:#D2006E;"><icon data-toggle="tooltip" data-placement="left" title="Guardar recomendación." class="simple-icon-check blinking btnGuardarInfoRelacionada" type="button" aria-haspopup="true" aria-expanded="false" onclick="guardarInfoRelacionada('atributo','${data.llave_unica}')"></icon> <p class="buscador-campos__info-recomendada" style="font-size: 11.7px;"> ${infoRelacionada}</p></div>`);
              }
              //Si no hay código, entonces solo agrego réplica
            }else{
              $('td:eq(1)', row).html( `<div style="height:14px;cursor:pointer" onmouseout="quitarIcon(this,false)" onmouseover="mostrarIcon(this,false)"><icon data-toggle="tooltip" data-placemente="left" title="Replicar" onclick="pegarAtributo('${data.llave_unica}','${data.plataforma}','${data.servidor}', '${data.base}', '${data.esquema}', '${data.tabla}','${data.campo}', '${data.tipo_dato}','${data.largo}', '${data.permite_null}', '${data.golden_record}', '${data.data_owner}', '${data.data_steward}', '${displayNum}', '${primerIndice}', '${segundoIndice}', '${data.ordinal_position}')" style="visibility:hidden"class="iconsminds-file-clipboard-file---text"></icon></div>`);
              
            }
            
            //Agrego el link del atributo
            if(codigo && codigo.startsWith("***"))$('td:eq(2)', row).html( `<a class="buscador-campos__info-recomendada" title="${descripcionAtributo||""}" >${atributo||""} </a>` );
            else $('td:eq(2)', row).html( `<a href="Ficha_Atributo.aspx?atributo=${codigo}+ATRIBUTO" title="${descripcionAtributo}" >${data.descripcion} </a>` );
            //Agrego link de tabla
            $('td:eq(8)', row).html('<a href="#" class="link_subrrayado" onclick="mostrarbusquedaTabla(\'' + servidor + '\', \'' + base + '\', \'' + esquema + '\', \'' + tabla + '\')"> ' + tabla + ' </a>');
          }else{//En caso la vista tablas esté activada, inserto las opciones para la tabla
            let style = ""
            if(data.clasificacion.toLowerCase() === "sinonimo") style = "pointer-events:none;"
            $('td:eq(8)',row).html( '<icon class="simple-icon-pencil" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" style="'+ style +'" ></icon>'+
                                    '<a href="#" class="link_subrrayado"   onclick="mostrarbusquedaTabla(\''+servidor+'\',\''+base+'\',\''+esquema+'\',\''+tabla+'\''+')">' + ' ' + tabla + '</a>'+
                                    '<div class="dropdown-menu dropdown-menu-right mt-3">'+
                                      '<a  onclick="mostrarOpcionesCampo(8, \'\', \'\',\''+tabla+'\', \'\', \'\', \'\', \'\', \'\',\''+definTabla+'\')" class="dropdown-item defin" href="#"></a>'+
                                      '<a  onclick="mostrarOpcionesCampo(2,\''+dataOwner+'\',\''+data.codigo+'\')" class="dropdown-item do" href="#"></a>'+
                                      '<a id="ds" onclick="mostrarOpcionesCampo(4,\''+dataSteward+'\',\''+data.codigo+'\')" class="ds dropdown-item" href="#"></a>'+
                                      '<a  onclick="mostrarOpcionesCampo(5,\'\',\'\','+'\''+data.tabla+'\',\''+data.servidor+'\',\''+data.esquema+'\',\''+data.base+'\',\''+data.llave_tabla+'\')" class="dropdown-item dominio" href="#"></a>'+
                                    '</div>')
            //Agrego la información de la clasificación de la tabla
            let clasifi=data.clasificacion
            if(clasifi!=" "){
              if(clasifi.includes("; ")){
                let lista= clasifi.split("; ")
                let htmlfinal=''
                lista.forEach(element => {
                  htmlfinal+='<span style="font-size:12px" class="badge badge-pill badge-secondary atributo">'+element+'</span>'
                });
                $('td:eq(13)', row).html(htmlfinal)
              }else{
                $('td:eq(13)', row).html('<span style="font-size:12px"  class="badge badge-pill badge-secondary atributo">'+clasifi+'</span>')
              }
            }
            //Le pongo el porcentaje al avance
            $('td:eq(14)', row).html(data.porcentaje_avance + '%')
            actualizarDominio("avance", data.tabla, data.servidor, data.base, data.esquema, data.porcentaje_avance )
          }
        }else{ //En caso la tabla si esté colapsada
          let codigo = data.codigo;
          let tabla =data.tabla;
          let dataOwner=window.tablas_oficiales[data.llave_tabla] ? window.tablas_oficiales[data.llave_tabla]["data_owner"] : " "
          let dataSteward=window.tablas_oficiales[data.llave_tabla] ? window.tablas_oficiales[data.llave_tabla]["data_steward"] : " "
          let definTabla=window.tablas_oficiales[data.llave_tabla] ? window.tablas_oficiales[data.llave_tabla]["descripcion_tabla"] : " "
          //Si está desactivada la vista de tablas, simplemente pongo un link de la tabla
          if(!($("#switchS3").is(':checked'))){
            $('td:eq(4)', row).html( '<a href="#" class=""   onclick="mostrarbusquedaTabla(\''+servidor+'\',\''+base+'\',\''+esquema+'\',\''+tabla+'\''+')">'+ tabla +' </a>' );
            //Hago que en la segunda columna aparezca el atributo con un link hacia su ficha
            $('td:eq(1)', row).html( '<a href="Ficha_Atributo.aspx?atributo='+ codigo +'+ATRIBUTO" >'+ data.descripcion +' </a>' );
          //En caso la vista tablas esté activada, inserto las opciones para la tabla
          }else{
            $('td:eq(8)',row).html( '<icon class="simple-icon-pencil" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" ></icon>'+
                                    '<a href="#" class="link_subrrayado"   onclick="mostrarbusquedaTabla(\''+servidor+'\',\''+base+'\',\''+esquema+'\',\''+tabla+'\''+')">'+ ' ' + tabla + '</a>'+ 
                                    '<div class="dropdown-menu dropdown-menu-right mt-3 ">'+
                                    '<a  onclick="mostrarOpcionesCampo(8, \'\', \'\',\''+tabla+'\', \'\', \'\', \'\', \'\', \'\',\''+definTabla+'\')" class="dropdown-item defin" href="#"></a>'+
                                      '<a  onclick="mostrarOpcionesCampo(2,\''+dataOwner+'\',\''+data.codigo+'\')" class="dropdown-item do" href="#"></a>'+
                                      '<a id="ds" onclick="mostrarOpcionesCampo(4,\''+dataSteward+'\',\''+data.codigo+'\')" class="ds dropdown-item" href="#"></a>'+
                                      '<a  onclick="mostrarOpcionesCampo(5,\'\',\'\','+'\''+data.tabla+'\',\''+data.servidor+'\',\''+data.esquema+'\',\''+data.base+'\',\''+data.llave_tabla+'\')" class="dropdown-item dominio" href="#"></a>'+
                                    '</div>')
            //Agrego la información de la clasificación de la tabla
            let clasifi=data.clasificacion
            if(clasifi!=" "){
              if(clasifi.includes("; ")){
                let lista= clasifi.split("; ")
                let htmlfinal=''
                lista.forEach(element => {
                  htmlfinal+='<span style="font-size:12px" class="badge badge-pill badge-secondary atributo">'+element+'</span>'
                });
              $('td:eq(13)', row).html(htmlfinal)
              }else{
                $('td:eq(13)', row).html('<span style="font-size:12px"  class="badge badge-pill badge-secondary atributo">'+clasifi+'</span>')
              }
            }
            //Le pongo el porcentaje al avance
            $('td:eq(14)', row).html(data.porcentaje_avance + '%')
            actualizarDominio("avance", data.tabla, data.servidor, data.base, data.esquema, data.porcentaje_avance )
            
          }
        }
        //Agrego el tooltip para el detalle de campos
        if(data.detalle != " "){
          let index_children
          //En caso no esté colapsado, el detalle estará en la cuarta columna (indice 3)
          //Caso contrario, estará en la tercera columna
          if (window.colapsado == false){
            index_children = 3
          } else {
            index_children = 2
          }

          const detalle = (row.children)[index_children]
          let infoTooltip =  String(data.detalle)
          if(infoTooltip.startsWith("***")) infoTooltip = infoTooltip.slice(3,) 
          $(detalle).attr("data-toggle","tooltip");
          $(detalle).attr("data-placement","bottom");
          $(detalle).tooltip({
            html: true,
            boundary: 'window',
            title: infoTooltip ,
            template:
              `
                <div class="custom-tooltip tooltip tooltip2">
                  <div class="arrow"></div>    
                  <div class="tooltip-inner inner"></div>
                </div>
              `
          });
        }
        //Agrego el tooltip mostrar quién es el data owner/data steward de la tabla
        //Primero verifico que aparezca en z_tablas_oficiales
        let llave=window.tablas_oficiales[data.llave_tabla]
        if(llave !== undefined){
          let condicionOwner= llave["data_owner"] !==" "
          let condicionSteward= llave["data_steward"] !==" "
          let dicciona=window.diccionarioDT
          let mensaje=''
          let dt=''
          let ds=''
          if(condicionOwner && condicionSteward){
            dt = ((dicciona)[llave["data_owner"]]).toLowerCase().split(" ")
            let nombre = capitalizarPrimeraLetra(dt[0])+" "+capitalizarPrimeraLetra(dt[2])
            ds = dicciona[llave["data_steward"]].toLocaleLowerCase().split(" ")
            let nombre2= capitalizarPrimeraLetra(ds[0])+" "+capitalizarPrimeraLetra(ds[2])
            mensaje= "Data Owner: "+String(nombre) +'<br>'+"Data Steward: "+String(nombre2)  
          }else if(condicionOwner){
            dt = ((dicciona)[llave["data_owner"]]).toLowerCase().split(" ")
            let nombre = capitalizarPrimeraLetra(dt[0])+" "+capitalizarPrimeraLetra(dt[2])
            mensaje = "Data Owner: "+String(nombre)
          }else if(condicionSteward){
            ds = dicciona[llave["data_steward"]].toLocaleLowerCase().split(" ")
            let nombre=capitalizarPrimeraLetra(ds[0])+" "+capitalizarPrimeraLetra(ds[2])
            mensaje= "Data Steward: "+String(nombre)
          }
          let tablarow=null
          if(window.colapsado==false && nivelTabla==false ){
            tablarow = (row.children)[8]
          }else if(nivelTabla==true){
            tablarow= (row.children)[4]
          }else{
            tablarow= (row.children)[5]
          }
          $(tablarow).attr("data-toggle","tooltip");
          $(tablarow).attr("data-placement","bottom");
          $(tablarow).tooltip({
            html: true,
            boundary: 'window',
            title: mensaje,
            template: 
              `
                <div class="custom-tooltip tooltip tooltip2">
                  <div class="arrow"></div>    
                  <div class="tooltip-inner inner"></div>
                </div>
              `
          });
        }
      },
      autoWidth:true,
      info: true,
      scrollX: true,
      scrollCollapse: true,
      scrollY: '325px',
      dom: 'Btlip',
      colResize: {
        isEnabled: true,
        hasBoundCheck: false
      },
      buttons: [
        {
          // extend: 'excel',
          text: 'Descargar como Excel <i class='+"iconsminds-download"+'></i>',
          action: function(e,dt,button,config){
              let datatable = $('#campos').DataTable()
              let grouped = $("#switchS3").is(':checked')
              if(!grouped){
                let headers = {
                  "campo":"Nombre de campo",
                  "codigo":"Codigo atributo",
                  "descripcion": "Descripción atributo",
                  "detalle":"Descripción campo", 
                  "plataforma": "Plataforma", 
                  "servidor": "Servidor", 
                  "base": "Base", 
                  "esquema": "Esquema", 
                  "tabla": "Tabla", 
                  "tipo_dato": "Tipo de dato", 
                  "largo": "Largo", 
                  "permite_null": "Permite Null"
                }
                newCustomizeExcel(datatable, headers, grouped)
              }else{
                let headers = {
                  "plataforma": "Plataforma", 
                  "servidor": "Servidor", 
                  "base": "Base", 
                  "esquema": "Esquema", 
                  "tabla": "Tabla", 
                  "descripcion_tabla": "Descripción tabla", 
                  "clasificacion": "Clasificacion", 
                  "porcentaje_avance": "Porcentaje avance"
                }
                newCustomizeExcel(datatable, headers, grouped)
              }
          }
        }
      ],
      columns: [
        { data: 'campo' , width:"130px", "targets": 0 },
        { data: 'codigo', width:"70px", "targets": 1},
        { data: 'descripcion', width:"80px", "targets": 2},
        { data: 'detalle', width:"80px", "targets": 3, 
          render: function(data, type, row) {
            let infoRelacionada = data.trim().slice(3,)
            if(data && data.toLowerCase().startsWith("(synonym)")) row.clasificacion = "SINONIMO"
            return !data.startsWith("***") ? data : `<div class="row align-items-center" onmouseout="iniciarParpadeo(this)" onmouseover="detenerParpadeo(this)" style="margin:auto; gap:4px; flex-wrap:nowrap;text-overflow:ellipsis; color:#D2006E;"><icon data-toggle="tooltip" data-placement="left" title="Guardar recomendación." class="simple-icon-check blinking" type="button" aria-haspopup="true" aria-expanded="false" onclick="guardarInfoRelacionada('detalle','${row.llave_unica}')"></icon> <p class="buscador-campos__info-recomendada" style="font-size: 11.7px;"> ${infoRelacionada}</p></div>`
          }
        },
        { data: 'plataforma', width:"80px", "targets": 4},
        { data: 'servidor', width:"100px", "targets": 5},
        { data: 'base', width:"80px", "targets": 6},
        { data: 'esquema' , width:"80px", "targets": 7},
        { data: 'tabla', width:"150px", "targets": 8},
        { data: 'tipo_dato', width:"70px", "targets": 9},
        { data: 'largo', width:"70px", "targets": 10},
        { data: 'permite_null', width:"100px", "targets": 11},
        { data: 'descripcion_tabla', width:"100px", "targets": 12},
        { data: 'clasificacion', width:"100px", "targets": 13},
        { data: 'porcentaje_avance', width:"100px", "targets": 14},
        { data: 'ordinal_position', visible: false, "targets": 15}
      ],
      order:[
        [5,'asc'], // ordenar por servidor
        [6,'asc'], // ordenar por base
        [7,'asc'], // ordenar por esquema
        [8,'asc'], // ordenar por tabla
        [15,'asc'], // ordenar ordinal_position
      ],
      language:{
        "decimal":        "",
        "emptyTable":     "Ingrese un Campo a Buscar",
        "info":           "_TOTAL_ resultados", //"Mostrando _START_ a _END_ de _TOTAL_ registros",
        "infoEmpty":      "Mostrando 0 a 0 de 0 registros",
        "infoFiltered":   "", //"(filtrando de _MAX_ registros totales)"
        "infoPostFix":    "",
        "thousands":      ",",
        "lengthMenu":     "Mostrar _MENU_ registros",
        "loadingRecords": "Cargando...",
        "processing":     "",
        "search":         "",
        "zeroRecords":    "No se encontraron registros",
        "paginate": {
          "first":      "Primero",
          "last":       "Último",
          "next":       ">",
          "previous":   "<"
        },
        "aria": {
            "sortAscending":  ": activate to sort column ascending",
            "sortDescending": ": activate to sort column descending"
        }
      },
      // pop up con opciones de edición de campo
      columnDefs: [
        {
          targets: 0,
          render: function (data, type, row, meta) {
            let dataO=''
            let dataS=''
            let dataOwner=window.tablas_oficiales[row.llave_tabla] ? window.tablas_oficiales[row.llave_tabla]["data_owner"] : " "
            return `<icon class="simple-icon-pencil" type="button" onclick="mostrarOpcionesCampo(10,'${dataOwner}','${row.codigo}', '','','','','${row.llave_unica}','${row.campo}','${row.detalle.replaceAll('\n', '').replaceAll("\"", '&quot;')}')"></icon> ${data}`
          }
        },
      ],
      "drawCallback": function( settings ) {
        //se escreibe el contenido de las opciones para edición de campos
        let api = this.api();
        let rowsHidden = 0;

        if($("#campos").hasClass("dataTable")){
          changeoptionsnames();
          if(settings?.aoData?.length === 0){ 
            api.order([
              [5,'asc'], // ordenar por servidor
              [6,'asc'], // ordenar por base
              [7,'asc'], // ordenar por esquema
              [8,'asc'], // ordenar por tabla
              [15,'asc'], // ordenar ordinal_position
            ])
          }
          api.rows({page: 'current'}).every(function(rowIndex, tableLoop, rowLoop){
            let data = this.data();
            let node = this.node();
            if(!window.vistaTablaSinonimo && data.detalle.toLowerCase().startsWith("(synonym)")) {
              $(node).hide();
              rowsHidden++;
            }
          })
          
          let recomendaciones = window.campos.length && window.campos.length > 0 && window.campos.filter(e=>e.detalle.startsWith("***"))
          if(window.notificacionRecomendaciones === 0 && recomendaciones && recomendaciones.length>0){
            showNotification("top", "center", "info", "Se han realizado recomendaciones de documentación.", 1500)
            window.notificacionRecomendaciones++
          }

          

        }
        
        let totalRows = api.data().length - rowsHidden;
        
        $('.dataTables_info').html(`${totalRows} resultados`);
        if($("#switchS3").is(':checked')){
          const totalPages = api.page.info().pages; // Total de páginas disponibles
          if (totalPages > 0) {
            // Hace click en la primera pagina cuando se cambia vista campo a tabla para evitar bug visualización
            const tableButtons = $('.dataTables_paginate .pagination .paginate_button')
            if(tableButtons.length > 2)tableButtons[1].click()
          }
        }
      },
      "pageLength": 25,
    });

    
  }else{
    redrawDataTableBuscadorCampos("campos",campo);
    changeoptionsnames();
  }
  $("#campos").addClass("overflow-auto");
  $('[data-toggle="tooltip"]').tooltip();
}


//funcion para desasignar un atributo de un campo
function deleteAtributo(codigoAtributo,llaveunica,rowindex,primerIndice,segundoIndice,servidor,base,esquema,tabla,campo, ordinal_position=""){
  //Obtengo el usuario que está haciendo los cambios
  datos_usuario = getUserAndDate();
  let array_datos_usuario = datos_usuario[0];
  let localISOTime = datos_usuario[1];

  $('[data-toggle="tooltip"]').tooltip('hide');
  let eliminado=false
  let plataforma
  let tipo_dato
  let largo
  let permite_null
  let golden_record
  let usuario_modificacion_detalle
  let fecha_modificacion_detalle
  //Hago el cambio en el array de campos
  $.each(window.campos,function(index,element){
    if(element["llave_unica"]==llaveunica && element["codigo"]==codigoAtributo){
      element["codigo"]="";
      element["detalle"]=" ";
      element["descripcion"]=" ";
      element["usuario_modificacion_atributo"]= array_datos_usuario[0];
      element["fecha_modificacion_atributo"]= localISOTime;

      //Asignamos los valores a escribir en caso no exista el campo en Z_INF_TECNICA
      plataforma = element["plataforma"]
      tipo_dato = element["tipo_dato"]
      largo = element["largo"]
      permite_null = element["permite_null"]
      golden_record = element["golden_record"]
      usuario_modificacion_detalle = element["usuario_modificacion_detalle"]
      fecha_modificacion_detalle = element["fecha_modificacion_detalle"]

    }
  });
  //Re-escribo la tabla con el cambio hecho
  redrawDataTableBuscadorCampos("campos",window.campos)
  //Posiciono la vista en el elemento que estaba
  var $row = $($('#campos').DataTable().row(primerIndice).node());   
  let posicionPrimero=$row.position().top //posicion de primer elemento 4
  let posicionSegundo=$($('#campos').DataTable().row(segundoIndice).node()).position().top
  let posicionfinal= (((posicionSegundo)-posicionPrimero)*rowindex)+posicionPrimero//posicion de elemento dependiendo de su fila rowindex
  $('.dataTables_scrollBody').animate({ scrollTop: posicionfinal}, 0);
  //Hago el cambio en el array de info tecnica
  let indexEliminar=""
  $.each(window.info_tecnica,function(index,element){
    if(element["llave_unica"]==llaveunica && element["codigo"]==codigoAtributo){
      element["codigo"]="";
      element["detalle"]=" ";
      element["descripcion"]=" ";
      element["usuario_modificacion_atributo"]= array_datos_usuario[0];
      element["fecha_modificacion_atributo"]= localISOTime;
    }
  });
  //Hago el cambio en la lista
  //Si la fila ya se ecuentra en Z_INFO_TECNICA solo actualiza, si no está, lo escribo
  window.info_tecnicacorta = getInfoTecnicaCorta() //Actualizamos los datos para asegurarnos que contamos con la última versión
  let actualizar=false
  $.each(window.info_tecnicacorta,function(index,element){
    if(element["llave_unica"]==llaveunica){
      actualizar=true
    }
  });
  if(actualizar){
    $().SPServices.SPUpdateMultipleListItems({
      async: false,
      listName: "Z_INF_TECNICA",
      batchCmd: "Update",
      CAMLQuery: '<Query><Where>\
                    <And>\
                      <Eq><FieldRef Name="servidor"/><Value Type="Text">'+servidor+'</Value></Eq>\
                      <And>\
                        <Eq><FieldRef Name="base"/><Value Type="Text">'+base+'</Value></Eq>\
                        <And>\
                          <Eq><FieldRef Name="esquema"/><Value Type="Text">'+esquema+'</Value></Eq>\
                          <And>\
                            <Eq><FieldRef Name="tabla"/><Value Type="Text">'+tabla+'</Value></Eq>\
                            <Eq><FieldRef Name="campo"/><Value Type="Text">'+campo+'</Value></Eq>\
                          </And>\
                        </And>\
                      </And>\
                    </And>\
                  </Where></Query>',
      valuepairs: [
        ["codigo", ""],
        ["descripcion", " "],
        ["detalle", " "],
        ["usuario_modificacion_atributo", array_datos_usuario[0]],
        ["fecha_modificacion_atributo", localISOTime],
        ["ordinal_position", ordinal_position ? ordinal_position : ""]
      ],
      completefunc: function (xData, Status) {}
    })
  }else{
    $().SPServices({
      operation: "UpdateListItems",
      async: false,
      batchCmd: "New",
      listName: "Z_INF_TECNICA",
      valuepairs: [
                ["codigo", ""],
                ["descripcion", " "],
                ["detalle", " "],
                ["plataforma", plataforma],
                ["servidor",servidor],
                ["base", base],
                ["esquema", esquema],
                ["tabla", tabla],
                ["campo", campo],
                ["tipo_dato", tipo_dato],
                ["largo", largo],
                ["permite_null", permite_null],
                ["golden_record", golden_record],
                ["usuario_modificacion_detalle", usuario_modificacion_detalle],
                ["fecha_modificacion_detalle", fecha_modificacion_detalle],
                ["usuario_modificacion_atributo", array_datos_usuario[0]],
                ["fecha_modificacion_atributo", localISOTime],
                ["ordinal_position", ordinal_position ? ordinal_position : ""]
              ],
      completefunc: function(xData, Status) {}
    });
  }
}

function iniciarParpadeo(elemento) {
  elemento.querySelector('.simple-icon-check').classList.add('blinking'); // Inicia parpadeo
}

function detenerParpadeo(elemento) {
  elemento.querySelector('.simple-icon-check').classList.remove('blinking'); // Detiene parpadeo
}

function quitarIcon(elemento,eliminar){
  elemento.firstElementChild.style.visibility="hidden"
  if(eliminar){
    elemento.children[1].style.visibility="hidden"
  }

  //$('[data-toggle="tooltip"]').tooltip('hide');
}
function mostrarIcon(elemento,eliminar){

  elemento.firstElementChild.style.visibility="visible"
  if(eliminar){
    elemento.children[1].style.visibility="visible"

  }
  $('[data-toggle="tooltip"]').tooltip();
}

function pegarAtributo(llave_unica,plataforma,servidor,base,esquema,tabla,campo,tipo_dato,largo,permite_null,golden_record,data_owner,data_steward,rowindex,primerIndice,segundoIndice, ordinal_position=""){
  //Obtengo el usuario que está haciendo los cambios
  datos_usuario = getUserAndDate();
  let array_datos_usuario = datos_usuario[0];
  let localISOTime = datos_usuario[1];

  //atributo guardado globalmente
  //mismo proceso que btn atributo

  $('[data-toggle="tooltip"]').tooltip('hide');
  if(window.listaAtributo!==undefined && window.listaAtributo!=""){
    let lista=window.listaAtributo.split("|")
    let atributo=lista[0] ? lista[0].trim() : lista[0]
    let nombre= lista[1]
    let descripcion=lista[2]
  
    //1.- hacer cambio en campo
    let x=0
    let continuar=true
    while(continuar){
      let comp=window.campos[x]["llave_unica"]
      if(comp==llave_unica){
        break;
      }
      x+=1
    }
    //CAMBIAR X
    window.campos[x]["codigo"]=atributo;
    window.campos[x]["descripcion"]=nombre;
    window.campos[x]["detalle"]=descripcion;
    window.campos[x]["usuario_modificacion_atributo"]=array_datos_usuario[0];
    window.campos[x]["fecha_modificacion_atributo"]=localISOTime;
    redrawDataTableBuscadorCampos("campos",window.campos)
  // scroll
  //para scroll-obtengo la distancia del scroll body hasta el primera elemento y luego le sumo la posición de la fila que se borra
  var $row = $($('#campos').DataTable().row(primerIndice).node());   
 let posicionPrimero=$row.position().top //posicion de primer elemento 4
 let posicionSegundo=$($('#campos').DataTable().row(segundoIndice).node()).position().top
 let posicionfinal= (((posicionSegundo)-posicionPrimero)*rowindex)+posicionPrimero//posicion de elemento dependiendo de su fila rowindex

 $('.dataTables_scrollBody').animate({ scrollTop: posicionfinal}, 0);

    //2.- cambio en window.inf_tecnica
    let y=0
    let cont=true
    while(cont){
      let comp=window.info_tecnica[y]["llave_unica"]
      if(comp==llave_unica){
        break;
      }
      y+=1
    }

    window.info_tecnica[x]["codigo"]=atributo;
    window.info_tecnica[x]["descripcion"]=nombre;
    window.info_tecnica[x]["detalle"]=descripcion;
    window.info_tecnica[x]["usuario_modificacion_atributo"]=array_datos_usuario[0];
    window.info_tecnica[x]["fecha_modificacion_atributo"]=localISOTime;
//si la fila ya se ecuentra en Z_INFO_TECNICA_CORTA solo actualiza, si no está lo escribo
window.info_tecnicacorta = getInfoTecnicaCorta() //Actualizamos los datos para asegurarnos que contamos con la última versión
let actualizar=false
$.each(window.info_tecnicacorta,function(index,element){
 
  if(element["llave_unica"]==llave_unica){
    actualizar=true
  }
});
if(actualizar){
  $().SPServices.SPUpdateMultipleListItems({
    async: false,
    listName: "Z_INF_TECNICA",
    batchCmd: "Update",
    CAMLQuery: '<Query><Where>\
    <And>\
    <Eq><FieldRef Name="servidor"/><Value Type="Text">'+servidor+'</Value></Eq>\
    <And>\
    <Eq><FieldRef Name="base"/><Value Type="Text">'+base+'</Value></Eq>\
    <And>\
    <Eq><FieldRef Name="esquema"/><Value Type="Text">'+esquema+'</Value></Eq>\
    <And>\
    <Eq><FieldRef Name="tabla"/><Value Type="Text">'+tabla+'</Value></Eq>\
    <Eq><FieldRef Name="campo"/><Value Type="Text">'+campo+'</Value></Eq>\
    </And>\
    </And>\
    </And>\
    </And>\
    </Where></Query>',
    valuepairs: [
      ["codigo", atributo],
      ["descripcion",nombre],
      ["detalle",descripcion],
      ["usuario_modificacion_atributo", array_datos_usuario[0]],
      ["fecha_modificacion_atributo", localISOTime],
      ["ordinal_position", ordinal_position? ordinal_position : ""]
  ],
    completefunc: function (xData, Status) {
 
    } //completefunc
  })
}else{
  $().SPServices({
    operation: "UpdateListItems",
    async: false,
    batchCmd: "New",
    listName: "Z_INF_TECNICA",
    valuepairs: [
                ["codigo", atributo],
                ["descripcion", nombre],
                ["detalle",descripcion],
                ["plataforma", plataforma],
                ["servidor",servidor],
                ["base", base],
                ["esquema", esquema],
                ["tabla", tabla],
                ["campo", campo],
                ["tipo_dato", tipo_dato],
                ["largo", largo],
                ["permite_null", permite_null],
                ["golden_record", golden_record],
                ["usuario_modificacion_detalle", " "],
                ["fecha_modificacion_detalle", " "],
                ["usuario_modificacion_atributo", array_datos_usuario[0]],
                ["fecha_modificacion_atributo", localISOTime],
                ["ordinal_position", ordinal_position ? ordinal_position : ""]
            ],
    completefunc: function(xData, Status) {
    }
});
}



  }
  
}
function changeoptionsnames3(){
  let downer = document.getElementsByClassName("edo")
  for(let x=0;x<downer.length;x++){
    downer[x].innerHTML="Data Owner";
    downer[x].title="Eliminar Data Owner"
  }

  let ds=document.getElementsByClassName("eds")
  for(let x=0;x<ds.length;x++){
    ds[x].innerHTML="Data Steward";
    ds[x].title="Eliminar Data Steward";
  }
}


//Función que simula una búsqueda por tabla.
//Al hacer clic en una tabla en el "Explorador de Metadatos", te lleva a la vista tablas con los datos de esa tabla
function mostrarbusquedaTabla(servidor,base,esquema,tabla){
  $("[data-toggle='tooltip']").tooltip('hide');
  let actual=document.getElementById("dropdown-buscador").innerText
  //segmentar filtros 
  document.getElementById("dropdown-buscador").innerText="Tabla"
  
  let opcion = document.getElementById("opcionfiltro").innerText
  let opcion2 = document.getElementById("opcionfiltro2").innerText

  if(opcion=="Tabla"){
    document.getElementById("opcionfiltro").innerText=actual
  }else if (opcion2=="Tabla"){
    document.getElementById("opcionfiltro2").innerText=actual
  }
  
  document.getElementById("campos-search").value=tabla
  window.tablab=tabla;
  if(!$("#switchS3").is(':checked')){
    document.getElementById("switchS3").click()
  }
  let visible=$("#columna-arbol").is(":visible")
  let resultados = buscarCampo(tabla, window.info_tecnica, servidor, base, esquema, "", false, true, false);
  let distinto=arrayCamposDistinct(resultados)
  setDataTableBuscadorCampos(distinto)
}


//menu con las opciones de edición del reporte de data owners
function changeoptionsnames2(){
  let editar =document.getElementsByClassName("editarDO")
  for(let x=0;x<editar.length;x++){
    editar[x].innerHTML="Editar &raquo;";
  }

  let eliminar=document.getElementsByClassName("eliminarDO")
  for(let x=0;x<eliminar.length;x++){
    eliminar[x].innerHTML="Eliminar &raquo;";
  }
}
// menu con las opciones de edición del datatable de buscador de campos
function changeoptionsnames(){
  let prueba = document.getElementsByClassName("pruebadefinicion")
  for(let x=0;x<prueba.length;x++){
    prueba[x].innerHTML="Definición";
    prueba[x].title="Asignar definición"
  }
  let downer = document.getElementsByClassName("do")
  for(let x=0;x<downer.length;x++){
    downer[x].innerHTML="Data Owner";
    downer[x].title="Asignar Data Owner"
  }

  let defin = document.getElementsByClassName("defin")
  for(let x=0;x<defin.length;x++){
    defin[x].innerHTML="Descripción tabla";
    defin[x].title="Asignar descripción de la tabla"
  }

  let atributo = document.getElementsByClassName("at")
  for(let x=0;x<atributo.length;x++){
    atributo[x].innerHTML="Atributo";
    atributo[x].title="Asignar atributo";
  }

  let ds=document.getElementsByClassName("ds")
  for(let x=0;x<ds.length;x++){
    ds[x].innerHTML="Data Steward";
    ds[x].title="Asignar Data Steward";
  }

  let dominio=document.getElementsByClassName("dominio")
  for(let x=0;x<dominio.length;x++){
    dominio[x].innerHTML="Clasificación";
    dominio[x].title="Etiquetar tabla";
  }

  let periodo=document.getElementsByClassName("per")
  for(let x=0;x<periodo.length;x++){
    periodo[x].innerHTML="Periodicidad";
    periodo[x].title="Asignar";
  }
  
  let deletedom=document.getElementsByClassName("eliminarDom")
  for(let x=0;x<deletedom.length;x++){
    deletedom[x].innerHTML="Dominio";
    deletedom[x].title="Desasignar dominio";
  }
}

//initialize atributos y select 2
function initAtrArbol(dominios){
    

    ordenarDataOwners();
    ordenarDataOwners2();
    ordenarDataOwners3();
    // ordenarAtributos();
    setSelectAtributos()
    ordenarDominios(dominios);
  
    //dominio select2
    $(".select2-multiple").select2({
      theme: "bootstrap",
     // dir: direction,
      placeholder: "",
      maximumSelectionSize: 6,
      containerCssClass: ":all:"
    });
    $('#dataownerselect').select2({
        theme: "bootstrap",  
        placeholder: "",
        maximumSelectionSize: 6,
        containerCssClass: ":all:",
        dropdownParent: $('#detalleModal2')
  });

  $('#dataselect').select2({
    theme: "bootstrap",  
    placeholder: "",
    maximumSelectionSize: 6,
    containerCssClass: ":all:",
    dropdownParent: $('#detalleModal4')
});

  $('#dataownerselect2').select2({
    theme: "bootstrap4",  
    placeholder: "",
    maximumSelectionSize: 4,
    containerCssClass: ":all:",
    dropdownParent: $('#buscadorowners')
});


    
 
}


//función que elimina row en archivo y actualiza los valores nuevos
function eliminaryActualizar(codigo,descripcion,detalle,plataforma,servidor,base,esquema,tabla,campo,tipo_dato,largo,permite_null,golden_record, usuario_modificacion_detalle, fecha_modificacion_detalle, usuario_modificacion_atributo, fecha_modificacion_atributo, ordinal_position=""){
  $().SPServices.SPUpdateMultipleListItems({
    async: true,
    listName: "Z_INF_TECNICA",
    batchCmd: "Delete",
    CAMLQuery:'<Query><Where><And><Eq><FieldRef Name="plataforma"/><Value Type="Text">'+plataforma+'</Value></Eq><And><Eq><FieldRef Name="servidor"/><Value Type="Text">'+servidor+'</Value></Eq><And><Eq><FieldRef Name="base"/><Value Type="Text">'+base+'</Value></Eq><And><Eq><FieldRef Name="esquema"/><Value Type="Text">'+esquema+'</Value></Eq><And><Eq><FieldRef Name="tabla"/><Value Type="Text">'+tabla+'</Value></Eq><And><Eq><FieldRef Name="campo"/><Value Type="Text">'+campo+'</Value></Eq><And><Eq><FieldRef Name="tipo_dato"/><Value Type="Text">'+tipo_dato+'</Value></Eq><And><Eq><FieldRef Name="largo"/><Value Type="Text">'+largo+'</Value></Eq><Eq><FieldRef Name="permite_null"/><Value Type="Text">'+permite_null+'</Value></Eq></And></And></And></And></And></And></And></And></Where></Query>',
    completefunc: function (xData, Status) {
    } //completefunc
  });
  //actualizo todo el row
  $().SPServices({
    operation: "UpdateListItems",
    async: false,
    batchCmd: "New",
    listName: "Z_INF_TECNICA",
    valuepairs: [
                ["codigo", codigo],
                ["descripcion", descripcion],
                ["detalle",detalle],
                ["plataforma",plataforma],
                ["servidor", servidor],
                ["base", base],
                ["esquema",esquema],
                ["tabla", tabla],
                ["campo", campo],
                ["tipo_dato", tipo_dato],
                ["largo", largo],
                ["permite_null", permite_null],
                ["golden_record", golden_record],
                ["usuario_modificacion_detalle", usuario_modificacion_detalle],
                ["fecha_modificacion_detalle", fecha_modificacion_detalle],
                ["usuario_modificacion_atributo", usuario_modificacion_atributo],
                ["fecha_modificacion_atributo", fecha_modificacion_atributo],
                ["ordinal_position", ordinal_position ? ordinal_position: ""]
            ],
    completefunc: function(xData, Status) {
    }
});
}


//listener que maneja los cambios en detalle, data owner y atributo. Muestra los cambios en pantalla y escribe en docs 
function cargardetalle() {
  //Listener para conocer la data de la fila que se seleccionó
  var data;
  $('#campos tbody').on('click', 'tr', function(){
    var table = $('#campos').DataTable();
    data = table.row( this ).data();
  });

  let btnDetalle = document.querySelector("#btndetalle")
  let btnAtributo = document.querySelector("#btnatributo")

  let btnDocumentacionCampo = document.getElementById("btnDocumentacionCampo")

  btnDocumentacionCampo.addEventListener('clickGuardarRecomendacion', function(e){
    // if(!data){
    const llave = e.detail
    data = window.campos.find(e=>e.llave_unica===llave)
    // }
    return this.click()
  })

  btnDocumentacionCampo.addEventListener('click', function(){
    let atributo= $("#atributoselect").val() || " "
    let definicionCampo = $("#detalleCampo").val() || ""
    let dicc = getAtributosSelect()[0]
    let comp=parseInt(atributo)
    //const isNumeric = n => !isNaN(n);
    if(!isNaN(comp) || definicionCampo){
      
      if(data.codigo.replaceAll(" ", "") == ""){
        registrar_visita("EXPLORADOR DE METADATOS", "Nuevo atributo");
      } else {
        registrar_visita("EXPLORADOR DE METADATOS", "Actualiza atributo "+ "; anterior: " + data.codigo + "; nuevo: " + atributo);
      }      
      //get la descripcion y detalle
      let nombre= atributo.trim() ? dicc[atributo][0] : " "
      let descripcion= definicionCampo
      //Obtengo el usuario que está haciendo los cambios
      datos_usuario = getUserAndDate();
      let array_datos_usuario = datos_usuario[0];
      let localISOTime = datos_usuario[1];

      //1.- hacer cambio en campo
      let x=0
      let continuar=true
      while(continuar){
        let comp=window.campos[x]["llave_unica"]
        if(comp==data.llave_unica){
          break;
        }
        x+=1
      }
      //CAMBIAR X
      window.campos[x]["codigo"]=atributo
      window.campos[x]["descripcion"]=nombre
      window.campos[x]["detalle"]=descripcion

      if(!isNaN(comp)) {
        window.campos[x]["usuario_modificacion_atributo"]=array_datos_usuario[0];
        window.campos[x]["fecha_modificacion_atributo"]=localISOTime;
      }
      if(definicionCampo){
        window.campos[x]["usuario_modificacion_detalle"]=array_datos_usuario[0];
        window.campos[x]["fecha_modificacion_detalle"]=localISOTime;

      }
      redrawDataTableBuscadorCampos("campos",window.campos)

      //2.- cambio en window.inf_tecnica
      let y=0
      let cont=true
      while(cont){
        let comp=window.info_tecnica[y]["llave_unica"]
        if(comp==data.llave_unica){
          break;
        }
        y+=1
      }

      window.info_tecnica[x]["codigo"]=atributo
      window.info_tecnica[x]["descripcion"]=nombre
      window.info_tecnica[x]["detalle"]=descripcion
      if(!isNaN(comp)){
        window.info_tecnica[x]["usuario_modificacion_atributo"]=array_datos_usuario[0];
        window.info_tecnica[x]["fecha_modificacion_atributo"]=localISOTime;
      }
      if(definicionCampo){
        window.info_tecnica[x]["usuario_modificacion_detalle"]=array_datos_usuario[0];
        window.info_tecnica[x]["fecha_modificacion_detalle"]=localISOTime;
      }

      window.listaAtributo=atributo+"|"+nombre+"|"+descripcion

      //elimino el row
      $().SPServices.SPUpdateMultipleListItems({
        async: true,
        listName: "Z_INF_TECNICA",
        batchCmd: "Delete",
        CAMLQuery:'<Query><Where><And><Eq><FieldRef Name="plataforma"/><Value Type="Text">'+data.plataforma+'</Value></Eq><And><Eq><FieldRef Name="servidor"/><Value Type="Text">'+data.servidor+'</Value></Eq><And><Eq><FieldRef Name="base"/><Value Type="Text">'+data.base+'</Value></Eq><And><Eq><FieldRef Name="esquema"/><Value Type="Text">'+data.esquema+'</Value></Eq><And><Eq><FieldRef Name="tabla"/><Value Type="Text">'+data.tabla+'</Value></Eq><And><Eq><FieldRef Name="campo"/><Value Type="Text">'+data.campo+'</Value></Eq><And><Eq><FieldRef Name="tipo_dato"/><Value Type="Text">'+data.tipo_dato+'</Value></Eq><And><Eq><FieldRef Name="largo"/><Value Type="Text">'+data.largo+'</Value></Eq><Eq><FieldRef Name="permite_null"/><Value Type="Text">'+data.permite_null+'</Value></Eq></And></And></And></And></And></And></And></And></Where></Query>',
        completefunc: function (xData, Status) {} //completefunc
      });
      //actualizo todo el row
      $().SPServices({
        operation: "UpdateListItems",
        async: false,
        batchCmd: "New",
        listName: "Z_INF_TECNICA",
        valuepairs: [
                    ["codigo", atributo],
                    ["descripcion", nombre],
                    ["detalle",descripcion],
                    ["plataforma", data.plataforma],
                    ["servidor", data.servidor],
                    ["base", data.base],
                    ["esquema", data.esquema],
                    ["tabla", data.tabla],
                    ["campo", data.campo],
                    ["tipo_dato", data.tipo_dato],
                    ["largo", data.largo],
                    ["permite_null", data.permite_null],
                    ["golden_record", data.golden_record],
                    ["usuario_modificacion_detalle", data.usuario_modificacion_detalle],
                    ["fecha_modificacion_detalle", data.fecha_modificacion_detalle],
                    ["usuario_modificacion_atributo", data.usuario_modificacion_atributo],
                    ["fecha_modificacion_atributo", data.fecha_modificacion_atributo],
                    ["ordinal_position", data.ordinal_position ? data.ordinal_position: ""]
        ],
        completefunc: function(xData, Status) {}
      });
       
        if(data.llave_unica === $("#confirmModal").data("llave-elemento")) showNotification("top", "center","success", "Su documentación recomendada ha sido guardada con éxito", 2000)
        $("#modalDocumentacionCampo").modal("hide");
        //Se actualiza el porcentaje de avance al realizar un cambio
        let resultadoDistinct = arrayCamposDistinct(window.campos)
        if(resultadoDistinct) actualizarDominio("avance", resultadoDistinct["tabla"], resultadoDistinct["servidor"], resultadoDistinct["base"], resultadoDistinct["esquema"], resultadoDistinct["porcentaje_avance"])
        $("#confirmModal").removeData("llave-elemento")

    }else{
      document.getElementById("alertaatributo").style.display="block"
      setTimeout(() => {
        document.getElementById("alertaatributo").style.display="none"
      }, 4000);
      $("#confirmModal").removeData("llave-elemento")

    }

  })

  btnAtributo.addEventListener('clickGuardarSugerencia', function(e){
    if(!data){
      const llave = e.detail
      data = window.campos.find(e=>e.llave_unica===llave)
    }
    return this.click()
  })

  btnDetalle.addEventListener('clickGuardarSugerencia', function(e){
    if(!data){
      const llave = e.detail
      data = window.campos.find(e=>e.llave_unica===llave)
    }
    return this.click()
  })
  /////////////////////Actualizar detalle/////////////////////////////////////////
  btnDetalle.addEventListener('click', function(){
    //En caso alguien registre detalle de un nuevo campo, lo actualizo en la lista 
    //y registro la visita
    //Si el data.detalle estaba vacío, entonces es un nuevo detalle, caso contrario solo lo estoy cambiando
    if(data.detalle.replaceAll(" ", "") == "" || data.detalle.startsWith("***")){
      registrar_visita("EXPLORADOR DE METADATOS", "Nuevo detalle");
    }else{
      registrar_visita("EXPLORADOR DE METADATOS", "Cambiar detalle");
    }
    //Extraigo qué escribió de detalle, y en caso sea diferente a vacío, actualizo listas
    let detalle = $("#detalleCampo").val()
    if(detalle.replaceAll(" ","")!=""){
      //1.- modificar variable campo
      let x=0
      let continuar=true
      while(continuar){
        let comp;
        comp=window.campos[x]["llave_unica"]
        if(comp==data.llave_unica){
          break;
        }
        x+=1
      }
      let c=  window.campos[x]["codigo"]
      let d =  window.campos[x]["descripcion"]
      //validar que no haya atributo asignado
      if((c.replace(" ","")=="") && (d.replace(" ","")=="")){
        //Obtengo el usuario que está haciendo los cambios
        datos_usuario = getUserAndDate();
        let array_datos_usuario = datos_usuario[0];
        let localISOTime = datos_usuario[1];
        //Cambios en las ventanas
        window.campos[x]["detalle"]=detalle
        window.campos[x]["usuario_modificacion_detalle"]=array_datos_usuario[0];
        window.campos[x]["fecha_modificacion_detalle"]=localISOTime;
        redrawDataTableBuscadorCampos("campos",window.campos)
        //2.- cambio en window.inf_tecnica
        let y=0
        let cont=true
        while(cont){
          let comp=window.info_tecnica[y]["llave_unica"]
          if(comp==data.llave_unica){
            break;
          }
          y+=1
        }
        window.info_tecnica[x]["detalle"]=detalle;
        window.info_tecnica[x]["usuario_modificacion_detalle"]=array_datos_usuario[0];
        window.info_tecnica[x]["fecha_modificacion_detalle"]=localISOTime;
        //3.-enviar datos modificados a archivos
        //elimino el row
        eliminaryActualizar(data.codigo,data.descripcion,detalle,data.plataforma,data.servidor,data.base,data.esquema,data.tabla,data.campo,data.tipo_dato,data.largo,data.permite_null,data.golden_record, array_datos_usuario[0], localISOTime, data.usuario_modificacion_atributo, data.fecha_modificacion_atributo, data.ordinal_position);
        $("#detalleModal1").modal("hide");
        //Se actualiza el porcentaje de avance al realizar un cambio
        let resultadoDistinct = arrayCamposDistinct(window.campos)[0]
        if(resultadoDistinct) actualizarDominio("avance", resultadoDistinct["tabla"], resultadoDistinct["servidor"], resultadoDistinct["base"], resultadoDistinct["esquema"], resultadoDistinct["porcentaje_avance"])
      }else{
        document.getElementById("alertano").style.display="block";
        setTimeout(() => {
          document.getElementById("alertano").style.display="none"
        }, 4000);
      }
    }else{ //En caso el detalle esté vacío, hecho una alerta
      document.getElementById("alertadetalle").style.display="block"
      setTimeout(() => {
        document.getElementById("alertadetalle").style.display="none"
      }, 4000);
    }
  });
  
  //OWNER BTNSOLICITUD - EXPLORADOR DE METADATOS
  document.querySelector('#btnownerSolicitud').addEventListener('click', function(e){
    
    datos_usuario = getUserAndDate();
    let array_datos_usuario = datos_usuario[0];
    let nombre_usuario_modificacion = array_datos_usuario [0];
    let localISOTimeOwner = datos_usuario[1];
    // Obtener el código del nuevo propietario de los datos
    let codigoowner = $("#dataownerselect").val();
    let comp=parseInt(codigoowner)
    //Determinar el valor a enviar como data_owner
    let dataOwner=window.tablas_oficiales[data.llave_tabla] ? window.tablas_oficiales[data.llave_tabla]["data_owner"] : " "
    let dataOwnerActual = dataOwner !== " " ? dataOwner : "SIN DATAOWNER";


    // Si el código del nuevo propietario es válido
    if (!isNaN(comp) && ( codigoowner !== dataOwner)) {

      if(dataOwnerActual=="SIN DATAOWNER"){
        registrar_visita("EXPLORADOR DE METADATOS", "Solicitud de asignacion de nuevo dataowner");
      }else{
        registrar_visita("EXPLORADOR DE METADATOS", "Solicitud de actualizacion de dataowner en tabla "+ data.tabla + "; anterior: " + window.tablas_oficiales[data.llave_tabla]["data_owner"] + "; nuevo: " + codigoowner);
      }

        // Crear la solicitud de autorización
        escribirTablaAutorizacion(
          dataOwnerActual,    // ORIGINAL
          codigoowner,       // SOLICITADO
          nombre_usuario_modificacion, // AUTOR_SOLICITUD
          localISOTimeOwner,       // FECHA_SOLICITUD
          "1",                // TIPO_CAMBIO
          data.servidor,      // DATO3
          data.base,          // DATO2
          data.esquema,       // DATO1
          data.tabla,         // DATO4
          data.plataforma,    // DATA6
          "NONE",              //DATA7
          window.nombreCompleto.toUpperCase() //DATA8
        );
        // Cerrar el modal
        $("#detalleModal2").modal("hide");
        showNotification("top", "center", "success", "Su solicitud ha sido enviada con éxito.");
    } else {
        // Mostrar mensaje de alerta si el código no es válido
        document.getElementById("alertado").style.display = "block";
        setTimeout(() => {
            document.getElementById("alertado").style.display = "none";
        }, 4000);
    }
});

  //STEWARD BTNSOLICITUD - EXPLORADOR DE METADATOS
  document.querySelector('#btnstewardSolicitud').addEventListener('click', function(e){
    
    datos_usuario = getUserAndDate();
    let array_datos_usuario = datos_usuario[0];
    let nombre_usuario_modificacion = array_datos_usuario [0];
    let localISOTimeSteward = datos_usuario[1];

    // Obtener el código del nuevo propietario de los datos
    let codigosteward= document.getElementById("dataselect").value

    let comp=parseInt(codigosteward)

    //Determinar el valor a enviar como data_steward
    let dataSteward=window.tablas_oficiales[data.llave_tabla] ? window.tablas_oficiales[data.llave_tabla]["data_steward"] : " "
    let dataStewardActual = dataSteward !== " " ? dataSteward : "SIN DATASTEWARD";


    // Si el código del nuevo propietario es válido
    if (!isNaN(comp) && (codigosteward !== dataSteward)) {

      if(dataStewardActual=="SIN DATASTEWARD"){
        registrar_visita("EXPLORADOR DE METADATOS", "Solicitud de asignacion de nuevo datasteward");
      }else{
        registrar_visita("EXPLORADOR DE METADATOS", "Solicitud de actualizacion de datasteward en tabla "+ data.tabla + "; anterior: " + window.tablas_oficiales[data.llave_tabla]["data_steward"] + "; nuevo: " + codigosteward);
      }
        // Crea la solicitud de autorización

        escribirTablaAutorizacion(
          dataStewardActual,    // ORIGINAL
          codigosteward,       // SOLICITADO
          nombre_usuario_modificacion, // AUTOR_SOLICITUD
          localISOTimeSteward, // FECHA_SOLICITUD
          "2",                // TIPO_CAMBIO
          data.servidor,      // DATO3
          data.base,          // DATO2
          data.esquema,       // DATO1
          data.tabla,         // DATO4
          data.plataforma,    // DATA6
          "NONE",             // DATA7
          window.nombreCompleto.toUpperCase() // DATA8
        );



        // Cerrar el modal
        $("#detalleModal4").modal("hide");

        showNotification("top", "center", "success", "Su solicitud ha sido enviada con éxito.");

    } else {
        // Mostrar mensaje de alerta si el código no es válido
        document.getElementById("alertads").style.display = "block";
        setTimeout(() => {
            document.getElementById("alertads").style.display = "none";
        }, 4000);
    }
  });

  /////////////////////Actualizar atributo/////////////////////////////////////////
  btnAtributo.addEventListener('click', function(e){
    let atributo= $("#atributoselect").val()
    let dicc = getAtributosSelect()[0]
    let comp=parseInt(atributo)
    //const isNumeric = n => !isNaN(n);
    if(!isNaN(comp)){
      
      if(data.codigo.replaceAll(" ", "") == ""){
        registrar_visita("EXPLORADOR DE METADATOS", "Nuevo atributo");
      } else {
        registrar_visita("EXPLORADOR DE METADATOS", "Actualiza atributo "+ "; anterior: " + data.codigo + "; nuevo: " + atributo);
      }      
      //get la descripcion y detalle
      let nombre= dicc[atributo][0]
      let descripcion= dicc[atributo][1]
      //Obtengo el usuario que está haciendo los cambios
      datos_usuario = getUserAndDate();
      let array_datos_usuario = datos_usuario[0];
      let localISOTime = datos_usuario[1];

        //1.- hacer cambio en campo
        let x=0
        let continuar=true
        while(continuar){
          let comp=window.campos[x]["llave_unica"]
          if(comp==data.llave_unica){
            break;
          }
          x+=1
        }
        //CAMBIAR X
        window.campos[x]["codigo"]=atributo
        window.campos[x]["descripcion"]=nombre
        window.campos[x]["detalle"]=descripcion
        window.campos[x]["usuario_modificacion_atributo"]=array_datos_usuario[0];
        window.campos[x]["fecha_modificacion_atributo"]=localISOTime;
        
        redrawDataTableBuscadorCampos("campos",window.campos)



        //2.- cambio en window.inf_tecnica
        let y=0
        let cont=true
        while(cont){
          let comp=window.info_tecnica[y]["llave_unica"]
          if(comp==data.llave_unica){
            break;
          }
          y+=1
        }
  
        window.info_tecnica[x]["codigo"]=atributo
        window.info_tecnica[x]["descripcion"]=nombre
        window.info_tecnica[x]["detalle"]=descripcion
        window.info_tecnica[x]["usuario_modificacion_atributo"]=array_datos_usuario[0];
        window.info_tecnica[x]["fecha_modificacion_atributo"]=localISOTime;

        window.listaAtributo=atributo+"|"+nombre+"|"+descripcion


      //elimino el row
            $().SPServices.SPUpdateMultipleListItems({
            async: true,
            listName: "Z_INF_TECNICA",
            batchCmd: "Delete",
            CAMLQuery:'<Query><Where><And><Eq><FieldRef Name="plataforma"/><Value Type="Text">'+data.plataforma+'</Value></Eq><And><Eq><FieldRef Name="servidor"/><Value Type="Text">'+data.servidor+'</Value></Eq><And><Eq><FieldRef Name="base"/><Value Type="Text">'+data.base+'</Value></Eq><And><Eq><FieldRef Name="esquema"/><Value Type="Text">'+data.esquema+'</Value></Eq><And><Eq><FieldRef Name="tabla"/><Value Type="Text">'+data.tabla+'</Value></Eq><And><Eq><FieldRef Name="campo"/><Value Type="Text">'+data.campo+'</Value></Eq><And><Eq><FieldRef Name="tipo_dato"/><Value Type="Text">'+data.tipo_dato+'</Value></Eq><And><Eq><FieldRef Name="largo"/><Value Type="Text">'+data.largo+'</Value></Eq><Eq><FieldRef Name="permite_null"/><Value Type="Text">'+data.permite_null+'</Value></Eq></And></And></And></And></And></And></And></And></Where></Query>',
            completefunc: function (xData, Status) {
            } //completefunc
          });
          //actualizo todo el row
          $().SPServices({
            operation: "UpdateListItems",
            async: false,
            batchCmd: "New",
            listName: "Z_INF_TECNICA",
            valuepairs: [
                        ["codigo", atributo],
                        ["descripcion", nombre],
                        ["detalle",descripcion],
                        ["plataforma", data.plataforma],
                        ["servidor", data.servidor],
                        ["base", data.base],
                        ["esquema", data.esquema],
                        ["tabla", data.tabla],
                        ["campo", data.campo],
                        ["tipo_dato", data.tipo_dato],
                        ["largo", data.largo],
                        ["permite_null", data.permite_null],
                        ["golden_record", data.golden_record],
                        ["usuario_modificacion_detalle", data.usuario_modificacion_detalle],
                        ["fecha_modificacion_detalle", data.fecha_modificacion_detalle],
                        ["usuario_modificacion_atributo", array_datos_usuario[0]],
                        ["fecha_modificacion_atributo", localISOTime],
                        ["ordinal_position", data.ordinal_position ? data.ordinal_position: ""]
                    ],
            completefunc: function(xData, Status) {
            }
        });
        $("#detalleModal3").modal("hide");
        //Se actualiza el porcentaje de avance al realizar un cambio
        let resultadoDistinct = arrayCamposDistinct(window.campos)
        if(resultadoDistinct) actualizarDominio("avance", resultadoDistinct["tabla"], resultadoDistinct["servidor"], resultadoDistinct["base"], resultadoDistinct["esquema"], resultadoDistinct["porcentaje_avance"])
      }else{
        document.getElementById("alertaatributo").style.display="block"
        setTimeout(() => {
          document.getElementById("alertaatributo").style.display="none"
        }, 4000);
      }


  });


   ///--------------------------BTN CLASIFICACION Y DOMINIO -  SOLICITUD---------------------------------///
   document.querySelector('#btndominioSolicitud').addEventListener('click', function(e){
    //Se utiliza para detener la propagación de un evento a través del DOM. 
    e.stopPropagation()

    datos_usuario = getUserAndDate();
    let array_datos_usuario = datos_usuario[0];
    let nombre_usuario_modificacion = array_datos_usuario [0];
    let localISOTimeOwner = datos_usuario[1];
    // Obtiene la clasficacion
    var clasificacionvalue=$("#clasificacionselect").val();
    var DominioSelectvalue=$("#dominioselect").val();
    var clasificacion_actual = data.clasificacion !== " " ? data.clasificacion : "SIN CLASIFICACION"

    //----------------------Si la clasificacion es diferente a OFICIAL , solo se guarda la clasificacion en la tabla y limpia los dominios

    if ((clasificacionvalue !== null && clasificacionvalue.trim() !== "" ) && (clasificacionvalue !== data.clasificacion) && (clasificacionvalue !== "OFICIAL")){

        if(clasificacion_actual == "SIN CLASIFICACION"){
          registrar_visita("TABLAS OFICIALES", "Solicitud de asignacion de nueva Clasificacion");
        }else{
          registrar_visita("TABLAS OFICIALES", "Solicitud de actualizacion de la clasificacion en tabla " + data.tabla);
        }

        // Busca solicitudes de clasificaciones con los mismos datos
        let Solicitud_Clasificacion_Existe = false;

        for (let llave in window.tabla_autorizacion) {

          let objeto = window.tabla_autorizacion[llave];
        
          if (objeto["TIPO_CAMBIO"] == "4" && objeto["AUTOR_SOLICITUD"] == nombre_usuario_modificacion && objeto["ESTADO_APROBACION"] == "PENDIENTE" && objeto["DATO4"] == data.tabla && objeto["DATO3"] == data.esquema && objeto["DATO2"] == data.base && objeto["DATO1"] == data.servidor) {
            
            Solicitud_Clasificacion_Existe = true; 
  
            document.getElementById("alertadominio_Verificacion").style.display = "block";
            setTimeout(() => {
                document.getElementById("alertadominio_Verificacion").style.display = "none";
            }, 5000);
  
            break;
          }  
        }
  
        if (!Solicitud_Clasificacion_Existe){

          escribirTablaAutorizacion(
            clasificacion_actual,    // Clasificacion actual
            clasificacionvalue,       // Clasificacion Seleccionada
            nombre_usuario_modificacion, // Usuario Solicitante
            localISOTimeOwner,       // FECHA_SOLICITUD
            "4",                // TIPO_CAMBIO
            data.servidor,      // DATO3
            data.base,          // DATO2
            data.esquema,       // DATO1
            data.tabla,         // DATO4
            data.plataforma,    // DATA6
            clasificacionvalue, //DATA7
            window.nombreCompleto.toUpperCase() //DATA8
          );
            // Cerrar el modal
            $("#detalleModal5").modal("hide");
            showNotification("top", "center", "success", "Su solicitud ya fue enviada. En breves minutos se le aprobará su solicitud.");
        }

    }else if(clasificacionvalue !== "OFICIAL"){

      if((clasificacionvalue == data.clasificacion)||(clasificacionvalue == null)||(clasificacionvalue.trim() == "")){
  
      document.getElementById("alertadominio").style.display = "block";
        setTimeout(() => {
            document.getElementById("alertadominio").style.display = "none";
        }, 2000);
      }
    }

    // Obtengo el dominio del select , si es mayor a 1 se separan con un ";" caso contrario solo obtengo el primero valor 
    if (DominioSelectvalue.length >= 1) {
      if (DominioSelectvalue.length > 1) {
          DominioSelectvalue = DominioSelectvalue.join("; ");
      } else {
          DominioSelectvalue = DominioSelectvalue[0];
      }
    }
    // obtengo el dominio actual
    var descripcion_dominio=window.tablas_oficiales[data.llave_tabla] ? window.tablas_oficiales[data.llave_tabla]["descripcion_dominio"] : " "
    var descripcion_dominio_Actual = descripcion_dominio !== " " ? descripcion_dominio : "SIN DOMINIO";
   
    // -----------------------Si la clasificacion es OFICIAL , se envia solicitud con los dominios y la clasificacion OFICIAL-------------------------

    if(clasificacionvalue !== null && (clasificacionvalue == "OFICIAL" && DominioSelectvalue.length>0) && (descripcion_dominio_Actual !== DominioSelectvalue)){
  
      if(descripcion_dominio_Actual == "SIN DOMINIO"){
        registrar_visita("TABLAS OFICIALES", "Solicitud de asignacion de nuevo Dominio");
      }else{
        registrar_visita("TABLAS OFICIALES", "Solicitud de actualizacion del dominio en tabla " + data.tabla);
      }
    // Busca solicitudes de dominios con los mismos datos

      let registroExiste = false;

      for (let llave in window.tabla_autorizacion) {

        let objeto = window.tabla_autorizacion[llave];
      
        if (objeto["TIPO_CAMBIO"] == "4" && objeto["AUTOR_SOLICITUD"] == nombre_usuario_modificacion && objeto["ESTADO_APROBACION"] == "PENDIENTE" && objeto["DATO4"] == data.tabla && objeto["DATO3"] == data.esquema && objeto["DATO2"] == data.base && objeto["DATO1"] == data.servidor) {
          
          registroExiste = true; 
        
          document.getElementById("alertadominio_Verificacion").style.display = "block";
          setTimeout(() => {
              document.getElementById("alertadominio_Verificacion").style.display = "none";
          }, 5000);

          break;
        }  
      }
      if (!registroExiste){

        escribirTablaAutorizacion(
          descripcion_dominio_Actual,    // Dominio Actual
          DominioSelectvalue,       // Dominio
          nombre_usuario_modificacion, // Usuario Solicitante
          localISOTimeOwner,       // FECHA_SOLICITUD
          "4",                // TIPO_CAMBIO
          data.servidor,      // DATO3
          data.base,          // DATO2
          data.esquema,       // DATO1
          data.tabla,         // DATO4
          data.plataforma,    // DATA6
          clasificacionvalue, //DATA7
          window.nombreCompleto.toUpperCase() //DATA8
        );

        escribirTablaAutorizacion(
          data.clasificacion,    // Dominio Actual
          clasificacionvalue,       // Dominio
          nombre_usuario_modificacion, // Usuario Solicitante
          localISOTimeOwner,       // FECHA_SOLICITUD
          "3",                // TIPO_CAMBIO
          data.servidor,      // DATO3
          data.base,          // DATO2
          data.esquema,       // DATO1
          data.tabla,         // DATO4
          data.plataforma,    // DATA6
          clasificacionvalue, //DATA7
          window.nombreCompleto.toUpperCase() //DATA8
        );


          // Cerrar el modal
          $("#detalleModal5").modal("hide");
          showNotification("top", "center", "success", "Su solicitud ya fue enviada. En breves minutos se le aprobará su solicitud.");
      }
    }else if(clasificacionvalue == "OFICIAL"){

      if((clasificacionvalue == data.clasificacion)||(clasificacionvalue == null || clasificacionvalue.trim() == "" )||(descripcion_dominio_Actual == DominioSelectvalue)||(DominioSelectvalue == " ")){
        
      document.getElementById("alertadominio").style.display = "block";
        setTimeout(() => {
            document.getElementById("alertadominio").style.display = "none";
        }, 2000);
      }
    }
  });

  
  ///////////////////Actualizar descripcion tabla///////////////////////////////
  document.querySelector('#btndetalleTabla').addEventListener('click', function(){
    //En caso alguien registre detalle de una nueva tabla, lo actualizo en la lista 
    //y registro la visita
    if(data.detalle.replaceAll(" ", "") == ""){
      registrar_visita("EXPLORADOR DE METADATOS", "Nueva descripción de tabla");
    }else{  //Caso contrario indico que solo esta actualizando la descripcion de una tabla que
            //ya tenía descripción
      registrar_visita("EXPLORADOR DE METADATOS", "Cambiar descripción de tabla");
    }
    //Extraigo qué escribió de descripción, y en caso sea diferente a vacío, actualizo listas
    let descripción = $("#detalleTabla").val()
    if(descripción.replaceAll(" ","")!=""){
      //Si llave_tabla está en tablasoficiales solo actualizo-sino escribo todo
      if(window.tablas_oficiales[data.llave_tabla]!==undefined){
        actualizarTablasOficiales("descripcion_tabla",data.tabla,data.servidor,data.base,data.esquema,descripción)
      }else{
        escribirTablasOficiales("descripcion_tabla",data.tabla,data.plataforma,data.servidor,data.base,data.esquema,descripción)
      }
      //cambio en pantalla tablas oficiales
      if(window.tablas_oficiales[data.llave_tabla]!==undefined){
        $.each(window.tablas_oficiales,function(index,element){
          if((element["servidor"]==(data.servidor)) && (element["base"]==(data.base)) && (element["esquema"]==(data.esquema)) && (element["tabla"]==(data.tabla))  ){
            element["descripcion_tabla"]=descripción
          }
        });
      }else{
        window.tablas_oficiales[data.llave_tabla]={
          tabla:data.tabla,
          servidor:data.servidor,
          plataforma:data.plataforma,
          base:data.base,
          esquema:data.esquema,
          descripcion_dominio: " ",
          data_owner: " ",
          data_steward: " ",
          nombre_data_owner:" ",
          nombre_data_steward: " ",
          clasificacion: " ",
          descripcion_tabla: descripción
        }
      }
      //cambio en pantalla info tecnica
      $.each(window.info_tecnica,function(index,element){
        if((element["servidor"]==(data.servidor)) && (element["base"]==(data.base)) && (element["esquema"]==(data.esquema)) && (element["tabla"]==(data.tabla))  ){
          element["descripcion_tabla"]=descripción
        }
      });
      $.each(window.camposdistinct,function(index,element){
        if((element["servidor"]==(data.servidor)) && (element["base"]==(data.base)) && (element["esquema"]==(data.esquema)) && (element["tabla"]==(data.tabla))  ){
          element["descripcion_tabla"]=descripción
        }
      });
      redrawDataTableBuscadorCampos("campos",window.camposdistinct)
      $("#detalleModal8").modal("hide");
    }else{ //En caso el detalle esté vacío, hecho una alerta
      document.getElementById("alertadetalletabla").style.display="block"
      setTimeout(() => {
        document.getElementById("alertadetalletabla").style.display="none"
      }, 4000);
    }
  });
}

function eliminarDominio(cambio,tabla,servidor,base,esquema,descripcion){
  $().SPServices.SPUpdateMultipleListItems({
    async: true,
    listName: "Z_TABLAS_OFICIALES",
    batchCmd: "Delete",
    CAMLQuery: '<Query><Where>\
    <And>\
    <Eq><FieldRef Name="txt_desc_tabla"/><Value Type="Text">'+tabla+'</Value></Eq>\
    <And>\
    <Eq><FieldRef Name="txt_servidor"/><Value Type="Text">'+servidor+'</Value></Eq>\
    <And>\
    <Eq><FieldRef Name="txt_host"/><Value Type="Text">'+base+'</Value></Eq>\
    <Eq><FieldRef Name="txt_fuente_esquema"/><Value Type="Text">'+esquema+'</Value></Eq>\
    </And>\
    </And>\
    </And>\
    </Where></Query>',
    completefunc: function (xData, Status) {  
    } //completefunc
  });
}


function getEmployeeCodeByUser(){
  let codigo=''
  // let user="jsalas"//window.current_user
  let user=DEBUG || window.current_user === "aborbor" ? 'ccuenca':window.current_user
  $().SPServices({
    operation: "GetListItems",
    async: false,
    listName: "LONG_LOC_MODEL_ART",
    CAMLQuery: '<Query><Where><Or><Eq><FieldRef Name="valor8"/><Value Type="Text">'+user+"@bancoguayaquil.com"+'</Value></Eq><Eq><FieldRef Name="valor8"/><Value Type="Text">'+(user+"@bancoguayaquil.com").toUpperCase()+'</Value></Eq></Or></Where></Query>',
    CAMLViewFields: "<ViewFields>\
                    <FieldRef Name='valor4' />\
                    <FieldRef Name='valor8' />\
                    </ViewFields>",
    completefunc: function (xData, Status) {
        $(xData.responseXML).find("z\\:row").each(function () {
       
          codigo= $(this).attr("ows_valor4")          
        }); 
    }
  });
  return codigo
}
function actualizarAccesos(plataforma,servidor,base,esquema,cambio){
  var tzoffset = (new Date()).getTimezoneOffset() * 60000; //offset in milliseconds
  var localISOTime = (new Date(Date.now() - tzoffset)).toISOString().slice(0, -1).slice(0,10);
  $().SPServices.SPUpdateMultipleListItems({
    async: true,
    listName: "Z_ACC_PAG",
    batchCmd: "Update",
    CAMLQuery: '<Query><Where>\
    <And>\
    <Eq><FieldRef Name="txt_fuente_aprovisionamiento"/><Value Type="Text">'+plataforma+'</Value></Eq>\
    <And>\
    <Eq><FieldRef Name="txt_servidor"/><Value Type="Text">'+servidor+'</Value></Eq>\
    <And>\
    <Eq><FieldRef Name="txt_host"/><Value Type="Text">'+base+'</Value></Eq>\
    <Eq><FieldRef Name="txt_fuente_esquema"/><Value Type="Text">'+esquema+'</Value></Eq>\
    </And>\
    </And>\
    </And>\
    </Where></Query>',
    valuepairs: [
      ["acceso", cambio],
      ["fec_ult_actualizacion", localISOTime],
      ["ult_act_usuario", getEmployeeCodeByUser()],
     
  ],
    completefunc: function (xData, Status) {
      
    } //completefunc
  });
}
function escribirAccesos(plataforma,servidor,base,esquema,cambio){
  var tzoffset = (new Date()).getTimezoneOffset() * 60000; //offset in milliseconds
  var localISOTime = (new Date(Date.now() - tzoffset)).toISOString().slice(0, -1).slice(0,10);
  $().SPServices({
    operation: "UpdateListItems",
    async: false,
    listName:"Z_ACC_PAG",
    batchCmd: "New",
   /* CAMLQuery: '<Query><Where>\
    <And>\
    <Eq><FieldRef Name="txt_servidor"/><Value Type="Text">'+servidor+'</Value></Eq>\
    <And>\
    <Eq><FieldRef Name="txt_host"/><Value Type="Text">'+base+'</Value></Eq>\
    <Eq><FieldRef Name="txt_fuente_esquema"/><Value Type="Text">'+esquema+'</Value></Eq>\
    </And>\
    </And>\
    </Where></Query>',*/
    valuepairs: [
      ["txt_fuente_aprovisionamiento", plataforma],
      ["txt_servidor", servidor],
      ["txt_host", base],
      ["txt_fuente_esquema", esquema],
      ["acceso", cambio],
      ["fec_ult_actualizacion", localISOTime],
      ["ult_act_usuario", getEmployeeCodeByUser()],
  ],
    completefunc: function (xData, Status) {
    } //completefunc
  });
}
function actualizarDominio(cambio,tabla,servidor,base,esquema,descripcion){
  $().SPServices.SPUpdateMultipleListItems({
    async: true,
    listName: "Z_TABLAS_OFICIALES",
    batchCmd: "Update",
    CAMLQuery: '<Query><Where>\
    <And>\
    <Eq><FieldRef Name="txt_desc_tabla"/><Value Type="Text">'+tabla+'</Value></Eq>\
    <And>\
    <Eq><FieldRef Name="txt_servidor"/><Value Type="Text">'+servidor+'</Value></Eq>\
    <And>\
    <Eq><FieldRef Name="txt_host"/><Value Type="Text">'+base+'</Value></Eq>\
    <Eq><FieldRef Name="txt_fuente_esquema"/><Value Type="Text">'+esquema+'</Value></Eq>\
    </And>\
    </And>\
    </And>\
    </Where></Query>',
    valuepairs: [
      [cambio, descripcion],
     
  ],
    completefunc: function (xData, Status) {
      
    } //completefunc
  });
}

function getUserAndDate(){
  //Obtengo el usuario que está haciendo los cambios
  let usuario;
  if(window.current_user == undefined){
    usuario = obtenerUsuario();
    var current_user = usuario.current_user;
    window.current_user  = current_user;

}else{
    current_user = window.current_user;
  }  

  //Obtengo los datos de empleado asociados a ese usuario
  let datos_usuario = datos_visitante(current_user);
  //En caso no pueda obtener sus datos, pongo el nombre de usuario como codigo empleado
  if (!datos_usuario) {
      var array_datos_usuario = [current_user, " ", " "]
  } else {
      var array_datos_usuario = [datos_usuario.attr("ows_valor4"), datos_usuario.attr("ows_valor1"), datos_usuario.attr("ows_valor10")];
  }

  var tzoffset = (new Date()).getTimezoneOffset() * 60000; //offset in milliseconds
  var localISOTime = (new Date(Date.now() - tzoffset)).toISOString().slice(0, -1);

  return [array_datos_usuario, localISOTime]
}

function actualizarTablasOficiales(cambio,tabla,servidor,base,esquema,nuevo_valor){
  //Obtengo el usuario que está haciendo los cambios
  datos_usuario = getUserAndDate();
  let array_datos_usuario = datos_usuario[0];
  let localISOTime = datos_usuario[1];
  
  //Creo el array de los datos a actualizar
  let array_dato_tabla_oficial = []
  
  //Reviso que log de cambios debo editar
  let dict_log_cambios = {
    "data_owner":         ["data_owner", "nombre_data_owner", "usuario_modificacion_do", "fecha_modificacion_do"], 
    "data_steward":       ["data_steward", "nombre_data_steward", "usuario_modificacion_ds", "fecha_modificacion_ds"],
    "descripcion_tabla":  ["descripcion_tabla", "usuario_modificacion_descripcion", "fecha_modificacion_descripcion"],
    "clasificacion":      ["clasificacion", "usuario_modificacion_clasif", "fecha_modificacion_clasif"],
    "descripcion_dominio":["descripcion_dominio", "usuario_modificacion_clasif", "fecha_modificacion_clasif"],
    "etiquetas":["etiquetas", "usuario_modificacion_etiqueta", "fecha_modificacion_etiqueta"],
  }
  //Luego actualizaré los datos que ingresó el usuario
  desc_cambios = [
    [cambio,nuevo_valor], 
    ["nombre_"+cambio, window.diccionarioDT[nuevo_valor]],
    [dict_log_cambios[cambio][dict_log_cambios[cambio].length - 2], array_datos_usuario[0]], //Aqui estoy ingresando el usuario modificacion y su codigo de empleado, por ejemplo ["usuario_modificacion_do", 20234]
    [dict_log_cambios[cambio][dict_log_cambios[cambio].length - 1], localISOTime], //Aqui estoy ingresando la fecha de modificación, por ejemplo ["fecha_modificacion_do", "2024-02-21T10:27:10.686"]
  ]
  //Recorro las variables a actualizar y las actualizo
  for(var i = 0; i < dict_log_cambios[cambio].length; i++){
    for(var i_cambios = 0; i_cambios < desc_cambios.length; i_cambios++){
      if(dict_log_cambios[cambio][i] === desc_cambios[i_cambios][0]){
        array_dato_tabla_oficial.push([dict_log_cambios[cambio][i], desc_cambios[i_cambios][1]])
      }
    }
  }
  //Finalmente actualizo registro
  $().SPServices.SPUpdateMultipleListItems({
    async: true,
    listName: "Z_TABLAS_OFICIALES",
    batchCmd: "Update",
    CAMLQuery: '<Query><Where>\
    <And>\
    <Eq><FieldRef Name="txt_desc_tabla"/><Value Type="Text">'+tabla+'</Value></Eq>\
    <And>\
    <Eq><FieldRef Name="txt_servidor"/><Value Type="Text">'+servidor+'</Value></Eq>\
    <And>\
    <Eq><FieldRef Name="txt_host"/><Value Type="Text">'+base+'</Value></Eq>\
    <Eq><FieldRef Name="txt_fuente_esquema"/><Value Type="Text">'+esquema+'</Value></Eq>\
    </And>\
    </And>\
    </And>\
    </Where></Query>',
    valuepairs: array_dato_tabla_oficial,
    completefunc: function (xData, Status) { 
    }
  });
}

function escribirTablasOficiales(cambio, tabla,plataforma,servidor,base,esquema,descripcion){
  //Obtengo el usuario que está haciendo los cambios
  datos_usuario = getUserAndDate();
  let array_datos_usuario = datos_usuario[0];
  let localISOTime = datos_usuario[1];

  //Crearé el nuevo registro con casi todos los campos en blanco
  array_dato_tabla_oficial = [
    ["txt_desc_tabla", tabla],
    ["descripcion_tabla", " "],
    ["usuario_modificacion_descripcion", " "],
    ["fecha_modificacion_descripcion", " "],
    ["descripcion_dominio", " "],
    ["txt_fuente_aprovisionamiento", plataforma],
    ["txt_servidor", servidor],
    ["txt_host", base],
    ["txt_fuente_esquema", esquema],
    ["data_owner", " "],
    ["nombre_data_owner", " "],
    ["usuario_modificacion_do", " "],
    ["fecha_modificacion_do", " "],
    ["data_steward", " "],
    ["nombre_data_steward", " "],
    ["usuario_modificacion_ds", " "],
    ["fecha_modificacion_ds", " "],
    ["clasificacion", " "],
    ["usuario_modificacion_clasif", " "],
    ["fecha_modificacion_clasif", " "],
    ["etiquetas", " "],
    ["usuario_modificacion_etiqueta", " "],
    ["fecha_modificacion_etiqueta", " "],
    ["avance", " "]  
  ]
  //Reviso que log de cambios debo editar
  let dict_log_cambios = {
    "data_owner":       ["data_owner", "nombre_data_owner", "usuario_modificacion_do", "fecha_modificacion_do"], 
    "data_steward":     ["data_steward", "nombre_data_steward", "usuario_modificacion_ds", "fecha_modificacion_ds"],
    "descripcion_tabla":["descripcion_tabla", "usuario_modificacion_descripcion", "fecha_modificacion_descripcion"],
    "clasificacion":    ["clasificacion", "usuario_modificacion_clasif", "fecha_modificacion_clasif"],
    "etiquetas":["etiquetas", "usuario_modificacion_etiqueta", "fecha_modificacion_etiqueta"]
  }
  //Luego actualizaré los datos que ingresó el usuario
  desc_cambios = [
    [cambio,descripcion], 
    ["nombre_"+cambio, window.diccionarioDT[descripcion]],
    [dict_log_cambios[cambio][dict_log_cambios[cambio].length - 2], array_datos_usuario[0]], //Aqui estoy ingresando el usuario modificacion y su codigo de empleado, por ejemplo ["usuario_modificacion_do", 20234]
    [dict_log_cambios[cambio][dict_log_cambios[cambio].length - 1], localISOTime], //Aqui estoy ingresando la fecha de modificación, por ejemplo ["fecha_modificacion_do", "2024-02-21T10:27:10.686"]
  ]
  //Recorro las variables a actualizar y las actualizo
  for(var i = 0; i < array_dato_tabla_oficial.length; i++){
    for(var i_cambios = 0; i_cambios < desc_cambios.length; i_cambios++){
      if(array_dato_tabla_oficial[i][0] === desc_cambios[i_cambios][0]){
        array_dato_tabla_oficial[i][1] = desc_cambios[i_cambios][1]
      }
    }
  }
  //Finalmente escribo el nuevo registro
  $().SPServices({
    operation: "UpdateListItems",
    async: false,
    batchCmd: "New",
    listName: "Z_TABLAS_OFICIALES",
    valuepairs: array_dato_tabla_oficial,
    completefunc: function(xData, Status) {}
  })
}



//funcion para cargar los codigos de atributos
function getAtributosSelect(){
  let diccionario = {}
  let diccionarionombre={}
  let diccionarioTecnico={}
  $().SPServices({
    operation: "GetListItems",
    async: false,
    listName: "Z_DICCIONARIO_DATOS",
    CAMLQuery: '<Query><Where><Eq><FieldRef Name="tipo_metad"/><Value Type="Text">'+"ATRIBUTO"+'</Value></Eq></Where></Query>',
    CAMLViewFields: "<ViewFields>\
                    <FieldRef Name='tipo_metad' />\
                        <FieldRef Name='id_metad' />\
                        <FieldRef Name='nombre_metad' />\
                        <FieldRef Name='descripcion_metad' />\
                        <FieldRef Name='etiqueta_tecnica' />\
                    </ViewFields>",
    completefunc: function (xData, Status) {

        $(xData.responseXML).find("z\\:row").each(function () {
          let codigo= $(this).attr("ows_id_metad")
          let nombre = String($(this).attr("ows_nombre_metad"))
          let descripcion= String($(this).attr("ows_descripcion_metad"))
          let etiquetaTecnica= String($(this).attr("ows_etiqueta_tecnica") || "")
          
          diccionarionombre[nombre]=codigo
          diccionario[codigo]= [nombre,descripcion,etiquetaTecnica]
        });   
    }
  });
  return [diccionario,diccionarionombre]
}

function setSelectAtributos(){
  let selectAtributoWrapper= document.getElementById("select-atributo-wrapper")
    
    let [diccionario, diccionarionombre] = getAtributosSelect();
    let opcionesAtributos = '<option label="&nbsp;">&nbsp;</option>';
    let opcionesEtiquetaTecnica = '<option label="&nbsp;">&nbsp;</option>';
    // Obtener los nombres de los atributos y ordenarlos alfabéticamente
    let nombres = Object.keys(diccionarionombre);
    nombres.sort(function (a, b) {
      return a.localeCompare(b);
    });
    
    // Iterar sobre cada nombre y crear opciones
    nombres.forEach(nombre => {
      // Asignar el atributo title para el tooltip usando la descripción del diccionario
      let descripcion = diccionario[diccionarionombre[nombre]][1];
      let etiquetaTecnica = diccionario[diccionarionombre[nombre]][2];
      if(nombre){
        opcionesAtributos += `<option value="${diccionarionombre[nombre]}" title="${descripcion}">${nombre}</option>`;
      }
      if(etiquetaTecnica){
        opcionesEtiquetaTecnica += `<option value="${diccionarionombre[nombre]}" title="${descripcion}">${etiquetaTecnica}</option>`;
      }
      
    });
    let checkboxEtiquetaTecnica = document.createElement('input')
    checkboxEtiquetaTecnica.type = "checkbox"
    checkboxEtiquetaTecnica.id = "checkboxEtiquetaTecnica"
    checkboxEtiquetaTecnica.onchange = function(){
      ordenarSelectAtributos(opcionesAtributos, opcionesEtiquetaTecnica);
    }
    
    let labelEtiquetaTecnica = document.createElement("label")
    labelEtiquetaTecnica.classList.add("m-0")
    labelEtiquetaTecnica.textContent="Buscar por etiqueta técnica"
    
    let etiquetaTecnicaWrapper = document.createElement('div')
    etiquetaTecnicaWrapper.classList.add("d-flex", "align-items-center", "py-3", "w-80")
    etiquetaTecnicaWrapper.style.gap = ".25rem"
    etiquetaTecnicaWrapper.appendChild(checkboxEtiquetaTecnica)
    etiquetaTecnicaWrapper.appendChild(labelEtiquetaTecnica)

    // selectAtributoWrapper.appendChild(etiquetaTecnicaWrapper)
    ordenarSelectAtributos(opcionesAtributos, opcionesEtiquetaTecnica);
}

function ordenarSelectAtributos(opcionesNombre, opcionesEtiquetaTecnica){
  let etiquetaTecnicaIsChecked=$("#checkboxEtiquetaTecnica").is(':checked')
  let select = document.getElementById("atributoselect");
  if(etiquetaTecnicaIsChecked){
    select.innerHTML = opcionesEtiquetaTecnica
  }else{
    select.innerHTML = opcionesNombre
  }
}

//Funcion ordenarAtributos() - nota : Falta estilo pero ya muestra la descripcion
function ordenarAtributos() {
  var x = document.getElementById("atributoselect");
  var option;
 
  // Obtener los diccionarios de la función getAtributosSelect
  let [diccionario, diccionarionombre] = getAtributosSelect();
  
  // Obtener los nombres de los atributos y ordenarlos alfabéticamente
  let nombres = Object.keys(diccionarionombre);
  nombres.sort(function (a, b) {
    return a.localeCompare(b);
  });
 
  // Iterar sobre cada nombre y crear opciones
  nombres.forEach(nombre => {
    option = document.createElement("option");
    option.text = nombre;
    option.value = diccionarionombre[nombre];
 
    // Asignar el atributo title para el tooltip usando la descripción del diccionario
    let descripcion = diccionario[diccionarionombre[nombre]][1];
    option.title = descripcion;
 
    x.add(option);
  });
}


//funcion para cargar codigos y nombres de data owner
function getDataOwners({codigoEmpleado=null, dataOwners = false} = {}){
  let diccionario = {}
  let diccionarionombres={}
  let diccionariocorreos={}
  let diccionariousuarios={}
  //Query para obtener el registro por codigo de empleado

  let query2 = '<Query>'
  if(codigoEmpleado) {
    query2 += `<Where><Eq><FieldRef Name="valor4"/><Value Type="text">${codigoEmpleado}</Value></Eq>`
    if(dataOwners) query2 += '<And><And><Neq><FieldRef Name="valor11" /><Value Type="text">Data User</Value></Neq><Neq><FieldRef Name="valor11" /><Value Type="text">DataUser</Value></Neq></And></And></Where>'
    else query2+='</Where>'
  }else{
    if(dataOwners) query2+= '<Where><And><Neq><FieldRef Name="valor11" /><Value Type="text">Data User</Value></Neq><Neq><FieldRef Name="valor11" /><Value Type="text">DataUser</Value></Neq></And></Where>'
  }
  query2 += '</Query>'
  $().SPServices({
    operation: "GetListItems",
    async: false,
    listName: "LONG_LOC_MODEL_ART",
    CAMLQuery: query2,
    CAMLViewFields: "<ViewFields>\
                        <FieldRef Name='valor1' />\
                        <FieldRef Name='valor4' />\
                        <FieldRef Name='valor5' />\
                        <FieldRef Name='valor6' />\
                        <FieldRef Name='valor7' />\
                        <FieldRef Name='valor8' />\
                    </ViewFields>",
    completefunc: function (xData, Status) {
      //cargar data owners a options 
      //var x = document.getElementById("dataownerselect");
      var option;
        $(xData.responseXML).find("z\\:row").each(function () {
          let codigo= $(this).attr("ows_valor4")
          let grupo = $(this).attr("ows_valor1")
          let correo = $(this).attr("ows_valor8") ? $(this).attr("ows_valor8").toLowerCase() :undefined
          let namecompleto = String($(this).attr("ows_valor5"))+' '+String($(this).attr("ows_valor6"))+' '+String($(this).attr("ows_valor7"))
          diccionario[codigo]= namecompleto
          diccionarionombres[namecompleto]=codigo
          diccionariocorreos[codigo]=correo
          diccionariousuarios[correo]=codigo
        });
    }
  });

  //Validación si no existen datos del codigo del empleado
  if (codigoEmpleado && Object.keys(diccionario).length <= 0) return null; 
  return [diccionario,diccionarionombres,diccionariocorreos,diccionariousuarios]
}

function addSubdominioFichaAtributo(dominios){
  var x = document.getElementById("nombresub");

  

  let nombres = Object.values(dominios)
  nombres.sort()
  nombres.forEach(element => {
    option = document.createElement("option");
    option.text = element;
    //option.value= cod;
    x.add(option);

  });
}

function onlyUnique(value, index, self) { 
  return self.indexOf(value) === index;
}
//
function addDominiosFichaAtributo(dominios){
  var x = document.getElementById("nombred");

  

  let nombres = Object.values(dominios)
  nombres.sort()
  let arrayl=nombres.filter(onlyUnique)
  arrayl.forEach(element => {
    option = document.createElement("option");
    //option.addEventListener("click",cargarSubdominio(option))
    option.text = element;
    //option.value= cod;
    x.add(option);

  });
}



//mostrar dominios ordenados


function ordenarDominios(dominios){
  
  var x = document.getElementById("dominioselect");

  

  let nombres = Object.values(dominios)
  nombres.sort()
  nombres.forEach(element => {
    option = document.createElement("option");
    option.text = element;
    //option.value= cod;
    x.add(option);

  });
}

//mostrar data owners en orden
function ordenarDataOwners(){
  var x = document.getElementById("dataownerselect");
  //Obtengo todos los usuarios diferentes de Data User o DataUser
  let diccionarios = getDataOwners({dataOwners:true})
  //Obtengo los nombres y los ordeno
  let nombres = Object.values(diccionarios[0])
  nombres.sort()
  //Obtengo el diccionrio de codigos
  let dicnombres= diccionarios[1]

  nombres.forEach(element => {
    let cod=dicnombres[element]
    option = document.createElement("option");
    option.text = element;
    option.value= cod;
    x.add(option);

  });
}

function ordenarDataOwners2(){
  var x = document.getElementById("dataownerselect2");
  let diccodigos=window.diccionarioDT

  let nombres = Object.values(diccodigos)
  nombres.sort()
  let dicnombres=getDataOwners()[1]
  nombres.forEach(element => {
    let cod=dicnombres[element]
    option = document.createElement("option");
    option.text = element;
    option.value= cod;
    x.add(option);
  });

}

function ordenarDataOwners3(){
  var x = document.getElementById("dataselect");
  let diccodigos=window.diccionarioDT

  let nombres = Object.values(diccodigos)
  nombres.sort()
  let dicnombres=getDataOwners()[1]
  nombres.forEach(element => {
    let cod=dicnombres[element]
    option = document.createElement("option");
    option.text = element;
    option.value= cod;
    x.add(option);
  });

}


//funcion para obtener arreglo de búsqueda por campo
function setCampo(valor,arr){
  let resultados =  [];
  $.each(arr,function(index,item){
    if(valor == item.campo){
      resultados.push(item);
    }
  });
  return resultados
}

//funcion de autocompletado de BuscadorCampos.aspx
function autocompleteCampos(inp, arr) {
    //Creo la variable CurrentFocus para indicar que item está seleccionado
    var currentFocus;
    
    //Agrego un event listener para el input del usuario
    inp.addEventListener("input", function(e) {
      if(getParams("criterio") && getParams("valor")) {
        const currentUrl = new URL(window.location.href);
        // Elimina el parámetro
        currentUrl.searchParams.delete("criterio");
        currentUrl.searchParams.delete("valor");
        // Actualiza la url sin recargar la página
        window.history.replaceState(null, '', currentUrl.toString());
      }
      let ischecked=$("#switchS3").is(':checked')
      let texto = document.getElementById("dropdown-buscador").innerText.replace(" ","")
      if(texto=="Campo"){
        //Obtengo val que es el valor de la consulta
        var a, b, i, val = this.value;
        window.campo = val
        //Borro todos los resultados anteriores
        closeAllLists();
        //En caso el input esté vacío o tenga menos de tres letras, no ejecuto lo demás
        if (val.replaceAll(' ', '') == '' || window.campo.length < 3) {
          return false;
        }
        //Caso contrario
        //No le hago focus a ningun elemento aún
        currentFocus = -1;
        //Creo el bloque donde se ubicarán todos los resultados del autocompletado
        a = document.createElement("DIV");
        a.setAttribute("id", this.id + "autocomplete-list");
        a.setAttribute("class", "autocomplete-items");
        this.parentNode.appendChild(a);
        //Busco todos los resultados
        let resultados = buscarCampo(search_value = val, list = arr, servidor = window.servidor, base = window.base, esquema = window.esquema, tabla = window.tabla);
        //Escribo todos los resultados en el autocompletado
        $.each(resultados, function(index, item){
          b = document.createElement("DIV");
          b.innerHTML = item.campo; 
          b.innerHTML += "<input type='hidden' value='" + item.campo + "'>";
          //Le creo un eventlistener para el clic, que filtre la tabla y reinicie los resultados
          b.addEventListener("click", function(e) {
            inp.value = this.getElementsByTagName("input")[0].value;
            window.campo = inp.value
            //Si tengo tabla seleccionada, solo busco resultados con esos parametros exactos
            if (window.tabla.replaceAll(' ', '') != ''){
              //borrar el dt seleccionado, y luego mostrarlo
              $("#ownertitle").css("display","none")
              $("#ownertext").css("visibility","hidden")
              //AQUI MOSTRAR DATA OWNER SI HAY MAS DE 1 UN RESULTADO
              let resultados_dt= buscarCampo(search_value = window.campo, list = arr, servidor = window.servidor, base = window.base, esquema = window.esquema, tabla = window.tabla, unique = false, search_value_exact = true, tabla_exac = true)
              if(resultados_dt.length>0){
                escribirDT(resultados[0]["llave_tabla"])
              }else{
                $("#ownertitle").css("display","none")
                $("#ownertext").css("visibility","hidden")
              }
              let camposDistinct= arrayCamposDistinct(resultados_dt)
              if(ischecked){
                setDataTableBuscadorCampos(camposDistinct);
              }else{
                setDataTableBuscadorCampos(resultados_dt);
              }
            } else {
              //Caso contrario, busco en cualquier tabla pero el campo exacto
              let resultados_sin_tabla = buscarCampo(search_value = window.campo, list = arr, servidor = window.servidor, base = window.base, esquema = window.esquema, tabla = window.tabla, unique = false, search_value_exact = true)
              let camposDistinct= arrayCamposDistinct(resultados_sin_tabla)
              if(ischecked){
                setDataTableBuscadorCampos(camposDistinct);
              }else{
                setDataTableBuscadorCampos(resultados_sin_tabla);
              }
              //Si no tengo tabla seleccionada, re escribo el arbol para contar solo con las fuentes que tienen el dato
              document.getElementById("arbol_campos").innerHTML = cargar_arbol(resultados_sin_tabla)
            }
            closeAllLists();
            //Muestro el tacho
            if (!$("#campos-buscar").is(":visible")) {$("#campos-buscar").toggle();}
          });
          a.appendChild(b);
        });
        //En caso hayan muchos resultados, cambio las características del autocompletado
        if(resultados.length > 4){
          document.querySelector("#"+this.id + "autocomplete-list").style.overflowY = "scroll";
          document.querySelector("#"+this.id + "autocomplete-list").style.height = "260px";
          document.querySelector("#"+this.id + "autocomplete-list").style.background = "white";
          document.querySelector(".autocomplete-items :first-child").style.borderTopRightRadius = "unset"
          document.querySelector(".autocomplete-items :last-child").style.borderBottomRightRadius = "unset"
        }else{
          document.querySelector("#"+this.id + "autocomplete-list").style.overflowY = "unset";
          document.querySelector("#"+this.id + "autocomplete-list").style.height = "unset";
          document.querySelector("#"+this.id + "autocomplete-list").style.background = "white";
        }
      }else if(texto=="Atributo"){
        //Obtengo val que es el valor de la consulta
        var a, b, i, val = this.value;
        window.atributob = val
        //Borro todos los resultados anteriores
        closeAllLists();
        //En caso el input esté vacío o tenga menos de tres letras, no ejecuto lo demás
        if (val.replaceAll(' ', '') == '' || window.atributob.length < 3) {
          return false;
        }
        //Caso contrario
        //No le hago focus a ningun elemento aún
        currentFocus = -1;
        //Creo el bloque donde se ubicarán todos los resultados del autocompletado
        a = document.createElement("DIV");
        a.setAttribute("id", this.id + "autocomplete-list");
        a.setAttribute("class", "autocomplete-items");
        this.parentNode.appendChild(a);
        //Busco todos los resultados
        let resultados = buscarCampo(search_value = val, list = arr, servidor = window.servidor, base = window.base, esquema = window.esquema, tabla = window.tabla);
        //Escribo todos los resultados en el autocompletado
        $.each(resultados, function(index, item){
          b = document.createElement("DIV");
          b.innerHTML = item.descripcion.toUpperCase(); //CAMBIAR ESTO
          b.innerHTML += "<input type='hidden' value='" + item.descripcion.toUpperCase() + "'>";
          //Le creo un eventlistener para el clic, que filtre la tabla y reinicie los resultados
          b.addEventListener("click", function(e) {
            inp.value = this.getElementsByTagName("input")[0].value;
            window.atributob = inp.value
            //Si tengo tabla seleccionada, solo busco resultados con esos parametros exactos
            if (window.tabla.replaceAll(' ', '') != ''){
              //borrar el dt seleccionado, y luego mostrarlo
              $("#ownertitle").css("display","none")
              $("#ownertext").css("visibility","hidden")
              //AQUI MOSTRAR DATA OWNER SI HAY MAS DE 1 UN RESULTADO
              let resultados_dt= buscarCampo(search_value = window.atributob, list = arr, servidor = window.servidor, base = window.base, esquema = window.esquema, tabla = window.tabla, unique = false, search_value_exact = true, tabla_exac = true)
              if(resultados_dt.length>0){
                escribirDT(resultados[0]["llave_tabla"])
              }else{
                $("#ownertitle").css("display","none")
                $("#ownertext").css("visibility","hidden")
              }
              let camposDistinct= arrayCamposDistinct(resultados_dt)
              if(ischecked){
                setDataTableBuscadorCampos(camposDistinct);
              }else{
                setDataTableBuscadorCampos(resultados_dt);
              }
            } else {
              //Caso contrario, busco en cualquier tabla pero el campo exacto
              let resultados_sin_tabla = buscarCampo(search_value = window.atributob, list = arr, servidor = window.servidor, base = window.base, esquema = window.esquema, tabla = window.tabla, unique = false, search_value_exact = true)
              let camposDistinct= arrayCamposDistinct(resultados_sin_tabla)
              if(ischecked){
                setDataTableBuscadorCampos(camposDistinct);
              }else{
                setDataTableBuscadorCampos(resultados_sin_tabla);
              }
              //Si no tengo tabla seleccionada, re escribo el arbol para contar solo con las fuentes que tienen el dato
              document.getElementById("arbol_campos").innerHTML = cargar_arbol(resultados_sin_tabla)
            }
            closeAllLists();
            //Muestro el tacho
            if (!$("#campos-buscar").is(":visible")) {$("#campos-buscar").toggle();}
          });
          a.appendChild(b);
        });
        //En caso hayan muchos resultados, cambio las características del autocompletado
        if(resultados.length > 4){
          document.querySelector("#"+this.id + "autocomplete-list").style.overflowY = "scroll";
          document.querySelector("#"+this.id + "autocomplete-list").style.height = "260px";
          document.querySelector("#"+this.id + "autocomplete-list").style.background = "white";
          document.querySelector(".autocomplete-items :first-child").style.borderTopRightRadius = "unset"
          document.querySelector(".autocomplete-items :last-child").style.borderBottomRightRadius = "unset"
        }else{
          document.querySelector("#"+this.id + "autocomplete-list").style.overflowY = "unset";
          document.querySelector("#"+this.id + "autocomplete-list").style.height = "unset";
          document.querySelector("#"+this.id + "autocomplete-list").style.background = "white";
        }
      }else{ //TABLA
        //Obtengo val que es el valor de la consulta
        var a, b, i, val = this.value;
        window.tablab = val
        //Borro todos los resultados anteriores
        closeAllLists();
        //En caso el input esté vacío o tenga menos de tres letras, no ejecuto lo demás
        if (val.replaceAll(' ', '') == '' || window.tablab.length < 3) {
          return false;
        }
        //Caso contrario
        //No le hago focus a ningun elemento aún
        currentFocus = -1;
        //Creo el bloque donde se ubicarán todos los resultados del autocompletado
        a = document.createElement("DIV");
        a.setAttribute("id", this.id + "autocomplete-list");
        a.setAttribute("class", "autocomplete-items");
        this.parentNode.appendChild(a);
        //Busco todos los resultados
        let resultados = buscarCampo(search_value = val, list = arr, servidor = window.servidor, base = window.base, esquema = window.esquema, tabla = window.tabla);
        //Escribo todos los resultados en el autocompletado
        $.each(resultados, function(index, item){
          b = document.createElement("DIV");
          b.innerHTML = item.tabla; //CAMBIAR ESTO
          b.innerHTML += "<input type='hidden' value='" + item.tabla + "'>";
          //Le creo un eventlistener para el clic, que filtre la tabla y reinicie los resultados
          b.addEventListener("click", function(e) {
            inp.value = this.getElementsByTagName("input")[0].value;
            window.tablab = inp.value
            //Si tengo tabla seleccionada, solo busco resultados con esos parametros exactos
            if (window.tabla.replaceAll(' ', '') != ''){
              //borrar el dt seleccionado, y luego mostrarlo
              $("#ownertitle").css("display","none")
              $("#ownertext").css("visibility","hidden")
              //AQUI MOSTRAR DATA OWNER SI HAY MAS DE 1 UN RESULTADO
              let resultados_dt= buscarCampo(search_value = window.tablab, list = arr, servidor = window.servidor, base = window.base, esquema = window.esquema, tabla = window.tabla, unique = false, search_value_exact = true, tabla_exac = true)
              if(resultados_dt.length>0){
                escribirDT(resultados[0]["llave_tabla"])
              }else{
                $("#ownertitle").css("display","none")
                $("#ownertext").css("visibility","hidden")
              }
              let camposDistinct= arrayCamposDistinct(resultados_dt)
              if(ischecked){
                setDataTableBuscadorCampos(camposDistinct);
              }else{
                setDataTableBuscadorCampos(resultados_dt);
              }
            } else {
              //Caso contrario, busco en cualquier tabla pero el campo exacto
              let resultados_sin_tabla = buscarCampo(search_value = window.tablab, list = arr, servidor = window.servidor, base = window.base, esquema = window.esquema, tabla = window.tabla, unique = false, search_value_exact = true)
              let camposDistinct= arrayCamposDistinct(resultados_sin_tabla)
              if(ischecked){
                setDataTableBuscadorCampos(camposDistinct);
              }else{
                setDataTableBuscadorCampos(resultados_sin_tabla);
              }
              //Si no tengo tabla seleccionada, re escribo el arbol para contar solo con las fuentes que tienen el dato
              document.getElementById("arbol_campos").innerHTML = cargar_arbol(resultados_sin_tabla)
            }
            closeAllLists();
            //Muestro el tacho
            if (!$("#campos-buscar").is(":visible")) {$("#campos-buscar").toggle();}
          });
          a.appendChild(b);
        });
        //En caso hayan muchos resultados, cambio las características del autocompletado
        if(resultados.length > 4){
          document.querySelector("#"+this.id + "autocomplete-list").style.overflowY = "scroll";
          document.querySelector("#"+this.id + "autocomplete-list").style.height = "260px";
          document.querySelector("#"+this.id + "autocomplete-list").style.background = "white";
          document.querySelector(".autocomplete-items :first-child").style.borderTopRightRadius = "unset"
          document.querySelector(".autocomplete-items :last-child").style.borderBottomRightRadius = "unset"
        }else{
          document.querySelector("#"+this.id + "autocomplete-list").style.overflowY = "unset";
          document.querySelector("#"+this.id + "autocomplete-list").style.height = "unset";
          document.querySelector("#"+this.id + "autocomplete-list").style.background = "white";
        }
      }
    });
    //Agrego un event listener para las teclas presionadas por el usuario
    inp.addEventListener("keydown", function(e) {
      let texto = document.getElementById("dropdown-buscador").innerText.replace(" ","")
      let ischecked=$("#switchS3").is(':checked')
      if(texto=="Campo"){
        closeAllLists();
        //Obtengo el elemento de la caja de los resultados
        var x = document.getElementById(this.id + "autocomplete-list");
        //Si tiene elementos dentro, elijo todos los elementos dentro
        if (x) x = x.getElementsByTagName("div");
        //Si aplasta flecha hacia abajo, hago que el focus del elemento baje un nivel
        if (e.keyCode == 40) {
          currentFocus++;
          addActive(x);
          //Si se aplasta flecha hacia arriba, sube
        } else if (e.keyCode == 38) {
          currentFocus--;
          addActive(x);
          //Si aplasta "ENTER"
        } else if (e.keyCode == 13) {
          //Evitamos que ejecute la función que normalmente haría
          e.preventDefault();
          //Si tengo algun item seleccionado con las flechas, lo selecciono
          if (currentFocus > -1) {
            if (x){
              x[currentFocus].click()
              return false;
            }
            //Caso contrario, cargo la tabla con los resultados del elemento
            //y cierro la lista de autocompletados
          }else{ //Caso contrario, busco lo que haya escrito
            if ((window.campo.replaceAll(' ', '') != '' && window.campo.length > 2) || (window.campo.replaceAll(' ', '') == '' && window.tabla.replaceAll(' ', '') != '')){
              let val = window.campo
              let resultados
              //En caso tenga tabla seleccionada, solo muestro resultados de esa tabla exacta
              if (window.tabla.replaceAll(' ', '') != '') {
                resultados = buscarCampo(search_value = val, list = arr, servidor = window.servidor, base = window.base, esquema = window.esquema, tabla = window.tabla, unique = false, search_value_exact = false, tabla_exac = true);
                //En caso no tenga tabla seleccionada, muestro resultados de cualquier tabla
              } else {
                resultados = buscarCampo(search_value = val, list = arr, servidor = window.servidor, base = window.base, esquema = window.esquema, tabla = window.tabla, unique = false);
                //Si no tengo tabla seleccionada, re escribo el arbol para contar solo con las fuentes que tienen el dato
                document.getElementById("arbol_campos").innerHTML = cargar_arbol(resultados)
              }
              let camposDistinct= arrayCamposDistinct(resultados)
              if(ischecked){
                setDataTableBuscadorCampos(camposDistinct);
              }else{
                setDataTableBuscadorCampos(resultados);
              }
              closeAllLists();
              //Muestro el tacho
              if (!$("#campos-buscar").is(":visible")) {$("#campos-buscar").toggle();}
            }
          }
        }
      }else if(texto=="Atributo"){
        closeAllLists();
        //Obtengo el elemento de la caja de los resultados
        var x = document.getElementById(this.id + "autocomplete-list");
        //Si tiene elementos dentro, elijo todos los elementos dentro
        if (x) x = x.getElementsByTagName("div");
        //Si aplasta flecha hacia abajo, hago que el focus del elemento baje un nivel
        if (e.keyCode == 40) {
          currentFocus++;
          addActive(x);
          //Si se aplasta flecha hacia arriba, sube
        } else if (e.keyCode == 38) {
          currentFocus--;
          addActive(x);
          //Si aplasta "ENTER"
        } else if (e.keyCode == 13) {
          //Evitamos que ejecute la función que normalmente haría
          e.preventDefault();
        //Si tengo algun item seleccionado con las flechas, lo selecciono
        if (currentFocus > -1) {
          if (x){
            x[currentFocus].click()
            return false;
          }
        //Caso contrario, cargo la tabla con los resultados del elemento
        //y cierro la lista de autocompletados
        }else{
          if ((window.atributob.replaceAll(' ', '') != '' && window.atributob.length > 2) || (window.atributob.replaceAll(' ', '') == '' && window.tabla.replaceAll(' ', '') != '')){
            let val = window.atributob
           
            let resultados
            //En caso tenga tabla seleccionada, solo muestro resultados de esa tabla exacta
            if (window.tabla.replaceAll(' ', '') != '') {
              resultados = buscarCampo(search_value = val, list = arr, servidor = window.servidor, base = window.base, esquema = window.esquema, tabla = window.tabla, unique = false, search_value_exact = false, tabla_exac = true);
            //En caso no tenga tabla seleccionada, muestro resultados de cualquier tabla
            } else {
              resultados = buscarCampo(search_value = val, list = arr, servidor = window.servidor, base = window.base, esquema = window.esquema, tabla = window.tabla, unique = false);
              //Si no tengo tabla seleccionada, re escribo el arbol para contar solo con las fuentes que tienen el dato
              document.getElementById("arbol_campos").innerHTML = cargar_arbol(resultados)
            }
            let camposDistinct= arrayCamposDistinct(resultados)
            if(ischecked){
              setDataTableBuscadorCampos(camposDistinct);
            }else{
              setDataTableBuscadorCampos(resultados);
            }
          //  setDataTableBuscadorCampos(resultados);
            closeAllLists();
            //Muestro el tacho
            if (!$("#campos-buscar").is(":visible")) {$("#campos-buscar").toggle();}
          }
        }
      }
      //end atributo
      }else{
        //TABLA
        closeAllLists();
        //Obtengo el elemento de la caja de los resultados
        var x = document.getElementById(this.id + "autocomplete-list");
        //Si tiene elementos dentro, elijo todos los elementos dentro
        if (x) x = x.getElementsByTagName("div");
        //Si aplasta flecha hacia abajo, hago que el focus del elemento baje un nivel
        if (e.keyCode == 40) {
          currentFocus++;
          addActive(x);
          //Si se aplasta flecha hacia arriba, sube
        } else if (e.keyCode == 38) {
          currentFocus--;
          addActive(x);
          //Si aplasta "ENTER"
        } else if (e.keyCode == 13) {
          //Evitamos que ejecute la función que normalmente haría
          e.preventDefault();
          //Si tengo algun item seleccionado con las flechas, lo selecciono
          if (currentFocus > -1) {
            if (x){
              x[currentFocus].click()
              return false;
            }
            //Caso contrario, cargo la tabla con los resultados del elemento
            //y cierro la lista de autocompletados
          }else{
            if ((window.tablab.replaceAll(' ', '') != '' && window.tablab.length > 2) || (window.tablab.replaceAll(' ', '') == '' && window.tabla.replaceAll(' ', '') != '')){
              let val = window.tablab
              let resultados
              //Muestro resultados de cualquier tabla
              resultados = buscarCampo(search_value = val, list = arr, servidor = window.servidor, base = window.base, esquema = window.esquema, tabla = window.tabla, unique = false);
              //Re escribo el arbol para contar solo con las fuentes que tienen el dato
              document.getElementById("arbol_campos").innerHTML = cargar_arbol(resultados)
              let camposDistinct= arrayCamposDistinct(resultados)
              if(ischecked){
                setDataTableBuscadorCampos(camposDistinct);
              }else{
                setDataTableBuscadorCampos(resultados);
              }
              closeAllLists();
            //Muestro el tacho
            if (!$("#campos-buscar").is(":visible")) {$("#campos-buscar").toggle();}
          }
        }
      }
    }
  });
  
  function addActive(x) {
    //Si está vacío, no ejecuto nada
    if (!x) return false;
    //Le quito la clase activa al objeto actual
    removeActive(x);
    //Si estoy en la ultima opción, vuelvo a subir
    if (currentFocus >= x.length) currentFocus = 0;
    //Si estoy encima del primer elemento, hago que se vaya al ultimo
    if (currentFocus < 0) currentFocus = (x.length - 1);
    //Le pongo el focus al elemento actual
    x[currentFocus].classList.add("autocomplete-active");
    //Opcion que permite que al navegar por flechas la opción sea visible y de el efecto de navegación
    document.querySelector("#campos-searchautocomplete-list > div:nth-child("+ (currentFocus+1) +")").scrollIntoView({ block: "nearest", inline: "nearest" });
  }
  //Función para quitar la clase para el item activo
  function removeActive(x) {
    for (var i = 0; i < x.length; i++) {
      x[i].classList.remove("autocomplete-active");
    }
  }
  //Función para quitar todos los items diferentes a los resultados
  function closeAllLists(elmnt) {
    var x = document.getElementsByClassName("autocomplete-items");
    for (var i = 0; i < x.length; i++) {
      if (elmnt != x[i] && elmnt != inp) {
        x[i].parentNode.removeChild(x[i]);
      }
    }
  }
  //Si hago clic en el item, dejo solo el item que necesito
  document.addEventListener("click", function (e) {
    closeAllLists(e.target);
  });
}

//Funcion de carga para PoliticasProcedimientos.aspx
function politicasProcedimientos(){
  registrar_visita("POLITICAS Y PROCEDIMIENTOS", "Politicas");
  subrayar(document.getElementById("poli"));
}

//Funcion para esconder el resto y mostrar solo una opción de PoliticasProcedimientos.aspx
function togglePoliticas(id){
  registrar_visita("POLITICAS Y PROCEDIMIENTOS", capitalizarPrimeraLetra(id));
  $('.card:not(#'+ id +')').hide();
  $('#'+id).show();
  
}

function toggleOGA(id){
 // registrar_visita("POLITICAS Y PROCEDIMIENTOS", capitalizarPrimeraLetra(id));
  $('.card:not(#'+ id +')').hide();
  $('#'+id).show();
}

function subrayarPoliticas(element){
  let elementos=["poli","man","pro","pro2"]

  elementos.forEach(el => {
    let editar=document.getElementById(el)
    $(editar).css("text-decoration","none")
    $(editar).css("color","gray")
  });
  subrayar(element)
}

function listener_reducir_columnas(){
  $( document ).ready(function() {
    let col= $('#campos').DataTable();

    document.querySelector('#btncampos').addEventListener('click', () => abrirCerrar(col));
  });
}

function addDataCollapse(){
  let item= $('#campos').DataTable(); //Identifico la tabla con la que trabajaré
   //En caso tenga cargada la version recortada en vista tabla (se ve el servidor)
  if (item.column( 5 ).visible() === true){
    window.colapsado = true
    item.column( 1 ).visible( false ); //Oculto codigo
    item.column( 5 ).visible( false ); //Oculto servidor
    item.column( 6 ).visible( false ); //Oculto base
    item.column( 7 ).visible( false ); //Oculto esquema
  }else{ //Si tengo cargada la vista 
    window.colapsado = false
    item.column( 1 ).visible( true );
    item.column( 5 ).visible( true );
    item.column( 6 ).visible( true );
    item.column( 7 ).visible( true );
  }
}


function abrirCerrar(item) {
  if(!$("#switchS3").is(':checked')){
    //Si la vista tablas esta desactivada, reviso si la columna 5, "Servidor",
    //es visible. Si es visible significa que la tabla esta colapsada
    if (item.column( 5 ).visible() === true){
      window.colapsado = true
      item.column( 1 ).visible( false );
      item.column( 5 ).visible( false );
      item.column( 6 ).visible( false );
      item.column( 7 ).visible( false );
    }else{
      window.colapsado = false
      item.column( 1 ).visible( true );
      item.column( 5 ).visible( true );
      item.column( 6 ).visible( true );
      item.column( 7 ).visible( true );
    }
  }else{
    //switch encendido
    let visible=$("#columna-arbol").is(":visible")
    if(visible){
      window.colapsado=true
    }else{
      window.colapsado=false
    }
    
  }
 
}

function mostrarJerarquia(){
  $("#columna-arbol").is(":visible") ? document.getElementById("columna-datatable").className = "col-12" : document.getElementById("columna-datatable").className = "col-9";
  $("#columna-arbol").toggle();
  //if niveltabla - abrir y cerrar columnas para que se ajusten bien
  if(window.nivelTabla){
    reducirColumnasNivelTabla();//abrir
    reducirColumnasNivelTabla();//volver a nivel tabla
  }

}

function templateDesplegableArbol(input_segmentacion, valor, valorcompleto, nivel= 0){
  let valor_completo_alfanum = valorcompleto.replace(/[^a-zA-Z0-9]/g, '')
  let accion
  if (input_segmentacion == ""){
    accion = ''
  } else {
    accion = 'onclick=\"segmentarTablaCampos('+input_segmentacion+')\"'
  }
  html = '\
  <a href '+accion+' data-toggle="collapse" data-target="#collapse'+valor_completo_alfanum+'" aria-expanded="false" aria-controls="collapse'+valor_completo_alfanum+'" class="rotate-arrow-icon collapsed">\
    <i class="simple-icon-arrow-down"></i>\
    <span  id ="'+valor_completo_alfanum+'" class="d-inline-block changeable menuletra">'+valor+'</span>\
  </a>'
  if (nivel == 1){
    html += '<div id="collapse'+valor_completo_alfanum+'" class="collapse" data-parent="#menuTypes" style="">'
  } else {
    html += '<div id="collapse'+valor_completo_alfanum+'" class="collapse" style="">'
  }

  return html
}

function cargar_arbol(resultado, solo_servidor = false){

  //En caso los resultados no hayan arrojado nada, pongo todos los servidores vacíos
  if (resultado.length == 0){resultado = window.info_tecnica; solo_servidor = true}

  let servidores_unicos = [];
  resultado.forEach((t) => {
    if (!servidores_unicos.includes(t.servidor) && t.servidor.replaceAll(' ', '') != '') {
      servidores_unicos.push(t.servidor);
    }
  });
  //Empiezo por hacer una lista sin orden
  html = '<ul class="list-unstyled" id="menuTypes" style="display: block;">';
  
  //Si solo tengo que mostrar servidores, pongo el arbol de un solo nivel
  if (solo_servidor == true){
    for (var serv = 0; serv < servidores_unicos.length; serv++){
      html += '<li class="ml-0">';
      let valor_completo_alfanum = servidores_unicos[serv].replace(/[^a-zA-Z0-9]/g, '')
      html += '\
      <a href  data-toggle="collapse" data-target="#collapse'+valor_completo_alfanum+'" aria-expanded="false" aria-controls="collapse'+valor_completo_alfanum+'" class="rotate-arrow-icon collapsed">\
        <i class="simple-icon-arrow-down"></i>\
        <span class="d-inline-block">'+servidores_unicos[serv].toUpperCase()+'</span>\
      </a>'
      html += '</li>';
    }
    html += '</ul>'

    return html
  }
  
  //Caso contrario, escribo todo el esquema del árbol
  //Recorro servidores
  for (var i = 0; i < servidores_unicos.length; i++) {
    if (servidores_unicos[i] != undefined) {
      //Por cada servidor agrego un li
      html += '<li class="ml-0">';
      //Creo el desplegable
      //html += templateDesplegableArbol("", servidores_unicos[i], servidores_unicos[i],  1);
      html += templateDesplegableArbol("tabla_config='campos', servidor='"+servidores_unicos[i]+"', base='', esquema='', tabla='', recoger_filtro = false, clase=this.className ", servidores_unicos[i], servidores_unicos[i],  1);
      
      //Creo lo que va debajo del desplegable
      html += '<ul class="list-unstyled inner-level-menu">'
      let bases_array = resultado.filter(el => el.servidor === servidores_unicos[i]);
      let bases_unicas = [];
      bases_array.forEach((t) => !bases_unicas.includes(t.base) && bases_unicas.push(t.base));
      
      //Recorro bases
      for (var j = 0; j < bases_unicas.length; j++) {
        if (bases_unicas[j] != undefined) {
          //Por cada base agrego un li
          html += '<li>';
          //Creo el desplegable
          //html += templateDesplegableArbol( "", bases_unicas[j], servidores_unicos[i] + bases_unicas[j]);
          html += templateDesplegableArbol( "tabla_config='campos', servidor='"+servidores_unicos[i]+"', base ='"+bases_unicas[j]+"', esquema='', tabla='', recoger_filtro = false, clase=this.className", bases_unicas[j], servidores_unicos[i] + bases_unicas[j]);
          
          //Creo lo que va debajo del desplegable
          html += '<ul class="list-unstyled inner-level-menu">'
          let esquemas_array = bases_array.filter(el => el.base === bases_unicas[j]);
          let esquemas_unicos = [];
          esquemas_array.forEach((t) => !esquemas_unicos.includes(t.esquema) && esquemas_unicos.push(t.esquema));

          //Recorro esquemas
          for (var k = 0; k < esquemas_unicos.length; k++) {
            if (esquemas_unicos[k] != undefined) {
              //Por cada base agrego un li
              html += '<li>';
              //Creo el desplegable
              html += templateDesplegableArbol("tabla_config='campos', servidor='"+servidores_unicos[i]+"', base ='"+bases_unicas[j]+"', esquema='"+esquemas_unicos[k]+"', tabla='', recoger_filtro = false, clase=this.className", esquemas_unicos[k], servidores_unicos[i] + bases_unicas[j] + esquemas_unicos[k]);
              //html += templateDesplegableArbol("", esquemas_unicos[k], servidores_unicos[i] + bases_unicas[j] + esquemas_unicos[k]);
              
              //Creo lo que va debajo del desplegable
              html += '<ul class="list-unstyled inner-level-menu">'
              let tablas_array = esquemas_array.filter(el => el.esquema === esquemas_unicos[k]);
              let tablas_unicas = [];
              tablas_array.forEach((t) => !tablas_unicas.includes(t.tabla) && tablas_unicas.push(t.tabla));

              //Recorro tablas
              for (var l = 0; l < tablas_unicas.length; l++) {
                if (tablas_unicas[l] != undefined) {
                  //Elimino los saltos de línea de los nombres de las tablas
                  let tabla_sin_breakline_ni_corchetes = tablas_unicas[l].replaceAll('<BR>', '').replaceAll('[', '').replaceAll(']', '');
                  //Por cada base agrego un li
                  html += '<li>';
                  //Creo el item
                  input_segmentacion = "tabla_config='campos', servidor='"+servidores_unicos[i]+"', base ='"+bases_unicas[j]+"', esquema='"+esquemas_unicos[k]+"', tabla='"+tablas_unicas[l]+"'"
                  html+= '<a href="#" onclick="segmentarTablaCampos('+input_segmentacion+', recoger_filtro = false)">\
                            <i class="simple-icon-layers"></i>\
                            <span class="d-inline-block changeable menuletra">'+tabla_sin_breakline_ni_corchetes+'</span>\
                          </a>'

                  //Cierro elementos
                  html += '</li>'
                }
              }

              //Cierro elementos
              html += '</ul>'
              html += '</li>'
            }
          }

          //Cierro elementos
          html += '</ul>'
          html += '</li>'
        }
      }
      
      //Cierro elementos
      html += '</ul>'
      html += '</li>';
    }}
  
  html += '</ul>'
  return html
}

function borrarFiltrosBuscadorCampos(){
 
  //Borro el texto del buscador
  document.getElementById("campos-search").value = ''
  window.campo = ''
  window.tablab=undefined
  window.atributob=undefined
  //Reinicio los filtros
  segmentarTablaCampos(tabla_config = 'campos', servidor = 'TODOS', base = '', esquema = '', tabla = '', recoger_filtro = true);
  if(getParams("criterio") && getParams("valor")){
    // Obtén la URL actual
    const currentUrl = new URL(window.location.href);
    // Elimina el parámetro
    currentUrl.searchParams.delete("criterio");
    currentUrl.searchParams.delete("valor");
    // Actualiza la URL en el historial del navegador sin recargar la página
    window.history.replaceState(null, '', currentUrl.toString());
  }

  //Oculto el ícono
  $("#campos-buscar").toggle();
}
function cargardatos(){
  let general=getINVCasos()
  const inv_casos = general[0];
  const est=general[1]
  const estados=getEstadoDominio(inv_casos,est,validarInicioDominios())
  return [inv_casos,estados]
}
function cargar_barras(){
  //$("#buttonchart").classList.add("loader-dots")

  let actual= $("#chartdiv").css("display")
  if(actual == "none"){
    registrar_visita("LIBRO DE DOMINIOS", "Priorización");

    //cargo grafico
    //const inv_casos = getINVCasos();
    //const estados=getEstadoDominio(inv_casos)
    const inv_casos=window.inv_casos
    const estados= window.estados
    
    graficar_casos(inv_casos,estados);
    $("#chartdiv").css("display","flex")
    $(".Maestros").css("display","none")
    $(".Derivados").css("display","none")
    $(".Transaccionales").css("display","none")
    document.querySelector("#buttonchart").innerHTML="Mapa de dominios"

  }else{
    registrar_visita("LIBRO DE DOMINIOS", "Todos");

    $("#chartdiv").css("display","none")
    $(".Maestros").css("display","block")
    $(".Derivados").css("display","block")
    $(".Transaccionales").css("display","block")
    document.querySelector("#buttonchart").innerHTML="Priorización"
  }
    
}

//Sin Conexion Funcion para obtener caso de uso por id
function getINVCasos(){
  let casos = [];
  let estados=[];
  $().SPServices({
      operation: "GetListItems",
      async: false,
      listName: "Z_DOMINIOS",
      CAMLViewFields: "<ViewFields>\
                          <FieldRef Name='dominio_priorizado' />\
                          <FieldRef Name='descripcion_dominio' />\
                          <FieldRef Name='COM' />\
                          <FieldRef Name='IMPACT' />\
                          <FieldRef Name='id_dominio' />\
                      </ViewFields>",
          completefunc: function (xData, Status) {
              $(xData.responseXML).find("z\\:row").each(function () {
                          casos.push($(this));
                          let priorizado =$(this).attr("ows_dominio_priorizado")
                          if(priorizado==1){
                            estados.push("FINALIZADO")
                          }else{
                            estados.push("")
                          }
                         
                  });
              }
      })


  return [casos,estados]
}

function getEstadoDominio(casos,estados,ids){
  let x=0
    casos.forEach(element => {
      let iddom=element.attr("ows_id_dominio")
      if(estados[x]==""){
        //if(validarInicioDominios(iddom)!== undefined){//activos
        if(ids.includes(iddom)){
          estados[x]="ACTIVO"
      }else{

        estados[x]="NO INICIADO"
      }
      }
      
      x+=1;
    });
    return estados
}
function validarInicioDominios(){
  let dominio;
  let ids=[]
  $().SPServices({
    operation: "GetListItems",
    async: false,
    listName: "Z_AVANCES_DOMINIO",
   // CAMLQuery: '<Query><Where><Eq><FieldRef Name="id_dominio"/><Value Type="text">'+ id +'</Value></Eq></Where></Query>',
    CAMLViewFields: "<ViewFields>\
                          <FieldRef Name='id_dominio' />\
                    </ViewFields>",
    completefunc: function (xData, Status) {
        $(xData.responseXML).find("z\\:row").each(function () {
                dominio = $(this).attr("ows_id_dominio");
                ids.push(dominio)
        });
    }
  });
  return ids
}



function getAllDescripcionDominio(){
    let ids=[]
    $().SPServices({
      operation: "GetListItems",
      async: false,
      listName: "Z_DOMINIOS",
     // CAMLQuery: '<Query><Where><Eq><FieldRef Name="id_dominio"/><Value Type="text">'+ id +'</Value></Eq></Where></Query>',
      CAMLViewFields: "<ViewFields>\
                            <FieldRef Name='descripcion_dominio' />\
                      </ViewFields>",
      completefunc: function (xData, Status) {
          $(xData.responseXML).find("z\\:row").each(function () {
                  dominio = $(this).attr("ows_descripcion_dominio");
                  ids.push(dominio)
          });
      }
    });
    return ids
  
}

function getCasodeUso(inv){
  let queryString = window.location.search;
  let urlParams = new URLSearchParams(queryString);
  let id = urlParams.get("id");
  let caso;
  $.each(inv, function (index, item){
      if(item.attr("ows_id_caso")==id){
          caso=item;
      }
  });
  return caso
}
//funcion para graficar con Chartjs casos de uso
function graficar_casos(inv_casos,estados){

  let chartStatus = Chart.getChart("myChart"); // <canvas> id
  if (chartStatus != undefined) {
    chartStatus.destroy();
  }
  const ctx = document.getElementById('myChart');
  
  var activos= [];
  var nom_activos= [];
  var no_iniciados= [];
  var nom_no_iniciados= [];
  var finalizados= [];
  var nom_finalizados= [];
  var estado_caso = {
      'NO INICIADO': no_iniciados,
      'ACTIVO': activos,
      'FINALIZADO': finalizados
  };
  var nombres_casos = {
      'NO INICIADO': nom_no_iniciados,
      'ACTIVO': nom_activos,
      'FINALIZADO': nom_finalizados
  };
  let aux_i = 0;
  let aux_c = 0;
  let max_impacto = 0.9;
  let max_complejidad = 6;
  let iterador=0
  $.each(inv_casos, function (index, item) {
    let var1= parseFloat(parseFloat(item.attr("ows_IMPACT")).toFixed(2))
    let var2=parseFloat(parseFloat(item.attr("ows_COM")).toFixed(2))

      estado_caso[estados[iterador]].push({x:var1,
                                                 y:var2,
                                                 id:item.attr("ows_id_dominio")});
      nombres_casos[estados[iterador]].push(item.attr("ows_descripcion_dominio"));
      if (parseFloat(item.attr("ows_IMPACT"))>aux_i) {
          aux_i=parseFloat(item.attr("ows_IMPACT"));
      }
      if (parseFloat(item.attr("ows_COM"))>aux_c) {
          aux_c=parseFloat(item.attr("ows_COM"));
      }
      iterador+=1
  });
  max_impacto = aux_i;
  max_complejidad = aux_c;

let data = {
    datasets: [{
      label: "No Iniciados",
      labels: nom_no_iniciados,
      data: no_iniciados,
      pointRadius: 6,
      backgroundColor: "#717171"
    },
      {
      label: "Activos",
      labels: nom_activos,
      data: activos,
      pointRadius: 6,
      backgroundColor: "#D2006E"
    },
  {
    
      label: "Priorizados",
      labels: nom_finalizados,
      data: finalizados,
      pointRadius: 6,
      backgroundColor: "#160F41"
    
  }]
}

  var myChart = new Chart(ctx, {
      type: "scatter",
      data: data,
      options: {
        animation: {
          duration: 0
      },
        responsive: true,
        legend: {display: false},
        scales: {
          x: {
            title:{
              display:true,
              text: "Impacto",
              font: {
                weight: 'bold',
                family: 'Nunito',
                size: 18
              },
              color:"black",
              padding: 10
            },
            suggestedMin: 0,
            suggestedMax: max_impacto+1
          },
          y: {
            title:{
              display:true,
              text: "Complejidad",
              color:"black",
              font: {
                weight: 'bold',
                family: 'Nunito',
                size: 18
              },
              padding: {
                  bottom:10
              }
            },
            suggestedMin:0,
            suggestedMax: Math.round(max_complejidad + 1)
          }
        },
        plugins: {
          tooltip: {
             callbacks: {
                label: function(ctx) {
                        let label = ctx.dataset.labels[ctx.dataIndex];
                        label += " (" + ctx.parsed.x + ", " + ctx.parsed.y + ")";
                        return label;
                    }
             }
          },
          /* title: {
                    display: true,
                    text: 'Casos de Uso',
                    color: "black",
                    font: {
                      weight: 'bold',
                      family: 'Nunito',
                      size: 18
                    }
                }, */
          annotation:{
              annotations:{
                  lineaX: {
                      type: 'line',
                      yMin: 6.7,
                      yMax:6.7,
                      borderColor: '#D2006E',
                      borderWidth: 2,
                  },
                  lineaY: {
                      type: 'line',
                      yMin: 0,
                      yMax: 10,
                      xMin: 5.9,
                      xMax: 5.9,
                      borderColor: '#D2006E',
                      borderWidth: 2,
                  },
                  Grupo4: {
                      type: 'label',
                      xValue: 0.5,
                      yValue: 9.5,
                      backgroundColor: '#D2006E',
                      content: ['Grupo 4'],
                      color: "white",
                      font: {
                        size: 14,
                      },
                      borderRadius: "10"
                  },
                  Grupo2: {
                      type: 'label',
                      xValue: 9.5,
                      yValue: 9.5,
                      backgroundColor: '#D2006E',
                      content: ['Grupo 2'],
                      color: "white",
                      font: {
                        size: 14,
                      },
                      borderRadius: "10"
                  },
                  Grupo1: {
                      type: 'label',
                      xValue: 9.5,
                      yValue: 0.5,
                      backgroundColor: '#D2006E',
                      content: ['Grupo 1'],
                      color: "white",
                      font: {
                        size: 14,
                      },
                      borderRadius: "10"
                  },
                  Grupo3: {
                      type: 'label',
                      xValue: 0.5,
                      yValue: 0.5,
                      backgroundColor: '#D2006E',
                      content: ['Grupo 3'],
                      color: "white",
                      font: {
                        size: 14,
                      },
                      borderRadius: "10"
                  },
              }
          }
        },
        onClick: (e)=>{
          clickHandler(e,myChart);
          }
      }
    });
}

function clickHandler(evt, myChart) {
  const puntos = myChart.getElementsAtEventForMode(evt, 'nearest', { intersect: true }, true);

  if (!puntos.length) {
      return
  }
  //if(puntos.length>1){
      let casos = [];
      for (let index = 0; index < puntos.length; index++) {
        const primerpunto = puntos[index];
        
        const nombre = myChart.data.datasets[primerpunto.datasetIndex].labels[primerpunto.index];
        const coordenadas = myChart.data.datasets[primerpunto.datasetIndex].data[primerpunto.index];
        const estado=myChart.data.datasets[primerpunto.datasetIndex].label
        const caso = {nombre:nombre,id: coordenadas.id,estado:estado};
        casos.push(caso);
      }
      escogerCoordenadas(casos);
   
      return
  //}
  const primerpunto = puntos[0];
  const nombre = myChart.data.datasets[primerpunto.datasetIndex].labels[primerpunto.index];
  const coordenadas = myChart.data.datasets[primerpunto.datasetIndex].data[primerpunto.index];
  document.location.href = 'FichaDominio.aspx?id_dominio='+coordenadas.id;
}

function escogerCoordenadas(casos){

  let base='';
  let menu =document.getElementById("menuTypes")
  for (let index = 0; index < casos.length; index++) {
    let fichadominio='FichaDominio.aspx?id_dominio='+ casos[index].id
    let priorizado=''
    if((casos[index].estado=="No Iniciados")){
      priorizado='<a onclick="llamarb(this)" class="btn btn-outline-dark btnhover btn-multiple-state btn-xs mb-1" id="'+casos[index].id+'">\
      <div class="spinner d-inline-block">\
                                 <div class="bounce1"></div>\
                                 <div class="bounce2"></div>\
                                 <div class="bounce3"></div>\
                             </div>\
                             <span class="icon success"  id="idspam'+casos[index].id+'" data-toggle="tooltip" data-placement="top"\
                                 title="Dominio priorizado!">\
                                 <i class="simple-icon-check"></i>\
                             </span>\
                             <span class="icon fail" data-toggle="tooltip" data-placement="top"\
                                 title="Something went wrong!">\
                                 <i class="simple-icon-exclamation"></i>\
                             </span>\
                             <span class="label">Priorizar</span>\
      </a>\
  '
    }else if((casos[index].estado=="Activos")){//nada
      priorizado=''
    } else{//los priorizados los cambio a no priorizar--->no iniciados
      //priorizado='<a target="_blank" style="background:#D2006E;color:white;border:white" class="btn btn-outline-dark btn-xs mb-1" id="">Priorizado</a>'
      priorizado='<a onclick="llamarb(this)" class="btn btn-outline-dark btnhover btn-xs mb-1  btn-multiple-state" id="'+casos[index].id+'">\
      <div class="spinner d-inline-block">\
                                 <div class="bounce1"></div>\
                                 <div class="bounce2"></div>\
                                 <div class="bounce3"></div>\
                             </div>\
                             <span class="icon success" data-toggle="tooltip" id="idspam'+casos[index].id+'" data-placement="top"\
                                 title="Dominio Inactivo!">\
                                 <i class="simple-icon-check"></i>\
                             </span>\
                             <span class="icon fail" data-toggle="tooltip" data-placement="top"\
                                 title="Something went wrong!">\
                                 <i class="simple-icon-exclamation"></i>\
                             </span>\
                             <span class="label">Postergar</span>\
      </a>\
  '
   
   
    }
    
    base+='<ul class="list-unstyled" id="menuTypes" style="display: block;">\
    <li class="ml-0">\
    <div class="row" style="align-items:center;justify-content:space-between">\
             <h6 class="d-inline-block" style="padding-left:10px">'+casos[index].nombre+'</h6>\
             <div class="row" id="ficha'+casos[index].id+'" style="margin-right:10px;">\
             <a href="'+fichadominio+'"  target="_blank" class="btn btn-outline-dark btn-xs mb-1" style="margin-right:10px">Ver ficha</a>'+priorizado+
             '</div>\
             </div>\
    </li>\
  </ul>'
  /*
  if(index!= (casos.length-1)){
    base+='<hr>'
  }*/

  }
  let prompt = document.getElementById("mensaje_body");
  
  prompt.innerHTML = base;
  $('#prompt-mensaje').modal('show');
  //listenerDominios(casos)
}
function getnombredominiofromid(id){
  let dominio;
  $().SPServices({
    operation: "GetListItems",
    async: false,
    listName: "Z_DOMINIOS",
    CAMLQuery: '<Query><Where><Eq><FieldRef Name="id_dominio"/><Value Type="text">'+ id +'</Value></Eq></Where></Query>',
    CAMLViewFields: "<ViewFields>\
                          <FieldRef Name='codigo_Dominio' />\
                          <FieldRef Name='descripcion_dominio' />\
                          <FieldRef Name='Conceptos_Clave' />\
                          <FieldRef Name='descripcion' />\
                          <FieldRef Name='COM' />\
                          <FieldRef Name='IMPACT' />\
                          <FieldRef Name='tipo_dominio' />\
                          <FieldRef Name='Familia_de_Dominios' />\
                          <FieldRef Name='lider_sugerido' />\
                          <FieldRef Name='atributos_basicos' />\
                          <FieldRef Name='id_tipo_dominio' />\
                          <FieldRef Name='id_tipo_familia' />\
                          <FieldRef Name='id_dominio' />\
                          <FieldRef Name='sn_activo' />\
                          <FieldRef Name='porcentaje_avance_dominio' />\
                          <FieldRef Name='cant_atributos' />\
                          <FieldRef Name='cant_terminos' />\
                          <FieldRef Name='cant_modelos' />\
                          <FieldRef Name='cant_estructura' />\
                          <FieldRef Name='subdominios' />\
                    </ViewFields>",
    completefunc: function (xData, Status) {
        $(xData.responseXML).find("z\\:row").each(function () {
                dominio = $(this).attr("ows_descripcion_dominio");
        });
    }
  });
  return dominio

}




function llamarb(element){
 
    let id= element.getAttribute("id")
    
    if(document.getElementById(id).innerText!="Postergar"){//priorizo dominio
   
    let nombre = getnombredominiofromid(id)

    let nom= "#"+id
    var $successButton = $(nom).stateButton();
   
    $successButton.showSpinner();
      //Demonstration states with a timeout
      setTimeout(function () {
        $successButton.showSuccess(true);
     
        graficarpriorizado(nombre)
        escribirPriorizado(nombre)
        setTimeout(function () {
          $successButton.reset();
          
          // si hace click de nuevo lo postergo
          
          let padre= document.querySelector('[id="ficha'+id+'"]')
          let segundo =padre.querySelectorAll("a")[1]
          padre.removeChild(segundo)
      
          padre.innerHTML+='<a onclick="llamarb(this)" class="btn btn-outline-dark btnhover btn-multiple-state btn-xs mb-1" id="'+id+'">\
          <div class="spinner d-inline-block">\
                                     <div class="bounce1"></div>\
                                     <div class="bounce2"></div>\
                                     <div class="bounce3"></div>\
                                 </div>\
                                 <span class="icon success" data-toggle="tooltip"  data-placement="top"\
                                     title="Dominio Inactivo!">\
                                     <i class="simple-icon-check"></i>\
                                 </span>\
                                 <span class="icon fail" data-toggle="tooltip" data-placement="top"\
                                     title="Something went wrong!">\
                                     <i class="simple-icon-exclamation"></i>\
                                 </span>\
                                 <span class="label">Postergar</span>\
          </a>\
      '
      

        }, 1000);
      }, 2000);
  }else{

    //marco como inactivo escribo "priorizar"
    let nombre = getnombredominiofromid(id)

    let nom= "#"+id
    var $successButton = $(nom).stateButton();
   
    $successButton.showSpinner();
    setTimeout(function () {
      $successButton.showSuccess(true);
     //aqui funciones graficar y escribir archivo
     graficarPostergado(nombre);
     escribirPostergado(nombre);

      setTimeout(function () {
        $successButton.reset();
        let padre= document.querySelector('[id="ficha'+id+'"]')
        let segundo =padre.querySelectorAll("a")[1]
        padre.removeChild(segundo)
    
        padre.innerHTML+='<a onclick="llamarb(this)" class="btn btn-outline-dark btnhover btn-multiple-state btn-xs mb-1" id="'+id+'">\
        <div class="spinner d-inline-block">\
                                   <div class="bounce1"></div>\
                                   <div class="bounce2"></div>\
                                   <div class="bounce3"></div>\
                               </div>\
                               <span class="icon success" data-toggle="tooltip"  data-placement="top"\
                                   title="Dominio Priorizado!">\
                                   <i class="simple-icon-check"></i>\
                               </span>\
                               <span class="icon fail" data-toggle="tooltip" data-placement="top"\
                                   title="Something went wrong!">\
                                   <i class="simple-icon-exclamation"></i>\
                               </span>\
                               <span class="label">Priorizar</span>\
        </a>\
    '


  
        
     
      }, 1000);
    }, 2000);




  }



}

function graficarPostergado(nombre){
  $.each(window.inv_casos, function (index, item) {
    let var1= item.attr("ows_descripcion_dominio")
    if(nombre==var1){
      window.estados[index]="NO INICIADO"
      graficar_casos(window.inv_casos,window.estados)
    }
    index+=1
  });
}
function graficarpriorizado(nombre){
 

  $.each(window.inv_casos, function (index, item) {
    let var1= item.attr("ows_descripcion_dominio")
    if(nombre==var1){
      window.estados[index]="FINALIZADO"
      graficar_casos(window.inv_casos,window.estados)
    }
    index+=1
  });
  
}

function escribirPostergado(nombre){
  $().SPServices.SPUpdateMultipleListItems({
    async: true,
    listName: "Z_DOMINIOS",
    batchCmd: "Update",
    CAMLQuery: '<Query><Where><Eq><FieldRef Name="descripcion_dominio"/><Value Type="Text">'+nombre+'</Value></Eq></Where></Query>',
    valuepairs: [
      ["dominio_priorizado", 0],
  ],
    completefunc: function (xData, Status) {
      
    } //completefunc
  });
}

function escribirPriorizado(nombre){
 
  $().SPServices.SPUpdateMultipleListItems({
    async: true,
    listName: "Z_DOMINIOS",
    batchCmd: "Update",
    CAMLQuery: '<Query><Where><Eq><FieldRef Name="descripcion_dominio"/><Value Type="Text">'+nombre+'</Value></Eq></Where></Query>',
    valuepairs: [
      ["dominio_priorizado", 1],
  ],
    completefunc: function (xData, Status) {
      
    } //completefunc
  });
}


// MODULO DE AUTORIZACIONES
function SegmentadorAutorizacion(){
  let estado = getCatalogoOGASUITE("3");
  // Obtener valores únicos de estado
  //Extrae los valores del objeto "estado" y los coloca en un arreglo
    let lista_estados = Object.values(estado);
    styleCatalogo("#autorizacion", "#segmentador-container", lista_estados, "Estado");
}

function getAutorizaciones() {
  let datos = {};
  $().SPServices({
      operation: "GetListItems",
      async: false,
      listName: "Z_APROBACIONES",
      CAMLViewFields: "<ViewFields>\
                          <FieldRef Name='TIPO_CAMBIO' />\
                          <FieldRef Name='DATO1' />\
                          <FieldRef Name='DATO2' />\
                          <FieldRef Name='DATO3' />\
                          <FieldRef Name='DATO4' />\
                          <FieldRef Name='ORIGINAL' />\
                          <FieldRef Name='SOLICITADO' />\
                          <FieldRef Name='AUTOR_SOLICITUD' />\
                          <FieldRef Name='FECHA_SOLICITUD' />\
                          <FieldRef Name='ESTADO_APROBACION' />\
                          <FieldRef Name='AUTOR_APROBACION' />\
                          <FieldRef Name='FECHA_APROBACION' />\
                          <FieldRef Name='DATO5' />\
                          <FieldRef Name='DATO6' />\
                          <FieldRef Name='DATO7' />\
                          <FieldRef Name='DATO8' />\
                      </ViewFields>",
      completefunc: function (xData, Status) {
          $(xData.responseXML).SPFilterNode("z:row").each(function() {
                let DATO1_txt = $(this).attr("ows_DATO1") ? $(this).attr("ows_DATO1").toUpperCase().trim().replaceAll('(', '\(').replaceAll(')', '\)').replaceAll('<BR>','').replaceAll('\\','') : " ";
                let DATO2_txt = $(this).attr("ows_DATO2") ? $(this).attr("ows_DATO2").toUpperCase().trim().replaceAll('(', '\(').replaceAll(')', '\)').replaceAll('<BR>','').replaceAll('\\','') : " ";
                let DATO3_txt = $(this).attr("ows_DATO3") ? $(this).attr("ows_DATO3").toUpperCase().trim().replaceAll('(', '\(').replaceAll(')', '\)').replaceAll('<BR>','').replaceAll('\\','') : " ";
                let DATO4_txt = $(this).attr("ows_DATO4") ? $(this).attr("ows_DATO4").toUpperCase().trim().replaceAll('(', '\(').replaceAll(')', '\)').replaceAll('<BR>','').replaceAll('\\','') : " ";
                let ORIGINAL_txt =$(this).attr("ows_ORIGINAL");
                let SOLICITADO_txt = $(this).attr("ows_SOLICITADO");
                let TIPO_CAMBIO_txt = $(this).attr("ows_TIPO_CAMBIO");
                let AUTOR_SOLICITUD_txt = $(this).attr("ows_AUTOR_SOLICITUD");
                let FECHA_SOLICITUD_txt = $(this).attr("ows_FECHA_SOLICITUD");
                let ESTADO_APROBACION_txt = $(this).attr("ows_ESTADO_APROBACION");
                let llaveTablatxt = ESTADO_APROBACION_txt+"_"+ORIGINAL_txt+"_"+SOLICITADO_txt+"_"+TIPO_CAMBIO_txt+"_"+AUTOR_SOLICITUD_txt+"_"+FECHA_SOLICITUD_txt+"_"+DATO1_txt+ "_"+DATO2_txt+"_"+DATO3_txt+"_"+DATO4_txt;
                datos[llaveTablatxt]= {
                DATO1 : DATO1_txt,
                DATO2 : DATO2_txt,
                DATO3 : DATO3_txt,
                DATO4 : DATO4_txt,
                ORIGINAL: ORIGINAL_txt,
                SOLICITADO:SOLICITADO_txt,
                TIPO_CAMBIO:TIPO_CAMBIO_txt,
                AUTOR_SOLICITUD: AUTOR_SOLICITUD_txt,
                FECHA_SOLICITUD: FECHA_SOLICITUD_txt,
                ESTADO_APROBACION: ESTADO_APROBACION_txt,
                AUTOR_APROBACION: $(this).attr("ows_AUTOR_APROBACION"),
                FECHA_APROBACION: $(this).attr("ows_FECHA_APROBACION") ,
                DATO5: $(this).attr("ows_DATO5"),
                DATO6: $(this).attr("ows_DATO6"),
                DATO7: $(this).attr("ows_DATO7"),
                DATO8: $(this).attr("ows_DATO8"),
              }
          })
        }
    });
    return datos;
}

//Funcion de carga para Autorizacion.aspx
function Autorizacion_Solicitudes() {
  window.diccionarioDT=getDataOwners()[0]
  let data_tabla=[]
  let tabla_autorizacion = getAutorizaciones();
  window.tabla_autorizacion=tabla_autorizacion;
  //tablas oficiales
  let tablas_oficiales= getInfoTablasOficiales()
  window.tablas_oficiales=tablas_oficiales
  //Correos de empleados
  window.diccionarioEmpleadosCorreos=getDataOwners()[2]

  for (const [key, value] of Object.entries(tabla_autorizacion)) {
    data_tabla.push(value)
  }

  // Llamo a las otras funciones
  setDataTableAutorizacion(data_tabla);
  SegmentadorAutorizacion();
  ListenerAutorizacion(data_tabla);
}

function actualizarTablaAutorizacion(cambio,ESTADO_APROBACION,ORIGINAL,SOLICITADO,AUTOR_SOLICITUD,FECHA_SOLICITUD,TIPO_CAMBIO, DATO1, DATO2, DATO3, DATO4, nuevo_valor) {
  datos_usuario = getUserAndDate();
  let array_datos_usuario = datos_usuario[0];
  let localISOTime = datos_usuario[1];

  let array_dato_tabla_autorizacion = [];

  let dict_log_cambios = {
      "ESTADO_APROBACION": ["ESTADO_APROBACION", "AUTOR_APROBACION", "FECHA_APROBACION"],
      "DATO5": ["DATO5","AUTOR_APROBACION", "FECHA_APROBACION"],
  }

  desc_cambios = [
      [cambio, nuevo_valor],
      [dict_log_cambios[cambio][dict_log_cambios[cambio].length - 2], array_datos_usuario[0]],
      [dict_log_cambios[cambio][dict_log_cambios[cambio].length - 1], localISOTime],
  ]

  for (var i = 0; i < dict_log_cambios[cambio].length; i++) {
      for (var i_cambios = 0; i_cambios < desc_cambios.length; i_cambios++) {
          if (dict_log_cambios[cambio][i] === desc_cambios[i_cambios][0]) {
              array_dato_tabla_autorizacion.push([dict_log_cambios[cambio][i], desc_cambios[i_cambios][1]])
          }
      }
  }

  let QUERY_ORIGINAL = ORIGINAL ? `<Eq><FieldRef Name="ORIGINAL"/><Value Type="Text">${ORIGINAL}</Value></Eq>` : `<IsNull><FieldRef Name="ORIGINAL" /></IsNull>`

  let whereQuery = '<Query><Where>\
            <And>\
            <Eq><FieldRef Name="DATO1"/><Value Type="Text">' + DATO1 + '</Value></Eq>\
              <And>\
              <Eq><FieldRef Name="DATO2"/><Value Type="Text">' + DATO2 + '</Value></Eq>\
                <And>\
                <Eq><FieldRef Name="DATO3"/><Value Type="Text">' + DATO3 + '</Value></Eq>\
                  <And>\
                  <Eq><FieldRef Name="DATO4"/><Value Type="Text">' + DATO4 + '</Value></Eq>\
                  <And>\
                      <Eq><FieldRef Name="ESTADO_APROBACION"/><Value Type="Text">' + ESTADO_APROBACION + '</Value></Eq>\
                    <And>\
                      <Eq><FieldRef Name="FECHA_SOLICITUD"/><Value Type="Text">' + FECHA_SOLICITUD + '</Value></Eq>\
                      <And>\
                      <Eq><FieldRef Name="AUTOR_SOLICITUD"/><Value Type="Text">' + AUTOR_SOLICITUD + '</Value></Eq>\
                          <And>\
                          <Eq><FieldRef Name="TIPO_CAMBIO"/><Value Type="Text">' + TIPO_CAMBIO + '</Value></Eq>\
                            <And>\
                            '+ QUERY_ORIGINAL +'\
                            <Eq><FieldRef Name="SOLICITADO"/><Value Type="Text">' + SOLICITADO + '</Value></Eq>\
                            </And>\
                            </And>\
                          </And>\
                        </And>\
                    </And>\
                  </And>\
                </And>\
              </And>\
            </And>\
            </Where></Query>'

  if(TIPO_CAMBIO === "6"){
    whereQuery = 
    `<Query><Where>
      <And>\
        <And>\
          <And>\
            <And>\
              <Eq><FieldRef Name="ESTADO_APROBACION"/><Value Type="Text">${ESTADO_APROBACION}</Value></Eq>\
              <Eq><FieldRef Name="FECHA_SOLICITUD"/><Value Type="Text">${FECHA_SOLICITUD}</Value></Eq>\
            </And>\
            <And>\
              <Eq><FieldRef Name="AUTOR_SOLICITUD"/><Value Type="Text">${AUTOR_SOLICITUD}</Value></Eq>\
              <Eq><FieldRef Name="TIPO_CAMBIO"/><Value Type="Text">${TIPO_CAMBIO}</Value></Eq>\
            </And>\
          </And>\
          <And>\
            <Eq><FieldRef Name="ORIGINAL"/><Value Type="Text">${ORIGINAL}</Value></Eq>\
            <Eq><FieldRef Name="SOLICITADO"/><Value Type="Text">${SOLICITADO}</Value></Eq>\
          </And>\
        </And>\
        <And>\
          <Eq><FieldRef Name="DATO1"/><Value Type="Text">${DATO1}</Value></Eq>\
          <Eq><FieldRef Name="DATO4"/><Value Type="Text">${DATO4}</Value></Eq>\
        </And>\
      </And>\
    </Where></Query>`
  }
    $().SPServices.SPUpdateMultipleListItems({
        async: true,
        listName: "Z_APROBACIONES",
        batchCmd: "Update",
        CAMLQuery: whereQuery,
        valuepairs: array_dato_tabla_autorizacion,
        completefunc: function (xData, Status) {
          $(xData.responseXML).SPFilterNode("z:row").each(function() {
          })
        }
    });

}

function escribirTablaAutorizacion(ORIGINAL,SOLICITADO,AUTOR_SOLICITUD,FECHA_SOLICITUD,TIPO_CAMBIO, DATO1, DATO2, DATO3, DATO4,DATO6,DATO7,DATO8){

  //Crearé el nuevo registro con casi todos los campos en blanco
  array_dato_tabla_Autorizacion = [
    ["TIPO_CAMBIO", TIPO_CAMBIO],
    ["DATO3", DATO3],
    ["DATO2", DATO2],
    ["DATO1", DATO1],
    ["DATO4", DATO4],
    ["ORIGINAL", ORIGINAL],
    ["SOLICITADO", SOLICITADO],
    ["AUTOR_SOLICITUD", AUTOR_SOLICITUD],
    ["FECHA_SOLICITUD", FECHA_SOLICITUD],
    ["ESTADO_APROBACION", "PENDIENTE"],
    ["AUTOR_APROBACION", "NONE"],
    ["FECHA_APROBACION", "NONE"],
    ["DATO5", "NONE"],
    ["DATO6", DATO6],
    ["DATO7", DATO7],
    ["DATO8", DATO8]
  ]
  //Finalmente escribo el nuevo registro
  $().SPServices({
    operation: "UpdateListItems",
    async: false,
    batchCmd: "New",
    listName: "Z_APROBACIONES",
    valuepairs: array_dato_tabla_Autorizacion,
    completefunc: function(xData, Status) {}
  })
}

function Proceso_Autorizacion_Aprobar(data,dataactual) {
      var tablacambiar = data.DATO4;
      var estado = "APROBADO";
      let llavetabla = data.ESTADO_APROBACION+"_"+data.ORIGINAL + "_" + data.SOLICITADO + "_" +data.TIPO_CAMBIO + "_" +data.AUTOR_SOLICITUD + "_" + data.FECHA_SOLICITUD + "_" +data.DATO1 + "_" + data.DATO2 + "_" + data.DATO3 + "_" + data.DATO4
      let llavetabla_oficial = data.DATO1+"_" +data.DATO3+"_"+data.DATO2+"_"+data.DATO4
      //Usuario Solicitado
      var asunto_correo_owner ="Autorización de DataOwner";
      var asunto_correo_steward = "Autorización de DataSteward";
      var asunto_correo_Dominio = "Autorización de Dominio";
      var asunto_correo_Clasificacion = "Autorización de Clasificacion";
      let asuntoCorreoClasificacionAtributo = "AUTORIZACIÓN DE CLASIFICACIÓN DE ATRIBUTO"
      
      //valido si solicitado es un numero 
      if(!isNaN(data.SOLICITADO) ){
        var nombre_usuario_solicitado = window.diccionarioDT[data.SOLICITADO];
        var correo_usuario_solicitado = window.diccionarioEmpleadosCorreos[data.SOLICITADO];
        var usuario_cambio_solicitado = correo_usuario_solicitado.split("@")[0]
      }
      //Usuario Original
      if(!isNaN(data.ORIGINAL) ){
        var nombre_usuario_original = window.diccionarioDT[data.ORIGINAL];
      }

      if(!isNaN(data.AUTOR_SOLICITUD)){
        //Usuario que envio la Solicitud
        var nombre_usuario_autor_cambio = window.diccionarioDT[data.AUTOR_SOLICITUD];
        var correo_usuario_autor_cambio = window.diccionarioEmpleadosCorreos[data.AUTOR_SOLICITUD ];
        var usuario_autor_cambio = correo_usuario_autor_cambio.split("@")[0]
      }else{
        var nombre_usuario_autor_cambio = data.DATO8;
        var usuario_autor_cambio =data.AUTOR_SOLICITUD;
      }

      // Fecha y datos del usuario que modifica
      datos_usuario = getUserAndDate();
      let array_datos_usuario = datos_usuario[0];
      let nombre_usuario_modificacion = array_datos_usuario [0];
      let localISOTime = datos_usuario[1];
      let Fecha_actual = localISOTime.split("T")[0];
      if (window.tabla_autorizacion[llavetabla] !== undefined || data.TIPO_CAMBIO==="6") {
        actualizarTablaAutorizacion("ESTADO_APROBACION",data.ESTADO_APROBACION,data.ORIGINAL, data.SOLICITADO,data.AUTOR_SOLICITUD,data.FECHA_SOLICITUD,data.TIPO_CAMBIO, data.DATO1, data.DATO2, data.DATO3, data.DATO4, estado);

      }
      $.each(window.tabla_autorizacion, function(index, element) {
        if ((element["ESTADO_APROBACION"] == data.ESTADO_APROBACION)&&(element["ORIGINAL"] == data.ORIGINAL) && (element["SOLICITADO"] == data.SOLICITADO) && (element["TIPO_CAMBIO"] == data.TIPO_CAMBIO) && (element["AUTOR_SOLICITUD"] == data.AUTOR_SOLICITUD) && (element["FECHA_SOLICITUD"] == data.FECHA_SOLICITUD) && (element["DATO1"] == data.DATO1) && (element["DATO2"] == data.DATO2) && (element["DATO3"] == data.DATO3) && (element["DATO4"] == data.DATO4)) {
          element["ESTADO_APROBACION"] = estado;
          element["AUTOR_APROBACION"] = nombre_usuario_modificacion;
          element["FECHA_APROBACION"] = Fecha_actual;
        }
      });

      
      //----------------------------------------------------------------------------
      //Actualiza el Data_owner y Data_steward en la lista de tablas oficiales
      // Actualizo el data_owner en tablas oficiales
      if (data.TIPO_CAMBIO == "1") {

        if(data.ORIGINAL !=="SIN DATAOWNER"){  
            registrar_visita("TABLA DE APROBACIONES", "Aprueba actualizacion de dataowner en tabla "+ data.DATO4 + "; anterior: " + data.ORIGINAL + "; nuevo: " + data.SOLICITADO);
          }else{
            registrar_visita("TABLA DE APROBACIONES", "Aprueba asignacion de nuevo dataowner"+";"+"En tabla "+ data.DATO4+"; nuevo: " + data.SOLICITADO);
          }


        if(window.tablas_oficiales[llavetabla_oficial]!==undefined){
         actualizarTablasOficiales("data_owner", data.DATO4, data.DATO1, data.DATO2, data.DATO3, data.SOLICITADO);
        }else{
          escribirTablasOficiales("data_owner", data.DATO4,data.DATO6,data.DATO1, data.DATO2, data.DATO3, data.SOLICITADO); 
        }

        if (window.tablas_oficiales[llavetabla_oficial] !== undefined) {
          $.each(window.tablas_oficiales, function(index, element) {
              if ((element["servidor"] == data.DATO1) && (element["base"] == data.DATO2) && (element["esquema"] == data.DATO3) && (element["tabla"] == tablacambiar)) {
                element["data_owner"]=data.SOLICITADO
                element["nombre_data_owner"]=nombre_usuario_solicitado
              }
          });
        }else{
          window.tablas_oficiales[llavetabla_oficial]={
            tabla:data.DATO4,
            servidor:data.DATO1,
            plataforma:data.DATO6,
            base:data.DATO2,
            esquema:data.DATO3,
            descripcion_dominio:" ",
            data_owner: data.SOLICITADO,
            data_steward: " ",
            nombre_data_owner:nombre_usuario_solicitado,
            nombre_data_steward: " "
          }
        }

        
        //Funcion escribir lista Z_MENSAJES para los usuarios que le asignaron esa solicitud
        if(data.ORIGINAL =="SIN DATAOWNER"){
          escribirListaCorreo(
            nombre_usuario_solicitado, //nombre_persona
            usuario_cambio_solicitado, //usuario_persona
            asunto_correo_owner, //asunto_correo
            "Se ha procedido a asignar a usted como DataOwner de la tabla  "+"["+data.DATO1+"] ."+"["+data.DATO2+"] ."+"["+data.DATO3+"] ."+"["+data.DATO4+"]", //cuerpo_correo
          );
        }else{
          escribirListaCorreo(
            nombre_usuario_solicitado, //nombre_persona
            usuario_cambio_solicitado, //usuario_persona
            asunto_correo_owner, //asunto_correo
            "Se esta reemplazando Data Owner "+nombre_usuario_original+" por "+nombre_usuario_solicitado+" de la tabla: "+"["+data.DATO1+"] ."+"["+data.DATO2+"] ."+"["+data.DATO3+"] ."+"["+data.DATO4+"]",//cuerpo_correo
          );
        }
          //Funcion escrbir Lista Z_MENSAJES para los usuarios que enviaron la solicitud
          escribirListaCorreo(
            nombre_usuario_autor_cambio, //nombre_persona
            usuario_autor_cambio, //usuario_persona
            asunto_correo_owner, //asunto_correo
            "Se ha aprobado su solicitud de cambio de DataOwner en la tabla  "+"["+data.DATO1+"] ."+"["+data.DATO2+"] ."+"["+data.DATO3+"] ."+"["+data.DATO4+"]", //cuerpo_correo
          );
          // Actualizo data_steward en tablas oficiales
        } else if (data.TIPO_CAMBIO == "2") {

            if(data.ORIGINAL !== "SIN DATASTEWARD"){
              registrar_visita("TABLA DE APROBACIONES", "Aprueba actualizacion de datasteward en tabla "+ data.DATO4 + "; anterior: " + data.ORIGINAL + "; nuevo: " + data.SOLICITADO);
            }else{
              registrar_visita("TABLA DE APROBACIONES", "Aprueba asignacion de nuevo datasteward"+";"+"En tabla "+ data.DATO4+"; nuevo: " + data.SOLICITADO);
            }

            if(window.tablas_oficiales[llavetabla_oficial]!==undefined){
              actualizarTablasOficiales("data_steward", data.DATO4, data.DATO1, data.DATO2, data.DATO3, data.SOLICITADO);
            }else{
              escribirTablasOficiales("data_steward", data.DATO4,data.DATO6,data.DATO1, data.DATO2, data.DATO3, data.SOLICITADO); 
            }

            if (window.tablas_oficiales[llavetabla_oficial] !== undefined) {
              $.each(window.tablas_oficiales, function(index, element) {
                  if ((element["servidor"] == data.DATO1) && (element["base"] == data.DATO2) && (element["esquema"] == data.DATO3) && (element["tabla"] == tablacambiar)) {
                      element["data_steward"] = data.SOLICITADO;
                      element["nombre_data_steward"] = window.diccionarioDT[data.SOLICITADO];
                  }
              });
            }else{
              window.tablas_oficiales[llavetabla_oficial]={
                tabla:data.DATO4,
                servidor:data.DATO1,
                plataforma:data.DATO6,
                base:data.DATO2,
                esquema:data.DATO3,
                descripcion_dominio:" ",
                data_owner: " ",
                data_steward: data.SOLICITADO,
                nombre_data_owner:" ",
                nombre_data_steward: nombre_usuario_solicitado
              }
            }
          //Funcion escribir lista Z_MENSAJES
          if(data.ORIGINAL =="SIN DATASTEWARD"){
            escribirListaCorreo(
              nombre_usuario_solicitado, //nombre_persona
              usuario_cambio_solicitado, //usuario_persona
              asunto_correo_steward, //asunto_correo
              "Se ha procedido a asignar a usted como DataSteward de la tabla  "+"["+data.DATO1+"] ."+"["+data.DATO2+"] ."+"["+data.DATO3+"] ."+"["+data.DATO4+"]", //cuerpo_correo
            );
          }else{
            escribirListaCorreo(
              nombre_usuario_solicitado, //nombre_persona
              usuario_cambio_solicitado, //usuario_persona
              asunto_correo_steward, //asunto_correo
              "Se esta reemplazando Data Steward "+nombre_usuario_original+" por "+nombre_usuario_solicitado+" de la tabla: "+"["+data.DATO1+"] ."+"["+data.DATO2+"] ."+"["+data.DATO3+"] ."+"["+data.DATO4+"]",//cuerpo_correo
            );
          }
          //Funcion escrbir Lista Z_MENSAJES para los usuarios que enviaron la solicitud
          escribirListaCorreo(
            nombre_usuario_autor_cambio, //nombre_persona
            usuario_autor_cambio, //usuario_persona
            asunto_correo_steward, //asunto_correo
            "Se ha aprobado su solicitud de cambio de DataSteward en la tabla  "+"["+data.DATO1+"] ."+"["+data.DATO2+"] ."+"["+data.DATO3+"] ."+"["+data.DATO4+"]", //cuerpo_correo
          );

      } else if (data.TIPO_CAMBIO == "4") {

        if(data.DATO7 == "OFICIAL"){
          
          if(data.SOLICITADO !=="SIN DOMINIO"){
            registrar_visita("TABLA DE APROBACIONES", "Aprueba actualizacion del dominio en tabla "+ data.DATO4 + "; anterior: " + data.ORIGINAL + "; nuevo: " + data.SOLICITADO);
          }else{
            registrar_visita("TABLA DE APROBACIONES", "Aprueba asignacion de nuevo dominio"+";"+"en tabla "+ data.DATO4+"; nuevo: " + data.SOLICITADO);
          }
          
          if (window.tablas_oficiales[llavetabla_oficial] !== undefined) {
            actualizarTablasOficiales("clasificacion",data.DATO4, data.DATO1, data.DATO2, data.DATO3,data.DATO7)
            actualizarTablasOficiales("descripcion_dominio",data.DATO4, data.DATO1, data.DATO2, data.DATO3,data.SOLICITADO)
          }else{
            escribirTablasOficiales("clasificacion",data.DATO4,data.DATO6,data.DATO1, data.DATO2, data.DATO3,data.DATO7)
            actualizarTablasOficiales("descripcion_dominio",data.DATO4, data.DATO1, data.DATO2, data.DATO3,data.SOLICITADO)
          }


          if (window.tablas_oficiales[llavetabla_oficial] !== undefined) {
            $.each(window.tablas_oficiales, function(index, element) {
                if ((element["servidor"] == data.DATO1) && (element["base"] == data.DATO2) && (element["esquema"] == data.DATO3) && (element["tabla"] == tablacambiar)) {
                  element["clasificacion"]=data.DATO7
                  element["descripcion_dominio"]=data.SOLICITADO
                }
            });
          }else{
            window.tablas_oficiales[llavetabla_oficial]={
              tabla:data.DATO4,
              servidor:data.DATO1,
              plataforma:data.DATO6,
              base:data.DATO2,
              esquema:data.DATO3,
              descripcion_dominio:data.SOLICITADO,
              data_owner: " ",
              data_steward: " ",
              nombre_data_owner:" ",
              nombre_data_steward: " ",
              clasificacion: data.DATO7,
              descripcion_tabla: " "
            }
          }
          escribirListaCorreo(
            nombre_usuario_autor_cambio, //nombre_persona
            usuario_autor_cambio, //usuario_persona
            asunto_correo_Dominio, //asunto_correo
            "Se ha aprobado su solicitud de cambio de Dominio en la tabla "+"["+data.DATO1+"] ."+"["+data.DATO2+"] ."+"["+data.DATO3+"] ."+"["+data.DATO4+"]", //cuerpo_correo
          );


        }else{
          if(data.SOLICITADO !=="SIN CLASIFICACION"){
            registrar_visita("TABLA DE APROBACIONES", "Aprueba actualizacion de la clasificacion en tabla "+ data.DATO4 + "; anterior: " + data.ORIGINAL + "; nuevo: " + data.SOLICITADO);
          }else{
            registrar_visita("TABLA DE APROBACIONES", "Aprueba asignacion de nueva clasificacion"+";"+"En tabla "+ data.DATO4+"; nuevo: " + data.SOLICITADO);
          }
    
          let LimpiarDominio =" "
    
          if (window.tablas_oficiales[llavetabla_oficial] !== undefined) {
            actualizarTablasOficiales("clasificacion",data.DATO4, data.DATO1, data.DATO2, data.DATO3,data.SOLICITADO)
            actualizarTablasOficiales("descripcion_dominio",data.DATO4, data.DATO1, data.DATO2, data.DATO3,LimpiarDominio)
          }else{
            escribirTablasOficiales("clasificacion",data.DATO4,data.DATO6,data.DATO1, data.DATO2, data.DATO3,data.SOLICITADO)
            actualizarTablasOficiales("descripcion_dominio",data.DATO4, data.DATO1, data.DATO2, data.DATO3,LimpiarDominio)
          }


          if (window.tablas_oficiales[llavetabla_oficial] !== undefined) {
            $.each(window.tablas_oficiales, function(index, element) {
                if ((element["servidor"] == data.DATO1) && (element["base"] == data.DATO2) && (element["esquema"] == data.DATO3) && (element["tabla"] == tablacambiar)) {
                  element["clasificacion"]=data.SOLICITADO
                  element["descripcion_dominio"]=LimpiarDominio
                }
            });
          }else{
            window.tablas_oficiales[llavetabla_oficial]={
              tabla:data.DATO4,
              servidor:data.DATO1,
              plataforma:data.DATO6,
              base:data.DATO2,
              esquema:data.DATO3,
              descripcion_dominio:" ",
              data_owner: " ",
              data_steward: " ",
              nombre_data_owner:" ",
              nombre_data_steward: " ",
              clasificacion: data.SOLICITADO,
              descripcion_tabla: " "
            }
          } 
          escribirListaCorreo(
            nombre_usuario_autor_cambio, //nombre_persona
            usuario_autor_cambio, //usuario_persona
            asunto_correo_Clasificacion, //asunto_correo
            "Se ha aprobado su solicitud de cambio de Clasificacion en la tabla "+"["+data.DATO1+"] ."+"["+data.DATO2+"] ."+"["+data.DATO3+"] ."+"["+data.DATO4+"]", //cuerpo_correo
          ); 
        }
    }else if(data.TIPO_CAMBIO == "5"){
      if(data.ORIGINAL){
        registrar_visita("TABLA DE APROBACIONES", "Aprueba actualizacion de datasteward en tabla "+ data.DATO4 + "; anterior: " + data.ORIGINAL + "; nuevo: " + data.SOLICITADO);
      }else{
        registrar_visita("TABLA DE APROBACIONES", "Aprueba asignacion de nuevo datasteward"+";"+"En tabla "+ data.DATO4+"; nuevo: " + data.SOLICITADO);
      }

      if(window.tablas_oficiales[llavetabla_oficial]!==undefined){
        actualizarTablasOficiales("descripcion_tabla",data.DATO4,data.DATO1,data.DATO2,data.DATO3,data.SOLICITADO)
      }else{
        escribirTablasOficiales("descripcion_tabla",data.DATO4,data.DATO6,data.DATO1,data.DATO2,data.DATO3,data.SOLICITADO)
      }

      if (window.tablas_oficiales[llavetabla_oficial] !== undefined) {
        $.each(window.tablas_oficiales, function(index, element) {
            if ((element["servidor"] == data.DATO1) && (element["base"] == data.DATO2) && (element["esquema"] == data.DATO3) && (element["tabla"] == tablacambiar)) {
                element["descripcion_tabla"] = data.SOLICITADO;
            }
        });
      }else{
        window.tablas_oficiales[llavetabla_oficial]={
          tabla:data.DATO4,
          servidor:data.DATO1,
          plataforma:data.DATO6,
          base:data.DATO2,
          esquema:data.DATO3,
          descripcion_dominio:" ",
          data_owner: " ",
          data_steward: " ",
          nombre_data_owner:" ",
          nombre_data_steward: " ",
          descripcion_tabla: data.SOLICITADO
        }
      }
    //Funcion escribir lista Z_MENSAJES
    if(!data.ORIGINAL){
      escribirListaCorreo(
        nombre_usuario_solicitado, //nombre_persona
        usuario_cambio_solicitado, //usuario_persona
        asunto_correo_steward, //asunto_correo
        "Se ha procedido a asignar una descripción a la tabla  "+"["+data.DATO1+"] ."+"["+data.DATO2+"] ."+"["+data.DATO3+"] ."+"["+data.DATO4+"]", //cuerpo_correo
      );
    }else{
      escribirListaCorreo(
        nombre_usuario_solicitado, //nombre_persona
        usuario_cambio_solicitado, //usuario_persona
        asunto_correo_steward, //asunto_correo
        "Se esta reemplazando la descripción de la tabla: "+"["+data.DATO1+"] ."+"["+data.DATO2+"] ."+"["+data.DATO3+"] ."+"["+data.DATO4+"]",//cuerpo_correo
      );
    }
    //Funcion escrbir Lista Z_MENSAJES para los usuarios que enviaron la solicitud
    escribirListaCorreo(
      nombre_usuario_autor_cambio, //nombre_persona
      usuario_autor_cambio, //usuario_persona
      asunto_correo_steward, //asunto_correo
      "Se ha aprobado su solicitud de cambio de descripción en la tabla  "+"["+data.DATO1+"] ."+"["+data.DATO2+"] ."+"["+data.DATO3+"] ."+"["+data.DATO4+"]", //cuerpo_correo
    );
    }else if(data.TIPO_CAMBIO === "6"){
      //Hacer cambios en Z_DICCIONARIO_DATOS del nombre y descripción del atributo
      let values = [[data.DATO4.toLowerCase(),data.SOLICITADO]]
      $().SPServices.SPUpdateMultipleListItems({
        async: true,
        listName: "Z_DICCIONARIO_DATOS",
        batchCmd: "Update",
        CAMLQuery: `<Query>\
                      <Where>\
                        <And>\
                          <Eq><FieldRef Name="id_metad"/><Value Type="Text">${data.DATO1}</Value></Eq>\
                          <Eq><FieldRef Name="tipo_metad"/><Value Type="Text">ATRIBUTO</Value></Eq>\
                        </And>\
                      </Where>\
                    </Query>`,
        valuepairs: values,
        completefunc: function (xData, Status) {
          let atributosJSON=listToObject({lista:getAtributosAdministrar(), parametroClave:"id"})

          escribirListaCorreo(
            nombre_usuario_autor_cambio, //nombre_persona
            usuario_autor_cambio, //usuario_persona
            asuntoCorreoClasificacionAtributo, //asunto_correo
            `Se ha aprobado su solicitud de clasificacion del atributo ${atributosJSON[data.DATO1] || ""}`, //cuerpo_correo
          );
        } //completefunc
        });
        
    }
    $.each(dataactual, function(index, element) {
      if ((element["ESTADO_APROBACION"] == data.ESTADO_APROBACION) && (element["ORIGINAL"] == data.ORIGINAL) && (element["SOLICITADO"] == data.SOLICITADO) && (element["TIPO_CAMBIO"] == data.TIPO_CAMBIO) && (element["AUTOR_SOLICITUD"] == data.AUTOR_SOLICITUD) && (element["FECHA_SOLICITUD"] == data.FECHA_SOLICITUD) && (element["DATO1"] == data.DATO1) && (element["DATO2"] == data.DATO2) && (element["DATO3"] == data.DATO3) && (element["DATO4"] == data.DATO4)) {
        element["ESTADO_APROBACION"] = estado;
        element["AUTOR_APROBACION"] = nombre_usuario_modificacion;
        element["FECHA_APROBACION"] = Fecha_actual;
      }
    });
    redrawDataTable("autorizacion", dataactual)
    // Muestra la notificación
    showNotification("top", "center", "success","Su solicitud ha sido aprobada con éxito.");
}

function Proceso_Autorizacion_Rechazar(data,dataactual) {

  var tablacambiar = data.DATO4;
  var estado = "RECHAZADO";
  let llavetabla = data.ESTADO_APROBACION+"_"+data.ORIGINAL + "_" + data.SOLICITADO + "_" +data.TIPO_CAMBIO + "_" +data.AUTOR_SOLICITUD + "_" + data.FECHA_SOLICITUD + "_" +data.DATO1 + "_" + data.DATO2 + "_" + data.DATO3 + "_" + data.DATO4
  
    // Asunto de correos y para modal de rechazar 
    var asunto_correo_owner ="AUTORIZACIÓN DE DATAOWNER";
    var asunto_correo_steward = "AUTORIZACIÓN DE DATASTEWARD";
    var asunto_correo_Dominio = "AUTORIZACIÓN DE DOMINIO";
    var asunto_correo_Clasificacion = "AUTORIZACIÓN DE CLASIFICACION";
    var asunto_correo_Descripcion = "AUTORIZACIÓN DE DESCRIPCIÓN";

    let asuntoCorreoClasificacionAtributo = "AUTORIZACIÓN DE CLASIFICACIÓN DE ATRIBUTO"

    // Cambio de id de empleado a nombre : 
    if (!isNaN(data.SOLICITADO)) {
      var nombre_usuario_solicitado = window.diccionarioDT[data.SOLICITADO];
    }else{
      //Si no es un numero , muestra el dato y lo convierte en mayuscula , esto se lo coloco especialmente para los dominios.
      var nombre_usuario_solicitado = data.SOLICITADO.toUpperCase();
    }

    if (!isNaN(data.ORIGINAL)) {
      var nombre_usuario_original = window.diccionarioDT[data.ORIGINAL];
    }else{
      
      var nombre_usuario_original = data.ORIGINAL;
    }
   // Texto Modal
    if (data.TIPO_CAMBIO == "1") {
      $("#AccionModalLabel").html("<strong>ACCION:</strong> <br>" + asunto_correo_owner);
      $("#EntidadModalLabel").html("<strong>ENTIDAD:</strong> <br> " + "[" + data.DATO1 + "] ." + "[" + data.DATO2 + "] ." + "[" + data.DATO3 + "] ." + "[" + data.DATO4 + "]");
      $("#AnteriorModalLabel").html("<strong>ANTERIOR:</strong> <br>" + nombre_usuario_original);
      $("#NuevoModalLabel").html("<strong>NUEVO:</strong> <br> " + nombre_usuario_solicitado);
    } else if (data.TIPO_CAMBIO == "2") {
      $("#AccionModalLabel").html("<strong>ACCION:</strong> <br>" + asunto_correo_steward);
      $("#EntidadModalLabel").html("<strong>ENTIDAD:</strong> <br> " + "[" + data.DATO1 + "] ." + "[" + data.DATO2 + "] ." + "[" + data.DATO3 + "] ." + "[" + data.DATO4 + "]");
      $("#AnteriorModalLabel").html("<strong>ANTERIOR:</strong> <br>"+ nombre_usuario_original);
      $("#NuevoModalLabel").html("<strong>NUEVO:</strong> <br> " + nombre_usuario_solicitado);
    } else if (data.TIPO_CAMBIO == "4") {
      if (data.DATO7 == "OFICIAL") {
        $("#AccionModalLabel").html("<strong>ACCION:</strong> <br>" + asunto_correo_Dominio);
        $("#EntidadModalLabel").html("<strong>ENTIDAD:</strong> <br> " + "[" + data.DATO1 + "] ." + "[" + data.DATO2 + "] ." + "[" + data.DATO3 + "] ." + "[" + data.DATO4 + "]");
        $("#AnteriorModalLabel").html("<strong>ANTERIOR:</strong> <br>"+ nombre_usuario_original);
        $("#NuevoModalLabel").html("<strong>NUEVO:</strong> <br> " + nombre_usuario_solicitado);
      } else {
        $("#AccionModalLabel").html("<strong>ACCION:</strong> <br>" + asunto_correo_Clasificacion);
        $("#EntidadModalLabel").html("<strong>ENTIDAD:</strong> <br> " + "[" + data.DATO1 + "] ." + "[" + data.DATO2 + "] ." + "[" + data.DATO3 + "] ." + "[" + data.DATO4 + "]");
        $("#AnteriorModalLabel").html("<strong>ANTERIOR:</strong> <br>"+ nombre_usuario_original);
        $("#NuevoModalLabel").html("<strong>NUEVO:</strong> <br> " + nombre_usuario_solicitado);
      }
    }else if(data.TIPO_CAMBIO == "5"){
      $("#AccionModalLabel").html("<strong>ACCION:</strong> <br>" + asunto_correo_Descripcion);
      $("#EntidadModalLabel").html("<strong>ENTIDAD:</strong> <br> " + "[" + data.DATO1 + "] ." + "[" + data.DATO2 + "] ." + "[" + data.DATO3 + "] ." + "[" + data.DATO4 + "]");
      $("#AnteriorModalLabel").html("<strong>ANTERIOR:</strong> <br>"+ nombre_usuario_original);
      $("#NuevoModalLabel").html("<strong>NUEVO:</strong> <br> " + nombre_usuario_solicitado);
    }

   // Abre el modal
    $('#motivoModalRechazado').modal('show');

    // Limpia el campo de texto cuando se muestre el modal
    $('#motivoModalRechazado').on('shown.bs.modal', function () {
      $('#motivoTexto').val(''); // Establece el valor del campo de texto a una cadena vacía
    });

    // Maneja la acción de confirmar rechazo
    $('#confirmarRechazo').off('click').on('click', function() {
      var motivo = $('#motivoTexto').val();
      
      if (motivo.trim() === "") {
        alert("Por favor, ingresa un motivo para el rechazo.");
        return;
      }

  //Usuario que envio la Solicitud
 if(!isNaN(data.AUTOR_SOLICITUD)){
    //Usuario que envio la Solicitud
    var nombre_usuario_autor_cambio = window.diccionarioDT[data.AUTOR_SOLICITUD];
    var correo_usuario_autor_cambio = window.diccionarioEmpleadosCorreos[data.AUTOR_SOLICITUD ];
    var usuario_autor_cambio = correo_usuario_autor_cambio.split("@")[0]
  }else{
    //Si no es numero uso la funcion de obtener nombre a partir del nombre de usuario
    var nombre_usuario_autor_cambio = data.DATO8;
    var usuario_autor_cambio =data.AUTOR_SOLICITUD
  }
  // Fecha y datos del usuario que modifica
  datos_usuario = getUserAndDate();
  let array_datos_usuario = datos_usuario[0];
  let nombre_usuario_modificacion = array_datos_usuario [0];
  let localISOTime = datos_usuario[1];
  let Fecha_actual = localISOTime.split("T")[0];

  if (window.tabla_autorizacion[llavetabla] !== undefined || data.TIPO_CAMBIO==="6") {
    actualizarTablaAutorizacion("DATO5",data.ESTADO_APROBACION,data.ORIGINAL, data.SOLICITADO,data.AUTOR_SOLICITUD,data.FECHA_SOLICITUD,data.TIPO_CAMBIO, data.DATO1, data.DATO2, data.DATO3, data.DATO4, motivo);
    actualizarTablaAutorizacion("ESTADO_APROBACION",data.ESTADO_APROBACION,data.ORIGINAL, data.SOLICITADO,data.AUTOR_SOLICITUD,data.FECHA_SOLICITUD,data.TIPO_CAMBIO, data.DATO1, data.DATO2, data.DATO3, data.DATO4, estado);
  }
  
  if (data.TIPO_CAMBIO == "1") {

    escribirListaCorreo(
      nombre_usuario_autor_cambio, //nombre_persona
      usuario_autor_cambio, //usuario_persona
      asunto_correo_owner, //asunto_correo
      "Se ha rechazado su solicitud de cambio de DataOwner en la tabla  "+"["+data.DATO1+"] ."+"["+data.DATO2+"] ."+"["+data.DATO3+"] ."+"["+data.DATO4+"]"+" por el motivo: "+motivo, //cuerpo_correo
    );

  } else if(data.TIPO_CAMBIO == "2") {
    
      escribirListaCorreo(
        nombre_usuario_autor_cambio, //nombre_persona
        usuario_autor_cambio, //usuario_persona
        asunto_correo_steward, //asunto_correo
        "Se ha rechazado su solicitud de cambio de DataSteward en la tabla "+"["+data.DATO1+"] ."+"["+data.DATO2+"] ."+"["+data.DATO3+"] ."+"["+data.DATO4+"]"+" por el motivo: "+motivo, //cuerpo_correo
      );
  }else if(data.TIPO_CAMBIO == "4") {
    if (data.DATO7 == "OFICIAL") {
      escribirListaCorreo(
        nombre_usuario_autor_cambio, //nombre_persona
        usuario_autor_cambio, //usuario_persona
        asunto_correo_Dominio, //asunto_correo
        "Se ha rechazado su solicitud de cambio de dominio en la tabla "+"["+data.DATO1+"] ."+"["+data.DATO2+"] ."+"["+data.DATO3+"] ."+"["+data.DATO4+"]"+" por el motivo: "+motivo, //cuerpo_correo
      );
    }else{
      escribirListaCorreo(
        nombre_usuario_autor_cambio, //nombre_persona
        usuario_autor_cambio, //usuario_persona
        asunto_correo_Clasificacion, //asunto_correo
        "Se ha rechazado su solicitud de cambio de clasificacion en la tabla "+"["+data.DATO1+"] ."+"["+data.DATO2+"] ."+"["+data.DATO3+"] ."+"["+data.DATO4+"]"+" por el motivo: "+motivo, //cuerpo_correo
      );
    }
  }else if(data.TIPO_CAMBIO == "5"){
    escribirListaCorreo(
      nombre_usuario_autor_cambio, //nombre_persona
      usuario_autor_cambio, //usuario_persona
      asunto_correo_steward, //asunto_correo
      "Se ha rechazado su solicitud de cambio de Descripción en la tabla "+"["+data.DATO1+"] ."+"["+data.DATO2+"] ."+"["+data.DATO3+"] ."+"["+data.DATO4+"]"+" por el motivo: "+motivo, //cuerpo_correo
    );
  }else if(data.TIPO_CAMBIO === "6"){
    //Hacer cambios en Z_DICCIONARIO_DATOS del nombre y descripción del atributo
    let atributosJSON=listToObject({lista:getAtributosAdministrar(), parametroClave:"id"})
    escribirListaCorreo(
      nombre_usuario_autor_cambio, //nombre_persona
      usuario_autor_cambio, //usuario_persona
      asuntoCorreoClasificacionAtributo, //asunto_correo
      `Se ha rechazado su solicitud de clasificacion del atributo ${atributosJSON[data.DATO2] || ""} por el motivo: ${motivo}`, //cuerpo_correo
    );
    
  }
  $.each(window.tabla_autorizacion, function(index, element) {
    if ((element["ESTADO_APROBACION"] == data.ESTADO_APROBACION)&&(element["ORIGINAL"] == data.ORIGINAL) && (element["SOLICITADO"] == data.SOLICITADO) && (element["TIPO_CAMBIO"] == data.TIPO_CAMBIO) && (element["AUTOR_SOLICITUD"] == data.AUTOR_SOLICITUD) && (element["FECHA_SOLICITUD"] == data.FECHA_SOLICITUD) && (element["DATO1"] == data.DATO1) && (element["DATO2"] == data.DATO2) && (element["DATO3"] == data.DATO3) && (element["DATO4"] == data.DATO4)) {
      element["ESTADO_APROBACION"] = estado;
      element["AUTOR_APROBACION"] = nombre_usuario_modificacion;
      element["FECHA_APROBACION"] = Fecha_actual;
      element["DATO5"] = motivo;
    }
  });
  $.each(dataactual, function(index, element) {
    if ((element["ESTADO_APROBACION"] == data.ESTADO_APROBACION)&&(element["ORIGINAL"] == data.ORIGINAL) && (element["SOLICITADO"] == data.SOLICITADO) && (element["TIPO_CAMBIO"] == data.TIPO_CAMBIO) && (element["AUTOR_SOLICITUD"] == data.AUTOR_SOLICITUD) && (element["FECHA_SOLICITUD"] == data.FECHA_SOLICITUD) && (element["DATO1"] == data.DATO1) && (element["DATO2"] == data.DATO2) && (element["DATO3"] == data.DATO3) && (element["DATO4"] == tablacambiar)) {
      element["ESTADO_APROBACION"] = estado;
      element["AUTOR_APROBACION"] = nombre_usuario_modificacion;
      element["FECHA_APROBACION"] = Fecha_actual;
      element["DATO5"] = motivo;
    }
  });
  redrawDataTable("autorizacion", dataactual)
  showNotification("top", "center", "danger", "Su solicitud ha sido rechazada con éxito.");
  // Cierra el modal
  $('#motivoModalRechazado').modal('hide');
  });
  }

  function ListenerAutorizacion(dataactual) {
    //BTN APROBADO
    //configura un evento de clic en los botones de aprobación y rechazo
    $('#autorizacion tbody').on('click', '.botonAceptar', function() {
      var table = $('#autorizacion').DataTable();
      var data = table.row($(this).closest('tr')).data();
      Proceso_Autorizacion_Aprobar(data,dataactual);
    });

    //BTN RECHAZADO
    $('#autorizacion tbody').on('click', '.botonDenegar', function() {
      var table = $('#autorizacion').DataTable();
      var data = table.row($(this).closest('tr')).data();
      Proceso_Autorizacion_Rechazar(data,dataactual);
    });
  }

//Tabla autorizaciones
  function setDataTableAutorizacion(data_tabla){
    let catalogos = getCatalogoOGASUITE("2");
    let catalogoClasificaciones = window.clasificacion_entidades_pendientes?? getCatalogoOGASUITE("6") 
    var table = $('#autorizacion').DataTable({
      data: data_tabla,
      paging: true,
      colResize: {
        isEnabled: true,
        hasBoundCheck: false
      },
      
      lengthChange: true,
      info: true,
      scrollX: true,
      scrollCollapse: true,
      scrollY: 'calc(50vh)',
      autoWidth: false,
      deferRender: true,
      
      dom: 'fBtlip',
      autoWidth: true,
      columnDefs: [
        { targets: 10, width: "300px" },
        { targets: 9, width: "80px" },
        { targets: 8, width: "200px" },
        { targets: 7, width: "200px" },
        { targets: 6, width: "200px" },
        { targets: 5, width: "200px" },
        { targets: 4, width: "550px" },
        { targets: 3, width: "70px" },
        { targets: 2, width: "80px" },
        { targets: 1, width: "130px" },
        { targets: 0, width: "80px" },
        { targets: '_all', width: "100px" }
      ],
      buttons: [              
          {
          text: '<i class="simple-icon-close style="font-size: 50px;" data-toggle="tooltip" title="Rechazar todos"></i>',
          className: 'btn-denegar-todos',
          action: function (e, dt, node, config) {
              
            //Obtengo todas las filas visibles
            //.nodes() : Obtiene los nodos DOM de las filas seleccionadas
            //.to$() : Converte los nodos en un objeto jquery , para utilizar todas las funciones y metodos jquery
            //Busca las filas que esten marcadas.
            var filas = dt.rows({ 'search': 'applied' }).nodes().to$();
            
            // Variable para almacenar las filas seleccionadas
            var filasSeleccionadas = [];
            
            // Iterar sobre cada fila y actualizar el estado si el checkbox está marcado
            filas.each(function () {
              //Busca los elementos con <input> de tipo checkbox que son descendientes del elemento this.
              var checkbox = $(this).find('input[type="checkbox"]');
              //.prop : Obtiene las propiedades de los elementos seleccionados.
              //verifica si el checkbox esta marcado
              if (checkbox.prop('checked')) {
                //obtiene los datos de las filas seleccionadas y las asigno a la variable data
                var data = dt.row(this).data();
                //Añade los datos de las filas seleccionadas al array filasSeleccionadas para manipular facil los datos de las filas.
                filasSeleccionadas.push(data);
              }
            });
        
            // Función para mostrar el modal y procesar el rechazo
            function mostrarModalRechazo(index) {
              // si Index es mayor o igual a filas seleccionadas se detiene la recursion.
                if (index >= filasSeleccionadas.length) {
                  return; // Fin de la recursión
                }
                // Obtiene los datos de cada uno de los indices, en este caso permite trabajar para cada indice y se ejecuta el resto del codigo 
                //para cada indice .
                var data = filasSeleccionadas[index];
                //funcion para rechazar
                Proceso_Autorizacion_Rechazar(data,data_tabla)
                // $('#motivoModalRechazado').modal('hide') :  Cierra el modal
                $('#motivoModalRechazado').modal('hide').on('hidden.bs.modal', function () {
                  //Una ves que se haya rechazado todos los que se marcaron , se apaga el evento hidden.bs.modal para que no se siga abriendo el modal una ves que haya terminado.
                    $(this).off('hidden.bs.modal'); 
                  //una ves que se rechace el primer indice , se le suma 1 para que siga el siguiente.                    
                    mostrarModalRechazo(index + 1);
                });
            }
              // Inicia la cadena de modales
              // Si filasSeleccionadas es mayor a 0 
              if (filasSeleccionadas.length > 0) {
              // Si es asi , empieza con el modal con indice 0
                mostrarModalRechazo(0);
              }
            }
          },
          {
          text: '<i class="simple-icon-check style="font-size: 50px;" data-toggle="tooltip" title="Aprobar todos"></i>',
          className: 'btn-aprobar-todos',
          action: function (e, dt, node, config) {

                  //Obtengo todas las filas visibles
                  //.nodes() : Obtiene los nodos DOM de las filas seleccionadas
                  //.to$() : Converte los nodos en un objeto jquery , para utilizar todas las funciones y metodos jquery
                  //Busca las filas que esten marcadas.
              var filas = dt.rows({ 'search': 'applied' }).nodes().to$();
                  // Iterar sobre cada fila y actualizar el estado si el checkbox está marcado
              filas.each(function () {
                  //Busca los elementos con <input> de tipo checkbox que son descendientes del elemento this.
                  var checkbox = $(this).find('input[type="checkbox"]');
                  //.prop : Obtiene las propiedades de los elementos seleccionados.
                  //verifica si el checkbox esta marcado 
                  if (checkbox.prop('checked')) {
                  //obtiene los datos de las filas seleccionadas y las asigno a la variable data
                      var data = dt.row(this).data();
                      Proceso_Autorizacion_Aprobar(data,data_tabla);
                }
            });
          }
          },
          {
            text: '',
            className: 'btn-seleccionar-todos',
            action: function (e, dt, node, config) {

               // Obtener el estado actual del botón 'Seleccionar todos'
               //verifica si la clase es "checked" , si es asi es true caso contrario es false
                var isChecked = $(node).hasClass('checked');

                // Obtener todas las filas visibles
                //Busca los checkbox que esten marcados y las asigna en la variable fila
                var filas = dt.rows({ search: 'applied' }).nodes();
        
                // Recorrer las filas visibles
                $(filas).each(function () {
                    // Selecciona el checkbox en la fila si no está deshabilitado
                    // .prop : Permite obtener o cambiar la propiedades de un elemento.
                    // En este caso cambia la propiedad de checked a !isChecked viceversa , Si los checkbox estan marcados y el boton btn-seleccionar-todos esta marcado , al desmarcarlo 
                    // todos los checkbox se desmarcan y viceversa. 
                    $(this).find('input[type="checkbox"]:not(:disabled)').prop('checked', !isChecked);
                });
        
                // Añadir o quitar la clase 'checked' al botón seleccionar todos
                $(node).toggleClass('checked');
            },
              
              init: function (dt, node, config) {
              // Se agrega un atributo "title" al elemento node que es el boton de marcar y desmarcar . Esto permite agregarle un tooltip al botón
              $(node).attr('title', 'Marcar todos / Desmarcar todos');
            }
          },
          {
            extend: 'excel',
            text: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-filetype-xls icon-excel-btn" viewBox="0 0 16 16" data-toggle="tooltip" title="Descargar Excel"> <path fill-rule="evenodd" d="M14 4.5V14a2 2 0 0 1-2 2h-1v-1h1a1 1 0 0 0 1-1V4.5h-2A1.5 1.5 0 0 1 9.5 3V1H4a1 1 0 0 0-1 1v9H2V2a2 2 0 0 1 2-2h5.5zM6.472 15.29a1.2 1.2 0 0 1-.111-.449h.765a.58.58 0 0 0 .254.384q.106.073.25.114.143.041.319.041.246 0 .413-.07a.56.56 0 0 0 .255-.193.5.5 0 0 0 .085-.29.39.39 0 0 0-.153-.326q-.152-.12-.462-.193l-.619-.143a1.7 1.7 0 0 1-.539-.214 1 1 0 0 1-.351-.367 1.1 1.1 0 0 1-.123-.524q0-.366.19-.639.19-.272.527-.422.338-.15.777-.149.457 0 .78.152.324.153.5.41.18.255.2.566h-.75a.56.56 0 0 0-.12-.258.6.6 0 0 0-.247-.181.9.9 0 0 0-.369-.068q-.325 0-.513.152a.47.47 0 0 0-.184.384q0 .18.143.3a1 1 0 0 0 .405.175l.62.143q.326.075.566.211a1 1 0 0 1 .375.358q.135.222.135.56 0 .37-.188.656a1.2 1.2 0 0 1-.539.439q-.351.158-.858.158-.381 0-.665-.09a1.4 1.4 0 0 1-.478-.252 1.1 1.1 0 0 1-.29-.375m-2.945-3.358h-.893L1.81 13.37h-.036l-.832-1.438h-.93l1.227 1.983L0 15.931h.861l.853-1.415h.035l.85 1.415h.908L2.253 13.94zm2.727 3.325H4.557v-3.325h-.79v4h2.487z"/></svg>',
            className: 'btn-excel',
            customize: function (xlsx) {
              customizeExcel(xlsx, 'Autorizaciones', "")
            }
          }
      ],
      columns: [
          {
            data: null,
            render: function (data, type, row) {
              if (row.ESTADO_APROBACION === 'APROBADO' || row.ESTADO_APROBACION === 'RECHAZADO') {
                return '<td><button class="simple-icon-close botonDenegar disabled-button" disabled></button><button class="simple-icon-check botonAceptar disabled-button" disabled></button> <input class="form-check-input" style="margin-left: 5px;" type="checkbox" id="checkRow" disabled><label class="form-check-label" for="checkRow"> </label></td>';
            } else {
                return '<td><button class="simple-icon-close botonDenegar"></button><button class="simple-icon-check botonAceptar"></button> <input class="form-check-input" style="margin-left: 5px;" type="checkbox" id="checkRow"><label class="form-check-label" for="checkRow"> </label></td>';
            }
            }
          },
          { data: 'TIPO_CAMBIO', 
            render:function(data,type,row){
              let Nombre_autorizacion = catalogos[data];
              return Nombre_autorizacion;
            }
          },
          { data: 'FECHA_SOLICITUD',
              render: function(data,type,row){
                let fecha_hora = data;
                let fecha_actual= fecha_hora.split("T")[0];
                return fecha_actual;
               }
          },
          { data: 'ESTADO_APROBACION' },
          { data: null,
            render: function (data,type,row){
              return "["+data.DATO1+"] ."+"["+data.DATO2+"] ."+"["+data.DATO3+"] ."+"["+data.DATO4+"]"
            } 
          },
          { 
            data: 'ORIGINAL',
            render: function (data, type, row) {
              let nombreEmpleado = window.diccionarioDT[data];
              if (!nombreEmpleado) {
                let clasificacion = catalogoClasificaciones[data] ?? null
                return clasificacion ?? data?.toUpperCase() ?? 'SIN INFO'
              }
              return nombreEmpleado.toUpperCase();
            }
          },          
          { data: 'SOLICITADO',
            render: function (data, type, row) {
              let nombreEmpleado = window.diccionarioDT[data];
              if (!nombreEmpleado) {
                let clasificacion = catalogoClasificaciones[data] ?? null
                return clasificacion ?? data?.toUpperCase() ?? 'SIN INFO'
              }
              return nombreEmpleado.toUpperCase();
            }
          },
          { 
            data: function(row) {
                if (!isNaN(row.AUTOR_SOLICITUD)) {
                    return row.AUTOR_SOLICITUD;
                } else {
                    return row.DATO8;
                }
            },
            render: function(data, type, row) {
                if (data === "NONE" || data === null) {
                    return '';
                } else if (!isNaN(data)) {
                    let nombreEmpleado = window.diccionarioDT[data];
                    return nombreEmpleado;
                } else {
                    return data? data.toUpperCase() : "";
                }
            }
        },
          { data: 'AUTOR_APROBACION',
              render: function(data,type,row){
                if(data === "NONE"|| !data){
                  return '';
                }else if(!isNaN(data)){
                  let nombreEmpleado = window.diccionarioDT[data];
                  return nombreEmpleado;
                }else{                  
                  return data.toUpperCase();
                }
              }
          },
          { data: 'FECHA_APROBACION',
            render: function(data,type,row){
              if(data ==="NONE"|| !data){
                return '';
              }else{
                let fecha_hora = data;
                let fecha_actual = fecha_hora.split("T")[0];
                return fecha_actual;
              }
            }
          },
          { data: 'DATO5' ,
            render: function(data,type,row){
              if(data ==="NONE"|| !data){
                return '';
              }else{
                return data;
              }
            }
          },
      ],
      language:{
        "decimal":        "",
        "emptyTable":     "No hay datos disponibles en la tabla",
        "info":           "_TOTAL_ resultados", //"Mostrando _START_ a _END_ de _TOTAL_ registros",
        "infoEmpty":      "Mostrando 0 a 0 de 0 registros",
        "infoFiltered":   "", //"(filtrando de _MAX_ registros totales)"
        "infoPostFix":    "",
        "thousands":      ",",
        "lengthMenu":     "Mostrar _MENU_ registros",
        "loadingRecords": "Cargando...",
        "processing":     "",
        "search":         "",
        "zeroRecords":    "No se encontraron registros",
        "paginate": {
            "first":      "Primero",
            "last":       "Último",
            "next":       ">",
            "previous":   "<"
        },
        "aria": {
            "sortAscending":  ": activate to sort column ascending",
            "sortDescending": ": activate to sort column descending"
        }
    },
    "pageLength":25
  });

   // Inicializar tooltips
   $('[data-toggle="tooltip"]').tooltip();

  // Se agrego un placeholder al buscador
    $('.dataTables_filter input').attr('placeholder', 'Buscar...');
    
     // Filtrar por "PENDIENTE" al iniciar
     table.column(3).search("PENDIENTE").draw();
  }


  function showNotification(placementFrom, placementAlign, type, message, delay) {
    $.notify(
      {
        title: "Notification",
        message: message
      },
      {
        element: "body",
        type: type,
        placement: {
          from: placementFrom,
          align: placementAlign
        },
        z_index:9999,
        animate: {
          enter: "animated fadeInDown",
          exit: "animated fadeOutUp"
        },
        autoHideDelay: delay || 5000,
      }
    );
  }

function escribirListaCorreo(SOLICITADO,USUARIO,TIPO_CAMBIO, MENSAJE){

  //Crearé el nuevo registro
  array_dato_tabla_correo = [
    ["asunto_correo", TIPO_CAMBIO],
    ["nombre_persona", SOLICITADO],
    ["usuario_persona", USUARIO],
    ["cuerpo_correo", MENSAJE],
  ]
  //Finalmente escribo el nuevo registro
  $().SPServices({
    operation: "UpdateListItems",
    async: false,
    batchCmd: "New",
    listName: "Z_MENSAJES",
    valuepairs: array_dato_tabla_correo,
    completefunc: function(xData, Status) {}
  })
}

  //MODULO DE ENTIDADES PENDIENTES
  //Funciones que usara la pagina.
  function Entidades_Pendientes() {
    if(DEBUG || window.current_user === "aborbor") window.current_user = "ccuenca"
    //inicio la variable global para visualizar las autorizaciones pendientes
    let tabla_autorizacion = getAutorizaciones();
    window.tabla_autorizacion=tabla_autorizacion;
    //Nombre de los empleados
    window.diccionarioDT=getDataOwners()[0]
    //tablas oficiales
    let tablas_oficiales= getInfoTablasOficiales()
    window.tablas_oficiales=tablas_oficiales
    //obtener empleados
    window.empleados_entidades_pendientes= getDataOwners()[1];
    // Obtener el catálogo de entidades
    window.clasificacion_entidades_pendientes= getCatalogoOGASUITE("6");
    //Correos de empleados
    window.diccionarioEmpleadosCorreos=getDataOwners()[2]
    //obtener codigo del empleado
    window.CodigoEmpleado=getDataOwners()[3]
    let data_tabla=[]
    let tabla_entidades_pendientes = getEntidadesPendientes();
    window.tabla_entidades_pendientes=tabla_entidades_pendientes;
    let catalogoInvertido = new Map(Object.entries(window.clasificacion_entidades_pendientes).map(([clave, valor]) => [valor.toUpperCase(), clave]));
    for (const [key, value] of Object.entries(tabla_entidades_pendientes)) {
    const tablaKey = `${value.servidor}_${value.esquema}_${value.base}_${value.tabla}`;
    const tablaOficial = tablas_oficiales[tablaKey];
    //si es una tabla sinónimo hace skip a la interacion y no la mustra en la tabla
    if(value.clasificacion && value.clasificacion.toLowerCase() === "syn") continue;

    if (tablaOficial) {
        const { data_owner, data_steward, clasificacion, descripcion_tabla } = tablaOficial;

        const ownerOficial = window.diccionarioEmpleadosCorreos[data_owner]?.split("@")[0];
        if (ownerOficial && value.data_owner !== ownerOficial) {
            value.data_owner = ownerOficial;
        }

        const stewardOficial = window.diccionarioEmpleadosCorreos[data_steward]?.split("@")[0];
        if (stewardOficial && value.data_steward !== stewardOficial) {
            value.data_steward = stewardOficial;
        }

        const clasificacionTablaOficial = clasificacion.trim();
        const clasificacionPendiente = window.clasificacion_entidades_pendientes[value.clasificacion.trim()] ? window.clasificacion_entidades_pendientes[value.clasificacion.trim()].toLocaleUpperCase() : ""
        if (clasificacionTablaOficial && clasificacionPendiente !== clasificacionTablaOficial.toLocaleUpperCase()) {
            value.clasificacion = catalogoInvertido.get(clasificacionTablaOficial.toLocaleUpperCase());
        }

        const descripcionTablaOficial = String(descripcion_tabla).replace(/\s+/g, '');
        const descripcionPendiente = String(value.descripcion).replace(/\s+/g, '');
        if (descripcionTablaOficial !== descripcionPendiente) {
            value.descripcion = descripcion_tabla;
        }
    }

    data_tabla.push(value);
}

    // Llamo a las otras funciones
    SegmentadorEntidadesPendientes();
    window.prueba_pendientes = data_tabla
    setDataTableEntidades_pendientes(data_tabla);
    ListenerEntidadesPendientes();
    registrar_visita("ENTIDADES PENDIENTES")
    setTopAportes()
  }

  function setTopAportes(){
    $(".top-aportes-button").on("click", (function(t) {
        t.preventDefault();
        
        $(".top-aportes-button").toggleClass('animacion-parpadeo');
        $(".top-aportes").toggleClass("shown")
        $(this).tooltip('hide')
      }
    ))

    // let leaderboardUsers = getAporteLeaderboard()
    let leaderboardUsers = getAporteLeaderboard()

    // Ordenar el arreglo por la posición
    leaderboardUsers.sort((a, b) => a.position - b.position);
    let userList = ""
    leaderboardUsers.forEach((user, index) => {

      userList += `<div class="${user.position === 1? "font-weight-bold" : ""} d-flex justify-content-between" style="gap:12px;padding: 0px 8px;" >\
      <span class="">${user.position}. ${user.username}</span>\
      <span class="">${user.aporte}</span>\
      </div>`
      
    })
    if(leaderboardUsers.length < 5){
      for(let i = leaderboardUsers.length; i<5; i++){
        userList += `<div class="d-flex justify-content-between" style="gap:12px;padding: 0px 8px;" >\
        <span class="">${i+1}. --</span>\
        <span class="">--</span>\
        </div>`
      }
    }
    // document.getElementById("top-leaderboard").appendChild()
    document.getElementById("top-leaderboard").innerHTML = userList
    // $("#top-leaderboard").html = ``
  }
  
  //Funcion para obtener top 5 de usuarios con mayor aporte
  function getAporteLeaderboard(){
    
    const usuariosExcluidos = ["ccuenca", "jsalas"]
    const codigosExcluidos = usuariosExcluidos?.map(usuario => window.CodigoEmpleado[`${usuario}@bancoguayaquil.com`])
    // $("#top-aporte").text(aporteUsuarios[window.CodigoEmpleado["esaglimbeni@bancoguayaquil.com"]] || "--")
    const mesActualTexto = new Date(new Date().setMonth(new Date().getMonth()))
    .toISOString()
    .slice(0, 7);
    let aporteUsuarios = getAportes({mes:mesActualTexto})
    $("#top-aporte").text(aporteUsuarios[getEmployeeCodeByUser()] || "--")
    // Paso único: usar Object.entries y reduce para obtener los 5 mayores puntajes
    const top5Empleados = Object.entries(aporteUsuarios)
      .sort(([, a], [, b]) => b - a) // Ordenar de mayor a menor por calificación
      .filter(([codigoEmpleado]) => !codigosExcluidos.includes(codigoEmpleado))
      .slice(0, 5) // Tomar los 5 primeros elementos
      .map(([empleado, aporte], index) => ({
        position: index + 1, // Posición en el ranking
        username: window.diccionarioEmpleadosCorreos[empleado]?.split("@")[0], // Código del empleado
        aporte: parseFloat(aporte.toFixed(2)) // Calificación redondeada
    }));
        
    return top5Empleados
  }

  function getAportes({usuario = null, mes = null} = {}){
    let data = getAprobaciones({mes:mes})
    let tipoCambioAporte = {}
    let interacciones = data.reduce((acumulador, elemento) => {
      if(!acumulador[elemento.LLAVE_REGISTRO]){
        acumulador[elemento.LLAVE_REGISTRO] = new Set();
      }

      if(!tipoCambioAporte[elemento.TIPO_CAMBIO]){
        tipoCambioAporte[elemento.TIPO_CAMBIO] = new Set();
      }
      tipoCambioAporte[elemento.TIPO_CAMBIO].add(elemento.AUTOR_SOLICITUD)
      acumulador[elemento.LLAVE_REGISTRO].add(elemento.AUTOR_SOLICITUD);
      return acumulador
    },{})
    //Excluir equipo de OGA
    let aporteUsuarios = {}
    let aporteDesglosado = {}
    // Recorrer cada proyecto y su conjunto de empleados
    Object.keys(interacciones).forEach(key => {
      const empleados = interacciones[key];
      const calificacion = 1 / empleados.size; // Calificación única por conjunto de empleados
      
      const split = key.split("_")
      const tipoAporte =  split[split.length - 1]

      if(usuario && empleados.has(usuario.toString())){
        aporteDesglosado[tipoAporte] = (aporteDesglosado[tipoAporte] || 0) + calificacion;
      }

      empleados.forEach(empleado => {
        // Sumar la calificación acumulada sin usar parseFloat ni toFixed aquí
        aporteUsuarios[empleado] = (aporteUsuarios[empleado] || 0) + calificacion;
      });
    });
    return usuario ? {"aporteTotal": aporteUsuarios[usuario], "aporteDesglosado": aporteDesglosado} :aporteUsuarios
  }

  function getAprobaciones({mes=null} = {}){
    let catalogos = getCatalogoOGASUITE("2");
    let queryMes = mes 
    ? `<BeginsWith><FieldRef Name="FECHA_APROBACION" /><Value Type="Text">${mes}</Value></BeginsWith>` 
    : "";

    let whereClause = mes
        ? `<Where>\
            <And>\
              <Eq>\
                <FieldRef Name="ESTADO_APROBACION" />\
                <Value Type="Text">APROBADO</Value>\
              </Eq>\
              ${queryMes}\
            </And>\
          </Where>`
        : `<Where>\
            <Eq>\
              <FieldRef Name="ESTADO_APROBACION" />\
              <Value Type="Text">APROBADO</Value>\
            </Eq>\
          </Where>`;
    let data = []
    
    $().SPServices({
      operation: "GetListItems",
      async: false,
      listName: "Z_APROBACIONES",
      CAMLQuery: `<Query>${whereClause}</Query>`,
      CAMLViewFields: "<ViewFields>\
                          <FieldRef Name='TIPO_CAMBIO' />\
                          <FieldRef Name='DATO1' />\
                          <FieldRef Name='DATO2' />\
                          <FieldRef Name='DATO3' />\
                          <FieldRef Name='DATO4' />\
                          <FieldRef Name='ORIGINAL' />\
                          <FieldRef Name='SOLICITADO' />\
                          <FieldRef Name='AUTOR_SOLICITUD' />\
                          <FieldRef Name='FECHA_SOLICITUD' />\
                          <FieldRef Name='ESTADO_APROBACION' />\
                          <FieldRef Name='AUTOR_APROBACION' />\
                          <FieldRef Name='FECHA_APROBACION' />\
                          <FieldRef Name='DATO5' />\
                          <FieldRef Name='DATO6' />\
                          <FieldRef Name='DATO7' />\
                          <FieldRef Name='DATO8' />\
                      </ViewFields>",
      completefunc: function (xData, Status) {
          $(xData.responseXML).SPFilterNode("z:row").each(function() {
            if($(this).attr("ows_TIPO_CAMBIO") !== "6"){
              let DATO1_txt = $(this).attr("ows_DATO1") ? $(this).attr("ows_DATO1").toUpperCase().trim().replaceAll('(', '\(').replaceAll(')', '\)').replaceAll('<BR>','').replaceAll('\\','') : " ";
              let AUTOR_SOLICITUD_txt = $(this).attr("ows_AUTOR_SOLICITUD");
              let DATO2_txt = $(this).attr("ows_DATO2") ? $(this).attr("ows_DATO2").toUpperCase().trim().replaceAll('(', '\(').replaceAll(')', '\)').replaceAll('<BR>','').replaceAll('\\','') : " ";
              let DATO3_txt = $(this).attr("ows_DATO3") ? $(this).attr("ows_DATO3").toUpperCase().trim().replaceAll('(', '\(').replaceAll(')', '\)').replaceAll('<BR>','').replaceAll('\\','') : " ";
              let DATO4_txt = $(this).attr("ows_DATO4") ? $(this).attr("ows_DATO4").toUpperCase().trim().replaceAll('(', '\(').replaceAll(')', '\)').replaceAll('<BR>','').replaceAll('\\','') : " ";
              let ORIGINAL_txt =$(this).attr("ows_ORIGINAL");
              let SOLICITADO_txt = $(this).attr("ows_SOLICITADO");
              let TIPO_CAMBIO_txt = catalogos[$(this).attr("ows_TIPO_CAMBIO")];
              let FECHA_SOLICITUD_txt = $(this).attr("ows_FECHA_SOLICITUD");
              let ESTADO_APROBACION_txt = $(this).attr("ows_ESTADO_APROBACION");
              let llaveRegistro = `${DATO1_txt}_${DATO2_txt}_${DATO3_txt}_${DATO4_txt}_${TIPO_CAMBIO_txt}`
              let registro = {
                DATO1 : DATO1_txt,
                DATO2 : DATO2_txt,
                DATO3 : DATO3_txt,
                DATO4 : DATO4_txt,
                ORIGINAL: ORIGINAL_txt,
                SOLICITADO:SOLICITADO_txt,
                TIPO_CAMBIO:TIPO_CAMBIO_txt,
                AUTOR_SOLICITUD: AUTOR_SOLICITUD_txt,
                FECHA_SOLICITUD: FECHA_SOLICITUD_txt,
                ESTADO_APROBACION: ESTADO_APROBACION_txt,
                AUTOR_APROBACION: $(this).attr("ows_AUTOR_APROBACION"),
                FECHA_APROBACION: $(this).attr("ows_FECHA_APROBACION") ,
                DATO5: $(this).attr("ows_DATO5"),
                DATO6: $(this).attr("ows_DATO6"),
                DATO7: $(this).attr("ows_DATO7"),
                DATO8: $(this).attr("ows_DATO8"),
                LLAVE_REGISTRO: llaveRegistro,
              }
              data.push(registro)
            }

          })
        }
    })
    return data;
  }

  //Obtengo los registros de la lista Z_ENTIDADES_PENDIENTES
  function getEntidadesPendientes() {
    let datos = {};
    $().SPServices({
        operation: "GetListItems",
        async: false,
        listName: "Z_ENTIDADES_PENDIENTES",
        CAMLViewFields: "<ViewFields>\
                            <FieldRef Name='base' />\
                            <FieldRef Name='plataforma' />\
                            <FieldRef Name='servidor' />\
                            <FieldRef Name='esquema' />\
                            <FieldRef Name='tabla' />\
                            <FieldRef Name='data_owner' />\
                            <FieldRef Name='data_steward' />\
                            <FieldRef Name='fecha_creacion' />\
                            <FieldRef Name='num_columnas' />\
                            <FieldRef Name='columnas_documentadas' />\
                            <FieldRef Name='avance' />\
                            <FieldRef Name='clasificacion' />\
                            <FieldRef Name='estado' />\
                            <FieldRef Name='descripcion' />\
                            <FieldRef Name='used_mb' />\
                        </ViewFields>",
        completefunc: function (xData, Status) {
            $(xData.responseXML).SPFilterNode("z:row").each(function() {
                  let base_txt = $(this).attr("ows_base") ? $(this).attr("ows_base").toUpperCase().trim().replaceAll('(', '\(').replaceAll(')', '\)').replaceAll('<BR>','').replaceAll('\\','') : " ";
                  let plataforma_txt = $(this).attr("ows_plataforma") ? $(this).attr("ows_plataforma").toUpperCase().trim().replaceAll('(', '\(').replaceAll(')', '\)').replaceAll('<BR>','').replaceAll('\\','') : " ";
                  let servidor_txt = $(this).attr("ows_servidor") ? $(this).attr("ows_servidor").toUpperCase().trim().replaceAll('(', '\(').replaceAll(')', '\)').replaceAll('<BR>','').replaceAll('\\','') : " ";
                  let esquema_txt = $(this).attr("ows_esquema") ? $(this).attr("ows_esquema").toUpperCase().trim().replaceAll('(', '\(').replaceAll(')', '\)').replaceAll('<BR>','').replaceAll('\\','') : " ";
                  let tabla_txt = $(this).attr("ows_tabla") ? $(this).attr("ows_tabla").toUpperCase().trim().replaceAll('(', '\(').replaceAll(')', '\)').replaceAll('<BR>','').replaceAll('\\','') : " ";
                  let fecha_creacion_txt = $(this).attr("ows_fecha_creacion");
                  let numColumnas_txt =$(this).attr("ows_num_columnas");
                  let columnas_Documentadas_txt = $(this).attr("ows_columnas_documentadas");
                  let usedMb_txt = $(this).attr("ows_used_mb") || "0.0";
                  let llaveTablatxt = base_txt+"_"+plataforma_txt+"_"+servidor_txt+"_"+esquema_txt+"_"+tabla_txt+"_"+fecha_creacion_txt+"_"+numColumnas_txt+"_"+columnas_Documentadas_txt;
                  datos[llaveTablatxt]= {
                  base : base_txt,
                  plataforma :plataforma_txt,
                  servidor :servidor_txt,
                  esquema : esquema_txt,
                  tabla : tabla_txt,
                  fecha_creacion : fecha_creacion_txt,
                  numero_columnas: numColumnas_txt,
                  columnas_documentadas:columnas_Documentadas_txt,
                  data_owner:$(this).attr("ows_data_owner"),
                  data_steward: $(this).attr("ows_data_steward"),
                  avance: $(this).attr("ows_avance"),
                  clasificacion: $(this).attr("ows_clasificacion"),
                  estado: $(this).attr("ows_estado"),
                  descripcion: $(this).attr("ows_descripcion"),
                  used_mb: usedMb_txt
                }
            })
          }
      });
      return datos;
  }
  const obtenerCodigoEmpleado = (usuario) => {
    if (usuario === undefined) return null;
    let username = usuario.replaceAll("adm_", "").replaceAll("anl_", "").replaceAll("apl_","").toLowerCase();
    let correoCompleto = `${username}@bancoguayaquil.com`;
    return window.CodigoEmpleado[correoCompleto];
  };
  //Tabla entidades pendientes
  function setDataTableEntidades_pendientes(data_tabla){
    // Helper para obtener el código del empleado

                    
    let optionsString = '<option label="&nbsp;">&nbsp;</option>';

    // Iterar sobre los empleados y generar un string de opciones
    Object.entries(window.empleados_entidades_pendientes).forEach(function([text, value]) {
        optionsString += `<option value="${value}">${text}</option>`;
    });
    

    var table = $('#tbl_entidades_pendientes').DataTable({
      data: data_tabla,
      paging: true,
      colResize: {
        isEnabled: true,
        hasBoundCheck: false
      },
      
      lengthChange: true,
      info: true,
      scrollX: true,
      scrollCollapse: true,
      scrollY: 'calc(50vh)',
      autoWidth: true,
      deferRender: true,
    
      dom: 'fBtlip',
      columnDefs: [
        { targets: 14, width: "20px" },
        { targets: 13, width: "35px" },
        { targets: 12, width: "35px" },
        { targets: 11, width: "35px" },
        { targets: 10, width: "50px" },
        { targets: 9, width: "140px" },
        { targets: 8, width: "180px" },
        { targets: 7, width: "190px" },
        { targets: 6, width: "190px" },
        { targets: 5, width: "80px" },
        { targets: 4, width: "5px" },
        { targets: 3, width: "5px" },
        { targets: 2, width: "5px" },
        { targets: 1, width: "340px" },
        { targets: 0, width: "0px" },
      ],
      buttons: [
          {
            extend: 'excel',
            text: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-filetype-xls icon-excel-btn diseño-excel" viewBox="0 0 16 16" data-toggle="tooltip" title="Descargar Excel"> <path fill-rule="evenodd" d="M14 4.5V14a2 2 0 0 1-2 2h-1v-1h1a1 1 0 0 0 1-1V4.5h-2A1.5 1.5 0 0 1 9.5 3V1H4a1 1 0 0 0-1 1v9H2V2a2 2 0 0 1 2-2h5.5zM6.472 15.29a1.2 1.2 0 0 1-.111-.449h.765a.58.58 0 0 0 .254.384q.106.073.25.114.143.041.319.041.246 0 .413-.07a.56.56 0 0 0 .255-.193.5.5 0 0 0 .085-.29.39.39 0 0 0-.153-.326q-.152-.12-.462-.193l-.619-.143a1.7 1.7 0 0 1-.539-.214 1 1 0 0 1-.351-.367 1.1 1.1 0 0 1-.123-.524q0-.366.19-.639.19-.272.527-.422.338-.15.777-.149.457 0 .78.152.324.153.5.41.18.255.2.566h-.75a.56.56 0 0 0-.12-.258.6.6 0 0 0-.247-.181.9.9 0 0 0-.369-.068q-.325 0-.513.152a.47.47 0 0 0-.184.384q0 .18.143.3a1 1 0 0 0 .405.175l.62.143q.326.075.566.211a1 1 0 0 1 .375.358q.135.222.135.56 0 .37-.188.656a1.2 1.2 0 0 1-.539.439q-.351.158-.858.158-.381 0-.665-.09a1.4 1.4 0 0 1-.478-.252 1.1 1.1 0 0 1-.29-.375m-2.945-3.358h-.893L1.81 13.37h-.036l-.832-1.438h-.93l1.227 1.983L0 15.931h.861l.853-1.415h.035l.85 1.415h.908L2.253 13.94zm2.727 3.325H4.557v-3.325h-.79v4h2.487z"/></svg>',
            className: 'btn-excel',
            customize: function (xlsx) {
              customizeExcel(xlsx, 'Entidades Pendientes', "")
            }
          }
      ],
      columns: [
          {
            data: null,
            render: function (data, type, row) {
                return '<button class="iconsminds-save btnGuardarRegistro" data-toggle="tooltip" title="Guardar Documentación"></button>';
            }
          },       
          { data: null,//campo de tablas
            render: function (data,type,row){
              let llave_tabla = `${data.servidor}_${data.esquema}_${data.base}_${data.tabla}`
              return `<p class="link_subrrayado" onclick="buscarExploradorMetadatos('Tabla','${llave_tabla}' )">[${data.base}].[${data.esquema}].[${data.tabla}]</p>`
            } 
          },
          {
            data: null,
            visible: false, // La columna no será visible
            "render": function(data, type, row) {
              // Asignar valores de prioridad dinámicamente
              if (data.data_owner === window.current_user) {
                  return "BB_" + data.data_owner;
              } else if (data.data_owner === "No hay usuario" || data.data_owner === null || data.data_owner === undefined) {
                  return "ZZ";
              } else {
                  return "BB_" + data.data_owner;
              }
            }
          },       
          {
            data: 'data_owner',
            visible: false, // La columna no será visible
            render: function(data, type, row) {
                if(data !== "" && data !== undefined ){
                  usuario_completo = data.replaceAll("adm_","").replaceAll("anl_","").replaceAll("apl_","").toLowerCase()
                  return usuario_completo
                }else{
                  return 'No hay usuario';
                }
            }
          },
          {
            data: 'estado',
            visible: false, // La columna no será visible
            render: function(data, type, row) {
              if(data=="P"){
                return "Pendientes"
              }if (data=="D") {
                return "Documentados"
              } else {
                return 'No hay estado'
              }
            }
          },
          {
            data: 'data_steward',
            visible: false, // La columna no será visible
            render: function(data, type, row) {
                return data ? data : 'No hay usuario';
            }
          },
          { 
            data: null,
            render: function (data, type, row) {
              let codigo_data_owner = data.data_owner ? obtenerCodigoEmpleado(data.data_owner) : '';
              let sortValue = data.data_owner ? data.data_owner : "ZZ";

              return `
                <div style="display:none;">${sortValue}</div>
                <select class='form-control select2-single dataownerselect' data-width="100%" aria-hidden="true" data-value="${codigo_data_owner}">
                </select>
              `;
            },
            createdCell: function (td, cellData, rowData, row, col) {
              // Inicializar Select2 después de agregar todas las opciones al select
              let select = $(td).find('.select2-single');
    
              // Inicializar Select2 con las opciones necesarias
              select.select2({
                theme: "bootstrap",
                placeholder: "",
                maximumSelectionSize: 6,
                width: '100%'
              });
    
              // Función para llenar y filtrar el select automáticamente
              ListadoDataOwner(select, optionsString); 
              
                
            }
          }, 
          { 
            data: null,
            render: function (data, type, row) {
              let codigo_data_steward = data.data_steward ? obtenerCodigoEmpleado(data.data_steward) : '';
              let sortValue = data.data_steward ? data.data_steward : "ZZ";

              return `
                <div style="display:none;">${sortValue}</div>
                <select class='form-control select2-single dataselect' data-width="100%" aria-hidden="true" data-value="${codigo_data_steward}"}>
                </select>
              `;
            },
            createdCell: function (td, cellData, rowData, row, col) {
              // Inicializar Select2 después de agregar todas las opciones al select
              let select = $(td).find('.select2-single');
    
              // Inicializar Select2 con las opciones necesarias
              select.select2({
                theme: "bootstrap",
                placeholder: "",
                maximumSelectionSize: 6,
                width: '100%'
              });
  
              // Función para llenar y filtrar el select automáticamente
              ListadoDataSteward(select, optionsString); 
                
            }
          }, 
          {
            data: null, 
            render: function (data, type, row) {
              if (type === 'display') {
                if (data && data.descripcion) {
                  return `<p style="display:none;">${data.descripcion}</p><input type="text" class="form-control form-input-descripcion descripción_tabla" value="${data.descripcion}" />`;
                } else {
                  return `<p style="display:none;">""</p><input type="text" class="form-control form-input-descripcion descripción_tabla" value="" />`;
                }
              }
              return data && data.descripcion ? data.descripcion : '';
            }
          },      
          {
            data: null,
            render: function (data, type, row) {

                var infoIcon = '';
                    infoIcon = `
                        <div class="input-group-append icon-container-alerta" style="display: none;">
                            <span class="input-group-text btninfo" data-toggle="tooltip" title="Recordatorio: Tienes pendiente documentar los dominios.">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-exclamation-lg" viewBox="0 0 16 16">
                                <path d="M7.005 3.1a1 1 0 1 1 1.99 0l-.388 6.35a.61.61 0 0 1-1.214 0zM7 12a1 1 0 1 1 2 0 1 1 0 0 1-2 0"/>
                                </svg>
                            </span>
                        </div>`;
                // Obtener data.clasificacion para usarlo como valor para filtrar en el combo
                return `
                <div class="input-group">
                  <p style="display:none;">${data.clasificacion}</p>
                  <select class='form-control select2-single clasificacionselect form-input-descripcion' data-width="70%" aria-hidden="true" data-value="${data.clasificacion}">
                    <option label="&nbsp;">&nbsp;</option>
                  </select>
                  ${infoIcon}
                </div>
              `;
            },
            createdCell: function (td, cellData, rowData, row, col) {
                // Inicializar Select2 después de agregar todas las opciones al select
                let select = $(td).find('.select2-single');
        
                // Inicializar Select2 con las opciones necesarias
                select.select2({
                    theme: "bootstrap",
                    placeholder: "",
                    maximumSelectionSize: 6,
                    width: '100%'
                });
        
                // Función para llenar y filtrar el select automáticamente
                Select_entidades_pendientes(select);
        
                // Inicializar tooltip de Bootstrap si el icono de información está presente
                $(td).find('[data-toggle="tooltip"]').tooltip();
                // Mostrar el icono si el valor inicial es "OFICIAL"
                if (select.data('value') === 'OFI') {
                    $(td).find('.icon-container-alerta').show();
                }
                // Evento para mostrar el icono dinámicamente cuando se selecciona "OFICIAL"
                select.on('change', function() {
                  if (select.val() === 'OFI') {
                      $(td).find('.icon-container-alerta').show();
                  } else {
                      $(td).find('.icon-container-alerta').hide();
                  }
                });
            }
          },       
          { data: 'fecha_creacion',
            render: function(data, type, row) {
              let fecha_corta = data.split(" ")[0];
              return fecha_corta;
            }
          },
          { data: 'numero_columnas'},
          { data: 'columnas_documentadas'},
          {
            data: 'avance',
            render: function(data, type, row) {
                // Asegúrate de que el valor de 'avance' sea numérico
                var numericData = parseFloat(data);
                // Formatea el número con dos decimales y añade el símbolo de porcentaje
                var formattedData = numericData.toFixed(2) + '%';
                // Devuelve el valor formateado para que DataTables lo muestre
                return formattedData;
            }
          },
          {
            data:null,
            visible: false,
            render: function(data, type, row) {
              return data.used_mb ? parseFloat(data.used_mb) : 0.0;
            },
          }  
      ],
      language:{
        "decimal":        "",
        "emptyTable":     "No hay datos disponibles en la tabla",
        "info":           "_TOTAL_ resultados", //"Mostrando _START_ a _END_ de _TOTAL_ registros",
        "infoEmpty":      "Mostrando 0 a 0 de 0 registros",
        "infoFiltered":   "", //"(filtrando de _MAX_ registros totales)"
        "infoPostFix":    "",
        "thousands":      ",",
        "lengthMenu":     "Mostrar _MENU_ registros",
        "loadingRecords": "Cargando...",
        "processing":     "",
        "search":         "",
        "zeroRecords":    "No se encontraron registros",
        "paginate": {
            "first":      "Primero",
            "last":       "Último",
            "next":       ">",
            "previous":   "<"
        },
        "aria": {
            "sortAscending":  ": activate to sort column ascending",
            "sortDescending": ": activate to sort column descending"
        }
    },
    "pageLength":50
    });
    // Inicializar tooltips
    $('[data-toggle="tooltip"]').tooltip();
    // Se agrego un placeholder al buscador
    $('.dataTables_filter input').attr('placeholder', 'Buscar...');
    // Aplicar el filtro
    table.column(4).search("Pendientes").draw();
    table.column(3).search('^(' + window.current_user + '|No hay usuario)$', true, false).draw();
    // Ordenar por columna de prioridad
    table.order([[2, 'asc'], [14, 'desc']]).draw();
  }

  // listado de empleados para el combo datasteward
  function ListadoDataSteward(select, options = "") {
    // Obtener el valor para filtrar usando jQuery's .data() method
    var valorFiltrar = select.data('value');
    
    // Añadir nuevas opciones al combo usando jQuery's .html()
    if (options) {
        select.html(options);  // Reemplaza el contenido del <select> con las nuevas opciones
    }
    
    // Seleccionar automáticamente la opción correspondiente por su valor si está definido
    if (valorFiltrar) {
        select.val(valorFiltrar).trigger('change');  // Trigger 'change' para que Select2 actualice la visualización
    }
  }

  // listado de empleados para el combo dataowner
  function ListadoDataOwner(select, options="" ){
     // Obtener el valor para filtrar usando jQuery's .data() method
    var valorFiltrar = select.data('value');
    
    // Añadir nuevas opciones al combo usando jQuery's .html()
    if (options) {
      select.html(options);  // Reemplaza el contenido del <select> con las nuevas opciones
    }
    
    // Seleccionar automáticamente la opción correspondiente por su valor si está definido
    if (valorFiltrar) {
        select.val(valorFiltrar).trigger('change');  // Trigger 'change' para que Select2 actualice la visualización
    }
  }
  // Listado de etiquetas para el tipo de clasificacion
  function Select_entidades_pendientes(select) {
    var valorFiltrar = select.data('value'); // Obtener el valor que queremos filtrar
    // Añadir nuevas opciones al combo
    $.each(window.clasificacion_entidades_pendientes, function(value, text) {
      select.append(new Option(text, value));
    });
  
    // Seleccionar automáticamente la opción correspondiente por su valor si está definido
    if (valorFiltrar) {
      select.val(valorFiltrar).trigger('change'); // Trigger 'change' para que Select2 actualice la visualización
    }
  }
  //funcion para validar los campos y accion de guardar los cambios.
  function ListenerEntidadesPendientes() {

    //SELECTS
    $(".dataownerselect").on("change", function(){
      let $row = $(this).closest('tr');
      let btnGuardarRegistro = $row.find(".btnGuardarRegistro")
      let dataOwnerOficial = ""
      if($(this).val() !== dataOwnerOficial){
        btnGuardarRegistro.addClass("text-primary")
      }else{
        btnGuardarRegistro.removeClass("text-primary")

      }
    })

    $(".dataselect").on("change", function(){
      let $row = $(this).closest('tr');
      let btnGuardarRegistro = $row.find(".btnGuardarRegistro")
      let dataOwnerOficial = ""
      if($(this).val() !== dataOwnerOficial){
        btnGuardarRegistro.addClass("text-primary")
      }else{
        btnGuardarRegistro.removeClass("text-primary")

      }
    })

    $(".descripción_tabla").on("input", function(){
      let $row = $(this).closest('tr');
      let btnGuardarRegistro = $row.find(".btnGuardarRegistro")
      let dataOwnerOficial = ""
      if($(this).val() !== dataOwnerOficial){
        btnGuardarRegistro.addClass("text-primary")
      }else{
        btnGuardarRegistro.removeClass("text-primary")

      }
    })

    $(".clasificacionselect").on("change", function(){
      let $row = $(this).closest('tr');
      let btnGuardarRegistro = $row.find(".btnGuardarRegistro")
      let dataOwnerOficial = ""
      if($(this).val() !== dataOwnerOficial){
        btnGuardarRegistro.addClass("text-primary")
      }else{
        btnGuardarRegistro.removeClass("text-primary")

      }
    })


    //BTN GUARDAR DOCUMENTACION
    $('#tbl_entidades_pendientes tbody').on('click', '.btnGuardarRegistro', function() {
      let documentacionIndividual = true 
      var table = $('#tbl_entidades_pendientes').DataTable();
      var $row = $(this).closest('tr');
      var data = table.row($row).data();
      let btnGuardar = $row.find(".btnGuardarRegistro")
      // if(!btnGuardar.hasClass("text-primary")) return;
      
      
      //inicio la variable global para visualizar las autorizaciones pendientes
      let tabla_autorizacion = getAutorizaciones();
      window.tabla_autorizacion=tabla_autorizacion;
      //datos de quien envia la solicitud o actualizacion
      datos_usuario = getUserAndDate();
      var array_datos_usuario = datos_usuario[0];
      var nombre_usuario_modificacion = array_datos_usuario [0];

      // Los value que se seleccionan en cada uno de los combos
      var codigoowner = $row.find(".dataownerselect").val() || '';
      var codigosteward = $row.find(".dataselect").val()|| '';
      var clasificacion = $row.find(".clasificacionselect").val() || "";
      var descripción_tabla = $row.find(".descripción_tabla").val() || "";

     

      var dataownerActual = obtenerCodigoEmpleado(data.data_owner);
      var datastewardActual = obtenerCodigoEmpleado(data.data_steward);
      let tablaOficial = window.tablas_oficiales[`${data.servidor}_${data.esquema}_${data.base}_${data.tabla}`]
      // Función para verificar si existe una solicitud pendiente
      const verificarSolicitudExistente = (tipoCambio) => {
          for (let llave in window.tabla_autorizacion) {
              let objeto = window.tabla_autorizacion[llave];
              if (objeto["TIPO_CAMBIO"] == tipoCambio && objeto["AUTOR_SOLICITUD"] == nombre_usuario_modificacion &&
                  objeto["ESTADO_APROBACION"] == "PENDIENTE" && objeto["DATO4"] == data.tabla &&
                  objeto["DATO3"] == data.esquema && objeto["DATO2"] == data.base && objeto["DATO1"] == data.servidor) {
                  return true;
              }
          }
          return false;
      };
      if (codigoowner.trim() !== "" || codigosteward.trim() !== "" || clasificacion.trim() !== "" || descripción_tabla.trim() !== "") {
        let todos_los_campos_llenos = (codigoowner.trim() !== "" && codigoowner !== dataownerActual) && (codigosteward.trim() !== "" && codigosteward !== datastewardActual) && (descripción_tabla.trim() !== "" && descripción_tabla !== data.descripcion);
        if(todos_los_campos_llenos) documentacionIndividual = false;
        if ( codigoowner.trim() !== "" && codigoowner !== "&nbsp;") {
            if (verificarSolicitudExistente("1")) {
                showNotification("top", "center", "info", "Ya existe una solicitud para Dataowner con los mismos datos");
            } else if (tablaOficial && tablaOficial.data_owner === codigoowner) {
            } else {
              Proceso_guardar_documentacion_dataowner(data, codigoowner);
              documentacionIndividual && showNotification("top", "center", "success", `Su documentacion de DATA OWNER fue realizada con éxito.`);

            }
        }
        if ( codigosteward.trim() !== "" && codigosteward !== undefined && codigosteward !== "&nbsp;") {
            if (verificarSolicitudExistente("2")) {
              showNotification("top", "center", "info", "Ya existe una solicitud para DataSteward con los mismos datos");
            }else if(tablaOficial && tablaOficial.data_steward === codigosteward) {

            } else {
              Proceso_guardar_documentacion_datasteward(data, codigosteward);
              documentacionIndividual &&  showNotification("top", "center", "success", `Su documentacion de DATASTEWARD fue realizada con éxito.`);
            }
        }
        let clasificaciones = window.clasificacion_entidades_pendientes ?? getCatalogoOGASUITE("6")
        if ( clasificacion.trim() !== "" && data.clasificacion?.toLocaleLowerCase() !== clasificacion?.toLocaleLowerCase()) {
            let value_clasificacion = "";
            let valueClasificacon = clasificaciones[clasificacion.toUpperCase()] ?? null
            if(!valueClasificacon){ 
              showNotification("top", "center", "danger", `Su documentación no pudo ser realizada debido a la clasificación: "${clasificacion}". Por favor contacte con el equipo de Gobierno de Informacion y Analítica.`);
            }else if (tablaOficial && tablaOficial.clasificacion?.toLocaleLowerCase() === clasificaciones[clasificacion.toUpperCase()]?.toLocaleLowerCase()){

            }else{
              if (verificarSolicitudExistente("4")) {
                showNotification("top", "center", "info", "Ya existe una solicitud para clasificacion con los mismos datos");
              } else {
                Proceso_guardar_documentacion_clasificacion(data, valueClasificacon,clasificacion);
                documentacionIndividual &&  showNotification("top", "center", "success", `Su documentacion de CLASIFICACIÓN fue realizada con éxito.`);

              }
            }
        }
        if (descripción_tabla ) {

          if (verificarSolicitudExistente("5")) {
            showNotification("top", "center", "info", "Ya existe una solicitud para Descripción con los mismos datos");
          }else if (tablaOficial && tablaOficial.descripcion_tabla?.toLocaleLowerCase() === descripción_tabla?.toLocaleLowerCase()) {

          }else {
            Proceso_guardar_documentacion_descripcion(data, descripción_tabla);
            documentacionIndividual &&  showNotification("top", "center", "success", `Su documentacion de DESCRIPCION fue realizada con éxito.`);
          }
        }
        // Mostrar mensaje único si se llenaron las 4 opciones
        if ((todos_los_campos_llenos)||(codigoowner.trim() !== ""  && codigosteward.trim() !== "" && clasificacion.trim() !== "" && descripción_tabla.trim() !== "" )) {
            var status_actual = "D"
            actualizarTablaEntidadesPendientes("estado",data.base,data.plataforma,data.servidor,data.esquema,data.tabla,data.fecha_creacion,data.numero_columnas,data.columnas_documentadas,status_actual)
        }
        !documentacionIndividual && showNotification("top", "center", "success", `Su documentacion fue realizada con éxito.`);
      }
      btnGuardar.removeClass("text-primary")
    });
  }
  //funcion para guardar el dataowner en la lista Z_ENTIDADES_PENDIENTES y escribir una solicitud en el modulo de autorizaciones
  function Proceso_guardar_documentacion_dataowner(data,codigoowner){

    // Obtener el usuario del empleado con el codigo codigo owner
    var correo_usuario_owner = window.diccionarioEmpleadosCorreos[codigoowner];
    var usuario_owner = correo_usuario_owner.split("@")[0];

    // Fecha y datos del usuario que modifica
    datos_usuario = getUserAndDate();
    let array_datos_usuario = datos_usuario[0];
    let nombre_usuario_modificacion = array_datos_usuario [0];
    let localISOTimeOwner = datos_usuario[1];
    
    //llave unica para buscar la fila correcta
    var llavetabla = data.base+"_"+ data.plataforma+"_"+ data.servidor+"_"+data.esquema+"_"+data.tabla+"_"+data.fecha_creacion+"_"+data.numero_columnas+"_"+data.columnas_documentadas
  
  
    if(window.tabla_entidades_pendientes[llavetabla] !==undefined){
      actualizarTablaEntidadesPendientes("data_owner",data.base,data.plataforma,data.servidor,data.esquema,data.tabla,data.fecha_creacion,data.numero_columnas,data.columnas_documentadas,usuario_owner)
    }
    
    if (data.data_owner !== undefined ){
      var user_name =  data.data_owner.replaceAll("adm_","").replaceAll("anl_","").toLowerCase()
      //Uso el valor del campo data.dataOwner para crear el correo con el dominio "@bancoguayaquil.com" 
      var correo_completo = user_name +"@bancoguayaquil.com"
      //Obtengo el codigo de cada uno de los empleados que estan dentro de la tabla con registros.
      var codigo_empleado = window.CodigoEmpleado [correo_completo]
    }else{
      var codigo_empleado = "SIN DATAOWNER"
    }
    //Solicitud para data Owner
    escribirTablaAutorizacion(
      codigo_empleado,    // ORIGINAL
      codigoowner,       // SOLICITADO
      nombre_usuario_modificacion, // AUTOR_SOLICITUD
      localISOTimeOwner,       // FECHA_SOLICITUD
      "1",                // TIPO_CAMBIO
      data.servidor,      // DATO3
      data.base,          // DATO2
      data.esquema,       // DATO1
      data.tabla,         // DATO4
      data.plataforma,    // DATA6
      "NONE",              //DATA7
      window.nombreCompleto.toUpperCase(),//DATA8
    );

     //iterar para realizar cambio en window.tabla_entidades_pendientes
    $.each(window.tabla_entidades_pendientes, function(index, element) {
      if ((element["base"] == data.base)&&(element["esquema"] == data.esquema) && (element["tabla"] == data.tabla) && (element["fecha_creacion"] == data.fecha_creacion) && (element["numero_columnas"] == data.numero_columnas) && (element["columnas_documentadas"] == data.columnas_documentadas) ) {
        element["data_owner"] = usuario_owner;
      }
    });

  }
  //funcion para guardar el datasteward en la lista Z_ENTIDADES_PENDIENTES y escribir una solicitud en el modulo de autorizaciones
  function Proceso_guardar_documentacion_datasteward(data, codigosteward){

    // Obtener el usuario del empleado con el codigo codigosteward
    let correo_usuario_steward = window.diccionarioEmpleadosCorreos[codigosteward];
    var usuario_steward = correo_usuario_steward.split("@")[0];

    // Fecha y datos del usuario que modifica
    datos_usuario = getUserAndDate();
    let array_datos_usuario = datos_usuario[0];
    let nombre_usuario_modificacion = array_datos_usuario [0];
    let localISOTimeOwner = datos_usuario[1];
    
    //llave unica para buscar la fila correcta
    var llavetabla = data.base+"_"+ data.plataforma+"_"+ data.servidor+"_"+data.esquema+"_"+data.tabla+"_"+data.fecha_creacion+"_"+data.numero_columnas+"_"+data.columnas_documentadas
  
  
    if(window.tabla_entidades_pendientes[llavetabla] !==undefined){
      actualizarTablaEntidadesPendientes("data_steward",data.base,data.plataforma,data.servidor,data.esquema,data.tabla,data.fecha_creacion,data.numero_columnas,data.columnas_documentadas,usuario_steward)
    }
  
    if (data.data_steward !== undefined ){
      var user_name =  data.data_steward.replaceAll("adm_","").replaceAll("anl_","").toLowerCase()
      //Uso el valor del campo data.dataOwner para crear el correo con el dominio "@bancoguayaquil.com" 
      var correo_completo = user_name +"@bancoguayaquil.com"
      //Obtengo el codigo de cada uno de los empleados que estan dentro de la tabla con registros.
      var codigo_empleado = window.CodigoEmpleado [correo_completo]
    }else{
      var codigo_empleado = "SIN DATASTEWARD"
    }
  
    //Solicitud para data Steward
    escribirTablaAutorizacion(
      codigo_empleado,    // ORIGINAL
      codigosteward,       // SOLICITADO
      nombre_usuario_modificacion, // AUTOR_SOLICITUD
      localISOTimeOwner,       // FECHA_SOLICITUD
      "2",                // TIPO_CAMBIO
      data.servidor,      // DATO3
      data.base,          // DATO2
      data.esquema,       // DATO1
      data.tabla,         // DATO4
      data.plataforma,    // DATA6
      "NONE",              //DATA7
      window.nombreCompleto.toUpperCase(),//DATA8
    );

    //iterar para realizar cambio en window.tabla_entidades_pendientes
    $.each(window.tabla_entidades_pendientes, function(index, element) {
      if ((element["base"] == data.base)&&(element["esquema"] == data.esquema) && (element["tabla"] == data.tabla) && (element["fecha_creacion"] == data.fecha_creacion) && (element["numero_columnas"] == data.numero_columnas) && (element["columnas_documentadas"] == data.columnas_documentadas) ) {
        element["data_steward"] = usuario_steward;
      }
    });
  }
  //funcion para guardar la clasificacion en la lista Z_ENTIDADES_PENDIENTES y escribir una solicitud en el modulo de autorizaciones
  function Proceso_guardar_documentacion_clasificacion(data,value_clasificacion,clasificacion){

    // Fecha y datos del usuario que modifica
    datos_usuario = getUserAndDate();
    let array_datos_usuario = datos_usuario[0];
    let nombre_usuario_modificacion = array_datos_usuario [0];
    let localISOTimeOwner = datos_usuario[1];
    
    //llave unica para buscar la fila correcta
    var llavetabla = data.base+"_"+ data.plataforma+"_"+ data.servidor+"_"+data.esquema+"_"+data.tabla+"_"+data.fecha_creacion+"_"+data.numero_columnas+"_"+data.columnas_documentadas
  
  
    if(window.tabla_entidades_pendientes[llavetabla] !==undefined){
      actualizarTablaEntidadesPendientes("clasificacion",data.base,data.plataforma,data.servidor,data.esquema,data.tabla,data.fecha_creacion,data.numero_columnas,data.columnas_documentadas,clasificacion)
    }
  
    //Solicitud para data Steward
    escribirTablaAutorizacion(
      data.clasificacion,    // ORIGINAL
      value_clasificacion,       // SOLICITADO
      nombre_usuario_modificacion, // AUTOR_SOLICITUD
      localISOTimeOwner,       // FECHA_SOLICITUD
      "4",                // TIPO_CAMBIO
      data.servidor,      // DATO3
      data.base,          // DATO2
      data.esquema,       // DATO1
      data.tabla,         // DATO4
      data.plataforma,    // DATA6
      "NONE",              //DATA7
      window.nombreCompleto.toUpperCase(),//DATA8
    );
  
     //iterar para realizar cambio
     $.each(window.tabla_entidades_pendientes, function(index, element) {
      if ((element["base"] == data.base)&&(element["esquema"] == data.esquema) && (element["tabla"] == data.tabla) && (element["fecha_creacion"] == data.fecha_creacion) && (element["numero_columnas"] == data.numero_columnas) && (element["columnas_documentadas"] == data.columnas_documentadas) ) {
        element["clasificacion"] = clasificacion;
      }
    });
  }
  //funcion para guardar la descripcion en la lista Z_ENTIDADES_PENDIENTES y escribir una solicitud en el modulo de autorizaciones
  function Proceso_guardar_documentacion_descripcion(data,descripción){

    var descripcion_final = descripción;
    //identificador para actualizar en tablas oficiales 
    let llavetablaoficial = data.servidor+"_"+data.esquema+"_"+data.base+"_"+data.tabla
    //identificador para actualizar en tablas entidades pendientes
    let llavetabla = data.base+"_"+data.esquema+"_"+data.tabla+"_"+data.fecha_creacion+"_"+data.numero_columnas+"_"+data.columnas_documentadas
    
    if((descripción.replaceAll(" ","")!="")){
      //Si llave_tabla está en tablasoficiales solo actualizo-sino escribo todo
      if(window.tablas_oficiales[llavetablaoficial]!==undefined){
        actualizarTablasOficiales("descripcion_tabla",data.tabla,data.servidor,data.base,data.esquema,descripcion_final)
        actualizarTablaEntidadesPendientes("descripcion",data.base,data.plataforma,data.servidor,data.esquema,data.tabla,data.fecha_creacion,data.numero_columnas,data.columnas_documentadas,descripcion_final)
      }else{
        escribirTablasOficiales("descripcion_tabla",data.tabla,data.plataforma,data.servidor,data.base,data.esquema,descripcion_final)
        actualizarTablaEntidadesPendientes("descripcion",data.base,data.plataforma,data.servidor,data.esquema,data.tabla,data.fecha_creacion,data.numero_columnas,data.columnas_documentadas,descripcion_final)
      }

      if(window.tablas_oficiales[llavetablaoficial]!==undefined){
        $.each(window.tablas_oficiales,function(index,element){
          if((element["servidor"]==(data.servidor)) && (element["base"]==(data.base)) && (element["esquema"]==(data.esquema)) && (element["tabla"]==(data.tabla))  ){
            element["descripcion_tabla"]=descripcion_final
          }
        });
      }else{
        window.tablas_oficiales[llavetablaoficial]={
          tabla:data.tabla,
          servidor:data.servidor,
          plataforma:data.plataforma,
          base:data.base,
          esquema:data.esquema,
          descripcion_dominio: " ",
          data_owner: " ",
          data_steward: " ",
          nombre_data_owner:" ",
          nombre_data_steward: " ",
          clasificacion: " ",
          descripcion_tabla: descripcion_final
        }
      }


      // // Fecha y datos del usuario que modifica
      // datos_usuario = getUserAndDate();
      // let array_datos_usuario = datos_usuario[0];
      // let nombre_usuario_modificacion = array_datos_usuario [0];
      // let localISOTimeOwner = datos_usuario[1];

      //  //Solicitud para descripcion
      // escribirTablaAutorizacion(
      //   data.descripcion,    // ORIGINAL
      //   descripción,       // SOLICITADO
      //   nombre_usuario_modificacion, // AUTOR_SOLICITUD
      //   localISOTimeOwner,       // FECHA_SOLICITUD
      //   "5",                // TIPO_CAMBIO
      //   data.servidor,      // DATO3
      //   data.base,          // DATO2
      //   data.esquema,       // DATO1
      //   data.tabla,         // DATO4
      //   data.plataforma,    // DATA6
      //   "NONE",              //DATA7
      //   window.nombreCompleto.toUpperCase(),//DATA8
      // );

      //iterar para realizar cambio en window.tabla_entidades_pendientes
      $.each(window.tabla_entidades_pendientes, function(index, element) {
        if ((element["base"] == data.base)&&(element["esquema"] == data.esquema) && (element["tabla"] == data.tabla) && (element["fecha_creacion"] == data.fecha_creacion) && (element["numero_columnas"] == data.numero_columnas) && (element["columnas_documentadas"] == data.columnas_documentadas) ) {
          element["descripcion"] = descripción;
        }
      });
    }
  }
  //funcion general para realizar los procesos de actualizacion en la lista Z_ENTIDADES_PENDIENTES
  function actualizarTablaEntidadesPendientes(cambio, base,plataforma,servidor,esquema, tabla, fecha_creacion, numero_columnas, columnas_documentadas, nuevo_valor) {
    let array_dato_tabla_entidades_pendientes = [];
  
    // Diccionario para configurar los cambios
    let dict_log_cambios = {
      "data_owner": ["data_owner"],
      "data_steward": ["data_steward"],
      "clasificacion": ["clasificacion"],
      "descripcion" :  ["descripcion"],
      "estado" :  ["estado"]
    };
  
    let desc_cambios = [
      [cambio, nuevo_valor]
    ];
  
    for (let i = 0; i < dict_log_cambios[cambio].length; i++) {
      for (let j = 0; j < desc_cambios.length; j++) {
        if (dict_log_cambios[cambio][i] === desc_cambios[j][0]) {
          array_dato_tabla_entidades_pendientes.push([dict_log_cambios[cambio][i], desc_cambios[j][1]]);
        }
      }
    }

    $().SPServices.SPUpdateMultipleListItems({
      async: true,
      listName: "Z_ENTIDADES_PENDIENTES",
      batchCmd: "Update",
      CAMLQuery: '<Query><Where>\
            <And>\
              <Eq><FieldRef Name="base"/><Value Type="Text">' + base +'</Value></Eq>\
               <And>\
                <Eq><FieldRef Name="plataforma"/><Value Type="Text">' + plataforma +'</Value></Eq>\
                  <And>\
                    <Eq><FieldRef Name="servidor"/><Value Type="Text">' + servidor +'</Value></Eq>\
                    <And>\
                      <Eq><FieldRef Name="esquema"/><Value Type="Text">'+ esquema +'</Value></Eq>\
                        <And>\
                          <Eq><FieldRef Name="tabla"/><Value Type="Text">'+ tabla +'</Value></Eq>\
                          <And>\
                            <Eq><FieldRef Name="fecha_creacion"/><Value Type="Text">'+fecha_creacion+'</Value></Eq>\
                            <And>\
                      <Eq><FieldRef Name="num_columnas"/><Value Type="Text">'+ numero_columnas +'</Value></Eq>\
                      <Eq><FieldRef Name="columnas_documentadas"/><Value Type="Text">'+ columnas_documentadas +'</Value></Eq>\
                    </And>\
                  </And>\
                </And>\
              </And>\
            </And>\
          </And>\
        </And>\
          </Where></Query>',
      valuepairs: array_dato_tabla_entidades_pendientes,
      completefunc: function (xData, Status) {
      }
    });
  }
  //segmentador para filtrar por el tipo de estado : Pendientes , Todos
  function SegmentadorEntidadesPendientes(){
    let estado = getCatalogoOGASUITE("5");
    // Obtener valores únicos de estado
    //Extrae los valores del objeto "estado" y los coloca en un arreglo
      let lista_estados = Object.values(estado);
      styleCatalogoEntidadesDocumentadas("#tbl_entidades_pendientes", "#segmentador-container", lista_estados, "Estado");
  }
  //funcion que se usa en la funcion principal SegmentadorEntidadesPendientes() , en esta funcion se dan los parametros de como se debe filtrar
  function segmentarTablaEntidadesDocumentadas(tabla, valor) {
    var tabla = $(tabla).DataTable();

    if (valor.toLocaleLowerCase() === "todos los usuarios".toLocaleLowerCase()) {
        // Aplicar el filtro
        tabla.columns(4).search('^(' +"Documentados" + '|Pendientes)$', true, false).draw();
        tabla.columns(3).search("").draw();
        // Ordenar por columna de prioridad
        document.getElementById("segmentar-tabla-btn").classList.remove("activo");
    } else {
        if (valor.toLocaleLowerCase() === "mis pendientes".toLocaleLowerCase() ) {
          tabla.columns(4).search("Pendientes").draw();
          tabla.columns(3).search('^(' + window.current_user + '|No hay usuario)$', true, false).draw();
          
        } else {
          tabla.columns(4).search(valor).draw();
          tabla.columns(3).search("").draw();
        }

        if (!document.getElementById("segmentar-tabla-btn").classList.contains("activo")) {
            document.getElementById("segmentar-tabla-btn").classList.add("activo");
        }
    }
    tabla.order([[2, 'asc'],[14, 'desc']]).draw();

    $("#segmentar-tabla-btn").text(valor);
    $('[data-toggle="tooltip"]').tooltip();
  }
  //funcion aliada de SegmentadorEntidadesPendientes()
  function styleCatalogoEntidadesDocumentadas(tabla_editar, elemento, valor2, etiqueta) {
  let opciones = '';
  //
  $.each(valor2, function(index, item) {
    let opcion = ""
    if(item==="Todas") opcion = "Todos los usuarios"
    else if(item === "Pendientes") opcion = "Mis Pendientes"
      opciones += '<a style="cursor:pointer;" class="dropdown-item" onclick="segmentarTablaEntidadesDocumentadas(\'' + tabla_editar + '\',\'' + opcion + '\')">' + opcion + '</a>';
  });
  // Obtiene el contenedor del botón segmentador
  let segmentadorContainer = $(elemento);
  // Agrega las opciones al menú desplegable
  segmentadorContainer.find('.dropdown-menu').html(opciones);
  // Cambia el texto del botón segmentador al iniciar la pagina
  segmentadorContainer.find('.btn-segmentar').text("Mis pendientes");
  }
  
  
  // MODULO DE INDICADORES DE CALIDAD
  function Indicadores_calidad() {

      //obtener el correo del empleado por medio del codigo.
      window.CorreoEmpleado=getDataOwners()[2];

      

      //variable global para obtener el nombre del atributo.
      window.nombreatributo = getAtributosSelect()[0];

      //obtener el id del identificador
      let identificador = getParams("atributo");
      identificador = identificador.split(" ")[0];
      window.identificador_atributo = identificador;

      let data_tabla=[];

      let tabla_indicador_calidad = getCatalogoOGASUITE("7");
      window.tabla_indicador_calidad = tabla_indicador_calidad;

      $.each(tabla_indicador_calidad, function(value, text) {
        data_tabla.push({ value: value, text: text });
      });

      let lista_calidad_atributo= getCalidad_atributo();
      window.lista_calidad_atributo=lista_calidad_atributo;
    
      // Integrar los porcentajes en los datos de la tabla
      for (let i = 0; i < data_tabla.length; i++) {
        let value = data_tabla[i].value;
        for (let key in lista_calidad_atributo) {
          if (lista_calidad_atributo[key].id_dimension == value &&
              lista_calidad_atributo[key].id_atributos == window.identificador_atributo) {
            data_tabla[i].porcentaje = lista_calidad_atributo[key].valor;
            data_tabla[i].descripcion_reglas = lista_calidad_atributo[key].descripcion_reglas;
            data_tabla[i].usuario_ult_actualizacion = lista_calidad_atributo[key].usuario_ult_actualizacion;
            data_tabla[i].fecha_ult_actualizacion = lista_calidad_atributo[key].fecha_ult_actualizacion;
            break;
          }
        }
      }

    //funciones
    setDataTableIndicadoresCalidad(data_tabla);
    listener_calidad_atributos();
    actualizarIndicadores(window.identificador_atributo);
    ActualizarInputsModal(window.identificador_atributo);
    initializeAutocomplete();
    //consulta de calidad
    listener_consulta_calidad_atributos()
  }

  function listener_consulta_calidad_atributos() {
    document.getElementById("btnConsultarIndicadores").addEventListener("click", async function() {

      let lista_calidad_atributo= getCalidad_atributo();

      let consulta_data_tabla=[];

       //recorremos lista_calidad_atributo para obtener los datos para el modal de consulta de calidad
      for (const [key, value] of Object.entries(lista_calidad_atributo)) {
        consulta_data_tabla.push(value)
      }
      
      setDataTableConsultaCalidad(consulta_data_tabla);
    });
  }

  function ActualizarInputsModal(identificador_atributo) {
    let lista_calidad_atributo = window.lista_calidad_atributo;
    let tablaQuery = ""
    let plataformaQuery = ""
    let servidorQuery = ""
    let esquemaQuery = ""
    let baseQuery = "" 
    for (let key in lista_calidad_atributo) {
        if (lista_calidad_atributo[key].id_atributos == identificador_atributo) {
            // Actualizar los valores de los inputs
            tablaQuery = lista_calidad_atributo[key].tabla
            plataformaQuery = lista_calidad_atributo[key].plataforma
            servidorQuery = lista_calidad_atributo[key].servidor
            esquemaQuery = lista_calidad_atributo[key].esquema
            baseQuery = lista_calidad_atributo[key].base
            
            $('#campos-search').val(lista_calidad_atributo[key].tabla);
            $('#Aprovisionamiento').val(lista_calidad_atributo[key].plataforma);
            $('#servidor').val(lista_calidad_atributo[key].servidor);
            $('#Esquema').val(lista_calidad_atributo[key].esquema);
            $('#base').val(lista_calidad_atributo[key].base);
            $('#documentacion').val('documentacion')
      
           
            
            // Verificar si hay datos en el campo 'campos-search'
            let valorCampo = $('#campos-search').val();
            if (valorCampo && valorCampo.trim() !== '') {
                // Si hay datos, desactivar el campo
                $('#campos-search').prop('disabled', true);
            } else {
                // Si no hay datos, mantener el campo habilitado
                $('#campos-search').prop('disabled', false);
            }
            break;
        }
    }
    $().SPServices({
      operation: "GetListItems",
      async: false,
      listName: "Z_TABLAS_OFICIALES",
      CAMLQuery: '<Query><Where>' +
                            '<And>' +
                                '<And>' +
                                    '<And>' +
                                        '<Eq><FieldRef Name="txt_fuente_aprovisionamiento" /><Value Type="Text">' + plataformaQuery + '</Value></Eq>' +
                                        '<Eq><FieldRef Name="txt_desc_tabla" /><Value Type="Text">' + tablaQuery + '</Value></Eq>' +
                                    '</And>' +
                                    '<Eq><FieldRef Name="txt_servidor" /><Value Type="Text">' + servidorQuery + '</Value></Eq>' +
                                '</And>' +
                                '<And>' +
                                    '<Eq><FieldRef Name="txt_host" /><Value Type="Text">' + baseQuery + '</Value></Eq>' +
                                    '<Eq><FieldRef Name="txt_fuente_esquema" /><Value Type="Text">' + esquemaQuery + '</Value></Eq>' +
                                '</And>' +
                            '</And>' +
                        '</Where></Query>',
      CAMLViewFields: "<ViewFields>\
                          <FieldRef Name='avance' />\
                      </ViewFields>",
      completefunc: function (xData, Status) {
          $(xData.responseXML).SPFilterNode("z:row").each(function() {
            $('#documentacion').val(`${$(this).attr("ows_avance")}%`)
          });
      }
  });
  }

  //Funcion para manejar checkbox de no aplica indicadores calidad
  function checkboxHandler(checkbox, previousValue){
    let row = $(checkbox).closest('tr')
    //Obtengo el input donde se ingresa el porcentaje
    let valorInput =  row.find('.valor_calidad_atributo')
    let reglasInput = row.find('.valor_calidad_reglas')
    //Si el checkbox está marcado se pone el valor de 999% y como solo lectura
    if(checkbox.checked){
      valorInput.val('999%')
      valorInput.prop('readonly', true)
      valorInput.addClass("valor-input-text")
      //borrar contenido de reglas
      reglasInput.val('');
      reglasInput.prop('readonly', true)
    }else{
      //Si el checkbox está desmarcado se restablece el valor anterior leido se habilita su edición
      valorInput.val(previousValue >= 0 && previousValue <= 100? `${previousValue}%`: '0%')
      valorInput.prop('readonly', false)
      valorInput.removeClass("valor-input-text")
      reglasInput.prop('readonly', false)

    }
    //Se activa el botón de guardar cambios
    row.find('.btnGuardarIndicadores').prop('disabled', false )
  }


  function setDataTableIndicadoresCalidad(data_tabla){

    $('#indicadores_calidad').DataTable({
    data: data_tabla,
    paging: true,
    colResize: {
      isEnabled: true,
      hasBoundCheck: false
    },
    lengthChange: true,
    info: true,
    autoWidth: false,
    responsive: true,

    dom: 'tlip',
    columnDefs: [
      { targets: 7, width: "30px" },//botones de accion
      { targets: 6, width: "70px", },//fecha ultima modificacion
      { targets: 5, width: "50px" }, // usuario
      { targets: 4, width: "25%" }, //reglas
      { targets: 3, width: "50px" }, //porcentaje
      { targets: 2, width: "5px" }, //value no visible
      { targets: 1, width: "50px" }, // nombre indicador
      { targets: 0, width: "30px",}, // checkbox no aplica
    ],
    order:[[2, 'asc']],
    columns: [
      //Funcionalidad para el checkbox
        {data: 'text',
          render: function(data, type, row){
            //Se obtiene y guarda el valor leido de la lista
            let previousValue = row['porcentaje']
            let value = parseFloat(previousValue) > 100;
            return `<div class="checkbox-no-aplica-wrapper">
              <input type="checkbox" class="form-control form-input-valor checkbox-no-aplica" style="height:20px;" onclick="
                checkboxHandler(this, ${previousValue})
              " ${value ? "checked" : ""}>
            </div>` 
          }
        },
        { data: 'text'},
        {data: 'value',visible: false},
        {
          data: 'porcentaje', // Mostrar el porcentaje aquí
          render: function (data, type, row) {
            if (type === 'display') {
              var valor_con_porcentaje = data ? data + '%' : '';
              // Crea el input con el valor y el símbolo de porcentaje
              return `<input type="text" class="form-control form-input-valor valor_calidad_atributo  ${parseFloat(data) > 100? "valor-input-text" : "" }" data-toggle="tooltip" title="Ingrese el % del indicador"  value="${valor_con_porcentaje}" data-original-value="${data}" inputmode="decimal" pattern="^\d*\.?\d{0,2}%?$" maxlength="6" oninput="updateValue(this)" ${parseFloat(data) > 100? "readonly" : "" } />`;
            }
            return data ? data + '%' : '';
          }
        },
        {
          data: 'descripcion_reglas', // Mostrar el porcentaje aquí
          render: function (data, type, row) {
            if (type === 'display') {
              var valor_descripcion_reglas = data ? data : '';
              let value = row['porcentaje']
              // Crea el input con la descripción de las reglas
              return `<textarea class="form-control form-input-valor valor_calidad_reglas ${parseFloat(value) > 100? "valor-input-text" : "" }" data-toggle="tooltip" title="Ingrese las reglas usadas para calcular la calidad" data-original-value="${data}" inputmode="text" pattern="[a-zA-Z0-9]*"  rows="2" ${parseFloat(value) > 100? "readonly": ""}>${valor_descripcion_reglas}</textarea>`;
            }
            return data ? data : '';
          }
        },
        {
          data: 'usuario_ult_actualizacion', //nombre del usuario que realizó la última modificación
          render: function(data, type, row){
            if (type === "display" ){
              let usuario = window.CorreoEmpleado[data]
              if(usuario) return usuario.split("@")[0]
              if(data) return data
              return ""
            }
            return data ? data :'';
          }
        },
        {
          data: 'fecha_ult_actualizacion', //fecha de última modificación
          render: function(data, type, row){
            if (type === "display"){
              let fecha_ultima_modificacion = data ? data : '';
              if( fecha_ultima_modificacion !== ''){
                if (typeof fecha_ultima_modificacion === "string") fecha_ultima_modificacion = new Date(fecha_ultima_modificacion)
                fecha_ultima_modificacion = fecha_ultima_modificacion.toLocaleString('en-GB');
              }
              return fecha_ultima_modificacion
            }
            return data ? data :'';
          }
        },
        {
          data: null,
          render: function (data, type, row) {
              return '<button class="btnGuardarIndicadores" data-toggle="tooltip" title="Guardar Documentación">' +
                    '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-floppy2-fill" viewBox="0 0 16 16">' +
                    '<path d="M12 2h-2v3h2z"/>' +
                    '<path d="M1.5 0A1.5 1.5 0 0 0 0 1.5v13A1.5 1.5 0 0 0 1.5 16h13a1.5 1.5 0 0 0 1.5-1.5V2.914a1.5 1.5 0 0 0-.44-1.06L14.147.439A1.5 1.5 0 0 0 13.086 0zM4 6a1 1 0 0 1-1-1V1h10v4a1 1 0 0 1-1 1zM3 9h10a1 1 0 0 1 1 1v5H2v-5a1 1 0 0 1 1-1"/>' +
                    '</svg>' +
                    '</button>';
          }
      },        
    ],
    language:{
      "decimal":        "",
      "emptyTable":     "No hay datos disponibles en la tabla",
      "infoFiltered":   "", //"(filtrando de _MAX_ registros totales)"
      "infoPostFix":    "",
      "thousands":      ",",
      "processing":     "",
      "search":         "",
      "zeroRecords":    "No se encontraron registros",
      "aria": {
          "sortAscending":  ": activate to sort column ascending",
          "sortDescending": ": activate to sort column descending"
      }
  },
  });

  // Se agrego un placeholder al buscador
  $('.dataTables_filter input').attr('placeholder', 'Buscar...');
  }

  // Función para actualizar el valor del input manteniendo el símbolo de porcentaje
  function updateValue(input) {
    var newValue = input.value.replace(/[^0-9\.,]/g, '').slice(0, 6); // Solo permitir números y máximo 3 caracteres
    let parsedValue = parseFloat(newValue)
    if((parsedValue > 100 && parsedValue < 999) || (parsedValue > 999)) newValue = 100.0 
    input.value = newValue + '%'; // Agregar el símbolo de porcentaje
    input.setAttribute('data-original-value', newValue); // Actualizar el valor original
  }

  function escribir_lista_calidad_atributos(cambio ,id_atributos,id_dimension,plataforma,servidor,base,esquema,tabla,nuevo_valor,descripcion_reglas ){

     //Obtengo el usuario que está haciendo los cambios
    datos_usuario = getUserAndDate();
    let array_datos_usuario = datos_usuario[0];
    let localISOTime = datos_usuario[1];

    //Crearé el nuevo registro con casi todos los campos en blanco
    array_dato_lista_calidad_atributos =[
      ["id_atributos", id_atributos],
      ["id_dimension", id_dimension],
      ["valor", ""],
      ["descripcion_reglas", descripcion_reglas],
      ["fecha_ult_actualizacion", ""],
      ["usuario_ult_actualizacion", ""],
      ["plataforma", plataforma],
      ["servidor", servidor],
      ["base", base],
      ["esquema", esquema],
      ["tabla", tabla],
    ]

    //Reviso que log de cambios debo editar
    let dict_log_cambios = {
      "valor":       ["valor", "usuario_ult_actualizacion", "fecha_ult_actualizacion"], 
    }

    desc_cambios = [
      [cambio, nuevo_valor],
      [dict_log_cambios[cambio][dict_log_cambios[cambio].length - 2], getDataOwners()[3][window.CorreoEmpleado] ? getDataOwners()[3][window.CorreoEmpleado]: array_datos_usuario[0]],
      [dict_log_cambios[cambio][dict_log_cambios[cambio].length - 1], localISOTime],
    ]

    for (var i = 0; i < dict_log_cambios[cambio].length; i++) {
      for (var i_cambios = 0; i_cambios < desc_cambios.length; i_cambios++) {
          if (dict_log_cambios[cambio][i] === desc_cambios[i_cambios][0]) {
            array_dato_lista_calidad_atributos.push([dict_log_cambios[cambio][i], desc_cambios[i_cambios][1]])
          }
      }
    }

    //Finalmente escribo el nuevo registro
    $().SPServices({
      operation: "UpdateListItems",
      async: false,
      batchCmd: "New",
      listName: "Z_IND_CALIDAD_ATRIBUTOS",
      valuepairs: array_dato_lista_calidad_atributos,
      completefunc: function(xData, Status) {}
    })

  }

  function actualizar_lista_calidad_atributos(cambio,id_atributos,id_dimension,plataforma,servidor,base,esquema,tabla,nuevo_valor){
      //datos del empleado que realiza cambios
      datos_usuario = getUserAndDate();
      let array_datos_usuario = datos_usuario[0];
      let localISOTime = datos_usuario[1];

      let array_dato_lista_calidad_atributos = [];

      let dict_log_cambios = {
        "valor": ["valor", "usuario_ult_actualizacion", "fecha_ult_actualizacion"],
        "descripcion_reglas": ["descripcion_reglas", "usuario_ult_actualizacion", "fecha_ult_actualizacion"],
      }

      desc_cambios = [
        [cambio, nuevo_valor],
        // [dict_log_cambios[cambio][dict_log_cambios[cambio].length - 2], array_datos_usuario[0]],
        [dict_log_cambios[cambio][dict_log_cambios[cambio].length - 2], getDataOwners()[3][window.CorreoEmpleado] ? getDataOwners()[3][window.CorreoEmpleado]: array_datos_usuario[0]],
        [dict_log_cambios[cambio][dict_log_cambios[cambio].length - 1], localISOTime],
      ]

      for (var i = 0; i < dict_log_cambios[cambio].length; i++) {
        for (var i_cambios = 0; i_cambios < desc_cambios.length; i_cambios++) {
            if (dict_log_cambios[cambio][i] === desc_cambios[i_cambios][0]) {
              array_dato_lista_calidad_atributos.push([dict_log_cambios[cambio][i], desc_cambios[i_cambios][1]])
            }
        }
      }

      $().SPServices.SPUpdateMultipleListItems({
        async: true,
        listName: "Z_IND_CALIDAD_ATRIBUTOS",
        batchCmd: "Update",
        CAMLQuery: '<Query><Where>\
              <And>\
              <Eq><FieldRef Name="id_atributos"/><Value Type="Text">' + id_atributos + '</Value></Eq>\
                <And>\
                <Eq><FieldRef Name="id_dimension"/><Value Type="Text">' + id_dimension + '</Value></Eq>\
                  <And>\
                  <Eq><FieldRef Name="plataforma"/><Value Type="Text">' + plataforma + '</Value></Eq>\
                    <And>\
                    <Eq><FieldRef Name="servidor"/><Value Type="Text">' + servidor + '</Value></Eq>\
                      <And>\
                      <Eq><FieldRef Name="base"/><Value Type="Text">' + base + '</Value></Eq>\
                        <And>\
                          <Eq><FieldRef Name="esquema"/><Value Type="Text">' + esquema + '</Value></Eq>\
                          <Eq><FieldRef Name="tabla"/><Value Type="Text">' + tabla + '</Value></Eq>\
                        </And>\
                      </And>\
                    </And>\
                  </And>\
                </And>\
              </And>\
              </Where></Query>',
            valuepairs: array_dato_lista_calidad_atributos,
            completefunc: function (xData, Status) {
          }
        });
  }

  function listener_calidad_atributos() {
    // Deshabilitar el botón inicialmente
    $('.btnGuardarIndicadores').prop('disabled', true);

    // btn guardar calidad atributo
    $('#indicadores_calidad tbody').on('click', '.btnGuardarIndicadores', function() {
      //registro la visita del clic en el boton de guardar
      registrar_visita("INDICADORES DE CALIDAD","Actualizó el indicador de calidad.");

      var table = $('#indicadores_calidad').DataTable();
      var $row = $(this).closest('tr');
      var indicador = table.row($row).data();
  
      // Obtengo los datos de los input
      var tabla = $('#entidad-search').val();
      var plataforma = $('#Aprovisionamiento').val();
      var servidor = $('#servidor').val();
      var base = $('#base').val();
      var esquema = $('#Esquema').val();
      var valor = $row.find(".valor_calidad_atributo").val();
      var descripcion_reglas = $row.find(".valor_calidad_reglas").val();
      let checkbox = $row.find(".checkbox-no-aplica")
      var noAplica = checkbox.is(':checked')


      // Verificar que los campos no estén vacíos
      if (!tabla || !plataforma || !servidor || !base || !esquema || !valor ) {
        /*showNotification("top", "center", "danger", "Debe seleccionar una entidad antes de guardar");*/
        alert("Debe seleccionar una entidad antes de guardar")
        return; // Detener la ejecución si hay campos vacíos
      }

      let registrosIndicador  = Object.values(getCalidad_atributo(window.identificador_atributo))
      let existeNoAplica = registrosIndicador.filter(e=>e.valor === "999" && e.id_dimension === indicador.value).length > 0
      let existeValor = registrosIndicador.filter(e=>e.valor !== "999" && e.id_dimension === indicador.value).length > 0

      if(existeNoAplica && !noAplica){
        alert("Existe una tabla donde este indicador no aplica, no puede asignarle un valor.")
        checkbox.trigger("click")
        return;
      }else if(existeValor && noAplica){
        alert("Existe una tabla donde este indicador tiene valor, no puede guardarlo como 'No Aplica'.")
        checkbox.trigger("click")
        return;
      }

      if (!valor || (!noAplica && !descripcion_reglas)) {
        /*showNotification("top", "center", "danger", "Debe seleccionar una entidad antes de guardar");*/
        alert("Todos los campos del indicador deben estar llenos")
        return; // Detener la ejecución si hay campos vacíos
      }
      
      // Convertir el valor a número entero
      valor = parseFloat(valor, 10);
  
      // Validar que se acepten de 1 a 6 dígitos
      let valorAceptado = valor.toString().length >= 1 && valor.toString().length <= 6;
      // Validar que el valor no sea mayor a 100 (Cuando está desmarcado el checkbox)y sea un número entero de 3 dígitos
      if (isNaN(valor) || valor <= 0 || ( !noAplica && valor > 100 ) || !valorAceptado ) {
        /*showNotification("top", "center", "danger", "El valor debe ser un número entero de 3 dígitos y no mayor a 100");*/
        alert("El valor debe ser un número menor o igual a 6 dígitos y no mayor a 100")
        return; // Detener la ejecución si el valor no es válido
      }
  
      // Llave única para buscar la fila correcta
      var llavetabla = window.identificador_atributo + "_" + indicador.value + "_" + plataforma + "_" + servidor + "_" + base + "_" + esquema + "_" + tabla;
  
      if (window.lista_calidad_atributo[llavetabla] !== undefined) {
        actualizar_lista_calidad_atributos("valor", window.identificador_atributo, indicador.value, plataforma, servidor, base, esquema, tabla, valor)
        actualizar_lista_calidad_atributos("descripcion_reglas", window.identificador_atributo, indicador.value, plataforma, servidor, base, esquema, tabla, descripcion_reglas)
      } else {
        escribir_lista_calidad_atributos("valor", window.identificador_atributo, indicador.value, plataforma, servidor, base, esquema, tabla, valor, descripcion_reglas)
      }
      /*showNotification("top", "center", "success", "Se registró el porcentaje de su indicador");*/
      alert("Se registraron los datos de su indicador")
  
      if (window.lista_calidad_atributo[llavetabla] !== undefined) {
        $.each(window.lista_calidad_atributo, function(index, element) {
          if ((element["id_atributos"] == window.identificador_atributo) && (element["id_dimension"] == indicador.value) && (element["plataforma"] == plataforma) && (element["servidor"] == servidor) && (element["base"] == base) && (element["esquema"] == esquema) && (element["tabla"] == tabla)) {
            element["valor"] = valor
            element["descripcion_reglas"] = descripcion_reglas
          }
        });
      } else {
        window.lista_calidad_atributo[llavetabla] = {
          id_atributos: window.identificador_atributo,
          id_dimension: indicador.value,
          plataforma: plataforma,
          servidor: servidor,
          base: base,
          esquema: esquema,
          tabla: tabla,
          valor: valor,
          descripcion_reglas: descripcion_reglas
        }
      }
        actualizarIndicadores(window.identificador_atributo);
        // Una vez que termine todo el proceso de guardar, inactivo el campo de tabla
        $('#campos-search').prop('disabled', true);
      
        // Guardar referencia al botón y campo modificados
        var $thisButton = $(this);
        /*var $thisField = $row.find('.valor_calidad_atributo');*/
        /*var $thisDesc = $row.find('.valor_calidad_reglas');*/
    
        // Desactivar el botón después de guardar
        $thisButton.prop('disabled', true);

        /*
        // Detectar cambios en el mismo campo de porcentaje para habilitar el botón
        $thisField.on('input', function() {
          $thisButton.prop('disabled', false);
          $thisField.prop('disabled', false);
        });

        // Detectar cambios en el mismo campo de descripcion de reglas para habilitar el botón
        $thisDesc.on('input', function() {
          $thisButton.prop('disabled', false);
          $thisDesc.prop('disabled', false);
        });
        */
        if(!window.listaEntidadesCalidad.includes(window.entidad_actual)) {
          
          fillListaEntidades()
        }
    });

    // Detectar cambios en todos los campos de porcentaje para habilitar el botón
    $('#indicadores_calidad tbody').on('input', '.valor_calidad_atributo', function() {
      var $row = $(this).closest('tr');
      var $button = $row.find('.btnGuardarIndicadores');
      let $valor = $row.find('.valor_calidad_atributo');
      if($valor.val() && $valor.val().length > 1) {
        $button.prop('disabled', false);}
    });

    // Detectar cambios en todos los campos de reglas para habilitar el botón
    $('#indicadores_calidad tbody').on('input', '.valor_calidad_reglas', function() {
      var $row = $(this).closest('tr');
      var $button = $row.find('.btnGuardarIndicadores');
      let $reglas = $row.find('.valor_calidad_reglas');
      if($reglas.val()) $button.prop('disabled', false);
    });
  }

  function getCalidad_atributo(atributo = null){
    let datos = {};
    $().SPServices({
      operation: "GetListItems",
      async: false,
      listName: "Z_IND_CALIDAD_ATRIBUTOS",
      CAMLQuery: atributo 
      ? '<Query><Where><Eq><FieldRef Name="id_atributos"/><Value Type="Text">'+ atributo +'</Value></Eq></Where></Query>'
      : "<Query></Query>",
      CAMLViewFields: "<ViewFields>\
                          <FieldRef Name='id_atributos' />\
                          <FieldRef Name='id_dimension' />\
                          <FieldRef Name='valor' />\
                          <FieldRef Name='descripcion_reglas' />\
                          <FieldRef Name='fecha_ult_actualizacion' />\
                          <FieldRef Name='usuario_ult_actualizacion' />\
                          <FieldRef Name='plataforma' />\
                          <FieldRef Name='servidor' />\
                          <FieldRef Name='base' />\
                          <FieldRef Name='esquema' />\
                          <FieldRef Name='tabla' />\
                      </ViewFields>",
      completefunc: function (xData, Status) {
        $(xData.responseXML).SPFilterNode("z:row").each(function() {
              let id_atributos_txt = $(this).attr("ows_id_atributos");
              let id_dimension_txt = $(this).attr("ows_id_dimension");
              let plataforma_txt = $(this).attr("ows_plataforma");
              let servidor_txt = $(this).attr("ows_servidor");
              let base_txt = $(this).attr("ows_base");
              let esquema_txt = $(this).attr("ows_esquema");
              let tabla_txt =$(this).attr("ows_tabla");
              let valor_txt = $(this).attr("ows_valor");
              let descripcion_reglas_txt = $(this).attr("ows_descripcion_reglas");
              let fecha_ult_actualizacion_txt = $(this).attr("ows_fecha_ult_actualizacion");
              let usuario_ult_actualizacion_txt = $(this).attr("ows_usuario_ult_actualizacion");
              let llaveTablatxt = id_atributos_txt+"_"+id_dimension_txt+"_"+plataforma_txt+"_"+servidor_txt+"_"+base_txt+"_"+esquema_txt+"_"+tabla_txt;
              datos[llaveTablatxt]= {
              id_atributos : id_atributos_txt,
              id_dimension :id_dimension_txt,
              plataforma :plataforma_txt,
              servidor : servidor_txt,
              base : base_txt,
              esquema : esquema_txt,
              tabla : tabla_txt,
              valor: valor_txt,
              descripcion_reglas: descripcion_reglas_txt,
              fecha_ult_actualizacion : fecha_ult_actualizacion_txt,
              usuario_ult_actualizacion : usuario_ult_actualizacion_txt
            }
        })
      }
    });
    return datos;
  }

  function getEntidad_Atributo(atributo = null){
    let datos = {};
    $().SPServices({
      operation: "GetListItems",
      async: false,
      listName: "Z_IND_CALIDAD_ATRIBUTOS",
      CAMLQuery: atributo 
      ? '<Query><Where><Eq><FieldRef Name="id_atributos"/><Value Type="Text">'+ atributo +'</Value></Eq></Where></Query>'
      : "<Query></Query>",
      CAMLViewFields: "<ViewFields>\
                          <FieldRef Name='id_atributos' />\
                          <FieldRef Name='id_dimension' />\
                          <FieldRef Name='valor' />\
                          <FieldRef Name='descripcion_reglas' />\
                          <FieldRef Name='fecha_ult_actualizacion' />\
                          <FieldRef Name='usuario_ult_actualizacion' />\
                          <FieldRef Name='plataforma' />\
                          <FieldRef Name='servidor' />\
                          <FieldRef Name='base' />\
                          <FieldRef Name='esquema' />\
                          <FieldRef Name='tabla' />\
                      </ViewFields>",
      completefunc: function (xData, Status) {
        $(xData.responseXML).SPFilterNode("z:row").each(function() {
              let id_atributos_txt = $(this).attr("ows_id_atributos");
              let id_dimension_txt = $(this).attr("ows_id_dimension");
              let plataforma_txt = $(this).attr("ows_plataforma");
              let servidor_txt = $(this).attr("ows_servidor");
              let base_txt = $(this).attr("ows_base");
              let esquema_txt = $(this).attr("ows_esquema");
              let tabla_txt =$(this).attr("ows_tabla");
              let valor_txt = $(this).attr("ows_valor");
              let descripcion_reglas_txt = $(this).attr("ows_descripcion_reglas");
              let fecha_ult_actualizacion_txt = $(this).attr("ows_fecha_ult_actualizacion");
              let usuario_ult_actualizacion_txt = $(this).attr("ows_usuario_ult_actualizacion");
              let llaveTablatxt = id_atributos_txt+"_"+plataforma_txt+"_"+servidor_txt+"_"+base_txt+"_"+esquema_txt+"_"+tabla_txt;
              objeto = {
                id_atributos : id_atributos_txt,
                plataforma :plataforma_txt,
                servidor : servidor_txt,
                base : base_txt,
                esquema : esquema_txt,
                tabla : tabla_txt,
                valor: valor_txt,
                descripcion_reglas: descripcion_reglas_txt,
                fecha_ult_actualizacion : fecha_ult_actualizacion_txt,
                usuario_ult_actualizacion : usuario_ult_actualizacion_txt
              }
              if(!datos[llaveTablatxt])datos[llaveTablatxt] = objeto
        })
      }
    });
    return Object.values(datos);
  }

  function getCalidad_Entidad(entidad = null){
    
  }

  function actualizarIndicadores(id_atributo) {
    let datos = getCalidad_atributo_grafico();
    var catalogo = getCatalogoOGASUITE("7");
    let parametros = Object.values(catalogo);
    let numeroEntidades = getEntidad_Atributo(id_atributo)?.length
    let divisor = numeroEntidades === 0 ? 1 : numeroEntidades
    Chart.pluginService.register({
        beforeDraw: function(chart) {
            if (chart.config.options.elements.center) {
                var ctx = chart.chart.ctx;
                var centerConfig = chart.config.options.elements.center;
                var fontStyle = centerConfig.fontStyle || 'Arial';
                var txt = centerConfig.text;
                var color = centerConfig.color || '#000';
                var maxFontSize = centerConfig.maxFontSize || 75;
                var sidePadding = centerConfig.sidePadding || 20;
                var sidePaddingCalculated = (sidePadding / 100) * (chart.innerRadius * 2);
                ctx.font = "30px " + fontStyle;
                var stringWidth = ctx.measureText(txt).width;
                var elementWidth = (chart.innerRadius * 2) - sidePaddingCalculated;
                var widthRatio = elementWidth / stringWidth;
                var newFontSize = Math.floor(30 * widthRatio);
                var elementHeight = (chart.innerRadius * 2);
                var fontSizeToUse = Math.min(newFontSize, elementHeight, maxFontSize);
                var minFontSize = centerConfig.minFontSize;
                var lineHeight = centerConfig.lineHeight || 25;
                var wrapText = false;

                if (minFontSize === undefined) {
                    minFontSize = 20;
                }

                if (minFontSize && fontSizeToUse < minFontSize) {
                    fontSizeToUse = minFontSize;
                    wrapText = true;
                }

                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                var centerX = ((chart.chartArea.left + chart.chartArea.right) / 2);
                var centerY = ((chart.chartArea.top + chart.chartArea.bottom) / 2);
                ctx.font = fontSizeToUse + "px " + fontStyle;
                ctx.fillStyle = color;

                if (!wrapText) {
                    ctx.fillText(txt, centerX, centerY);
                    return;
                }

                var words = txt.split(' ');
                var line = '';
                var lines = [];

                for (var n = 0; n < words.length; n++) {
                    var testLine = line + words[n] + ' ';
                    var metrics = ctx.measureText(testLine);
                    var testWidth = metrics.width;
                    if (testWidth > elementWidth && n > 0) {
                        lines.push(line);
                        line = words[n] + ' ';
                    } else {
                        line = testLine;
                    }
                }

                centerY -= (lines.length / 2) * lineHeight;

                for (var n = 0; n < lines.length; n++) {
                    ctx.fillText(lines[n], centerX, centerY);
                    centerY += lineHeight;
                }
                ctx.fillText(line, centerX, centerY);
            }
        }
    });

    if (!datos[id_atributo]) {
        datos[id_atributo] = {};
    }

    let total = 0;
    let count = 0;
    parametros.forEach((parametro, index) => {
        let valor = datos[id_atributo][index + 1] || 0;
        valor /= divisor
        //Ignorar si el valor no está entre 0 y 100 (los indicadores que no aplican) y contarlos
        if (valor>=0 && valor <= 100){
          count++;
          total += valor

        };
    });
    let promedio = total / count;
    parametros.forEach((parametro, index) => {
      let chartId = "categoryChart" + (index + 2);
      let valor = datos[id_atributo][index + 1] || 0;
      valor /= divisor
      valor = (Math.floor(valor * 100)/100).toFixed(2)
      let valorTexto = `${valor}%`
      if(valor === 0) valorTexto = "N/D"
      else if(valor > 100) valorTexto = "N/A"
      
      let ctx = document.getElementById(chartId).getContext('2d');      
      if (window['chart_' + chartId]) {
        window['chart_' + chartId].data.datasets[0].data = [valor > 100 ? 0 : valor, valor >100? 100 : 100 - valor];
        window['chart_' + chartId].options.elements.center.text = valorTexto;
        window['chart_' + chartId].update();
      } else {
          window['chart_' + chartId] = new Chart(ctx, {
              type: "doughnut",
              data: {
                  labels: ["Avance", "Faltante"],
                  datasets: [{
                      label: "",
                      borderColor: ["#D2006E", "#160F41"],
                      backgroundColor: ["#D2006E", "#160F41"],
                      borderWidth: 2,
                      data: [valor > 100 ? 0 : valor, valor > 100? 100 : 100 - valor]
                  }]
              },
              options: {
                  elements: {
                      center: {
                          text: valorTexto,
                          color: "#373737",
                          fontStyle: "Nunito, sans-serif",
                          sidePadding: 15,
                          maxFontSize: 15,
                          minFontSize: 15,
                      }
                  },
                  plugins: {
                      datalabels: {
                          display: false
                      }
                  },
                  responsive: true,
                  maintainAspectRatio: false,
                  cutoutPercentage: 80,
                  title: {
                      display: true,
                      text: parametro,
                      fontStyle: "Nunito, sans-serif",
                      minFontSize: 28,
                      maxFontSize: 28
                  },
                  layout: {
                      padding: {
                          bottom: 20
                      }
                  },
                  legend: {
                      display: false
                  }
              }
          });
      }
    });

    let ctxPromedio = document.getElementById("categoryChart1").getContext('2d');
    promedio = (Math.floor(promedio * 100)/100).toFixed(2)
    let promedioTexto = promedio === 0 ? "N/D" : promedio + "%";
    window.promedioAtributo = promedio
    window.entiadesEvaluadas = numeroEntidades
    document.getElementById("numeroEntidadesResumen").innerHTML =  `${numeroEntidades} ${numeroEntidades === 1 ? "entidad evaluada":"entidades evaluadas"} `
    if (window['chart_categoryChart1']) {
        window['chart_categoryChart1'].data.datasets[0].data = [promedio, 100 - promedio];
        window['chart_categoryChart1'].options.elements.center.text = promedioTexto;
        window['chart_categoryChart1'].update();
    } else {
        window['chart_categoryChart1'] = new Chart(ctxPromedio, {
            type: "doughnut",
            data: {
                labels: ["Promedio", "Restante"],
                datasets: [{
                    label: "",
                    borderColor: ["#D2006E", "#160F41"],
                    backgroundColor: ["#D2006E", "#160F41"],
                    borderWidth: 2,
                    data: [promedio, 100 - promedio]
                }]
            },
            options: {
                elements: {
                    center: {
                        text: promedioTexto,
                        color: "#373737",
                        fontStyle: "Nunito, sans-serif",
                        sidePadding: 15,
                        maxFontSize: 15,
                        minFontSize: 15,
                    }
                },
                plugins: {
                    datalabels: {
                        display: false
                    }
                },
                responsive: true,
                maintainAspectRatio: false,
                cutoutPercentage: 80,
                title: {
                    display: true,
                    text: "Promedio",
                    fontStyle: "Nunito, sans-serif",
                    minFontSize: 28,
                    maxFontSize: 28
                },
                layout: {
                    padding: {
                        bottom: 1
                    }
                },
                legend: {
                    display: false
                }
            }
        });
    }
  }

  function getCalidad_atributo_grafico() {
    let datos = {};
    let counts = {};
    $().SPServices({
      operation: "GetListItems",
      async: false,
      listName: "Z_IND_CALIDAD_ATRIBUTOS",
      CAMLViewFields: "<ViewFields>\
                          <FieldRef Name='id_atributos' />\
                          <FieldRef Name='id_dimension' />\
                          <FieldRef Name='valor' />\
                          <FieldRef Name='fecha_ult_actualizacion' />\
                          <FieldRef Name='usuario_ult_actualizacion' />\
                          <FieldRef Name='plataforma' />\
                          <FieldRef Name='servidor' />\
                          <FieldRef Name='base' />\
                          <FieldRef Name='esquema' />\
                          <FieldRef Name='tabla' />\
                      </ViewFields>",
      completefunc: function (xData, Status) {
        $(xData.responseXML).SPFilterNode("z:row").each(function() {
          let id_atributos_txt = $(this).attr("ows_id_atributos");
          let id_dimension_txt = $(this).attr("ows_id_dimension");
          let valor_txt = parseFloat($(this).attr("ows_valor"));
          
          if (!datos[id_atributos_txt]) {
            datos[id_atributos_txt] = {};
            counts[id_atributos_txt] = {};
          }
          
          if (datos[id_atributos_txt][id_dimension_txt]) {
            // Si ya existe, suma el nuevo valor
            datos[id_atributos_txt][id_dimension_txt] = parseFloat(datos[id_atributos_txt][id_dimension_txt]) + valor_txt;

            // Incrementa el conteo para esta clave
            counts[id_atributos_txt][id_dimension_txt] += 1;
          } else {
              // Si no existe, asigna el nuevo valor y establece el conteo en 1
              datos[id_atributos_txt][id_dimension_txt] = valor_txt;
          }

          // Calcula el promedio dividiendo la suma acumulada por el número de elementos
          // datos[id_atributos_txt][id_dimension_txt]
        });
      }
    });
    return datos;
  }

  function getAutocompletadoTablas() {
    let listaTablas = [];
    
    $().SPServices({
        operation: "GetListItems",
        async: false,
        listName: "Z_TABLAS_OFICIALES",
        CAMLViewFields: "<ViewFields>\
                            <FieldRef Name='txt_desc_tabla' />\
                            <FieldRef Name='descripcion_tabla' />\
                            <FieldRef Name='txt_fuente_aprovisionamiento' />\
                            <FieldRef Name='txt_servidor' />\
                            <FieldRef Name='txt_host' />\
                            <FieldRef Name='txt_fuente_esquema' />\
                            <FieldRef Name='data_owner' />\
                            <FieldRef Name='nombre_data_owner' />\
                            <FieldRef Name='data_steward' />\
                            <FieldRef Name='nombre_data_steward' />\
                            <FieldRef Name='clasificacion' />\
                            <FieldRef Name='avance' />\
                            <FieldRef Name='etiquetas' />\
                        </ViewFields>",
        completefunc: function (xData, Status) {
            $(xData.responseXML).SPFilterNode("z:row").each(function() {
                listaTablas.push({
                    txt_desc_tabla: $(this).attr("ows_txt_desc_tabla"),
                    txt_fuente_aprovisionamiento: $(this).attr("ows_txt_fuente_aprovisionamiento"),
                    txt_servidor: $(this).attr("ows_txt_servidor"),
                    txt_fuente_esquema: $(this).attr("ows_txt_fuente_esquema"),
                    txt_host: $(this).attr("ows_txt_host"),
                    txt_documentacion: $(this).attr("ows_avance"),
                });
            });
        }
    });

    return listaTablas;
  }

  function initializeAutocomplete() {
      // Obtener listaTablas con datos de SharePoint
      let listaTablas = getAutocompletadoTablas();
      listaTablas.sort((a,b) => a.txt_desc_tabla.localeCompare(b.txt_desc_tabla) )
      listaTablas.sort((a,b) => a.txt_fuente_esquema.localeCompare(b.txt_fuente_esquema) )
      listaTablas.sort((a,b) => a.txt_host.localeCompare(b.txt_host) )
      let sortedSource = listaTablas.map(item => `[${item.txt_host}].[${item.txt_fuente_esquema}].[${item.txt_desc_tabla}]`)
      $("#campos-search").autocomplete({
          source: sortedSource,
          select: function(event, ui) {
              let selectedItem = listaTablas.find(item => `[${item.txt_host}].[${item.txt_fuente_esquema}].[${item.txt_desc_tabla}]` === ui.item.value);
              if (selectedItem) {
                  $("#servidor").val(selectedItem.txt_servidor);
                  $("#Aprovisionamiento").val(selectedItem.txt_fuente_aprovisionamiento);
                  $("#base").val(selectedItem.txt_host);
                  $("#Esquema").val(selectedItem.txt_fuente_esquema);
                  $("#documentacion").val(`${selectedItem.txt_documentacion}%`)
                  
              }
          }
      }).autocomplete("widget").addClass("fixed-height select-entidades");
  } 

  //Modal de consulta de calidad de indicadores
  function setDataTableConsultaCalidad(consulta_data_tabla){

     // Si la tabla ya está inicializada, destrúyela
    if ($.fn.DataTable.isDataTable('#consulta_indicadores_calidad')) {
      $('#consulta_indicadores_calidad').DataTable().destroy();
    }

    $('#consulta_indicadores_calidad').DataTable({
      data: consulta_data_tabla,
      paging: true,
      colResize: {
        isEnabled: true,
        hasBoundCheck: false
      },
      
      lengthChange: true,
      info: true,
      scrollX: true,
      scrollCollapse: true,
      scrollY: 'calc(50vh)',
      autoWidth: false,
      deferRender: true,
    
      dom: 'fBtlip',
      columnDefs: [
        { targets: 5, width: "10px" },
        { targets: 4, width: "8px" },
        { targets: 3, width: "0px"},
        { targets: 2, width: "20px" },
        { targets: 1, width: "20px" },
        { targets: 0, width: "90px" },
      ],
      buttons: [
          {
            extend: 'excel',
            text: `Descargar como Excel <i class='iconsminds-download'></i>`,
            className: 'btn-excel',
            customize: function (xlsx) {
              customizeExcel(xlsx, 'Indicadores de calidad', "")
            }
          }
      ],
      columns: [
      { data: null,
        "render": function(data, type, row) {
          return "["+data.plataforma+"] ."+"["+data.base+"] ."+"["+data.esquema+"] ."+"["+data.tabla+"]"
        }
      },
      { data: 'id_atributos',
        "render": function(data, type, row) {
          let datos_atributo = window.nombreatributo[data];
          let nombre_atributo = datos_atributo[0];
          return nombre_atributo;
        }
      },
      { data: 'id_dimension',
        "render": function(data, type, row) {
          //cambiar de id_dimension a nombre de dimension
          var nombre_dimension = window.tabla_indicador_calidad[data]
          return nombre_dimension;
        }
      },
      { data: 'valor',
        "render": function(data, type, row) {
          return data + "%";
        }
      },
      { data: 'usuario_ult_actualizacion',
        "render": function(data, type, row) {
          let correo_empleado = window.CorreoEmpleado[data];
          let usuario_empleado = data
          if(correo_empleado) usuario_empleado = correo_empleado.split("@")[0];
          return usuario_empleado.toUpperCase();
        }
      },
      { data: "fecha_ult_actualizacion",
        "render": function(data, type, row) {
          var fecha_hora = data;
          var fecha_actual = fecha_hora.split("T")[0];
          return fecha_actual;
        }
      }
      ],
      language:{
        "decimal":        "",
        "emptyTable":     "No hay datos disponibles en la tabla",
        "info":           "_TOTAL_ resultados", //"Mostrando _START_ a _END_ de _TOTAL_ registros",
        "infoEmpty":      "Mostrando 0 a 0 de 0 registros",
        "infoFiltered":   "", //"(filtrando de _MAX_ registros totales)"
        "infoPostFix":    "",
        "thousands":      ",",
        "lengthMenu":     "Mostrar _MENU_ registros",
        "loadingRecords": "Cargando...",
        "processing":     "",
        "search":         "",
        "zeroRecords":    "No se encontraron registros",
        "paginate": {
            "first":      "Primero",
            "last":       "Último",
            "next":       ">",
            "previous":   "<"
        },
        "aria": {
            "sortAscending":  ": activate to sort column ascending",
            "sortDescending": ": activate to sort column descending"
        }
    },
    "pageLength":10
    });
    // Inicializar tooltips
    $('[data-toggle="tooltip"]').tooltip();
    // Se agrego un placeholder al buscador
    $('.dataTables_filter input').attr('placeholder', 'Buscar...');
  }

  //MODULO DE NOMENCLATURAS
  function getCatalogoNomenclaturas(id_catalogo) {
    let etiquetas = [];
    $().SPServices({
      operation: "GetListItems",
      async: false,
      listName: "Z_CATALOGO_OGASUITE",
      CAMLViewFields: "<ViewFields>\
                          <FieldRef Name='trans_id' />\
                          <FieldRef Name='txt_etiqueta' />\
                          <FieldRef Name='valor1' />\
                          <FieldRef Name='valor2' />\
                          <FieldRef Name='valor3' />\
                      </ViewFields>",
      completefunc: function (xData, Status) {
        $(xData.responseXML).SPFilterNode("z:row").each(function() {
          if ($(this).attr("ows_trans_id") === id_catalogo) {
            etiquetas.push({
              valor1: $(this).attr("ows_valor1"),
              valor2: $(this).attr("ows_valor2"),
              valor3: $(this).attr("ows_valor3")
            });
          }
        });
      }
    });
    return etiquetas;
  }

  function initializeAutocompleteIniciativa() {
    // Obtener listaTablas con datos de SharePoint
    let listado_momenclaturas = getCatalogoNomenclaturas("8");

    $("#input_iniciativa").autocomplete({
        source: listado_momenclaturas.map(item => item.valor3),
        select: function(event, ui) {
          let seleccionado = listado_momenclaturas.find(item => item.valor3 === ui.item.value);
           // Actualiza los combos de categoría y subcategoría
          if (seleccionado) {
            $('#categoria').val(seleccionado.valor1).trigger('change');
            setTimeout(function() {
                $('#subcategoria').val(seleccionado.valor2).trigger('change');
            }, 200); // Añade un pequeño retraso para asegurar que el combo de subcategoría se actualice correctamente
          }
        }
    }).autocomplete("widget").addClass("fixed-height");

    // Añado controladores de eventos para los cambios en los combos de categoría y subcategoría
    $('#categoria, #subcategoria').on('change', function() {
      actualizarIniciativa(listado_momenclaturas);
    });
  }

  function ListadoNomenclaturas() {

    //obtener el correo del empleado por medio del codigo.
    window.CorreoEmpleado=getDataOwners()[2];

    var listado_momenclaturas = getCatalogoNomenclaturas("8");
    var categoriaSelect = $('#categoria');

    // Crear conjuntos para asegurar unicidad
    var categoriasUnicas = new Set();
    //var subcategoriasUnicas = new Set();
  
    // Añadir nuevas opciones al combo
    $.each(listado_momenclaturas, function(index, item) {
      categoriasUnicas.add(item.valor1);
    });
  
    // Añado categorías únicas al select de categorías
    categoriasUnicas.forEach(function(categoria) {
      categoriaSelect.append($('<option>', {
          value: categoria,
          text: categoria
      }));
    });
  
    // Inicializar Select2 después de agregar todas las opciones
    $('.select2-single').select2({
      theme: "bootstrap4",
      placeholder: "",
      width: '100%'
    });
  
    // Controlador de eventos para cuando se selecciona una categoría
    categoriaSelect.on('change', function() {
      var categoriaSeleccionada = $(this).val();
      actualizarSubcategorias(categoriaSeleccionada, listado_momenclaturas);
    });
  
    //recorro la varibale listado_momenclaturas
    let consulta_data_tabla=[];
    for (const [key, value] of Object.entries(listado_momenclaturas)) {
      consulta_data_tabla.push(value)
    }

    //recorro la varibale listado_mis_campañas
    var listado_mis_campañas = getABREV_CAMAPAÑAS();
    window.lista_campañas_generadas = listado_mis_campañas;

    let data_tabla=[];
    for (const [key, value] of Object.entries(listado_mis_campañas)) {
      data_tabla.push(value)
    }
    //lleno la tabla para el modal de consulta de nomenclaturas
    setDataTableCatalogo_Nomenclatura(consulta_data_tabla);
    //funcion de autocompletado para el input de iniciativa
    initializeAutocompleteIniciativa();
    //tabla mis campañas
    setDataTableAbrev_campañas(data_tabla);
    SegmentadorNomenclatura();
  }

  //filtro para mostrar las subcategorias de cada categoria
  function actualizarSubcategorias(categoriaSeleccionada, listado_momenclaturas) {
    var subcategoriaSelect = $('#subcategoria');
    subcategoriaSelect.empty();
  
    var subcategoriasFiltradas = listado_momenclaturas.filter(function(item) {
      return item.valor1 === categoriaSeleccionada;
    });
  
    // Añadir nuevas opciones al select de subcategorías
    subcategoriasFiltradas.forEach(function(item) {
      subcategoriaSelect.append($('<option>', {
          value: item.valor2,
          text: item.valor2
      }));
    });
  
    // Inicializar Select2 después de agregar todas las opciones
    subcategoriaSelect.select2({
      theme: "bootstrap4",
      placeholder: "",
      width: '100%'
    });
  }

  function copiarAlPortapapeles() {

      //Obtengo los campos para verificar si estan llenos o vacios y de esta manera enviar la alerta
      var categoria = document.getElementById('categoria').value;
      var subcategoria = document.getElementById('subcategoria').value;
      var descripcion_campaña = document.getElementById('descripcion_campaña').value.toUpperCase();
      const texto_Copiar = document.getElementById('clave').innerText;
      
      if((categoria!=="")&& (subcategoria!=="")&&(descripcion_campaña!=="")){
          if (!navigator.clipboard) {
            // Metodo alternativo para navegadores antiguos
            const textArea = document.createElement("textarea");
            textArea.value = texto_Copiar;
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            try {
                document.execCommand('copy');
                showNotification("top", "center", "success", "El texto ha sido copiado al portapapeles.");
            } catch (err) {
                console.error('Error al copiar al portapapeles (fallback): ', err);
            }
            document.body.removeChild(textArea);
            return;
          }
          navigator.clipboard.writeText(texto_Copiar).then(() => {
            showNotification("top", "center", "success", "El texto ha sido copiado al portapapeles.");
          }).catch(err => {
              console.error('Error al copiar al portapapeles: ', err);
          });

      }else{
        showNotification("top", "center", "danger", "Debe llenar todos los campos antes de copiar en el portapapeles.");
      }
  }

  function setDataTableCatalogo_Nomenclatura(consulta_data_tabla){

    $('#consulta_lista_Nomenclaturas').DataTable({
      data: consulta_data_tabla,
      paging: true,
      colResize: {
        isEnabled: true,
        hasBoundCheck: false
      },
      
      lengthChange: true,
      info: true,
      scrollX: true,
      scrollCollapse: true,
      scrollY: 'calc(40vh)',
      autoWidth: false,
      deferRender: true,
    
      dom: 'fBtlip',
      columnDefs: [
        { targets: 2, width: "30px" },
        { targets: 1, width: "30px" },
        { targets: 0, width: "70px" },
      ],
      buttons: [
          {
            extend: 'excel',
            text: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-filetype-xls icon-excel-btn diseño-excel" viewBox="0 0 16 16" data-toggle="tooltip" title="Descargar Excel"> <path fill-rule="evenodd" d="M14 4.5V14a2 2 0 0 1-2 2h-1v-1h1a1 1 0 0 0 1-1V4.5h-2A1.5 1.5 0 0 1 9.5 3V1H4a1 1 0 0 0-1 1v9H2V2a2 2 0 0 1 2-2h5.5zM6.472 15.29a1.2 1.2 0 0 1-.111-.449h.765a.58.58 0 0 0 .254.384q.106.073.25.114.143.041.319.041.246 0 .413-.07a.56.56 0 0 0 .255-.193.5.5 0 0 0 .085-.29.39.39 0 0 0-.153-.326q-.152-.12-.462-.193l-.619-.143a1.7 1.7 0 0 1-.539-.214 1 1 0 0 1-.351-.367 1.1 1.1 0 0 1-.123-.524q0-.366.19-.639.19-.272.527-.422.338-.15.777-.149.457 0 .78.152.324.153.5.41.18.255.2.566h-.75a.56.56 0 0 0-.12-.258.6.6 0 0 0-.247-.181.9.9 0 0 0-.369-.068q-.325 0-.513.152a.47.47 0 0 0-.184.384q0 .18.143.3a1 1 0 0 0 .405.175l.62.143q.326.075.566.211a1 1 0 0 1 .375.358q.135.222.135.56 0 .37-.188.656a1.2 1.2 0 0 1-.539.439q-.351.158-.858.158-.381 0-.665-.09a1.4 1.4 0 0 1-.478-.252 1.1 1.1 0 0 1-.29-.375m-2.945-3.358h-.893L1.81 13.37h-.036l-.832-1.438h-.93l1.227 1.983L0 15.931h.861l.853-1.415h.035l.85 1.415h.908L2.253 13.94zm2.727 3.325H4.557v-3.325h-.79v4h2.487z"/></svg>',
            className: 'btn-excel',
            customize: function (xlsx) {
              customizeExcel(xlsx, 'Nomenclaturas Campañas', "")
            }
          }
      ],
      columns: [
      {data: 'valor3'},
      {data: 'valor1'},
      {data: 'valor2'},
      ],
      language:{
        "decimal":        "",
        "emptyTable":     "No hay datos disponibles en la tabla",
        "info":           "_TOTAL_ resultados", //"Mostrando _START_ a _END_ de _TOTAL_ registros",
        "infoEmpty":      "Mostrando 0 a 0 de 0 registros",
        "infoFiltered":   "", //"(filtrando de _MAX_ registros totales)"
        "infoPostFix":    "",
        "thousands":      ",",
        "lengthMenu":     "Mostrar _MENU_ registros",
        "loadingRecords": "Cargando...",
        "processing":     "",
        "search":         "",
        "zeroRecords":    "No se encontraron registros",
        "paginate": {
            "first":      "Primero",
            "last":       "Último",
            "next":       ">",
            "previous":   "<"
        },
        "aria": {
            "sortAscending":  ": activate to sort column ascending",
            "sortDescending": ": activate to sort column descending"
        }
    },
    "pageLength":25
    });
    // Inicializar tooltips
    $('[data-toggle="tooltip"]').tooltip();
    // Se agrego un placeholder al buscador
    $('.dataTables_filter input').attr('placeholder', 'Buscar...');
  }

  function actualizarIniciativa(listado_momenclaturas) {
    var categoriaSeleccionada = $('#categoria').val();
    var subcategoriaSeleccionada = $('#subcategoria').val();

    if (categoriaSeleccionada && subcategoriaSeleccionada) {
        let iniciativaSeleccionada = listado_momenclaturas.find(item => 
            item.valor1 === categoriaSeleccionada && item.valor2 === subcategoriaSeleccionada
        );

        if (iniciativaSeleccionada) {
            $('#input_iniciativa').val(iniciativaSeleccionada.valor3);
        }
    }
  }

  function escribir_lista_ClaveCampaña(categoria,sub_categoria,descripcion,nombre_campania,codigo,fecha){

    //Crearé el nuevo registro con casi todos los campos en blanco
    array_dato_lista_abrev_camapañas =[
      ["categoria", categoria],
      ["sub_categoria", sub_categoria],
      ["descripcion", descripcion],
      ["nombre_campania", nombre_campania],
      ["cod_usuario", codigo],
      ["fecha_creacion", fecha],
    ]

    //Finalmente escribo el nuevo registro
    $().SPServices({
      operation: "UpdateListItems",
      async: false,
      batchCmd: "New",
      listName: "Z_ABREV_CAMAPAÑAS",
      valuepairs: array_dato_lista_abrev_camapañas,
      completefunc: function(xData, Status) {}
    })

  }

  function getABREV_CAMAPAÑAS(){
    let datos = [];
    $().SPServices({
      operation: "GetListItems",
      async: false,
      listName: "Z_ABREV_CAMAPAÑAS",
      CAMLViewFields: "<ViewFields>\
                          <FieldRef Name='fecha_creacion' />\
                          <FieldRef Name='cod_usuario' />\
                          <FieldRef Name='categoria' />\
                          <FieldRef Name='sub_categoria' />\
                          <FieldRef Name='descripcion' />\
                          <FieldRef Name='nombre_campania' />\
                      </ViewFields>",
          completefunc: function (xData, Status) {
            $(xData.responseXML).SPFilterNode("z:row").each(function() {
              datos.push({
                fecha_creacion: $(this).attr("ows_fecha_creacion"),
                cod_usuario: $(this).attr("ows_cod_usuario"),
                categoria: $(this).attr("ows_categoria"),
                sub_categoria: $(this).attr("ows_sub_categoria"),
                descripcion: $(this).attr("ows_descripcion"),
                nombre_campania: $(this).attr("ows_nombre_campania")
              });
            })
          }
      });
      return datos;
  }

  function setDataTableAbrev_campañas(data_tabla){
     // Si la tabla ya está inicializada.
    if ($.fn.DataTable.isDataTable('#consulta_mis_campañas_generadas')) {
      $('#consulta_mis_campañas_generadas').DataTable().destroy();
    }

    var table = $('#consulta_mis_campañas_generadas').DataTable({
      data: data_tabla,
      paging: true,
      colResize: {
        isEnabled: true,
        hasBoundCheck: false
      },
      
      lengthChange: true,
      info: true,
      scrollX: true,
      scrollCollapse: true,
      scrollY: 'calc(10vh)',
      autoWidth: false,
      deferRender: true,
    
      dom: 'ftlip',
      columnDefs: [
        { targets: 5, width: "7px" },
        { targets: 4, width: "5px" },
        { targets: 3, width: "5px" },
        { targets: 2, width: "5px" },
        { targets: 1, width: "5px" },
        { targets: 0, width: "40px" },
      ],
      columns: [
        {data:'nombre_campania'},
        {data:'categoria'},
        {data:'sub_categoria'},
        {data:'descripcion',
          "render": function(data, type, row) {
            return data.toUpperCase();
          }
        },
        {data:'cod_usuario',
          "render": function(data, type, row) {
            let correo_empleado = window.CorreoEmpleado[data];
            let usuario_empleado = data
            if(correo_empleado) usuario_empleado = correo_empleado.split("@")[0];
            return usuario_empleado.toUpperCase();
          }
        },
        {data:'fecha_creacion',
          "render": function(data, type, row) {
            let fechacompleta = data
            let fecha = fechacompleta.split("T")[0];
            return fecha;
          }
        },
      ],
      language:{
        "decimal":        "",
        "emptyTable":     "No hay datos disponibles en la tabla",
        "info":           "_TOTAL_ resultados", //"Mostrando _START_ a _END_ de _TOTAL_ registros",
        "infoEmpty":      "Mostrando 0 a 0 de 0 registros",
        "infoFiltered":   "", //"(filtrando de _MAX_ registros totales)"
        "infoPostFix":    "",
        "thousands":      ",",
        "lengthMenu":     "Mostrar _MENU_ registros",
        "loadingRecords": "Cargando...",
        "processing":     "",
        "search":         "",
        "zeroRecords":    "No se encontraron registros",
        "paginate": {
            "first":      "Primero",
            "last":       "Último",
            "next":       ">",
            "previous":   "<"
        },
        "aria": {
            "sortAscending":  ": activate to sort column ascending",
            "sortDescending": ": activate to sort column descending"
        }
    },
    "pageLength":25
    });
    // Inicializar tooltips
    $('[data-toggle="tooltip"]').tooltip();
    // Se agrego un placeholder al buscador
    $('.dataTables_filter input').attr('placeholder', 'Buscar...');
    //filtrar solo por los del usuario que ingresa al modal
  }

  function ListenerGuardarClaveCampaña() {
    let lista_campañas_generadas = getABREV_CAMAPAÑAS();

    // Helper para verificar si ya existe una clave
    const verificarClaveExistente = (cod_usuario, categoria, subcategoria, descripcion_campaña, clave, localISODate) => {
        for (let llave in lista_campañas_generadas) {
            let objeto = lista_campañas_generadas[llave];
            let objetoFecha = objeto["fecha_creacion"].split("T")[0];// Extrae la fecha sin la hora

            if (objeto["cod_usuario"] == cod_usuario &&
                objeto["categoria"] == categoria &&
                objeto["sub_categoria"] == subcategoria &&
                objeto["descripcion"] == descripcion_campaña &&
                objeto["nombre_campania"] == clave &&
                objetoFecha == localISODate) {
                return true;
            }
        }
        return false;
    };

    // Obtengo el usuario que está haciendo los cambios
    let datos_usuario = getUserAndDate();
    let array_datos_usuario = datos_usuario[0];
    let cod_usuario = array_datos_usuario[0];
    let localISOTime = datos_usuario[1];
    let localISODate = localISOTime.split("T")[0]; // Extrae la fecha sin la hora

    // Obtengo los datos de los input
    let categoria = $('#categoria').val();
    let subcategoria = $('#subcategoria').val();
    let descripcion_campaña = $('#descripcion_campaña').val();
    let clave = $('#clave').text();

    // Verifico si ya existe una clave con los mismos datos y la misma fecha
    if (!verificarClaveExistente(cod_usuario, categoria, subcategoria, descripcion_campaña, clave, localISODate)) {
        if (categoria !== "" && subcategoria !== "" && descripcion_campaña !== "" && clave !== "") {
            escribir_lista_ClaveCampaña(
                categoria,
                subcategoria,
                descripcion_campaña,
                clave,
                cod_usuario,
                localISOTime
            );
            showNotification("top", "center", "success", "Su clave se guardó con éxito");

            // Actualizar la tabla
            let listado_mis_campañas = getABREV_CAMAPAÑAS();
            let data_tabla = [];
            for (const [key, value] of Object.entries(listado_mis_campañas)) {
                data_tabla.push(value);
            }
            setDataTableAbrev_campañas(data_tabla);
        } else {
            showNotification("top", "center", "danger", "Debe llenar todos los campos antes de guardar.");
        }
    } else {
        showNotification("top", "center", "danger", "Ya existe una clave con los mismos datos en el día de hoy.");
    }
  }

  //Segmentador tabla Nomenclaturas
  function SegmentadorNomenclatura() {    
    document.getElementById('opcion-todas').addEventListener('click', function() {
      actualizarTablaSegmentador();
    });
    document.getElementById('mis-campañas').addEventListener('click', function() {
      actualizarTablaSegmentador(window.current_user);
    });
  }

  //Funcion para el filtro del segmentador
  function actualizarTablaSegmentador(filtro) {
    var tabla = $('#consulta_mis_campañas_generadas').DataTable();
    let listado_mis_campañas = getABREV_CAMAPAÑAS();
    let data_tabla = Object.values(listado_mis_campañas);
    setDataTableAbrev_campañas(data_tabla);
    if (filtro) {
      tabla.column(4).search(filtro, true, false).draw();
    } else {
      tabla.column(4).search('^(?!' + window.current_user + ').*|^' + window.current_user + '$', true, false).draw();
    }
  }

  function FormularioGuardarNomenclatura(){

    // Obtener los valores de los campos de entrada
    const iniciativa = document.getElementById('input_iniciativa').value;
    const categoria = document.getElementById('categoria').value;
    const subcategoria = document.getElementById('subcategoria').value;

    if(iniciativa!=="" && categoria!=="" && subcategoria!==""){
      EscribirListaCatalogoOGASuite(
        iniciativa.toUpperCase(),
        categoria.toUpperCase(),
        subcategoria.toUpperCase()
      );
      showNotification("top", "center", "success", "Se registro con exito su catalogo");
    }else{
      showNotification("top", "center", "danger", "Debe llenar todos los campos antes de guardar");
    }

  }


  function EscribirListaCatalogoOGASuite(iniciativa , categoria ,sub_categoria){

      // Obtengo el usuario que está haciendo los cambios
      let datos_usuario = getUserAndDate();
      let array_datos_usuario = datos_usuario[0];
      let cod_usuario = array_datos_usuario[0];
      let localISOTime = datos_usuario[1];
     //Crearé el nuevo registro con casi todos los campos en blanco
    array_dato_lista_CatalogoOGASuite =[
      ["trans_id", "8"],
      ["txt_etiqueta", "Nomenclaturas Campañas"],
      ["valor3", iniciativa],
      ["valor2", sub_categoria],
      ["valor1", categoria],
      ["valor6", cod_usuario],
      ["valor7", localISOTime],
    ]

    //Finalmente escribo el nuevo registro
    $().SPServices({
      operation: "UpdateListItems",
      async: false,
      batchCmd: "New",
      listName: "Z_CATALOGO_OGASUITE",
      valuepairs: array_dato_lista_CatalogoOGASuite,
      completefunc: function(xData, Status) {}
    })
  }

  //Función a cargar en página de SinAcceso
  function SinAcceso(){
    let btnSolicitarAcceso = document.getElementById("btn-solicitar-acceso")
    btnSolicitarAcceso.disabled = false;
    btnSolicitarAcceso.addEventListener("click", function(e){
      e.preventDefault();
      e.stopImmediatePropagation();
      let datosUsuario = obtenerUsuario()
      let br = "&lt;br&gt;"
      // escribirListaCorreo("A QUIEN SE SOLICITA","DESTINATARIO CORREO", "ASUNTO CORREO", "MENSAJE CORREO")
      escribirListaCorreo(
        "Jose",
        "jsalas", 
        "Autorización de acceso a Oga Suite",
        `El usuario con la siguiente información ha solicitado a Oga Suite:${br}usuario: ${datosUsuario.current_user}${br}Nombre: ${datosUsuario.nombreCompleto}${br}Correo: ${datosUsuario.current_email}${br}${br}Por favor tomar contacto con el usuario para solventar su pedido.${br}Saludos,` )
      alert("Se ha solicitado acceso al sitio web")
      btnSolicitarAcceso.disabled = true;
    })
  }

  function InventarioArtefactos(){
    
  }

  //Función para actualizar ordinal position en Z_INF_TECNICA CORTA
  //Debe ejecutarse desde EXPLORADOR DE METADATOS
  function actualizarOrdinalPositions(){
    let llaves_unicas = window.info_tecnicacorta.map(e=>e.llave_unica)
    // let filtrado = window.info_tecnica.filter(e=> llaves_unicas.includes(e.llave_unica))
    let filtrado = window.info_tecnica.filter(e=> llaves_unicas.includes(e.llave_unica) && e.ordinal_position && e.ordinal_position !== '999' )
    // filtrado.forEach(e=>{
    //   $().SPServices.SPUpdateMultipleListItems({
    //     async: false,
    //     listName: "Z_INF_TECNICA",
    //     batchCmd: "Update",
    //     CAMLQuery: '<Query><Where>\
    //                   <And>\
    //                     <Eq><FieldRef Name="servidor"/><Value Type="Text">'+e.servidor+'</Value></Eq>\
    //                     <And>\
    //                       <Eq><FieldRef Name="base"/><Value Type="Text">'+e.base+'</Value></Eq>\
    //                       <And>\
    //                         <Eq><FieldRef Name="esquema"/><Value Type="Text">'+e.esquema+'</Value></Eq>\
    //                         <And>\
    //                           <Eq><FieldRef Name="tabla"/><Value Type="Text">'+e.tabla+'</Value></Eq>\
    //                           <Eq><FieldRef Name="campo"/><Value Type="Text">'+e.campo+'</Value></Eq>\
    //                         </And>\
    //                       </And>\
    //                     </And>\
    //                   </And>\
    //                 </Where></Query>',
    //     valuepairs: [
    //       ["ordinal_position", e.ordinal_position]
    //     ],
    //     completefunc: function (xData, Status) {}
    //   })
    // })
    return filtrado
  }

function distanciaLevenshtein(texto1, texto2) {
  const m = texto1.length;
  const n = texto2.length;

  // Crear una matriz (tabla) de m+1 x n+1 para almacenar los costos
  const dp = Array(m + 1).fill(null).map(() => Array(n + 1).fill(0));

  // Inicializar la primera fila y columna con los costos de las operaciones triviales
  for (let i = 0; i <= m; i++) {
      dp[i][0] = i; // Costo de eliminar todos los caracteres de texto1
  }
  for (let j = 0; j <= n; j++) {
      dp[0][j] = j; // Costo de insertar todos los caracteres en texto2
  }

  // Rellenar la matriz usando el enfoque de programación dinámica
  for (let i = 1; i <= m; i++) {
      for (let j = 1; j <= n; j++) {
          const costo = texto1[i - 1] === texto2[j - 1] ? 0 : 1;

          // Tomar el mínimo costo entre: eliminar, insertar o reemplazar
          dp[i][j] = Math.min(
              dp[i - 1][j] + 1,     // Eliminación
              dp[i][j - 1] + 1,     // Inserción
              dp[i - 1][j - 1] + costo // Sustitución
          );
      }
  }

  // La distancia de Levenshtein es el valor en la esquina inferior derecha de la matriz
  return dp[m][n];
}

function calcularSimilitud(texto1, texto2){
  texto1 = texto1.toLocaleLowerCase().split(" ").join("").replaceAll("<br>", "")
  texto2 = texto2.toLocaleLowerCase().split(" ").join("").replaceAll("<br>", "")
  const distancia = distanciaLevenshtein( texto1, texto2 )
  const longitudMax = Math.max(texto1.length, texto2.length)
  // Calcular el porcentaje de similitud
  const similitud = 1 - (distancia / longitudMax);
        
  // Convertir a porcentaje (multiplicando por 100)
  return similitud * 100;
}

function esSimilitudAceptable(texto1, texto2, tolerancia = 80) {
  texto1 = texto1.toLocaleLowerCase().split(" ").join("").replaceAll("<br>", "");
  texto2 = texto2.toLocaleLowerCase().split(" ").join("").replaceAll("<br>", "");

  const longitudMax = Math.max(texto1.length, texto2.length);
  const maxDistancia = (1 - tolerancia / 100) * longitudMax;

  // Validar si la diferencia de longitud ya supera el umbral de tolerancia
  const diffLongitudes = Math.abs(texto1.length - texto2.length);
  
  // Devolver directamente el resultado de la comparación
  return diffLongitudes <= maxDistancia;
}



function getFavoritesByUser(){
  let favorites = []
  window.favoritosJson = {}
  let userCode = getEmployeeCodeByUser()
  $().SPServices({
    operation: "GetListItems",
    async: false,
    listName: "Z_FAVORITOS",
    CAMLQuery: `<Query><Where><Eq><FieldRef Name="usuario"/><Value Type="text">${userCode}</Value></Eq></Where></Query>`,
    CAMLViewFields: "<ViewFields>\
                          <FieldRef Name='usuario' />\
                          <FieldRef Name='nombre_url' />\
                          <FieldRef Name='url' />\
                          <FieldRef Name='llave_favorito'/>\
                          <FieldRef Name='prueba'/>\
                          <FieldRef Name='prueba2'/>\
                    </ViewFields>",
    completefunc: function (xData, Status) {
        $(xData.responseXML).find("z\\:row").each(function () {
          let favorite = {
            user : $(this).attr("ows_usuario") || "",
            name : $(this).attr("ows_nombre_url") || "",
            url : $(this).attr("ows_url") || "",
            key: $(this).attr("ows_llave_favorito") || "",
            prueba: $(this).attr("ows_prueba") || "",
            prueba2: $(this).attr("ows_prueba2") || "",
            
          }
          if(favorite.url === window.location.href && favorite.user === userCode){
            $("#bookmark-name").val(favorite.name)
            $("#iconoFavoritos").addClass("text-primary")
          }
          window.favoritosJson[favorite.key] = favorite
          favorites.push(favorite)
        });
    }
  });
  window.favoritos = favorites;
  return favorites;
}

function setFavoriteList(){
  let favoriteListWrapper = document.getElementById("favoriteListWrapper")
  favoriteListWrapper.innerHTML = getFavoriteList()
}

function getFavoriteList(){
  let favoriteList = ""
  let favorites = getFavoritesByUser()
  favorites?.forEach(e=>{
    favoriteList += ` <div class="d-flex flex-row px-1 rounded-lg card mb-2" style="box-shadow: 0 2px 5px 1px rgba(64,60,67,.16)" >
                        <div class="d-flex flex-grow-1 min-width-zero justify-content-between">
                            <div
                                class="align-self-center d-flex flex-column flex-lg-row justify-content-between min-width-zero align-items-lg-center py-3 w-100">
                                <a href="${e.url}" class="w-100 w-sm-100">
                                    <p class="list-item-heading mb-0" style="font-size: .875rem">${e.name}</p>
                                </a>
                            </div>
                            <i class="simple-icon-pencil align-self-center mr-2" style="color:#160F41; cursor:pointer;" id="btnEditFavorite" onclick="editFavorite('${e.key}')"></i>
                            <i class="simple-icon-trash align-self-center mr-2 text-danger" style="cursor:pointer;" id="btnDeleteFavorite" onclick="removeFavorite('${e.key}')"></i>
                        </div>
                    </div>`
  })

  return favoriteList;
}

function addFavorite(){
  // $()
  let nombre = document.title
  let bookmarkName = $("#bookmark-name").val()
  let usuario = getEmployeeCodeByUser()
  let url = $("#bookmark-url").val()
  let key = `${usuario}_${url}`
  let actualizar = window.favoritos?.filter(e=>e.key===`${key}`).length > 0
  if(actualizar){
    $().SPServices.SPUpdateMultipleListItems({
      async: true,
      listName: "Z_FAVORITOS",
      batchCmd: "Update",
      CAMLQuery: `<Query><Where>\
        <Eq><FieldRef Name="llave_favorito"/><Value Type="Text">${key}</Value></Eq>\
      </Where></Query>`,
      valuepairs: [
        ["nombre_url", bookmarkName],
        ["url", url],
        ["llave_favorito", key],
    ],
    completefunc: function (xData, Status) {
    } //completefunc
    });
  }else{
    $().SPServices({
      operation: "UpdateListItems",
      async: false,
      batchCmd: "New",
      listName: "Z_FAVORITOS",
      valuepairs: [
                ["usuario", usuario],
                ["nombre_url", bookmarkName],
                ["url", url],
                ["llave_favorito", key],
              ],
      completefunc: function(xData, Status) {
      }
    });
  }
  setFavoriteList()
  $("#favoritosMenuDropwdown").removeClass("show")
}

function editFavorite(e){
  let favorite = window.favoritosJson[e]
  $("#bookmark-name").val(favorite.name)
  $("#bookmark-url").val(favorite.url)
  let usuario = getEmployeeCodeByUser()
}

function removeFavorite(e){
  $().SPServices.SPUpdateMultipleListItems({
    async: true,
    listName: "Z_FAVORITOS",
    batchCmd: "Delete",
    CAMLQuery:`<Query><Where><Eq><FieldRef Name="llave_favorito"/><Value Type="Text">${e}</Value></Eq></Where></Query>`,
    completefunc: function (xData, Status) {
    } //completefunc
  });
  $("#bookmark-name").val(document.title)
  setFavoriteList()
}

function AdministracionAtributos(){
  let data = getAtributosAdministrar()
  setDataTableAdministracionAtributos(data)
  listenerAdministracionAtributos()
}

function getAtributosAutorizacion(){
  let atributosAutorizacion = {}
  $().SPServices({
    operation: "GetListItems",
    async: false,
    listName: "Z_APROBACIONES",
    CAMLQuery: `<Query><Where>\
    <And>\
    <Eq><FieldRef Name="TIPO_CAMBIO"/><Value Type="Text">6</Value></Eq>\
    <Eq><FieldRef Name="ESTADO_APROBACION"/><Value Type="Text">PENDIENTE</Value></Eq>\
    </And></Where></Query>`,
    CAMLViewFields: "<ViewFields>\
                        <FieldRef Name='DATO1' />\
                        <FieldRef Name='DATO2' />\
                        <FieldRef Name='DATO4' />\
                        <FieldRef Name='ORIGINAL' />\
                        <FieldRef Name='SOLICITAD' />\
                    </ViewFields>",
    completefunc: function (xData, Status) {
        $(xData.responseXML).find("z\\:row").each(function () {
          let id = $(this).attr("ows_DATO1") || ""
          let tipoMetadato = "ATRIBUTO"
          let nombreAtributo =$(this).attr("ows_DATO2") || ""
          let solicitado =$(this).attr("ows_SOLICITADO") || ""
          let cambioSolicitado = $(this).attr("ows_DATO4") || ""
          // if(!nombreAtributo.trim() || !etiquetaTecnica.trim()){
          atributosAutorizacion[id]={
            id,
            tipoMetadato,
            nombreAtributo,
            cambioSolicitado
          }
          // }
          
        });
    }
  });
  return atributosAutorizacion;
}

function getAtributosAdministrar(){
  let lista=[]
  let atributosAutorizacion = getAtributosAutorizacion()
  $().SPServices({
    operation: "GetListItems",
    async: false,
    listName: "Z_DICCIONARIO_DATOS",
    CAMLQuery: `<Query><Where><Eq><FieldRef Name="tipo_metad"/><Value Type="Text">ATRIBUTO</Value></Eq></Where></Query>`,
    CAMLViewFields: "<ViewFields>\
                        <FieldRef Name='tipo_metad' />\
                        <FieldRef Name='id_metad' />\
                        <FieldRef Name='nombre_metad' />\
                        <FieldRef Name='descripcion_metad' />\
                        <FieldRef Name='etiqueta_tecnica'/>\
                        <FieldRef Name='dato_personal'/>\
                        <FieldRef Name='golden_record'/>\
                        <FieldRef Name='caracteristicas'/>\
                    </ViewFields>",
    completefunc: function (xData, Status) {
        $(xData.responseXML).find("z\\:row").each(function () {
          let id = $(this).attr("ows_id_metad") || ""
          let tipoMetadato =$(this).attr("ows_tipo_metad") || ""
          let nombreAtributo =$(this).attr("ows_nombre_metad") || ""
          let descripcion =$(this).attr("ows_descripcion_metad") || ""
          let etiquetaTecnica =$(this).attr("ows_etiqueta_tecnica") || ""
          let datoPersonal = $(this).attr("ows_dato_personal") || ""

          // if(!nombreAtributo.trim() || !etiquetaTecnica.trim()){
          atributo = {
            id,
            tipoMetadato,
            nombreAtributo,
            descripcion,
            etiquetaTecnica,
            datoPersonal,
          }
          // Verificación si ya existe una petición para ese atributo y mostrar data actualizada en la tabla
          let atributoPendiente = atributosAutorizacion[id]
          if(atributoPendiente){
            if(atributoPendiente.cambioSolicitado === "nombre_metad") atributo.nombreAtributo = atributoPendiente.solicitado
            else atributo.descripcion = atributoPendiente.solicitado
          }
          lista.push(atributo)
          // }
          
        });
    }
  });

  return lista;
}
function getOpcionesDatosPersonales(){
  let catalogoSegmentos = getCatalogoSegmentador()['Protección Datos Personales'];
  let opciones = `<option opction="">No Asignado</option><option value="0">No Aplica</option>`
  catalogoSegmentos?.forEach(opcion=> {if(opcion.subsegmento < 10) opciones+=`<option value="${opcion.subsegmento}">${opcion.label}</option>`})
  return opciones;
}

function setDataTableAdministracionAtributos(data){
 
  let opcionesSelect = getOpcionesDatosPersonales()
  
  let table = $('#tbl_atributos_pendientes').DataTable({
    data: data,
    paging: true,
    colResize: {
      isEnabled: true,
      hasBoundCheck: false
    },
    lengthChange: true,
    info: true,
    scrollX: true,
    scrollCollapse: true,
    scrollY: 'calc(50vh)',
    autoWidth: true,
    deferRender: true,
    dom: 'fBtlip',
    columnDefs: [
      { targets: 4, width: "200px" },
      { targets: 3, width: "400px" },
      { targets: 2, width: "200px" },
      { targets: 1, width: "5px" },
      { targets: 0, width: "0px" },
    ],
    buttons: [
      {
        text: `<i class="iconsminds-add btn-primary rounded" id="nuevoatributo"></i>`,
        // className: 'btn-excel',
        action: function(e,dt,button,config){
          addAtributo()
        }
      },
      {
        text: 'Descargar como Excel <i class='+"iconsminds-download"+'></i>',
        // className: 'btn-excel',
        action: function(e,dt,button,config){
          let datatable = $('#tbl_atributos_pendientes').DataTable()
          let headers = {
            "nombreAtributo": "Atributo",
            "descripcion" : "Descripción de atributo",
            "datoPersonal": "Clasificación datos personales"
          }
          customizeExcelDataTable({datatable, headers})  
        }
      }
    ],
    columns: [
      //CAMPO NO VISIBLE PARA CONTROLAR ORDEN INICIAL SIMILAR A ENTIDADES PENDIENTES
      {
        data: null,
        visible:false,
        render: function (data, type, row) {
          if(!row.etiquetaTecnica.trim()) return `AA`
          else if(!row.nombreAtributo.trim()) return "BB"
          else return row.nombreAtributo
        }
      },
      {
        data: null,
        render: function (data, type, row) {
          return '<button class="iconsminds-save btnGuardarClasificacionAtributo" data-toggle="tooltip" title="Guardar Documentación"></button>';
        }
      },
      {
        data: "nombreAtributo",
        render: function (data, type, row) {
          return `<p style="display:none;">${data}</p><div class="d-flex align-items-center" style="gap:5px;"><input value="${data}" class="form-control rounded-lg inputNombreAtributo" placeholder="Ingrese el nombre del atributo"/><i class="simple-icon-link" style="cursor:pointer;  color:#6c757d;" onclick="window.open('${BASE_URL}/Glosario.aspx?buscar=${data}', '_blank')"></i></div>`
        }
      },       
      {data: "descripcion", render:function(data,type,row){
        return `<p style="display:none;">${data}</p><input value="${data}" class="form-control rounded-lg inputDescripcionAtributo" placeholder="Ingrese la descripción del atributo"/> `
      }},
      {
        data: "datoPersonal",
        render: function (data, type, row) {
          return `<p style="display:none;">${data}</p><select class="form-control selectDatosPersonales select2-single"></select>`
        },
        createdCell: function (td, cellData, rowData, row, col) {
          // Inicializar Select2 después de agregar todas las opciones al select
          let select = $(td).find('.selectDatosPersonales');

          // Inicializar Select2 con las opciones necesarias
          select.select2({
            theme: "bootstrap",
            placeholder: "",
            maximumSelectionSize: 6,
            width: '100%'
          });

          // Función para llenar y filtrar el select automáticamente
          select.html(opcionesSelect)
          if(rowData.datoPersonal) select.val(rowData.datoPersonal).trigger('change') 
            
        }
      },
    ],
    language:{
      "search":"",
    },
    "pageLength":50,
    "drawCallback": function(){
      let tooltipTriggerList = document.querySelectorAll('[data-toggle="tooltip"]');
      let tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl, {
        boundary: document.body,
        container: 'body',
        trigger: 'hover'
      }));
    
      tooltipList.forEach((tooltip) => { $('.tooltip').hide(); });
    }
  });
  // // Inicializar tooltips
  // $('[data-toggle="tooltip"]').tooltip();
  // Se agrego un placeholder al buscador
  $('.dataTables_filter input').attr('placeholder', 'Buscar...');
  $(".dt-buttons").css("float","right");

}

function customizeExcelDataTable({datatable, headers}){
  let data = datatable.rows().data().toArray();
  datosPersonalesJson={}
  datosPersonalesJson[0] = "No Aplica"
  let catalogoDatosPersonales = getCatalogoSegmentador()["Protección Datos Personales"]?.forEach(e=> datosPersonalesJson[e.subsegmento] = e.label)
  const workbook = XLSX.utils.book_new();

  let hoja = {
    name : 'Hoja',
    data : []
  }
  hoja.data.push(["Banco de Guayaquil"])
  hoja.data.push(["Oficina de Gobierno de la Información"])
  hoja.data.push(["Administración de Atributos"])
  hoja.data.push(["Generado: "+getCurrentDate()])
  hoja.data.push([])

  const nombreColumnas = Object.values(headers);
  hoja.data.push(nombreColumnas)
  const keys = Object.keys(headers)
  data.forEach(elemento=>{
    let fila = keys.map(column => {
      if(column === "datoPersonal"){
        elemento[column] = datosPersonalesJson[elemento[column]] || "No Asignado"
      }
      return elemento[column]
    })
    hoja.data.push(fila)
  })
  const nuevaHoja = XLSX.utils.aoa_to_sheet(hoja.data)
  for(let i = 0; i<4; i++){
    applyBoldToRow(nuevaHoja, i)
  }

  XLSX.utils.book_append_sheet(workbook,nuevaHoja, hoja.name)

  XLSX.writeFile(workbook, 'Administracion de Atributos.xlsx')
}


function listenerAdministracionAtributos(){
  let dataTable = $('#tbl_atributos_pendientes').DataTable();
  $("#tbl_atributos_pendientes tbody").on("click",'.btnGuardarClasificacionAtributo', function(){

    if(!$(this).hasClass("text-primary")) return;

    let table = $('#tbl_atributos_pendientes').DataTable();
    let a = table.rows().data().toArray();
    
    let row = $(this).closest('tr');
    let data = table.row(row).data();
    
    let nombreAtributo = row.find(".inputNombreAtributo").val() || ""
    let datoPersonal = row.find(".selectDatosPersonales").val() || ""
    let descripcionAtributo = row.find(".inputDescripcionAtributo").val() || ""
    if(isNaN(parseInt(datoPersonal))) datoPersonal = ""
    if((nombreAtributo && data.nombreAtributo !== nombreAtributo) || data.datoPersonal !== datoPersonal || (descripcionAtributo && data.descripcion !== descripcionAtributo) ){
      
      let values = []
      if(data.nombreAtributo !== nombreAtributo){
        // MANDAR SOLICITUD PENDIENTE
        solicitudClasificacionAtributo({original:data.nombreAtributo, solicitado:nombreAtributo, idAtributo:data.id, atributo:data.nombreAtributo, cambio:"nombre_metad"})
      } 
      
      if(data.descripcion !== descripcionAtributo) {
        // MANDAR SOLICITUD PENDIENTE
        solicitudClasificacionAtributo({original:data.descripcion, solicitado:descripcionAtributo, idAtributo:data.id, atributo:data.nombreAtributo, cambio:"descripcion_metad"})
      }
      
      if(data.datoPersonal !== datoPersonal) {
        values.push(["dato_personal", datoPersonal])
        solicitudClasificacionAtributo({original:data.datoPersonal,solicitado:datoPersonal,  idAtributo:data.id, atributo:data.nombreAtributo, cambio:"clasificacion"})
        
        $().SPServices.SPUpdateMultipleListItems({
        async: true,
        listName: "Z_DICCIONARIO_DATOS",
        batchCmd: "Update",
        CAMLQuery: `<Query>\
                      <Where>\
                        <And>\
                          <Eq><FieldRef Name="id_metad"/><Value Type="Text">${data.id}</Value></Eq>\
                          <Eq><FieldRef Name="tipo_metad"/><Value Type="Text">${data.tipoMetadato}</Value></Eq>\
                          </And>\
                      </Where>\
                      </Query>`,
        valuepairs: values,
        completefunc: function (xData, Status) {
          showNotification("top", "center", "success", "Se ha editado correctamente el atributo.",2000)
           
          
          
          } //completefunc
        });  
      }

      // Convertir los datos del DataTable a un array
     let atributosPendientes = table.rows().data().toArray();
     // Buscar el índice del elemento
     let indice = atributosPendientes.findIndex(e => e.id === data.id);
     if(atributosPendientes[indice]){
       atributosPendientes[indice].nombreAtributo = nombreAtributo
       atributosPendientes[indice].datoPersonal = datoPersonal
     }
     redrawDataTable("tbl_atributos_pendientes", atributosPendientes )
     $('[data-toggle="tooltip"]').tooltip('hide');
    }else{}

     

  })

  $("#tbl_atributos_pendientes tbody").on("change",'.selectDatosPersonales', function(){
    let row = $(this).closest('tr');
    let data = dataTable.row(row).data();
    let datoPersonal = $(this).val() || ""
    if(datoPersonal.toLowerCase() === "no asignado")  datoPersonal = ""
    let btnGuardarRegistro = row.find(".btnGuardarClasificacionAtributo")
    if(data.datoPersonal !== datoPersonal && btnGuardarRegistro){
      btnGuardarRegistro.addClass("text-primary")
    }else{
      btnGuardarRegistro.removeClass("text-primary")
    }
  })

  $("#tbl_atributos_pendientes tbody").on("input",'.inputNombreAtributo', function(){
    let row = $(this).closest('tr');
    let data = dataTable.row(row).data();
    let nombreAtributo = $(this).val()
    let btnGuardarRegistro = row.find(".btnGuardarClasificacionAtributo")
    if(data.nombreAtributo !== nombreAtributo && btnGuardarRegistro ){
      btnGuardarRegistro.addClass("text-primary")
    }else{
      btnGuardarRegistro.removeClass("text-primary")
    }
  })

  $("#tbl_atributos_pendientes tbody").on("input",'.inputDescripcionAtributo', function(){
    let row = $(this).closest('tr');
    let data = dataTable.row(row).data();
    let descripcionAtributo = $(this).val()
    let btnGuardarRegistro = row.find(".btnGuardarClasificacionAtributo")
    if(data.descripcion !== descripcionAtributo && btnGuardarRegistro && decodeHtmlText(data.descripcion)!==decodeHtmlText(descripcionAtributo)){
      btnGuardarRegistro.addClass("text-primary")
    }else{
      btnGuardarRegistro.removeClass("text-primary")
    }
  })

  listenerbtnAddAtributo();
}

function logClasificacionAtributo({
  original,
  solicitado,
  cambio,
  idAtributo
}={}){
  let [datosUsuario, fechaSolicitud] = getUserAndDate()
  //Finalmente escribo el nuevo registro
  $().SPServices({
    operation: "UpdateListItems",
    async: false,
    batchCmd: "New",
    listName: "Z_APROBACIONES",
    valuepairs: [
      ["TIPO_CAMBIO", "6"], //Clasificacion atributo=6
      ["ORIGINAL", original],
      ["SOLICITADO", solicitado],
      ["AUTOR_SOLICITUD", datosUsuario[0]],
      ["FECHA_SOLICITUD", fechaSolicitud],
      ["DATO1", idAtributo],
      ["DATO2", "ATRIBUTO"],
      ["DATO3", cambio],
      ["ESTADO_APROBACION", "APROBADO"], // Siempre aprobado porque es log
    ],
    completefunc: function(xData, Status) {}
  })

}

function decodeHtmlText(text) {
  return text.replace(/&#(\d+);/g, (match, dec) => String.fromCharCode(dec));
}
// &#58;&nbsp; 
function solicitudClasificacionAtributo({original, solicitado, idAtributo, atributo, cambio}){
  let [datosUsuario, fechaSolicitud] = getUserAndDate()
  let estado = cambio === "clasificacion" ? "APROBADO" : "PENDIENTE"
  if(decodeHtmlText(original)===decodeHtmlText(solicitado)) return;
  //verificar si ya existe una petición de cambio mostrar notificación de warning 
  //Finalmente escribo el nuevo registro
  $().SPServices({
    operation: "UpdateListItems",
    async: false,
    batchCmd: "New",
    listName: "Z_APROBACIONES",
    valuepairs: [
      ["TIPO_CAMBIO", "6"], //Clasificacion atributo=6
      ["ORIGINAL", decodeHtmlText(original)],
      ["SOLICITADO", decodeHtmlText(solicitado)],
      ["AUTOR_SOLICITUD", datosUsuario[0]],
      ["FECHA_SOLICITUD", fechaSolicitud],
      ["ESTADO_APROBACION", estado], // Siempre aprobado porque es log
      ["DATO1", idAtributo],
      ["DATO2", atributo],
      ["DATO3", "ATRIBUTO"],
      ["DATO4", cambio],
    ],
    completefunc: function(xData, Status) {
      if(estado !== "APROBADO")showNotification("top", "center", "success", "Su solicitud ha sido enviada con éxito.");
    }
  })
}


async function RecomendadorAtributos(){

  // let listaRecomendaciones = await getRecomendaciones()
  let data = await leerDataset("Z_INF_TECNICA_LARGA")
  let objetoAtributos = {}
  let objetoDetalles = {}
  let listaRecomendaciones = []
  window.objetoRecomendacionesTotales = {}

  //Filtrar por aquellos que tengan recomendación de atributos y detalle
  data.forEach(e=>{
    if(e.codigo.trim() && !e.codigo.startsWith("***")){
      if(!objetoAtributos[e.campo.trim()])objetoAtributos[e.campo.trim()] = e
    }
    if(e.detalle.trim() && !e.detalle.startsWith("***")){
      if(!objetoDetalles[e.campo.trim()])objetoDetalles[e.campo.trim()] = e
    }
    if(e.codigo.trim()==="" && e.detalle.trim() === ""){
      e.codigo = ""
      e.detalle = ""
      e.porcentaje_similitud = 0
      listaRecomendaciones.push(e)
      window.objetoRecomendacionesTotales[e.llave_unica] = e
     
    }
  })
  window.objetoAtributos = objetoAtributos
  window.objetoDetalles = objetoDetalles
  window.recomendadorIsProcessing = false;
  setDataTableRecomendadorAtributos(listaRecomendaciones)
  listenerRecomendadorAtributos()

}

async function getRecomendacionesCampos({lista,objetoDataset,caracteristicaComparar,toleranciaSimilitud}){

  let dataset = Object.values(objetoDataset)
  if(!lista || !dataset) return null;
  const procesados = {};
  for(let index = 0; index < lista.length; index++){
    const obj = lista[index]
    if(obj[caracteristicaComparar].trim() !== "") continue;

    // Si el campo es igual a uno ya procesado o ya existe uno documentado, asignarlo directamente sin calcular similitud porque ya será del 100%
    if(objetoDataset[obj.campo]){
      obj[caracteristicaComparar] = `***${objetoDataset[obj.campo][caracteristicaComparar]}`;
      obj.porcentaje_similitud = 100;
      if(caracteristicaComparar === "codigo"  && objetoDataset[obj.campo].detalle?.trim()) obj.detalle = `***${objetoDataset[obj.campo].detalle}`;
      continue;
    }else if(procesados[obj.campo]){
      obj[caracteristicaComparar] = procesados[obj.campo][caracteristicaComparar];
      obj.porcentaje_similitud = procesados[obj.campo].porcentaje_similitud;
      if(caracteristicaComparar === "codigo" && procesados[obj.campo].detalle?.trim())obj.detalle =  procesados[obj.campo].detalle;
      continue;
    }

    let maxSimilitud = 0;
    let objMasSimilar = null;

    for(let indexCaracteristica = 0; indexCaracteristica < dataset.length; indexCaracteristica++ ){
      const objCaracteristica = dataset[indexCaracteristica]
      if(objCaracteristica.campo.toLowerCase() === obj.campo.toLowerCase()){
        maxSimilitud = 100;
        objMasSimilar = objCaracteristica;
        break;
      }
      if(!toleranciaSimilitud) toleranciaSimilitud = 80
      const tolerancia = Math.max(maxSimilitud, toleranciaSimilitud);
      if(esSimilitudAceptable(obj.campo, objCaracteristica.campo, tolerancia)){
        const similitud = calcularSimilitud(obj.campo, objCaracteristica.campo);
        if(similitud >= toleranciaSimilitud && (similitud > maxSimilitud || (similitud === maxSimilitud && indexCaracteristica > index))){
          maxSimilitud = similitud.toFixed(2);
          objMasSimilar = objCaracteristica;
        }
      }
    }
    // En caso de que haya encontrado una similiud y que no haya sido procesado ya antes
    if (objMasSimilar) {
      obj[caracteristicaComparar] = `***${objMasSimilar[caracteristicaComparar]}`;
      obj.porcentaje_similitud = maxSimilitud;
      if(caracteristicaComparar === "codigo" && objMasSimilar.detalle.trim() && !objMasSimilar.detalle.trim().startsWith("***")) obj.detalle = `***${objMasSimilar.detalle}`;
      procesados[obj.campo] = obj;
    }

  }
 return lista;
}

function getRecomendacionesDetalle({ lista, dataset}) {
  if (!lista || !dataset) return null;
  const procesados = {};

  for(let index = 0; index < lista.length; index++){
    const obj = lista[index]
    // Si el campo es igual a uno ya procesado, ignorarlo porque tendrá la misma recomendación de descripción
    if(obj.detalle.trim() !== "") continue;
    if(procesados[obj.campo]) {
      obj.detalle = procesados[obj.campo].detalle
      obj.porcentaje_similitud = procesados[obj.campo].porcentaje_similitud
      continue;
    };
    let maxSimilitud = 0;
    let objMasSimilar = null;

    for(let indexDetalle = 0; indexDetalle < dataset.length; indexDetalle++){
      const objDetalle = dataset[indexDetalle];
      // Si el nombre del campo es igual al del campo con descripción sugerida crear la clave y valor y finalizar la busqueda con ese atributo
      if(objDetalle.campo.toLowerCase() === obj.campo.toLowerCase()){
        maxSimilitud = 100;
        objMasSimilar = objDetalle;
        break;
      }
      // En caso de que no exista antes el atributo calcular similitud
      // Prevalidación antes de calcular la similitud
      const tolerancia = maxSimilitud > 80 ? maxSimilitud : 80
      if (esSimilitudAceptable(obj.campo, objDetalle.campo, tolerancia)) {
        // Solo calcular Levenshtein si la diferencia de longitudes es aceptable
        const similitud = calcularSimilitud(obj.campo, objDetalle.campo);

        // Si la similitud es mayor que 80 y es la más alta encontrada hasta ahora, actualizamos
        if (similitud >= 70 && (similitud > maxSimilitud || (similitud === maxSimilitud && indexDetalle > index))) {
          maxSimilitud = similitud;
          objMasSimilar = objDetalle;
        }
      }
    }

    // En caso de que haya encontrado una similiud y que no haya sido procesado ya antes
    if (objMasSimilar) {
      obj.detalle = `***${objMasSimilar.detalle}`;
      obj.porcentaje_similitud = maxSimilitud;
      procesados[obj.campo] = obj;
    }
  }

  return lista;
}

function setDataTableRecomendadorAtributos(data){
  let atributos = listToObject({lista:getAtributosAdministrar(), parametroClave:"id"})

  let table = $('#tbl_recomendador_atributos').DataTable({
    processing:true,
    data: data,
    paging: true,
    colResize: {
      isEnabled: true,
      hasBoundCheck: false
    },
    lengthChange: true,
    info: true,
    // scrollX: true,
    scrollCollapse: true,
    scrollY: 'calc(40vh)',
    // autoWidth: true,
    deferRender: true,
    dom: 'fBtlip',
    columnDefs: [
      {
        targets: 8, // Aquí se pone el índice de la columna que quieres ordenar
        width:"150px",
        // render: function (data, type, row) {
        //   // Para ordenar como número, usamos el valor del div oculto
        //   return type === 'sort' ? $(row).find('div').text() : data;
        // }
      },
      { targets: 8, width: "60px" },
      { targets: 7, width: "175px" },
      // { targets: 6, width: "175px" },
      // { targets: 5, width: "150px" },
      // { targets: 4, width: "175px" },
      // { targets: 3, width: "100px" },
      // { targets: 2, width: "100px" },
      // { targets: 1, width: "100px" },
      { targets: 0, width: "75px" },
    ],
    buttons: [              
      {
      text: '<i class="simple-icon-close style="font-size: 50px;" data-toggle="tooltip" title="Rechazar todos"></i>',
      className: 'btn-denegar-todos',
      action: function (e, dt, node, config) {
          
        //Obtengo todas las filas visibles
        //.nodes() : Obtiene los nodos DOM de las filas seleccionadas
        //.to$() : Converte los nodos en un objeto jquery , para utilizar todas las funciones y metodos jquery
        //Busca las filas que esten marcadas.
        var filas = dt.rows({ 'search': 'applied' }).nodes().to$();
        
        // Variable para almacenar las filas seleccionadas
        var filasSeleccionadas = [];
        
        // Iterar sobre cada fila y actualizar el estado si el checkbox está marcado
        filas.each(function () {
          //Busca los elementos con <input> de tipo checkbox que son descendientes del elemento this.
          var checkbox = $(this).find('input[type="checkbox"]');
          //.prop : Obtiene las propiedades de los elementos seleccionados.
          //verifica si el checkbox esta marcado
          if (checkbox.prop('checked')) {
            //obtiene los datos de las filas seleccionadas y las asigno a la variable data
            var data = dt.row(this).data();
            //Añade los datos de las filas seleccionadas al array filasSeleccionadas para manipular facil los datos de las filas.
            filasSeleccionadas.push(data);
          }
        });
        
    
        // Función para mostrar el modal y procesar el rechazo
        function mostrarModalRechazo(index) {
          // si Index es mayor o igual a filas seleccionadas se detiene la recursion.
            if (index >= filasSeleccionadas.length) {
              return; // Fin de la recursión
            }
            // Obtiene los datos de cada uno de los indices, en este caso permite trabajar para cada indice y se ejecuta el resto del codigo 
            //para cada indice .
            var data = filasSeleccionadas[index];
            //funcion para rechazar
            // Proceso_Autorizacion_Rechazar(data,data_tabla)
            // Abre el modal
            $('#motivoModalRechazado').modal('show');

            // Limpia el campo de texto cuando se muestre el  modal
            $('#motivoModalRechazado').on('shown.bs.modal', function () {
              $('#motivoTexto').val(''); // Establece el valor del campo de texto a una cadena vacía
            });

            // Maneja la acción de confirmar rechazo
            $('#confirmarRechazo').off('click').on('click', function() {
              var motivo = $('#motivoTexto').val();
              
              if (motivo.trim() === "") {
                alert("Por favor, ingresa un motivo para el rechazo.");
                return;
              }
            })
            // $('#motivoModalRechazado').modal('hide') :  Cierra el modal
            $('#motivoModalRechazado').modal('hide').on('hidden.bs.modal', function () {
              //Una ves que se haya rechazado todos los que se marcaron , se apaga el evento hidden.bs.modal para que no se siga abriendo el modal una ves que haya terminado.
                $(this).off('hidden.bs.modal'); 
              //una ves que se rechace el primer indice , se le suma 1 para que siga el siguiente.                    
                mostrarModalRechazo(index + 1);
            });
        }
          // Inicia la cadena de modales
          // Si filasSeleccionadas es mayor a 0 
          if (filasSeleccionadas.length > 0) {
          // Si es asi , empieza con el modal con indice 0
            mostrarModalRechazo(0);
          }
        }
      },
      {
      text: '<i class="simple-icon-check style="font-size: 50px;" data-toggle="tooltip" title="Aprobar todos"></i>',
      className: 'btn-aprobar-todos',
      action: function (e, dt, node, config) {

              //Obtengo todas las filas visibles
              //.nodes() : Obtiene los nodos DOM de las filas seleccionadas
              //.to$() : Converte los nodos en un objeto jquery , para utilizar todas las funciones y metodos jquery
              //Busca las filas que esten marcadas.
          var filas = dt.rows({ 'search': 'applied' }).nodes().to$();
              // Iterar sobre cada fila y actualizar el estado si el checkbox está marcado
          filas.each(function () {
              //Busca los elementos con <input> de tipo checkbox que son descendientes del elemento this.
              var checkbox = $(this).find('input[type="checkbox"]');
              //.prop : Obtiene las propiedades de los elementos seleccionados.
              //verifica si el checkbox esta marcado 
              if (checkbox.prop('checked')) {
              //obtiene los datos de las filas seleccionadas y las asigno a la variable data
                  var data = dt.row(this).data();
                  //FUNCION APROBAR RECOMENDACION
                  // Proceso_Autorizacion_Aprobar(data,data_tabla);
            }
        });
      }
      },
      {
        text: '',
        className: 'btn-seleccionar-todos',
        action: function (e, dt, node, config) {

           // Obtener el estado actual del botón 'Seleccionar todos'
           //verifica si la clase es "checked" , si es asi es true caso contrario es false
            var isChecked = $(node).hasClass('checked');

            // Obtener todas las filas visibles
            //Busca los checkbox que esten marcados y las asigna en la variable fila
            var filas = dt.rows({ search: 'applied' }).nodes();
    
            // Recorrer las filas visibles
            $(filas).each(function () {
                // Selecciona el checkbox en la fila si no está deshabilitado
                // .prop : Permite obtener o cambiar la propiedades de un elemento.
                // En este caso cambia la propiedad de checked a !isChecked viceversa , Si los checkbox estan marcados y el boton btn-seleccionar-todos esta marcado , al desmarcarlo 
                // todos los checkbox se desmarcan y viceversa. 
                $(this).find('input[type="checkbox"]:not(:disabled)').prop('checked', !isChecked);
            });
    
            // Añadir o quitar la clase 'checked' al botón seleccionar todos
            $(node).toggleClass('checked');
        },
          
          init: function (dt, node, config) {
          // Se agrega un atributo "title" al elemento node que es el boton de marcar y desmarcar . Esto permite agregarle un tooltip al botón
          $(node).attr('title', 'Marcar todos / Desmarcar todos');
        }
      },
  ],
    columns: [
      //CAMPO NO VISIBLE PARA CONTROLAR ORDEN INICIAL SIMILAR A ENTIDADES PENDIENTES
      {
        data: null, 
        render:function(data, type, row){
          return '<td><button class="simple-icon-close botonDenegar">\
          </button><button class="simple-icon-check botonAceptar"></button>\
           <input class="form-check-input" style="margin-left: 3px;" type="checkbox" id="checkRow">'
          //  <label class="form-check-label" for="checkRow"> </label></td>';
        }
      },
      {data: "servidor",},
      {data: "base",},       
      {data: "esquema"},
      {data: "tabla",},
      {data: "campo",},
      {data: "detalle", render:function(data,type,row){
        let recomendado = data && data.startsWith("***")
        if(recomendado) data = data.slice(3)
        return `<div style="display:none;">${data}</div><input type="text" class="form-control ${recomendado ? "text-primary":""}" value="${data}"/>`
      }},
      {data: "codigo", render: function(data,type,row){
        let recomendado = data && data.startsWith("***")
        let texto ="-"
        if(recomendado) {
          data = data.slice(3)
          texto = `${data}-${atributos[data].nombreAtributo}`
        }
        return `<div style="display:none;">${parseInt(data)}</div><p class="text-primary"}" >${texto}</p>`
      }},
      {data:"porcentaje_similitud"},
    ],
    language:{
      "search":"",
    },
    "pageLength":25,
    "drawCallback": async function(){
      let tooltipTriggerList = document.querySelectorAll('[data-toggle="tooltip"]');
      let tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl, {
        boundary: document.body,
        container: 'body',
        trigger: 'hover'
      }));
      $('.dataTables_filter input').attr('placeholder', 'Buscar...');
      tooltipList.forEach((tooltip) => { $('.tooltip').hide(); });
      let tabla=$('#tbl_recomendador_atributos').DataTable()
      const visibleRows = tabla.rows({ page: 'current' });

      if (visibleRows.length > 0) {
        const resultadosCodigo = await getRecomendacionesCampos({
          lista: visibleRows.data().toArray(),
          objetoDataset: window.objetoAtributos,
          caracteristicaComparar: "codigo", // Ajusta según el campo a comparar
          toleranciaSimilitud: 25
        });

        const resultadoDetallesCodigo = await getRecomendacionesCampos({
          lista: resultadosCodigo,
          objetoDataset: window.objetoDetalles,
          caracteristicaComparar: "detalle", // Ajusta según el campo a comparar
          toleranciaSimilitud: 25
        });
    
        //Mostrar todo incluso con datos sin atributo sugerido o detalle sugerido
        resultadoDetallesCodigo.forEach((resultado, index) => {
          const dataIndex = tabla.rows({ page: 'current' }).indexes()[index];
          tabla.row(dataIndex).data(resultado)
        });
        
      }
      
    },
    initComplete: function(settings,json){
      //En la primera renderizacion de la tabla ordenar por código de atributos
      // const api = this.api();
      // api.order([
      //   [7, "asc"]
      // ]).draw()
    }
  });
  
  // // Aplicar el algoritmo al cargar la tabla por primera vez
  // table.on('init', function () {
  //   procesarFilasVisibles();
  // });

  // // Aplicar el algoritmo cada vez que se rendericen nuevas filas (con debounce)
  // table.on('draw', debounce(procesarFilasVisibles, 300));

}

function listenerRecomendadorAtributos(){
  let atributos = listToObject({lista:getAtributosAdministrar(), parametroClave:"id"})
  let table = $('#tbl_recomendador_atributos').DataTable();

  $('#tbl_recomendador_atributos tbody').on('click', '.botonAceptar', function () {
    let data = table.row($(this).closest('tr')).data();
  });
  $('#tbl_recomendador_atributos tbody').on('click', '.botonDenegar', function () {
    let data = table.row($(this).closest('tr')).data();
    let recomendacionesAtributos = table.rows().data().toArray();
    // Buscar el índice del elemento
    let indice = recomendacionesAtributos.findIndex(e => e.id === data.id);
    if(recomendacionesAtributos[indice]){
      recomendacionesAtributos[indice].nombreAtributo = nombreAtributo
      recomendacionesAtributos[indice].datoPersonal = datoPersonal
    }
    redrawDataTable("tbl_recomendador_atributos", recomendacionesAtributos )
    $('[data-toggle="tooltip"]').tooltip('hide');
    //Modificar lista del datatable para redibujar la tabla
    //Escribir en z_inf_tecnica el cambio, para que se guarden los cambios
  });
  

}

function listToObject({lista=null, parametroClave=null}){
  if (!lista || !parametroClave) return;
  let map = {};
  lista.forEach(element => {
    map[element[parametroClave]] = element
  })
  return map
}

function countUniqueParameter({lista=null, parametroContar=null}){
  if (!lista || !parametroContar) return;
  let counter = {}
  lista.forEach(e=>counter[e[parametroContar]] = (counter[e[parametroContar]] || 0) + 1 )
  return counter
}

function pruebaPeticion(){
  let url = ""
}

function getAMCCells(){
  // Objeto nombreCelda : descripcion
  return {
    "DECISIONES": "Definir cómo se van a utilizar los resultados para la toma de decisiones del negocio.",
    "PREDICCIONES" : "Define cuándo se realizan predicciones sobre nuevos datos y cuánto tiempo se tiene para ejecutar todo el proceso.",
    "TAREAS" : "Qué tipo de tarea va a realizar el modelo (clasificación, regresión, segmentación, etc) cuáles son las entradas y las salidas del mismo.",
    "EVALUACIÓN EN DESARROLLO" : "• Define métricas para evaluar el modelo.\n• Establece criterios.",
    "PROPUESTA DE VALOR": "Es donde se agregará el razonamiento central para el proyecto, como:\n•¿Qué necesidad tiene el usuario final?\n•¿Qué estamos tratando de hacer para el usuario final?\n•¿Quién es el usuario final? o ¿Quién se beneficiará?\n•¿Por qué es importante?\n•¿Qué? - ¿Quién? - ¿Por qué?\n•¿Cuál es el propósito?\n•¿Cómo se atienden actualmente?(forma y plataforma)" ,
    "FUENTES DE DATOS" : "Qué fuentes de datos podemos usar: Internas, Externas, etc.\nFrecuencia de actualización\nReferencias para conciliación/cuadre.",
    "CARACTERÍSTICAS PARA REENTRENAMIENTO DEL MODELO" : "Las características son los campos más relevantes de las fuentes de datos y que serán utilizados para extraer la información, ejemplo: Datos Sociodemográmicos, transaccionales, históricos, etc.\nQué categorías/filtros se desean incorporar.",
    "RECOLECCIÓN DE INFORMACIÓN" : "Indicar cómo se va a recopilar y preparar los datos. Si existen tablas que deban relacionarse o si se deben crear etiquetas.",
    "TIEMPOS Y RESPONSABLES" : "Se define cuándo el modelo se va a crear y cuánto tiempo se tiene para ello y quién será el responsable de realizar esta tarea.",
    "MONITOREO DE CREACIÓN DE VALOR" : "Cómo se medirán los KPIS, Comparativos Ratios, Evoluaciones, ETC - métodos y métricas de monetización del modelo.",
    "EVALUACIÓN EN LÍNEA" : "Métodos y métricas para monitorear el rendimiento del modelo.",
  }
}

function AMCCellContent({
  title,
  actions = true,
  data,
}) {
  const objetoAMCCells = getAMCCells();
  const titleDescription = objetoAMCCells[title];
  let template = `
    ${actions && `<i class="simple-icon-note float-right" style="cursor:pointer;margin-top:2px;" onclick="editarCelda(event)"></i>`}
    <h6 class="font-weight-bold" title="${titleDescription}" style="text-overflow:ellipsis;overflow:hidden; text-wrap:nowrap; font-size:.85rem !important;">${title}</h6>
    <div class="d-flex flex-column amc-cell__content-wrapper" style="overflow-y:auto; height:85%; padding:2px;">
    ${data.length > 0 ? data?.map((e, index) => { 
      if (e.trim()) return `<div class="p-2 my-1 custom-card flex-row justify-content-between">
         <span class="" style="width:90%;font-size:10px;">${e}</span>
         <div class="d-flex flex-column" style="gap:5px;">
          <i class="simple-icon-note" onclick="editarElementoCelda('${title}','${index}')" style="opacity:.5 !important; cursor:pointer;"></i>
          <i class="simple-icon-close" onclick="eliminarElementoCelda('${title}','${index}')" style="opacity:.5 !important; cursor:pointer;"></i>
         </div>
        </div>
      `}).join("") : ""}
    </div>
  `;
  return template;
}


function eliminarElementoCelda(title, index){
  const amcName = document.getElementById("amc-name").value
  if(!amcName) return;
  const currentAMC = window.objetoAMC[amcName]
  if(!currentAMC) return;
  currentAMC[title].splice(index, 1)
  reloadAMC(amcName)
}

function editarElementoCelda(title, index){
  const amcName = document.getElementById("amc-name").value
  if(!amcName) return;
  const currentAMC = window.objetoAMC[amcName]
  if(!currentAMC) return;
  $("#modalInputElementoCelda").val(currentAMC[title][index])
  $("#modalEditarElementoCeldaNombre").text(title)
  const modal = $("#modalEditarElementoCelda")
  modal.attr("data-content",`${amcName}||${title}||${index}`)
  modal.attr("data-original-value",`${$("#modalInputElementoCelda").value}`)
  modal.modal("show");
  
}


function editarCelda(event) {
  event.stopPropagation(); // Evita que el clic en el botón dispare el evento del div
  const cell = event.target.closest('.amc-cell'); // Encuentra el div contenedor más cercano
  // Store the reference to the current cell
  const amcName = document.getElementById("amc-name").value.trim()
  const amcSponsor = $("#amc-sponsor").val().trim()
  const amcAreaSolicitante =$("#amc-area-solicitante").val().trim()
  const amcFormato = document.getElementById("amc-formato").value.trim()
  if(!amcName || !amcAreaSolicitante || !amcSponsor || !amcFormato){
    showNotification("top","center", "info", "Necesita ingresar un nombre para el AMC primero.")
    return;
  }
  if(!window.objetoAMC[amcName] ){
    window.objetoAMC[amcName] = {
      "DECISIONES" : [],
      "PREDICCIONES" : [],
      "TAREAS" : [],
      "EVALUACIÓN EN DESARROLLO" : [],
      "PROPUESTA DE VALOR" : [],
      "FUENTES DE DATOS" : [],
      "CARACTERÍSTICAS PARA REENTRENAMIENTO DEL MODELO" :[],
      "RECOLECCIÓN DE INFORMACIÓN" :[],
      "TIEMPOS Y RESPONSABLES" : [],
      "MONITOREO DE CREACIÓN DE VALOR" : [],
      "EVALUACIÓN EN LÍNEA" :[],
      "area_solicitante": amcAreaSolicitante,
      "formato":amcFormato,
      "nombre_amc": amcName,
      "sponsor": amcSponsor,
      "usuario_creacion": window.current_user,
    }
  }
  let currentAMC = window.objetoAMC[document.getElementById("amc-name").value] 
  if(!currentAMC) return;
  window.currentCell = cell;
  let nombreCelda = window.currentCell.children[1].textContent
  let contentCelda = currentAMC[nombreCelda]
  document.getElementById('modalEditarCeldaNombre').textContent = nombreCelda;
  document.getElementById('modalInputCelda').value = contentCelda.join("\n");

  // Show editor and load the content of the clicked cell
  $("#modalEditarCelda").modal("show")
}

function guardarCelda() {
    const SEP = "\n"
    if (window.currentCell) {
      let nombreCelda = window.currentCell.children[1].textContent
      let amcName = document.getElementById("amc-name").value
      let currentAMC = window.objetoAMC[amcName]
      let newValue = document.getElementById('modalInputCelda').value.split(SEP).filter(e=>e.trim())
      currentAMC[nombreCelda] = newValue
      console.log(currentAMC)
      console.log(window.objetoAMC)
      reloadAMC(amcName)
      // window.edited = true;
      if(window.amcSeleccionado)window.celdaEditada = true

      $("#modalEditarCelda").modal("hide")

    }
  }
  
function reloadAMC(name){
  let amcName = name || document.getElementById("amc-name").value
  let amc = window.objetoAMC[amcName]
  if(!amc) return;
  let cellElements = document.getElementsByClassName("amc-cell")
  Array.from(cellElements).forEach((e,index)=>{
    let data = amc[window.CELL_TITLES[index]] || []
    cellElements[index].innerHTML = AMCCellContent({title:window.CELL_TITLES[index], data})
  })
  $("#amc-name").val(amc.nombre_amc).trigger("change")
  $("#amc-area-solicitante").val(amc.area_solicitante).trigger("change")
  $("#amc-area-solicitante").attr("text-value", ({centroCosto:amc.area_solicitante} || window.objetoEmpleados[amc.sponsor]).centroCosto)
  $("#amc-sponsor").val(amc.sponsor).trigger("change")
  $("#amc-sponsor").attr("text-value", (window.objetoEmpleados[amc.sponsor] || {usuario:amc.sponsor}).usuario)
  // $("#amc-sponsor").val(amc.sponsor).trigger("change")
  $("#amc-formato").val(amc.formato).trigger("change")
  // $("#amc-user").text((window.objetoEmpleados[amc.usuario_creacion] || {usuario:amc.usuario_creacion}).usuario)
  $("#amc-user").text(amc.usuario_creacion)

  // Carga de comentarios del amc
  setComentariosAMC(getComentariosAMC({amc:name}))

}

function descartarCambios(){
  $("#modalConfirmar").modal("show")
  
  $("#modalConfirmar").modal("hide")
}

function clearAMC(){
  $("#amc-name").val("").trigger("change")
  $("#amc-area-solicitante").val("").trigger("change")
  $("#amc-sponsor").val("").trigger("change")
  $("#amc-formato").val("1").trigger("change")
  $("#amc-user").text(window.current_user || getUserAndDate()[0][0])
  let cellElements = document.getElementsByClassName("amc-cell")
  Array.from(cellElements).forEach((e,index)=>{
    cellElements[index].innerHTML = AMCCellContent({title:window.CELL_TITLES[index], data:[]})
  })
  document.getElementById("btn-clear-amc").style.visibility = "hidden"
}

function listenerAMC(){
  const empleados = getEmpleados();
  const objetoAreas = {}
  const objetoEmpleados = {}
  const objetoAreasEmpleados = {}
  empleados.forEach(e=>{
    if(!objetoAreasEmpleados[e.centroCosto]) objetoAreasEmpleados[e.centroCosto] = []
    objetoAreasEmpleados[e.centroCosto].push({text:e.nombreCompleto,id:e.codigoEmpleado})

    if(!objetoAreas[e.codCentroCosto]) objetoAreas[e.codCentroCosto] = e.centroCosto

    objetoEmpleados[e.codigo] = e
  })
  console.log(objetoEmpleados)
  const listaAreas = Object.entries(objetoAreas|| {})?.map(([codigoArea, nombreArea])=>({text:nombreArea,id:codigoArea}))
  const listaSponsor = Object.entries(objetoEmpleados|| {})?.map(([codigoEmpleado, objetoEmpleado])=>({text:objetoEmpleado.nombreCompleto,id:codigoEmpleado}))
  $('#amc-area-solicitante').select2({
    theme: "bootstrap",  
    placeholder: "",
    maximumSelectionSize: 6,
    containerCssClass: ":all:",
    data:listaAreas,
  }).on("select2:select", function(event){
    const valorSeleccionado = event.params.data.id;
    const textoSeleccionado = event.params.data.text;
    setOpcionesSelect({
      idSelect:"amc-sponsor",
      dataSelect:valorSeleccionado.trim() ? objetoAreasEmpleados[textoSeleccionado] : listaSponsor,
    })

  });

  $('#amc-sponsor').select2({
    theme: "bootstrap",  
    placeholder: "",
    maximumSelectionSize: 6,
    containerCssClass: ":all:",
    data:listaSponsor,
  }).on("select2:select", function(event){
    const valorSeleccionado = event.params.data.id;
    const textoSeleccionado = event.params.data.text;
    console.log(valorSeleccionado )
    console.log(objetoEmpleados[valorSeleccionado] )
    $("#amc-area-solicitante").val((objetoEmpleados[valorSeleccionado] || {codCentroCosto:""}).codCentroCosto).trigger("change")
  });
  
  // Evento para detectar cuando se borra el texto del campo
  $("#amc-area-solicitante").on("input", function () {
    let currentValue = $(this).val();
    if (!currentValue || !currentValue.trim()) {
        // Si el campo está vacío, restaurar la lista original
        setOpcionesSelect({
          idSelect:"amc-sponsor",
          dataSelect:listaSponsor,
        })
    }
  });

  window.objetoAreasEmpleados = objetoAreasEmpleados
  window.objetoEmpleados = objetoEmpleados

  const formatoSelect = document.getElementById("amc-formato")
  const catalogoAMC = Object.entries(getCatalogoOGASUITE("10")).map(([value, label]) => {
    const option = document.createElement("option");
    option.text = label;
    option.value= value;
    formatoSelect.add(option)
  })

  $('#amc-formato').select2({
    theme: "bootstrap",  
    placeholder: "",
    maximumSelectionSize: 6,
    containerCssClass: ":all:",
    minimumResultsForSearch: Infinity,
  });
  
  
  $("#btnDescartarCambios").on("click", function(e){
    clearAMC();
    $("#modalConfirmar").modal("hide")
  })
  
  $("#btnContinuarEditando").on("click", function(e){
    $("#modalConfirmar").modal("hide")
  })
  
  $("#btnBorrarAMC").on("click", function(e){
    if(window.amcSeleccionado && window.celdaEditada)$("#modalConfirmar").modal("show")
    else if(!window.amcSeleccionado && window.celdaEditada)$("#modalConfirmar").modal("show")
    else clearAMC()
  })
  
  $("#btnGuardarAMC").on("click", function(e){
    const valueAreaSolicitante = $("#amc-area-solicitante").val()
    const valueSponsor = $("#amc-sponsor").val()
    const valueFormato = $("#amc-formato").val()
    if(!valueAreaSolicitante || !valueSponsor || !valueFormato){
      return showNotification("top", "center", "info", "Debe llenar correctamente todos los campos (Área Solicitante, Sponsor, Formato).", 2000)
    }

    const datos_usuario = getUserAndDate();
    let array_datos_usuario = datos_usuario[0];
    let nombre_usuario_modificacion = array_datos_usuario [0];
    const tzoffset = (new Date()).getTimezoneOffset() * 60000; //offset in milliseconds
    const localISOTime = (new Date(Date.now() - tzoffset)).toISOString().slice(0, -1);
    
    const amcName = $("#amc-name").val()

    // Verificar si ya existe
    const objAMC = window.objetoAMC[amcName]
    if(!objAMC)  return showNotification("top", "center", "info", "Debe ingresar contenido en almenos una de las celdas.", 2000)
    const amcSponsor = objAMC.sponsor
    const amcAreaSolicitante = objAMC["area_solicitante"]
    const amcFormato = objAMC["formato"]
    const amcDecisiones = objAMC.DECISIONES.join("||")
    const amcPredicciones = objAMC["PREDICCIONES"].join("||")
    const amcTareas = objAMC["TAREAS"].join("||")
    const amcEvaluacionDesarrollo = objAMC["EVALUACIÓN EN DESARROLLO"].join("||")
    const amcPropuestaValor = objAMC["PROPUESTA DE VALOR"].join("||")
    const amcFuentesDatos = objAMC["FUENTES DE DATOS"].join("||")
    const amcCaracteristicasReentrenamiento = objAMC["CARACTERÍSTICAS PARA REENTRENAMIENTO DEL MODELO"].join("||")
    const amcRecoleccionInformacion = objAMC["RECOLECCIÓN DE INFORMACIÓN"].join("||")
    const amcTiemposResponsables = objAMC["TIEMPOS Y RESPONSABLES"].join("||")
    const amcMonitoreoCreacionValor = objAMC["MONITOREO DE CREACIÓN DE VALOR"].join("||")
    const amcEvaluacion = objAMC["EVALUACIÓN EN LÍNEA"].join("||")
    
    const newValuePairs = []

    //Si ya existe el nombre, editarlo
    if(window.amcSeleccionado && window.celdaEditada){
      const analyticsModelCanvas = getAnalyticsModelCanvas();
      const objetoAMC = {}
      analyticsModelCanvas.forEach(amc => objetoAMC[amc.nombreAMC] = amc)
      const originalAMC = objetoAMC[objAMC.nombreAMC]
      if(amcSponsor !== originalAMC.sponsor) newValuePairs.push(["sponsor", amcSponsor])
      if(amcAreaSolicitante !== originalAMC.areaSolicitante) newValuePairs.push(["area_solicitante", amcAreaSolicitante])
      if(amcFormato !== originalAMC.formato) newValuePairs.push(["formato", amcFormato])
      if(amcDecisiones !== originalAMC.decisiones) newValuePairs.push(["decisiones", amcDecisiones])
      if(amcPredicciones !== originalAMC.predicciones) newValuePairs.push(["predicciones", amcPredicciones])
      if(amcTareas !== originalAMC.tareas) newValuePairs.push(["tareas", amcTareas])
      if(amcEvaluacionDesarrollo !== originalAMC.evaluacionDesarrollo) newValuePairs.push(["evaluacion_desarrollo", amcEvaluacionDesarrollo])
      if(amcPropuestaValor !== originalAMC.propuestaValor) newValuePairs.push(["propuesta_valor",amcPropuestaValor])
      if(amcFuentesDatos !== originalAMC.fuentesDatos) newValuePairs.push(["fuentes_datos", amcFuentesDatos])
      if(amcCaracteristicasReentrenamiento !== originalAMC.caracteristicasReentrenamiento) newValuePairs.push(["caracteristicas_reentrenamiento", amcCaracteristicasReentrenamiento])
      if(amcRecoleccionInformacion !== originalAMC.recoleccionInformacion) newValuePairs.push(["recoleccion_informacion", amcRecoleccionInformacion])
      if(amcTiemposResponsables !== originalAMC.tiemposResponsables) newValuePairs.push(["tiempos_responsables", amcTiemposResponsables])
      if(amcMonitoreoCreacionValor !== originalAMC.monitoreoCreacionValor) newValuePairs.push(["monitoreo_creacion_valor", amcMonitoreoCreacionValor])
      if(amcEvaluacion !== originalAMC.evaluacion) newValuePairs.push(["evaluacion", amcEvaluacion])
      newValuePairs.push(["usuario_ultima_modificacion", nombre_usuario_modificacion])
      newValuePairs.push(["fecha_ultima_modificacion", localISOTime])
      $().SPServices.SPUpdateMultipleListItems({
        async: true,
        listName: "ANALYTICS_MODEL_CANVAS2",
        batchCmd: "Update",
        CAMLQuery:`<Query><Where><Eq><FieldRef Name="nombre_amc"/><Value Type="Text">${amcName}</Value></Eq></Where></Query>`,
        valuepairs: newValuePairs,
        completefunc: function (xData, Status) {
          showNotification("top", "center", "success", "Se ha editado correctamente el Analytics Model Canvas", 2000)
        } //completefunc
      });
      window.amcSeleccionado = false
      window.celdaEditada = false
      
      

    }else{
      if(window.amcSeleccionado && !window.celdaEditada) return;
      const amcUsuarioCreacion = document.getElementById("amc-user")?.textContent
      // Si no existe, entonces es crear uno nuevo en la lista
      $().SPServices({
        operation: "UpdateListItems",
        async: false,
        batchCmd: "New",
        listName: "ANALYTICS_MODEL_CANVAS2",
        valuepairs: [
                    ["nombre_amc", amcName],
                    ["area_solicitante", amcAreaSolicitante],
                    ["sponsor", amcSponsor],
                    ["formato", amcFormato],
                    ["decisiones", amcDecisiones],
                    ["predicciones", amcPredicciones],
                    ["tareas", amcTareas],
                    ["evaluacion_desarrollo", amcEvaluacionDesarrollo],
                    ["propuesta_valor", amcPropuestaValor],
                    ["fuentes_datos", amcFuentesDatos],
                    ["caracteristicas_reentrenamiento", amcCaracteristicasReentrenamiento],
                    ["recoleccion_informacion", amcRecoleccionInformacion],
                    ["tiempos_responsables", amcTiemposResponsables],
                    ["monitoreo_creacion_valor", amcMonitoreoCreacionValor],
                    ["evaluacion", amcEvaluacion],
                    ["usuario_creacion", amcUsuarioCreacion],
                    ["fecha_creacion", localISOTime],
                    ["usuario_ultima_modificacion", nombre_usuario_modificacion],
                    ["fecha_ultima_modificacion", localISOTime],
                ],
        completefunc: function(xData, Status) {
          showNotification("top", "center", "success", "Se ha guardado correctamente el Analytics Model Canvas", 2000)
          const listaOpcionesAMC = Object.keys( window.objetoAMC || {})?.map(e=>({label:e,value:e}))
          $("#amc-name").autocomplete("option", "source", listaOpcionesAMC);
          document.getElementById("btn-clear-amc").style.visibility = "visible"

        }
    });
      
    }
    const listaOpcionesAMC = Object.keys( window.objetoAMC || {})?.map(e=>({label:e,value:e}))
    $("#amc-name").autocomplete("option", "source", listaOpcionesAMC);
    reloadAMC($("#amc-name").val())
  })
  
  $("#btnDescargarAMC").on("click", function(e){
    guardarAMC("amc-wrapper")
  })
  
  $("#btnGuardarEditarCelda").on("click", function(){
    guardarCelda()
  })
  
  $("#btnCancelarEditarCelda").on("click", function(){
    $("#modalEditarCelda").modal("hide")
  })
  
  $("#btnGuardarEditarElemento").on("click", function(){
    const modal = $("#modalEditarElementoCelda")
    const [amcName, title, index] = modal.attr("data-content").split("||")
    const currentText = modal.attr("data-original-value")
    const newText = $("#modalInputElementoCelda").val()
    if(newText && currentText !== newText){ 
      const currentAMC = window.objetoAMC[amcName]
      currentAMC[title][index] = newText;
      window.celdaEditada = true
      $("#modalEditarElementoCelda").modal("hide")
      reloadAMC(amcName)
    }
    $("#modalInputElementoCelda").val("")
  })

  $("#btnCancelarEditarElemento").on("click", function(){
    const modal = $("#modalEditarElementoCelda")
    modal.modal("hide")
  })

  document.getElementById('btnExportarAMC').onclick = function () {
    // Seleccionar todos los elementos con clase .amc-cell
    const amcCells = document.querySelectorAll('.amc-cell');
    const amcSections = document.querySelectorAll('.amc-section');
    const amcSubsections = document.querySelectorAll('.amc-subsection');
    const section2 = document.getElementById('amc-section-2');
    const editIcons = document.querySelectorAll('.simple-icon-note');
    const deleteIcons = document.querySelectorAll('.simple-icon-close');
    const cellContentWrapper = document.querySelectorAll('.amc-cell__content-wrapper');
    const amcInputs = document.querySelectorAll(".amc-input")
    const amcActions = document.querySelectorAll(".btnActions")
    // Cambiar el estilo de overflow y height de las celdas y secciones
    amcCells.forEach((el) => {
        el.style.overflow = 'visible'; // Eliminar el scroll de las celdas
        el.style.height = 'auto';      // Asegurarse de que las celdas se expandan según su contenido
    });

    cellContentWrapper.forEach(e => {
      e.style.overflow = "visible";
      e.style.height = "auto"
    })

    amcSections.forEach((section) => {
        section.style.height = 'auto'; // Asegurarse de que las secciones se expandan con el contenido de las celdas
    });

    amcSubsections.forEach((section) => {
      section.style.height = 'auto'; // Asegurarse de que las secciones se expandan con el contenido de las celdas
    });

     // Ocultar los iconos de editar y eliminar
    editIcons.forEach(icon => {
      icon.style.visibility = 'hidden'; // Ocultar iconos de editar
    });
    deleteIcons.forEach(icon => {
      icon.style.visibility = 'hidden'; // Ocultar iconos de eliminar
    });

    amcInputs.forEach(input => {
      input.style.border = 'none'
    })

    amcActions.forEach(btn => {
      btn.style.visibility = 'hidden'
    })

    // Agregar el estilo de impresión en formato horizontal antes de llamar a print
    const style = document.createElement('style');
    style.innerHTML = `
        @media print {
    @page {
        size: landscape; /* Orientación horizontal */
        margin: 0; /* Sin márgenes entre la página y el contenido */
    }

    body {
        margin: 0;
        padding: 0;
        width: 100%;
    }

    .container-amc {
        display: block;
        width: 100%;
    }

    .amc-section {
        display: block;
        width: 100%;
        height: auto !important; /* Expandir secciones */
        overflow: visible !important; /* Evitar scroll */
        page-break-inside: avoid; /* Evitar cortes dentro de secciones */
    }

    .amc-cell {
        display: block;
        width: 100%;
        height: auto !important; /* Expandir las celdas al contenido */
        overflow: visible !important;
        margin: 0 !important;
        padding: 0 !important;
    }

    /* Ocultar iconos durante la impresión */
    .simple-icon-note,
    .simple-icon-close {
        visibility: hidden !important;
    }
}
    `;
    document.head.appendChild(style);

    // Abrir la ventana de impresión (simula Ctrl + P)
    window.print();

    // Restaurar el overflow y el height de las celdas y secciones después de la impresión
    setTimeout(() => {
        amcCells.forEach((el) => {
            el.style.overflow = 'auto';  // Restaurar el valor original de overflow
            // el.style.height = '100%';    // Restaurar el valor original de height
        });

        amcSections.forEach((section) => {
            section.style.height = '65%'; // Restaurar el valor original de height en las secciones
          });
        section2.style.height = '35%'

        cellContentWrapper.forEach(e => {
          e.style.overflow = "auto";
          e.style.height = "85%"
        })
        
        amcSubsections.forEach((section) => {
          section.style.height = 'auto'; // Asegurarse de que las secciones se expandan con el contenido de las celdas
        });

        // Restaurar la visibilidad de los iconos de editar y eliminar
        editIcons.forEach(icon => {
          icon.style.visibility = 'visible'; // Restaurar iconos de editar
        });
        deleteIcons.forEach(icon => {
          icon.style.visibility = 'visible'; // Restaurar iconos de eliminar
        });
        amcInputs.forEach(input => {
          input.style.border = '1px solid #d7d7d7'
        })
    
        amcActions.forEach(btn => {
          btn.style.visibility = 'visible'
        })
    }, 1000); // Espera 1 segundo antes de restaurar los estilos (ajustable)
  };

  const analyticsModelCanvas = getAnalyticsModelCanvas();
  const objetoAMC = {}
  const listaAMC = analyticsModelCanvas.forEach(amc => objetoAMC[amc.nombreAMC] =  {
    "DECISIONES" : amc.decisiones ? amc.decisiones.split("||") : [],
    "PREDICCIONES" : amc.predicciones ? amc.predicciones.split("||") : [],
    "TAREAS" : amc.tareas ? amc.tareas.split("||") : [],
    "EVALUACIÓN EN DESARROLLO" : amc.evaluacionDesarrollo ? amc.evaluacionDesarrollo.split("||") : [],
    "PROPUESTA DE VALOR" :  amc.propuestaValor ? amc.propuestaValor.split("||") : [],
    "FUENTES DE DATOS" : amc.fuentesDatos ? amc.fuentesDatos.split("||") : [],
    "CARACTERÍSTICAS PARA REENTRENAMIENTO DEL MODELO" :amc.caracteristicasReentrenamiento ? amc.caracteristicasReentrenamiento.split("||") : [],
    "RECOLECCIÓN DE INFORMACIÓN" : amc.recoleccionInformacion ? amc.recoleccionInformacion.split("||") : [],
    "TIEMPOS Y RESPONSABLES" : amc.tiemposResponsables ? amc.tiemposResponsables.split("||") : [],
    "MONITOREO DE CREACIÓN DE VALOR" : amc.monitoreoCreacionValor ? amc.monitoreoCreacionValor.split("||") : [],
    "EVALUACIÓN EN LÍNEA" : amc.evaluacion ? amc.evaluacion.split("||") : [],
    "nombre_amc" : amc.nombreAMC || "",
    "area_solicitante" : amc.areaSolicitante || "",
    "sponsor" : amc.sponsor || "",
    "formato" : amc.formato || "",
    "usuario_creacion": amc.usuarioCreacion || "",
  }) 

  const listaOpcionesAMC = Object.keys( objetoAMC || {})?.map(e=>({label:e,value:e}))
  window.objetoAMC = objetoAMC
  $("#amc-name").autocomplete({
  source: listaOpcionesAMC,
  select: function(event, ui){
    // Evitar que se establezca el valor por defecto del input (que sería el `value`)
    event.preventDefault();
    let amc = ui.item.value
    window.amcSeleccionado = true
    reloadAMC(amc)
    document.getElementById("btn-clear-amc").style.visibility = "visible"
    }
  }).autocomplete("widget").addClass("select-amc")

  $(".seguimiento-card-button").on("click", (function(t) {
    t.preventDefault();
    $(".seguimiento-card").toggleClass("shown")
    $(".seguimiento-card-button").toggleClass("text-primary")
    let tooltipTriggerList = document.querySelectorAll('[data-toggle="tooltip"]');
      let tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl, {
        boundary: document.body,
        container: 'body',
        trigger: 'hover'
      }));
    
      tooltipList.forEach((tooltip) => { $('.tooltip').hide(); });
  }))

  $("#seguimiento-comentarios").html(`
      <div class="mb-2 text-center">
        No hay observaciones por el momento
      </div>
    `)

  $("#btn-enviar-observacion").on("click", function(){
    const inputSeguimiento = $("#seguimiento-input")
    const amcName = $("#amc-name").val()
    if(!amcName || !inputSeguimiento.val().trim()) return;
    const text = inputSeguimiento.val()
    $().SPServices({
      operation: "UpdateListItems",
      async: false,
      batchCmd: "New",
      listName: "COM_AMC",
      valuepairs:  [
        ["id", id],
        ["id_comentario", idComentario],
        ["id_amc", idAmc],
        ["id_padre", idPadre],
        ["comentario", comentario],
        ["fecha_comentario", today],
        ["autor_comentario_nombres", nombreUsuario],
        ["autor_comentario_usuario", usuario],
        ["progreso_seguimiento", progreso],
      ],
      completefunc: function(xData, Status) {}
    });
    setComentariosAMC(getComentariosAMC({amc:amcName}))
    inputSeguimiento.val("")
  })
}

function setOpcionesSelect({
  idSelect="",
  dataSelect=[]
}){
  const select = $(`#${idSelect}`)
  select.empty();
  select.append(new Option("", "", false, false))
  dataSelect.forEach(opcion => {
    const opcionSelect = new Option(opcion.text, opcion.id, false, false);
    select.append(opcionSelect)
  })

  select.trigger("change")

  // select.select2({
  //   theme: "bootstrap",
  //   placeholder: "",
  //   maximumSelectionSize: 6,
  //   containerCssClass: ":all:",
  //   minimumResultsForSearch: Infinity,
  //   data: dataSelect
  // })
}

function guardarAMC(divId) {
  const originalContent = document.body.innerHTML;
  const printContent = document.getElementById(divId).outerHTML;

  document.body.innerHTML = printContent; // Reemplaza todo el contenido del body
  window.print(); // Ejecuta la impresión
  document.body.innerHTML = originalContent; // Restaura el contenido original
}

// Funcion para obtener todos los amc o uno en específico
function getAnalyticsModelCanvas({idAMC = null} = {}){
  const query = ""
  if(idAMC) query = `<Query><Where><Eq><FieldRef Name="id_amc"/><Value Type="text">${idAMC}</Value></Eq></Where></Query>`
  const analyticsModelCanvas = [];
  $().SPServices({
      operation: "GetListItems",
      async: false,
      listName: "ANALYTICS_MODEL_CANVAS2",
      CAMLQuery: query,
      CAMLViewFields: "<ViewFields>\
                          <FieldRef Name='id_amc' />\
                          <FieldRef Name='nombre_amc' />\
                          <FieldRef Name='area_solicitante' />\
                          <FieldRef Name='sponsor' />\
                          <FieldRef Name='formato' />\
                          <FieldRef Name='decisiones' />\
                          <FieldRef Name='predicciones' />\
                          <FieldRef Name='tareas' />\
                          <FieldRef Name='evaluacion_desarrollo' />\
                          <FieldRef Name='propuesta_valor' />\
                          <FieldRef Name='fuentes_datos' />\
                          <FieldRef Name='caracteristicas_reentrenamiento' />\
                          <FieldRef Name='recoleccion_informacion' />\
                          <FieldRef Name='tiempos_responsables' />\
                          <FieldRef Name='monitoreo_creacion_valor' />\
                          <FieldRef Name='evaluacion' />\
                          <FieldRef Name='usuario_creacion' />\
                          <FieldRef Name='fecha_creacion' />\
                          <FieldRef Name='usuario_ultima_modificacion' />\
                          <FieldRef Name='fecha_ultima_modificacion' />\
                      </ViewFields>",
          completefunc: function (xData, Status) {
              $(xData.responseXML).find("z\\:row").each(function () {
                    const data = {
                      "idAMC" : $(this).attr("ows_id_amc") || "",
                      "nombreAMC" : $(this).attr("ows_nombre_amc") || "",
                      "areaSolicitante" : $(this).attr("ows_area_solicitante") || "",
                      "sponsor" : $(this).attr("ows_sponsor"),
                      "formato" : $(this).attr("ows_formato") || "",
                      "decisiones" :$(this).attr("ows_decisiones") || "",
                      "predicciones" :$(this).attr("ows_predicciones") || "",
                      "tareas" :$(this).attr("ows_tareas") || "",
                      "evaluacionDesarrollo" :$(this).attr("ows_evaluacion_desarrollo") || "",
                      "propuestaValor" :$(this).attr("ows_propuesta_valor") || "",
                      "fuentesDatos" :$(this).attr("ows_fuentes_datos") || "",
                      "caracteristicasReentrenamiento" :$(this).attr("ows_caracteristicas_reentrenamiento") || "",
                      "recoleccionInformacion" :$(this).attr("ows_recoleccion_informacion") || "",
                      "tiemposResponsables" :$(this).attr("ows_tiempos_responsables") || "",
                      "monitoreoCreacionValor" :$(this).attr("ows_monitoreo_creacion_valor") || "",
                      "evaluacion" :$(this).attr("ows_evaluacion") || "",
                      "usuarioCreacion" :$(this).attr("ows_usuario_creacion") || "",
                      "fechaCreacion" :$(this).attr("ows_fecha_creacion") || "",
                      "usuarioUltimaModificacion" :$(this).attr("ows_usuario_ultima_modificacion") || "",
                      "fechaUltimaModificacion" :$(this).attr("ows_fecha_ultima_modificacion") || "",
                    }
                    analyticsModelCanvas.push(data);
                  });
              }
      })
  return analyticsModelCanvas
}

function getEmpleados({usuario}={}){
  const empleados = [];
  const query = ""
  if(usuario) query = `<Query><Where><Eq><FieldRef Name="usuario"/><Value Type="text">${usuario}</Value></Eq></Where></Query>`
  $().SPServices({
    operation: "GetListItems",
    async: false,
    listName: "Z_Tmp_Datos_Empleados",
    CAMLQuery: query,
    CAMLViewFields: "<ViewFields>\
                        <FieldRef Name='CODIGO_EMPLEADO' />\
                        <FieldRef Name='Nombre1' />\
                        <FieldRef Name='cod_centro_costo' />\
                        <FieldRef Name='centro_costo' />\
                        <FieldRef Name='CARGO' />\
                        <FieldRef Name='usuario' />\
                        <FieldRef Name='JEFE' />\
                        <FieldRef Name='ESTADO' />\
                    </ViewFields>",
        completefunc: function (xData, Status) {
          $(xData.responseXML).find("z\\:row").each(function () {
            const data = {
              "codigo" : $(this).attr("ows_CODIGO_EMPLEADO") || "",
              "nombreCompleto" : $(this).attr("ows_Nombre1") || "",
              "centroCosto" : $(this).attr("ows_centro_costo") || "",
              "codCentroCosto" : $(this).attr("ows_cod_centro_costo") || "",
              "cargo" : $(this).attr("ows_cargo"),
              "usuario" : $(this).attr("ows_usuario") || "",
              "jefe" :$(this).attr("ows_JEFE") || "",
              "estado" :$(this).attr("ows_ESTADO") || "",
            }
            empleados.push(data);
          });
        }
  })
  return empleados
}

function getComentariosAMC({amc}={}){
  const amcName = amc || $("#amc-name").val()
  const comentarios = [];
  $().SPServices({
      operation: "GetListItems",
      async: false,
      listName: "COMENTARIOS_AMC",
      CAMLQuery: `<Query><Where><Eq><FieldRef Name="id_amc"/><Value Type="text">${amcName}</Value></Eq></Where></Query>`,
      CAMLViewFields: "<ViewFields>\
                          <FieldRef Name='id_comentario' />\
                          <FieldRef Name='id_amc' />\
                          <FieldRef Name='id_padre' />\
                          <FieldRef Name='comentario' />\
                          <FieldRef Name='fecha_comentario' />\
                          <FieldRef Name='autor_comentario_nombres' />\
                          <FieldRef Name='autor_comentario_usuario' />\
                          <FieldRef Name='progreso_seguimiento' />\
                      </ViewFields>",
          completefunc: function (xData, Status) {
              $(xData.responseXML).find("z\\:row").each(function () {
                    const data = {
                      "idComentario" : $(this).attr("ows_id_comentario") || "",
                      "idAmc" : $(this).attr("ows_id_amc") || "",
                      "idPadre" : $(this).attr("ows_id_padre"),
                      "comentario" : $(this).attr("ows_comentario") || "",
                      "fechaComentario" :$(this).attr("ows_fecha_comentario") || "",
                      "autorComentarioNombres" :$(this).attr("ows_autor_comentario_nombres") || "",
                      "autorComentarioUsuario" :$(this).attr("ows_autor_comentario_usuario") || "",
                      "progresoSeguimiento" :$(this).attr("ows_progreso_seguimiento") || "",
                    }
                    comentarios.push(data);
                  });
              }
      })
  return comentarios
}

function setComentariosAMC(comentarios){
  let html = '';
  let respuestas = [];
  document.getElementById("seguimiento-conteo").textContent = comentarios.length + ' Entradas';
  $.each(comentarios, function (index, item){

      if(item.idPadre === "0"){
        const progreso = (parseFloat(item.progresoSeguimiento)*100);
        const comentario = item.comentario.trim() || 'Sin comentarios'
        html += `<div class="custom-card mb-2 d-flex p-2 flex-row" style="gap:1rem; box-shadow:none !important; background-color: gray !important; background-color:#e7effe !important;" id="${item.idComentario}">\
            <div class="avatar">\
              <img src="img/Data Science_38.svg" alt="Author">\
            </div>\
            <div class="d-flex flex-column">\
              <span class="font-weight-bold">${item.autorComentarioNombres}</span>
              <span style="color:#8f8f8f;">${item.fechaComentario}</span>
              <span>${comentario}</span>\
              <span class="font-weight-bold">${progreso}%</span>\
              <button data-toggle="modal"data-target="#popSeguimiento" onclick="idComentario('+item.attr("ows_ID_comentario")+')" class="d-flex btn btn-outline-primary"  style="border-radius:0.75rem !important;gap:.5rem; width:40%;"><i class="iconsminds-to-left"></i>Responder</button>\
            </div>\
          </div>`
      }else{
        respuestas.push(item)
      }
  })
  document.getElementById("seguimiento-comentarios").innerHTML = html;
  $.each(respuestas, function (index, item){
    const comentario = item.comentario.trim() || 'Sin comentarios'
    const respuesta = `<div class="custom-card mb-2 d-flex p-2 flex-row" style="margin-left:4rem !important; gap:1rem; box-shadow:none !important; background-color: gray !important; background-color:#fae5f0 !important;" id="${item.idComentario}">\
            <div class="avatar">\
              <img src="img/Data Science_38.svg" alt="Author">\
            </div>\
            <div class="d-flex flex-column">\
              <span class="font-weight-bold">${item.autorComentarioNombres}</span>
              <span style="color:#8f8f8f;">${item.fechaComentario}</span>
              <span> ${comentario} </span>\
            </div>\
          </div>`
      $('#'+item.idPadre).after(respuesta);
  });
}

function AnalyticsModelCanvas(){
  window.amcSeleccionado = false
  window.celdaEditada = false
  window.edited = false;
  window.currentCell = null;
  window.CELL_TITLES = ["DECISIONES", "PREDICCIONES", "TAREAS", "EVALUACIÓN EN DESARROLLO","PROPUESTA DE VALOR", "FUENTES DE DATOS", "CARACTERÍSTICAS PARA REENTRENAMIENTO DEL MODELO", "RECOLECCIÓN DE INFORMACIÓN", "TIEMPOS Y RESPONSABLES", "MONITOREO DE CREACIÓN DE VALOR", "EVALUACIÓN EN LÍNEA"]
  document.getElementById("amc-user").textContent = window.current_user || getUserAndDate()[0][0]
  clearAMC()
  listenerAMC()
  if(!window.objetoAMC) window.objetoAMC = {}
  reloadAMC(null)
  
}

/*
borrarFiltrosBuscadorCampos()
buscadorCampos()
catalogoReferencias()
reloadframes()
dataIndex()
diagramaDI()
artefactos()
estructura()
deleteFiltro()
metadatosLinaje()
nuevoCriterio()
addAtributo()
segmentar()
glosarioDominio()
estrategiaDato()
toggleAll()
toggleArrow()
expandir()
fichaAtributo()
inventario_campañas()
fichaTablas()
fichaDominio()
fuentes()
nuevoCriterio()
segmentar()
glosario()
IndicadoresGestion()
filtrarDominios()
libroDominios()
cargar_barras()
index()
servidores()
togglePoliticas()
subrayarPoliticas()
politicasProcedimientos()
sobreOGA()
toggleOGA()
subrayarOGA()
playvideo()
campañas()
InventarioArtefactos()
actualizarOrdinalPositions()
distanciaLevenshtein(texto1, texto2)
calcularSimilitud(texto1, texto2)
Atributos_Pendientes()
*/

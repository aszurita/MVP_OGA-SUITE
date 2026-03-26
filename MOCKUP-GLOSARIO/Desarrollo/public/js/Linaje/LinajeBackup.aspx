<!DOCTYPE html>
<html>

<head>
  <meta charset="utf-8" />
  <title>Linaje de datos (BACKUP - NO USAR)</title>
  <!-- ARCHIVO DE RESPALDO - NO UTILIZAR -->
  <!-- CONSULTAR SIEMPRE EL ARCHIVO PRINCIPAL Linaje.aspx -->
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f0f0f0;
      padding: 20px;
    }
    h1 {
      color: #d9534f;
    }
    .warning {
      background-color: #f2dede;
      border: 1px solid #d9534f;
      color: #a94442;
      padding: 15px;
      margin: 20px 0;
      border-radius: 4px;
    }
  </style>
</head>

<body>
  <div class="warning">
    <h1>ARCHIVO DE RESPALDO - NO UTILIZAR</h1>
    <p>Este archivo es solo un respaldo histórico y no debe usarse.</p>
    <p>Por favor, utilice siempre el archivo principal <a href="../../../Linaje.aspx">Linaje.aspx</a>.</p>
  </div>
  <!-- El contenido a continuación es solo referencia histórica -->
  <div class="container" style="display:none">
    <!-- Header -->
    <header class="header">
      <h1>Linaje de Datos</h1>
      <div class="header-actions">
        <button id="reajustarBtn" class="btn-secondary">🔄 Reajustar</button>
        <button id="guardarBtn" class="btn-secondary">💾 Guardar JSON</button>
        <button id="cargarBtn" class="btn-secondary">📁 Cargar JSON</button>
      </div>
    </header>

    <!-- Sidebar -->
    <aside class="sidebar">
      <h2>Agregar Nodo</h2>


      <div class="form-group">
        <label for="srvInput">Servidor</label>
        <select id="srvInput" class="form-select">
          <option value="" disabled selected>Selecciona un servidor</option>
        </select>
      </div>

      <div class="form-group">
        <label for="dbInput">Base de Datos</label>
        <select id="dbInput" class="form-select" disabled>
          <option value="" disabled selected>Selecciona una base</option>
        </select>
      </div>

      <div class="form-group">
        <label for="schemaInput">Esquema</label>
        <select id="schemaInput" class="form-select" disabled>
          <option value="" disabled selected>Selecciona un esquema</option>
        </select>
      </div>

      <div class="form-group">
        <label for="tableInput">Tabla</label>
        <select id="tableInput" class="form-select" disabled>
          <option value="" disabled selected>Selecciona una tabla</option>
        </select>
      </div>

      <div class="form-group">
        <label for="fieldsInput">Campos:</label>
        <select id="fieldsInput" class="form-select" multiple name="fieldsInput[]"></select>
      </div>

      <div class="form-group">
        <label for="typeInput">Tipo de Nodo</label>
        <select id="typeInput" class="form-select">
          <option value="" disabled selected>Selecciona un tipo</option>
          <option value="service">🧩 Servicio</option>
          <option value="database">🗄️ Base de Datos</option>
          <option value="tabla">📋 Tabla</option>
          <option value="api">🌐 API</option>
        </select>


      </div>

      <div class="form-group">
        <label for="nombreInput">Nombre</label>
        <input type="text" id="nombreInput" class="form-input" placeholder="Ingresa el nombre del nodo">
      </div>

      <div class="form-group">
        <label for="descripcionInput">Descripción</label>
        <input type="text" id="descripcionInput" class="form-input" placeholder="Describe la función del nodo">
      </div>

      <button id="submitBtn" class="btn-primary">➕ Añadir Nodo</button>
    </aside>

    <!-- Main Graph Area -->
    <main class="main-graph">
      <div id="cy"></div>
      <div id="informacionNodo" class="node-info"></div>
    </main>

    <!-- Right Panel -->
    <aside class="right-panel">
      <h2>Estructura JSON </h2>
      <div id="visualizacion" class="json-output"></div>
    </aside>
  </div>

  <!-- Hidden file input -->
  <input type="file" id="fileInput" class="hidden-input" accept=".json,.txt">
  <!-- Cargar Cytoscape y extensiones desde CDN -->
  <script src="https://cdnjs.cloudflare.com/ajax/libs/cytoscape/3.26.0/cytoscape.min.js"></script>
  
  <!-- Cargar módulos en orden -->
  <script src="config/config.js"></script>
  <script src="modules/data-mock.js"></script>
  <script src="modules/api2.js"></script>
  <script src="utils/helpers.js"></script>
  <script src="modules/cytoscape-manager.js"></script>
  <script src="modules/select-cascade.js"></script>

  <script>
    // ================== INICIALIZACIÓN PRINCIPAL ==================
    let cytoscapeManager;
    let selectCascadeManager;

    // Inicializar cuando el DOM esté listo
    document.addEventListener('DOMContentLoaded', async () => {
      try {
        // Mostrar estado de desarrollo
        if (ConfigUtils.isDevelopment()) {
          console.log('🔧 [MODO DESARROLLO] Usando datos mock para testing');
        }

        // Inicializar gestores
        cytoscapeManager = new CytoscapeManager();
        selectCascadeManager = new SelectCascadeManager();

        // Configurar event listeners principales
        setupMainEventListeners();

        // Inicializar con nodo padre
        initializeParentNode();

        console.log('✅ Sistema de Linaje inicializado correctamente');
      } catch (error) {
        LinajeHelpers.handleError(error, 'inicialización del sistema');
      }
    });

    /**
     * Configura event listeners principales
     */
    function setupMainEventListeners() {
      // Botón de añadir nodo
      document.getElementById('submitBtn').addEventListener('click', handleAddNode);

      // Botones de header
      document.getElementById('reajustarBtn').addEventListener('click', () => {
        cytoscapeManager.applyHorizontalLayout();
      });

      document.getElementById('guardarBtn').addEventListener('click', () => {
        cytoscapeManager.saveGraph();
      });

      document.getElementById('cargarBtn').addEventListener('click', () => {
        document.getElementById('fileInput').click();
      });

      // Cargar archivo JSON
      document.getElementById('fileInput').addEventListener('change', handleFileLoad);
    }

    /**
     * Maneja la adición de un nuevo nodo
     */
    function handleAddNode() {
      const nombre = document.getElementById('nombreInput').value.trim();
      const descripcion = document.getElementById('descripcionInput').value.trim();
      const tipo = document.getElementById('typeInput').value;

      if (!nombre || !tipo) {
        alert('Por favor completa al menos el nombre y el tipo');
        return;
      }

      const camposSeleccionados = selectCascadeManager.getSelectedFields();
      
      cytoscapeManager.addNode(nombre, descripcion, tipo, camposSeleccionados);

      // Limpiar formulario
      document.getElementById('nombreInput').value = '';
      document.getElementById('descripcionInput').value = '';
      document.getElementById('typeInput').value = '';
    }

    /**
     * Maneja la carga de archivo JSON
     */
    function handleFileLoad(e) {
      const file = e.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = function (e) {
        try {
          const jsonData = JSON.parse(e.target.result);
          cytoscapeManager.loadGraph(jsonData);
          alert('¡Archivo cargado exitosamente!');
        } catch (error) {
          alert('Error al cargar el archivo: ' + error.message);
        }
      };
      reader.readAsText(file);
    }

    /**
     * Inicializa el nodo padre
     */
    function initializeParentNode() {
      // Intentar crear nodo desde URL primero
      if (!cytoscapeManager.crearNodoDesdeURL()) {
        // Si no hay parámetros URL, usar configuración por defecto
        const defaultParent = ConfigUtils.getDefaultParentNode();
        cytoscapeManager.crearNodoPadre(defaultParent);
      }
    }

    // ================== API PÚBLICA ==================
    window.linajeContext = {
      /**
       * Obtiene la selección actual
       */
      getSelected() {
        return selectCascadeManager.getSelected();
      },

      /**
       * Obtiene el gestor de Cytoscape
       */
      getCytoscapeManager() {
        return cytoscapeManager;
      },

      /**
       * Obtiene el gestor de cascada
       */
      getSelectCascadeManager() {
        return selectCascadeManager;
      },

      /**
       * Verifica si está en modo desarrollo
       */
      isDevelopment() {
        return ConfigUtils.isDevelopment();
      }
    };


    // Función para crear nodo desde parámetros URL
    function crearNodoDesdeURL() {
      const params = new URLSearchParams(location.search);

      // Verificar si hay parámetros relevantes
      const servidor = params.get('servidor');
      const base = params.get('base');
      const esquema = params.get('esquema');
      const tabla = params.get('tabla');
      const tipo = params.get('tipo') || 'tabla'; // Por defecto tabla
      const nombre = params.get('nombre');

      // Si hay al menos tabla y nombre, crear el nodo
      if (tabla && nombre) {
        const descripcion = `${servidor ? servidor + '.' : ''}${base ? base + '.' : ''}${esquema ? esquema + '.' : ''}${tabla}`;

        crearNodoPadre({
          nombre: nombre,
          descripcion: descripcion,
          tipo: tipo,
          servidor: servidor,
          base: base,
          esquema: esquema,
          tabla: tabla
        });

        return true; // Se creó nodo desde URL
      }

      return false; // No había parámetros suficientes
    }

    // Función para actualizar el JSON dinámicamente
    function updateJSON() {
      const graphData = cy.json();

      // Buscar el nodo padre
      const nodoPadre = graphData.elements.nodes.find(node => node.data.id === nodoPadreId);

      if (!nodoPadre) {
        document.getElementById('visualizacion').textContent = JSON.stringify({
          message: "No hay nodo padre definido"
        }, null, 2);
        return;
      }

      // Crear estructura jerárquica con el nodo padre como raíz
      let nodeHierarchy = {
        padre: nodoPadre.data,
        hijos: []
      };

      // Buscar todos los hijos directos del nodo padre
      const hijosDirectos = [];
      const edges = Array.isArray(graphData.elements.edges) ? graphData.elements.edges : [];
      const nodes = Array.isArray(graphData.elements.nodes) ? graphData.elements.nodes : [];

      edges.forEach(edge => {
        if (edge.data.source === nodoPadreId) {
          const hijoNode = nodes.find(node => node.data.id === edge.data.target);
          if (hijoNode) {
            hijosDirectos.push({
              nodo: hijoNode.data,
              hijos: []
            });
          }
        }
      });

      // Para cada hijo directo, buscar sus propios hijos
      hijosDirectos.forEach(hijoDirecto => {
        graphData.elements.edges.forEach(edge => {
          if (edge.data.source === hijoDirecto.nodo.id) {
            const nietoNode = graphData.elements.nodes.find(node => node.data.id === edge.data.target);
            if (nietoNode) {
              hijoDirecto.hijos.push(nietoNode.data);
            }
          }
        });
      });

      nodeHierarchy.hijos = hijosDirectos;

      // Agregar nodos huérfanos (no conectados al padre)
      const nodosConectados = new Set([nodoPadreId]);
      edges.forEach(edge => {
        nodosConectados.add(edge.data.source);
        nodosConectados.add(edge.data.target);
      });

      const nodosHuerfanos = graphData.elements.nodes.filter(node =>
        !nodosConectados.has(node.data.id) && node.data.id !== nodoPadreId
      );

      if (nodosHuerfanos.length > 0) {
        nodeHierarchy.nodosHuerfanos = nodosHuerfanos.map(node => node.data);
      }

      // Mostrar el JSON jerárquico
      document.getElementById('visualizacion').textContent = JSON.stringify(nodeHierarchy, null, 2);
    }

    // Función para aplicar layout horizontal mejorado
    function applyHorizontalLayout() {
      const nodes = cy.nodes();
      const edges = cy.edges();

      if (nodes.length === 0) return;

      // Encontrar el nodo padre
      const nodoPadre = cy.getElementById(nodoPadreId);

      if (!nodoPadre.length) {
        // Si no hay nodo padre, usar layout grid horizontal
        cy.layout({
          name: 'grid',
          rows: 1,
          spacingFactor: 2,
          avoidOverlap: true,
          animate: true,
          animationDuration: 500,
          padding: 50
        }).run();
        return;
      }

      const HORIZONTAL_SPACING = 200;
      const VERTICAL_SPACING = 120;
      const CENTER_X = 400; // Posición X del nodo padre (centro)
      const CENTER_Y = 200; // Posición Y del nodo padre

      // Posicionar el nodo padre en el centro
      nodoPadre.position({ x: CENTER_X, y: CENTER_Y });

      // Separar nodos en tres categorías
      const padresDelPadre = []; // Nodos que alimentan al padre (van a la izquierda)
      const hijosDelPadre = [];  // Nodos que salen del padre (van a la derecha)

      // Encontrar padres del padre (nodos que tienen aristas hacia el padre)
      edges.forEach(edge => {
        if (edge.data('target') === nodoPadreId) {
          padresDelPadre.push(edge.data('source'));
        }
      });

      // Encontrar hijos del padre y sus descendientes
      const visitedRight = new Set();
      const rightLevels = new Map();

      function buildRightLevels(nodeId, level) {
        if (visitedRight.has(nodeId)) return;
        visitedRight.add(nodeId);

        if (!rightLevels.has(level)) {
          rightLevels.set(level, []);
        }
        rightLevels.get(level).push(nodeId);

        // Buscar hijos
        edges.forEach(edge => {
          if (edge.data('source') === nodeId) {
            buildRightLevels(edge.data('target'), level + 1);
          }
        });
      }

      // Construir niveles hacia la derecha (hijos del padre)
      edges.forEach(edge => {
        if (edge.data('source') === nodoPadreId) {
          buildRightLevels(edge.data('target'), 1);
        }
      });

      // Encontrar padres de los padres del padre (niveles hacia la izquierda)
      const visitedLeft = new Set();
      const leftLevels = new Map();

      function buildLeftLevels(nodeId, level) {
        if (visitedLeft.has(nodeId)) return;
        visitedLeft.add(nodeId);

        if (!leftLevels.has(level)) {
          leftLevels.set(level, []);
        }
        leftLevels.get(level).push(nodeId);

        // Buscar padres (aristas que llegan a este nodo)
        edges.forEach(edge => {
          if (edge.data('target') === nodeId) {
            buildLeftLevels(edge.data('source'), level + 1);
          }
        });
      }

      // Construir niveles hacia la izquierda
      padresDelPadre.forEach(nodeId => {
        buildLeftLevels(nodeId, 1);
      });

      // Posicionar nodos del lado izquierdo (padres del padre)
      leftLevels.forEach((nodeIds, level) => {
        const x = CENTER_X - (level * HORIZONTAL_SPACING);
        const nodeCount = nodeIds.length;
        const startY = CENTER_Y - ((nodeCount - 1) * VERTICAL_SPACING / 2);

        nodeIds.forEach((nodeId, index) => {
          const y = startY + (index * VERTICAL_SPACING);
          cy.getElementById(nodeId).position({ x, y });
        });
      });

      // Posicionar nodos del lado derecho (hijos del padre)
      rightLevels.forEach((nodeIds, level) => {
        const x = CENTER_X + (level * HORIZONTAL_SPACING);
        const nodeCount = nodeIds.length;
        const startY = CENTER_Y - ((nodeCount - 1) * VERTICAL_SPACING / 2);

        nodeIds.forEach((nodeId, index) => {
          const y = startY + (index * VERTICAL_SPACING);
          cy.getElementById(nodeId).position({ x, y });
        });
      });

      // Identificar nodos huérfanos
      const allConnectedNodes = new Set([nodoPadreId]);
      leftLevels.forEach(nodeIds => {
        nodeIds.forEach(nodeId => allConnectedNodes.add(nodeId));
      });
      rightLevels.forEach(nodeIds => {
        nodeIds.forEach(nodeId => allConnectedNodes.add(nodeId));
      });

      // Posicionar nodos huérfanos en la parte inferior
      const nodosOrfanos = nodes.filter(node =>
        !allConnectedNodes.has(node.id())
      );

      nodosOrfanos.forEach((node, index) => {
        const x = CENTER_X + (index * HORIZONTAL_SPACING);
        const y = CENTER_Y + 300; // Debajo del grafo principal
        node.position({ x, y });
      });

      // Animar el layout
      cy.animate({
        fit: {
          eles: cy.elements(),
          padding: 50
        }
      }, {
        duration: 500
      });
    }

    // Añadir nodo
    document.getElementById('submitBtn').addEventListener('click', function () {
      const nombre = document.getElementById('nombreInput').value.trim();
      const descripcion = document.getElementById('descripcionInput').value.trim();
      const tipo = document.getElementById('typeInput').value;

      if (!nombre || !tipo) {
        alert('Por favor completa al menos el nombre y el tipo');
        return;
      }

      const icon = iconos[tipo];
      const camposSeleccionados = getSelectedFieldsNative(); // ['COL1','COL2']
      const nuevoNodo = {
        data: {
          id: tipo + idCounter++,
          nombre,
          descripcion,
          icon,
          tipo,
          campos: camposSeleccionados // guardar array dentro del nodo
        },
        position: { x: 100 + (idCounter * 200), y: 300 }
      };

      cy.add(nuevoNodo);

      // Limpiar los campos del formulario
      document.getElementById('nombreInput').value = '';
      document.getElementById('descripcionInput').value = '';
      document.getElementById('typeInput').value = '';

      // Aplicar layout horizontal
      applyHorizontalLayout();

      // Actualizar JSON automáticamente
      updateJSON();
    });

    let sourcePort = null;
    let selectedEdge = null;

    // Crear conexiones entre nodos
    cy.on('tap', 'node', function (evt) {
      const node = evt.target;

      // Si el nodo actual ya no existe en el grafo, no continuar
      if (sourcePort && !cy.hasElementWithId(sourcePort.id())) {
        sourcePort = null;
        return;
      }

      // Caso: tap en el mismo nodo = cancelar selección
      if (sourcePort && sourcePort.id() === node.id()) {
        sourcePort.removeClass('selected');
        sourcePort = null;
        return;
      }

      // Seleccionar nodo
      if (!sourcePort) {
        sourcePort = node;
        node.addClass('selected');
      } else {
        const sourceId = sourcePort.id();
        const targetId = node.id();
        if (sourceId !== targetId) {
          cy.add({ data: { source: sourceId, target: targetId } });
          applyHorizontalLayout(); // Reajustar layout después de añadir conexión
          updateJSON();
        }
        sourcePort.removeClass('selected');
        sourcePort = null;
      }
    });

    // Seleccionar aristas
    cy.on('tap', 'edge', function (evt) {
      const edge = evt.target;

      // Deseleccionar arista anterior
      if (selectedEdge) {
        selectedEdge.removeClass('selected');
      }

      selectedEdge = edge;
      edge.addClass('selected');
    });

    // Deseleccionar al hacer clic en el fondo
    cy.on('tap', function (evt) {
      if (evt.target === cy) {
        if (selectedEdge) {
          selectedEdge.removeClass('selected');
          selectedEdge = null;
        }
        if (sourcePort) {
          sourcePort.removeClass('selected');
          sourcePort = null;
        }
      }
    });

    // Borrar elementos con Delete
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Delete' || e.key === 'Backspace') {
        if (selectedEdge) {
          cy.remove(selectedEdge);
          selectedEdge = null;
          applyHorizontalLayout();
          updateJSON();
        }
        if (sourcePort) {
          cy.remove(sourcePort);
          sourcePort = null;
          applyHorizontalLayout();
          updateJSON();
        }
      }
    });

    // Mostrar información en hover
    cy.on('mouseover', 'node', function (evt) {
      const node = evt.target;
      const infoNodo = node.data();
      const posicionNodo = node.renderedPosition();
      const cartaInformacion = document.getElementById('informacionNodo');

      const iconoTipo = infoNodo['icon'] || '';
      const nombre = infoNodo['nombre'] || '';
      const descripcion = infoNodo['descripcion'] || '';
      const tipo = infoNodo['tipo'] || '';
      const tipoNombre = tipoNombres[tipo] || tipo;

      cartaInformacion.innerHTML = `
        <strong>${iconoTipo} ${tipoNombre}</strong><br/>
        <div style="font-weight: 100; color: #160F41; margin: 4px 0;">${nombre}</div>
        <div class="node-subtitle">${descripcion}</div>
      `;

      cartaInformacion.style.left = (posicionNodo.x + 10) + 'px';
      cartaInformacion.style.top = (posicionNodo.y + 10) + 'px';
      cartaInformacion.style.display = 'block';
    });

    cy.on('mouseout', 'node', function (evt) {
      document.getElementById('informacionNodo').style.display = 'none';
    });

    // Función para guardar JSON como archivo
    document.getElementById("guardarBtn").addEventListener('click', function () {
      const nodes = cy.nodes().map(node => ({
        data: node.data(),
        position: node.position()
      }));

      const edges = cy.edges().map(edge => ({
        data: {
          source: edge.data('source'),
          target: edge.data('target')
        }
      }));

      const simplifiedData = {
        elements: {
          nodes: nodes,
          edges: edges
        }
      };

      const jsonString = JSON.stringify(simplifiedData, null, 2);

      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);

      const a = document.createElement('a');
      const fechaActual = new Date();
      const fechaISO = fechaActual.toISOString().split('T')[0];
      a.href = url;
      a.download = 'linaje-datos-' + fechaISO + '.json';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    });

    // Función para cargar JSON desde archivo
    document.getElementById("cargarBtn").addEventListener('click', function () {
      document.getElementById('fileInput').click();
    });

    document.getElementById('fileInput').addEventListener('change', function (e) {
      const file = e.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = function (e) {
        try {
          const jsonData = JSON.parse(e.target.result);

          // Limpiar el grafo actual
          cy.elements().remove();

          // Cargar nodos
          if (jsonData.elements && jsonData.elements.nodes) {
            jsonData.elements.nodes.forEach(nodeData => {
              const data = nodeData.data;
              // Asegurar que el icono esté presente
              if (data.tipo && iconos[data.tipo] && !data.icon) {
                data.icon = iconos[data.tipo];
              }

              cy.add({
                data: data,
                position: nodeData.position || { x: 300 + Math.random() * 200, y: 300 + Math.random() * 200 }
              });
            });
          }

          // Cargar aristas
          if (jsonData.elements && jsonData.elements.edges) {
            jsonData.elements.edges.forEach(edgeData => {
              cy.add({
                data: edgeData.data
              });
            });
          }

          // Actualizar el contador de IDs para evitar duplicados
          const nodes = cy.nodes();
          let maxId = 0;
          nodes.forEach(node => {
            const id = node.id();
            const numericPart = id.replace(/[^0-9]/g, '');
            if (numericPart && parseInt(numericPart) > maxId) {
              maxId = parseInt(numericPart);
            }
          });
          idCounter = maxId + 1;

          // Aplicar layout horizontal
          applyHorizontalLayout();

          // Actualizar JSON
          updateJSON();

          alert('¡Archivo cargado exitosamente!');
        } catch (error) {
          alert('Error al cargar el archivo: ' + error.message);
        }
      };
      reader.readAsText(file);
    });

    // Reajustar grafo
    document.getElementById("reajustarBtn").addEventListener('click', function () {
      applyHorizontalLayout();
    });

    // Inicializar con nodo padre
    // Inicializar: primero intentar desde URL, si no hay params usar config por defecto
    if (!crearNodoDesdeURL()) {
      crearNodoPadre(NODO_PADRE_CONFIG);
    }

  </script>



  <script>
    // ================== CONFIG ==================
    const ENDPOINT = 'http://gobinfoana01-2:8510/query';

    // Si tienes muchísimas tablas, puedes exigir teclear 1+ letra para filtrar
    const TABLE_MIN_INPUT_LEN = 0;  // pon 1 si hay miles de tablas

    // ================== HELPERS ==================
    function getQS(name) {
      return new URLSearchParams(location.search).get(name) || '';
    }


    // funciones handler específicas (solo llaman a tus clearX + loaders)
    function srvHandler(ev) {
      clearDatabase(); // borra db/schema/table/fields
      const name = $srv().value;
      if (!name) return;
      loadDatabasesFor(name);
    }

    function dbHandler(ev) {
      clearSchema(); // borra esquema/table/fields
      const srv = $srv().value, db = $db().value;
      if (!srv || !db) return;
      loadSchemasFor(srv, db);
    }

    function schemaHandler(ev) {
      clearTable(); // borra table/fields
      const srv = $srv().value, db = $db().value, sc = $schema().value;
      if (!srv || !db || !sc) return;
      loadTablesFor(srv, db, sc);
    }

    function tableHandler(ev) {
      clearFields(); // borra fields
      const srv = $srv().value, db = $db().value, sc = $schema().value, tbl = $table().value;
      if (!srv || !db || !sc || !tbl) return;
      loadFieldsFor(srv, db, sc, tbl);
    }
    // attachHandlerTo(selectEl, handler, opts)
    // opts: { events: ['change','select2:select'], name: 'miKey' }
    function attachHandlerTo(selectEl, handler, opts = {}) {
      const events = opts.events || ['change', 'select2:select', 'select2:unselect'];
      const key = opts.name || ('_linaje_' + (selectEl.id || Math.random()));

      // quitar handler previo guardado
      if (selectEl[key]) {
        try { selectEl.removeEventListener('change', selectEl[key]); } catch (e) { }
        if (window.$ && $.fn && $.fn.select2) {
          try { $(selectEl).off(events.join(' '), selectEl[key]); } catch (e) { }
        }
      }

      // guardar y añadir
      selectEl[key] = handler;
      // nativo (siempre)
      try { selectEl.addEventListener('change', handler); } catch (e) { }
      // select2 (si está presente)
      if (window.$ && $.fn && $.fn.select2) {
        try { $(selectEl).on(events.join(' '), handler); } catch (e) { }
      }
    }

    // limpia solo campos
    function clearFields() {
      const selFields = $fields();
      if (!selFields) return;

      // destruir Select2 si existe
      if (window.$ && $.fn && $.fn.select2) {
        try { $(selFields).select2('destroy'); } catch (e) { /* ignore */ }
      }

      // repoblar vacío con placeholder y estado nativo
      fillSelectNative(selFields, [], { preselected: [] });
      enhanceFieldsSelectAfterFill(selFields);
      selFields.disabled = true;
    }

    // limpia tabla + campos
    function clearTable() {
      const selTable = $table();
      if (!selTable) return;

      if (window.$ && $.fn && $.fn.select2) {
        try { $(selTable).select2('destroy'); } catch (e) { /* ignore */ }
      }

      fillSelect(selTable, [], { placeholder: 'Selecciona una tabla' });
      selTable.disabled = true;

      // limpiar campos (nivel inferior)
      clearFields();
    }

    // limpia esquema + (table, fields)
    function clearSchema() {
      const selSchema = $schema();
      if (!selSchema) return;

      if (window.$ && $.fn && $.fn.select2) {
        try { $(selSchema).select2('destroy'); } catch (e) { /* ignore */ }
      }

      fillSelect(selSchema, [], { placeholder: 'Selecciona un esquema' });
      selSchema.disabled = true;

      // limpiar niveles inferiores
      clearTable();
    }

    // limpia base + (schema, table, fields)
    function clearDatabase() {
      const selDb = $db();
      if (!selDb) return;

      if (window.$ && $.fn && $.fn.select2) {
        try { $(selDb).select2('destroy'); } catch (e) { /* ignore */ }
      }

      fillSelect(selDb, [], { placeholder: 'Seleccione una base' });
      selDb.disabled = true;

      // limpiar niveles inferiores
      clearSchema();
    }

    // limpia servidor + (db, schema, table, fields)
    function clearServer() {
      const selSrv = $srv();
      if (!selSrv) return;

      if (window.$ && $.fn && $.fn.select2) {
        try { $(selSrv).select2('destroy'); } catch (e) { /* ignore */ }
      }

      fillSelect(selSrv, [], { placeholder: 'Selecciona un servidor' });
      selSrv.disabled = true;

      // limpiar niveles inferiores
      clearDatabase();
    }


    function safeSetValue(selectEl, value) {
      if (window.$ && $.fn && $.fn.select2 && $(selectEl).hasClass('select2-hidden-accessible')) {
        $(selectEl).val(value);
        $(selectEl).trigger('change.select2');
        $(selectEl).trigger('change');
      } else {
        selectEl.value = value;
        selectEl.dispatchEvent(new Event('change', { bubbles: true }));
      }
    }


    // Typeahead sobre select nativo (no añade inputs)
    function enableInlineTypeahead(selectEl, options = {}) {
      if (!selectEl || selectEl._linaje_typeaheadAttached) return;
      const resetMs = options.resetMs || 800;
      let buffer = '';
      let lastTime = 0;
      let highlightedIndex = -1;

      function visibleOptions() {
        return Array.from(selectEl.options).filter(o => o.style.display !== 'none');
      }

      function findIndexByBuffer(buf) {
        const v = buf.toLowerCase();
        const opts = visibleOptions();
        for (let i = 0; i < opts.length; i++) {
          if ((opts[i].textContent || '').toLowerCase().indexOf(v) !== -1) return i;
        }
        return -1;
      }

      function applyHighlight(idx) {
        // quitar highlight previo
        for (const o of selectEl.options) o.classList.remove('linaje-highlight');
        const opts = visibleOptions();
        if (idx >= 0 && idx < opts.length) {
          opts[idx].classList.add('linaje-highlight');
          // desplazar para que sea visible
          try {
            const optNode = opts[idx];
            const optionHeight = optNode.offsetHeight || 24;
            const realIndex = Array.prototype.indexOf.call(selectEl.options, optNode);
            selectEl.scrollTop = realIndex * optionHeight;
          } catch (e) { }
        }
      }

      function resetBufferIfNeeded() {
        const now = Date.now();
        if (now - lastTime > resetMs) buffer = '';
        lastTime = now;
      }

      selectEl.addEventListener('keydown', function (ev) {
        const key = ev.key;
        // Ignore navigational keys except Enter which actuará sobre highlight
        if (key === 'ArrowDown' || key === 'ArrowUp' || key === 'PageUp' || key === 'PageDown' || key === 'Tab') {
          // allow native navigation
          return;
        }

        if (key.length === 1 && !ev.ctrlKey && !ev.metaKey && !ev.altKey) {
          // character key: append to buffer and search
          ev.preventDefault();
          resetBufferIfNeeded();
          buffer += key;
          lastTime = Date.now();

          const idx = findIndexByBuffer(buffer);
          if (idx >= 0) {
            highlightedIndex = idx;
            applyHighlight(highlightedIndex);
          }
          return;
        }

        if (key === 'Backspace') {
          ev.preventDefault();
          resetBufferIfNeeded();
          buffer = buffer.slice(0, -1);
          lastTime = Date.now();
          const idx = buffer ? findIndexByBuffer(buffer) : -1;
          highlightedIndex = idx;
          applyHighlight(idx);
          return;
        }

        if (key === 'Enter') {
          ev.preventDefault();
          const opts = visibleOptions();
          if (highlightedIndex >= 0 && highlightedIndex < opts.length) {
            const opt = opts[highlightedIndex];
            // toggle respecting multi
            if (selectEl.multiple) opt.selected = !opt.selected;
            else {
              // single select: make it the selected value
              for (const o of selectEl.options) o.selected = false;
              opt.selected = true;
            }
            // aplicar clases y notificar
            try { applyOptionClasses(selectEl); } catch (e) { }
            selectEl.dispatchEvent(new Event('change', { bubbles: true }));
          }
          // reset buffer tras Enter
          buffer = '';
          lastTime = 0;
          return;
        }

        // For other keys, ignore (allow browser)
      });

      // Al perder foco limpiamos highlight y buffer
      selectEl.addEventListener('blur', function () {
        buffer = '';
        lastTime = 0;
        highlightedIndex = -1;
        for (const o of selectEl.options) o.classList.remove('linaje-highlight');
      });

      // Si el contenido del select cambia (repoblado), resetear highlight
      const mo = new MutationObserver(() => {
        buffer = '';
        lastTime = 0;
        highlightedIndex = -1;
        for (const o of selectEl.options) o.classList.remove('linaje-highlight');
      });
      mo.observe(selectEl, { childList: true, subtree: false });

      selectEl._linaje_typeaheadAttached = true;
      selectEl._linaje_typeaheadMO = mo;
    }


    function ensureSelect2() {
      const has = (window.$ && $.fn && $.fn.select2);
      if (!has) console.warn('[linaje] Select2 no está cargado: se mostrará el select nativo sin búsqueda.');
      return has;
    }

    // Rellena un <select> y (re)inicializa Select2 con búsqueda
    function fillSelect(selectEl, items, {
      placeholder = 'Selecciona…',
      getValue = (it) => (typeof it === 'string' ? it : it.value ?? it.name),
      getLabel = (it) => (typeof it === 'string' ? it : it.label ?? it.name ?? it.value),
      minInputLength = 0
    } = {}) {
      const $sel = window.$ ? $(selectEl) : null;
      if ($sel && $sel.hasClass('select2-hidden-accessible')) {
        $sel.select2('destroy');
      }

      selectEl.innerHTML = '';
      const opt0 = document.createElement('option');
      opt0.value = ''; opt0.disabled = true; opt0.selected = true;
      opt0.textContent = placeholder;
      selectEl.appendChild(opt0);

      for (const it of items) {
        const o = document.createElement('option');
        o.value = getValue(it);
        o.textContent = getLabel(it);
        selectEl.appendChild(o);
      }

      selectEl.disabled = items.length === 0;

      if (ensureSelect2()) {
        $sel.select2({
          placeholder,
          allowClear: true,
          width: '100%',
          minimumInputLength: minInputLength,
          // Buscar por cualquier parte, sin distinguir mayúsculas
          matcher: function (params, data) {
            if ($.trim(params.term) === '') return data;
            if (typeof data.text === 'undefined') return null;
            const term = params.term.toLowerCase();
            const text = data.text.toLowerCase();
            return text.indexOf(term) > -1 ? data : null;
          }
        });
      }
    }


    // Aplica clases visuales según selección
    function applyOptionClasses(selectEl) {
      for (const opt of selectEl.options) {
        if (opt.selected) opt.classList.add('selected-custom');
        else opt.classList.remove('selected-custom');
      }
    }

    // Click-to-toggle para selects multiple (no requiere Ctrl/Shift)
    // ========== enableClickToggle (reemplazar) ==========
    function enableClickToggle(selectEl) {
      if (selectEl._linaje_clickToggleAttached) return;

      selectEl.addEventListener('mousedown', function (ev) {
        if (!selectEl.multiple) return;
        // prevenir selección nativa para controlar toggle
        ev.preventDefault();

        // guardar scroll actual
        const prevScroll = selectEl.scrollTop;

        const option = ev.target && ev.target.tagName === 'OPTION' ? ev.target : null;
        if (!option) return;

        // togglear
        option.selected = !option.selected;

        // aplicar clases visuales
        applyOptionClasses(selectEl);

        // restaurar scroll inmediatamente (micro-timer para que el navegador termine reflow)
        setTimeout(() => {
          try { selectEl.scrollTop = prevScroll; } catch (e) { /* no crítico */ }
        }, 0);

        // notificar listeners
        selectEl.dispatchEvent(new Event('change', { bubbles: true }));
      }, { passive: false });

      // mantener clases al usar teclado u otros eventos nativos
      selectEl.addEventListener('change', function () {
        applyOptionClasses(selectEl);
      });

      selectEl._linaje_clickToggleAttached = true;
    }


    // Detecta tipo de un option a partir de un detector user-supplied
    // detector puede ser: a) objeto map { VAL: 'diccionario' } o b) función (value)=>type
    function detectTypeForOption(value, detector) {
      if (!detector) return 'unknown';
      if (typeof detector === 'function') return detector(value);
      if (typeof detector === 'object') return detector[String(value)] || 'unknown';
      return 'unknown';
    }

    // Post-procesado: añadir data-type/class, asegurar multiple, preservar selección
    function enhanceFieldsSelect(selectEl, detector) {
      // asegurar multiple
      selectEl.multiple = true;

      // preservar selección actual
      const prevSel = Array.from(selectEl.selectedOptions).map(o => String(o.value));

      // recorrer options y añadir data-type / clase por tipo
      for (const opt of selectEl.options) {
        const type = detectTypeForOption(opt.value, detector);
        // añadir data-type (para lógica) y clase tipo- (para CSS)
        opt.dataset.type = type;
        opt.classList.add('type-' + type);
        // restaurar selección si aplica
        opt.selected = prevSel.includes(String(opt.value));
      }

      // asegurar estilos y comportamiento
      applyOptionClasses(selectEl);
      enableClickToggle(selectEl);
    }

    // Leer selección agrupada por tipo
    function getSelectedByType(selectEl) {
      const out = {};
      for (const opt of selectEl.selectedOptions) {
        const t = opt.dataset.type || 'unknown';
        if (!out[t]) out[t] = [];
        out[t].push(opt.value);
      }
      return out;
    }


    function fillSelectNative(selectEl, items, {
      getValue = it => (typeof it === 'string' ? it : it.value ?? it.name),
      getLabel = it => (typeof it === 'string' ? it : it.label ?? it.name ?? it.value),
      preselected = [] // array de strings o string
    } = {}) {
      // preservar selección actual si no se pasan preselected
      const keepPrev = (preselected == null || (Array.isArray(preselected) && preselected.length === 0));
      const prevSelected = keepPrev
        ? Array.from(selectEl.selectedOptions).map(o => String(o.value))
        : (Array.isArray(preselected) ? preselected.map(String) : (preselected ? [String(preselected)] : []));

      const preArr = Array.isArray(preselected) && preselected.length ? preselected.map(String) : prevSelected;

      // reconstruir opciones
      selectEl.innerHTML = '';

      for (const it of items) {
        const o = document.createElement('option');
        o.value = String(getValue(it));
        o.textContent = getLabel(it);
        if (preArr.includes(o.value)) o.selected = true;
        selectEl.appendChild(o);
      }

      selectEl.disabled = items.length === 0;

      // aplicar clases a opciones seleccionadas (refuerzo para navegadores que ignoran option:checked styling)
      function refreshOptionClasses() {
        for (const opt of selectEl.options) {
          if (opt.selected) opt.classList.add('selected-custom');
          else opt.classList.remove('selected-custom');
        }
      }

      // attach once (idempotente) - sólo un handler, sin blur()
      if (!selectEl._linaje_optionClassHandlerAttached) {
        selectEl.addEventListener('change', function () {
          refreshOptionClasses();
        });
        selectEl._linaje_optionClassHandlerAttached = true;
      }

      // ejecutar inmediatamente para marcar preselecciones
      refreshOptionClasses();

      // notificar a handlers que hay cambio
      selectEl.dispatchEvent(new Event('change', { bubbles: true }));
    }



    function getSelectedFieldsNative() {
      const sel = document.getElementById('fieldsInput');
      return Array.from(sel.selectedOptions).map(o => o.value);
    }
    function setSelectedFieldsNative(values = []) {
      const sel = document.getElementById('fieldsInput');
      const vals = Array.isArray(values) ? values.map(String) : [String(values)];
      for (const opt of sel.options) opt.selected = vals.includes(opt.value);
      sel.dispatchEvent(new Event('change', { bubbles: true }));
    }


    // POST al backend (tu cURL)
    async function postQuery(body) {
      const res = await fetch(ENDPOINT, {
        method: 'POST',
        headers: { accept: 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      return Array.isArray(data) ? data : [];
    }

    // ================== ESTADO DE CARGA/RACE-SAFE ==================
    let _srvReqId = 0;
    let _dbReqId = 0;
    let _schemaReqId = 0;
    let _tableReqId = 0;
    let _fieldsReqId = 0;

    // ================== SELECTS ==================
    const $srv = () => document.getElementById('srvInput');
    const $db = () => document.getElementById('dbInput');
    const $schema = () => document.getElementById('schemaInput');
    const $table = () => document.getElementById('tableInput');
    const $fields = () => document.getElementById('fieldsInput');

    // ================== LOADERS ==================

    // 1) Servidores (sys.servers)
    async function loadServers() {
      const sel = $srv();
      const myReq = ++_srvReqId;

      fillSelect(sel, [], { placeholder: 'Cargando servidores…' });
      sel.disabled = true;
      fillSelect($table(), [], { placeholder: 'Selecciona una tabla' });
      $table().disabled = true;

      try {
        const rows = await postQuery({
          campos: 'DISTINCT top 50 UPPER(SERVIDOR) as name',
          origen: 'procesos_bi.dbo.LOG_ENTIDADES_CAMPOS_OFICIAL',
          condicion: '1=1'
        });
        if (myReq !== _srvReqId) return;

        const servidores = rows.map(r => r?.name).filter(Boolean).sort((a, b) => a.localeCompare(b));
        fillSelect(sel, servidores, { placeholder: 'Selecciona un servidor' });

        // Preselección via ?servidor=
        const pre = getQS('servidor');
        if (pre && servidores.includes(pre)) {
          safeSetValue(sel, pre);
        }

        sel.disabled = servidores.length === 0;
        if (servidores.length) sel.dispatchEvent(new Event('change'));
      } catch (e) {
        console.error('[linaje] Error cargando servidores:', e);
        fillSelect(sel, [], { placeholder: 'Error al cargar servidores' });
        sel.disabled = true;
      }
    }


    // 2) Bases del servidor seleccionado (sys.databases en ese servidor)
    async function loadDatabasesFor(serverName) {
      const sel = $db();
      const myReq = ++_dbReqId;

      // limpiar inferiores inmediatamente y destruir Select2 en ellos
      if (window.$ && $.fn && $.fn.select2) {
        try { $schema().select2('destroy'); } catch (e) { }
        try { $table().select2('destroy'); } catch (e) { }
        try { $fields().select2('destroy'); } catch (e) { }
      }

      // mostrar estado de carga
      fillSelect(sel, [], { placeholder: serverName ? 'Cargando bases…' : 'Seleccione una base' });
      sel.disabled = true;
      fillSelect($schema(), [], { placeholder: 'Selecciona un esquema' });
      $schema().disabled = true;
      fillSelect($table(), [], { placeholder: 'Selecciona una tabla' });
      $table().disabled = true;
      fillSelect($fields(), [], { placeholder: 'Selecciona campos' });
      $fields().disabled = true;

      if (!serverName) return;

      try {
        const rows = await postQuery({
          campos: 'DISTINCT TOP 50 UPPER(TABLE_CATALOG) as name',
          origen: 'procesos_bi.dbo.LOG_ENTIDADES_CAMPOS_OFICIAL',
          condicion: "SERVIDOR = '" + serverName + "'",
        });
        if (myReq !== _dbReqId) return;

        const bases = rows.map(r => r?.name).filter(Boolean).sort((a, b) => a.localeCompare(b));
        fillSelect(sel, bases, { placeholder: 'Selecciona una base' });

        sel.disabled = bases.length === 0;
        // no fuerces preselección aquí; si hay ?base en URL usa safeSetValue si corresponde
      } catch (e) {
        console.error('[linaje] Error cargando bases:', e);
        fillSelect(sel, [], { placeholder: 'Error al cargar bases' });
        sel.disabled = true;
      }
    }


    // 3) Esquemas de la base ( [DB].sys.schemas )
    async function loadSchemasFor(serverName, database) {
      const sel = $schema();
      const myReq = ++_schemaReqId;

      // destruir Select2 en inferiores para evitar problemas de sincronía
      if (window.$ && $.fn && $.fn.select2) {
        try { $table().select2('destroy'); } catch (e) { }
        try { $fields().select2('destroy'); } catch (e) { }
      }

      fillSelect(sel, [], { placeholder: database ? 'Cargando esquemas…' : 'Seleccione un esquema' });
      sel.disabled = true;
      fillSelect($table(), [], { placeholder: 'Selecciona una tabla' });
      $table().disabled = true;
      fillSelect($fields(), [], { placeholder: 'Selecciona campos' });
      $fields().disabled = true;

      if (!serverName || !database) return;

      try {
        const rows = await postQuery({
          campos: 'DISTINCT TOP 20 UPPER(TABLE_SCHEMA) as name',
          origen: 'procesos_bi.dbo.LOG_ENTIDADES_CAMPOS_OFICIAL',
          condicion: "SERVIDOR = '" + serverName + "' AND TABLE_CATALOG = '" + database + "'",
        });
        if (myReq !== _schemaReqId) return;

        const esquemas = rows.map(r => r?.name).filter(Boolean).sort((a, b) => a.localeCompare(b));
        fillSelect(sel, esquemas, { placeholder: 'Selecciona un esquema' });

        const preSchema = getQS('esquema');
        if (preSchema && esquemas.includes(preSchema)) {
          safeSetValue(sel, preSchema);
        }

        sel.disabled = esquemas.length === 0;
        if (esquemas.length) sel.dispatchEvent(new Event('change'));
      } catch (e) {
        console.error('[linaje] Error cargando esquemas:', e);
        fillSelect(sel, [], { placeholder: 'Error al cargar esquemas' });
        sel.disabled = true;
      }
    }


    // 4) Tablas del esquema ( [DB].sys.tables JOIN [DB].sys.schemas )
    async function loadTablesFor(serverName, database, schema) {
      const sel = $table();
      const myReq = ++_tableReqId;

      // destruir Select2 en fields para evitar instancias pegadas
      if (window.$ && $.fn && $.fn.select2) {
        try { $fields().select2('destroy'); } catch (e) { }
      }

      // estado inicial
      fillSelect(sel, [], { placeholder: schema ? 'Cargando Tablas…' : 'Seleccione una tabla' });
      sel.disabled = true;
      fillSelect($fields(), [], { placeholder: 'Selecciona campos' });
      $fields().disabled = true;

      if (!serverName || !database || !schema) return;

      try {
        const rows = await postQuery({
          campos: 'DISTINCT TOP 100 UPPER(TABLE_NAME) as name',
          origen: 'procesos_bi.dbo.LOG_ENTIDADES_CAMPOS_OFICIAL',
          condicion: "SERVIDOR = '" + serverName + "' AND TABLE_CATALOG = '" + database + "' AND TABLE_SCHEMA = '" + schema + "'",
        });
        if (myReq !== _tableReqId) return;

        const tablas = rows.map(r => r?.name).filter(Boolean).sort((a, b) => a.localeCompare(b));
        fillSelect(sel, tablas, { placeholder: 'Selecciona una tabla', minInputLength: TABLE_MIN_INPUT_LEN });
        enableInlineTypeahead(sel);

        // Preselección desde URL y trigger seguro
        const preTable = getQS('tabla');
        if (preTable && tablas.includes(preTable)) {
          safeSetValue(sel, preTable);
        }

        sel.disabled = tablas.length === 0;
      } catch (e) {
        console.error('[linaje] Error cargando tablas:', e);
        fillSelect(sel, [], { placeholder: 'Error al cargar tablas' });
        sel.disabled = true;
      }
    }



    async function loadFieldsFor(serverName, database, schema, table) {
      const sel = document.getElementById('fieldsInput');
      const myReq = ++_fieldsReqId;

      // destruir Select2 en este select si existe
      if (window.$ && $.fn && $.fn.select2) {
        try { $(sel).select2('destroy'); } catch (e) { }
      }

      // estado inicial: vaciar y mostrar carga
      fillSelectNative(sel, [], { preselected: [] });
      enhanceFieldsSelectAfterFill(sel);
      enableInlineTypeahead(sel);
      sel.disabled = true;

      if (!serverName || !database || !schema || !table) return;

      try {
        const rows = await postQuery({
          campos: 'DISTINCT TOP 100 upper(COLUMN_NAME) AS name',
          origen: 'procesos_bi.dbo.TMP_LOG_ENTIDADES_CAMPOS',
          condicion: `SERVIDOR = '${serverName}' AND TABLE_CATALOG = '${database}' AND TABLE_SCHEMA = '${schema}' AND TABLE_NAME = '${table}'`
        });

        if (myReq !== _fieldsReqId) return; // respuesta obsoleta

        const campos = rows.map(r => r?.name).filter(Boolean).sort((a, b) => a.localeCompare(b));

        // Preselección desde URL: ?campo=A,B,C
        const preFieldParam = getQS('campo');
        const preFields = preFieldParam ? preFieldParam.split(',').map(s => s.trim()).filter(Boolean) : [];

        // llenar select nativo multiple
        fillSelectNative(sel, campos, { preselected: preFields });

        // reinit Select2 para este select si quieres búsqueda; si prefieres nativo, comenta este bloque
        if (window.$ && $.fn && $.fn.select2) {
          $(sel).select2({
            placeholder: 'Selecciona campos',
            width: '100%',
            dropdownParent: $(sel).parent()
          });
          $(sel).on('change.select2-custom', function () {
            for (const opt of this.options) {
              if (opt.selected) opt.classList.add('selected-custom');
              else opt.classList.remove('selected-custom');
            }
          }).trigger('change');
        }

        sel.disabled = campos.length === 0;
      } catch (e) {
        console.error('[linaje] Error cargando campos:', e);
        fillSelectNative(sel, [], { preselected: [] });
        sel.disabled = true;
      }
    }

    function clearLowerThanServer() {
      // selects
      const selDb = $db();
      const selSchema = $schema();
      const selTable = $table();
      const selFields = $fields();

      // destruir Select2 si existe para evitar instancias pegadas
      if (window.$ && $.fn && $.fn.select2) {
        try { $(selDb).select2('destroy'); } catch (e) { }
        try { $(selSchema).select2('destroy'); } catch (e) { }
        try { $(selTable).select2('destroy'); } catch (e) { }
        try { $(selFields).select2('destroy'); } catch (e) { }
      }

      // limpiar opciones y estado (uso fillSelect / fillSelectNative para mantener placeholders)
      fillSelect(selDb, [], { placeholder: 'Seleccione una base' });
      selDb.disabled = true;

      fillSelect(selSchema, [], { placeholder: 'Selecciona un esquema' });
      selSchema.disabled = true;

      fillSelect(selTable, [], { placeholder: 'Selecciona una tabla' });
      selTable.disabled = true;

      fillSelectNative(selFields, [], { preselected: [] });
      enhanceFieldsSelectAfterFill(selFields);
      selFields.disabled = true;
    }



    // Aplica o quita la clase visual según option.selected
    function applyOptionClasses(selectEl) {
      for (const opt of selectEl.options) {
        if (opt.selected) opt.classList.add('selected-custom');
        else opt.classList.remove('selected-custom');
      }
    }

    // Habilita comportamiento click-to-toggle para selects multiple (no requiere Ctrl/Shift)
    function enableClickToggle(selectEl) {
      if (selectEl._linaje_clickToggleAttached) return;

      selectEl.addEventListener('mousedown', function (ev) {
        if (!selectEl.multiple) return;
        ev.preventDefault();

        // guardar scroll y foco previos
        const prevScroll = selectEl.scrollTop;
        const hadFocus = (document.activeElement === selectEl);

        const option = ev.target && ev.target.tagName === 'OPTION' ? ev.target : null;
        if (!option) return;

        // togglear selección
        option.selected = !option.selected;
        applyOptionClasses(selectEl);

        // Restaurar scroll inmediatamente (micro-timer)
        setTimeout(() => {
          try { selectEl.scrollTop = prevScroll; } catch (e) { /* no crítico */ }

          // devolver foco sin provocar scroll si el navegador soporta la opción
          try {
            if (!hadFocus) {
              // si antes no estaba enfocado, no forzamos foco
              return;
            }
            if (typeof selectEl.focus === 'function') {
              // focus con preventScroll cuando esté disponible
              selectEl.focus({ preventScroll: true });
            }
          } catch (e) {
            // browsers o versiones antiguas pueden fallar en focus({preventScroll})
            // fallback: restaurar scroll de nuevo después de hacer focus
            try { selectEl.focus(); selectEl.scrollTop = prevScroll; } catch (err) { /* no crítico */ }
          }
        }, 0);

        // notificar listeners
        selectEl.dispatchEvent(new Event('change', { bubbles: true }));
      }, { passive: false });

      // mantener clases cuando cambian por teclado u otros medios
      selectEl.addEventListener('change', function () {
        applyOptionClasses(selectEl);
      });

      selectEl._linaje_clickToggleAttached = true;
    }


    // Mejora ligera: re-aplicar clases y toggle después de repoblar
    function enhanceFieldsSelectAfterFill(selectEl) {
      selectEl.multiple = true;
      applyOptionClasses(selectEl);
      enableClickToggle(selectEl);
    }


    // detector puede ser función o mapa; si detector es función usamos detector(value)
    function enhanceFieldsSelect(selectEl, detector) {
      selectEl.multiple = true;
      const prevSel = Array.from(selectEl.selectedOptions).map(o => String(o.value));

      for (const opt of selectEl.options) {
        const type = (typeof detector === 'function') ? detector(opt.value) : (detector ? (detector[String(opt.value)] || 'otro') : 'otro');
        opt.dataset.type = type;
        opt.classList.add('type-' + type);
        opt.selected = prevSel.includes(String(opt.value));
      }

      applyOptionClasses(selectEl);
      enableClickToggle(selectEl);
    }

    function getSelectedByType(selectEl) {
      const out = {};
      for (const opt of selectEl.selectedOptions) {
        const t = opt.dataset.type || 'unknown';
        if (!out[t]) out[t] = [];
        out[t].push(opt.value);
      }
      return out;
    }



    // ================== EVENTOS (CASCADA) ==================
    function attachCascades() {
      const srvSel = $srv();
      const dbSel = $db();
      const scSel = $schema();
      const tblSel = $table();

      if (srvSel._linaje_onChange) srvSel.removeEventListener('change', srvSel._linaje_onChange);
      if (dbSel._linaje_onChange) dbSel.removeEventListener('change', dbSel._linaje_onChange);
      if (scSel._linaje_onChange) scSel.removeEventListener('change', scSel._linaje_onChange);
      if (tblSel._linaje_onChange) tblSel.removeEventListener('change', tblSel._linaje_onChange);

      function onSrvChange() {
        clearDatabase();
        loadDatabasesFor(srvSel.value);
      }
      function onDbChange() {
        clearSchema();
        loadSchemasFor(srvSel.value, dbSel.value);
      }
      function onScChange() {
        clearTable();
        loadTablesFor(srvSel.value, dbSel.value, scSel.value);
      }
      function onTblChange() {
        clearFields();
        loadFieldsFor(srvSel.value, dbSel.value, scSel.value, tblSel.value);
      }

      srvSel._linaje_onChange = onSrvChange;
      dbSel._linaje_onChange = onDbChange;
      scSel._linaje_onChange = onScChange;
      tblSel._linaje_onChange = onTblChange;

      srvSel.addEventListener('change', onSrvChange);
      dbSel.addEventListener('change', onDbChange);
      scSel.addEventListener('change', onScChange);
      tblSel.addEventListener('change', onTblChange);

      // si usas Select2, añade también namespaced events (idempotente)
      if (window.$ && $.fn && $.fn.select2) {
        $(srvSel).off('select2:select select2:unselect change').on('select2:select select2:unselect change', onSrvChange);
        $(dbSel).off('select2:select select2:unselect change').on('select2:select select2:unselect change', onDbChange);
        $(scSel).off('select2:select select2:unselect change').on('select2:select select2:unselect change', onScChange);
        $(tblSel).off('select2:select select2:unselect change').on('select2:select select2:unselect change', onTblChange);
      }
    }

    // ===================== initAllSelect2 =====================
    function initAllSelect2() {
      if (!(window.$ && $.fn && $.fn.select2)) {
        console.warn('Select2 no disponible');
        return;
      }

      $('select.form-select').each(function () {
        const $s = $(this);

        // evita doble inicialización
        if ($s.hasClass('select2-hidden-accessible')) {
          $s.select2('destroy');
        }

        // Preserve placeholder if exists
        const placeholderOpt = $s.find('option[disabled][selected]').text() || 'Selecciona…';

        // Configuración general
        $s.select2({
          placeholder: placeholderOpt,
          allowClear: true,
          width: '100%',
          minimumResultsForSearch: 5,
          matcher: function (params, data) {
            if ($.trim(params.term) === '') return data;
            if (typeof data.text === 'undefined') return null;
            return data.text.toLowerCase().indexOf(params.term.toLowerCase()) > -1 ? data : null;
          },
          dropdownParent: $s.parent()
        });

        // mantener clases para múltiples
        if (this.multiple) {
          $s.off('change.select2-custom').on('change.select2-custom', function () {
            for (const opt of this.options) {
              if (opt.selected) opt.classList.add('selected-custom');
              else opt.classList.remove('selected-custom');
            }
          }).trigger('change');
        }
      });
    }


    // ===================== Handlers =====================
    function onSrvChangeHandler(ev) {
      // limpiar niveles inferiores de forma inmediata
      clearDatabase(); // asume que clearDatabase() ya existe en tu código
      const serverName = $srv().value;
      if (!serverName) return;
      loadDatabasesFor(serverName);
    }

    function onDbChangeHandler(ev) {
      clearSchema(); // asume clearSchema() definido
      const serverName = $srv().value;
      const dbName = $db().value;
      if (!serverName || !dbName) return;
      loadSchemasFor(serverName, dbName);
    }

    function onSchemaChangeHandler(ev) {
      clearTable(); // asume clearTable() definido
      const serverName = $srv().value;
      const dbName = $db().value;
      const schemaName = $schema().value;
      if (!serverName || !dbName || !schemaName) return;
      loadTablesFor(serverName, dbName, schemaName);
    }

    function onTableChangeHandler(ev) {
      clearFields(); // asume clearFields() definido
      const serverName = $srv().value;
      const dbName = $db().value;
      const schemaName = $schema().value;
      const tableName = $table().value;
      if (!serverName || !dbName || !schemaName || !tableName) return;
      loadFieldsFor(serverName, dbName, schemaName, tableName);
    }
    // ===================== attachHandlers idempotente =====================
    


    function attachAllHandlersWithHelper() {
  attachHandlerTo($srv(), srvHandler, { name: '_linaje_onSrv' });
  attachHandlerTo($db(), dbHandler, { name: '_linaje_onDb' });
  attachHandlerTo($schema(), schemaHandler, { name: '_linaje_onSchema' });
  attachHandlerTo($table(), tableHandler, { name: '_linaje_onTable' });
}


    // ===================== Orquestación (pega en DOMContentLoaded) =====================
    document.addEventListener('DOMContentLoaded', async () => {
      // 1) Inicializar Select2 en caso de estar disponible
      initAllSelect2();
      window.reinitSelect2All = initAllSelect2;

      // 2) Atar handlers (idempotente)
        attachAllHandlersWithHelper();
      // 3) Cargar servidores inicialmente
      await loadServers();

      // 4) Post-init: procesar parámetros URL y crear nodo padre si aplica
      setTimeout(() => {
        const params = new URLSearchParams(location.search);
        if (params.get('tabla') && params.get('nombre')) {
          try { cy.remove(cy.getElementById(nodoPadreId)); } catch (e) { }
          crearNodoDesdeURL();
        }
      }, 500);
    });







    // ================== API opcional para otros scripts ==================
    window.linajeContext = {
      // Parece que este metodo es un legacy, pero lo dejo por que al momento no tengo tiempo de comprobar su funcionalidad
      getSelected() {
        return {
          servidor: $srv().value || null,
          base: $db().value || null,
          esquema: $schema().value || null,
          tabla: $table().value || null,
          campos: $fields().value || null

        };
      },

    };

    function triggerChange(selectEl) {
      if (window.$ && $.fn && $.fn.select2) {
        $(selectEl).trigger('change.select2');
      } else {
        selectEl.dispatchEvent(new Event('change'));
      }
    }

  </script>

</body>

</html>
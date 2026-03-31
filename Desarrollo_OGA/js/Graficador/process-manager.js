import mermaid from 'https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.esm.min.mjs';
window.mermaid = mermaid;
const processManagerConfig = window.processManagerConfig || {};
const HOME_URL = processManagerConfig.homeUrl || 'OGASuite.aspx';
mermaid.initialize({ 
            startOnLoad: false, 
            theme: 'base',
            securityLevel: 'loose',
            suppressErrorRendering: true,
            flowchart: { htmlLabels: true, curve: 'basis' }
        });

        // ========== CONFIGURACIÓN ==========
        const KEY_PROCESOS = 'process_manager_procesos_v1';
        let currentZoom = 1;
        window.baseDatosSPs = {};

        // ========== PROCESO DEMO (TUS 6 SPS) ==========
        const PROCESO_DEMO = {
            id: 'demo_gestion_archivos',
            nombre: 'Demo: Gestión de Archivos',
            fecha: new Date().toLocaleDateString(),
            mapa: `flowchart TB
    SP1["SP01: Inicio del Proceso"] --> SP3["SP03: Validación de Datos"] & SP4["SP04: Notificación al Cliente"]
    SP3 --> SP2["SP02: Motor de Reglas"]
    SP2 --> SP5["SP05: Registro en Base"] & SP6["SP06: Cierre del Caso"]
    SP5 --> SP4
    SP4 --> SP6

    style SP1 fill:#bbf,stroke:#333,color:#000000
    style SP3 fill:#FFD600,stroke:#333
    style SP4 fill:#2962FF,stroke:#333
    style SP2 fill:#FF6D00,stroke:#333
    style SP5 fill:#2962FF,stroke:#333
    style SP6 fill:#BBDEFB,stroke:#333`,
            
            datos: {
                "SP1": `flowchart TB
    A["Usuario selecciona archivo"] --> B["Validar formato y tamaño"]
    B -- Válido --> C["Guardar archivo temporal"]
    B -- Inválido --> D["Mostrar error"]

    style A fill:#FF6D00
    style B fill:#FFE0B2
    style C fill:#C8E6C9
    style D fill:#C8E6C9`,

                "SP2": `flowchart TB
    A["Leer archivo cargado"] --> B["Extraer datos clave"]
    B --> C["Generar proceso inicial"]
    C --> D["Notificar proceso cargado"]

    style A fill:#FFE0B2
    style B fill:#FFF9C4
    style C fill:#BBDEFB
    style D fill:#E1BEE7`,

                "SP3": `flowchart TB
    A["Recibir proceso inicial"] --> B["Verificar campos obligatorios"]
    B -- OK --> C["Proceso válido"]
    B -- Error --> D["Marcar inconsistencias"]

    style A fill:#BBDEFB
    style B fill:#C8E6C9
    style C fill:#FFE0B2
    style D fill:#FFE0B2`,

                "SP4": `flowchart TB
    A["Tomar datos validados"] --> B["Limpiar datos"]
    B --> C["Normalizar y reestructurar"]
    C --> D["Generar proceso transformado"]

    style A fill:#FFF9C4
    style B fill:#C8E6C9
    style C fill:#BBDEFB
    style D fill:#E1BEE7`,

                "SP5": `flowchart TB
    A["Proceso transformado"] --> B["Construir resultado"] & n1["Untitled Node"]
    B --> C["Crear archivo/JSON/Reporte"]
    C --> D["Resultado preparado"] & n1

    style A fill:#BBDEFB
    style B fill:#E1BEE7
    style n1 fill:#FFE0B2
    style C fill:#FFE0B2
    style D fill:#FFF9C4`,

                "SP6": `flowchart TB
    A["Resultado preparado"] --> B["Mostrar botón Descargar"] & C["Mostrar botón Ver proceso cargado"]
    B --> D["Descargar archivo"]
    C --> E["Mostrar detalles del proceso"]

    style A fill:#FFE0B2
    style B fill:#E1BEE7
    style C fill:#E1BEE7
    style D fill:#FFE0B2
    style E fill:#C8E6C9`
            }
        };

        // ========== FUNCIONES PRINCIPALES ==========
        
window.volverAOGA = function() {
    window.location.href = HOME_URL;
};

        window.cargarProcesoDemo = async function() {
            document.getElementById('tituloProcesoActual').innerText = PROCESO_DEMO.nombre;
            window.baseDatosSPs = PROCESO_DEMO.datos;
            await renderizarMapa(PROCESO_DEMO.mapa);
            document.querySelectorAll('.process-btn').forEach(btn => btn.classList.remove('active'));
            document.querySelectorAll('.process-btn')[0].classList.add('active');
        };

        window.guardarNuevoProceso = function() {
            let mapa = document.getElementById('inputMapa').value.trim();
            const jsonText = document.getElementById('inputJSON').value.trim();

            if (!mapa || !jsonText) {
                mostrarToast('Debes completar ambos campos', 'error');
                return;
            }

            // ⬇NUEVO: Limpiar comillas markdown si las pegaron
            mapa = mapa.replace(/```mermaid/g, '').replace(/```/g, '').trim();

            try {
                const datos = JSON.parse(jsonText);
                const fecha = new Date();
                const nombre = `Proceso ${fecha.toLocaleDateString()} ${fecha.toLocaleTimeString()}`;
                
                const nuevoProceso = {
                    id: 'proceso_' + Date.now(),
                    nombre: nombre,
                    fecha: fecha.toLocaleDateString(),
                    mapa: mapa,
                    datos: datos
                };

                // Guardar en localStorage
                const procesosGuardados = JSON.parse(localStorage.getItem(KEY_PROCESOS) || '[]');
                procesosGuardados.unshift(nuevoProceso);
                localStorage.setItem(KEY_PROCESOS, JSON.stringify(procesosGuardados));

                // Actualizar UI
                renderizarListaProcesos();
                mostrarToast('Proceso guardado correctamente');
                
                // Limpiar inputs
                document.getElementById('inputMapa').value = '';
                document.getElementById('inputJSON').value = '';

            } catch (error) {
                mostrarToast('Error: JSON inválido', 'error');
                console.error(error);
            }
        };

        // Variable para controlar el tiempo (Poner ESTO afuera de la función)
        let timerError = null;

        async function renderizarMapa(codigoMermaid) {
            const output = document.getElementById('mermaidOutput');
            
            // 1. Limpieza de seguridad
            output.innerHTML = ''; 
            
            // Si el usuario intenta subir otro archivo rápido, cancelamos el conteo anterior
            if (timerError) {
                clearTimeout(timerError);
                timerError = null;
            }

            try {
                // Validar sintaxis primero
                if (!await mermaid.parse(codigoMermaid)) {
                    throw new Error("Error de sintaxis Mermaid");
                }

                // Renderizar el diagrama
                const { svg } = await mermaid.render('mermaid-svg-' + Date.now(), codigoMermaid);
                output.innerHTML = svg;

                // INYECCIÓN DE CLICS (Tu código de siempre, intacto)
                if (window.baseDatosSPs) {
                    Object.keys(window.baseDatosSPs).forEach(spId => {
                        const nodo = output.querySelector(`.node[id*="${spId}"]`);
                        if (nodo) {
                            nodo.style.cursor = 'pointer';
                            nodo.onmouseover = () => nodo.style.opacity = "0.7";
                            nodo.onmouseout = () => nodo.style.opacity = "1";
                            nodo.addEventListener('click', (e) => {
                                e.stopPropagation();
                                window.abrirDetalle(spId);
                            });
                        }
                    });
                }

            } catch (error) {
                console.error("Error controlado:", error);

                // MOSTRAR EL MENSAJE BONITO (ROJO)
                output.innerHTML = `
                    <div class="empty-state" style="color: #D32F2F; animation: fadeIn 0.3s;">
                        <div style="background: #FFEBEE; padding: 20px; border-radius: 50%; width: 80px; height: 80px; display: flex; align-items: center; justify-content: center; margin-bottom: 15px;">
                            <i class="fa-solid fa-bug" style="font-size: 32px;"></i>
                        </div>
                        <h3 style="font-family: 'Montserrat', sans-serif; margin-bottom: 5px;">Archivo Inválido</h3>
                        <p style="font-size: 13px; color: #666; max-width: 300px;">
                            El texto no es un diagrama válido. Desaparecerá en 5 segundos...
                        </p>
                    </div>`;
                
                // Mostrar Toast flotante
                mostrarToast('El archivo no contiene un diagrama válido', 'error');

                // >>> AQUÍ ESTÁ LO NUEVO: EL TEMPORIZADOR DE 5 SEGUNDOS <<<
                timerError = setTimeout(() => {
                    // Volver al estado "Limpio" (Instrucciones iniciales)
                    output.innerHTML = `
                        <div class="empty-state" style="animation: fadeIn 0.5s;">
                            <i class="fa-solid fa-diagram-project"></i>
                            <span>Sube tu diagrama general y detalles para visualizar el proceso.</span>
                        </div>`;
                }, 5000); // 5000 milisegundos = 5 segundos
            }
        }

        window.abrirDetalle = async function(spId) {
            const codigo = window.baseDatosSPs[spId];
            if (!codigo) {
                mostrarToast('No hay detalle para ' + spId, 'warning');
                return;
            }

            document.getElementById('tituloSP').innerText = 'Detalle: ' + spId;
            const detalle = document.getElementById('detalleSP');
            detalle.innerHTML = '';
            currentZoomDetalle = 1;
            detalle.style.cursor = 'grab';

            try {
                const { svg } = await mermaid.render('detalle-svg-' + Date.now(), codigo);
                detalle.innerHTML = svg;
                document.getElementById('modalDetalle').classList.add('active');
                aplicarZoomDetalle();
                detalle.scrollLeft = 0;
                detalle.scrollTop = 0;
            } catch (error) {
                detalle.innerHTML = '<p style="color:red;">Error al renderizar</p>';
                console.error(error);
            }
        };

        window.cerrarModal = function() {
            document.getElementById('modalDetalle').classList.remove('active');
        };

        function renderizarListaProcesos() {
            const lista = document.getElementById('listaProcesosGuardados');
            const procesos = JSON.parse(localStorage.getItem(KEY_PROCESOS) || '[]');
            
            if (procesos.length === 0) {
                lista.innerHTML = '<p style="font-size:12px;color:#999;margin-top:10px;">No hay procesos guardados</p>';
                return;
            }

            lista.innerHTML = procesos.map((p, idx) => `
    <div style="display:flex;align-items:center;gap:6px;margin-bottom:10px;">
        <button class="process-btn" onclick="cargarProcesoGuardado(${idx})">
            <i class="fa-solid fa-file-circle-check"></i>
            <div style="flex:1; text-align:left;">
                <div style="font-weight:600; font-size:13px;">${p.nombre}</div>
                <div style="font-size:11px; color:#999;">${p.fecha}</div>
            </div>
        </button>
        <button class="control-btn" title="Borrar proceso" onclick="borrarProcesoGuardado(${idx})" style="background:#fff0f0;color:#d10074;border-color:#ffd0d0;">
            <i class="fa-solid fa-trash"></i>
        </button>
    </div>
`).join('');
        }

        window.cargarProcesoGuardado = async function(index) {
            const procesos = JSON.parse(localStorage.getItem(KEY_PROCESOS) || '[]');
            const proceso = procesos[index];
            
            if (proceso) {
                document.getElementById('tituloProcesoActual').innerText = proceso.nombre;
                window.baseDatosSPs = proceso.datos;
                
                let mapaLimpio = proceso.mapa.replace(/```mermaid/g, '').replace(/```/g, '').trim();
                
                await renderizarMapa(mapaLimpio);
                
                document.querySelectorAll('.process-btn').forEach(btn => btn.classList.remove('active'));
                document.querySelectorAll('.process-btn')[index + 1].classList.add('active');
            }
        };

        function mostrarToast(mensaje, tipo = 'success') {
            const toast = document.getElementById('toast');
            const icon = toast.querySelector('i');
            icon.className = tipo === 'error' ? 'fa-solid fa-circle-xmark' : 
                            tipo === 'warning' ? 'fa-solid fa-triangle-exclamation' : 
                            'fa-solid fa-check-circle';
            
            document.getElementById('toastMessage').innerText = mensaje;
            toast.classList.add('active');
            toast.onclick = () => toast.classList.remove('active');
            
            setTimeout(() => {
                toast.classList.remove('active');
                toast.onclick = null;
            }, 3000);
        }

        // ========== MANEJO DE ARCHIVOS ==========
        document.getElementById('fileMapa').addEventListener('change', async (e) => {
            const file = e.target.files[0];
            if (file) {
                let text = await file.text();
                text = text.replace(/```mermaid/g, '').replace(/```/g, '').trim();
                document.getElementById('inputMapa').value = text;
                mostrarToast('Mapa cargado desde archivo');
            }
        });

        document.getElementById('fileJSON').addEventListener('change', async (e) => {
            const file = e.target.files[0];
            if (file) {
                const text = await file.text();
                document.getElementById('inputJSON').value = text;
                mostrarToast('JSON cargado desde archivo');
            }
        });

        // ========== ZOOM ==========
        window.zoomIn = function() {
            currentZoom = Math.min(currentZoom + 0.2, 3);
            aplicarZoom();
        };

        window.zoomOut = function() {
            currentZoom = Math.max(currentZoom - 0.2, 0.5);
            aplicarZoom();
        };

        window.resetZoom = function() {
            currentZoom = 1;
            aplicarZoom();
        };

        function aplicarZoom() {
            const svg = document.querySelector('#mermaidOutput svg');
            if (svg) {
                svg.style.transform = `scale(${currentZoom})`;
                svg.style.transformOrigin = 'center center';
            }
        }

        // ========== INICIALIZACIÓN ========== 
        document.addEventListener('DOMContentLoaded', () => {
            renderizarListaProcesos();
            document.getElementById('tituloProcesoActual').innerText = 'Sin proceso cargado';
            document.getElementById('mermaidOutput').innerHTML = `
                <div class="empty-state">
                    <i class="fa-solid fa-diagram-project"></i>
                    <span>Sube tu diagrama general y detalles para visualizar el proceso.</span>
                </div>`;
        });

        // Cerrar modal con ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') cerrarModal();
        });

        // Cerrar modal al hacer click fuera
        document.getElementById('modalDetalle').addEventListener('click', (e) => {
            if (e.target.id === 'modalDetalle') cerrarModal();
        });

        let currentZoomDetalle = 1;
        let isDraggingDetalle = false;
        let dragStartX = 0, dragStartY = 0;
        let scrollStartX = 0, scrollStartY = 0;

        window.zoomInDetalle = function() {
            currentZoomDetalle += 0.2;
            aplicarZoomDetalle();
        };
        window.zoomOutDetalle = function() {
            currentZoomDetalle -= 0.2;
            aplicarZoomDetalle();
        };
        window.resetZoomDetalle = function() {
            currentZoomDetalle = 1;
            aplicarZoomDetalle();
        };
        function aplicarZoomDetalle() {
            const svg = document.querySelector('#detalleSP svg');
            if (svg) {
                svg.style.transform = `scale(${currentZoomDetalle})`;
                svg.style.transformOrigin = 'center center';
            }
        }
        
        // Manito para arrastrar el diagrama SIEMPRE ACTIVA
        const detalleSP = document.getElementById('detalleSP');
        detalleSP.style.cursor = 'grab';
        detalleSP.addEventListener('mousedown', function(e) {
            isDraggingDetalle = true;
            dragStartX = e.clientX;
            dragStartY = e.clientY;
            scrollStartX = detalleSP.scrollLeft;
            scrollStartY = detalleSP.scrollTop;
            detalleSP.style.cursor = 'grabbing';
        });
        detalleSP.addEventListener('mousemove', function(e) {
            if (isDraggingDetalle) {
                const dx = e.clientX - dragStartX;
                const dy = e.clientY - dragStartY;
                detalleSP.scrollLeft = scrollStartX - dx;
                detalleSP.scrollTop = scrollStartY - dy;
            }
        });
        detalleSP.addEventListener('mouseup', function(e) {
            isDraggingDetalle = false;
            detalleSP.style.cursor = 'grab';
        });
        detalleSP.addEventListener('mouseleave', function(e) {
            isDraggingDetalle = false;
            detalleSP.style.cursor = 'grab';
        });
        document.getElementById('btnManitoDetalle').style.display = 'none';

        // LÓGICA DE BORRADO DE PROCESOS (CORREGIDA PARA EL NUEVO MODAL)
        window.borrarProcesoGuardado = function(index) {
            const procesos = JSON.parse(localStorage.getItem(KEY_PROCESOS) || '[]');
            if (procesos.length > index) {
                const nombre = procesos[index].nombre;
                const fecha = procesos[index].fecha || '';
                
                document.getElementById('deleteProcessName').innerText = nombre;
                document.getElementById('deleteProcessFecha').innerText = fecha;
                
                document.getElementById('modalConfirmDelete').classList.add('active');
                
                // Configurar botón confirmar
                document.getElementById('btnConfirmDelete').onclick = function() {
                    procesos.splice(index, 1);
                    localStorage.setItem(KEY_PROCESOS, JSON.stringify(procesos));
                    renderizarListaProcesos();
                    mostrarToast('Proceso borrado');
                    
                    document.getElementById('modalConfirmDelete').classList.remove('active');
                    
                    // Resetear vista
                    document.getElementById('tituloProcesoActual').innerText = 'Sin proceso cargado';
                    document.getElementById('mermaidOutput').innerHTML = `
                        <div class='empty-state'>
                            <i class='fa-solid fa-diagram-project'></i>
                            <span>Sube tu diagrama general y detalles para visualizar el proceso.</span>
                        </div>`;
                };

                // Configurar botón cancelar
                document.getElementById('btnCancelDelete').onclick = function() {
                    document.getElementById('modalConfirmDelete').classList.remove('active');
                };
            }
        };

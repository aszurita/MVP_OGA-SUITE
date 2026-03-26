/**
 * CONTROLADOR PRINCIPAL (script.js)
 * ---------------------------------
 * Responsabilidades:
 * 1. Base de Datos de Diagramas (diagramasDB).
 * 2. Navegación entre Vistas (Explorador <-> Studio).
 * 3. Lógica del Chatbot (Cerrar, Restaurar, Responder).
 * 4. Coordinación con el motor visual (mermaidEditor).
 */

// ==========================================
// 1. BASE DE DATOS DE DIAGRAMAS
// ==========================================
const graficadorConfig = window.graficadorConfig || {};
const graficadorPaths = {
    pagesBase: (graficadorConfig.pagesBase || 'Prototipo/pages').replace(/\/+$/, ''),
    processManager: graficadorConfig.processManager || 'Graficador.aspx'
};

const buildGraficadorPage = (pageName) => {
    if (!pageName) return '';
    return `${graficadorPaths.pagesBase}/${pageName.replace(/^\/+/, '')}`;
};

const diagramasDB = {
    "mapa_general": `graph TD
    A[Inicio Solicitud] --> B[1. SP_Credit_Engine]
    B --> C{¿Pre-Aprobado?}
    C -->|Si| D[2. SP_Buro_Check]
    C -->|No| E[Rechazo Automático]
    D --> F[3. SP_Calc_Limit]
    F --> G[Oferta Final]
   
    %% Estilos Banco
    style B fill:#d10074,color:white,stroke:#333,stroke-width:2px
    style D fill:#d10074,color:white,stroke:#333,stroke-width:2px
    style F fill:#d10074,color:white,stroke:#333,stroke-width:2px
   
    %% Interacción Drill-Down (Click en nodos)
    click B call cargarFlujo("motor_credito")
    click D call cargarFlujo("validacion_buro")
    click F call cargarFlujo("calculo_cupo")
`,
    "motor_credito": `graph LR
    subgraph SP_Credit_Engine
    I(Input Data) --> V[Validar Parametros]
    V --> R[Reglas de Negocio]
    R --> O(Output Score)
    end
    style I fill:#f9f
    style O fill:#bfb
`,
    "validacion_buro": `graph TD
    A[Consulta Experian] --> B{¿Tiene Mora?}
    B -->|Si| C[Flag Rechazo]
    B -->|No| D[Flag Aprobado]
    style A fill:#bbf
    style C fill:#fbb
`,
    "calculo_cupo": `graph TD
    Ingresos --> Calculo
    Gastos --> Calculo
    Calculo --> LimiteFinal
    style LimiteFinal fill:#bfb,stroke:#333,stroke-width:4px
`,
    "nuevo_flujo": `graph TD
    %% Lienzo limpio para dibujar
    Inicio --> Proceso
`,
    
    // 🆕 NUEVO DIAGRAMA COMPLETO DEL SP_CREDIT_ENGINE
"sp_credit_engine_completo": `flowchart TD
    Start([Inicio Solicitud]) --> Input[Recepción de Datos]
    
    %% BLOQUE 1: VALIDACION DE ENTRADA
    Input --> ValidarParams{Validar<br/>Parámetros}
    ValidarParams -->|Datos Inválidos| Error1[Error:<br/>Parámetros Faltantes]
    ValidarParams -->|OK| ConsultaCliente
    Error1 --> End1([Fin - Error])
    
    %% BLOQUE 2: CONSULTA DE DATOS
    ConsultaCliente[Consultar Cliente<br/>Tabla: Clientes] --> VerifExiste{¿Cliente<br/>Existe?}
    VerifExiste -->|No| Error2[Cliente No Encontrado]
    VerifExiste -->|Sí| ConsultaHistorial
    Error2 --> End1
    
    ConsultaHistorial[Consultar Historial<br/>Tabla: HistorialCredito] --> ValidarScore
    
    %% BLOQUE 3: VALIDACION DE SCORE
    ValidarScore{Score Buró<br/>¿Mayor o igual a 600?}
    ValidarScore -->|Score bajo| Rechazo1[Rechazo Automático<br/>Motivo: Score Bajo]
    ValidarScore -->|Score OK| CalcRatio
    Rechazo1 --> LogRechazo[Log: Rechazo]
    LogRechazo --> End2([Fin - Rechazado])
    
    %% BLOQUE 4: CALCULO DE RATIOS
    CalcRatio[Calcular Ratio<br/>Ingresos/Gastos] --> ValidarRatio{Gastos menor o igual 70%<br/>Ingresos?}
    ValidarRatio -->|Ratio Alto| Rechazo2[Rechazo<br/>Motivo: Capacidad Pago Baja]
    ValidarRatio -->|Ratio OK| VerifMora
    Rechazo2 --> LogRechazo
    
    %% BLOQUE 5: VERIFICACION DE MORA
    VerifMora{¿Tiene<br/>Mora Activa?}
    VerifMora -->|Sí tiene mora| Rechazo3[Rechazo<br/>Motivo: Mora Activa]
    VerifMora -->|Sin mora| AplicarReglas
    Rechazo3 --> LogRechazo
    
    %% BLOQUE 6: APLICACION DE REGLAS DE NEGOCIO
    AplicarReglas[Aplicar Reglas Negocio<br/>Tabla: ReglasNegocio] --> CalcScore[Calcular Score Final<br/>Algoritmo Ponderado]
    
    CalcScore --> DeterminarMonto[Determinar Monto Máximo<br/>Fórmula: Ing-Gtos * 0.3 * 12]
    
    %% BLOQUE 7: DECISION FINAL
    DeterminarMonto --> DecisionFinal{Score Final<br/>¿Mayor o igual a 700?}
    DecisionFinal -->|Menor a 700| Rechazo4[Rechazo<br/>Score Insuficiente]
    DecisionFinal -->|Mayor o igual a 700| Aprobado[APROBADO]
    Rechazo4 --> LogRechazo
    
    %% BLOQUE 8: REGISTRO Y RETORNO
    Aprobado --> LogAprobado[Log: Aprobación<br/>Tabla: LogTransacciones]
    LogAprobado --> Return([Retornar Resultado<br/>@Aprobado = 1<br/>@MontoMaximo = Calculado])
    
    style Start fill:#d10074,stroke:#8b0050,stroke-width:3px,color:#fff
    style Return fill:#00b894,stroke:#00856f,stroke-width:3px,color:#fff
    style End1 fill:#636e72,stroke:#2d3436,stroke-width:2px,color:#fff
    style End2 fill:#ff7675,stroke:#d63031,stroke-width:2px,color:#fff
    
    style Input fill:#74b9ff,stroke:#0984e3,stroke-width:2px,color:#fff
    style ConsultaCliente fill:#a29bfe,stroke:#6c5ce7,stroke-width:2px,color:#fff
    style ConsultaHistorial fill:#a29bfe,stroke:#6c5ce7,stroke-width:2px,color:#fff
    style CalcRatio fill:#fdcb6e,stroke:#e17055,stroke-width:2px,color:#333
    style AplicarReglas fill:#55efc4,stroke:#00b894,stroke-width:2px,color:#333
    style CalcScore fill:#ffeaa7,stroke:#fdcb6e,stroke-width:2px,color:#333
    style DeterminarMonto fill:#ffeaa7,stroke:#fdcb6e,stroke-width:2px,color:#333
    
    style ValidarParams fill:#74b9ff,stroke:#0984e3,stroke-width:2px,color:#fff
    style VerifExiste fill:#74b9ff,stroke:#0984e3,stroke-width:2px,color:#fff
    style ValidarScore fill:#fdcb6e,stroke:#e17055,stroke-width:2px,color:#333
    style ValidarRatio fill:#fdcb6e,stroke:#e17055,stroke-width:2px,color:#333
    style VerifMora fill:#fdcb6e,stroke:#e17055,stroke-width:2px,color:#333
    style DecisionFinal fill:#00b894,stroke:#00856f,stroke-width:3px,color:#fff
    
    style Aprobado fill:#00b894,stroke:#00856f,stroke-width:3px,color:#fff,font-size:16px
    style LogAprobado fill:#55efc4,stroke:#00b894,stroke-width:2px,color:#333
    
    style Rechazo1 fill:#ff7675,stroke:#d63031,stroke-width:2px,color:#fff
    style Rechazo2 fill:#ff7675,stroke:#d63031,stroke-width:2px,color:#fff
    style Rechazo3 fill:#ff7675,stroke:#d63031,stroke-width:2px,color:#fff
    style Rechazo4 fill:#ff7675,stroke:#d63031,stroke-width:2px,color:#fff
    style LogRechazo fill:#fab1a0,stroke:#e17055,stroke-width:2px,color:#333
    
    style Error1 fill:#636e72,stroke:#2d3436,stroke-width:2px,color:#fff
    style Error2 fill:#636e72,stroke:#2d3436,stroke-width:2px,color:#fff
`
};


document.addEventListener('DOMContentLoaded', () => {
   
    // --- Referencias al DOM ---
    const btnIdea = document.getElementById('btnVerProcesos');
    const selectorContainer = document.getElementById('selectorContainer');
    const btnIrAlFlujo = document.getElementById('btnIrAlFlujo');
    const processSelect = document.getElementById('processSelect');
   
    const vistaExplorador = document.getElementById('vistaExplorador');
    const vistaStudio = document.getElementById('vistaStudio');
    const vistaExcalidraw = document.getElementById('vistaExcalidraw');
    const btnVolver = document.getElementById('btnVolver');
    const btnVolverExcalidraw = document.getElementById('btnVolverExcalidraw');
    const tituloFlujo = document.getElementById('tituloFlujoActual');

    // 🆕 Referencias a los botones nuevos
    const btnDocumentacion = document.getElementById('btnDocumentacion');
    const btnDashboard = document.getElementById('btnDashboard');
    const btnExcel = document.getElementById('btnExcel'); 

    const requiredElements = [
        btnIdea,
        selectorContainer,
        btnIrAlFlujo,
        processSelect,
        vistaExplorador,
        vistaStudio,
        vistaExcalidraw,
        btnVolver,
        btnVolverExcalidraw,
        tituloFlujo
    ];

    if (requiredElements.some((el) => !el)) {
        console.warn('OGA Suite: vista de graficador no disponible en esta página.');
        return;
    }
    // ==========================================
    // 2. NAVEGACIÓN Y MENÚ
    // ==========================================
   
    // Mostrar/Ocultar Menú Flotante del Header
    btnIdea.addEventListener('click', (e) => {
        e.stopPropagation();
        selectorContainer.classList.toggle('hidden');
    });

    // Cerrar menú al hacer clic fuera
    document.addEventListener('click', (e) => {
        if (!selectorContainer.contains(e.target) && e.target !== btnIdea) {
            selectorContainer.classList.add('hidden');
        }
    });

    // Acción: Ir al Studio desde el Select
    btnIrAlFlujo.addEventListener('click', () => {
        const sel = processSelect.value;
       
        // Validación básica
        if (sel === "Abrir menú...") {
            processSelect.style.borderColor = "red";
            setTimeout(() => processSelect.style.borderColor = "#ccc", 2000);
            return;
        }

        // Detectar si es Excalidraw
        if (sel === "excalidraw") {
            navegarAExcalidraw();
            selectorContainer.classList.add('hidden');
            return;
        }

          // ⬇️ AGREGAR ESTE BLOQUE (3 LÍNEAS)
        if (sel === "process_manager") {
        window.location.href = graficadorPaths.processManager;
        return;
        }

        // Validar que exista en la base de datos
        if (!diagramasDB[sel]) {
            processSelect.style.borderColor = "red";
            setTimeout(() => processSelect.style.borderColor = "#ccc", 2000);
            return;
        }
       
        // Navegar a Mermaid Studio
        navegarAlStudio(sel);
        selectorContainer.classList.add('hidden');
    });

    // Acción: Volver al Explorador desde Mermaid
    btnVolver.addEventListener('click', () => {
        vistaStudio.classList.add('hidden');
        vistaExplorador.classList.remove('hidden');
    });

    // Acción: Volver al Explorador desde Excalidraw
    btnVolverExcalidraw.addEventListener('click', () => {
        vistaExcalidraw.classList.add('hidden');
        vistaExplorador.classList.remove('hidden');
    });

    // --- FUNCIÓN: NAVEGAR A MERMAID STUDIO ---
    function navegarAlStudio(idFlujo) {
        // 1. Cambiar pantallas
        vistaExplorador.classList.add('hidden');
        vistaStudio.classList.remove('hidden');
        vistaExcalidraw.classList.add('hidden');
       
        // 2. Actualizar Título
        tituloFlujo.innerText = "Modo Diseño: " + idFlujo.toUpperCase().replace(/_/g, ' ');
       
        // 3. Cargar datos en el Editor
        if (window.mermaidEditor) {
            window.mermaidEditor.cargarCodigo(diagramasDB[idFlujo]);
        } else {
            console.error("El motor mermaidEditor no está cargado.");
        }

        // 🆕 4. Mostrar/Ocultar botones según el diagrama
        if (idFlujo === 'sp_credit_engine_completo') {
            // Mostrar botones para el diagrama completo
            if (btnDocumentacion) btnDocumentacion.style.display = 'flex';
            if (btnDashboard) btnDashboard.style.display = 'flex';
            if (btnExcel) btnExcel.style.display = 'flex'; 
        } else {
            // Ocultar botones para otros diagramas
            if (btnDocumentacion) btnDocumentacion.style.display = 'none';
            if (btnDashboard) btnDashboard.style.display = 'none';
            if (btnExcel) btnExcel.style.display = 'none';
        }
    }

    // --- FUNCIÓN: NAVEGAR A EXCALIDRAW ---
    function navegarAExcalidraw() {
        vistaExplorador.classList.add('hidden');
        vistaStudio.classList.add('hidden');
        vistaExcalidraw.classList.remove('hidden');

        // Inicializar Excalidraw si no está iniciado
        if (window.ExcalidrawManager && !window.ExcalidrawManager.isInitialized) {
            window.ExcalidrawManager.init();
        }
    }

    // 🆕 --- EVENTOS DE LOS BOTONES NUEVOS ---
    if (btnDocumentacion) {
        btnDocumentacion.addEventListener('click', () => {
            window.open(buildGraficadorPage('documentacion.html'), '_blank');
        });
    }

    if (btnDashboard) {
        btnDashboard.addEventListener('click', () => {
            window.open(buildGraficadorPage('dashboard.html'), '_blank');
        });
    }

    if (btnExcel) {
        btnExcel.addEventListener('click', () => {
        window.open(buildGraficadorPage('excel-viewer.html'), '_blank');
        });
    }


    // Exportar función global para que los clics del gráfico funcionen (Drill-down)
    window.cargarFlujo = function(idFlujo) {
        if(diagramasDB[idFlujo]) {
            navegarAlStudio(idFlujo);
        } else {
            alert("No hay detalle disponible para este nodo.");
        }
    };


    // ==========================================
    // 3. CHATBOT INTERACTIVO (EVENTOS)
    // ==========================================
    const chatbotBtn = document.getElementById('chatbotBtn');
    const chatWindow = document.getElementById('chatWindow');
    const notificationDot = document.querySelector('.notification-dot');

    chatbotBtn.addEventListener('click', (e) => {
        // IMPORTANTE: Si el clic fue en la X (que está dentro del botón), no hacemos nada aquí.
        // La función toggleChatBubble se encargará de cerrarlo.
        if (e.target.classList.contains('close-bubble-btn')) return;

        const isHidden = chatWindow.style.display === 'none' || chatWindow.style.display === '';
        if (isHidden) {
            chatWindow.style.display = 'flex';
            if(notificationDot) notificationDot.style.display = 'none';
        } else {
            chatWindow.style.display = 'none';
        }
    });
});

// ==========================================
// 4. FUNCIONES GLOBALES (Lógica de Negocio)
// ==========================================

// A. CERRAR ROBOT (Muestra botón de rescate)
window.toggleChatBubble = function(event) {
    event.stopPropagation(); // Evita que el clic se propague y abra el chat
    const container = document.getElementById('chatbotContainer');
    const restoreBtn = document.getElementById('restoreChatBtn');

    // 1. Ocultar Robot con animación
    container.style.opacity = '0';
    setTimeout(() => {
        container.style.display = 'none';
        // 2. Mostrar botón de rescate
        restoreBtn.classList.remove('hidden');
    }, 300);
};

// B. RESTAURAR ROBOT (Revivir)
window.restoreChat = function() {
    const container = document.getElementById('chatbotContainer');
    const restoreBtn = document.getElementById('restoreChatBtn');

    // 1. Ocultar botón de rescate
    restoreBtn.classList.add('hidden');

    // 2. Mostrar Robot
    container.style.display = 'block';
    // Pequeño delay para permitir que el display:block se aplique antes de la opacidad (para la transición)
    setTimeout(() => {
        container.style.opacity = '1';
    }, 10);
};

// C. CHAT INTERNO
window.toggleChat = function() { document.getElementById('chatWindow').style.display = 'none'; };
window.handleEnter = function(e) { if(e.key === 'Enter') sendMessage(); };

window.sendMessage = function() {
    const input = document.getElementById('userInput');
    const text = input.value.trim();
    if(text) {
        addMsg(text, 'user');
        input.value = '';
        setTimeout(() => botReply(text), 1000);
    }
};

window.sendQuickMsg = function(text) {
    addMsg(text, 'user');
    setTimeout(() => botReply(text), 1000);
};

function addMsg(text, type) {
    const div = document.createElement('div');
    div.className = `message ${type === 'user' ? 'user-message' : 'bot-message'}`;
    div.innerText = text;
    const body = document.getElementById('chatBody');
    body.append(div);
    body.scrollTop = body.scrollHeight;
}

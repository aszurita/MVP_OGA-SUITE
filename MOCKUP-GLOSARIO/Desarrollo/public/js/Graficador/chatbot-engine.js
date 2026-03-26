SP_Credit_Engine = {
    // BÁSICO
    nombre: "Motor de Crédito",
    codigo: "SP_Credit_Engine",
    version: "2.1",
    autor: "Equipo de Arquitectura",
    fecha_creacion: "2024-01-15",
    
    // DESCRIPCIÓN
    descripcion: "Stored Procedure que valida parámetros de entrada del cliente y aplica reglas de negocio para determinar aprobación de crédito",
    proposito: "Automatizar decisiones crediticias basadas en score y parámetros financieros",
    
    // PARÁMETROS DE ENTRADA
    parametros_entrada: [
        { nombre: "@ClienteID", tipo: "INT", descripcion: "Identificador único del cliente" },
        { nombre: "@Ingresos", tipo: "DECIMAL(18,2)", descripcion: "Ingresos mensuales del cliente" },
        { nombre: "@Gastos", tipo: "DECIMAL(18,2)", descripcion: "Gastos mensuales del cliente" },
        { nombre: "@ScoreBuro", tipo: "INT", descripcion: "Score crediticio (300-850)" },
        { nombre: "@TipoProducto", tipo: "VARCHAR(50)", descripcion: "Tipo de crédito solicitado" }
    ],
    
    // PARÁMETROS DE SALIDA
    parametros_salida: [
        { nombre: "@Aprobado", tipo: "BIT", descripcion: "1 = Aprobado, 0 = Rechazado" },
        { nombre: "@ScoreFinal", tipo: "INT", descripcion: "Score calculado internamente" },
        { nombre: "@MontoMaximo", tipo: "DECIMAL(18,2)", descripcion: "Monto máximo aprobado" },
        { nombre: "@ErrorMessage", tipo: "VARCHAR(500)", descripcion: "Mensaje de error si aplica" }
    ],
    
    // TABLAS QUE USA
    tablas_fijas: [
        { nombre: "Clientes", operacion: "SELECT" },
        { nombre: "HistorialCredito", operacion: "SELECT" },
        { nombre: "ReglasNegocio", operacion: "SELECT" },
        { nombre: "LogTransacciones", operacion: "INSERT" }
    ],
    
    tablas_temporales: [
        { nombre: "#ClienteValidado", descripcion: "Almacena datos validados del cliente" },
        { nombre: "#CalculoScore", descripcion: "Cálculos intermedios de scoring" }
    ],
    
    // PROCESO PASO A PASO
    proceso: [
        "1. Validar que todos los parámetros de entrada sean válidos",
        "2. Consultar historial crediticio del cliente en tabla HistorialCredito",
        "3. Verificar que ScoreBuro esté en rango válido (300-850)",
        "4. Calcular ratio Ingresos/Gastos",
        "5. Aplicar reglas de negocio desde tabla ReglasNegocio",
        "6. Calcular score final ponderado",
        "7. Determinar monto máximo según políticas",
        "8. Registrar transacción en LogTransacciones",
        "9. Retornar resultado"
    ],
    
    // REGLAS DE NEGOCIO
    reglas_negocio: [
        "Si ScoreBuro < 600 → Rechazo automático",
        "Si Gastos > 70% Ingresos → Rechazo",
        "Si cliente tiene mora activa → Rechazo",
        "MontoMaximo = (Ingresos - Gastos) * 0.3 * 12"
    ],
    
    // TIEMPOS
    tiempo_ejecucion: "~200ms promedio",
    
    // DEPENDENCIAS
    dependencias: [
        "SP_ValidarCliente",
        "SP_ConsultarBuro"
    ],
    
    // EJEMPLOS DE USO
    ejemplo_llamada: `EXEC SP_Credit_Engine 
    @ClienteID = 12345,
    @Ingresos = 5000.00,
    @Gastos = 2000.00,
    @ScoreBuro = 720,
    @TipoProducto = 'Personal',
    @Aprobado = @resultado OUTPUT`,
    
    // FAQ
    preguntas_frecuentes: [
        {
            pregunta: "¿Qué pasa si el ScoreBuro es NULL?",
            respuesta: "El SP retorna error: 'ScoreBuro es obligatorio'"
        },
        {
            pregunta: "¿Se puede ejecutar en paralelo?",
            respuesta: "Sí, está optimizado para concurrencia con NOLOCK"
        }
    ]
}


// ========================================================
// MOTOR DE RESPUESTAS DEL CHATBOT
// ========================================================

const ChatbotEngine = {
    
    // Detectar intención del usuario
    detectIntent: function(message) {
        const msg = message.toLowerCase().trim();
        
        // SALUDOS
        if (/\b(hola|hi|buenos dias|buenas tardes|buenas noches|saludos)\b/i.test(msg)) {
            return { type: 'greeting' };
        }
        
        // DESPEDIDAS
        if (/\b(adios|chao|bye|hasta luego|gracias)\b/i.test(msg)) {
            return { type: 'goodbye' };
        }
        
        // INFORMACIÓN GENERAL (MÁS FLEXIBLE)
        if (/que es|explicame|cuentame|informacion|descripcion|general|motor|credito/i.test(msg)) {
            return { type: 'info_general' };
        }
        
        // PARÁMETROS (MÁS FLEXIBLE - CON TILDES)
        if (/param[eé]tro|entrada|salida|recibe|devuelve|mu[eé]stra/i.test(msg)) {
            return { type: 'parametros' };
        }
        
        // TABLAS
        if (/tabla|temporal|fija|usa|consulta/i.test(msg)) {
            return { type: 'tablas' };
        }
        
        // PROCESO
        if (/proceso|paso|como funciona|flujo|secuencia|explicame el proceso/i.test(msg)) {
            return { type: 'proceso' };
        }
        
        // REGLAS DE NEGOCIO
        if (/regla|negocio|rechaza|aprueba|condicion|mostrar regla/i.test(msg)) {
            return { type: 'reglas' };
        }
        
        // EJEMPLO
        if (/ejemplo|como ejecuto|como uso|llamada|dame un ejemplo/i.test(msg)) {
            return { type: 'ejemplo' };
        }
        
        // TIEMPOS
        if (/tiempo|tarda|velocidad|rendimiento|performance|cuanto/i.test(msg)) {
            return { type: 'tiempos' };
        }
        
        // EDITAR NODOS
        if (/como edito|editar|nodo|click|seleccionar/i.test(msg)) {
            return { type: 'help_edit_node' };
        }
        
        // CONECTAR NODOS
        if (/conectar|flecha|enlazar|unir/i.test(msg)) {
            return { type: 'help_connect' };
        }
        
        // DESHACER
        if (/deshacer|undo|volver|revertir/i.test(msg)) {
            return { type: 'help_undo' };
        }
        
        // AYUDA STUDIO
        if (/ayuda|help|studio|editor|como usar/i.test(msg)) {
            return { type: 'help_studio' };
        }
        
        return { type: 'unknown' };
    },
    
    // Generar respuesta según intención
    generateResponse: function(intent) {
        const sp = SP_Credit_Engine;
        
        switch(intent.type) {
            case 'greeting':
                return `Hola. Soy el asistente de OGA Suite. Puedo ayudarte con información sobre el ${sp.nombre}. ¿Qué te gustaría saber?`;
            
            case 'goodbye':
                return 'Hasta luego. Si necesitas más ayuda, aquí estaré.';
            
            case 'info_general':
                return `**${sp.nombre}** (${sp.codigo})\n\n${sp.descripcion}\n\n**Propósito:** ${sp.proposito}\n**Versión:** ${sp.version}\n**Autor:** ${sp.autor}`;
            
            case 'parametros':
                let respParams = `**Parámetros del SP:**\n\n**ENTRADA:**\n`;
                sp.parametros_entrada.forEach(p => {
                    respParams += `• ${p.nombre} (${p.tipo}): ${p.descripcion}\n`;
                });
                respParams += `\n**SALIDA:**\n`;
                sp.parametros_salida.forEach(p => {
                    respParams += `• ${p.nombre} (${p.tipo}): ${p.descripcion}\n`;
                });
                return respParams;
            
            case 'tablas':
                let respTablas = `**Tablas que usa el SP:**\n\n`;
                respTablas += `**TABLAS FIJAS (${sp.tablas_fijas.length}):**\n`;
                sp.tablas_fijas.forEach(t => {
                    respTablas += `• ${t.nombre} - ${t.operacion}\n`;
                });
                respTablas += `\n**TABLAS TEMPORALES (${sp.tablas_temporales.length}):**\n`;
                sp.tablas_temporales.forEach(t => {
                    respTablas += `• ${t.nombre}: ${t.descripcion}\n`;
                });
                return respTablas;
            
            case 'proceso':
                let respProceso = `**Proceso paso a paso:**\n\n`;
                sp.proceso.forEach(paso => {
                    respProceso += `${paso}\n`;
                });
                respProceso += `\n**Tiempo de ejecución:** ${sp.tiempo_ejecucion}`;
                return respProceso;
            
            case 'reglas':
                let respReglas = `**Reglas de Negocio:**\n\n`;
                sp.reglas_negocio.forEach(regla => {
                    respReglas += `• ${regla}\n`;
                });
                return respReglas;
            
            case 'ejemplo':
                return `**Ejemplo de uso:**\n\n\`\`\`sql\n${sp.ejemplo_llamada}\n\`\`\``;
            
            case 'tiempos':
                return `El ${sp.codigo} tiene un tiempo de ejecución promedio de **${sp.tiempo_ejecucion}**.`;
            
            case 'help_edit_node':
                return '**Para editar un nodo:**\n1. Haz clic en cualquier nodo del diagrama\n2. Aparecerá un menú flotante\n3. Presiona el icono del lápiz ✏️\n4. Escribe el nuevo texto\n5. ¡Listo!';
            
            case 'help_connect':
                return '**Para conectar nodos:**\n1. Haz clic en el primer nodo\n2. Presiona el icono de flecha →\n3. Haz clic en el nodo destino\n4. ¡Se creará la conexión!';
            
            case 'help_undo':
                return '**Para deshacer cambios:**\n• Presiona Ctrl+Z (o Cmd+Z en Mac)\n• O usa el botón ⟲ en la barra superior\n• Para rehacer: Ctrl+Y';
            
            case 'help_studio':
                return `**Ayuda del Studio:**\n\n• Usa el editor de la izquierda para escribir código Mermaid\n• Haz clic en un nodo para ver opciones\n• Usa los botones de zoom para ajustar la vista\n• Activa el modo MANO para arrastrar el canvas\n• El historial (Ctrl+Z) te permite deshacer cambios`;
            
            default:
                return `No entendí tu pregunta. Prueba preguntar sobre:\n• Información general del SP\n• Parámetros\n• Tablas\n• Proceso\n• Reglas de negocio\n• Ejemplo de uso`;
        }
    }
};

// ========================================================
// 🔧 FUNCIÓN PRINCIPAL: botReply (CONECTA TODO)
// ========================================================
window.botReply = function(userMessage) {
    const intent = ChatbotEngine.detectIntent(userMessage);
    const response = ChatbotEngine.generateResponse(intent);
    
    // Agregar mensaje del bot al chat
    const chatBody = document.getElementById('chatBody');
    const botMsg = document.createElement('div');
    botMsg.className = 'message bot-message';
    botMsg.innerHTML = response.replace(/\n/g, '<br>');
    chatBody.appendChild(botMsg);
    chatBody.scrollTop = chatBody.scrollHeight;
};

// Exportar globalmente
window.ChatbotEngine = ChatbotEngine;

// ========================================================
// BOTONES RÁPIDOS AL INICIO (SOLO UNA VEZ)
// ========================================================
document.addEventListener('DOMContentLoaded', function() {
    const chatBody = document.getElementById('chatBody');
    
    setTimeout(() => {
        const quickOptions = document.createElement('div');
        quickOptions.className = 'bot-message';
        quickOptions.style.maxWidth = '100%';
        quickOptions.innerHTML = `
            <strong>Selecciona una opción:</strong><br><br>
            
            <div style="margin-bottom:15px;">
                <strong style="color:#d10074;">Información Técnica:</strong><br>
                <button onclick="sendQuickMsg('¿Qué es el motor de crédito?')" class="quick-btn">Info General</button>
                <button onclick="sendQuickMsg('Muéstrame los parámetros')" class="quick-btn">Parámetros</button>
                <button onclick="sendQuickMsg('¿Qué tablas usa?')" class="quick-btn">Tablas</button>
                <button onclick="sendQuickMsg('Explícame el proceso')" class="quick-btn">Proceso</button>
                <button onclick="sendQuickMsg('Mostrar reglas de negocio')" class="quick-btn">Reglas</button>
                <button onclick="sendQuickMsg('Dame un ejemplo')" class="quick-btn">Ejemplo</button>
            </div>
            
            <div style="margin-bottom:15px;">
                <strong style="color:#d10074;">Ayuda del Editor:</strong><br>
                <button onclick="sendQuickMsg('¿Cómo edito un nodo?')" class="quick-btn">Editar Nodos</button>
                <button onclick="sendQuickMsg('¿Cómo conectar nodos?')" class="quick-btn">Conectar</button>
                <button onclick="sendQuickMsg('¿Cómo deshacer?')" class="quick-btn">Deshacer</button>
            </div>
            
            <style>
                .quick-btn {
                    display: inline-block;
                    margin: 4px 3px;
                    padding: 8px 12px;
                    background: #f8f9fa;
                    border: 1px solid #d10074;
                    border-radius: 20px;
                    cursor: pointer;
                    font-size: 12px;
                    transition: all 0.2s;
                    color: #333;
                }
                .quick-btn:hover {
                    background: #d10074;
                    color: white;
                    transform: translateY(-2px);
                    box-shadow: 0 4px 8px rgba(209,0,116,0.3);
                }
            </style>
        `;
        chatBody.appendChild(quickOptions);
        chatBody.scrollTop = chatBody.scrollHeight;
    }, 500);
});
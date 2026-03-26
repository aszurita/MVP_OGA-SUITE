/**
 * diccionarioService.js
 * Servicio de negocio para gestionar el Diccionario de Datos.
 */

// --- CONFIGURACIÓN ---
const LISTA_DICCIONARIO = "Z_DICCIONARIO_DATOS";

// Campos que siempre necesitamos traer para pintar la UI o clasificar
const CAMPOS_DICCIONARIO = [
    'tipo_metad', 
    'id_metad', 
    'ID', 
    'nombre_metad', 
    'descripcion_metad',
    'descripcion_dominio', 
    'txt_desc_subdominio', 
    'fec_ultima_actualizacion',
    'caracteristicas', 
    'dato_personal', 
    'golden_record', 
    'prioridad',
    'prioridad_glosario', 
    'prioridad_x0020_glosario', 
    'txt_desc_subcategoria',
    'catalogos_asociados', 
    'sn_activo'
];

/**
 * Organiza los items crudos de SharePoint en categorías (Términos, Atributos, Golden, etc.)
 * y aplica la lógica exacta de limpieza y conteo de dominios.
 * @param {Array} items - Array de objetos jQuery (rows).
 * @param {Object} dataBase - Objeto base de datos proveniente de getSegmentos().
 * @param {Object} subsegmentos - Configuración de segmentos.
 */
function clasificarDiccionario(items, dataBase, subsegmentos) {
    let data = {
        ...dataBase,
        todos: items,
        terminos: [],
        atributos: [],
        golden: [],
        elemento_clave: [],
        atributo_referencia: [],
        dominios: new Map() // Inicializamos el mapa de dominios aquí
    };

    // Inicializar arrays para subsegmentos dinámicos por seguridad
    if (subsegmentos && subsegmentos[3]) {
        Object.values(subsegmentos[3]).forEach(seg => {
            if (seg.value && !data[seg.value]) data[seg.value] = [];
        });
    }

    // Expresión regular para extraer números de HTML entities (ej: &#225;)
    let rgx = "(?<!\\&)\\d+(?=;)";
    let regex = new RegExp(rgx, "g");

    items.forEach(item => {
        // 1. Reemplazo de HTML entities para evitar problemas al filtrar
        let nombreMetad = item.attr("ows_nombre_metad") || "";
        if (nombreMetad.includes("&#")) {
            let entityMatch = nombreMetad.match(regex);
            if (entityMatch) {
                // Replicando la lógica original
                let entity = entityMatch[0]; 
                item[0].attributes.ows_nombre_metad.nodeValue = nombreMetad.replace("&#" + entity + ";", String.fromCharCode(entity));
            }
        }

        const tipo = item.attr("ows_tipo_metad");
        const datoPersonal = parseInt(item.attr("ows_dato_personal"));
        const golden = item.attr("ows_golden_record");
        const caracteristicas = (item.attr("ows_caracteristicas") || "").toLowerCase();

        // 2. Clasificación por Tipo
        if (tipo === "TERMINO") {
            data.terminos.push(item);
        } else if (tipo === "ATRIBUTO") {
            data.atributos.push(item);
        }

        // 3. Clasificación por Datos Personales
        if (datoPersonal && subsegmentos && subsegmentos[3] && subsegmentos[3][datoPersonal]) {
            data[subsegmentos[3][datoPersonal].value].push(item);
        }

        // 4. Golden Record
        if (golden === "1") {
            data.golden.push(item);
        }

        // 5. Características especiales (CDE / AR)
        if (caracteristicas && (caracteristicas.includes("cde") || caracteristicas.includes("elemento clave de datos"))) {
            data.elemento_clave.push(item);
        }
        if (caracteristicas && (caracteristicas.includes("ar") || caracteristicas.includes("atributo de referencia"))) {
            data.atributo_referencia.push(item);
        }

        // 6. Mapeo y conteo de Dominios
        let dominios = item.attr("ows_descripcion_dominio");
        (dominios || "").trim().split(";").forEach(dominio => {
            const cleanDominio = dominio.trim();
            if (cleanDominio) {
                const totalActual = data.dominios.get(cleanDominio) || 0;
                data.dominios.set(cleanDominio, totalActual + 1);
            }
        });
    });

    return data;
}

/**
 * Obtiene todos los términos activos, los clasifica y arma el mapa de dominios.
 */
async function getTerminosAllSP() {
    // Obtenemos los data y subsegmentos originales tal como la función antigua
    let { data, subsegmentos } = typeof getSegmentos === 'function' ? getSegmentos() : { data: {}, subsegmentos: {} };

    // Filtro: Solo activos
    const filters = { sn_activo: "1" };

    try {
        // Leemos desde el Helper asíncrono
        const items = await SPHelper.read(LISTA_DICCIONARIO, filters, CAMPOS_DICCIONARIO);
        
        // Pasamos todo a la nueva función de clasificación unificada
        return clasificarDiccionario(items, data, subsegmentos);
        
    } catch (error) {
        console.error("Error en getTerminosAllSP:", error);
        // Retorno de seguridad manteniendo la misma estructura
        data.todos = [];
        data.dominios = new Map();
        return data; 
    }
}

/**
 * Obtiene términos activos filtrados por dominio.
 * Nota: Como 'descripcion_dominio' puede tener múltiples valores ("A; B"), 
 * filtramos en memoria, no en CAML.
 */
async function getTerminosSP(desc_dominio) {
    let { subsegmentos } = getSegmentos();

    // 1. Traer todo lo activo
    const filters = { sn_activo: "1" };
    
    try {
        const items = await SPHelper.read(LISTA_DICCIONARIO, filters, CAMPOS_DICCIONARIO);

        // 2. Filtrar en JS
        const filtrados = items.filter(item => {
            const dominiosRaw = item.attr("ows_descripcion_dominio") || "";
            const listaDominios = dominiosRaw.split("; ");
            return listaDominios.includes(desc_dominio);
        });

        return clasificarDiccionario(filtrados, subsegmentos);
    } catch (error) {
        console.error("Error en getTerminos:", error);
        return { todos: [] };
    }
}

/**
 * Obtiene atributos asociados a un dominio (Sin clasificar, solo array).
 */
async function getAtributosFrom(desc_dominio) {
    // Filtramos por Tipo ATRIBUTO desde el servidor para optimizar
    const filters = { tipo_metad: "ATRIBUTO" };

    try {
        const items = await SPHelper.read(LISTA_DICCIONARIO, filters, CAMPOS_DICCIONARIO);

        let atributos = [];
        items.forEach(item => {
            const dominiosRaw = item.attr("ows_descripcion_dominio") || "";
            const listaDominios = dominiosRaw.split("; ");
            
            if (listaDominios.includes(desc_dominio)) {
                SPHelper.sanitizeItem(item); // Limpieza in-place
                atributos.push(item);
            }
        });
        return atributos;
    } catch (error) {
        console.error("Error en getAtributosFrom:", error);
        return [];
    }
}

/**
 * Obtiene un único atributo por su ID de metadato.
 */
async function getAtributo(id_termino) {
    const filters = {
        id_metad: id_termino,
        tipo_metad: "ATRIBUTO"
    };

    try {
        const items = await SPHelper.read(LISTA_DICCIONARIO, filters, CAMPOS_DICCIONARIO);
        
        if (items.length > 0) {
            const item = items[0];
            SPHelper.sanitizeItem(item);
            return item;
        }
        return undefined;
    } catch (error) {
        console.error("Error en getAtributo:", error);
        return undefined;
    }
}


// --- FUNCIONES DE ESCRITURA (CREATE / UPDATE) ---

/**
 * Crea un nuevo término en el diccionario.
 * @param {Object} datosTermino - Objeto con campos { nombre_metad: "X", descripcion_metad: "Y", ... }
 * @returns {Promise<boolean>} True si tuvo éxito.
 */
async function crearNuevoTermino(datosTermino) {
    // Aseguramos valores por defecto si no vienen
    const payload = {
        tipo_metad: "TERMINO",
        sn_activo: 1,
        ...datosTermino // Sobreescribe defaults si vienen en datosTermino
    };

    try {
        // USO DEL MÉTODO CREATE
        const resp = await SPHelper.create(LISTA_DICCIONARIO, payload);
        console.log(`Término creado con éxito. SharePoint ID: ${resp.id}`);
        return true;
    } catch (error) {
        console.error("Error al crear término:", error);
        return false;
    }
}

/**
 * Actualiza la prioridad de un atributo existente.
 * @param {number|string} idSharePoint - ID interno de SharePoint (ows_ID).
 * @param {string} nuevaPrioridad - Valor de la prioridad.
 */
async function actualizarPrioridadAtributo(idSharePoint, nuevaPrioridad) {
    try {
        // USO DEL MÉTODO UPDATE
        await SPHelper.update(
            LISTA_DICCIONARIO, 
            idSharePoint, 
            { prioridad: nuevaPrioridad }
        );
        return true;
    } catch (error) {
        console.error("Error actualizando prioridad:", error);
        return false;
    }
}

/**
 * Realiza un borrado lógico desactivando el flag.
 */
async function desactivarElemento(idSharePoint) {
    try {
        await SPHelper.update(LISTA_DICCIONARIO, idSharePoint, { sn_activo: 0 });
        return true;
    } catch (error) {
        console.error("Error desactivando elemento:", error);
        return false;
    }
}
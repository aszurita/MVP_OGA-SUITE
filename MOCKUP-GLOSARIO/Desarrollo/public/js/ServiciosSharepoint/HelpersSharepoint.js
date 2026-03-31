/**
 * * Módulo de utilidades para interactuar con las listas de SharePoint utilizando la librería SPServices (SOAP).
 * Provee métodos para leer, crear y actualizar elementos, manejando internamente la construcción de queries CAML y promesas.
 * * @author No sea sapo
 */
const SPHelper = {

    /**
     * Construye una cadena XML de tipo ViewFields para limitar las columnas devueltas por la consulta.
     * * @private
     * @param {string[]} fields - Array con los nombres internos de las columnas a obtener. Ej: ['ID', 'Title'].
     * @returns {string} Cadena XML formateada como <ViewFields><FieldRef Name='x'/></ViewFields>.
     */
    _buildViewFields: function (fields) {
        if (!fields || fields.length === 0) return "";
        const refs = fields.map(f => `<FieldRef Name='${f}' />`).join("");
        return `<ViewFields>${refs}</ViewFields>`;
    },

    /**
     * Construye una Query CAML recursiva (operador AND) basada en un objeto de filtros.
     * Convierte un objeto llave-valor en una estructura XML <Query><Where><And>...
     * * @private
     * @param {Object} filtersObj - Objeto con los filtros. Ej: { sn_activo: 1, tipo_metad: "ATRIBUTO" }.
     * @returns {string} Cadena XML CAML Query válida. Si el objeto está vacío, retorna <Query></Query>.
     */
    _buildCamlQuery: function (filtersObj) {
        // 1. Si no hay objeto o está vacío, retornar Query vacía
        if (!filtersObj || Object.keys(filtersObj).length === 0) {
            return "<Query></Query>";
        }

        // 2. Convertimos el objeto a un array de entradas: [["sn_activo", 1], ["tipo", "A"]]
        const entries = Object.entries(filtersObj);

        // Función auxiliar para crear un nodo <Eq> individual
        const buildNode = (field, val) => {
            // Detección automática de tipo: si es número usa 'Number', sino 'Text'
            const type = typeof val === 'number' ? 'Number' : 'Text';
            return `<Eq><FieldRef Name="${field}"/><Value Type="${type}">${val}</Value></Eq>`;
        };

        // Función recursiva para anidar los <And>
        const buildRecursive = (items) => {
            // Caso base: Si solo queda un filtro, devolvemos el nodo Eq
            if (items.length === 1) {
                return buildNode(items[0][0], items[0][1]);
            }

            // Caso recursivo: Tomamos el primero y anidamos el resto dentro de un <And>
            const [current, ...rest] = items;
            return `<And>${buildNode(current[0], current[1])}${buildRecursive(rest)}</And>`;
        };

        return `<Query><Where>${buildRecursive(entries)}</Where></Query>`;
    },

    /**
     * Realiza una consulta de lectura a una lista de SharePoint.
     * * @param {string} listName - El nombre de la lista en SharePoint.
     * @param {Object} filtersObj - Objeto con los filtros a aplicar. Ej: { ID: 10 }.
     * @param {string[]} viewFields - Array con los nombres de las columnas a traer.
     * @param {boolean} [asyncMode=false] - Define si la petición es asíncrona (true) o síncrona (false).
     * @returns {Promise<Array<Object>>} Una promesa que resuelve con un array de objetos jQuery (filas XML).
     */
    read: function (listName, filtersObj, viewFields, asyncMode = false) {
        const camlQuery = this._buildCamlQuery(filtersObj);
        const camlViewFields = this._buildViewFields(viewFields);

        return new Promise((resolve, reject) => {
            let items = [];
            $().SPServices({
                operation: "GetListItems",
                async: asyncMode,
                listName: listName,
                CAMLQuery: camlQuery,
                CAMLViewFields: camlViewFields,
                completefunc: function (xData, Status) {
                    if (Status === "success") {
                        $(xData.responseXML).find("z\\:row").each(function () {
                            items.push($(this));
                        });
                        resolve(items);
                    } else {
                        console.error(`SPHelper Read Error en lista ${listName}:`, Status);
                        reject(Status);
                    }
                }
            });
        });
    },

    /**
     * Convierte un objeto JavaScript simple en un array de pares clave-valor requerido por SPServices.
     * * @private
     * @param {Object} dataObj - Objeto de datos. Ej: { Titulo: "Hola", Edad: 20 }.
     * @returns {Array<Array<string>>} Array de arrays. Ej: [["Titulo", "Hola"], ["Edad", 20]].
     */
    _objectToValuePairs: function (dataObj) {
        return Object.keys(dataObj).map(key => [key, dataObj[key]]);
    },

    /**
     * Sanitiza y decodifica caracteres HTML que SharePoint devuelve codificados en campos de texto.
     * Útil cuando SharePoint devuelve entidades como '&#225;' en lugar de 'á'.
     * * @param {Object} item - Objeto jQuery que representa la fila (row) de SharePoint.
     * @param {string} [fieldName="ows_nombre_metad"] - El nombre del atributo/columna a leer y sanitizar.
     * @returns {string} El valor del campo decodificado.
     */
    sanitizeItem: function (item, fieldName = "ows_nombre_metad") {
        const val = item.attr(fieldName);
        if (val && val.includes("&#")) {
            let rgx = "(?<!\&)\\d+(?=;)";
            let regex = new RegExp(rgx, "g");
            let entity = val.match(regex);
            if (entity) {
                // Truco para decodificar sin romper el nodo XML
                return val.replace("&#" + entity + ";", String.fromCharCode(entity));
            }
        }
        return val;
    },

    /**
     * Método privado centralizado para ejecutar transacciones de escritura (UpdateListItems).
     * Maneja la configuración común de SPServices y el parseo de errores de respuesta.
     * * @private
     * @param {string} listName - Nombre de la lista.
     * @param {string} batchCmd - Comando de lote: "New", "Update" o "Delete".
     * @param {Array<Array<string>>} valuePairs - Array de pares [campo, valor].
     * @returns {Promise<Object>} Promesa que resuelve con { success: true, id: newId, xml: xData }.
     */
    _executeWrite: function (listName, batchCmd, valuePairs) {
        return new Promise((resolve, reject) => {
            $().SPServices({
                operation: "UpdateListItems",
                async: false, // Escrituras síncronas por seguridad en secuencia
                listName: listName,
                batchCmd: batchCmd,
                valuepairs: valuePairs,
                completefunc: function (xData, Status) {
                    const errorText = $(xData.responseXML).find("ErrorText").text();
                    const errorCode = $(xData.responseXML).find("ErrorCode").text();

                    // 0x00000000 indica éxito en SharePoint SOAP.
                    // A veces errorCode viene vacío en éxito, pero ErrorText debe estar vacío.
                    if (Status === "success" && !errorText && (errorCode === "0x00000000" || !errorCode)) {
                        // Intentamos obtener el ID del item creado/actualizado si viene en la respuesta
                        const newId = $(xData.responseXML).find("z\\:row").attr("ows_ID");
                        resolve({ success: true, id: newId, xml: xData });
                    } else {
                        console.error(`SPHelper ${batchCmd} Error en lista ${listName}:`, errorText || Status);
                        reject(errorText || Status);
                    }
                }
            });
        });
    },

    /**
     * Crea un nuevo elemento en una lista de SharePoint.
     * * @param {string} listName - Nombre de la lista donde se creará el elemento.
     * @param {Object} dataObj - Objeto con los datos a insertar. Ej: { Titulo: "Nuevo Item", Estado: "Activo" }.
     * @returns {Promise<Object>} Promesa que resuelve con el resultado de la operación y el nuevo ID.
     */
    create: function (listName, dataObj) {
        const valuePairs = this._objectToValuePairs(dataObj);
        return this._executeWrite(listName, "New", valuePairs);
    },

    /**
     * Actualiza un elemento existente en una lista de SharePoint.
     * * @param {string} listName - Nombre de la lista.
     * @param {number|string} id - El ID del elemento a actualizar (Obligatorio).
     * @param {Object} dataObj - Objeto con los datos a modificar. Ej: { Estado: "Inactivo" }.
     * @returns {Promise<Object>} Promesa que resuelve con el resultado de la operación.
     * @throws {string} Retorna una promesa rechazada si no se proporciona un ID.
     */
    update: function (listName, id, dataObj) {
        if (!id) {
            return Promise.reject("SPHelper Update Error: Se requiere un ID para actualizar.");
        }
        const valuePairs = this._objectToValuePairs(dataObj);
        // Para Update, el par ID es obligatorio en los valuepairs
        valuePairs.push(["ID", id]);

        return this._executeWrite(listName, "Update", valuePairs);
    },
};
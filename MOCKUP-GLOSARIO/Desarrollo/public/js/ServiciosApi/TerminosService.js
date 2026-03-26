/**
 * TerminosService.js
 * Servicio integral para gestionar el Glosario de Términos desde SQL Server.
 * Reemplaza a DiccionarioService.js y depende de SqlHelper.js
 */
const TerminosService = {
    TABLA: "procesos_bi.dbo.T_terminos",

    /**
     * Organiza los items (objetos puros de SQL) en categorías (Términos, Atributos, Golden, etc.)
     * y arma el conteo de dominios.
     */
    _clasificarDiccionario: function (items, dataBase, subsegmentos) {
        let data = {
            ...dataBase,
            todos: items,
            terminos: [],
            atributos: [],
            golden: [],
            elemento_clave: [],
            atributo_referencia: [],
            dominios: new Map()
        };

        if (subsegmentos && subsegmentos[3]) {
            Object.values(subsegmentos[3]).forEach(seg => {
                if (seg.value && !data[seg.value]) data[seg.value] = [];
            });
        }

        items.forEach(item => {
            // Leemos directamente las propiedades de la tabla SQL
            const tipo = (item.tipo || "").toUpperCase();
            const datoPersonal = parseInt(item.dato_personal);
            const golden = item.golden_record;
            const caracteristicas = (item.caracteristicas || "").toLowerCase();

            // 1. Clasificación por Tipo
            if (tipo === "TERMINO") {
                data.terminos.push(item);
            } else if (tipo === "ATRIBUTO" || tipo === "ATRIBUTO/TERMINO") {
                data.atributos.push(item);
            }

            // 2. Clasificación por Datos Personales
            if (datoPersonal && subsegmentos && subsegmentos[3] && subsegmentos[3][datoPersonal]) {
                data[subsegmentos[3][datoPersonal].value].push(item);
            }

            // 3. Golden Record (En SQL Server bit es 1 o 0)
            if (golden === 1 || golden === true) {
                data.golden.push(item);
            }

            // 4. Características especiales (CDE y AR)
            if (caracteristicas && (caracteristicas.includes("cde") || caracteristicas.includes("elemento clave de datos"))) {
                data.elemento_clave.push(item);
            }
            if (caracteristicas && (caracteristicas.includes("ar") || caracteristicas.includes("atributo de referencia"))) {
                data.atributo_referencia.push(item);
            }

            // 5. Mapeo y conteo de Dominios
            let dominiosRaw = item.dominios || "";
            dominiosRaw.trim().split(";").forEach(dominio => {
                const cleanDominio = dominio.trim();
                if (cleanDominio) {
                    const totalActual = data.dominios.get(cleanDominio) || 0;
                    data.dominios.set(cleanDominio, totalActual + 1);
                }
            });
        });

        return data;
    },

    /**
     * Obtiene todos los términos activos, los clasifica y arma el mapa de dominios.
     */
    async getTerminosAll() {
        let { data, subsegmentos } = typeof getSegmentos === 'function' ? getSegmentos() : { data: {}, subsegmentos: {} };

        try {
            const sqlItems = await SqlHelper.query("*", this.TABLA, "sn_activo = 1");
            // Pasamos los items crudos directo al clasificador
            return this._clasificarDiccionario(sqlItems, data, subsegmentos);
        } catch (error) {
            console.error("Error en getTerminosAll (SQL):", error);
            data.todos = [];
            data.dominios = new Map();
            return data;
        }
    },

    /**
     * Obtiene términos activos filtrados por un dominio específico.
     */
    async getTerminosPorDominio(desc_dominio) {
        let { subsegmentos } = typeof getSegmentos === 'function' ? getSegmentos() : { subsegmentos: {} };

        try {
            const sqlItems = await SqlHelper.query("*", this.TABLA, "sn_activo = 1");

            // Filtro en memoria porque el campo dominios puede tener múltiples valores separados por ";"
            const filtrados = sqlItems.filter(item => {
                const dominiosRaw = item.dominios || "";
                const listaDominios = dominiosRaw.split(";").map(s => s.trim());
                return listaDominios.includes(desc_dominio.trim());
            });

            return this._clasificarDiccionario(filtrados, {}, subsegmentos);
        } catch (error) {
            console.error("Error en getTerminosPorDominio (SQL):", error);
            return { todos: [] };
        }
    },

    /**
     * Obtiene solo los atributos asociados a un dominio.
     */
    async getAtributosFrom(desc_dominio) {
        try {
            const sqlItems = await SqlHelper.query("*", this.TABLA, "tipo = 'ATRIBUTO' AND sn_activo = 1");
            const atributos = [];

            sqlItems.forEach(item => {
                const dominiosRaw = item.dominios || "";
                const listaDominios = dominiosRaw.split(";").map(s => s.trim());

                if (listaDominios.includes(desc_dominio.trim())) {
                    atributos.push(item);
                }
            });
            return atributos;
        } catch (error) {
            console.error("Error en getAtributosFrom (SQL):", error);
            return [];
        }
    },

    getAtributo: async function (id_termino) {
        if (!id_termino) return null;

        try {
            // Consultamos directamente a SQL Server filtrando por ID y Tipo
            // Ajusta los nombres de las columnas a los que estés usando en tu tabla final
            const resultados = await window.SqlHelper.query(
                "id, tipo, nombre, descripcion, dominios, casos_uso, caracteristicas, txt_desc_subcategoria, dato_personal, golden_record, catalogos_asociados, fecha_modificacion",
                this.TABLA || "procesos_bi.dbo.T_terminos",
                `id = ${Number(id_termino)} AND tipo = 'ATRIBUTO'`
            );

            if (resultados && resultados.length > 0) {
                let atributo = resultados[0]; // Tomamos el primer (y único) resultado

                // Reemplazo de HTML entities para evitar problemas (Adaptación moderna de tu regex)
                // Convierte cosas como "&#225;" en "á"
                if (atributo.nombre && typeof atributo.nombre === 'string' && atributo.nombre.includes("&#")) {
                    atributo.nombre = atributo.nombre.replace(/&#(\d+);/g, function(match, dec) {
                        return String.fromCharCode(dec);
                    });
                }

                return atributo;
            }
            
            return null; // Si no se encontró el atributo
            
        } catch (error) {
            console.error(`Error al obtener el atributo con ID ${id_termino} desde SQL:`, error);
            return null;
        }
    },

    /**
     * Obtiene un registro individual por su ID.
     */
    async getById(id) {
        try {
            const resultados = await SqlHelper.query("*", this.TABLA, `id = ${id} AND sn_activo = 1`);
            return resultados.length > 0 ? resultados[0] : null;
        } catch (error) {
            console.error("Error en getById (SQL):", error);
            return null;
        }
    },

    _upperKeys: function (obj) {
        return Object.keys(obj).reduce((acc, key) => {
            acc[key.toUpperCase()] = obj[key];
            return acc;
        }, {});
    },

    /**
     * Crea un nuevo término. Se encarga de formatear fechas e ID de creador.
     */
    async crearNuevoTermino(datos, idAutor) {
        const payload = {
            tipo: datos.tipo || "TERMINO",
            nombre: datos.nombre,
            descripcion: datos.descripcion,
            fecha_creacion: new Date().toISOString(),
            autor_creacion: idAutor || 0,
            dominios: datos.dominios || null,
            casos_uso: datos.casos_uso || null,
            caracteristicas: datos.caracteristicas || null,
            txt_desc_subcategoria: datos.txt_desc_subcategoria || null,
            dato_personal: datos.dato_personal || null,
            golden_record: datos.golden_record ? 1 : 0, // Asegura casteo a BIT (0 o 1)
            catalogos_asociados: datos.catalogos_asociados || null,
            etiqueta_tecnica: datos.etiqueta_tecnica || null,
            prioridad: datos.prioridad || null,
            sn_activo: 1
        };

        return SqlHelper.insert(this.TABLA, this._upperKeys(payload));
    },

    /**
     * Actualiza un término. Registra quién y cuándo lo modificó.
     */
    async update(id, datos, idAutorModificacion) {
        const payload = { ...datos };

        // Protegemos campos de auditoría inmutables
        delete payload.id;
        delete payload.fecha_creacion;
        delete payload.autor_creacion;

        // Auto-asignamos auditoría de actualización
        payload.fecha_modificacion = new Date().toISOString();
        payload.autor_modificacion = idAutorModificacion || 0;

        if (payload.golden_record !== undefined) {
            payload.golden_record = payload.golden_record ? 1 : 0;
        }

        return SqlHelper.update(this.TABLA, this._upperKeys(payload), `id = ${id}`);
    },

    /**
     * Actualiza la prioridad de un atributo existente.
     */
    async actualizarPrioridadAtributo(id, nuevaPrioridad, idAutorModificacion) {
        return this.update(id, { prioridad: nuevaPrioridad }, idAutorModificacion);
    },

    /**
     * Borrado lógico. Apaga el flag sn_activo y registra el motivo.
     */
    async desactivarElemento(id, motivoEliminacion = "Borrado manual", idAutorModificacion) {
        const payload = {
            sn_activo: 0,
            motivo_elimin: motivoEliminacion,
            fecha_modificacion: new Date().toISOString(),
            autor_modificacion: idAutorModificacion || 0
        };

        return SqlHelper.update(this.TABLA, this._upperKeys(payload), `id = ${id}`);
    }
};

window.TerminosService = TerminosService;
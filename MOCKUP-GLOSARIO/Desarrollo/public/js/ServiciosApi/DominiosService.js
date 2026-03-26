/**
 * DominiosService.js
 * Servicio integral para gestionar el Mapa de Dominios desde SQL Server.
 * Depende de SqlHelper.js
 */
const DominiosService = {
    TABLA: "procesos_bi.dbo.t_mapa_dominios",

    /**
     * Helper opcional para asegurar que las llaves vayan en mayúsculas si tu API lo requiere,
     * aunque puedes omitirlo si tu backend maneja el JSON tal cual.
     */
    _upperKeys: function (obj) {
        return Object.keys(obj).reduce((acc, key) => {
            acc[key.toUpperCase()] = obj[key];
            return acc;
        }, {});
    },

    /**
     * Obtiene todos los dominios que están activos.
     */
    async getAll() {
        try {
            const resultados = await window.SqlHelper.query("*", this.TABLA, "sn_activo = 1");
            return resultados;
        } catch (error) {
            console.error("Error en DominiosService.getAll (SQL):", error);
            return [];
        }
    },

    /**
     * Obtiene un dominio específico por su ID.
     */
    async getById(id_dominio) {
        if (!id_dominio) return null;
        try {
            const resultados = await window.SqlHelper.query(
                "*",
                this.TABLA,
                `id_dominio = ${Number(id_dominio)} AND sn_activo = 1`
            );
            return resultados.length > 0 ? resultados[0] : null;
        } catch (error) {
            console.error(`Error en DominiosService.getById(${id_dominio}):`, error);
            return null;
        }
    },

    /**
     * Calcula dinámicamente la cantidad de casos de uso, términos y atributos
     * asociados a un dominio, contando valores ÚNICOS para evitar duplicados 
     * por cruces entre metadatos atados directamente al dominio y a sus casos de uso.
     */

    /**
         * Calcula dinámicamente la cantidad de casos de uso, términos, atributos
         * y modelos asociados a un dominio. (SQL + SharePoint)
         */
    async getEstadisticas(id_dominio, nombre_dominio) {
        if (!id_dominio || !nombre_dominio) return { cant_casos: 0, cant_terminos: 0, cant_atributos: 0, cant_modelos: 0 };

        try {
            const nombreSeguro = nombre_dominio.replace(/'/g, "''");

            // 1. Contar Casos de Uso del dominio (SQL)
            const queryCasos = window.SqlHelper.query(
                "COUNT(DISTINCT id_caso_uso) AS total",
                "PROCESOS_BI.DBO.t_casos_uso_analitica",
                `id_dominio = ${Number(id_dominio)} AND sn_activo = 1`
            );

            const origenMetadatos = `${window.TerminosService?.TABLA || "PROCESOS_BI.DBO.T_terminos"} t 
                LEFT JOIN PROCESOS_BI.DBO.T_CASOS_USO_TERMINOS_MB cut 
                    ON CAST(t.id AS VARCHAR) = cut.COD_TERMINOS AND cut.SN_ACTIVO = 1 
                LEFT JOIN PROCESOS_BI.DBO.t_casos_uso_analitica cu 
                    ON cut.ID_CASO_USO = cu.id_caso_uso AND cu.sn_activo = 1`;

            const condicionFiltro = `
                t.sn_activo = 1 
                AND (t.dominios LIKE '%${nombreSeguro}%' OR cu.id_dominio = ${Number(id_dominio)})
            `;

            // 2. Contar Términos Únicos (SQL)
            const queryTerminos = window.SqlHelper.query(
                "COUNT(DISTINCT t.id) AS total",
                origenMetadatos,
                `t.tipo = 'TERMINO' AND ${condicionFiltro}`
            );

            // 3. Contar Atributos Únicos (SQL)
            const queryAtributos = window.SqlHelper.query(
                "COUNT(DISTINCT t.id) AS total",
                origenMetadatos,
                `t.tipo = 'ATRIBUTO' AND ${condicionFiltro}`
            );

            // 4. 🌟 NUEVO: Contar Modelos desde SharePoint (Envuelto en Promise) 🌟
            const queryModelos = new Promise((resolve) => {
                let countModelos = 0;
                $().SPServices({
                    operation: "GetListItems",
                    async: true, // Asíncrono para no bloquear las peticiones SQL
                    listName: "INV_MODEL_ART",
                    CAMLViewFields: "<ViewFields><FieldRef Name='id_dominio' /></ViewFields>",
                    completefunc: function (xData, Status) {
                        if (Status === "success") {
                            $(xData.responseXML).find("z\\:row").each(function () {
                                let ids_dominios = ($(this).attr("ows_id_dominio") || "").split("; ");
                                if (ids_dominios.includes(String(id_dominio))) {
                                    countModelos++;
                                }
                            });
                        }
                        // Devolvemos el resultado con la misma estructura que SQL [{ total: X }]
                        resolve([{ total: countModelos }]);
                    }
                });
            });

            // Ejecutamos las 4 consultas (3 SQL + 1 SharePoint) de forma paralela
            const [resCasos, resTerminos, resAtributos, resModelos] = await Promise.all([
                queryCasos,
                queryTerminos,
                queryAtributos,
                queryModelos
            ]);

            return {
                cant_casos: (resCasos && resCasos.length > 0) ? resCasos[0].total : 0,
                cant_terminos: (resTerminos && resTerminos.length > 0) ? resTerminos[0].total : 0,
                cant_atributos: (resAtributos && resAtributos.length > 0) ? resAtributos[0].total : 0,
                cant_modelos: (resModelos && resModelos.length > 0) ? resModelos[0].total : 0
            };

        } catch (error) {
            console.error(`[DominiosService] Error al calcular estadísticas para el dominio ${id_dominio}:`, error);
            return { cant_casos: 0, cant_terminos: 0, cant_atributos: 0, cant_modelos: 0 };
        }
    },

    /**
     * Crea un nuevo registro en el mapa de dominios.
     */
    async create(datos) {
        // Armamos el payload asegurando que sn_activo sea 1 por defecto
        const payload = {
            codigo_Dominio: datos.codigo_Dominio || null,
            descripcion_dominio: datos.descripcion_dominio || null,
            Conceptos_Clave: datos.Conceptos_Clave || null,
            descripcion: datos.descripcion || null,
            COM: datos.COM !== undefined ? Number(datos.COM) : null,
            IMPACT: datos.IMPACT !== undefined ? Number(datos.IMPACT) : null,
            Tipo: datos.Tipo || null,
            Familia_de_Dominios: datos.Familia_de_Dominios || null,
            lider_sugerido: datos.lider_sugerido || null,
            atributos_basicos: datos.atributos_basicos || null,
            id_tipo_dominio: datos.id_tipo_dominio !== undefined ? Number(datos.id_tipo_dominio) : null,
            id_tipo_familia: datos.id_tipo_familia !== undefined ? Number(datos.id_tipo_familia) : null,
            sn_activo: 1
        };

        // Limpiamos las propiedades nulas si tu SqlHelper o API requiere que no se envíen
        Object.keys(payload).forEach(key => {
            if (payload[key] === null) delete payload[key];
        });

        try {
            return await window.SqlHelper.insert(this.TABLA, payload);
        } catch (error) {
            console.error("Error al crear el dominio en SQL:", error);
            throw error;
        }
    },

    /**
     * Busca un dominio por una columna y valor específicos.
     * Retorna el primer registro que coincida.
     */
    async search(columna, valor, tipo = "Text") {
        if (!columna || valor === undefined) return null;

        if (columna === 'tipo_dominio') columna = 'Tipo';

        let formattedValue = (tipo === "Number" || tipo === "Integer" || tipo === "Counter")
            ? Number(valor)
            : `'${String(valor).replace(/'/g, "''")}'`;

        try {
            const resultados = await window.SqlHelper.query(
                "*",
                this.TABLA,
                `${columna} = ${formattedValue}`
            );

            return resultados && resultados.length > 0 ? resultados[0] : null;

        } catch (error) {
            console.error(`[DominiosService] Error al buscar dominio por ${columna} = ${valor}:`, error);
            return null;
        }
    },

    /**
     * Actualiza la información de un dominio existente.
     */
    async update(id_dominio, datos) {
        if (!id_dominio) throw new Error("Se requiere un id_dominio para actualizar.");

        const payload = { ...datos };

        // Protegemos la llave primaria para no sobreescribirla accidentalmente
        delete payload.id_dominio;

        try {
            return await window.SqlHelper.update(this.TABLA, payload, `id_dominio = ${Number(id_dominio)}`);
        } catch (error) {
            console.error(`Error al actualizar el dominio ${id_dominio} en SQL:`, error);
            throw error;
        }
    },

    /**
     * Apaga el flag sn_activo (Borrado lógico)
     */
    async desactivar(id_dominio) {
        if (!id_dominio) throw new Error("Se requiere un id_dominio para desactivar.");

        const payload = {
            sn_activo: 0
        };

        try {
            return await window.SqlHelper.update(this.TABLA, payload, `id_dominio = ${Number(id_dominio)}`);
        } catch (error) {
            console.error(`Error al desactivar el dominio ${id_dominio} en SQL:`, error);
            throw error;
        }
    }
};

window.DominiosService = DominiosService;
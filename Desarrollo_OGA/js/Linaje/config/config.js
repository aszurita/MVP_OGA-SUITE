/**
 * Configuración del sistema de Linaje
 * Maneja variables de entorno y configuración general
 */

// ================== CONFIGURACIÓN DE ENTORNO ==================
const CONFIG = {
  // Flag directo para entorno de desarrollo
  IS_DEVELOPMENT: true, // Cambiar a false para producción

  // Endpoints por entorno
  ENDPOINTS: {
    development: 'http://localhost:8510/query', // Para desarrollo local
    production: 'http://gobinfoana01-2:8510/query' // Para producción
  },

  // Obtener endpoint correcto según entorno
  get API_ENDPOINT() {
    return this.IS_DEVELOPMENT ? this.ENDPOINTS.development : this.ENDPOINTS.production;
  },

  // Configuración de Select2
  SELECT2_CONFIG: {
    TABLE_MIN_INPUT_LEN: 0, // No requerir caracteres mínimos para búsqueda
    MINIMUM_RESULTS_FOR_SEARCH: 0 // Siempre mostrar búsqueda
  },

  // Configuración del grafo
  GRAPH_CONFIG: {
    HORIZONTAL_SPACING: 300,
    VERTICAL_SPACING: 60,
    CENTER_X: 400,
    CENTER_Y: 200
  },

  // Tabla de Linaje por entorno
  LINAJE_TABLES: {
    development: 'BG_Lab.dbo.t_linage_entidades',
    production: 'BG_Lab.dbo.t_linage_entidades'
  },

  // Configuración de nodos (única fuente de verdad de íconos)
  DEFAULT_NODE_ICON: "🧩",
  NODE_TYPES: {
    tabla: {
      icon: "📋",
      name: "Tabla",
      aliases: ["tablas", "table"]
    },
    api: {
      icon: "🔌",
      name: "API"
    },
    dashboard: {
      icon: "📊",
      name: "Dashboard"
    },
    sp: {
      icon: "⚙️",
      name: "Procedimiento",
      aliases: ["procedimiento almacenado", "procedimiento", "sp"]
    },
    proceso: {
      icon: "🛠️",
      name: "Proceso",
      aliases: ["proceso"],
      alwaysInclude: true
    },
    notebook: {
      icon: "📓",
      name: "Notebook"
    },
    alteryx: {
      icon: "🧰",
      name: "Alteryx"
    },
    databricks: {
      icon: "🧱",
      name: "Databricks"
    },
    sharepoint: {
      icon: "🗂️",
      name: "SharePoint"
    },
    database: {
      icon: "🗄️",
      name: "Base de Datos",
      aliases: ["base de datos", "database", "db"]
    },
    service: {
      icon: "🧩",
      name: "Servicio",
      aliases: ["servicio"]
    },
    otros: {
      icon: "🧩",
      name: "Otros",
      aliases: ["otro", "otros"]
    }
  },


  // Nodo padre por defecto
  DEFAULT_PARENT_NODE: {
    nombre: "TMP_COLA_RUCS",
    descripcion: "Cola de expedientes",
    tipo: "tabla"
  }
};

// ================== FUNCIONES DE UTILIDAD ==================
const ConfigUtils = {
  /**
   * Verifica si estamos en modo desarrollo
   */
  isDevelopment() {
    return CONFIG.IS_DEVELOPMENT;
  },

  /**
   * Obtiene el endpoint de la API
   */
  getApiEndpoint() {
    return CONFIG.API_ENDPOINT;
  },

  /**
   * Obtiene configuración de Select2
   */
  getSelect2Config() {
    return CONFIG.SELECT2_CONFIG;
  },

  /**
   * Obtiene configuración del grafo
   */
  getGraphConfig() {
    return CONFIG.GRAPH_CONFIG;
  },

  /**
   * Obtiene tabla de Linaje seg��n entorno
   */
  getLinajeTable() {
    const env = CONFIG.IS_DEVELOPMENT ? 'development' : 'production';
    return CONFIG.LINAJE_TABLES?.[env] || CONFIG.LINAJE_TABLES.production;
  },

  /**
   * Obtiene base del endpoint (sin /query)
   */
  getApiBaseUrl() {
    const endpoint = CONFIG.API_ENDPOINT || '';
    return endpoint.replace(/\/query\s*$/i, '') || endpoint;
  },

  /**
   * Obtiene tipos de nodos disponibles
   */
  getNodeTypes() {
    return CONFIG.NODE_TYPES;
  },

  /**
   * Normaliza un nombre de tipo contra el catálogo
   */
  normalizeNodeType(typeName) {
    if (!typeName) return null;
    const raw = typeName.toString().trim().toLowerCase();
    if (!raw) return null;
    if (CONFIG.NODE_TYPES[raw]) {
      return raw;
    }

    const match = Object.entries(CONFIG.NODE_TYPES).find(([, def]) => {
      const aliases = def?.aliases || [];
      return aliases.some(alias => alias.toLowerCase() === raw);
    });

    return match ? match[0] : null;
  },

  /**
   * Obtiene la definición (icono/nombre) de un tipo
   */
  getNodeTypeDefinition(typeName) {
    if (!typeName) return null;
    const normalized = CONFIG.NODE_TYPES[typeName]
      ? typeName
      : this.normalizeNodeType(typeName);
    if (!normalized || !CONFIG.NODE_TYPES[normalized]) {
      return null;
    }
    const def = CONFIG.NODE_TYPES[normalized];
    return {
      key: normalized,
      name: def.name,
      icon: def.icon,
      aliases: def.aliases || [],
      alwaysInclude: Boolean(def.alwaysInclude)
    };
  },

  /**
   * Obtiene el icono de un tipo específico
   */
  getNodeIcon(typeName) {
    const def = this.getNodeTypeDefinition(typeName);
    if (def?.icon) return def.icon;
    return CONFIG.DEFAULT_NODE_ICON;
  },

  /**
   * Obtiene el nombre a mostrar de un tipo
   */
  getNodeDisplayName(typeName) {
    const def = this.getNodeTypeDefinition(typeName);
    if (def?.name) return def.name;
    return (typeName || '').toString().trim() || 'Tipo';
  },

  /**
   * Devuelve el icono por defecto
   */
  getDefaultNodeIcon() {
    return CONFIG.DEFAULT_NODE_ICON;
  },

  /**
   * Retorna tipos configurados que siempre deben mostrarse
   */
  getAlwaysAvailableNodeTypes() {
    return Object.entries(CONFIG.NODE_TYPES)
      .filter(([, def]) => def?.alwaysInclude)
      .map(([key, def]) => ({
        key,
        name: def.name,
        icon: def.icon
      }));
  },

  /**
   * Obtiene configuración del nodo padre por defecto
   */
  getDefaultParentNode() {
    return CONFIG.DEFAULT_PARENT_NODE;
  },

  /**
   * Cambia el modo de desarrollo
   */
  setDevelopmentMode(isDev) {
    CONFIG.IS_DEVELOPMENT = isDev;
  },

  /**
   * Obtiene configuración completa del entorno actual
   */
  getEnvironmentInfo() {
    return {
      isDevelopment: CONFIG.IS_DEVELOPMENT,
      apiEndpoint: CONFIG.API_ENDPOINT,
      hostname: window.location.hostname,
      userAgent: navigator.userAgent,
      timestamp: new Date().toISOString()
    };
  },

  /**
   * Valida si la configuración es válida
   */
  validateConfig() {
    const errors = [];

    if (!CONFIG.API_ENDPOINT) {
      errors.push('API_ENDPOINT no está definido');
    }

    if (!CONFIG.NODE_TYPES || Object.keys(CONFIG.NODE_TYPES).length === 0) {
      errors.push('NODE_TYPES no está definido o está vacío');
    }

    if (!CONFIG.DEFAULT_PARENT_NODE) {
      errors.push('DEFAULT_PARENT_NODE no está definido');
    }

    return {
      isValid: errors.length === 0,
      errors: errors
    };
  },

  /**
   * Obtiene configuración para logging
   */
  getLoggingConfig() {
    return {
      enabled: CONFIG.IS_DEVELOPMENT,
      level: CONFIG.IS_DEVELOPMENT ? 'debug' : 'error',
      showTimestamps: true,
      showEnvironment: true
    };
  }
};

// Exportar para uso en otros módulos
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { CONFIG, ConfigUtils };
} else {
  window.CONFIG = CONFIG;
  window.ConfigUtils = ConfigUtils;
}

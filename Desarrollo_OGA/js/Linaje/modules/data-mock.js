/**
 * Datos mock para desarrollo local
 * Simula las respuestas de la API cuando IS_DEVELOPMENT = true
 */

const MOCK_DATA = {
  // Servidores mock
  servers: [
    { name: "SERVIDOR_DEV_01" },
    { name: "SERVIDOR_DEV_02" },
    { name: "SERVIDOR_PROD_01" },
    { name: "SERVIDOR_TEST_01" }
  ],
  
  // Bases de datos mock por servidor
  databases: {
    "SERVIDOR_DEV_01": [
      { name: "DB_ANALYTICS" },
      { name: "DB_BI" },
      { name: "DB_DW" }
    ],
    "SERVIDOR_DEV_02": [
      { name: "DB_OPERACIONAL" },
      { name: "DB_STAGING" }
    ],
    "SERVIDOR_PROD_01": [
      { name: "DB_PRODUCCION" },
      { name: "DB_BACKUP" }
    ],
    "SERVIDOR_TEST_01": [
      { name: "DB_TEST" },
      { name: "DB_QA" }
    ]
  },
  
  // Esquemas mock por base de datos
  schemas: {
    "DB_ANALYTICS": [
      { name: "dbo" },
      { name: "analytics" },
      { name: "reports" }
    ],
    "DB_BI": [
      { name: "dbo" },
      { name: "business_intelligence" },
      { name: "kpi" }
    ],
    "DB_DW": [
      { name: "dbo" },
      { name: "dimensions" },
      { name: "facts" }
    ],
    "DB_OPERACIONAL": [
      { name: "dbo" },
      { name: "operational" }
    ],
    "DB_STAGING": [
      { name: "dbo" },
      { name: "staging" }
    ],
    "DB_PRODUCCION": [
      { name: "dbo" },
      { name: "production" }
    ],
    "DB_BACKUP": [
      { name: "dbo" },
      { name: "backup" }
    ],
    "DB_TEST": [
      { name: "dbo" },
      { name: "test" }
    ],
    "DB_QA": [
      { name: "dbo" },
      { name: "qa" }
    ]
  },
  
  // Tablas mock por esquema
  tables: {
    "DB_ANALYTICS.dbo": [
      { name: "TMP_COLA_RUCS" },
      { name: "ANALYTICS_USERS" },
      { name: "METRICS_DASHBOARD" }
    ],
    "DB_ANALYTICS.analytics": [
      { name: "USER_BEHAVIOR" },
      { name: "CONVERSION_RATES" },
      { name: "PERFORMANCE_METRICS" }
    ],
    "DB_BI.dbo": [
      { name: "BI_DASHBOARDS" },
      { name: "KPI_INDICATORS" },
      { name: "REPORTS_CONFIG" }
    ],
    "DB_BI.business_intelligence": [
      { name: "DIM_CUSTOMERS" },
      { name: "FACT_SALES" },
      { name: "DIM_PRODUCTS" }
    ],
    "DB_DW.dbo": [
      { name: "DW_AGGREGATES" },
      { name: "DW_SUMMARIES" }
    ],
    "DB_DW.dimensions": [
      { name: "DIM_TIME" },
      { name: "DIM_GEOGRAPHY" },
      { name: "DIM_CUSTOMERS" }
    ],
    "DB_DW.facts": [
      { name: "FACT_SALES" },
      { name: "FACT_ORDERS" },
      { name: "FACT_INVENTORY" }
    ]
  },
  
  // Campos mock por tabla
  fields: {
    "TMP_COLA_RUCS": [
      { name: "ID" },
      { name: "NOMBRE" },
      { name: "FECHA_CREACION" },
      { name: "ESTADO" },
      { name: "USUARIO_ID" }
    ],
    "ANALYTICS_USERS": [
      { name: "USER_ID" },
      { name: "USERNAME" },
      { name: "EMAIL" },
      { name: "LAST_LOGIN" },
      { name: "ACTIVE" }
    ],
    "METRICS_DASHBOARD": [
      { name: "METRIC_ID" },
      { name: "METRIC_NAME" },
      { name: "VALUE" },
      { name: "TIMESTAMP" },
      { name: "CATEGORY" }
    ],
    "USER_BEHAVIOR": [
      { name: "SESSION_ID" },
      { name: "USER_ID" },
      { name: "PAGE_VIEWS" },
      { name: "DURATION" },
      { name: "ACTIONS" }
    ],
    "BI_DASHBOARDS": [
      { name: "DASHBOARD_ID" },
      { name: "TITLE" },
      { name: "DESCRIPTION" },
      { name: "CREATED_BY" },
      { name: "VISIBILITY" }
    ],
    "DIM_CUSTOMERS": [
      { name: "CUSTOMER_ID" },
      { name: "CUSTOMER_NAME" },
      { name: "EMAIL" },
      { name: "PHONE" },
      { name: "ADDRESS" },
      { name: "CITY" },
      { name: "COUNTRY" }
    ],
    "FACT_SALES": [
      { name: "SALE_ID" },
      { name: "CUSTOMER_ID" },
      { name: "PRODUCT_ID" },
      { name: "QUANTITY" },
      { name: "UNIT_PRICE" },
      { name: "TOTAL_AMOUNT" },
      { name: "SALE_DATE" }
    ]
  }
};

/**
 * Clase para manejar datos mock
 */
class MockDataManager {
  /**
   * Obtiene servidores mock
   */
  static getServers() {
    return MOCK_DATA.servers;
  }
  
  /**
   * Obtiene bases de datos para un servidor específico
   */
  static getDatabases(serverName) {
    return MOCK_DATA.databases[serverName] || [];
  }
  
  /**
   * Obtiene esquemas para una base de datos específica
   */
  static getSchemas(databaseName) {
    return MOCK_DATA.schemas[databaseName] || [];
  }
  
  /**
   * Obtiene tablas para un esquema específico
   */
  static getTables(databaseName, schemaName) {
    const key = `${databaseName}.${schemaName}`;
    return MOCK_DATA.tables[key] || [];
  }
  
  /**
   * Obtiene campos para una tabla específica
   */
  static getFields(tableName) {
    return MOCK_DATA.fields[tableName] || [];
  }
  
  /**
   * Simula delay de red para testing
   */
  static async simulateNetworkDelay(ms = 300) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  
  /**
   * Simula llamada a API con datos mock
   */
  static async mockApiCall(endpoint, payload) {
    await this.simulateNetworkDelay();
    
    // Simular diferentes respuestas según el tipo de consulta
    if (payload.campos.includes('SERVIDOR')) {
      return MOCK_DATA.servers;
    }
    
    if (payload.campos.includes('TABLE_CATALOG')) {
      const serverName = payload.condicion.match(/SERVIDOR = '([^']+)'/)?.[1];
      return this.getDatabases(serverName);
    }
    
    if (payload.campos.includes('TABLE_SCHEMA')) {
      const serverName = payload.condicion.match(/SERVIDOR = '([^']+)'/)?.[1];
      const databaseName = payload.condicion.match(/TABLE_CATALOG = '([^']+)'/)?.[1];
      return this.getSchemas(databaseName);
    }
    
    if (payload.campos.includes('TABLE_NAME')) {
      const databaseName = payload.condicion.match(/TABLE_CATALOG = '([^']+)'/)?.[1];
      const schemaName = payload.condicion.match(/TABLE_SCHEMA = '([^']+)'/)?.[1];
      return this.getTables(databaseName, schemaName);
    }
    
    if (payload.campos.includes('COLUMN_NAME')) {
      const tableName = payload.condicion.match(/TABLE_NAME = '([^']+)'/)?.[1];
      return this.getFields(tableName);
    }
    
    return [];
  }
}

// Exportar para uso en otros módulos
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { MOCK_DATA, MockDataManager };
} else {
  window.MOCK_DATA = MOCK_DATA;
  window.MockDataManager = MockDataManager;
}

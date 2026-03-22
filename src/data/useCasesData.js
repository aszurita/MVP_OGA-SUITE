export const subdominios = [
  { id: 1, nombre: "Adquirencia", casos: 1, icon: "🏦" },
  { id: 2, nombre: "Business Banking", casos: 5, icon: "💼" },
  { id: 3, nombre: "Chapter AI", casos: 1, icon: "🤖" },
  { id: 4, nombre: "Customer care", casos: 4, icon: "🎧" },
  { id: 5, nombre: "Empresas", casos: 3, icon: "🏢" },
  { id: 6, nombre: "GenAI", casos: 1, icon: "✨" },
  { id: 7, nombre: "Gestión de Campañas", casos: 1, icon: "📣" },
  { id: 8, nombre: "Knowledge Base", casos: 1, icon: "📚" },
  { id: 9, nombre: "LOPDP", casos: 1, icon: "🔒" },
  { id: 10, nombre: "Margen Financiero", casos: 3, icon: "📈" },
  { id: 11, nombre: "Martech", casos: 6, icon: "🎯" },
  { id: 12, nombre: "Operaciones de Crédito", casos: 1, icon: "💳" },
  { id: 13, nombre: "Personas naturales", casos: 6, icon: "👤" },
  { id: 14, nombre: "Rentabilidad", casos: 1, icon: "💰" },
  { id: 15, nombre: "Seguros", casos: 3, icon: "🛡️" },
  { id: 16, nombre: "Sin subdominio", casos: 1, icon: "📦" },
  { id: 17, nombre: "Tarjeta Credito", casos: 1, icon: "💳" },
  { id: 18, nombre: "Tesorería", casos: 2, icon: "🏛️" },
];

export const estadisticas = {
  ingresados: 15,
  enProceso: 20,
  enCalidad: 2,
  cerrados: 5,
};

export const casosDeUso = {
  "Business Banking": [
    { id: 1, titulo: "Cliente ha ingresado recientemente a BVE", estado: "EN PROCESO" },
    { id: 2, titulo: "Dashboard Servicios Cash", estado: "EN PROCESO" },
    { id: 3, titulo: "Hub de pagos/cobros :: Tarifas", estado: "INGRESADO" },
    { id: 4, titulo: "Malla de Clientes Precalificados", estado: "INGRESADO" },
    { id: 5, titulo: "Hub de pagos/cobros :: Arquitectura de Tarifas", estado: "INGRESADO" },
  ],
  "Martech": [
    { id: 6, titulo: "Tablero de gestión comercial", estado: "EN PROCESO" },
    { id: 7, titulo: "Segmentación de Clientes", estado: "EN PROCESO" },
    { id: 8, titulo: "Carterización de clientes", estado: "EN PROCESO" },
    { id: 9, titulo: "Funnels CRM", estado: "EN PROCESO" },
    { id: 10, titulo: "Homologar Catálogo CHUBB - BG", estado: "EN PROCESO" },
    { id: 11, titulo: "Benchmark de Tasas", estado: "EN PROCESO" },
  ],
  "Personas naturales": [
    { id: 12, titulo: "Perfil de Atención a Clientes", estado: "EN PROCESO" },
    { id: 13, titulo: "Tablero de Incidentes Databricks", estado: "EN PROCESO" },
    { id: 14, titulo: "Clúster de Atención a Clientes", estado: "EN PROCESO" },
    { id: 15, titulo: "Agentes Virtuales", estado: "EN PROCESO" },
    { id: 16, titulo: "Validación de Datos en Formularios con información Sensible", estado: "EN PROCESO" },
    { id: 17, titulo: "Gestión y Gobernanza de Carga de Datos a Heap", estado: "EN PROCESO" },
  ],
};

export const modalDetalle = {
  titulo: "Segmentación de Clientes",
  estado: "EN PROCESO",
  activo: "sí",
  tipoIniciativa: "BAU",
  detalle: "Clasificación del cliente según la segmentación comercial interna de BG",
  entregable: "Segmentación de clientes para maximizar la relación comercial",
  dominio: "Registro de Clientes",
  subdominio: "Personas naturales",
};

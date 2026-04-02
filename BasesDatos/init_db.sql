PRAGMA foreign_keys = ON;

DROP VIEW IF EXISTS vw_table_summary;
DROP TABLE IF EXISTS metadata_records;

CREATE TABLE metadata_records (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    id1 TEXT,
    codigo TEXT,
    descripcion TEXT,
    detalle TEXT,
    plataforma TEXT,
    servidor TEXT,
    base_datos TEXT,
    esquema TEXT,
    tabla TEXT,
    campo TEXT,
    tipo_dato TEXT,
    largo TEXT,
    permite_null TEXT,
    golden_record TEXT,
    usuario_modificacion_detalle TEXT,
    usuario_modificacion_atributo TEXT,
    fecha_modificacion_detalle TEXT,
    fecha_modificacion_atributo TEXT
);

CREATE INDEX idx_metadata_plataforma ON metadata_records(plataforma);
CREATE INDEX idx_metadata_servidor ON metadata_records(servidor);
CREATE INDEX idx_metadata_base_datos ON metadata_records(base_datos);
CREATE INDEX idx_metadata_esquema ON metadata_records(esquema);
CREATE INDEX idx_metadata_tabla ON metadata_records(tabla);
CREATE INDEX idx_metadata_campo ON metadata_records(campo);
CREATE INDEX idx_metadata_codigo ON metadata_records(codigo);
CREATE INDEX idx_metadata_descripcion ON metadata_records(descripcion);

CREATE VIEW vw_table_summary AS
SELECT
    plataforma,
    servidor,
    base_datos,
    esquema,
    tabla,
    MIN(descripcion) AS descripcion,
    'Temporal' AS clasificacion,
    '0%' AS avance,
    COUNT(*) AS total_campos
FROM metadata_records
GROUP BY plataforma, servidor, base_datos, esquema, tabla;
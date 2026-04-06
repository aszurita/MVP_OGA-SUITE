"""
load_db.py
==========
Parsea Z_INF_TECNICA_LARGA.txt y Z_TABLAS_OFICIALES.txt
y los carga en una base SQLite (oga.db).

Uso:
    python load_db.py                                     # usa rutas por defecto
    python load_db.py --larga ruta/larga.txt --tablas ruta/tablas.txt
    python load_db.py --db otra_ruta.db

Corre también cuando se llama desde la API:  POST /reload
"""

import re
import sqlite3
import time
import argparse
from pathlib import Path

# ── rutas por defecto ────────────────────────────────────────────────────────
DEFAULT_LARGA   = Path(__file__).parent / "data" / "Z_INF_TECNICA_LARGA.txt"
DEFAULT_TABLAS  = Path(__file__).parent / "data" / "Z_TABLAS_OFICIALES.txt"
DEFAULT_DB      = Path(__file__).parent / "oga.db"

DELIMITER = "||"

# ── normalización (igual que el JS original) ─────────────────────────────────
_RE_SPECIAL = re.compile(r"[()\\]")

def _upper_clean(v: str, default: str = " ") -> str:
    """Replica de upperClean del JS: UPPER + strip + quitar ()\\<BR>"""
    if not v:
        return default
    s = v.upper().strip()
    s = _RE_SPECIAL.sub("", s)
    s = s.replace("<BR>", "")
    return s if s else default

def llave_tabla_from_it(row: dict) -> str:
    """Genera llave_tabla desde una fila de Z_INF_TECNICA_LARGA"""
    return "_".join([
        _upper_clean(row.get("servidor",  ""), " "),
        _upper_clean(row.get("esquema",   ""), "DBO"),
        _upper_clean(row.get("base",      ""), " "),
        _upper_clean(row.get("tabla",     ""), " "),
    ])

def llave_tabla_from_to(row: dict) -> str:
    """Genera llave_tabla desde una fila de Z_TABLAS_OFICIALES"""
    return "_".join([
        _upper_clean(row.get("txt_servidor",       ""), " "),
        _upper_clean(row.get("txt_fuente_esquema", ""), "DBO"),
        _upper_clean(row.get("txt_host",           ""), " "),
        _upper_clean(row.get("txt_desc_tabla",     ""), " "),
    ])

def llave_unica(row: dict) -> str:
    """Genera llave_unica campo desde Z_INF_TECNICA_LARGA"""
    return llave_tabla_from_it(row) + "_" + _upper_clean(row.get("campo", ""), " ")


# ── helpers de display (reglas del frontend) ─────────────────────────────────
def clean_codigo(v: str) -> str:
    """Si es '0' o vacío → ''"""
    s = (v or "").strip()
    return "" if s in ("0", "") else s

def clean_descripcion(v: str) -> str:
    """Si es 'NAN', vacío o solo espacios → ''"""
    s = (v or "").strip()
    return "" if s.upper() in ("NAN", "") else s

def clean_largo(v: str) -> str:
    """Si vacío o '-' → '-'"""
    s = (v or "").strip()
    return "-" if s in ("", "-") else s

def clean_detalle(v: str) -> str:
    """Vacío → ''"""
    return (v or "").strip()


# ── parseo de TXT ─────────────────────────────────────────────────────────────
def parse_txt(path: Path) -> tuple[list[str], list[list[str]]]:
    """Devuelve (headers, rows) desde un txt delimitado por ||"""
    text = path.read_text(encoding="utf-8-sig", errors="replace")
    lines = [l for l in text.splitlines() if l.strip()]
    headers = [h.strip() for h in lines[0].split(DELIMITER)]
    rows = [[c.strip() for c in line.split(DELIMITER)] for line in lines[1:]]
    return headers, rows

def rows_to_dicts(headers: list[str], rows: list[list[str]]) -> list[dict]:
    out = []
    n = len(headers)
    for r in rows:
        # padding por si la fila tiene menos columnas que el header
        padded = r + [""] * (n - len(r))
        out.append(dict(zip(headers, padded[:n])))
    return out


# ── DDL ───────────────────────────────────────────────────────────────────────
DDL = """
-- ============================================================
-- TABLA: campos  (fuente: Z_INF_TECNICA_LARGA)
-- ============================================================
CREATE TABLE IF NOT EXISTS campos (
    id                          INTEGER PRIMARY KEY AUTOINCREMENT,
    -- columnas originales del TXT
    id_original                 TEXT,
    codigo                      TEXT,
    descripcion                 TEXT,
    detalle                     TEXT,
    plataforma                  TEXT,
    servidor                    TEXT,
    base                        TEXT,
    esquema                     TEXT,
    tabla                       TEXT,
    campo                       TEXT,
    tipo_dato                   TEXT,
    largo                       TEXT,
    permite_null                TEXT,
    ordinal_position            TEXT,
    golden_record               TEXT,
    usuario_modificacion_detalle    TEXT,
    usuario_modificacion_atributo   TEXT,
    fecha_modificacion_detalle      TEXT,
    fecha_modificacion_atributo     TEXT,
    fecha_modificacion_tabla        TEXT,
    obs_atributo                TEXT,
    -- columnas calculadas / display
    codigo_display              TEXT,   -- limpia: '0' → ''
    descripcion_display         TEXT,   -- limpia: 'NAN' → ''
    largo_display               TEXT,   -- limpia: '' → '-'
    detalle_display             TEXT,
    llave_tabla                 TEXT,   -- join key con tablas
    llave_unica                 TEXT    -- clave compuesta única
);

-- ============================================================
-- TABLA: tablas  (fuente: Z_TABLAS_OFICIALES)
-- ============================================================
CREATE TABLE IF NOT EXISTS tablas (
    id                              INTEGER PRIMARY KEY AUTOINCREMENT,
    id_original                     TEXT,
    -- columnas originales
    txt_desc_tabla                  TEXT,
    descripcion_tabla               TEXT,
    usuario_modificacion_descripcion TEXT,
    fecha_modificacion_descripcion  TEXT,
    descripcion_dominio             TEXT,
    txt_fuente_aprovisionamiento    TEXT,
    txt_servidor                    TEXT,
    txt_host                        TEXT,
    txt_fuente_esquema              TEXT,
    data_owner                      TEXT,
    nombre_data_owner               TEXT,
    usuario_modificacion_do         TEXT,
    fecha_modificacion_do           TEXT,
    data_steward                    TEXT,
    nombre_data_steward             TEXT,
    usuario_modificacion_ds         TEXT,
    fecha_modificacion_ds           TEXT,
    clasificacion                   TEXT,
    usuario_modificacion_clasif     TEXT,
    fecha_modificacion_clasif       TEXT,
    etiquetas                       TEXT,
    usuario_modificacion_etiqueta   TEXT,
    fecha_modificacion_etiqueta     TEXT,
    avance                          TEXT,
    -- clave calculada (join key)
    llave_tabla                     TEXT UNIQUE
);

-- ============================================================
-- ÍNDICES
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_campos_llave_unica  ON campos(llave_unica);
CREATE INDEX IF NOT EXISTS idx_campos_llave_tabla  ON campos(llave_tabla);
CREATE INDEX IF NOT EXISTS idx_campos_servidor     ON campos(servidor);
CREATE INDEX IF NOT EXISTS idx_campos_base         ON campos(base);
CREATE INDEX IF NOT EXISTS idx_campos_tabla        ON campos(tabla);
CREATE INDEX IF NOT EXISTS idx_campos_campo        ON campos(campo);
CREATE INDEX IF NOT EXISTS idx_campos_plataforma   ON campos(plataforma);
CREATE INDEX IF NOT EXISTS idx_campos_codigo       ON campos(codigo);

CREATE INDEX IF NOT EXISTS idx_tablas_llave_tabla  ON tablas(llave_tabla);
CREATE INDEX IF NOT EXISTS idx_tablas_servidor     ON tablas(txt_servidor);
CREATE INDEX IF NOT EXISTS idx_tablas_base         ON tablas(txt_host);
CREATE INDEX IF NOT EXISTS idx_tablas_clasificacion ON tablas(clasificacion);

-- ============================================================
-- VISTA: v_campos  (nivel campo, para el buscador)
-- ============================================================
CREATE VIEW IF NOT EXISTS v_campos AS
SELECT
    c.id,
    c.llave_unica,
    c.llave_tabla,
    -- columnas frontend "Vista nivel campo"
    c.campo,
    c.codigo_display          AS codigo,
    c.descripcion_display     AS atributo,
    c.detalle_display         AS definicion,
    c.plataforma,
    c.servidor,
    c.base,
    c.esquema,
    c.tabla,
    c.tipo_dato               AS tipo,
    c.largo_display           AS largo,
    c.permite_null,
    -- desde tablas_oficiales (join)
    COALESCE(t.txt_fuente_aprovisionamiento, c.plataforma) AS plataforma_oficial,
    COALESCE(t.clasificacion, '')   AS clasificacion,
    COALESCE(t.descripcion_tabla, '') AS descripcion_tabla,
    COALESCE(t.avance, '0')         AS avance,
    -- auditoría
    c.ordinal_position,
    c.golden_record,
    c.usuario_modificacion_detalle,
    c.fecha_modificacion_detalle,
    c.usuario_modificacion_atributo,
    c.fecha_modificacion_atributo
FROM campos c
LEFT JOIN tablas t ON c.llave_tabla = t.llave_tabla
-- Solo registros con servidor, base, plataforma y llave_unica válidos
-- (equivalente al esElementoValido del frontend anterior)
WHERE TRIM(c.servidor)   != '' AND TRIM(c.servidor)   != ' '
  AND TRIM(c.base)       != '' AND TRIM(c.base)       != ' '
  AND TRIM(c.plataforma) != '' AND TRIM(c.plataforma) != ' '
  AND TRIM(c.llave_unica) != '';

-- ============================================================
-- VISTA: v_tablas  (nivel tabla, con hover data owner/steward)
-- Solo tablas registradas en Z_TABLAS_OFICIALES
-- ============================================================
CREATE VIEW IF NOT EXISTS v_tablas AS
SELECT
    t.id,
    t.llave_tabla,
    -- columnas frontend "Vista nivel tabla"
    t.txt_fuente_aprovisionamiento  AS plataforma,
    t.txt_servidor                  AS servidor,
    t.txt_host                      AS base,
    t.txt_fuente_esquema            AS esquema,
    t.txt_desc_tabla                AS tabla,
    t.descripcion_tabla             AS descripcion,
    t.clasificacion,
    t.avance,
    -- hover: data owner / steward
    t.nombre_data_owner,
    t.nombre_data_steward,
    -- extra útil
    t.descripcion_dominio,
    t.etiquetas,
    t.data_owner,
    t.data_steward,
    -- auditoría
    t.usuario_modificacion_descripcion,
    t.fecha_modificacion_descripcion,
    t.usuario_modificacion_do,
    t.fecha_modificacion_do,
    t.usuario_modificacion_ds,
    t.fecha_modificacion_ds,
    t.usuario_modificacion_clasif,
    t.fecha_modificacion_clasif
FROM tablas t
-- Solo tablas con servidor, base y plataforma válidos
WHERE TRIM(t.txt_servidor)                != '' AND TRIM(t.txt_servidor)                != ' '
  AND TRIM(t.txt_host)                    != '' AND TRIM(t.txt_host)                    != ' '
  AND TRIM(t.txt_fuente_aprovisionamiento)!= '' AND TRIM(t.txt_fuente_aprovisionamiento)!= ' '
  AND TRIM(t.llave_tabla)                 != '';

-- ============================================================
-- VISTA: v_tablas_campos
-- Tablas únicas derivadas de Z_INF_TECNICA_LARGA (campos),
-- enriquecidas con metadatos de Z_TABLAS_OFICIALES donde existan.
-- Equivale al arrayCamposDistinct del BuscadorCampos anterior.
-- ============================================================
CREATE VIEW IF NOT EXISTS v_tablas_campos AS
SELECT
    c.llave_tabla,
    COALESCE(t.txt_fuente_aprovisionamiento, c.plataforma) AS plataforma,
    c.servidor,
    c.base,
    c.esquema,
    c.tabla,
    COALESCE(t.descripcion_tabla, '')     AS descripcion,
    COALESCE(t.clasificacion, '')         AS clasificacion,
    COALESCE(t.avance, '0')               AS avance,
    COALESCE(t.nombre_data_owner, '')     AS nombre_data_owner,
    COALESCE(t.nombre_data_steward, '')   AS nombre_data_steward
FROM (
    SELECT DISTINCT
        llave_tabla, plataforma, servidor, base, esquema, tabla
    FROM campos
    WHERE TRIM(servidor)   != '' AND TRIM(servidor)   != ' '
      AND TRIM(base)       != '' AND TRIM(base)       != ' '
      AND TRIM(plataforma) != '' AND TRIM(plataforma) != ' '
      AND TRIM(llave_tabla) != ''
) c
LEFT JOIN tablas t ON c.llave_tabla = t.llave_tabla;
"""


# ── carga ──────────────────────────────────────────────────────────────────────
def load(
    larga_path: Path  = DEFAULT_LARGA,
    tablas_path: Path = DEFAULT_TABLAS,
    db_path: Path     = DEFAULT_DB,
    verbose: bool     = True,
) -> dict:
    t0 = time.time()
    db_path.parent.mkdir(parents=True, exist_ok=True)

    con = sqlite3.connect(str(db_path))
    con.execute("PRAGMA journal_mode=WAL")
    con.execute("PRAGMA synchronous=NORMAL")
    con.execute("PRAGMA cache_size=-64000")   # ~64 MB

    # Eliminar tablas/vistas anteriores para recarga limpia
    con.executescript("""
        DROP VIEW  IF EXISTS v_tablas_campos;
        DROP VIEW  IF EXISTS v_campos;
        DROP VIEW  IF EXISTS v_tablas;
        DROP TABLE IF EXISTS campos;
        DROP TABLE IF EXISTS tablas;
    """)
    con.executescript(DDL)

    # ── Z_TABLAS_OFICIALES ────────────────────────────────────────────────────
    if verbose:
        print(f"[tablas] Leyendo {tablas_path} …")
    h_to, rows_to = parse_txt(tablas_path)
    dicts_to = rows_to_dicts(h_to, rows_to)

    tablas_rows = []
    seen_llave = set()
    for d in dicts_to:
        llave = llave_tabla_from_to(d)
        if llave in seen_llave:
            continue          # deduplicar: queda la primera aparición
        seen_llave.add(llave)
        tablas_rows.append((
            d.get("ID1", ""),
            d.get("txt_desc_tabla", ""),
            d.get("descripcion_tabla", ""),
            d.get("usuario_modificacion_descripcion", ""),
            d.get("fecha_modificacion_descripcion", ""),
            d.get("descripcion_dominio", ""),
            d.get("txt_fuente_aprovisionamiento", ""),
            d.get("txt_servidor", ""),
            d.get("txt_host", ""),
            d.get("txt_fuente_esquema", ""),
            d.get("data_owner", ""),
            d.get("nombre_data_owner", ""),
            d.get("usuario_modificacion_do", ""),
            d.get("fecha_modificacion_do", ""),
            d.get("data_steward", ""),
            d.get("nombre_data_steward", ""),
            d.get("usuario_modificacion_ds", ""),
            d.get("fecha_modificacion_ds", ""),
            d.get("clasificacion", ""),
            d.get("usuario_modificacion_clasif", ""),
            d.get("fecha_modificacion_clasif", ""),
            d.get("etiquetas", ""),
            d.get("usuario_modificacion_etiqueta", ""),
            d.get("fecha_modificacion_etiqueta", ""),
            d.get("avance", ""),
            llave,
        ))

    con.executemany("""
        INSERT INTO tablas (
            id_original, txt_desc_tabla, descripcion_tabla,
            usuario_modificacion_descripcion, fecha_modificacion_descripcion,
            descripcion_dominio, txt_fuente_aprovisionamiento,
            txt_servidor, txt_host, txt_fuente_esquema,
            data_owner, nombre_data_owner, usuario_modificacion_do, fecha_modificacion_do,
            data_steward, nombre_data_steward, usuario_modificacion_ds, fecha_modificacion_ds,
            clasificacion, usuario_modificacion_clasif, fecha_modificacion_clasif,
            etiquetas, usuario_modificacion_etiqueta, fecha_modificacion_etiqueta,
            avance, llave_tabla
        ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
    """, tablas_rows)
    con.commit()
    if verbose:
        print(f"[tablas] {len(tablas_rows):,} filas insertadas.")

    # ── Z_INF_TECNICA_LARGA ───────────────────────────────────────────────────
    if verbose:
        print(f"[campos] Leyendo {larga_path} …")
    h_it, rows_it = parse_txt(larga_path)
    dicts_it = rows_to_dicts(h_it, rows_it)

    campos_rows = []
    seen_unica = set()
    for d in dicts_it:
        lu = llave_unica(d)
        lt = llave_tabla_from_it(d)
        if lu in seen_unica:
            continue          # deduplicar por llave_unica
        seen_unica.add(lu)
        campos_rows.append((
            d.get("ID1", ""),
            d.get("codigo", ""),
            d.get("descripcion", ""),
            d.get("detalle", ""),
            d.get("plataforma", ""),
            d.get("servidor", ""),
            d.get("base", ""),
            d.get("esquema", ""),
            d.get("tabla", ""),
            d.get("campo", ""),
            d.get("tipo_dato", ""),
            d.get("largo", ""),
            d.get("permite_null", ""),
            d.get("ordinal_position", ""),
            d.get("golden_record", ""),
            d.get("usuario_modificacion_detalle", ""),
            d.get("usuario_modificacion_atributo", ""),
            d.get("fecha_modificacion_detalle", ""),
            d.get("fecha_modificacion_atributo", ""),
            d.get("fecha_modificacion_tabla", ""),
            d.get("obs_atributo", ""),
            # display
            clean_codigo(d.get("codigo", "")),
            clean_descripcion(d.get("descripcion", "")),
            clean_largo(d.get("largo", "")),
            clean_detalle(d.get("detalle", "")),
            lt,
            lu,
        ))

    # Insert en lotes de 5000 para no saturar memoria
    BATCH = 5000
    total_c = 0
    for i in range(0, len(campos_rows), BATCH):
        batch = campos_rows[i:i+BATCH]
        con.executemany("""
            INSERT INTO campos (
                id_original, codigo, descripcion, detalle, plataforma,
                servidor, base, esquema, tabla, campo,
                tipo_dato, largo, permite_null, ordinal_position, golden_record,
                usuario_modificacion_detalle, usuario_modificacion_atributo,
                fecha_modificacion_detalle, fecha_modificacion_atributo,
                fecha_modificacion_tabla, obs_atributo,
                codigo_display, descripcion_display, largo_display, detalle_display,
                llave_tabla, llave_unica
            ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
        """, batch)
        con.commit()
        total_c += len(batch)
        if verbose:
            print(f"[campos]  {total_c:,}/{len(campos_rows):,} …", end="\r")

    elapsed = time.time() - t0
    stats = {
        "tablas_rows": len(tablas_rows),
        "campos_rows": total_c,
        "elapsed_s": round(elapsed, 2),
        "db_path": str(db_path),
    }
    con.close()
    if verbose:
        print(f"\n[OK] DB lista en {elapsed:.1f}s -> {db_path}")
    return stats


# ── CLI ────────────────────────────────────────────────────────────────────────
if __name__ == "__main__":
    ap = argparse.ArgumentParser(description="Carga TXT → SQLite para OGA")
    ap.add_argument("--larga",  default=str(DEFAULT_LARGA),  help="Ruta Z_INF_TECNICA_LARGA.txt")
    ap.add_argument("--tablas", default=str(DEFAULT_TABLAS), help="Ruta Z_TABLAS_OFICIALES.txt")
    ap.add_argument("--db",     default=str(DEFAULT_DB),     help="Ruta oga.db")
    args = ap.parse_args()
    load(Path(args.larga), Path(args.tablas), Path(args.db))

"""
main.py  –  OGA FastAPI
========================
Expone la base SQLite (oga.db) generada por load_db.py.

Arrancar:
    uvicorn main:app --reload --port 8000

Swagger UI:   http://localhost:8000/docs
ReDoc:        http://localhost:8000/redoc
"""

import sqlite3
import time
from contextlib import contextmanager
from pathlib import Path
from typing import Optional

from fastapi import FastAPI, Query, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

# ── rutas ─────────────────────────────────────────────────────────────────────
BASE_DIR    = Path(__file__).parent
DB_PATH     = BASE_DIR / "oga.db"
LARGA_PATH  = BASE_DIR / "data" / "Z_INF_TECNICA_LARGA.txt"
TABLAS_PATH = BASE_DIR / "data" / "Z_TABLAS_OFICIALES.txt"

# ── app ───────────────────────────────────────────────────────────────────────
app = FastAPI(
    title="OGA Metadata API",
    description="API sobre Z_INF_TECNICA_LARGA + Z_TABLAS_OFICIALES",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── conexión ──────────────────────────────────────────────────────────────────
@contextmanager
def get_con():
    con = sqlite3.connect(str(DB_PATH), check_same_thread=False)
    con.row_factory = sqlite3.Row
    con.execute("PRAGMA query_only = ON")
    try:
        yield con
    finally:
        con.close()

def rows_to_list(rows) -> list[dict]:
    return [dict(r) for r in rows]


# ── helpers de paginación ─────────────────────────────────────────────────────
def paginate(query: str, params: list, page: int, size: int, con) -> dict:
    count_sql = f"SELECT COUNT(*) FROM ({query})"
    total = con.execute(count_sql, params).fetchone()[0]
    data  = con.execute(f"{query} LIMIT ? OFFSET ?", params + [size, (page-1)*size]).fetchall()
    return {
        "total": total,
        "page": page,
        "size": size,
        "pages": max(1, -(-total // size)),   # ceil
        "data": rows_to_list(data),
    }


# ══════════════════════════════════════════════════════════════════════════════
# ENDPOINTS  /campos
# ══════════════════════════════════════════════════════════════════════════════
@app.get("/campos", tags=["Campos"], summary="Lista de campos (vista nivel campo)")
def get_campos(
    # filtros exactos
    servidor:    Optional[str] = Query(None, description="Filtrar por servidor"),
    base:        Optional[str] = Query(None, description="Filtrar por base"),
    esquema:     Optional[str] = Query(None, description="Filtrar por esquema"),
    tabla:       Optional[str] = Query(None, description="Filtrar por tabla"),
    plataforma:  Optional[str] = Query(None, description="Filtrar por plataforma"),
    clasificacion: Optional[str] = Query(None, description="Filtrar por clasificacion de tabla"),
    # búsqueda libre (campo o definición)
    q: Optional[str] = Query(None, description="Búsqueda libre en campo, atributo o definicion"),
    # paginación
    page: int = Query(1,   ge=1,   description="Número de página"),
    size: int = Query(100, ge=1, le=5000, description="Filas por página"),
):
    """
    Devuelve campos enriquecidos con datos de la tabla oficial (join).

    **Columnas clave devueltas:**
    campo, codigo, atributo, definicion, plataforma, servidor, base,
    esquema, tabla, tipo, largo, permite_null, clasificacion, descripcion_tabla, avance
    """
    where, params = [], []

    if servidor:
        where.append("UPPER(servidor) = UPPER(?)")
        params.append(servidor)
    if base:
        where.append("UPPER(base) = UPPER(?)")
        params.append(base)
    if esquema:
        where.append("UPPER(esquema) = UPPER(?)")
        params.append(esquema)
    if tabla:
        where.append("UPPER(tabla) = UPPER(?)")
        params.append(tabla)
    if plataforma:
        where.append("UPPER(plataforma) = UPPER(?)")
        params.append(plataforma)
    if clasificacion:
        where.append("UPPER(clasificacion) = UPPER(?)")
        params.append(clasificacion)
    if q:
        term = f"%{q.upper()}%"
        where.append("(UPPER(campo) LIKE ? OR UPPER(atributo) LIKE ? OR UPPER(definicion) LIKE ?)")
        params.extend([term, term, term])

    clause = ("WHERE " + " AND ".join(where)) if where else ""
    sql = f"SELECT * FROM v_campos {clause} ORDER BY servidor, base, esquema, tabla, ordinal_position"

    with get_con() as con:
        return paginate(sql, params, page, size, con)


@app.get("/campos/{llave_unica}", tags=["Campos"], summary="Detalle de un campo por llave_unica")
def get_campo(llave_unica: str):
    """
    Devuelve todos los datos de un campo específico.

    Ejemplo de llave_unica: `DATABRICKS_DBO_DEV_GOVERNANCE_SRI_HISTORICO_RUC`
    """
    with get_con() as con:
        row = con.execute(
            "SELECT * FROM v_campos WHERE llave_unica = ?",
            [llave_unica.upper()]
        ).fetchone()
    if not row:
        raise HTTPException(404, f"Campo '{llave_unica}' no encontrado")
    return dict(row)


# ══════════════════════════════════════════════════════════════════════════════
# ENDPOINTS  /tablas
# ══════════════════════════════════════════════════════════════════════════════
@app.get("/tablas", tags=["Tablas"], summary="Lista de tablas (vista nivel tabla)")
def get_tablas(
    servidor:      Optional[str] = Query(None),
    base:          Optional[str] = Query(None),
    esquema:       Optional[str] = Query(None),
    plataforma:    Optional[str] = Query(None, description="txt_fuente_aprovisionamiento"),
    clasificacion: Optional[str] = Query(None, description="OFICIAL | TRABAJO | DESUSO | TEMPORAL"),
    q: Optional[str] = Query(None, description="Búsqueda libre en nombre de tabla o descripcion"),
    page: int = Query(1,  ge=1),
    size: int = Query(50, ge=1, le=2000),
):
    """
    Lista de tablas con plataforma, servidor, base, esquema, descripción,
    clasificación, avance, **data_owner** y **data_steward** (para hover en el frontend).
    """
    where, params = [], []

    if servidor:
        where.append("UPPER(servidor) = UPPER(?)")
        params.append(servidor)
    if base:
        where.append("UPPER(base) = UPPER(?)")
        params.append(base)
    if esquema:
        where.append("UPPER(esquema) = UPPER(?)")
        params.append(esquema)
    if plataforma:
        where.append("UPPER(plataforma) = UPPER(?)")
        params.append(plataforma)
    if clasificacion:
        where.append("UPPER(clasificacion) = UPPER(?)")
        params.append(clasificacion)
    if q:
        term = f"%{q.upper()}%"
        where.append("(UPPER(tabla) LIKE ? OR UPPER(descripcion) LIKE ?)")
        params.extend([term, term])

    clause = ("WHERE " + " AND ".join(where)) if where else ""
    sql = f"SELECT * FROM v_tablas {clause} ORDER BY servidor, base, esquema, tabla"

    with get_con() as con:
        return paginate(sql, params, page, size, con)


@app.get("/tablas/{llave_tabla}", tags=["Tablas"], summary="Detalle de tabla + data owner/steward")
def get_tabla(llave_tabla: str):
    """
    Devuelve todos los metadatos de una tabla, incluyendo
    nombre_data_owner, nombre_data_steward, etiquetas y avance.
    """
    with get_con() as con:
        row = con.execute(
            "SELECT * FROM v_tablas WHERE llave_tabla = ?",
            [llave_tabla.upper()]
        ).fetchone()
    if not row:
        raise HTTPException(404, f"Tabla '{llave_tabla}' no encontrada")
    return dict(row)


@app.get("/tablas/{llave_tabla}/campos", tags=["Tablas"],
         summary="Todos los campos de una tabla específica")
def get_campos_de_tabla(
    llave_tabla: str,
    page: int = Query(1, ge=1),
    size: int = Query(500, ge=1, le=5000),
):
    """Devuelve los campos de una tabla, ordenados por ordinal_position."""
    sql = "SELECT * FROM v_campos WHERE llave_tabla = ? ORDER BY ordinal_position"
    with get_con() as con:
        return paginate(sql, [llave_tabla.upper()], page, size, con)


# ══════════════════════════════════════════════════════════════════════════════
# ENDPOINTS  /servidores  /bases  (facetas para filtros del frontend)
# ══════════════════════════════════════════════════════════════════════════════
@app.get("/facetas/servidores", tags=["Facetas"], summary="Lista de servidores únicos")
def get_servidores():
    with get_con() as con:
        rows = con.execute(
            "SELECT DISTINCT servidor FROM campos WHERE servidor != '' AND servidor != ' ' ORDER BY servidor"
        ).fetchall()
    return [r["servidor"] for r in rows]


@app.get("/facetas/plataformas", tags=["Facetas"], summary="Lista de plataformas únicas")
def get_plataformas():
    with get_con() as con:
        rows = con.execute(
            "SELECT DISTINCT plataforma FROM campos WHERE plataforma != '' AND plataforma != ' ' ORDER BY plataforma"
        ).fetchall()
    return [r["plataforma"] for r in rows]


@app.get("/facetas/clasificaciones", tags=["Facetas"], summary="Clasificaciones disponibles")
def get_clasificaciones():
    with get_con() as con:
        rows = con.execute(
            "SELECT DISTINCT clasificacion FROM tablas WHERE clasificacion != '' AND clasificacion != ' ' ORDER BY clasificacion"
        ).fetchall()
    return [r["clasificacion"] for r in rows]


@app.get("/facetas/arbol", tags=["Facetas"],
         summary="Árbol jerarquico servidor → base → esquema → tablas")
def get_arbol(servidor: Optional[str] = Query(None)):
    """Útil para construir el menú lateral del buscador."""
    where = "WHERE c.servidor != ' '" + (" AND UPPER(c.servidor) = UPPER(?)" if servidor else "")
    params = [servidor] if servidor else []
    sql = f"""
        SELECT DISTINCT c.servidor, c.base, c.esquema, c.tabla, t.clasificacion
        FROM campos c
        LEFT JOIN tablas t ON c.llave_tabla = t.llave_tabla
        {where}
        ORDER BY c.servidor, c.base, c.esquema, c.tabla
    """
    with get_con() as con:
        rows = con.execute(sql, params).fetchall()

    tree: dict = {}
    for r in rows:
        sv = r["servidor"]
        ba = r["base"]
        es = r["esquema"]
        tb = r["tabla"]
        tree.setdefault(sv, {}).setdefault(ba, {}).setdefault(es, [])
        tree[sv][ba][es].append({"tabla": tb, "clasificacion": r["clasificacion"] or ""})
    return tree


# ══════════════════════════════════════════════════════════════════════════════
# ENDPOINT  /reload  (recarga la BD desde los TXT)
# ══════════════════════════════════════════════════════════════════════════════
@app.post("/reload", tags=["Admin"], summary="Recarga la BD desde los TXT")
def reload_db(
    larga:  str = Query(str(LARGA_PATH),  description="Ruta al Z_INF_TECNICA_LARGA.txt"),
    tablas: str = Query(str(TABLAS_PATH), description="Ruta al Z_TABLAS_OFICIALES.txt"),
):
    """
    Elimina y recrea la base de datos completa a partir de los TXT indicados.
    Útil cuando se actualicen los archivos fuente.

    ⚠️ Esta operación bloquea escrituras durante la carga (~30-60 s para archivos grandes).
    """
    from load_db import load
    try:
        stats = load(
            larga_path=Path(larga),
            tablas_path=Path(tablas),
            db_path=DB_PATH,
            verbose=False,
        )
        return {"status": "ok", **stats}
    except FileNotFoundError as e:
        raise HTTPException(400, f"Archivo no encontrado: {e}")
    except Exception as e:
        raise HTTPException(500, str(e))


# ══════════════════════════════════════════════════════════════════════════════
# HEALTH / STATUS
# ══════════════════════════════════════════════════════════════════════════════
@app.get("/status", tags=["Admin"], summary="Estado de la base de datos")
def status():
    if not DB_PATH.exists():
        return {"db": "no_existe", "hint": "Ejecuta POST /reload o load_db.py"}
    with get_con() as con:
        n_campos = con.execute("SELECT COUNT(*) FROM campos").fetchone()[0]
        n_tablas = con.execute("SELECT COUNT(*) FROM tablas").fetchone()[0]
        db_mb    = round(DB_PATH.stat().st_size / 1_048_576, 2)
    return {
        "db": str(DB_PATH),
        "campos": n_campos,
        "tablas": n_tablas,
        "db_size_mb": db_mb,
    }

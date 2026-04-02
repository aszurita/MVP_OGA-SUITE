import math
import sqlite3
from pathlib import Path
from typing import Optional

from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware

BASE_DIR = Path(__file__).resolve().parent
DB_PATH = BASE_DIR / "data" / "metadata.db"

app = FastAPI(title="Metadata Explorer API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def get_conn():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def build_filters(
    plataforma: Optional[str] = None,
    servidor: Optional[str] = None,
    base_datos: Optional[str] = None,
    esquema: Optional[str] = None,
    tabla: Optional[str] = None,
    campo: Optional[str] = None,
    codigo: Optional[str] = None,
    q: Optional[str] = None,
):
    conditions = []
    params = []

    if plataforma:
        conditions.append("plataforma = ?")
        params.append(plataforma)
    if servidor:
        conditions.append("servidor = ?")
        params.append(servidor)
    if base_datos:
        conditions.append("base_datos = ?")
        params.append(base_datos)
    if esquema:
        conditions.append("esquema = ?")
        params.append(esquema)
    if tabla:
        conditions.append("tabla = ?")
        params.append(tabla)
    if campo:
        conditions.append("campo = ?")
        params.append(campo)
    if codigo:
        conditions.append("codigo = ?")
        params.append(codigo)

    if q:
        like = f"%{q}%"
        conditions.append("""
            (
                descripcion LIKE ?
                OR detalle LIKE ?
                OR tabla LIKE ?
                OR campo LIKE ?
                OR servidor LIKE ?
                OR esquema LIKE ?
                OR base_datos LIKE ?
                OR codigo LIKE ?
            )
        """)
        params.extend([like, like, like, like, like, like, like, like])

    where_clause = f"WHERE {' AND '.join(conditions)}" if conditions else ""
    return where_clause, params


@app.get("/health")
def health():
    return {"ok": True}


@app.get("/filters")
def get_filters():
    conn = get_conn()
    cursor = conn.cursor()

    result = {
        "plataformas": [r["plataforma"] for r in cursor.execute("SELECT DISTINCT plataforma FROM metadata_records WHERE plataforma IS NOT NULL ORDER BY plataforma")],
        "servidores": [r["servidor"] for r in cursor.execute("SELECT DISTINCT servidor FROM metadata_records WHERE servidor IS NOT NULL ORDER BY servidor")],
        "bases": [r["base_datos"] for r in cursor.execute("SELECT DISTINCT base_datos FROM metadata_records WHERE base_datos IS NOT NULL ORDER BY base_datos")],
        "esquemas": [r["esquema"] for r in cursor.execute("SELECT DISTINCT esquema FROM metadata_records WHERE esquema IS NOT NULL ORDER BY esquema")],
        "tablas": [r["tabla"] for r in cursor.execute("SELECT DISTINCT tabla FROM metadata_records WHERE tabla IS NOT NULL ORDER BY tabla")],
        "campos": [r["campo"] for r in cursor.execute("SELECT DISTINCT campo FROM metadata_records WHERE campo IS NOT NULL ORDER BY campo LIMIT 500")],
    }

    conn.close()
    return result


@app.get("/metadata/tables")
def get_table_view(
    plataforma: Optional[str] = None,
    servidor: Optional[str] = None,
    base_datos: Optional[str] = Query(None, alias="base"),
    esquema: Optional[str] = None,
    tabla: Optional[str] = None,
    q: Optional[str] = None,
    page: int = 1,
    page_size: int = 20,
):
    conn = get_conn()
    where_clause, params = build_filters(
        plataforma=plataforma,
        servidor=servidor,
        base_datos=base_datos,
        esquema=esquema,
        tabla=tabla,
        q=q,
    )

    count_sql = f"""
        SELECT COUNT(*) AS total
        FROM (
            SELECT 1
            FROM metadata_records
            {where_clause}
            GROUP BY plataforma, servidor, base_datos, esquema, tabla
        ) x
    """
    total = conn.execute(count_sql, params).fetchone()["total"]

    offset = (page - 1) * page_size

    data_sql = f"""
        SELECT
            plataforma,
            servidor,
            base_datos AS base,
            esquema,
            tabla,
            MIN(descripcion) AS descripcion,
            'Temporal' AS clasificacion,
            '0%' AS avance,
            COUNT(*) AS total_campos
        FROM metadata_records
        {where_clause}
        GROUP BY plataforma, servidor, base_datos, esquema, tabla
        ORDER BY plataforma, servidor, base_datos, esquema, tabla
        LIMIT ? OFFSET ?
    """
    rows = conn.execute(data_sql, params + [page_size, offset]).fetchall()
    conn.close()

    return {
        "items": [dict(row) for row in rows],
        "page": page,
        "page_size": page_size,
        "total": total,
        "pages": math.ceil(total / page_size) if page_size else 1,
    }


@app.get("/metadata/fields")
def get_field_view(
    plataforma: Optional[str] = None,
    servidor: Optional[str] = None,
    base_datos: Optional[str] = Query(None, alias="base"),
    esquema: Optional[str] = None,
    tabla: Optional[str] = None,
    campo: Optional[str] = None,
    codigo: Optional[str] = None,
    q: Optional[str] = None,
    page: int = 1,
    page_size: int = 20,
):
    conn = get_conn()
    where_clause, params = build_filters(
        plataforma=plataforma,
        servidor=servidor,
        base_datos=base_datos,
        esquema=esquema,
        tabla=tabla,
        campo=campo,
        codigo=codigo,
        q=q,
    )

    count_sql = f"SELECT COUNT(*) AS total FROM metadata_records {where_clause}"
    total = conn.execute(count_sql, params).fetchone()["total"]

    offset = (page - 1) * page_size

    data_sql = f"""
        SELECT
            id,
            campo,
            codigo,
            descripcion AS atributo,
            detalle AS definicion,
            plataforma,
            servidor,
            base_datos AS base,
            esquema,
            tabla,
            tipo_dato,
            largo,
            permite_null,
            golden_record,
            fecha_modificacion_detalle,
            fecha_modificacion_atributo
        FROM metadata_records
        {where_clause}
        ORDER BY tabla, campo
        LIMIT ? OFFSET ?
    """
    rows = conn.execute(data_sql, params + [page_size, offset]).fetchall()
    conn.close()

    return {
        "items": [dict(row) for row in rows],
        "page": page,
        "page_size": page_size,
        "total": total,
        "pages": math.ceil(total / page_size) if page_size else 1,
    }


@app.get("/metadata/record/{record_id}")
def get_record_detail(record_id: int):
    conn = get_conn()
    row = conn.execute(
        "SELECT * FROM metadata_records WHERE id = ?",
        [record_id]
    ).fetchone()
    conn.close()

    if not row:
        return {"error": "No encontrado"}

    return dict(row)
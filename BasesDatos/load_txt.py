import csv
import sqlite3
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent
DB_PATH = BASE_DIR / "data" / "metadata.db"
TXT_PATH = BASE_DIR / "data" / "Z_INF_TECNICA_FICHAS.txt"
SQL_PATH = BASE_DIR / "init_db.sql"


def init_db():
    conn = sqlite3.connect(DB_PATH)
    with open(SQL_PATH, "r", encoding="utf-8") as f:
        conn.executescript(f.read())
    conn.commit()
    conn.close()


def normalize(value: str):
    if value is None:
        return None
    value = value.strip()
    return value if value != "" else None


def load_data():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    with open(TXT_PATH, "r", encoding="utf-8-sig", newline="") as f:
        reader = csv.reader(f, delimiter="|")
        rows = []

        for raw_row in reader:
            row = [col for col in raw_row if col != ""]
            if not row:
                continue

            if row[0] == "ID1":
                continue

            if len(row) < 18:
                row += [""] * (18 - len(row))
            elif len(row) > 18:
                row = row[:18]

            rows.append(tuple(normalize(col) for col in row))

    cursor.executemany("""
        INSERT INTO metadata_records (
            id1, codigo, descripcion, detalle, plataforma, servidor,
            base_datos, esquema, tabla, campo, tipo_dato, largo,
            permite_null, golden_record, usuario_modificacion_detalle,
            usuario_modificacion_atributo, fecha_modificacion_detalle,
            fecha_modificacion_atributo
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, rows)

    conn.commit()
    conn.close()
    print(f"Carga completada. Registros insertados: {len(rows)}")


if __name__ == "__main__":
    DB_PATH.parent.mkdir(parents=True, exist_ok=True)
    init_db()
    load_data()
# OGA Metadata API — Documentación Técnica

## Estructura del proyecto

```
BasesDatos/
├── load_db.py          # Script de carga TXT → SQLite
├── main.py             # FastAPI app
├── requirements.txt
├── oga.db              # Base de datos generada (no versionar)
└── data/
    ├── Z_INF_TECNICA_LARGA.txt      # Catálogo de campos
    └── Z_TABLAS_OFICIALES.txt       # Metadatos de tablas

MOCKUP-GLOSARIO/Desarrollo/
├── services/
│   └── metadataService.js           # Cliente HTTP del frontend
└── Pages/ExploradorDeMetadatos/
    ├── ExploradorMetadatos.jsx       # Página principal
    ├── components/
    │   ├── MetadataTable.jsx         # Tabla con vistas nivel campo/tabla
    │   ├── SearchBar.jsx
    │   ├── SegmentarDropdown.jsx
    │   └── Pagination.jsx
    └── styles/
        └── ExploradorDeMetadatos.css
```

---

## 1. Instalación y primer arranque

```bash
pip install -r requirements.txt

# 1. Generar la base de datos
python load_db.py

# 2. Arrancar la API
uvicorn main:app --reload --port 8000
```

Swagger UI: `http://localhost:8000/docs`

---

## 2. Fuentes de datos (TXT)

Los archivos TXT están delimitados por `||` y se encuentran en `BasesDatos/data/`.

### 2.1 `Z_INF_TECNICA_LARGA.txt` → Vista nivel **Campo**

Columnas en el TXT y su equivalente en el frontend:

| Columna en TXT      | Campo en BD (`campos`) | Alias en vista `v_campos` | Columna frontend |
|---------------------|------------------------|---------------------------|------------------|
| `campo`             | `campo`                | `campo`                   | Campo            |
| `codigo`            | `codigo` / `codigo_display` | `codigo`             | Código           |
| `descripcion`       | `descripcion` / `descripcion_display` | `atributo` | Atributo     |
| `detalle`           | `detalle` / `detalle_display` | `definicion`       | Definición       |
| `plataforma`        | `plataforma`           | `plataforma`              | Plataforma       |
| `servidor`          | `servidor`             | `servidor`                | Servidor         |
| `base`              | `base`                 | `base`                    | Base             |
| `esquema`           | `esquema`              | `esquema`                 | Esquema          |
| `tabla`             | `tabla`                | `tabla`                   | Tabla            |
| `tipo_dato`         | `tipo_dato`            | `tipo`                    | Tipo             |
| `largo`             | `largo` / `largo_display` | `largo`               | Largo            |
| `permite_null`      | `permite_null`         | `permite_null`            | Permite Null     |

**Reglas de limpieza aplicadas al cargar:**
- `codigo = "0"` → se muestra vacío
- `descripcion = "NAN"` (case-insensitive) → se muestra vacío
- `largo = ""` o `"-"` → se muestra `-`
- `detalle` vacío → se muestra vacío

---

### 2.2 `Z_TABLAS_OFICIALES.txt` → Vista nivel **Tabla**

Columnas en el TXT y su equivalente en el frontend:

| Columna en TXT                   | Campo en BD (`tablas`)          | Alias en vista `v_tablas` | Columna frontend |
|----------------------------------|---------------------------------|---------------------------|------------------|
| `txt_fuente_aprovisionamiento`   | `txt_fuente_aprovisionamiento`  | `plataforma`              | Plataforma       |
| `txt_servidor`                   | `txt_servidor`                  | `servidor`                | Servidor         |
| `txt_host`                       | `txt_host`                      | `base`                    | Base             |
| `txt_fuente_esquema`             | `txt_fuente_esquema`            | `esquema`                 | Esquema          |
| `txt_desc_tabla`                 | `txt_desc_tabla`                | `tabla`                   | Tabla            |
| `descripcion_tabla`              | `descripcion_tabla`             | `descripcion`             | Descripción      |
| `clasificacion`                  | `clasificacion`                 | `clasificacion`           | Clasificación    |
| `avance`                         | `avance`                        | `avance`                  | Avance           |
| `nombre_data_owner`              | `nombre_data_owner`             | `nombre_data_owner`       | *(hover Tabla)*  |
| `nombre_data_steward`            | `nombre_data_steward`           | `nombre_data_steward`     | *(hover Tabla)*  |

**Hover en celda Tabla:** al pasar el cursor sobre el nombre de la tabla en la vista nivel tabla, aparece un tooltip con **Data Owner** y **Data Steward**.

---

## 3. Modelo de datos SQLite

### Tabla `campos` (fuente: `Z_INF_TECNICA_LARGA.txt`)

| Columna                          | Tipo    | Descripción |
|----------------------------------|---------|-------------|
| `id`                             | PK auto | Clave interna |
| `id_original`                    | TEXT    | `ID1` del TXT |
| `codigo`                         | TEXT    | Raw |
| `descripcion`                    | TEXT    | Raw |
| `detalle`                        | TEXT    | Raw |
| `plataforma`                     | TEXT    | — |
| `servidor`                       | TEXT    | — |
| `base`                           | TEXT    | — |
| `esquema`                        | TEXT    | — |
| `tabla`                          | TEXT    | — |
| `campo`                          | TEXT    | — |
| `tipo_dato`                      | TEXT    | — |
| `largo`                          | TEXT    | Raw |
| `permite_null`                   | TEXT    | SI / NO |
| `ordinal_position`               | TEXT    | Posición en tabla |
| `golden_record`                  | TEXT    | — |
| `codigo_display`                 | TEXT    | `"0"` → `""` |
| `descripcion_display`            | TEXT    | `"NAN"` → `""` |
| `largo_display`                  | TEXT    | vacío/`"-"` → `"-"` |
| `detalle_display`                | TEXT    | strip() |
| `llave_tabla`                    | TEXT    | `SERVIDOR_ESQUEMA_BASE_TABLA` |
| `llave_unica`                    | TEXT    | `SERVIDOR_ESQUEMA_BASE_TABLA_CAMPO` |

### Tabla `tablas` (fuente: `Z_TABLAS_OFICIALES.txt`)

| Columna                          | Tipo         | Descripción |
|----------------------------------|--------------|-------------|
| `id`                             | PK auto      | — |
| `id_original`                    | TEXT         | `ID1` del TXT |
| `txt_desc_tabla`                 | TEXT         | Nombre tabla |
| `descripcion_tabla`              | TEXT         | Descripción |
| `txt_fuente_aprovisionamiento`   | TEXT         | Plataforma |
| `txt_servidor`                   | TEXT         | Servidor |
| `txt_host`                       | TEXT         | Base |
| `txt_fuente_esquema`             | TEXT         | Esquema |
| `clasificacion`                  | TEXT         | OFICIAL / TRABAJO / DESUSO / TEMPORAL |
| `avance`                         | TEXT         | 0-100 |
| `data_owner`                     | TEXT         | ID owner |
| `nombre_data_owner`              | TEXT         | Nombre para hover |
| `data_steward`                   | TEXT         | ID steward |
| `nombre_data_steward`            | TEXT         | Nombre para hover |
| `descripcion_dominio`            | TEXT         | — |
| `etiquetas`                      | TEXT         | pipe-separated |
| `llave_tabla`                    | TEXT UNIQUE  | `SERVIDOR_ESQUEMA_BASE_TABLA` (PK lógica de join) |

### Clave de JOIN

```
campos.llave_tabla ←→ tablas.llave_tabla

Construcción:
  UPPER(servidor) + "_" + UPPER(esquema||"DBO") + "_" + UPPER(base) + "_" + UPPER(tabla)
  (caracteres ()\ y <BR> eliminados; vacío → " " o "DBO")
```

---

## 4. Vistas SQLite

### `v_campos` — nivel campo (GET /campos)

JOIN `campos LEFT JOIN tablas ON llave_tabla`.
Expone: `campo`, `codigo`, `atributo`, `definicion`, `plataforma`, `servidor`, `base`, `esquema`, `tabla`, `tipo`, `largo`, `permite_null`, `clasificacion`, `descripcion_tabla`, `avance`, `plataforma_oficial`, `nombre_data_owner`, `nombre_data_steward`.

### `v_tablas` — nivel tabla (GET /tablas)

Expone: `plataforma`, `servidor`, `base`, `esquema`, `tabla`, `descripcion`, `clasificacion`, `avance`, `nombre_data_owner`, `nombre_data_steward`, `descripcion_dominio`, `etiquetas`.

---

## 5. Endpoints de la API (`http://localhost:8000`)

### Campos

| Método | Ruta                          | Descripción |
|--------|-------------------------------|-------------|
| GET    | `/campos`                     | Lista paginada con filtros |
| GET    | `/campos/{llave_unica}`       | Detalle de un campo |

**Filtros de `/campos`:** `servidor`, `base`, `esquema`, `tabla`, `plataforma`, `clasificacion`, `q` (búsqueda libre en campo/atributo/definicion), `page`, `size`

**Respuesta:**
```json
{ "total": 361738, "page": 1, "size": 100, "pages": 3618, "data": [...] }
```

### Tablas

| Método | Ruta                              | Descripción |
|--------|-----------------------------------|-------------|
| GET    | `/tablas`                         | Lista paginada |
| GET    | `/tablas/{llave_tabla}`           | Detalle + data owner/steward |
| GET    | `/tablas/{llave_tabla}/campos`    | Campos de esa tabla |

**Filtros de `/tablas`:** `servidor`, `base`, `esquema`, `plataforma`, `clasificacion`, `q`, `page`, `size`

### Facetas (para filtros del frontend)

| Método | Ruta                        | Devuelve |
|--------|-----------------------------|----------|
| GET    | `/facetas/servidores`       | `["SRV1", "SRV2", ...]` |
| GET    | `/facetas/plataformas`      | `["ANALITICA", ...]` |
| GET    | `/facetas/clasificaciones`  | `["OFICIAL", "TRABAJO", ...]` |
| GET    | `/facetas/arbol`            | Árbol `servidor → base → esquema → [{tabla, clasificacion}]` |

### Admin

| Método | Ruta       | Descripción |
|--------|------------|-------------|
| GET    | `/status`  | Filas en BD, tamaño, ruta |
| POST   | `/reload`  | Recarga la BD desde los TXT |

---

## 6. Frontend — `metadataService.js`

El servicio normaliza la respuesta paginada de la API al formato esperado por el frontend:

```
API:      { total, page, size, pages, data: [...] }
Frontend: { total, page, size, pages, items: [...] }   ← data → items
```

| Función exportada        | Endpoint llamado             |
|--------------------------|------------------------------|
| `checkHealth()`          | `GET /status`                |
| `getFilters()`           | `GET /facetas/servidores` + `/plataformas` + `/clasificaciones` |
| `getTableView(params)`   | `GET /tablas`                |
| `getFieldView(params)`   | `GET /campos`                |
| `getCampoDetalle(llave)` | `GET /campos/{llave_unica}`  |
| `getTablaDetalle(llave)` | `GET /tablas/{llave_tabla}`  |
| `getCamposDeTabla(llave)`| `GET /tablas/{llave_tabla}/campos` |
| `getArbol(servidor?)`    | `GET /facetas/arbol`         |

---

## 7. Frontend — Columnas por vista

### Vista nivel Campo (`viewMode = 'campo'`)

| Columna frontend | Key en dato | Fuente API    |
|------------------|-------------|---------------|
| Campo            | `campo`     | `v_campos`    |
| Código           | `codigo`    | `codigo_display` |
| Atributo         | `atributo`  | `descripcion_display` |
| Definición       | `definicion`| `detalle_display` |
| Plataforma       | `plataforma`| — |
| Servidor         | `servidor`  | — |
| Base             | `base`      | — |
| Esquema          | `esquema`   | — |
| Tabla            | `tabla`     | — |
| Tipo             | `tipo`      | `tipo_dato` |
| Largo            | `largo`     | `largo_display` |
| Permite Null     | `permite_null` | — |

### Vista nivel Tabla (`viewMode = 'tabla'`)

| Columna frontend | Key en dato              | Fuente API |
|------------------|--------------------------|------------|
| Plataforma       | `plataforma`             | `txt_fuente_aprovisionamiento` |
| Servidor         | `servidor`               | `txt_servidor` |
| Base             | `base`                   | `txt_host` |
| Esquema          | `esquema`                | `txt_fuente_esquema` |
| Tabla *(hover)*  | `tabla`                  | `txt_desc_tabla` |
| Descripción      | `descripcion`            | `descripcion_tabla` |
| Clasificación    | `clasificacion`          | — |
| Avance           | `avance`                 | — |
| *(hover)* Data Owner   | `nombre_data_owner`  | — |
| *(hover)* Data Steward | `nombre_data_steward`| — |

---

## 8. Flujo de recarga

```
Opción A (sin API):   python load_db.py
Opción B (con API):   POST /reload
```

Proceso interno:
1. DROP vistas + tablas
2. Recrea DDL (tablas + índices + vistas)
3. Inserta `tablas` (deduplicando por `llave_tabla`)
4. Inserta `campos` en batches de 5 000 (deduplicando por `llave_unica`)

Tiempo estimado: ~17 s para 361 k campos + 39 k tablas.

import sqlite3
import tkinter as tk
from pathlib import Path
from tkinter import messagebox, ttk

BASE_DIR = Path(__file__).resolve().parent
DB_PATH = BASE_DIR / "data" / "metadata.db"
MAX_ROWS = 500


class QueryUI(tk.Tk):
    def __init__(self):
        super().__init__()
        self.title("Consulta SQL (solo SELECT)")
        self.geometry("1180x700")
        self.minsize(980, 600)

        self.status_var = tk.StringVar(value=f"DB: {DB_PATH}")
        self.query_var = tk.StringVar(value="SELECT * FROM metadata_records LIMIT 100;")

        self._build_layout()

    def _build_layout(self):
        container = ttk.Frame(self, padding=12)
        container.pack(fill="both", expand=True)

        title = ttk.Label(container, text="Explorador SQLite - Solo SELECT", font=("Segoe UI", 14, "bold"))
        title.pack(anchor="w")

        subtitle = ttk.Label(
            container,
            text=f"Conectado directo a {DB_PATH}. Se muestran maximo {MAX_ROWS} filas por consulta.",
        )
        subtitle.pack(anchor="w", pady=(0, 10))

        query_frame = ttk.LabelFrame(container, text="Consulta SQL", padding=8)
        query_frame.pack(fill="x")

        self.query_text = tk.Text(query_frame, height=6, wrap="word")
        self.query_text.pack(fill="x", expand=True)
        self.query_text.insert("1.0", self.query_var.get())

        actions = ttk.Frame(query_frame)
        actions.pack(fill="x", pady=(8, 0))

        run_btn = ttk.Button(actions, text="Ejecutar SELECT", command=self.run_query)
        run_btn.pack(side="left")

        clear_btn = ttk.Button(actions, text="Limpiar", command=self.clear_query)
        clear_btn.pack(side="left", padx=(8, 0))

        sample_btn = ttk.Button(actions, text="Ver tablas", command=self.load_tables_query)
        sample_btn.pack(side="left", padx=(8, 0))

        results_frame = ttk.LabelFrame(container, text="Resultados", padding=8)
        results_frame.pack(fill="both", expand=True, pady=(12, 0))

        self.tree = ttk.Treeview(results_frame, show="headings")
        self.tree.pack(side="left", fill="both", expand=True)

        vscroll = ttk.Scrollbar(results_frame, orient="vertical", command=self.tree.yview)
        vscroll.pack(side="right", fill="y")
        self.tree.configure(yscrollcommand=vscroll.set)

        hscroll = ttk.Scrollbar(container, orient="horizontal", command=self.tree.xview)
        hscroll.pack(fill="x")
        self.tree.configure(xscrollcommand=hscroll.set)

        status = ttk.Label(container, textvariable=self.status_var, foreground="#444")
        status.pack(anchor="w", pady=(8, 0))

    def clear_query(self):
        self.query_text.delete("1.0", tk.END)

    def load_tables_query(self):
        sql = (
            "SELECT name AS tabla\n"
            "FROM sqlite_master\n"
            "WHERE type IN ('table', 'view')\n"
            "ORDER BY name;"
        )
        self.query_text.delete("1.0", tk.END)
        self.query_text.insert("1.0", sql)

    def _normalize_sql(self, sql: str) -> str:
        return " ".join(sql.strip().split()).lower()

    def _validate_select_only(self, sql: str) -> bool:
        normalized = self._normalize_sql(sql)
        if not normalized:
            messagebox.showwarning("Consulta vacia", "Escribe una consulta SQL.")
            return False

        if not normalized.startswith("select"):
            messagebox.showerror("No permitido", "Solo se permiten consultas SELECT.")
            return False

        blocked = (" insert ", " update ", " delete ", " drop ", " alter ", " create ", " replace ", " pragma ")
        padded = f" {normalized} "
        if any(token in padded for token in blocked):
            messagebox.showerror("No permitido", "La consulta contiene operaciones no permitidas.")
            return False

        return True

    def run_query(self):
        raw_sql = self.query_text.get("1.0", tk.END).strip()
        if not self._validate_select_only(raw_sql):
            return

        sql = raw_sql.rstrip(";")
        guarded_sql = f"SELECT * FROM ({sql}) LIMIT {MAX_ROWS}"

        try:
            with sqlite3.connect(DB_PATH) as conn:
                conn.row_factory = sqlite3.Row
                cur = conn.cursor()
                rows = cur.execute(guarded_sql).fetchall()
                columns = [desc[0] for desc in cur.description] if cur.description else []
        except sqlite3.Error as exc:
            messagebox.showerror("Error SQL", str(exc))
            self.status_var.set(f"Error: {exc}")
            return

        self._render_results(columns, rows)
        self.status_var.set(f"OK - {len(rows)} fila(s) mostradas")

    def _render_results(self, columns, rows):
        self.tree.delete(*self.tree.get_children())
        self.tree["columns"] = columns

        if not columns:
            return

        for col in columns:
            self.tree.heading(col, text=col)
            self.tree.column(col, width=170, stretch=True, anchor="w")

        for row in rows:
            values = [row[col] for col in columns]
            self.tree.insert("", "end", values=values)


def run():
    if not DB_PATH.exists():
        raise FileNotFoundError(f"No existe la base de datos en: {DB_PATH}")

    app = QueryUI()
    app.mainloop()


if __name__ == "__main__":
    run()

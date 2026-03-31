; (function () {
  const styles = `
@import url("font/simple-line-icons/css/simple-line-icons.css");
:root {
  --accent: #b4005c;
  --accent-soft: #fde6f2;
  --ink: #0f172a;
  --muted: #6b7280;
  --line: #e5e7eb;
  --line-dark: #d0d5dd;
}
* {
  box-sizing: border-box;
}
body {
  margin: 0;
  font-family: "Segoe UI", "Helvetica Neue", Arial, sans-serif;
  background: #f4f6fb;
  color: var(--ink);
}
.report-page {
  max-width: 980px;
  margin: 0 auto;
  padding: 28px 32px 42px;
}
.brand {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
  margin-bottom: 18px;
}
.brand img {
  max-height: 56px;
  width: auto;
  object-fit: contain;
  display: block;
}
.card {
  background: #fff;
  border: 1px solid var(--line);
  border-radius: 16px;
  padding: 20px 24px;
  box-shadow: 0 24px 40px rgba(15, 23, 42, 0.06);
  margin-bottom: 18px;
}
.hero-head {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
  flex-wrap: wrap;
}
.hero-kicker {
  margin: 0;
  font-size: 11px;
  letter-spacing: 0.45em;
  text-transform: uppercase;
  color: #9fa5b1;
}
.hero-copy h1 {
  margin: 6px 0 0;
  font-size: 28px;
  letter-spacing: 0.2px;
  color: #D2006E;
}
.hero-subtitle {
  margin: 6px 0 0;
  color: #6b7280;
  font-size: 14px;
}
.hero-grid {
  margin-top: 18px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(190px, 1fr));
  gap: 12px;
}
.hero-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 14px;
  border: 1px solid var(--line);
  border-radius: 12px;
  background: #fafbff;
  box-shadow: 0 12px 24px rgba(15, 23, 42, 0.06);
}
.hero-icon {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  border: 1px solid var(--line);
  background: #fff;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: var(--hero-icon-color, #b4005c);
}
.hero-icon i {
  font-size: 18px;
}
.hero-card__value {
  margin: 0;
  font-size: 20px;
  font-weight: 700;
}
.hero-card__label {
  margin: 2px 0 0;
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.3em;
  color: #6b7280;
}
.kv-wrap {
  border: 1px solid var(--line);
  border-radius: 12px;
  overflow: hidden;
  background: #fff;
}
.kv-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
}
.kv-table td {
  padding: 10px 14px;
  vertical-align: top;
}
.kv-table tr + tr td {
  border-top: 1px solid #f1f2f6;
}
.kv-table td.k {
  width: 34%;
  background: #f7f8fb;
  font-weight: 600;
  color: #344155;
  white-space: nowrap;
}
.fuentes-table {
  width: 100%;
  border-collapse: collapse;
}
.fuentes-table th,
.fuentes-table td {
  padding: 10px 14px;
  border-bottom: 1px solid #f1f2f6;
}
.fuentes-table th {
  font-size: 12px;
  letter-spacing: normal;
  text-transform: none;
  font-weight: 600;
  color: #6b7280;
  text-align: left;
}
.fuentes-table .fuente-row td {
  font-size: 12px;
}
.term-list {
  margin: 0;
  padding: 0;
}
.term-card {
  padding: 14px 0;
  border-bottom: 1px solid #e5e7eb;
}
.term-card:last-child {
  border-bottom: none;
}
.term-title {
  font-size: 16px;
  margin: 0 0 6px;
}
.term-description {
  font-size: 13px;
  margin: 0;
  color: #4b5563;
}
.block-title {
  font-weight: 700;
  margin-bottom: 12px;
  font-size: 16px;
  color: #D2006E;
}
.double-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 16px;
}
.simple-list {
  list-style: none;
  padding-left: 0;
  margin: 4px 0 0;
}
.simple-list li {
  position: relative;
  padding-left: 14px;
  margin: 6px 0;
}
.simple-list li::before {
  content: '';
  position: absolute;
  left: 0;
  top: 7px;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--accent);
}
.section-subtitle {
  font-size: 12px;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  color: #6b7280;
  margin-bottom: 6px;
}
.muted {
  color: #6b7280;
  font-size: 12px;
}
.small-text {
  font-size: 12px;
  color: #6b7280;
}
.report-signature {
  text-align: center;
  margin-top: 12px;
  font-size: 12px;
  color: var(--muted);
}
.interaction-list {
  list-style: none;
  margin: 0;
  padding: 0;
}
.interaction-item {
  display: flex;
  gap: 10px;
  padding: 10px 0;
  border-bottom: 1px solid #e5e7eb;
}
.interaction-item:last-child {
  border-bottom: none;
}
.interaction-dot {
  width: 10px;
  height: 10px;
  margin-top: 6px;
  border-radius: 50%;
  background: var(--accent);
  flex-shrink: 0;
}
.interaction-body {
  flex: 1;
}
.interaction-text {
  margin: 0;
  font-size: 13px;
  color: #374151;
}
.interaction-msg {
  white-space: pre-wrap;
  word-break: break-word;
  line-height: 1.4;
  font-size: 13px;
}
.interaction-name {
  font-size: 12px;
  font-weight: 600;
}
@media print {
  body {
    background: #fff;
  }
  .card,
  .hero-card {
    box-shadow: none;
  }
  .report-page {
    padding: 16px;
  }
  .card {
    page-break-inside: avoid;
    break-inside: avoid;
    padding: 20px 24px 28px;
    margin-bottom: 18px;
  }
  /* Forzar colores en celdas clave al imprimir */
  .kv-table td.k {
    background: #f7f8fb !important;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
}
`;

  const escapeHtml = (value) => {
    const input = value == null ? "" : String(value);
    return input.replace(/[&<>"']/g, (char) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    }[char]));
  };

  const decodeEntities = (value = "") => {
    const text = value == null ? "" : String(value);
    return text
      .replace(/&amp;/gi, "&")
      .replace(/&lt;/gi, "<")
      .replace(/&gt;/gi, ">")
      .replace(/&quot;/gi, '"')
      .replace(/&#39;/gi, "'")
      .replace(/&#(\d+);/g, (_, dec) => {
        const code = Number(dec);
        return Number.isNaN(code) ? _ : String.fromCharCode(code);
      })
      .replace(/&#x([0-9a-fA-F]+);/g, (_, hex) => {
        const code = parseInt(hex, 16);
        return Number.isNaN(code) ? _ : String.fromCharCode(code);
      });
  };

  const renderList = (items = [], emptyLabel = "Sin datos") => {
    if (!items || !items.length) {
      return `<div class="muted">${escapeHtml(emptyLabel)}</div>`;
    }
    return `<ul class="simple-list">${items
      .filter((item) => item != null && item !== "")
      .map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>`;
  };

  const formatTerm = (item) => {
    if (!item) return null;
    if (typeof item === "object") {
      const title = decodeEntities((item.nombre || item.title || item.nombre_termino || "").toString().trim());
      const description = decodeEntities((item.descripcion || item.desc || item.description || "").toString().trim());
      if (!title && !description) return null;
      return {
        title: title || description || "Término",
        description: description || ""
      };
    }
    const raw = decodeEntities(item.toString().trim());
    if (!raw) return null;

    const separators = [":", "-", "–"];
    let title = raw;
    let description = "";
    for (const sep of separators) {
      const idx = raw.indexOf(sep);
      if (idx > 0) {
        title = raw.slice(0, idx).trim();
        description = raw.slice(idx + 1).trim();
        break;
      }
    }
    return {
      title: title || raw,
      description
    };
  };

  const renderTerminos = (items = [], emptyLabel = "Sin términos asociados") => {
    const normalized = Array.isArray(items)
      ? items.map(formatTerm).filter(Boolean)
      : [];
    if (!normalized.length) {
      return `<div class="muted">${escapeHtml(emptyLabel)}</div>`;
    }
    const rows = normalized.map(({ title, description }) => `
      <div class="term-card">
        <h6 class="term-title mb-1">${escapeHtml(title)}</h6>
        <p class="term-description mb-1 small">${escapeHtml(description || "Sin descripción.")}</p>
      </div>`).join("");
    return `<div class="term-list">${rows}</div>`;
  };

  const renderInteracciones = (items = [], emptyLabel = "No hay interacciones registradas") => {
    const normalized = Array.isArray(items)
      ? items
        .map((item) => {
          if (item == null) return null;
          if (typeof item === "object") {
            const fecha = item.fecha || item.date || "";
            const autor = item.autor || item.author || item.nombre || "";
            const rawMensaje = item.mensaje || item.texto || item.comentario || item.comment || item.descripcion || item.description || "";
            const adj = item.adjunto || item.attachment || "";
            const mensaje = (rawMensaje || "").toString().trim();
            if (!fecha && !autor && !mensaje && !adj) return null;
            return { fecha, autor, mensaje, adj };
          }
          const texto = String(item).trim();
          if (!texto) return null;
          return { fecha: "", autor: "", mensaje: texto, adj: "" };
        })
        .filter(Boolean)
      : [];

    if (!normalized.length) {
      return `<div class="muted">${escapeHtml(emptyLabel)}</div>`;
    }

    normalized.reverse();

    const grupos = [];
    let grupoDiaActual = null;

    // 1. Agrupación por Día y luego por Usuario
    normalized.forEach(({ fecha, autor, mensaje, adj }) => {
      const dia = fecha ? fecha.trim().split(" ").slice(0, 3).join(" ") : "Sin fecha";

      // Si cambiamos de día, creamos un nuevo bloque de día
      if (!grupoDiaActual || grupoDiaActual.dia !== dia) {
        grupoDiaActual = { dia, usuarios: [] };
        grupos.push(grupoDiaActual);
      }

      // Buscamos si el autor ya tiene un bloque en este día
      let grupoAutor = grupoDiaActual.usuarios.find(u => u.autor === autor);

      // Si el autor no ha interactuado este día, le creamos su bloque
      if (!grupoAutor) {
        grupoAutor = { autor, mensajes: [] };
        grupoDiaActual.usuarios.push(grupoAutor);
      }

      // Añadimos el mensaje a la lista de este autor
      grupoAutor.mensajes.push({ mensaje, adj });
    });

    // 2. Generación de HTML
    const rows = grupos.map(grupoDia => {
      // Fila principal del Día
      const headerFila = `
        <tr style="background-color: #f1f3f5; border-bottom: 1px solid #dee2e6;">
          <td colspan="2" style="font-weight: 600; padding: 8px 12px; color: #495057;">
            <i class="simple-icon-calendar mr-2"></i> ${escapeHtml(grupoDia.dia)}
          </td>
        </tr>
      `;

      // Filas por cada Usuario dentro de ese día
      const interaccionesFilas = grupoDia.usuarios.map(grupoAutor => {
        // Apilamos todos los mensajes de este usuario uno debajo del otro
        const mensajesHtml = grupoAutor.mensajes.map(m => {
          const msgHtml = (m.mensaje || "").replace(/\\n/g, "<br>");
          const adjHtml = m.adj ? `<div class="small-text mt-1 text-muted">Adjunto: ${escapeHtml(m.adj)}</div>` : "";
          return `<div class="interaction-msg mb-2">${msgHtml}${adjHtml}</div>`;
        }).join('<hr style="margin: 8px 0; border: 0; border-top: 1px dashed #d7d7d7;">');

        // Generamos la fila de la tabla: Nombre a la izquierda, todos los mensajes a la derecha
        return `
          <tr>
            <td class="k interaction-name" style="width:20%; vertical-align: top; font-weight: 500;">
              ${escapeHtml(grupoAutor.autor || "-")}
            </td>
            <td style="width:80%; vertical-align: top;">
              ${mensajesHtml}
            </td>
          </tr>`;
      }).join("");

      return headerFila + interaccionesFilas;
    }).join("");

    // 3. Renderizamos la tabla (Sin Thead)
    return `
      <div class="kv-wrap">
        <table class="kv-table w-100">
          <tbody>${rows}</tbody>
        </table>
      </div>`;
  };

  const renderFuentesTable = (items = [], emptyLabel = "Sin fuentes registradas") => {
    const normalized = Array.isArray(items)
      ? items.filter((item) => item != null && item !== "")
      : [];
    if (!normalized.length) {
      return `<div class="muted">${escapeHtml(emptyLabel)}</div>`;
    }

    const rowsHtml = normalized.map((item) => {
      const [servidor, base, esquema, tabla, documentacion, calidad] = (item || "").split(".").map((part) => part && part.trim());
      return `
        <tr class="fuente-row">
          <td class="k">${escapeHtml(servidor || "-")}</td>
          <td>${escapeHtml(base || "-")}</td>
          <td>${escapeHtml(esquema || "-")}</td>
          <td>${escapeHtml(tabla || "-")}</td>
          <td>${escapeHtml(documentacion || "-")}</td>
          <td>${escapeHtml(calidad || "-")}</td>
        </tr>`;
    }).join("");

    return `
      <div class="kv-wrap">
        <table class="kv-table fuentes-table">
          <thead>
            <tr>
              <th>Servidor</th>
              <th>Base</th>
              <th>Esquema</th>
              <th>Tabla</th>
              <th>Documentación</th>
              <th>Calidad</th>
            </tr>
          </thead>
          <tbody>${rowsHtml}</tbody>
        </table>
      </div>`;
  };

  window.CasoUsoReportTemplate = {
    styles,
    build({
      title = "Resumen del caso de uso",
      subtitle = "Ficha consolidada del caso de uso.",
      summaryItems = [],
      generalInfo = [],
      responsablesPrincipales = [],
      responsablesAdicionales = [],
      fuentes = [],
      terminos = [],
      interacciones = []
    } = {}) {
      const fixAccents = (text = "") => (text == null ? "" : String(text))
        .replace(/Descripci[�\?]n/gi, "Descripción");

      const safeTitle = (title || "").toString().trim() || "Resumen del caso de uso";
      const safeSubtitle = subtitle || "Información registrada en la ficha del caso de uso.";

      const normalizedSummary = summaryItems.length
        ? summaryItems
        : [
          { label: "Fuentes de aprovisionamiento", value: 0, icon: "simple-icon-layers", accent: "#7c3aed" },
          { label: "Terminos", value: 0, icon: "simple-icon-book-open", accent: "#d97706" },
          { label: "Estructura de dominios", value: 0, icon: "simple-icon-people", accent: "#047857" }
        ];

      const summaryHtml = normalizedSummary.map((item) => `
        <div class="hero-card" style="--hero-icon-color:${item.accent || "#6b7280"}">
          <span class="hero-icon"><i class="${escapeHtml(item.icon || "simple-icon-info")}"></i></span>
          <div>
            <p class="hero-card__value">${escapeHtml(item.value != null ? item.value : "-")}</p>
            <p class="hero-card__label">${escapeHtml(
        item.label === "Fuentes" ? "Fuentes" :
          item.label === "Estructura de dominios" || item.label === "Responsables" ? "Estructura" :
            item.label
      )}</p>
          </div>
        </div>`).join("");

      const generalRowsHtml = (generalInfo.length ? generalInfo : [["Sin datos", ""]])
        .map(([label, value]) => `
          <tr>
            <td class="k">${escapeHtml(fixAccents(label))}</td>
            <td>${escapeHtml(fixAccents(value || "-"))}</td>
          </tr>`).join("");

      const combinedResponsables = [];
      if (responsablesPrincipales.length) {
        combinedResponsables.push(...responsablesPrincipales);
      }
      if (responsablesAdicionales.length) {
        combinedResponsables.push(...responsablesAdicionales.map(({ name, role }) => [role || "-", name || "-"]));
      }
      if (!combinedResponsables.length) {
        combinedResponsables.push(["Responsable", "Sin datos"]);
      }

      const responsablesRowsHtml = combinedResponsables
        .map(([label, value]) => `
          <tr>
            <td class="k" style="width:40%">${escapeHtml(label)}</td>
            <td>${escapeHtml(value || "-")}</td>
          </tr>`).join("");

      const fuentesHtml = renderFuentesTable(fuentes, "Sin fuentes registradas");
      const terminosHtml = renderTerminos(terminos, "Sin términos asociados");
      const interaccionesHtml = renderInteracciones(interacciones, "No hay interacciones registradas");

      return `
        <div class="report-page">
          <header class="brand">
            <img class="logo" src="img/logo_bg_magenta.png" alt="OGA" height: 68px;>
            <img class="logo" src="img/Echo-GQT.png" alt="Governance & Quality" style="
    width: 209px;
    height: 84px;
    padding-left: 98px;
">
          </header>

          <section class="card">
            <div class="hero-head">
              <div class="hero-copy">
                <p class="hero-kicker">Resumen</p>
                <h1>${escapeHtml(safeTitle)}</h1>
                <p class="hero-subtitle">${escapeHtml(safeSubtitle)}</p>
              </div>
            </div>
            <div class="hero-grid">
              ${summaryHtml}
            </div>
          </section>

          <section class="card">
            <div class="block-title">Información general</div>
            <div class="kv-wrap">
              <table class="kv-table">
                <tbody>${generalRowsHtml}</tbody>
              </table>
            </div>
          </section>

          <section class="card">
            <div class="block-title">Estructura de dominios</div>
            <div class="kv-wrap">
              <table class="kv-table">
                <tbody>${responsablesRowsHtml}</tbody>
              </table>
            </div>
          </section>

          <section class="card">
            <div class="block-title">Términos asociados</div>
            <hr style="margin: 8px 0;">
            ${terminosHtml}
          </section>

          <section class="card">
            <div class="block-title">Interacciones</div>
            ${interaccionesHtml}
          </section>

          <section class="card">
            <div class="block-title">Fuentes de aprovisionamiento</div>
            ${fuentesHtml}
          </section>
          <div class="report-signature small-text">Reporte generado por OGA Governance &amp; Quality.</div>
        </div>
      `;
    }
  };
})();

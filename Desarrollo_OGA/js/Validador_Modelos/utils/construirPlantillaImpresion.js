/* ---------------------------------------------------------------
 * construirPlantillaImpresion v1.0 – Look & Feel PRO
 * Portada + Resultados Globales (con semáforo) + Hallazgos + Detalle
 * --------------------------------------------------------------- */
// Helper: primera letra en mayúscula, el resto en minúscula
function capFirstLowerRest(str) {
  const s = (str ?? "").toString().trim();
  return s ? s.charAt(0).toUpperCase() + s.slice(1).toLowerCase() : "";
}


function construirPlantillaImpresion(cab, mapa, nombres, aprobadoPor, observacionAprobacion) {
  /* ======== CONFIG ======== */
  const VARS = {
    accent: "#b4005c",
    accentSoft: "#fde6f2",
    ink: "#202225",
    muted: "#61656b",
    line: "#e6e7ea",
    lineDark: "#cfd3d8",
    success: "#34a853",
    warn: "#f9c642",
    orange: "#f7941d",
    amber: "#ffb300",
    danger: "#e53935",
    pageW: "830px"
  };

  const esPreliminar = !((cab?.fecha_Finalizacion ?? cab?.fecha_Finalizacion_raw ?? "")
    .toString()
    .trim());

  const fechaAprobacionGuardada = (cab?.fecha_aprobacion || cab?.FECHA_APROBACION || "").toString().trim();
  const hoyIso = new Date().toISOString().split("T")[0];
  const fechaAprobacionMostrar = fechaAprobacionGuardada || hoyIso;
  const observacionGuardada = (cab?.observacion_aprobacion || cab?.OBSERVACION_APROBACION || "").toString().trim();
  const observacionMostrar = (observacionAprobacion || "").toString().trim() || observacionGuardada || "-";

  const fmtP = v => v == null ? "-" : `${Number(v).toFixed(0)}%`;
  const fmtS = v => v == null ? "-" : `${Number(v).toFixed(2)}%`;

  function califSeccion(score) {
    const s = Number(score) || 0;
    if (s >= 91) return { txt: "Aprobado; Sin observaciones relevantes", cls: "sem-verde" };
    if (s >= 81) return { txt: "Satisfactorio; Observaciones menores", cls: "sem-amarillo" };
    if (s >= 71) return { txt: "Mejorable; Se deben atender las observaciones identificadas", cls: "sem-naranja" };
    if (s >= 51) return { txt: "Incompleto; Quedan pendiente aclaraciones sobre aspectos relevantes", cls: "sem-ambar" };
    return { txt: "No conforme; se identificaron elementos críticos pendientes por desarrollar.", cls: "sem-rojo" };
  }
  function califFinal(score) {
    const s = Number(score) || 0;
    if (s >= 86) return { txt: "Listo para pasar a la fase siguiente.", cls: "sem-verde" };
    if (s >= 71) return { txt: "Observaciones menores; se deben realizar correcciones menores.", cls: "sem-amarillo" };
    if (s >= 50) return { txt: "Revisión profunda; se regresa el modelo.", cls: "sem-naranja" };
    return { txt: "Modelo no apto para su uso o consumo.", cls: "sem-rojo" };
  }

  /* ============= PORTADA (1ª hoja) ============= */
  const portada = `
  <div class="page portada">
    <header class="brand brand-dual">
  <img
    class="logo left"
    src="http://vamos.bancoguayaquil.com/sitios/informaciongerencial/OGA_Suite/Desarrollo/img/OGA.png"
    alt="Logo izquierdo"
  />
  <img
    class="logo right"
    src="http://vamos.bancoguayaquil.com/sitios/informaciongerencial/OGA_Suite/Desarrollo/img/logo_bg_magenta.png"
    alt="Logo derecho"
  />
</header>

<div class="brand-title">
  <h1>INFORME DE VALIDACIÓN</h1>
  <div class="hairline"></div>
</div>

    <section class="block card datos-card">
  <div class="block-title">Datos del Informe</div>

  <div class="kv-wrap">
    <table class="kv-table">
      <tbody>
        <tr>
          <td class="k">Modelo</td>
          <td>${modeloInfoCompleta?.modelo_analitica || "-"}</td>
        </tr>
        <tr>
          <td class="k">Fecha inicio validación</td>
          <td>${cab?.fecha || "-"}</td>
        </tr>
        <tr>
          <td class="k">Fecha de fin de validación</td>
          <td>${cab?.fecha_Finalizacion || "-"}</td>
        </tr>
        <tr>
          <td class="k">Elaboró</td>
          <td>${nombres} | Governance and Quality COE </td>
        </tr>
      </tbody>
    </table>
  </div>

  <style>
.brand img { height: auto; }

/* ▼ PERILLA #1: altura de logos (pantalla) */
.brand-dual .logo{
  height: 1px !important;
  max-height: none !important;
  width: auto;
  max-width: 40%;         /* evita que cada logo ocupe >40% del ancho */
  object-fit: contain;
  display: block;
}

/* Sube la cabecera lo más posible */
.brand-dual{
  display:flex;
  justify-content:space-between;
  align-items:flex-start;
  gap:16px;
  margin-top: 0px !important; 
  margin-bottom: 6px;
}
.brand-title{ 
margin: 0 0 8px 0; 
padding-top: 30px;
}
.brand-title .hairline{
  height:2px; background:var(--accent); width:140px; margin-top:4px; border-radius:2px;
}

/* Quita la banda o hazla mínima */
.band{ display:none; }  

/* ▼ PERILLA #2: padding superior de la 1ª página (pantalla) */
.page:first-of-type{
  padding-top: 0 !important;  
}

/* Opcional: en pantallas grandes aún un poco más (pero pequeño) */
@media (min-width: 1200px){
  .brand-dual .logo{ height: 72px !important; }
}

/* ===== IMPRESIÓN ===== */
@media print{
  /* ▼ PERILLA #3: margen superior del papel (impresión) */
  @page{ margin: 5mm 10mm 12mm 10mm; } /* top right bottom left */

  .brand-dual .logo{
    height: 90px !important;       /* tamaño de logos al imprimir (pequeño) */
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }

  /* Aún más arriba en la primera página impresa */
  .page:first-of-type{ padding-top: 0 !important; }
  .brand-dual, .brand-title{ break-after: avoid; page-break-after: avoid; }
}
    .datos-card .kv-wrap{
      border:1px solid var(--line);
      border-radius:12px;
      overflow:hidden;
      background:#fff;
    }
    .datos-card .kv-table{ width:100%; border-collapse:separate; border-spacing:0; }
    .datos-card .kv-table td{ padding:10px 12px; vertical-align:top; }
    .datos-card .kv-table tr+tr td{ border-top:1px solid var(--line); }
    .datos-card .kv-table td.k{
      width:36%;
      background:#f7f8fa;
      color:#3b3f46;
      font-weight:700;
      white-space:nowrap;
    }
  </style>
</section>

<section class="block card modelo-card">
  <div class="block-title">Información del Modelo</div>

  <div class="kv-wrap">
    <table class="kv-table">
      <tbody>
        <tr>
          <td class="k">Código</td>
          <td>${modeloInfoCompleta?.codigo_final || "-"}</td>
        </tr>
        <tr>
          <td class="k">Objetivo</td>
          <td>${capFirstLowerRest(modeloInfoCompleta?.objetivo_del_modelo) || "-"}</td>
        </tr>
        <tr>
          <td class="k">Tipo Artefacto</td>
          <td>${capFirstLowerRest(modeloInfoCompleta?.txt_desc_tipo_artefacto) || "-"}</td>
        </tr>
        <tr>
          <td class="k">Uso</td>
          <td>${capFirstLowerRest(modeloInfoCompleta?.txt_desc_uso_modelo) || "-"}</td>
        </tr>
        <tr>
          <td class="k">Ciclo</td>
          <td>${capFirstLowerRest(modeloInfoCompleta?.txt_desc_ciclo_modelo) || "-"}</td>
        </tr>
        <tr>
          <td class="k">Año Creación</td>
          <td>${modeloInfoCompleta?.anio_creacion || "-"}</td>
        </tr>
      </tbody>
    </table>
  </div>

  <style>
    .modelo-card .kv-wrap{
      border:1px solid var(--line);
      border-radius:12px;
      overflow:hidden;
      background:#fff;
    }
    .modelo-card .kv-table{ width:100%; border-collapse:separate; border-spacing:0; }
    .modelo-card .kv-table td{ padding:10px 12px; vertical-align:top; line-height:1.45; }
    .modelo-card .kv-table tr+tr td{ border-top:1px solid var(--line); }
    .modelo-card .kv-table td.k{
      width:28%;
      background:#f7f8fa;
      color:#3b3f46;
      font-weight:700;
      white-space:nowrap;
    }
  </style>
</section>


<section class="block card aprobacion-card">
  <div class="block-title">Aprobación</div>

  <div class="kv-wrap">
    <table class="kv-table">
      <tbody>
        <tr>
          <td class="k">Aprobado Por</td>
          <td>${aprobadoPor || "-"}</td>
        </tr>
        <tr>
          <td class="k">Fecha de Aprobación</td>
          <td>
            ${
              fechaAprobacionGuardada
                ? `${fechaAprobacionGuardada}`
                : `<span class="fecha-aprobacion-preview">${fechaAprobacionMostrar}</span>
                   <span class="fecha-aprobacion-print">AUN NO APROBADO</span>`
            }
          </td>
        </tr>
        <tr>
          <td class="k">Observaciones / Límites</td>
          <td>${observacionMostrar}</td>
        </tr>
      </tbody>
    </table>
  </div>

  <style>
    .aprobacion-card .kv-wrap{
      border:1px solid var(--line);
      border-radius:12px;
      overflow:hidden;
      background:#fff;
    }
    .aprobacion-card .kv-table{ width:100%; border-collapse:separate; border-spacing:0; }
    .aprobacion-card .kv-table td{ padding:10px 12px; vertical-align:top; line-height:1.45; }
    .aprobacion-card .kv-table tr+tr td{ border-top:1px solid var(--line); }
    .aprobacion-card .kv-table td.k{
      width:28%;
      background:#f7f8fa;
      color:#3b3f46;
      font-weight:700;
      white-space:nowrap;
    }
    .aprobacion-card .fecha-aprobacion-print{ display:none; }
    @media print{
      .aprobacion-card .fecha-aprobacion-preview{ display:none; }
      .aprobacion-card .fecha-aprobacion-print{ display:inline; }
    }
  </style>
</section>

    <section class="block">
      <h2 class="h2">PROPÓSITO Y ALCANCE</h2>
      <p class="lead">
        Este informe resume los resultados de la validación independiente realizada al modelo de Score de
        Incentivo, cuyo objetivo es estimar el nivel de uso de las tarjetas de débito para orientar acciones
        comerciales y de retención. La revisión cubrió:
      </p>
      <ol class="ol">
        <li><b>Documentación:</b> Se evalúo la documentación en base a la plantilla compartida con los 
        equipos de analítica, en esta parte se validó que la documentación redactada por el 
        científico de datos sea clara, concisa, estructurada y que cuente con todos los pasos que se 
        siguieron durante el modelado.
        </li>
        <li><b>Validación teórica:</b>  Se analizo la validez de la metodología del modelamiento, así como las 
        técnicas usadas para el desarrollo del modelo.</li>
        <li><b>Validación técnica:</b> Se valido la implementación de todo el proceso de modelamiento que 
        fue documentado, así como la construcción del código, reproducibilidad, técnicas de 
        selección de variables y análisis de variable implementado.</li>
        <li><b>Backtesting y estabilidad:</b> Se valido el análisis de backtesting realizado por el científico de 
        datos, se buscó que el rendimiento del modelo cumpla con los umbrales establecidos, 
        además se verifico que este rendimiento presente estabilidad antes distintas muestras 
        poblacionales.</li>
      </ol>
    </section>
  </div>
  <div class=""></div>`;

  /* ============= RESULTADOS GLOBALES (2ª hoja) ============= */
  const filasGlobales = Object.entries(mapa).map(([secName, data]) => {
    const sc = Number(data?.seccion_score ?? 0);
    const peso = Number(data?.peso_seccion ?? 0);
    const cal = califSeccion(sc); // { txt, cls: "sem-verde|sem-amarillo|sem-naranja|sem-ambar|sem-rojo" }

    return `
      <tr>
        <td class="td-name">${secName}</td>
        <td class="center">${fmtP(peso)}</td>
        <td class="center">
          <span class="score-num ${cal.cls}">${fmtS(sc)}</span>
        </td>
        <td class="td-desc">${cal.txt}</td>
      </tr>`;
  }).join("");



  const finalInfo = califFinal(scoreFinalCabecera);
  const resultadosGlobales = `
  <div class="page">
    <section class="hero card">
      <!-- fila superior: título + chip / badge de score -->
      <div class="hero-head">
        <div class="hero-copy">
          <h2 class="h2">RESULTADOS GLOBALES</h2>
          <div class="chip ${finalInfo.cls}">${finalInfo.txt}</div>
        </div>
        <div class="hero-score">
          <!-- ⬇️ añadimos la clase de semaforización -->
          <div class="badge-score ${finalInfo.cls}">${Number(scoreFinalCabecera || 0).toFixed(2)}%</div>
          <div class="badge-caption">SCORE FINAL</div>
        </div>
      </div>

      <!-- contenido dentro del hero: Rangos de Score Final -->
      <div class="hero-ranges block">
        <table class="table solid ranges">
          <thead>
            <tr>
              <th>Rangos de Score Final</th>
              <th>Descripción</th>
              <th class="center">Semaforización</th>
            </tr>
          </thead>
          <tbody>
            <tr><td class="rango"><span>86% - 100%</span></td><td>Listo para pasar a la fase siguiente.</td><td class="center"><span class="semaforo sem-verde"></span></td></tr>
            <tr><td class="rango"><span>71% - 85%</span></td><td>Observaciones menores; se deben realizar correcciones menores.</td><td class="center"><span class="semaforo sem-amarillo"></span></td></tr>
            <tr><td class="rango"><span>50% - 70%</span></td><td>Revisión profunda; se regresa el modelo.</td><td class="center"><span class="semaforo sem-naranja"></span></td></tr>
            <tr><td class="rango"><span>&lt;50%</span></td><td>Modelo no apto para su uso o consumo.</td><td class="center"><span class="semaforo sem-rojo"></span></td></tr>
          </tbody>
        </table>
      </div>

      <!-- CSS local del bloque -->
      <style>
        /* hero como contenedor vertical e incluye la tabla dentro */
        .hero{ display:block; }
        .hero-head{
          display:flex;
          align-items:center;
          justify-content:space-between;
          gap:16px;
          margin-bottom:10px;
        }
        .hero-ranges{ margin-top:14px; }

        /* ====== HERO HEAD mejorado ====== */
.hero-head{
  display:grid;
  grid-template-columns: minmax(0,1fr) auto; /* título+chip | score */
  align-items:center;                        /* centra verticalmente ambos lados */
  gap:16px;
}

.hero-copy{
  display:inline-flex;
  align-items:baseline;   /* el chip queda alineado con la línea del título */
  gap:12px;
  flex-wrap:wrap;         /* si falta espacio, el chip baja sin romper */
}

.hero-copy .h2{
  margin:0;
  line-height:1.1;
  letter-spacing:.2px;
}

.hero-copy .chip{
  margin-top:2px;         /* leve ajuste óptico */
}

/* Bloque del score (derecha) */
.hero-score{
  display:flex;
  flex-direction:column;
  justify-content:center;
  align-items:flex-end;   /* alinea a la derecha */
  text-align:right;
}

/* Responsive: apila y centra en pantallas estrechas */
@media (max-width: 720px){
  .hero-head{
    grid-template-columns: 1fr;  /* todo en una columna */
    text-align:center;
  }
  .hero-score{
    align-items:center;
    text-align:center;
    margin-top:8px;
  }
  .hero-copy{
    justify-content:center;
  }
}


        /* centrar primera columna de rangos */
        .ranges td.rango { text-align:center; }
        .ranges thead th:first-child { text-align:center; }

        /* ===== Badge SCORE FINAL con semaforización ===== */
        .badge-score{
          display:inline-block;
          padding:10px 20px;
          border-radius:14px;
          font-weight:800;
          font-size:36px;
          letter-spacing:.5px;
          border:1px solid transparent;
        }
        .badge-score.sem-verde{    background:#eaf6ee; border-color:#cce8d6; color:#146c2e; }
        .badge-score.sem-amarillo{ background:#fff9e1; border-color:#f3e6a4; color:#7a5f00; }
        .badge-score.sem-naranja{  background:#fff2e6; border-color:#ffd1a6; color:#8a3d00; }
        .badge-score.sem-ambar{    background:#fff4da; border-color:#ffe3a6; color:#7a4a00; }
        .badge-score.sem-rojo{     background:#ffe9e9; border-color:#f6bcbc; color:#8a0000; }
      </style>
    </section>
    <section class="block">
  <table class="table solid">
    <thead>
      <tr>
        <th>Sección</th>
        <th class="center">Peso</th>
        <th class="center">Score</th>
        <th>Calificación</th>
      </tr>
    </thead>
    <tbody>
      ${filasGlobales}
      <tr class="foot-row">
        <td><b>Score final</b></td>
        <td class="center">—</td>
        <td class="center">
          <span class="score-badge ${finalInfo.cls}">${fmtS(scoreFinalCabecera)}</span>
        </td>
        <td><b>${finalInfo.txt}</b></td>
      </tr>
    </tbody>
  </table>
</section>


    <div class="grid-2">
      <section class="block">
        <h3 class="h3">Rangos de Score para Sección</h3>
        <table class="table solid ranges">
          <thead>
            <tr>
              <th>Rangos de Score para Sección</th>
              <th>Descripción</th>
              <th class="center">Semaforización</th>
            </tr>
          </thead>
          <tbody>
            <tr><td class="rango"><span>91% - 100%</span></td><td><b>Aprobado;</b> Sin observaciones relevantes</td><td class="center"><span class="semaforo sem-verde"></span></td></tr>
            <tr><td class="rango"><span>81% - 90%</span></td><td><b>Satisfactorio;</b> Observaciones menores;</td><td class="center"><span class="semaforo sem-amarillo"></span></td></tr>
            <tr><td class="rango"><span>71% - 80%</span></td><td><b>Mejorable;</b> Se deben atender las observaciones identificadas</td><td class="center"><span class="semaforo sem-naranja"></span></td></tr>
            <tr><td class="rango"><span>51% - 70%</span></td><td><b>Incompleto;</b> Quedan pendiente aclaraciones sobre aspectos relevantes</td><td class="center"><span class="semaforo sem-ambar"></span></td></tr>
            <tr><td class="rango"><span>&lt;50%</span></td><td><b>No conforme;</b> se identificaron elementos críticos pendientes por desarrollar.</td><td class="center"><span class="semaforo sem-rojo"></span></td></tr>
          </tbody>
        </table>
      </section>

      
    </div>
  </div>
  <div class=""></div>`;

  /* ============= HALLAZGOS DETALLADOS (3ª hoja) ============= */
  const pick = (obj, keys = []) => {
    for (const k of keys) {
      const v = obj?.[k];
      if (typeof v === "string" && v.trim()) return v.trim();
      if (Array.isArray(v) && v.length) return v.join("; ").trim();
    }
    return "—";
  };
  const bulletsFrom = (value) => {
    if (Array.isArray(value)) return value;
    if (typeof value === "string") {
      const parts = value.split(/\r?\n|•|;/).map(s => s.trim()).filter(Boolean);
      return parts.length ? parts : [];
    }
    return [];
  };

  const pilarDefs = [
    { label: "Documentación", obsKey: "obs_seccion1" },
    { label: "Validación teórica", obsKey: "obs_seccion2" },
    { label: "Validación técnica", obsKey: "obs_seccion3" },
    { label: "Backtesting y estabilidad", obsKey: "obs_seccion4" },
  ];

  const filasHallazgos = pilarDefs.map(({ label, obsKey }) => {
    const raw = (cab?.[obsKey] ?? "").toString().trim();

    // ¿Es HTML enriquecido?
    const isHTML = /<\/?[a-z][\s\S]*>/i.test(raw); // tags como <p>, <table>, <ul>, etc.

    // Si es HTML lo insertamos tal cual; si no, hacemos bullets por líneas/; / •
    const items = !isHTML ? bulletsFrom(raw) : [];
    const contenido = isHTML
      ? `<div class="rte-content">${raw}</div>`
      : (items.length
        ? `<ul class="bullets">${items.map(i => `<li>${i}</li>`).join("")}</ul>`
        : (raw ? `<div>${raw}</div>` : `<div class="muted">—</div>`));

    return `
      <tr>
        <td class="pilar"><span class="pilar-tag">${label}</span></td>
        <td class="obs">${contenido}</td>
      </tr>`;
  }).join("");

  //const listaGenerales = bulletsFrom(cab?.observaciones_generales ?? cab?.obs_general ?? cab?.observaciones);

  const rawGeneral = (cab?.observaciones ?? "").toString().trim();
  const isHTMLGeneral = /<\/?[a-z][\s\S]*>/i.test(rawGeneral);
  const obsGeneralRender = isHTMLGeneral
    ? `<div class="rte-content">${rawGeneral}</div>`
    : (rawGeneral
      ? `<div class="rte-content"><p>${rawGeneral.replace(/\n/g, "<br>")}</p></div>`
      : `<div class="muted">—</div>`);


  const hallazgosDetallados = `
  <div class="page">
    <h2 class="h2 with-pill"><span>HALLAZGOS DETALLADOS</span></h2>
    <table class="table solid hallazgos">
      <thead>
        <tr><th style="width:220px;">Pilar</th><th>Observaciones</th></tr>
      </thead>
      <tbody>${filasHallazgos}</tbody>
    </table>

    <section class="block obs-generales">
      ${obsGeneralRender}
    </section>
  </div>
  <div class=""></div>`;

  /* ============= DETALLE Y RESULTADOS (4ª hoja+) ============= */
  const secToCol = {
    "Revisión Documentación": "obs_seccion1",
    "Validación Teórica": "obs_seccion2",
    "Validación Técnica": "obs_seccion3",
    "Backtesting y Estabilidad": "obs_seccion4"
  };

  /* =================== HTML =================== */
  return `<!DOCTYPE html>
  <html lang="es">
  <head>
    <meta charset="utf-8">
    <title>Validación – Informe</title>
    <style>
      :root{
        --accent:${VARS.accent};
        --accentSoft:${VARS.accentSoft};
        --ink:${VARS.ink};
        --muted:${VARS.muted};
        --line:${VARS.line};
        --lineDark:${VARS.lineDark};
      }
      @media print {
        body{-webkit-print-color-adjust:exact}
        .page-break{page-break-after:always;break-after:page;}
        .card{box-shadow:none}
      }
      body{margin:0;font-family:Helvetica,Arial,sans-serif;color:var(--ink);background:#fff}
      .page{max-width:${VARS.pageW};margin:0 auto;padding:10px}
      .muted{color:var(--muted)}
      .band{height:8px;background:linear-gradient(90deg,var(--accent),#ff7aa8)}
      .brand{display:flex;align-items:center;gap:14px;margin:16px 0 18px 0}
      .brand img{height:36px}
      .logo-dot{width:36px;height:36px;border-radius:50%;background:var(--accent)}
      .brand-meta .hairline{height:2px;background:var(--accent);width:140px;margin-top:6px;border-radius:2px}
      h1{margin:0;font-size:28px;letter-spacing:.3px;color:var(--accent)}
      .h2{margin:0 0 12px 0;color:var(--accent);font-size:20px;letter-spacing:.2px}
      .h3{margin:0 0 8px 0;color:var(--ink);font-size:16px}
      .with-pill span{padding:6px 10px;border-radius:999px}
      .lead{color:var(--muted);margin:6px 0 10px 0}
      .lead{
        text-align: justify;
        text-justify: inter-word;     /* soporte limitado, pero no estorba */
        hyphens: auto;
        -webkit-hyphens: auto;
        -ms-hyphens: auto;
      }

      .ol,
      .ol li{
        text-align: justify;
        text-justify: inter-word;
        hyphens: auto;
        -webkit-hyphens: auto;
        -ms-hyphens: auto;
      }
      .ol{margin:8px 0 0 18px}
      .ol li{margin:6px 0}
      .block{margin:14px 0}
      .card{background:#fff;border:1px solid var(--line);border-radius:12px;padding:16px 16px;box-shadow:0 6px 20px rgba(0,0,0,.06)}
      .block-title{font-weight:700;color:var(--ink);margin-bottom:10px}
      .meta-grid{display:grid;grid-template-columns:1fr;gap:6px}
      .meta-grid.two{grid-template-columns:1fr 1fr}
      .meta-grid b{color:var(--ink)}

      .wm-preliminar{
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%) rotate(-45deg);
    font-size: 120px;
    font-weight: 800;
    letter-spacing: 4px;
    color: #B4005C;            /* magenta brand */
    opacity: .10;              /* más tenue para no tapar el texto */
    mix-blend-mode: multiply;  /* se integra mejor con el contenido */
    z-index: 999999;           /* ⬅️ por ENCIMA de todo */
    pointer-events: none;
    user-select: none;
    white-space: nowrap;
  }

  .print-wrap { position: relative; /* z-index: 1;  ⬅️ quítalo si lo tenías */ }

  @media print {
    .wm-preliminar{
      opacity: .16; /* un poco más visible en impresión */
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
  }

      /* HERO SCORE */
      .hero{display:flex;align-items:center;justify-content:space-between;gap:16px}
      .hero-copy{display:flex;align-items:center;gap:12px}
      .chip{padding:6px 10px;border-radius:999px;font-size:12px;color:#1f1f1f;background:#f1f1f1;border:1px solid var(--lineDark)}
      .chip.sem-verde{background:#eaf6ee;border-color:#cce8d6}
      .chip.sem-amarillo{background:#fff9e1;border-color:#f3e6a4}
      .chip.sem-naranja{background:#fff2e6;border-color:#ffd1a6}
      .chip.sem-ambar{background:#fff4da;border-color:#ffe3a6}
      .chip.sem-rojo{background:#ffe9e9;border-color:#f6bcbc}
      .hero-score{
        text-align:center;
        display:flex;
        flex-direction:column;
        align-items:center; /* centra badge y caption */
      }
      .badge-score{display:inline-block;padding:10px 20px;border-radius:14px;background:var(--accent);color:#fff;font-weight:800;font-size:36px;letter-spacing:.5px}
      .badge-caption{font-size:12px;color:var(--muted);margin-top:4px}

      /* TABLAS */
      table{width:100%;border-collapse:collapse}
      .table.solid th,.table.solid td{border:1px solid var(--line)}
      .table.solid thead th{background:#f7f8fa;color:#3b3f46;font-size:12px;padding:10px}
      .table.solid tbody td{padding:10px;vertical-align:top}
      .table .td-name{font-weight:600}
      .table .td-desc{max-width:420px}
      .table tbody tr:nth-child(even) td{background:#fcfcfd}
      .foot-row td{border-top:2px solid var(--lineDark);background:#fff}

      /* SCORE (sin barra) */
.score-num{
  display:inline-block;
  font-weight:800;
  font-size:14px;
  line-height:1;
  padding:6px 10px;
  border-radius:10px;
  border:1px solid transparent;
}

/* Colores por rango (secciones) */
.score-num.sem-verde{    background:#eaf6ee; border-color:#cce8d6; color:#146c2e; }
.score-num.sem-amarillo{ background:#fff9e1; border-color:#f3e6a4; color:#7a5f00; }
.score-num.sem-naranja{  background:#fff2e6; border-color:#ffd1a6; color:#8a3d00; }
.score-num.sem-ambar{    background:#fff4da; border-color:#ffe3a6; color:#7a4a00; }
.score-num.sem-rojo{     background:#ffe9e9; border-color:#f6bcbc; color:#8a0000; }

/* Badge del Score Final (misma paleta) */
.score-badge{
  display:inline-block;
  padding:6px 10px;
  border-radius:10px;
  font-weight:800;
  border:1px solid transparent;
}
.score-badge.sem-verde{    background:#eaf6ee; border-color:#cce8d6; color:#146c2e; }
.score-badge.sem-amarillo{ background:#fff9e1; border-color:#f3e6a4; color:#7a5f00; }
.score-badge.sem-naranja{  background:#fff2e6; border-color:#ffd1a6; color:#8a3d00; }
.score-badge.sem-ambar{    background:#fff4da; border-color:#ffe3a6; color:#7a4a00; }
.score-badge.sem-rojo{     background:#ffe9e9; border-color:#f6bcbc; color:#8a0000; }


      /* RANGOS estilo imagen */
      .ranges td.rango span{color:var(--accent);font-weight:800}
      .semaforo{display:inline-block;width:16px;height:16px;border-radius:50%;box-shadow:inset 0 0 0 3px #fff, 0 0 0 2px rgba(0,0,0,.06)}
      .sem-verde{background:${VARS.success}}
      .sem-amarillo{background:${VARS.warn}}
      .sem-naranja{background:${VARS.orange}}
      .sem-ambar{background:${VARS.amber}}
      .sem-rojo{background:${VARS.danger}}
      .ranges td.rango { 
        text-align: center; 
      }
      .ranges thead th:first-child {
        text-align: center;
      }

      /* HALLAZGOS */
      .hallazgos .pilar{width:220px}
      .pilar-tag{display:inline-block;color:var(--ink);padding:6px 10px;border-radius:10px;font-weight:700}
      .callout{border:1px dashed var(--lineDark);border-radius:10px;padding:10px 12px;margin:6px 0}
      .callout.ok{background:#f3fbf5}
      .callout.warn{background:#fff9f0}
      .bullets{margin:6px 0 0 18px}
      .bullets li{margin:6px 0}

      /* DETALLE */
      .sec-head h4{margin:0;font-size:15px}
      .sec-head td{background:#f6f7f9}
      .sub-row td{background:#fff}
      .indent-1{padding-left:18px}
      .indent-2{padding-left:36px}
      .indent-3{padding-left:54px}
      .right{text-align:right}
      .center{text-align:center}
      .small{font-size:11px;color:var(--muted)}

      .card-model{
        padding: 20px 20px;
        min-height: 191px;              /* ← más alto */
      }

      /* Grid con más aire y buena rotura de palabras */
      .info-model-grid{
        row-gap: 12px;
        column-gap: 28px;
      }
      .info-model-grid > div{
        line-height: 1.45;
        word-break: break-word;         /* por si hay textos muy largos */
      }

      /* Objetivo a ancho completo */
      .info-model-grid .full{
        grid-column: 1 / -1;
      }

      /* En impresión puedes expandir aún más si hace falta */
      @media print{
        .card-model{ min-height: 191px; }
      }
      .rte-content { font-size: 13px; color: var(--ink); line-height: 1.45; word-break: break-word; }
      .rte-content p { margin: 6px 0; }
      .rte-content ul, .rte-content ol { margin: 6px 0 6px 18px; }
      .rte-content h1, .rte-content h2, .rte-content h3,
      .rte-content h4, .rte-content h5, .rte-content h6 { margin: 8px 0 6px; }

      .rte-content table { width: 100%; border-collapse: collapse; margin: 8px 0 12px; }
      .rte-content th, .rte-content td { border: 1px solid var(--line); padding: 6px 8px; vertical-align: top; }
      .rte-content thead th { background: #f7f8fa; }
      .rte-content img { max-width: 100%; height: auto; display: inline-block; }

      /* Evitar cortes feos al imprimir */
      @media print {
        .hallazgos tr { break-inside: avoid; page-break-inside: avoid; }
        .rte-content table { break-inside: avoid; page-break-inside: avoid; }
      }

      /* Botones de edición (no imprimen) */
.no-print .btn{
  border:1px solid var(--lineDark);
  background:#fff;
  padding:6px 10px;
  border-radius:8px;
  font-size:12px;
  cursor:pointer;
}
.no-print .btn:hover{ background:#f7f8fa }

/* Celdas/viñetas editables con placeholder */
[contenteditable="true"]:empty:before{
  content: attr(data-placeholder);
  color: var(--muted);
}
[contenteditable="true"]{
  outline: none;
}
.acciones-table td[contenteditable="true"]{
  min-height: 28px;
}

/* Lista editable con buen espaciado */
.editable-list li{
  margin:6px 0;
  min-height:20px;
}

/* Ocultar controles en impresión */
@media print{
  .no-print{ display:none !important; }
}

/* Botón flotante de imprimir */
.print-fab{
  position: fixed;
  right: 24px;
  bottom: 24px;
  z-index: 9999;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 14px;
  border-radius: 999px;
  border: 1px solid var(--lineDark);
  background: var(--accent);
  color: #fff;
  font-weight: 700;
  box-shadow: 0 6px 16px rgba(0,0,0,.18);
  cursor: pointer;
  transition: transform .08s ease, box-shadow .2s ease, opacity .2s ease;
}
.print-fab:hover{ transform: translateY(-1px); box-shadow: 0 8px 22px rgba(0,0,0,.20); }
.print-fab:active{ transform: translateY(0); }
.print-fab .ico{ font-size: 16px; line-height: 1; }

/* Mini badge para el score por sección (mismo look del SCORE FINAL) */
.badge-score--sm{
  display:inline-block;
  padding:6px 10px;
  border-radius:10px;
  background:var(--accent);
  color:#fff;
  font-weight:800;
  font-size:14px;
  line-height:1;
}

@media print{
  .print-fab{ display:none !important; } /* no se imprime */
}

    </style>
  </head>
  <body>
    ${esPreliminar ? `<div class="wm-preliminar">PRELIMINAR</div>` : ""}
    <div class="print-wrap" style="max-width:830px;margin:auto;padding:30px;">
    ${portada}
    ${resultadosGlobales}
    ${hallazgosDetallados}
    <button id="printFab" class="print-fab no-print" title="Imprimir">
      <span class="ico">🖨️</span> Imprimir
    </button>
  </div>

    <script>
    // Botón Imprimir
      const btnPrint = document.getElementById('printFab');
      if (btnPrint){
        btnPrint.addEventListener('click', () => window.print());
      }

      (function(){
        // Agregar fila en Recomendaciones
        const btnFila = document.getElementById('btnAddFila');
        const tbody   = document.getElementById('accionesBody');
        if(btnFila && tbody){
          btnFila.addEventListener('click', () => {
            const tr = document.createElement('tr');
            tr.innerHTML = \`
              <td contenteditable="true" data-placeholder="Describe la acción…"></td>
              <td contenteditable="true" data-placeholder="Alto / Medio / Bajo…"></td>
              <td contenteditable="true" data-placeholder="Ej: 30 días / Q4 2025…"></td>\`;
            tbody.appendChild(tr);
            // foco en la primera celda nueva
            tr.querySelector('td[contenteditable]').focus();
          });
        }

        // Agregar viñeta en Próximos pasos
        const btnPaso = document.getElementById('btnAddPaso');
        const list    = document.getElementById('pasosList');
        if(btnPaso && list){
          btnPaso.addEventListener('click', () => {
            const li = document.createElement('li');
            li.setAttribute('contenteditable','true');
            li.setAttribute('data-placeholder','Escribe un paso…');
            list.appendChild(li);
            li.focus();
          });
        }
      })();
    </script>
  </body>
  </html>`;
}

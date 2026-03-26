// Floating chatbot widget for OGA Suite (Buen Dato).
// Persist conversation across pages (localStorage) and answer by intents/keywords.
(function (window, document) {
  "use strict";

  if (window.ogaChatbot) return;

  const defaultConfig = {
    title: "Buen Dato",
    subtitle: "Asistente virtual OGA",
    placeholder: "Escribe o elige una pregunta...",
    welcomeMessage: "Hola, soy Buen Dato, tu asistente de OGA Suite. En que te puedo ayudar hoy?",
    emptyResponse: "Gracias por tu mensaje. Estamos preparando el servicio de chat.",
    quickReplies: [
      "Donde creo un caso de uso?",
      "Como crear un atributo?",
      "Como crear/ver un termino?",
      "Como buscar o filtrar campos?",
      "Puedo exportar a Excel?",
      "Quien contacta si falta un campo?",
      "Como asigno etiquetas/dominio?",
      "Donde veo favoritos o tablas oficiales?"
    ],
  };

  const theme = {
    primary: "#1b1a43",
    primaryAlt: "#393b69",
    accent: "#6fc9e3",
    surface: "#d9f1f8",
    borderSoft: "rgba(27, 26, 67, 0.14)",
    borderSofter: "rgba(27, 26, 67, 0.08)",
  };

  const DATASET_URL = "https://vamos.bancoguayaquil.com/sitios/informaciongerencial/OGA_Suite/Produccion/datasets-txt/Z_TABLAS_OFICIALES.txt";

  // Catálogo de intents en un JSON centralizado (frases + respuesta)
  const intentsCatalog = [
    {
      id: "caso-uso",
      response:
        'Para crear o gestionar un caso de uso ingresa a <a href="CasosDeUso.aspx" target="_blank">CasosDeUso</a>. Ahi puedes registrar y editar casos.',
      phrases: ["caso de uso", "casos de uso", "nuevo caso", "crear caso", "donde creo un caso de uso"]
    },
    {
      id: "atributo",
      response:
        'Para crear un atributo usa <a href="Ficha_Atributo.aspx" target="_blank">Ficha_Atributo</a> y sigue el formulario de alta.',
      phrases: ["atributo", "nuevo atributo", "crear atributo", "alta de atributo"]
    },
    {
      id: "termino",
      response:
        'Consulta o crea terminos en <a href="Dominio_terminos_atributos.aspx" target="_blank">Dominio_terminos_atributos</a>. Tambien puedes revisar el glosario en <a href="Glosario.aspx" target="_blank">Glosario</a>.',
      phrases: ["termino", "terminos", "glosario", "termino glosario", "crear termino", "ver termino", "buscar termino"]
    },
    {
      id: "buscar-campos",
      response:
        'Para buscar campos usa el buscador en <a href="BuscadorCampos.aspx" target="_blank">BuscadorCampos</a>. Filtra por dominio, sistema o nombre y luego exporta si lo necesitas.',
      phrases: ["buscar campos", "filtrar campos", "buscador de campos", "filtro campos", "como buscar un campo"]
    },
    {
      id: "exportar",
      response:
        'En <a href="BuscadorCampos.aspx" target="_blank">BuscadorCampos</a> ejecuta tu busqueda y usa el boton de exportar para descargar a Excel.',
      phrases: ["export", "excel", "descargar", "exportar", "exportar a excel", "bajar a excel"]
    },
    {
      id: "contacto",
      response:
        'Si falta un campo o informacion, contacta al equipo de gobierno de datos o abre un ticket con soporte indicando el dominio y el campo que necesitas.',
      phrases: ["contacto", "falta un campo", "falta un atributo", "reportar", "a quien contacto"]
    },
    {
      id: "etiqueta-dominio",
      response:
        'Para asignar dominio/etiquetas, edita el campo o atributo en su ficha correspondiente (por ejemplo <a href="Ficha_Atributo" target="_blank">Ficha_Atributo</a>) y selecciona los valores en los selectores.',
      phrases: ["etiqueta", "dominio", "asignar etiqueta", "asignar dominio", "como etiquetar"]
    },
    {
      id: "favoritos",
      response:
        'Puedes ver tus tablas oficiales y favoritos en la vista principal de OGA Suite (si tu perfil las tiene habilitadas). Revisa el modulo de Tablas Oficiales y tus favoritos en el menu principal.',
      phrases: ["favoritos", "tablas oficiales", "mis tablas", "ver favoritos", "donde veo favoritos"]
    }
  ];

  let state = {
    isOpen: false,
    initialized: false,
    config: { ...defaultConfig },
    messages: [],
    datasetReady: false,
    datasetRecords: [],
    datasetLoading: false,
    datasetError: false,
    datasetReadyNotified: false,
    datasetLoadingNotified: false,
  };

  const STORAGE_KEY = "oga-chatbot-state";

  const selectors = {
    launcher: "oga-chatbot-launcher",
    window: "oga-chatbot-window",
    messages: "oga-chatbot-messages",
    input: "oga-chatbot-input",
    suggestions: "oga-chatbot-suggestions",
    form: "oga-chatbot-form",
    headerTitle: "oga-chatbot-title",
    subtitle: "oga-chatbot-subtitle",
    style: "oga-chatbot-style",
    quickReplies: "oga-chatbot-quick-replies",
  };

  function injectStyles() {
    if (document.getElementById(selectors.style)) return;
    const style = document.createElement("style");
    style.id = selectors.style;
    style.textContent = `
      .${selectors.launcher} {
        position: fixed;
        bottom: 22px;
        right: 22px;
        width: 58px;
        height: 58px;
        border-radius: 50%;
        background: linear-gradient(135deg, ${theme.primary}, ${theme.accent});
        color: #fff;
        border: none;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.18);
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        z-index: 99998;
        transition: transform 0.18s ease, box-shadow 0.18s ease;
        font-size: 27px;
        padding-top: 6px;
      }
      .${selectors.launcher}:hover {
        transform: translateY(-1px);
        box-shadow: 0 14px 28px rgba(0, 0, 0, 0.2);
      }
      .${selectors.window} {
        position: fixed;
        bottom: 90px;
        right: 20px;
        width: 340px;
        max-width: 92vw;
        background: #fff;
        border-radius: 12px;
        box-shadow: 0 14px 30px rgba(0, 0, 0, 0.16);
        overflow: hidden;
        display: none;
        flex-direction: column;
        z-index: 99999;
        border: 1px solid ${theme.borderSoft};
      }
      .${selectors.window}.open {
        display: flex;
        animation: oga-chatbot-pop 0.18s ease;
      }
      @keyframes oga-chatbot-pop {
        0% { transform: translateY(8px); opacity: 0; }
        100% { transform: translateY(0); opacity: 1; }
      }
      .${selectors.window} header {
        padding: 12px 14px;
        background: linear-gradient(135deg, ${theme.primary}, ${theme.primaryAlt});
        color: #fff;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 8px;
      }
      .${selectors.window} header .info { display: flex; flex-direction: column; gap: 2px; }
      .${selectors.window} header h3 { margin: 0; font-size: 15px; line-height: 1.2; }
      .${selectors.window} header span { font-size: 12px; opacity: 0.92; }
      .${selectors.window} header button { border: none; background: transparent; color: #fff; font-size: 18px; cursor: pointer; }
      .${selectors.window} .${selectors.messages} {
        padding: 12px;
        display: flex;
        flex-direction: column;
        gap: 10px;
        max-height: 340px;
        overflow-y: auto;
        background: ${theme.surface};
      }
      .${selectors.window} .${selectors.messages} .msg {
        padding: 10px 12px;
        border-radius: 12px;
        max-width: 82%;
        font-size: 13px;
        line-height: 1.4;
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
      }
      .${selectors.window} .${selectors.messages} .msg a {
        color: ${theme.accent};
        text-decoration: underline;
        font-weight: 600;
      }
      .${selectors.window} .${selectors.messages} .oga-chatbot-option {
        margin: 4px 4px 0 0;
        border: 1px solid ${theme.borderSoft};
        background: #fff;
        color: ${theme.primary};
        border-radius: 10px;
        padding: 5px 9px;
        cursor: pointer;
        font-size: 11px;
        display: inline-flex;
        align-items: center;
        gap: 6px;
      }
      .${selectors.window} .${selectors.messages} .oga-chatbot-option:hover {
        background: ${theme.primary};
        color: #fff;
      }
      .${selectors.window} .${selectors.messages} .oga-chatbot-see-more {
        margin-left: 6px;
        border: 1px solid ${theme.borderSoft};
        background: #fff;
        color: ${theme.primary};
        border-radius: 10px;
        padding: 4px 8px;
        cursor: pointer;
        font-size: 11px;
      }
      .${selectors.window} .${selectors.messages} .oga-chatbot-see-more:hover {
        background: ${theme.primary};
        color: #fff;
      }
      .${selectors.window} .${selectors.messages} .msg.thinking {
        font-style: italic;
        opacity: 0.85;
      }
      .${selectors.window} .${selectors.messages} .msg.thinking::after {
        content: '...';
        animation: oga-thinking 1s infinite;
        margin-left: 2px;
      }
      .${selectors.window} .${selectors.messages} .oga-chatbot-loading-msg::after {
        content: ' ...';
        animation: oga-thinking 1s infinite;
        margin-left: 4px;
      }
      @keyframes oga-thinking {
        0% { opacity: 0.2; }
        50% { opacity: 1; }
        100% { opacity: 0.2; }
      }
      .${selectors.window} .${selectors.messages} .from-bot {
        background: #fff;
        border: 1px solid ${theme.borderSofter};
        align-self: flex-start;
      }
      .${selectors.window} .${selectors.messages} .from-user {
        background: linear-gradient(135deg, ${theme.primary}, ${theme.accent});
        color: #fff;
        align-self: flex-end;
      }
      .${selectors.quickReplies} {
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
        padding: 8px 10px 4px;
        background: ${theme.surface};
        border-top: 1px solid #d9dae3;
        max-height: 110px;
        overflow-y: auto;
      }
      .${selectors.quickReplies} button {
        border: 1px solid ${theme.borderSoft};
        background: #fff;
        color: ${theme.primary};
        border-radius: 14px;
        padding: 5px 9px;
        font-size: 11px;
        cursor: pointer;
        transition: all 0.12s ease;
        white-space: nowrap;
      }
      .${selectors.quickReplies} button:hover {
        background: ${theme.primary};
        color: #fff;
        box-shadow: 0 8px 14px rgba(0, 0, 0, 0.08);
      }
      .${selectors.window} form {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 10px 12px;
        border-top: 1px solid #d9dae3;
        background: #fff;
        position: relative;
      }
      .${selectors.window} input[type="text"] {
        flex: 1;
        border: 1px solid #d9dae3;
        border-radius: 10px;
        padding: 10px 12px;
        font-size: 13px;
        outline: none;
      }
      .${selectors.suggestions} {
        position: absolute;
        bottom: 54px;
        left: 12px;
        right: 80px;
        background: #fff;
        border: 1px solid #d9dae3;
        border-radius: 10px;
        box-shadow: 0 8px 18px rgba(0, 0, 0, 0.08);
        padding: 6px;
        display: none;
        flex-direction: column;
        gap: 6px;
        z-index: 100000;
      }
      .${selectors.suggestions}.visible {
        display: flex;
      }
      .${selectors.suggestions} button {
        border: none;
        background: transparent;
        text-align: left;
        padding: 6px 8px;
        border-radius: 8px;
        cursor: pointer;
        font-size: 12px;
        color: ${theme.primary};
        transition: background 0.12s ease, color 0.12s ease;
      }
      .${selectors.suggestions} button:hover {
        background: ${theme.surface};
        color: ${theme.primary};
      }
      .${selectors.window} input[type="text"]:focus {
        border-color: ${theme.accent};
        box-shadow: 0 0 0 2px ${theme.borderSoft};
      }
      .${selectors.window} button[type="submit"] {
        border: none;
        background: linear-gradient(135deg, ${theme.primary}, ${theme.accent});
        color: #fff;
        border-radius: 10px;
        padding: 10px 12px;
        cursor: pointer;
        font-size: 13px;
      }
      @media (max-width: 640px) {
        .${selectors.window} { right: 14px; width: 92vw; }
        .${selectors.launcher} { bottom: 18px; right: 18px; }
      }
    `;
    document.head.appendChild(style);
  }

  function createElement(tag, className, text) {
    const el = document.createElement(tag);
    if (className) el.className = className;
    if (text) el.textContent = text;
    return el;
  }

  function messagesContainDatasetReady(messages = []) {
    return messages.some(
      (msg) =>
        msg &&
        msg.from === "bot" &&
        typeof msg.text === "string" &&
        msg.text.toLowerCase().includes("inventario de tablas listo")
    );
  }

  function saveState() {
    try {
      const toSave = {
        messages: state.messages.slice(-40),
        datasetReadyNotified: state.datasetReadyNotified,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
    } catch (e) {
      console.warn("[ogaChatbot] No se pudo guardar el estado", e);
    }
  }

  function loadState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (parsed && Array.isArray(parsed.messages)) {
        state.messages = parsed.messages.slice(-40);
      }
      if (parsed && typeof parsed.datasetReadyNotified === "boolean") {
        state.datasetReadyNotified = parsed.datasetReadyNotified;
      } else if (messagesContainDatasetReady(state.messages)) {
        state.datasetReadyNotified = true;
      }
    } catch (e) {
      console.warn("[ogaChatbot] No se pudo cargar el estado", e);
    }
  }

  function scrollMessagesToBottom() {
    const messages = document.getElementById(selectors.messages);
    if (!messages) return;
    messages.scrollTop = messages.scrollHeight;
  }

  function getSuggestionTemplates() {
    return [
      { question: "Que servidores hay?", keywords: ["servidor", "servidores"] },
      { question: "Que esquemas manejan?", keywords: ["esquema", "esquemas"] },
      { question: "Que base/host tienen?", keywords: ["base", "bases", "host"] },
      { question: "Donde creo un caso de uso?", keywords: ["caso de uso", "casos de uso", "nuevo caso", "crear caso"] },
      { question: "Como crear un atributo?", keywords: ["atributo", "nuevo atributo", "crear atributo"] },
      { question: "Como crear/ver un termino?", keywords: ["termino", "terminos", "glosario", "crear termino"] },
      { question: "Como buscar o filtrar campos?", keywords: ["buscar", "filtrar", "campo", "campos"] },
      { question: "Puedo exportar a Excel?", keywords: ["export", "excel", "descargar", "exportar"] },
      { question: "Quien contacto si falta un campo?", keywords: ["contacto", "falta un campo", "falta un atributo", "reportar"] },
      { question: "Como asigno etiquetas/dominio?", keywords: ["etiqueta", "dominio", "asignar etiqueta", "asignar dominio"] },
      { question: "Donde veo favoritos o tablas oficiales?", keywords: ["favoritos", "tablas oficiales", "mis tablas"] },
    ];
  }

  function updateSuggestions(query) {
    const box = document.getElementById(selectors.suggestions);
    if (!box) return;
    const value = query.trim().toLowerCase();
    box.innerHTML = "";
    if (value.length < 2) {
      box.classList.remove("visible");
      return;
    }
    const matches = getSuggestionTemplates().filter((item) =>
      item.keywords.some((kw) => kw.toLowerCase().includes(value) || value.includes(kw.toLowerCase()))
    );
    const limitedTemplates = matches.slice(0, 5);
    const tableMatches = state.datasetReady
      ? findTables(value).slice(0, 5).map((row) => ({ question: `Tabla ${row.txt_desc_tabla}`, table: row.txt_desc_tabla }))
      : [];
    const combined = [...limitedTemplates.map((item) => ({ ...item, action: "intent" })), ...tableMatches.map((item) => ({ ...item, action: "table" }))].slice(0, 8);
    if (combined.length === 0) {
      box.classList.remove("visible");
      return;
    }
    combined.forEach((item) => {
      const btn = createElement("button", "", item.question);
      btn.type = "button";
      btn.addEventListener("click", () => {
        if (item.action === "table") {
          hideSuggestions();
          handleTableSelection(item.table);
        } else {
          handleQuickReply(item.question);
        }
      });
      box.appendChild(btn);
    });
    box.classList.add("visible");
  }

  function hideSuggestions() {
    const box = document.getElementById(selectors.suggestions);
    if (box) box.classList.remove("visible");
  }

  function parseDataset(text) {
    const lines = text.split(/\r?\n/).filter((ln) => ln.trim().length > 0);
    if (lines.length === 0) return [];
    const headers = lines.shift().split("||").map((h) => h.trim());
    return lines.map((line) => {
      const cells = line.split("||");
      const record = {};
      headers.forEach((header, idx) => {
        record[header] = (cells[idx] || "").trim();
      });
      return record;
    });
  }

  function fetchDataset() {
    if (state.datasetLoading || state.datasetReady) return;
    state.datasetError = false;
    state.datasetLoading = true;
    announceDatasetLoading();

    if (typeof window.getInfoTablasOficiales === "function") {
      try {
        const fusion = window.getInfoTablasOficiales({ comoArray: true }) || [];
        const normalized = normalizeDataset(fusion);
        if (normalized.length > 0) {
          state.datasetRecords = normalized;
          state.datasetReady = true;
          state.datasetLoading = false;
          announceDatasetReady();
          return;
        }
      } catch (err) {
        console.warn("[ogaChatbot] No se pudo leer getInfoTablasOficiales(), intento fallback TXT", err);
      }
    }

    const urls = [
      DATASET_URL,
      DATASET_URL.replace("https://", "http://")
    ];
    const opts = { credentials: "include" };
    const tryFetch = (idx) => {
      if (idx >= urls.length) {
        throw new Error("Exhausted dataset URLs");
      }
      return fetch(urls[idx], opts).then((res) => {
        if (!res.ok) throw new Error(`Status ${res.status}`);
        return res.text();
      }).catch((err) => {
        console.warn(`[ogaChatbot] Fallo URL ${urls[idx]}`, err);
        return tryFetch(idx + 1);
      });
    };

    tryFetch(0)
      .then((text) => {
        state.datasetRecords = normalizeDataset(parseDataset(text));
        state.datasetReady = state.datasetRecords.length > 0;
        state.datasetLoading = false;
        if (!state.datasetReady) {
          state.datasetError = true;
        } else {
          announceDatasetReady();
        }
      })
      .catch((err) => {
        console.warn("[ogaChatbot] No se pudo cargar el dataset", err);
        state.datasetError = true;
        state.datasetLoading = false;
      });
  }

  function uniqueFieldValues(field) {
    const set = new Set();
    state.datasetRecords.forEach((row) => {
      const value = (row[field] || "").trim();
      if (value) set.add(value);
    });
    return Array.from(set);
  }

  function normalizeDataset(records) {
    if (!Array.isArray(records)) return [];
    return records.map((row) => {
      const out = { ...row };
      // Normalizar nombres esperados
      out.txt_desc_tabla = row.txt_desc_tabla || row.tabla || row.TABLA;
      out.descripcion_tabla = row.descripcion_tabla || row.DESCRIPCION_TABLA || row.descripcion;
      out.descripcion_dominio = row.descripcion_dominio || row.DESC_DOMINIO || row.DOMINIO || row.dominio;
      out.txt_servidor = row.txt_servidor || row.servidor || row.SERVIDOR;
      out.txt_host = row.txt_host || row.base || row.BASE || row.txt_base;
      out.txt_fuente_esquema = row.txt_fuente_esquema || row.esquema || row.ESQUEMA;
      out.txt_fuente_aprovisionamiento = row.txt_fuente_aprovisionamiento || row.plataforma || row.PLATAFORMA;
      out.data_owner = row.data_owner;
      out.nombre_data_owner = row.nombre_data_owner;
      out.data_steward = row.data_steward;
      out.nombre_data_steward = row.nombre_data_steward;
      return out;
    });
  }

  function announceDatasetLoading() {
    if (state.datasetLoadingNotified) return;
    const messages = document.getElementById(selectors.messages);
    if (!messages) return;
    const bubble = createElement("div", "msg from-bot thinking", "Cargando inventario de tablas");
    messages.appendChild(bubble);
    scrollMessagesToBottom();
    state.datasetLoadingNotified = true;
  }

  function announceDatasetReady() {
    if (state.datasetReadyNotified) return;
    const messages = document.getElementById(selectors.messages);
    if (!messages) return;
    state.datasetReadyNotified = true;
    appendMessage("Inventario de tablas listo, ya puedes preguntarme por una tabla.", "bot");
  }

  function normalizeText(value) {
    return (value || "")
      .toString()
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .trim();
  }

  // Similaridad simple por bigramas (Dice). Pequeño y sin dependencias.
  function bigramSimilarity(a, b) {
    const x = normalizeText(a);
    const y = normalizeText(b);
    if (!x.length || !y.length) return 0;
    if (x === y) return 1;
    const makeBigrams = (str) => {
      const grams = new Map();
      for (let i = 0; i < str.length - 1; i++) {
        const g = str[i] + str[i + 1];
        grams.set(g, (grams.get(g) || 0) + 1);
      }
      return grams;
    };
    const bgA = makeBigrams(x);
    const bgB = makeBigrams(y);
    let intersection = 0;
    bgA.forEach((count, gram) => {
      if (bgB.has(gram)) {
        intersection += Math.min(count, bgB.get(gram));
      }
    });
    const total = Array.from(bgA.values()).reduce((s, v) => s + v, 0) + Array.from(bgB.values()).reduce((s, v) => s + v, 0);
    return total === 0 ? 0 : (2 * intersection) / total;
  }

  function bestIntentMatch(text) {
    const input = normalizeText(text);
    let best = { intent: null, phrase: "", score: 0 };
    intentsCatalog.forEach((intent) => {
      intent.phrases.forEach((phrase) => {
        const score = bigramSimilarity(input, phrase);
        if (score > best.score) {
          best = { intent, phrase, score };
        }
      });
    });
    return best;
  }

  function findTables(query) {
    if (!state.datasetReady) return [];
    const q = query.toLowerCase();
    const seen = new Set();
    const results = [];
    state.datasetRecords.forEach((row) => {
      const name = (row.txt_desc_tabla || "").toLowerCase();
      if (!name.includes(q)) return;
      if (seen.has(name)) return;
      seen.add(name);
      results.push(row);
    });
    return results;
  }

  function findTableVariants(tableName) {
    if (!state.datasetReady) return [];
    const target = normalizeText(tableName);
    return state.datasetRecords.filter((row) => normalizeText(row.txt_desc_tabla) === target);
  }

  function variantLabel(row) {
    const host = row.txt_host || "N/D";
    const esquema = row.txt_fuente_esquema || "N/D";
    const servidor = row.txt_servidor || "N/D";
    return `base: ${host} | esquema: ${esquema} | servidor: ${servidor}`;
  }

  function getOwner(row) {
    const explicitName = row.nombre_data_owner || row.nombre_owner || row.nombre_owner_tabla;
    if (explicitName) return explicitName;
    return row.data_owner || row.owner || row.txt_owner || row.owner_tabla || row.responsable || "N/D";
  }

  function getSteward(row) {
    const explicitName = row.nombre_data_steward;
    if (explicitName) return explicitName;
    return row.data_steward || row.steward || row.responsable_datos || "N/D";
  }

  function datasetListAnswer(field, label, showAll = false) {
    if (!state.datasetReady) {
      if (state.datasetLoading) return "Sigo cargando el inventario, intenta en unos segundos.";
      if (state.datasetError) return "No pude leer el inventario, intenta mas tarde.";
      return "Aun no he cargado el inventario, reintenta en breve.";
    }
    const values = uniqueFieldValues(field);
    if (!values.length) return `No encontre ${label.toLowerCase()} en el inventario.`;
    const shown = showAll ? values : values.slice(0, 20);
    const more = values.length - shown.length;
    const extra = more > 0 ? ` (y ${more} mas)` : "";
    const baseText = `${label} disponibles (${values.length}): ${shown.join(", ")}${extra}.`;
    if (more > 0 && !showAll) {
      return `${baseText} <button class="oga-chatbot-see-more" data-field="${field}" data-label="${label}">Ver mas</button>`;
    }
    return baseText;
  }

  function tableInfoAnswer(query) {
    if (!state.datasetReady) {
      if (state.datasetLoading) return "Sigo cargando el inventario de tablas, intenta en unos segundos.";
      if (state.datasetError) return "No pude leer el inventario de tablas, intenta mas tarde.";
      return "Aun no he cargado el inventario de tablas, reintenta en breve.";
    }
    const matches = findTables(query);
    if (!matches.length) return `No encontre tablas que coincidan con "${query}".`;
    if (matches.length === 1) {
      const row = matches[0];
      const safe = (field) => row[field] || "N/D";
      return [
        `<strong>Tabla:</strong> ${safe("txt_desc_tabla")}`,
        `Descripcion: ${safe("descripcion_tabla")}`,
        `Dominio: ${safe("descripcion_dominio")}`,
        `Owner: ${getOwner(row)}`,
        `Data steward: ${getSteward(row)}`,
        `Servidor: ${safe("txt_servidor")}`,
        `Base: ${safe("txt_host")}`,
        `Esquema: ${safe("txt_fuente_esquema")}`,
        `Fuente: ${safe("txt_fuente_aprovisionamiento") || safe("txt_fuente_esquema")}`
      ].join("<br>");
    }
    const limited = matches.slice(0, 5);
    const more = matches.length - limited.length;
    const buttons = limited
      .map((row) => `<button class="oga-chatbot-option" data-table="${row.txt_desc_tabla}">${row.txt_desc_tabla}</button>`)
      .join("");
    const moreText = more > 0 ? ` (y ${more} mas)` : "";
    return `Encontre ${matches.length} tablas que coinciden con "${query}"${moreText}. Selecciona una:<br>${buttons}`;
  }

  function tableVariantsAnswer(tableName) {
    if (!state.datasetReady) {
      if (state.datasetLoading) return "Sigo cargando el inventario de tablas, intenta en unos segundos.";
      if (state.datasetError) return "No pude leer el inventario de tablas, intenta mas tarde.";
      return "Aun no he cargado el inventario de tablas, reintenta en breve.";
    }
    const variants = findTableVariants(tableName);
    if (variants.length <= 1) {
      return tableInfoAnswer(tableName);
    }
    const buttons = variants
      .map(
        (row, idx) =>
          `<button class="oga-chatbot-option" data-variant-table="${row.txt_desc_tabla}" data-variant-index="${idx}">${variantLabel(row)}</button>`
      )
      .join("");
    const allBtn = `<button class="oga-chatbot-option" data-variant-all="${tableName}">Ver todas</button>`;
    return `Hay ${variants.length} variantes para "${tableName}". Elige una o ver todas:<br>${buttons}<div style="margin-top:6px;">${allBtn}</div>`;
  }

  function variantDetailAnswer(tableName, index) {
    if (!state.datasetReady) {
      if (state.datasetLoading) return "Sigo cargando el inventario de tablas, intenta en unos segundos.";
      if (state.datasetError) return "No pude leer el inventario de tablas, intenta mas tarde.";
      return "Aun no he cargado el inventario de tablas, reintenta en breve.";
    }
    const variants = findTableVariants(tableName);
    const idx = Number(index);
    const row = variants[idx];
    if (!row) return `No encontre la variante seleccionada para "${tableName}".`;
    const safe = (field) => row[field] || "N/D";
    return [
      `<strong>Tabla:</strong> ${safe("txt_desc_tabla")}`,
      `Descripcion: ${safe("descripcion_tabla")}`,
      `Dominio: ${safe("descripcion_dominio")}`,
      `Owner: ${getOwner(row)}`,
      `Data steward: ${getSteward(row)}`,
      `Servidor: ${safe("txt_servidor")}`,
      `Base: ${safe("txt_host")}`,
      `Esquema: ${safe("txt_fuente_esquema")}`,
      `Fuente: ${safe("txt_fuente_aprovisionamiento") || safe("txt_fuente_esquema")}`
    ].join("<br>");
  }

  function allVariantsAnswer(tableName) {
    if (!state.datasetReady) {
      if (state.datasetLoading) return "Sigo cargando el inventario de tablas, intenta en unos segundos.";
      if (state.datasetError) return "No pude leer el inventario de tablas, intenta mas tarde.";
      return "Aun no he cargado el inventario de tablas, reintenta en breve.";
    }
    const variants = findTableVariants(tableName);
    if (!variants.length) return `No encontre variantes para "${tableName}".`;
    const cards = variants
      .map((row) => {
        const safe = (field) => row[field] || "N/D";
        return [
          `<div class="oga-chatbot-variant">`,
          `<strong>Tabla:</strong> ${safe("txt_desc_tabla")}<br>`,
          `Descripcion: ${safe("descripcion_tabla")}<br>`,
          `Dominio: ${safe("descripcion_dominio")}<br>`,
          `Owner: ${getOwner(row)}<br>`,
          `Data steward: ${getSteward(row)}<br>`,
          `Servidor: ${safe("txt_servidor")}<br>`,
          `Base: ${safe("txt_host")}<br>`,
          `Esquema: ${safe("txt_fuente_esquema")}<br>`,
          `Fuente: ${safe("txt_fuente_aprovisionamiento") || safe("txt_fuente_esquema")}`,
          `</div>`
        ].join("");
      })
      .join("<br>");
    return `Variantes para "${tableName}":<br>${cards}`;
  }

  function handleTableSelection(tableName) {
    appendMessage(tableName, "user");
    const answer = tableVariantsAnswer(tableName);
    appendMessage(answer, "bot", { html: true });
  }

  function handleVariantSelection(tableName, index) {
    const label = `${tableName} (variante ${Number(index) + 1})`;
    appendMessage(label, "user");
    const answer = variantDetailAnswer(tableName, index);
    appendMessage(answer, "bot", { html: true });
  }

  function handleVariantAll(tableName) {
    appendMessage(`Ver todas: ${tableName}`, "user");
    const answer = allVariantsAnswer(tableName);
    appendMessage(answer, "bot", { html: true });
  }

  function appendMessage(text, from, options = {}) {
    const { html = false, persist = true } = options;
    const messages = document.getElementById(selectors.messages);
    if (!messages) return;
    const bubble = createElement("div", `msg from-${from}`);
    if (html) bubble.innerHTML = text; else bubble.textContent = text;
    messages.appendChild(bubble);
    scrollMessagesToBottom();
    if (persist) {
      state.messages.push({ from, text, html });
      saveState();
    }
  }

  function showThinking() {
    const messages = document.getElementById(selectors.messages);
    if (!messages) return null;
    const bubble = createElement("div", "msg from-bot thinking", "Pensando");
    messages.appendChild(bubble);
    scrollMessagesToBottom();
    return bubble;
  }

  function hideThinking(bubble) {
    if (bubble && bubble.parentNode) {
      bubble.parentNode.removeChild(bubble);
    }
  }

  function mockReply() {
    appendMessage(state.config.emptyResponse, "bot");
  }

  function intentResponse(text) {
    const normalized = text.toLowerCase();
    const tableMatches = state.datasetReady ? findTables(text) : [];
    const datasetIntents = [
      { keywords: ["servidor", "servidores"], field: "txt_servidor", label: "Servidores" },
      { keywords: ["esquema", "esquemas"], field: "txt_fuente_esquema", label: "Esquemas" },
      { keywords: ["base", "bases", "host"], field: "txt_host", label: "Bases" },
    ];

    for (const intent of datasetIntents) {
      if (intent.keywords.some((kw) => normalized.includes(kw))) {
        return datasetListAnswer(intent.field, intent.label);
      }
    }

    if (normalized.length >= 2) {
      if (state.datasetReady) {
        if (tableMatches.length > 0 || normalized.includes("tabla")) {
          return tableInfoAnswer(text);
        }
      } else {
        fetchDataset();
        announceDatasetLoading();
        if (state.datasetError) {
          return "No pude cargar el inventario de tablas (intenta recargar la pagina o valida tu conexion).";
        }
        return '<span class="oga-chatbot-loading-msg">Estoy cargando el inventario de tablas, intenta en unos segundos.</span>';
      }
    }

    const { intent, phrase, score } = bestIntentMatch(text);
    const strongMatch = score >= 0.62;
    const weakMatch = score >= 0.4;
    if (strongMatch && intent) {
      return intent.response;
    }
    if (weakMatch && intent) {
      return `¿Quisiste decir "<button class="oga-chatbot-option" data-quick="${phrase}">${phrase}</button>"?`;
    }
    return null;
  }

  function handleUserMessage(text) {
    appendMessage(text, "user");
    hideSuggestions();
    const thinking = showThinking();
    const answer = intentResponse(text);
    const delayMs = 1200;
    setTimeout(() => {
      hideThinking(thinking);
      if (answer) {
        appendMessage(answer, "bot", { html: true });
      } else {
        mockReply();
      }
    }, delayMs);
  }

  function handleQuickReply(text) {
    hideSuggestions();
    handleUserMessage(text);
  }

  function handleSubmit(event) {
    event.preventDefault();
    const input = document.getElementById(selectors.input);
    if (!input) return;
    const text = input.value.trim();
    if (!text) return;
    handleUserMessage(text);
    input.value = "";
    hideSuggestions();
  }

  function toggleWindow(forceOpen) {
    const panel = document.getElementById(selectors.window);
    if (!panel) return;
    const shouldOpen = typeof forceOpen === "boolean" ? forceOpen : !state.isOpen;
    panel.classList.toggle("open", shouldOpen);
    state.isOpen = shouldOpen;
    if (shouldOpen) {
      setTimeout(scrollMessagesToBottom, 10);
    }
  }

  function buildUI() {
    const launcher = createElement("button", selectors.launcher);
    launcher.id = selectors.launcher;
    launcher.title = "Abrir asistente";
    launcher.innerHTML = "💬";
    launcher.addEventListener("click", () => toggleWindow());

    const panel = createElement("div", selectors.window);
    panel.id = selectors.window;

    const header = createElement("header");
    const info = createElement("div", "info");
    const title = createElement("h3", "", state.config.title);
    title.id = selectors.headerTitle;
    const subtitle = createElement("span", "", state.config.subtitle);
    subtitle.id = selectors.subtitle;
    info.appendChild(title);
    info.appendChild(subtitle);

    const closeBtn = createElement("button", "", "×");
    closeBtn.addEventListener("click", () => toggleWindow(false));
    header.appendChild(info);
    header.appendChild(closeBtn);

    const messages = createElement("div", selectors.messages);
    messages.id = selectors.messages;
    messages.addEventListener("click", (e) => {
      const btn = e.target.closest(".oga-chatbot-see-more");
      if (!btn) return;
      const { field, label } = btn.dataset;
      const full = datasetListAnswer(field, label, true);
      appendMessage(full, "bot", { html: true, persist: false });
    });
    messages.addEventListener("click", (e) => {
      const btn = e.target.closest(".oga-chatbot-option");
      if (!btn) return;
      const tableName = btn.dataset.table;
      if (!tableName) return;
      handleTableSelection(tableName);
    });
    messages.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-quick]");
      if (!btn) return;
      const label = btn.dataset.quick;
      if (!label) return;
      handleQuickReply(label);
    });
    messages.addEventListener("click", (e) => {
      const variantBtn = e.target.closest("[data-variant-index]");
      if (variantBtn) {
        const tableName = variantBtn.dataset.variantTable;
        const index = variantBtn.dataset.variantIndex;
        if (tableName !== undefined && index !== undefined) {
          handleVariantSelection(tableName, index);
        }
        return;
      }
      const allBtn = e.target.closest("[data-variant-all]");
      if (allBtn) {
        const tableName = allBtn.dataset.variantAll;
        if (tableName !== undefined) {
          handleVariantAll(tableName);
        }
      }
    });

    const quickReplies = createElement("div", selectors.quickReplies);
    quickReplies.id = selectors.quickReplies;
    (state.config.quickReplies || []).forEach((label) => {
      const btn = createElement("button", "", label);
      btn.type = "button";
      btn.addEventListener("click", () => handleQuickReply(label));
      quickReplies.appendChild(btn);
    });

    const form = createElement("form");
    form.id = selectors.form;
    const input = createElement("input");
    input.type = "text";
    input.placeholder = state.config.placeholder;
    input.id = selectors.input;
    input.addEventListener("input", (e) => updateSuggestions(e.target.value || ""));
    input.addEventListener("focus", (e) => updateSuggestions(e.target.value || ""));
    input.addEventListener("blur", () => setTimeout(hideSuggestions, 120));
    const suggestionsBox = createElement("div", selectors.suggestions);
    suggestionsBox.id = selectors.suggestions;
    const send = createElement("button");
    send.type = "submit";
    send.textContent = "Enviar";
    form.appendChild(input);
    form.appendChild(suggestionsBox);
    form.appendChild(send);
    form.addEventListener("submit", handleSubmit);

    panel.appendChild(header);
    panel.appendChild(messages);
    if ((state.config.quickReplies || []).length > 0) {
      panel.appendChild(quickReplies);
    }
    panel.appendChild(form);

    document.body.appendChild(panel);
    document.body.appendChild(launcher);
  }

  function applyConfigUpdates() {
    const title = document.getElementById(selectors.headerTitle);
    const subtitle = document.getElementById(selectors.subtitle);
    const input = document.getElementById(selectors.input);
    if (title) title.textContent = state.config.title;
    if (subtitle) subtitle.textContent = state.config.subtitle;
    if (input && state.config.placeholder) input.placeholder = state.config.placeholder;
  }

  function init(customConfig = {}) {
    state.config = { ...state.config, ...customConfig };
    loadState();
    fetchDataset();
    if (state.initialized) {
      applyConfigUpdates();
      return;
    }
    injectStyles();
    buildUI();
    if (state.messages.length > 0) {
      state.messages.forEach((msg) => {
        appendMessage(msg.text, msg.from, { persist: false, html: !!msg.html });
      });
    } else {
      appendMessage(state.config.welcomeMessage, "bot");
    }
    if (state.datasetLoading && !state.datasetReady) {
      announceDatasetLoading();
    }
    if (state.datasetReady) {
      announceDatasetReady();
    }
    state.initialized = true;
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => init(window.ogaChatbotPreConfig || {}));
  } else {
    init(window.ogaChatbotPreConfig || {});
  }

  window.ogaChatbot = {
    init,
    open: () => toggleWindow(true),
    close: () => toggleWindow(false),
    toggle: () => toggleWindow(),
    isOpen: () => state.isOpen,
  };
})(window, document);

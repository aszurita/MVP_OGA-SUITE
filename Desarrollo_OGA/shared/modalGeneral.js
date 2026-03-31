/* ModalGeneral: contenedor reutilizable para modales (correo, SMS, etc.) */

(function (win, doc) {
  const STYLE_LINK_ID = "modal-general-css";
  const MODAL_ID = "modal-general-overlay";
  const DEFAULT_TEMPLATE = "correo.modal.aspx";
  const LIST_Z_DATOS_EMPLEADOS = "Z_DATOS_EMPLEADOS";
  const HELPER_SCRIPT_ID = "modal-general-user-helper";
  const HELPER_SCRIPT_URL = "http://vamos.bancoguayaquil.com/sitios/informaciongerencial/OGA_Suite/Produccion/js/helper_user.js";
  const INFORMACIONGERENCIAL_URL = "http://vamos.bancoguayaquil.com/sitios/informaciongerencial/";
  const AINGINE_SCRIPT_ID = "modal-general-aingine";
  const AINGINE_SCRIPT_URL = "http://vamos.bancoguayaquil.com/sitios/informaciongerencial/OGA_Suite/Produccion/js/AINGINE.js";
  const CORREO_ATTACHMENTS_FOLDER_URL = "http://vamos.bancoguayaquil.com/sitios/informaciongerencial/DATAHUB/Produccion/docs/correos"; //cambiar a producción al subir
  const SPSERVICES_SCRIPT_ID = "modal-general-spservices";
  const SPSERVICES_SCRIPT_URL = "http://vamos.bancoguayaquil.com/sitios/informaciongerencial/DATAHUB/Produccion/assets/js/jquery.SPServices-0.6.2.min.js";
  let peopleLoaderPromise = null;
  let helperLoaderPromise = null;
  let aingineLoaderPromise = null;
  let spservicesLoaderPromise = null;
  let currentUserPromise = null;
  let peopleEnsurePromise = null;
  const peopleCache = [];
  const currentUserCache = {
    email: "",
    usuario: "",
    nombre: "",
  };

  const defaultConfig = {
    defaultCc: "",
    maxFiles: 5,
    maxFileSize: 8 * 1024 * 1024, // 8 MB por archivo
    apiUrl: null,
    closeOnSend: true,
    onSend: null,
    beforeSend: null,
    afterSend: null,
    sendLabel: "",
    loadingLabel: "",
    onOpen: null,
    onClose: null,
    onError: null,
  };

  function hasSpServices() {
    return typeof win.$ === "function" && typeof win.$().SPServices === "function";
  }

  function loadSpServices() {
    if (spservicesLoaderPromise) return spservicesLoaderPromise;
    if (hasSpServices()) {
      spservicesLoaderPromise = Promise.resolve(true);
      return spservicesLoaderPromise;
    }
    if (typeof win.$ !== "function") {
      spservicesLoaderPromise = Promise.resolve(false);
      return spservicesLoaderPromise;
    }
    spservicesLoaderPromise = new Promise((resolve, reject) => {
      const existing = doc.getElementById(SPSERVICES_SCRIPT_ID);
      if (existing) {
        existing.addEventListener("load", () => resolve(hasSpServices()));
        existing.addEventListener("error", (err) => reject(err));
        if (existing.getAttribute("data-loaded") === "1") {
          resolve(hasSpServices());
        }
        return;
      }
      const script = doc.createElement("script");
      script.id = SPSERVICES_SCRIPT_ID;
      script.src = SPSERVICES_SCRIPT_URL;
      script.onload = () => {
        script.setAttribute("data-loaded", "1");
        resolve(hasSpServices());
      };
      script.onerror = (err) => {
        console.warn("[correo modal] No se pudo cargar SPServices.", err);
        reject(err);
      };
      doc.head.appendChild(script);
    });
    return spservicesLoaderPromise;
  }

  function getSpUserLogin() {
    if (hasSpServices()) {
      try {
        return win.$().SPServices.SPGetCurrentUser() || "";
      } catch (e) {
        return "";
      }
    }
    return (win._spPageContextInfo && win._spPageContextInfo.userLoginName) || "";
  }

  function normalizeUserLogin(loginName) {
    if (!loginName) return "";
    return loginName.split("\\").pop().trim();
  }

  function setCurrentUserCache({ email, usuario, nombre }) {
    if (email) currentUserCache.email = email;
    if (usuario) currentUserCache.usuario = usuario;
    if (nombre) currentUserCache.nombre = nombre;
  }

  function loadCurrentUserInfo() {
    if (currentUserPromise) return currentUserPromise;
    currentUserPromise = new Promise((resolve) => {
      const fallbackEmail =
        (win._spPageContextInfo && win._spPageContextInfo.userEmail) ||
        win.current_email ||
        "";
      if (!hasSpServices()) {
        setCurrentUserCache({ email: fallbackEmail });
        resolve(currentUserCache);
        return;
      }
      try {
        const current = win.$().SPServices.SPGetCurrentUser({
          fieldNames: ["FirstName", "LastName", "UserName", "EMail"],
        });
        if (current) {
          const nombre = `${current.FirstName || ""} ${current.LastName || ""}`.trim();
          const usuario = normalizeUserLogin(current.UserName || "");
          const email = current.EMail || fallbackEmail;
          setCurrentUserCache({ email, usuario, nombre });
          resolve(currentUserCache);
          return;
        }
      } catch (e) {
        // continua con fallback
      }
      const loginName = getSpUserLogin();
      win.$().SPServices({
        operation: "GetUserInfo",
        async: true,
        userLoginName: loginName,
        completefunc: function (xData) {
          let email = fallbackEmail;
          let nombre = "";
          const userNode = win.$(xData.responseXML).find("User").first();
          if (userNode && userNode.length) {
            email = userNode.attr("Email") || email;
            nombre = (userNode.attr("Name") || "").trim();
          }
          const usuario = normalizeUserLogin(loginName);
          setCurrentUserCache({ email, usuario, nombre });
          resolve(currentUserCache);
        },
      });
    });
    return currentUserPromise;
  }

  function getCurrentEmailSync() {
    return (
      currentUserCache.email ||
      (win._spPageContextInfo && win._spPageContextInfo.userEmail) ||
      win.current_email ||
      ""
    );
  }

  function resolveCurrentEmailAsync() {
    return new Promise((resolve) => {
      const cached = getCurrentEmailSync();
      if (cached) return resolve(cached);
      if (!hasSpServices()) return resolve("");
      try {
        const loginName = getSpUserLogin();
        if (!loginName) return resolve("");
        win.$().SPServices({
          operation: "GetUserInfo",
          async: true,
          userLoginName: loginName,
          completefunc: function (xData) {
            let email = "";
            const userNode = win.$(xData.responseXML).find("User").first();
            if (userNode && userNode.length) {
              email = userNode.attr("Email") || "";
            }
            if (email) {
              currentUserCache.email = email;
              win.current_email = email;
            }
            resolve(email);
          },
        });
      } catch (_) {
        resolve("");
      }
    });
  }

  function loadEmpleadosOnce() {
    if (peopleLoaderPromise) return peopleLoaderPromise;
    peopleLoaderPromise = new Promise((resolve) => {
      if (!hasSpServices()) {
        resolve([]);
        return;
      }
      function extractEmpleado(row) {
        const attrs = row[0]?.attributes || [];
        const map = {};
        for (let i = 0; i < attrs.length; i++) {
          const k = attrs[i].name || "";
          const v = attrs[i].value || "";
          map[k.toLowerCase()] = v;
        }
        const correoAttr =
          map["ows_correo"] ||
            map["ows_email"] ||
            Object.keys(map)
              .find((k) => /correo|email/i.test(k) && map[k]) ?
            map[Object.keys(map).find((k) => /correo|email/i.test(k) && map[k])] : "";
        const usuarioAttr =
          map["ows_usuario"] ||
          map["ows_user"] ||
          map["ows_username"] ||
          "";
        const nombreAttr =
          map["ows_nombre_completo"] ||
          map["ows_nombre"] ||
          map["ows_nombres"] ||
          "";
        let correo = (correoAttr || "").trim().toLowerCase();
        const usuario = (usuarioAttr || "").trim().toLowerCase();
        const nombreCompleto = (nombreAttr || "").trim();
        if (!correo && usuario) correo = `${usuario}@bancoguayaquil.com`;
        return {
          correo,
          nombreCompleto,
          usuario,
        };
      }

      function fetchEmpleados(webUrl, cb) {
        const empleados = [];
        const opts = {
          operation: "GetListItems",
          async: true,
          listName: LIST_Z_DATOS_EMPLEADOS,
          CAMLRowLimit: 5000,
          completefunc: function (xData) {
            win.$(xData.responseXML)
              .find("z\\:row")
              .each(function () {
                const row = win.$(this);
                const emp = extractEmpleado(row);
                if (!emp.correo && !emp.usuario && !emp.nombreCompleto) return;
                empleados.push(emp);
              });
            cb(empleados);
          },
        };
        if (webUrl) opts.webURL = webUrl;
        win.$().SPServices(opts);
      }

      fetchEmpleados(INFORMACIONGERENCIAL_URL, (empleadosLocal) => {
        if (empleadosLocal && empleadosLocal.length) {
          resolve(empleadosLocal);
          return;
        }
        resolve([]);
      });
    });
    return peopleLoaderPromise;
  }

  function getEmpleadosSync() {
    if (!hasSpServices()) return [];
    const empleados = [];
    try {
      win.$().SPServices({
        operation: "GetListItems",
        async: false,
        webURL: INFORMACIONGERENCIAL_URL,
        listName: LIST_Z_DATOS_EMPLEADOS,
        CAMLQuery: "",
        completefunc: function (xData, Status) {
          if (Status !== "success") return;
          win.$(xData.responseXML)
            .find("z\\:row")
            .each(function () {
              const row = win.$(this);
              const emp = (function extractRow(r) {
                const attrs = r[0]?.attributes || [];
                const map = {};
                for (let i = 0; i < attrs.length; i++) {
                  const k = attrs[i].name || "";
                  const v = attrs[i].value || "";
                  map[k.toLowerCase()] = v;
                }
                const correoAttr =
                  map["ows_correo"] ||
                    map["ows_email"] ||
                    Object.keys(map)
                      .find((k) => /correo|email/i.test(k) && map[k]) ?
                    map[Object.keys(map).find((k) => /correo|email/i.test(k) && map[k])] : "";
                const usuarioAttr =
                  map["ows_usuario"] ||
                  map["ows_user"] ||
                  map["ows_username"] ||
                  "";
                const nombreAttr =
                  map["ows_nombre_completo"] ||
                  map["ows_nombre"] ||
                  map["ows_nombres"] ||
                  "";
                let correo = (correoAttr || "").trim().toLowerCase();
                const usuario = (usuarioAttr || "").trim().toLowerCase();
                const nombreCompleto = (nombreAttr || "").trim();
                if (!correo && usuario) correo = `${usuario}@bancoguayaquil.com`;
                return { correo, nombreCompleto, usuario };
              })(row);
              if (!emp.correo && !emp.usuario && !emp.nombreCompleto) return;
              empleados.push(emp);
            });
        },
      });
    } catch (e) {
      console.warn("[correo modal] getEmpleadosSync fallo:", e);
    }
    return empleados;
  }

  if (typeof win.getEmpleados !== "function") {
    // no-op, se define abajo
  }

  function overrideGetEmpleados() {
    if (!hasSpServices()) {
      console.warn("[correo modal] SPServices no disponible para getEmpleados.");
      return;
    }
    if (!win._oga_getEmpleados && typeof win.getEmpleados === "function") {
      win._oga_getEmpleados = win.getEmpleados;
    }
    win.getEmpleados = function getEmpleados({ usuario } = {}) {
      console.log("[correo modal] getEmpleados override activo. webURL:", INFORMACIONGERENCIAL_URL);
      const empleados = [];
      let query = "";
      if (usuario) {
        query = `<Query><Where><Eq><FieldRef Name="USUARIO"/><Value Type="Text">${usuario}</Value></Eq></Where></Query>`;
      }
      try {
        win.$().SPServices({
          operation: "GetListItems",
          async: false,
          webURL: INFORMACIONGERENCIAL_URL,
          listName: "Z_DATOS_EMPLEADOS",
          CAMLQuery: query,
          CAMLViewFields: "<ViewFields>\
                              <FieldRef Name='CODIGO_EMPLEADO' />\
                              <FieldRef Name='NOMBRE_COMPLETO' />\
                              <FieldRef Name='COD_CENTRO_COSTO' />\
                              <FieldRef Name='CENTRO_COSTO' />\
                              <FieldRef Name='CARGO' />\
                              <FieldRef Name='USUARIO' />\
                              <FieldRef Name='JEFE' />\
                              <FieldRef Name='ESTADO' />\
                              <FieldRef Name='AGENCIA' />\
                              <FieldRef Name='REGION' />\
                              <FieldRef Name='BANCA' />\
                              <FieldRef Name='CORREO' />\
                              <FieldRef Name='NOMBRES' />\
                              <FieldRef Name='APELLIDO_PATERNO' />\
                              <FieldRef Name='APELLIDO_MATERNO' />\
                              <FieldRef Name='FECHA_INGRESO' />\
                              <FieldRef Name='LOCALIDAD' />\
                              <FieldRef Name='CODIGO_CARGO' />\
                          </ViewFields>",
          completefunc: function (xData, Status) {
            if (Status !== "success") {
              console.warn("[correo modal] getEmpleados status:", Status);
              console.warn("[correo modal] getEmpleados response:", xData);
              return;
            }
            win.$(xData.responseXML).find("z\\:row").each(function () {
              const data = {
                codigo: win.$(this).attr("ows_CODIGO_EMPLEADO") || "",
                nombreCompleto: win.$(this).attr("ows_NOMBRE_COMPLETO") || "",
                centroCosto: win.$(this).attr("ows_CENTRO_COSTO") || "",
                codCentroCosto: win.$(this).attr("ows_COD_CENTRO_COSTO") || "",
                cargo: win.$(this).attr("ows_CARGO") || "",
                usuario: (win.$(this).attr("ows_USUARIO") || "").toLowerCase(),
                jefe: win.$(this).attr("ows_JEFE") || "",
                estado: win.$(this).attr("ows_ESTADO") || "",
                area: win.$(this).attr("ows_BANCA") || "",
                agencia: win.$(this).attr("ows_AGENCIA") || "",
                region: win.$(this).attr("ows_REGION") || "",
                correo: (win.$(this).attr("ows_USUARIO") || "") + "@bancoguayaquil.com",
                nombres: win.$(this).attr("ows_NOMBRES") || "",
                apellido_paternal: win.$(this).attr("ows_APELLIDO_PATERNO") || "",
                apellido_maternal: win.$(this).attr("ows_APELLIDO_MATERNO") || "",
                fecha_ingreso: win.$(this).attr("ows_FECHA_INGRESO") || "",
                localidad: win.$(this).attr("ows_LOCALIDAD") || "",
                codCargo: win.$(this).attr("ows_CODIGO_CARGO") || "",
              };
              empleados.push(data);
            });
            console.log("[correo modal] getEmpleados filas:", empleados.length);
          },
        });
      } catch (e) {
        console.warn("[correo modal] getEmpleados fallo:", e);
      }
      return empleados;
    };
  }

  function loadHelper() {
    if (helperLoaderPromise) return helperLoaderPromise;
    if (
      win.UserHelper &&
      typeof win.UserHelper.loadEmpleadosOnce === "function" &&
      typeof win.UserHelper.getCurrentEmail === "function"
    ) {
      helperLoaderPromise = Promise.resolve(win.UserHelper);
      return helperLoaderPromise;
    }
    helperLoaderPromise = new Promise((resolve, reject) => {
      const existing = doc.getElementById(HELPER_SCRIPT_ID);
      if (existing) {
        existing.addEventListener("load", () => resolve(win.UserHelper));
        existing.addEventListener("error", (err) => {
          console.warn("[correo modal] No se pudo cargar helper_user.js (script existente).", err);
          reject(err);
        });
        if (existing.getAttribute("data-loaded") === "1") {
          resolve(win.UserHelper);
        }
        return;
      }
      const script = doc.createElement("script");
      script.id = HELPER_SCRIPT_ID;
      script.src = HELPER_SCRIPT_URL;
      script.onload = () => {
        script.setAttribute("data-loaded", "1");
        resolve(win.UserHelper);
      };
      script.onerror = (err) => {
        console.warn("[correo modal] No se pudo cargar helper_user.js.", err);
        reject(err);
      };
      doc.head.appendChild(script);
    });
    return helperLoaderPromise;
  }

  function loadAingine() {
    if (aingineLoaderPromise) return aingineLoaderPromise;
    if (win.AINGINE && typeof win.AINGINE.insert === "function") {
      aingineLoaderPromise = Promise.resolve(win.AINGINE);
      return aingineLoaderPromise;
    }
    aingineLoaderPromise = new Promise((resolve, reject) => {
      const existing = doc.getElementById(AINGINE_SCRIPT_ID);
      if (existing) {
        existing.addEventListener("load", () => resolve(win.AINGINE));
        existing.addEventListener("error", (err) => reject(err));
        if (existing.getAttribute("data-loaded") === "1") {
          resolve(win.AINGINE);
        }
        return;
      }
      const script = doc.createElement("script");
      script.id = AINGINE_SCRIPT_ID;
      script.src = AINGINE_SCRIPT_URL;
      script.onload = () => {
        script.setAttribute("data-loaded", "1");
        resolve(win.AINGINE);
      };
      script.onerror = (err) => reject(err);
      doc.head.appendChild(script);
    });
    return aingineLoaderPromise;
  }

  function getBasePath() {
    const current = doc.currentScript?.src || "";
    const scripts = Array.from(doc.getElementsByTagName("script"));
    const script = current ? null : scripts.find((s) => (s.src || "").includes("modalGeneral.js"));
    const src = current || (script && script.src) || "";
    if (!src) return "";
    return src.slice(0, src.lastIndexOf("/"));
  }

  function resolveUrl(url) {
    if (!url) return "";
    if (/^https?:\/\//i.test(url)) return url;
    if (url.startsWith("/")) return url;
    return `${getBasePath()}/${url}`;
  }

  function ensureStyles() {
    if (doc.getElementById(STYLE_LINK_ID)) return;
    const link = doc.createElement("link");
    link.id = STYLE_LINK_ID;
    link.rel = "stylesheet";
    link.href = resolveUrl("modalGeneral.css");
    doc.head.appendChild(link);
  }

  const templateCache = {};

  async function loadTemplate(url) {
    const resolved = resolveUrl(url);
    if (templateCache[resolved]) return templateCache[resolved];
    const resp = await fetch(resolved, { cache: "no-store" });
    if (!resp.ok) throw new Error(`No se pudo cargar template: ${resolved}`);
    const html = await resp.text();
    templateCache[resolved] = html;
    return html;
  }

  function resolveDefaultCc(config) {
    loadSpServices().catch(() => { });
    loadCurrentUserInfo().catch(() => { });
    const helperEmail =
      (typeof win.UserHelper === "object" &&
        typeof win.UserHelper.getCurrentEmail === "function" &&
        win.UserHelper.getCurrentEmail()) ||
      "";
    const fallback =
      helperEmail ||
      getCurrentEmailSync() ||
      (typeof win.obtenerUsuario === "function" && (win.obtenerUsuario()?.current_email || "")) ||
      (win._spPageContextInfo && win._spPageContextInfo.userEmail) ||
      win.current_email ||
      "";
    return (config && config.defaultCc) || fallback || "";
  }

  function formatBytes(bytes) {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${(bytes / Math.pow(k, i)).toFixed(1)} ${sizes[i]}`;
  }

  function parseEmails(value) {
    return value
      .split(",")
      .map((v) => v.trim())
      .filter(Boolean);
  }

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function getField(root, name) {
    return (
      root.querySelector(`[data-field="${name}"]`) ||
      root.querySelector(`#${name}`)
    );
  }

  function getError(root, name) {
    return (
      root.querySelector(`[data-error="${name}"]`) ||
      root.querySelector(`#${name}Error`)
    );
  }

  function attachCorreoForm(root, opts = {}) {
    if (!root) return null;
    ensureStyles();

    loadSpServices().catch(() => { });
    loadCurrentUserInfo().catch(() => { });

    const config = { ...defaultConfig, ...opts };
    config.defaultCc = config.defaultCc || resolveDefaultCc(config);
    const sendLabel = (config.sendLabel || "Enviar").trim();
    const loadingLabel = (config.loadingLabel || "Enviando...").trim();

    const state = { files: [] };
    let suggestionsBox = null;
    let highlightedIndex = -1;
    let savedSelection = null;
    let pendingCloseAction = null;
    let lastAcceptedEmail = "";
    let lastAcceptedAt = 0;

    const refs = {
      to: getField(root, "to"),
      cc: getField(root, "cc"),
      subject: getField(root, "subject"),
      body: getField(root, "bodyEditor"),
      toError: getError(root, "to"),
      subjectError: getError(root, "subject"),
      bodyError: getError(root, "body"),
      attachError: getError(root, "attach"),
      attachmentsInput: getField(root, "attachments"),
      btnAttach: getField(root, "btnAttach"),
      btnCancel: getField(root, "btnCancel"),
      btnSend: getField(root, "btnSend"),
      btnLink: getField(root, "btnLink"),
      formatBlock: getField(root, "formatBlock"),
      foreColor: getField(root, "foreColor"),
      fileList: getField(root, "fileList"),
      attachHint: getField(root, "attachHint"),
    };
    const linkModal = root.querySelector("[data-link-modal]");
    const linkInput = root.querySelector('[data-field="linkInput"]');
    const linkApply = linkModal?.querySelector('[data-action="apply-link"]');
    const linkCancel = linkModal?.querySelector('[data-action="cancel-link"]');
    const closeWarning = root.querySelector("[data-close-warning]");
    const closeWarningPanel = closeWarning?.querySelector(".close-warning-panel");
    const closeConfirm = closeWarning?.querySelector('[data-action="confirm-close"]');
    const closeCancel = closeWarning?.querySelector('[data-action="cancel-close"]');

    if (!refs.to || !refs.subject || !refs.body || !refs.btnSend) {
      console.warn("[modalGeneral] Campos requeridos no encontrados en el formulario de correo.");
      return null;
    }
    if (refs.btnSend) {
      refs.btnSend.textContent = sendLabel;
    }

    if (refs.cc) {
      const ccValue = resolveDefaultCc(config);
      if (ccValue) {
        refs.cc.value = ccValue;
        refs.cc.setAttribute("value", ccValue);
      }
      // Reintentar cuando se cargue info del usuario
      loadCurrentUserInfo()
        .then(() => {
          const ccResolved = resolveDefaultCc(config);
          if (ccResolved && !refs.cc.value) {
            refs.cc.value = ccResolved;
            refs.cc.setAttribute("value", ccResolved);
          }
        })
        .catch(() => { });
      // Reintento adicional con SPServices directo si sigue vacío
      setTimeout(() => {
        if (refs.cc.value) return;
        try {
          if (hasSpServices()) {
            const current = win.$().SPServices.SPGetCurrentUser({
              fieldNames: ["EMail"],
            });
            const email = current && current.EMail ? current.EMail : "";
            if (email) {
              refs.cc.value = email;
              refs.cc.setAttribute("value", email);
            }
          }
        } catch (_) { }
      }, 300);
      // Reintento final por context info
      setTimeout(() => {
        if (refs.cc.value) return;
        const email =
          (typeof win.obtenerUsuario === "function" && (win.obtenerUsuario()?.current_email || "")) ||
          win.current_email ||
          "";
        if (email) {
          refs.cc.value = email;
          refs.cc.setAttribute("value", email);
          return;
        }
        resolveCurrentEmailAsync().then((resolved) => {
          if (resolved && !refs.cc.value) {
            refs.cc.value = resolved;
            refs.cc.setAttribute("value", resolved);
          }
        });
      }, 800);
    }

    if (config.placeholders) {
      if (config.placeholders.subject && refs.subject) {
        refs.subject.setAttribute("placeholder", config.placeholders.subject);
      }
      if (config.placeholders.body && refs.body) {
        refs.body.dataset.placeholder = config.placeholders.body;
      }
      if (config.placeholders.to && refs.to) {
        refs.to.setAttribute("placeholder", config.placeholders.to);
      }
    }

    root.querySelectorAll("[data-cmd]").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        const cmd = btn.dataset.cmd;
        if (!cmd) return;
        doc.execCommand(cmd, false, null);
        refs.body.focus();
        syncBodyPlaceholder();
      });
    });

    if (refs.formatBlock) {
      refs.formatBlock.addEventListener("change", (e) => {
        const selectionSnapshot = cacheSelection();
        doc.execCommand("formatBlock", false, `<${e.target.value}>`);
        if (selectionSnapshot) {
          restoreSelection(selectionSnapshot);
        }
        refs.body.focus();
      });
    }

    if (refs.foreColor) {
      refs.foreColor.addEventListener("change", (e) => {
        doc.execCommand("foreColor", false, e.target.value);
        refs.body.focus();
      });
    }

    if (refs.btnLink) {
      refs.btnLink.addEventListener("click", () => {
        if (linkModal && linkInput) {
          showLinkModal();
          return;
        }
        cacheSelection();
        const url = prompt("Inserta el enlace (incluye http:// o https://)");
        if (!url) return;
        restoreSelection();
        doc.execCommand("createLink", false, url);
      });
    }

    refs.body.setAttribute(
      "data-placeholder",
      refs.body.dataset.placeholder ||
      "Escribe tu mensaje aquí..."
    );
    refs.body.addEventListener("input", syncBodyPlaceholder);
    refs.body.addEventListener("blur", syncBodyPlaceholder);
    function syncBodyPlaceholder() {
      const empty = !refs.body.innerText.trim() && !refs.body.innerHTML.replace(/<br>/g, "").trim();
      if (empty) {
        refs.body.setAttribute("data-placeholder-active", "1");
      } else {
        refs.body.removeAttribute("data-placeholder-active");
      }
    }

    if (refs.btnAttach && refs.attachmentsInput) {
      if (refs.btnAttach._modalGeneralAttachHandler) {
        refs.btnAttach.removeEventListener("click", refs.btnAttach._modalGeneralAttachHandler);
      }
      const attachHandler = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (refs.attachmentsInput.dataset.opening === "1") return;
        refs.attachmentsInput.dataset.opening = "1";
        refs.attachmentsInput.click();
        setTimeout(() => {
          refs.attachmentsInput.dataset.opening = "0";
        }, 250);
      };
      refs.btnAttach._modalGeneralAttachHandler = attachHandler;
      refs.btnAttach.addEventListener("click", attachHandler);

      if (refs.attachmentsInput._modalGeneralChangeHandler) {
        refs.attachmentsInput.removeEventListener("change", refs.attachmentsInput._modalGeneralChangeHandler);
      }
      const changeHandler = (e) => {
        const incoming = Array.from(e.target.files || []);
        incoming.forEach((file) => {
          if (state.files.length >= config.maxFiles) return;
          if (file.size > config.maxFileSize) return;
          state.files.push(file);
        });
        renderFiles();
        refs.attachmentsInput.value = "";
      };
      refs.attachmentsInput._modalGeneralChangeHandler = changeHandler;
      refs.attachmentsInput.addEventListener("change", changeHandler);
    }

    if (refs.to) {
      const wrapper = refs.to.parentElement;
      if (wrapper) {
        wrapper.style.position = "relative";
        suggestionsBox = wrapper.querySelector(".correo-suggestions");
        if (!suggestionsBox) {
          suggestionsBox = doc.createElement("div");
          suggestionsBox.className = "correo-suggestions hidden";
          wrapper.appendChild(suggestionsBox);
        }
      }
      // Tag input UI
      const tagInput = {
        container: null,
        input: null,
      };
      if (!refs.to.dataset.correoTagsInit) {
        refs.to.dataset.correoTagsInit = "1";
        const container = doc.createElement("div");
        container.className = "correo-tagsinput";
        const input = doc.createElement("input");
        input.type = "text";
        input.autocomplete = "off";
        input.placeholder = refs.to.placeholder || "";
        container.appendChild(input);
        refs.to.style.display = "none";
        refs.to.parentNode.insertBefore(container, refs.to);
        tagInput.container = container;
        tagInput.input = input;
      } else {
        const existing = wrapper ? wrapper.querySelector(".correo-tagsinput") : null;
        if (existing) {
          tagInput.container = existing;
          tagInput.input = existing.querySelector("input");
        }
      }

      function getTagEmailList() {
        if (!tagInput.container) return [];
        const tags = Array.from(tagInput.container.querySelectorAll(".correo-tag"));
        return tags.map((t) => t.dataset.email).filter(Boolean);
      }

      function syncHiddenToEmails() {
        const emails = getTagEmailList();
        refs.to.value = emails.join(", ");
      }

      function addTag(email, opts = {}) {
        if (!tagInput.container || !email) return;
        const lower = email.toLowerCase();
        const existing = getTagEmailList().map((e) => e.toLowerCase());
        if (existing.includes(lower)) {
          if (typeof win.showNotification === "function") {
            win.showNotification("top", "center", "info", "Usuario ya agregado", 2000);
          } else {
            console.warn("[correo modal] Usuario ya agregado");
          }
          return;
        }
        const currentCc = (refs.cc && refs.cc.value ? refs.cc.value.trim().toLowerCase() : "");
        if (currentCc && currentCc === lower) {
          if (typeof win.showNotification === "function") {
            win.showNotification("top", "center", "info", "El usuario CC no se puede agregar en Para", 2500);
          } else {
            console.warn("[correo modal] CC no permitido en Para");
          }
          return;
        }
        if (!opts.force && !peopleCache.some((p) => (p.email || "").toLowerCase() === lower)) {
          if (typeof win.showNotification === "function") {
            win.showNotification("top", "center", "warning", "Agregue un usuario válido", 2500);
          } else {
            console.warn("[correo modal] Usuario inválido");
          }
          return;
        }
        const username = lower.split("@")[0];
        const tag = doc.createElement("span");
        tag.className = "correo-tag";
        tag.dataset.email = lower;
        tag.innerHTML = `<span class="correo-tag-text">${username}</span><span class="correo-tag-remove" data-role="remove">×</span>`;
        tagInput.container.insertBefore(tag, tagInput.input);
        syncHiddenToEmails();
      }

      function removeTag(el) {
        if (!el) return;
        const tag = el.closest(".correo-tag");
        if (tag) {
          tag.remove();
          syncHiddenToEmails();
        }
      }

      if (tagInput.container && tagInput.input) {
        tagInput.container.addEventListener("click", () => tagInput.input.focus());
        tagInput.container.addEventListener("click", (e) => {
          if (e.target && e.target.dataset && e.target.dataset.role === "remove") {
            removeTag(e.target);
          }
        });
        tagInput.input.addEventListener("input", (e) => {
          refs.to.value = e.target.value;
          handleToInput();
        });
        tagInput.input.addEventListener("keydown", (e) => {
          if (e.key === "Enter" || e.key === ",") {
            e.preventDefault();
            if (suggestionsBox && !suggestionsBox.classList.contains("hidden")) {
              const first = suggestionsBox.querySelector(".correo-suggestions-email");
              const firstEmail = first ? first.textContent : "";
              if (firstEmail) {
                acceptSuggestion(firstEmail);
                tagInput.input.value = "";
                return;
              }
            }
            const raw = (tagInput.input.value || "").trim();
            if (!raw) return;
            const maybeEmail = raw.includes("@") ? raw : `${raw}@bancoguayaquil.com`;
            if (isValidEmail(maybeEmail)) {
              addTag(maybeEmail);
              tagInput.input.value = "";
              hideSuggestions();
            } else {
              if (typeof win.showNotification === "function") {
                win.showNotification("top", "center", "warning", "Agregue un usuario válido", 2500);
              } else {
                console.warn("[correo modal] Usuario inválido");
              }
            }
          } else if (e.key === "Backspace" && !tagInput.input.value) {
            const tags = tagInput.container.querySelectorAll(".correo-tag");
            const last = tags[tags.length - 1];
            if (last) {
              last.remove();
              syncHiddenToEmails();
            }
          }
        });
      }
      if (refs.to.dataset.correoSuggestBound !== "1") {
        refs.to.dataset.correoSuggestBound = "1";
        refs.to.addEventListener("input", handleToInput);
        refs.to.addEventListener("focus", () => handleToInput(true));
        refs.to.addEventListener("keydown", handleToKeydown);
        doc.addEventListener("click", (e) => {
          if (!suggestionsBox || suggestionsBox.classList.contains("hidden")) return;
          if (e.target === refs.to || suggestionsBox.contains(e.target)) return;
          hideSuggestions();
        });
      }
    }

    function renderFiles() {
      if (!refs.fileList) return;
      refs.fileList.innerHTML = "";
      if (!state.files.length && refs.attachHint) {
        refs.attachHint.style.display = "block";
      } else if (refs.attachHint) {
        refs.attachHint.style.display = "none";
      }

      state.files.forEach((file, idx) => {
        const item = doc.createElement("div");
        item.className = "file-item";
        item.innerHTML = `
          <div class="file-meta">
            <span>${file.name}</span>
            <span class="file-size">${formatBytes(file.size)}</span>
          </div>
          <button type="button" class="btn-remove" data-index="${idx}" aria-label="Quitar">×</button>
        `;
        item.querySelector(".btn-remove").addEventListener("click", () => {
          state.files.splice(idx, 1);
          renderFiles();
        });
        refs.fileList.appendChild(item);
      });
    }

    function cacheSelection() {
      const sel = win.getSelection();
      if (sel && sel.rangeCount) {
        savedSelection = sel.getRangeAt(0).cloneRange();
        return savedSelection;
      }
      savedSelection = null;
      return null;
    }

    function restoreSelection(range) {
      const sel = win.getSelection();
      if (!sel) return;
      sel.removeAllRanges();
      const target = range || savedSelection;
      if (target) {
        sel.addRange(target);
      }
    }

    function showLinkModal() {
      if (!linkModal || !linkInput) return false;
      cacheSelection();
      linkModal.classList.add("is-visible");
      setTimeout(() => linkInput.focus(), 10);
      return true;
    }

    function hideLinkModal() {
      if (!linkModal || !linkInput) return;
      linkModal.classList.remove("is-visible");
      linkInput.value = "";
      savedSelection = null;
    }

    function submitLink() {
      if (!linkInput) return;
      const url = linkInput.value.trim();
      if (!url) {
        linkInput.focus();
        return;
      }
      restoreSelection();
      doc.execCommand("createLink", false, url);
      hideLinkModal();
      refs.body.focus();
    }

    function showCloseWarning(action) {
      if (!action) return;
      if (!closeWarning) {
        action();
        return;
      }
      pendingCloseAction = action;
      closeWarning.classList.add("is-visible");
      closeWarning.setAttribute("aria-hidden", "false");
      setTimeout(() => {
        (closeConfirm || closeCancel)?.focus();
      }, 10);
    }

    function hideCloseWarning() {
      if (!closeWarning) return;
      closeWarning.classList.remove("is-visible");
      closeWarning.setAttribute("aria-hidden", "true");
      pendingCloseAction = null;
    }

    function confirmCloseWarning() {
      if (!pendingCloseAction) return;
      const action = pendingCloseAction;
      hideCloseWarning();
      action();
    }

    function clearErrors() {
      [refs.toError, refs.subjectError, refs.bodyError, refs.attachError].forEach(
        (el) => {
          if (el) {
            el.style.display = "none";
            el.textContent = "";
          }
        }
      );
    }

    if (linkModal) {
      linkModal.addEventListener("click", (e) => {
        if (e.target === linkModal) {
          hideLinkModal();
        }
      });
    }

    if (closeWarning) {
      closeWarning.addEventListener("click", (e) => {
        if (e.target === closeWarning) {
          hideCloseWarning();
        }
      });
      closeWarning.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
          hideCloseWarning();
        }
      });
    }

    if (linkApply) {
      linkApply.addEventListener("click", (e) => {
        e.preventDefault();
        submitLink();
      });
    }

    if (linkCancel) {
      linkCancel.addEventListener("click", (e) => {
        e.preventDefault();
        hideLinkModal();
      });
    }

    if (linkInput) {
      linkInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          submitLink();
        } else if (e.key === "Escape") {
          hideLinkModal();
        }
      });
    }

    if (closeConfirm) {
      closeConfirm.addEventListener("click", (e) => {
        e.preventDefault();
        confirmCloseWarning();
      });
    }

    if (closeCancel) {
      closeCancel.addEventListener("click", (e) => {
        e.preventDefault();
        hideCloseWarning();
      });
    }

    function showError(el, msg) {
      if (!el) return;
      el.textContent = msg;
      el.style.display = "block";
    }

    function getToEmailsFromTags() {
      const container = refs.to?.previousElementSibling;
      if (!container || !container.classList.contains("correo-tagsinput")) return null;
      const tags = Array.from(container.querySelectorAll(".correo-tag"));
      const emails = tags.map((t) => (t.dataset.email || "").trim()).filter(Boolean);
      return emails;
    }

    function validate() {
      clearErrors();
      let hasValidationError = false;
      let parsedTo = [];
      const tagEmails = getToEmailsFromTags();
      if (tagEmails) {
        parsedTo = tagEmails;
        refs.to.value = parsedTo.join(", ");
      } else {
        parsedTo = parseEmails(refs.to.value || "");
      }
      if (!parsedTo.length) {
        hasValidationError = true;
        if (typeof win.showNotification === "function") {
          win.showNotification("top", "center", "warning", "Debes ingresar al menos un destinatario", 2500);
        } else {
          showError(refs.toError, "Debes ingresar al menos un destinatario");
        }
      } else if (parsedTo.some((m) => !isValidEmail(m))) {
        hasValidationError = true;
        if (typeof win.showNotification === "function") {
          win.showNotification("top", "center", "warning", "Hay correos no válidos. Revisa el formato.", 2500);
        } else {
          showError(refs.toError, "Hay correos no válidos. Revisa el formato.");
        }
      }

      if (!refs.subject.value.trim()) {
        showError(refs.subjectError, "El asunto es obligatorio.");
      }

      const bodyText = refs.body.innerText.trim();
      if (!bodyText) {
        showError(refs.bodyError, "El cuerpo del mensaje no puede estar vacio.");
      }

      if (state.files.length > config.maxFiles) {
        showError(refs.attachError, `Maximo ${config.maxFiles} archivos.`);
      }
      const tooBig = state.files.find((f) => f.size > config.maxFileSize);
      if (tooBig) {
        showError(
          refs.attachError,
          `El archivo "${tooBig.name}" excede ${formatBytes(config.maxFileSize)}.`
        );
      }

      const hasErrors =
        hasValidationError ||
        (refs.toError && refs.toError.style.display === "block") ||
        (refs.subjectError && refs.subjectError.style.display === "block") ||
        (refs.bodyError && refs.bodyError.style.display === "block") ||
        (refs.attachError && refs.attachError.style.display === "block");

      return { valid: !hasErrors, to: parsedTo };
    }

    function hideSuggestions() {
      if (!suggestionsBox) return;
      suggestionsBox.classList.add("hidden");
      suggestionsBox.innerHTML = "";
      highlightedIndex = -1;
    }

    function normalizePerson(p) {
      const email = (p.correo || p.email || p.mail || p.CORREO || p.EMAIL || "").trim().toLowerCase();
      const nombre =
        (p.nombreCompleto ||
          p.NombreCompleto ||
          p.nombre ||
          p.NOMBRE ||
          `${p.nombres || ""} ${p.apellidos || ""}` ||
          "").trim();
      const usuario = (p.usuario || p.USUARIO || "").trim().toLowerCase();
      return email ? { email, nombre, usuario } : null;
    }

    function dedupePeople(list) {
      const seen = new Set();
      return list.filter((p) => {
        const key = (p.email || "").toLowerCase();
        if (!key || seen.has(key)) return false;
        seen.add(key);
        return true;
      });
    }

    async function ensurePeople() {
      if (peopleCache.length) return peopleCache;
      if (peopleEnsurePromise) return peopleEnsurePromise;
      peopleEnsurePromise = (async () => {
        await loadSpServices().catch(() => null);
        await loadCurrentUserInfo().catch(() => null);
        if (peopleCache.length) return peopleCache;
        overrideGetEmpleados();
        await loadHelper().catch(() => null);
        if (!win.UserHelper || typeof win.UserHelper.loadEmpleadosOnce !== "function") {
          console.warn("[correo modal] UserHelper no disponible; usando fallback Z_DATOS_EMPLEADOS.");
        }
        try {
          if (typeof win.UserHelper === "object" && typeof win.UserHelper.loadEmpleadosOnce === "function") {
            const empleados = await win.UserHelper.loadEmpleadosOnce();
            if (empleados && empleados.length) {
              peopleCache.push(...dedupePeople(empleados.map(normalizePerson).filter(Boolean)));
              console.log("[correo modal] Empleados cargados desde UserHelper:", peopleCache.length);
              return peopleCache;
            }
          }
        } catch (e) {
          console.warn("[correo modal] No se pudieron cargar empleados con UserHelper", e);
        }
        try {
          const empleados = await loadEmpleadosOnce();
          if (empleados && empleados.length) {
            peopleCache.push(...dedupePeople(empleados.map(normalizePerson).filter(Boolean)));
            console.log("[correo modal] Empleados cargados desde Z_DATOS_EMPLEADOS:", peopleCache.length);
          }
        } catch (e) {
          console.warn("[correo modal] No se pudieron cargar empleados", e);
        }
        if (!peopleCache.length) {
          console.warn("[correo modal] No se encontraron empleados para sugerencias.");
        }
        return peopleCache;
      })();
      return peopleEnsurePromise;
    }

    async function handleToInput(forceShowAll = false) {
      const termRaw = (refs.to.value || "").split(",").pop().trim();
      const list = await ensurePeople();
      if (!list.length) {
        hideSuggestions();
        return;
      }
      if (!termRaw && !forceShowAll) {
        hideSuggestions();
        return;
      }
      const needles = termRaw
        .toLowerCase()
        .split(/\s+/)
        .filter(Boolean);
      const matches = list
        .filter((p) => {
          if (!termRaw) return true;
          const haystack = `${p.nombre} ${p.email} ${p.usuario || ""}`.toLowerCase();
          return needles.every((n) => haystack.includes(n));
        })
        .slice(0, 8);
      if (!matches.length) {
        hideSuggestions();
        return;
      }
      renderSuggestions(matches);
    }

    function renderSuggestions(matches) {
      if (!suggestionsBox) return;
      suggestionsBox.innerHTML = "";
      matches.forEach((p, idx) => {
        // Evitar mostrar el correo del CC en sugerencias
        const currentCc = (refs.cc && refs.cc.value ? refs.cc.value.trim().toLowerCase() : "");
        if (currentCc && p.email && p.email.toLowerCase() === currentCc) {
          return;
        }
        const item = doc.createElement("div");
        item.className = "correo-suggestions-item";
        item.dataset.index = idx;
        item.innerHTML = `
          <span class="correo-suggestions-name">${p.nombre || "(Sin nombre)"}</span>
          <span class="correo-suggestions-email">${p.email}</span>
        `;
        item.addEventListener("mouseenter", () => setHighlight(idx));
        item.addEventListener("click", () => acceptSuggestion(p.email));
        suggestionsBox.appendChild(item);
      });
      suggestionsBox.classList.remove("hidden");
      highlightedIndex = -1;
    }

    function setHighlight(idx) {
      if (!suggestionsBox) return;
      const items = suggestionsBox.querySelectorAll(".correo-suggestions-item");
      items.forEach((el) => el.classList.remove("active"));
      if (items[idx]) {
        items[idx].classList.add("active");
        highlightedIndex = idx;
      }
    }

    function handleToKeydown(e) {
      if (!suggestionsBox || suggestionsBox.classList.contains("hidden")) return;
      const items = suggestionsBox.querySelectorAll(".correo-suggestions-item");
      if (!items.length) return;
      if (e.key === "ArrowDown") {
        e.preventDefault();
        e.stopPropagation();
        const next = (highlightedIndex + 1) % items.length;
        setHighlight(next);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        e.stopPropagation();
        const prev = (highlightedIndex - 1 + items.length) % items.length;
        setHighlight(prev);
      } else if (e.key === "Enter") {
        e.preventDefault();
        e.stopPropagation();
        const targetIndex = highlightedIndex >= 0 ? highlightedIndex : 0;
        const email = items[targetIndex]?.querySelector(".correo-suggestions-email")?.textContent;
        if (email) acceptSuggestion(email);
      } else if (e.key === "Escape") {
        hideSuggestions();
      }
    }

    function acceptSuggestion(email) {
      const now = win.performance?.now ? win.performance.now() : Date.now();
      if (lastAcceptedEmail === email && now - lastAcceptedAt < 600) {
        hideSuggestions();
        return;
      }
      lastAcceptedEmail = email;
      lastAcceptedAt = now;
      if (refs.to && refs.to.previousElementSibling && refs.to.previousElementSibling.classList.contains("correo-tagsinput")) {
        const inputEl = refs.to.previousElementSibling.querySelector("input");
        if (inputEl) inputEl.value = "";
        addTag(email, { force: true });
      } else {
        const parts = refs.to.value.split(",");
        parts[parts.length - 1] = ` ${email}`.trim();
        let newValue = parts.join(", ").replace(/\s*,\s*/g, ", ").replace(/,+/g, ", ");
        if (!newValue.endsWith(", ")) newValue = `${newValue}, `;
        refs.to.value = newValue;
      }
      hideSuggestions();
      const focusEl = (refs.to && refs.to.previousElementSibling && refs.to.previousElementSibling.classList.contains("correo-tagsinput"))
        ? refs.to.previousElementSibling.querySelector("input")
        : refs.to;
      focusEl && focusEl.focus();
    }

    function buildPayload(validTo) {
      return {
        to: validTo || getToEmailsFromTags() || parseEmails(refs.to.value || ""),
        cc: refs.cc ? refs.cc.value.trim() : "",
        subject: refs.subject.value.trim(),
        bodyHtml: refs.body.innerHTML.trim(),
        bodyText: refs.body.innerText.trim(),
        attachments: state.files.slice(),
      };
    }

    function arrayBufferToBase64(buffer) {
      let binary = "";
      const bytes = new Uint8Array(buffer);
      const len = bytes.byteLength;
      for (let i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
      }
      return btoa(binary);
    }

    function getModeloCodigo() {
      if (typeof win.codigoModelo === "string" && win.codigoModelo.trim()) {
        return win.codigoModelo.trim();
      }
      const params = new URLSearchParams(win.location.search);
      const codigo =
        params.get("codigo") ||
        params.get("codigo_modelo") ||
        params.get("id") ||
        "";
      return (codigo || "").trim();
    }

    function buildStoredFileName(file) {
      const original = (file.name || "archivo").trim();
      const parts = original.split(".");
      const ext = parts.length > 1 ? parts.pop().toLowerCase() : "";
      const base = parts.join(".").replace(/\s+/g, "_");
      const codigo = getModeloCodigo();
      const prefix = codigo || Date.now().toString();
      let seq = 1;
      try {
        const key = `correoAdjuntosSeq:${prefix}:${base}`;
        const current = parseInt(localStorage.getItem(key) || "0", 10);
        seq = Number.isFinite(current) ? current + 1 : 1;
        localStorage.setItem(key, String(seq));
      } catch (_) { }
      return `${prefix}_${seq}_${base}${ext ? "." + ext : ""}`;
    }

    async function uploadAttachment(file) {
      await loadSpServices().catch(() => null);
      if (!hasSpServices()) {
        throw new Error("SPServices no disponible para subir adjuntos.");
      }
      const storedName = buildStoredFileName(file);
      const fileUrl = `${CORREO_ATTACHMENTS_FOLDER_URL}/${storedName}`;
      const fileBase64 = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const buffer = e.target.result;
            const base64 = arrayBufferToBase64(new Uint8Array(buffer));
            resolve(base64);
          } catch (err) {
            reject(err);
          }
        };
        reader.onerror = () => reject(new Error("Error leyendo archivo."));
        reader.readAsArrayBuffer(file);
      });

      await new Promise((resolve, reject) => {
        win.$().SPServices({
          operation: "CopyIntoItems",
          SourceUrl: fileUrl,
          DestinationUrls: [fileUrl],
          Stream: fileBase64,
          async: false,
          completefunc: function (xData, Status) {
            if (Status === "success") {
              resolve();
            } else {
              reject(new Error("Error al cargar el archivo."));
            }
          },
        });
      });

      return { name: file.name, url: fileUrl };
    }

    async function uploadAttachments(files) {
      const uploaded = [];
      for (const file of files) {
        const result = await uploadAttachment(file);
        uploaded.push(result);
      }
      return uploaded;
    }

    function appendAttachmentsToBody(bodyHtml, uploaded) {
      if (!uploaded || !uploaded.length) return bodyHtml;
      const list = uploaded
        .map((f) => `<li><a href="${f.url}" target="_blank" rel="noopener">${f.name}</a></li>`)
        .join("");
      return `${bodyHtml}<p><strong>Archivos adjuntos:</strong></p><ul>${list}</ul>`;
    }

    function setLoading(isLoading) {
      if (!refs.btnSend) return;
      refs.btnSend.disabled = isLoading;
      refs.btnSend.dataset.loading = isLoading ? "1" : "0";
      refs.btnSend.textContent = isLoading ? loadingLabel : sendLabel;
    }

    async function enqueueCorreo(payload) {
      const aingine = await loadAingine();
      if (!aingine || typeof aingine.insert !== "function") {
        throw new Error("[correo modal] AINGINE no disponible para encolar correos.");
      }
      if (!payload || !Array.isArray(payload.to) || payload.to.length === 0) {
        throw new Error("[correo modal] Destinatario requerido para encolar correos.");
      }
      await loadHelper().catch(() => null);
      const identity = resolveUserIdentity();
      const fechaIngreso =
        win.UserHelper && typeof win.UserHelper.getFechaActual === "function"
          ? win.UserHelper.getFechaActual()
          : new Date().toISOString();
      const destinatarios = new Set();
      if (Array.isArray(payload.to)) {
        payload.to.forEach((email) => {
          if (email?.trim()) destinatarios.add(email.trim());
        });
      }
      if (payload.cc?.trim()) {
        destinatarios.add(payload.cc.trim());
      }
      const usernameList = Array.from(destinatarios)
        .map((email) => email.split("@")[0]?.trim())
        .filter(Boolean);
      const datos = {
        NOMBRE_PERSONA: identity.nombre || identity.usuario || "Usuario correo",
        USUARIO_PERSONA:
          usernameList.length > 0
            ? usernameList.join("&")
            : identity.usuario || identity.nombre || "usuario",
        ASUNTO_CORREO: payload.subject || "",
        CUERPO_CORREO: payload.bodyHtml || payload.bodyText || "",
        FECHA_INGRESO_EN_COLA: fechaIngreso,
        ENVIADO: false,
        FECHA_ENVIO: null,
        FIRMA: "DataHub Inventario de Modelos y Artefactos",
      };
      return aingine.insert({
        tabla: "PROCESOS_BI.DBO.t_cola_mensajes",
        datos,
      });
    }

    async function defaultSend(payload) {
      await enqueueCorreo(payload);
    }

    async function handleSend() {
      const validation = validate();
      if (!validation.valid) {
        return;
      }
      if (typeof config.beforeSend === "function") {
        try {
          const proceed = await config.beforeSend();
          if (!proceed) return;
        } catch (err) {
          console.error("[correo modal] beforeSend fallo:", err);
          return;
        }
      }

      setLoading(true);
      const payload = buildPayload(validation.to);
      if (!payload.to || payload.to.length === 0) {
        setLoading(false);
        if (typeof win.showNotification === "function") {
          win.showNotification("top", "center", "warning", "Debes ingresar al menos un destinatario", 2500);
        } else {
          showError(refs.toError, "Debes ingresar al menos un destinatario");
        }
        return;
      }
      try {
        if (payload.attachments && payload.attachments.length) {
          const uploaded = await uploadAttachments(payload.attachments);
          payload.bodyHtml = appendAttachmentsToBody(payload.bodyHtml, uploaded);
          payload.bodyText = `${payload.bodyText}\nArchivos adjuntos:\n${uploaded
            .map((f) => f.name)
            .join("\n")}`;
        }
        const handler = config.onSend || defaultSend;
        await handler(payload);
        if (typeof config.afterSend === "function") {
          await config.afterSend(payload);
        }
        win.dispatchEvent(new CustomEvent("correoModal:sent", { detail: payload }));
        if (config.closeOnSend && config.onClose) config.onClose();
        if (!config.closeOnSend) reset();
      } catch (error) {
        console.error("[correo modal] Fallo al enviar:", error);
        if (config.onError) config.onError(error);
        showError(refs.bodyError, "No se pudo enviar. Intenta nuevamente.");
      } finally {
        setLoading(false);
      }
    }

    function reset(prefill = {}) {
      clearErrors();
      refs.to.value = prefill.to || "";
      // Limpiar tags visuales de destinatarios
      const tagsContainer = refs.to?.previousElementSibling;
      if (tagsContainer && tagsContainer.classList.contains("correo-tagsinput")) {
        tagsContainer.querySelectorAll(".correo-tag").forEach((t) => t.remove());
        const inputEl = tagsContainer.querySelector("input");
        if (inputEl) inputEl.value = "";
      }
      if (refs.cc) refs.cc.value = prefill.cc || config.defaultCc || "";
      refs.subject.value = prefill.subject || "";
      refs.body.innerHTML = (prefill.bodyHtml || "").trim();
      state.files = [];
      renderFiles();
      syncBodyPlaceholder();
    }

    function hydrate(prefill = {}) {
      if (prefill.to) {
        const emailsArray = Array.isArray(prefill.to)
          ? prefill.to
          : prefill.to.split(/[,\s;]+/).filter(Boolean);

        // Limpiamos los tags existentes por si hydrate se llama múltiples veces
        const tagsContainer = refs.to?.previousElementSibling;
        if (tagsContainer && tagsContainer.classList.contains("correo-tagsinput")) {
          tagsContainer.querySelectorAll(".correo-tag").forEach((t) => t.remove());
          const inputEl = tagsContainer.querySelector("input");
          if (inputEl) inputEl.value = "";
        }

        emailsArray.forEach(email => {
          const cleanEmail = email.trim();
          if (cleanEmail) {
            const fullEmail = cleanEmail.includes("@") ? cleanEmail : `${cleanEmail}@bancoguayaquil.com`;
            addTag(fullEmail, { force: true });
          }
        });
      }

      if (refs.cc && typeof prefill.cc === "string") refs.cc.value = prefill.cc;
      if (prefill.subject) refs.subject.value = prefill.subject;
      if (prefill.bodyHtml) refs.body.innerHTML = prefill.bodyHtml;
      syncBodyPlaceholder();
    }

    if (refs.btnSend) {
      if (refs.btnSend._modalGeneralSendHandler) {
        refs.btnSend.removeEventListener("click", refs.btnSend._modalGeneralSendHandler);
      }
      const sendHandler = (e) => {
        e.preventDefault();
        e.stopPropagation();
        handleSend();
      };
      refs.btnSend._modalGeneralSendHandler = sendHandler;
      refs.btnSend.addEventListener("click", sendHandler);
    }
    if (refs.btnCancel) {
      if (refs.btnCancel._modalGeneralCancelHandler) {
        refs.btnCancel.removeEventListener("click", refs.btnCancel._modalGeneralCancelHandler);
      }
      const cancelHandler = (e) => {
        e.preventDefault();
        showCloseWarning(() => {
          reset();
          if (config.onClose) config.onClose();
        });
      };
      refs.btnCancel._modalGeneralCancelHandler = cancelHandler;
      refs.btnCancel.addEventListener("click", cancelHandler);
    }
    // Preview eliminado

    const closeButtons = root.querySelectorAll('[data-action="close"]');
    closeButtons.forEach((btn) => {
      btn.addEventListener(
        "click",
        (e) => {
          e.preventDefault();
          e.stopImmediatePropagation();
          showCloseWarning(() => {
            if (config.onClose) {
              config.onClose();
            } else {
              closeModal();
            }
          });
        },
        { capture: true }
      );
    });

    if (config.initialValues) {
      reset(config.initialValues);
      if (refs.subject) {
        refs.subject.dispatchEvent(new Event("input", { bubbles: true }));
      }
    } else {
      renderFiles();
      syncBodyPlaceholder();
    }

    return {
      reset,
      hydrate,
      getPayload: () => buildPayload(),
      getFiles: () => state.files.slice(),
    };
  }

  const modalState = {
    overlay: null,
    dialog: null,
    controller: null,
    templateUrl: null,
    onClose: null,
  };

  function ensureOverlay() {
    if (modalState.overlay) return modalState.overlay;
    ensureStyles();
    const overlay = doc.createElement("div");
    overlay.id = MODAL_ID;
    overlay.className = "modal-general-overlay";
    overlay.innerHTML = `<div class="modal-general-dialog"></div>`;
    doc.body.appendChild(overlay);

    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) {
        e.preventDefault();
        e.stopPropagation();
      }
    });

    modalState.overlay = overlay;
    modalState.dialog = overlay.querySelector(".modal-general-dialog");
    return overlay;
  }

  function bindHeaderToSubject(dialog) {
    if (!dialog) return;
    const subjectInput = getField(dialog, "subject");
    $(subjectInput).on('input', function () {
      const $title = $(dialog).find('.mail-title');
      const texto = $(this).val();
      if (texto.trim() === "") {
        $title.text("Nuevo correo");
      } else {
        $title.text(texto);
      }
    });
  }

  function bindCloseButtons(dialog) {
    if (!dialog) return;
    dialog.querySelectorAll('[data-action="close"]').forEach((btn) => {
      btn.addEventListener("click", closeModal);
    });
  }

  async function openModal(options = {}) {
    ensureStyles();
    const overlay = ensureOverlay();
    const dialog = modalState.dialog;
    const templateUrl = resolveUrl(options.templateUrl || DEFAULT_TEMPLATE);

    if (!dialog) return null;
    if (modalState.templateUrl !== templateUrl) {
      dialog.innerHTML = await loadTemplate(templateUrl);
      modalState.templateUrl = templateUrl;
    } else if (!dialog.innerHTML.trim()) {
      dialog.innerHTML = await loadTemplate(templateUrl);
    }

    bindCloseButtons(dialog);
    bindHeaderToSubject(dialog);

    // Precarga de empleados en background para evitar bloqueo en el primer input
    setTimeout(() => {
      try {
        if (typeof win.ModalGeneral === "object" && typeof win.ModalGeneral.attachCorreoForm === "function") {
          if (typeof win._correoPeoplePreload === "function") {
            win._correoPeoplePreload();
          }
        }
      } catch (_) { }
    }, 0);

    const root = dialog.querySelector("[data-modal-root]") || dialog.firstElementChild;
    const attach = options.attach;
    const controller = typeof attach === "function"
      ? attach(root, { ...options, onClose: closeModal })
      : null;

    modalState.controller = controller;
    modalState.onClose = options.onClose || null;

    overlay.classList.add("is-open");
    doc.body.classList.add("modal-general-open");
    if (options.onOpen) options.onOpen();
    return controller;
  }

  function closeModal() {
    if (!modalState.overlay) return;
    modalState.overlay.classList.remove("is-open");
    doc.body.classList.remove("modal-general-open");
    if (typeof modalState.onClose === "function") {
      modalState.onClose();
    }
  }

  async function openCorreoModal(options = {}) {
    return openModal({
      ...options,
      templateUrl: options.templateUrl || DEFAULT_TEMPLATE,
      attach: attachCorreoForm,
    });
  }

  function getTriggerTitle(trigger) {
    return (
      trigger.dataset.mailTitle ||
      trigger.dataset.subject ||
      doc.getElementById("tituloFlujoActual")?.value ||
      "Nuevo correo"
    );
  }

  function resolveUserIdentity() {
    loadSpServices().catch(() => { });
    loadCurrentUserInfo().catch(() => { });
    const nombre = currentUserCache.nombre || "";
    const usuario =
      currentUserCache.usuario || normalizeUserLogin(getSpUserLogin());
    return {
      nombre: (nombre || "").trim(),
      usuario: (usuario || "").trim(),
    };
  }

  function getTriggerPrefix(trigger) {
    return trigger.dataset.subjectPrefix || "Nuevo correo";
  }

  function getTriggerRecipient(trigger) {
    if (trigger.dataset.cc && trigger.dataset.cc.trim()) {
      return trigger.dataset.cc;
    }
    return resolveDefaultCc();
  }

  async function handleCorreoTrigger(event) {
    event.preventDefault();
    const trigger = event.currentTarget;
    const title = getTriggerTitle(trigger);
    const prefix = getTriggerPrefix(trigger);
    const userEmail = getTriggerRecipient(trigger);
    const initial = {
      subject: `${prefix}: ${title}`,
      cc: userEmail,
      bodyHtml: `<p>Hola,</p><p>Te comparto la información solicitada sobre <strong>${title}</strong>.</p>`,
    };
    const controller = await openCorreoModal({
      initialValues: initial,
      defaultCc: userEmail,
    });
    controller?.hydrate({ cc: userEmail });
  }

  function bindCorreoTriggers() {
    const selector = "[data-open-correo-modal]";
    const triggers = doc.querySelectorAll(selector);
    if (!triggers.length) return;
    triggers.forEach((trigger) => {
      if (trigger.dataset.modalGeneralBound === "1") return;
      trigger.dataset.modalGeneralBound = "1";
      trigger.addEventListener("click", handleCorreoTrigger);
    });
  }

  function initCorreoTriggers() {
    if (doc.readyState === "loading") {
      doc.addEventListener("DOMContentLoaded", bindCorreoTriggers);
    } else {
      bindCorreoTriggers();
    }
  }

  win.ModalGeneral = {
    openModal,
    openCorreoModal,
    closeModal,
    attachCorreoForm,
    loadTemplate,
    getCurrentEmail: getCurrentEmailSync,
    loadEmpleadosOnce,
  };

  // Precarga de empleados en background
  win._correoPeoplePreload = function () {
    try {
      if (typeof win.ModalGeneral === "object" && typeof win.ModalGeneral.loadEmpleadosOnce === "function") {
        win.ModalGeneral.loadEmpleadosOnce().catch(() => { });
      }
    } catch (_) { }
  };

  initCorreoTriggers();
})(window, document);

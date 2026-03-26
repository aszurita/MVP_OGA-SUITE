/**
 * Helper de usuario y fecha para OGA Suite.
 */
(function (root, factory) {
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = factory();
  } else {
    root.UserHelper = factory();
  }
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  function getLocalIsoTime() {
    const tzoffset = (new Date()).getTimezoneOffset() * 60000;
    return (new Date(Date.now() - tzoffset)).toISOString().slice(0, -1);
  }

  function getCurrentUser() {
    if (typeof window === 'undefined') return null;
    if (window.current_user) return window.current_user;
    if (typeof window.obtenerUsuario === 'function') {
      try {
        const info = window.obtenerUsuario();
        if (info && info.current_user) return info.current_user;
      } catch (_) { }
    }
    return null;
  }

  function getCurrentEmail() {
    if (typeof window === 'undefined') return null;
    if (window.current_email) return window.current_email;
    if (typeof window.obtenerUsuario === 'function') {
      try {
        const info = window.obtenerUsuario();
        if (info && info.current_email) return info.current_email;
      } catch (_) { }
    }
    return null;
  }

  function getWebUser() {
    const raw = getCurrentUser() || '';
    if (!raw) return null;
    // Quita claims | y dominio\usuario
    const partsPipe = raw.split('|');
    const lastPipe = partsPipe[partsPipe.length - 1];
    const slashIdx = Math.max(lastPipe.lastIndexOf('\\'), lastPipe.lastIndexOf('/'));
    return (slashIdx >= 0 ? lastPipe.slice(slashIdx + 1) : lastPipe).trim() || null;
  }

  async function getEmployeeCode(userName) {
    if (typeof window === 'undefined') return null;
    const resolver = typeof window.getEmployeeCodeByUser === 'function' ? window.getEmployeeCodeByUser : null;
    const currentUser = userName || getCurrentUser();
    if (!resolver) return currentUser;
    try {
      const result = resolver(currentUser);
      const code = (result && typeof result.then === 'function') ? await result : result;
      const trimmed = (code ?? '').toString().trim();
      return trimmed || null;
    } catch (error) {
      console.warn('[UserHelper] Error obteniendo codigo empleado:', error);
      return null;
    }
  }

  /**
   * Devuelve el listado de empleados si existe getEmpleados() global.
   * Cachea el resultado en window.__empleadosCache si está disponible.
   */
  async function loadEmpleadosOnce() {
    if (typeof window === 'undefined') return [];
    if (window.__empleadosCache) return window.__empleadosCache;
    if (typeof window.getEmpleados !== 'function') return [];
    try {
      const arr = window.getEmpleados() || [];
      arr.sort((a, b) => (a.nombreCompleto || '').localeCompare(b.nombreCompleto || ''));
      window.__empleadosCache = arr;
      return arr;
    } catch (e) {
      console.error("[UserHelper] Falló getEmpleados()", e);
      return [];
    }
  }

  function getFechaActual() {
    if (typeof window !== 'undefined' && typeof window.getUserAndDate === 'function') {
      const fecha = window.getUserAndDate()?.[1];
      if (fecha) return fecha;
    }
    return getLocalIsoTime();
  }


  function registrar_visita(nombre_pagina, sub_pagina = " ") {
    // Obtiene usuario a partir del helper o funciones globales disponibles
    let current_user = getCurrentUser();
    if (!current_user && typeof window !== 'undefined') {
      if (typeof window.obtenerUsuario === 'function') {
        try {
          const info = window.obtenerUsuario();
          if (info && info.current_user) current_user = info.current_user;
        } catch (_) { }
      }
      if (!current_user && window.current_user) current_user = window.current_user;
    }
    current_user = current_user || "";
    const usuarioRaw = (current_user || "").toString();
    const usuarioNormalizado = usuarioRaw.includes("\\") || usuarioRaw.includes("/")
      ? usuarioRaw.split(/[\\/]/).pop().toLowerCase()
      : usuarioRaw.toLowerCase();
    const correoNormalizado = usuarioNormalizado.includes("@")
      ? usuarioNormalizado
      : `${usuarioNormalizado}@bancoguayaquil.com`;
    const overridesLower = (typeof OGA_OVERRIDES_LOWER !== "undefined" && Array.isArray(OGA_OVERRIDES_LOWER))
      ? OGA_OVERRIDES_LOWER
      : (typeof OGA_OVERRIDES !== "undefined" && Array.isArray(OGA_OVERRIDES))
        ? OGA_OVERRIDES.map(e => String(e).toLowerCase())
        : [];
    if (overridesLower.includes(correoNormalizado)) return;

    // intenta obtener datos del visitante mediante la función global si existe
    let datos_usuario = null;
    if (typeof window !== 'undefined' && typeof window.datos_visitante === 'function') {
      try {
        datos_usuario = window.datos_visitante(current_user);
      } catch (e) {
        console.warn('[UserHelper] datos_visitante falló:', e);
        datos_usuario = null;
      }
    }

    let array_datos_usuario;
    if (!datos_usuario) {
      array_datos_usuario = [" ", " ", " "];
    } else if (typeof datos_usuario.attr === 'function') {
      array_datos_usuario = [
        datos_usuario.attr("ows_valor4"),
        datos_usuario.attr("ows_valor1"),
        datos_usuario.attr("ows_valor10")
      ];
    } else if (Array.isArray(datos_usuario)) {
      array_datos_usuario = datos_usuario;
    } else {
      // estructura desconocida
      array_datos_usuario = [" ", " ", " "];
    }

    const localISOTime = getLocalIsoTime();

    // Verifica que SPServices esté disponible
    if (typeof $ !== 'function' || typeof $().SPServices !== 'function') {
      console.warn('[UserHelper] SPServices no disponible. No se registrará la visita.');
      return;
    }

    $().SPServices({
      operation: "UpdateListItems",
      async: false,
      batchCmd: "New",
      listName: "Z_LOG_VISITAS_OGA_SUITE",
      valuepairs: [
        ["usuario", current_user],
        ["codigo_empleado", array_datos_usuario[0]],
        ["desc_pagina", nombre_pagina],
        ["sub_pagina", sub_pagina],
        ["centro_costo", array_datos_usuario[1]],
        ["departamento", array_datos_usuario[2]],
        ["fecha", localISOTime],
      ],
      completefunc: function (xData, Status) {
        // no-op
      }
    });
  }

  return {
    getLocalIsoTime,
    getCurrentUser,
    getWebUser,
    getCurrentEmail,
    getEmployeeCode,
    loadEmpleadosOnce,
    getFechaActual,
    registrar_visita
  };
});

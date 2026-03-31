/**
 * Funciones auxiliares para el sistema de Linaje
 * Utilidades comunes y helpers
 */

class LinajeHelpers {

  /**
   * Obtiene parámetros de URL
   */
  static getQueryParam(name) {
    return new URLSearchParams(location.search).get(name) || '';
  }

  /**
   * Escapa caracteres especiales para consultas SQL
   */
  static escapeSqlString(str) {
    if (typeof str !== 'string') return str;
    return str.replace(/'/g, "''");
  }

  /**
   * Genera ID único para nodos
   */
  static generateUniqueId(prefix = 'node') {
    return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Formatea fecha para nombres de archivo
   */
  static formatDateForFilename(date = new Date()) {
    return date.toISOString().split('T')[0];
  }

  /**
   * Valida si un valor es un string no vacío
   */
  static isValidString(value) {
    return typeof value === 'string' && value.trim().length > 0;
  }

  /**
   * Valida si un array tiene elementos
   */
  static isValidArray(arr) {
    return Array.isArray(arr) && arr.length > 0;
  }

  /**
   * Debounce function para optimizar llamadas
   */
  static debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  /**
   * Throttle function para limitar frecuencia de llamadas
   */
  static throttle(func, limit) {
    let inThrottle;
    return function (...args) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }

  /**
   * Crea un elemento DOM con atributos
   */
  static createElement(tag, attributes = {}, textContent = '') {
    const element = document.createElement(tag);

    Object.entries(attributes).forEach(([key, value]) => {
      if (key === 'className') {
        element.className = value;
      } else if (key === 'innerHTML') {
        element.innerHTML = value;
      } else {
        element.setAttribute(key, value);
      }
    });

    if (textContent) {
      element.textContent = textContent;
    }

    return element;
  }

  /**
   * Remueve todos los event listeners de un elemento
   */
  static removeAllEventListeners(element) {
    const newElement = element.cloneNode(true);
    element.parentNode.replaceChild(newElement, element);
    return newElement;
  }

  /**
   * Verifica si un elemento está visible en el viewport
   */
  static isElementInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  }

  /**
   * Scroll suave a un elemento
   */
  static smoothScrollTo(element, offset = 0) {
    if (!element) return;

    const elementPosition = element.offsetTop - offset;
    window.scrollTo({
      top: elementPosition,
      behavior: 'smooth'
    });
  }

  /**
   * Copia texto al clipboard
   */
  static async copyToClipboard(text) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (err) {
      // Fallback para navegadores que no soportan clipboard API
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      return true;
    }
  }

  /**
   * Descarga un archivo
   */
  static downloadFile(content, filename, mimeType = 'application/json') {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  /**
   * Maneja errores de forma consistente
   */
  static handleError(error, context = '') {
    const message = `❌ Error${context ? ` en ${context}` : ''}: ${error.message || error}`;
    console.error(message, error);

    // Mostrar notificación al usuario si es posible
    if (typeof window !== 'undefined' && window.alert) {
      window.alert(message);
    }

    return message;
  }

  /**
   * Log con timestamp
   */
  static log(message, data = null) {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] ${message}`;

    if (data) {
      console.log(logMessage, data);
    } else {
      console.log(logMessage);
    }
  }

  static showToast(message, variant = 'info') {
    if (typeof document === 'undefined') return;
    const containerId = 'linaje-toast-container';
    let container = document.getElementById(containerId);
    if (!container) {
      container = document.createElement('div');
      container.id = containerId;
      container.className = 'linaje-toast-container';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `linaje-toast linaje-toast--${variant}`;
    toast.textContent = message;
    container.appendChild(toast);

    requestAnimationFrame(() => toast.classList.add('is-visible'));

    setTimeout(() => {
      toast.classList.remove('is-visible');
      setTimeout(() => toast.remove(), 200);
    }, 3200);
  }

  /**
   * Normaliza partes de identificador (trim + upper)
   */
  static normalizeEntityPart(value) {
    if (value == null) return '';
    return String(value).trim().toUpperCase();
  }

  /**
   * Construye el id compuesto [Base].[Servidor].[Esquema].[Tabla]
   */
  static buildEntidadBaseId({ base, servidor, esquema, tabla } = {}) {
    const parts = [
      this.normalizeEntityPart(base),
      this.normalizeEntityPart(servidor),
      this.normalizeEntityPart(esquema),
      this.normalizeEntityPart(tabla)
    ].filter(Boolean);

    if (!parts.length) return '';
    return `[${parts.join('].[')}]`;
  }

  /**
   * Obtiene el código empleado usando la lista Z_DATOS_EMPLEADOS
   */
  static lookupEmployeeCode(userName) {
    try {
      const name = (userName || '').split('|').pop();
      if (!name || typeof $ === 'undefined' || !$.fn || !$.fn.SPServices) return '';
      let userCode = '';
      $().SPServices({
        operation: 'GetListItems',
        async: false,
        listName: 'Z_DATOS_EMPLEADOS',
        CAMLQuery: `<Query><Where><Eq><FieldRef Name='USUARIO' /><Value Type='Text'>${name}</Value></Eq></Where></Query>`,
        CAMLViewFields: "<ViewFields><FieldRef Name='CODIGO_EMPLEADO' /></ViewFields>",
        completefunc: function (xData, Status) {
          if (Status === 'success') {
            const item = $(xData.responseXML).find("z\\:row").first();
            if (item && item.length) {
              userCode = item.attr('ows_CODIGO_EMPLEADO') || '';
            }
          } else {
            console.error('[LinajeHelpers] Error obteniendo código de empleado:', Status);
          }
        }
      });
      return userCode;
    } catch (error) {
      console.warn('[LinajeHelpers] lookupEmployeeCode falló:', error);
      return '';
    }
  }

  /**
   * Obtiene usuario actual (SharePoint) priorizando código de empleado
   */
  static getCurrentUser(fallback = 'desconocido') {
    const rawUser = (typeof window !== 'undefined' && window.current_user)
      ? String(window.current_user || '')
      : '';

    if (rawUser) {
      const code = this.lookupEmployeeCode(rawUser);
      if (code) return code.trim();
    }

    if (rawUser) {
      const clean = rawUser.includes('\\') ? rawUser.split('\\').pop() : rawUser;
      return clean.trim().toLowerCase() || fallback;
    }

    return fallback;
  }
}

function getValoresTipoNodoLinaje() {
  const lista = [];
  const set = Object.create(null); // evitar duplicados

  // ✅ Acepta cualquiera de las dos formas de carga del plugin
  if (typeof jQuery === 'undefined' || !(jQuery.SPServices || (jQuery.fn && jQuery.fn.SPServices))) {
    try { console.warn('SPServices no está cargado.'); } catch(e){}
    return lista;
  }

  // (opcional) crea un alias para que exista jQuery.SPServices también
  if (!jQuery.SPServices && jQuery.fn && jQuery.fn.SPServices) {
    jQuery.SPServices = jQuery.fn.SPServices;
  }

  $().SPServices({
    operation: "GetListItems",
    async: false,
    listName: "Z_CATALOGO_OGASUITE",
    CAMLQuery: "<Query><Where><And><Eq><FieldRef Name='txt_etiqueta'/><Value Type='Text'>Tipo Nodo Linaje</Value></Eq><Eq><FieldRef Name='trans_id'/><Value Type='Text'>30</Value></Eq></And></Where><OrderBy><FieldRef Name='ID' Ascending='TRUE' /></OrderBy></Query>",
    CAMLViewFields: "<ViewFields><FieldRef Name='valor2' /></ViewFields>",
    completefunc: function (xData, Status) {
      $(xData.responseXML).SPFilterNode("z:row").each(function () {
        const raw = $(this).attr("ows_valor2");
        if (raw != null) {
          const v = String(raw).trim();
          if (v && !set[v]) { set[v] = true; lista.push(v); }
        }
      });
    }
  });

  return lista;
}


// Exportar para uso en otros módulos
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { LinajeHelpers };
} else {
  window.LinajeHelpers = LinajeHelpers;
}

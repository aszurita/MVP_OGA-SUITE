(function initUIBotones() {
    function onReady() {  
      // 1) Asegurar que isOGA exista
      if (typeof window.isOGA !== "function") {
        return;
      }
  
      let esOGA = false;
      try {
        // OJO: isOGA() hace una llamada sincrónica con SPServices, así que retorna boolean.
        esOGA = !!window.isOGA();
      } catch (err) {
        return;
      }
  
      // 2) Ocultar si NO es OGA
      if (!esOGA) {
        ocultar("#btnNuevaValidacion");
        ocultar("#guardarValidacionBtn");
        ocultar("#btnDescartarCambios");
        ocultar("#btnBloquearValidacion");
      } else {
      }
    }
  
    function ocultar(sel) {
      const el = document.querySelector(sel);
      if (el) el.style.display = "none";
    }
  
    // Ejecuta onReady de forma segura, sin perder el evento si ya disparó
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", onReady);
    } else {
      onReady();
    }
  })();
  
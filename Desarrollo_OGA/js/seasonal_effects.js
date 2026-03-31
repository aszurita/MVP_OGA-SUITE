(function initGlobalSnow() {
  const STYLE_ID = "oga-snow-style";
  const CONTAINER_ID = "contenedor-nieve";
  const INTERVAL_MS = 150;

  function shouldShowSnow() {
    if (window.usarLogoNavidad === true) return true;
    if (window.usarLogoNavidad === false) return false;
    return new Date().getMonth() === 11;
  }

  function ensureStyle() {
    if (document.getElementById(STYLE_ID)) return;
    const style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = [
      "@keyframes caerNieve {",
      "  0% { transform: translateY(0) rotate(0deg); opacity: 1; }",
      "  100% { transform: translateY(120px) rotate(360deg); opacity: 0.3; }",
      "}",
      "#contenedor-nieve {",
      "  position: fixed;",
      "  top: 0;",
      "  left: 0;",
      "  width: 100%;",
      "  height: 140px;",
      "  pointer-events: none;",
      "  overflow: hidden;",
      "  z-index: 1030;",
      "}",
      ".copo-nieve {",
      "  position: absolute;",
      "  top: -20px;",
      "  color: #fff;",
      "  pointer-events: none;",
      "  text-shadow: 0 0 8px rgba(255, 255, 255, 0.9);",
      "  user-select: none;",
      "}",
      ""
    ].join("\n");
    document.head.appendChild(style);
  }

  function getContainer() {
    let container = document.getElementById(CONTAINER_ID);
    if (!container) {
      container = document.createElement("div");
      container.id = CONTAINER_ID;
      document.body.appendChild(container);
    }
    return container;
  }

  function crearCopo(container) {
    const copo = document.createElement("div");
    copo.className = "copo-nieve";
    copo.innerHTML = "&#10052;";

    const tamano = Math.random() * 1.2 + 0.6;
    const duracion = Math.random() * 4 + 4;
    const opacidad = Math.random() * 0.5 + 0.5;
    const posicionX = Math.random() * 100;

    copo.style.cssText += [
      `font-size: ${tamano}em;`,
      `opacity: ${opacidad};`,
      `left: ${posicionX}%;`,
      `animation: caerNieve ${duracion}s linear forwards;`
    ].join(" ");

    container.appendChild(copo);
    setTimeout(() => copo.remove(), duracion * 1000);
  }

  function iniciarNieve() {
    if (!shouldShowSnow()) return;
    if (window.__ogaSnowInterval) return;
    ensureStyle();
    const container = getContainer();
    window.__ogaSnowInterval = setInterval(() => crearCopo(container), INTERVAL_MS);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", iniciarNieve);
  } else {
    iniciarNieve();
  }
})();

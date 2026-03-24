document.addEventListener("DOMContentLoaded", () => {
  const path = window.location.pathname.toLowerCase();
  const targets = ["casosdeuso.aspx", "dominio_estructura.aspx", "dominio_artefactos.aspx"];
  if (!targets.some(target => path.endsWith(target))) return;
  const params = window.location.search.slice(1).split("&");
  let idDominio = null;
  for (const param of params) {
    const [key, ...rest] = param.split("=");
    if (decodeURIComponent(key) === "id_dominio") {
      idDominio = decodeURIComponent(rest.join("="));
      break;
    }
  }
  if (!idDominio) return;
  const href = `FichaDominio.aspx?id_dominio=${encodeURIComponent(idDominio)}`;
  const button = document.createElement("a");
  button.href = href;
  button.className = "btn btn-outline-primary retorno-ficha-btn";
  button.innerHTML = `<i class="iconsminds-arrow-left-2 mr-1"></i><span>Volver a ficha</span>`;
  const target = document.querySelector(".page-title") || document.querySelector(".content-area") || document.querySelector(".breadcrumb");
  if (target && target.parentNode) {
    const wrapper = document.createElement("div");
    wrapper.className = "retorno-ficha-wrapper";
    wrapper.appendChild(button);
    target.parentNode.insertBefore(wrapper, target.nextSibling);
  } else {
    document.body.insertAdjacentElement("afterbegin", button);
  }
});

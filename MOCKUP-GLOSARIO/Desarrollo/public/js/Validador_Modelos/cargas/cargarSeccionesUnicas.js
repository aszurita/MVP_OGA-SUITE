async function cargarSeccionesUnicas() {
  const container = $(".card-body.seccion"); // Contenedor de las secciones
  container.empty();

  const payload = {
    campos: "DISTINCT seccion_validacion", // Pedimos solo los valores únicos de la columna necesaria.
    origen: "procesos_bi.dbo.T_Z_plantilla_validacion",
    condicion: "seccion_validacion IS NOT NULL AND seccion_validacion <> ''" // Filtramos nulos y vacíos en la BD.
  };

  try {
    console.log("🔵 POST http://gobinfoana01-2:8510/query (cargarSeccionesUnicas)", payload);
    const response = await fetch("http://gobinfoana01-2:8510/query", {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error(`Error en la API: ${response.status}`);
    }

    const data = await response.json();
    const secciones = Array.isArray(data) ? data : [data];

    if (secciones.length === 0) {
      container.append("<p>No se encontraron secciones de validación.</p>");
      return;
    }

    secciones.forEach(item => {
      const seccion = item.seccion_validacion;
      if (!seccion) return; // Omitir si el valor es nulo/vacío

      const html = `
        <div class="d-flex justify-content-start align-items-center mb-2">
          <!-- Card de la sección -->
          <div class="card mb-4 seccion-item disabled" data-seccion="${seccion}" style="padding: 13px; margin-right: 10px; flex: 1; pointer-events: none; opacity: 0.5;">
            <div class="card-body" style="padding: 1px;">
              <h5 class="card-title" style="font-size: 15px; margin-bottom: 0;">${seccion}</h5>
            </div>
          </div>

          <!-- Card para mostrar el score de la sección -->
          <div class="card mb-4" style="background-color: #f9f9f9; flex: 0 0 120px;">
            <div class="card-body text-center" style="padding: 1px">
              <h6 class="card-title" style="font-size: 16px; margin-bottom: 5px;">Score:</h6>
              <span id="score-seccion-${seccion}" class="font-weight-bold" style="font-size: 1.1rem; color: #D2006E;">0.00%</span>
            </div>
          </div>
        </div>
      `;
      container.append(html);
    });
  } catch (error) {
    console.error("Error al cargar secciones únicas desde la API:", error);
    container.append("<p>Error al obtener los datos de las secciones.</p>");
  }
}

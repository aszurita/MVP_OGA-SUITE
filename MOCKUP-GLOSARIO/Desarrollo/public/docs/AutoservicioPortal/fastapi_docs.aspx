
    <!DOCTYPE html>
    <html>
    <head>
    <link type="text/css" rel="stylesheet" href="https://cdn.jsdelivr.net/npm/swagger-ui-dist@5/swagger-ui.css">
    <link rel="shortcut icon" href="https://fastapi.tiangolo.com/img/favicon.png">
    <title>FastAPI - Swagger UI</title>
    </head>
    <body>
    <div id="swagger-ui">
    </div>
    <script src="https://cdn.jsdelivr.net/npm/swagger-ui-dist@5/swagger-ui-bundle.js"></script>
    <!-- `SwaggerUIBundle` is now available on the page -->
    <script>
    // const ui = SwaggerUIBundle({
    //     url: '/openapi.json',
    //     "dom_id": "#swagger-ui",
    //     "layout": "BaseLayout",
    //     "deepLinking": true,
    //     "showExtensions": true,
    //     "showCommonExtensions": true,
    //     oauth2RedirectUrl: window.location.origin + '/docs/oauth2-redirect',
    //     presets: [
    //         SwaggerUIBundle.presets.apis,
    //         SwaggerUIBundle.SwaggerUIStandalonePreset
    //         ],
    //     })

        async function loadSwaggerFromTxt() {
            try {
                const response = await fetch('./openapi.txt'); // Ruta al archivo .txt
                const text = await response.text(); // Leer contenido como texto
                const json = JSON.parse(text); // Convertir el texto a JSON

                SwaggerUIBundle({
                    spec: json, // Pasar el JSON parseado directamente
                    dom_id: "#swagger-ui",
                    layout: "BaseLayout",
                    deepLinking: true,
                    showExtensions: true,
                    showCommonExtensions: true,
                    oauth2RedirectUrl: window.location.origin + '/docs/oauth2-redirect',
                    presets: [
                        SwaggerUIBundle.presets.apis,
                        SwaggerUIBundle.SwaggerUIStandalonePreset
                    ],
                });
            } catch (error) {
                console.error("Error al cargar el archivo OpenAPI:", error);
            }
        }

        loadSwaggerFromTxt();
    </script>
    </body>
    </html>
    
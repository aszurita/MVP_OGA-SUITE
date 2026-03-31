<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Test API</title>
</head>
<body>
  <script>
    const url = "http://gobinfoana01-2:8510/query";
    const payload = {
      campos: "id_validacion,observaciones,obs_seccion1,obs_seccion2",
      origen: "BG_Lab.dbo.z_cabecera_score",
      condicion: "id_validacion>0"
    };

    fetch(url, {
      method: "POST",
      headers: {
        "accept": "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    })
    .then(res => {
      if (!res.ok) throw new Error("Error HTTP " + res.status);
      return res.json();
    })
    .then(data => {
      console.log("✅ Respuesta:", data);
    })
    .catch(err => {
      console.error("❌ Error:", err);
    });
  </script>
</body>
</html>

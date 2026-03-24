// Función para actualizar permisos en memoria temporal
function actualizarMemoriaPermisos(user, button, isChecked) {
    if (!permisosTemp.has(button)) {
        permisosTemp.set(button, new Set());
    }

    if (isChecked) {
        permisosTemp.get(button).add(user);
    } else {
        permisosTemp.get(button).delete(user);
    }

    console.log("📌 Memoria Temporal Actualizada:", permisosTemp);
}

window.actualizarMemoriaPermisos = actualizarMemoriaPermisos;
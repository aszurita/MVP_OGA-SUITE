/* js/Validador_Modelos/utils/sincronizarDetalleScore.js
   Sincroniza los detalles de una validación                   */
   function sincronizarDetalleScore(id_validacion,
    detalleActual = [],
    detalleNuevo  = [],
    usuario,
    fecha) {

/* 🔄 Pasamos el array actual a Mapa  id_pregunta ➜ registro  */
const mapaActual = new Map(
detalleActual.map(d => [ String(d.id_pregunta), d ])
);

const aCrear   = [];
const aCambiar = [];

detalleNuevo.forEach(nvo => {
const clave = String(nvo.id_pregunta);
const act   = mapaActual.get(clave);

if (!act) {                            /* —— No existe ⇒ INSERT —— */
aCrear.push(nvo);

} else if (act.valor !== nvo.valor || act.aplica !== nvo.aplica) {
aCambiar.push({
id_validacion: id_validacion, // Usamos el id_validacion del scope de la función
id_pregunta: nvo.id_pregunta, // Añadimos el id_pregunta para la condición del UPDATE
valor: nvo.valor,
aplica: nvo.aplica
});
}
});

/* 📝 Inserta y actualiza -------------------------------------- */
if (aCrear.length)   insertarDetalleScore(aCrear);
console.log(aCrear)
if (aCambiar.length) updateDetalleScore(id_validacion, aCambiar, usuario, fecha);
}

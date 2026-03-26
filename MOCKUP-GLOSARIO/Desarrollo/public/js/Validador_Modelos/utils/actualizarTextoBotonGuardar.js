/* Cambia el label del botón según exista o no validación previa */
function actualizarTextoBotonGuardar(existeValidacion){
    const $btn = $("#guardarValidacionBtn");
    if (!$btn.length) return;
  
    /*if (existeValidacion){
      $btn.text("Actualizar Validación")
          .removeClass("btn-success")
    }else{
      $btn.text("Guardar Validación")
          .removeClass("btn-warning")
    }*/
        
  }
  
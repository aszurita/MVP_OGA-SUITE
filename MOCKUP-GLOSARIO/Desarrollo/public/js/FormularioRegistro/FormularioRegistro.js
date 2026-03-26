function FormularioRegistro(){
    listenerFormularioRegistro();
    setDataTableUsers(window.longLoc || [])
}

FormularioRegistro()

window.FormularioRegistro = FormularioRegistro;
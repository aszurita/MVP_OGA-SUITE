function getLongLocUsers({state}={}){
    const users = []
    let query = ""
    if(state) query = `<Query><Where><Eq><FieldRef Name="ESTADO"/><Value Type="text">${state}</Value></Eq></Where></Query>`
    $().SPServices({
        operation: "GetListItems",
        async: false,
        listName: "LONG_LOC_MODEL_ART",
        CAMLQuery: query,
        CAMLViewFields: "<ViewFields>\
                            <FieldRef Name = 'valor1' />\
                            <FieldRef Name = 'valor2' />\
                            <FieldRef Name = 'valor3' />\
                            <FieldRef Name = 'valor4' />\
                            <FieldRef Name = 'valor5' />\
                            <FieldRef Name = 'valor6' />\
                            <FieldRef Name = 'valor7' />\
                            <FieldRef Name = 'valor8' />\
                            <FieldRef Name = 'valor9' />\
                            <FieldRef Name = 'valor10' />\
                            <FieldRef Name = 'valor11' />\
                            <FieldRef Name = 'valor12' />\
                            <FieldRef Name = 'valor13' />\
                            <FieldRef Name = 'CODIGO_ROL_FUNCION' />\
                            <FieldRef Name = 'CODIGO_ROL_DATOS' />\
                            <FieldRef Name = 'ESTADO' />\
                        </ViewFields>",
        completefunc: function (xData, Status) {
            $(xData.responseXML).find("z\\:row").each(function () {
                // if($(this).attr("ows_valor10") !== "JUBILADOS" && $(this).attr("ows_valor13") !== "DataUser" ){
                if($(this).attr("ows_valor10") !== "JUBILADOS"){
                    const data = {
                        area : $(this).attr("ows_valor1") || "", 
                        cargo : $(this).attr("ows_valor2") || "", 
                        localidad : $(this).attr("ows_valor3") || "", 
                        codigo : $(this).attr("ows_valor4") || "",
                        nombres : $(this).attr("ows_valor5") || "",
                        apellidoPaternal : $(this).attr("ows_valor6") || "",
                        apellidoMaternal : $(this).attr("ows_valor7") || "",
                        usuario : ($(this).attr("ows_valor8") || "").split("@")[0],
                        fechaIngreso : $(this).attr("ows_valor9") || "",
                        banca : $(this).attr("ows_valor10") || "",
                        codigoRolFuncion : $(this).attr("ows_CODIGO_ROL_FUNCION") || "",
                        codigoRolDatos : $(this).attr("ows_CODIGO_ROL_DATOS") || "",
                        rolFuncion : $(this).attr("ows_valor11") || "",
                        rolDatos : $(this).attr("ows_valor13") || "",
                        estado : $(this).attr("ows_ESTADO") || "",
                        habilidades : $(this).attr("ows_valor12") || "",
                    }
                    data.rolFuncion =(data.codigoRolFuncion && window.catalogoRolFuncion) ? window.catalogoRolFuncion[data.codigoRolFuncion] :data.rolFuncion,
                    data.rolDatos = (data.codigoRolDatos && window.catalogoRolDatos) ? window.catalogoRolDatos[data.codigoRolDatos] : data.rolDatos,
                    data.nombreCompleto = `${data.nombres} ${data.apellidoPaternal} ${data.apellidoMaternal}` 
                    data.correo = `${data.usuario}@bancoguayaquil.com`
                    users.push(data)
                }
            });
        }
})
return users
}

window.getLongLocUsers = getLongLocUsers;
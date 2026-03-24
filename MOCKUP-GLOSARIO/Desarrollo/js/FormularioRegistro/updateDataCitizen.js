function updateDataCitizen({userCode=null, valuepairs=[]}={}){
    if(!userCode || valuepairs.length===0) return;
    $().SPServices.SPUpdateMultipleListItems({
        async: true,
        listName: "LONG_LOC_MODEL_ART",
        batchCmd: "Update",
        CAMLQuery: `<Query><Where><Eq><FieldRef Name="valor4"/><Value Type="Text">${userCode}</Value></Eq></Where></Query>`,
        valuepairs: valuepairs ,
        completefunc: function (xData, Status) {
            let usuario = ""
            $(xData.responseXML).find("z\\:row").each(function () {
                usuario=($(this).attr("ows_valor8")||"").split("@")[0]
            })
            showNotification("top", "center", "success", `Se ha actualizado el usuario ${usuario}`, 1500)
        } //completefunc
    });
}

window.updateDataCitizen = updateDataCitizen;
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Consultar Documentos Adjuntos</title>
<script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
<script src="http://vamos.bancoguayaquil.com/sitios/informaciongerencial/OGA_Suite/Desarrollo/js/jquery.SPServices.v2014-02.min.js"></script>
</head>
<body>
<h2>Lista de Documentos Adjuntos</h2>
<select id="elementos"></select>
<button id="consultarButton">Consultar Documentos</button>
<div id="documentList"></div>
<script>
    $(document).ready(function() {
        var listName = "Z_PRUEBA_LLM"; // Nombre de tu lista en SharePoint
        var dropdown = $("#elementos");

        // Obtener los elementos de la lista
        $().SPServices({
            operation: "GetListItems",
            listName: listName,
            CAMLQuery: "<Query><OrderBy><FieldRef Name='ID' Ascending='True' /></OrderBy></Query>",
            CAMLViewFields: "<ViewFields><FieldRef Name='ID' /><FieldRef Name='Title' /></ViewFields>",
            completefunc: function(xData, Status) {
                if(Status == "success") {
                    $(xData.responseXML).SPFilterNode("z:row").each(function() {
                        var id = $(this).attr("ows_ID");
                        var title = $(this).attr("ows_Title");
                        dropdown.append("<option value='" + id + "'>" + title + "</option>");
                    });
                } else {
                    console.log("Error al obtener los elementos de la lista: " + Status);
                }
            }
        });

        // Consultar documentos adjuntos al elemento seleccionado
        $("#consultarButton").click(function() {
            var itemId = dropdown.val();

            $().SPServices({
                operation: "GetAttachmentCollection",
                listName: listName,
                ID: itemId,
                completefunc: function(xData, Status) {
                    if(Status == "success") {
                        var documentList = $("#documentList");
                        documentList.empty(); // Limpiar la lista antes de agregar los documentos
                        

                        console.log(xData.responseXML);
                        $(xData.responseXML).find("Attachment").each(function() {
                            console.log(xData.responseXML);
                            var fileName = $(this).text();
                            var serverUrl = $(this).attr("ows_ServerUrl");
                            var documentLink = "<a href='" + fileName + "'>" + fileName + "</a>";
                            documentList.append(documentLink + "<br>");
                        });
                    } else {
                        console.log("Error al obtener los archivos adjuntos: " + Status);
                    }
                }
            });
        });
    });
</script>
</body>
</html>


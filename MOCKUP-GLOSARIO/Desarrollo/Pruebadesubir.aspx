<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Subir Archivos a SharePoint</title>
<script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
<script src="http://vamos.bancoguayaquil.com/sitios/informaciongerencial/OGA_Suite/Desarrollo/js/jquery.SPServices.v2014-02.min.js"></script>
</head>
<body>
<input type="file" id="fileUpload" multiple />
<button id="uploadButton">Subir Archivos</button>
<script>
    $(document).ready(function() {
        $('#uploadButton').click(function() {
            var files = $('#fileUpload')[0].files;
            var listName = "Z_PRUEBA_LLM"; // Nombre de tu biblioteca de documentos

            for (var i = 0; i < files.length; i++) {
                uploadFileToSharePoint(files[i], listName);
            }
        });

        function uploadFileToSharePoint(file, listName) {
            var reader = new FileReader();
            reader.onload = function(e) {
                var fileContent = e.target.result;
                var fileBase64 = arrayBufferToBase64(new Uint8Array(fileContent));

                $().SPServices({
                    operation: "AddAttachment",
                    listName: listName,
                    listItemID: 2, 
                    fileName: file.name,
                    attachment: fileBase64,
                    async: false,
                    completefunc: function(xData, Status) {
                        console.log(Status);
                        if (Status === "success") {
                            alert("Archivo subido exitosamente: " + file.name);
                        } else {
                            alert("Error al subir el archivo: " + file.name);
                        }
                    }
                });
            };
            reader.readAsArrayBuffer(file);
        }

        function arrayBufferToBase64(buffer) {
            var binary = '';
            var bytes = new Uint8Array(buffer);
            var len = bytes.byteLength;
            for (var i = 0; i < len; i++) {
                binary += String.fromCharCode(bytes[i]);
            }
            return btoa(binary);
        }
    });
</script>
</body>
</html>


<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Subir Archivos a Carpeta en SharePoint</title>
<script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
<script src="http://vamos.bancoguayaquil.com/sitios/informaciongerencial/OGA_Suite/Desarrollo/js/jquery.SPServices.v2014-02.min.js"></script>
</head>
<body>
<h2>Subir Archivos a Carpeta en SharePoint</h2>
<!-- "COMENTADO" -->
<!-- multiple : Permite al usuario seleccionar varios archivos -->
 <!-- Usa el componente input  y crear un campo de tipo file-->
<input type="file" id="fileUpload" multiple />
<!-- Se crea un boton al que se le asigna el id uploadButton  -->
<button id="uploadButton">Subir Archivos</button>
<!-- div para mostrar el estatus por pantalla  -->
<div id="uploadStatus"></div>

<!-- JS -->
<script>
    $(document).ready(function() {
        //Se ejecuta al hacer clic en el boton
        $('#uploadButton').click(function() {
            // Se crea una variable files , en el cual se guardaran las listas de archivos que estemos seleccionando
            var files = $('#fileUpload')[0].files;
            console.log("files :  ",files)
            // Se crea una variable donde se coloca la url de la carpeta donde queremos guardar el archivo.
            var folderUrl = "http://vamos.bancoguayaquil.com/sitios/informaciongerencial/Paginas/ANALYTICS/Marlon%20Z/PAGINAS/COMUNIDAD_ANALITICA/assets/documentacion";
            
            //Itera sobre la lista de archivos seleccionados.
            //files[i] : Es la posicion de cada archivo
            //folderUrl : La url de la carpeta
            for (var i = 0; i < files.length; i++) {
                uploadFileToSharePoint(files[i], folderUrl);
            }
        });

        //Funcion para subir los archivos a Sharepoint
        function uploadFileToSharePoint(file, folderUrl) {
            //Se crea una instancia FileReader() permite la lectura del archivo
            var reader = new FileReader();

            //permite leer el contenido de un archivo y devolver los datos en forma de ArrayBuffer.
            reader.readAsArrayBuffer(file);

            //Se ejecuta una ves que los documentos esten completamente leidos.
            reader.onload = function(e) {
                //Obtiene el contenido del archivo
                var fileContent = e.target.result;
                console.log("fileContent :  ",fileContent)
                //Convierte el contenido en base64
                var fileBase64 = arrayBufferToBase64(new Uint8Array(fileContent));
                console.log("fileBase64 :  ",fileBase64)

                // Crea el archivo en la carpeta
                var fileCreationUrl = folderUrl + "/" + file.name;

                $().SPServices({
                    operation: "CopyIntoItems",
                    SourceUrl: fileCreationUrl,
                    DestinationUrls: [fileCreationUrl],
                    Stream: fileBase64,
                    completefunc: function(xData, Status) {
                        console.log("xData",xData)
                        var uploadStatus = $("#uploadStatus");
                        console.log("Status:   ",Status)
                        console.log("xData",xData)
                        if (Status === "success") {
                            uploadStatus.append("<p>Archivo subido exitosamente: " + file.name + "</p>");
                        } else {
                            uploadStatus.append("<p>Error al subir el archivo: " + file.name + "</p>");
                            console.log(xData);
                        }
                    }
                });
            };
            }
        
        //funcion para convertir un array buffer en un formato base 64
        //Se le asigna como parametro un valor buffer
        function arrayBufferToBase64(buffer) {
            //Creamos un varibale llamada binary vacia
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

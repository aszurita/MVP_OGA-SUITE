<!DOCTYPE html>
<%@ Register Tagprefix="SharePoint" Namespace="Microsoft.SharePoint.WebControls" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<html lang="en" xmlns:mso="urn:schemas-microsoft-com:office:office" xmlns:msdt="uuid:C2F41010-65B3-11d1-A29F-00AA00C14882">

<%@ Register Tagprefix="SharePoint" Namespace="Microsoft.SharePoint.WebControls" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<head>
    <meta charset="UTF-8">
    <title>Sin Acceso</title>
    <link rel="icon" type="image/png" href="img/OGA_icon.png">
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">

    <link rel="stylesheet" href="font/iconsmind-s/css/iconsminds.css" />
    <link rel="stylesheet" href="font/simple-line-icons/css/simple-line-icons.css" />

    <link rel="stylesheet" href="css/vendor/bootstrap.min.css" />
    <link rel="stylesheet" href="css/vendor/bootstrap.rtl.only.min.css" />
    <link rel="stylesheet" href="css/vendor/select2.min.css" />
    <link rel="stylesheet" href="css/vendor/select2-bootstrap.min.css" />
    <link rel="stylesheet" href="css/vendor/component-custom-switch.min.css" />
    <link rel="stylesheet" href="css/vendor/perfect-scrollbar.css" />

    <link rel="stylesheet" href="css/vendor/dataTables.bootstrap4.min.css" />
    <link rel="stylesheet" href="css/vendor/buttons.bootstrap4.min.css" />
    <link rel="stylesheet" href="css/vendor/dataTables.colResize.css" />
    <script>
        var n = new Date().getTime();
        document.write('<link href="css/style.css?v='+n+'" rel="stylesheet" />');
    </script>
    <link rel="stylesheet" href="css/main.css" />
    <link rel="stylesheet" href="css/pagination.css" />
    <style>
       
        .body-wrapper{
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100dvh;
        }

        .logo-oga{
            width: 150px;
            margin-bottom: 20px;
        }

        .http-error-wrapper{
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
        }
    </style>

<!--[if gte mso 9]><SharePoint:CTFieldRefs runat=server Prefix="mso:" FieldList="FileLeafRef"><xml>
<mso:CustomDocumentProperties>
<mso:_CopySource msdt:dt="string">http://vamos.bancoguayaquil.com/sitios/informaciongerencial/OGAsuite_Produccion/Produccion/BuscadorCampos.aspx</mso:_CopySource>
<mso:Order msdt:dt="string">233500.000000000</mso:Order>
<mso:TemplateUrl msdt:dt="string"></mso:TemplateUrl>
<mso:xd_ProgID msdt:dt="string"></mso:xd_ProgID>
<mso:_SourceUrl msdt:dt="string"></mso:_SourceUrl>
<mso:_SharedFileIndex msdt:dt="string"></mso:_SharedFileIndex>
</mso:CustomDocumentProperties>
</xml></SharePoint:CTFieldRefs><![endif]-->
</head>

<body class="body-wrapper">
    <div class="text-center">
        <a href="OGASuite.aspx">
            <img src="./logos/OGA_color.png" class="logo-oga" loading="lazy">
        </a>
        <div class="http-error-wrapper mb-2">
            <p class="display-3 font-weight-bold" style="margin: 0;">401</p>
            <p class="display-4 font-weight-bold" style="margin: 0;">Acceso no autorizado</p>
        </div>
        <div>
            <p style="color: #6c757d;font-size: 1rem;" style="margin:0;">Para obtener acceso, necesitas pertenecer a los grupos de DataCitizen o DataUser.</p>
            <p style="color: #6c757d;font-size: 1rem;">Por favor contacta a tu jefe inmediato para que te incorpore al "Censo de DataCitizen y DataUser" de la Comunidad Analítica.</p>
        </div>
        <button class="btn btn-primary btn-lg btn-shadow" id="btn-solicitar-acceso">SOLICITAR ACCESO</button>
    </div>
    

    <script src="js/vendor/jquery-3.3.1.min.js"></script>
    <script src="js/vendor/bootstrap.bundle.min.js"></script>

    <script src="js/vendor/perfect-scrollbar.min.js"></script>

    <script src="js/vendor/select2.full.js"></script>
    <script src="js/vendor/datatables.min.js"></script>
    <script src="js/vendor/buttons.dataTables.min.js"></script>
    <script src="js/vendor/jszip.min.js"></script>
    <script src="js/vendor/buttons.html5.min.js"></script>
    <script src="js/vendor/dataTables.Resize.js"></script>
    <script src="js/vendor/mousetrap.min.js"></script>

    <script src="js/dore-plugins/select.from.library.js"></script>
    <script src="js/dore.script.js"></script>
    <script src="js/scripts.single.theme.js"></script>
    <script src="js/pagination.min.js"></script>
    <script src="js/jquery.SPServices.v2014-02.min.js"></script>
    <script src="js/vendor/bootstrap-notify.min.js"></script>
    


    <script>
        var n = new Date().getTime();
        document.write('<script src="js/suite.js?v='+n+'"> <'+'/'+'script>');
    </script>
    <script>
        $(document).ready(SinAcceso());
    </script>



</body>

</html>


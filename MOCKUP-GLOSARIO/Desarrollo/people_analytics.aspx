<!DOCTYPE html>
<%@ Register Tagprefix="SharePoint" Namespace="Microsoft.SharePoint.WebControls" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<html lang="en" xmlns:mso="urn:schemas-microsoft-com:office:office" xmlns:msdt="uuid:C2F41010-65B3-11d1-A29F-00AA00C14882">

<%@ Register Tagprefix="SharePoint" Namespace="Microsoft.SharePoint.WebControls" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<head>
    <!-- ========== Meta Tags ========== -->
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="description" content="Data Hub Index">

    <!-- ========== Título de la Página ========== -->
    <title>People Analytics</title>

    <!-- ========== Favicon ========== -->
    <link rel="shortcut icon" href="assets/img/OGA_favicon_color.png" type="image/x-icon">

    <!-- ========== Estilos con Cache Busting ============ -->
    <script>
        var n = new Date().getTime();
        document.write('\
        <link href="assets/css/bootstrap.min.css?v='+n+'" rel="stylesheet" />\
        <link href="assets/css/font-awesome.min.css?v='+n+'" rel="stylesheet" />\
        <link href="assets/css/flaticon-set.css?v='+n+'" rel="stylesheet" />\
        <link href="assets/css/magnific-popup.css?v='+n+'" rel="stylesheet" />\
        <link href="assets/css/owl.carousel.min.css?v='+n+'" rel="stylesheet" />\
        <link href="assets/css/owl.theme.default.min.css?v='+n+'" rel="stylesheet" />\
        <link href="assets/css/animate.css?v='+n+'" rel="stylesheet" />\
        <link href="assets/css/bootsnav.css?v='+n+'" rel="stylesheet" />\
        <link href="style.css?v='+n+'" rel="stylesheet">\
        <link href="assets/css/responsive.css?v='+n+'" rel="stylesheet" />');
    </script>
    <script>
        var tiempo = new Date().getTime();
        document.write('\
            <script src="assets/js/jquery-1.12.4.min.js?v='+tiempo+'"></s'+'cript>\
            <script src="assets/js/bootstrap.min.js?v='+tiempo+'"></s'+'cript>\
            <script src="assets/js/equal-height.min.js?v='+tiempo+'"></s'+'cript>\
            <script src="assets/js/jquery.appear.js?v='+tiempo+'"></s'+'cript>\
            <script src="assets/js/jquery.easing.min.js?v='+tiempo+'"></s'+'cript>\
            <script src="assets/js/jquery.magnific-popup.min.js?v='+tiempo+'"></s'+'cript>\
            <script src="assets/js/modernizr.custom.13711.js?v='+tiempo+'"></s'+'cript>\
            <script src="assets/js/jquery.SPServices-0.6.2.min.js?v='+tiempo+'"></s'+'cript>\
            <script src="assets/js/owl.carousel.min.js?v='+tiempo+'"></s'+'cript>\
            <script src="assets/js/wow.min.js?v='+tiempo+'"></s'+'cript>\
            <script src="assets/js/isotope.pkgd.min.js?v='+tiempo+'"></s'+'cript>\
            <script src="assets/js/imagesloaded.pkgd.min.js?v='+tiempo+'"></s'+'cript>\
            <script src="assets/js/count-to.js?v='+tiempo+'"></s'+'cript>\
            <script src="assets/js/jquery.nice-select.min.js?v='+tiempo+'"></s'+'cript>\
            <script src="assets/js/bootsnav.js?v='+tiempo+'"></s'+'cript>\
            <script src="assets/js/main.js?v='+tiempo+'"></s'+'cript>\
            <script src="assets/js/pagination.js?v='+tiempo+'"></s'+'cript>\
            <script src="assets/js/js_buscador.js?v='+tiempo+'"></s'+'cript>');
    </script>

    <!-- ========== Google Fonts ========== -->
    <link href="https://fonts.googleapis.com/css?family=Open+Sans" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css?family=Poppins:400,500,600,700,800" rel="stylesheet">

    <!-- ========== Inicia estilo personalizado ========== -->
    <style>

        @font-face {
            font-family: "Glyphicons Halflings";
            src: url("assets/fonts/glyphicons-halflings-regular.eot");
            src: url("assets/fonts/glyphicons-halflings-regular.eot?#iefix") format("embedded-opentype"), url("assets/fonts/glyphicons-halflings-regular.woff2") format("woff2"), url("assets/fonts/glyphicons-halflings-regular.woff") format("woff"),
                url("assets/fonts/glyphicons-halflings-regular.ttf") format("truetype"), url("assets/fonts/glyphicons-halflings-regular.svg#glyphicons_halflingsregular") format("svg");
        }
        .container {
        width: 100%;
        margin-right: 0px;
        margin-left: 0px;
        }
        .content {
            position: absolute;
            top: 48%;
            left: 35%;
            transform: translate(-20%, -50%);
            overflow: hidden;
            font-family: "Lato", sans-serif;
            font-size: 310px;
            line-height: 0px;
            color: rgb(113,113,113, .5);
        }
        .content__container {
        font-weight: 600;
        overflow: hidden;
        height: 300px;
        padding: 0 40px;
        }
        
        .content__container__text {
        display: inline;
        float: left;
        margin: 0;
        }
        .content__container__list {
        margin-top: 0;
        padding-left: 110px;
        text-align: left;
        list-style: none;
        -webkit-animation-name: change;
        -webkit-animation-duration: 10s;
        -webkit-animation-iteration-count: infinite;
        animation-name: change;
        animation-duration: 10s;
        animation-iteration-count: infinite;
        }
        .content__container__list__item {
        line-height: 400px;
        margin: 0;
        }

        @-webkit-keyframes change {
            0% {
            transform: translate3d(0, 0, 0);
        }
        14.28% {
            transform: translate3d(0, -16%, 0);
        }
        28.57% {
            transform: translate3d(0, -30%, 0);
        }
        42.85% {
            transform: translate3d(0, -44%, 0);
        }
        57.14% {
            transform: translate3d(0, -58%, 0);
        }
        71.43% {
            transform: translate3d(0, -72%, 0);
        }
        85.57%, 100% {
            transform: translate3d(0, -88%, 0);
        }
        }
        @keyframes change {
        0% {
            transform: translate3d(0, 0, 0);
        }
        14.28% {
            transform: translate3d(0, -16%, 0);
        }
        28.57% {
            transform: translate3d(0, -30%, 0);
        }
        42.85% {
            transform: translate3d(0, -44%, 0);
        }
        57.14% {
            transform: translate3d(0, -58%, 0);
        }
        71.43% {
            transform: translate3d(0, -72%, 0);
        }
        85.57%, 100% {
            transform: translate3d(0, -88%, 0);
        }
        }

    </style>
    <!-- ========== Termina estilo personalizado ========== -->

</head>

<body>
    <!-- ========== Pantalla Bienvenida  ========== -->
    <div class="bienvenida">
        <h1 id="saludo">Hola</h1>
    </div>

    
    <!-- ========== Inicia Header  ========== -->
    <header id="home" style="position: fixed; top: 0; width: 100%;z-index:100;">

    </header>
    <!-- ========== Termina Header  ========== -->

    <iframe id="reportingIndicadoresGestion" frameborder="0" width="100%" src="http://vamos.bancoguayaquil.com/sitios/informaciongerencial/OGA_Suite/Produccion/PeopleAnalytics.aspx" style="height: 80dvh; margin-top: 8%;"></iframe>

    
    <!-- ========== Inicia Footer  ========== -->
    <footer class="bg-light">
        <div class="footer-bottom bg-dark text-dark"> <!--new-->
            <div class="container">
                <div class="row">
                    <div class="col-md-12" style="padding-top: 10px; text-align: center;">
                        <p>&copy; Copyright 2023. Todos los derechos reservados <a href="https://www.bancoguayaquil.com/">Banco Guayaquil</a></p>
                    </div>
                </div>
            </div>
        </div>
    </footer>
    <!-- ========== Termina Footer  ========== -->

    <!-- ========== jQuery Frameworks  ========== -->
    <script>

        function mostrarMenuMovil() {
            // Oculta el navbar horizontal y muestra solo el icono de hamburguesa
            document.getElementById("navbar-menu").classList.add("collapse");
            document.querySelector(".navbar-toggle").style.display = "block"; // Asegura que el botón de hamburguesa sea visible
        }


        $(document).ready(
            
            function(){
                cargar_people_analytics()
                // mostrarMenuMovil()
                // document.querySelector(".navbar-nav").style.display = "none"
            }
            
        );
    </script>

</body>
</html>
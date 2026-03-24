<!DOCTYPE html>
<%@ Register Tagprefix="SharePoint" Namespace="Microsoft.SharePoint.WebControls" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<html lang="en" xmlns:mso="urn:schemas-microsoft-com:office:office" xmlns:msdt="uuid:C2F41010-65B3-11d1-A29F-00AA00C14882">

<%@ Register Tagprefix="SharePoint" Namespace="Microsoft.SharePoint.WebControls" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<head>
    <meta charset="UTF-8">
    <title>Estrategia del Dato</title>
    <link rel="icon" type="image/png" href="img/OGA_icon.png" data-icon-default="img/OGA_icon.png" data-icon-navidad="img/OGA_icon_navidad.png">
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">

    <link rel="stylesheet" href="font/iconsmind-s/css/iconsminds.css" />
    <link rel="stylesheet" href="font/simple-line-icons/css/simple-line-icons.css" />

    <link rel="stylesheet" href="css/vendor/bootstrap.min.css" />
    <link rel="stylesheet" href="css/vendor/bootstrap.rtl.only.min.css" />
    <link rel="stylesheet" href="css/vendor/component-custom-switch.min.css" />
    <link rel="stylesheet" href="css/vendor/perfect-scrollbar.css" />
    <script>
        var n = new Date().getTime();
        document.write('<link href="css/style.css?v='+n+'" rel="stylesheet" />');
    </script>
    <link rel="stylesheet" href="css/main.css" />
    <script>
        (function () {
            var hoy = new Date();
            var inicioNavidad = new Date(hoy.getFullYear(), 11, 1);
            window.usarLogoNavidad = hoy >= inicioNavidad;
        })();
    </script>

<!--[if gte mso 9]><SharePoint:CTFieldRefs runat=server Prefix="mso:" FieldList="FileLeafRef"><xml>
<mso:CustomDocumentProperties>
<mso:_CopySource msdt:dt="string">http://vamos.bancoguayaquil.com/sitios/informaciongerencial/OGAsuite_Produccion/Produccion/EstrategiadelDato.aspx</mso:_CopySource>
<mso:Order msdt:dt="string">173700.000000000</mso:Order>
<mso:TemplateUrl msdt:dt="string"></mso:TemplateUrl>
<mso:xd_ProgID msdt:dt="string"></mso:xd_ProgID>
<mso:_SourceUrl msdt:dt="string"></mso:_SourceUrl>
<mso:_SharedFileIndex msdt:dt="string"></mso:_SharedFileIndex>
</mso:CustomDocumentProperties>
</xml></SharePoint:CTFieldRefs><![endif]-->
</head>

<body id="app-container" class="menu-default show-spinner">
    <nav class="navbar fixed-top">
        <div class="d-flex align-items-center navbar-left">
            <a href="#" class="menu-button d-none d-md-block">
                <svg class="main" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 9 17">
                    <rect x="0.48" y="0.5" width="7" height="1" />
                    <rect x="0.48" y="7.5" width="7" height="1" />
                    <rect x="0.48" y="15.5" width="7" height="1" />
                </svg>
                <svg class="sub" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 17">
                    <rect x="1.56" y="0.5" width="16" height="1" />
                    <rect x="1.56" y="7.5" width="16" height="1" />
                    <rect x="1.56" y="15.5" width="16" height="1" />
                </svg>
            </a>

            <a href="#" class="menu-button-mobile d-xs-block d-sm-block d-md-none">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 26 17">
                    <rect x="0.5" y="0.5" width="25" height="1" />
                    <rect x="0.5" y="7.5" width="25" height="1" />
                    <rect x="0.5" y="15.5" width="25" height="1" />
                </svg>
            </a>

            <div class="search" data-search-path="Pages.Search.html?q=">
                <input placeholder="Search...">
                <span class="search-icon">
                    <i class="simple-icon-magnifier"></i>
                </span>
            </div>
        </div>


        <a class="navbar-logo" href="OGASuite.aspx">
            <img id="logo-navbar" class="logo logo--invert d-none d-xs-block" src="logos/oga_color.png" data-logo-default="logos/oga_color.png" data-logo-navidad="logos/oga_navidad.png">
            <img class="logo-mobile d-block d-xs-none" src="logos/OGA_icon.png" data-logo-default="logos/OGA_icon.png" data-logo-navidad="logos/OGA_icon_navidad.png">
            <div id="contenedor-nieve"></div>
        </a>
        <script>
            (function () {
                var usarLogoNavidad = window.usarLogoNavidad === true;
                var logoNavbar = document.getElementById('logo-navbar');
                if (logoNavbar) {
                    var logoDefault = logoNavbar.getAttribute('data-logo-default') || logoNavbar.src;
                    var logoNavidad = logoNavbar.getAttribute('data-logo-navidad') || logoDefault;
                    logoNavbar.src = usarLogoNavidad ? logoNavidad : logoDefault;
                    if (usarLogoNavidad) {
                        logoNavbar.classList.remove('logo--invert');
                        logoNavbar.classList.add('logo--navidad-large');
                    } else {
                        logoNavbar.classList.add('logo--invert');
                        logoNavbar.classList.remove('logo--navidad-large');
                    }
                }
                var favicon = document.querySelector('link[rel="icon"]');
                if (favicon) {
                    var iconDefault = favicon.getAttribute('data-icon-default') || favicon.getAttribute('href');
                    var iconNavidad = favicon.getAttribute('data-icon-navidad') || iconDefault;
                    favicon.setAttribute('href', usarLogoNavidad ? iconNavidad : iconDefault);
                }
                var logoMobile = document.querySelector('.logo-mobile');
                if (logoMobile) {
                    var mobileDefault = logoMobile.getAttribute('data-logo-default') || logoMobile.getAttribute('src');
                    var mobileNavidad = logoMobile.getAttribute('data-logo-navidad') || mobileDefault;
                    logoMobile.setAttribute('src', usarLogoNavidad ? mobileNavidad : mobileDefault);
                }
            })();
        </script>

        <div class="navbar-right">
            <div class="header-icons d-inline-block align-middle">

                <div class="position-relative d-none d-sm-inline-block">
                    <button class="header-icon btn btn-empty" type="button" id="iconMenuButton" data-toggle="dropdown"
                        aria-haspopup="true" aria-expanded="false">
                        <i class="simple-icon-grid"></i>
                    </button>
                    <div class="dropdown-menu dropdown-menu-right mt-3  position-absolute" id="iconMenuDropdown">
                        <a href="http://vamos.bancoguayaquil.com/sitios/informaciongerencial/Paginas/ANALYTICS/Marlon%20Z/PAGINAS/COMUNIDAD_ANALITICA/index.aspx" class="icon-menu-item quicklinks">
                            <img src="img/datahub.png" alt="Logo DataHub">
                            <span>Data Hub</span>
                        </a>

                        <a href="#" class="icon-menu-item">
                            <i class="iconsminds-male-female d-block"></i>
                            <span>Users</span>
                        </a>

                        <a href="#" class="icon-menu-item">
                            <i class="iconsminds-puzzle d-block"></i>
                            <span>Components</span>
                        </a>

                        <a href="#" class="icon-menu-item">
                            <i class="iconsminds-bar-chart-4 d-block"></i>
                            <span>Profits</span>
                        </a>

                        <a href="#" class="icon-menu-item">
                            <i class="iconsminds-file d-block"></i>
                            <span>Surveys</span>
                        </a>

                        <a href="#" class="icon-menu-item">
                            <i class="iconsminds-suitcase d-block"></i>
                            <span>Tasks</span>
                        </a>

                    </div>
                </div>
            </div>
        </div>
    </nav>

    <div class="menu">
        <div class="main-menu">
            <div class="scroll">
                <ul class="list-unstyled" id="suite-navbar">
                    <li>
                        <a href="SobreOGA.aspx">
                            <i class="simple-icon-question"></i> 
                            <span>Acerca de Nosotros</span>
                        </a>
                    </li>
                </ul>
            </div>
        </div>
        <div class="sub-menu">
            <div class="scroll">
                <div id="sub-menu-suite">

                </div>
                <div class="ps__rail-x" style="left: 0px; bottom: 0px;">
                    <div class="ps__thumb-x" tabindex="0" style="left: 0px; width: 0px;"></div>
                </div>
                <div class="ps__rail-y" style="top: 0px; right: 0px;">
                    <div class="ps__thumb-y" tabindex="0" style="top: 0px; height: 0px;"></div>
                </div>
            </div>
        </div>
    </div>

    <main>
        <div class="container-fluid">
            <div class="row">
                <div class="col-12">
                    <h1 class="pb-0">Estrategia del Dato</h1>
                    <div class="separator mb-3"></div>
                </div>
            </div>
            <div class="row pl-3">
                <div class="col-12 p-0">
                    <div class="card">
                        <div class="card-body p-2">
                            <i data-toggle="modal" data-target="#MapaEstrategia" class="iconsminds-full-screen-2 float-right" style="font-size: 18px;cursor: pointer;"></i>
                            <object class="estrategia" data="https://viewer.diagrams.net/?tags=%7B%7D&highlight=0000ff&layers=1&nav=1#R7b1nc9rO2zb8aTJzPc9MfqNeXqpSRFUF3vxHSEISqDfKp79XGBIMMiaJjR0HJ3GMvALt7rHHWffcbygXblqZmXj92HaCbwhkb76h%2FDcEgSmKAP%2FVV7aHKySFP11xM99%2Bugb9vKD4O%2BfQ8Hi19G0nf9awiOOg8JPDRfjpohVHkWMVzxqaWRavn9%2B7iAP72X2J6ToXFxTLDC6vGr5deE9XKYT8eb3t%2BK53%2BGQYJuin38xNa%2BVmcRkdPi%2BKI%2BfpN6F5fJvDQ%2BWeacfrk0uo8A3lsjgunn4KN5wT1ON6HLEw75XtGBpMfYfIZLtCEgz9%2FvRm4q%2Fc8qNzmRMVb%2FvWyNNbV2ZQHkayz4wYcEVQVJlRv3HoN4pudbghuMQL9TdGHSqH8Si2x%2BHP134YmGDkUNby%2FMDumdu4rB81L8D4Hl%2BxmZMD5IyO%2FYDPLvXNGpAQuApuy4oDypD6gleEweGOhR8EyuGj7bjI60txdGxNg5c3DtdhWCsnK5zNCYwOw9dy4tApsi1ocvjtdxKnnu45LJPvMEQcVs76J%2BpgjDqAyzuBHH1cKuYB6u6P9%2F85aeCHw7z9yhxCF5OoOG4J1qlp758VgVrx3HeyKL42cVfH%2FLcGGLl5gA%2FjeezJyWAiNHQ5lhR9ZSwP7y4DmjEjF3T0x%2Fxh0LPZa%2Fg0rOHDaBR9%2FmFmUICxNAuHrWkjv5i%2FH%2F26aUqJsMuud0467izL74xOinFX%2Bo7CF1P6TYS%2B0eI3mvnG1OuTcf3gMMF23UXGspw8zn9tguPM34GZNY%2FTbNUv%2FMjJ1G1StyoyZ3%2Fj4T1EsPK4OIgz8Ks9T14AY3HS4huCEjBLcNwvAAa6GTGH36LPp%2FQ4VacAQtDLOUXINwEQ3IBXqAFCKHR%2FBF0y%2BwU2HBvI0MNLJ5jHa%2BHnBXZ%2FAfyingvfqiHyBCCmltY%2FAeBE9tmVvTB17AOTv8ocV%2FGfx2VmOdcaHiYXPJnrXH1H7Klh3eerwMqcwCz86rle8SecffW5T6ZnBEQhGBXT8mupy6LRcWnLcQBUK7DEM8fc%2Fx%2BB2QBNGL6emItZXXt%2B4SiJuR%2B3NdD3nlN5vaZFoF75kXtypR9XPy9EzikS%2BG8kmDYiLWs9h%2F2JmR%2BXvqHMye%2Bf4%2BhnI4T7%2BeIESM3v8qSFNd77A3A33Unyl6xkmw61sPaPkcUr55SvLMqZL850DLMs4j8G8u2MhpxxDHWpXzSJxHOKeTukYpcqopmYR3DycehHfoPgecCwCYbnoPp1ZH4MDAn8o2GI%2FxvyDLtVnhFvLc8Ot45iH3TlBw4I8gwI59rwU5cOd%2F2RHiP9T4onsriZC0E0Hk8pPaCk7%2FCRAG%2Bd5%2BfTFWeFF7sxkJi9OE4OxLJ0imJ7mMTDQjxhpttQ4Wz8YlJ%2FyH%2F44dX0cH%2F9M380ZPcvtscXERiLk5vql9PT3%2F28bf9qeyfMEZeYCyXd8Ii55Auqja4qGJnw%2BXfyc6lQxAUj8E7uu9GlBsWbRS2whmtg2jwE1W8Jqqt23oKyHKtRbs0pHMOhOwoqGELuJ6kaVwn1FQTV%2FbmgWfzA8Nn0nhvuL4if19%2FofP6fevwWcqxxvGD0IcbeTIxdQ%2BSryKU%2FSopde%2BpT3%2B2wp3R%2BuPUetv4%2FJLuwS3%2FifWUXfYFGxq7tezA2l1rVDS7n%2FdAfflOP5LXg0IU3%2Bpm%2FmnjWQqnvPLznzUGlp6s9My%2BOTxMHgZnk%2Fnz%2FfPWNISAPP2LjoojDQ6MXIk%2FN2GrylAMkiXj9pwF7eP3n8DYn15%2B%2BGv0A%2B697YpK6EZPHEPKbY%2FIouE9dpfEJKeYnWn4DGkG3i4uRPEYvLgMaZgAsCPAycBb1bUcljDlcLmrpy%2BaAcQGF9vZteOznFfkwHvWlGNy7CPbC1vNt24n2Ur0Apsj8x3pIanVjP2A4C%2F6CnnK1UMX5mgZxFv75Guf3zTMAk6hejf5%2B2h0A5rVTA5p9RRScYtczC8trAO9TH%2BrV1giwq4xxe4yvIWDahCfkvTgOvoyt9c0CMEvtame4zgNBv42g98IM9uGYuYym%2FcAMJ2v8AzOfDjNNiRnvhZlG0Ytd%2BqcOMXwK%2FAUPf5KVAbXNuR%2F4hWnHmfPPB%2FGbwuqNUfw3SQPB8UukfJYoPnZpHl6A4%2FM6k44r4FUPNHbwmb0a9cA%2BzHi%2F%2Btwn08OZz9JymnXSh9n%2BSoj%2Bh2H0sgF0g6H%2FglH1i%2Bj9e0P32KU5fyJy9vjsRIs4C09t%2BwdU%2FziMfwt6PxdUb1WW3g2q%2BKWR%2FyUFHX2joMORtxZ0Hx7ev9rPU49jafsFUGp%2FpBi9mLz84KZ%2FgZtg6DKp977kRDRkY39BcjquxVfJibgXOR0f%2FWipYWcz%2FM7kRFyS0yGThAP%2FBbH7YKR%2Fk5HuGafLfGkGiYN2vhiGSclM2wH8%2Ffu%2FoS0RDYTUOBzwffjoO3p8ogMQqBuzUX6DkK7189QL7RSm%2FfAx%2FLtURJIfTEWXMvIvp6JrK%2B9VJkI%2FiIno8zDG2zFR3%2BEE6XtWeLLsM%2F%2BDukJHV45pS%2F9wNttbI6xhI1vjyONvjbA%2FWv2X29iEOk5Y7NMzaPenEd%2Fn%2Bw8R9U%2BKKAS%2Bo%2F1%2Bbck8C95H%2FsJ38qJ2hGt5%2FV0A0if%2B9rRd%2FjmGrR%2FecnArYYY1TJ%2B%2BMw9I%2F5uQxu8I6Q6p7nJcFNeaSDt4iysIJGkyAAXkG8N%2Fq58C6g1H%2FOgCm189iwD9D382S8Qxa%2Bc%2B1QBo9NIr8AM498sjaITL3%2BLAvIb1Uw2qsV2Dt6Cx3Zvr6H%2B0ki%2FtJyEKzdwyMzP0wcDUwqf%2BBAQaLkpw%2BcfF0%2FwCaORkea1QNyQPPUTS50o2uMrnvyuRyEuqaxZI%2BDvB%2BNIQqFMGQaf9B2D%2Fch3qXQALw3d0XDX24LKuxReUiQ1ehcZ2b%2B5V%2BPB0g2vdPM02yBOg2e0pCRBWvc2pKJ9YSew57oOf%2Fll%2BasgKvi8%2FNaSPfz1%2Bwm%2FkpzttN7%2FIOMDfza1%2BrZvXtrrVvew7RWzHdQLC%2Flc%2Ft8DJvpO7j2DgP0pZ9EdT1ict1fNmEZ4%2ForqG1M9rDoFP4p64TCHvRFVdpjDzD97yg0c8mufJftAg1U%2F8BWCrpjI8D276N7mpwTf6btTUWEcMwS%2BRrPh54YQ%2F84ydvDiH7CjzKwDkkx09Qd3%2BctvECz73B7j%2FAXD%2F8KrdA91av7X4n1A49LZvsVNhlm1n7lGN%2FmyC92OKC8HvYKc0FBe6TjMfUF6oKYzWUGf4lZJCN1aE%2F71AoO0szDIoLtb2z%2BuX8%2FaHpeWPS5Y%2BW7PvW2qeevXTPqDUfDNiSewqefxkhzdlkCM3wCfM8JMnmrnBNnNv%2F5nw7UA5jujpCuegETZDvcEyIjYzwlKgyBh8P87H60uceJ8kP0Ce5vakwaFKw4u%2BCoREn2EMxvFTfLza%2Fhj1frFiHoZfaw9%2BeHri30Xj1VloSmxgLDCYxwoJJ8rYRcbZrzDae%2Bc9iCIEUc3W5HXC%2Ft3qCXgDsTUmPVw7j%2BTmpIdGHr1%2F8YRGLB2TdB5a0cvO26uL8HXORC45s3kqoI%2FSiq4%2B97PTF%2BKkBAbg3pfKmfu6dk8c85Qe%2BH9mYJmR5fx%2FF5h6mHjX8isOoL%2FtqIWbSwRdlx2%2FS51NBRuIBup8CzOuuQeX2jrv5PX5aEHwI4NC9C1vj9L%2FC5%2FOYUgyv5ZiP70RD4z%2BmhviB%2Bx%2BCbcfg9HG%2Btb3Benfkjjxh7KtIXWiueHXy5242s%2FTajINHlMmyeL5pe%2Bfi0M%2FP7l4lmL%2FKG38hSkLpT%2Basv6WXIo%2FpKyGbIrmhndKp%2FhO0%2BQzKKDnRud7c9ZlQoVYB26CU3Xp2z7M81yFOle2HuT0qcM670RcZENCxV2Jq6Es1nnuz7efkcoLCP9fJwQYrZOvRTCnzsK3%2FPhhHHxdSdt0Stt9Be0n2Wj0Oz62dxbOx6X8unC%2BUw2BM3OCPtsZ8naSuTFifZmN8fDAvY8H7v47nP5%2B71wjZBsOongI44dm%2BdkFdTOWLwX1w9P8wO%2Bn9EI3A%2FgyhPfwRj5g%2FRd5Kpth%2FchZ%2BICchavq3vsfcQqfFS7BqZtMsRveiTgz6t7ukNPmIfskocG%2FxPy%2FqpndH3Y3egBueKcf6sG9cHcZmvwQ3H1ASPqqcnR%2FDMEo8mYgOgrjtwfR9bzeZ6f5XLihOhHQMosSGO%2FN1Uu%2BerbpeZWtH1nz%2F1TC6QsIup5K%2F9DeXl17pxz4QsuGIPcLGxveXJL%2B2Q5E4lJKcUFdHKlGO0pA%2F%2F8FeB5W52uO7dcP737dsf2rGP0rPNgvdOEyEYZ3cie7dJA8AfOR%2BfAmjpAbUPpBkLyrI%2B%2BFPvwtZ1z%2BseQibpVcBHUf%2Ff2OKaXXO3q6PbUDXovxU0muvm9lj3O%2FvjoH3dPr%2BkIfLtMRvigHNZy0%2B4L2fCf35z1zRK%2F39GTy%2FwNf4MrctFb7Y74a8lEenPSlOemeqZ%2FXzdfTgjXgR7sWj35kRpbvZI9A5RfH4T0TRV6AIfI5ROO7xHT%2BVJwe1%2BgNKj1xH3F6t6zORn9yw8ZqLg4Tp3AAXf0oX9k2535Q19T6Vff5Tx57dWbfpmoM%2FnodFxRqWI6%2FWTUGPi8s9SnKxmSSoLQQlbG2jj1Y80HuwN2mA0hE6BstfqPRb3UdSuhwUmoPiKPMtLa%2FNtHvHyfhOFG8HTjYLyPn3PV3DI2fhi3QpigJcqVC%2F8vIOfs49NLT%2BAFBkkbgfJIdAq8SyDXUPzvMrakdcikWGtt92FEk1576mXN44Ud%2BVqPmsCT39k%2BSr8B6qlVGRJSdny8euuinzsu%2FSuQ3MxtMP6eaO1b2vLaGTlHrm24U54cD3bg4iq2fp5AcT%2FD2CzCE0QOznzzR810wS340Zj9Jntz7CsGGbKXGdl%2Bvfsa1bj7f8eZm5r4A8YOVHqwEwx9NS39LmYw%2FoqWG%2FKHGdneqkUGeJbhhx5oVd6KlhiNHLmhJy53swUn%2FJCc1lBN9P05qOmH8n%2BCkhvLijYNxJ06icOIsyxclkHdjpSsdPZl1LQL9yfLDUQxs68FH%2FyQfNWSb35ePGqoAnB69LYA5jmzzfPP%2FZaGAf9odjh23srzmDofPD2D7m93hjXD6a%2Fzh1xbDMwHX2LDJI97Y8ONc4tee%2BzSgmfl5wve%2FHY%2Fllvxwbtbv9JBHnyJ5%2Fzpr%2FxVu7msL4zRV1g79yK9LFzwTNbHtBPEx1s6A%2Fi7Mwwm3%2B%2Bw13c%2FL8wKID%2Bh%2BiiSi94HuXb3djT34a9zdfybjmhzejQ2%2FoMf7Wj%2BvFMyqWan%2BkYJdf7%2Bbtp6Pvefp2%2FFgyafvzIOkvjRJ3df53dQF5LphpzghGEsnazjB9N%2By3QjoMie10XY7zz38aqYb8lebbsitYu3Yq1fFGvK5TLfjcz%2FLRa3PLvb3ujBYh7V6bJk2WNiPEt%2BfP3npKmfffg7keZkRpCHD%2Fr5y59KwO4nAPZUTNXMzKn6qTA%2Bofm7P9ztB9Xi27MdBtWGb5ImKxJVBUe619z85Y%2FbLKUwk1KDDNDq7SerlifsKGhPaoGL%2FRRoTfaPGhDbsCmpuiHwqjQm9VGgPCSCKV9MvJMdx%2BJA%2Bv6oo2aZDLRqN7sZDEP%2FIz%2F2Dof9AIWqoUnNXKXNcFZcwVM1g9VB%2F3kL9uQWTHwVA4jI2fGcAXmrkX1JM3WrYo9hbi6kP91cP1qWPdIxCyd3x1DUrckdGx61pt87yF6ze9%2BYQwy4h1jj0b15s5M8I4DJgdZBAhuOsHgLoiwsgGLpjLOLacjjDX%2FGI1%2F8jAGyw4d8NgI31Ko7pvpf7%2BxnsG83XPkknWxxCts%2B8PZ82PnYxz9D%2B646OIOzGwNnvJj2e2XFNlZKP3u4PrpTcUGr7c2rYVxfHq%2FVhiAb1p7nhm2eE%2FNnqb9B%2FnNzK%2FKQue%2F4jKnE7AzwE1MfkQl7n9t%2FN1binh%2Bjqcjnf8%2F%2BkHx02%2FovtOKwzjS5Pf3oA99MnGb0PcO%2BZCdncg79lN9sfyr1ba%2FQTd9rQ9tGFjhtqXI%2ByeAuWyQk31f4FsSzKbH%2Fa7csk9Th08bMnALwPe901RbLRAiIv9UImS0sAPusQ%2BK%2BfXnWsqOFMXN4sftU2vHu9P4pCn2s671zvj%2FiM9f4az556ud4f%2BY3lapJ6BoTP5AGAIIyjGxawuP%2B6HU0%2F0H8znM5KOzTspW88KQn%2BPTSdn5SENX3c3RNBGtH0t2TOXlsKrx7XhlwqQY3tPixt9tpTP995vwCDfKqq1I%2FD1aGjw0ayn06BZpZ%2FKCifK5n2KsXfrp%2BcCcs7ugWuLaSzqMka9NuLy%2Fzp3OcsibN6FT0q%2BH92JfpdMHpPD0DzGZ7%2FguRr2AjZfCjuW0u%2BD7f%2Br3XzdCMKPwLvxMn9fQmBBxH9e0R0V2O%2BsQd%2Fiyvyj5iowRHZ2O7rFfu71s3TDdl1JZMHAf2DBHTPyn6NPbg8%2B%2B%2FoUkK%2BsWAYoBFYa%2BYizsIfJ4dwJkDl75wc8s%2F4mBC8Icmk8TjuL3TQRCO8%2FpYj%2Fa6tjVfl21GLeFXAHeuMfRIvU0MVvZ%2Br%2FduVSkUPL9Nf7mU6sv5f62VqqNg3TAo%2FPMNpz5zXniYgeOIz1EL%2FV59xy%2FV74Btb%2F8Qyj5DuX6mD%2FSmWm073uy%2BWL739X1FINuzHbW745qGYz%2BmQaqglOMri4nk6yjPK2pcSBFN3TnMP1vr3WAtuKAB1Z9r6q73oN9PWrW70e9UT%2FGjvVUM9wbaTZeb%2BbK8fVgNnBoci8Q9T4R8nqoYNN3cmqkuH61ckqlu97DB1L6I6P78Cg86m%2BL2p6tK52UBVx1O%2FwH91vuSDpP5FkqLuSFLNicmXnlIuDsvoSYr%2Bipf9xXzda371y0uXI%2F822b0wTBHPxv6R3vsj66%2FBW34IxsDfGKqu8kZB3yj%2B5CLZfBGwmpObYF0HwWWO1YfGaGj6N3YCX18xvxulOSrOrwZp3iQTGGvIevosUZq%2FpiTc1WXzekbUrS6ojysJd%2FW5T53d86VTJ1D%2BOFAi2OswL0qMhxbzWlTmffb%2BXuf524XmxVFwH5030FAfTokt%2FyJSuPdZ2nFy4dR8nJDyMar5G%2BwLfi9QH%2FMuPg7Uf0tFjD%2BUg8itcvDr1Zy72s%2FHsU4P0vpV0oLhj86FQC898l%2BStRrq%2BDQ3JO7DWt9pmnyulMH39W%2Bil9njLcBO5lO2ixAmWe0EADrZkZ5eqQj%2FoKYvRk3HagcfR01%2FdejldmoibqWmO8VeLqkJPzvV4O2oSeu3Fv8TCofe9i12Ksyy7cw97nG4dZq%2FYBXfE8jB74I56hJzjVPx5tLwzxjhMibHOVFeC6xjIM4vwLA9FOevLp2Qe2YwXVsZz07GzE9SWE62uZypTo9cli%2BPznvuzGqMbyH4dV3pp5R8U0l6lJHHn%2Fey7j%2FkKDBfE5LPROThttukZD2%2Ftpl7%2B4eHGyf7WgT6Vd3rzavbN6teCH6WXk6Q%2F51t8npB9wILzNyeNEvqBvkvfBIFnb7dpZcNgv6o%2FRHqL7Wn%2F7D90ZPyc9E8jcjvKqYvrCr066%2BqZ8voj6q2naqhRNhl1zsnHXeW5XdGJ8W4K33HbjV9sPdZf7%2B8aKizsPxh98VLID1vDyPIPUCKfSRIoWcgvRGj8KfA6NWij6cYbQTzMdD%2BwRjF6TPMYdeJ9Lw9cb05ch5t%2BbXm8KG%2FL7Y%2FE0tn7d9rxeB%2FDa1%2FAPI%2FGNDUOYSg66R73v4VhMLIuWbzi%2B3hgwOvEaINtx%2B3v57d%2FmM8nojm3QoZIzjxecD%2BEVhvPPIF%2FhwKxjl28UMs%2B1asH%2Bn2ZvD%2B8g0wjf8a2omz2%2B%2BN9uvO5K9P7ddS3j8Y7TBMP%2BdCFL2uHVzcgFDE9RvO8Xd2w6%2FC93j73eBL%2Fv0GJ%2FlLyvwb6zA%2FjiL9IA%2FPL2vvZ4SOEteVnfP2xx0KL7pN4D9s%2F9zi%2FWN9vNG1fty1dlfMn4fcXoLzndD8Z%2F6SO0WKEer5%2BQYYeeasfIEef9nvQjZ%2FzstW5%2FP2xCtWJ0X%2FWXuUelvnY%2BOqOIDkNOBkJnXASagTDfcnSzK0uz846dq%2B6cLZFN%2FOwt%2BnAZSXN3WZge9G4KUFwOyA6%2Bwxr4I5%2FCL0bXu%2FGJviWS%2FmVMDHLXzHBQ7fuGqOGxtujtN8J%2FHn6sN3GEYb4ojYXQOJN1RCyD1zv3%2FKD013PxN54lj1cy38TT2k7OEXvF1HwVHm6SUiJpH7DeF8nR3Ka0hquTEDvgaK5gmaC34y69cswjF98D9XIr61qhusYLavC5N9YdunvywlTrY40zYJpu1jTHsI%2Fikk084oepHBeEmi%2BIJ3Qooj%2BXYK7uhMhyjT5oVRvBvNTZUdxMvWaMbz%2FU7WVroj1ZF25RYsITFb2xF4e%2FC3QiUDj0rI4TvabD7xMtVNrAkCBocl19BwRFLVMiqKnhVk5A4MDxstM6vSFiY58Ug139i7uCzUZZpn81UvhZhWNDKlkR32wKdIxixrq11VsaWsb3bBlWg2gHnQ1clqFQhjXcaiIWwTM9Ov2Lm%2B4hhTY%2FJ2W2Q0HDXrk39EGgpwjmUFj0mRLVmhc3At7RnQ1F3OWhahraD50l1TT30Zcjy74cWYGkoYzwKpAxrbIVM%2FCaasKxpgRpy7G2YzBtdYYkXDqTDfkjOZ7nCCSVYxwnizPM0ZbWxx1hynoQG4g2PF%2FpCcCUN5tqoCzhrweNaZVRukN5G7ptFdCRMmW2xmW53qElN11vVGUlCNRxOy43hO2IddOgaLcjZBO45bmTjmdJS4ba3Jsu6MQ3nD9gr2%2Bx2mw4E5ZFeg22zX7yy96ahdJhW9DEdp7Ke6QDGDBUXhadFmOliFbqxo6rnpckfm9RtpuEeKVkdwW3glyja4grCJPUvqUQx1v%2B4IRQ5GkqaA9zda5LwFVojYTuEwhazF0M6ivp7Us85xuiFmrYmVcjk%2BiTctZoPOduGaiuBhGQ1UykpCsCbFguiJbTbD2nvepWiUHC8xd9TyipVRrXO7S25XkYBZCtJheqwisG2eqkHqwaJCsgWqzJBOr0zQETroeXg3NEZh%2FZADYinDlSHpK9EXY3Wwn1qRlME3H4n8QmmDKx74N9fVqASPItGaAwW9AaIa0z5HhtFml0yVjS5zPGlgvGTx2sazpZaILcu4v7Q9t48FTNox2DQ14cLuTSqt8pBg6KqE3pptyJFStlhlAc9ws5uWs7a2rfxZi5dKur9tj%2FlU6BqKDoacHbG63uE6%2FGzTn5QpTGIZpMcrzhuHrDkrA93gu5NFPjSXQ13H2vywPwygTbdkduNSB91p6X2a2%2FgDaNvN4i27YDK%2FopHNMFCQniBWTqcnywq1IOVuNN%2BBCWQzbToxB%2BMsAuqhrKBjqgq3QATi0xLm29gax3eVL88XFhq39My0WKO%2BZy7zKt4Sh60UDXIpTWSnRbLVWt1kuLNcJcTMY1yFzjBiNZ8BamAdBeCCTeYZR3eIDpQ4GpNaSqBuHWRDZJtoNOlaiDXP%2BhzGEyktA9VIZDfDIu9wRVdZjUtSRyUnRBc%2BpKf4Nl3x6HhaFaspKiMWKfCtQZBpc5LfRlW3T%2FSdbZL2rAGGC3A9rzQ%2FE6Z9JGH75XzCMfKqypbsroJmzjIOdqCFtkuDYAJIkl1zSy4BK1%2BUt2k6G8dGFgR56lh9bjKehmluGn0JNNsmQk6U2FDajNqhzjuY6KJGvRyWdNyLchmJUplJJ%2BRujseAvtuAIzcOP9CxrlzTY8trCRt%2FHSplbEayW2X6OrC1Od9PUnc1kDujOJXWvDVCeqNW6E9Gu8yUqw7i6aN4EbDYehPXa3oipXC6y8IJt4U4lFE4V8m6M29rTqXNbBPTVp5hhQbF4QyfI%2FyaxXy%2F%2FnR0y9I9ZEn71tqbcUVRjDDOTgXCj7g1%2BHUawbSkW1WAkp2qyryOiux4yt%2BhUA5rmjgxIXo2Gwmb9tBUCNnhM9Qt5vOdvWUnqRyvqnq1Eyrtxu1oXh%2F7qA4CuDTiIsCR3STXty7hG2tV9IApxwrb9oK1vD1vip1Rb1RLXyA51wN%2FMQigcT0hsbti%2FDaaboVOb9pnfUnz3JWs7rphHCmsw%2BUiw267E6OFGuUGthLEdIb8yDe3QUSlWTEh%2BwSu%2BZloExNNkSrOMS1ehWczVOPM6ZDlPZNcrvrhJOuEphHYHResB3nG6m1oItm%2BifbtZUcpd92YXM2G8ACv%2BjJdwf466bNmVosffgJWwgYRDFwpsJZM0RqSdVfhUBQMDpqUxBCeKBNBQVMZTBm%2Fcl3Nmy%2FycuEMpFgVK5aVvEWrL%2BWFnfsSmwvs0qzmBQUt2I5J5WEqB6tlAPHlmKs%2Frb1aOoxUDWoutosFPNDIWujSYtYBkol19fE4yuslh3mh4g1ohxDpUT0pLNYrSkWNmYyElmuD8%2Ft%2BRM05lutOUG7IQzqlki5Oaf4KWfmrGmB0UHnEwF4X4MYQXpLI2FEokpn3HXdkhAyaadiAy3cTIazRCJQTlpNWumKui%2B22w%2BB9cKHHaFIQYX10mkbtgLXHiEesjTLak%2FKushOpp6BrpAtrCtDKpaUVYN7QCaJgbAxqueX0FdNMqBmszhaG1k%2FWdtDbtDodWbAXDL5gizIfS1gol3bVieLlQpy6%2BkwcpyrtwfUADYOM2LaW%2FXSQFuoISwciF6zKIEWTou9Ug3VF%2Ba1Qg4ggGIrwwDARYjGWBv1RMUZ9uSw4RiUKM%2Fd3PWrQqgU%2FEbi74dqEw5bficbQAJru%2B27oTK1YQStMiaethahvVwPQBdsZzPD1KpvNas3LSlN3GFv4aDquJVbWNSsscbstcOMCX0ytXKom7Zr4mPFgIa6EHbxLN%2BVoSjoDkcLF2Fi3Uwzhh2LfHPid%2BaYsHIrYSKYMd%2FpUqsIImXhd3dphPVsbtsWtJ42XM3LWR%2Br1tZYgezaSumVC9yW3ivomEHtZ3kKpNO12yZyH1KnbAyZ1ZKSuDqdOUlNF1so08EBGK4jxXoQgPZIecoUyh%2B3%2BpBq1ugPUq1bjeqKxFr6YM%2F3JxB60ul0zZy1l1E1SvZ0uurDeFjNX1DFrsSj0PgRt4WmqM8ZoM3Vn7nLEIJXM87pOBVAUJTzTHSQijQZQWdZs1XdjqnQHZcpO2AlYBM4WJZHhhk%2BcxMbbHsmrDt0dlEApTWOuSscKNEvBW2574%2BHGdZzJLvNn%2BgSIOSd1cC1Gt%2FHY3BCJiDNrjEiB7OFHWM%2Blq95AEGF9FFq%2Bpi2F7kBql%2FWkqbA0SSNR97b0bLFejvrYYsyKc7gse1E8H2nTykqmtG3VjYX5zOJSY6aPN7LmDJR5SHOs3psTNh5u8J5K9rxu3xPpcSa7CRFuauhkcLi1PKAjiRPVMyWbncZTMzXacg6L3mapebOyJC1eVFQpEwUcVq1yZ3vShkDnjookvA7GlAp1TTYVyqjBmNsBJKaJ1xmueaCMlJKmY9BG0c2VAhFYqWs9z0Ol%2FtS1EGEjBOLEEatN1S1Lgs3A7buqD88FI2jTW9XlFjOutR3j0zSwxHXZHWW9druf94cRksGplSIjXl0xUZWpq9wlNptu1xWhGuv6KvZh0MOBMId1oliZNlUvEC1Vxp10hXl11w1Lnjhyi53KmgFsG8TNlUIJ06zdHXUW60XgQyJRkpww6AXTboBHhYCQbdVOphFQQURFaQvoLiTEebZNc249i7djp5UO3W0L4UMGKgpuIy6IHRsSats0qGBodMt0428zROitonaEtMwZMinDMTtdLZh5D5hmYpXkBbpe2BisQlK27bciQIDbfjeLOIeVBFZDN7W2T3SFeTwoNqPJCpvPGFiBi%2FYsaGedOrzCImg5iloMQRGRrFFtaOgGymrQobuU2bG3baEIJWQzg6UdlPaAYNK8pb6e2XRWGhOK0PE5uWMloyLMQcRaXGuR9vwswtuDoC0u17ncN9HxTnAKUYnMRJc7i6xtFNbW5BZb1EvmCSxxhLzzpBhoWbCY7paGw4Z06A4dQA2yX9L0WgUPyXi6b2xmXCfjNTHaqpg2ldf5EN3ErFCrTAZuUJZp90yY1EJoNR8XE6HLjLrUZq7UQ0D1%2BlEH9yyamo7hKZQASPNomI5GKTwabQ0dorcGMnL5iVRu%2Bhqug%2BluzyeA%2Bn2oM%2FIoVmjl8TpL2kq6W3htG5nMVLM%2F8RBfbtsex9Ex3C%2FQtqri7ZYej5%2FUdUMrey1gDqa07U1hDM0W01gmslFtgcmdooyyEMqpbrVhgGkzmcF6rjJwilGjqenswnlPYuJZlIKHXJaViqtLoDBVQ7vd34gVsOmB5l3WUi90PIPYpNFymq8xJ01QzkI5oKlrq0xf1tMfj7o8LA87lSexW61TohQ%2BV7PNTIU3%2BNzudwkwxHFrNShcGnPcXm1ZzG2ssjv4GiLMrFd%2FiDBZ5QqNrWwlWw%2BItW644bolBoq30jBaEIEUYIuMQMLabPMZlKanS5ySptFGwfIV1vYFujdbz2kvoNV2T9dVcarbbkdNA2ndgUN%2B1yPGpUBhVpmkXQy3tro2tC17suJ4mRcJWF7YtbgexiI3dbd9spfgSoX7Pj%2BwiXK19MxUVVMcgzMjzjbdycZZOWGp1UqBiIN%2Fo3yYCv1J7Du6kmZjVqHoSs9iocVO5JY%2Fwdm12qX4WovO1VSTMLql4DMlmUymo3oAy3gy5EJmFBtFxsOMup5bIlqtS8%2Bbde0wN%2BAgkAJ%2BOsANNzKAmuwB9Vwfd4fuuKeGS8eqFvXD%2B2NkIYozWUkrtfSgXn%2B6QvrRUmK2bSDhaFlkZmp%2FuGAXiptM1QTIMbbFrKmEHsWsPOGX5Hw2jLdeucFwTR7jtdq6KripushrNYuyFT9SUkoEIoQbRLpUaIHaQqwWXyi6NA53c04A8lP0tq2gJu9WBQSuOFgSC4d0iswaICJE7boSFRtRFymmS8MHtoblYR0MZerprVKC7GyAqUeuhpoxAMacuBijcD7UtVrRkMlN0C5kE55u%2FdnYl6VO11oDvG%2FLxRyft2WmHOGhisLt0WQpR%2BRwVXWHdjzw%2B6NuJ8RFbsvHfBKNUaSrj2uDxR1BO2wBezk5UZyMGGJA7IDLnV5vCj5t7WR4pyp6cNImVjkN1d6N9d5im9iwO18UwsQOosw02elQN0K83aUXjp1CtmC6I32uK74xgrm%2BAERIB2LR2ieTO8kMIzO%2B8rrEIt6gnlP28yGD0D2PnE2T0aBtQePWklRgHwYf6ySjaWANOxSz1sZdHGtjZmxxux54hrFhseR0o83XAdrFFGioD0KsMqbrVMOGsbpd0DFfln5VmAakGRST9chATZnxjhkNK9UI5IE2DMfjxbhTJgCq61ggiYE2UWvVnVqmGhgAVsmqNirmqRmJcCtQ14ZqtsajiWaLSdY11N1wlXlsd6SOoziA0Z5D9wpzqUSa5zHGmNrBnXqId%2B2FKQ7UaEiM%2BS639U1wUSJ2aAvt8QQEK92ITYIc9CVLwQQsgD6UtWvHg9jl2W6yG7sF3CNooISM51hXLK1xrbbPCTd26jfSZq2YbRvRErywjOUWq9bOYr7Uu8GQaklZkdcuGKDLj6HCDAZPnj5JgCB4YShw2pLaxEAC2Behedc1B%2BgKKiStI%2FpdXW3F8JTJdylUK3JOvlOXkpuMUGZXbGqHxFDUTWoW7zE7l6dJRTg9XRJtLurm2ZC35Z1Nj1Vp06WF8Uhrj8ZESOtpn9qWatrPKL1jdWaC4JPzzlSYBXiodNeMj6NqmWC0t7NQfeURhElosJyVZRrFrUUCpROzO4Zjfb7Gq9XEMZSVqmyWYRe2sjSoSVHCHF0fjUJ04s879Nw357W%2BCsBBQiXH1hKu2K5qJ0Kvdn2yxnYxDAp6MAAjviPQvJYmLFoYrphpWjwhFigFpPiuHbXNxJNEFNGG6RBK3Np%2BzSf1yFZmu7%2FokTGvlfIqCEdpPq3LhYvChNDlJNqgQpGog5lCdKlwNF4rwWQDKzlsrLqC5vQzZS0YvFRTIr%2FRqeW6ZMhErxdgwW23UpKs1gnE7HylVrclPTfWtLSpBS1XuzwzIdCZyWYzK9tYbeWJru%2FVHCguUd6tb2HrIfHwargbR8KOVyuV4wgfAK6T9ETF0HB8icT6wO52iZQYc%2FXAAGyJC3ybLvtEIC%2BzzZav7ZBkmqDL1WTQ5oDOM%2BIRS4i0zgDL8dGWX1munLKJz9ZeI5VhSx3aJok6GvpDuVxHnCqViRYmNkdIjtbV1krEhWNuJ5Qxl7jL5RSaW3NlOMKdatWf8Tq%2FG3FiKJWGrywItcNXKyn1Erw%2F7zN8i630Lj%2BOeuzIyiu1aim1py7i6P50oGW1HZYzpbIAwkP3qH6FkHN7PWeAXpxMBovhcCsN17sJbEgYRu79s5OiQudFNkCdrhPOKTWaKW15uchTcea58wFXyB2bp9Fdf%2B4Tgw2ZsysITRKgvAo7ZGkBTSBb5kQa9LxMnemRQqw4byIvOWZaCmC6QnE6C1ZWrdL6urEphYWi6tPpivD5rNVTJHEwHWazmm49aVnS5lhChIWcL1COXMxXYz%2Fe0HBbQuGoUHcsadkGDnU3S5pZdoV8EE2AfjkId1EWSb44h3B%2FmNpb1rO6%2BASFp8Mq7Yjqpo9SojytAQMZZexHsm97bTxdF3GrUmg7HaZbv%2BIX29WMSuCh1Grz8c7IWUyFC3XGpwQrkbyGUvFqTvpyMk%2BJarqdyRPLGyyidaJPUR3bWI5mMzt4XNHZaJwCEhymFaN1FGDGi8NYtnUzFIXNeDg2us6qE8l8LVMFMc5XVWsiLTtsvra2kRYnvqEDuwtr9whDCgLYWcuQh0QZPutJ8wHjbzrhkPSl7d5FkCCopI5T3PGUbCNQpWmPydr57CR1zTZxONylrlLOWy0on6p4RfcI1%2Bu2ndZ6Ry%2F8gEvLEhtSpAPXrlE%2FZkkNmrIhNx7kvIwTSGFNW7rCEolm%2BJgpT1SllQx1Cxtu5mOgsGjrFozsAgQGM7WalIuJylGK3OJYo49ivD%2FZwoE1UOcyAK5A2PZG32y01JM8Z70xUFKF24EuZDk7Z%2Beq7LT4%2FsCwDSVHOGczMabz3WqKdqdOpUsxsibgJWFblFG7z3UhnIrparyN%2BzALh7Dqtza7bcJjq3TpV1Qw301VXSeEVCTZtd6rnT1LLk6mEERPa1k%2F2SXL6brXQqHlpu9l3pidWSsvd7fYUprU1hnVh%2BVqNWvDWtIGgF2FMjCd4XbtFce0rlDMgm1fq00ZcTsfSKUo7ubRk0BRoFSnOq2kP2ep3RJv65OpE8szZgWRibtt804Gd5TtYl5LLoQyu6It57Zd82enJUfhTljO6UBKi0pcdUTWZvLpzHNq9d5H2pI3NsKhlmMl2cbAECj6qMBkzPG37cU4HtUibaTZk6k4JGCI6m2BOTnuTvckL7KDCpqFmCXH6XZc1dDBlnQ48fz1YkZ4NCTr08U4MJLWAA0LwbVrp4tm9tY6akmpi4psyRCy5hvjlPIRUZOnHXXlSFsGCuSZ05f3uqwCT3jCNsiRu%2BOldYH3aTjllmN%2FAkwWUlox6MrRMsOFAqYrbzjN6XjKkphOcnxhl6KPd9Jhb9jigACfur3V0GFaIeN6cNbfYuOWptmSbsw0RsXmMiWyljdT01iG10a8zaEZtF1mhWmmCrvwrSVhpfGYd4x%2BYYRpVZq9NgF0PxtREnc8z8mSIojtEg5DpVPgdsGR0RSehAgJ7CY1zXxUKAe5uFlJON7tB3KKdGof%2BbJ2%2FepKj0UBnUQDRJBmM3PJ5b18UAsG0ab9NRAWc2UVifM2NW9H0Roj5ELr6shGIqlEb8urFVaT4GY5UhMFiekMavPzTiDNqWIyNDukueMdoEX2Ra5MWu42XSkaB812wmqsFvxiFhijdJd2p71SW%2BadrsBztQPRHYxlJZqMbbwv9sdbRqiRKONgNua9cNwqlxsVjIseoyO7DEQ%2FD9VsWErzMS%2FDmTdd586wi2379fLX3eFknPaSgdbTw3wldWRmIpGTWgoD45hLVvGQ0Xsraoi6rNutRb67hnnSghfSzNNyoM7A%2BRihd0jKdc1IsQd8j1GmYVdjqXI3m%2FAeF7H99aAaeQLcCluExGbYku861LDYDGbsbLascekKG0MnA7m7TFezWpGB%2B%2BFk7Syl0p8sxZnOJDKvZSNi3THraFvlxH7pEkJPbW%2FoAQ5XKNHKd8Ny7yacwdWoaFkhV%2BuEssoJmLmdGl7pWEDbbVG%2BVg7lyk0VvpgChb2fikrXgILSrpeSrNOs7toLVBr5jDBCS2ctmDMOHoxsP%2BbDQRUOpquMIZZrxIF6S2Dg8qm7qEOCw3lCF9g4n7Q7gWPyzthdWJbV2qJ5VBQUW%2FS3WrqDfMPe%2BQsGbdnDOoYsTTo2PE1ndYhPmaUhKaLiWoq1YdEyWni%2FA7gEJfvsNmIph0GXgiuUrZymNWBlTQuPHMTt2gPgmuM8p5YWlw82AdGTQ3a108LJRBRMaTzEKh6hZ4tuKy%2B1kYFBvYTTtzpMCNMA04wMzYHC7vaZrRJq82w1UMYxnsPItLfS8gQfjwfoLJX6nr7byi5eZLkxrH0CIQOvimUmBr1skrRRDnPUkRnODatWv%2BxCltCOQS2Ude241VlebzsLf6mMprY4Q7pkHyjgES%2BD3iR9v092VSxhibZWwaNuHXcKqEqemMYMzbaAcHoY0WY9Xd5NwXN3o5WzE3cpo6P1AC7G2HJstdt2t0p3w2K8JefGCsoRzySDLcbIYA34UbYqTDZSHd9eeq2MqD0PUE7OIQ2jCTvyalUStqquhfkrS1WBub73nHCyFLCO6CMLrayBROoKRdqiV%2BixLXtaopi9wOltc9CEQjkqE8OBV0%2FjCFJItkOk7nbo0y2sRqtSkE5fCpKQliSId3XUVo117YiH%2BCwK9oHYdW1dT4doZYSxAyQ0vRX4eSptQ2gfjcVbnVIcs4st6RFqGZuu2jayhQYh7UTUDHi0mXihLKgWNakNEjVn%2FMjt6eMICOoeUKQkZ9WuP2%2BBZhOkdDlztDACoPb7w9FC6Yj2ulfGnUrku%2BxymA%2BxoJNp63o1QLoioH7gKUiwLCJaQ6glEQu1ojuadaeHvAkn1P24HiFqxKCULY%2F5HtYfoWmbDsrE9LiZPe%2FPy%2FaM4Fh%2BbMDTnKxvnNTudx9oYd6Eb6dgpcUZPC%2BTOF76xARTvTJfjzrb0CfpvB%2B1BGceGc52q4%2FZOhzJS7VPVqD8WcuHVxWzRK3Jtu75UhSwmd2u%2BDKx1gOswCljMrecaiplAtem1%2FKws0aqiWrN6AVZW3GODC9LPajHuG3sswFq8tG9MW2VKMluaIqqZ6ZeZev2Zot3ss2UUpM6hYRhu7KGC9mq67r1FvX931uz4d4kr6fhEEUYw%2F7D4MvMHuwNMnu2pmsZfK9NR0NvhkWibLc6Pw74vJLZ8zwr6pU6AKc5WbazMMuguPOoNlVdwA7Jb8%2FGlHivMb2sZisoqswAaurUJQXMsB6zaJ4n%2B5GBWGbAATKEWhozZcZap3cxA4%2FaC9eK2x5S%2Fy5L8VuUM198e16owTMLy%2FvtvQu%2FDlD0bLPgdxiisf9omvjxdVmkmzgedXGKVpj6DyVO%2F5DvhN7LHE6hP2LUGrp7qDJy%2FeMDoV8YoSTxH4Gi0PHPZdVaFPpIhF4WsT3lV4gXAINCA6E15DrDB1K%2FDlKxc1l%2FA1DhhjTp9wBqhx%2BXu0HFDsUUX1fC8HvgaEfl6jMUOfjNfX0vVHa7NqG373d69yKBDdRGvc%2Fuj%2B%2FYsaLF8aNI6Pq22Ms7fjzcW23RGKxLH%2BkYhZK746lrVuSOjBrE%2Byhz8vq8KMsHi%2F9R%2BOstCn%2FZpkMtGgt%2F%2FSTSO5EmiUNnMDvakvco%2FNUIwUv5zVhgmR9L0T3w9xv4u3om0Q116N4Nfzh2zsEfjr%2FL3UyjLN461uMIz19VF288Cu91vN58Ot5bGT3oR7Ji3%2BEE6TtQ7WTZZ%2F4HdYWOrnyssvh8Fz15j5JYv69VNlZHOZbEPN13fM16%2FOBN9NhZzZLvyMF6eUlfvLgBWD%2FIn6iLdQZOXK%2Frn80BvXn7E0DAxf8H" type="application/pdf" width="100%" height="397px"></object>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </main>
    <!--Ventana Modal-->
    <div class="modal fade pl-1 pr-1" id="MapaEstrategia" tabindex="-1" role="dialog" aria-labelledby="MapaEstrategia" aria-hidden="true">
        <div class="modal-dialog modal-xl h-100" role="document" style="min-width:95%;">
          <div class="modal-content h-100">
            <div class="modal-header pb-2 pt-2 mt-1" style="border-bottom: unset;">
              <button type="button" class="close p-2" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body p-0">
                <object data="https://viewer.diagrams.net/?tags=%7B%7D&highlight=0000ff&layers=1&nav=1#R7b1nc9rO2zb8aTJzPc9MfqNeXqpSRFUF3vxHSEISqDfKp79XGBIMMiaJjR0HJ3GMvALt7rHHWffcbygXblqZmXj92HaCbwhkb76h%2FDcEgSmKAP%2FVV7aHKySFP11xM99%2Bugb9vKD4O%2BfQ8Hi19G0nf9awiOOg8JPDRfjpohVHkWMVzxqaWRavn9%2B7iAP72X2J6ToXFxTLDC6vGr5deE9XKYT8eb3t%2BK53%2BGQYJuin38xNa%2BVmcRkdPi%2BKI%2BfpN6F5fJvDQ%2BWeacfrk0uo8A3lsjgunn4KN5wT1ON6HLEw75XtGBpMfYfIZLtCEgz9%2FvRm4q%2Fc8qNzmRMVb%2FvWyNNbV2ZQHkayz4wYcEVQVJlRv3HoN4pudbghuMQL9TdGHSqH8Si2x%2BHP134YmGDkUNby%2FMDumdu4rB81L8D4Hl%2BxmZMD5IyO%2FYDPLvXNGpAQuApuy4oDypD6gleEweGOhR8EyuGj7bjI60txdGxNg5c3DtdhWCsnK5zNCYwOw9dy4tApsi1ocvjtdxKnnu45LJPvMEQcVs76J%2BpgjDqAyzuBHH1cKuYB6u6P9%2F85aeCHw7z9yhxCF5OoOG4J1qlp758VgVrx3HeyKL42cVfH%2FLcGGLl5gA%2FjeezJyWAiNHQ5lhR9ZSwP7y4DmjEjF3T0x%2Fxh0LPZa%2Fg0rOHDaBR9%2FmFmUICxNAuHrWkjv5i%2FH%2F26aUqJsMuud0467izL74xOinFX%2Bo7CF1P6TYS%2B0eI3mvnG1OuTcf3gMMF23UXGspw8zn9tguPM34GZNY%2FTbNUv%2FMjJ1G1StyoyZ3%2Fj4T1EsPK4OIgz8Ks9T14AY3HS4huCEjBLcNwvAAa6GTGH36LPp%2FQ4VacAQtDLOUXINwEQ3IBXqAFCKHR%2FBF0y%2BwU2HBvI0MNLJ5jHa%2BHnBXZ%2FAfyingvfqiHyBCCmltY%2FAeBE9tmVvTB17AOTv8ocV%2FGfx2VmOdcaHiYXPJnrXH1H7Klh3eerwMqcwCz86rle8SecffW5T6ZnBEQhGBXT8mupy6LRcWnLcQBUK7DEM8fc%2Fx%2BB2QBNGL6emItZXXt%2B4SiJuR%2B3NdD3nlN5vaZFoF75kXtypR9XPy9EzikS%2BG8kmDYiLWs9h%2F2JmR%2BXvqHMye%2Bf4%2BhnI4T7%2BeIESM3v8qSFNd77A3A33Unyl6xkmw61sPaPkcUr55SvLMqZL850DLMs4j8G8u2MhpxxDHWpXzSJxHOKeTukYpcqopmYR3DycehHfoPgecCwCYbnoPp1ZH4MDAn8o2GI%2FxvyDLtVnhFvLc8Ot45iH3TlBw4I8gwI59rwU5cOd%2F2RHiP9T4onsriZC0E0Hk8pPaCk7%2FCRAG%2Bd5%2BfTFWeFF7sxkJi9OE4OxLJ0imJ7mMTDQjxhpttQ4Wz8YlJ%2FyH%2F44dX0cH%2F9M380ZPcvtscXERiLk5vql9PT3%2F28bf9qeyfMEZeYCyXd8Ii55Auqja4qGJnw%2BXfyc6lQxAUj8E7uu9GlBsWbRS2whmtg2jwE1W8Jqqt23oKyHKtRbs0pHMOhOwoqGELuJ6kaVwn1FQTV%2FbmgWfzA8Nn0nhvuL4if19%2FofP6fevwWcqxxvGD0IcbeTIxdQ%2BSryKU%2FSopde%2BpT3%2B2wp3R%2BuPUetv4%2FJLuwS3%2FifWUXfYFGxq7tezA2l1rVDS7n%2FdAfflOP5LXg0IU3%2Bpm%2FmnjWQqnvPLznzUGlp6s9My%2BOTxMHgZnk%2Fnz%2FfPWNISAPP2LjoojDQ6MXIk%2FN2GrylAMkiXj9pwF7eP3n8DYn15%2B%2BGv0A%2B697YpK6EZPHEPKbY%2FIouE9dpfEJKeYnWn4DGkG3i4uRPEYvLgMaZgAsCPAycBb1bUcljDlcLmrpy%2BaAcQGF9vZteOznFfkwHvWlGNy7CPbC1vNt24n2Ur0Apsj8x3pIanVjP2A4C%2F6CnnK1UMX5mgZxFv75Guf3zTMAk6hejf5%2B2h0A5rVTA5p9RRScYtczC8trAO9TH%2BrV1giwq4xxe4yvIWDahCfkvTgOvoyt9c0CMEvtame4zgNBv42g98IM9uGYuYym%2FcAMJ2v8AzOfDjNNiRnvhZlG0Ytd%2BqcOMXwK%2FAUPf5KVAbXNuR%2F4hWnHmfPPB%2FGbwuqNUfw3SQPB8UukfJYoPnZpHl6A4%2FM6k44r4FUPNHbwmb0a9cA%2BzHi%2F%2Btwn08OZz9JymnXSh9n%2BSoj%2Bh2H0sgF0g6H%2FglH1i%2Bj9e0P32KU5fyJy9vjsRIs4C09t%2BwdU%2FziMfwt6PxdUb1WW3g2q%2BKWR%2FyUFHX2joMORtxZ0Hx7ev9rPU49jafsFUGp%2FpBi9mLz84KZ%2FgZtg6DKp977kRDRkY39BcjquxVfJibgXOR0f%2FWipYWcz%2FM7kRFyS0yGThAP%2FBbH7YKR%2Fk5HuGafLfGkGiYN2vhiGSclM2wH8%2Ffu%2FoS0RDYTUOBzwffjoO3p8ogMQqBuzUX6DkK7189QL7RSm%2FfAx%2FLtURJIfTEWXMvIvp6JrK%2B9VJkI%2FiIno8zDG2zFR3%2BEE6XtWeLLsM%2F%2BDukJHV45pS%2F9wNttbI6xhI1vjyONvjbA%2FWv2X29iEOk5Y7NMzaPenEd%2Fn%2Bw8R9U%2BKKAS%2Bo%2F1%2Bbck8C95H%2FsJ38qJ2hGt5%2FV0A0if%2B9rRd%2FjmGrR%2FecnArYYY1TJ%2B%2BMw9I%2F5uQxu8I6Q6p7nJcFNeaSDt4iysIJGkyAAXkG8N%2Fq58C6g1H%2FOgCm189iwD9D382S8Qxa%2Bc%2B1QBo9NIr8AM498sjaITL3%2BLAvIb1Uw2qsV2Dt6Cx3Zvr6H%2B0ki%2FtJyEKzdwyMzP0wcDUwqf%2BBAQaLkpw%2BcfF0%2FwCaORkea1QNyQPPUTS50o2uMrnvyuRyEuqaxZI%2BDvB%2BNIQqFMGQaf9B2D%2Fch3qXQALw3d0XDX24LKuxReUiQ1ehcZ2b%2B5V%2BPB0g2vdPM02yBOg2e0pCRBWvc2pKJ9YSew57oOf%2Fll%2BasgKvi8%2FNaSPfz1%2Bwm%2FkpzttN7%2FIOMDfza1%2BrZvXtrrVvew7RWzHdQLC%2Flc%2Ft8DJvpO7j2DgP0pZ9EdT1ict1fNmEZ4%2ForqG1M9rDoFP4p64TCHvRFVdpjDzD97yg0c8mufJftAg1U%2F8BWCrpjI8D276N7mpwTf6btTUWEcMwS%2BRrPh54YQ%2F84ydvDiH7CjzKwDkkx09Qd3%2BctvECz73B7j%2FAXD%2F8KrdA91av7X4n1A49LZvsVNhlm1n7lGN%2FmyC92OKC8HvYKc0FBe6TjMfUF6oKYzWUGf4lZJCN1aE%2F71AoO0szDIoLtb2z%2BuX8%2FaHpeWPS5Y%2BW7PvW2qeevXTPqDUfDNiSewqefxkhzdlkCM3wCfM8JMnmrnBNnNv%2F5nw7UA5jujpCuegETZDvcEyIjYzwlKgyBh8P87H60uceJ8kP0Ce5vakwaFKw4u%2BCoREn2EMxvFTfLza%2Fhj1frFiHoZfaw9%2BeHri30Xj1VloSmxgLDCYxwoJJ8rYRcbZrzDae%2Bc9iCIEUc3W5HXC%2Ft3qCXgDsTUmPVw7j%2BTmpIdGHr1%2F8YRGLB2TdB5a0cvO26uL8HXORC45s3kqoI%2FSiq4%2B97PTF%2BKkBAbg3pfKmfu6dk8c85Qe%2BH9mYJmR5fx%2FF5h6mHjX8isOoL%2FtqIWbSwRdlx2%2FS51NBRuIBup8CzOuuQeX2jrv5PX5aEHwI4NC9C1vj9L%2FC5%2FOYUgyv5ZiP70RD4z%2BmhviB%2Bx%2BCbcfg9HG%2Btb3Benfkjjxh7KtIXWiueHXy5242s%2FTajINHlMmyeL5pe%2Bfi0M%2FP7l4lmL%2FKG38hSkLpT%2Basv6WXIo%2FpKyGbIrmhndKp%2FhO0%2BQzKKDnRud7c9ZlQoVYB26CU3Xp2z7M81yFOle2HuT0qcM670RcZENCxV2Jq6Es1nnuz7efkcoLCP9fJwQYrZOvRTCnzsK3%2FPhhHHxdSdt0Stt9Be0n2Wj0Oz62dxbOx6X8unC%2BUw2BM3OCPtsZ8naSuTFifZmN8fDAvY8H7v47nP5%2B71wjZBsOongI44dm%2BdkFdTOWLwX1w9P8wO%2Bn9EI3A%2FgyhPfwRj5g%2FRd5Kpth%2FchZ%2BICchavq3vsfcQqfFS7BqZtMsRveiTgz6t7ukNPmIfskocG%2FxPy%2FqpndH3Y3egBueKcf6sG9cHcZmvwQ3H1ASPqqcnR%2FDMEo8mYgOgrjtwfR9bzeZ6f5XLihOhHQMosSGO%2FN1Uu%2BerbpeZWtH1nz%2F1TC6QsIup5K%2F9DeXl17pxz4QsuGIPcLGxveXJL%2B2Q5E4lJKcUFdHKlGO0pA%2F%2F8FeB5W52uO7dcP737dsf2rGP0rPNgvdOEyEYZ3cie7dJA8AfOR%2BfAmjpAbUPpBkLyrI%2B%2BFPvwtZ1z%2BseQibpVcBHUf%2Ff2OKaXXO3q6PbUDXovxU0muvm9lj3O%2FvjoH3dPr%2BkIfLtMRvigHNZy0%2B4L2fCf35z1zRK%2F39GTy%2FwNf4MrctFb7Y74a8lEenPSlOemeqZ%2FXzdfTgjXgR7sWj35kRpbvZI9A5RfH4T0TRV6AIfI5ROO7xHT%2BVJwe1%2BgNKj1xH3F6t6zORn9yw8ZqLg4Tp3AAXf0oX9k2535Q19T6Vff5Tx57dWbfpmoM%2FnodFxRqWI6%2FWTUGPi8s9SnKxmSSoLQQlbG2jj1Y80HuwN2mA0hE6BstfqPRb3UdSuhwUmoPiKPMtLa%2FNtHvHyfhOFG8HTjYLyPn3PV3DI2fhi3QpigJcqVC%2F8vIOfs49NLT%2BAFBkkbgfJIdAq8SyDXUPzvMrakdcikWGtt92FEk1576mXN44Ud%2BVqPmsCT39k%2BSr8B6qlVGRJSdny8euuinzsu%2FSuQ3MxtMP6eaO1b2vLaGTlHrm24U54cD3bg4iq2fp5AcT%2FD2CzCE0QOznzzR810wS340Zj9Jntz7CsGGbKXGdl%2Bvfsa1bj7f8eZm5r4A8YOVHqwEwx9NS39LmYw%2FoqWG%2FKHGdneqkUGeJbhhx5oVd6KlhiNHLmhJy53swUn%2FJCc1lBN9P05qOmH8n%2BCkhvLijYNxJ06icOIsyxclkHdjpSsdPZl1LQL9yfLDUQxs68FH%2FyQfNWSb35ePGqoAnB69LYA5jmzzfPP%2FZaGAf9odjh23srzmDofPD2D7m93hjXD6a%2Fzh1xbDMwHX2LDJI97Y8ONc4tee%2BzSgmfl5wve%2FHY%2Fllvxwbtbv9JBHnyJ5%2Fzpr%2FxVu7msL4zRV1g79yK9LFzwTNbHtBPEx1s6A%2Fi7Mwwm3%2B%2Bw13c%2FL8wKID%2Bh%2BiiSi94HuXb3djT34a9zdfybjmhzejQ2%2FoMf7Wj%2BvFMyqWan%2BkYJdf7%2Bbtp6Pvefp2%2FFgyafvzIOkvjRJ3df53dQF5LphpzghGEsnazjB9N%2By3QjoMie10XY7zz38aqYb8lebbsitYu3Yq1fFGvK5TLfjcz%2FLRa3PLvb3ujBYh7V6bJk2WNiPEt%2BfP3npKmfffg7keZkRpCHD%2Fr5y59KwO4nAPZUTNXMzKn6qTA%2Bofm7P9ztB9Xi27MdBtWGb5ImKxJVBUe619z85Y%2FbLKUwk1KDDNDq7SerlifsKGhPaoGL%2FRRoTfaPGhDbsCmpuiHwqjQm9VGgPCSCKV9MvJMdx%2BJA%2Bv6oo2aZDLRqN7sZDEP%2FIz%2F2Dof9AIWqoUnNXKXNcFZcwVM1g9VB%2F3kL9uQWTHwVA4jI2fGcAXmrkX1JM3WrYo9hbi6kP91cP1qWPdIxCyd3x1DUrckdGx61pt87yF6ze9%2BYQwy4h1jj0b15s5M8I4DJgdZBAhuOsHgLoiwsgGLpjLOLacjjDX%2FGI1%2F8jAGyw4d8NgI31Ko7pvpf7%2BxnsG83XPkknWxxCts%2B8PZ82PnYxz9D%2B646OIOzGwNnvJj2e2XFNlZKP3u4PrpTcUGr7c2rYVxfHq%2FVhiAb1p7nhm2eE%2FNnqb9B%2FnNzK%2FKQue%2F4jKnE7AzwE1MfkQl7n9t%2FN1binh%2Bjqcjnf8%2F%2BkHx02%2FovtOKwzjS5Pf3oA99MnGb0PcO%2BZCdncg79lN9sfyr1ba%2FQTd9rQ9tGFjhtqXI%2ByeAuWyQk31f4FsSzKbH%2Fa7csk9Th08bMnALwPe901RbLRAiIv9UImS0sAPusQ%2BK%2BfXnWsqOFMXN4sftU2vHu9P4pCn2s671zvj%2FiM9f4az556ud4f%2BY3lapJ6BoTP5AGAIIyjGxawuP%2B6HU0%2F0H8znM5KOzTspW88KQn%2BPTSdn5SENX3c3RNBGtH0t2TOXlsKrx7XhlwqQY3tPixt9tpTP995vwCDfKqq1I%2FD1aGjw0ayn06BZpZ%2FKCifK5n2KsXfrp%2BcCcs7ugWuLaSzqMka9NuLy%2Fzp3OcsibN6FT0q%2BH92JfpdMHpPD0DzGZ7%2FguRr2AjZfCjuW0u%2BD7f%2Br3XzdCMKPwLvxMn9fQmBBxH9e0R0V2O%2BsQd%2Fiyvyj5iowRHZ2O7rFfu71s3TDdl1JZMHAf2DBHTPyn6NPbg8%2B%2B%2FoUkK%2BsWAYoBFYa%2BYizsIfJ4dwJkDl75wc8s%2F4mBC8Icmk8TjuL3TQRCO8%2FpYj%2Fa6tjVfl21GLeFXAHeuMfRIvU0MVvZ%2Br%2FduVSkUPL9Nf7mU6sv5f62VqqNg3TAo%2FPMNpz5zXniYgeOIz1EL%2FV59xy%2FV74Btb%2F8Qyj5DuX6mD%2FSmWm073uy%2BWL739X1FINuzHbW745qGYz%2BmQaqglOMri4nk6yjPK2pcSBFN3TnMP1vr3WAtuKAB1Z9r6q73oN9PWrW70e9UT%2FGjvVUM9wbaTZeb%2BbK8fVgNnBoci8Q9T4R8nqoYNN3cmqkuH61ckqlu97DB1L6I6P78Cg86m%2BL2p6tK52UBVx1O%2FwH91vuSDpP5FkqLuSFLNicmXnlIuDsvoSYr%2Bipf9xXzda371y0uXI%2F822b0wTBHPxv6R3vsj66%2FBW34IxsDfGKqu8kZB3yj%2B5CLZfBGwmpObYF0HwWWO1YfGaGj6N3YCX18xvxulOSrOrwZp3iQTGGvIevosUZq%2FpiTc1WXzekbUrS6ojysJd%2FW5T53d86VTJ1D%2BOFAi2OswL0qMhxbzWlTmffb%2BXuf524XmxVFwH5030FAfTokt%2FyJSuPdZ2nFy4dR8nJDyMar5G%2BwLfi9QH%2FMuPg7Uf0tFjD%2BUg8itcvDr1Zy72s%2FHsU4P0vpV0oLhj86FQC898l%2BStRrq%2BDQ3JO7DWt9pmnyulMH39W%2Bil9njLcBO5lO2ixAmWe0EADrZkZ5eqQj%2FoKYvRk3HagcfR01%2FdejldmoibqWmO8VeLqkJPzvV4O2oSeu3Fv8TCofe9i12Ksyy7cw97nG4dZq%2FYBXfE8jB74I56hJzjVPx5tLwzxjhMibHOVFeC6xjIM4vwLA9FOevLp2Qe2YwXVsZz07GzE9SWE62uZypTo9cli%2BPznvuzGqMbyH4dV3pp5R8U0l6lJHHn%2Fey7j%2FkKDBfE5LPROThttukZD2%2Ftpl7%2B4eHGyf7WgT6Vd3rzavbN6teCH6WXk6Q%2F51t8npB9wILzNyeNEvqBvkvfBIFnb7dpZcNgv6o%2FRHqL7Wn%2F7D90ZPyc9E8jcjvKqYvrCr066%2BqZ8voj6q2naqhRNhl1zsnHXeW5XdGJ8W4K33HbjV9sPdZf7%2B8aKizsPxh98VLID1vDyPIPUCKfSRIoWcgvRGj8KfA6NWij6cYbQTzMdD%2BwRjF6TPMYdeJ9Lw9cb05ch5t%2BbXm8KG%2FL7Y%2FE0tn7d9rxeB%2FDa1%2FAPI%2FGNDUOYSg66R73v4VhMLIuWbzi%2B3hgwOvEaINtx%2B3v57d%2FmM8nojm3QoZIzjxecD%2BEVhvPPIF%2FhwKxjl28UMs%2B1asH%2Bn2ZvD%2B8g0wjf8a2omz2%2B%2BN9uvO5K9P7ddS3j8Y7TBMP%2BdCFL2uHVzcgFDE9RvO8Xd2w6%2FC93j73eBL%2Fv0GJ%2FlLyvwb6zA%2FjiL9IA%2FPL2vvZ4SOEteVnfP2xx0KL7pN4D9s%2F9zi%2FWN9vNG1fty1dlfMn4fcXoLzndD8Z%2F6SO0WKEer5%2BQYYeeasfIEef9nvQjZ%2FzstW5%2FP2xCtWJ0X%2FWXuUelvnY%2BOqOIDkNOBkJnXASagTDfcnSzK0uz846dq%2B6cLZFN%2FOwt%2BnAZSXN3WZge9G4KUFwOyA6%2Bwxr4I5%2FCL0bXu%2FGJviWS%2FmVMDHLXzHBQ7fuGqOGxtujtN8J%2FHn6sN3GEYb4ojYXQOJN1RCyD1zv3%2FKD013PxN54lj1cy38TT2k7OEXvF1HwVHm6SUiJpH7DeF8nR3Ka0hquTEDvgaK5gmaC34y69cswjF98D9XIr61qhusYLavC5N9YdunvywlTrY40zYJpu1jTHsI%2Fikk084oepHBeEmi%2BIJ3Qooj%2BXYK7uhMhyjT5oVRvBvNTZUdxMvWaMbz%2FU7WVroj1ZF25RYsITFb2xF4e%2FC3QiUDj0rI4TvabD7xMtVNrAkCBocl19BwRFLVMiqKnhVk5A4MDxstM6vSFiY58Ug139i7uCzUZZpn81UvhZhWNDKlkR32wKdIxixrq11VsaWsb3bBlWg2gHnQ1clqFQhjXcaiIWwTM9Ov2Lm%2B4hhTY%2FJ2W2Q0HDXrk39EGgpwjmUFj0mRLVmhc3At7RnQ1F3OWhahraD50l1TT30Zcjy74cWYGkoYzwKpAxrbIVM%2FCaasKxpgRpy7G2YzBtdYYkXDqTDfkjOZ7nCCSVYxwnizPM0ZbWxx1hynoQG4g2PF%2FpCcCUN5tqoCzhrweNaZVRukN5G7ptFdCRMmW2xmW53qElN11vVGUlCNRxOy43hO2IddOgaLcjZBO45bmTjmdJS4ba3Jsu6MQ3nD9gr2%2Bx2mw4E5ZFeg22zX7yy96ahdJhW9DEdp7Ke6QDGDBUXhadFmOliFbqxo6rnpckfm9RtpuEeKVkdwW3glyja4grCJPUvqUQx1v%2B4IRQ5GkqaA9zda5LwFVojYTuEwhazF0M6ivp7Us85xuiFmrYmVcjk%2BiTctZoPOduGaiuBhGQ1UykpCsCbFguiJbTbD2nvepWiUHC8xd9TyipVRrXO7S25XkYBZCtJheqwisG2eqkHqwaJCsgWqzJBOr0zQETroeXg3NEZh%2FZADYinDlSHpK9EXY3Wwn1qRlME3H4n8QmmDKx74N9fVqASPItGaAwW9AaIa0z5HhtFml0yVjS5zPGlgvGTx2sazpZaILcu4v7Q9t48FTNox2DQ14cLuTSqt8pBg6KqE3pptyJFStlhlAc9ws5uWs7a2rfxZi5dKur9tj%2FlU6BqKDoacHbG63uE6%2FGzTn5QpTGIZpMcrzhuHrDkrA93gu5NFPjSXQ13H2vywPwygTbdkduNSB91p6X2a2%2FgDaNvN4i27YDK%2FopHNMFCQniBWTqcnywq1IOVuNN%2BBCWQzbToxB%2BMsAuqhrKBjqgq3QATi0xLm29gax3eVL88XFhq39My0WKO%2BZy7zKt4Sh60UDXIpTWSnRbLVWt1kuLNcJcTMY1yFzjBiNZ8BamAdBeCCTeYZR3eIDpQ4GpNaSqBuHWRDZJtoNOlaiDXP%2BhzGEyktA9VIZDfDIu9wRVdZjUtSRyUnRBc%2BpKf4Nl3x6HhaFaspKiMWKfCtQZBpc5LfRlW3T%2FSdbZL2rAGGC3A9rzQ%2FE6Z9JGH75XzCMfKqypbsroJmzjIOdqCFtkuDYAJIkl1zSy4BK1%2BUt2k6G8dGFgR56lh9bjKehmluGn0JNNsmQk6U2FDajNqhzjuY6KJGvRyWdNyLchmJUplJJ%2BRujseAvtuAIzcOP9CxrlzTY8trCRt%2FHSplbEayW2X6OrC1Od9PUnc1kDujOJXWvDVCeqNW6E9Gu8yUqw7i6aN4EbDYehPXa3oipXC6y8IJt4U4lFE4V8m6M29rTqXNbBPTVp5hhQbF4QyfI%2FyaxXy%2F%2FnR0y9I9ZEn71tqbcUVRjDDOTgXCj7g1%2BHUawbSkW1WAkp2qyryOiux4yt%2BhUA5rmjgxIXo2Gwmb9tBUCNnhM9Qt5vOdvWUnqRyvqnq1Eyrtxu1oXh%2F7qA4CuDTiIsCR3STXty7hG2tV9IApxwrb9oK1vD1vip1Rb1RLXyA51wN%2FMQigcT0hsbti%2FDaaboVOb9pnfUnz3JWs7rphHCmsw%2BUiw267E6OFGuUGthLEdIb8yDe3QUSlWTEh%2BwSu%2BZloExNNkSrOMS1ehWczVOPM6ZDlPZNcrvrhJOuEphHYHResB3nG6m1oItm%2BifbtZUcpd92YXM2G8ACv%2BjJdwf466bNmVosffgJWwgYRDFwpsJZM0RqSdVfhUBQMDpqUxBCeKBNBQVMZTBm%2Fcl3Nmy%2FycuEMpFgVK5aVvEWrL%2BWFnfsSmwvs0qzmBQUt2I5J5WEqB6tlAPHlmKs%2Frb1aOoxUDWoutosFPNDIWujSYtYBkol19fE4yuslh3mh4g1ohxDpUT0pLNYrSkWNmYyElmuD8%2Ft%2BRM05lutOUG7IQzqlki5Oaf4KWfmrGmB0UHnEwF4X4MYQXpLI2FEokpn3HXdkhAyaadiAy3cTIazRCJQTlpNWumKui%2B22w%2BB9cKHHaFIQYX10mkbtgLXHiEesjTLak%2FKushOpp6BrpAtrCtDKpaUVYN7QCaJgbAxqueX0FdNMqBmszhaG1k%2FWdtDbtDodWbAXDL5gizIfS1gol3bVieLlQpy6%2BkwcpyrtwfUADYOM2LaW%2FXSQFuoISwciF6zKIEWTou9Ug3VF%2Ba1Qg4ggGIrwwDARYjGWBv1RMUZ9uSw4RiUKM%2Fd3PWrQqgU%2FEbi74dqEw5bficbQAJru%2B27oTK1YQStMiaethahvVwPQBdsZzPD1KpvNas3LSlN3GFv4aDquJVbWNSsscbstcOMCX0ytXKom7Zr4mPFgIa6EHbxLN%2BVoSjoDkcLF2Fi3Uwzhh2LfHPid%2BaYsHIrYSKYMd%2FpUqsIImXhd3dphPVsbtsWtJ42XM3LWR%2Br1tZYgezaSumVC9yW3ivomEHtZ3kKpNO12yZyH1KnbAyZ1ZKSuDqdOUlNF1so08EBGK4jxXoQgPZIecoUyh%2B3%2BpBq1ugPUq1bjeqKxFr6YM%2F3JxB60ul0zZy1l1E1SvZ0uurDeFjNX1DFrsSj0PgRt4WmqM8ZoM3Vn7nLEIJXM87pOBVAUJTzTHSQijQZQWdZs1XdjqnQHZcpO2AlYBM4WJZHhhk%2BcxMbbHsmrDt0dlEApTWOuSscKNEvBW2574%2BHGdZzJLvNn%2BgSIOSd1cC1Gt%2FHY3BCJiDNrjEiB7OFHWM%2Blq95AEGF9FFq%2Bpi2F7kBql%2FWkqbA0SSNR97b0bLFejvrYYsyKc7gse1E8H2nTykqmtG3VjYX5zOJSY6aPN7LmDJR5SHOs3psTNh5u8J5K9rxu3xPpcSa7CRFuauhkcLi1PKAjiRPVMyWbncZTMzXacg6L3mapebOyJC1eVFQpEwUcVq1yZ3vShkDnjookvA7GlAp1TTYVyqjBmNsBJKaJ1xmueaCMlJKmY9BG0c2VAhFYqWs9z0Ol%2FtS1EGEjBOLEEatN1S1Lgs3A7buqD88FI2jTW9XlFjOutR3j0zSwxHXZHWW9druf94cRksGplSIjXl0xUZWpq9wlNptu1xWhGuv6KvZh0MOBMId1oliZNlUvEC1Vxp10hXl11w1Lnjhyi53KmgFsG8TNlUIJ06zdHXUW60XgQyJRkpww6AXTboBHhYCQbdVOphFQQURFaQvoLiTEebZNc249i7djp5UO3W0L4UMGKgpuIy6IHRsSats0qGBodMt0428zROitonaEtMwZMinDMTtdLZh5D5hmYpXkBbpe2BisQlK27bciQIDbfjeLOIeVBFZDN7W2T3SFeTwoNqPJCpvPGFiBi%2FYsaGedOrzCImg5iloMQRGRrFFtaOgGymrQobuU2bG3baEIJWQzg6UdlPaAYNK8pb6e2XRWGhOK0PE5uWMloyLMQcRaXGuR9vwswtuDoC0u17ncN9HxTnAKUYnMRJc7i6xtFNbW5BZb1EvmCSxxhLzzpBhoWbCY7paGw4Z06A4dQA2yX9L0WgUPyXi6b2xmXCfjNTHaqpg2ldf5EN3ErFCrTAZuUJZp90yY1EJoNR8XE6HLjLrUZq7UQ0D1%2BlEH9yyamo7hKZQASPNomI5GKTwabQ0dorcGMnL5iVRu%2Bhqug%2BluzyeA%2Bn2oM%2FIoVmjl8TpL2kq6W3htG5nMVLM%2F8RBfbtsex9Ex3C%2FQtqri7ZYej5%2FUdUMrey1gDqa07U1hDM0W01gmslFtgcmdooyyEMqpbrVhgGkzmcF6rjJwilGjqenswnlPYuJZlIKHXJaViqtLoDBVQ7vd34gVsOmB5l3WUi90PIPYpNFymq8xJ01QzkI5oKlrq0xf1tMfj7o8LA87lSexW61TohQ%2BV7PNTIU3%2BNzudwkwxHFrNShcGnPcXm1ZzG2ssjv4GiLMrFd%2FiDBZ5QqNrWwlWw%2BItW644bolBoq30jBaEIEUYIuMQMLabPMZlKanS5ySptFGwfIV1vYFujdbz2kvoNV2T9dVcarbbkdNA2ndgUN%2B1yPGpUBhVpmkXQy3tro2tC17suJ4mRcJWF7YtbgexiI3dbd9spfgSoX7Pj%2BwiXK19MxUVVMcgzMjzjbdycZZOWGp1UqBiIN%2Fo3yYCv1J7Du6kmZjVqHoSs9iocVO5JY%2Fwdm12qX4WovO1VSTMLql4DMlmUymo3oAy3gy5EJmFBtFxsOMup5bIlqtS8%2Bbde0wN%2BAgkAJ%2BOsANNzKAmuwB9Vwfd4fuuKeGS8eqFvXD%2B2NkIYozWUkrtfSgXn%2B6QvrRUmK2bSDhaFlkZmp%2FuGAXiptM1QTIMbbFrKmEHsWsPOGX5Hw2jLdeucFwTR7jtdq6KripushrNYuyFT9SUkoEIoQbRLpUaIHaQqwWXyi6NA53c04A8lP0tq2gJu9WBQSuOFgSC4d0iswaICJE7boSFRtRFymmS8MHtoblYR0MZerprVKC7GyAqUeuhpoxAMacuBijcD7UtVrRkMlN0C5kE55u%2FdnYl6VO11oDvG%2FLxRyft2WmHOGhisLt0WQpR%2BRwVXWHdjzw%2B6NuJ8RFbsvHfBKNUaSrj2uDxR1BO2wBezk5UZyMGGJA7IDLnV5vCj5t7WR4pyp6cNImVjkN1d6N9d5im9iwO18UwsQOosw02elQN0K83aUXjp1CtmC6I32uK74xgrm%2BAERIB2LR2ieTO8kMIzO%2B8rrEIt6gnlP28yGD0D2PnE2T0aBtQePWklRgHwYf6ySjaWANOxSz1sZdHGtjZmxxux54hrFhseR0o83XAdrFFGioD0KsMqbrVMOGsbpd0DFfln5VmAakGRST9chATZnxjhkNK9UI5IE2DMfjxbhTJgCq61ggiYE2UWvVnVqmGhgAVsmqNirmqRmJcCtQ14ZqtsajiWaLSdY11N1wlXlsd6SOoziA0Z5D9wpzqUSa5zHGmNrBnXqId%2B2FKQ7UaEiM%2BS639U1wUSJ2aAvt8QQEK92ITYIc9CVLwQQsgD6UtWvHg9jl2W6yG7sF3CNooISM51hXLK1xrbbPCTd26jfSZq2YbRvRErywjOUWq9bOYr7Uu8GQaklZkdcuGKDLj6HCDAZPnj5JgCB4YShw2pLaxEAC2Behedc1B%2BgKKiStI%2FpdXW3F8JTJdylUK3JOvlOXkpuMUGZXbGqHxFDUTWoW7zE7l6dJRTg9XRJtLurm2ZC35Z1Nj1Vp06WF8Uhrj8ZESOtpn9qWatrPKL1jdWaC4JPzzlSYBXiodNeMj6NqmWC0t7NQfeURhElosJyVZRrFrUUCpROzO4Zjfb7Gq9XEMZSVqmyWYRe2sjSoSVHCHF0fjUJ04s879Nw357W%2BCsBBQiXH1hKu2K5qJ0Kvdn2yxnYxDAp6MAAjviPQvJYmLFoYrphpWjwhFigFpPiuHbXNxJNEFNGG6RBK3Np%2BzSf1yFZmu7%2FokTGvlfIqCEdpPq3LhYvChNDlJNqgQpGog5lCdKlwNF4rwWQDKzlsrLqC5vQzZS0YvFRTIr%2FRqeW6ZMhErxdgwW23UpKs1gnE7HylVrclPTfWtLSpBS1XuzwzIdCZyWYzK9tYbeWJru%2FVHCguUd6tb2HrIfHwargbR8KOVyuV4wgfAK6T9ETF0HB8icT6wO52iZQYc%2FXAAGyJC3ybLvtEIC%2BzzZav7ZBkmqDL1WTQ5oDOM%2BIRS4i0zgDL8dGWX1munLKJz9ZeI5VhSx3aJok6GvpDuVxHnCqViRYmNkdIjtbV1krEhWNuJ5Qxl7jL5RSaW3NlOMKdatWf8Tq%2FG3FiKJWGrywItcNXKyn1Erw%2F7zN8i630Lj%2BOeuzIyiu1aim1py7i6P50oGW1HZYzpbIAwkP3qH6FkHN7PWeAXpxMBovhcCsN17sJbEgYRu79s5OiQudFNkCdrhPOKTWaKW15uchTcea58wFXyB2bp9Fdf%2B4Tgw2ZsysITRKgvAo7ZGkBTSBb5kQa9LxMnemRQqw4byIvOWZaCmC6QnE6C1ZWrdL6urEphYWi6tPpivD5rNVTJHEwHWazmm49aVnS5lhChIWcL1COXMxXYz%2Fe0HBbQuGoUHcsadkGDnU3S5pZdoV8EE2AfjkId1EWSb44h3B%2FmNpb1rO6%2BASFp8Mq7Yjqpo9SojytAQMZZexHsm97bTxdF3GrUmg7HaZbv%2BIX29WMSuCh1Grz8c7IWUyFC3XGpwQrkbyGUvFqTvpyMk%2BJarqdyRPLGyyidaJPUR3bWI5mMzt4XNHZaJwCEhymFaN1FGDGi8NYtnUzFIXNeDg2us6qE8l8LVMFMc5XVWsiLTtsvra2kRYnvqEDuwtr9whDCgLYWcuQh0QZPutJ8wHjbzrhkPSl7d5FkCCopI5T3PGUbCNQpWmPydr57CR1zTZxONylrlLOWy0on6p4RfcI1%2Bu2ndZ6Ry%2F8gEvLEhtSpAPXrlE%2FZkkNmrIhNx7kvIwTSGFNW7rCEolm%2BJgpT1SllQx1Cxtu5mOgsGjrFozsAgQGM7WalIuJylGK3OJYo49ivD%2FZwoE1UOcyAK5A2PZG32y01JM8Z70xUFKF24EuZDk7Z%2Beq7LT4%2FsCwDSVHOGczMabz3WqKdqdOpUsxsibgJWFblFG7z3UhnIrparyN%2BzALh7Dqtza7bcJjq3TpV1Qw301VXSeEVCTZtd6rnT1LLk6mEERPa1k%2F2SXL6brXQqHlpu9l3pidWSsvd7fYUprU1hnVh%2BVqNWvDWtIGgF2FMjCd4XbtFce0rlDMgm1fq00ZcTsfSKUo7ubRk0BRoFSnOq2kP2ep3RJv65OpE8szZgWRibtt804Gd5TtYl5LLoQyu6It57Zd82enJUfhTljO6UBKi0pcdUTWZvLpzHNq9d5H2pI3NsKhlmMl2cbAECj6qMBkzPG37cU4HtUibaTZk6k4JGCI6m2BOTnuTvckL7KDCpqFmCXH6XZc1dDBlnQ48fz1YkZ4NCTr08U4MJLWAA0LwbVrp4tm9tY6akmpi4psyRCy5hvjlPIRUZOnHXXlSFsGCuSZ05f3uqwCT3jCNsiRu%2BOldYH3aTjllmN%2FAkwWUlox6MrRMsOFAqYrbzjN6XjKkphOcnxhl6KPd9Jhb9jigACfur3V0GFaIeN6cNbfYuOWptmSbsw0RsXmMiWyljdT01iG10a8zaEZtF1mhWmmCrvwrSVhpfGYd4x%2BYYRpVZq9NgF0PxtREnc8z8mSIojtEg5DpVPgdsGR0RSehAgJ7CY1zXxUKAe5uFlJON7tB3KKdGof%2BbJ2%2FepKj0UBnUQDRJBmM3PJ5b18UAsG0ab9NRAWc2UVifM2NW9H0Roj5ELr6shGIqlEb8urFVaT4GY5UhMFiekMavPzTiDNqWIyNDukueMdoEX2Ra5MWu42XSkaB812wmqsFvxiFhijdJd2p71SW%2BadrsBztQPRHYxlJZqMbbwv9sdbRqiRKONgNua9cNwqlxsVjIseoyO7DEQ%2FD9VsWErzMS%2FDmTdd586wi2379fLX3eFknPaSgdbTw3wldWRmIpGTWgoD45hLVvGQ0Xsraoi6rNutRb67hnnSghfSzNNyoM7A%2BRihd0jKdc1IsQd8j1GmYVdjqXI3m%2FAeF7H99aAaeQLcCluExGbYku861LDYDGbsbLascekKG0MnA7m7TFezWpGB%2B%2BFk7Syl0p8sxZnOJDKvZSNi3THraFvlxH7pEkJPbW%2FoAQ5XKNHKd8Ny7yacwdWoaFkhV%2BuEssoJmLmdGl7pWEDbbVG%2BVg7lyk0VvpgChb2fikrXgILSrpeSrNOs7toLVBr5jDBCS2ctmDMOHoxsP%2BbDQRUOpquMIZZrxIF6S2Dg8qm7qEOCw3lCF9g4n7Q7gWPyzthdWJbV2qJ5VBQUW%2FS3WrqDfMPe%2BQsGbdnDOoYsTTo2PE1ndYhPmaUhKaLiWoq1YdEyWni%2FA7gEJfvsNmIph0GXgiuUrZymNWBlTQuPHMTt2gPgmuM8p5YWlw82AdGTQ3a108LJRBRMaTzEKh6hZ4tuKy%2B1kYFBvYTTtzpMCNMA04wMzYHC7vaZrRJq82w1UMYxnsPItLfS8gQfjwfoLJX6nr7byi5eZLkxrH0CIQOvimUmBr1skrRRDnPUkRnODatWv%2BxCltCOQS2Ude241VlebzsLf6mMprY4Q7pkHyjgES%2BD3iR9v092VSxhibZWwaNuHXcKqEqemMYMzbaAcHoY0WY9Xd5NwXN3o5WzE3cpo6P1AC7G2HJstdt2t0p3w2K8JefGCsoRzySDLcbIYA34UbYqTDZSHd9eeq2MqD0PUE7OIQ2jCTvyalUStqquhfkrS1WBub73nHCyFLCO6CMLrayBROoKRdqiV%2BixLXtaopi9wOltc9CEQjkqE8OBV0%2FjCFJItkOk7nbo0y2sRqtSkE5fCpKQliSId3XUVo117YiH%2BCwK9oHYdW1dT4doZYSxAyQ0vRX4eSptQ2gfjcVbnVIcs4st6RFqGZuu2jayhQYh7UTUDHi0mXihLKgWNakNEjVn%2FMjt6eMICOoeUKQkZ9WuP2%2BBZhOkdDlztDACoPb7w9FC6Yj2ulfGnUrku%2BxymA%2BxoJNp63o1QLoioH7gKUiwLCJaQ6glEQu1ojuadaeHvAkn1P24HiFqxKCULY%2F5HtYfoWmbDsrE9LiZPe%2FPy%2FaM4Fh%2BbMDTnKxvnNTudx9oYd6Eb6dgpcUZPC%2BTOF76xARTvTJfjzrb0CfpvB%2B1BGceGc52q4%2FZOhzJS7VPVqD8WcuHVxWzRK3Jtu75UhSwmd2u%2BDKx1gOswCljMrecaiplAtem1%2FKws0aqiWrN6AVZW3GODC9LPajHuG3sswFq8tG9MW2VKMluaIqqZ6ZeZev2Zot3ss2UUpM6hYRhu7KGC9mq67r1FvX931uz4d4kr6fhEEUYw%2F7D4MvMHuwNMnu2pmsZfK9NR0NvhkWibLc6Pw74vJLZ8zwr6pU6AKc5WbazMMuguPOoNlVdwA7Jb8%2FGlHivMb2sZisoqswAaurUJQXMsB6zaJ4n%2B5GBWGbAATKEWhozZcZap3cxA4%2FaC9eK2x5S%2Fy5L8VuUM198e16owTMLy%2FvtvQu%2FDlD0bLPgdxiisf9omvjxdVmkmzgedXGKVpj6DyVO%2F5DvhN7LHE6hP2LUGrp7qDJy%2FeMDoV8YoSTxH4Gi0PHPZdVaFPpIhF4WsT3lV4gXAINCA6E15DrDB1K%2FDlKxc1l%2FA1DhhjTp9wBqhx%2BXu0HFDsUUX1fC8HvgaEfl6jMUOfjNfX0vVHa7NqG373d69yKBDdRGvc%2Fuj%2B%2FYsaLF8aNI6Pq22Ms7fjzcW23RGKxLH%2BkYhZK746lrVuSOjBrE%2Byhz8vq8KMsHi%2F9R%2BOstCn%2FZpkMtGgt%2F%2FSTSO5EmiUNnMDvakvco%2FNUIwUv5zVhgmR9L0T3w9xv4u3om0Q116N4Nfzh2zsEfjr%2FL3UyjLN461uMIz19VF288Cu91vN58Ot5bGT3oR7Ji3%2BEE6TtQ7WTZZ%2F4HdYWOrnyssvh8Fz15j5JYv69VNlZHOZbEPN13fM16%2FOBN9NhZzZLvyMF6eUlfvLgBWD%2FIn6iLdQZOXK%2Frn80BvXn7E0DAxf8H" type="application/pdf" width="100%" height="100%"></object>
            </div>
          </div>
        </div>
      </div>
    <footer class="page-footer">
        <div class="footer-content">
            <div class="container-fluid">
                <div class="row">
                    <div class="col-12 col-sm-6">
                        <p class="mb-0 text-muted">Banco Guayaquil 2023</p>
                    </div>
                </div>
            </div>
        </div>
    </footer>

    <script src="js/vendor/jquery-3.3.1.min.js"></script>
    <script src="js/vendor/bootstrap.bundle.min.js"></script>
    <script src="js/vendor/perfect-scrollbar.min.js"></script>
    <script src="js/vendor/mousetrap.min.js"></script>
    <script src="js/dore.script.js"></script>
    <script src="js/scripts.single.theme.js"></script>
    <script src="https://d3js.org/d3.v5.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/2.1.1/TweenMax.min.js"></script>
    <script src="js/jquery.SPServices.v2014-02.min.js"></script>
    <script>
        var n = new Date().getTime();
        document.write('<script src="js/suite.js?v='+n+'"> <'+'/'+'script>');
    </script>
    <script>
        $(document).ready(estrategiaDato());
    </script>
</body>

</html>


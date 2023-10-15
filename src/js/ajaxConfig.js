$(document).ready(function () {
    $.ajaxSetup({
        url: "../classes/Codigo_Barra.php",
        type: "POST"
    });
    $(document).ajaxSuccess(function(event,object) { try {} catch (e) {} });
});
$(document).ready(function () {
    $.ajaxSetup({
        url: "../classes/LogInValidate.php",
        type: "POST"
    });
    $(document).ajaxSuccess(function(event,object) { try {} catch (e) {} });
});
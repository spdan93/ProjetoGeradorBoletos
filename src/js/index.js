$(document).ready(function () {
    var clientes = [];

    $("#btnChooseFile").click(function () {
        $("#inputFile").click();
    });

    $("#inputFile").change(function () {
        var fileName = $(this).val();
        $("#txtChoosedFile").focus();
        $("#txtChoosedFile").val(fileName);

        var aFile = fileName.split(".");
        var extensao = aFile[(aFile.length - 1)];

        if ($("#txtChoosedFile").val().length == 0) {
            $("#txtChoosedFile").parent().find('i').removeClass("green-text").removeClass("red-text").addClass("active");
            $("#btnSendFile").prop("disabled", true);
            $("#errorMessage").addClass('hidden');
        } else {
            if (extensao == "xlsx") {
                $("#txtChoosedFile").parent().find('i').addClass("green-text").removeClass("red-text").removeClass("active");
                $("#btnSendFile").prop("disabled", false);
                $("#errorMessage").addClass('hidden');
            } else {
                $("#txtChoosedFile").parent().find('i').removeClass("green-text").addClass("red-text").removeClass("active");
                $("#btnSendFile").prop("disabled", true);
                $("#errorMessage").removeClass('hidden');
            }
        }
    });
        
    $('#btnSendFile').on('click', function () {
        readFile();
    });

    $('#logout').on('click', function () {
        sessionStorage.removeItem("strLoginToken");
        window.location.href = "../view/login.html";
    });

    $('#dashboard').on('click', function () {
        window.location.href = "../view/dashboard.html";
    });

    function readFile() {

        // Puxa o arquivo selecionado
        var fileUpload = document.getElementById("inputFile");
 
        // regex para validar se a extensão é no formato de excel.
        var regex = /^([a-zA-Z0-9\s_\\.\-:])+(.xls|.xlsx)$/;

        if (regex.test(fileUpload.value.toLowerCase())) {
            if (typeof (FileReader) != "undefined") {
                var reader = new FileReader();
 
                // Navegadores sem ser IE.
                if (reader.readAsBinaryString) {
                    reader.onload = function (e) {
                        clientes = ProcessExcelSheet(e.target.result, 0);
                        otherParams = ProcessExcelSheet(e.target.result, 1);

                        if (clientes !== undefined && clientes.length > 0) {
                            localStorage.setItem('boletos_clientes', JSON.stringify(clientes));
                            localStorage.setItem('params_clientes', JSON.stringify(otherParams));
                            window.open('../view/boletos.html', '_blank');
                        }
                    };

                    reader.readAsBinaryString(fileUpload.files[0]);
                } else {
                    //IE.
                    reader.onload = function (e) {
                        var data = "";
                        var bytes = new Uint8Array(e.target.result);
                        for (var i = 0; i < bytes.byteLength; i++) {
                            data += String.fromCharCode(bytes[i]);
                        }

                        clientes = ProcessExcelSheet(data, 0);
                        otherParams = ProcessExcelSheet(e.target.result, 1);

                        if (clientes !== undefined && clientes.length > 0) {
                            localStorage.setItem('boletos_clientes', JSON.stringify(clientes));
                            localStorage.setItem('params_clientes', JSON.stringify(otherParams));
                            window.open('../view/boletos.html', '_blank');
                        }
                    };

                    reader.readAsArrayBuffer(fileUpload.files[0]);
                }

                //window.location.reload();
            } else {
                alert("Navegador sem suporte para HTML5.");
            }
        } else {
            alert("O arquivo enviado não é no formato excel.");
        }
    };

    function ProcessExcelSheet(data, index) {
        // Lê o arquivo excel
        var workbook = XLSX.read(data, {
            type: 'binary'
        });
 
        // Seleciona a primeira planilha
        var sheet = workbook.SheetNames[index];
 
        // Transforma todas as linhas (exceto cabeçalho) em um array de JSON
        var excelRows = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheet]);
        
        return excelRows;
    };

    loggedWithToken();
});

function loggedWithToken() {
    if (!sessionStorage.getItem("strLoginToken")) {
        window.location.href = "../view/login.html";
    }
}
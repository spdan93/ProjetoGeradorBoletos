$(document).ready(function() {
    
    try {
        var clientes = JSON.parse(localStorage.getItem('boletos_clientes'));
        var params = JSON.parse(localStorage.getItem('params_clientes'));
    } catch (e) {
        var clientes = [];
        var params = [];
    }

    /**
     * descomentar apenas se houver necessidade de debuggar o código.
     */
    // setTimeout(function(){
        constroiBoletos();
    // },6000);

    function constroiBoletos() {
        for (let i = 0; i < clientes.length; i++) {

            var usaSaldo = false;

            let CD_CEMIG_KWH    = parseFloat(clientes[i]["CD CEMIG KWH"].replace(".", "").replace(",", "."));
            let CD_CEMIG_VU     = parseFloat(clientes[i]["CD CEMIG VU"].replace(".", "").replace(",", "."));
            let DESC_INJ_PERC   = parseFloat(clientes[i]["DESC INJ PERCENT"].replace(".", "").replace(",", "."));
            let EC_VU           = parseFloat(clientes[i]["EC VU"].replace(".", "").replace(",", "."));
            let EC_KWH          = parseFloat(clientes[i]["EC KWH"].replace(".", "").replace(",", "."));
            let ENER_INJ_KWH    = parseFloat(clientes[i]["ENERGIA INJ KWH"].replace(".", "").replace(",", "."));
            let ICMS            = parseFloat(clientes[i]["ICMS PERCENT"].replace(".", "").replace(",", "."));
            let SALDO_ENER_KWH  = parseFloat(clientes[i]["SALDO ENERGIA KWH"].replace(".", "").replace(",", "."));
            let TAR_ILUM_PUB    = parseFloat(clientes[i]["TARIFA ILUM PUB"].replace(".", "").replace(",", "."));
            let DIF_INJ_VS_COMP = parseFloat(clientes[i]["DIF INJ VS COMP"].replace(".", "").replace(",", "."));
            
            if ((ENER_INJ_KWH + SALDO_ENER_KWH + CD_CEMIG_KWH) <= EC_KWH) {
                var desconto = ((ENER_INJ_KWH + SALDO_ENER_KWH) * EC_VU * (DESC_INJ_PERC / 100) * (1 - (ICMS / 100)));
                var descontoDifInjVsComp = (ENER_INJ_KWH + SALDO_ENER_KWH) * DIF_INJ_VS_COMP ?? 0;

                usaSaldo = true;
                var credito = 0;
            } else {
                var desconto = ((EC_KWH - CD_CEMIG_KWH) * EC_VU * (DESC_INJ_PERC / 100) * (1 - (ICMS / 100)));
                var descontoDifInjVsComp = (EC_KWH - CD_CEMIG_KWH) * DIF_INJ_VS_COMP ?? 0;
                
                let aux = SALDO_ENER_KWH + (ENER_INJ_KWH - EC_KWH);
                var credito = aux <= 0 ? 0 : aux;
            }

            var totalCliente = ((EC_KWH * EC_VU) + TAR_ILUM_PUB) - (desconto);

            let toPage = '';

            // >>>>>>>>>>>>>>>>>>>>>>>>>>>> __HEADER__ >>>>>>>>>>>>>>>>>>>>>>>>>>>>

            {
                toPage += '<div class="newpage mainContent">'
                toPage +=   '<div class="row">'
                toPage +=       '<fieldset class="col-4 align-middle text-center header-fieldset">';
                toPage +=           '<div class="row mt-1">';
                toPage +=               '<div class="col-12 client-name">'; 
                toPage +=                   '<label class="font-weight-bold">' + clientes[i]["NOME CLIENTE"] + '</label>';
                toPage +=               '</div>';
                toPage +=           '</div>';
                toPage +=           '<div class="row mt-1">';
                toPage +=               '<div class="col-12 client-name">'; 
                toPage +=                   '<label class="font-weight-bold">Endereço: &nbsp;</label>' + clientes[i]["ENDERECO CLIENTE"];
                toPage +=               '</div>';
                toPage +=           '</div>';
                toPage +=       '</fieldset>';
    
                toPage +=       '<fieldset class="col-4 align-middle text-center header-fieldset fieldset-vencimento">';
                toPage +=           '<div class="row mt-4">';
                toPage +=               '<div class="col-12  text-center">'; 
                toPage +=                   '<label class="font-weight-bold mt-4">BOLETO GERAÇÃO DISTRIBUIDA</label>';
                toPage +=               '</div>';
                toPage +=           '</div>';
                toPage +=       '</fieldset>';
                
                toPage +=       '<fieldset class="col-4 align-middle text-center header-fieldset fieldset-vencimento">';
                toPage +=           '<div class="row mt-4">';
                toPage +=               '<div class="col-12  text-center">'; 
                toPage +=                   '<label class="font-weight-bold">VENCIMENTO</label>';
                toPage +=               '</div>';
                toPage +=           '</div>';
                toPage +=           '<div class="row mt-2">';
                toPage +=               '<div class="col-12 text-center">'; 
                toPage +=                   '<label>' + clientes[i]["VENCIMENTO"] + ' </label>';
                toPage +=               '</div>';
                toPage +=           '</div>';
                toPage +=       '</fieldset>';
                toPage +=   '</div>';
            }

            // >>>>>>>>>>>>>>>>>>>>>>>>>>>> __INFOS FATURA__ >>>>>>>>>>>>>>>>>>>>>>>>>>>>

            {
                var countAcrescimo = 1;
                var somaAcrescimo = 0;
                
                while (clientes[i]["VALOR ACRESC " + countAcrescimo] !== undefined) {
                    if (parseFloat(clientes[i]["VALOR ACRESC " + countAcrescimo].replace(",", ".")) > 0) {
                        somaAcrescimo += parseFloat(clientes[i]["VALOR ACRESC " + countAcrescimo].replace(",", "."));
                    }

                    countAcrescimo++;
                }

                var countDesconto = 1;
                var somaDesconto = 0;
                
                while (clientes[i]["VALOR DESC " + countDesconto] !== undefined) {
                    if (parseFloat(clientes[i]["VALOR DESC " + countDesconto].replace(",", ".")) > 0) {
                        somaDesconto += parseFloat(clientes[i]["VALOR DESC " + countDesconto].replace(",", "."));
                    }

                    countDesconto++;
                }

                toPage +=   '<div class="row mt-2">'
                toPage +=       '<fieldset class="col-3 border-white align-middle text-center fieldset-infos-boleto blue-background">';
                toPage +=           '<div class="row mt-2">';
                toPage +=               '<div class="col-12 text-center">'; 
                toPage +=                   '<label class="font-weight-bold">' + 'TOTAL A PAGAR' + '</label>';
                toPage +=               '</div>';
                toPage +=           '</div>';
                toPage +=           '<div class="row">';
                toPage +=               '<div class="col-12 text-center">'; 
                toPage +=                   '<label class="font-weight-bold details-font">R$ ' + formatMoney(totalCliente + somaAcrescimo - somaDesconto - parseFloat(descontoDifInjVsComp.toFixed(2))) +     
                                            '</label>';
                toPage +=               '</div>';
                toPage +=           '</div>';
                toPage +=       '</fieldset>';
    
                toPage +=       '<fieldset class="col-3 border-white align-middle text-center fieldset-infos-boleto blue-background">';
                toPage +=           '<div class="row mt-2">';
                toPage +=               '<div class="col-12 text-center">'; 
                toPage +=                   '<label class="font-weight-bold">' + 'ECONOMIA NO PERÍODO' + '</label>';
                toPage +=               '</div>';
                toPage +=           '</div>';
                toPage +=           '<div class="row">';
                toPage +=               '<div class="col-12 text-center">'; 
                toPage +=                   '<label class="font-weight-bold details-font">R$ ' + formatMoney((desconto).toFixed(2))  + '</label>';
                toPage +=               '</div>';
                toPage +=           '</div>';
                toPage +=       '</fieldset>';
                
                toPage +=       '<fieldset class="col-3 border-white align-middle text-center fieldset-infos-boleto blue-background">';
                toPage +=           '<div class="row mt-2">';
                toPage +=               '<div class="col-12 text-center">'; 
                toPage +=                   '<label class="font-weight-bold">' + 'REFERENTE A' + '</label>';
                toPage +=               '</div>';
                toPage +=           '</div>';
                toPage +=           '<div class="row">';
                toPage +=               '<div class="col-12 text-center">'; 
                toPage +=                   '<label class="font-weight-bold details-font">' + clientes[i]["REFERENTE"] + '</label>';
                toPage +=               '</div>';
                toPage +=           '</div>';
                toPage +=       '</fieldset>';
    
                toPage +=       '<fieldset class="col-3 border-white align-middle text-center fieldset-infos-boleto blue-background">';
                toPage +=           '<div class="row mt-2">';
                toPage +=               '<div class="col-12 text-center noPadding">'; 
                toPage +=                   '<label class="font-weight-bold">' + 'ENERGIA INJETADA NO PERÍODO' + '</label>';
                toPage +=               '</div>';
                toPage +=           '</div>';
                toPage +=           '<div class="row">';
                toPage +=               '<div class="col-12 text-center">'; 
                toPage +=                   '<label class="font-weight-bold details-font">' + formatMoney(usaSaldo ? ENER_INJ_KWH + SALDO_ENER_KWH : ENER_INJ_KWH) + ' kWh</label>';
                toPage +=               '</div>';
                toPage +=           '</div>';
                toPage +=       '</fieldset>';
                toPage +=   '</div>';
            }

            // >>>>>>>>>>>>>>>>>>>>>>>>>>>> __INFOS CLIENTE__ >>>>>>>>>>>>>>>>>>>>>>>>>>>>

            {
                toPage +=   '<div class="row mt-2">'
                toPage +=       '<fieldset class="col-4 border-white align-middle text-center client-fieldset green-background">';
                toPage +=           '<div class="row mt-2">';
                toPage +=               '<div class="col-12">'; 
                toPage +=                   '<label class="font-weight-bold">No. do Cliente: ' + clientes[i]["NUM CLIENTE"] + '</label>';
                toPage +=               '</div>';
                toPage +=           '</div>';
                toPage +=       '</fieldset>';
    
                toPage +=       '<fieldset class="col-4 border-white align-middle text-center client-fieldset green-background">';
                toPage +=           '<div class="row mt-2">';
                toPage +=               '<div class="col-12">'; 
                toPage +=                   '<label class="font-weight-bold">No. da Instalação: ' + clientes[i]["NUM INSTALACAO"] + '</label>';
                toPage +=               '</div>';
                toPage +=           '</div>';
                toPage +=       '</fieldset>';
                
                toPage +=       '<fieldset class="col-4 border-white align-middle text-center client-fieldset green-background">';
                toPage +=           '<div class="row mt-2">';
                toPage +=               '<div class="col-12">'; 
                toPage +=                   '<label class="font-weight-bold">' + clientes[i]["TIPO INSTALACAO"] + '</label>';
                toPage +=               '</div>';
                toPage +=           '</div>';
                toPage +=       '</fieldset>';
                toPage +=   '</div>';
            }

            // >>>>>>>>>>>>>>>>>>>>>>>>>>>> __DESCRITIVO CONTA__ >>>>>>>>>>>>>>>>>>>>>>>>>>>>

            {
                let countItems = 1;

                toPage +=   '<div class="row mt-2">';
                toPage +=       '<fieldset class="col-12 lign-middle text-center details-fieldset">';
                toPage +=           '<table class="table mt-2 table-height-set">';
                toPage +=               '<thead>';
                toPage +=                   '<tr class="table-height-none">';
                toPage +=                       '<th scope="col" class="font-weight-bold">#</th>';
                toPage +=                       '<th scope="col" colspan="2" class="font-weight-bold text-left">Descrição</th>';
                toPage +=                       '<th scope="col" colspan="1" class="font-weight-bold">kWh</th>';
                toPage +=                       '<th scope="col" colspan="1" class="font-weight-bold">Valor Unitário</th>';
                toPage +=                       '<th scope="col" colspan="3" class="font-weight-bold">Valor Total</th>';
                toPage +=                   '</tr>';
                toPage +=               '</thead>';
                toPage +=               '<tbody>';
                toPage +=                   '<tr class="table-height-none">';
                toPage +=                       '<th scope="row" class="font-weight-bold">' + ("0" + countItems).slice(-2) + '</th>';
                toPage +=                       '<td colspan="2" class="text-left">Energia Consumida</td>';
                toPage +=                       '<td>' + EC_KWH + '</td>';
                toPage +=                       '<td colspan="1">' + (EC_VU).toString().replace(".", ",") + '</td>';
                toPage +=                       '<td colspan="3">R$ ' + formatMoney((EC_KWH * EC_VU).toFixed(2)) + 
                                                '</td>';
                toPage +=                   '</tr>';
                
                countItems++;
                
                toPage +=                   '<tr class="table-height-none">';
                toPage +=                       '<th scope="row" class="font-weight-bold">' + ("0" + countItems).slice(-2) + '</th>';
                toPage +=                       '<td colspan="2" class="text-left">Tarifa de Iluminação Pública</td>';
                toPage +=                       '<td></td>';
                toPage +=                       '<td colspan="1"></td>';
                toPage +=                       '<td colspan="3">R$ ' + formatMoney(TAR_ILUM_PUB) + '</td>';
                toPage +=                   '</tr>';

                countItems++;

                let acrescimo = 1;

                while (clientes[i]["VALOR ACRESC " + acrescimo] !== undefined) {
                    if (parseFloat(clientes[i]["VALOR ACRESC " + acrescimo].replace(",", ".")) > 0) {
                        toPage +=           '<tr class="table-height-none">';
                        toPage +=               '<th scope="row" class="font-weight-bold">' + ("0" + countItems).slice(-2) + '</th>';
                        toPage +=               '<td colspan="2" class="text-left">' + clientes[i]["TEXTO ACRESC " + acrescimo] + '</td>';
                        toPage +=               '<td></td>';
                        toPage +=               '<td  colspan="1"></td>';
                        toPage +=               '<td  colspan="3">R$ ' + formatMoney(clientes[i]["VALOR ACRESC " + acrescimo].replace(",", ".")) + '</td>';
                        toPage +=           '</tr>';

                        countItems++;
                    }

                    acrescimo++;
                }

                toPage +=                   '<tr class="table-height-none">';
                toPage +=                       '<th scope="row" class="font-weight-bold">' + ("0" + countItems).slice(-2) + '</th>';
                toPage +=                       '<td colspan="2" class="font-weight-bold text-left">VALOR SEM ECONOMIA</td>';
                toPage +=                       '<td></td>';
                toPage +=                       '<td  colspan="1" class="font-weight-bold">Subtotal</td>';
                toPage +=                       '<td  colspan="3" class="font-weight-bold">= R$ ' + formatMoney(parseFloat(totalCliente.toFixed(2)) + somaAcrescimo + desconto) + '</td>';
                toPage +=                   '</tr>';

                countItems++;

                toPage +=                   '<tr class="table-evidence table-height-none">';
                toPage +=                       '<td scope="row" class="font-weight-bold">' + ("0" + countItems).slice(-2) + '</td>';
                toPage +=                       '<td colspan="4" class="font-weight-bold text-left">DESCONTO ENERGIA INJETADA</td>';
                toPage +=                       '<td colspan="3" class="font-weight-bold">- R$ ' + formatMoney((desconto).toFixed(2)) + '</td>';
                toPage +=                   '</tr>';

                countItems++;

                if (descontoDifInjVsComp > 0) {
                    toPage +=               '<tr class="table-evidence table-height-none">';
                    toPage +=                   '<td scope="row" class="font-weight-bold">' + ("0" + countItems).slice(-2) + '</td>';
                    toPage +=                   '<td colspan="4" class="font-weight-bold text-left">DESCONTO DEVIDO A DIFERENÇA NO VALOR UNITÁRIO ENTRE ENERGIA INJETADA E ENERGIA COMPENSADA</td>';
                    toPage +=                   '<td colspan="3" class="font-weight-bold">- R$ ' + formatMoney(parseFloat(descontoDifInjVsComp.toFixed(2))) + '</td>';
                    toPage +=               '</tr>';

                    countItems++;
                }

                let descontar = 1;
                
                while (clientes[i]["VALOR DESC " + descontar] !== undefined) {
                    if (parseFloat(clientes[i]["VALOR DESC " + descontar].replace(",", ".")) > 0) {
                        toPage +=           '<tr class="table-evidence table-height-none">';
                        toPage +=               '<td scope="row" class="font-weight-bold">' + ("0" + countItems).slice(-2) + '</td>';
                        toPage +=               '<td colspan="4" class="font-weight-bold text-left">' +clientes[i]["TEXTO DESC " + descontar] + '</td>';
                        toPage +=               '<td colspan="3" class="font-weight-bold">- R$ ' + formatMoney(parseFloat(clientes[i]["VALOR DESC " + descontar].replace(",", "."))) + '</td>';
                        toPage +=           '</tr>';
    
                        countItems++;
                    }

                    descontar++;
                }

                toPage +=                   '<tr class="green-background table-height-none">';
                toPage +=                       '<th class="white-background"></th>';
                toPage +=                       '<th colspan="2" class="white-background"></th>';
                toPage +=                       '<td colspan="2" class="green-background font-weight-bold" style="font-size: 1.12em;">TOTAL COM ECONOMIA</td>';
                toPage +=                       '<td colspan="2" class="green-background font-weight-bold" style="font-size: 1.12em;"> R$ ' + formatMoney(totalCliente + (somaAcrescimo - somaDesconto - parseFloat(descontoDifInjVsComp.toFixed(2)))) + '</td>';
                toPage +=                   '</tr>';
                toPage +=                   '<tr>';
                toPage +=                       '<th scope="row" class="border-hidden"></th>';
                toPage +=                       '<td colspan="2" class="border-hidden"></td>';
                toPage +=                       '<td class="border-hidden"></td>';
                toPage +=                       '<td colspan="1" class="border-hidden"></td>';
                toPage +=                       '<td colspan="3" class="border-hidden"></td>';
                toPage +=                   '</tr>';
                toPage +=               '</tbody>';
                toPage +=           '</table>';
                
                toPage +=           '<div class="row noPadding">'
                toPage +=               '<div class="col-4 noPadding">'
                toPage +=                   '<fieldset class="align-middle text-center total-economy-fieldset">';
                toPage +=                       '<div class="row mt-3">';
                toPage +=                           '<i class="fas fa-2x fa-comment-dollar icon-dolar-style"></i>';
                toPage +=                           '<div class="col-12 text-center noPadding">'; 
                toPage +=                               'Valor total já economizado enquanto cliente:'; 
                toPage +=                           '</div>';
                toPage +=                       '</div>';
                toPage +=                       '<div class="row mt-3">';
                toPage +=                           '<div class="col-12 font-weight-bold">R$ ' + 
                                                        formatMoney(parseFloat(clientes[i]["TOTAL ECONOMIZADO"].replace(",", ".")) + descontoDifInjVsComp + desconto) +
                                                        ' em ' + (parseFloat(clientes[i]["QTD MESES"] ?? 0) + 1) + ' meses' +
                                                    '</div>';
                toPage +=                       '</div>';
                toPage +=                   '</fieldset>';
                toPage +=               '</div>';
                toPage +=               '<div class="col-4">'
                toPage +=                   '<fieldset class="align-middle text-center total-economy-fieldset">';
                toPage +=                       '<div class="row mt-2">';
                toPage +=                           '<div class="col-12 text-center font-weight-bold noPadding">'; 
                toPage +=                               'Crédito de energia:';
                toPage +=                           '</div>';
                toPage +=                       '</div>';
                toPage +=                       '<div class="row mt-1">';
                toPage +=                           '<div class="col-12 text-justify">'; 
                toPage +=                               'Crédito de energia disponível para ser descontato em sua próxima fatura = ' + formatMoney(parseFloat(credito.toFixed(2))) + ' kWh';
                toPage +=                           '</div>';
                toPage +=                       '</div>';
                toPage +=                   '</fieldset>';
                toPage +=               '</div>';
                toPage +=               '<div class="col-4 noPadding">'
                toPage +=                   '<fieldset class="col-3 align-middle text-center detail-calc-fieldset">';
                toPage +=                       '<div class="row mt-2">';
                toPage +=                           '<div class="col-12 text-center font-weight-bold noPadding">'; 
                toPage +=                               'Seu desconto é calculado assim:';
                toPage +=                           '</div>';
                toPage +=                       '</div>';
                toPage +=                       '<div class="row mt-1">';
                toPage +=                           '<div class="col-12 text-justify">';
                toPage +=                               'Energia compensada ' + formatMoney(usaSaldo ? (ENER_INJ_KWH + SALDO_ENER_KWH) : (EC_KWH - CD_CEMIG_KWH)) + ' kWh' +
                                                        ' à R$ ' + (EC_VU).toString().replace(".", ",") + ' com ' + clientes[i]["DESC INJ PERCENT"] + 
                                                        '% de desconto = <span class="font-weight-bold">R$ ' + formatMoney((desconto).toFixed(2)) + '</span>';
                                                        if (clientes[i]["ICMS"] != undefined && clientes[i]["ICMS"] > 0) {
                                                            toPage += ' e com custo de ICMS = ' + clientes[i]["ICMS"] + '%';
                                                        }
                toPage +=                           '</div>';
                toPage +=                       '</div>';
                toPage +=                   '</fieldset>';
                toPage +=               '</div>';
                toPage +=           '</div>';
                toPage +=       '</fieldset>';
                toPage +=   '</div>';
            }

            // >>>>>>>>>>>>>>>>>>>>>>>>>>>> __RODAPE__ >>>>>>>>>>>>>>>>>>>>>>>>>>>>

            {
                toPage +=   '<div class="row mt-2">';
                toPage +=       '<fieldset class="col-3 align-middle text-center end-fieldset blue-background">';
                toPage +=           '<div class="row mt-3">';
                toPage +=               '<div class="col-12">'; 
                toPage +=                   '<label class="font-weight-bold"> ' + 'Fale conosco' + '</label>';
                toPage +=               '</div>';
                toPage +=           '</div>';
                toPage +=           '<div class="row mt-2">';
                toPage +=               '<div class="col-12">'; 
                toPage +=                   '<label class="font-weight-bold"> ' + params[0]["EMAIL"] + '</label>';
                toPage +=               '</div>';
                toPage +=           '</div>';
                toPage +=           '<div class="row mt-2">';
                toPage +=               '<div class="col-12 text-center noPadding">'; 
                toPage +=                   '<label class="font-weight-bold">' + params[0]["TELEFONE"] + '</label>';
                toPage +=               '</div>';
                toPage +=           '</div>';
                toPage +=       '</fieldset>';
    
                toPage +=       '<fieldset class="col-6 align-middle text-center barCode-fieldset">';
                toPage +=           '<div class="row mt-3">';
                toPage +=               '<div class="col-12" id="barCode' + i + '">'; 
                                            geraCodigoBarra(clientes[i]["NUM BOLETO"], 'barCode' + i);
                toPage +=               '</div>';
                toPage +=           '</div>';
                toPage +=           '<div class="row mt-2">';
                toPage +=               '<div class="col-12 smaller-font">'; 
                toPage +=                   params[0]["ALERTA MULTA"]; 
                toPage +=               '</div>';
                toPage +=           '</div>';
                toPage +=       '</fieldset>';
                
                toPage +=       '<fieldset class="col-3 align-middle text-center end-fieldset">';
                toPage +=           '<div class="row mt-3">';
                toPage +=               '<div class="col-12 text-center noPadding">';
                toPage +=               '</div>';
                toPage +=           '</div>';
                toPage +=           '<div class="row mt-4   ">';
                toPage +=               '<div class="col-12 font-weight-bold">'; 
                toPage +=                   params[0]["SITE"]; 
                toPage +=               '</div>';
                toPage +=           '</div>';
                toPage +=       '</fieldset>';
                toPage +=   '</div>';
        
                toPage += '</div>';
            }

            // ANEXA BOLETO
            $('.bodyBoleto').append(toPage);
        }

        localStorage.removeItem('boletos_clientes');
        localStorage.removeItem('params_clientes');
        localStorage.clear();
    }

    function geraCodigoBarra(numero, id) {
        $.ajax({
            data: {
                function: "geraCodigoBarra",
                data: numero
            },
            success: function (data) {
                $('#' + id).append(data);
            }
        });
    }

    function formatMoney(valor, numeroCasasDecimais = 2, separadorDecimal = ',', SeparadorMilhar = '.') {
        numeroCasasDecimais = isNaN(numeroCasasDecimais = Math.abs(numeroCasasDecimais)) ? 2 : numeroCasasDecimais,
            separadorDecimal = typeof separadorDecimal === "undefined" ? "." : separadorDecimal;
        SeparadorMilhar = typeof SeparadorMilhar === "undefined" ? "," : SeparadorMilhar;
        var sign = valor < 0 ? "-" : "";
        var i = String(parseInt(valor = Math.abs(Number(valor) || 0).toFixed(numeroCasasDecimais)));
        var j = (j = i.length) > 3 ? j % 3 : 0;
    
        return sign +
            (j ? i.substr(0, j) + SeparadorMilhar : "") +
            i.substr(j).replace(/(\decSep{3})(?=\decSep)/g, "$1" + SeparadorMilhar) +
            (numeroCasasDecimais ? separadorDecimal + Math.abs(valor - i).toFixed(numeroCasasDecimais).slice(2) : "");
    }

}).ajaxStop(function () {
    setTimeout(function () {
        window.print();
    }, 1000);
});
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var util_1 = require("../util");
var defaultMessage = 'Veuillez saisir un IBAN valide.';
var name = "iban";
/* Convertit en chiffre les lettres du numéro IBAN */
function ibanConvert(data) {
    var convertedText = "";
    for (var i = 0; i < data.length; i++) {
        var val = data.charAt(i);
        if (val > "9") {
            if (val >= "A" && val <= "Z") {
                convertedText += (val.charCodeAt(0) - 55).toString();
            }
        }
        else if (val >= "0") {
            convertedText += val;
        }
    }
    return convertedText;
}
;
var validate = function (value, params) {
    var success = false;
    /// <summary>
    /// Validation du format et de la clé du numéro IBAN 
    /// International Bank Account Number (IBAN) = Relevé international d'identité bancaire
    /// </summary>
    /// <param name="val">Le numéro IBAN</param>
    /// <returns>True si le format ou la clé sont corrects et false sinon</returns>
    if (util_1.util.isEmptyVal(value)) {
        success = true;
    }
    else {
        value = value.replace(/\s/g, '');
        var regexp = /^[a-zA-Z]{2}\d{2}\w{10,30}$/;
        if (!regexp.test(value)) {
            success = false;
        }
        else {
            value = value.toUpperCase();
            // TODO : faire une méthode pour l'extraction du iban
            var country = value.substr(0, 2);
            var key = value.substr(2, 2);
            var bban = value.substr(4);
            var number = ibanConvert(bban + country) + key;
            var keyCalculation = 0;
            var pos = 0;
            while (pos < number.length) {
                keyCalculation = parseInt(keyCalculation + number.substr(pos, 9), 10) % 97;
                pos += 9;
            }
            success = keyCalculation % 97 == 1;
        }
    }
    return {
        success: success,
        message: defaultMessage
    };
};
var rule = {
    name: name,
    validateView: validate,
    validateModel: validate
};
exports.rule = rule;

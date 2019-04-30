"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var util_1 = require("../util");
var defaultMessage = 'Veuillez saisir un n° de sécurité sociale valide.';
var name = "ssn";
function extract(value) {
    /// <summary>
    /// Converti une chaine de caractères objet représentatif du n° de sécu.
    /// </summary>
    /// <param name="value">le numéro de sécu</param>
    /// <returns>Un objet représentant un n° de sécu.</returns>
    value = value ? value.toUpperCase() : value;
    var regexp = /^([1-3])([0-9]{2})([0-9]{2})([0-9]{2}|2A|2B)([0-9]{3})([0-9]{3})([0-9]{2})$/g;
    var result = regexp.exec(value);
    if (result) {
        return {
            gender: result[1],
            birthYear: result[2],
            birthMonth: result[3],
            department: result[4],
            district: result[5],
            increment: result[6],
            key: result[7],
            value: function () {
                var dpt = this.department;
                if (this.department == '2A') {
                    dpt = '19';
                }
                else if (this.department == '2B') {
                    dpt = '18';
                }
                return this.gender + this.birthYear + this.birthMonth + dpt + this.district + this.increment;
            }
        };
    }
    return null;
}
;
var validate = function (value, params) {
    var sucess = true;
    /// <summary>
    /// Validation du format et de la clé d'un numéro de sécurité sociale.
    /// Social Security number (SSN) = Numéro d'inscription au répertoire des personnes physiques (NIR)
    /// </summary>
    /// <param name="val">Le numéro de sécurité sociale </param>
    /// <returns>True si le format et la clé est correcte, false sinon</returns>
    if (util_1.util.isEmptyVal(value)) {
        sucess = true;
    }
    else {
        var ssn = extract(value);
        if (!ssn) {
            sucess = false;
        }
        else {
            var modResult = ssn.value() % 97;
            sucess = util_1.util.formatNumberLength(97 - modResult, 2) == ssn.key;
        }
    }
    return {
        success: sucess,
        message: defaultMessage
    };
};
var rule = {
    name: name,
    validateView: validate,
    validateModel: validate
};
exports.rule = rule;

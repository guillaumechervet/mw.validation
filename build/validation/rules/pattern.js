"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var util_1 = require("../util");
var defaultMessage = 'Veuillez respecter le bon format.';
var name = "pattern";
/// <summary>
/// Verifie si la valeur saisie est un entier
/// </summary>
/// <param name="val">la valeur saisie</param>
/// <returns>True si la valeur saisie est un entier, false sinon</returns>
var validateView = function (value, params) {
    if (params === void 0) { params = undefined; }
    var success = false;
    /// <summary>
    /// Verifie si la chaine de caractère correspond à l'expression régulière.
    /// </summary>
    /// <param name="val">La chaine de caractère</param>
    /// <param name="regex">la regex</param>
    /// <returns>True si la chaine de caractère correspond à la regex, false sinon</returns>
    if (util_1.util.isEmptyVal(value)) {
        success = true;
    }
    else if (params.regex) {
        success = params.regex.test(value.toString());
    }
    else if (params) {
        success = params.test(value.toString());
    }
    return {
        success: success,
        message: defaultMessage
    };
};
var validateModel = function (value, params) {
    if (params === void 0) { params = undefined; }
    var success = false;
    /// <summary>
    /// Verifie si la chaine de caractère correspond à l'expression régulière.
    /// </summary>
    /// <param name="val">La chaine de caractère</param>
    /// <param name="regex">la regex</param>
    /// <returns>True si la chaine de caractère correspond à la regex, false sinon</returns>
    if (util_1.util.isEmptyVal(value)) {
        success = true;
    }
    else {
        success = params.regex.test(value.toString());
    }
    return {
        success: success,
        message: defaultMessage
    };
};
var rule = {
    name: name,
    validateView: validateView,
    validateModel: validateModel
};
exports.rule = rule;

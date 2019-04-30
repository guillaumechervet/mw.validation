"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var util_1 = require("../util");
var textFormatter = require("../i18n/textFormatter");
var defaultMessage = 'Veuillez saisir une valeur supérieure ou égale à {0}.';
var name = "min";
var validate = function (value, params) {
    var sucess = false;
    var isEmpty = util_1.util.isEmptyVal(value);
    if (!isEmpty) {
        sucess = parseFloat(value) >= parseFloat(params.min);
    }
    else {
        sucess = true;
    }
    return {
        success: sucess,
        message: textFormatter.format(defaultMessage, params.min)
    };
};
var rule = {
    name: name,
    validateView: validate,
    validateModel: validate
};
exports.rule = rule;

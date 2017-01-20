"use strict";
var util_1 = require("../util");
var textFormatter = require("../i18n/textFormatter");
var defaultMessage = 'Veuillez saisir une valeur inférieure ou égale à {0}.';
var name = "max";
var validate = function (value, params) {
    var sucess = false;
    var isEmpty = util_1.util.isEmptyVal(value);
    if (isEmpty) {
        sucess = true;
    }
    else {
        sucess = parseFloat(value) <= parseFloat(params.max);
    }
    return {
        success: sucess,
        message: textFormatter.format(defaultMessage, params.max)
    };
};
var rule = {
    name: name,
    validateView: validate,
    validateModel: validate
};
exports.rule = rule;
//# sourceMappingURL=max.js.map
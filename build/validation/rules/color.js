"use strict";
exports.__esModule = true;
var util_1 = require("../util");
var defaultMessage = 'Veuillez saisir une couleur valide.';
var name = "color";
var validate = function (value, params) {
    var success = false;
    if (util_1.util.isEmptyVal(value)) {
        success = true;
    }
    else {
        var regColor = /^#(?:[0-9a-f]{3}){1,2}$/i;
        success = regColor.test(value);
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
//# sourceMappingURL=color.js.map
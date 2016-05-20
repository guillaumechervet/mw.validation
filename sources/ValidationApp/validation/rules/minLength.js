"use strict";
var util_1 = require("../util");
var textFormatter = require("../i18n/textFormatter");
var defaultMessage = 'Veuillez saisir au moins {0} caractère(s).';
var name = "minLength";
var validate = function (value, params) {
    var minLength = 0;
    var success = false;
    if (util_1.util.isEmptyVal(value)) {
        success = true;
    }
    else {
        if (params) {
            if (typeof params === 'object' && params.maxLength) {
                minLength = params.maxLength;
            }
            else if (typeof params === 'object' && params.params) {
                minLength = params.params;
            }
            else if (typeof params === 'number') {
                minLength = params;
            }
        }
        success = value.toString().length >= minLength;
    }
    return {
        success: success,
        message: textFormatter.format(defaultMessage, minLength)
    };
};
var rule = {
    name: name,
    validateView: validate,
    validateModel: validate
};
exports.rule = rule;
//# sourceMappingURL=minLength.js.map
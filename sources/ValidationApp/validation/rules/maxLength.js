"use strict";
var rules = require("../rules");
var util_1 = require("../util");
var textFormatter = require("../i18n/textFormatter");
var defaultMessage = 'Veuillez saisir au plus {0} caractère(s).';
var name = "maxLength";
var validateView = function (value, params) {
    var maxLength = 0;
    var success = false;
    if (util_1.util.isEmptyVal(value)) {
        success = true;
    }
    else {
        if (params) {
            if (typeof params === 'object' && params.maxLength) {
                maxLength = params.maxLength;
            }
            else if (typeof params === 'object' && params.params) {
                maxLength = params.params;
            }
            else if (typeof params === 'number') {
                maxLength = params;
            }
        }
        success = value.toString().length <= maxLength;
    }
    return {
        success: success,
        message: textFormatter.format(defaultMessage, maxLength)
    };
};
exports.validateView = validateView;
var rule = {
    name: name,
    validateView: validateView,
    validateModel: validateView
};
rules.add(rule);
//# sourceMappingURL=maxLength.js.map
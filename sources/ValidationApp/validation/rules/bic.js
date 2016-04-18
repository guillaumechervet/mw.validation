"use strict";
var rules = require("../rules");
var util_1 = require("../util");
var defaultMessage = 'Veuillez saisir un BIC valide.';
var name = "bic";
var validate = function (value, params) {
    var success = false;
    if (util_1.util.isEmptyVal(value)) {
        success = true;
    }
    else {
        var regBic = /^([a-zA-Z]){4}([a-zA-Z]){2}([0-9a-zA-Z]){2}([0-9a-zA-Z]{3})?$/;
        success = regBic.test(value);
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
rules.add(rule);
//# sourceMappingURL=bic.js.map
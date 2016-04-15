"use strict";
var test_1 = require('../test');
define(['ValidationApp/validation/util'], function (util) {
    var defaultMessage = 'Veuillez saisir un BIC valide.';
    var name = "bic";
    var validate = function (value, params) {
        var success = false;
        if (util.isEmptyVal(value)) {
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
    test_1.Rules.add(rule);
    return rule;
});
//# sourceMappingURL=bic.js.map
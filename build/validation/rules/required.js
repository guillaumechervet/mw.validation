"use strict";
exports.__esModule = true;
var util_1 = require("../util");
var defaultMessage = "Le champ est requis.";
var name = "required";
function validate(value) {
    var success = !util_1.util.isEmptyVal(value);
    return {
        success: success,
        message: defaultMessage
    };
}
;
var rule = {
    name: name,
    validateView: validate,
    validateModel: validate,
    priority: 1000
};
exports.rule = rule;
//# sourceMappingURL=required.js.map
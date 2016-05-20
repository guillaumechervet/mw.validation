"use strict";
var rules = require("../rules");
var util_1 = require("../util");
var pattern = require("./pattern");
var maxLength = require("./maxLength");
var defaultMessage = 'Le nom est invalide.';
var name = "firstname";
var validateView = function (value, params) {
    var success = true;
    if (util_1.util.isEmptyVal(value)) {
        success = true;
    }
    var resultMaxLength = maxLength.rule.validateView(value, 50);
    if (!resultMaxLength.success) {
        return resultMaxLength;
    }
    var resultPattern = pattern.rule.validateView(value, /^[a-zâãäåæçèéêëìíîïðñòóôõøùúûüýþÿiA-Z -]*$/);
    if (!resultPattern.success) {
        success = false;
    }
    return {
        success: success,
        message: defaultMessage
    };
};
var rule = {
    name: name,
    validateView: validateView,
    validateModel: validateView
};
exports.rule = rule;
rules.add(rule);
//# sourceMappingURL=firstName.js.map
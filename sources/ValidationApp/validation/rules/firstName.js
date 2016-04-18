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
    var resultMaxLength = maxLength.validateView(value, 50);
    if (!resultMaxLength.success) {
        return resultMaxLength;
    }
    var resultPattern = pattern.validateView(value, /^[a-zâãäåæçèéêëìíîïðñòóôõøùúûüýþÿiA-Z -]*$/);
    if (!resultPattern.success) {
        success = false;
    }
    return {
        success: success,
        message: defaultMessage
    };
};
exports.validateView = validateView;
var rule = {
    name: name,
    validateView: validateView,
    validateModel: validateView
};
rules.add(rule);
//# sourceMappingURL=firstName.js.map
"use strict";
var rules = require("../rules");
var util_1 = require("../util");
var defaultMessage = 'Veuillez respecter le bon format.';
var name = "pattern";
var validateView = function (value, params) {
    if (params === void 0) { params = undefined; }
    var success = false;
    if (util_1.util.isEmptyVal(value)) {
        success = true;
    }
    else if (params.regex) {
        success = params.regex.test(value.toString());
    }
    else if (params) {
        success = params.test(value.toString());
    }
    return {
        success: success,
        message: defaultMessage
    };
};
exports.validateView = validateView;
var validateModel = function (value, params) {
    if (params === void 0) { params = undefined; }
    var success = false;
    if (util_1.util.isEmptyVal(value)) {
        success = true;
    }
    else {
        success = params.regex.test(value.toString());
    }
    return {
        success: success,
        message: defaultMessage
    };
};
exports.validateModel = validateModel;
var rule = {
    name: name,
    validateView: validateView,
    validateModel: validateModel
};
rules.add(rule);
//# sourceMappingURL=pattern.js.map
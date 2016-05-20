"use strict";
var util_1 = require("../util");
var textFormatter = require("../i18n/textFormatter");
var defaultMessage = 'Veuillez saisir une date valide.';
var name = "date";
var formatter = function (value) {
    if (!value) {
        return "";
    }
    if (util_1.util.isDate(value)) {
        return util_1.util.formatDate(value);
    }
    return "";
};
var parser = function (value) {
    if (util_1.util.isDate(value)) {
        return value;
    }
    else {
        var date = util_1.util.toDate(value);
        if (date) {
            return date;
        }
        else {
            return null;
        }
    }
};
var validateView = function (value, params) {
    if (params === void 0) { params = undefined; }
    var sucess = false;
    if (util_1.util.isEmptyVal(value)) {
        sucess = true;
    }
    else if (util_1.util.isDate(value)) {
        sucess = true;
    }
    else {
        var date = util_1.util.toDate(value);
        sucess = !!date;
    }
    return {
        success: sucess,
        message: textFormatter.format(defaultMessage)
    };
};
var validateModel = function (value, params) {
    if (params === void 0) { params = undefined; }
    var sucess = false;
    if (util_1.util.isEmptyVal(value)) {
        sucess = true;
    }
    else {
        if (util_1.util.isDate(value)) {
            sucess = true;
        }
        else {
            sucess = false;
        }
    }
    return {
        success: sucess,
        message: textFormatter.format(defaultMessage)
    };
};
var rule = {
    name: name,
    validateView: validateView,
    validateModel: validateModel,
    parser: parser,
    formatter: formatter,
    priority: 900
};
exports.rule = rule;
//# sourceMappingURL=date.js.map
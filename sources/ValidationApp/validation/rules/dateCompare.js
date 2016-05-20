"use strict";
var rules = require("../rules");
var util_1 = require("../util");
var textFormatter = require("../i18n/textFormatter");
var ruleDate = require("./date");
var defaultMessageSupEqual = 'Veuillez saisir une date supérieur ou égale au {0}.';
var defaultMessageInfEqual = 'Veuillez saisir une date inférieur ou égale au {0}.';
var defaultMessageSup = 'Veuillez saisir une date supérieur au {0}.';
var defaultMessageInf = 'Veuillez saisir une date inéfrieur au {0}.';
var name = "dateCompare";
var compare = function (date, params) {
    if (date) {
        var compareDate = params.dateToCompare;
        var one = new Date(date.getFullYear(), date.getMonth(), date.getDate());
        var two = new Date(compareDate.getFullYear(), compareDate.getMonth(), compareDate.getDate());
        switch (params.compare) {
            case ">=":
                return two.getTime() <= one.getTime();
            case ">":
                return two.getTime() < one.getTime();
            case "<":
                return two.getTime() > one.getTime();
            default:
                return two.getTime() >= one.getTime();
        }
    }
    return false;
};
var getMessage = function (params) {
    var defaultMessage = null;
    switch (params.compare) {
        case ">=":
            defaultMessage = defaultMessageSupEqual;
            break;
        case ">":
            defaultMessage = defaultMessageSup;
            break;
        case "<":
            defaultMessage = defaultMessageInf;
            break;
        default:
            defaultMessage = defaultMessageInfEqual;
            break;
    }
    return textFormatter.format(defaultMessage, util_1.util.formatDate(params.dateToCompare));
};
var updateParams = function (params) {
    var dateToCompare = new Date();
    if (!params) {
        params = { dateToCompare: dateToCompare, compare: "inferiorOrEqual" };
    }
    else if (!params.dateToCompare) {
        params.dateToCompare = dateToCompare;
    }
    else if (!params.compare) {
        params.compare = "inferiorOrEqual";
    }
    return params;
};
var validateView = function (value, params) {
    var result = ruleDate.rule.validateView(value);
    if (!result.success) {
        return result;
    }
    params = updateParams(params);
    var sucess = false;
    var date = null;
    if (util_1.util.isEmptyVal(value)) {
        sucess = true;
    }
    else if (util_1.util.isDate(value)) {
        sucess = compare(value, params);
    }
    else {
        date = util_1.util.toDate(value);
        sucess = compare(date, params);
    }
    return {
        success: sucess,
        message: getMessage(params)
    };
};
var validateModel = function (value, params) {
    var result = ruleDate.rule.validateModel(value);
    if (!result.success) {
        return result;
    }
    params = updateParams(params);
    var sucess = false;
    if (util_1.util.isEmptyVal(value)) {
        sucess = true;
    }
    else {
        sucess = compare(value, params);
    }
    return {
        success: sucess,
        message: getMessage(params)
    };
};
var rule = {
    name: name,
    priority: 600,
    validateView: validateView,
    validateModel: validateModel,
    parser: ruleDate.rule.parser,
    formatter: ruleDate.rule.formatter
};
exports.rule = rule;
rules.add(rule);
//# sourceMappingURL=dateCompare.js.map
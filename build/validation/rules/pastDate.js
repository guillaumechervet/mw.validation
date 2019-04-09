"use strict";
exports.__esModule = true;
var dateCompare = require("./dateCompare");
var date = require("./date");
var name = "pastDate";
var validateView = function (value, params) {
    var result = dateCompare.rule.validateView(value, { 'dateCompare': { compare: "<=" } });
    result.message = "La date doit être inférieure ou égale à la date du jour.";
    return result;
};
var validateModel = function (value, params) {
    return dateCompare.rule.validateModel(value, { 'dateCompare': { compare: "<=" } });
};
var rule = {
    name: name,
    priority: 600,
    validateView: validateView,
    validateModel: validateModel,
    parser: date.rule.parser,
    formatter: date.rule.formatter
};
exports.rule = rule;
//# sourceMappingURL=pastDate.js.map
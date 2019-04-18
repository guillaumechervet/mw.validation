"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var digit = require("./digit");
var name = "digits";
var rule = {
    name: name,
    validateView: digit.rule.validateView,
    validateModel: digit.rule.validateModel,
    parser: digit.rule.parser,
    formatter: digit.rule.formatter,
    priority: 500
};
exports.rule = rule;

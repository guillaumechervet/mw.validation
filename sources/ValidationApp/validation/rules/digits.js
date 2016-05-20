"use strict";
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
//# sourceMappingURL=digits.js.map
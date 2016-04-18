"use strict";
var rules = require("../rules");
var digit = require("./digit");
var name = "digits";
var rule = {
    name: name,
    validateView: digit.validateView,
    validateModel: digit.validateModel,
    parser: digit.parser,
    formatter: digit.formatter,
    priority: 500
};
rules.add(rule);
//# sourceMappingURL=digits.js.map
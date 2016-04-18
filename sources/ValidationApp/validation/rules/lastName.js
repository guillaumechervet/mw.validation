"use strict";
var rules = require("../rules");
var firstName = require("./firstName");
var defaultMessage = 'Le nom est invalide.';
var name = "lastname";
var validate = function (value, params) {
    return firstName.validateView(value, params);
};
var rule = {
    name: name,
    validateView: validate,
    validateModel: validate
};
rules.add(rule);
//# sourceMappingURL=lastName.js.map
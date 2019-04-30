"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var firstName = require("./firstName");
var defaultMessage = 'Le nom est invalide.';
var name = "lastname";
var validate = function (value, params) {
    return firstName.rule.validateView(value, params);
};
var rule = {
    name: name,
    validateView: validate,
    validateModel: validate
};
exports.rule = rule;

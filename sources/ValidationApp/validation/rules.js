"use strict";
var textFormatter = require("./i18n/textFormatter");
var rules = [];
exports.rules = rules;
function validationRule(rule) {
    if (rule.name) {
        this.name = rule.name;
    }
    if (rule.validateView) {
        this.validateView = rule.validateView;
    }
    if (rule.validateModel) {
        this.validateModel = rule.validateModel;
    }
    if (rule.validateViewAsync) {
        this.validateViewAsync = rule.validateViewAsync;
    }
    if (rule.validateModelAsync) {
        this.validateModelAsync = rule.validateModelAsync;
    }
    if (rule.formatter) {
        this.formatter = rule.formatter;
    }
    if (rule.parser) {
        this.parser = rule.parser;
    }
    if (rule.priority) {
        this.priority = rule.priority;
    }
    else {
        this.priority = 100;
    }
}
validationRule.prototype.name = null;
validationRule.prototype.validateViewAsync = null;
validationRule.prototype.validateView = null;
validationRule.prototype.validateModel = null;
validationRule.prototype.validateModelAsync = null;
validationRule.prototype.formatter = null;
validationRule.prototype.parser = null;
validationRule.prototype.priority = 100;
function add(rule) {
    var newValidationRule = new validationRule(rule);
    if (rule.validateView) {
        newValidationRule.validateView = function () {
            return rule.validateView.apply(rule, arguments);
        };
    }
    if (rule.validateModel) {
        newValidationRule.validateModel = function () {
            var result = rule.validateModel.apply(rule, arguments);
            return result;
        };
    }
    for (var j = 0; j < rules.length; j++) {
        if (rules[j].name == rule.name) {
            throw textFormatter.format("Le nom de la règle {0} est déjà présente.", rule.name);
        }
    }
    rules.push(newValidationRule);
}
exports.add = add;
function getRule(name) {
    for (var j = 0; j < rules.length; j++) {
        if (rules[j].name === name) {
            return rules[j];
        }
    }
    return null;
}
exports.getRule = getRule;
//# sourceMappingURL=rules.js.map
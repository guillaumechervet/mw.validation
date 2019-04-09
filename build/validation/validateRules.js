"use strict";
exports.__esModule = true;
var rules = require("./rules");
var util_1 = require("./util");
var max = require("./rules/max");
var ruleRequired = require("./rules/required");
var email = require("./rules/email");
var url = require("./rules/url");
var min = require("./rules/min");
var date = require("./rules/date");
var dateCompare = require("./rules/dateCompare");
var pastDate = require("./rules/pastDate");
var ruleNumber = require("./rules/number");
var ruleIban = require("./rules/iban");
var bic = require("./rules/bic");
var color = require("./rules/color");
var digit = require("./rules/digit");
var digits = require("./rules/digits");
var pattern = require("./rules/pattern");
var ssn = require("./rules/ssn");
var lastName = require("./rules/lastName");
var firstName = require("./rules/firstName");
var maxLength = require("./rules/maxLength");
var minLength = require("./rules/minLength");
var zipCode = require("./rules/zipCode");
var phone = require("./rules/phone");
var custom = require("./rules/custom");
var equal = require("./rules/equal");
var string = require("./rules/string");
rules.add(max.rule);
rules.add(ruleRequired.rule);
rules.add(email.rule);
rules.add(url.rule);
rules.add(min.rule);
rules.add(date.rule);
rules.add(dateCompare.rule);
rules.add(pastDate.rule);
rules.add(ruleNumber.rule);
rules.add(ruleIban.rule);
rules.add(bic.rule);
rules.add(digit.rule);
rules.add(digits.rule);
rules.add(pattern.rule);
rules.add(ssn.rule);
rules.add(lastName.rule);
rules.add(firstName.rule);
rules.add(maxLength.rule);
rules.add(minLength.rule);
rules.add(zipCode.rule);
rules.add(phone.rule);
rules.add(custom.rule);
rules.add(equal.rule);
rules.add(string.rule);
rules.add(color.rule);
function isAddRule(ruleName, validateMethodName) {
    var rule = rules.getRule(ruleName);
    if (rule) {
        if (rule[validateMethodName]) {
            return true;
        }
    }
    return false;
}
function addRulesToExecute(rulesToExecute, ruleName, ruleParams, onlyIf) {
    var rule = rules.getRule(ruleName);
    if (rule) {
        rulesToExecute.push({
            name: ruleName,
            params: ruleParams,
            rule: rule,
            onlyIf: onlyIf
        });
    }
}
function validateDependencies(ruleDefinitions) {
    if (ruleDefinitions instanceof Array) {
        for (var j = 0; j < ruleDefinitions.length; j++) {
            subValidateDependencies(ruleDefinitions[j]);
        }
    }
    else {
        subValidateDependencies(ruleDefinitions);
    }
}
exports.validateDependencies = validateDependencies;
function subValidateDependencies(ruleDefinition) {
    if (typeof ruleDefinition === 'object') {
        for (var ruleName2 in ruleDefinition) {
            var ruleValue2 = ruleDefinition[ruleName2];
            if (ruleName2 === 'dependency') {
                if (typeof ruleValue2 === 'function') {
                    // on execute
                    ruleValue2();
                }
                continue;
            }
        }
    }
}
function extractRulesToExecute(rulesToExecute, ruleDefinition, validateMethodName, generalOnlyIfResult) {
    if (typeof ruleDefinition === 'string') {
        var ruleName1 = ruleDefinition;
        if (isAddRule(ruleName1, validateMethodName)) {
            addRulesToExecute(rulesToExecute, ruleName1, null, generalOnlyIfResult);
        }
    }
    else if (typeof ruleDefinition === 'object') {
        for (var ruleName2 in ruleDefinition) {
            var newParams = {};
            var onlyIf = generalOnlyIfResult;
            var ruleValue2 = ruleDefinition[ruleName2];
            if (ruleName2 === 'dependency') {
                // On ne fait rien du tout
                continue;
            }
            if (!isAddRule(ruleName2, validateMethodName)) {
                continue;
            }
            if (typeof ruleValue2 === 'object') {
                for (var ruleName3 in ruleValue2) {
                    var ruleValue3 = ruleValue2[ruleName3];
                    if (ruleName3 === 'onlyIf') {
                        if (typeof ruleValue3 === 'function') {
                            if (onlyIf) {
                                // on execute
                                onlyIf = ruleValue3();
                            }
                        }
                        else {
                            if (onlyIf) {
                                onlyIf = ruleValue3;
                            }
                        }
                    }
                    else if (ruleName3 == 'validateView' ||
                        ruleName3 == 'validateObject' ||
                        ruleName3 == 'validateModel') {
                        newParams[ruleName3] = ruleValue3;
                    }
                    else {
                        if (typeof ruleValue3 === 'function') {
                            // si fonction alors on exécute et on récupère le resultat
                            newParams[ruleName3] = ruleValue3();
                        }
                        else {
                            // sinon on retourne la value
                            newParams[ruleName3] = ruleValue3;
                        }
                    }
                }
            }
            else if (typeof ruleValue2 === 'function') {
                // Sis c'est une fonction
                newParams[ruleName2] = ruleValue2();
            }
            else {
                newParams[ruleName2] = ruleValue2;
            }
            addRulesToExecute(rulesToExecute, ruleName2, newParams, onlyIf);
        }
    }
}
function getRulesToExecute(ruleDefinition, validateMethodName) {
    var rulesToExecute = [];
    var generalOnlyIfResult = true;
    if (ruleDefinition instanceof Array) {
        // On recherche s'il y a un onlyIf générale sur toute les règles associées
        for (var i = 0; i < ruleDefinition.length; i++) {
            var generalOnlyIf = ruleDefinition[i]['onlyIf'];
            if (generalOnlyIf) {
                if (typeof generalOnlyIf === 'function') {
                    generalOnlyIfResult = generalOnlyIf();
                }
                else {
                    generalOnlyIfResult = generalOnlyIf;
                }
            }
        }
        for (var j = 0; j < ruleDefinition.length; j++) {
            var ruleDef = ruleDefinition[j];
            if (ruleDef['onlyIf']) {
                continue;
            }
            extractRulesToExecute(rulesToExecute, ruleDef, validateMethodName, generalOnlyIfResult);
        }
    }
    else {
        extractRulesToExecute(rulesToExecute, ruleDefinition, validateMethodName, true);
    }
    return rulesToExecute;
}
function getValidationResult(ruleParams, value, validateMethodName) {
    var validationResult;
    var rule = ruleParams.rule;
    if (ruleParams.onlyIf) {
        validationResult = rule[validateMethodName](value, ruleParams.params);
        validationResult.parser = rule.parser;
        validationResult.formatter = rule.formatter;
        validationResult.name = rule.name;
    }
    else {
        validationResult = {
            success: true,
            name: rule.name,
            parser: rule.parser,
            formatter: rule.formatter
        };
    }
    // Surcharge le message si présent dans les paramètre
    if (ruleParams.params && ruleParams.params.message) {
        validationResult.message = ruleParams.params.message;
    }
    return validationResult;
}
function validate(value, ruleDefinition, validateMethodName) {
    var rulesToExecute = getRulesToExecute(ruleDefinition, validateMethodName);
    // ordonne les règles à valider par ordre de priorité
    rulesToExecute = util_1.util.sortHashTable(rulesToExecute, 'priority', false);
    var validationResults = [];
    for (var i = 0; i < rulesToExecute.length; i++) {
        var ruleParams = rulesToExecute[i];
        var validationResult = getValidationResult(ruleParams, value, validateMethodName);
        validationResults.push(validationResult);
    }
    return validationResults;
}
function validateView(value, ruleDefinition) {
    return validate(value, ruleDefinition, 'validateView');
}
exports.validateView = validateView;
function validateModel(value, ruleDefinition) {
    return validate(value, ruleDefinition, 'validateModel');
}
exports.validateModel = validateModel;
var add = rules.add;
exports.add = add;
function firstError(validationResults) {
    var error = null;
    if (validationResults) {
        for (var i = 0; i < validationResults.length; i++) {
            var result = validationResults[i];
            if (!result.success) {
                error = result;
                break;
            }
        }
    }
    return error;
}
exports.firstError = firstError;
//# sourceMappingURL=validateRules.js.map
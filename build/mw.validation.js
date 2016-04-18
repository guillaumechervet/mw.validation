"use strict";
var validation = require("./validation/validateRules");
exports.validation = validation;
var objectValidation = require("./validation/object/validateObject");
exports.objectValidation = objectValidation;
//# sourceMappingURL=main.js.map
"use strict";
var configuration = {
    dates: {
        dateProvider: function () {
            var date = new Date();
            date.setHours(0, 0, 0, 0);
            return date;
        }
    },
    culture: {
        defaultCulture: 'fr',
        setCulture: function (culture) {
            Globalize.culture(culture);
        }
    }
};
exports.configuration = configuration;
configuration.culture.setCulture(configuration.culture.defaultCulture);
//# sourceMappingURL=configuration.js.map
"use strict";
var format = function (format) {
    var args = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        args[_i - 1] = arguments[_i];
    }
    return format.replace(/{(\d+)}/g, function (match, number) {
        return typeof args[number] !== 'undefined'
            ? args[number]
            : match;
    });
};
exports.format = format;
function endWith(str, suffix) {
    return str.indexOf(suffix, str.length - suffix.length) !== -1;
}
exports.endWith = endWith;
//# sourceMappingURL=textFormatter.js.map
"use strict";
function getFunctions(inputObject, functions) {
    if (functions === void 0) { functions = undefined; }
    if (!functions) {
        functions = [];
    }
    if (inputObject instanceof Array) {
        for (var i = 0; i < inputObject.length; i++) {
            var newInputObject = inputObject[i];
            getFunctions(newInputObject, functions);
        }
    }
    else if (typeof inputObject === 'string') {
        return functions;
    }
    else if (typeof inputObject === 'object') {
        for (var name in inputObject) {
            if (name === 'validateModel' || name === 'validateView') {
                continue;
            }
            getFunctions(inputObject[name], functions);
        }
    }
    else if (typeof inputObject === 'function') {
        functions.push(inputObject);
    }
    return functions;
}
exports.getFunctions = getFunctions;
function getFunctionsResult(inputObject, results) {
    var functions = getFunctions(inputObject);
    if (!results) {
        results = {};
    }
    var l = functions.length;
    for (var i = 0; i < l; i++) {
        results[i.toString()] = functions[i]();
    }
    return results;
}
exports.getFunctionsResult = getFunctionsResult;
//# sourceMappingURL=validateObject.js.map
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
"use strict";
var rules = require("../rules");
var util_1 = require("../util");
var defaultMessage = 'Veuillez saisir un BIC valide.';
var name = "bic";
var validate = function (value, params) {
    var success = false;
    if (util_1.util.isEmptyVal(value)) {
        success = true;
    }
    else {
        var regBic = /^([a-zA-Z]){4}([a-zA-Z]){2}([0-9a-zA-Z]){2}([0-9a-zA-Z]{3})?$/;
        success = regBic.test(value);
    }
    return {
        success: success,
        message: defaultMessage
    };
};
var rule = {
    name: name,
    validateView: validate,
    validateModel: validate
};
rules.add(rule);
//# sourceMappingURL=bic.js.map
"use strict";
var rules = require("../rules");
var defaultMessage = 'Une erreur de validation est survenue.';
var name = "custom";
var validateView = function (value, params) {
    var success = true;
    if (params && params.validateView && typeof (params.validateView) == "function") {
        var result = params.validateView(value);
        if (typeof (result) == "object") {
            return result;
        }
        else {
            success = result;
        }
    }
    else if (params) {
        success = params.validateView == true;
    }
    return {
        success: success,
        message: defaultMessage
    };
};
var validateModel = function (value, params) {
    var success = true;
    if (params && params.validateModel && typeof (params.validateModel) == "function") {
        var result = params.validateModel(value);
        if (typeof (result) == "object") {
            return result;
        }
        else {
            success = result;
        }
    }
    else if (params) {
        success = params.validateModel == true;
    }
    return {
        success: success,
        message: defaultMessage
    };
};
var rule = {
    name: name,
    validateView: validateView,
    validateModel: validateModel,
    priority: 50
};
rules.add(rule);
//# sourceMappingURL=custom.js.map
"use strict";
var rules = require("../rules");
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
exports.formatter = formatter;
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
exports.parser = parser;
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
exports.validateView = validateView;
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
exports.validateModel = validateModel;
var rule = {
    name: name,
    validateView: validateView,
    validateModel: validateModel,
    parser: parser,
    formatter: formatter,
    priority: 900
};
rules.add(rule);
//# sourceMappingURL=date.js.map
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
    var result = ruleDate.validateView(value);
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
exports.validateView = validateView;
var validateModel = function (value, params) {
    var result = ruleDate.validateModel(value);
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
exports.validateModel = validateModel;
var rule = {
    name: name,
    priority: 600,
    validateView: validateView,
    validateModel: validateModel,
    parser: ruleDate.parser,
    formatter: ruleDate.formatter
};
rules.add(rule);
//# sourceMappingURL=dateCompare.js.map
"use strict";
var rules = require("../rules");
var util_1 = require("../util");
var defaultMessage = 'Veuillez saisir un entier.';
var name = "digit";
var formatter = function (value) {
    if (typeof value == "undefined" || value == null) {
        return "";
    }
    return value.toString();
};
exports.formatter = formatter;
var parser = function (value) {
    if (typeof value == "undefined") {
        return null;
    }
    else if (typeof value == "number") {
        return value;
    }
    else {
        var number = parseInt(value);
        if (0 == number) {
            return 0;
        }
        else if (number) {
            return number;
        }
        else {
            return null;
        }
    }
};
exports.parser = parser;
var validateView = function (value, params) {
    var success = false;
    var isEmpty = util_1.util.isEmptyVal(value);
    if (!isEmpty) {
        var regex = /^\d+$/;
        success = regex.test(value);
    }
    else {
        success = true;
    }
    return {
        success: success,
        message: defaultMessage
    };
};
exports.validateView = validateView;
var validateModel = function (value, params) {
    var success = false;
    if (util_1.util.isEmptyVal(value)) {
        success = true;
    }
    else if (typeof (value) == "number") {
        success = value % 1 === 0;
    }
    return {
        success: success,
        message: defaultMessage
    };
};
exports.validateModel = validateModel;
var rule = {
    name: name,
    validateView: validateView,
    validateModel: validateModel,
    parser: parser,
    formatter: formatter,
    priority: 600
};
rules.add(rule);
//# sourceMappingURL=digit.js.map
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
"use strict";
var rules = require("../rules");
var util_1 = require("../util");
var defaultMessage = 'Veuillez saisir une adresse électronique valide.';
var name = "email";
var validate = function (value, params) {
    var sucess = false;
    var isEmpty = util_1.util.isEmptyVal(value);
    if (!isEmpty) {
        var regex = /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/i;
        var result = regex.exec(value);
        if (result) {
            sucess = true;
        }
        else {
            sucess = false;
        }
    }
    else {
        sucess = true;
    }
    return {
        success: sucess,
        message: defaultMessage
    };
};
var rule = {
    name: name,
    validateView: validate,
    validateModel: validate
};
rules.add(rule);
//# sourceMappingURL=email.js.map
"use strict";
var rules = require("../rules");
var util_1 = require("../util");
var defaultMessage = "Les valeurs doivent être égales.";
var name = "equal";
function validate(value, params) {
    var success = false;
    if (util_1.util.isEmptyVal(value)) {
        success = true;
    }
    else {
        if (value == null && params.equal == null) {
            success = true;
        }
        else if (value == undefined && params.equal == undefined) {
            success = true;
        }
        else {
            if (value == null || value == undefined) {
                success = true;
            }
            else if (params.equal == null || params.equal == undefined) {
                success = true;
            }
            else {
                success = value.toString() === params.equal.toString();
            }
        }
    }
    return {
        success: success,
        message: defaultMessage
    };
}
;
var rule = {
    name: name,
    validateView: validate,
    validateModel: validate
};
rules.add(rule);
//# sourceMappingURL=equal.js.map
"use strict";
var rules = require("../rules");
var util_1 = require("../util");
var pattern = require("./pattern");
var maxLength = require("./maxLength");
var defaultMessage = 'Le nom est invalide.';
var name = "firstname";
var validateView = function (value, params) {
    var success = true;
    if (util_1.util.isEmptyVal(value)) {
        success = true;
    }
    var resultMaxLength = maxLength.validateView(value, 50);
    if (!resultMaxLength.success) {
        return resultMaxLength;
    }
    var resultPattern = pattern.validateView(value, /^[a-zâãäåæçèéêëìíîïðñòóôõøùúûüýþÿiA-Z -]*$/);
    if (!resultPattern.success) {
        success = false;
    }
    return {
        success: success,
        message: defaultMessage
    };
};
exports.validateView = validateView;
var rule = {
    name: name,
    validateView: validateView,
    validateModel: validateView
};
rules.add(rule);
//# sourceMappingURL=firstName.js.map
"use strict";
var rules = require("../rules");
var util_1 = require("../util");
var defaultMessage = 'Veuillez saisir un IBAN valide.';
var name = "iban";
function ibanConvert(data) {
    var convertedText = "";
    for (var i = 0; i < data.length; i++) {
        var val = data.charAt(i);
        if (val > "9") {
            if (val >= "A" && val <= "Z") {
                convertedText += (val.charCodeAt(0) - 55).toString();
            }
        }
        else if (val >= "0") {
            convertedText += val;
        }
    }
    return convertedText;
}
;
var validate = function (value, params) {
    var success = false;
    if (util_1.util.isEmptyVal(value)) {
        success = true;
    }
    else {
        value = value.replace(/\s/g, '');
        var regexp = /^[a-zA-Z]{2}\d{2}\w{10,30}$/;
        if (!regexp.test(value)) {
            success = false;
        }
        else {
            value = value.toUpperCase();
            var country = value.substr(0, 2);
            var key = value.substr(2, 2);
            var bban = value.substr(4);
            var number = ibanConvert(bban + country) + key;
            var keyCalculation = 0;
            var pos = 0;
            while (pos < number.length) {
                keyCalculation = parseInt(keyCalculation + number.substr(pos, 9), 10) % 97;
                pos += 9;
            }
            success = keyCalculation % 97 == 1;
        }
    }
    return {
        success: success,
        message: defaultMessage
    };
};
var rule = {
    name: name,
    validateView: validate,
    validateModel: validate
};
rules.add(rule);
//# sourceMappingURL=iban.js.map
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
"use strict";
var rules = require("../rules");
var util_1 = require("../util");
var textFormatter = require("../i18n/textFormatter");
var defaultMessage = 'Veuillez saisir une valeur inférieure ou égale à {0}.';
var name = "max";
var validate = function (value, params) {
    var sucess = false;
    var isEmpty = util_1.util.isEmptyVal(value);
    if (isEmpty) {
        sucess = true;
    }
    else {
        sucess = parseFloat(value) <= parseFloat(params.max);
    }
    return {
        success: sucess,
        message: textFormatter.format(defaultMessage, params.max)
    };
};
var rule = {
    name: name,
    validateView: validate,
    validateModel: validate
};
rules.add(rule);
//# sourceMappingURL=max.js.map
"use strict";
var rules = require("../rules");
var util_1 = require("../util");
var textFormatter = require("../i18n/textFormatter");
var defaultMessage = 'Veuillez saisir au plus {0} caractère(s).';
var name = "maxLength";
var validate = function (value, params) {
    var maxLength = 0;
    var success = false;
    if (util_1.util.isEmptyVal(value)) {
        success = true;
    }
    else {
        if (params) {
            if (typeof params === 'object' && params.maxLength) {
                maxLength = params.maxLength;
            }
            else if (typeof params === 'object' && params.params) {
                maxLength = params.params;
            }
            else if (typeof params === 'number') {
                maxLength = params;
            }
        }
        success = value.toString().length <= maxLength;
    }
    return {
        success: success,
        message: textFormatter.format(defaultMessage, maxLength)
    };
};
var rule = {
    name: name,
    validateView: validate,
    validateModel: validate
};
rules.add(rule);
//# sourceMappingURL=maxLength.js.map
"use strict";
var rules = require("../rules");
var util_1 = require("../util");
var textFormatter = require("../i18n/textFormatter");
var defaultMessage = 'Veuillez saisir une valeur supérieure ou égale à {0}.';
var name = "min";
var validate = function (value, params) {
    var sucess = false;
    var isEmpty = util_1.util.isEmptyVal(value);
    if (!isEmpty) {
        sucess = parseFloat(value) >= parseFloat(params.min);
    }
    else {
        sucess = true;
    }
    return {
        success: sucess,
        message: textFormatter.format(defaultMessage, params.min)
    };
};
var rule = {
    name: name,
    validateView: validate,
    validateModel: validate
};
rules.add(rule);
//# sourceMappingURL=min.js.map
"use strict";
var rules = require("../rules");
var util_1 = require("../util");
var textFormatter = require("../i18n/textFormatter");
var defaultMessage = 'Veuillez saisir au moins {0} caractère(s).';
var name = "minLength";
var validate = function (value, params) {
    var minLength = 0;
    var success = false;
    if (util_1.util.isEmptyVal(value)) {
        success = true;
    }
    else {
        if (params) {
            if (typeof params === 'object' && params.maxLength) {
                minLength = params.maxLength;
            }
            else if (typeof params === 'object' && params.params) {
                minLength = params.params;
            }
            else if (typeof params === 'number') {
                minLength = params;
            }
        }
        success = value.toString().length >= minLength;
    }
    return {
        success: success,
        message: textFormatter.format(defaultMessage, minLength)
    };
};
var rule = {
    name: name,
    validateView: validate,
    validateModel: validate
};
rules.add(rule);
//# sourceMappingURL=minLength.js.map
"use strict";
var rules = require("../rules");
var util_1 = require("../util");
var textFormatter = require("../i18n/textFormatter");
var defaultMessage = 'Veuillez saisir un nombre.';
var defaultMessageDecimal = "Veuillez saisir un nombre avec {0} décimal(s) au maximum.";
var name = "number";
var formatter = function (value) {
    return value;
};
var parser = function (value) {
    if (typeof value == "undefined") {
        return null;
    }
    else if (typeof value == "number") {
        return value;
    }
    else {
        value = value.replace(/,/g, ".");
        if (textFormatter.endWith(value, ".")) {
            value = value.substring(0, value.length - 1);
        }
        var number = parseFloat(value);
        if (number) {
            return number;
        }
        else {
            return null;
        }
    }
};
var validateView = function (value, params) {
    var success = false;
    var isEmpty = util_1.util.isEmptyVal(value);
    var message = defaultMessage;
    if (!isEmpty) {
        var regex = null;
        if (params && params.nbDecimal && (typeof params.nbDecimal == "number")) {
            regex = new RegExp("^\\d+([,.]\\d{0," + params.nbDecimal + "})?$", "gi");
            message = textFormatter.format(defaultMessageDecimal, params.nbDecimal);
        }
        else {
            regex = new RegExp("^\\d+([,.]\\d+)?$", "gi");
        }
        success = regex.test(value != undefined && value.replace ? value.replace(/\s/g, "") : value);
    }
    else {
        success = true;
    }
    return {
        success: success,
        message: message
    };
};
var validateModel = function (value, params) {
    var success = false;
    if (!value) {
        success = true;
    }
    if (typeof (value) == "number") {
        success = true;
    }
    return {
        success: success,
        message: defaultMessage
    };
};
var rule = {
    name: name,
    validateView: validateView,
    validateModel: validateModel,
    parser: parser,
    formatter: formatter,
    priority: 500
};
rules.add(rule);
//# sourceMappingURL=number.js.map
"use strict";
var rules = require("../rules");
var dateCompare = require("./dateCompare");
var date = require("./date");
var name = "pastDate";
var validateView = function (value, params) {
    var result = dateCompare.validateView(value, { 'dateCompare': { compare: "<=" } });
    result.message = "La date doit être inférieure ou égale à la date du jour.";
    return result;
};
var validateModel = function (value, params) {
    return dateCompare.validateModel(value, { 'dateCompare': { compare: "<=" } });
};
var rule = {
    name: name,
    priority: 600,
    validateView: validateView,
    validateModel: validateModel,
    parser: date.parser,
    formatter: date.formatter
};
rules.add(rule);
//# sourceMappingURL=pastDate.js.map
"use strict";
var rules = require("../rules");
var util_1 = require("../util");
var defaultMessage = 'Veuillez respecter le bon format.';
var name = "pattern";
var validateView = function (value, params) {
    if (params === void 0) { params = undefined; }
    var success = false;
    if (util_1.util.isEmptyVal(value)) {
        success = true;
    }
    else if (params.regex) {
        success = params.regex.test(value.toString());
    }
    else if (params) {
        success = params.test(value.toString());
    }
    return {
        success: success,
        message: defaultMessage
    };
};
exports.validateView = validateView;
var validateModel = function (value, params) {
    if (params === void 0) { params = undefined; }
    var success = false;
    if (util_1.util.isEmptyVal(value)) {
        success = true;
    }
    else {
        success = params.regex.test(value.toString());
    }
    return {
        success: success,
        message: defaultMessage
    };
};
exports.validateModel = validateModel;
var rule = {
    name: name,
    validateView: validateView,
    validateModel: validateModel
};
rules.add(rule);
//# sourceMappingURL=pattern.js.map
"use strict";
var rules = require("../rules");
var util_1 = require("../util");
var defaultMessage = 'Veuillez saisir un n° de téléphone valide.';
var name = "phone";
var dictionary = {
    "AD": /^((00 ?|\+)376 ?)?([ \-.]?\d){6}$/,
    "AL": /^((00 ?|\+)355 ?|0)?([ \-.]?\d){8}$/,
    "AT": /^((00 ?|\+)43 ?|0)?([ \-.]?\d){4,13}$/,
    "AU": /^((00 ?|\+)61 ?|0)?([ \-.]?\d){9}$/,
    "BA": /^((00 ?|\+)387 ?|0)?([ \-.]?\d){8}$/,
    "BE": /^((00 ?|\+)32 ?|0)?([ \-.]?\d){8}$/,
    "BG": /^((00 ?|\+)359 ?|0)?([ \-.]?\d){7,8}$/,
    "BY": /^((00 ?|\+)375 ?|0)?([ \-.]?\d){9}$/,
    "CA": /^((00 ?|\+)1 ?|1)?([ \-.]?\d){10}$/,
    "CH": /^((00 ?|\+)41 ?|0)?([ \-.]?\d){9}$/,
    "CN": /^((00 ?|\+)86 ?|0)?([ \-.]?\d){10}$/,
    "CZ": /^((00 ?|\+)420 ?)?([ \-.]?\d){9}$/,
    "DE": /^((00 ?|\+)49 ?|0)?([ \-.]?\d){7,11}$/,
    "DK": /^((00 ?|\+)45 ?)?([ \-.]?\d){8}$/,
    "DZ": /^((00 ?|\+)213 ?|0)?([ \-.]?\d){9}$/,
    "EE": /^((00 ?|\+)372 ?)?([ \-.]?\d){7}$/,
    "ES": /^((00 ?|\+)34 ?)?([ \-.]?\d){9}$/,
    "FI": /^((00 ?|\+)358 ?|0)?([ \-.]?\d){5,11}$/,
    "FR": /^((00 ?|\+)33 ?|0)[1-79]([ \-.]?\d){8}$/,
    "GB": /^((00 ?|\+)44 ?|0)?([ \-.]?\d){7,10}$/,
    "GR": /^((00 ?|\+)30 ?)?([ \-.]?\d){10}$/,
    "HR": /^((00 ?|\+)385 ?|0)?([ \-.]?\d){9}$/,
    "HU": /^((00 ?|\+)36 ?|06)?([ \-.]?\d){8}$/,
    "IE": /^((00 ?|\+)353 ?|0)?([ \-.]?\d){9}$/,
    "IN": /^((00 ?|\+)91 ?|0)?([ \-.]?\d){10}$/,
    "IT": /^((00 ?|\+)39 ?|0)?([ \-.]?\d){9}$/,
    "JP": /^((00 ?|\+)81 ?|0)?([ \-.]?\d){9}$/,
    "LI": /^((00 ?|\+)423 ?)?([ \-.]?\d){7}$/,
    "LT": /^((00 ?|\+)370 ?|0)?([ \-.]?\d){8}$/,
    "LU": /^((00 ?|\+)352 ?)?([ \-.]?\d){6,8}$/,
    "LV": /^((00 ?|\+)371 ?)?([ \-.]?\d){8}$/,
    "MA": /^((00 ?|\+)212 ?|0)?([ \-.]?\d){9}$/,
    "MD": /^((00 ?|\+)373 ?|0)?([ \-.]?\d){8}$/,
    "ME": /^((00 ?|\+)382 ?|0)?([ \-.]?\d){8}$/,
    "MK": /^((00 ?|\+)389 ?|0)?([ \-.]?\d){8}$/,
    "NL": /^((00 ?|\+)31 ?|0)?([ \-.]?\d){9}$/,
    "NO": /^((00 ?|\+)47 ?)?([ \-.]?\d){8}$/,
    "PL": /^((00 ?|\+)48 ?)?([ \-.]?\d){9}$/,
    "PT": /^((00 ?|\+)351 ?)?([ \-.]?\d){9}$/,
    "RO": /^((00 ?|\+)40 ?|0)?([ \-.]?\d){9}$/,
    "RS": /^((00 ?|\+)381 ?|0)?([ \-.]?\d){9}$/,
    "RU": /^((00 ?|\+)7 ?|8)?([ \-.]?\d){10}$/,
    "SE": /^((00 ?|\+)46 ?|0)?([ \-.]?\d){6,10}$/,
    "SI": /^((00 ?|\+)386 ?|0)?([ \-.]?\d){8}$/,
    "SK": /^((00 ?|\+)421 ?|0)?([ \-.]?\d){9}$/,
    "TN": /^((00 ?|\+)216 ?)?([ \-.]?\d){8}$/,
    "TR": /^((00 ?|\+)90 ?|0)?([ \-.]?\d){10}$/,
    "UA": /^((00 ?|\+)380 ?|0)?([ \-.]?\d){9}$/,
    "US": /^((00 ?|\+)1 ?|1)?([ \-.]?\d){10}$/
};
function getRegexForCountry(countryCode) {
    return dictionary[countryCode];
}
;
var validate = function (value, params) {
    var sucess = true;
    if (typeof params == 'object' && params) {
        params = params.params;
    }
    if (util_1.util.isEmptyVal(value)) {
        sucess = true;
    }
    else {
        if (util_1.util.isEmptyVal(params)) {
            var regex = /^(\+\s?)?(^(?!\+.*)\(\+?\d+([\s\-\.]?\d+)?\)|\d+)([\s\-\.]?(\(\d+([\s\-\.]?\d+)?\)|\d+))*(\s?(x|ext\.?)\s?\d+)?$/;
            sucess = regex.test(value);
        }
        else {
            var countriesConstraints = params.split(',');
            for (var i = 0; i < countriesConstraints.length; i++) {
                var regexCountry = getRegexForCountry(countriesConstraints[i]);
                if (!regexCountry) {
                    throw "Validation phone :Ce pays n'est pas connu : " + countriesConstraints[i];
                }
                if (regexCountry.test(value)) {
                    sucess = true;
                }
                else {
                    sucess = false;
                }
            }
        }
    }
    return {
        success: sucess,
        message: defaultMessage
    };
};
var rule = {
    name: name,
    validateView: validate,
    validateModel: validate
};
rules.add(rule);
//# sourceMappingURL=phone.js.map
"use strict";
var rules = require("../rules");
var util_1 = require("../util");
var defaultMessage = "Le champ est requis.";
var name = "required";
function validate(value) {
    var success = !util_1.util.isEmptyVal(value);
    return {
        success: success,
        message: defaultMessage
    };
}
;
var rule = {
    name: name,
    validateView: validate,
    validateModel: validate,
    priority: 1000
};
rules.add(rule);
//# sourceMappingURL=required.js.map
"use strict";
var rules = require("../rules");
var util_1 = require("../util");
var defaultMessage = 'Veuillez saisir un n° de sécurité sociale valide.';
var name = "ssn";
function extract(value) {
    value = value ? value.toUpperCase() : value;
    var regexp = /^([1-3])([0-9]{2})([0-9]{2})([0-9]{2}|2A|2B)([0-9]{3})([0-9]{3})([0-9]{2})$/g;
    var result = regexp.exec(value);
    if (result) {
        return {
            gender: result[1],
            birthYear: result[2],
            birthMonth: result[3],
            department: result[4],
            district: result[5],
            increment: result[6],
            key: result[7],
            value: function () {
                var dpt = this.department;
                if (this.department == '2A') {
                    dpt = '19';
                }
                else if (this.department == '2B') {
                    dpt = '18';
                }
                return this.gender + this.birthYear + this.birthMonth + dpt + this.district + this.increment;
            }
        };
    }
    return null;
}
;
var validate = function (value, params) {
    var sucess = true;
    if (util_1.util.isEmptyVal(value)) {
        sucess = true;
    }
    else {
        var ssn = extract(value);
        if (!ssn) {
            sucess = false;
        }
        else {
            var modResult = ssn.value() % 97;
            sucess = (97 - modResult).toString() == ssn.key;
        }
    }
    return {
        success: sucess,
        message: defaultMessage
    };
};
var rule = {
    name: name,
    validateView: validate,
    validateModel: validate
};
rules.add(rule);
//# sourceMappingURL=ssn.js.map
"use strict";
var rules = require("../rules");
var util_1 = require("../util");
var defaultMessage = 'Veuillez saisir une url valide.';
var name = "url";
var validate = function (value, params) {
    var sucess = false;
    var isEmpty = util_1.util.isEmptyVal(value);
    if (!isEmpty) {
        var regex = /^(?:(?:https?|ftp):\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/i;
        var result = regex.exec(value);
        if (result) {
            sucess = true;
        }
        else {
            sucess = false;
        }
    }
    else {
        sucess = true;
    }
    return {
        success: sucess,
        message: defaultMessage
    };
};
var rule = {
    name: name,
    validateView: validate,
    validateModel: validate
};
rules.add(rule);
//# sourceMappingURL=url.js.map
"use strict";
var rules = require("../rules");
var util_1 = require("../util");
var defaultMessage = 'Veuillez saisir un code postal valide.';
var name = "zipCode";
function getRegexForCountry(countryCode) {
    return validation.zipCode.dictionary[countryCode];
}
;
var dictionary = {
    "AD": /^AD[0-9]{3}$/,
    "AL": /^[0-9]{4}$/,
    "AT": /^[0-9]{4}$/,
    "AU": /^[0-9]{4}$/,
    "BA": /^[0-9]{5}$/,
    "BE": /^[0-9]{4}$/,
    "BG": /^[0-9]{4}$/,
    "BY": /^[0-9]{6}$/,
    "CA": /^[A-Z]{1}[0-9]{1}[A-Z]{1}[0-9]{1}[A-Z]{1}[0-9]{1}$/,
    "CH": /^[0-9]{4}$/,
    "CN": /^[0-9]{6}$/,
    "CZ": /^[0-9]{5}$/,
    "DE": /^[0-9]{5}$/,
    "DK": /^[0-9]{4}$/,
    "DZ": /^[0-9]{5}$/,
    "EE": /^[0-9]{5}$/,
    "ES": /^[0-9]{5}$/,
    "FI": /^[0-9]{5}$/,
    "FR": /^[0-9]{5}$/,
    "GB": /^[A-Z]{1}[0-9A-Z]{4}[0-9A-Z]{0,2}$/,
    "GR": /^[0-9]{5}$/,
    "HR": /^[0-9]{5}$/,
    "HU": /^[0-9]{4}$/,
    "IE": /^$/,
    "IN": /^[0-9]{6}$/,
    "IT": /^[0-9]{5}$/,
    "JP": /^[0-9]{7}$/,
    "LI": /^[0-9]{4}$/,
    "LT": /^[0-9]{5}$/,
    "LU": /^[0-9]{4}$/,
    "LV": /^LV-[0-9]{4}$/,
    "MA": /^[0-9]{5}$/,
    "MD": /^[0-9]{4}$/,
    "ME": /^[0-9]{5}$/,
    "MK": /^[0-9]{4}$/,
    "NL": /^[0-9]{4}[A-Z]{2}$/,
    "NO": /^[0-9]{4}$/,
    "PL": /^[0-9]{5}$/,
    "PT": /^[0-9]{7}$/,
    "RO": /^[0-9]{6}$/,
    "RS": /^[0-9]{5}$/,
    "RU": /^[0-9]{6}$/,
    "SE": /^[0-9]{5}$/,
    "SI": /^[0-9]{4}$/,
    "SK": /^[0-9]{5}$/,
    "TN": /^[0-9]{4}$/,
    "TR": /^[0-9]{5}$/,
    "UA": /^[0-9]{5}$/,
    "US": /^[0-9]{5}$/
};
var validate = function (value, params) {
    var success = true;
    if (util_1.util.isEmptyVal(value)) {
        success = true;
    }
    else {
        var codePays = params || 'FR';
        var regexp = validation.zipCode.getRegexForCountry(codePays);
        if (regexp) {
            success = regexp.test(value);
        }
    }
    return {
        success: success,
        message: defaultMessage
    };
};
var rule = {
    name: name,
    validateView: validate,
    validateModel: validate
};
rules.add(rule);
//# sourceMappingURL=zipCode.js.map
"use strict";
var Util = (function () {
    function Util() {
    }
    Util.prototype.isEmptyVal = function (val) {
        if (val === undefined) {
            return true;
        }
        if (val === null) {
            return true;
        }
        if (val === 0) {
            return false;
        }
        if (val.toString() == Number.NaN.toString()) {
            return true;
        }
        if (val === "") {
            return true;
        }
        else {
            return false;
        }
    };
    Util.prototype.isDate = function (val) {
        return Object.prototype.toString.apply(val) === "[object Date]";
    };
    Util.prototype.toDate = function (val) {
        return Globalize.parseDate(val);
    };
    Util.prototype.formatDate = function (date) {
        var d = date.getDate();
        var m = date.getMonth() + 1;
        var y = date.getFullYear();
        return '' + (d <= 9 ? '0' + d : d) + '/' + (m <= 9 ? '0' + m : m) + '/' + y;
    };
    Util.prototype.sortHashTable = function (hashTable, key, removeKey) {
        if (removeKey === void 0) { removeKey = false; }
        hashTable = (hashTable instanceof Array ? hashTable : []);
        var newHashTable = hashTable.sort(function (a, b) {
            if (typeof (a[key]) === "number") {
                return a[key] - b[key];
            }
            else {
                if (a[key] > b[key]) {
                    return 1;
                }
                else {
                    return 0;
                }
            }
            ;
        });
        if (removeKey) {
            for (var i in newHashTable) {
                delete newHashTable[i][key];
            }
        }
        return newHashTable;
    };
    return Util;
}());
var util = new Util();
exports.util = util;
//# sourceMappingURL=util.js.map
"use strict";
var rules = require("./rules");
var util_1 = require("./util");
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
                continue;
            }
            if (!isAddRule(ruleName2, validateMethodName)) {
                continue;
            }
            if (typeof ruleValue2 === 'object') {
                for (var ruleName3 in ruleValue2) {
                    var ruleValue3 = ruleValue2[ruleName3];
                    if (ruleName3 === "onlyIf") {
                        if (typeof ruleValue3 === 'function') {
                            if (onlyIf) {
                                onlyIf = ruleValue3();
                            }
                        }
                        else {
                            if (onlyIf) {
                                onlyIf = ruleValue3;
                            }
                        }
                    }
                    else if (ruleName3 == "validateView" || ruleName3 == "validateObject" || ruleName3 == "validateModel") {
                        newParams[ruleName3] = ruleValue3;
                    }
                    else {
                        if (typeof ruleValue3 === 'function') {
                            newParams[ruleName3] = ruleValue3();
                        }
                        else {
                            newParams[ruleName3] = ruleValue3;
                        }
                    }
                }
            }
            else if (typeof ruleValue2 === 'function') {
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
        for (var i = 0; i < ruleDefinition.length; i++) {
            var generalOnlyIf = ruleDefinition[i]["onlyIf"];
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
            if (ruleDef["onlyIf"]) {
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
    if (ruleParams.params && ruleParams.params.message) {
        validationResult.message = ruleParams.params.message;
    }
    return validationResult;
}
function validate(value, ruleDefinition, validateMethodName) {
    var rulesToExecute = getRulesToExecute(ruleDefinition, validateMethodName);
    rulesToExecute = util_1.util.sortHashTable(rulesToExecute, 'priority', false);
    var validationResults = [];
    for (var i = 0; i < rulesToExecute.length; i++) {
        var ruleParams = rulesToExecute[i];
        var validationResult = getValidationResult(ruleParams, value, validateMethodName);
        validationResults.push(validationResult);
    }
    return validationResults;
}
;
function validateView(value, ruleDefinition) {
    return validate(value, ruleDefinition, "validateView");
}
exports.validateView = validateView;
function validateViewAsync(value, ruleDefinition) {
    return validate(value, ruleDefinition, "validateViewAsync");
}
function validateModel(value, ruleDefinition) {
    return validate(value, ruleDefinition, "validateModel");
}
exports.validateModel = validateModel;
function validateModelAsync(value, ruleDefinition) {
    return validate(value, ruleDefinition, "validateModelAsync");
}
var add = rules.add;
exports.add = add;
//# sourceMappingURL=validateRules.js.map
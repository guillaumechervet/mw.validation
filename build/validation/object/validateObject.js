"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var validation = require("../validateRules");
function validateModelInternal(model, rules, result, key, isStrict) {
    if (!rules) {
        return result;
    }
    for (var name_1 in model) {
        var value = model[name_1];
        if (rules[name_1]) {
            var valResults = validation.validateModel(value, rules[name_1]);
            for (var i = 0; i < valResults.length; i++) {
                var valResult = valResults[i];
                if (!valResult.success) {
                    result.success = false;
                    var info = {};
                    result.detail[key + '.' + name_1 + '.' + valResult.name] = valResult.message;
                }
            }
        }
        else if (isStrict) {
            var subRules = rules['@' + name_1];
            if (!subRules || typeof subRules !== 'object') {
                result.success = false;
                result.detail[key + '.' + name_1 + '.illegal'] = 'La proprieté n\'est pas authorisée.';
            }
        }
    }
    for (var name_2 in model) {
        var value = model[name_2];
        if (typeof value === 'object') {
            validateModelInternal(value, rules['@' + name_2], result, key + '.' + name_2, false);
        }
        else if (Object.prototype.toString.call(value) === '[object Array]') {
            for (var i = 0; i < value.length; i++) {
                validateModelInternal(value, rules['[]' + name_2], result, key + '.' + name_2 + '[' + i + ']', false);
            }
        }
    }
    // Detect non present property
    for (var name_3 in rules) {
        name_3 = name_3.replace('@', '');
        var propertyValue = model[name_3];
        if (propertyValue === undefined) {
            result.detail[key + '.' + name_3 + '.notfound'] = 'La proprieté n\'est pas présente.';
        }
    }
    return result;
}
function validateModel(model, rules, isStrict) {
    if (isStrict === void 0) { isStrict = false; }
    var result = { success: true, detail: {} };
    var key = 'model';
    validateModelInternal(model, rules, result, key, isStrict);
    return result;
}
exports.validateModel = validateModel;
// Liste toutes les fonctions d'un objet (parcour tout l'objet en recurssif)
function getFunctions(inputObject, functions) {
    if (functions === void 0) { functions = null; }
    if (functions === void 0) {
        functions = undefined;
    }
    if (!functions) {
        functions = [];
    }
    if (inputObject instanceof Array) {
        // On recherche s'il y a un onlyIf générale sur toute les règles associées
        for (var i = 0; i < inputObject.length; i++) {
            var newInputObject = inputObject[i];
            getFunctions(newInputObject, functions);
        }
    }
    else if (typeof inputObject === 'string') {
        return functions;
    }
    else if (typeof inputObject === 'object') {
        for (var name_4 in inputObject) {
            // Cas particulié de la règle customs ejecté
            if (name_4 === 'validateView') {
                functions.push({ name: name_4, func: inputObject.validateView });
                continue;
            }
            if (name_4 === 'validateModel') {
                functions.push({ name: name_4, func: inputObject.validateModel });
                continue;
            }
            getFunctions(inputObject[name_4], functions);
        }
    }
    else if (typeof inputObject === 'function') {
        functions.push({ name: "function", func: inputObject });
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
        results[i.toString()] = functions.func[i]();
    }
    return results;
}
exports.getFunctionsResult = getFunctionsResult;

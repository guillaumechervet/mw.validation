"use strict";
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
//# sourceMappingURL=validateObject.js.map
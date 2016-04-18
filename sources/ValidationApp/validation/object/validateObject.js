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
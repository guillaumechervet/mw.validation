"use strict";
exports.__esModule = true;
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
exports.rule = rule;
//# sourceMappingURL=url.js.map
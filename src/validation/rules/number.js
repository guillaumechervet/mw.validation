"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
        // remplace les , par des .
        value = value.replace(/,/g, ".");
        // Supprime le point si c'est le dernier caractère (en cour de saisie)
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
exports.rule = rule;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
    var success = true;
    if (typeof params == 'object' && params) {
        params = params.params;
    }
    /// <summary>
    /// Validation des numéro de téléphone
    /// Les tirets, les points et les espaces sont autorisés
    /// </summary>
    /// <param name="val">le numéro de téléphone</param>
    /// <returns>True si le numéro de téléphone est valide</returns>
    if (util_1.util.isEmptyVal(value)) {
        success = true;
    }
    else {
        if (util_1.util.isEmptyVal(params)) {
            var regex = /^(\+\s?)?(^(?!\+.*)\(\+?\d+([\s\-\.]?\d+)?\)|\d+)([\s\-\.]?(\(\d+([\s\-\.]?\d+)?\)|\d+))*(\s?(x|ext\.?)\s?\d+)?$/;
            success = regex.test(value);
        }
        else {
            var countriesConstraints = params.split(',');
            for (var i = 0; i < countriesConstraints.length; i++) {
                var regexCountry = getRegexForCountry(countriesConstraints[i]);
                if (!regexCountry) {
                    throw "Validation phone :Ce pays n'est pas connu : " + countriesConstraints[i];
                }
                if (regexCountry.test(value)) {
                    success = true;
                }
                else {
                    success = false;
                }
            }
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
exports.rule = rule;

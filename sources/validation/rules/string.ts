//define(['ValidationApp/validation/i18n/textFormatter', 'ValidationApp/validation/rules', 'ValidationApp/validation/util'], function (textFormatter, rules, util) {
import * as rules from "../rules";
import {util} from "../util";

    var defaultMessage = 'Veuillez saisir une chaîne de caractères.';
    var name = "string";

    var formatter = function (value) {

        if (typeof value == "undefined" || value == null) {
           return "";
        }

        return value.toString();
    };

    var parser = function (value) {
        if (typeof value == "undefined") {
            return null;
        }
        else if (typeof value == "string") {
            return value;
        } else {
            return value.toString();
        }
    };

    /// <summary>
    /// Verifie si la valeur saisie est un entier
    /// </summary>
    /// <param name="val">la valeur saisie</param>
    /// <returns>True si la valeur saisie est un entier, false sinon</returns>
    var validateView = function (value, params) {

        var success = false;

        var isEmpty = util.isEmptyVal(value);

        if (!isEmpty) {
            if (typeof value == "string") {
                success = true;
            }
        }
        else {
            success = true;
        }

        return {
            success: success,
            message: defaultMessage
        };
    };

    var validateModel = function (value, params) {
        var success = false;

        if (util.isEmptyVal (value)) {
            success = true;
        }
        else if (typeof value == "string") {
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
        priority: 600
    };

 export {rule};
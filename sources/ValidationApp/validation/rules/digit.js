define(['ValidationApp/validation/i18n/textFormatter', 'ValidationApp/validation/rules', 'ValidationApp/validation/util'], function (textFormatter, rules, util) {

    var defaultMessage = 'Veuillez saisir un entier.';
    var name = "digit";

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
        else if (typeof value == "number") {
            return value;
        } else {
            var number = parseInt(value);

            if (0 == number) {
                return 0;
            }
            else if (number) {
                return number;
            } else {
                return null;
            }
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

    var validateModel = function (value, params) {
        var success = false;

        if (util.isEmptyVal (value)) {
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


    var rule = {
        name: name,
        validateView: validateView,
        validateModel: validateModel,
        parser: parser,
        formatter: formatter,
        priority: 600
    };

    rules.add(rule);

    return rule;
});
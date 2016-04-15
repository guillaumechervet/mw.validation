define(['ValidationApp/validation/i18n/textFormatter', 'ValidationApp/validation/rules', 'ValidationApp/validation/util'], function (textFormatter, rules, util) {
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
        var isEmpty = util.isEmptyVal(value);
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
    return rule;
});
//# sourceMappingURL=number.js.map
define(['ValidationApp/validation/i18n/textFormatter', 'ValidationApp/validation/rules', 'ValidationApp/validation/util'], function (textFormatter, rules, util) {
    var defaultMessage = 'Veuillez respecter le bon format.';
    var name = "pattern";
    var validateView = function (value, params) {
        var success = false;
        if (util.isEmptyVal(value)) {
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
    var validateModel = function (value, params) {
        var success = false;
        if (util.isEmptyVal(value)) {
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
    var rule = {
        name: name,
        validateView: validateView,
        validateModel: validateModel
    };
    rules.add(rule);
    return rule;
});
//# sourceMappingURL=pattern.js.map
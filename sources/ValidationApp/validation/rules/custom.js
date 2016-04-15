define(['ValidationApp/validation/i18n/textFormatter', 'ValidationApp/validation/rules', 'ValidationApp/validation/util'], function (textFormatter, rules, util) {
    var defaultMessage = 'Une erreur de validation est survenue.';
    var name = "custom";
    var validateView = function (value, params) {
        var success = true;
        if (params && params.validateView && typeof (params.validateView) == "function") {
            var result = params.validateView(value);
            if (typeof (result) == "object") {
                return result;
            }
            else {
                success = result;
            }
        }
        else if (params) {
            success = params.validateView == true;
        }
        return {
            success: success,
            message: defaultMessage
        };
    };
    var validateModel = function (value, params) {
        var success = true;
        if (params && params.validateModel && typeof (params.validateModel) == "function") {
            var result = params.validateModel(value);
            if (typeof (result) == "object") {
                return result;
            }
            else {
                success = result;
            }
        }
        else if (params) {
            success = params.validateModel == true;
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
        priority: 50
    };
    rules.add(rule);
    return rule;
});
//# sourceMappingURL=custom.js.map
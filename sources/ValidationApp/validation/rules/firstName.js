define(['ValidationApp/validation/i18n/textFormatter', 'ValidationApp/validation/rules', 'ValidationApp/validation/util', 'ValidationApp/validation/rules/maxLength', 'ValidationApp/validation/rules/pattern'], function (textFormatter, rules, util, maxLength, pattern) {

    var defaultMessage = 'Le nom est invalide.';
    var name = "firstname";

    var validate = function (value, params) {

        var success = true;

        if (util.isEmptyVal(value)) {
            success = true;
        }

        var resultMaxLength = maxLength.validateView(value, 50);
        if (!resultMaxLength.success) {
            return resultMaxLength;
        }
        var resultPattern = pattern.validateView(value, /^[a-zâãäåæçèéêëìíîïðñòóôõøùúûüýþÿiA-Z -]*$/);
        if (!resultPattern.success) {
            success =false;
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

    rules.add(rule);

    return rule;

});
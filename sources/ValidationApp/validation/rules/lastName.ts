define(['ValidationApp/validation/i18n/textFormatter', 'ValidationApp/validation/rules', 'ValidationApp/validation/util', 'ValidationApp/validation/rules/firstName'], function (textFormatter, rules, util, firstName) {

    var defaultMessage = 'Le nom est invalide.';
    var name = "lastname";

    var validate = function (value, params) {
        return firstName.validateView(value, params);
    };

    var rule = {
        name: name,
        validateView: validate,
        validateModel: validate
    };

    rules.add(rule);

    return rule;

});
define(['ValidationApp/validation/i18n/textFormatter', 'ValidationApp/validation/rules', 'ValidationApp/validation/rules/digit'], function (textFormatter, rules, digit) {

    var name = "digits";

    var rule = {
        name: name,
        validateView: digit.validateView,
        validateModel: digit.validateModel,
        parser: digit.parser,
        formatter: digit.formatter,
        priority: 500
    };

    rules.add(rule);

    return rule;

});
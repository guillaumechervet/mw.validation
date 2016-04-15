define(['ValidationApp/validation/rules', 'ValidationApp/validation/util'], function (rules, util) {

    var defaultMessage = "Le champ est requis.";
    var name = "required";

    function validate(value) {

        var success = !util.isEmptyVal(value);

        return {
            success: success,
            message: defaultMessage
        };
    };

    var rule = {
        name: name,
        validateView: validate,
        validateModel: validate,
        priority: 1000
    };

    rules.add(rule);

    return rule;
});
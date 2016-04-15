define(['ValidationApp/validation/i18n/textFormatter', 'ValidationApp/validation/rules', 'ValidationApp/validation/util'], function (textFormatter, rules, util) {

    var defaultMessage = 'Veuillez saisir une valeur supérieure ou égale à {0}.';
    var name = "min";

    var validate = function (value, params) {

        var sucess = false;

        var isEmpty = util.isEmptyVal(value);

        if (!isEmpty) {
            sucess = parseFloat(value) >= parseFloat(params.min);
        } else {
            sucess = true;
        }

        return {
            success: sucess,
            message: textFormatter.format(defaultMessage, params.min)
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
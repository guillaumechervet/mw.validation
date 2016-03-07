define(['ValidationApp/validation/i18n/textFormatter', 'ValidationApp/validation/rules', 'ValidationApp/validation/rules/dateCompare'], function (textFormatter, rules, dateCompare) {

    var name = "pastDate";

  

    var validateView = function (value, params) {

       var result = dateCompare.validateView(value, { 'dateCompare': { compare: "<=" } });

        result.message = "La date doit être inférieure ou égale à la date du jour.";

        return result;
    };

    var validateModel = function (value, params) {

        return dateCompare.validateModel(value, { 'dateCompare': { compare: "<=" } });
    };

    var rule = {
        name: name,
        priority: 600,
        validateView: validateView,
        validateModel: validateModel,
        parser: dateCompare.parser,
        formatter: dateCompare.formatter
    };

    rules.add(rule);

    return rule;

});
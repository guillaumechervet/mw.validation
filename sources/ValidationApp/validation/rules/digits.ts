//define(['ValidationApp/validation/i18n/textFormatter', 'ValidationApp/validation/rules', 'ValidationApp/validation/rules/digit'], function (textFormatter, rules, digit) {
import * as rules from "../rules";
import * as digit from "./digit";

    var name = "digits";

    var rule = {
        name: name,
        validateView: digit.rule.validateView,
        validateModel: digit.rule.validateModel,
        parser: digit.rule.parser,
        formatter: digit.rule.formatter,
        priority: 500
    };

export {rule};
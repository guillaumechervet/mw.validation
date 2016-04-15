define(['ValidationApp/validation/i18n/textFormatter', 'ValidationApp/validation/rules', 'ValidationApp/validation/util'], function (textFormatter, rules, util) {
    var defaultMessage = 'Veuillez saisir au plus {0} caractère(s).';
    var name = "maxLength";
    var validate = function (value, params) {
        var maxLength = 0;
        var success = false;
        if (util.isEmptyVal(value)) {
            success = true;
        }
        else {
            if (params) {
                if (typeof params === 'object' && params.maxLength) {
                    maxLength = params.maxLength;
                }
                else if (typeof params === 'object' && params.params) {
                    maxLength = params.params;
                }
                else if (typeof params === 'number') {
                    maxLength = params;
                }
            }
            success = value.toString().length <= maxLength;
        }
        return {
            success: success,
            message: textFormatter.format(defaultMessage, maxLength)
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
//# sourceMappingURL=maxLength.js.map
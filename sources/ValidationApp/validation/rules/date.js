define(['ValidationApp/validation/i18n/textFormatter', 'ValidationApp/validation/rules', 'ValidationApp/validation/util'], function (textFormatter, rules, util) {
    var defaultMessage = 'Veuillez saisir une date valide.';
    var name = "date";
    var formatter = function (value) {
        if (!value) {
            return "";
        }
        if (util.isDate(value)) {
            return util.formatDate(value);
        }
        return "";
    };
    var parser = function (value) {
        if (util.isDate(value)) {
            return value;
        }
        else {
            var date = util.toDate(value);
            if (date) {
                return date;
            }
            else {
                return null;
            }
        }
    };
    var validateView = function (value, params) {
        var sucess = false;
        if (util.isEmptyVal(value)) {
            sucess = true;
        }
        else if (util.isDate(value)) {
            sucess = true;
        }
        else {
            var date = util.toDate(value);
            sucess = !!date;
        }
        return {
            success: sucess,
            message: textFormatter.format(defaultMessage)
        };
    };
    var validateModel = function (value, params) {
        var sucess = false;
        if (util.isEmptyVal(value)) {
            sucess = true;
        }
        else {
            if (util.isDate(value)) {
                sucess = true;
            }
            else {
                sucess = false;
            }
        }
        return {
            success: sucess,
            message: textFormatter.format(defaultMessage)
        };
    };
    var rule = {
        name: name,
        validateView: validateView,
        validateModel: validateModel,
        parser: parser,
        formatter: formatter,
        priority: 900
    };
    rules.add(rule);
    return {
        validateView: validateView,
        validateModel: validateModel,
        parser: parser,
        formatter: formatter
    };
});
//# sourceMappingURL=date.js.map
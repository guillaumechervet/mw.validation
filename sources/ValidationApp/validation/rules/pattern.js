define(['ValidationApp/validation/i18n/textFormatter', 'ValidationApp/validation/rules', 'ValidationApp/validation/util'], function (textFormatter, rules, util) {

    var defaultMessage = 'Veuillez respecter le bon format.';
    var name = "pattern";

    /// <summary>
    /// Verifie si la valeur saisie est un entier
    /// </summary>
    /// <param name="val">la valeur saisie</param>
    /// <returns>True si la valeur saisie est un entier, false sinon</returns>
    var validateView = function (value, params) {

        var success = false;

        /// <summary>
        /// Verifie si la chaine de caractère correspond à l'expression régulière.
        /// </summary>
        /// <param name="val">La chaine de caractère</param>
        /// <param name="regex">la regex</param>
        /// <returns>True si la chaine de caractère correspond à la regex, false sinon</returns>
        if (util.isEmptyVal(value)) {
            success = true;
        } else if (params.regex) {
            success = params.regex.test(value.toString());
        } else if (params) {
            success = params.test(value.toString());
        }

        return {
            success: success,
            message: defaultMessage
        };
    };

    var validateModel = function (value, params) {
        var success = false;

        /// <summary>
        /// Verifie si la chaine de caractère correspond à l'expression régulière.
        /// </summary>
        /// <param name="val">La chaine de caractère</param>
        /// <param name="regex">la regex</param>
        /// <returns>True si la chaine de caractère correspond à la regex, false sinon</returns>
        if (util.isEmptyVal(value)) {
            success = true;
        } else {
            success = params.regex.test(value.toString());
        }

        return {
            success: success,
            message: defaultMessage
        };
    };


    var rule = {
        name: name,
        validateView: validateView,
        validateModel: validateModel
    };

    rules.add(rule);

    return rule;
});
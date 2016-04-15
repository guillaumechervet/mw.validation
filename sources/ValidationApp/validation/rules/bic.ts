
import {Rules} from '../test';

define([ 'ValidationApp/validation/util'], function (util) {

    var defaultMessage = 'Veuillez saisir un BIC valide.';
    var name = "bic";

    var validate = function (value, params) {

        var success = false;
        /// <summary>
        /// Validation du code Swift ou BIC
        /// Bank Identification Code(BIC) = Code d'identification bancaire
        /// </summary>
        /// <param name="val">le code BIC</param>
        /// <returns>True si le format est valide</returns>
        if (util.isEmptyVal(value)) {
            success =  true;
        } else {
            var regBic = /^([a-zA-Z]){4}([a-zA-Z]){2}([0-9a-zA-Z]){2}([0-9a-zA-Z]{3})?$/;
            success = regBic.test(value);
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

    Rules.add(rule);

    return rule;
});

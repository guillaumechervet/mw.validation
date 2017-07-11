import * as rules from "../rules";
import {util} from "../util";
import * as textFormatter from "../i18n/textFormatter";

    var defaultMessage = 'Veuillez saisir au plus {0} caractère(s).';
    var name = "maxLength";

    var validateView = function (value, params) {

        /// <summary>
        /// Verifie si la longueur de la chaine de caractère est inférieure à la valeur définie
        /// </summary>
        /// <param name="val">La chaine de caractère</param>
        /// <param name="maxLength">la valeur définie</param>
        /// <returns>True si la longueur de la chaine de caractère est inférieure à la valeur définie, false sinon</returns>
        var maxLength = 0;
        var success = false;
        if (util.isEmptyVal(value)) {
            success = true;
        } else {
            if (params) {

                if (typeof params === 'object' && params.maxLength) {
                    maxLength = params.maxLength;
                } else if (typeof params === 'object' && params.params) {
                    maxLength = params.params;
                } else if (typeof params === 'number') {

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
        validateView: validateView,
        validateModel: validateView
    };

 export {rule};
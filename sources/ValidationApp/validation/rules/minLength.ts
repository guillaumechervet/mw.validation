import * as rules from "../rules";
import {util} from "../util";
import * as textFormatter from "../i18n/textFormatter";

    var defaultMessage = 'Veuillez saisir au moins {0} caractère(s).';
    var name = "minLength";

    var validate = function (value, params) {

        /// <summary>
        /// Verifie si la longueur de la chaine de caractère est inférieure à la valeur définie
        /// </summary>
        /// <param name="val">La chaine de caractère</param>
        /// <param name="maxLength">la valeur définie</param>
        /// <returns>True si la longueur de la chaine de caractère est inférieure à la valeur définie, false sinon</returns>
        var minLength = 0;
        var success = false;
        if (util.isEmptyVal(value)) {
            success = true;
        } else {
            if (params) {

                if (typeof params === 'object' && params.maxLength) {
                    minLength = params.maxLength;
                } else if (typeof params === 'object' && params.params) {
                    minLength = params.params;
                } else if (typeof params === 'number') {
                    minLength = params;
                }
                
            }

            success = value.toString().length >= minLength;
        }

        return {
            success: success,
            message: textFormatter.format(defaultMessage, minLength)
        };
    };


    var rule = {
        name: name,
        validateView: validate,
        validateModel: validate
    };

    rules.add(rule);

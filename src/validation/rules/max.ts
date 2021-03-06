﻿import * as rules from "../rules";
import {util} from "../util";
import * as textFormatter from "../i18n/textFormatter";

    var defaultMessage = 'Veuillez saisir une valeur inférieure ou égale à {0}.';
    var name = "max";

    var validate = function (value, params) {

        var sucess = false;

        var isEmpty = util.isEmptyVal(value);
        
        if (isEmpty) {
            sucess = true;
        }
        else {
            sucess = parseFloat(value) <= parseFloat(params.max);
        }

        return {
            success: sucess,
            message: textFormatter.format(defaultMessage, params.max)
        };
    };


    var rule = {
        name: name,
        validateView: validate,
        validateModel: validate
    };

export {rule};

//define(['ValidationApp/validation/i18n/textFormatter', 'ValidationApp/validation/rules', 'ValidationApp/validation/util'], function (textFormatter, rules, util) {


import * as rules from "../rules";
import {util} from "../util";
import * as textFormatter from "../i18n/textFormatter";


    var defaultMessage = 'Veuillez saisir une date valide.';
    var name = "date";
    
    var _cleanDate = function(value){
         if (typeof value === "string") {
                var date = new Date(value);
                var sucess = !!date;
                if (sucess) {
                    return date;
                }
            }
            return value;
    }

    var formatter = function (value) {
        if (!value) {
            return "";
        }
        // Cas ou la date est un string qui ne devrais pas arriver
       value = _cleanDate(value);
            
        if (util.isDate(value)) {
            return util.formatDate(value);
        }
        return "";
    };

    var parser = function (value) {
        if (util.isDate(value)) {
            return value;
        } else {
            var date = util.toDate(value);
            // retourne la date ou null;
            if (date) {
                return date;
            } else {
                return null;
            }
        }
    };

    var validateView = function (value, params:any=undefined) {
        var sucess = false;
        if (util.isEmptyVal(value)) {
            sucess = true;
        } else if (util.isDate(value)) {
            sucess = true;
        } else {
            var date = util.toDate(value);
            sucess = !!date;
        }
        return {
            success: sucess,
            message: textFormatter.format(defaultMessage)
        };
    };

    var validateModel = function (value, params:any=undefined) {
        var sucess = false;
        if (util.isEmptyVal(value)) {
            sucess = true;
        } else {
            // Cas ou la date est un string qui ne devrais pas arriver
            value = _cleanDate(value);
            if (util.isDate(value)) {
                sucess = true;
            } else {
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

  export {rule};
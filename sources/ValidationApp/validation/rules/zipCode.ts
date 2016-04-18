import * as rules from "../rules";
import {util} from "../util";
import * as textFormatter from "../i18n/textFormatter";

    var defaultMessage = 'Veuillez saisir un code postal valide.';
    var name = "zipCode";

     function getRegexForCountry(countryCode) {
        return validation.zipCode.dictionary[countryCode];
    };

    var dictionary = {
        "AD": /^AD[0-9]{3}$/,
        "AL": /^[0-9]{4}$/,
        "AT": /^[0-9]{4}$/,
        "AU": /^[0-9]{4}$/,
        "BA": /^[0-9]{5}$/,
        "BE": /^[0-9]{4}$/,
        "BG": /^[0-9]{4}$/,
        "BY": /^[0-9]{6}$/,
        "CA": /^[A-Z]{1}[0-9]{1}[A-Z]{1}[0-9]{1}[A-Z]{1}[0-9]{1}$/,
        "CH": /^[0-9]{4}$/,
        "CN": /^[0-9]{6}$/,
        "CZ": /^[0-9]{5}$/,
        "DE": /^[0-9]{5}$/,
        "DK": /^[0-9]{4}$/,
        "DZ": /^[0-9]{5}$/,
        "EE": /^[0-9]{5}$/,
        "ES": /^[0-9]{5}$/,
        "FI": /^[0-9]{5}$/,
        "FR": /^[0-9]{5}$/,
        "GB": /^[A-Z]{1}[0-9A-Z]{4}[0-9A-Z]{0,2}$/,
        "GR": /^[0-9]{5}$/,
        "HR": /^[0-9]{5}$/,
        "HU": /^[0-9]{4}$/,
        "IE": /^$/,
        "IN": /^[0-9]{6}$/,
        "IT": /^[0-9]{5}$/,
        "JP": /^[0-9]{7}$/,
        "LI": /^[0-9]{4}$/,
        "LT": /^[0-9]{5}$/,
        "LU": /^[0-9]{4}$/,
        "LV": /^LV-[0-9]{4}$/,
        "MA": /^[0-9]{5}$/,
        "MD": /^[0-9]{4}$/,
        "ME": /^[0-9]{5}$/,
        "MK": /^[0-9]{4}$/,
        "NL": /^[0-9]{4}[A-Z]{2}$/,
        "NO": /^[0-9]{4}$/,
        "PL": /^[0-9]{5}$/,
        "PT": /^[0-9]{7}$/,
        "RO": /^[0-9]{6}$/,
        "RS": /^[0-9]{5}$/,
        "RU": /^[0-9]{6}$/,
        "SE": /^[0-9]{5}$/,
        "SI": /^[0-9]{4}$/,
        "SK": /^[0-9]{5}$/,
        "TN": /^[0-9]{4}$/,
        "TR": /^[0-9]{5}$/,
        "UA": /^[0-9]{5}$/,
        "US": /^[0-9]{5}$/
    }

    var validate = function (value, params) {

        var success = true;

        /// <summary>
        /// Verifie si le format du code postal est correct
        /// </summary>
        /// <param name="val">code postal = Zip Code</param>
        /// <returns>True si le code postal est valide, false sinon</returns>
        if (util.isEmptyVal(value)) {
            success = true;
        } else {
                var codePays = params || 'FR'; // TODO gérer en configuration la défault country
                var regexp = validation.zipCode.getRegexForCountry(codePays);

                if (regexp) {
                    success = regexp.test(value);
                }
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

    rules.add(rule);

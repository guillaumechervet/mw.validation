
define([], function () {
    
    var configuration = {
        dates: {
            dateProvider: function() {
                var date = new Date();
                date.setHours(0, 0, 0, 0);
                return date;
            }
        },
        culture: {
            defaultCulture: 'fr',
            setCulture: function(culture) {
                Globalize.culture(culture);
            }
        }
    };

    configuration.culture.setCulture(configuration.culture.defaultCulture);

    return configuration;
});


define([], function () {

    var format = function (format) {
        var args = Array.prototype.slice.call(arguments, 1);
        return format.replace(/{(\d+)}/g, function (match, number) {
            return typeof args[number] != 'undefined'
        ? args[number]
        : match
      ;
        });
    };

    function endWith(str, suffix) {
        return str.indexOf(suffix, str.length - suffix.length) !== -1;
    }

    return {
        format: format,
        endWith: endWith
    };
});
define(['ValidationApp/validation/i18n/textFormatter'], function (textFormatter) {
    
       // Liste toutes les fonctions d'un objet (parcour tout l'objet en recurssif)
       function getFunctions(inputObject, functions) {

           if (!functions) {
               functions = [];
           }
           if (inputObject instanceof Array) {

               // On recherche s'il y a un onlyIf générale sur toute les règles associées
               for (var i = 0; i < inputObject.length; i++) {
                   var newInputObject = inputObject[i];
                   getFunctions(newInputObject, functions);
               }

           }
           else if (typeof inputObject === 'string') {
               return functions;
           }
           else if (typeof inputObject === 'object') {

               for (var name in inputObject) {

                   // Cas particulié de la règle customs ejecté
                   if (name === 'validateModel' || name === 'validateView') {
                       continue;
                   }

                   getFunctions(inputObject[name], functions);
               }

           } else if (typeof inputObject === 'function') {
               functions.push(inputObject);
           }

           return functions;
       }

    // Liste toutes les fonctions d'un objet (parcour tout l'objet en recurssif)
    // et récupère leur résultat
    function getFunctionsResult(inputObject, results) {

        var functions = getFunctions(inputObject);

        if (!results) {
            results = {};
        }

        var l = functions.length;

        for (var i =0; i < l; i++) {
            results[i.toString()] = functions[i]();
        }

        return results;
    }

    return {
        getFunctions: getFunctions,
        getFunctionsResult:getFunctionsResult
    };
});
define(['ValidationApp/validation/i18n/textFormatter'], function (textFormatter) {

    var rules = [];

    function validationRule(rule) {

        if (rule.name) {
            this.name = rule.name;
        }
        if (rule.validateView) {
            this.validateView = rule.validateView;
        }
        if (rule.validateModel) {
            this.validateModel = rule.validateModel;
        }
        if (rule.validateViewAsync) {
            this.validateViewAsync = rule.validateViewAsync;
        }
        if (rule.validateModelAsync) {
            this.validateModelAsync = rule.validateModelAsync;
        }
        if (rule.formatter) {
            this.formatter = rule.formatter;
        }
        if (rule.parser) {
            this.parser = rule.parser;
        }
        if (rule.priority) {
            this.priority = rule.priority;
        } else {
            this.priority = 100;
        }
    }

    validationRule.prototype.name = null;
    validationRule.prototype.validateViewAsync = null;
    validationRule.prototype.validateView = null;
    validationRule.prototype.validateModel = null;
    validationRule.prototype.validateModelAsync = null;
    validationRule.prototype.formatter = null;
    validationRule.prototype.parser = null;
    validationRule.prototype.priority = 100;

    function add(rule) {

        var newValidationRule = new validationRule(rule);

        if (rule.validateView) {
            newValidationRule.validateView = function () {
                return rule.validateView.apply(rule, arguments);
            };
        }

        if (rule.validateViewAsync) {
            newValidationRule.validateViewAsync = function () {

                var deferred = Q.defer();

                var resolveCallback = function (data) {
                    deferred.resolve(data);
                };
                var rejectCallback = function (data) {
                    deferred.reject(data);
                };

                var args = [];
                for (var i = 0; i < arguments.length; i++) {
                    args.push(arguments[i]);
                }
                args.push(resolveCallback);
                args.push(rejectCallback);

                rule.validateViewAsync.apply(rule, args);

                var promise = deferred.promise;

                return promise.then(function (data) {
                    return data;
                });

            };
        }

        if (rule.validateModel) {
            newValidationRule.validateModel = function () {
                var result = rule.validateModel.apply(rule, arguments);
                return result;
            };
        }

        if (rule.validateModelAsync) {
            newValidationRule.validateModelAsync = function () {

                var deferred = Q.defer();

                var resolveCallback = function (data) {
                    deferred.resolve(data);
                };
                var rejectCallback = function (data) {
                    deferred.reject(data);
                };

                var args = [];
                for (var i = 0; i < arguments.length; i++) {
                    args.push(arguments[i]);
                }
                args.push(resolveCallback);
                args.push(rejectCallback);

                rule.validateModelAsync.apply(rule, args);

                var promise = deferred.promise;

                return promise;

            };
        }

        for (var j = 0; j < rules.length; j++) {
            if (rules[j].name == rule.name) {
                throw textFormatter.format("Le nom de la règle {0} est déjà présente.", rule.name);
            }
        }

        rules.push(newValidationRule);
    }


    function getRule(name) {

        for (var j = 0; j < rules.length; j++) {
            if (rules[j].name == name) {
                return rules[j];
            }
        }

        return null;
    }

    return {
        add: add,
        rules: rules,
        getRule: getRule
    };
});
define(['ValidationApp/validation/i18n/textFormatter', 'ValidationApp/validation/rules', 'ValidationApp/validation/util'], function (textFormatter, rules, util) {

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

    rules.add(rule);

    return rule;
});

define(['ValidationApp/validation/i18n/textFormatter', 'ValidationApp/validation/rules', 'ValidationApp/validation/util'], function (textFormatter, rules, util) {

    var defaultMessage = 'Une erreur de validation est survenue.';
    var name = "custom";

    /// <summary>
    /// Verifie si la valeur saisie est un entier
    /// </summary>
    /// <param name="val">la valeur saisie</param>
    /// <returns>True si la valeur saisie est un entier, false sinon</returns>
    var validateView = function (value, params) {

        var success = true;

        if (params && params.validateView && typeof (params.validateView) == "function") {
             var result = params.validateView(value);
            if(typeof(result) == "object"){
                return result;
            } else{
                success = result;
            }            
        } else if (params) {
            success = params.validateView == true;
        }

        return {
            success: success,
            message: defaultMessage
        };
    };

    var validateModel = function (value, params) {

        var success = true;

        if (params && params.validateModel && typeof (params.validateModel) == "function") {
              var result = params.validateModel(value);
            if(typeof(result) == "object"){
                return result;
            } else{
                success = result;
            }      
        } else if (params) {
            success = params.validateModel == true;
        }

        return {
            success: success,
            message: defaultMessage
        };
    };


    var rule = {
        name: name,
        validateView: validateView,
        validateModel: validateModel,
        priority: 50
    };

    rules.add(rule);

    return rule;

});
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

    var validateView = function (value, params) {
        var sucess = false;
        if (util.isEmptyVal(value)) {
            sucess = true;
        } else if (util.isDate(value)) {
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
        } else {

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

    rules.add(rule);

    return {
        validateView: validateView,
        validateModel: validateModel,
        parser: parser,
        formatter: formatter
    };
});
define(['ValidationApp/validation/i18n/textFormatter', 'ValidationApp/validation/rules', 'ValidationApp/validation/util', 'ValidationApp/validation/rules/date'], function (textFormatter, rules, util, ruleDate) {

    var defaultMessageSupEqual = 'Veuillez saisir une date supérieur ou égale au {0}.';
    var defaultMessageInfEqual = 'Veuillez saisir une date inférieur ou égale au {0}.';
    var defaultMessageSup = 'Veuillez saisir une date supérieur au {0}.';
    var defaultMessageInf = 'Veuillez saisir une date inéfrieur au {0}.';

    var name = "dateCompare";

    var compare = function (date, params) {
        if (date) {
            var compareDate = params.dateToCompare;

            // Copy date parts of the timestamps, discarding the time parts.
            var one = new Date(date.getFullYear(), date.getMonth(), date.getDate());
            var two = new Date(compareDate.getFullYear(), compareDate.getMonth(), compareDate.getDate());

            switch (params.compare) {
                case ">=":
                    return two.getTime() <= one.getTime();
                case ">":
                    return two.getTime() < one.getTime();
                case "<":
                    return two.getTime() > one.getTime();
                default:
                    return two.getTime() >= one.getTime();
            }
        }
        return false;
    };

    var getMessage = function (params) {

        var defaultMessage = null;

        switch (params.compare) {
            case ">=":
                defaultMessage = defaultMessageSupEqual;
                break;
            case ">":
                defaultMessage = defaultMessageSup;
                break;
            case "<":
                defaultMessage = defaultMessageInf;
                break;
            default:
                defaultMessage = defaultMessageInfEqual;
                break;
        }

        return textFormatter.format(defaultMessage, util.formatDate(params.dateToCompare));
    };

    var updateParams = function (params) {

        // Si aucun paramètre, on prend la date du jour
        var dateToCompare = new Date();
        if (!params) {
            params = { dateToCompare: dateToCompare, compare: "inferiorOrEqual" };
        } else if (!params.dateToCompare) {
            params.dateToCompare = dateToCompare;
        }
        else if (!params.compare) {
            params.compare = "inferiorOrEqual";
        }

        return params;
    };

    var validateView = function (value, params) {

        // On test la validitée de la date
        var result = ruleDate.validateView(value);

        if (!result.success) {
            return result;
        }

        // On initialise les paramètres
        params = updateParams(params);

        // Réalise le test
        var sucess = false;
        var date = null;
        if (util.isEmptyVal(value)) {
            sucess = true;
        } else if (util.isDate(value)) {
            sucess = compare(value, params);
        }
        else {
            date = util.toDate(value);
            sucess = compare(date, params);
        }

        return {
            success: sucess,
            message: getMessage(params)
        };
    };

    var validateModel = function (value, params) {

        // On test la validitée de la date
        var result = ruleDate.validateModel(value);

        if (!result.success) {
            return result;
        }

        // On initialise les paramètres
        params = updateParams(params);

        var sucess = false;
        if (util.isEmptyVal(value)) {
            sucess = true;
        } else {
            sucess = compare(value, params);
        }
        return {
            success: sucess,
            message: getMessage(params)
        };
    };

    var rule = {
        name: name,
        priority: 600,
        validateView: validateView,
        validateModel: validateModel,
        parser: ruleDate.parser,
        formatter: ruleDate.formatter
    };

    rules.add(rule);

    return rule;

});
define(['ValidationApp/validation/i18n/textFormatter', 'ValidationApp/validation/rules', 'ValidationApp/validation/util'], function (textFormatter, rules, util) {

    var defaultMessage = 'Veuillez saisir un entier.';
    var name = "digit";

    var formatter = function (value) {

        if (typeof value == "undefined" || value == null) {
           return "";
        }

        return value.toString();
    };

    var parser = function (value) {
        if (typeof value == "undefined") {
            return null;
        }
        else if (typeof value == "number") {
            return value;
        } else {
            var number = parseInt(value);

            if (0 == number) {
                return 0;
            }
            else if (number) {
                return number;
            } else {
                return null;
            }
        }

    };

    /// <summary>
    /// Verifie si la valeur saisie est un entier
    /// </summary>
    /// <param name="val">la valeur saisie</param>
    /// <returns>True si la valeur saisie est un entier, false sinon</returns>
    var validateView = function (value, params) {

        var success = false;

        var isEmpty = util.isEmptyVal(value);

        if (!isEmpty) {
            var regex = /^\d+$/;
            success = regex.test(value);
        }
        else {
            success = true;
        }

        return {
            success: success,
            message: defaultMessage
        };
    };

    var validateModel = function (value, params) {
        var success = false;

        if (util.isEmptyVal (value)) {
            success = true;
        }
        else if (typeof (value) == "number") {
            success = value % 1 === 0;
        }

        return {
            success: success,
            message: defaultMessage
        };
    };


    var rule = {
        name: name,
        validateView: validateView,
        validateModel: validateModel,
        parser: parser,
        formatter: formatter,
        priority: 600
    };

    rules.add(rule);

    return rule;
});
define(['ValidationApp/validation/i18n/textFormatter', 'ValidationApp/validation/rules', 'ValidationApp/validation/rules/digit'], function (textFormatter, rules, digit) {

    var name = "digits";

    var rule = {
        name: name,
        validateView: digit.validateView,
        validateModel: digit.validateModel,
        parser: digit.parser,
        formatter: digit.formatter,
        priority: 500
    };

    rules.add(rule);

    return rule;

});

define(['ValidationApp/validation/rules', 'ValidationApp/validation/util'], function (rules, util) {

    var defaultMessage = 'Veuillez saisir une adresse électronique valide.';
    var name = "email";

    var validate = function (value, params) {

        var sucess = false;

        var isEmpty = util.isEmptyVal(value);

        if (!isEmpty) {

            var regex = /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/i;

            var result = regex.exec(value);

            if (result) {
                sucess = true;
            } else {
                sucess = false;
            }

        } else {
            sucess = true;
        }

        return {
            success: sucess,
            message: defaultMessage
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
 

define(['ValidationApp/validation/rules', 'ValidationApp/validation/util'], function (rules, util) {

    var defaultMessage = "Les valeurs doivent être égales.";
    var name = "equal";

    function validate(value, params) {

        var success = false;
      
        if (util.isEmptyVal(value)) {
            success = true;
        } else {

            if (value == null && params.equal == null) {
                success = true;
            } else if (value == undefined && params.equal == undefined) {
                success = true;
            } else {

                if (value == null || value == undefined) {
                    success = true;
                } else if (params.equal == null || params.equal == undefined) {
                    success = true;
                } else {
                    success = value.toString() === params.equal.toString();
                }
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

    return rule;
});
define(['ValidationApp/validation/i18n/textFormatter', 'ValidationApp/validation/rules', 'ValidationApp/validation/util', 'ValidationApp/validation/rules/maxLength', 'ValidationApp/validation/rules/pattern'], function (textFormatter, rules, util, maxLength, pattern) {

    var defaultMessage = 'Le nom est invalide.';
    var name = "firstname";

    var validate = function (value, params) {

        var success = true;

        if (util.isEmptyVal(value)) {
            success = true;
        }

        var resultMaxLength = maxLength.validateView(value, 50);
        if (!resultMaxLength.success) {
            return resultMaxLength;
        }
        var resultPattern = pattern.validateView(value, /^[a-zâãäåæçèéêëìíîïðñòóôõøùúûüýþÿiA-Z -]*$/);
        if (!resultPattern.success) {
            success =false;
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

    return rule;

});
define(['ValidationApp/validation/i18n/textFormatter', 'ValidationApp/validation/rules', 'ValidationApp/validation/util'], function (textFormatter, rules, util) {

    var defaultMessage = 'Veuillez saisir un IBAN valide.';
    var name = "iban";


    /* Convertit en chiffre les lettres du numéro IBAN */
    function ibanConvert(data) {
        var convertedText = "";

        for (var i = 0; i < data.length; i++) {
            var val = data.charAt(i);
            if (val > "9") {
                if (val >= "A" && val <= "Z") {
                    convertedText += (val.charCodeAt(0) - 55).toString();
                }
            } else if (val >= "0") {
                convertedText += val;
            }
        }
        return convertedText;
    };

    var validate = function (value, params) {

        var success = false;

        /// <summary>
        /// Validation du format et de la clé du numéro IBAN 
        /// International Bank Account Number (IBAN) = Relevé international d'identité bancaire
        /// </summary>
        /// <param name="val">Le numéro IBAN</param>
        /// <returns>True si le format ou la clé sont corrects et false sinon</returns>
        if (util.isEmptyVal(value)) {
            success = true;
        } else {
            value = value.replace( /\s/g , '');
            var regexp = /^[a-zA-Z]{2}\d{2}\w{10,30}$/ ;
            if (!regexp.test(value)) {
                success = false;
            } else {
                value = value.toUpperCase();
                // TODO : faire une méthode pour l'extraction du iban
                var country = value.substr(0, 2);
                var key = value.substr(2, 2);
                var bban = value.substr(4);
                var number = ibanConvert(bban + country) + key;

                var keyCalculation = 0;
                var pos = 0;
                while (pos < number.length) {
                    keyCalculation = parseInt(keyCalculation + number.substr(pos, 9), 10) % 97;
                    pos += 9;
                }
                success = keyCalculation % 97 == 1;
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

    return rule;

});
define(['ValidationApp/validation/i18n/textFormatter', 'ValidationApp/validation/rules', 'ValidationApp/validation/util', 'ValidationApp/validation/rules/firstName'], function (textFormatter, rules, util, firstName) {

    var defaultMessage = 'Le nom est invalide.';
    var name = "lastname";

    var validate = function (value, params) {
        return firstName.validateView(value, params);
    };

    var rule = {
        name: name,
        validateView: validate,
        validateModel: validate
    };

    rules.add(rule);

    return rule;

});
define(['ValidationApp/validation/i18n/textFormatter', 'ValidationApp/validation/rules', 'ValidationApp/validation/util'], function (textFormatter, rules, util) {

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

    rules.add(rule);

    return rule;

});
define(['ValidationApp/validation/i18n/textFormatter', 'ValidationApp/validation/rules', 'ValidationApp/validation/util'], function (textFormatter, rules, util) {

    var defaultMessage = 'Veuillez saisir au plus {0} caractère(s).';
    var name = "maxLength";

    var validate = function (value, params) {

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
        validateView: validate,
        validateModel: validate
    };

    rules.add(rule);

    return rule;

});
define(['ValidationApp/validation/i18n/textFormatter', 'ValidationApp/validation/rules', 'ValidationApp/validation/util'], function (textFormatter, rules, util) {

    var defaultMessage = 'Veuillez saisir une valeur supérieure ou égale à {0}.';
    var name = "min";

    var validate = function (value, params) {

        var sucess = false;

        var isEmpty = util.isEmptyVal(value);

        if (!isEmpty) {
            sucess = parseFloat(value) >= parseFloat(params.min);
        } else {
            sucess = true;
        }

        return {
            success: sucess,
            message: textFormatter.format(defaultMessage, params.min)
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
define(['ValidationApp/validation/i18n/textFormatter', 'ValidationApp/validation/rules', 'ValidationApp/validation/util'], function (textFormatter, rules, util) {

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

    return rule;

});
define(['ValidationApp/validation/i18n/textFormatter', 'ValidationApp/validation/rules', 'ValidationApp/validation/util'], function (textFormatter, rules, util) {

    var defaultMessage = 'Veuillez saisir un nombre.';
    var defaultMessageDecimal = "Veuillez saisir un nombre avec {0} décimal(s) au maximum.";
    var name = "number";

    var formatter = function (value) {
        return value;
    };

    var parser = function (value) {
        if (typeof value == "undefined") {
            return null;
        }
        else if (typeof value == "number") {
            return value;
        } else {

            // remplace les , par des .
            value = value.replace(/,/g, ".");

            // Supprime le point si c'est le dernier caractère (en cour de saisie)
            if (textFormatter.endWith(value, ".")) {
                value = value.substring(0, value.length - 1);
            }

            var number = parseFloat(value);
            if (number) {
                return number;
            } else {
                return null;
            }
        }

    };

    var validateView = function (value, params) {
        var success = false;
        var isEmpty = util.isEmptyVal(value);
        var message = defaultMessage;
        if (!isEmpty) {

            var regex = null;

            if (params && params.nbDecimal && (typeof params.nbDecimal == "number")) {
                regex = new RegExp("^\\d+([,.]\\d{0," + params.nbDecimal + "})?$", "gi");
                message = textFormatter.format(defaultMessageDecimal, params.nbDecimal);
            }
            else {
                regex = new RegExp("^\\d+([,.]\\d+)?$", "gi");
            }
            success = regex.test(value != undefined && value.replace ? value.replace(/\s/g, "") : value);
        }
        else {
            success = true;
        }

        return {
            success: success,
            message: message
        };
    };


    var validateModel = function (value, params) {
        var success = false;

        if (!value) {
            success = true;
        }
        if (typeof (value) == "number") {
            success = true;
        }

        return {
            success: success,
            message: defaultMessage
        };
    };


    var rule = {
        name: name,
        validateView: validateView,
        validateModel: validateModel,
        parser: parser,
        formatter: formatter,
        priority: 500
    };

    rules.add(rule);

    return rule;
});
define(['ValidationApp/validation/i18n/textFormatter', 'ValidationApp/validation/rules', 'ValidationApp/validation/rules/dateCompare'], function (textFormatter, rules, dateCompare) {

    var name = "pastDate";

  

    var validateView = function (value, params) {

       var result = dateCompare.validateView(value, { 'dateCompare': { compare: "<=" } });

        result.message = "La date doit être inférieure ou égale à la date du jour.";

        return result;
    };

    var validateModel = function (value, params) {

        return dateCompare.validateModel(value, { 'dateCompare': { compare: "<=" } });
    };

    var rule = {
        name: name,
        priority: 600,
        validateView: validateView,
        validateModel: validateModel,
        parser: dateCompare.parser,
        formatter: dateCompare.formatter
    };

    rules.add(rule);

    return rule;

});
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
define(['ValidationApp/validation/i18n/textFormatter', 'ValidationApp/validation/rules', 'ValidationApp/validation/util'], function (textFormatter, rules, util) {

    var defaultMessage = 'Veuillez saisir un n° de téléphone valide.';
    var name = "phone";

    var dictionary = {
        "AD": /^((00 ?|\+)376 ?)?([ \-.]?\d){6}$/,
        "AL": /^((00 ?|\+)355 ?|0)?([ \-.]?\d){8}$/,
        "AT": /^((00 ?|\+)43 ?|0)?([ \-.]?\d){4,13}$/,
        "AU": /^((00 ?|\+)61 ?|0)?([ \-.]?\d){9}$/,
        "BA": /^((00 ?|\+)387 ?|0)?([ \-.]?\d){8}$/,
        "BE": /^((00 ?|\+)32 ?|0)?([ \-.]?\d){8}$/,
        "BG": /^((00 ?|\+)359 ?|0)?([ \-.]?\d){7,8}$/,
        "BY": /^((00 ?|\+)375 ?|0)?([ \-.]?\d){9}$/,
        "CA": /^((00 ?|\+)1 ?|1)?([ \-.]?\d){10}$/,
        "CH": /^((00 ?|\+)41 ?|0)?([ \-.]?\d){9}$/,
        "CN": /^((00 ?|\+)86 ?|0)?([ \-.]?\d){10}$/,
        "CZ": /^((00 ?|\+)420 ?)?([ \-.]?\d){9}$/,
        "DE": /^((00 ?|\+)49 ?|0)?([ \-.]?\d){7,11}$/,
        "DK": /^((00 ?|\+)45 ?)?([ \-.]?\d){8}$/,
        "DZ": /^((00 ?|\+)213 ?|0)?([ \-.]?\d){9}$/,
        "EE": /^((00 ?|\+)372 ?)?([ \-.]?\d){7}$/,
        "ES": /^((00 ?|\+)34 ?)?([ \-.]?\d){9}$/,
        "FI": /^((00 ?|\+)358 ?|0)?([ \-.]?\d){5,11}$/,
        "FR": /^((00 ?|\+)33 ?|0)[1-79]([ \-.]?\d){8}$/,
        "GB": /^((00 ?|\+)44 ?|0)?([ \-.]?\d){7,10}$/,
        "GR": /^((00 ?|\+)30 ?)?([ \-.]?\d){10}$/,
        "HR": /^((00 ?|\+)385 ?|0)?([ \-.]?\d){9}$/,
        "HU": /^((00 ?|\+)36 ?|06)?([ \-.]?\d){8}$/,
        "IE": /^((00 ?|\+)353 ?|0)?([ \-.]?\d){9}$/,
        "IN": /^((00 ?|\+)91 ?|0)?([ \-.]?\d){10}$/,
        "IT": /^((00 ?|\+)39 ?|0)?([ \-.]?\d){9}$/,
        "JP": /^((00 ?|\+)81 ?|0)?([ \-.]?\d){9}$/,
        "LI": /^((00 ?|\+)423 ?)?([ \-.]?\d){7}$/,
        "LT": /^((00 ?|\+)370 ?|0)?([ \-.]?\d){8}$/,
        "LU": /^((00 ?|\+)352 ?)?([ \-.]?\d){6,8}$/,
        "LV": /^((00 ?|\+)371 ?)?([ \-.]?\d){8}$/,
        "MA": /^((00 ?|\+)212 ?|0)?([ \-.]?\d){9}$/,
        "MD": /^((00 ?|\+)373 ?|0)?([ \-.]?\d){8}$/,
        "ME": /^((00 ?|\+)382 ?|0)?([ \-.]?\d){8}$/,
        "MK": /^((00 ?|\+)389 ?|0)?([ \-.]?\d){8}$/,
        "NL": /^((00 ?|\+)31 ?|0)?([ \-.]?\d){9}$/,
        "NO": /^((00 ?|\+)47 ?)?([ \-.]?\d){8}$/,
        "PL": /^((00 ?|\+)48 ?)?([ \-.]?\d){9}$/,
        "PT": /^((00 ?|\+)351 ?)?([ \-.]?\d){9}$/,
        "RO": /^((00 ?|\+)40 ?|0)?([ \-.]?\d){9}$/,
        "RS": /^((00 ?|\+)381 ?|0)?([ \-.]?\d){9}$/,
        "RU": /^((00 ?|\+)7 ?|8)?([ \-.]?\d){10}$/,
        "SE": /^((00 ?|\+)46 ?|0)?([ \-.]?\d){6,10}$/,
        "SI": /^((00 ?|\+)386 ?|0)?([ \-.]?\d){8}$/,
        "SK": /^((00 ?|\+)421 ?|0)?([ \-.]?\d){9}$/,
        "TN": /^((00 ?|\+)216 ?)?([ \-.]?\d){8}$/,
        "TR": /^((00 ?|\+)90 ?|0)?([ \-.]?\d){10}$/,
        "UA": /^((00 ?|\+)380 ?|0)?([ \-.]?\d){9}$/,
        "US": /^((00 ?|\+)1 ?|1)?([ \-.]?\d){10}$/
    };
    
    function getRegexForCountry (countryCode) {
       return dictionary[countryCode];
    };

    var validate = function (value, params) {

        var sucess = true;

        if (typeof params == 'object' && params) {
            params = params.params;
        }

        /// <summary>
        /// Validation des numéro de téléphone
        /// Les tirets, les points et les espaces sont autorisés
        /// </summary>
        /// <param name="val">le numéro de téléphone</param>
        /// <returns>True si le numéro de téléphone est valide</returns>
        if (util.isEmptyVal(value)) {
            sucess = true;
        } else {

            if (util.isEmptyVal(params)) {
                var regex = /^(\+\s?)?(^(?!\+.*)\(\+?\d+([\s\-\.]?\d+)?\)|\d+)([\s\-\.]?(\(\d+([\s\-\.]?\d+)?\)|\d+))*(\s?(x|ext\.?)\s?\d+)?$/;
                sucess = regex.test(value);
            } else {
                var countriesConstraints = params.split(',');
                for (var i = 0; i < countriesConstraints.length; i++) {
                    var regexCountry = getRegexForCountry(countriesConstraints[i]);

                    if (!regexCountry) {
                        throw "Validation phone :Ce pays n'est pas connu : " + countriesConstraints[i];
                    }

                    if (regexCountry.test(value)) {
                        sucess = true;
                    } else {
                        sucess = false;
                    }
                }
            }
        }

        return {
            success: sucess,
            message: defaultMessage
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
define(['ValidationApp/validation/rules', 'ValidationApp/validation/util'], function (rules, util) {

    var defaultMessage = "Le champ est requis.";
    var name = "required";

    function validate(value) {

        var success = !util.isEmptyVal(value);

        return {
            success: success,
            message: defaultMessage
        };
    };

    var rule = {
        name: name,
        validateView: validate,
        validateModel: validate,
        priority: 1000
    };

    rules.add(rule);

    return rule;
});
define(['ValidationApp/validation/i18n/textFormatter', 'ValidationApp/validation/rules', 'ValidationApp/validation/util'], function (textFormatter, rules, util) {

    var defaultMessage = 'Veuillez saisir un n° de sécurité sociale valide.';
    var name = "ssn";
    
    function extract(value) {
        /// <summary>
        /// Converti une chaine de caractères objet représentatif du n° de sécu.
        /// </summary>
        /// <param name="value">le numéro de sécu</param>
        /// <returns>Un objet représentant un n° de sécu.</returns>
        value = value ? value.toUpperCase() : value;
        var regexp = /^([1-3])([0-9]{2})([0-9]{2})([0-9]{2}|2A|2B)([0-9]{3})([0-9]{3})([0-9]{2})$/g;

        var result = regexp.exec(value);

        if (result) {
            return {
                gender: result[1],
                birthYear: result[2],
                birthMonth: result[3],
                department: result[4],
                district: result[5],
                increment: result[6],
                key: result[7],
                value: function () {
                    var dpt = this.department;
                    if (this.department == '2A') {
                        dpt = '19';
                    } else if (this.department == '2B') {
                        dpt = '18';
                    }
                    return this.gender + this.birthYear + this.birthMonth + dpt + this.district + this.increment;
                }
            };
        }

        return null;
    };


    var validate = function (value, params) {

        var sucess = true;
        /// <summary>
        /// Validation du format et de la clé d'un numéro de sécurité sociale.
        /// Social Security number (SSN) = Numéro d'inscription au répertoire des personnes physiques (NIR)
        /// </summary>
        /// <param name="val">Le numéro de sécurité sociale </param>
        /// <returns>True si le format et la clé est correcte, false sinon</returns>
        if (util.isEmptyVal(value)) {
            sucess = true;
        } else {
            var ssn = extract(value);
            if (!ssn) {
                sucess = false;
            } else {
                var modResult = ssn.value() % 97;
                sucess = (97 - modResult) == ssn.key;
            }
        }

        return {
            success: sucess,
            message: defaultMessage
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
define(['ValidationApp/validation/rules'], function (rules) {

    var defaultMessage = "Veuillez saisir une valeur inférieure ou égale à {0}.";

    var validateAsync = function (value, params, resolveCallback, rejectCallback) {

        setTimeout(function () {

            var result = {
                success: true,
                message: defaultMessage
            };

            resolveCallback(result);

        }, 1000);

    };

    var rule = {
        name: "testAsync",
        validateViewAsync: validateAsync,
        validateModelAsync: validateAsync
    };

    rules.add(rule);
});

define(['ValidationApp/validation/rules', 'ValidationApp/validation/util'], function (rules, util) {

    var defaultMessage = 'Veuillez saisir une url valide.';
    var name = "url";

    var validate = function (value, params) {

        var sucess = false;

        var isEmpty = util.isEmptyVal(value);

        if (!isEmpty) {

            var regex = /^(?:(?:https?|ftp):\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/i;

            var result = regex.exec(value);

            if (result) {
                sucess = true;
            } else {
                sucess = false;
            }

        } else {
            sucess = true;
        }

        return {
            success: sucess,
            message: defaultMessage
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
 

define(['ValidationApp/validation/i18n/textFormatter', 'ValidationApp/validation/rules', 'ValidationApp/validation/util'], function (textFormatter, rules, util) {

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
    return rule;
});

define([], function () {

    /* vérifier si c'est une valeur vide */
    function isEmptyVal(val) {
        if (val === undefined) {
            return true;
        }
        if (val === null) {
            return true;
        }

        if (val === 0) {
            return false;
        }

        if (val.toString() == Number.NaN.toString()) {
            return true;
        }

        if (val === "") {
            return true;
        } else {
            return false;
        }
    };

    function isDate(val) {
        return Object.prototype.toString.apply(val) === "[object Date]";
    };

    /* Convertir un string de type dd/mm/yyyy en type Date */
    function toDate(val) {
        return Globalize.parseDate(val);
    }

    /* Ajouter une séquence de caractères à un string */
     function padLeft(s, lenght, paddingChar) {
            s = s.toString();
            while (s.length < lenght) {
                s = paddingChar + s;
            }

            return s;
        }

    function formatDate(date) {
            var d = date.getDate();
            var m = date.getMonth() + 1; //Months are zero based
            var y = date.getFullYear();

             return '' + (d <= 9 ? '0' + d : d) + '/' + (m<=9 ? '0' + m : m) + '/' + y;

       //return padLeft(date.getDate(), 2, '0') + '/' + padLeft(date.getMonth(), 2, '0') + '/' + padLeft(date.getYear(), 4, '0');
    }

    //  hashTable: le tableau d’objets
    //  key: la clé par laquelle on va trier le tableau
    //  removeKey: [OPTIONNEL] Un booléen égal à true si on veut supprimer ou non la clé qui nous permet de trier.
    function sortHashTable(hashTable, key, removeKey) {
        hashTable = (hashTable instanceof Array ? hashTable : []);
        var newHashTable = hashTable.sort(function (a, b) {
            return (typeof (a[key]) === 'number' ? a[key] - b[key] : a[key] > b[key]);
        });
        if (removeKey) {
            for (i in newHashTable) {
                delete newHashTable[i][key];
            }
        }
        return newHashTable;
    }


    return {
        isEmptyVal: isEmptyVal,
        isDate: isDate,
        toDate: toDate,
        formatDate: formatDate,
        sortHashTable: sortHashTable
    };
});


define(['ValidationApp/validation/rules',
        'ValidationApp/validation/util',
        'ValidationApp/validation/i18n/textFormatter',
        'ValidationApp/validation/configuration',
        'ValidationApp/validation/rules/max',
        'ValidationApp/validation/rules/required',
        'ValidationApp/validation/rules/testAsync',
        'ValidationApp/validation/rules/email',
        'ValidationApp/validation/rules/url',
        'ValidationApp/validation/rules/min',
        'ValidationApp/validation/rules/date',
        'ValidationApp/validation/rules/dateCompare',
        'ValidationApp/validation/rules/pastDate',
        'ValidationApp/validation/rules/number',
        'ValidationApp/validation/rules/iban',
        'ValidationApp/validation/rules/bic',
        'ValidationApp/validation/rules/digit',
        'ValidationApp/validation/rules/digits',
        'ValidationApp/validation/rules/pattern',
        'ValidationApp/validation/rules/ssn',
        'ValidationApp/validation/rules/lastName',
        'ValidationApp/validation/rules/firstName',
        'ValidationApp/validation/rules/maxLength',
        'ValidationApp/validation/rules/minLength',
        'ValidationApp/validation/rules/zipCode',
        'ValidationApp/validation/rules/phone',
        'ValidationApp/validation/rules/custom',
        'ValidationApp/validation/rules/equal'
    ], function (rules, util, textFormatter) {


        function isAddRule(ruleName, validateMethodName) {

            var rule = rules.getRule(ruleName);
            if (rule) {
                if (rule[validateMethodName]) {
                    return true;
                }
            }
            return false;
        }

        function addRulesToExecute(rulesToExecute, ruleName, ruleParams, onlyIf) {

            var rule = rules.getRule(ruleName);

            if (rule) {

                rulesToExecute.push({
                    name: ruleName,
                    params: ruleParams,
                    rule: rule,
                    onlyIf: onlyIf
                });

            }

        }

        function validateDependencies(ruleDefinitions) {

            if (ruleDefinitions instanceof Array) {
                for (var j = 0; j < ruleDefinitions.length; j++) {
                    subValidateDependencies(ruleDefinitions[j]);
                }
            } else {
                subValidateDependencies(ruleDefinitions);
            }

        }

        function subValidateDependencies(ruleDefinition) {

            if (typeof ruleDefinition === 'object') {
                for (var ruleName2 in ruleDefinition) {

                    var ruleValue2 = ruleDefinition[ruleName2];

                    if (ruleName2 === 'dependency') {
                        if (typeof ruleValue2 === 'function') {
                            // on execute 
                            ruleValue2();
                        }
                        continue;
                    }
                }
            }

        }

        function extractRulesToExecute(rulesToExecute, ruleDefinition, validateMethodName, generalOnlyIfResult) {

            if (typeof ruleDefinition === 'string') {
                var ruleName1 = ruleDefinition;

                if (isAddRule(ruleName1, validateMethodName)) {
                    addRulesToExecute(rulesToExecute, ruleName1, null, generalOnlyIfResult);
                }

            } else if (typeof ruleDefinition === 'object') {
                for (var ruleName2 in ruleDefinition) {

                    var newParams = {};

                    var onlyIf = generalOnlyIfResult;
                    var ruleValue2 = ruleDefinition[ruleName2];

                    if (ruleName2 === 'dependency') {
                        // On ne fait rien du tout
                        continue;
                    }

                    if (!isAddRule(ruleName2, validateMethodName)) {
                        continue;
                    }

                    if (typeof ruleValue2 === 'object') {

                        for (var ruleName3 in ruleValue2) {

                            var ruleValue3 = ruleValue2[ruleName3];

                            if (ruleName3 === "onlyIf") {

                                if (typeof ruleValue3 === 'function') {
                                    if (onlyIf) {
                                        // on execute 
                                        onlyIf = ruleValue3();
                                    }
                                } else {
                                    if (onlyIf) {
                                        onlyIf = ruleValue3;
                                    }
                                }

                            } else if(ruleName3 == "validateView" || ruleName3 == "validateObject" || ruleName3 == "validateModel") {
                                newParams[ruleName3] = ruleValue3;
                            }
                            else {

                                if (typeof ruleValue3 === 'function') {
                                    // si fonction alors on exécute et on récupère le resultat
                                    newParams[ruleName3] = ruleValue3();

                                } else {
                                    // sinon on retourne la value
                                    newParams[ruleName3] = ruleValue3;
                                }

                            }

                        }

                    } else if (typeof ruleValue2 === 'function') {
                        // Sis c'est une fonction
                        newParams[ruleName2] = ruleValue2();

                    } else {
                        newParams[ruleName2] = ruleValue2;
                    }

                    addRulesToExecute(rulesToExecute, ruleName2, newParams, onlyIf);
                }
            }

        }

        function getRulesToExecute(ruleDefinition, validateMethodName) {

            var rulesToExecute = [];

            var generalOnlyIfResult = true;
            if (ruleDefinition instanceof Array) {

                // On recherche s'il y a un onlyIf générale sur toute les règles associées
                  for (var i = 0; i < ruleDefinition.length; i++) {
                    var generalOnlyIf = ruleDefinition[i]["onlyIf"];
                    if (generalOnlyIf) {

                        if (typeof generalOnlyIf === 'function') {
                            generalOnlyIfResult = generalOnlyIf();
                        } else {
                            generalOnlyIfResult = generalOnlyIf;
                        }

                    }
                }
                
                for (var j = 0; j < ruleDefinition.length; j++) {

                    var ruleDef = ruleDefinition[j];
                    
                    if(ruleDef["onlyIf"]) {
                        continue;
                    }

                    extractRulesToExecute(rulesToExecute, ruleDef, validateMethodName, generalOnlyIfResult);
                }

            } else {
                extractRulesToExecute(rulesToExecute, ruleDefinition, validateMethodName, true);
            }

            return rulesToExecute;
        }

        function getValidationResult(ruleParams, value, validateMethodName) {
            var validationResult;
            var rule = ruleParams.rule;

            if (ruleParams.onlyIf) {
                validationResult = rule[validateMethodName](value, ruleParams.params);
                validationResult.parser = rule.parser;
                validationResult.formatter = rule.formatter;
                validationResult.name = rule.name;
            } else {

                if (textFormatter.endWith(validateMethodName, 'Async')) {
                    validationResult = Q.when({
                        success: true,
                        name: rule.name,
                        parser: rule.parser,
                        formatter: rule.formatter
                    });
                } else {
                    validationResult = {
                        success: true,
                        name: rule.name,
                        parser: rule.parser,
                        formatter: rule.formatter
                    };
                }
            }

            // Surcharge le message si présent dans les paramètre
            if (ruleParams.params && ruleParams.params.message) {
                validationResult.message = ruleParams.params.message;
            }

            return validationResult;
        }

        function validate(value, ruleDefinition, validateMethodName) {

            var rulesToExecute = getRulesToExecute(ruleDefinition, validateMethodName);

            // ordonne les règles à valider par ordre de priorité
            rulesToExecute = util.sortHashTable(rulesToExecute, 'priority', false);

            var validationResults = [];

            for (var i = 0; i < rulesToExecute.length; i++) {

                var ruleParams = rulesToExecute[i];
                var validationResult = getValidationResult(ruleParams, value, validateMethodName);
                validationResults.push(validationResult);
            }

            return validationResults;
        };

        function validateView(value, ruleDefinition) {
            return validate(value, ruleDefinition, "validateView");
        }

        function validateViewAsync(value, ruleDefinition) {
            return validate(value, ruleDefinition, "validateViewAsync");
        }

        function validateModel(value, ruleDefinition) {
            return validate(value, ruleDefinition, "validateModel");
        }

        function validateModelAsync(value, ruleDefinition) {
            return validate(value, ruleDefinition, "validateModelAsync");
        }

        return {
            add: rules.add,
            validateView: validateView,
            validateViewAsync: validateViewAsync,
            validateModel: validateModel,
            validateModelAsync: validateModelAsync,
            validateDependencies: validateDependencies
        };
    });

define(['ValidationApp/validation/validateRules', 'ValidationApp/validation/object/validateObject'],
    function (validation, objectValidation) {

        // On ajoute des module au framework
        // container non interne afin d'éviter les conflit 
        //container.validation = validation;
        // container.animation = animation;

        return {
            validation : validation,
            objectValidation : objectValidation
        };
    }); 
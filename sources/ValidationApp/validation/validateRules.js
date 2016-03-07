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

                            } else if(ruleName3 == "validateView" || ruleName3 == "validateObject") {
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
import * as rules from "./rules";
import { util } from "./util";
import * as textFormatter from "./i18n/textFormatter";

import * as configuration from "./configuration";
import * as max from "./rules/max";
import * as ruleRequired from "./rules/required";
import * as email from "./rules/email";
import * as url from "./rules/url";
import * as min from "./rules/min";
import * as date from "./rules/date";
import * as dateCompare from "./rules/dateCompare";
import * as pastDate from "./rules/pastDate";
import * as ruleNumber from "./rules/number";
import * as ruleIban from "./rules/iban";
import * as bic from "./rules/bic";
import * as color from "./rules/color";
import * as digit from "./rules/digit";
import * as digits from "./rules/digits";
import * as pattern from "./rules/pattern";
import * as ssn from "./rules/ssn";
import * as lastName from "./rules/lastName";
import * as firstName from "./rules/firstName";
import * as maxLength from "./rules/maxLength";
import * as minLength from "./rules/minLength";
import * as zipCode from "./rules/zipCode";
import * as phone from "./rules/phone";
import * as custom from "./rules/custom";
import * as equal from "./rules/equal";
import * as string from "./rules/string";

rules.add(max.rule);
rules.add(ruleRequired.rule);
rules.add(email.rule);
rules.add(url.rule);
rules.add(min.rule);
rules.add(date.rule);
rules.add(dateCompare.rule);
rules.add(pastDate.rule);
rules.add(ruleNumber.rule);
rules.add(ruleIban.rule);
rules.add(bic.rule);
rules.add(digit.rule);
rules.add(digits.rule);
rules.add(pattern.rule);
rules.add(ssn.rule);
rules.add(lastName.rule);
rules.add(firstName.rule);
rules.add(maxLength.rule);
rules.add(minLength.rule);
rules.add(zipCode.rule);
rules.add(phone.rule);
rules.add(custom.rule);
rules.add(equal.rule);
rules.add(string.rule);

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
  if (typeof ruleDefinition === "object") {
    for (var ruleName2 in ruleDefinition) {
      var ruleValue2 = ruleDefinition[ruleName2];

      if (ruleName2 === "dependency") {
        if (typeof ruleValue2 === "function") {
          // on execute
          ruleValue2();
        }
        continue;
      }
    }
  }
}

function extractRulesToExecute(
  rulesToExecute,
  ruleDefinition,
  validateMethodName,
  generalOnlyIfResult
) {
  if (typeof ruleDefinition === "string") {
    var ruleName1 = ruleDefinition;

    if (isAddRule(ruleName1, validateMethodName)) {
      addRulesToExecute(rulesToExecute, ruleName1, null, generalOnlyIfResult);
    }
  } else if (typeof ruleDefinition === "object") {
    for (var ruleName2 in ruleDefinition) {
      var newParams = {};

      var onlyIf = generalOnlyIfResult;
      var ruleValue2 = ruleDefinition[ruleName2];

      if (ruleName2 === "dependency") {
        // On ne fait rien du tout
        continue;
      }

      if (!isAddRule(ruleName2, validateMethodName)) {
        continue;
      }

      if (typeof ruleValue2 === "object") {
        for (var ruleName3 in ruleValue2) {
          var ruleValue3 = ruleValue2[ruleName3];

          if (ruleName3 === "onlyIf") {
            if (typeof ruleValue3 === "function") {
              if (onlyIf) {
                // on execute
                onlyIf = ruleValue3();
              }
            } else {
              if (onlyIf) {
                onlyIf = ruleValue3;
              }
            }
          } else if (
            ruleName3 == "validateView" ||
            ruleName3 == "validateObject" ||
            ruleName3 == "validateModel"
          ) {
            newParams[ruleName3] = ruleValue3;
          } else {
            if (typeof ruleValue3 === "function") {
              // si fonction alors on exécute et on récupère le resultat
              newParams[ruleName3] = ruleValue3();
            } else {
              // sinon on retourne la value
              newParams[ruleName3] = ruleValue3;
            }
          }
        }
      } else if (typeof ruleValue2 === "function") {
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
        if (typeof generalOnlyIf === "function") {
          generalOnlyIfResult = generalOnlyIf();
        } else {
          generalOnlyIfResult = generalOnlyIf;
        }
      }
    }

    for (var j = 0; j < ruleDefinition.length; j++) {
      var ruleDef = ruleDefinition[j];

      if (ruleDef["onlyIf"]) {
        continue;
      }

      extractRulesToExecute(
        rulesToExecute,
        ruleDef,
        validateMethodName,
        generalOnlyIfResult
      );
    }
  } else {
    extractRulesToExecute(
      rulesToExecute,
      ruleDefinition,
      validateMethodName,
      true
    );
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
    validationResult = {
      success: true,
      name: rule.name,
      parser: rule.parser,
      formatter: rule.formatter
    };
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
  rulesToExecute = util.sortHashTable(rulesToExecute, "priority", false);

  var validationResults = [];

  for (var i = 0; i < rulesToExecute.length; i++) {
    var ruleParams = rulesToExecute[i];
    var validationResult = getValidationResult(
      ruleParams,
      value,
      validateMethodName
    );
    validationResults.push(validationResult);
  }

  return validationResults;
}

function validateView(value, ruleDefinition) {
  return validate(value, ruleDefinition, "validateView");
}

function validateModel(value, ruleDefinition) {
  return validate(value, ruleDefinition, "validateModel");
}

var add = rules.add;

function firstError(validationResults) {
  var error = null;
  if (validationResults) {
    for (var i = 0; i < validationResults.length; i++) {
      var result = validationResults[i];
      if (!result.success) {
        error = result;
        break;
      }
    }
  }
  return error;
}

export { add, validateView, validateModel, validateDependencies, firstError };

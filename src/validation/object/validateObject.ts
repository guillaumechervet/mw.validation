
import * as validation from "../validateRules";

function validateModelInternal(model, rules, result, key, isStrict) {
  if (!rules) {
    return result;
  }

  for (let name in model) {
    let value = model[name];
    if (rules[name]) {
      let valResults = validation.validateModel(value, rules[name]);
      for (var i = 0; i < valResults.length; i++) {
        const valResult = valResults[i];
        if (!valResult.success) {
          result.success = false;
          var info = {};
          result.detail[key + '.' + name + '.' + valResult.name] = valResult.message;
        }
      }
    } else if (isStrict) {
      const subRules = rules['@' + name];
      if (!subRules || typeof subRules !== 'object') {
        result.detail[key + '.' + name + '.illegal'] = 'La proprieté n\'est pas authorisée.';
      }
    }
  }

  for (let name in model) {
    let value = model[name];
    if (typeof value === 'object') {
      validateModelInternal(value, rules['@' + name], result, key + '.' + name, false);
    } else if (Object.prototype.toString.call(value) === '[object Array]') {
      for (var i = 0; i < value.length; i++) {
        validateModelInternal(value, rules['[]' + name], result, key + '.' + name + '[' + i + ']', false);
      }
    }
  }

  // Detect non present property
  for (let name in rules) {
    name = name.replace('@', '');
    var propertyValue = model[name];
    if (propertyValue === undefined) {
      result.detail[key + '.' + name + '.notfound'] = 'La proprieté n\'est pas présente.';
    }
  }

  return result;
}

function validateModel(model, rules, isStrict = false) {
  const result = { success: true, detail: {} };
  const key = 'model';
  validateModelInternal(model, rules, result, key, isStrict);
  return result;
}

// Liste toutes les fonctions d'un objet (parcour tout l'objet en recurssif)
function getFunctions(inputObject, functions=null) {
  if (functions === void 0) { functions = undefined; }
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
    for (const name in inputObject) {
      // Cas particulié de la règle customs ejecté
      if (name === 'validateView') {
        functions.push({ name: name, func: inputObject.validateView });
        continue;
      }
      if (name === 'validateModel') {
        functions.push({ name: name, func: inputObject.validateModel });
        continue;
      }
      getFunctions(inputObject[name], functions);
    }
  }
  else if (typeof inputObject === 'function') {
    functions.push({ name: "function", func: inputObject });
  }
  return functions;
}

function getFunctionsResult(inputObject, results) {
  const functions = getFunctions(inputObject);
  if (!results) {
    results = {};
  }
  const l = functions.length;
  for (var i = 0; i < l; i++) {
    results[i.toString()] = functions.func[i]();
  }
  return results;
}

export {
  validateModel,
  getFunctions,
  getFunctionsResult
};
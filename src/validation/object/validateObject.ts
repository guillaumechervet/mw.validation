
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
            var valResult = valResults[i];
            if (!valResult.success) {
              result.success = false;
              var info = {};
              result.detail[key + '.' + name + '.' + valResult.name] = valResult.message;
            }
          }
        } else if (isStrict) {
          var subRules = rules['@' + name];
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
          if(propertyValue === undefined){
             result.detail[key + '.' + name + '.notfound'] = 'La proprieté n\'est pas présente.';
          }
       }

      return result;
    }

    function validateModel(model, rules, isStrict=false) {

      var result = { success: true, detail: {} };
      var key = 'model';
      validateModelInternal(model, rules, result, key, isStrict);
      return result;
    }

    export {
        validateModel
    };
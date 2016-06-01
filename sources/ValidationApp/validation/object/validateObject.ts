
import * as textFormatter from "../i18n/textFormatter";

       // Liste toutes les fonctions d'un objet (parcour tout l'objet en recurssif)
       function getFunctions(inputObject, functions: any= undefined) {

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
                       functions.push({name:name, func: inputObject});
                       continue;
                   }

                   getFunctions(inputObject[name], functions);
               }

           } else if (typeof inputObject === 'function') {
               functions.push({name:"function", func: inputObject});
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
            results[i.toString()] = functions.func[i]();
        }

        return results;
    }

    export {
        getFunctions,
        getFunctionsResult
    };
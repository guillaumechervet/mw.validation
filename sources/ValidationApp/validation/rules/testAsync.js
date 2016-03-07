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

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
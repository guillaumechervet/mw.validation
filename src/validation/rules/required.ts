import * as rules from "../rules";
import {util} from "../util";

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

   export {rule};
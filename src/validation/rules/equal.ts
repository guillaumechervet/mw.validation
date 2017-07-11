import * as rules from "../rules";
import {util} from "../util";

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

export {rule};
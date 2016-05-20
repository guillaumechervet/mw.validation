
import * as rules from "../rules";
import {util} from "../util";
import * as pattern from "./pattern";
import * as maxLength from "./maxLength";

    var defaultMessage = 'Le nom est invalide.';
    var name = "firstname";

    var validateView = function (value, params) {

        var success = true;

        if (util.isEmptyVal(value)) {
            success = true;
        }

        var resultMaxLength = maxLength.rule.validateView(value, 50);
        if (!resultMaxLength.success) {
            return resultMaxLength;
        }
        var resultPattern = pattern.rule.validateView(value, /^[a-zâãäåæçèéêëìíîïðñòóôõøùúûüýþÿiA-Z -]*$/);
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
        validateView: validateView,
        validateModel: validateView
    };

    rules.add(rule);
    
  export {rule};
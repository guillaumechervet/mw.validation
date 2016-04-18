import * as rules from "../rules";
import {util} from "../util";
import * as textFormatter from "../i18n/textFormatter";
import * as firstName from "./firstName";

    var defaultMessage = 'Le nom est invalide.';
    var name = "lastname";

    var validate = function (value, params) {
        return firstName.validateView(value, params);
    };

    var rule = {
        name: name,
        validateView: validate,
        validateModel: validate
    };

    rules.add(rule);

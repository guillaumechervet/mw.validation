import * as rules from "../rules";
import {util} from "../util";
import * as textFormatter from "../i18n/textFormatter";
import * as dateCompare from "./dateCompare";
import * as date from "./date";

    var name = "pastDate";

  

    var validateView = function (value, params) {

       var result = dateCompare.rule.validateView(value, { 'dateCompare': { compare: "<=" } });

        result.message = "La date doit être inférieure ou égale à la date du jour.";

        return result;
    };

    var validateModel = function (value, params) {

        return dateCompare.rule.validateModel(value, { 'dateCompare': { compare: "<=" } });
    };

    var rule = {
        name: name,
        priority: 600,
        validateView: validateView,
        validateModel: validateModel,
        parser: date.rule.parser,
        formatter: date.rule.formatter
    };

export {rule};
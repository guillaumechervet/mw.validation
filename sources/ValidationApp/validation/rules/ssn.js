"use strict";
var rules = require("../rules");
var util_1 = require("../util");
var defaultMessage = 'Veuillez saisir un n° de sécurité sociale valide.';
var name = "ssn";
function extract(value) {
    value = value ? value.toUpperCase() : value;
    var regexp = /^([1-3])([0-9]{2})([0-9]{2})([0-9]{2}|2A|2B)([0-9]{3})([0-9]{3})([0-9]{2})$/g;
    var result = regexp.exec(value);
    if (result) {
        return {
            gender: result[1],
            birthYear: result[2],
            birthMonth: result[3],
            department: result[4],
            district: result[5],
            increment: result[6],
            key: result[7],
            value: function () {
                var dpt = this.department;
                if (this.department == '2A') {
                    dpt = '19';
                }
                else if (this.department == '2B') {
                    dpt = '18';
                }
                return this.gender + this.birthYear + this.birthMonth + dpt + this.district + this.increment;
            }
        };
    }
    return null;
}
;
var validate = function (value, params) {
    var sucess = true;
    if (util_1.util.isEmptyVal(value)) {
        sucess = true;
    }
    else {
        var ssn = extract(value);
        if (!ssn) {
            sucess = false;
        }
        else {
            var modResult = ssn.value() % 97;
            sucess = (97 - modResult).toString() == ssn.key;
        }
    }
    return {
        success: sucess,
        message: defaultMessage
    };
};
var rule = {
    name: name,
    validateView: validate,
    validateModel: validate
};
rules.add(rule);
//# sourceMappingURL=ssn.js.map
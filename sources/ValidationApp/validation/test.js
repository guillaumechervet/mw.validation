"use strict";
var RulesImpl = (function () {
    function RulesImpl() {
    }
    RulesImpl.prototype.getRules = function () {
        return this._rules;
    };
    return RulesImpl;
}());
var Rules = new RulesImpl().getRules();
exports.Rules = Rules;
//# sourceMappingURL=test.js.map
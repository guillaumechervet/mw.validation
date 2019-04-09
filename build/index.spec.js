"use strict";
exports.__esModule = true;
var chai_1 = require("chai");
require("mocha");
var index_1 = require("./index");
describe('index', function () {
    it('color', function () {
        var rules = {
            input: ['color']
        };
        //#abc and #abcdef   but not #abcd
        var result = index_1.validation.validateView('#abc', rules.input);
        chai_1.expect(result[0].success).to.equal(true);
        result = index_1.validation.validateView('#abcdef', rules.input);
        chai_1.expect(result[0].success).to.equal(true);
        result = index_1.validation.validateView('#abcd', rules.input);
        chai_1.expect(result[0].success).to.equal(false);
        result = index_1.validation.validateView('abcdef', rules.input);
        chai_1.expect(result[0].success).to.equal(false);
    });
    it('require', function () {
        (function () {
            var rules = {
                input: [
                    {
                        required: {
                            message: 'New error message'
                        }
                    }
                ]
            };
            var result = index_1.validation.validateView('toto', rules.input);
            console.log('Assert : ', result[0].success);
        })();
    });
    /*describe('required', function() {
      it('should be false because empty', function() {
        var rules = { input: ['required'] };
  
        var result = validation.validateView('toto', rules.input);
        console.log('result  :' + result.success, validation.validateView);
        expect(result.success).to.equal(true);
      });
    });*/
});
//# sourceMappingURL=index.spec.js.map
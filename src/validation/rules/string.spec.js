"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var string_1 = require("./string");
var chai_1 = require("chai");
require("mocha");
// if you used the '@types/mocha' method to install mocha type definitions, uncomment the following line
// import 'mocha';
describe('rules;string', function () {
    it('validateView good string format', function () {
        var result = string_1.rule.validateView('guillaume.chervet@toto.fr', null);
        chai_1.expect(result.success).to.equal(true);
    });
    it('validateView bad string format', function () {
        var result = string_1.rule.validateView(122, null);
        chai_1.expect(result.success).to.equal(false);
    });
});

'use strict'

var myApi = require('./validationtest.js');

var assert = require('assert');

describe('Validation', function () {
    
    describe('required', function () {
        it('should be false because empty', function () {
             var rules = {input: ['required']};
             
             var result = myApi.validation.validateView("toto", rules.input);
             console.log("result  :" + result.success,  myApi.validation.validateView);
             assert.equal(result.success,false);
        });
    });
       
});
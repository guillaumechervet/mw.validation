'use strict'

var requireHelper = require('validationtest');

var assert = require('assert');

describe('Validation', function () {
    
    describe('#getAll()', function () {
        it('should list 4 people', function (done) {
            personCtrl.getAll().then(function (persons) {
                assert.equal(persons.length, 4);
                done();
            }).catch(function(error){
                done(error);
            });
        });
    });
       
});
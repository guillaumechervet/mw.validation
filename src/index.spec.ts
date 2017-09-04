import { expect } from 'chai';
import 'mocha';
import { validation } from './index';

describe('index', () => {
  it('color', () => {
    var rules = {
      input: ['color']
    };

    //#abc and #abcdef   but not #abcd

    var result = validation.validateView("#abc", rules.input);
    console.log(result);
    //expect(result[0].success).to.equal(true);
    result = validation.validateView("#abcdef", rules.input);
    console.log(result);
    expect(result[0].success).to.equal(true);
    result = validation.validateView("#abcd", rules.input);
    expect(result[0].success).to.equal(true);
    result = validation.validateView("abcdef", rules.input);
    expect(result[0].success).to.equal(false);

  });
  it('require', () => {

    (function () {
      var rules = {
        input: [{
          'required': {
            message: 'New error message'
          }
        }]
      };

      var result = validation.validateView("toto", rules.input);
      console.log("Assert : ", result[0].success);
    })();

  });
});

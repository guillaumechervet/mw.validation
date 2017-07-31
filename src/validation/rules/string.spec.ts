import { rule } from './string';
import { expect } from 'chai';
import 'mocha';
// if you used the '@types/mocha' method to install mocha type definitions, uncomment the following line
// import 'mocha';

describe('rules;string', () => {
  it('validateView good string format', () => {
    const result = rule.validateView('guillaume.chervet@toto.fr', null);
    expect(result.success).to.equal(true);
  });
   it('validateView bad string format', () => {
    const result = rule.validateView(122, null);
    expect(result.success).to.equal(false);
  });
});

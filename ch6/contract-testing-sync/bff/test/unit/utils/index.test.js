import 'mocha';
import { expect } from 'chai';
import { uuidv4 } from '../../../src/utils';

describe('utils/index.js', () => {
  it('should create a uuid', () => {
    expect(uuidv4()).to.not.equal(null);
  });
});

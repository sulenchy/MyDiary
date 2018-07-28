import chai from 'chai';
import dummyData from '../models/dummyData';

const { assert } = chai;


describe('Dummy database structure', () => {
  describe('Dummy Data should be object', () => {
    it('should be an object', () => {
      assert.isObject(dummyData, 'dummyData is an object');
      assert.property(dummyData, 'users');
      assert.property(dummyData, 'entries');
      assert.property(dummyData, 'toString');
    });
    it('should have keys: users, entries', () => {
      assert.hasAllKeys(dummyData, ['users', 'entries']);
    });
  });
});

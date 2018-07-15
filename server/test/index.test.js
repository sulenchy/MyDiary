import chai from 'chai';
import dummyData from '../models/dummyData';

const expect = chai.expect;


describe('Dummy database structure', () => {
  describe('Dummy Data should be object', () => {
    it('should be object', () => {
      expect(dummyData).to.be.a('object');
    });
  });
});

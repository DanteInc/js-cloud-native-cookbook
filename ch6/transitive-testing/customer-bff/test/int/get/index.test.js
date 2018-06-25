import 'mocha';
import { expect } from 'chai';

const supertest = require('supertest');

const endpoint = process.env.ENDPOINT ? process.env.ENDPOINT : 'http://localhost:3001';
const client = supertest(endpoint);

const THING = {
  id: '00000000-0000-0000-0000-000000000000',
  name: 'thing0',
};

describe('get/index.js', () => {
  it('should get', () => client.get('/things/00000000-0000-0000-0000-000000000000')
    // .set('Authorization', JWT)
    .expect(200)
    .expect((res) => {
      // console.log('RES: %s', JSON.stringify(res, null, 2));
      expect(JSON.parse(res.text)).to.deep.equal(THING);
    }));
});

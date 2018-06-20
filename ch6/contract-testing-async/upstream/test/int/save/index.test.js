import 'mocha';
import { expect } from 'chai';

const supertest = require('supertest');

const endpoint = process.env.ENDPOINT ? process.env.ENDPOINT : 'http://localhost:3001';
const client = supertest(endpoint);

const THING = { name: 'thing0' };

describe('save/index.js', () => {
  it('should save', () => client.post('/things')
    .send(THING)
    // .set('Authorization', JWT)
    .expect(201)
    .expect((res) => {
      // console.log('RES: %s', JSON.stringify(res, null, 2));
      expect(res.header.location).to.equal('https://localhost:3001/stg/things/00000000-0000-0000-0000-000000000000');
    }));
});

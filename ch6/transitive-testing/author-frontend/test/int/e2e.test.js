require('mocha');
const expect = require('chai').expect;
const supertest = require('supertest');

const endpoint = process.env.ENDPOINT ? process.env.ENDPOINT : 'http://0.0.0.0:3001';
const client = supertest(endpoint);

require('replay'); // start vcr

describe('e2e/author-frontend', () => {
  it('should save', () => client.post('/things')
    .send({ name: 'thing0' })
    .expect(201)
    .expect((res) => {
      // console.log('RES: %s', JSON.stringify(res, null, 2));
      expect(res.header.location).to.equal('https://0.0.0.0:3001/stg/things/00000000-0000-0000-0000-000000000000');
    }));


  it('should get', () => client.get('/things/00000000-0000-0000-0000-000000000000')
    .expect(200)
    .expect((res) => {
      // console.log('RES: %s', JSON.stringify(res, null, 2));
      expect(JSON.parse(res.text)).to.deep.equal({
        id: '00000000-0000-0000-0000-000000000000',
        name: 'thing0',
      });
    }));
});

import 'mocha';

const supertest = require('supertest');
const relay = require('baton-request-relay');

const endpoint = process.env.ENDPOINT ? process.env.ENDPOINT : 'http://localhost:3001';
const client = supertest(endpoint);

describe('contract/frontend', () => {
  it('should relay the frontend save request', () => run('./fixtures/frontend/save'));
  it('should relay the frontend get request', () => run('./fixtures/frontend/get'));
});

const run = (fixture) => {
  const rec = relay(fixture);

  return client[rec.request.method](rec.request.path)
    .set(rec.request.headers)
    .send(rec.request.body)

    .expect(rec.response.statusCode)
    .expect(rec.response.body);
  // .expect((res) => {
  //   console.log('%s', JSON.stringify(res, null, 2));
  // });
};

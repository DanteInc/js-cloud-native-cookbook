import 'mocha';
import { expect } from 'chai';
import * as sinon from 'sinon';
import Promise from 'bluebird';

import { handle, Handler } from '../../../src/save';
import Connector from '../../../src/connector/db';
import * as utils from '../../../src/utils';

describe('save/index.js', () => {
  afterEach(() => {
    sinon.restore();
  });

  it('should save', () => {
    const TABLE_NAME = 't1';
    const ID = '00000000-0000-0000-0000-000000000000';
    const THING = { name: 'thing0' };
    const REQUEST = {
      headers: {
        Host: 'localhost',
      },
      requestContext: {
        stage: 'test',
      },
      body: JSON.stringify(THING),
    };
    const LOCATION = `https://${REQUEST.headers.Host}/${REQUEST.requestContext.stage}/things/${ID}`;

    sinon.stub(utils, 'uuidv4').returns(ID);
    const stub = sinon.stub(Connector.prototype, 'save')
      .returns(Promise.resolve());

    return new Handler(TABLE_NAME).handle(REQUEST)
      .tap((data) => {
        expect(stub.calledWith(ID, THING)).to.equal(true);
        expect(data).to.equal(LOCATION);
      });
  });

  it('should return 201', (done) => {
    const stub = sinon.stub(Handler.prototype, 'handle')
      .returns(Promise.resolve('https://my/location'));

    handle({}, {}, (err, result) => {
      expect(stub.calledWith({})).to.equal(true);
      expect(err).to.equal(null);
      expect(result).to.deep.equal({
        statusCode: 201,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Cache-Control': 'no-cache',
          'Location': 'https://my/location',
        },
      });
      done();
    });
  });

  it('should return 500', (done) => {
    const stub = sinon.stub(Handler.prototype, 'handle')
      .returns(Promise.reject(new Error('test error')));

    handle({}, {}, (err, result) => {
      expect(stub.calledOnce).to.equal(true);
      expect(err).to.equal(null);
      expect(result).to.deep.equal({
        statusCode: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Cache-Control': 'no-cache',
        },
      });
      done();
    });
  });
});

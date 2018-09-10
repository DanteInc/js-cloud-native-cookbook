import 'mocha';
import { expect } from 'chai';
import * as sinon from 'sinon';

import { handle, Handler } from '../../../src/get';
import Connector from '../../../src/connector/db';

describe('get/index.js', () => {
  afterEach(() => {
    sinon.restore();
  });

  it('should get by id', async () => {
    const TABLE_NAME = 't1';
    const ID = '00000000-0000-0000-0000-000000000000';
    const THING = { id: ID, name: 'thing0' };
    const REQUEST = {
      pathParameters: {
        id: ID,
      },
    };

    const stub = sinon.stub(Connector.prototype, 'getById')
      .returns(Promise.resolve(THING));

    const data = await new Handler(TABLE_NAME).handle(REQUEST);

    expect(stub).to.have.been.calledWith(ID);
    expect(data).to.deep.equal(THING);
  });

  it('should return 200', (done) => {
    const stub = sinon.stub(Handler.prototype, 'handle')
      .returns(Promise.resolve({}));

    handle({}, {}, (err, result) => {
      expect(stub).to.have.been.calledWith({});
      expect(err).to.equal(null);
      expect(result).to.deep.equal({
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Cache-Control': 'max-age=3',
        },
        body: JSON.stringify({}),
      });
      done();
    });
  });

  it('should return 404', (done) => {
    const stub = sinon.stub(Handler.prototype, 'handle')
      .returns(Promise.resolve());

    handle({}, {}, (err, result) => {
      expect(stub).to.have.been.calledWith({});
      expect(err).to.equal(null);
      expect(result).to.deep.equal({
        statusCode: 404,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Cache-Control': 'max-age=3',
        },
      });
      done();
    });
  });

  it('should return 500', (done) => {
    const stub = sinon.stub(Handler.prototype, 'handle')
      .returns(Promise.reject(new Error('test error')));

    handle({}, {}, (err, result) => {
      expect(stub).to.have.been.calledOnce;
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

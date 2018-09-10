import 'mocha';
import { expect } from 'chai';
import * as sinon from 'sinon';

import Connector from '../../../src/connector/db';

const AWS = require('aws-sdk-mock');

AWS.Promise = Promise;

describe('connector/db/index.js', () => {
  afterEach(() => {
    AWS.restore('DynamoDB.DocumentClient');
  });

  it('should save', async () => {
    const spy = sinon.spy((params, cb) => cb(null, {}));
    AWS.mock('DynamoDB.DocumentClient', 'put', spy);

    const data = await new Connector('t1')
      .save('00000000-0000-0000-0000-000000000000', { name: 'thing0' });

    expect(spy).to.have.been.calledOnce;
    expect(spy).to.have.been.calledWith({
      TableName: 't1',
      Item: {
        id: '00000000-0000-0000-0000-000000000000',
        name: 'thing0',
      },
    });
    expect(data).to.deep.equal({});
  });

  it('should get by id', async () => {
    const spy = sinon.spy((params, cb) => cb(null, {
      Item: {
        id: '00000000-0000-0000-0000-000000000000',
        name: 'thing0',
      },
    }));

    AWS.mock('DynamoDB.DocumentClient', 'get', spy);

    const data = await new Connector('t1')
      .getById('00000000-0000-0000-0000-000000000000');

    expect(spy).to.have.been.calledOnce;
    expect(spy).to.have.been.calledWith({
      TableName: 't1',
      Key: {
        id: '00000000-0000-0000-0000-000000000000',
      },
    });
    expect(data).to.deep.equal({
      id: '00000000-0000-0000-0000-000000000000',
      name: 'thing0',
    });
  });
});

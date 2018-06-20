import 'mocha';
import { expect } from 'chai';
import * as sinon from 'sinon';
import Promise from 'bluebird';

import Connector from '../../../src/connector/db';

const AWS = require('aws-sdk-mock');

AWS.Promise = Promise;

describe('connector/db/index.js', () => {
  afterEach(() => {
    AWS.restore('DynamoDB.DocumentClient');
  });

  it('should save', () => {
    const spy = sinon.spy((params, cb) => cb(null, {}));
    AWS.mock('DynamoDB.DocumentClient', 'put', spy);

    return new Connector('t1').save('00000000-0000-0000-0000-000000000000', { name: 'thing0' })
      .tap((data) => {
        expect(spy.calledOnce).to.equal(true);
        expect(spy.calledWith({
          TableName: 't1',
          Item: {
            id: '00000000-0000-0000-0000-000000000000',
            name: 'thing0',
          },
        })).to.equal(true);
        expect(data).to.deep.equal({});
      });
  });

  it('should get by id', () => {
    const spy = sinon.spy((params, cb) => cb(null, {
      Item: {
        id: '00000000-0000-0000-0000-000000000000',
        name: 'thing0',
      },
    }));

    AWS.mock('DynamoDB.DocumentClient', 'get', spy);

    return new Connector('t1').getById('00000000-0000-0000-0000-000000000000')
      .tap((data) => {
        expect(spy.calledOnce).to.equal(true);
        expect(spy.calledWith({
          TableName: 't1',
          Key: {
            id: '00000000-0000-0000-0000-000000000000',
          },
        })).to.equal(true);
        expect(data).to.deep.equal({
          id: '00000000-0000-0000-0000-000000000000',
          name: 'thing0',
        });
      });
  });
});

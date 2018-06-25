import 'mocha';
import { expect } from 'chai';
import * as sinon from 'sinon';
import Promise from 'bluebird';

import Connector from '../../../src/connector/stream';

const AWS = require('aws-sdk-mock');

AWS.Promise = Promise;

describe('connector/stream/index.js', () => {
  afterEach(() => {
    AWS.restore('Kinesis');
  });

  it('should publish', async () => {
    const spy = sinon.spy((params, cb) => cb(null, {}));
    AWS.mock('Kinesis', 'putRecord', spy);

    const EVENT = {
      type: 't1',
      partitionKey: '1',
    };

    const data = await new Connector('s1').publish(EVENT);

    expect(spy.calledOnce).to.equal(true);
    expect(spy.calledWith({
      StreamName: 's1',
      PartitionKey: EVENT.partitionKey,
      Data: Buffer.from(JSON.stringify(EVENT)),
    })).to.equal(true);
    expect(data).to.deep.equal({});
  });
});

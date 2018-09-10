import 'mocha';
import { expect } from 'chai';
import * as sinon from 'sinon';
import Promise from 'bluebird';

import { handle, Handler } from '../../../src/trigger';
import Connector from '../../../src/connector/stream';

const _ = require('highland');

describe('trigger/index.js', () => {
  afterEach(() => {
    sinon.restore();
  });

  it('should trigger', (done) => {
    const STREAM_NAME = 's1';

    const stub = sinon.stub(Connector.prototype, 'publish')
      .returns(Promise.resolve({}));

    new Handler(STREAM_NAME).handle(TRIGGER)
      .collect()
      .tap((data) => {
        expect(stub).to.have.been.calledWith(EVENT);
        expect(data).to.deep.equal([{
          response: {},
          event: EVENT,
        }]);
      })
      .done(done);
  });

  it('should callback with result', (done) => {
    const stub = sinon.stub(Handler.prototype, 'handle')
      .returns(_([{}]));

    handle({}, {}, (err, result) => {
      expect(stub).to.have.been.calledWith({});
      expect(err).to.equal(null);
      expect(result).to.deep.equal([{}]);
      done();
    });
  });

  it('should callback with err', (done) => {
    const stub = sinon.stub(Handler.prototype, 'handle')
      .returns(_([{}])
        .map(() => { throw new Error(); }));

    handle({}, {}, (err, result) => {
      expect(stub).to.have.been.calledOnce;
      expect(err).to.not.equal(null);
      expect(result).to.equal(undefined);
      done();
    });
  });
});

const TRIGGER = {
  Records: [
    {
      eventID: '5a03abd8ca5e48ab3b0b9596e9b98b50',
      eventName: 'INSERT',
      eventVersion: '1.1',
      eventSource: 'aws:dynamodb',
      awsRegion: 'us-east-1',
      dynamodb: {
        ApproximateCreationDateTime: 1529179380,
        Keys: {
          id: {
            S: '00000000-0000-0000-0000-000000000000',
          },
        },
        NewImage: {
          name: {
            S: 'thing0',
          },
          id: {
            S: '00000000-0000-0000-0000-000000000000',
          },
        },
        SequenceNumber: '100000000030260233023',
        SizeBytes: 86,
        StreamViewType: 'NEW_AND_OLD_IMAGES',
      },
      eventSourceARN: 'arn:aws:dynamodb:us-east-1:123456789012:table/stg-cncb-unit-testing-things/stream/2018-06-16T19:55:14.324',
    }],
};

const EVENT = {
  id: '5a03abd8ca5e48ab3b0b9596e9b98b50',
  type: 'thing-created',
  timestamp: 1529179380000,
  partitionKey: '00000000-0000-0000-0000-000000000000',
  tags: {
    region: 'us-east-1',
  },
  thing: {
    new: {
      name: 'thing0',
      id: '00000000-0000-0000-0000-000000000000',
    },
    old: {},
  },
};

import 'mocha';
import { expect } from 'chai';
import * as aws from 'aws-sdk';

import { Handler } from '../../../src/trigger';

describe('trigger/index.js', () => {
  before(() => {
    require('baton-vcr-replay-for-aws-sdk');
    process.env.STREAM_NAME = 'stg-cncb-event-stream-s1';
    aws.config.update({ region: 'us-east-1' });
  });

  it('should trigger', (done) => {
    new Handler(process.env.STREAM_NAME).handle(TRIGGER)
      .collect()
      .tap((data) => {
        expect(data[0].event).to.deep.equal(EVENT);
      })
      .done(done);
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

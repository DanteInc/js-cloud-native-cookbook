import 'mocha';
import { expect } from 'chai';
import * as aws from 'aws-sdk';

import { Handler } from '../../../src/listener';

require('baton-vcr-replay-for-aws-sdk');

describe.only('listener/index.js', () => {
  before(() => {
    process.env.TABLE_NAME = 'stg-cncb-contract-testing-async-downstream-things';
    aws.config.update({ region: 'us-east-1' });
  });

  it('should trigger', (done) => {
    new Handler(process.env.TABLE_NAME).handle(EVENTS)
      .collect()
      .tap((data) => {
        expect(data).to.deep.equal([THING]);
      })
      .done(done);
  });
});


const THING = {
  id: '00000000-0000-0000-0000-000000000000',
  name: 'thing0',
  asOf: 1529179380000,
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
      id: '00000000-0000-0000-0000-000000000000',
      name: 'thing0',
    },
    old: {},
  },
};

const EVENTS = {
  Records: [
    {
      kinesis: {
        sequenceNumber: 1,
        data: Buffer.from(JSON.stringify(EVENT)).toString('base64'),
      },
    },
  ],
};

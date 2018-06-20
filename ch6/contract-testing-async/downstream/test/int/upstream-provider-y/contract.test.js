import 'mocha';
import * as aws from 'aws-sdk';

import { handle } from '../../../src/listener';

const relay = require('baton-event-relay');

describe.only('contract/upstream-provider-y', () => {
  before(() => {
    process.env.TABLE_NAME = 'stg-cncb-contract-testing-async-downstream-things';
    aws.config.update({ region: 'us-east-1' });
    const replay = require('baton-vcr-replay-for-aws-sdk');
    replay.fixtures = './fixtures/upstream-provider-y';
  });

  it('should process the thing-created event', (done) => {
    const rec = relay('./fixtures/upstream-provider-y/thing-created');
    handle(rec.event, {}, done);
  });
});

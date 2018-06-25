import 'mocha';
import * as aws from 'aws-sdk';

import { handle } from '../../../src/listener';

const relay = require('baton-event-relay');
require('baton-vcr-replay-for-aws-sdk');

describe('e2e/upstream-author-bff', () => {
  before(() => {
    process.env.TABLE_NAME = 'stg-cncb-transitive-testing-customer-bff-things';
    aws.config.update({ region: 'us-east-1' });
  });

  it('should process the thing0-created event', (done) => {
    const rec = relay('./fixtures/upstream-author-bff/thing0-created');
    handle(rec.event, {}, done);
  });
});

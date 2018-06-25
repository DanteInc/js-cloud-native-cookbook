import 'mocha';
import * as sinon from 'sinon';
import * as aws from 'aws-sdk';

import * as utils from '../../../src/utils';
import { handle } from '../../../src/trigger';

require('baton-vcr-replay-for-aws-sdk');

const EVENT = require('../../../fixtures/downstream-customer-bff/thing0-INSERT.json');

describe('e2e/downstream-customer-bff', () => {
  before(() => {
    process.env.STREAM_NAME = 'stg-cncb-event-stream-s1';
    aws.config.update({ region: 'us-east-1' });
  });

  afterEach(() => {
    sinon.restore();
  });

  it('should publish thing-created', (done) => {
    sinon.stub(utils, 'uuidv4').returns('00000000-0000-0000-0000-000000000001');
    handle(EVENT, {}, done);
  });
});


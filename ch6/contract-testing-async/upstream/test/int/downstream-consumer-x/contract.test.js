import 'mocha';
import * as sinon from 'sinon';
import * as aws from 'aws-sdk';

import * as utils from '../../../src/utils';
import { handle } from '../../../src/trigger';

const EVENT = require('../../../fixtures/downstream-consumer-x/thing-created.json');

require('baton-vcr-replay-for-aws-sdk');

describe('contract/downstream-consumer-x', () => {
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


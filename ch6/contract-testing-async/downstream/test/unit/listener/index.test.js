import 'mocha';
import { expect } from 'chai';
import * as sinon from 'sinon';

import { handle, Handler } from '../../../src/listener';
import Connector from '../../../src/connector/db';

const _ = require('highland');

describe('listener/index.js', () => {
  afterEach(() => {
    sinon.restore();
  });

  it('should consume', (done) => {
    const TABLE_NAME = 't1';

    const stub = sinon.stub(Connector.prototype, 'save')
      .returns(Promise.resolve({}));

    new Handler(TABLE_NAME).handle(EVENTS)
      .collect()
      .tap((data) => {
        expect(stub).to.have.been.calledWith(THING);
        expect(data).to.deep.equal([THING]);
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

const aws = require('aws-sdk');
const _ = require('highland');
const uuid = require('uuid');

module.exports.listener = (event, context, cb) => {
  console.log('event: %j', event);

  _(event.Records)
    .map(recordToUow)
    .tap(print)
    .filter(forThingCreated)
    .tap(simulatedFault)
    .errors(errors)
    .collect()
    .toCallback(cb);
};

const recordToUow = r => ({
  record: r,
  event: JSON.parse(Buffer.from(r.kinesis.data, 'base64'))
});

const forThingCreated = uow => uow.event.type === 'thing-created';

const simulatedFault = (uow) => {
  if (Math.floor((Math.random() * 3) + 1) === 3) {
    const fault = new Error('Simulated Fault');
    // handled
    fault.uow = uow;
    throw fault;
  }
};

const errors = (err, push) => {
  if (err.uow) {
    // handled exceptions are adorned with the uow in error
    push(null, publish({
      type: 'fault',
      timestamp: Date.now(),
      tags: {
        functionName: process.env.AWS_LAMBDA_FUNCTION_NAME,
      },
      err: {
        name: err.name,
        message: err.message,
        stack: err.stack,
      },
      uow: err.uow,
    }));
  } else {
    // rethrow unhandled errors to stop processing
    push(err);
  }
};

const publish = event => {
  const params = {
    StreamName: process.env.STREAM_NAME,
    PartitionKey: uuid.v4(),
    Data: Buffer.from(JSON.stringify(event)),
  };

  const kinesis = new aws.Kinesis({ 
    httpOptions: { timeout: 1000 },
    logger: console,
  });

  return _(kinesis.putRecord(params).promise());
};

const print = uow => console.log('uow: %j', uow);

module.exports.simulate = (request, context, callback) => {
  const event = {
    id: uuid.v1(),
    type: 'thing-created',
    timestamp: Date.now(),
    thing: {
      id: uuid.v4(),
    }
  };

  const params = {
    StreamName: process.env.STREAM_NAME,
    Records: [
      {
        PartitionKey: event.thing.id,
        Data: Buffer.from(JSON.stringify(event)),
      },
    ]
  };

  const kinesis = new aws.Kinesis({ 
    httpOptions: { timeout: 1000 },
    logger: console,
  });

  kinesis.putRecords(params, callback);
};

const aws = require('aws-sdk');
const _ = require('highland');
const uuid = require('uuid');

module.exports.listener = (event, context, cb) => {
  console.log('event: %j', event);

  _(event.Records)
    .map(recordToUow)
    .tap(print)
    .filter(forThingCreated)
    .tap(validate)
    .tap(randomError)
    .flatMap(save)
    .errors(errors)
    .collect()
    .toCallback(cb);
};

const recordToUow = r => ({
  record: r,
  event: JSON.parse(Buffer.from(r.kinesis.data, 'base64'))
});

const forThingCreated = uow => uow.event.type === 'thing-created';

const validate = uow => {
  if (uow.event.thing.name === undefined) {
    const err = new Error('Validation Error: name is required');
    err.uow = uow;
    throw err;
  }
};

const randomError = () => {
  if (Math.floor((Math.random() * 5) + 1) === 3) {
    // unhandled
    throw new Error('Random Error');
  }
};

const save = uow => {
  uow.params = {
    TableName: process.env.TABLE_NAME,
    Item: uow.event.thing,
  };

  const db = new aws.DynamoDB.DocumentClient({ 
    httpOptions: { timeout: 1000 },
    logger: console,
  });

  return _(db.put(uow.params).promise()
    .catch(err => {
      err.uow = uow;
      throw err;
    }));
};

const errors = (err, push) => {
  if (err.uow) {
    console.log('handled err: ', err);
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
    console.log('unhandled err: ', err);
    // rethrow unhandled errors to stop processing
    push(err);
  }
};

const publish = fault => {
  console.log('publishing fault: %j', fault);

  const params = {
    StreamName: process.env.STREAM_NAME,
    PartitionKey: uuid.v4(),
    Data: Buffer.from(JSON.stringify(fault)),
  };

  const kinesis = new aws.Kinesis({ 
    httpOptions: { timeout: 1000 },
    logger: console,
  });

  return _(kinesis.putRecord(params).promise());
};

const print = uow => console.log('uow: %j', uow);

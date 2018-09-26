const aws = require('aws-sdk');
const _ = require('highland');
const uuid = require('uuid');

module.exports.submit = (request, context, callback) => {
  console.log('request: %j', request);

  const thing = {
    id: uuid.v4(),
    ...request
  };

  const params = {
    QueueUrl: process.env.QUEUE_URL,
    MessageBody: JSON.stringify(thing),
  };

  console.log('params: %j', params);

  const sqs = new aws.SQS();
  sqs.sendMessage(params, callback);
};

module.exports.trigger = (event, context, cb) => {
  console.log('event: %j', event);

  _(event.Records)
    .map(recordToUow)
    .map(toEvent)
    .flatMap(publish)
    .tap(print('uow'))
    .collect()
    .toCallback(cb);
};

const recordToUow = record => ({
  record,
  thing: JSON.parse(record.body),
});

const toEvent = uow => ({
  ...uow,
  event: {
    id: uow.record.messageId,
    type: 'thing-submitted',
    timestamp: uow.record.attributes.SentTimestamp,
    partitionKey: uow.thing.id,
    tags: {
      region: uow.record.awsRegion,
    },
    thing: uow.thing,
    raw: uow.record,
  }
});

const publish = uow => {
  const params = {
    StreamName: process.env.STREAM_NAME,
    PartitionKey: uow.event.partitionKey,
    Data: Buffer.from(JSON.stringify(uow.event)),
  };

  console.log('params: %j', params);

  const kinesis = new aws.Kinesis();
  return _(kinesis.putRecord(params).promise()
    .then(output => ({
      ...uow,
      params,
      output,
    })));
}

const print = msg => v => console.log(`${msg}: %j`, v);

const aws = require('aws-sdk');
const _ = require('highland');

module.exports.listener = (event, context, cb) => {
  console.log('event: %j', event);

  _(event.Records)
    .map(recordToUow)
    // .tap(print)
    .filter(forThingSaved)
    .flatMap(saveEvent)
    // .tap(print)
    .collect().toCallback(cb);
};

const recordToUow = r => ({
  record: r,
  event: JSON.parse(Buffer.from(r.kinesis.data, 'base64'))
});

const forThingSaved = uow => uow.event.type === 'thing-created' || uow.event.type === 'thing-updated';

const saveEvent = uow => {
  const params = {
    TableName: process.env.EVENTS_TABLE_NAME,
    Item: {
      id: uow.event.thing.id,
      sequence: uow.event.id,
      event: uow.event,
    }
  };

  const db = new aws.DynamoDB.DocumentClient({
    httpOptions: { timeout: 1000 },
    logger: console,
  });

  return _(db.put(params).promise()
    .then(() => uow)
  );
}

module.exports.trigger = (event, context, cb) => {
  console.log('event: %j', event);

  _(event.Records)
    .tap(r => console.log('record: %j', r))
    .collect().toCallback(cb);
};

const print = uow => console.log('uow: %j', uow);

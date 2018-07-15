const aws = require('aws-sdk');
const _ = require('highland');

module.exports.listener = (event, context, cb) => {
  console.log('event: %j', event);

  _(event.Records)
    .map(recordToUow)
    // .tap(print)
    .filter(forThingSaved)
    .flatMap(save)
    // .tap(print)
    .collect().toCallback(cb);
};

const recordToUow = r => ({
  record: r,
  event: JSON.parse(Buffer.from(r.kinesis.data, 'base64'))
});

const forThingSaved = uow => uow.event.type === 'thing-created' || uow.event.type === 'thing-updated';

const save = uow => {
  const params = {
    TableName: process.env.TABLE_NAME,
    Item: {
      ...uow.event.thing,
      oplock: uow.event.timestamp,
    },
    // attribute_not_exists accounts for inserts
    ConditionExpression: 'attribute_not_exists(#oplock) OR #oplock < :timestamp',
    ExpressionAttributeNames: {
      '#oplock': 'oplock'
    },
    ExpressionAttributeValues: {
      ':timestamp': uow.event.timestamp
    },
  };

  const db = new aws.DynamoDB.DocumentClient({
    httpOptions: { timeout: 1000 },
    logger: console,
  });

  return _(db.put(params).promise()
    .catch(handleConditionalCheckFailedException)
    .then(() => uow)
  );
}

const handleConditionalCheckFailedException = (err) => {
  console.log(err);
  if (err.code !== 'ConditionalCheckFailedException') {
    err.uow = uow;
    throw err;
  }
};

const print = uow => console.log('uow: %j', uow);

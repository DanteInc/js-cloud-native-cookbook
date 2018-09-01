const aws = require('aws-sdk');
const _ = require('highland');
const uuid = require('uuid');

module.exports.listener = (event, context, cb) => {
  // console.log('event: %j', event);

  _(event.Records)
    .map(recordToEvent)
    .filter(byType)
    // .tap(print)
    .flatMap(put)
    .collect()
    .toCallback(cb);
};

const recordToEvent = r => JSON.parse(Buffer.from(r.kinesis.data, 'base64'));

const byType = event => event.type.match(/thing-.+/);

const put = event => {
  const params = {
    TableName: process.env.TABLE_NAME,
    Item: {
      partitionKey: event.partitionKey,
      eventId: event.id,
      event: event,
    }
  };

  console.log('params: %j', params);

  const db = new aws.DynamoDB.DocumentClient();
  return _(db.put(params).promise());
};

module.exports.trigger = (event, context, cb) => {
  console.log('event: %j', event);

  _(event.Records)
    .flatMap(getMicroEventStore)
    .tap(events => console.log('events: %j', events))
    .collect().toCallback(cb);
};

const getMicroEventStore = (record) => {
  const params = {
    TableName: process.env.TABLE_NAME,
    KeyConditionExpression: '#partitionKey = :partitionKey',
    ExpressionAttributeNames: {
      '#partitionKey': 'partitionKey'
    },
    ExpressionAttributeValues: {
      ':partitionKey': record.dynamodb.Keys.partitionKey.S
    }
  };

  console.log('params: %j', params);

  const db = new aws.DynamoDB.DocumentClient();

  return _(db.query(params).promise());
}

const print = v => console.log('%j', v);

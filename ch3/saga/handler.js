const aws = require('aws-sdk');
const _ = require('highland');
const uuid = require('uuid');

module.exports.submit = (request, context, callback) => {
  console.log('request: %j', request);

  const order = {
    id: uuid.v4(),
    status: 'submitted',
    ...request,
  };

  const params = {
    TableName: process.env.TABLE_NAME,
    Item: order,
  };

  console.log('params: %j', params);

  const db = new aws.DynamoDB.DocumentClient();
  db.put(params, callback);
};

module.exports.trigger = (event, context, cb) => {
  console.log('event: %j', event);

  _(event.Records)
    .map(toEvent)
    .tap(print)
    .flatMap(publish)
    .tap(print)
    .collect()
    .toCallback(cb);
};

const toEvent = record => ({
  id: record.eventID,
  type: `order-submitted`,
  timestamp: record.dynamodb.ApproximateCreationDateTime * 1000,
  partitionKey: record.dynamodb.Keys.id.S,
  tags: {
    region: record.awsRegion,
  },
  order: aws.DynamoDB.Converter.unmarshall(record.dynamodb.NewImage),
});

const publish = event => {
  const params = {
    StreamName: process.env.STREAM_NAME,
    PartitionKey: event.partitionKey,
    Data: Buffer.from(JSON.stringify(event)),
  };

  console.log('params: %j', params);

  const kinesis = new aws.Kinesis();
  return _(kinesis.putRecord(params).promise());
}

module.exports.listener = (event, context, cb) => {
  console.log('event: %j', event);

  _(event.Records)
    .map(recordToEvent)
    // .tap(print)
    .filter(forReservationViolation)
    .flatMap(compensate)
    .tap(print)
    .collect()
    .toCallback(cb);
};

const recordToEvent = r => JSON.parse(Buffer.from(r.kinesis.data, 'base64'));

const forReservationViolation = e => e.type === 'reservation-violation';

const compensate = event => {
  const params = {
    TableName: process.env.TABLE_NAME,
    Key: {
      id: event.context.order.id
    },
    AttributeUpdates: {
      status: { Action: 'PUT', Value: 'cancelled' }
    },
  };

  console.log('params: %j', params);

  const db = new aws.DynamoDB.DocumentClient();
  return _(db.update(params).promise());
};

module.exports.query = (id, context, callback) => {
  const params = {
    TableName: process.env.TABLE_NAME,
    Key: {
      id: id,
    },
  };

  console.log('params: %j', params);

  const db = new aws.DynamoDB.DocumentClient();
  db.get(params, callback);
};

const print = v => console.log('%j', v);

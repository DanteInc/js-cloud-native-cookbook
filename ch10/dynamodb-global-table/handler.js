const aws = require('aws-sdk');
const _ = require('highland');
const uuid = require('uuid');

module.exports.command = (request, context, callback) => {
  console.log('request: %j', request);

  const thing = {
    id: uuid.v4(),
    latch: 'open',
    ...request,
  };

  const params = {
    TableName: process.env.TABLE_NAME,
    Item: thing,
  };

  console.log('params: %j', params);

  const db = new aws.DynamoDB.DocumentClient();
  db.put(params, callback);
};

module.exports.trigger = (event, context, cb) => {
  console.log('event: %j', event);

  _(event.Records)
    .filter(forOrigin)
    .filter(forLatchOpen)
    .map(toEvent)
    .tap(print)
    .flatMap(publish)
    .tap(print)
    .collect()
    .toCallback(cb);
};

const forOrigin = e => e.dynamodb.NewImage['aws:rep:updateregion'] &&
  e.dynamodb.NewImage['aws:rep:updateregion'].S === process.env.AWS_REGION;

const forLatchOpen = e => e.dynamodb.NewImage.latch.S === 'open';

const toEvent = record => ({
  id: record.eventID,
  type: `thing-${mapEventName(record)}`,
  timestamp: record.dynamodb.ApproximateCreationDateTime * 1000,
  partitionKey: record.dynamodb.Keys.id.S,
  tags: {
    region: record.awsRegion,
    source: process.env.SERVERLESS_PROJECT
  },
  thing: {
    old: record.dynamodb.OldImage ?
      aws.DynamoDB.Converter.unmarshall(record.dynamodb.OldImage) :
      undefined,
    new: record.dynamodb.NewImage ?
      aws.DynamoDB.Converter.unmarshall(record.dynamodb.NewImage) :
      undefined,
  },
});

const EVENT_NAME_MAPPING = {
  INSERT: 'created',
  MODIFY: 'updated',
  REMOVE: 'deleted',
};

const mapEventName = (record) => {
  if (!record.dynamodb.OldImage['aws:rep:updateregion']) {
    return EVENT_NAME_MAPPING.INSERT;
  }

  return EVENT_NAME_MAPPING[record.eventName];
};

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

const print = value => console.log('%j', value);

module.exports.listener = (event, context, cb) => {
  console.log('event: %j', event);

  _(event.Records)
    .map(recordToEvent)
    .tap(print)
    .filter(forSourceNotSelf)
    .filter(forThingCrud)
    .map(toThing)
    .flatMap(put)
    .tap(print)
    .collect()
    .toCallback(cb);
};

const recordToEvent = r => JSON.parse(Buffer.from(r.kinesis.data, 'base64'));

const forSourceNotSelf = e => e.tags.source != process.env.SERVERLESS_PROJECT;

const forThingCrud = e => e.type.match(/thing-created|thing-updated/);

const toThing = event => ({
  id: event.thing.new.id,
  name: event.thing.new.name,
  description: event.thing.new.description,
  timestamp: event.timestamp,
  latch: 'closed',
});

const put = thing => {
  const params = {
    TableName: process.env.TABLE_NAME,
    Item: thing,
  };

  console.log('params: %j', params);

  const db = new aws.DynamoDB.DocumentClient();
  return _(db.put(params).promise());
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

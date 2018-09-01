const aws = require('aws-sdk');
const _ = require('highland');
const uuid = require('uuid');

module.exports.listener = (event, context, cb) => {
  console.log('event: %j', event);

  _(event.Records)
    .map(recordToEvent)
    .tap(print)
    .filter(forThingCreated)
    .map(toThing)
    .flatMap(put)
    .tap(print)
    .collect()
    .toCallback(cb);
};

const recordToEvent = r => JSON.parse(Buffer.from(r.kinesis.data, 'base64'));

const print = v => console.log('%j', v);

const forThingCreated = e => e.type === 'thing-created';

const toThing = event => ({
  id: event.thing.new.id,
  name: event.thing.new.name,
  description: event.thing.new.description,
  asOf: event.timestamp,
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

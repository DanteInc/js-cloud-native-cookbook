const aws = require('aws-sdk');
const _ = require('highland');
const uuid = require('uuid');

const client = require('elasticsearch').Client({
  hosts: [`https://${process.env.DOMAIN_ENDPOINT}`],
  connectionClass: require('http-aws-es'),
  log: 'trace',
});

module.exports.listener = (event, context, cb) => {
  console.log('event: %j', event);

  _(event.Records)
    .map(recordToEvent)
    .tap(print)
    .filter(forThingCreated)
    .map(toThing)
    .flatMap(index)
    .tap(print)
    .collect()
    .toCallback(cb);
};

const recordToEvent = r => JSON.parse(Buffer.from(r.kinesis.data, 'base64'));

// additional conditions account for other recipes exercised first
const forThingCreated = e => e.type === 'thing-created' && e.thing && e.thing.new;

const toThing = event => ({
  id: event.thing.new.id,
  name: event.thing.new.name,
  description: event.thing.new.description,
  asOf: event.timestamp,
});

const index = thing => {
  const params = {
    index: 'things',
    type: 'thing',
    id: thing.id,
    body: thing,
  };

  console.log('params: %j', params);

  return _(client.index(params));
};

module.exports.search = (query, context, callback) => {
  const params = {
    index: 'things',
    q: query,
  };

  console.log('params: %j', params);

  client.search(params, callback);
};

const print = v => console.log('%j', v);

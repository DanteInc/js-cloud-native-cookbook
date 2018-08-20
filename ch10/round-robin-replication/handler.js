const aws = require('aws-sdk');
const _ = require('highland');
const uuid = require('uuid');

module.exports.listener = (event, context, cb) => {
  console.log('event: %j', event);

  _(event.Records)
    .map(recordToEvent)
    // .tap(print)
    .filter(forThingCreated)
    .map(toThing)
    .flatMap(put)
    // .tap(print)
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
    Bucket: process.env.BUCKET_NAME,
    Key: `things/${thing.id}`,
    ACL: 'public-read',
    ContentType: 'application/json',
    CacheControl: 'max-age=300',
    Body: JSON.stringify(thing),
  };

  console.log('params: %j', params);

  const s3 = new aws.S3();
  return _(s3.putObject(params).promise());
};

module.exports.trigger = (event, context, cb) => {
  console.log('event: %j', event);

  _(event.Records)
    .flatMap(messagesToTriggers)
    .tap(print)
    .flatMap(get)
    .tap(print)
    .map(toSearchRecord)
    .flatMap(index)
    // .tap(print)
    .collect()
    .toCallback(cb);
};

const messagesToTriggers = r => _(JSON.parse(r.Sns.Message).Records);

const get = (trigger) => {
  const params = {
    Bucket: trigger.s3.bucket.name,
    Key: trigger.s3.object.key,
  };

  console.log('params: %j', params);

  const s3 = new aws.S3();
  return _(
    s3.getObject(params).promise()
      .then(data => ({
        trigger: trigger,
        thing: JSON.parse(Buffer.from(data.Body)),
      }))
  );
};

const toSearchRecord = uow => ({
  id: uow.thing.id,
  name: uow.thing.name,
  description: uow.thing.description,
  url: `https://s3.amazonaws.com/${uow.trigger.s3.bucket.name}/${uow.trigger.s3.object.key}`,
});

const client = require('elasticsearch').Client({
  hosts: [`https://${process.env.DOMAIN_ENDPOINT}`],
  connectionClass: require('http-aws-es'),
  log: 'trace',
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

module.exports.search = (request, context, callback) => {
  console.log('request: %j', request);

  const params = {
    index: 'things',
    q: request.queryStringParameters.q,
  };

  console.log('params: %j', params);

  client.search(params, (err, resp) => {
    console.log('err: %s', err);
    console.log('response: %j', resp);

    const response = {
      statusCode: err ? 500 : 200,
      body: err ? undefined : JSON.stringify(resp.hits.hits.map(h => h._source))
    };

    callback(null, response);
  });
};
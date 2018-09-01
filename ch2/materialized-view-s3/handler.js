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

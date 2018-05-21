const aws = require('aws-sdk');
const _ = require('highland');
const uuid = require('uuid');

module.exports.load = (thing, context, callback) => {
  const params = {
    Bucket: process.env.BUCKET_NAME,
    Key: `things/${thing.id}`,
    ACL: 'public-read',
    ContentType: 'application/json',
    CacheControl: 'max-age=31536000', // 1 year
    Body: JSON.stringify(thing),
  };

  const s3 = new aws.S3();
  s3.putObject(params, callback);
};

module.exports.trigger = (event, context, cb) => {
  console.log('event: %j', event);

  _(process.env.DISABLED === 'true' ? [] : event.Records)
    .flatMap(messagesToTriggers)
    .tap(print)
    .flatMap(invalidate)
    .tap(print)
    .collect()
    .toCallback(cb);
};

const messagesToTriggers = r => _(JSON.parse(r.Sns.Message).Records);

const invalidate = (trigger) => {
  const params = {
    DistributionId: process.env.DISTRIBUTION_ID,
    InvalidationBatch: {
      CallerReference: uuid.v1(),
      Paths: {
        Quantity: 1,
        Items: [`/${trigger.s3.object.key}`]
      }
    }
  };

  console.log('params: %j', params);

  const cf = new aws.CloudFront();
  return _(cf.createInvalidation(params).promise());
};

const print = v => console.log('%j', v);

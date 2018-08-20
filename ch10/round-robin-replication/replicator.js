const aws = require('aws-sdk');
const _ = require('highland');

module.exports.trigger = (event, context, cb) => {
  console.log('event: %j', event);

  _(event.Records)
    .flatMap(messagesToTriggers)
    .flatMap(get)
    .tap(print)
    .filter(forOrigin)
    .flatMap(replicate)
    .tap(print)
    .collect()
    .toCallback(cb);
};

const messagesToTriggers = r => _(JSON.parse(r.Sns.Message).Records);

const forOrigin = uow => uow.object.Metadata.origin !== process.env.REPLICATION_BUCKET_NAME;

const get = (trigger) => {
  const params = {
    Bucket: trigger.s3.bucket.name,
    Key: trigger.s3.object.key,
  };

  const s3 = new aws.S3({
    httpOptions: { timeout: 1000 },
    logger: console,
  });

  return _(
    s3.getObject(params).promise()
      .then(object => ({
        trigger,
        object,
        // thing: JSON.parse(Buffer.from(data.Body)),
      }))
  );
};

const replicate = uow => {
  const { ContentType, CacheControl, Metadata, Body } = uow.object;

  const params = {
    Bucket: process.env.REPLICATION_BUCKET_NAME,
    Key: uow.trigger.s3.object.key,
    Metadata: {
      'origin': uow.trigger.s3.bucket.name, // used in forOrigin
      ...Metadata, // this will override the previous line if the current region is not the origin
    },
    ACL: 'public-read',
    ContentType,
    CacheControl,
    Body,
  };

  const s3 = new aws.S3({
    httpOptions: { timeout: 1000 },
    logger: console,
  });

  return _(
    s3.putObject(params).promise()
      .then(response => ({
        ...uow,
        params,
        response,
      }))
  );
};

const print = v => console.log('%j', v);

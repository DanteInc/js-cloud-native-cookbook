const aws = require('aws-sdk');

const response401 = {
  status: '401',
  statusDescription: 'Unauthorized',
};

module.exports.authorize = (event, context, callback) => {
  console.log('event: ' + JSON.stringify(event, null, 2));
  const request = event.Records[0].cf.request;
  const headers = request.headers;

  if (!headers.authorization) {
    callback(null, {
      ...response401,
      body: JSON.stringify([event, context, process.env])
    });
    return false;
  }

  // further jwt processing

  callback(null, request);
};

module.exports.load = (thing, context, callback) => {
  const params = {
    Bucket: process.env.BUCKET_NAME,
    Key: `things/${thing.id}`,
    ACL: 'public-read',
    ContentType: 'application/json',
    CacheControl: 'max-age=10',
    Body: JSON.stringify(thing),
  };

  const s3 = new aws.S3();
  s3.putObject(params, callback);
};

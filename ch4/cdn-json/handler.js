const aws = require('aws-sdk');

module.exports.load = (thing, context, callback) => {
  console.log('thing: %j', thing);

  const params = {
    Bucket: process.env.BUCKET_NAME,
    Key: `things/${thing.id}`,
    ACL: 'public-read',
    ContentType: 'application/json',
    CacheControl: 'max-age=5',  // short value to demo performance difference
    Body: JSON.stringify(thing),
  };

  console.log('params: %j', params);

  const s3 = new aws.S3();
  s3.putObject(params, callback);
};

module.exports.search = (query, context, callback) => {
  const params = {
    Bucket: process.env.BUCKET_NAME,
  };

  console.log('params: %j', params);

  const s3 = new aws.S3();
  s3.listObjects(params, (err, resp) => {
    console.log('err: %s', err);
    console.log('response: %j', resp);

    const response = {
      statusCode: err ? 500 : 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
      body: err ? undefined : JSON.stringify(resp.Contents.map(r => `${process.env.ENDPOINT}/${r.Key}`))
    };

    callback(null, response);
  });
};

const aws = require('aws-sdk');

module.exports.webhook = (request, context, callback) => {
  // console.log('request: %j', request);

  const body = JSON.parse(request.body);

  // console.log('body: %j', body);

  const event = {
    type: `issue-${body.action}`,
    id: request.headers['X-GitHub-Delivery'],
    partitionKey: String(body.issue.id),
    timestamp: Date.parse(body.issue['updated_at']),
    tags: {
      region: process.env.AWS_REGION,
      repository: body.repository.name,
    },
    issue: body, // canonical
    raw: request
  };

  console.log('event: %j', event);

  const params = {
    StreamName: process.env.STREAM_NAME,
    PartitionKey: event.partitionKey,
    Data: Buffer.from(JSON.stringify(event)),
  };

  console.log('params: %j', params);

  const kinesis = new aws.Kinesis();

  kinesis.putRecord(params, (err, resp) => {
    console.log('err: %s', err);
    console.log('response: %j', resp);

    const response = {
      statusCode: err ? 500 : 200,
    };
  
    callback(null, response);
  });  
};

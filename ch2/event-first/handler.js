const aws = require('aws-sdk');
const uuid = require('uuid');

module.exports.submit = (thing, context, callback) => {
  // console.log('thing: %j', thing);

  thing.id = thing.id || uuid.v4();

  const event = {
    type: 'thing-submitted',
    id: uuid.v1(),
    partitionKey: thing.id,
    timestamp: Date.now(),
    tags: {
      region: process.env.AWS_REGION,
      kind: thing.kind,
    },
    thing: thing,
  };

  // console.log('event: %j', event);

  const params = {
    StreamName: process.env.STREAM_NAME,
    PartitionKey: event.partitionKey,
    Data: Buffer.from(JSON.stringify(event)),
  };

  console.log('params: %j', params);

  const kinesis = new aws.Kinesis();

  kinesis.putRecord(params, (err, resp) => {
    console.log('response: %j', resp);
    callback(err, event);
  });
};

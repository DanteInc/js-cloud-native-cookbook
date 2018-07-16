const aws = require('aws-sdk');
const uuid = require('uuid');

module.exports.simulate = (request, context, callback) => {
  const thingId = uuid.v4();

  const createEvent = {
    id: uuid.v1(),
    type: 'thing-created',
    timestamp: Date.now(),
    thing: {
      id: thingId,
    },
  };

  const updateEvent = {
    id: uuid.v1(),
    type: 'thing-updated',
    timestamp: Date.now() + 1000,
    thing: {
      id: thingId,
    },
  };

  const params = {
    StreamName: process.env.STREAM_NAME,
    Records: [
      {
        PartitionKey: thingId,
        Data: Buffer.from(JSON.stringify(createEvent)),
      },
      {
        PartitionKey: thingId,
        Data: Buffer.from(JSON.stringify(createEvent)),
      },
      {
        PartitionKey: thingId,
        Data: Buffer.from(JSON.stringify(updateEvent)),
      },
      {
        PartitionKey: thingId,
        Data: Buffer.from(JSON.stringify(createEvent)),
      },
    ]
  };

  const kinesis = new aws.Kinesis({
    httpOptions: { timeout: 1000 },
    logger: console,
  });

  kinesis.putRecords(params, callback);
};

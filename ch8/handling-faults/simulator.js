const aws = require('aws-sdk');
const _ = require('highland');
const uuid = require('uuid');

module.exports.simulate = (request, context, callback) => {
  // may trigger random error
  const goodEvent = {
    id: uuid.v1(),
    type: 'thing-created',
    timestamp: Date.now(),
    thing: {
      id: uuid.v4(),
      name: 'JavaScript Cloud Native Development Cookbook',
      description: 'Continuously deliver serverless cloud-native solutions on AWS, Azure and GCP',
    }
  };

  // wont pass validation
  const invalidThingEvent = {
    id: uuid.v1(),
    type: 'thing-created',
    timestamp: Date.now(),
    thing: {
      id: uuid.v4(),
      description: 'no name provided',
    }
  };

  // may trigger random error
  // will fail dynamodb insert with no id
  const badRecordEvent = {
    id: uuid.v1(),
    type: 'thing-created',
    timestamp: Date.now(),
    thing: {
      name: 'no id specified'
    }
  };

  // may trigger random error
  const anotherGoodEvent = {
    id: uuid.v1(),
    type: 'thing-created',
    timestamp: Date.now(),
    thing: {
      id: uuid.v4(),
      name: 'Cloud Native Development Patterns and Best Practices',
      description: 'Practical architectural patterns for building modern distributed cloud native systems',
    }
  };

  const params = {
    StreamName: process.env.STREAM_NAME,
    Records: [
      {
        PartitionKey: goodEvent.thing.id,
        Data: Buffer.from(JSON.stringify(goodEvent)),
      },
      {
        PartitionKey: invalidThingEvent.thing.id,
        Data: Buffer.from(JSON.stringify(invalidThingEvent)),
      },
      {
        PartitionKey: uuid.v4(),
        Data: Buffer.from(JSON.stringify(badRecordEvent)),
      },
      {
        PartitionKey: uuid.v4(),
        Data: Buffer.from(JSON.stringify(anotherGoodEvent)),
      },
    ]
  };

  const kinesis = new aws.Kinesis({
    httpOptions: { timeout: 1000 },
    logger: console,
  });

  kinesis.putRecords(params, callback);
};

const aws = require('aws-sdk');
const _ = require('highland');
const uuid = require('uuid');
const { merge } = require('lodash');

const { graphqlLambda, graphiqlLambda } = require('apollo-server-lambda');
const schema = require('./schema');
const Connector = require('./lib/connector');
const { Thing } = require('./schema/thing');

module.exports.graphql = (event, context, cb) => {
  // console.log('event: %j', event);
  graphqlLambda(
    (event, context) => {
      return {
        schema,
        context: {
          models: {
            Thing: new Thing(new Connector(process.env.TABLE_NAME)),
          },
        },
      };
    }
  )(event, context, (error, output) => {
    cb(error, merge(
      {},
      output,
      {
        headers: {
          'Access-Control-Allow-Origin': '*',
        },
      }
    ));
  });
};

module.exports.graphiql = graphiqlLambda({
  endpointURL: `/${process.env.SERVERLESS_STAGE}/graphql`,
});

module.exports.trigger = (event, context, cb) => {
  // console.log('event: %j', event);
  _(event.Records)
    .map(toEvent)
    // .tap(print)
    .flatMap(publish)
    .collect()
    .toCallback(cb);
};

const toEvent = record => ({
  id: record.eventID,
  type: `thing-${EVENT_NAME_MAPPING[record.eventName]}`,
  timestamp: record.dynamodb.ApproximateCreationDateTime * 1000,
  partitionKey: record.dynamodb.Keys.id.S,
  tags: {
    region: record.awsRegion,
  },
  thing: {
    old: record.dynamodb.OldImage ?
      aws.DynamoDB.Converter.unmarshall(record.dynamodb.OldImage) :
      undefined,
    new: record.dynamodb.NewImage ?
      aws.DynamoDB.Converter.unmarshall(record.dynamodb.NewImage) :
      undefined,
  },
});

const EVENT_NAME_MAPPING = {
  INSERT: 'created',
  MODIFY: 'updated',
  REMOVE: 'deleted',
};

const publish = event => {
  const params = {
    StreamName: process.env.STREAM_NAME,
    PartitionKey: event.partitionKey,
    Data: Buffer.from(JSON.stringify(event)),
  };

  console.log('params: %j', params);

  const kinesis = new aws.Kinesis();
  return _(kinesis.putRecord(params).promise());
}

const print = value => console.log('%j', value);

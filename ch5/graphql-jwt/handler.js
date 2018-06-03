const aws = require('aws-sdk');
const { merge } = require('lodash');

const { graphqlLambda } = require('apollo-server-lambda');
const { makeExecutableSchema } = require('graphql-tools');
const { maskErrors } = require('graphql-errors');

const schema = require('./schema');
const Connector = require('./lib/connector');
const { Thing } = require('./schema/thing');

const executableSchema = makeExecutableSchema(schema);
maskErrors(executableSchema);

module.exports.graphql = (event, context, cb) => {
  console.log('event: %j', event);

  graphqlLambda(
    (event, context) => {
      return {
        schema: executableSchema,
        context: {
          event,
          models: {
            Thing: new Thing(new Connector()),
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

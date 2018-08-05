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

const { merge } = require('lodash');
const { makeExecutableSchema } = require('graphql-tools');
const { thingTypeDefs, thingResolvers } = require('./thing');

const query = `
  type Query {
    _empty: String
  }
`;

const mutation = `
  type Mutation {
    _empty: String
  }
`;

const schemaDefinition = `
  schema {
    query: Query
    mutation: Mutation
  }
`;

module.exports = makeExecutableSchema({
  typeDefs: [schemaDefinition, query, mutation, thingTypeDefs],
  resolvers: merge({}, thingResolvers),
  logger: console,
});

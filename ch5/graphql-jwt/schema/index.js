const { merge } = require('lodash');
const { thingTypeDefs, thingResolvers } = require('./thing');
const { directiveResolvers } = require('./directives');

const directives = `
  directive @hasRole(roles: [String]) on QUERY | FIELD | MUTATION
`;

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

module.exports = {
  typeDefs: [directives, schemaDefinition, query, mutation, thingTypeDefs],
  resolvers: merge({}, thingResolvers),
  directiveResolvers,
  logger: console,
};

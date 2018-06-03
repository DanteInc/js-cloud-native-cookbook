module.exports = `
  type Thing {
    id: String!
    name: String
    description: String
  }

  type ThingConnection {
    items: [Thing!]!
    cursor: String
  }

  extend type Query {
    thing(id: String!): Thing
    things(name: String, limit: Int, cursor: String): ThingConnection
  }

  input ThingInput {
    id: String
    name: String!
    description: String
  }

  extend type Mutation {
    saveThing(
      input: ThingInput
    ): Thing @hasRole(roles: ["Author"])
    deleteThing(
      id: ID!
    ): Thing @hasRole(roles: ["Manager"])
  }
`;

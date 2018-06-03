module.exports = {
  Query: {
    thing(_, { id }, ctx) {
      return ctx.models.Thing.getById(id);
    },
    things(_, { name, limit, cursor }, ctx) {
      return ctx.models.Thing.queryByName(name, limit, cursor);
    },
  },
  Mutation: {
    saveThing: (_, { input }, ctx) => {
      return ctx.models.Thing.save(input.id, input);
    },
    deleteThing: (_, args, ctx) => {
      return ctx.models.Thing.delete(args.id);
    },
  },
};

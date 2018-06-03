const { get, intersection } = require('lodash');
const { UserError } = require('graphql-errors');

const getGroups = ctx => get(ctx.event, 'requestContext.authorizer.claims.cognito:groups', '');

const directiveResolvers = {
  hasRole: (next, source, { roles }, ctx) => {
    const groups = getGroups(ctx).split(',');
    if (groups && intersection(groups, roles).length > 0) {
      return next();
    }
    console.log('hasRole: (%s) does not intersect (%s)', groups, roles);
    throw new UserError('Access Denied');
  },
}

module.exports = { directiveResolvers };

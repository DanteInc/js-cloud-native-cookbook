'use strict';

module.exports.hello = function (context) {
  context.log('context: %j', context);
  context.log('env: %j', process.env);

  context.res = {
    status: 200,
    body: 'JavaScript Cloud Native Development Cookbook! Your function executed successfully!',
  };

  context.done();
};

const { monitor, count } = require('serverless-datadog-metrics');
const debug = require('debug')('handler');

module.exports.hello = monitor((request, context, callback) => {
  debug('request: %j', request);
  debug('context: %j', context);

  count('hello.count', 1);

  const response = {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    body: JSON.stringify({
      message: 'JavaScript Cloud Native Development Cookbook! Your function executed successfully!',
    }),
  };

  callback(null, response);
});

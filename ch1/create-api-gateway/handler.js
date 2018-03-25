module.exports.hello = (event, context, callback) => {
  console.log('event: %j', event);

  const response = {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    body: JSON.stringify({
      message: 'JavaScript Cloud Native Development Cookbook! Your function executed successfully!',
      input: event,
    }),
  };

  callback(null, response);
};

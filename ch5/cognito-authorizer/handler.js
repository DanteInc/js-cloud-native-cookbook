module.exports.hello = (request, context, callback) => {
  console.log('request: %j', request);

  const response = {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    body: JSON.stringify({
      message: 'JavaScript Cloud Native Development Cookbook! Your function executed successfully!',
      input: request,
    }),
  };

  callback(null, response);
};

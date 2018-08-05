module.exports.save = (request, context, callback) => {
  console.log('request: %j', request);

  const response = {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'no-cache, no-store, must-revalidate',
    },
  };

  console.log('response: %j', response);

  callback(null, response);
};

module.exports.get = (request, context, callback) => {
  console.log('request: %j', request);

  const response = {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'max-age=5',
    },
    body: JSON.stringify({
      message: 'JavaScript Cloud Native Development Cookbook! Your function executed successfully!',
    }),
  };

  console.log('response: %j', response);

  callback(null, response);
};

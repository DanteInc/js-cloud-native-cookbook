module.exports.hello = (request, context, callback) => {
  console.log('Request: %j', request);
  console.log('Context: %j', context);
  console.log('Env: %j', process.env);

  const response = {
    statusCode: 200,
    body: JSON.stringify({
      timestamp: Date.now(),
      message: `Your function executed successfully in ${process.env.AWS_REGION}!`,
    }),
  };

  console.log('Response: %j', response);

  callback(null, response);
};

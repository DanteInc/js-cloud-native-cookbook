module.exports.check = (request, context, callback) => {
  callback(null, {
    statusCode: process.env.UNHEALTHY === 'true' ? 503 : 200,
    body: JSON.stringify({
      timestamp: Date.now(),
      region: process.env.AWS_REGION,
    }),
    headers: {
      'Cache-Control': 'no-cache, no-store, must-revalidate',
    },
  });
};

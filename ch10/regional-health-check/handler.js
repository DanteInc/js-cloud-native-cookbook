module.exports.check = (request, context, callback) => {
  // console.log('request: %j', request);
  Promise.all([readCheck, writeCheck])
    .catch(handleError)
    .then(response(callback));
};

const db = new aws.DynamoDB.DocumentClient({
  httpOptions: { timeout: 1000 },
  logger: console,
});

const readCheck = () => db.get({
  TableName: process.env.TABLE_NAME,
  Key: {
    id: '1',
  },
}).promise();

const writeCheck = () => db.put({
  TableName: process.env.TABLE_NAME,
  Item: {
    id: '1',
  },
}).promise();

const handleError = (err) => {
  console.error(err);
  return true; // unhealthy
};

const response = callback => (unhealthy) => {
  callback(null, {
    statusCode: unhealthy || process.env.UNHEALTHY === 'true' ? 503 : 200,
    body: JSON.stringify({
      timestamp: Date.now(),
      region: process.env.AWS_REGION,
    }),
    headers: {
      'Cache-Control': 'no-cache, no-store, must-revalidate',
    },
  });
};
const aws = require('aws-sdk');
const uuid = require('uuid');

module.exports.command = (request, context, callback) => {
  console.log('request: %j', request);

  const db = new aws.DynamoDB.DocumentClient({
    httpOptions: { timeout: 1000 },
    logger: console,
    // logger: { log: msg => debug(msg) },
  });
  
  const params = {
    TableName: process.env.TABLE_NAME,
    Item: {
      id: uuid.v4(),
      ...request,
    },
  };

  db.put(params, callback);
};

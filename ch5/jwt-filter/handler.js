const aws = require('aws-sdk');
const uuid = require('uuid');

module.exports.save = (request, context, callback) => {
  console.log('request: %j', request);

  const body = JSON.parse(request.body);
  const sub = request.requestContext.authorizer.claims.sub;
  const id = body.id || uuid.v4();

  const params = {
    TableName: process.env.TABLE_NAME,
    Item: {
      sub,
      id,
      ...body
    }
  };

  console.log('params: %j', params);
  
  const db = new aws.DynamoDB.DocumentClient();

  db.put(params, (err, resp) => {
    console.log('err: %s', err);
    console.log('resp: %j', resp);

    const response = {
      statusCode: err ? 500 : 201,
      headers: {
        'access-control-allow-origin': '*',
        'cache-control': 'no-cache',
        'location': err ? undefined : `https://${request.headers.Host}/${request.requestContext.stage}/things/${sub}/${id}`
      },
    };

    console.log('response: %j', response);
    
    callback(null, response);
  });
};

module.exports.get = (request, context, callback) => {
  console.log('request: %j', request);

  const sub = request.requestContext.authorizer.claims.sub;
  const id = request.pathParameters.id;

  if (sub !== request.pathParameters.sub) {
    callback(null, { statusCode: 401 });
    return;
  }

  const params = {
    TableName: process.env.TABLE_NAME,
    Key: {
      sub,
      id,
    },
  };

  console.log('params: %j', params);
    
  const db = new aws.DynamoDB.DocumentClient();

  db.get(params, (err, resp) => {
    console.log('err: %s', err);
    console.log('resp: %j', resp);

    const response = {
      statusCode: err ? 500 : !resp.Item ? 404 : 200,
      headers: {
        'access-control-allow-origin': '*',
        'cache-control': 'max-age=3',
      },
      body: err ? undefined : JSON.stringify(resp.Item)
    };

    console.log('response: %j', response);
    
    callback(null, response);
  });
};

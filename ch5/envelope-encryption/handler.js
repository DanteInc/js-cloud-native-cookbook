const aws = require('aws-sdk');
const uuid = require('uuid');
const CryptoJS = require("crypto-js");

const encrypt = (thing) => {
  console.log('thing: %j', thing);

  const params = {
    KeyId: process.env.MASTER_KEY_ALIAS,
    KeySpec: 'AES_256',
  };

  console.log('params: %j', params);

  const kms = new aws.KMS();

  return kms.generateDataKey(params).promise()
    .then((dataKey) => {
      // console.log('dataKey: %j', dataKey.KeyId);

      const encryptedThing = Object.keys(thing).reduce((encryptedThing, key) => {
        if (key !== 'id')
          encryptedThing[key] = CryptoJS.AES.encrypt(thing[key],
            dataKey.Plaintext.toString()).toString();
        return encryptedThing;
      }, {});

      return {
        id: thing.id,
        dataKey: dataKey.CiphertextBlob.toString('base64'),
        ...encryptedThing,
      };
    });
};

const decrypt = (thing) => {
  const params = {
    CiphertextBlob: Buffer.from(thing.dataKey, 'base64'),
  };

  const kms = new aws.KMS();

  return kms.decrypt(params).promise()
    .then((dataKey) => {
      // console.log('dataKey: %j', dataKey.KeyId);

      const decryptedThing = Object.keys(thing).reduce((decryptedThing, key) => {
        if (key !== 'id' && key !== 'dataKey')
          decryptedThing[key] = CryptoJS.AES.decrypt(thing[key],
            dataKey.Plaintext.toString()).toString(CryptoJS.enc.Utf8);
        return decryptedThing;
      }, {});

      return {
        id: thing.id,
        ...decryptedThing,
      };
    });
};

module.exports.save = (request, context, callback) => {
  console.log('request: %j', request);
  // console.log('env: %j', process.env);

  const thing = JSON.parse(request.body);
  const id = thing.id || uuid.v4();

  encrypt(thing)
    .then((encryptedThing) => {
      const params = {
        TableName: process.env.TABLE_NAME,
        Item: {
          id,
          ...encryptedThing,
        }
      };

      console.log('params: %j', params);

      const db = new aws.DynamoDB.DocumentClient();

      return db.put(params).promise();
    })
    .then((resp) => {
      const response = {
        statusCode: 201,
        headers: {
          'access-control-allow-origin': '*',
          'cache-control': 'no-cache',
          'location': `https://${request.headers.Host}/${request.requestContext.stage}/things/${id}`
        },
      };

      console.log('response: %j', response);

      callback(null, response);
    })
    .catch(response500);
};

module.exports.get = (request, context, callback) => {
  console.log('request: %j', request);

  const id = request.pathParameters.id;

  const params = {
    TableName: process.env.TABLE_NAME,
    Key: {
      id,
    },
  };

  console.log('params: %j', params);

  const db = new aws.DynamoDB.DocumentClient();

  db.get(params).promise()
    .then((resp) => {
      console.log('resp: %j', resp);

      return resp.Item ? decrypt(resp.Item) : null;
    })
    .then((thing) => {
      console.log('thing: %j', thing);

      const response = {
        statusCode: !thing ? 404 : 200,
        headers: {
          'access-control-allow-origin': '*',
          'cache-control': 'max-age=3',
        },
        body: JSON.stringify(thing)
      };

      console.log('response: %j', response);

      callback(null, response);
    })
    .catch(response500);
};

const response500 = (err) => {
  console.log('err: %s', err);

  const response = {
    statusCode: 500,
    headers: {
      'access-control-allow-origin': '*',
      'cache-control': 'no-cache',
    },
  };

  console.log('response: %j', response);

  callback(null, response);
};

const jwksClient = require('jwks-rsa');
const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const verifyAsync = promisify(jwt.verify);

const client = jwksClient({
  cache: true,
  rateLimit: true,
  jwksUri: process.env.JWKS
});

client.getSigningKeyAsync = promisify(client.getSigningKey);

module.exports.authorize = (event, context, cb) => {
  console.log('event: %j', event);
  console.log('env: %j', process.env);

  decode(event)
    .then(fetchKey)
    .then(verify)
    .then(generatePolicy)
    .then(respond(cb))
    .catch(handleError(cb));
};

const decode = ({ authorizationToken, methodArn }) => {
  if (!authorizationToken)
    return Promise.reject('Unauthorized');

  const match = authorizationToken.match(/^Bearer (.*)$/);
  if (!match || match.length < 2)
    return Promise.reject('Unauthorized');

  return Promise.resolve({
    methodArn,
    authorizationToken,
    token: match[1],
    decoded: jwt.decode(match[1], { complete: true }),
  });
};

const fetchKey = (uow) => {
  console.log('uow: %j', uow);
  const { kid } = uow.decoded.header;

  return client.getSigningKeyAsync(kid)
    .then(key => ({
      key: key.publicKey || key.rsaPublicKey,
      ...uow,
    }));
};

const verify = (uow) => {
  console.log('uow: %j', uow);
  const { token, key } = uow;

  return verifyAsync(token, key, {
    audience: process.env.AUD,
    issuer: process.env.ISS
  })
    .then(claims => ({ claims, ...uow }))
    .catch((err) => {
      console.error(err);
      return Promise.reject('Unauthorized');
    });
};

const generatePolicy = (uow) => {
  console.log('uow: %j', uow);
  const { claims, methodArn } = uow;
  const { region, accountId, apiId, stage } = parseMethodArn(methodArn);
  const Effect = 'Allow';
  const Resource = `arn:aws:execute-api:${region}:${accountId}:${apiId}/${stage}/*`;

  return {
    policy: {
      principalId: claims.sub,
      policyDocument: {
        Version: '2012-10-17',
        Statement: [{ Action: 'execute-api:Invoke', Effect, Resource }],
        // Condition: {
        //   DateLessThan: {
        //     'aws:CurrentTime': new Date(claims.exp).toISOString()
        //   },
        // }
      },
      context: claims,
    },
    ...uow,
  };
};

const parseMethodArn = (methodArn) => {
  // arn:aws:execute-api:<region>:<accountId>:<apiId>/<stage>/<method>/<resourcePath>
  const split = methodArn.split(/[:/]+/);
  // ["arn","aws","execute-api","<region>","<accountId>","<apiId>","<stage>","<method>","<resourcePath>"]

  return {
    region: split[3],
    accountId: split[4],
    apiId: split[5],
    stage: split[6],
    method: split[7],
    resourcePath: split[8],
  };
};

const respond = callback => (uow) => {
  console.log('uow: %j', uow);
  const { policy } = uow;
  return callback(null, policy);
};

const handleError = callback => (err) => {
  console.log('err: %s', err);
  return callback(err);
};

module.exports.hello = (request, context, cb) => {
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

  cb(null, response);
};

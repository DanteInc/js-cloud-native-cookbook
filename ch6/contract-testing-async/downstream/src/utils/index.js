import uuid from 'uuid/v4';

export const uuidv4 = () => uuid();

export const cors = {
  'Access-Control-Allow-Origin': '*',
};

export const noCache = {
  'Cache-Control': 'no-cache',
};

export const maxAge3 = {
  'Cache-Control': 'max-age=3',
};

export const response200 = (callback, body) => {
  const response = {
    statusCode: 200,
    headers: {
      ...cors,
      ...maxAge3,
    },
    body: JSON.stringify(body),
  };

  return callback(null, response);
};

export const response404 = (callback) => {
  const response = {
    statusCode: 404,
    headers: {
      ...cors,
      ...maxAge3,
    },
  };

  return callback(null, response);
};

export const response500 = callback => (err) => {
  console.error('err: %s', err);

  const response = {
    statusCode: 500,
    headers: {
      ...cors,
      ...noCache,
    },
  };

  return callback(null, response);
};

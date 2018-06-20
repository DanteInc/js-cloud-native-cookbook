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

export const response201 = callback => (Location) => {
  const response = {
    statusCode: 201,
    headers: {
      ...cors,
      ...noCache,
      Location,
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

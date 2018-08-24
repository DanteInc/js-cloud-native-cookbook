'use strict';

exports.hello = (request, response) => {
  console.log('env: %j', process.env);

  response.status(200).send('JavaScript Cloud Native Development Cookbook! Your function executed successfully!');
};

exports.trigger = (event, callback) => {
  callback();
};

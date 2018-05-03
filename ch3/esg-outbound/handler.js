const aws = require('aws-sdk');
const _ = require('highland');
require('isomorphic-fetch');

module.exports.listener = (event, context, cb) => {
  // console.log('event: %j', event);

  _(event.Records)
    .map(recordToEvent)
    .tap(print)
    .filter(byType)
    .flatMap(post)
    .tap(print)
    .collect()
    .toCallback(cb);
};

const recordToEvent = r => JSON.parse(Buffer.from(r.kinesis.data, 'base64'));

const byType = event => event.type === 'issue-created';

const post = event => {
  const body = {
    title: event.issue.new.title,
    body: event.issue.new.description,
  };

  console.log('body: %j', body);

  return _(
    fetch(`https://api.github.com/repos/${process.env.OWNER}/${process.env.REPO}/issues`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.TOKEN}`,
      },
      body: JSON.stringify(body)
    })
      .then((response) => {
        console.log('response: %j', response);
        return response.json();
      })
      .then((response) => {
        console.log('response body: %j', response);
      })
  );
};

const print = v => console.log('%j', v);

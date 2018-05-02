const aws = require('aws-sdk');
const _ = require('highland');
const uuid = require('uuid');

module.exports.listener = (event, context, cb) => {
  // console.log('event: %j', event);

  _(event.Records)
    .map(recordToEvent)
    .filter(byType)
    .flatMap(post)
    .tap(print)
    .collect()
    .toCallback(cb);
};

const recordToEvent = r => JSON.parse(Buffer.from(r.kinesis.data, 'base64'));

const byType = event => 'issue-created';

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
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    })
  );
};

const print = v => console.log('%j', v);

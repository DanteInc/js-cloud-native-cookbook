const _ = require('highland');

module.exports.listener = (event, context, cb) => {
  console.log('event: %j', event);

  _(event.Records)
    .map(recordToEvent)
    .tap(printEvent)
    .filter(forThingCreated)
    .collect()
    .tap(printCount)
    .toCallback(cb);
};

const recordToEvent = r => JSON.parse(Buffer.from(r.kinesis.data, 'base64'));

const forThingCreated = e => e.type === 'thing-created';

const printEvent = e => console.log('event: %j', e);

const printCount = events => console.log('count: %d', events.length);

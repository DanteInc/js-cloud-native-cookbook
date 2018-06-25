import Connector from '../connector/db';

const _ = require('highland');

export class Handler {
  constructor(tableName) {
    this.db = new Connector(tableName);
  }

  handle(event) {
    // console.log('e: %j', event);
    return _(event.Records)
      .map(recordToEvent)
      .filter(forThingCreated)
      .map(toThing)
      // .tap(print)
      .flatMap(put(this.db));
  }
}

export const handle = (event, context, cb) => {
  new Handler(process.env.TABLE_NAME)
    .handle(event)
    .collect()
    .toCallback(cb);
};

const recordToEvent = r => JSON.parse(Buffer.from(r.kinesis.data, 'base64'));

const forThingCreated = e => e.type === 'thing-created';

const toThing = event => ({
  id: event.thing.new.id,
  name: event.thing.new.name,
  asOf: event.timestamp,
});

const put = db => thing => _(db.save(thing)
  .then(() => thing));

// const print = value => console.log('%j', value);


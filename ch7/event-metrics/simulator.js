const aws = require('aws-sdk');
const _ = require('highland');
const uuid = require('uuid');
const BbPromise = require('bluebird');
const moment = require('moment');
const monitor = require('serverless-datadog-metrics').monitor;
const debug = require('debug')('handler');

aws.config.setPromisesDependency(BbPromise);

module.exports.simulate = monitor((event, context, cb) => {
  _(generator(context))
    // .ratelimit(Number(argv.rate) / 20, 1000 / 20)
    .batch(25)
    .map(publish)
    .parallel(4)
    .sequence()
    .reduce({}, (counters, cur) => {
      counters.total = (counters.total ? counters.total : 0) + 1;
      counters[cur.type] = (counters[cur.type] ? counters[cur.type] : 0) + 1;
      return counters;
    })
    .tap((counters) => {
      console.log('Counters: %s', JSON.stringify(counters, null, 2));
    })
    .errors(err => console.error('errors: %s', err))
    .collect()
    .toCallback(cb);
});

const generator = (ctx) => {
  return (push, next) => {
    debug('time remaining: ', ctx.getRemainingTimeInMillis());

    const endTime = moment();
    endTime.add(ctx.getRemainingTimeInMillis() - 300, 'milliseconds');
  
    if (Date.now() < endTime) {
      push(null, createEvent());
      next();
    } else {
      push(null, _.nil);
    }
  };
};

const eventTypes = ['orange', 'green', 'blue', 'purple'];
const userId = ['1', '2', '3', '4', '5'];

const createEvent = () => ({
  id: uuid.v1(),
  type: eventTypes[Math.floor(Math.random() * eventTypes.length)],
  timestamp: Date.now(),
  partitionKey: userId[Math.floor(Math.random() * userId.length)],
  tags: {
    source: process.env.SERVERLESS_PROJECT || undefined,
    region: process.env.AWS_REGION,
  },
});

const publish = (events) => {
  debug('events: %j', events);

  const params = {
    StreamName: process.env.STREAM_NAME,
    Records: events.map(e => ({
      Data: Buffer.from(JSON.stringify(e)),
      PartitionKey: e.partitionKey,
    })),
  };

  const kinesis = new aws.Kinesis({
    httpOptions: { timeout: 1000 },
    logger: { log: msg => debug(msg) },
  });

  return _(
    kinesis.putRecords(params).promise()
      .tap(debug)
      .then(() => events)
  );
};

const print = data => console.log(JSON.stringify(data, null, 2));

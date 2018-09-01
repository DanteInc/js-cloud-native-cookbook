const Promise = require('bluebird');
const moment = require('moment');
const _ = require('highland');

module.exports.listener = (event, context, cb) => {
  // console.log('event: %j', event);

  _(event.Records)
    .map(recordToUow)
    // .tap(print)
    .tap(count)

    .filter(filterType)
    .map(mapDatadogEvent)
    .map(sendDatadogEvent)
    
    .collect()
    .toCallback(cb);
};

const recordToUow = r => ({
  record: r,
  event: JSON.parse(Buffer.from(r.kinesis.data, 'base64'))
});

// const print = v => console.log('%j', v);

const count = (uow) => {
  const tags = [
    `account:${process.env.ACCOUNT_NAME || 'demo'}`,

    `region:${uow.record.awsRegion}`,
    `stream:${uow.record.eventSourceARN.split('/')[1]}`,
    `shard:${uow.record.eventID.split('-')[1].split(':')[0]}`,

    `source:${uow.event.tags && uow.event.tags.source || 'not-specified'}`,
    `type:${uow.event.type}`,
  ];

  console.log(`MONITORING|${uow.event.timestamp}|1|count|domain.event|#${tags.join()}`);
};

const filterType = uow => uow.event.type === 'fault' && process.env.DATADOG_API_KEY;

const mapDatadogEvent = uow => ({
  params: {
    title: 'Fault Event: ' + (uow.event.err && uow.event.err.message ? uow.event.err.message : undefined),
    properties: {
      alert_type: 'error',
      priority: 'all',
      date_happened: moment().diff(moment(uow.event.timestamp), 'hours') > 1 ? moment().unix() : moment(uow.event.timestamp).unix(),
      source_type_name: 'my apps',
      tags: [
        `event_type:fault`,
        `acct:${process.env.ACCOUNT_NAME}`,
        `functionName:${uow.event.tags.functionName}`,
        `error_type:${uow.event.err ? uow.event.err.name : undefined}`,
      ],
    },
    message: uow.event.err ? uow.event.err.stack : undefined,
  },
  ...uow,
});

const sendDatadogEvent = uow => {
  if (!dogapi.client.api_key) {
    dogapi.initialize({
      api_key: process.env.DATADOG_API_KEY,
    });
  }

  const p = new Promise((resolve, reject) => {
    dogapi.event.create(uow.params.title, uow.params.message, uow.params.properties, (err, res) => {
      if (err) {
        console.error('DOGAPI ERROR: %s, %s', err, JSON.stringify(uow, null, 2));
        resolve(err);
      } else {
        resolve(res);
      }
    });
  })
    .tap(data => debug('dogapi:response: %j', data))
    .tapCatch(err => debug('dogapi:error: %j', err))
    .then(() => uow)
  ;

  return _(p);
};


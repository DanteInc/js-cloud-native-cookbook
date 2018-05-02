const aws = require('aws-sdk');
const _ = require('highland');
const moment = require('moment');

module.exports.listener = (event, context, cb) => {
  // console.log('event: %j', event);

  _(event.Records)
    .map(recordToEvent)
    .filter(byType)
    // .tap(print)
    .flatMap(putEvent)
    .collect()
    .toCallback(cb);
};

const recordToEvent = r => JSON.parse(Buffer.from(r.kinesis.data, 'base64'));

const byType = event => event.type.match(/.+/); // any

const putEvent = (event) => {
  const params = {
    TableName: process.env.EVENTS_TABLE_NAME,
    Item: {
      partitionKey: event.partitionKey,
      timestamp: event.timestamp,
      event: event,
      ttl: moment(event.timestamp).add(1, 'h').unix()
    }
  };

  console.log('params: %j', params);

  const db = new aws.DynamoDB.DocumentClient();
  return _(db.put(params).promise());
};

module.exports.trigger = (event, context, cb) => {
  // console.log('event: %j', event);

  _(event.Records)
    .flatMap(getMicroEventStore)
    .flatMap(store => _(store) // sub-stream
      .reduce({}, count)
      // .tap(print)
      .flatMap(putCounters)
    )
    .collect()
    .toCallback(cb);
};

const getMicroEventStore = (record) => {
  const timestamp = moment(Number(record.dynamodb.Keys.timestamp.N));
  const params = {
    TableName: process.env.EVENTS_TABLE_NAME,
    KeyConditionExpression: '#partitionKey = :partitionKey and #timestamp BETWEEN :from and :to',
    ExpressionAttributeNames: {
      '#partitionKey': 'partitionKey',
      "#timestamp": "timestamp"
    },
    ExpressionAttributeValues: {
      ':partitionKey': record.dynamodb.Keys.partitionKey.S,
      ":from": timestamp.startOf('month').valueOf(),
      ":to": timestamp.endOf('month').valueOf()
    }
  };

  console.log('params: %j', params);

  const db = new aws.DynamoDB.DocumentClient();

  return _(
    db.query(params).promise()
      .then(data => data.Items)
  );
}

const count = (counters, cur) => {
  // console.log('cur: %j', cur);
  return Object.assign(
    {
      userId: cur.partitionKey,
      yearmonth: moment(cur.timestamp).format('YYYY-MM'),
    },
    counters,
    {
      total: counters.total ? counters.total + 1 : 1,
      [cur.event.type]: counters[cur.event.type] ? counters[cur.event.type] + 1 : 1,
    }
  );
  ;
}

const putCounters = counters => {
  const params = {
    TableName: process.env.VIEW_TABLE_NAME,
    Item: counters
  };

  console.log('params: %j', params);

  const db = new aws.DynamoDB.DocumentClient();
  return _(db.put(params).promise());
};

module.exports.query = (event, context, cb) => {
  // console.log('event: %j', event);

  const params = {
    TableName: process.env.VIEW_TABLE_NAME,
  };

  // console.log('params: %j', params);

  const db = new aws.DynamoDB.DocumentClient();

  db.scan(params, (err, resp) => {
    console.log('err: %s', err);
    console.log('response: %j', resp);

    const response = {
      statusCode: err ? 500 : 200,
      body: err ? undefined : JSON.stringify(resp.Items)
    };

    cb(null, response);
  });
};

const print = v => console.log('%j', v);

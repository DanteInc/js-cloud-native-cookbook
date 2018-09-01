const aws = require('aws-sdk');
const _ = require('highland');
const BbPromise = require('bluebird');

aws.config.setPromisesDependency(BbPromise);

module.exports.listener = (event, context, cb) => {
  console.log('event count: %s', event.Records.length);
  console.log('function timeout: %s', context.getRemainingTimeInMillis());

  _(event.Records)
    .map(recordToUow)
    .filter(forPurple)
    
    .group(uow => uow.event.partitionKey)
    .flatMap(groupUow)

    .ratelimit(Number(process.env.WRITE_CAPACITY) /
      Number(process.env.SHARD_COUNT) / 10, 100)
    .flatMap(put)

    .collect()
    .toCallback(cb);
};

const recordToUow = r => ({
  record: r,
  event: JSON.parse(Buffer.from(r.kinesis.data, 'base64'))
});

const forPurple = uow => uow.event.type === 'purple';

const groupUow = groups => _(Object.keys(groups).map(key => ({ batch: groups[key]})));

const put = groupUow => {
  const params = {
    TableName: process.env.TABLE_NAME,
    Item: groupUow.batch[groupUow.batch.length - 1].event, // last
    ReturnConsumedCapacity: 'TOTAL',
  };

  const db = new aws.DynamoDB.DocumentClient({
    httpOptions: { timeout: 1000 },
    logger: console,
  });

  return _(db.put(params).promise()
    .tap(print)
    .then(() => groupUow)
    .catch(err => {
      err.uow = groupUow;
      throw err;
    })
  );
};

const print = v => console.log('%j', v);

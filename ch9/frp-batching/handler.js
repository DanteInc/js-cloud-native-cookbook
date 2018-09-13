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

    .ratelimit(Number(process.env.WRITE_CAPACITY) /
      Number(process.env.SHARD_COUNT) /
      Number(process.env.WRITE_BATCH_SIZE) / 10, 100)

    .batch(Number(process.env.WRITE_BATCH_SIZE))
    .map(batchUow)

    .flatMap(batchWrite)

    .collect()
    .toCallback(cb);
};

const recordToUow = r => ({
  record: r,
  event: JSON.parse(Buffer.from(r.kinesis.data, 'base64'))
});

const forPurple = uow => uow.event.type === 'purple';

const batchUow = batch => ({ batch });

const batchWrite = batchUow => {
  batchUow.params = {
    RequestItems: {
      [process.env.TABLE_NAME]: batchUow.batch.map(uow =>
        ({
          PutRequest: {
            Item: uow.event
          }
        })
      )
    },
    ReturnConsumedCapacity: 'TOTAL',
    ReturnItemCollectionMetrics: 'SIZE',
  };

  const db = new aws.DynamoDB.DocumentClient({
    httpOptions: { timeout: 1000 },
    logger: console,
  });

  return _(db.batchWrite(batchUow.params).promise()
    .tap(print)
    .then(data => (
      Object.keys(data.UnprocessedItems).length > 0 ?
        Promise.reject(data) :
        batchUow
    ))    
    .catch(err => {
      err.uow = batchUow;
      throw err;
    })
  );
};

const print = v => console.log('%j', v);

const aws = require('aws-sdk');
const _ = require('highland');
const uuid = require('uuid');

module.exports.trigger = (event, context, cb) => {
  console.log('event: %j', event);

  _(event.Records)
    .flatMap(recordToSync)
    .tap(print)
    .map(toEvent)
    .tap(print)
    .flatMap(publish)
    .collect().toCallback(cb);
};

const recordToSync = r => {
  const data = JSON.parse(Buffer.from(r.kinesis.data, 'base64'));
  return _(data.kinesisSyncRecords.map(sync => ({
    record: r,
    data: data,
    sync: sync,
    thing: JSON.parse(sync.value)
  })));
}

const toEvent = uow => ({
  id: uuid.v1(),
  type: `thing-created`,
  timestamp: uow.sync.lastModifiedDate,
  partitionKey: uow.thing.id,
  tags: {
    region: uow.record.awsRegion,
    identityPoolId: uow.data.identityPoolId,
    datasetName: uow.data.datasetName
  },
  thing: {
    identityId: uow.data.identityId,
    ...uow.thing,
  },
  raw: uow.sync
});

const publish = event => {
  const params = {
    StreamName: process.env.STREAM_NAME,
    PartitionKey: event.partitionKey,
    Data: Buffer.from(JSON.stringify(event)),
  };

  console.log('params: %j', params);

  const kinesis = new aws.Kinesis();
  return _(kinesis.putRecord(params).promise());
}

const print = value => console.log('%j', value);


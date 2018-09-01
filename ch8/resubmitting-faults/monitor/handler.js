const aws = require('aws-sdk');
const _ = require('highland');
const moment = require('moment');

module.exports.listener = (event, context, cb) => {
  console.log('event: %j', event);

  _(event.Records)
    .map(recordToUow)
    // .tap(print)
    .filter(forFault)
    .map(params)
    .flatMap(put)
    // .tap(print)
    .collect()
    .toCallback(cb);
};

const recordToUow = r => ({
  record: r,
  event: JSON.parse(Buffer.from(r.kinesis.data, 'base64'))
});

const forFault = uow => uow.event.type === 'fault';

const params = uow => {
  const now = moment(uow.event.timestamp).utc();
  const seqNum = uow.record.kinesis.sequenceNumber;
  const fault = uow.event;
  const type = fault.uow.event.type;

  const params = {
    Bucket: process.env.BUCKET_NAME,
    Key: `${now.format('YYYY')}/${now.format('MM')}/${now.format('DD')}/${now.format('HH')}/${seqNum}-${type}.json`,
    ContentType: 'application/json',
    Body: JSON.stringify(fault),
  };

  return {
    ...uow,
    params,
  };
};


const put = uow => {
  const s3 = new aws.S3({
    httpOptions: { timeout: 1000 },
    logger: console,
  });

  return _(
    s3.putObject(uow.params).promise()
      .then(response => ({
        ...uow,
        response,
      }))
  );
};

const print = v => console.log('%j', v);

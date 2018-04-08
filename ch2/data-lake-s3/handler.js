exports.transform = (event, context, callback) => {
  console.log('event: %j', event);
  console.log('context: %j', context);

  const output = event.records.map((record, i) => {
    // store all available data
    const uow = {
      event: JSON.parse((new Buffer(record.data, 'base64')).toString('utf8')),
      kinesisRecordMetadata: record.kinesisRecordMetadata,
      firehoseRecordMetadata: {
        deliveryStreamArn: event.deliveryStreamArn,
        region: event.region,
        invocationId: event.invocationId,
        recordId: record.recordId,
        approximateArrivalTimestamp: record.approximateArrivalTimestamp,
      }
    };

    console.log('uow: %j', uow);

    return {
      recordId: record.recordId,
      result: 'Ok',
      data: new Buffer(JSON.stringify(uow) + '\n', 'utf-8').toString('base64'),
    };
  });

  console.log('output: %j', output);
  callback(null, { records: output });
};

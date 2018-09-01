exports.transform = (event, context, callback) => {
  console.log('event: %j', event);

  const output = event.records.map((record, i) => {
    // store all available data
    const uow = {
      event: JSON.parse((Buffer.from(record.data, 'base64')).toString('utf8')),
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
      data: Buffer.from(JSON.stringify(uow), 'utf-8').toString('base64'),
    };
  });

  console.log('output: %j', output);
  callback(null, { records: output });
};

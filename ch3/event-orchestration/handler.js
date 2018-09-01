const aws = require('aws-sdk');
const _ = require('highland');
const uuid = require('uuid');

const transitions = [
  {
    filter: 'order-submitted',
    emit: (uow) => ({
      id: uuid.v1(),
      type: 'make-reservation',
      timestamp: Date.now(),
      partitionKey: uow.event.partitionKey,
      reservation: {
        sku: uow.event.order.sku,
        quantity: uow.event.order.quantity,
      },
      context: {
        order: uow.event.order,
        trigger: uow.event.id
      }
    })
  },
  {
    filter: 'reservation-confirmed',
    emit: (uow) => ({
      id: uuid.v1(),
      type: 'update-order-status',
      timestamp: Date.now(),
      partitionKey: uow.event.partitionKey,
      order: {
        status: 'reserved',
      },
      context: {
        reservation: uow.event.reservation,
        order: uow.event.context.order,
        trigger: uow.event.id
      }
    })
  },
];

module.exports.listener = (event, context, cb) => {
  // console.log('event: %j', event);

  _(event.Records)
    .map(recordToUow)
    // .tap(print)
    .filter(onTransitions)
    .flatMap(toEvents)
    .tap(print)
    .flatMap(publish)
    // .tap(print)
    .collect()
    .toCallback(cb);
};

const recordToUow = r => ({
  record: r,
  event: JSON.parse(Buffer.from(r.kinesis.data, 'base64')),
});

const onTransitions = uow => {
  // find matching transitions
  uow.transitions = transitions.filter(trans => trans.filter === uow.event.type);

  // proceed forward if there are any matches
  return uow.transitions.length > 0;
};

const toEvents = uow => {
  // create the event to emit for each matching transition
  return _(uow.transitions.map(t => t.emit(uow)));
};

const publish = event => {
  const params = {
    StreamName: process.env.STREAM_NAME,
    PartitionKey: event.partitionKey,
    Data: Buffer.from(JSON.stringify(event)),
  };

  // print(params);

  const kinesis = new aws.Kinesis();
  return _(kinesis.putRecord(params).promise());
}

const print = v => console.log('%j', v);

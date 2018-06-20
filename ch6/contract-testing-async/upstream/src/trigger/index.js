/* eslint import/no-extraneous-dependencies: ["error", {"devDependencies": true}] */
import * as aws from 'aws-sdk';

import Connector from '../connector/stream';

const _ = require('highland');

export class Handler {
  constructor(streamName) {
    this.stream = new Connector(streamName);
  }

  handle(event) {
    // console.log('e: %j', event);

    return _(event.Records)
      .map(toEvent)
      // .tap(print)
      .flatMap(publish(this.stream));
  }
}

export const handle = (event, context, cb) => {
  new Handler(process.env.STREAM_NAME)
    .handle(event)
    .collect()
    .toCallback(cb);
};

const toEvent = record => ({
  id: record.eventID,
  type: `thing-${EVENT_NAME_MAPPING[record.eventName]}`,
  timestamp: record.dynamodb.ApproximateCreationDateTime * 1000,
  partitionKey: record.dynamodb.Keys.id.S,
  tags: {
    region: record.awsRegion,
  },
  thing: {
    old: aws.DynamoDB.Converter.unmarshall(record.dynamodb.OldImage),
    new: aws.DynamoDB.Converter.unmarshall(record.dynamodb.NewImage),
  },
});

const EVENT_NAME_MAPPING = {
  INSERT: 'created',
  MODIFY: 'updated',
  REMOVE: 'deleted',
};

const publish = stream => event => _(stream.publish(event)
  .then(response => ({
    response,
    event,
  })));

// const print = value => console.log('%j', value);


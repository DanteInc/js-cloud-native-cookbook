import { Kinesis } from 'aws-sdk';

class Connector {
  constructor(streamName) {
    this.streamName = streamName;
    this.stream = new Kinesis();
  }

  publish(event) {
    const params = {
      StreamName: this.streamName,
      PartitionKey: event.partitionKey,
      Data: Buffer.from(JSON.stringify(event)),
    };

    return this.stream.putRecord(params).promise();
  }
}

export default Connector;

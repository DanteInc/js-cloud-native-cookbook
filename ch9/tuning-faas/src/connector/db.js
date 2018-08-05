import { DynamoDB } from 'aws-sdk';

// import Promise from 'bluebird';
// import moment from 'moment';

class Connector {
  constructor(tableName) {
    this.tableName = tableName;
    this.db = new DynamoDB.DocumentClient();
  }

  save(id, body) {
    const params = {
      TableName: this.tableName,
      Item: {
        id,
        ...body,
      },
    };

    return this.db.put(params).promise();
  }

  getById(id) {
    const params = {
      TableName: this.tableName,
      Key: {
        id,
      },
    };

    return this.db.get(params).promise()
      // .then(data => Promise.resolve(data.Item));
      .then(data => data.Item);
  }
}

export default Connector;

/* eslint import/no-extraneous-dependencies: ["error", {"devDependencies": true}] */
import { DynamoDB } from 'aws-sdk';

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
      .then(data => data.Item);
  }
}

export default Connector;

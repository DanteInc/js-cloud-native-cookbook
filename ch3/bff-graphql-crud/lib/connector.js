const aws = require('aws-sdk');
const { merge } = require('lodash');

class Connector {

  constructor(tableName) {
    this.tableName = tableName;
    this.db = new aws.DynamoDB.DocumentClient();
  }

  save(id, body) {
    const params = {
      TableName: this.tableName,
      Item: merge(
        {
          id,
        },
        body
      ),
    };

    return this.db.put(params).promise();
  }

  remove(id) {
    const params = {
      TableName: this.tableName,
      Key: {
        id,
      },
    };

    return this.db.delete(params).promise();
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

  queryByName(name, cursor, limit = 40) {
    const params = {
      TableName: this.tableName,
      FilterExpression: 'contains(#name, :name)',
      ExpressionAttributeNames: {
        '#name': 'name',
      },
      ExpressionAttributeValues: {
        ':name': name,
      },
      Limit: limit,
      ExclusiveStartKey: cursor ?
        fromBase64(cursor) :
        undefined,
      ReturnConsumedCapacity: 'TOTAL',
    };

    return this.db.scan(params).promise()
      .then(data => ({
        cursor: data.LastEvaluatedKey ?
          toBase64(data.LastEvaluatedKey) :
          undefined,
        items: data.Items,
      }));
  }
}

const toBase64 = value => Buffer.from(JSON.stringify(value)).toString('base64');
const fromBase64 = value => JSON.parse(Buffer.from(value, 'base64').toString('utf8'));

module.exports = Connector
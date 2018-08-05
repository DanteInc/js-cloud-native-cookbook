const uuid = require('uuid');
const { merge } = require('lodash');

class Thing {

  constructor(connector) {
    this.connector = connector;
  }

  getById(id) {
    return this.connector.getById(id);
  }

  queryByName(name, limit, cursor) {
    return this.connector.queryByName(name, cursor, limit)
      .then(data => ({
          items: data.items,
          cursor: data.cursor,
        }));
  }

  save(id, body) {
    id = id ? id : uuid.v4();
    return this.connector.save(id, body)
      .then(() => merge(
        {
          id,
        },
        body
      ));
  }

  delete(id) {
    return this.connector.remove(id)
      .then(() => ({ id }));
  }
}

module.exports = Thing
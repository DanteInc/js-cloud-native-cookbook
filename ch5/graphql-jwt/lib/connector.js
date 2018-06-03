const uuid = require('uuid');
const { UserError } = require('graphql-errors');
const things = require('./fixtures');

class Connector {

  getById(id) {
    return Promise.resolve(things.find(t => t.id === id));
  }

  queryByName(input) {
    return {
      items: Promise.resolve(things.filter(t => t.name.toLowerCase().search(input.name.toLowerCase()) > -1))
    };
  }

  save(id, thing) {
    const existingThing = things.find(t => t.id === thing.id);
    if (existingThing) {
      Object.assign(existingThing, thing);
    } else {
      things.push(thing);
    }

    return Promise.resolve(thing);
  }

  delete(id) {
    const existingThing = things.find(t => t.id === id);
    if (!existingThing) {
      return Promise.reject(new UserError(`Thing with id: ${thing.id} not found`));
    }

    const i = things.indexOf(existingThing);
    things.splice(i, 1);

    return Promise.resolve(existingThing);
  }
}

module.exports = Connector;
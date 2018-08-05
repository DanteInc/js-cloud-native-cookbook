import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

import { gql } from "apollo-boost";
import { Query, Mutation } from "react-apollo";

const SAVE_THING = gql`
  mutation saveThing($thing: ThingInput) {
    saveThing(input: $thing) {
      id
      name
    }
  }
`;

const GET_THINGS = gql`
  query {
    things(name: " ") {
      items {
        id
        name
      }
    }
  }
`;

const AddThing = () => {
  let input;

  return (
    <Mutation
      mutation={SAVE_THING}
      update={(cache, { data: { saveThing } }) => {
        const { things } = cache.readQuery({ query: GET_THINGS });
        cache.writeQuery({
          query: GET_THINGS,
          data: { things: { items: things.items.concat([saveThing]), __typename: 'ThingConnection' } }
        });
      }}
    >
      {(saveThing, { data }) => (
        <div>
          <form
            onSubmit={e => {
              e.preventDefault();
              saveThing({ variables: { thing: { name: input.value } } });
              input.value = '';
            }}
          >
            <input
              ref={node => {
                input = node;
              }}
            />
            <button type="submit">Add Thing</button>
          </form>
        </div>
      )}
    </Mutation>
  );
};

const Things = () => (
  <Query query={GET_THINGS}>
    {({ loading, error, data }) => {
      if (loading) return <p>Loading...</p>;
      if (error) return <p>Error :( {error}</p>;

      return data.things.items.slice()
        .sort((l, r) => r.name < l.name)
        .map(({ id, name }) => {
          let input;

          return (
            <Mutation mutation={SAVE_THING} key={id}>
              {saveThing => (
                <div>
                  <p>{name}</p>
                  <form
                    onSubmit={e => {
                      e.preventDefault();
                      saveThing({ variables: { thing: { id, name: input.value } } });
                      input.value = '';
                    }}
                  >
                    <input
                      ref={node => {
                        input = node;
                      }}
                    />
                    <button type="submit">Update {name}</button>
                  </form>
                </div>
              )}
            </Mutation>
          );
        });
    }}
  </Query>
);

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
        <AddThing />
        <Things />
      </div>
    );
  }
}

export default App;

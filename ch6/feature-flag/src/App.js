import React, { Component } from 'react';

import Amplify from 'aws-amplify';
import { withAuthenticator } from 'aws-amplify-react';

import { HasAuthorRole, HasBetaUserRole } from './Authorize';

import logo from './logo.svg';
import './App.css';

import configuration from './configuration';
Amplify.configure(configuration);

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

        <HasAuthorRole authData={this.props.authData}>This is the Author Feature!</HasAuthorRole>
        <HasBetaUserRole authData={this.props.authData}>This is a New Beta Feature...</HasBetaUserRole>

        <pre style={{'text-align':'justify'}}>{JSON.stringify(this.props.authData.signInUserSession, null, 2)}</pre>
      </div>
    );
  }
}

export default withAuthenticator(App, { includeGreetings: true });

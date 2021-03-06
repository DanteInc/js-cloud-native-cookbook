import React from 'react';
import { withAuth } from './authenticate';

import { HasAuthorRole, HasBetaUserRole } from './Authorize';

import logo from './logo.svg';
import './Home.css';

const Home = ({ auth }) => (
  <div className="App">
    <header className="App-header">
      <img src={logo} className="App-logo" alt="logo" />
      <h1 className="App-title">Welcome to React</h1>
    </header>
    <p className="App-intro">
      To get started, edit <code>src/App.js</code> and save to reload.
    </p>

    <button onClick={auth.logout}>Logout</button>

    <HasAuthorRole><p>This is the Author Feature!</p></HasAuthorRole>
    <HasBetaUserRole><p>This is a New Beta Feature...</p></HasBetaUserRole>

    <pre style={{ 'textAlign': 'justify' }}>{JSON.stringify(auth.getSession(), null, 2)}</pre>

  </div>
);

export default withAuth(Home);

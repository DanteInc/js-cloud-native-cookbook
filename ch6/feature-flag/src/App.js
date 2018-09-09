import React, { Component } from 'react';

import { BrowserRouter as Router, Route } from 'react-router-dom';
import { CognitoSecurity, ImplicitCallback, SecureRoute } from './authenticate';

import Home from './Home';

class App extends Component {
  render() {
    return (
      <Router>
        <CognitoSecurity
          // UPDATE ME
          domain='cncb-<stage>.auth.us-east-1.amazoncognito.com'
          clientId='a1b2c3d4e5f6g7h8i9j0k1l2m3'
      
          scope={['phone', 'email', 'profile', 'openid', 'aws.cognito.signin.user.admin']}
          
          redirectSignIn={`${window.location.origin}/implicit/callback`}
          redirectSignOut={window.location.origin}
        >
          <SecureRoute path='/' exact component={Home} />
          <Route path='/implicit/callback' component={ImplicitCallback} />
        </CognitoSecurity>
      </Router>
    );
  }
}

export default App;

import React from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { CognitoAuth } from 'amazon-cognito-auth-js';
import { CognitoSecurityContext } from './withAuth';

export const REFERRER_KEY = 'secureRouterReferrerPath';

class Auth {
  constructor(config) {
    this.cognito = new CognitoAuth({
      ClientId: config.clientId,
      AppWebDomain: config.domain,
      TokenScopesArray: config.scope,
      RedirectUriSignIn: config.redirectSignIn,
      RedirectUriSignOut: config.redirectSignOut,
    });

    this.cognito.useImplicitFlow();

    this.location = config.location;
  }

  _getWindowHref() {
    return window.location.href;
  }

  handleAuthentication = async () => {
    const curUrl = this._getWindowHref();
    
    return new Promise((resolve, reject) => {
      this.cognito.userhandler = {
        onSuccess: this._onAuthenticationSuccess(resolve),
        onFailure: this._onAuthenticationFailure(reject),
      };
      this.cognito.parseCognitoWebResponse(curUrl);
    });
  };

  _onAuthenticationSuccess = resolve => (response) => {
    resolve(response);
  };

  _onAuthenticationFailure = reject => (error) => {
    console.error('Unable to login: ', error);
    reject(error);
  };

  isAuthenticated = () => (
    this.cognito.isUserSignedIn()
  );

  getSession = () => (
    this.cognito.getCachedSession()
  );
 
  getIdToken = () => (
    this.cognito.getCachedSession().getIdToken()
  );

  getJwtToken = () => {
    const cognitoIdTokenObj = this.getIdToken();
    return cognitoIdTokenObj ? cognitoIdTokenObj.getJwtToken() : undefined;
  };

  login = (fromUri) => {
    localStorage.setItem(REFERRER_KEY, JSON.stringify(fromUri ? { pathname: fromUri } : this.location));
    this.cognito.getSession();
  };

  logout = () => {
    this.cognito.signOut();
  };
}

export default withRouter(class Security extends React.Component {
  static propTypes = {
    children: PropTypes.node,
    clientId: PropTypes.string.isRequired,
    redirectSignIn: PropTypes.string.isRequired,
    redirectSignOut: PropTypes.string.isRequired,
    scope: PropTypes.arrayOf(PropTypes.string).isRequired,
    domain: PropTypes.string.isRequired,
    location: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);
    this.auth = new Auth(props);
  }

  render() {
    const { children } = this.props;
    return (
      <CognitoSecurityContext.Provider value={this.auth}>
        {children}
      </CognitoSecurityContext.Provider>
    );
  }
});
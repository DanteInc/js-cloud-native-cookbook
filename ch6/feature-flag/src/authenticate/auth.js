import React from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { CognitoAuth } from 'amazon-cognito-auth-js';
import { CognitoSecurityContext } from './withAuth';

export const REFERRER_KEY = 'secureRouterReferrerPath';

class Auth {
  constructor(config) {
    this._cognitoAuth = new CognitoAuth({
      ClientId: config.clientId,
      AppWebDomain: config.domain,
      TokenScopesArray: config.scope,
      RedirectUriSignIn: config.redirectSignIn,
      RedirectUriSignOut: config.redirectSignOut,
    });

    this._cognitoAuth.useImplicitFlow();

    this.location = config.location;
  }

  _getWindowHref() {
    return window.location.href;
  }

  handleAuthentication = async () => {
    const curUrl = this._getWindowHref();
    
    return new Promise((resolve, reject) => {
      this._cognitoAuth.userhandler = {
        onSuccess: this._onAuthenticationSuccess(resolve),
        onFailure: this._onAuthenticationFailure(reject),
      };
      this._cognitoAuth.parseCognitoWebResponse(curUrl);
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
    this._cognitoAuth.isUserSignedIn()
  );

  getSession = () => (
    this._cognitoAuth.getCachedSession()
  );
 
  getIdToken = () => (
    this._cognitoAuth.getCachedSession().getIdToken()
  );

  getJwtToken = () => {
    const cognitoIdTokenObj = this.getIdToken();
    return cognitoIdTokenObj ? cognitoIdTokenObj.getJwtToken() : undefined;
  };

  login = (fromUri) => {
    localStorage.setItem(REFERRER_KEY, JSON.stringify(fromUri ? { pathname: fromUri } : this.location));
    this._cognitoAuth.getSession();
  };

  logout = () => {
    this._cognitoAuth.signOut();
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

import React from 'react';
import { Route } from 'react-router-dom';
import PropTypes from 'prop-types';
import withAuth from './withAuth';

class SecureRouteWrapper extends React.Component {
  static propTypes = {
    authenticated: PropTypes.bool.isRequired,
    login: PropTypes.func.isRequired,
    component: PropTypes.func,
    render: PropTypes.func,
    renderProps: PropTypes.object,
  };

  componentWillMount() {
    this.checkAuthentication();
  }

  componentDidUpdate() {
    this.checkAuthentication();
  }

  checkAuthentication = () => {
    const { authenticated, login } = this.props;
    if (!authenticated) {
      login();
    }
  }

  render() {
    const {
      authenticated,
      component,
      render,
      renderProps,
    } = this.props;

    if (!authenticated) {
      return null;
    }

    const C = component;
    return render ? render(renderProps) : <C {...renderProps} />;
  }
}

export default withAuth(class SecureRoute extends React.Component {
  static propTypes = {
    auth: PropTypes.object.isRequired,
    component: PropTypes.func,
    render: PropTypes.func,
    path: PropTypes.string,
  };

  constructor(props) {
    super(props);
    const { auth } = this.props;
    const isAuthenticated = auth.isAuthenticated();
    this.state = { authenticated: isAuthenticated };
  }

  componentDidUpdate() {
    this.checkAuthentication();
  }

  checkAuthentication = () => {
    const { auth } = this.props;
    const { authenticated } = this.state;
    const isAuthenticated = auth.isAuthenticated();
    if (isAuthenticated !== authenticated) {
      this.setState({ authenticated: isAuthenticated });
    }
  };

  createRenderWrapper = (renderProps) => {
    const { authenticated } = this.state;
    const { auth, component, render } = this.props;
    return (
      <SecureRouteWrapper
        authenticated={authenticated}
        login={auth.login}
        component={component}
        render={render}
        renderProps={renderProps}
      />
    );
  };

  render() {
    const { path } = this.props;
    return (
      path ? <Route path={path} render={this.createRenderWrapper} />
        : <Route render={this.createRenderWrapper} />
    );
  }
});

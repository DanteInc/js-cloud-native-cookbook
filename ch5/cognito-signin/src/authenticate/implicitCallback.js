import React from 'react';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom';
import withAuth from './withAuth';
import { REFERRER_KEY } from './auth';

export default withAuth(class ImplicitCallback extends React.Component {
  static propTypes = {
    auth: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {};
  }

  async componentDidMount() {
    const { auth } = this.props;
    try {
      await auth.handleAuthentication();
      this.setState({ authenticated: true });
    } catch (err) {
      this.setState({ authenticated: false, error: err.toString() });
    }
  }

  render() {
    const { authenticated, error } = this.state;
    if (!authenticated && !error) {
      return null;
    }

    const location = JSON.parse(localStorage.getItem(REFERRER_KEY) || '{ "pathname": "/" }');
    localStorage.removeItem(REFERRER_KEY);

    if (authenticated) {
      return <Redirect to={location} />;
    } else {
      return (
        <p>
          {error}
        </p>
      );
    }
  }
});

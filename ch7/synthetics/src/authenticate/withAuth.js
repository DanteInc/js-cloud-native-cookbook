import React from 'react';
import PropTypes from 'prop-types';

export const CognitoSecurityContext = React.createContext(null);

class Secure extends React.Component {
  static propTypes = {
    render: PropTypes.func.isRequired,
  };

  renderChild = (providerValue) => {
    const { render } = this.props;
    return render({ auth: providerValue });
  };

  render() {
    return (
      <CognitoSecurityContext.Consumer>
        {this.renderChild}
      </CognitoSecurityContext.Consumer>
    );
  }
}

export default (Component) => {
  const C = props => (
    <Secure render={secureComponentProps => (
      <Component {...props} {...secureComponentProps} />
    )}
    />
  );

  C.displayName = `withAuth(${Component.displayName || Component.name})`;

  return C;
};

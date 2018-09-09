import intersection from 'lodash/intersection';
import get from 'lodash/get';

import { withAuth } from './authenticate';

const getGroups = props => get(props, 'auth.cognito.signInUserSession.idToken.payload.cognito:groups', '');

export const check = (allowedRoles, props) => {
  // console.log('props: ', props);
  const groups = getGroups(props);
  const granted = groups && intersection(groups, allowedRoles).length > 0;
  console.log(`check: (${groups}) intersects (${allowedRoles}) = ${granted}`);
  return granted;
};

export const HasRole = allowedRoles =>
  props => check(allowedRoles, props) ?
    props.children :
    null;

export const HasAuthorRole = withAuth(HasRole(['Author']));
export const HasBetaUserRole = withAuth(HasRole(['BetaUser']));

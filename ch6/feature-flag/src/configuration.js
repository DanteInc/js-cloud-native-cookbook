export default {
  Auth: {
    region: 'us-east-1',
    // UPDATE ME
    userPoolId: 'us-east-1_abcd1234',
    userPoolWebClientId: 'a1b2c3d4e5f6g7h8i9j0k1l2m3',
  },
  oauth: {
    // UPDATE ME
    domain: 'cncb-<stage>.auth.us-east-1.amazoncognito.com',

    scope: ['phone', 'email', 'profile', 'openid', 'aws.cognito.signin.user.admin'],
    redirectSignIn: 'http://localhost:3000/signin',
    redirectSignOut: 'http://localhost:3000/signout',

    // 'code' for Authorization code grant, 
    // 'token' for Implicit grant
    responseType: 'token',

    options: {
      // Indicates if the data collection is enabled to support Cognito advanced security features. By default, this flag is set to true.
      AdvancedSecurityDataCollectionFlag: true
    },
  },
};

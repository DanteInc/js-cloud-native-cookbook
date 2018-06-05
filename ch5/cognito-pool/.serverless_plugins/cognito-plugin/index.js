'use strict';

const _ = require('lodash');

class Plugin {
  constructor(serverless, options) {
    this.hooks = {
      'after:deploy:deploy': deploy.bind(null, serverless, options),
      'before:remove:remove': removeDomain.bind(null, serverless, options),
    };
  }
}

module.exports = Plugin;

const deploy = (serverless) => {
  return Promise.resolve()
    .then(() =>
      getUserPoolId(serverless)
        .then(data => ({ userPoolId: data }))
    )
    .then(uow =>
      getUserPoolClientId(serverless)
        .then(data => ({ ...uow, userPoolClientId: data }))
    )
    .then(uow =>
      serverless.getProvider('aws').request('CognitoIdentityServiceProvider', 'describeUserPool', {
        UserPoolId: uow.userPoolId,
      })
        // .then(tap)
        .then(data => ({ ...uow, pool: { ...data.UserPool } }))
    )
    .then(uow => uow.pool.Domain ? uow :
      serverless.getProvider('aws').request('CognitoIdentityServiceProvider', 'createUserPoolDomain', {
        UserPoolId: uow.userPoolId,
        Domain: serverless.service.custom.pool.domain,
      })
        // .then(tap)
        .then(() => uow)
    )
    .then(uow =>
      serverless.getProvider('aws').request('CognitoIdentityServiceProvider', 'updateUserPoolClient', {
        UserPoolId: uow.userPoolId,
        ClientId: uow.userPoolClientId,
        AllowedOAuthFlows: serverless.service.custom.pool.allowedOAuthFlows,
        AllowedOAuthFlowsUserPoolClient: serverless.service.custom.pool.allowedOAuthFlowsUserPoolClient,
        AllowedOAuthScopes: serverless.service.custom.pool.allowedOAuthScopes,
        CallbackURLs: serverless.service.custom.pool.callbackURLs,
        DefaultRedirectURI: serverless.service.custom.pool.callbackURLs[0],
        LogoutURLs: serverless.service.custom.pool.logoutURLs,
        RefreshTokenValidity: serverless.service.custom.pool.refreshTokenValidity,
        SupportedIdentityProviders: serverless.service.custom.pool.supportedIdentityProviders,
      })
        // .then(tap)
        .then(() => uow)
    )
    // .then(uow =>
    //   serverless.getProvider('aws').request('CognitoIdentityServiceProvider', 'describeUserPool', {
    //     UserPoolId: uow.userPoolId,
    //   })
    //     .then(data => ({ ...uow, pool: { ...data.UserPool } }))
    // )
    // .then(uow =>
    //   serverless.getProvider('aws').request('CognitoIdentityServiceProvider', 'describeUserPoolClient', {
    //     UserPoolId: uow.userPoolId,
    //     ClientId: uow.userPoolClientId,
    //   })
    //     .then(data => ({ ...uow, client: { ...data.UserPoolClient } }))
    // )
    // .then(tap)
    ;
};

const removeDomain = (serverless) => {
  return Promise.resolve()
    .then(() =>
      getUserPoolId(serverless)
        .then(data => ({ userPoolId: data }))
    )
    .then(uow =>
      serverless.getProvider('aws').request('CognitoIdentityServiceProvider', 'describeUserPool', {
        UserPoolId: uow.userPoolId,
      })
        // .then(tap)
        .then(data => ({ ...uow, pool: { ...data.UserPool } }))
    )
    .then(uow => !uow.pool.Domain ? uow :
      serverless.getProvider('aws').request('CognitoIdentityServiceProvider', 'deleteUserPoolDomain', {
        UserPoolId: uow.userPoolId,
        Domain: uow.pool.Domain,
      })
        // .then(tap)
    );
};

const getUserPoolId = (serverless) => {
  const awsInfo = _.find(serverless.pluginManager.getPlugins(), (plugin) => {
    return plugin.constructor.name === 'AwsInfo';
  });

  if (!awsInfo) {
    return;
  }

  return Promise.resolve()
    .then(() => {
      if (!awsInfo.gatheredData) {
        return awsInfo.getStackInfo();
      }
    })
    .then(() => {
      const outputs = awsInfo.gatheredData.outputs;

      const userPoolId = _.find(outputs, (output) => {
        return output.OutputKey === 'userPoolId';
      });

      if (!userPoolId || !userPoolId.OutputValue) {
        return;
      }

      return userPoolId.OutputValue;
    });
};

const getUserPoolClientId = (serverless) => {
  const awsInfo = _.find(serverless.pluginManager.getPlugins(), (plugin) => {
    return plugin.constructor.name === 'AwsInfo';
  });

  if (!awsInfo) {
    return;
  }

  return Promise.resolve()
    .then(() => {
      if (!awsInfo.gatheredData) {
        return awsInfo.getStackInfo();
      }
    })
    .then(() => {
      const outputs = awsInfo.gatheredData.outputs;

      const userPoolClientId = _.find(outputs, (output) => {
        return output.OutputKey === 'userPoolClientId';
      });

      if (!userPoolClientId || !userPoolClientId.OutputValue) {
        return;
      }

      return userPoolClientId.OutputValue;
    });
};

const tap = (data) => {
  console.log('data: ', JSON.stringify(data, null, 2));
  return data;
}
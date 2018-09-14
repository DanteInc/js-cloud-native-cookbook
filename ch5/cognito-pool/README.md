# Creating a federated identity pool

## How to do it...
1. sls create --template-url https://github.com/danteinc/js-cloud-native-cookbook/tree/master/ch5/cognito-pool --path cncb-cognito-pool
2. cd cncb-cognito-pool
3. npm install
4. npm test
5. npm run dp:lcl -- -s $MY_STAGE
6. https://cncb-$MY_STAGE.auth.us-east-1.amazoncognito.com/login?redirect_uri=http://localhost:3000/signin&response_type=token&client_id=<client-id>
7. npm run rm:lcl -- -s $MY_STAGE

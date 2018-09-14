# Securing an API gateway with OAuth 2.0

## How to do it...
1. sls create --template-url https://github.com/danteinc/js-cloud-native-cookbook/tree/master/ch5/cognito-authorizer --path cncb-cognito-authorizer
2. cd cncb-cognito-authorizer
3. npm install
4. npm test
5. npm run dp:lcl -- -s $MY_STAGE
6. curl -v https://xyz.execute-api.us-east-1.amazonaws.com/$MY_STAGE/hello | json_pp
7. export CNCB_TOKEN=1234567890.1234567890
8. curl -v -H "Authorization: Bearer $CNCB_TOKEN"  https://xyz.execute-api.us-east-1.amazonaws.com/$MY_STAGE/hello | json_pp
9. sls logs -f hello -r us-east-1 -s $MY_STAGE
10. npm run rm:lcl -- -s $MY_STAGE

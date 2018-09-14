# Creating a regional health check

## How to do it...
1. sls create --template-url https://github.com/danteinc/js-cloud-native-cookbook/tree/master/ch10/regional-health-check --path cncb-regional-health-check
2. cd cncb-regional-health-check
3. npm install
4. npm test
5. npm run dp:lcl:e -- -s $MY_STAGE
6. npm run dp:lcl:w -- -s $MY_STAGE
7. curl -v https://xyz.execute-api.us-east-1.amazonaws.com/$MY_STAGE/check
8. curl -v https://zyx.execute-api.us-west-2.amazonaws.com/$MY_STAGE/check
9. npm run rm:lcl -- -s $MY_STAGE

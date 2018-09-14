# Creating a materialized view in Cognito

## How to do it...
1. sls create --template-url https://github.com/danteinc/js-cloud-native-cookbook/tree/master/ch2/materialized-view-cognito --path cncb-materialized-view-cognito
2. cd cncb-materialized-view-cognito
3. npm install
4. npm test -- -s $MY_STAGE
5. npm run dp:lcl -- -s $MY_STAGE
6. update index.html file with identityPoolId from previous output
7. open index.html and copy the identityId
8. publish an event from a separate terminal
   * cd ../cncb-event-stream
   * sls invoke -r us-east-1 -f publish -s $MY_STAGE -d '{"type":"thing-created","thing":{"new":{"name":"thing five","id":"55555555-5555-5555-5555-555555555555", "identityId":"<identityId from previous step>"}}}'
9. sls logs -f listener -r us-east-1 -s $MY_STAGE
10. press the Synchronize button in index.html
11. npm run rm:lcl -- -s $MY_STAGE

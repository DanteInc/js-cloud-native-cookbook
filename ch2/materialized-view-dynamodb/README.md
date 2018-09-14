# Creating a materialized view in DynamoDB

## How to do it...
1. sls create --template-url https://github.com/danteinc/js-cloud-native-cookbook/tree/master/ch2/materialized-view-dynamodb --path cncb-materialized-view-dynamodb
2. cd cncb-materialized-view-dynamodb
3. npm install
4. npm test -- -s $MY_STAGE
5. npm run dp:lcl -- -s $MY_STAGE
6. publish an event from a separate terminal
   * cd ../cncb-event-stream
   * sls invoke -r us-east-1 -f publish -s $MY_STAGE -d '{"type":"thing-created"}'
7. sls logs -f listener -r us-east-1 -s $MY_STAGE
8. sls invoke -r us-east-1 -f query -s $MY_STAGE -d <id from log>
9. npm run rm:lcl -- -s $MY_STAGE

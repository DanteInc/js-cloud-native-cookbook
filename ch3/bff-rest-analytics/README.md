# Implementing an analytics BFF

## How to do it...
1. sls create --template-url https://github.com/danteinc/js-cloud-native-cookbook/tree/master/ch3/bff-rest-analytics --path cncb-bff-rest-analytics
2. cd cncb-bff-rest-analytics
3. npm install
4. npm test -- -s $MY_STAGE
5. npm run dp:lcl -- -s $MY_STAGE
6. publish an event from a separate terminal
   * cd ../cncb-event-stream
   * sls invoke -r us-east-1 -f publish -s $MY_STAGE -d '{"type":"purple","partitionKey":"33333333-3333-1111-1111-111111111111"}'
   * sls invoke -r us-east-1 -f publish -s $MY_STAGE -d '{"type":"orange","partitionKey":"33333333-3333-1111-1111-111111111111"}'
   * sls invoke -r us-east-1 -f publish -s $MY_STAGE -d '{"type":"green","partitionKey":"33333333-3333-1111-2222-111111111111"}'
7. sls logs -f trigger -r us-east-1 -s $MY_STAGE
8. curl https://XYZ.execute-api.us-east-1.amazonaws.com/$MY_STAGE/query | json_pp
9. npm run rm:lcl -- -s $MY_STAGE

# Creating a micro event store

## How to do it...
1. sls create --template-url https://github.com/danteinc/js-cloud-native-cookbook/tree/master/ch2/micro-event-store --path cncb-micro-event-store
2. cd cncb-micro-event-store
3. npm install
4. npm test -- -s $MY_STAGE
5. npm run dp:lcl -- -s $MY_STAGE
6. publish an event from a separate terminal
   * cd ../cncb-event-stream
   * sls invoke -r us-east-1 -f publish -s $MY_STAGE -d '{"type":"thing-updated","partitionKey":"11111111-1111-1111-1111-111111111111","thing":{"new":{"name":"thing one","id":"11111111-1111-1111-1111-111111111111"}}}'
7. sls logs -f listener -r us-east-1 -s $MY_STAGE
8. sls logs -f trigger -r us-east-1 -s $MY_STAGE
9. npm run rm:lcl -- -s $MY_STAGE

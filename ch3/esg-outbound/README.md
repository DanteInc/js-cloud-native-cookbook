# Implementing an outbound external service gateway

## How to do it...
1. sls create --template-url https://github.com/danteinc/js-cloud-native-cookbook/tree/master/ch3/esg-outbound --path cncb-esg-outbound
2. cd cncb-esg-outbound
3. npm install
4. npm test -- -s $MY_STAGE
5. npm run dp:lcl -- -s $MY_STAGE
6. publish an event from a separate terminal
   * cd ../cncb-event-stream
   * sls invoke -r us-east-1 -f publish -s $MY_STAGE -d '{"type":"issue-created","issue":{"new":{"title":"issue one","description":"this is issue one.","id":"33333333-55555-1111-1111-111111111111"}}}'
7. sls logs -f listener -r us-east-1 -s $MY_STAGE
9. npm run rm:lcl -- -s $MY_STAGE

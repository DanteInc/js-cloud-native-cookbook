# Creating an event stream and publishing an event

## How to do it...
1. sls create --template-url https://github.com/danteinc/js-cloud-native-cookbook/tree/master/ch1/event-stream --path cncb-event-stream
2. cd cncb-event-stream
3. npm install
4. npm test
5. npm run dp:lcl -- -s $MY_STAGE
6. sls invoke -r us-east-1 -f publish -s $MY_STAGE -d '{"type":"thing-created"}'
7. sls logs -f publish -r us-east-1 -s $MY_STAGE
8. npm run rm:lcl -- -s $MY_STAGE



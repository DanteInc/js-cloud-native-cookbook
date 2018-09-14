# Applying the event-first variant of the event sourcing pattern

## How to do it...
1. sls create --template-url https://github.com/danteinc/js-cloud-native-cookbook/tree/master/ch2/event-first --path cncb-event-first
2. cd cncb-event-first
3. npm install
4. npm test -s $MY_STAGE
5. npm run dp:lcl -- -s $MY_STAGE
6. sls invoke -r us-east-1 -f submit -s $MY_STAGE -d '{"id":"11111111-1111-1111-1111-111111111111","name":"thing one","kind":"other"}'
7. sls logs -f submit -r us-east-1 -s $MY_STAGE
8. npm run rm:lcl -- -s $MY_STAGE



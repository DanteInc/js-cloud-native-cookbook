# Implementing an inbound external service gateway from SQS

This is a bonus recipe as Lambda SQS support was not available at the time the book outline was approved.

## How to do it...
1. sls create --template-url https://github.com/danteinc/js-cloud-native-cookbook/tree/master/ch3/esg-sqs-inbound --path cncb-esg-sqs-inbound
2. cd cncb-esg-sqs-inbound
3. npm install
4. npm test
5. npm run dp:lcl -- -s $MY_STAGE
6. sls invoke -r us-east-1 -f submit -s $MY_STAGE -d '{"id":"33333333-8888-0000-0000-111111111111","name":"thing eight"}'
7. sls logs -f submit -r us-east-1 -s $MY_STAGE
8. sls logs -f trigger -r us-east-1 -s $MY_STAGE
9. npm run rm:lcl -- -s $MY_STAGE

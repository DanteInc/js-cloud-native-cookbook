# Orchestrating collaboration between services

## How to do it...
1. sls create --template-url https://github.com/danteinc/js-cloud-native-cookbook/tree/master/ch3/event-orchestration --path cncb-event-orchestration
2. cd cncb-event-orchestration
3. npm install
4. npm test -- -s $MY_STAGE
5. npm run dp:lcl -- -s $MY_STAGE
6. publish an event from a separate terminal
   * cd ../cncb-event-stream
   * sls invoke -r us-east-1 -f publish -s $MY_STAGE -p ../cncb-event-orchestration/data/order.json
   * sls invoke -r us-east-1 -f publish -s $MY_STAGE -p ../cncb-event-orchestration/data/reservation.json
7. sls logs -f listener -r us-east-1 -s $MY_STAGE
8. npm run rm:lcl -- -s $MY_STAGE

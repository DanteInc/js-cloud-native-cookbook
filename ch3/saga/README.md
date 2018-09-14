# Implementing a saga

## How to do it...
1. sls create --template-url https://github.com/danteinc/js-cloud-native-cookbook/tree/master/ch3/saga --path cncb-saga
2. cd cncb-saga
3. npm install
4. npm test -- -s $MY_STAGE
5. npm run dp:lcl -- -s $MY_STAGE
6. sls invoke -r us-east-1 -f submit -s $MY_STAGE -p data/order.json
7. publish an event from a separate terminal
   * cd ../cncb-event-stream
   * sls invoke -r us-east-1 -f publish -s $MY_STAGE -p ../cncb-saga/data/reservation.json
8. sls invoke -r us-east-1 -f query -s $MY_STAGE -d 33333333-7777-1111-1111-111111111111
9. sls logs -f trigger -r us-east-1 -s $MY_STAGE
10. sls logs -f listener -r us-east-1 -s $MY_STAGE
11. npm run rm:lcl -- -s $MY_STAGE

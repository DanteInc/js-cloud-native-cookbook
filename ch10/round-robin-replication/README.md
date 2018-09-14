# Implementing round robin replication

## How to do it...
1. sls create --template-url https://github.com/danteinc/js-cloud-native-cookbook/tree/master/ch10/round-robin-replication --path cncb-round-robin-replication
2. cd cncb-round-robin-replication
3. npm install
4. npm test -- -s $MY_STAGE
5. $ npm run dp:lcl:w -- -s $MY_STAGE
6. $ npm run dp:lcl:e -- -s $MY_STAGE
7. publish an event from a separate terminal
   * cd ../cncb-event-stream
   * sls invoke -r us-east-1 -f publish -s $MY_STAGE -d '{"type":"thing-created","thing":{"new":{"name":"thing two","id":"77777777-5555-1111-1111-111111111111"}}}'
8. curl https://XYZ.execute-api.us-east-1.amazonaws.com/john/search?q=two | json_pp
9. $ sls logs -f replicator -r us-east-1 -s $MY_STAGE
10. $ sls logs -f replicator -r us-west-2 -s $MY_STAGE
11. Empty the buckets
12. $ npm run rm:lcl:w -- -s $MY_STAGE
13. $ npm run rm:lcl:e -- -s $MY_STAGE

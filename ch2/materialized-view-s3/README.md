# Creating a materialized view in S3

## How to do it...
1. sls create --template-url https://github.com/danteinc/js-cloud-native-cookbook/tree/master/ch2/materialized-view-s3 --path cncb-materialized-view-s3
2. cd cncb-materialized-view-s3
3. npm install
4. npm test -- -s $MY_STAGE
5. npm run dp:lcl -- -s $MY_STAGE
6. publish an event from a separate terminal
   * cd ../cncb-event-stream
   * sls invoke -r us-east-1 -f publish -s $MY_STAGE -d '{"type":"thing-created","thing":{"new":{"name":"thing three","id":"33333333-3333-3333-3333-333333333333"}}}'
7. sls logs -f listener -r us-east-1 -s $MY_STAGE
8. curl https://s3.amazonaws.com/cncb-materialized-view-s3-&lt;$MY_STAGE&gt;-bucket-&lt;suffix&gt;/things/33333333-3333-3333-3333-333333333333 | json_pp
9. manually empty bucket
10. npm run rm:lcl -- -s $MY_STAGE

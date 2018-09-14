# Implementing a search BFF

## How to do it...
1. sls create --template-url https://github.com/danteinc/js-cloud-native-cookbook/tree/master/ch3/bff-rest-search --path cncb-bff-rest-search
2. cd cncb-bff-rest-search
3. npm install
4. npm test -- -s $MY_STAGE
5. npm run dp:lcl -- -s $MY_STAGE
6. publish an event from a separate terminal
   * cd ../cncb-event-stream
   * sls invoke -r us-east-1 -f publish -s $MY_STAGE -d '{"type":"thing-created","thing":{"new":{"name":"thing three","id":"33333333-2222-0000-1111-111111111111"}}}'
7. sls logs -f listener -r us-east-1 -s $MY_STAGE
8. curl https://XYZ.execute-api.us-east-1.amazonaws.com/john/search?q=three | json_pp
8. curl https://s3.amazonaws.com/cncb-bff-rest-search-&lt;$MY_STAGE&gt;-bucket-&lt;suffix&gt;/things/33333333-2222-0000-1111-111111111111 | json_pp
9. manually empty bucket
10. npm run rm:lcl -- -s $MY_STAGE

# Executing code at the edge of the cloud

## How to do it...
1. sls create --template-url https://github.com/danteinc/js-cloud-native-cookbook/tree/master/ch4/cdn-lambda --path cncb-cdn-lambda
2. cd cncb-cdn-lambda
3. npm install
4. npm test
5. npm run dp:lcl -- -s $MY_STAGE
6. sls invoke -r us-east-1 -f load -s $MY_STAGE -d '{"id":"44444444-7777-1111-1111-000000000000","name":"thing one"}'
7. curl -v https://xyz.cloudfront.net/things/44444444-7777-1111-1111-000000000000 | json_pp
8. curl -v -H "Authorization: Bearer 1234567890" https://xyz.cloudfront.net/things/44444444-7777-1111-1111-000000000000 | json_pp
9. npm run rm:lcl -- -s $MY_STAGE

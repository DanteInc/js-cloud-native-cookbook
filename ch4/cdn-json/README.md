# Serving static JSON from a cdn

## How to do it...
1. sls create --template-url https://github.com/danteinc/js-cloud-native-cookbook/tree/master/ch4/cdn-json --path cncb-cdn-json
2. cd cncb-cdn-json
3. npm install
4. npm test
5. npm run dp:lcl -- -s $MY_STAGE
6. load data
    * sls invoke -r us-east-1 -f load -s $MY_STAGE -d '{"id":"44444444-5555-1111-1111-000000000000","name":"thing one"}'
    * sls invoke -r us-east-1 -f load -s $MY_STAGE -d '{"id":"44444444-5555-1111-2222-000000000000","name":"thing two"}'
    * sls invoke -r us-east-1 -f load -s $MY_STAGE -d '{"id":"44444444-5555-1111-3333-000000000000","name":"thing three"}'
7. curl https://xyz.cloudfront.net/search
8. curl -s -w "%{time_total}\n" -o /dev/null https://xyz.cloudfront.net/things/44444444-5555-1111-1111-000000000000
9. npm run rm:lcl -- -s $MY_STAGE

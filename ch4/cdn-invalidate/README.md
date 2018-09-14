# Triggering the invalidation of content in a cdn

## How to do it...
1. sls create --template-url https://github.com/danteinc/js-cloud-native-cookbook/tree/master/ch4/cdn-invalidate --path cncb-cdn-invalidate
2. cd cncb-cdn-invalidate
3. npm install
4. npm test
5. npm run dp:lcl -- -s $MY_STAGE
6. sls invoke -r us-east-1 -f load -s $MY_STAGE -d '{"id":"44444444-6666-1111-1111-000000000000","name":"thing one"}'
7. curl -v https://xyz.cloudfront.net/things/44444444-6666-1111-1111-000000000000 | json_pp
8. sls invoke -r us-east-1 -f load -s $MY_STAGE -d '{"id":"44444444-6666-1111-1111-000000000000","name":"thing one again"}'
9. curl -v https://xyz.cloudfront.net/things/44444444-6666-1111-1111-000000000000 | json_pp
10. npm run rm:lcl -- -s $MY_STAGE

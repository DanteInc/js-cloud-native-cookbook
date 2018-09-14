# Employing proper timeouts and retries

## How to do it...
1. sls create --template-url https://github.com/danteinc/js-cloud-native-cookbook/tree/master/ch8/timeout-retry --path cncb-timeout-retry
2. cd cncb-timeout-retry
3. npm install
4. npm test -- -s $MY_STAGE
5. npm run dp:lcl -- -s $MY_STAGE
6. sls invoke -f command -r us-east-1 -s $MY_STAGE -d '{"name":"thing one"}'
7. sls logs -f command -r us-east-1 -s $MY_STAGE
8. npm run rm:lcl -- -s $MY_STAGE

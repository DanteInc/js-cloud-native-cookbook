# Employing proper timeouts and retries

## How to do it...
1. sls create --template-url https://github.com/danteinc/js-cloud-native-cookbook/tree/master/ch8/timeout-retry --path cncb-timeout-retry
2. cd cncb-timeout-retry
3. npm install
4. npm test -- -s your-name
5. npm run dp:lcl -- -s your-name
6. sls invoke -f command -r us-east-1 -s your-name -d '{"name":"thing one"}'
7. sls logs -f command -r us-east-1 -s your-name
8. npm run rm:lcl -- -s your-name

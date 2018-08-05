# Batching requests

## How to do it...
1. sls create --template-url https://github.com/danteinc/js-cloud-native-cookbook/tree/master/ch9/frp-batching --path cncb-frp-batching
2. cd cncb-frp-batching
3. npm install
4. npm test -- -s your-name
5. npm run dp:lcl -- -s your-name
6. sls invoke -f simulate -r us-east-1 -s your-name
7. sls logs -f listener -r us-east-1 -s your-name --filter 'event count'
8. npm run rm:lcl -- -s your-name

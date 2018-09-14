# Replaying events

## How to do it...
1. sls create --template-url https://github.com/danteinc/js-cloud-native-cookbook/tree/master/ch2/replaying-events --path cncb-replaying-events
2. cd cncb-replaying-events
3. npm install
4. npm test
5. npm run dp:lcl -- -s $MY_STAGE
6. node index.js replay --bucket <your-data-lake> --prefix <your-stream-name> --function <your-function-name> --dry false
7. sls logs -f listener -r us-east-1 -s $MY_STAGE
8. npm run rm:lcl -- -s $MY_STAGE

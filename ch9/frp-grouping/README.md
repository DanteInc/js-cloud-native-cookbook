# Grouping events in stream processors

## How to do it...
1. sls create --template-url https://github.com/danteinc/js-cloud-native-cookbook/tree/master/ch9/frp-grouping --path cncb-frp-grouping
2. cd cncb-frp-grouping
3. npm install
4. npm test -- -s $MY_STAGE
5. npm run dp:lcl -- -s $MY_STAGE
6. sls invoke -f simulate -r us-east-1 -s $MY_STAGE
7. sls logs -f listener -r us-east-1 -s $MY_STAGE --filter 'event count'
8. npm run rm:lcl -- -s $MY_STAGE

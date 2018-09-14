# Implementing custom metrics

## How to do it...
1. sls create --template-url https://github.com/danteinc/js-cloud-native-cookbook/tree/master/ch7/custom-metrics --path cncb-custom-metrics
2. cd cncb-custom-metrics
3. npm install
4. npm test
5. npm run dp:lcl -- -s $MY_STAGE
6. curl -v https://xyz.execute-api.us-east-1.amazonaws.com/$MY_STAGE/hello | json_pp
7. sls logs -f hello -r us-east-1 -s $MY_STAGE
8. npm run rm:lcl -- -s $MY_STAGE

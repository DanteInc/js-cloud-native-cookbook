# Implementing an inbound external service gateway

## How to do it...
1. sls create --template-url https://github.com/danteinc/js-cloud-native-cookbook/tree/master/ch3/esg-inbound --path cncb-esg-inbound
2. cd cncb-esg-inbound
3. npm install
4. npm test
5. npm run dp:lcl -- -s $MY_STAGE
6. https://developer.github.com/webhooks/creating
7. sls logs -f webhook -r us-east-1 -s $MY_STAGE
8. npm run rm:lcl -- -s $MY_STAGE

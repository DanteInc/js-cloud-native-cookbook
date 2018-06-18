# Writing integration tests

## How to do it...
1. sls create --template-url https://github.com/danteinc/js-cloud-native-cookbook/tree/master/ch6/integration-testing --path cncb-integration-testing
2. cd cncb-integration-testing
3. npm install
4. npm test
5. DEBUG=replay REPLAY=record npm run test:int

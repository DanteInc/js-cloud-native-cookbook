# Writing contract tests for a synchronous api

## How to do it...
1. sls create --template-url https://github.com/danteinc/js-cloud-native-cookbook/tree/master/ch6/contract-testing-sync --path cncb-contract-testing-sync
2. cd cncb-contract-testing-sync
3. npm install
4. npm test
5. DEBUG=replay REPLAY=record npm run test:int

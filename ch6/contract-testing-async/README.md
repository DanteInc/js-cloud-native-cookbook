# Writing contract tests for a asynchronous api

## How to do it...
1. sls create --template-url https://github.com/danteinc/js-cloud-native-cookbook/tree/master/ch6/contract-testing-async --path cncb-contract-testing-async
2. cd cncb-contract-testing-async/upstream
3. npm install
4. npm test
5. DEBUG=replay REPLAY=record npm run test:int
6. repeat for cd cncb-contract-testing-async/downstream

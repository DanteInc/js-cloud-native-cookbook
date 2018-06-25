# Assembling transitive end-to-end tests

## How to do it...
1. Create projects:
```
$ sls create --template-url https://github.com/danteinc/js-cloud-native-cookbook/tree/master/ch6/transitive-testing/author-frontend --path cncb-transitive-testing-author-frontend

$ sls create --template-url https://github.com/danteinc/js-cloud-native-cookbook/tree/master/ch6/transitive-testing/author-bff --path cncb-transitive-testing-author-bff

$ sls create --template-url https://github.com/danteinc/js-cloud-native-cookbook/tree/master/ch6/transitive-testing/customer-bff --path cncb-transitive-testing-customer-bff

$ sls create --template-url https://github.com/danteinc/js-cloud-native-cookbook/tree/master/ch6/transitive-testing/customer-frontend --path cncb-transitive-testing-customer-frontend
```
2. Run tests:
```
$ cd ./author-frontend
$ npm install
$ DEBUG=replay npm run test:int

$ cd ../author-bff
$ npm install
$ npm test
$ DEBUG=replay npm run test:int

$ cd ../customer-bff
$ npm install
$ npm test
$ DEBUG=replay npm run test:int

$ cd ../customer-frontend
$ npm install
$ DEBUG=replay npm run test:int
```
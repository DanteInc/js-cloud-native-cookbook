# Leveraging session consistency

## How to do it...
1. Create projects:
```
$ sls create --template-url https://github.com/danteinc/js-cloud-native-cookbook/tree/master/ch9/session-consistency/spa --path cncb-session-consistency-spa

$ sls create --template-url https://github.com/danteinc/js-cloud-native-cookbook/tree/master/ch9/session-consistency/service --path cncb-session-consistency-service
```
2. Deploy service:
```
$ cd ./cncb-session-consistency-service
$ npm install
$ npm run dp:lcl -- -s $MY_STAGE
```
3. cd ../cncb-session-consistency-spa
4. npm install
5. npm start
6. browse http://localhost:3000
7. add and update things
8. Remove service:
```
$ cd ../cncb-session-consistency-service
$ npm run rm:lcl -- -s $MY_STAGE
```

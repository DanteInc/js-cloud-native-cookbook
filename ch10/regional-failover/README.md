# Triggering regional failover

## How to do it...
1. Create projects:
```
$ sls create --template-url https://github.com/danteinc/js-cloud-native-cookbook/tree/master/ch10/regional-failover/check --path cncb-regional-failover-check

$ sls create --template-url https://github.com/danteinc/js-cloud-native-cookbook/tree/master/ch10/regional-failover/service --path cncb-regional-failover-service
```
2. cd cncb-regional-failover-check
3. npm install
4. npm test
5. npm run dp:lcl:e -- -s $MY_STAGE
6. npm run dp:lcl:w -- -s $MY_STAGE
7. curl -v https://xyz.execute-api.us-east-1.amazonaws.com/$MY_STAGE/check
8. curl -v https://zyx.execute-api.us-west-2.amazonaws.com/$MY_STAGE/check
9. cd ../cncb-regional-failover-service
10. npm install
11. npm test
12. npm run dp:lcl:w -- -s $MY_STAGE
13. curl -v https://$MY_STAGE-cncb-regional-failover-service.example.com/$MY_STAGE/hello
14. npm run dp:lcl:e -- -s $MY_STAGE
15. curl -v https://cncb-regional-failover-service.example.com/hello
16. Remove stacks:
```
$ cd ../regional-failover-check
$ npm run rm:lcl:w -- -s $MY_STAGE
$ npm run rm:lcl:e -- -s $MY_STAGE
$ cd ../regional-failover-service
$ npm run rm:lcl:w -- -s $MY_STAGE
$ npm run rm:lcl:e -- -s $MY_STAGE
```



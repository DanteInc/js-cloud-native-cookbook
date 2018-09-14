# Deploying a service behind a cdn

## How to do it...
1. sls create --template-url https://github.com/danteinc/js-cloud-native-cookbook/tree/master/ch4/cdn-service --path cncb-cdn-service
2. cd cncb-cdn-service
3. npm install
4. npm test
5. npm run dp:lcl -- -s $MY_STAGE
6. curl -s -w "%{time_total}\n" -o /dev/null https://xyz.cloudfront.net/hello
7. sls logs -f hello -r us-east-1 -s $MY_STAGE
8. npm run rm:lcl -- -s $MY_STAGE

# Utilizing cache-control

## How to do it...
1. sls create --template-url https://github.com/danteinc/js-cloud-native-cookbook/tree/master/ch9/cache-control --path cncb-cache-control
2. cd cncb-cache-control
3. npm install
4. npm test
5. npm run dp:lcl -- -s your-name
6. curl -s -w "%{time_total}\n" -o /dev/null https://xyz.cloudfront.net/get
7. sls logs -f get -r us-east-1 -s your-name
8. npm run rm:lcl -- -s your-name

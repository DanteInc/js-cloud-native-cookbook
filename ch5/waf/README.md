# Configuring a web application firewall

## How to do it...
1. sls create --template-url https://github.com/danteinc/js-cloud-native-cookbook/tree/master/ch5/waf --path cncb-waf
2. cd cncb-waf
3. npm install
4. npm test -- -s $MY_STAGE
5. npm run dp:lcl -- -s $MY_STAGE
6. Access cdn endpoint
7. npm run rm:lcl -- -s $MY_STAGE

# Creating an SSL certificate for encryption in transit

## How to do it...
1. sls create --template-url https://github.com/danteinc/js-cloud-native-cookbook/tree/master/ch5/ssl-cert --path cncb-ssl-cert
2. cd cncb-ssl-cert
3. npm install
4. npm test -- -s $MY_STAGE
5. npm run dp:lcl -- -s $MY_STAGE
6. Access cdn endpoint
7. npm run rm:lcl -- -s $MY_STAGE

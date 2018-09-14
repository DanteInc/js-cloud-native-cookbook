# Creating a CI/CD pipeline

## How to do it...
1. sls create --template-url https://github.com/danteinc/js-cloud-native-cookbook/tree/master/ch6/pipeline --path cncb-pipeline
2. cd cncb-pipeline
3. npm install
4. npm test
6. npm run dp:lcl -- -s $MY_STAGE
7. npm run rm:lcl -- -s $MY_STAGE
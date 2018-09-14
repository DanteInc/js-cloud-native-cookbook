# Creating a stack

## How to do it...
1. sls create --template-url https://github.com/danteinc/js-cloud-native-cookbook/tree/master/ch1/create-stack --path cncb-create-stack
2. cd cncb-create-stack
3. npm install
4. npm test
6. npm run dp:lcl -- -s $MY_STAGE
7. npm run rm:lcl -- -s $MY_STAGE
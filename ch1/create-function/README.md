# Creating a function

## How to do it...
1. sls create --template-url https://github.com/danteinc/js-cloud-native-cookbook/tree/master/ch1/create-function --path cncb-create-function
2. cd cncb-create-function
3. npm install
4. npm test
5. npm run dp:lcl -- -s $MY_STAGE
6. sls invoke -r us-east-1 -f hello -s $MY_STAGE -d '{"hello":"world"}'
7. sls logs -f hello -r us-east-1 -s $MY_STAGE
8. npm run rm:lcl -- -s $MY_STAGE
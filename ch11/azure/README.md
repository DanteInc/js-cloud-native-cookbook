# Creating a service in Azure

## How to do it...
1. sls create --template-url https://github.com/danteinc/js-cloud-native-cookbook/tree/master/ch11/azure --path cncb-azure
2. cd cncb-azure
3. npm install
4. npm test
5. npm run dp:lcl -- -s $MY_STAGE
6. sls logs -f hello -r 'East US' -s $MY_STAGE
7. curl -v https://cncb-azure-$MY_STAGE.azurewebsites.net/api/hello
8. npm run rm:lcl -- --stage $MY_STAGE

# Creating a service in Azure

## How to do it...
1. sls create --template-url https://github.com/danteinc/js-cloud-native-cookbook/tree/master/ch11/azure --path cncb-azure
2. cd cncb-azure
3. npm install
4. npm test
5. npm run dp:lcl -- -s your-name
6. sls logs -f hello -r 'East US' -s your-name
7. curl -v https://cncb-azure-your-name.azurewebsites.net/api/hello
8. npm run rm:lcl -- --stage your-name

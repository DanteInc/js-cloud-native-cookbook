# Creating a service in GCP

## How to do it...
1. sls create --template-url https://github.com/danteinc/js-cloud-native-cookbook/tree/master/ch11/gcp --path cncb-gcp
2. cd cncb-gcp
3. npm install
4. npm test
5. npm run dp:lcl -- -s $MY_STAGE
6. curl -v https://us-east1-cncb-project.cloudfunctions.net/hello
7. sls logs -f hello -r us-east1 -s $MY_STAGE
8. npm run rm:lcl -- -s $MY_STAGE

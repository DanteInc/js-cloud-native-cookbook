# Using envelope encryption

## How to do it...
1. sls create --template-url https://github.com/danteinc/js-cloud-native-cookbook/tree/master/ch5/create-envelope-encryption --path cncb-envelope-encryption
2. cd cncb-envelope-encryption
3. npm install
4. npm test
5. npm run dp:lcl -- -s $MY_STAGE
6. curl -v -X POST -d '{ "id": "55555555-8888-1111-1111-000000000000", "name": "thing1", "description": "This is thing one of two." }' https://XYZ.execute-api.us-east-1.amazonaws.com/john/things
7. curl -v https://XYZ.execute-api.us-east-1.amazonaws.com/john/things/55555555-8888-1111-1111-000000000000 | json_pp
8. sls logs -f save -r us-east-1 -s $MY_STAGE
9. sls logs -f get -r us-east-1 -s $MY_STAGE
10. npm run rm:lcl -- -s $MY_STAGE

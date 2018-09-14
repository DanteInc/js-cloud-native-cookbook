# Implementing a JWT filter

## How to do it...
1. sls create --template-url https://github.com/danteinc/js-cloud-native-cookbook/tree/master/ch5/create-jwt-filter --path cncb-jwt-filter
2. cd cncb-jwt-filter
3. npm install
4. npm test
5. npm run dp:lcl -- -s $MY_STAGE
6. export CNCB_TOKEN=1234567890.1234567890
7. curl -v -X POST -H "Authorization: Bearer $CNCB_TOKEN" -H 'Content-Type: application/json' -d '{ "id": "55555555-7777-1111-1111-000000000000", "name": "thing1", "description": "This is thing one of two." }' https://XYZ.execute-api.us-east-1.amazonaws.com/$MY_STAGE/things
8. curl -v -H "Authorization: Bearer $CNCB_TOKEN" <Location response header from POST> | json_pp
9. same as 8 but tweak sub path parameter to cause 401
10. sls logs -f save -r us-east-1 -s $MY_STAGE
11. sls logs -f get -r us-east-1 -s $MY_STAGE
12. npm run rm:lcl -- -s $MY_STAGE

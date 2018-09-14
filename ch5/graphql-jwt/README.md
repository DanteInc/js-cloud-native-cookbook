# Authorizing a GraphQL based service

## How to do it...
1. sls create --template-url https://github.com/danteinc/js-cloud-native-cookbook/tree/master/ch5/graphql-jwt --path cncb-graphql-jwt
2. cd cncb-graphql-jwt
3. npm install
4. npm test -- -s $MY_STAGE
5. npm run dp:lcl -- -s $MY_STAGE
6. export CNCB_TOKEN=1234567890.1234567890
7. curl commands
```
curl -v -X POST -H "Authorization: Bearer $CNCB_TOKEN" -H 'Content-Type: application/json' -d '{"query":"mutation { saveThing(input: { id: \"55555555-6666-1111-1111-000000000000\", name: \"thing1\", description: \"This is thing one of two.\" }) { id } }"}' https://XYZ.execute-api.us-east-1.amazonaws.com/john/graphql | json_pp

curl -v -X POST -H "Authorization: Bearer $CNCB_TOKEN" -H 'Content-Type: application/json' -d '{"query":"query { thing(id: \"55555555-6666-1111-1111-000000000000\") { id name description }}"}' https://XYZ.execute-api.us-east-1.amazonaws.com/john/graphql | json_pp

curl -v -X POST -H "Authorization: Bearer $CNCB_TOKEN" -H 'Content-Type: application/json' -d '{"query":"mutation { deleteThing( id: \"55555555-6666-1111-1111-000000000000\" ) { id } }"}' https://XYZ.execute-api.us-east-1.amazonaws.com/john/graphql | json_pp

```
8. npm run rm:lcl -- -s $MY_STAGE

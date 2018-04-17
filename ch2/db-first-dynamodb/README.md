# Applying the database-first variant of the event sourcing pattern with DynamoDB

## How to do it...
1. sls create --template-url https://github.com/danteinc/js-cloud-native-cookbook/tree/master/ch2/db-first-dynamodb --path cncb-db-first-dynamodb
2. cd cncb-db-first-dynamodb
3. npm install
4. npm test -- -s your-name
5. npm run dp:lcl -- -s your-name
6. sls invoke -r us-east-1 -f command -s your-name -d '{"name":"thing one"}'
7. sls logs -f command -r us-east-1 -s your-name
8. sls logs -f trigger -r us-east-1 -s your-name
9. npm run rm:lcl -- -s your-name

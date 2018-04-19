# Creating a materialized view in DynamoDB

## How to do it...
1. sls create --template-url https://github.com/danteinc/js-cloud-native-cookbook/tree/master/ch2/materialized-view-es --path cncb-materialized-view-es
2. cd cncb-materialized-view-es
3. npm install
4. npm test -- -s your-name
5. npm run dp:lcl -- -s your-name
6. publish an event from a separate terminal
   * cd ../cncb-event-stream
   * sls invoke -r us-east-1 -f publish -s your-name -d '{"type":"thing-created","thing":{"new":{"name":"thing four","id":"44444444-4444-4444-4444-444444444444"}}}'
7. sls logs -f listener -r us-east-1 -s your-name
8. sls invoke -r us-east-1 -f search -s your-name -d 44444444-4444-4444-4444-444444444444
9. npm run rm:lcl -- -s your-name

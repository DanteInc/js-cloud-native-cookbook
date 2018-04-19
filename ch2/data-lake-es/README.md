# Indexing the data lake

## How to do it...
1. sls create --template-url https://github.com/danteinc/js-cloud-native-cookbook/tree/master/ch2/data-lake-es --path cncb-data-lake-es
2. cd cncb-data-lake-es
3. npm install
4. npm test -- -s your-name
5. npm run dp:lcl -- -s your-name
6. publish an event from a separate terminal
   * cd ../cncb-event-stream
   * sls invoke -r us-east-1 -f publish -s your-name -d '{"type":"thing-created"}'
7. npm run rm:lcl -- -s your-name

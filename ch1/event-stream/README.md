# Creating an event stream and publishing an event

## How to do it...
1. sls create --template-url https://github.com/danteinc/js-cloud-native-cookbook/tree/master/ch1/create-stream --path cncb-create-stream
2. cd cncb-create-stream
3. npm install
4. npm test
5. npm run dp:lcl -- -s your-name
6. sls invoke -r us-east-1 -f publish -s your-name -d '{"type":"thing-created"}'
7. npm run rm:lcl -- -s your-name



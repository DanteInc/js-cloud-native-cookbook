# Applying the event-first variant of the event sourcing pattern

## How to do it...
1. sls create --template-url https://github.com/danteinc/js-cloud-native-cookbook/tree/master/ch2/event-first --path cncb-event-first
2. cd cncb-event-first
3. npm install
4. npm test -s your-name
5. npm run dp:lcl -- -s your-name
6. sls invoke -r us-east-1 -f command -s your-name -d '{"id":1,"name":"thing one","kind":"other"}'
7. npm run rm:lcl -- -s your-name



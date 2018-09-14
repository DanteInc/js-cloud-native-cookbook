# Resubmitting fault events

## How to do it...
1. Create projects:
```
$ sls create --template-url https://github.com/danteinc/js-cloud-native-cookbook/tree/master/ch8/resubmitting-faults/monitor --path cncb-resubmitting-faults-monitor

$ sls create --template-url https://github.com/danteinc/js-cloud-native-cookbook/tree/master/ch8/resubmitting-faults/cli --path cncb-resubmitting-faults-cli

$ sls create --template-url https://github.com/danteinc/js-cloud-native-cookbook/tree/master/ch8/resubmitting-faults/simulator --path cncb-resubmitting-faults-simulator
```
2. Deploy stacks and run simulator
```
$ cd ./monitor
$ npm install
$ npm run dp:lcl -- -s $MY_STAGE

$ cd ../simulator
$ npm install
$ npm run dp:lcl -- -s $MY_STAGE

$ sls invoke -f simulate -r us-east-1 -s $MY_STAGE
```
3. npm install
4. node index.js replay --bucket <your-data-lake> --prefix <your-stream-name> --function <your-function-name> --dry false
5. npm run rm:lcl -- -s $MY_STAGE

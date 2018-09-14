# Replicating the data lake for disaster recovery

## How to do it...
1. sls create --template-url https://github.com/danteinc/js-cloud-native-cookbook/tree/master/ch5/dr --path cncb-dr
2. cd cncb-dr/recovery-account
3. npm install
4. npm test -- -s $MY_STAGE
5. npm run dp:lcl -- -s $MY_STAGE
6. cd ../src1-account
7. npm install
8. npm test -- -s $MY_STAGE
9. npm run dp:lcl -- -s $MY_STAGE
10. sls invoke -r us-east-1 -f load -s $MY_STAGE
11. review source and target buckets
12. npm run rm:lcl -- -s $MY_STAGE
13. cd ../recovery-account
14. npm run rm:lcl -- -s $MY_STAGE

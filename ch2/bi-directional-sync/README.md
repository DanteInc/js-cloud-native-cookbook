# Implementing bi-directional synchronization

## How to do it...
1. sls create --template-url https://github.com/danteinc/js-cloud-native-cookbook/tree/master/ch2/bi-directional-sync --path cncb-1-bi-directional-sync
2. cd cncb-1-bi-directional-sync
3. npm install
4. npm test -- -s $MY_STAGE
5. npm run dp:lcl -- -s $MY_STAGE
6. sls invoke -r us-east-1 -f command -s $MY_STAGE -d '{"id":"77777777-7777-7777-7777-777777777777","name":"thing seven"}'
7. sls logs -f command -r us-east-1 -s $MY_STAGE
8. sls logs -f trigger -r us-east-1 -s $MY_STAGE
9. cd ../cncb-2-bi-directional-sync
10. sls logs -f listener -r us-east-1 -s $MY_STAGE
11. sls logs -f trigger -r us-east-1 -s $MY_STAGE
12. sls invoke -r us-east-1 -f query -s $MY_STAGE -d 77777777-7777-7777-7777-777777777777
13. reverse and repeat starting step 6 in the 2nd project
14. npm run rm:lcl -- -s $MY_STAGE

# Securing your cloud account

## How to do it...
1. sls create --template-url https://github.com/danteinc/js-cloud-native-cookbook/tree/master/ch5/account-as-code --path cncb-account-as-code
2. cd cncb-account-as-code
3. npm install
4. npm test -- -s $MY_STAGE
5. npm run dp:lcl -- -s $MY_STAGE

## References
* [IAM Best Practices](http://docs.aws.amazon.com/IAM/latest/UserGuide/best-practices.html)
  
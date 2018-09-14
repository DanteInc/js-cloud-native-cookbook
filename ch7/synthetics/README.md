# Creating synthetic transaction tests

## How to do it...
1. sls create --template-url https://github.com/danteinc/js-cloud-native-cookbook/tree/master/ch5/cognito-signin --path cncb-cognito-signin
2. cd cncb-cognito-signin
3. npm install
4. Update src/configuration.js
4. npm start
5. npm test
6. npm run build
7. npm run dp:lcl -- -s $MY_STAGE
8. browse http://cncb-cognito-signin-$MY_STAGE-websitebucket-xxxx.s3-website-us-east-1.amazonaws.com
9. Click Sign Up and complete form
10. Click Sign Out
11. Click Sign In and complete form
12. npm run rm:lcl -- -s $MY_STAGE

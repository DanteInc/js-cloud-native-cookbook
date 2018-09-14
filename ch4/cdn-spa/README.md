# Serving a single page app from the cdn

## How to do it...
1. sls create --template-url https://github.com/danteinc/js-cloud-native-cookbook/tree/master/ch4/cdn-spa --path cncb-cdn-spa
2. cd cncb-cdn-spa
3. npm install
4. npm test
5. npm run build
6. npm run dp:lcl -- -s $MY_STAGE
7. browse https://<see WebsiteDistributionURL output>.cloudfront.net
8. npm run rm:lcl -- -s $MY_STAGE
